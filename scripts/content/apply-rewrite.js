// Дахин бичсэн бичвэрийг Contentful-д DRAFT болгон хадгална (НИЙТЛЭХГҮЙ). Live хувилбар хэвээр үлдэнэ.
//   node scripts/content/apply-rewrite.js <rewrites/xxx.md> [--dry]
// Файлын хэлбэр (data/rewrites/<entryId>.md):
//   ---
//   id: tic-c13-110
//   field: body                # rich text талбар (province: description2, heritagePlace: description, бусад: body)
//   seoTitle: ...              # ≤60 тэмдэгт
//   seoDescription: ...        # ≤155 тэмдэгт
//   keyword: ...               # гол хайлтын үг (тайланд)
//   alt.<assetId>: ...         # зургийн alt (asset-ийн title-ийг draft болгож шинэчилнэ)
//   ---
//   {{IMG:<assetId>}}          # бичвэр доторх зураг (эх entry-д байсан asset)
//   ## H2 гарчиг / ### H3 / - жагсаалт / хоосон мөрөөр тусгаарласан догол мөр
//   **тод** ба [текст](/дотоод/хаяг) холбоос
// Хамгаалалт: entry-д нийтлээгүй өөрчлөлт (changed) байвал алгасна; эх entry-г backups/rewrite-originals/-д хадгална;
// зөвхөн тухайн rich text, seoTitle, seoDescription талбарыг солино; publish хийхгүй.
const fs = require('fs');
const path = require('path');
const { cma, ROOT, LOCALE, callCount } = require('../tic/_cma');

const file = process.argv[2];
const DRY = process.argv.includes('--dry');
const BACKUP = path.join(ROOT, 'backups', 'rewrite-originals');
const SITE_RE = /^https?:\/\/(www\.)?travelhubmongolia\.com/;

function parse(md) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(md.replace(/^﻿/, ''));
  if (!m) throw new Error('frontmatter алга');
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const x = /^([\w.\-]+):\s*(.*)$/.exec(line);
    if (x) meta[x[1]] = x[2].trim();
  }
  return { meta, body: m[2] };
}

// **тод**, [текст](url) → rich text inline
function inline(text) {
  const out = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let x;
  const t = (value, marks = []) => value && out.push({ nodeType: 'text', value, marks, data: {} });
  while ((x = re.exec(text))) {
    t(text.slice(last, x.index));
    if (x[1] !== undefined) {
      // Тод бичвэр доторх холбоос: дотрыг нь задлаад текст бүрт bold тэмдэг нэмнэ
      for (const n of inline(x[1])) {
        if (n.nodeType === 'text') { if (n.value) out.push({ ...n, marks: [{ type: 'bold' }] }); }
        else out.push({ ...n, content: n.content.map((c) => ({ ...c, marks: [{ type: 'bold' }] })) });
      }
    }
    else out.push({ nodeType: 'hyperlink', data: { uri: x[3] }, content: [{ nodeType: 'text', value: x[2], marks: [], data: {} }] });
    last = re.lastIndex;
  }
  t(text.slice(last));
  if (!out.length || out[out.length - 1].nodeType !== 'text') out.push({ nodeType: 'text', value: '', marks: [], data: {} });
  if (out[0].nodeType !== 'text') out.unshift({ nodeType: 'text', value: '', marks: [], data: {} });
  return out;
}
const para = (s) => ({ nodeType: 'paragraph', data: {}, content: inline(s) });

function toRich(body) {
  const content = [];
  const blocks = body.replace(/\r/g, '').split(/\n\s*\n/);
  for (const raw of blocks) {
    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) continue;
    let list = null;
    for (const l of lines) {
      let x;
      if ((x = /^\{\{IMG:([\w-]+)\}\}$/.exec(l))) { list = null; content.push({ nodeType: 'embedded-asset-block', data: { target: { sys: { id: x[1], type: 'Link', linkType: 'Asset' } } }, content: [] }); }
      else if ((x = /^(#{2,3})\s+(.*)$/.exec(l))) { list = null; content.push({ nodeType: `heading-${x[1].length}`, data: {}, content: inline(x[2]) }); }
      else if ((x = /^-\s+(.*)$/.exec(l))) {
        if (!list) { list = { nodeType: 'unordered-list', data: {}, content: [] }; content.push(list); }
        list.content.push({ nodeType: 'list-item', data: {}, content: [para(x[1])] });
      } else {
        list = null;
        const prev = content[content.length - 1];
        // Нэг блок доторх дараалсан мөрүүд нэг догол мөр
        if (prev && prev.nodeType === 'paragraph' && prev._open) prev.content.push(...inline(' ' + l));
        else { const p = para(l); Object.defineProperty(p, '_open', { value: true, enumerable: false }); content.push(p); }
      }
    }
  }
  return { nodeType: 'document', data: {}, content };
}

const plainWords = (n) => JSON.stringify(n).match(/"value":"((?:[^"\\]|\\.)*)"/g)?.map((s) => JSON.parse(s.slice(8))).join(' ').split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length || 0;
const assetIds = (n) => [...JSON.stringify(n).matchAll(/"embedded-asset-block","data":\{"target":\{"sys":\{"id":"([^"]+)"/g)].map((x) => x[1]);
const uris = (n) => [...JSON.stringify(n).matchAll(/"uri":"([^"]+)"/g)].map((x) => x[1]);

(async () => {
  const { meta, body } = parse(fs.readFileSync(file, 'utf8'));
  const { id, field } = meta;
  if (!id || !field) throw new Error('id, field шаардлагатай');
  if ([...(meta.seoTitle || '')].length > 60) throw new Error(`seoTitle ${[...meta.seoTitle].length} > 60`);
  if ([...(meta.seoDescription || '')].length > 155) throw new Error(`seoDescription ${[...meta.seoDescription].length} > 155`);
  if (/Эх сурвалж\s*:/i.test(body)) throw new Error('«Эх сурвалж:» мөр орсон байна');
  const rich = toRich(body);

  const e = await cma('GET', `/entries/${id}`);
  if (!e) throw new Error(`entry олдсонгүй: ${id}`);
  const st = !e.sys.publishedVersion ? 'draft' : e.sys.version > e.sys.publishedVersion + 1 ? 'changed' : 'published';
  const oldDoc = e.fields[field]?.[LOCALE];
  if (!oldDoc) throw new Error(`талбар хоосон: ${field}`);
  // Эх бичвэрт байсан зураг шинэд бүгд байх ёстой
  const missing = assetIds(oldDoc).filter((a) => !assetIds(rich).includes(a));
  if (missing.length) throw new Error(`эх бичвэрийн зураг дутуу: ${missing.join(', ')}`);
  const internal = uris(rich).filter((u) => u.startsWith('/') || SITE_RE.test(u));
  const report = { id, field, contentful: st, oldWords: plainWords(oldDoc), newWords: plainWords(rich), links: internal, seoTitle: meta.seoTitle, seoDescription: meta.seoDescription };
  // baselineWords: одоогийн талбар буруу (жишээ нь өөр entry-ийн хуулбар) үед анхны эх бичвэрийн үгийн тоо
  if (meta.baselineWords) report.oldWords = Number(meta.baselineWords);
  if (report.newWords < report.oldWords * 0.97) throw new Error(`шинэ бичвэр богино: ${report.newWords} < ${report.oldWords}`);
  if (st === 'changed' && !fs.existsSync(path.join(BACKUP, `${id}.json`))) throw new Error('нийтлээгүй өөрчлөлттэй entry: алгасав');

  if (DRY) { console.log(JSON.stringify({ dry: true, ...report }, null, 1)); return; }
  fs.mkdirSync(BACKUP, { recursive: true });
  const bak = path.join(BACKUP, `${id}.json`);
  if (!fs.existsSync(bak)) fs.writeFileSync(bak, JSON.stringify(e)); // зөвхөн анхны (дахин бичихээс өмнөх) хувилбар

  e.fields[field] = { ...e.fields[field], [LOCALE]: rich };
  if (meta.seoTitle) e.fields.seoTitle = { ...(e.fields.seoTitle || {}), [LOCALE]: meta.seoTitle };
  if (meta.seoDescription) e.fields.seoDescription = { ...(e.fields.seoDescription || {}), [LOCALE]: meta.seoDescription };
  const saved = await cma('PUT', `/entries/${id}`, { body: { fields: e.fields }, version: e.sys.version });

  // Зургийн alt = asset title (draft)
  const alts = [];
  for (const [k, v] of Object.entries(meta)) {
    if (!k.startsWith('alt.') || !v) continue;
    const aid = k.slice(4);
    const a = await cma('GET', `/assets/${aid}`);
    if (!a) continue;
    const abak = path.join(BACKUP, `asset-${aid}.json`);
    if (!fs.existsSync(abak)) fs.writeFileSync(abak, JSON.stringify(a));
    if (a.fields.title?.[LOCALE] === v) continue;
    a.fields.title = { ...(a.fields.title || {}), [LOCALE]: v };
    await cma('PUT', `/assets/${aid}`, { body: { fields: a.fields }, version: a.sys.version });
    alts.push(aid);
  }
  console.log(JSON.stringify({ ...report, version: saved.sys.version, publishedVersion: saved.sys.publishedVersion, alts, calls: callCount() }));
})().catch((e) => { console.error('АЛДАА:', e.message); process.exit(1); });

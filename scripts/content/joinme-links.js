// Rich text-ийн догол мөрийг бүхэлд нь (эсвэл ихэнхийг нь) ороосон joinme.mn холбоосыг хасна (2026-11-20).
// Жишээ: /province/umnugov-ийн танилцуулга бүхэлдээ https://joinme.mn/umnugovi холбоос болж харагдаж байсан.
// Богино CTA холбоос («joinme-ээр холбогдох» г.м.) хэвээр: зөвхөн холбоосын текст блокийн текстийн
// ≥60% ба ≥40 тэмдэгт бол хасна. Текст нь хэвээр үлдэнэ (hyperlink node → түүний доторх text node-ууд).
//
//   node scripts/content/joinme-links.js scan   — snapshot (backups/contentful-snapshot-2026-11-06-after-statfix)
//                                                + түүнээс хойш өөрчлөгдсөн entry-үүдийг (CMA, хуудаслан) шалгана
//                                                → tmp/joinme-links/scan.json
//   node scripts/content/joinme-links.js fix    — scan.json-ийн entry-үүдийг засаж нийтэлнэ
//
// Тоолуур: CMA_BUDGET_FILE=backups/cma-budget-publish-2026-11.txt CMA_BUDGET_MAX=2400.
// Нийтлэгдээгүй өөрчлөлттэй (draft) entry-г засна, гэхдээ нийтлэхгүй: нийтэлбэл шалгагдаагүй
// дахин бичлэг production-д гарна. Тэдгээрийг fix.json-д «draft» гэж тэмдэглэнэ.
const fs = require('fs');
const path = require('path');
const { cma, ROOT } = require('../tic/_cma');

const OUT = path.join(ROOT, 'tmp', 'joinme-links');
fs.mkdirSync(OUT, { recursive: true });
const SNAPSHOT = path.join(ROOT, 'backups', 'contentful-snapshot-2026-11-06-after-statfix');
const JOINME = /(^|\/\/|\.)joinme\.mn/i;
const RATIO = 0.6;
const MIN_LEN = 40;

const textOf = (node) =>
  node?.nodeType === 'text' ? node.value || '' : (node?.content || []).map(textOf).join('');

const isJoinmeLink = (n) => n?.nodeType === 'hyperlink' && JOINME.test(String(n.data?.uri || ''));

// Текст агуулсан блок (paragraph, heading-*) дотор joinme холбоос блокийн ихэнхийг эзэлж байна уу
function badLinks(block) {
  const total = textOf(block).trim().length;
  if (!total) return [];
  return (block.content || []).filter((n) => {
    if (!isJoinmeLink(n)) return false;
    const len = textOf(n).trim().length;
    return len >= MIN_LEN && len >= total * RATIO;
  });
}

const isBlock = (n) => n?.nodeType === 'paragraph' || /^heading-\d$/.test(n?.nodeType || '');

// Rich text document бүрийг (талбар, хэл бүрээр) олно
function richDocs(entry) {
  const out = [];
  for (const [field, byLocale] of Object.entries(entry.fields || {})) {
    for (const [locale, value] of Object.entries(byLocale || {})) {
      if (value && typeof value === 'object' && value.nodeType === 'document') out.push({ field, locale, doc: value });
    }
  }
  return out;
}

function walkBlocks(node, fn) {
  if (!node || typeof node !== 'object') return;
  if (isBlock(node)) fn(node);
  for (const c of node.content || []) walkBlocks(c, fn);
}

function findings(entry) {
  const res = [];
  for (const { field, locale, doc } of richDocs(entry)) {
    walkBlocks(doc, (b) => {
      for (const l of badLinks(b)) res.push({ field, locale, uri: l.data.uri, text: textOf(l).trim().slice(0, 90) });
    });
  }
  return res;
}

// Блок доторх муу холбоосыг дотор нь байгаа node-уудаар солино. Солисон тоог буцаана.
function unwrap(doc) {
  let n = 0;
  walkBlocks(doc, (b) => {
    const bad = new Set(badLinks(b));
    if (!bad.size) return;
    b.content = b.content.flatMap((c) => (bad.has(c) ? (n++, c.content || []) : [c]));
  });
  return n;
}

const typeOf = (e) => e.sys?.contentType?.sys?.id;
const fieldVal = (e, k) => {
  const v = e.fields?.[k];
  return v ? v.mn ?? v[Object.keys(v)[0]] : undefined;
};
const state = (e) =>
  e.sys.archivedVersion ? 'archived' : !e.sys.publishedVersion ? 'draft-only' : e.sys.version > e.sys.publishedVersion + 1 ? 'draft' : 'published';

async function phaseScan() {
  const meta = JSON.parse(fs.readFileSync(path.join(SNAPSHOT, 'meta.json'), 'utf8'));
  const all = new Map(JSON.parse(fs.readFileSync(path.join(SNAPSHOT, 'entries.json'), 'utf8')).map((e) => [e.sys.id, e]));
  // Snapshot-оос хойш өөрчлөгдсөн entry-үүд (шинэ, засагдсан)
  let fresh = 0;
  for (let skip = 0; ; skip += 200) {
    const r = await cma('GET', `/entries?sys.updatedAt[gte]=${encodeURIComponent(meta.at)}&order=sys.updatedAt&limit=200&skip=${skip}`);
    for (const e of r?.items || []) all.set(e.sys.id, e);
    fresh += r?.items?.length || 0;
    if (!r || skip + 200 >= r.total) break;
  }
  const hits = [];
  for (const e of all.values()) {
    const f = findings(e);
    if (f.length)
      hits.push({ id: e.sys.id, type: typeOf(e), title: fieldVal(e, 'title') || fieldVal(e, 'name'), slug: fieldVal(e, 'slug'), state: state(e), links: f });
  }
  fs.writeFileSync(path.join(OUT, 'scan.json'), JSON.stringify(hits, null, 1));
  console.log(`snapshot ${meta.entries} + шинэчлэгдсэн ${fresh} → нийт ${all.size} entry шалгав, олдсон ${hits.length}`);
  for (const h of hits) console.log(`${h.id} | ${h.type} | ${h.slug || ''} | ${h.title || ''} | ${h.state} | ${h.links.map((l) => `${l.field}/${l.locale} ${l.uri}`).join('; ')}`);
}

async function phaseFix() {
  const hits = JSON.parse(fs.readFileSync(path.join(OUT, 'scan.json'), 'utf8'));
  const ids = hits.map((h) => h.id);
  const current = new Map();
  for (let i = 0; i < ids.length; i += 100) {
    const r = await cma('GET', `/entries?sys.id[in]=${ids.slice(i, i + 100).join(',')}&limit=100`);
    for (const e of r?.items || []) current.set(e.sys.id, e);
  }
  const report = [];
  for (const h of hits) {
    const e = current.get(h.id);
    if (!e) { report.push({ ...h, result: 'олдсонгүй' }); continue; }
    const before = state(e);
    let n = 0;
    for (const { doc } of richDocs(e)) n += unwrap(doc);
    if (!n) { report.push({ ...h, result: 'засах зүйлгүй (одоогийн хувилбарт)' }); continue; }
    const saved = await cma('PUT', `/entries/${e.sys.id}`, { body: { fields: e.fields }, version: e.sys.version });
    let result = `${n} холбоос хасав, хадгалав`;
    if (before === 'published') {
      await cma('PUT', `/entries/${e.sys.id}/published`, { version: saved.sys.version });
      result += ', нийтлэв';
    } else {
      result += `, НИЙТЛЭЭГҮЙ (${before})`;
    }
    console.log(h.id, h.slug || '', result);
    report.push({ ...h, before, result });
  }
  fs.writeFileSync(path.join(OUT, 'fix.json'), JSON.stringify(report, null, 1));
}

const phase = process.argv[2];
({ scan: phaseScan, fix: phaseFix }[phase] || (() => { console.log('scan | fix'); }))().catch((err) => {
  console.error('АЛДАА', err.message);
  process.exit(1);
});

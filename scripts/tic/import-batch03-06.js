// TIC 3, 5, 6-р сэдэв → Contentful, бүгд Draft.
//
// Ажиллуулах (repo-ийн үндсэн хавтаснаас):
//   node scripts/tic/fetch-batch03-06.js <кэш>                    # TIC HTML
//   node scripts/tic/schema-batch03-06.js                         # place, species төрөл + талбарууд
//   node scripts/tic/import-batch03-06.js <кэш> --topic=3 --dry   # Contentful-д бичихгүй, тайлан
//   node scripts/tic/import-batch03-06.js <кэш> --topic=3         # импорт + docs/redirects/batch-03-protected.csv
//   (--topic=5 → batch-05-nature.csv, --topic=6 → batch-06-culture.csv; --no-images = зураг татахгүй)
//
// Дүрэм (өмнөх багцуудтай ижил):
//  - TIC-ийн текстийг өөрчлөхгүй хуулна. TIC-ийн сурталчилгааны мөрийг («… илүү их мэдээ мэдээллийг ЭНД дарж
//    аваарай», «… аялал сонирхож байвал энд дарна уу», joinme.mn холбоостой) хасна. Гарчгийг ТОМ үсгээс энгийн
//    бичлэг рүү шилжүүлж, ангиллыг давтсан хавсралтыг («(ТҮҮХ СОЁЛЫН ДУРСГАЛТ ГАЗАР)» г.м.) хасна.
//  - Зургийг татаж Draft asset болгоно. Credit: Wikimedia бол зохиогч/лиценз, бусад нь эх сайт.
//  - sourceUrl = TIC эх хаяг. needsReplacement = лавлах ном/Улаан ном/сонины текст эсвэл TIC-ээс өөр сайтын зураг.
//  - TIC доторх давхардлыг (_batch03-06.js TIC_DUPLICATES) нэг entry болгож, урт текстийг нь авна.
//  - Travel Hub-д байгаа entry-д (EXISTING) TIC текстийг нэмнэ (шинээр үүсгэхгүй).
const fs = require('fs');
const path = require('path');
const { cma, ROOT, LOCALE, callCount } = require('./_cma');
const { loadInventory, writeCsv } = require('./_csv');
const B = require('./_batch03-06');
const { parseHtml, convert, plainText, wordCount, extractArticle } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');
const { TIC, imageOrigin, imageUrl, ensureAsset, commonsCredit, hostCredit } = require('./_assets');
const { TITLE_OVERRIDE, SLUG_OVERRIDE, LATIN_OVERRIDE } = require('./_batch03-06-titles');

const CACHE = process.argv[2];
const DRY = process.argv.includes('--dry');
const NO_IMAGES = process.argv.includes('--no-images');
const TOPIC = Number((process.argv.find((a) => a.startsWith('--topic=')) || '').split('=')[1]);
if (!CACHE || ![3, 5, 6].includes(TOPIC)) { console.error('кэш хавтас, --topic=3|5|6 өгнө үү'); process.exit(1); }

const SITE = 'https://www.travelhubmongolia.com';
const REDIRECT_FILE = { 3: 'batch-03-protected.csv', 5: 'batch-05-nature.csv', 6: 'batch-06-culture.csv' }[TOPIC];
// --only=k1,k2: зөвхөн эдгээр entry-г дахин бичнэ (жишээ нь зураг татаж чадаагүй), тайланг тусад нь
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1]?.split(',');
const REPORT_JSON = path.join(CACHE, '..', `batch03-06-topic${TOPIC}${ONLY ? '-only' : ''}-result.json`);
const L = (v) => ({ [LOCALE]: v });
const link = (type, id) => ({ sys: { type: 'Link', linkType: type, id } });
const ticKey = (url) => {
  const m = /touristinfocenter\.mn(\/[^#]*)/i.exec(url);
  return m ? m[1].toLowerCase() : null;
};

const inlineText = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(inlineText).join(''));
// TIC-ийн сурталчилгааны догол мөр: «… ЭНД дарж аваарай», «… сонирхож байвал энд дарна уу»
const isPromo = (b) =>
  b.nodeType === 'paragraph' && /(илүү их мэдээ мэдээллийг|сонирхож байвал)[^.]*энд дар/i.test(inlineText(b));
// Текст доторх joinme.mn-ийн сурталчилгааны холбоосыг хасаж, үгийг нь хэвээр үлдээнэ
function unwrapAdLinks(node) {
  if (!node.content) return node;
  const out = [];
  for (const c of node.content) {
    if (c.nodeType === 'hyperlink' && /joinme\.mn/i.test(c.data?.uri || '')) out.push(...c.content);
    else out.push(unwrapAdLinks(c));
  }
  // Зэргэлдээ ижил тэмдэгтэй text-үүдийг нэгтгэнэ
  const merged = [];
  for (const c of out) {
    const p = merged[merged.length - 1];
    if (p && p.nodeType === 'text' && c.nodeType === 'text' && JSON.stringify(p.marks) === JSON.stringify(c.marks)) p.value += c.value;
    else merged.push(c);
  }
  return { ...node, content: merged };
}

const norm = (s) => s.toUpperCase().replace(/[^А-ЯЁӨҮA-Z0-9]/g, '');

// Текстээс аймаг: «<Аймаг> аймгийн» эсвэл «<аймаг>ын …» эхний 600 тэмдэгтэд
function aimagFromText(text) {
  const head = text.slice(0, 600);
  for (const [name] of B.AIMAGS) {
    const stem = name.replace(/ь$/, '').replace(/-/g, '[- ]?');
    if (new RegExp(`${stem}[а-яөүё]*\\s+аймаг`, 'i').test(head)) return name;
  }
  return null;
}

function soumFromText(text) {
  const m = /([А-ЯӨҮЁ][а-яөүё-]+)\s+сумын/.exec(text.slice(0, 600));
  return m ? `${m[1]} сум` : undefined;
}

// Латин нэр: гарчгийн хаалтан доторх хэсэг. Төрөл том, зүйл жижиг, зохиогч, он хэвээр.
const AUTHORS = /^(linn\w*|lina\w*|pallas|schreber|erxleben|gmelin|gray|blyth|przewalski|radde|sclater|lichtenstein|gu?ldenst\w*|nicolsky|buchner|peters|sundevall|forster|socolov\w*|sokolov|orlov|shenbrot|milne-edwards|zukowski|serebrennikov|ploiakov|tscherski|fabricius|eversmann|menetries|vogt|nylander|middendorff|leach|plavilstshikov|bartenef|siemaschko|martens|kozlov|vinogradov|david|gunther|bedriaga|heller)$/;

function splitLatin(raw) {
  const m = /^(.*?)\s*\(([^)]*[A-Z][^)]*)\)\s*$/.exec(raw);
  if (!m || !/[A-Z]{3}/.test(m[2])) return { name: raw, latin: undefined };
  // Төрөл (том үсэг) → зүйл, дэд зүйл (жижиг) → зохиогч (том үсэг), он. Зохиогчийг AUTHORS-оор танина.
  const words = m[2].trim().split(/\s+/);
  let inAuthor = false;
  const latin = words
    .map((w, i) => {
      const lw = w.toLowerCase();
      const bare = lw.replace(/[,.;]+$/, '');
      if (i === 0) return lw[0].toUpperCase() + lw.slice(1);
      if (/^(and|et)$/.test(bare)) return lw;
      if (/\d/.test(bare) || AUTHORS.test(bare) || /\./.test(bare)) inAuthor = true;
      if (!inAuthor && /^[a-z-]+$/.test(bare)) return lw;
      return /^[a-z]/.test(lw) ? lw[0].toUpperCase() + lw.slice(1) : lw;
    })
    .join(' ');
  return { name: m[1].trim(), latin };
}

function prepare(all) {
  const items = all.map((r) => {
    const file = path.join(CACHE, `${r.key}.html`);
    if (!fs.existsSync(file)) throw new Error(`${r.key}: кэшд алга (fetch-batch03-06.js-ийг дахин ажиллуул)`);
    const art = extractArticle(fs.readFileSync(file, 'utf8'));
    if (!art) throw new Error(`${r.key}: нийтлэлийн бие олдсонгүй`);
    // cate4_more → буудал орж ирээгүйг шалгана (TIC-ийн cate21 холбоосын алдаа)
    if (norm(art.title) !== norm(r['гарчиг'])) throw new Error(`${r.key}: гарчиг таарсангүй «${art.title}» ≠ «${r['гарчиг']}»`);
    const kind = B.kindOf(r);
    const oldUrl = TIC + r['хуучин_url'];
    let rawTitle = art.title;
    let latin;
    let altNames;
    if (kind.type === 'species') {
      // Шувуу: «НУГАС (ЦАХИУР БОХИО, ЦАХИУР НУГАС)» → нэр «Цахиур бохио», бусад нэр «Цахиур нугас»
      const bird = kind.category === 'bird' && /^(.*?)\s*\((.+)\)\s*$/.exec(rawTitle);
      if (bird && !/[A-Z]{3}/.test(bird[2])) {
        const names = bird[2].split(/,\s*/);
        rawTitle = names[0];
        altNames = names.slice(1).map(B.speciesCase);
      } else ({ name: rawTitle, latin } = splitLatin(rawTitle));
    }
    const title = TITLE_OVERRIDE[r.key] || (kind.type === 'species' ? B.speciesCase(rawTitle) : B.TOPIC_OF_CATE[r['ангилал']] === 6 ? B.institutionCase(B.cleanTitle(rawTitle)) : B.caseTitle(B.cleanTitle(rawTitle)));
    return { row: r, key: r.key, art, kind, oldUrl, title, altNames, latin: LATIN_OVERRIDE[r.key] ?? latin, topic: B.TOPIC_OF_CATE[r['ангилал']] };
  });

  // Давхардлын бүлэг: үлдэх мөр → гишүүд
  const byKey = new Map(items.map((it) => [it.key, it]));
  for (const [dup, keep] of Object.entries(B.TIC_DUPLICATES)) {
    if (!byKey.has(dup) && !byKey.has(keep)) continue; // өөр сэдвийн давхардал
    if (!byKey.has(dup) || !byKey.has(keep)) throw new Error(`давхардал ${dup} → ${keep}: мөр олдсонгүй`);
    byKey.get(dup).mergedInto = keep;
  }

  // Slug, шинэ хаяг
  const used = new Set();
  for (const it of items) {
    if (it.mergedInto) continue;
    if (B.SKIP[it.key]) { it.newPath = B.SKIP[it.key]; it.skipped = true; continue; }
    const ex = B.EXISTING[it.key];
    if (ex) { it.newPath = ex.path; it.slug = ex.path.split('/').pop(); continue; }
    let slug = SLUG_OVERRIDE[it.key] || B.slugify(it.title);
    const base = slug;
    for (let n = 2; used.has(`${it.kind.type}:${slug}`); n++) slug = `${base}-${n}`;
    used.add(`${it.kind.type}:${slug}`);
    it.slug = slug;
  }

  const rewriteMap = new Map();
  const finalize = () => {
    for (const it of items) {
      const target = it.mergedInto ? byKey.get(it.mergedInto) : it;
      if (!target.newPath) {
        if (target.kind.type === 'place') target.newPath = `${B.PLACE_PATH[target.kind.category]}/${target.slug}`;
        else if (target.kind.type === 'heritagePlace') target.newPath = `/destination/heritage/place/${target.slug}`;
      }
    }
  };

  // Блок, текст, зураг
  for (const it of items) {
    const blocks = convert(parseHtml(it.art.body), { baseUrl: TIC + '/', rewriteLink: (h) => h });
    const promo = blocks.filter(isPromo).length;
    it.adLinks = (JSON.stringify(blocks).match(/"uri":"[^"]*joinme\.mn/gi) || []).length;
    let bs = blocks.filter((b) => !isPromo(b)).map(unwrapAdLinks);
    while (bs.length && bs[bs.length - 1].nodeType === 'hr') bs.pop();
    while (bs.length && bs[0].nodeType === 'hr') bs.shift();
    it.promoRemoved = promo;
    it.blocks = bs;
    it.text = plainText(bs);
    it.words = wordCount(it.text);
    it.images = bs.filter((b) => b.nodeType === '__image').map((b) => ({ src: b.src, origin: imageOrigin(b.src) }));
    const srcLine = (it.text.match(/Эх сурвалж:[^\n]*/gi) || []).join(' ') + ' ' + it.row['зохиогч_эх_сурвалж'];
    it.flags = [];
    if (/лавлах/i.test(srcLine)) it.flags.push('Монгол орны лавлах');
    if (/улаан ном/i.test(srcLine)) it.flags.push('Улаан ном');
    if (/сонин|medee|ikon|news/i.test(srcLine)) it.flags.push('сонин/мэдээний сайт');
    if (/facebook/i.test(srcLine)) it.flags.push('Facebook');
    if (!it.flags.length && /Эх сурвалж/i.test(it.text)) it.flags.push('эх сурвалж заасан');
    // Латин нэр нийтлэлийн «Lat: …» мөрөөс (гарчигт байхгүй бол)
    if (it.kind.type === 'species' && it.latin === undefined) {
      const m = /(?:^|\n)\s*(?:Lat|Латин нэр|Латин)\s*[:：]\s*([^\n]+)/i.exec(it.text);
      if (m) it.latin = m[1].split(/\s+(?:Mon|Rus|Eng|Jap|Баг|Овог)\s*:/)[0].replace(/[;,.\s]+$/, '').trim();
    }
    for (const im of it.images) if (im.origin === 'third-party') it.flags.push(`зураг: ${new URL(imageUrl(im.src)).hostname}`);
  }

  // Бүлгийн үлдэх entry-ийн бие = хамгийн урт текст
  for (const it of items) {
    if (it.mergedInto) continue;
    const group = [it, ...items.filter((x) => x.mergedInto === it.key)];
    const longest = group.reduce((a, b) => (b.words > a.words ? b : a));
    it.bodyFrom = longest;
    it.group = group;
    it.needsReplacement = group.some((g) => g.flags.length) || false;
  }

  // Аймаг (place, heritagePlace)
  for (const it of items) {
    if (it.mergedInto || it.kind.type === 'species') continue;
    let aimag = Object.prototype.hasOwnProperty.call(B.AIMAG_OVERRIDE, it.key) ? B.AIMAG_OVERRIDE[it.key] : undefined;
    if (aimag === undefined) aimag = aimagFromText(it.bodyFrom.text) || it.row['аймаг'] || (/Улаанбаатар|нийслэл/i.test(it.bodyFrom.text.slice(0, 600)) ? 'Улаанбаатар' : null);
    if (!aimag && ['9', '17'].includes(it.row['ангилал'])) aimag = 'Улаанбаатар';
    it.aimag = aimag && B.AIMAG_SLUG[aimag] ? aimag : null;
    it.soum = soumFromText(it.bodyFrom.text) || (it.row['сум'] ? `${it.row['сум']} сум` : undefined);
  }

  // Species: тусдаа хуудас (шувуу ≥150 үг, ургамал ≥80 үг, бусад амьтан бүгд), товч тайлбар
  for (const it of items) {
    if (it.mergedInto || it.kind.type !== 'species') continue;
    const w = it.bodyFrom.words;
    it.ownPage = it.kind.category === 'bird' ? w >= 150 : it.kind.category === 'plant' ? w >= 80 : true;
    it.newPath = B.speciesPath(it.kind.category, it.slug, it.ownPage);
    // Каталогийн товч: латин/орос/япон нэр, баг, овог, ТОМ үсгийн гарчгийн мөр, эх сурвалжаас бусад мөр (TIC текст хэвээр)
    const t = it.bodyFrom.text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !/^(Lat|Rus|Jap|Баг|Овог|Эх сурвалж)\s*[:：]/i.test(l) && l !== l.toLocaleUpperCase('mn'))
      .join(' · ')
      .replace(/\s+/g, ' ')
      .trim();
    it.summary = t.length <= 600 && !it.ownPage ? t : cutSentences(t, 280);
  }

  finalize();
  for (const it of items) {
    const target = it.mergedInto ? byKey.get(it.mergedInto) : it;
    it.redirectTo = target.newPath;
    rewriteMap.set(ticKey(it.oldUrl), target.newPath);
  }
  // Багц доторх TIC холбоосыг шинэ хаяг руу
  const rewrite = (node) => {
    if (node.nodeType === 'hyperlink') {
      const k = ticKey(node.data.uri || '');
      if (k && rewriteMap.has(k)) node.data.uri = SITE + rewriteMap.get(k);
    }
    (node.content || []).forEach(rewrite);
  };
  items.forEach((it) => it.blocks.forEach(rewrite));
  return { items, byKey };
}

function cutSentences(text, max) {
  if (text.length <= max) return text;
  const ss = text.split(/(?<=[.!?…])\s+/);
  let out = '';
  for (const s of ss) {
    if ((out + ' ' + s).trim().length > max) break;
    out = (out + ' ' + s).trim();
  }
  if (out.length >= 60) return out;
  const c = text.slice(0, max - 1);
  return c.slice(0, c.lastIndexOf(' ')).replace(/[\s,;:–—-]+$/, '') + '…';
}

async function creditFor(src, origin) {
  if (origin === 'third-party' && /wikimedia\.org/.test(src)) return (await commonsCredit(src)) || hostCredit(src);
  if (origin === 'third-party') return hostCredit(imageUrl(src));
  return 'Зураг: touristinfocenter.mn';
}

async function resolveImages(it, title, report) {
  const out = [];
  let firstAsset = null;
  let n = 0;
  for (const b of it.bodyFrom.blocks) {
    if (b.nodeType !== '__image') { out.push(b); continue; }
    n++;
    if (NO_IMAGES) continue;
    const origin = imageOrigin(b.src);
    if (origin === 'broken') { report.push({ key: it.bodyFrom.key, src: b.src.slice(0, 120), error: 'эвдэрсэн зам' }); continue; }
    const shown = b.src.startsWith('data:') ? 'base64 (TIC нийтлэлд шигтгэсэн)' : imageUrl(b.src);
    try {
      const credit = await creditFor(b.src, origin);
      const id = DRY
        ? 'dry-run'
        : await ensureAsset(b.src, `${title} — зураг ${n}`, `TIC: ${it.bodyFrom.oldUrl} · Эх зураг: ${shown}${origin === 'tic' ? '' : ' · needsReplacement'}`, credit);
      firstAsset = firstAsset || id;
      out.push({ nodeType: 'embedded-asset-block', data: { target: link('Asset', id) }, content: [] });
    } catch (e) {
      report.push({ key: it.bodyFrom.key, src: shown.slice(0, 160), error: e.message });
    }
  }
  return { content: out, firstAsset };
}

async function upsert(id, contentType, fields) {
  const cur = await cma('GET', `/entries/${id}`);
  if (!cur) return cma('PUT', `/entries/${id}`, { contentType, body: { fields } });
  return cma('PUT', `/entries/${id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
}

// Одоо байгаа entry-ийн description-д TIC текстийг нэмнэ (дахин ажиллуулахад давхардахгүй)
async function mergeExisting(it, content, firstAsset, provinceIds) {
  const ex = B.EXISTING[it.key];
  const cur = await cma('GET', `/entries/${ex.id}`);
  const doc = cur.fields.description?.[LOCALE];
  // Гарчиг нь TIC-ийн нэр; өмнөх импортын «Touristinfocenter.mn: …» гарчгийг ч танина
  const MARK = it.title;
  let kept = (doc?.content || []).filter((b) => !/Одоогоор өгөх дэлгэрэнгүй мэдээлэл алга/.test(inlineText(b)));
  const at = kept.findIndex((b) => b.nodeType === 'heading-2' && (inlineText(b) === MARK || inlineText(b).startsWith('Touristinfocenter.mn: ')));
  if (at >= 0) kept = kept.slice(0, at); // өмнөх импортыг сольж бичнэ
  while (kept.length && !inlineText(kept[kept.length - 1]).trim() && kept[kept.length - 1].nodeType === 'paragraph') kept.pop();
  const heading = { nodeType: 'heading-2', data: {}, content: [{ nodeType: 'text', value: MARK, marks: [], data: {} }] };
  const fields = {
    ...cur.fields,
    description: { ...(cur.fields.description || {}), [LOCALE]: { nodeType: 'document', data: {}, content: [...kept, heading, ...content] } },
    sourceUrl: L(it.group.map((g) => g.oldUrl).join(' ')),
    needsReplacement: L(it.needsReplacement),
  };
  if (it.aimag) fields.provinceRef = L(link('Entry', provinceIds[B.AIMAG_SLUG[it.aimag]]));
  if (B.PROTECTED_CATEGORIES.includes(it.kind.category)) fields.protectedCategory = L(it.kind.category);
  const imgField = ex.type === 'heritagePlace' ? 'image' : 'coverImage';
  if (!cur.fields[imgField] && firstAsset && firstAsset !== 'dry-run') fields[imgField] = L(link('Asset', firstAsset));
  if (!cur.fields.seoTitle?.[LOCALE]) fields.seoTitle = L(it.seoTitle);
  if (!cur.fields.seoDescription?.[LOCALE]) fields.seoDescription = L(it.seoDescription);
  if (!DRY) await cma('PUT', `/entries/${ex.id}`, { version: cur.sys.version, body: { fields } });
}

(async () => {
  // Энэ сэдвийн мөрүүд + өөр сэдэвтэй давхардсан хос мөрүүд (жишээ нь Богд хан уул: cate9 → cate2)
  const pairs = Object.entries(B.TIC_DUPLICATES).flat();
  const related = new Set(
    Object.entries(B.TIC_DUPLICATES)
      .filter(([a, b]) => [a, b].some((k) => B.TOPIC_OF_CATE[k.slice(1).split('_')[0]] === TOPIC))
      .flat()
  );
  const all = B.batchRows(loadInventory()).filter(
    (r) => B.TOPIC_OF_CATE[r['ангилал']] === TOPIC || (pairs.includes(r.key) && related.has(r.key))
  );
  const { items } = prepare(all);
  const mine = items.filter((it) => it.topic === TOPIC);
  const usedDesc = new Set();
  const imageErrors = [];
  const provinces = await cma('GET', '/entries?content_type=province&limit=100&select=sys.id,fields.slug');
  const provinceIds = Object.fromEntries(provinces.items.map((e) => [e.fields.slug[LOCALE], e.sys.id]));
  const result = { topic: TOPIC, entries: [], merged: [], imageErrors };
  const cityMonumentIds = [];

  // SEO талбарууд дарааллаар (давхардлаас сэргийлэх usedDesc тогтвортой), дараа нь Contentful-д 4 зэрэг
  const todo = [];
  for (const it of mine) {
    if (it.mergedInto) continue;
    if (it.skipped) { result.skipped = [...(result.skipped || []), { key: it.key, title: it.title, redirect: it.newPath }]; console.log(`алгасав ${it.key} «${it.title}» → ${it.newPath}`); continue; }
    const label = B.CATEGORY_LABEL[it.kind.category];
    it.seoTitle = seoTitle(it.title, label);
    it.seoDescription = seoDescription(
      it.bodyFrom.text,
      { name: it.title, stem: it.title.split(/[ ,.-]/)[0], fallback: `${label} — Travel Hub Mongolia.` },
      usedDesc
    );
    if (!ONLY || ONLY.includes(it.key)) todo.push(it);
  }
  const CONCURRENCY = DRY ? 1 : 4;
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < todo.length) await handle(todo[next++]);
  }));
  // Зэрэгцээ ажилласан тул TIC-ийн дараалал руу буцаана
  const order = new Map(mine.map((it, i) => [it.key, i]));
  result.entries.sort((a, b) => order.get(a.key) - order.get(b.key));
  cityMonumentIds.sort((a, b) => order.get(a.replace(/^tic-/, '').replace('-', '_')) - order.get(b.replace(/^tic-/, '').replace('-', '_')));

  async function handle(it) {
    const { content, firstAsset } = await resolveImages(it, it.title, imageErrors);
    const doc = { nodeType: 'document', data: {}, content };
    const common = {
      seoTitle: L(it.seoTitle),
      seoDescription: L(it.seoDescription),
      sourceUrl: L(it.group.map((g) => g.oldUrl).join(' ')),
      needsReplacement: L(it.needsReplacement),
    };
    const img = firstAsset && firstAsset !== 'dry-run' ? { image: L(link('Asset', firstAsset)) } : {};
    const id = `tic-${it.key.replace('_', '-')}`;
    let entryId = id;

    if (B.EXISTING[it.key]) {
      entryId = B.EXISTING[it.key].id;
      await mergeExisting(it, content, firstAsset, provinceIds);
    } else if (it.kind.type === 'place') {
      const fields = {
        title: L(it.title), slug: L(it.slug), category: L(it.kind.category), body: L(doc), ...img, ...common,
      };
      if (it.aimag) fields.province = L(link('Entry', provinceIds[B.AIMAG_SLUG[it.aimag]]));
      if (it.soum) fields.soum = L(it.soum);
      if (!DRY) await upsert(id, 'place', fields);
    } else if (it.kind.type === 'heritagePlace') {
      const fields = {
        name: L(it.title), slug: L(it.slug), region: L(it.aimag || 'Монгол'), province: L(it.aimag || ''),
        description: L(doc), ...img, ...common,
      };
      if (it.aimag) fields.provinceRef = L(link('Entry', provinceIds[B.AIMAG_SLUG[it.aimag]]));
      if (!DRY) await upsert(id, 'heritagePlace', fields);
      cityMonumentIds.push(id);
    } else {
      const fields = {
        title: L(it.title), slug: L(it.slug), group: L(it.kind.category), ownPage: L(it.ownPage),
        order: L(Number(it.key.split('_')[1])), summary: L(it.summary), body: L(doc), ...img, ...common,
      };
      if (it.latin) fields.latinName = L(it.latin);
      if (!DRY) await upsert(id, 'species', fields);
    }

    const rec = {
      id: entryId, key: it.key, title: it.title, latin: it.latin, type: B.EXISTING[it.key]?.type || it.kind.type,
      category: it.kind.category, aimag: it.aimag, soum: it.soum, slug: it.slug, path: it.newPath, ownPage: it.ownPage,
      words: it.bodyFrom.words, bodyFrom: it.bodyFrom.key, images: it.bodyFrom.images.length,
      promoRemoved: it.group.reduce((s, g) => s + g.promoRemoved, 0), needsReplacement: it.needsReplacement,
      flags: [...new Set(it.group.flatMap((g) => g.flags))], adLinks: it.group.reduce((s, g) => s + g.adLinks, 0), seoTitle: it.seoTitle, seoDescription: it.seoDescription,
      members: it.group.map((g) => g.key), existing: !!B.EXISTING[it.key],
    };
    result.entries.push(rec);
    if (rec.members.length > 1 || rec.existing) result.merged.push(rec);
    console.log(`${DRY ? '[dry] ' : ''}${it.kind.category.padEnd(18)} ${it.newPath} ← ${rec.members.join('+')} «${it.title}»${it.latin ? ` (${it.latin})` : ''} ${it.aimag || '—'}${it.soum ? '/' + it.soum : ''} (${rec.words} үг, зураг ${rec.images}${it.needsReplacement ? ', NR' : ''}${rec.existing ? ', НЭГТГЭВ' : ''}) [${it.seoTitle.length}/${it.seoDescription.length}]`);
  }

  // Хотын дурсгалт газрын ангилал (heritageCategory)
  if (TOPIC === 6) {
    const catId = 'tic-heritage-city-monuments';
    const fields = {
      title: L('Хотын дурсгалт газрууд'),
      slug: L('city-monuments'),
      count: L(`Нийт ${cityMonumentIds.length} газар`),
      remainingCount: L(0),
      places: L(cityMonumentIds.map((id) => link('Entry', id))),
      seoTitle: L('Хотын дурсгалт газрууд — Улаанбаатар ба аймгийн төвүүд'),
      seoDescription: L('Улаанбаатар хот болон аймгийн төвүүдийн түүхэн барилга, хөшөө, баримал, хийд, уул: Монголын хотын дурсгалт газруудын жагсаалт, танилцуулга.'),
    };
    if (!DRY) await upsert(catId, 'heritageCategory', fields);
    console.log(`heritageCategory city-monuments: ${cityMonumentIds.length} газар`);
  }

  // Redirect: энэ сэдвийн бүх TIC мөр (давхардсан нь үлдэх entry рүү)
  const redirects = mine.map((it) => {
    const target = it.mergedInto ? items.find((x) => x.key === it.mergedInto) : it;
    return [it.oldUrl, SITE + it.redirectTo, target.title, B.CATEGORY_LABEL[target.kind.category], target.aimag || ''];
  });
  if (!DRY) writeCsv(path.join(ROOT, 'docs', 'redirects', REDIRECT_FILE), ['old_url', 'new_url', 'title', 'ангилал', 'аймаг'], redirects);
  result.redirectRows = redirects.length;
  fs.writeFileSync(REPORT_JSON, JSON.stringify(result, null, 2), 'utf8');
  console.log(`entry: ${result.entries.length}, нэгтгэсэн: ${result.merged.length}, redirect: ${redirects.length}, зургийн алдаа: ${imageErrors.length}, CMA: ${callCount()}`);
  for (const e of imageErrors) console.log('  зураг алгасав:', e.key, e.error, e.src);
})().catch((e) => { console.error(e); process.exit(1); });

// TIC 4-р багц: cate1 «Байгаль, түүхийн дурсгалт газар» (453 нийтлэл) → Contentful, бүгд Draft.
//
//   node scripts/tic/fetch-batch04-08.js backups/tic-cache/batch04-08 1
//   node scripts/tic/import-batch04.js backups/tic-cache/batch04-08 --dry    # бичихгүй, тайлан
//   node scripts/tic/import-batch04.js backups/tic-cache/batch04-08          # импорт + docs/redirects/batch-04-places.csv
//   (--only=c1_1,c1_2 → зөвхөн эдгээрийг дахин бичнэ; --no-images)
//
// Хаана:
//  - inventory `contentful_төрөл` = destination (байгалийн газар, 210) → `place`, category `landscape`,
//    /destination/landscapes/<slug>. destination төрөл нүүрний slider-т гардаг тул тэнд оруулахгүй.
//  - heritagePlace (түүх, соёлын дурсгал, 242) → `heritagePlace` (entry id tic-c1-*), /destination/heritage/place/<slug>,
//    шинэ heritageCategory «Түүх, соёлын дурсгалт газрууд» (historical-sites). Аймгийн хуудсанд #heritage-sites.
//  - c1_400 «Аймаг тус бүрийн 7 гайхамшиг» (жагсаалт нийтлэл) → landscape place.
// Дүрэм (3, 5, 6-р сэдэвтэй ижил, import-batch03-06.js):
//  - TIC текст өөрчлөхгүй, сурталчилгааны мөр, joinme.mn холбоосыг хасна. Гарчиг ТОМ үсгээс энгийн бичлэг рүү.
//  - Зургийг татаж Draft asset. sourceUrl = TIC хаяг, needsReplacement = лавлах/Улаан ном/сонин/гуравдагч зураг.
//  - Өмнөх багцад орсон газар (EXISTING_REDIRECT): шинэ entry үүсгэхгүй, redirect нь байгаа хуудас руу.
//  - Contentful-д байгаа destination «13-р зуун цогцолбор» (c1_407): TIC текстийг description-ий төгсгөлд нэмнэ (Draft).
//  - Координат: текстэд «47°12′ … 106°30′» эсвэл «47.123, 106.456» байвал heritagePlace.coordinates.
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, LOCALE, callCount } = require('./_cma');
const { loadInventory, writeCsv } = require('./_csv');
const { checkBudget } = require('./_budget');
const B = require('./_batch03-06');
const { parseHtml, convert, plainText, wordCount, extractArticle } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');
const { TIC, imageOrigin, imageUrl, ensureAsset, commonsCredit, hostCredit } = require('./_assets');

const CACHE = process.argv[2];
const DRY = process.argv.includes('--dry');
const NO_IMAGES = process.argv.includes('--no-images');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1]?.split(',');
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }

const SITE = 'https://www.travelhubmongolia.com';
const REPORT_JSON = path.join(ROOT, 'backups', 'tic-cache', `batch04-result${ONLY ? '-only' : ''}.json`);
const L = (v) => ({ [LOCALE]: v });
const link = (type, id) => ({ sys: { type: 'Link', linkType: type, id } });
const CATEGORY_ID = 'tic-heritage-historical-sites';
const LABEL = { landscape: 'Байгалийн үзэсгэлэнт газар', heritage: 'Түүх, соёлын дурсгалт газар' };

// Өмнөх багцад аль хэдийн entry-тэй (шинээр үүсгэхгүй, redirect)
const EXISTING_REDIRECT = {
  c1_174: '/destination/heritage/place/ikh-tengeriin-amny-zurag', // 6-р сэдэв c9_24
  c1_162: '/destination/protected/ulaagchny-khar-nuur', // 3-р сэдэв c5_18 (БДГ)
};
// Contentful-ийн одоогийн entry-д TIC текстийг нэмнэ
const EXISTING_MERGE = {
  c1_407: { type: 'destination', id: '3Rt7pnt87NLThFVsRS7DoU', path: '/destination/13th-century', imageField: 'coverImage' },
};
// Гарчгийн нэмэлт хавсралт: «МЭЛХИЙ ХАД (ТЭРЭЛЖ)» хэвээр; «(ЭКОЛОГИЙН ТЭНЦВЭР ХАДГАЛАХ БҮС)» г.м. ангиллыг хасна
const cleanTitle = (t) => B.cleanTitle(t).replace(/\s*\((?:[^)]*БҮС|[^)]*ДУРСГАЛТ ГАЗАР|ТӨРИЙН ТАХИЛГАТ УУЛ)\)\s*$/i, '').trim();

const ticKey = (url) => { const m = /touristinfocenter\.mn(\/[^#]*)/i.exec(url); return m ? m[1].toLowerCase() : null; };
const inlineText = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(inlineText).join(''));
const isPromo = (b) => b.nodeType === 'paragraph' && /(илүү их мэдээ мэдээллийг|сонирхож байвал)[^.]*энд дар/i.test(inlineText(b));
function unwrapAdLinks(node) {
  if (!node.content) return node;
  const out = [];
  for (const c of node.content) {
    if (c.nodeType === 'hyperlink' && /joinme\.mn/i.test(c.data?.uri || '')) out.push(...c.content);
    else out.push(unwrapAdLinks(c));
  }
  const merged = [];
  for (const c of out) {
    const p = merged[merged.length - 1];
    if (p && p.nodeType === 'text' && c.nodeType === 'text' && JSON.stringify(p.marks) === JSON.stringify(c.marks)) p.value += c.value;
    else merged.push(c);
  }
  return { ...node, content: merged };
}
const norm = (s) => s.toUpperCase().replace(/[^А-ЯЁӨҮA-Z0-9]/g, '');

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

// Координат: «N 47°12'30"», «47°12′», «47.1234° … 106.5°», «47.123, 106.456». Монголын хүрээнд байвал.
function coordsFromText(text) {
  const inMn = (lat, lon) => lat >= 41 && lat <= 52.2 && lon >= 87 && lon <= 120;
  const dms = [...text.matchAll(/(\d{2,3})\s*°\s*(?:(\d{1,2}(?:[.,]\d+)?)\s*['′’]\s*)?(?:(\d{1,2}(?:[.,]\d+)?)\s*(?:["″”]|''))?/g)]
    .map((m) => Number(m[1]) + Number((m[2] || '0').replace(',', '.')) / 60 + Number((m[3] || '0').replace(',', '.')) / 3600);
  for (let i = 0; i + 1 < dms.length; i++) if (inMn(dms[i], dms[i + 1])) return { lat: +dms[i].toFixed(5), lon: +dms[i + 1].toFixed(5) };
  const dec = /(4[1-9]|5[0-2])[.,](\d{2,6})\s*[°]?\s*[NС]?[\s,;/]+\s*[EЗ]?\s*(8[7-9]|9\d|1[01]\d)[.,](\d{2,6})/.exec(text);
  if (dec) {
    const lat = Number(`${dec[1]}.${dec[2]}`), lon = Number(`${dec[3]}.${dec[4]}`);
    if (inMn(lat, lon)) return { lat, lon };
  }
  return null;
}

// Гарчиг: өгүүлбэрийн бичлэг. Эхний үг, «(»/зураасны дараах үг, оноосон нэр (аймаг, гол, нуруу, хүн) том үсгээр.
//   «ЯРХ УУЛЫН ХУУЧИН ЧУЛУУН ЗЭВСГИЙН ҮЕИЙН БУУЦ» → «Ярх уулын хуучин чулуун зэвсгийн үеийн бууц»
//   «МЭЛХИЙ ХАД (ТЭРЭЛЖ)» → «Мэлхий хад (Тэрэлж)»
const PROPER = new RegExp(
  '^(' +
    [
      ...B.AIMAGS.map(([n]) => n.toLocaleLowerCase('mn').split('-')[0].replace(/ь$/, '')).filter((s) => !['төв', 'дархан', 'баян', 'говь'].includes(s)),
      'монгол', 'чингис', 'тэмүжин', 'занабазар', 'данзанравжаа', 'хубилай', 'өгэдэй', 'хархорум', 'хархорин', 'орхон', 'туул',
      'хэрлэн', 'онон', 'сэлэнгэ', 'хангай', 'хэнтий', 'алтай', 'тэрэлж', 'богд', 'хөвсгөл', 'увс', 'ховд', 'завхан', 'тамир',
      'тонъюкук', 'тоньюкук', 'билгэ', 'күлтегин', 'тэс', 'идэр', 'халх', 'буйр', 'тэрхийн', 'отгонтэнгэр',
      'сүхбаатар', 'чойбалсан', 'цогт', 'абтай', 'түшээт', 'сэцэн', 'засагт', 'эрдэнэ', 'амарбаясгалант', 'гандан', 'даш',
      'гэсэр', 'жамсран', 'бурхан', 'халдун', 'шилийн', 'хорго', 'ёлын', 'хонгорын', 'баянзаг',
    ].map((w) => w.toLocaleLowerCase('mn')).join('|') +
    ')'
);
function sentenceCase(raw) {
  const lower = raw.toLocaleLowerCase('mn');
  let first = true;
  return lower.replace(/[\p{L}]+/gu, (w, i) => {
    const before = lower.slice(Math.max(0, i - 2), i);
    const cap = first || /[(-]\s?$/.test(before) || PROPER.test(w);
    first = false;
    return cap ? w[0].toLocaleUpperCase('mn') + w.slice(1) : w;
  });
}

function prepare(rows) {
  const items = rows.map((r) => {
    const file = path.join(CACHE, `${r.key}.html`);
    if (!fs.existsSync(file)) throw new Error(`${r.key}: кэшд алга (fetch-batch04-08.js)`);
    const art = extractArticle(fs.readFileSync(file, 'utf8'));
    if (!art) throw new Error(`${r.key}: нийтлэлийн бие олдсонгүй`);
    if (norm(art.title) !== norm(r['гарчиг'])) throw new Error(`${r.key}: гарчиг таарсангүй «${art.title}» ≠ «${r['гарчиг']}»`);
    const kind = r['contentful_төрөл'] === 'heritagePlace' ? 'heritage' : 'landscape';
    return { row: r, key: r.key, art, kind, oldUrl: TIC + r['хуучин_url'], title: sentenceCase(cleanTitle(art.title)) };
  });
  return items;
}

(async () => {
  const rows = loadInventory().filter((r) => r['ангилал'] === '1');
  const items = prepare(rows);

  // Одоо байгаа slug-ууд (place.slug unique; heritagePlace slug-аар хуудас хайдаг)
  const existingSlugs = { place: new Set(), heritagePlace: new Set() };
  for (const t of ['place', 'heritagePlace']) {
    for (let skip = 0; ; skip += 1000) {
      const r = await cma('GET', `/entries?content_type=${t}&limit=1000&skip=${skip}&select=sys.id,fields.slug`);
      for (const e of r.items) if (!e.sys.id.startsWith('tic-c1-')) existingSlugs[t].add(fv(e, 'slug'));
      if (skip + 1000 >= r.total) break;
    }
  }
  const used = { place: new Set(existingSlugs.place), heritagePlace: new Set(existingSlugs.heritagePlace) };
  const rewriteMap = new Map();
  for (const it of items) {
    if (EXISTING_REDIRECT[it.key]) { it.newPath = EXISTING_REDIRECT[it.key]; it.existing = 'redirect'; }
    else if (EXISTING_MERGE[it.key]) { it.newPath = EXISTING_MERGE[it.key].path; it.existing = 'merge'; }
    else {
      const type = it.kind === 'heritage' ? 'heritagePlace' : 'place';
      let slug = B.slugify(it.title);
      const base = slug;
      for (let n = 2; used[type].has(slug); n++) slug = `${base}-${n}`;
      used[type].add(slug);
      it.slug = slug;
      it.type = type;
      it.newPath = type === 'place' ? `/destination/landscapes/${slug}` : `/destination/heritage/place/${slug}`;
    }
    rewriteMap.set(ticKey(it.oldUrl), it.newPath);
  }
  // Өмнөх багцуудын redirect (багц доторх TIC холбоосыг шинэ хаяг руу)
  const { parseCsv } = require('./_csv');
  for (const f of fs.readdirSync(path.join(ROOT, 'docs', 'redirects'))) {
    if (!f.endsWith('.csv') || f.startsWith('batch-04')) continue;
    for (const r of parseCsv(fs.readFileSync(path.join(ROOT, 'docs', 'redirects', f), 'utf8'))) {
      const k = ticKey(r.old_url);
      if (k && !rewriteMap.has(k)) rewriteMap.set(k, r.new_url.replace(SITE, ''));
    }
  }
  const rewrite = (node) => {
    if (node.nodeType === 'hyperlink') {
      const k = ticKey(node.data.uri || '');
      if (k && rewriteMap.has(k)) node.data.uri = SITE + rewriteMap.get(k);
    }
    (node.content || []).forEach(rewrite);
  };

  for (const it of items) {
    const blocks = convert(parseHtml(it.art.body), { baseUrl: TIC + '/', rewriteLink: (h) => h });
    it.promoRemoved = blocks.filter(isPromo).length;
    it.adLinks = (JSON.stringify(blocks).match(/"uri":"[^"]*joinme\.mn/gi) || []).length;
    let bs = blocks.filter((b) => !isPromo(b)).map(unwrapAdLinks);
    while (bs.length && bs[bs.length - 1].nodeType === 'hr') bs.pop();
    while (bs.length && bs[0].nodeType === 'hr') bs.shift();
    bs.forEach(rewrite);
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
    for (const im of it.images) if (im.origin === 'third-party') it.flags.push(`зураг: ${new URL(imageUrl(im.src)).hostname}`);
    it.needsReplacement = it.flags.length > 0;
    let aimag = aimagFromText(it.text) || it.row['аймаг'] || null;
    it.aimag = aimag && B.AIMAG_SLUG[aimag] ? aimag : null;
    it.soum = soumFromText(it.text) || (it.row['сум'] ? `${it.row['сум']} сум` : undefined);
    it.coords = coordsFromText(it.text);
  }

  const toCreate = items.filter((it) => !it.existing);
  const plannedImages = NO_IMAGES ? 0 : toCreate.reduce((s, it) => s + it.images.filter((i) => i.origin !== 'broken').length, 0);
  if (!ONLY) await checkBudget(toCreate.length + plannedImages + 1, '4-р багц (entry + зураг + ангилал)');

  const provinces = await cma('GET', '/entries?content_type=province&limit=100&select=sys.id,fields.slug');
  const provinceIds = Object.fromEntries(provinces.items.map((e) => [e.fields.slug[LOCALE], e.sys.id]));
  const usedDesc = new Set();
  const imageErrors = [];
  const result = { entries: [], imageErrors };

  for (const it of items) {
    if (it.existing === 'redirect') continue;
    const label = LABEL[it.kind];
    it.seoTitle = seoTitle(it.title, label);
    it.seoDescription = seoDescription(it.text, { name: it.title, stem: it.title.split(/[ ,.-]/)[0], fallback: `${label} — Travel Hub Mongolia.` }, usedDesc);
  }

  async function resolveImages(it) {
    const out = [];
    let firstAsset = null, n = 0;
    for (const b of it.blocks) {
      if (b.nodeType !== '__image') { out.push(b); continue; }
      n++;
      if (NO_IMAGES) continue;
      const origin = imageOrigin(b.src);
      if (origin === 'broken') { imageErrors.push({ key: it.key, src: b.src.slice(0, 120), error: 'эвдэрсэн зам' }); continue; }
      const shown = b.src.startsWith('data:') ? 'base64 (TIC нийтлэлд шигтгэсэн)' : imageUrl(b.src);
      try {
        const credit = origin === 'third-party' && /wikimedia\.org/.test(b.src) ? (await commonsCredit(b.src)) || hostCredit(b.src)
          : origin === 'third-party' ? hostCredit(imageUrl(b.src)) : 'Зураг: touristinfocenter.mn';
        const id = DRY ? 'dry-run' : await ensureAsset(b.src, `${it.title} — зураг ${n}`, `TIC: ${it.oldUrl} · Эх зураг: ${shown}${origin === 'tic' ? '' : ' · needsReplacement'}`, credit);
        firstAsset = firstAsset || id;
        out.push({ nodeType: 'embedded-asset-block', data: { target: link('Asset', id) }, content: [] });
      } catch (e) {
        imageErrors.push({ key: it.key, src: shown.slice(0, 160), error: e.message });
      }
    }
    return { content: out, firstAsset };
  }

  async function upsert(id, contentType, fields) {
    const cur = await cma('GET', `/entries/${id}`);
    if (!cur) return cma('PUT', `/entries/${id}`, { contentType, body: { fields } });
    if (fv(cur, 'slug') && fields.slug && fv(cur, 'slug') !== fields.slug[LOCALE]) fields.slug = cur.fields.slug; // байгаа slug-ийг өөрчлөхгүй
    return cma('PUT', `/entries/${id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
  }

  async function mergeExisting(it, content, firstAsset) {
    const ex = EXISTING_MERGE[it.key];
    const cur = await cma('GET', `/entries/${ex.id}`);
    const doc = cur.fields.description?.[LOCALE];
    let kept = doc?.content || [];
    const at = kept.findIndex((b) => b.nodeType === 'heading-2' && inlineText(b) === it.title);
    if (at >= 0) kept = kept.slice(0, at); // өмнөх импортыг сольж бичнэ
    const heading = { nodeType: 'heading-2', data: {}, content: [{ nodeType: 'text', value: it.title, marks: [], data: {} }] };
    const fields = {
      ...cur.fields,
      description: { ...(cur.fields.description || {}), [LOCALE]: { nodeType: 'document', data: {}, content: [...kept, heading, ...content] } },
      sourceUrl: L(it.oldUrl),
      needsReplacement: L(it.needsReplacement),
    };
    if (it.aimag) fields.provinceRef = L(link('Entry', provinceIds[B.AIMAG_SLUG[it.aimag]]));
    if (!cur.fields.seoTitle?.[LOCALE]) fields.seoTitle = L(it.seoTitle);
    if (!cur.fields.seoDescription?.[LOCALE]) fields.seoDescription = L(it.seoDescription);
    if (!DRY) await cma('PUT', `/entries/${ex.id}`, { version: cur.sys.version, body: { fields } });
  }

  async function handle(it) {
    if (it.existing === 'redirect') {
      result.entries.push({ key: it.key, title: it.title, path: it.newPath, existing: 'redirect' });
      console.log(`давхардал ${it.key} «${it.title}» → ${it.newPath}`);
      return;
    }
    const { content, firstAsset } = await resolveImages(it);
    const doc = { nodeType: 'document', data: {}, content };
    const common = {
      seoTitle: L(it.seoTitle), seoDescription: L(it.seoDescription), sourceUrl: L(it.oldUrl), needsReplacement: L(it.needsReplacement),
    };
    const img = firstAsset && firstAsset !== 'dry-run' ? { image: L(link('Asset', firstAsset)) } : {};
    const id = `tic-${it.key.replace('_', '-')}`;
    let entryId = id;
    if (it.existing === 'merge') {
      entryId = EXISTING_MERGE[it.key].id;
      await mergeExisting(it, content, firstAsset);
    } else if (it.type === 'place') {
      const fields = { title: L(it.title), slug: L(it.slug), category: L('landscape'), body: L(doc), ...img, ...common };
      if (it.aimag) fields.province = L(link('Entry', provinceIds[B.AIMAG_SLUG[it.aimag]]));
      if (it.soum) fields.soum = L(it.soum);
      if (!DRY) await upsert(id, 'place', fields);
    } else {
      const fields = {
        name: L(it.title), slug: L(it.slug), region: L(it.aimag || 'Монгол'), province: L(it.aimag || ''), description: L(doc), ...img, ...common,
      };
      if (it.aimag) fields.provinceRef = L(link('Entry', provinceIds[B.AIMAG_SLUG[it.aimag]]));
      if (it.coords) fields.coordinates = L(it.coords);
      if (!DRY) await upsert(id, 'heritagePlace', fields);
    }
    const rec = {
      id: entryId, key: it.key, title: it.title, type: it.existing ? EXISTING_MERGE[it.key].type : it.type, kind: it.kind, aimag: it.aimag, soum: it.soum,
      slug: it.slug, path: it.newPath, words: it.words, images: it.images.length, coords: it.coords, promoRemoved: it.promoRemoved,
      needsReplacement: it.needsReplacement, flags: it.flags, adLinks: it.adLinks, seoTitle: it.seoTitle, seoDescription: it.seoDescription, existing: it.existing || false,
    };
    result.entries.push(rec);
    console.log(`${DRY ? '[dry] ' : ''}${it.kind.padEnd(9)} ${it.newPath} ← ${it.key} «${it.title}» ${it.aimag || '—'}${it.soum ? '/' + it.soum : ''} (${it.words} үг, зураг ${it.images.length}${it.coords ? ', coord' : ''}${it.needsReplacement ? ', NR' : ''}${it.existing ? ', НЭГТГЭВ' : ''}) [${it.seoTitle.length}/${it.seoDescription.length}]`);
  }

  const todo = items.filter((it) => !ONLY || ONLY.includes(it.key));
  let next = 0;
  await Promise.all(Array.from({ length: DRY ? 1 : 4 }, async () => { while (next < todo.length) await handle(todo[next++]); }));
  const order = new Map(items.map((it, i) => [it.key, i]));
  result.entries.sort((a, b) => order.get(a.key) - order.get(b.key));

  // heritageCategory: Contentful-д байгаа бүх tic-c1-* heritagePlace (ONLY ажиллуулсан ч бүтэн жагсаалт)
  const heritageIds = items.filter((it) => it.type === 'heritagePlace').map((it) => `tic-${it.key.replace('_', '-')}`);
  let catIds = heritageIds;
  if (!DRY) {
    const have = new Set();
    for (let i = 0; i < heritageIds.length; i += 100) {
      const r = await cma('GET', `/entries?content_type=heritagePlace&sys.id[in]=${heritageIds.slice(i, i + 100).join(',')}&select=sys.id&limit=100`);
      r.items.forEach((e) => have.add(e.sys.id));
    }
    catIds = heritageIds.filter((id) => have.has(id));
    await upsert(CATEGORY_ID, 'heritageCategory', {
      title: L('Түүх, соёлын дурсгалт газрууд'),
      slug: L('historical-sites'),
      count: L(`Нийт ${catIds.length} газар`),
      remainingCount: L(0),
      places: L(catIds.map((id) => link('Entry', id))),
      seoTitle: L('Түүх, соёлын дурсгалт газрууд — хийд, хөшөө, хадны зураг'),
      seoDescription: L('Монголын хийд хүрээ, хүн чулуу, буган хөшөө, хадны зураг, хиргисүүр, эртний хот балгас: аймаг бүрийн түүх, соёлын дурсгалт газруудын жагсаалт, танилцуулга.'),
    });
  }
  console.log(`heritageCategory historical-sites: ${catIds.length} газар`);

  if (!ONLY) {
    const redirects = items.map((it) => [it.oldUrl, SITE + it.newPath, it.title, it.existing === 'redirect' ? 'өмнөх багцад бий' : LABEL[it.kind], it.aimag || '']);
    if (!DRY) writeCsv(path.join(ROOT, 'docs', 'redirects', 'batch-04-places.csv'), ['old_url', 'new_url', 'title', 'ангилал', 'аймаг'], redirects);
    result.redirectRows = redirects.length;
  }
  fs.writeFileSync(REPORT_JSON, JSON.stringify(result, null, 2), 'utf8');
  const c = (f) => result.entries.filter(f).length;
  console.log(`entry: ${result.entries.length} (landscape ${c((e) => e.kind === 'landscape' && !e.existing)}, heritage ${c((e) => e.kind === 'heritage' && !e.existing)}, нэгтгэсэн ${c((e) => e.existing === 'merge')}, redirect ${c((e) => e.existing === 'redirect')}), coord ${c((e) => e.coords)}, NR ${c((e) => e.needsReplacement)}, зургийн алдаа ${imageErrors.length}, CMA ${callCount()}`);
  for (const e of imageErrors) console.log('  зураг алгасав:', e.key, e.error, e.src);
})().catch((e) => { console.error(e); process.exit(1); });

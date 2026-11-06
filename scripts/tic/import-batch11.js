// TIC 11-р багц: docs/plan/tic-reconsider.csv-ийн «Аяллын андууд ХХК» (TIC-ийн өөрийн) 32 нийтлэл → Contentful `story`,
// topic «news» (8-р багцтай ижил: /stories/news/<slug>, consentObtained=false). Хувь хүн, сонин/сайтын 9 нийтлэлийг
// оруулахгүй (зөвшөөрөл хэрэгтэй, tic-reconsider.csv-д тэмдэглэнэ).
//
//   node scripts/tic/import-batch11.js fetch              # TIC HTML-ийг backups/tic-cache/batch11 руу (≥1 сек зайтай)
//   node scripts/tic/import-batch11.js write --dry        # хөрвүүлгийг шалгана, Contentful руу бичихгүй
//   node scripts/tic/import-batch11.js write              # draft үүсгэнэ/шинэчилнэ + docs/redirects/batch-11-reconsider.csv
//   node scripts/tic/import-batch11.js publish [--dry]    # asset → entry нийтэлнэ (webhook асаалттай, 32 цөөн)
//   node scripts/tic/import-batch11.js indexnow           # нийтэлсэн хаягуудыг IndexNow руу
//
// Дүрэм (8-р багцтай ижил): текстийг байгаагаар нь хуулна, TIC-ийн сурталчилгааны мөр/joinme холбоосыг хасна, зургийг
// asset болгоно. entry id = tic-n-<NewsID>, байгаа entry-ийн slug-ийг өөрчлөхгүй. Одоо байгаа мэдээтэй ижил гарчигтай бол
// шинээр үүсгэхгүй, хуучин хаягийг тэр мэдээ рүү redirect хийнэ. Устгах код алга.
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, LOCALE, sleep, callCount } = require('./_cma');
const { parseCsv, writeCsv } = require('./_csv');
const { checkBudget } = require('./_budget');
const B = require('./_batch03-06');
const { parseHtml, convert, plainText, wordCount, extractArticle } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');
const { TIC, imageOrigin, imageUrl, ensureAsset, commonsCredit, hostCredit } = require('./_assets');

const CMD = process.argv[2];
const DRY = process.argv.includes('--dry');
const SITE = 'https://www.travelhubmongolia.com';
const BASE = '/stories/news';
const CACHE = path.join(ROOT, 'backups', 'tic-cache', 'batch11');
const OLD_CACHE = path.join(ROOT, 'backups', 'tic-cache', 'batch04-08');
const RECONSIDER = path.join(ROOT, 'docs', 'plan', 'tic-reconsider.csv');
const REDIRECT_CSV = path.join(ROOT, 'docs', 'redirects', 'batch-11-reconsider.csv');
const REPORT_JSON = path.join(ROOT, 'backups', 'tic-cache', 'batch11-result.json');
const L = (v) => ({ [LOCALE]: v });
const link = (type, id) => ({ sys: { type: 'Link', linkType: type, id } });

// Сэдэв (redirect CSV-ийн «ангилал», тайланд). Бүгд мэдээний архивт (/stories/news) орно.
const TOPIC = {
  n_1956: 'Түүх', n_2168: 'Түүх', n_2127: 'Түүхэн хүн', n_2237: 'Түүх', n_1900: 'Түүхэн хүн', n_1685: 'Түүх',
  n_2286: 'Соёл', n_1876: 'Түүх', n_3325: 'Түүх', n_1310: 'Байгаль', n_916: 'Түүх', n_4397: 'Соёл',
  n_1957: 'Түүх', n_1585: 'Түүх', n_1926: 'Түүх', n_425: 'Түүхэн хүн', n_584: 'Аяллын зөвлөгөө', n_1002: 'Түүх',
  n_1388: 'Түүх', n_1427: 'Түүх', n_655: 'Соёл', n_2266: 'Түүх', n_4357: 'Аяллын зөвлөгөө', n_1539: 'Байгаль',
  n_1695: 'Соёл', n_965: 'Байгаль', n_6439: 'Байгаль', n_626: 'Соёл', n_1942: 'Нүүдэлчин ахуй', n_1638: 'Аяллын зөвлөгөө',
  n_2151: 'Соёл', n_2159: 'Аяллын зөвлөгөө',
};

const isOwn = (r) => /^Аяллын андууд ХХК/.test(r['зохиогч_ангилал']);
const loadRows = () => parseCsv(fs.readFileSync(RECONSIDER, 'utf8')).filter(isOwn);
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

// Гарчиг: 8-р багцын caseTitle (өгүүлбэрийн бичлэг, оноосон нэр том үсгээр) + энэ багцын нэрс
const AIMAG_STEMS = B.AIMAGS.map(([n]) => n.toLocaleLowerCase('mn').split('-')[0].replace(/ь$/, '')).filter((s) => !['төв', 'дархан', 'баян', 'говь', 'гов'].includes(s));
const PROPER = /^(монгол|чингис|тэрэлж|хөвсгөл|хархорин|хархорум|орхон|туул|хэрлэн|онон|алтай|хангай|богд|занабазар|сүхбаатар|лянь|бяо|ниржидмаа|чойбалсан|коростовец|манж|хятад|бат|увек|тираноз|хубилай|эрмитаж|ноён|турк|юань|цогт|азид|оросын|юнеско|торгоны|gps)/;
function caseTitle(raw) {
  const lower = raw.replace(/\s+/g, ' ').trim().toLocaleLowerCase('mn');
  let first = true;
  return lower.replace(/[\p{L}]+/gu, (w, i) => {
    const before = lower.slice(Math.max(0, i - 2), i);
    if (/^(юнеско|gps)$/.test(w)) { first = false; return w.toLocaleUpperCase('mn'); }
    const cap = first || /^[a-z]/.test(w) || /[("«“]\s?$/.test(before) || AIMAG_STEMS.some((s) => w.startsWith(s)) || PROPER.test(w);
    first = false;
    return cap ? w[0].toLocaleUpperCase('mn') + w.slice(1) : w;
  });
}

// caseTitle-ийн дараах гар засвар (товчилсон нэр, тоо, газрын нэр)
const TITLE_FIX = [
  ['и.я.Коростовецийн', 'И.Я.Коростовецийн'],
  ['эмгэнэл....', 'эмгэнэл'],
  ['13-Р зууны', '13-р зууны'],
  ['800 Жилийн', '800 жилийн'],
  ['төв Азид', 'Төв Азид'],
];

async function fetchAll() {
  fs.mkdirSync(CACHE, { recursive: true });
  let n = 0;
  for (const r of loadRows()) {
    const file = path.join(CACHE, `${r.key}.html`);
    if (fs.existsSync(file) && fs.statSync(file).size > 5000) continue;
    const old = path.join(OLD_CACHE, `${r.key}.html`);
    if (fs.existsSync(old) && fs.statSync(old).size > 5000) { fs.copyFileSync(old, file); console.log('кэшээс', r.key); continue; }
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(r['TIC_хаяг'], { headers: { 'User-Agent': 'Mozilla/5.0 TravelHubMigration' }, signal: AbortSignal.timeout(30000) });
        const html = await res.text();
        fs.writeFileSync(file, html, 'utf8');
        console.log(res.status, ++n, r.key, html.length);
        break;
      } catch (e) {
        console.log('алдаа', attempt, r.key, e.message);
        await sleep(3000 * attempt);
      }
    }
    await sleep(1100);
  }
}

async function existingStories() {
  const out = [];
  for (let skip = 0; ; skip += 1000) {
    const r = await cma('GET', `/entries?content_type=story&limit=1000&skip=${skip}&select=sys.id,fields.slug,fields.title,fields.topic`);
    out.push(...r.items);
    if (skip + 1000 >= r.total) break;
  }
  return out;
}

async function write() {
  const rows = loadRows();
  if (rows.length !== 32) throw new Error(`«Аяллын андууд ХХК» мөр ${rows.length} (32 байх ёстой)`);
  for (const r of rows) if (!TOPIC[r.key]) throw new Error(`${r.key}: сэдэв тодорхойлоогүй`);
  const stories = await existingStories();
  const usedSlugs = new Set(['news']);
  const storedSlug = new Map();
  const newsByTitle = new Map();
  for (const e of stories) {
    const slug = fv(e, 'slug');
    if (slug) usedSlugs.add(slug);
    if (slug && e.sys.id.startsWith('tic-n-')) storedSlug.set(e.sys.id, slug);
    if (fv(e, 'topic') === 'news' && slug && fv(e, 'title')) newsByTitle.set(norm(fv(e, 'title')), { id: e.sys.id, slug, title: fv(e, 'title') });
  }

  const items = [];
  for (const r of rows) {
    const file = path.join(CACHE, `${r.key}.html`);
    if (!fs.existsSync(file)) throw new Error(`${r.key}: кэшд алга — эхлээд «fetch»`);
    const art = extractArticle(fs.readFileSync(file, 'utf8'));
    if (!art) throw new Error(`${r.key}: нийтлэлийн бие олдсонгүй`);
    const blocks = convert(parseHtml(art.body), { baseUrl: TIC + '/', rewriteLink: (h) => h });
    let bs = blocks.filter((b) => !isPromo(b)).map(unwrapAdLinks);
    while (bs.length && bs[bs.length - 1].nodeType === 'hr') bs.pop();
    while (bs.length && bs[0].nodeType === 'hr') bs.shift();
    const text = plainText(bs);
    const words = wordCount(text);
    if (!words) throw new Error(`${r.key}: хоосон нийтлэл`);
    const id = `tic-${r.key.replace('_', '-')}`;
    const it = { row: r, key: r.key, id, art, blocks: bs, text, words, promoRemoved: blocks.length - bs.length, oldUrl: r['TIC_хаяг'], topic: TOPIC[r.key] };
    // Одоо байгаа мэдээтэй ижил гарчиг (өөр entry) → нэгтгэнэ
    const same = newsByTitle.get(norm(art.title));
    if (same && same.id !== id) { it.mergedInto = same; items.push(it); continue; }
    it.title = TITLE_FIX.reduce((t, [a, b]) => t.replace(a, b), caseTitle(art.title));
    if (storedSlug.has(id)) it.slug = storedSlug.get(id);
    else {
      const base = B.slugify(it.title) || r.key.replace('_', '-');
      let slug = base;
      for (let n = 2; usedSlugs.has(slug); n++) slug = `${base}-${n}`;
      usedSlugs.add(slug);
      it.slug = slug;
    }
    it.newPath = `${BASE}/${it.slug}`;
    const d = /^(\d{4})\/(\d{2})\/(\d{2})/.exec(r['огноо']);
    it.publishedDate = d ? `${d[1]}-${d[2]}-${d[3]}` : undefined;
    items.push(it);
  }
  const primaries = items.filter((it) => !it.mergedInto);

  // TIC холбоос → шинэ хаяг (энэ багц + өмнөх redirect хүснэгтүүд)
  const rewriteMap = new Map();
  for (const it of items) rewriteMap.set(ticKey(it.oldUrl), it.mergedInto ? `${BASE}/${it.mergedInto.slug}` : it.newPath);
  for (const f of fs.readdirSync(path.join(ROOT, 'docs', 'redirects'))) {
    if (!f.endsWith('.csv') || f.startsWith('batch-11')) continue;
    for (const r of parseCsv(fs.readFileSync(path.join(ROOT, 'docs', 'redirects', f), 'utf8'))) {
      const k = r.old_url && ticKey(r.old_url);
      if (k && !rewriteMap.has(k) && r.new_url) rewriteMap.set(k, r.new_url.replace(SITE, ''));
    }
  }
  const rewrite = (node) => {
    if (node.nodeType === 'hyperlink') {
      const k = ticKey(node.data.uri || '');
      if (k && rewriteMap.has(k)) node.data.uri = SITE + rewriteMap.get(k);
    }
    (node.content || []).forEach(rewrite);
  };

  for (const it of primaries) {
    it.blocks.forEach(rewrite);
    it.images = it.blocks.filter((b) => b.nodeType === '__image').map((b) => ({ src: b.src, origin: imageOrigin(b.src) }));
    const srcLines = it.text.match(/(?:Эх сурвалж|Эх үүсвэр|Сурвалж|Source)\s*:[^\n]*/gi) || [];
    it.flags = [];
    const srcLine = srcLines.join(' ');
    if (/лавлах/i.test(srcLine)) it.flags.push('Монгол орны лавлах');
    if (/сонин|medee|news|gogo|montsame|unuudur|zindaa|eagle|\.mn\b/i.test(srcLine)) it.flags.push('сонин/мэдээний сайт');
    if (!it.flags.length && srcLines.length) it.flags.push('эх сурвалж заасан');
    for (const im of it.images) if (im.origin === 'third-party') it.flags.push(`зураг: ${(() => { try { return new URL(imageUrl(im.src)).hostname; } catch { return 'гуравдагч'; } })()}`);
    it.needsReplacement = it.flags.length > 0;
    it.source = [`touristinfocenter.mn мэдээ: ${it.oldUrl}`, ...srcLines.map((s) => s.trim()), `Зохиогч (TIC): ${it.row['зохиогч_ангилал']}`].join('\n');
  }

  const plannedImages = primaries.reduce((s, it) => s + it.images.filter((i) => i.origin !== 'broken').length, 0);
  if (!DRY) await checkBudget(primaries.length + plannedImages, '11-р багц (entry + зураг)');

  const usedDesc = new Set();
  for (const it of primaries) {
    it.seoTitle = seoTitle(it.title, 'Мэдээний архив');
    it.seoDescription = seoDescription(it.text, { name: it.title, stem: it.title.split(/[ ,.-]/)[0], fallback: `Touristinfocenter.mn-ийн мэдээний архиваас${it.publishedDate ? ` (${it.publishedDate.slice(0, 4)})` : ''} — Travel Hub Mongolia.` }, usedDesc);
  }

  const imageErrors = [];
  const result = { entries: [], merged: [], imageErrors };
  for (const it of primaries) {
    const out = [], assets = [];
    let n = 0;
    for (const b of it.blocks) {
      if (b.nodeType !== '__image') { out.push(b); continue; }
      n++;
      const origin = imageOrigin(b.src);
      if (origin === 'broken') { imageErrors.push({ key: it.key, src: b.src.slice(0, 120), error: 'эвдэрсэн зам' }); continue; }
      const shown = b.src.startsWith('data:') ? 'base64 (TIC нийтлэлд шигтгэсэн)' : imageUrl(b.src);
      try {
        const credit = origin === 'third-party' && /wikimedia\.org/.test(b.src) ? (await commonsCredit(b.src)) || hostCredit(b.src)
          : origin === 'third-party' ? hostCredit(imageUrl(b.src)) : 'Зураг: touristinfocenter.mn';
        const aid = DRY ? 'dry-run' : await ensureAsset(b.src, `${it.title} — зураг ${n}`.slice(0, 250), `TIC: ${it.oldUrl} · Эх зураг: ${shown}${origin === 'tic' ? '' : ' · needsReplacement'}`, credit);
        assets.push(aid);
        out.push({ nodeType: 'embedded-asset-block', data: { target: link('Asset', aid) }, content: [] });
      } catch (e) {
        imageErrors.push({ key: it.key, src: shown.slice(0, 160), error: e.message });
      }
    }
    const media = [...new Set(assets)].filter((x) => x !== 'dry-run');
    const fields = {
      title: L(it.title.slice(0, 250)), slug: L(it.slug), topic: L('news'), body: L({ nodeType: 'document', data: {}, content: out }),
      source: L(it.source), language: L('mn'), consentObtained: L(false), seoTitle: L(it.seoTitle), seoDescription: L(it.seoDescription),
      sourceUrl: L(it.oldUrl), needsReplacement: L(it.needsReplacement),
    };
    if (media.length) fields.media = L(media.map((a) => link('Asset', a)));
    if (it.publishedDate) fields.publishedDate = L(it.publishedDate);
    if (!DRY) {
      const cur = await cma('GET', `/entries/${it.id}`);
      if (cur && fv(cur, 'slug')) fields.slug = cur.fields.slug; // байгаа slug-ийг өөрчлөхгүй
      if (cur) await cma('PUT', `/entries/${it.id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
      else await cma('PUT', `/entries/${it.id}`, { contentType: 'story', body: { fields } });
    }
    result.entries.push({ id: it.id, key: it.key, topic: it.topic, title: it.title, slug: it.slug, path: it.newPath, publishedDate: it.publishedDate, words: it.words, images: it.images.length, promoRemoved: it.promoRemoved, needsReplacement: it.needsReplacement, flags: it.flags, seoTitle: it.seoTitle, seoDescription: it.seoDescription, oldUrl: it.oldUrl });
    console.log(`${DRY ? '[dry] ' : ''}${it.newPath} ← ${it.key} «${it.title}» [${it.topic}] ${it.publishedDate || '—'} (${it.words} үг, зураг ${it.images.length}${it.needsReplacement ? ', NR ' + it.flags.join('; ') : ''}) [${it.seoTitle.length}/${it.seoDescription.length}]`);
  }
  for (const it of items.filter((x) => x.mergedInto)) {
    result.merged.push({ key: it.key, into: it.mergedInto.id, path: `${BASE}/${it.mergedInto.slug}`, title: it.mergedInto.title, oldUrl: it.oldUrl, topic: it.topic });
    console.log(`нэгтгэв: ${it.key} → ${it.mergedInto.id} ${BASE}/${it.mergedInto.slug}`);
  }

  const redirects = items.map((it) => it.mergedInto
    ? [it.oldUrl, `${SITE}${BASE}/${it.mergedInto.slug}`, it.mergedInto.title, `Мэдээ — ${it.topic} (одоо байгаа мэдээтэй нэгтгэсэн)`, '']
    : [it.oldUrl, SITE + it.newPath, it.title, `Мэдээ — ${it.topic}`, '']);
  if (!DRY) writeCsv(REDIRECT_CSV, ['old_url', 'new_url', 'title', 'ангилал', 'аймаг'], redirects);
  fs.writeFileSync(REPORT_JSON.replace('.json', DRY ? '-dry.json' : '.json'), JSON.stringify(result, null, 2), 'utf8');
  const byTopic = {};
  for (const it of items) byTopic[it.topic] = (byTopic[it.topic] || 0) + 1;
  console.log(`entry ${result.entries.length}, нэгтгэсэн ${result.merged.length}, redirect ${redirects.length}, сэдвээр ${JSON.stringify(byTopic)}, зургийн алдаа ${imageErrors.length}, CMA ${callCount()}`);
  for (const e of imageErrors) console.log('  зураг алгасав:', e.key, e.error, e.src);
}

function assetIds(fields) {
  const ids = new Set();
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (n.sys?.type === 'Link' && n.sys.linkType === 'Asset') ids.add(n.sys.id);
    for (const v of Object.values(n)) walk(v);
  };
  walk(fields);
  return ids;
}

async function publish() {
  const { entries } = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf8'));
  const tally = {};
  const bump = (k) => { tally[k] = (tally[k] || 0) + 1; };
  const one = async (kind, id) => {
    const cur = await cma('GET', `/${kind}/${id}`);
    if (!cur) return bump(`${kind} алга`);
    if (cur.sys.publishedVersion && cur.sys.version === cur.sys.publishedVersion + 1) return bump(`${kind} аль хэдийн`);
    if (kind === 'assets' && !cur.fields?.file) return bump('asset файлгүй (алгасав)');
    if (DRY) return bump(`${kind} нийтлэх`);
    await cma('PUT', `/${kind}/${id}/published`, { version: cur.sys.version });
    bump(`${kind} нийтлэв`);
  };
  const full = [];
  for (const e of entries) full.push(await cma('GET', `/entries/${e.id}`));
  const assets = new Set();
  for (const e of full) for (const id of assetIds(e.fields)) assets.add(id);
  for (const id of assets) await one('assets', id);
  for (const e of entries) await one('entries', e.id);
  console.log(JSON.stringify(tally), 'CMA', callCount());
}

async function indexnow() {
  const { entries } = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf8'));
  const KEY = 'dcea2c855862a6fe6bba7a250c8920c3';
  const urls = [...entries.map((e) => SITE + e.path), `${SITE}${BASE}`];
  if (DRY) return console.log(urls.join('\n'));
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls }),
  });
  console.log(`IndexNow ${urls.length} URL: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
}

const run = { fetch: fetchAll, write, publish, indexnow }[CMD];
if (!run) { console.error('fetch | write [--dry] | publish [--dry] | indexnow [--dry]'); process.exit(1); }
run().catch((e) => { console.error(e); process.exit(1); });

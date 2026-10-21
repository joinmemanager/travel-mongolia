// TIC 10-р багц: шийдээгүй 304 нийтлэл → cultureArticle (бүгд Draft).
//   cate14 TypeID 1 (угсаатан)      → section ethnic-groups → /about/culture/ethnic-groups/<slug>
//   cate14 TypeID 3 (түүхэн хүмүүс) → section people        → /about/history/people/<slug>
//   cate15 (шашин шүтлэг)           → section religion      → /about/culture/religion/<slug>
//   cate16 (зан заншил)             → section traditions    → /about/traditions/<slug>
// Ажиллуулах (repo-ийн үндсэн хавтаснаас):
//   node scripts/tic/fetch-batch04-08.js backups/tic-cache/batch10 14,15,16
//   node scripts/tic/schema-batch10.js
//   node scripts/tic/import-batch10.js backups/tic-cache/batch10 --dry
//   node scripts/tic/import-batch10.js backups/tic-cache/batch10      # + docs/redirects/batch-10-people-culture.csv
// Дүрэм (өмнөх багцуудтай ижил): текстийг байгаагаар нь хуулна, зөвхөн TIC-ийн сурталчилгааны мөрийг хасна.
// Гарчиг: TIC хуудасны <title> тагийн бичлэг (lName нь ТОМ үсгээр). Зургийг asset (Draft) болгоно.
// sourceUrl = TIC хаяг, needsReplacement = лавлах ном/гуравдагч зураг. Idempotent: entry id = tic-c<ангилал>-<ItemID>,
// байгаа entry-ийн slug-ийг өөрчлөхгүй.
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, LOCALE, callCount } = require('./_cma');
const { loadInventory, parseCsv, writeCsv } = require('./_csv');
const { parseHtml, convert, plainText, wordCount, extractArticle, decode } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');
const { TIC, imageOrigin, imageUrl, ensureAsset } = require('./_assets');
const { checkBudget } = require('./_budget');
const B = require('./_batch03-06');

const CACHE = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }

const SITE = 'https://www.travelhubmongolia.com';
const REPORT_JSON = path.join(ROOT, 'backups', 'tic-cache', 'batch10-result.json');
const L = (v) => ({ [LOCALE]: v });
const SECTION = {
  'ethnic-groups': { base: '/about/culture/ethnic-groups', label: 'Угсаатнууд', csv: 'Угсаатан' },
  people: { base: '/about/history/people', label: 'Түүхэн хүмүүс', csv: 'Түүхэн хүн' },
  religion: { base: '/about/culture/religion', label: 'Шашин шүтлэг', csv: 'Шашин шүтлэг' },
  traditions: { base: '/about/traditions', label: 'Монгол зан заншил', csv: 'Зан заншил' },
};
function sectionOf(r) {
  const c = r['ангилал'];
  if (c === '14') return r['TypeID'] === '1' ? 'ethnic-groups' : r['TypeID'] === '3' ? 'people' : null;
  if (c === '15') return 'religion';
  if (c === '16') return 'traditions';
  return null;
}

const ticKey = (url) => { const m = /touristinfocenter\.mn(\/[^#]*)/i.exec(url); return m ? m[1].toLowerCase() : null; };
const inlineText = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(inlineText).join(''));
const isPromo = (b) => b.nodeType === 'paragraph' && /илүү их мэдээ мэдээллийг/i.test(inlineText(b)) && /joinme\.mn/.test(JSON.stringify(b));

// <title> тагийн гарчиг: үсгүүд нь inventory-ийн гарчигтай таарвал түүний бичлэгийг авна
function titleOf(html, invTitle) {
  const m = /<title>([\s\S]*?)<\/title>/i.exec(html);
  const tag = m ? decode(m[1]).replace(/::\s*www\.touristinfocenter\.mn\s*$/i, '').replace(/\s+/g, ' ').trim() : '';
  const letters = (s) => s.toLocaleLowerCase('mn').replace(/[^\p{L}\p{N}]/gu, '');
  if (tag && letters(tag) === letters(invTitle)) {
    // TIC-ийн онцлох ТОМ үсгийн үг (4+ үсэг) → эхний үсэг том; товчлол хэвээр
    const t = tag.replace(/[А-ЯЁӨҮ]{4,}/gu, (w) => (/^(ЮНЕСКО|МУИС|ХААИС)$/.test(w) ? w : w[0] + w.slice(1).toLocaleLowerCase('mn')));
    return t[0].toLocaleUpperCase('mn') + t.slice(1);
  }
  return B.caseTitle(B.cleanTitle(invTitle));
}

function prepare(rows) {
  return rows.map((r) => {
    const html = fs.readFileSync(path.join(CACHE, `${r.key}.html`), 'utf8');
    const art = extractArticle(html);
    if (!art) throw new Error(`${r.key}: нийтлэлийн бие олдсонгүй`);
    const section = sectionOf(r);
    return { row: r, art, html, section, title: titleOf(html, r['гарчиг']), oldUrl: TIC + r['хуучин_url'], id: `tic-c${r['ангилал']}-${/ItemID=(\d+)/i.exec(r['хуучин_url'])[1]}` };
  });
}

async function resolveImages(it, report) {
  const out = [];
  let firstAsset = null;
  let n = 0;
  for (const b of it.blocks) {
    if (b.nodeType !== '__image') { out.push(b); continue; }
    n++;
    const origin = imageOrigin(b.src);
    if (origin === 'broken') { report.push({ key: it.row.key, src: b.src, error: 'эвдэрсэн зам' }); continue; }
    const shown = b.src.startsWith('data:') ? 'base64 (TIC нийтлэлд шигтгэсэн)' : imageUrl(b.src);
    const credit = origin === 'third-party' ? `Зураг: ${new URL(b.src).hostname.replace(/^www\./, '')}` : 'Зураг: touristinfocenter.mn';
    try {
      const id = DRY ? 'dry-run' : await ensureAsset(b.src, `${it.title} — зураг ${n}`, `TIC: ${it.oldUrl} · Эх зураг: ${shown}${origin === 'tic' ? '' : ' · needsReplacement'}`, credit);
      firstAsset = firstAsset || id;
      out.push({ nodeType: 'embedded-asset-block', data: { target: { sys: { type: 'Link', linkType: 'Asset', id } } }, content: [] });
    } catch (e) {
      report.push({ key: it.row.key, src: shown.slice(0, 160), error: e.message });
    }
  }
  return { content: out, firstAsset };
}

(async () => {
  const inv = loadInventory();
  const rows = inv.filter((r) => sectionOf(r));
  console.log('нийтлэл', rows.length, Object.fromEntries(Object.keys(SECTION).map((s) => [s, rows.filter((r) => sectionOf(r) === s).length])));
  const items = prepare(rows);

  // Одоо байгаа entry-ийн slug-ийг хадгална; хэсэг дотор давтагдахгүй
  const existing = await cma('GET', '/entries?content_type=cultureArticle&limit=1000&select=sys.id,fields.slug,fields.section');
  const storedSlug = new Map(existing.items.map((e) => [e.sys.id, fv(e, 'slug')]));
  const used = Object.fromEntries(Object.keys(SECTION).map((s) => [s, new Set()]));
  for (const e of existing.items) used[fv(e, 'section')]?.add(fv(e, 'slug'));
  for (const it of items) {
    if (storedSlug.has(it.id)) { it.slug = storedSlug.get(it.id); continue; }
    const base = B.slugify(it.title) || it.id;
    let slug = base;
    for (let n = 2; used[it.section].has(slug); n++) slug = `${base}-${n}`;
    used[it.section].add(slug);
    it.slug = slug;
  }
  for (const it of items) it.newPath = `${SECTION[it.section].base}/${it.slug}`;

  // TIC холбоос → шинэ хаяг (энэ багц + өмнөх бүх redirect хүснэгт)
  const redirectOf = new Map(items.map((it) => [ticKey(it.oldUrl), it.newPath]));
  const dir = path.join(ROOT, 'docs', 'redirects');
  for (const f of fs.readdirSync(dir).filter((x) => /^batch-0.*\.csv$/.test(x))) {
    for (const r of parseCsv(fs.readFileSync(path.join(dir, f), 'utf8'))) if (!redirectOf.has(ticKey(r.old_url))) redirectOf.set(ticKey(r.old_url), r.new_url.replace(SITE, ''));
  }
  const rewriteLink = (href) => { const k = ticKey(href); return k && redirectOf.has(k) ? SITE + redirectOf.get(k) : href; };

  for (const it of items) {
    const all = convert(parseHtml(it.art.body), { baseUrl: TIC + '/', rewriteLink });
    const promo = all.findIndex(isPromo);
    it.promoRemoved = promo >= 0 ? 1 : 0;
    const bs = (promo >= 0 ? all.slice(0, promo) : all).filter((b) => !isPromo(b));
    while (bs.length && bs[bs.length - 1].nodeType === 'hr') bs.pop();
    while (bs.length && bs[0].nodeType === 'hr') bs.shift();
    it.blocks = bs;
    it.text = plainText(bs);
    it.words = wordCount(it.text);
    it.images = bs.filter((b) => b.nodeType === '__image').map((b) => ({ src: b.src, origin: imageOrigin(b.src) }));
    const srcLine = (it.text.match(/Эх сурвалж:[^\n]*/gi) || []).join(' ') + ' ' + (it.row['зохиогч_эх_сурвалж'] || '');
    it.flags = [];
    if (/лавлах/i.test(srcLine)) it.flags.push('Монгол орны лавлах');
    if (/улаан ном/i.test(srcLine)) it.flags.push('Улаан ном');
    if (/facebook/i.test(srcLine)) it.flags.push('эх сурвалж: Facebook (хувь хүн)');
    for (const im of it.images) if (im.origin !== 'tic' && im.origin !== 'base64') it.flags.push(`зураг: ${im.origin === 'third-party' ? new URL(im.src).hostname : im.origin}`);
    it.needsReplacement = it.flags.length > 0;
  }

  const empty = items.filter((it) => !it.words);
  if (empty.length) console.log('хоосон нийтлэл:', empty.map((x) => x.row.key).join(', '));
  if (!DRY) await checkBudget(items.length + items.reduce((n, it) => n + it.images.length, 0), '10-р багц');

  const usedDesc = new Set();
  const imageErrors = [];
  const result = { entries: [], imageErrors };
  let order = 0;
  for (const it of items) {
    it.seoTitle = seoTitle(it.title, SECTION[it.section].label);
    it.seoDescription = seoDescription(it.text || it.title, { name: it.title, stem: it.title.split(/[ ,.]/)[0], fallback: `${SECTION[it.section].label} — Travel Hub Mongolia.` }, usedDesc);
    const { content, firstAsset } = await resolveImages(it, imageErrors);
    const fields = {
      title: L(it.title),
      slug: L(it.slug),
      section: L(it.section),
      order: L(++order),
      body: L({ nodeType: 'document', data: {}, content }),
      seoTitle: L(it.seoTitle),
      seoDescription: L(it.seoDescription),
      sourceUrl: L(it.oldUrl),
      needsReplacement: L(it.needsReplacement),
    };
    if (firstAsset) fields.image = L({ sys: { type: 'Link', linkType: 'Asset', id: firstAsset } });
    if (!DRY) {
      const cur = await cma('GET', `/entries/${it.id}`);
      if (!cur) await cma('PUT', `/entries/${it.id}`, { contentType: 'cultureArticle', body: { fields } });
      else await cma('PUT', `/entries/${it.id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields, slug: cur.fields.slug } } });
    }
    result.entries.push({ id: it.id, key: it.row.key, section: it.section, title: it.title, slug: it.slug, path: it.newPath, words: it.words, images: it.images.length, needsReplacement: it.needsReplacement, flags: it.flags, seoTitle: it.seoTitle, seoDescription: it.seoDescription, oldUrl: it.oldUrl });
    console.log(`${DRY ? '[dry] ' : ''}${it.newPath} ← ${it.row.key} «${it.title}» (${it.words} үг, зураг ${it.images.length}${it.needsReplacement ? ', NR' : ''}) [${it.seoTitle.length}/${it.seoDescription.length}]`);
  }

  const redirects = result.entries.map((e) => [e.oldUrl, SITE + e.path, e.title, SECTION[e.section].csv, '']);
  if (!DRY) writeCsv(path.join(ROOT, 'docs', 'redirects', 'batch-10-people-culture.csv'), ['old_url', 'new_url', 'title', 'ангилал', 'аймаг'], redirects);
  result.redirectRows = redirects.length;
  fs.writeFileSync(REPORT_JSON, JSON.stringify(result, null, 2), 'utf8');
  console.log(`entry ${result.entries.length}, redirect ${redirects.length}, зургийн алдаа ${imageErrors.length}, CMA ${callCount()}`);
  for (const e of imageErrors) console.log('  зураг алгасав:', e.key, e.error, e.src);
})().catch((e) => { console.error(e); process.exit(1); });

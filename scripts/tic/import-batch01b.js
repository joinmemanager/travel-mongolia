// TIC 1б багц: Архангайгаас бусад 20 аймгийн сумд + Улаанбаатарын дүүргүүдийг soum төрлөөр Contentful-д
// Draft-аар оруулна (publish хийхгүй).
//
// Ажиллуулах (repo-ийн үндсэн хавтаснаас):
//   node scripts/tic/fetch-batch01b.js <кэш>          # TIC HTML-ийг татна
//   node scripts/tic/import-batch01b.js <кэш> --dry   # Contentful-д бичихгүй, зөвхөн тайлан
//   node scripts/tic/import-batch01b.js <кэш>         # импорт + docs/redirects/batch-01b-soums.csv
// soum төрөл, province-ийн талбарууд 1-р багцад үүссэн (schema-batch01.js).
//
// Дүрэм (1-р багцтай ижил):
//  - TIC-ийн текстийг өөрчлөхгүй хуулна. Зөвхөн TIC-ийн нийтлэл бүрийн төгсгөлийн сурталчилгааны мөрийг
//    («… илүү их мэдээ мэдээллийг ЭНД дарж аваарай», joinme.mn холбоостой) 2-р багцын адил хасна. Түүний
//    араас англи хувилбар байвал өөрчлөхгүйгээр en locale-д хадгална.
//  - Сум: 150-аас дээш үгтэй бол ownPage=true (/province/<аймаг>/<сум>), бусад нь аймгийн хуудасны «Сумд»
//    хэсэгт задардаг жагсаалтаар (#<сум>).
//  - TIC дотор давхардсан сумын нийтлэлээс урт хувилбарыг нь авна (тэнцүү бол inventory-д ХУУЛАХ гэснийг),
//    бүх хуучин хаяг нэг шинэ хаяг руу.
//  - Зургийг татаж Contentful asset (Draft) болгоно. Credit: Wikimedia бол зохиогч, лиценз (Commons API),
//    бусад нь эх сайт.
//  - sourceUrl = TIC-ийн эх хаяг. needsReplacement = «Монгол орны лавлах»/«Улаан ном»/Facebook-ээс авсан
//    текст эсвэл TIC-ээс өөр сайтын зурагтай (Wikimedia-гийн чөлөөт лицензтэй зургаас бусад).
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, LOCALE, callCount } = require('./_cma');
const { loadInventory, parseCsv, writeCsv } = require('./_csv');
const { batch01bRows } = require('./_batch01b');
const { parseHtml, convert, plainText, wordCount, extractArticle } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');
const { TIC, imageOrigin, imageUrl, ensureAsset, commonsCredit, hostCredit } = require('./_assets');

const CACHE = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }

const SITE = 'https://www.travelhubmongolia.com';
const OWN_PAGE_MIN_WORDS = 150;
const REPORT_JSON = path.join(CACHE, '..', 'batch01b-result.json');
const L = (v) => ({ [LOCALE]: v });

const SLUG_MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'ye', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l',
  м: 'm', н: 'n', о: 'o', ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f', х: 'kh', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
const slugify = (s) =>
  [...s.toLowerCase()].map((c) => (c in SLUG_MAP ? SLUG_MAP[c] : /[a-z0-9]/.test(c) ? c : '-')).join('').replace(/-+/g, '-').replace(/^-|-$/g, '');

const ticKey = (url) => {
  const m = /touristinfocenter\.mn(\/[^#]*)/i.exec(url);
  return m ? m[1].toLowerCase() : null;
};

const inlineText = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(inlineText).join(''));
// TIC-ийн нийтлэл бүрийн төгсгөлийн сурталчилгааны догол мөр
const isPromo = (b) => b.nodeType === 'paragraph' && /илүү их мэдээ мэдээллийг/i.test(inlineText(b)) && /joinme\.mn/.test(JSON.stringify(b));
const trimHr = (bs) => {
  while (bs.length && bs[bs.length - 1].nodeType === 'hr') bs.pop();
  while (bs.length && bs[0].nodeType === 'hr') bs.shift();
  return bs;
};
const isWikimedia = (src) => /upload\.wikimedia\.org/i.test(src);

// 1-р багцын redirect (аймаг, Архангайн сумд): багц доторх TIC холбоосыг шинэ хаяг руу солиход
function batch01Redirects() {
  const file = path.join(ROOT, 'docs', 'redirects', 'batch-01-aimags.csv');
  const map = new Map();
  for (const r of parseCsv(fs.readFileSync(file, 'utf8'))) map.set(ticKey(r.old_url), r.new_url.replace(SITE, ''));
  return map;
}

function prepare(selected) {
  const items = selected.map(({ row: r, parsed: p }) => {
    const art = extractArticle(fs.readFileSync(path.join(CACHE, `${r.key}.html`), 'utf8'));
    if (!art) throw new Error(`${r.key}: нийтлэлийн бие олдсонгүй`);
    return {
      row: r, art, aimag: p.aimag, unit: p.unit, name: p.name, slug: slugify(p.base), provinceSlug: p.provinceSlug,
      oldUrl: TIC + r['хуучин_url'],
    };
  });
  // Бие хэсгийг хувааж, үгийн тоог тоолно (сурталчилгааны мөр, англи хэсгээс бусад)
  const split = (it, rewriteLink) => {
    const all = convert(parseHtml(it.art.body), { baseUrl: TIC + '/', rewriteLink });
    const promo = all.findIndex(isPromo);
    it.promoRemoved = promo >= 0;
    it.blocks = trimHr(promo >= 0 ? all.slice(0, promo) : all);
    it.enBlocks = promo >= 0 ? trimHr(all.slice(promo + 1).filter((b) => !isPromo(b))) : [];
    it.text = plainText(it.blocks);
    it.words = wordCount(it.text);
  };
  for (const it of items) split(it);

  // Давхардал: нэг аймгийн нэг slug → хамгийн урт нь (тэнцүү бол ХУУЛАХ, дараа нь эхний ItemID)
  const groups = new Map();
  for (const it of items) {
    const k = `${it.provinceSlug}/${it.slug}`;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(it);
  }
  const num = (it) => Number(it.row.key.split('_')[1]);
  const primaries = [];
  for (const group of groups.values()) {
    group.sort((a, b) => b.words - a.words || (a.row['шийдвэр'] === 'ХУУЛАХ' ? -1 : 0) - (b.row['шийдвэр'] === 'ХУУЛАХ' ? -1 : 0) || num(a) - num(b));
    const [main, ...dups] = group;
    main.duplicates = dups;
    primaries.push(main);
  }
  const redirectOf = batch01Redirects();
  for (const it of primaries) {
    it.ownPage = it.words > OWN_PAGE_MIN_WORDS;
    it.newPath = it.ownPage ? `/province/${it.provinceSlug}/${it.slug}` : `/province/${it.provinceSlug}#${it.slug}`;
    for (const x of [it, ...it.duplicates]) redirectOf.set(ticKey(x.oldUrl), it.newPath);
  }
  const rewriteLink = (href) => {
    const k = ticKey(href);
    return k && redirectOf.has(k) ? SITE + redirectOf.get(k) : href;
  };
  for (const it of primaries) {
    split(it, rewriteLink);
    if (it.enBlocks.some((b) => b.nodeType === '__image')) throw new Error(`${it.row.key}: англи хэсэгт зураг байна`);
    it.enWords = wordCount(plainText(it.enBlocks));
    it.images = it.blocks.filter((b) => b.nodeType === '__image').map((b) => ({ src: b.src, origin: imageOrigin(b.src) }));
    const srcLine = (it.text.match(/Эх сурвалж[^\n]*/gi) || []).join(' ') + ' ' + it.row['зохиогч_эх_сурвалж'];
    it.flags = [];
    if (/лавлах/i.test(srcLine)) it.flags.push('Монгол орны лавлах');
    if (/улаан ном/i.test(srcLine)) it.flags.push('Улаан ном');
    if (/facebook/i.test(srcLine)) it.flags.push('эх сурвалж: Facebook');
    for (const im of it.images) {
      if (im.origin === 'base64') it.flags.push('зураг: base64 (эх нь тодорхойгүй)');
      else if (im.origin === 'third-party' && !isWikimedia(im.src)) it.flags.push(`зураг: ${new URL(im.src).hostname}`);
    }
    if (it.enWords) it.flags.push('en хувилбар: эх сурвалж тодорхойгүй');
    it.needsReplacement = it.flags.length > 0;
  }
  return primaries;
}

// Зургийн түр зангилааг asset-аар солих (татаж чадаагүй бол хасна)
async function resolveImages(it, report) {
  const out = [];
  let firstAsset = null;
  let n = 0;
  for (const b of it.blocks) {
    if (b.nodeType !== '__image') { out.push(b); continue; }
    n++;
    const origin = imageOrigin(b.src);
    if (origin === 'broken') { report.push({ key: it.row.key, name: it.name, src: b.src, error: 'эвдэрсэн зам' }); continue; }
    const shown = b.src.startsWith('data:') ? 'base64 (TIC нийтлэлд шигтгэсэн)' : imageUrl(b.src);
    try {
      let credit = null;
      if (isWikimedia(b.src)) {
        credit = await commonsCredit(b.src);
        if (credit) it.credits.push(credit);
        else it.flags.push(`зураг: Wikimedia (лиценз олдсонгүй)`);
      }
      credit = credit || hostCredit(origin === 'tic' || origin === 'base64' ? 'base64' : b.src);
      const note = `TIC: ${it.oldUrl} · Эх зураг: ${shown}${origin === 'tic' || credit.includes('Wikimedia Commons') ? '' : ' · needsReplacement'}`;
      const id = DRY ? 'dry-run' : await ensureAsset(b.src, `${it.name} — зураг ${n}`, note, credit);
      firstAsset = firstAsset || id;
      out.push({ nodeType: 'embedded-asset-block', data: { target: { sys: { type: 'Link', linkType: 'Asset', id } } }, content: [] });
    } catch (e) {
      report.push({ key: it.row.key, name: it.name, src: shown.slice(0, 160), error: e.message });
    }
  }
  return { content: out, firstAsset };
}

async function upsert(id, fields) {
  const cur = await cma('GET', `/entries/${id}`);
  if (!cur) return cma('PUT', `/entries/${id}`, { contentType: 'soum', body: { fields } });
  return cma('PUT', `/entries/${id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
}

(async () => {
  const items = prepare(batch01bRows(loadInventory())).sort(
    (a, b) => a.provinceSlug.localeCompare(b.provinceSlug) || a.name.localeCompare(b.name, 'mn')
  );
  const provinces = (await cma('GET', '/entries?content_type=province&limit=200')).items;
  const provinceIdBySlug = Object.fromEntries(provinces.map((p) => [fv(p, 'slug'), p.sys.id]));
  // seoDescription давхардахгүй: өмнө оруулсан сумдын тайлбартай ч харьцуулна
  const existingSoums = (await cma('GET', '/entries?content_type=soum&limit=1000')).items;
  const batchIds = new Set(items.map((it) => `tic-c13-${it.row.key.split('_')[1]}`));
  const usedDesc = new Set(existingSoums.filter((s) => !batchIds.has(s.sys.id)).map((s) => fv(s, 'seoDescription')).filter(Boolean));
  const imageErrors = [];
  const result = { soums: [], imageErrors };

  for (const it of items) {
    const provinceId = provinceIdBySlug[it.provinceSlug];
    if (!provinceId) throw new Error(`${it.name}: аймгийн entry олдсонгүй (${it.provinceSlug})`);
    const isUb = it.provinceSlug === 'ulaanbaatar';
    const parent = isUb ? 'Улаанбаатар хот' : `${it.aimag} аймаг`;
    const fallback = isUb
      ? 'Улаанбаатар хотын дүүргийн танилцуулга: түүх, газар нутаг, үзэх газрууд.'
      : `${it.aimag} аймгийн сумын танилцуулга: түүх, газар нутаг, байгаль.`;
    it.credits = [];
    it.seoTitle = seoTitle(it.name, parent);
    it.seoDescription = seoDescription(it.text, { name: `${it.name}, ${parent}`, stem: it.name.replace(/ (сум|дүүрэг|хот|тосгон)$/, ''), fallback }, usedDesc);
    const id = `tic-c13-${it.row.key.split('_')[1]}`;
    const { content, firstAsset } = await resolveImages(it, imageErrors);
    it.needsReplacement = it.flags.length > 0;
    const fields = {
      title: L(it.name),
      slug: L(it.slug),
      province: L({ sys: { type: 'Link', linkType: 'Entry', id: provinceId } }),
      ownPage: L(it.ownPage),
      body: {
        [LOCALE]: { nodeType: 'document', data: {}, content },
        ...(it.enBlocks.length ? { en: { nodeType: 'document', data: {}, content: it.enBlocks } } : {}),
      },
      seoTitle: L(it.seoTitle),
      seoDescription: L(it.seoDescription),
      sourceUrl: L(it.oldUrl),
      needsReplacement: L(it.needsReplacement),
    };
    if (firstAsset) fields.image = L({ sys: { type: 'Link', linkType: 'Asset', id: firstAsset } });
    if (!DRY) await upsert(id, fields);
    result.soums.push({
      id, key: it.row.key, aimag: it.aimag, provinceSlug: it.provinceSlug, name: it.name, slug: it.slug, words: it.words, enWords: it.enWords,
      ownPage: it.ownPage, images: it.images.length, promoRemoved: it.promoRemoved, needsReplacement: it.needsReplacement, flags: it.flags,
      credits: it.credits, seoTitle: it.seoTitle, seoDescription: it.seoDescription,
      oldUrls: [it.oldUrl, ...it.duplicates.map((d) => d.oldUrl)], dupKeys: it.duplicates.map((d) => d.row.key), newPath: it.newPath,
    });
    console.log(`${DRY ? '[dry] ' : ''}${it.provinceSlug}/${it.slug} ← ${it.row.key}${it.duplicates.length ? ' (+' + it.duplicates.map((d) => d.row.key).join(',') + ')' : ''} ${it.words} үг ${it.ownPage ? 'ХУУДАС' : 'жагсаалт'}${it.promoRemoved ? ' [сурталчилгаа хасав]' : ''}${it.enWords ? ` en ${it.enWords}` : ''} [${it.seoTitle.length}/${it.seoDescription.length}]`);
  }

  // Redirect хүснэгт: хуучин TIC хаяг бүр нэг мөр
  const redirects = [];
  for (const x of result.soums) for (const old of x.oldUrls) redirects.push([old, SITE + x.newPath, x.name, x.aimag]);
  if (!DRY) writeCsv(path.join(ROOT, 'docs', 'redirects', 'batch-01b-soums.csv'), ['old_url', 'new_url', 'title', 'аймаг'], redirects);
  result.redirectRows = redirects.length;
  fs.writeFileSync(REPORT_JSON, JSON.stringify(result, null, 2), 'utf8');
  console.log(`сум ${result.soums.length}, redirect мөр: ${redirects.length}, зургийн алдаа: ${imageErrors.length}, CMA дуудлага: ${callCount()}`);
  for (const e of imageErrors) console.log('  зураг алгасав:', e.key, e.error, e.src);
})().catch((e) => { console.error(e); process.exit(1); });

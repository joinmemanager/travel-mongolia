// TIC 2-р багц: «Монголын түүх» (cate14, TypeID=2, 44 нийтлэл) → historyArticle, бүгд Draft.
//
// Ажиллуулах (repo-ийн үндсэн хавтаснаас):
//   node scripts/tic/fetch-batch02.js <кэш>          # TIC HTML-ийг татна
//   node scripts/tic/schema-batch02.js               # historyArticle төрөл
//   node scripts/tic/import-batch02.js <кэш> --dry   # Contentful-д бичихгүй, зөвхөн тайлан
//   node scripts/tic/import-batch02.js <кэш>         # импорт + docs/redirects/batch-02-history.csv
//
// Дүрэм (1-р багцтай ижил):
//  - TIC-ийн текстийг өөрчлөхгүй хуулна. Зөвхөн нийтлэл бүрийн төгсгөлд TIC-ийн тавьдаг сурталчилгааны
//    мөрийг («Та аялал, амралтын талаарх илүү их мэдээ мэдээллийг ЭНД дарж аваарай», joinme.mn
//    холбоостой) хасна. Гарчгийг ТОМ үсгээс энгийн бичлэг рүү шилжүүлсэн (_batch02.js ARTICLES).
//  - Зургийг татаж Contentful asset (Draft) болгоно, credit: «Зураг: touristinfocenter.mn».
//  - sourceUrl = TIC-ийн эх хаяг. needsReplacement = «Монгол орны лавлах»/«Улаан ном»/Facebook-ээс
//    авсан текст эсвэл TIC-ээс өөр сайтын зурагтай.
//  - Багц доторх TIC холбоосыг шинэ хаяг руу солино.
const fs = require('fs');
const path = require('path');
const { cma, ROOT, LOCALE, callCount } = require('./_cma');
const { loadInventory, writeCsv } = require('./_csv');
const { batch02Rows, historySlug, ARTICLES } = require('./_batch02');
const { parseHtml, convert, plainText, wordCount, extractArticle } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');
const { TIC, imageOrigin, imageUrl, ensureAsset } = require('./_assets');

const CACHE = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }

const SITE = 'https://www.travelhubmongolia.com';
const REPORT_JSON = path.join(CACHE, '..', 'batch02-result.json');
const L = (v) => ({ [LOCALE]: v });
const ticKey = (url) => {
  const m = /touristinfocenter\.mn(\/[^#]*)/i.exec(url);
  return m ? m[1].toLowerCase() : null;
};

const inlineText = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(inlineText).join(''));
// TIC-ийн нийтлэл бүрийн төгсгөлийн сурталчилгааны догол мөр
const isPromo = (b) => b.nodeType === 'paragraph' && /илүү их мэдээ мэдээллийг/i.test(inlineText(b)) && /joinme\.mn/.test(JSON.stringify(b));

function prepare(rows) {
  const items = rows.map((r) => {
    const art = extractArticle(fs.readFileSync(path.join(CACHE, `${r.key}.html`), 'utf8'));
    if (!art) throw new Error(`${r.key}: нийтлэлийн бие олдсонгүй`);
    const [period, order, title] = ARTICLES[r.key];
    const slug = historySlug(r);
    return { row: r, art, period, order, title, slug, newPath: `/about/history/${slug}`, oldUrl: TIC + r['хуучин_url'] };
  });
  const redirectOf = new Map(items.map((it) => [ticKey(it.oldUrl), it.newPath]));
  const rewriteLink = (href) => {
    const k = ticKey(href);
    return k && redirectOf.has(k) ? SITE + redirectOf.get(k) : href;
  };
  for (const it of items) {
    const all = convert(parseHtml(it.art.body), { baseUrl: TIC + '/', rewriteLink });
    // Сурталчилгааны мөрийн өмнөх нь монгол текст. Зарим нийтлэлд түүний дараа англи хувилбар
    // (ихэвчлэн Carl Robinson «Mongolia: Nomad Empire of Eternal Blue Sky» номоос) бий: түүнийг
    // өөрчлөхгүйгээр en locale-д хадгална (сайт mn-ийг харуулдаг тул харагдахгүй).
    const promo = all.findIndex(isPromo);
    it.promoRemoved = promo >= 0 ? 1 : 0;
    const blocks = promo >= 0 ? all.slice(0, promo) : all;
    const trim = (bs) => {
      while (bs.length && bs[bs.length - 1].nodeType === 'hr') bs.pop();
      while (bs.length && bs[0].nodeType === 'hr') bs.shift();
      return bs;
    };
    trim(blocks);
    it.enBlocks = promo >= 0 ? trim(all.slice(promo + 1).filter((b) => !isPromo(b))) : [];
    if (it.enBlocks.some((b) => b.nodeType === '__image')) throw new Error(`${it.row.key}: англи хэсэгт зураг байна`);
    it.blocks = blocks;
    it.text = plainText(blocks);
    it.words = wordCount(it.text);
    it.images = blocks.filter((b) => b.nodeType === '__image').map((b) => ({ src: b.src, origin: imageOrigin(b.src) }));
    const srcLine = (it.text.match(/Эх сурвалж:[^\n]*/gi) || []).join(' ') + ' ' + it.row['зохиогч_эх_сурвалж'];
    it.flags = [];
    if (/лавлах/i.test(srcLine)) it.flags.push('Монгол орны лавлах');
    if (/улаан ном/i.test(srcLine)) it.flags.push('Улаан ном');
    if (/facebook/i.test(srcLine)) it.flags.push('эх сурвалж: Facebook (хувь хүн)');
    for (const im of it.images) if (im.origin !== 'tic') it.flags.push(`зураг: ${im.origin === 'third-party' ? new URL(im.src).hostname : im.origin}`);
    it.enWords = wordCount(plainText(it.enBlocks));
    if (it.enWords) {
      const res = /Resource:[^\n]*/i.exec(plainText(it.enBlocks));
      it.flags.push(`en хувилбар: ${res ? res[0].slice(0, 80) : 'эх сурвалж тодорхойгүй'}`);
    }
    it.needsReplacement = it.flags.length > 0;
  }
  return items;
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
      const id = DRY
        ? 'dry-run'
        : await ensureAsset(b.src, `${it.title} — зураг ${n}`, `TIC: ${it.oldUrl} · Эх зураг: ${shown}${origin === 'tic' ? '' : ' · needsReplacement'}`, credit);
      firstAsset = firstAsset || id;
      out.push({ nodeType: 'embedded-asset-block', data: { target: { sys: { type: 'Link', linkType: 'Asset', id } } }, content: [] });
    } catch (e) {
      report.push({ key: it.row.key, src: shown.slice(0, 160), error: e.message });
    }
  }
  return { content: out, firstAsset };
}

async function upsert(id, fields) {
  const cur = await cma('GET', `/entries/${id}`);
  if (!cur) return cma('PUT', `/entries/${id}`, { contentType: 'historyArticle', body: { fields } });
  return cma('PUT', `/entries/${id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
}

(async () => {
  const items = prepare(batch02Rows(loadInventory()));
  const usedDesc = new Set();
  const imageErrors = [];
  const result = { articles: [], imageErrors };

  for (const it of items) {
    it.seoTitle = seoTitle(it.title, 'Монголын түүх');
    it.seoDescription = seoDescription(it.text, { name: it.title, stem: it.title.split(/[ ,.]/)[0], fallback: 'Монголын түүхийн нийтлэл — Travel Hub Mongolia.' }, usedDesc);
    const id = `tic-c14-${it.row.key.split('_')[1]}`;
    const { content, firstAsset } = await resolveImages(it, imageErrors);
    const fields = {
      title: L(it.title),
      slug: L(it.slug),
      period: L(it.period),
      order: L(it.order),
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
    result.articles.push({ id, key: it.row.key, title: it.title, slug: it.slug, period: it.period, order: it.order, words: it.words, enWords: it.enWords, images: it.images.length, promoRemoved: it.promoRemoved, needsReplacement: it.needsReplacement, flags: it.flags, seoTitle: it.seoTitle, seoDescription: it.seoDescription, oldUrl: it.oldUrl, newPath: it.newPath });
    console.log(`${DRY ? '[dry] ' : ''}${it.period}/${it.order} ${it.slug} ← ${it.row.key} (${it.words} үг, зураг ${it.images.length}${it.promoRemoved ? '' : ', сурталчилгаа олдсонгүй'}${it.enWords ? `, en ${it.enWords} үг` : ''}${it.needsReplacement ? ', needsReplacement' : ''}) [${it.seoTitle.length}/${it.seoDescription.length}]`);
  }

  const redirects = result.articles.map((a) => [a.oldUrl, SITE + a.newPath, a.title]);
  if (!DRY) {
    writeCsv(path.join(ROOT, 'docs', 'redirects', 'batch-02-history.csv'), ['old_url', 'new_url', 'title'], redirects);
  }
  result.redirectRows = redirects.length;
  fs.writeFileSync(REPORT_JSON, JSON.stringify(result, null, 2), 'utf8');
  console.log(`redirect мөр: ${redirects.length}, зургийн алдаа: ${imageErrors.length}, CMA дуудлага: ${callCount()}`);
  for (const e of imageErrors) console.log('  зураг алгасав:', e.key, e.error, e.src);
})().catch((e) => { console.error(e); process.exit(1); });

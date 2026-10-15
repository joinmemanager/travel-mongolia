// TIC 1-р багц: 21 аймаг + Архангайн сумдыг Contentful-д Draft-аар оруулна (publish хийхгүй).
//
// Ажиллуулах (repo-ийн үндсэн хавтаснаас):
//   node scripts/tic/fetch-batch01.js <кэш>          # TIC HTML-ийг татна
//   node scripts/tic/schema-batch01.js               # province талбар, soum төрөл
//   node scripts/tic/import-batch01.js <кэш> --dry   # Contentful-д бичихгүй, зөвхөн тайлан
//   node scripts/tic/import-batch01.js <кэш>         # импорт + docs/redirects/batch-01-aimags.csv
//
// Дүрэм (tic-migration.md, 1-р шатны даалгавар):
//  - TIC-ийн текстийг өөрчлөхгүй хуулна. Одоо байгаа province entry-ийн текстийг устгахгүй, араас нь нэмнэ.
//  - Зургийг гуравдагч сайтаас шууд холбохгүй: татаж Contentful asset болгоно (Draft).
//  - sourceUrl = TIC-ийн эх хаяг. needsReplacement = «Монгол орны лавлах»/«Улаан ном»-оос
//    авсан текст эсвэл TIC-ээс өөр сайтын (base64 оруулсныг ч) зурагтай.
//  - Сум: 150-аас дээш үгтэй бол ownPage=true (/province/<аймаг>/<сум>), бусад нь аймгийн хуудсанд.
//  - TIC дотор давхардсан сумын нийтлэлээс урт хувилбарыг нь авна, хоёр хуучин хаяг нэг шинэ хаяг руу.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { cma, fv, ROOT, SPACE, LOCALE, callCount } = require('./_cma');
const { loadInventory, writeCsv } = require('./_csv');
const { batch01Rows } = require('./_batch01');
const { parseHtml, convert, plainText, wordCount, extractArticle } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');

const CACHE = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }

const TIC = 'https://www.touristinfocenter.mn';
const SITE = 'https://www.travelhubmongolia.com';
const OWN_PAGE_MIN_WORDS = 150;
const BACKUP_ENTRIES = path.join(ROOT, 'backups', 'contentful-2026-10-15-pre-tic', 'entries.json');
const REPORT_JSON = path.join(CACHE, '..', 'batch01-result.json');
const L = (v) => ({ [LOCALE]: v });

// ------------------------------------------------------------------ нэр, slug
const lowerFirstUpper = (w) => (w ? w[0].toUpperCase() + w.slice(1) : w);
const titleCase = (s) => s.toLowerCase().split(/([\s-])/).map(lowerFirstUpper).join('');

const SLUG_MAP = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'ye', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l',
  м: 'm', н: 'n', о: 'o', ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f', х: 'kh', ц: 'ts',
  ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
};
const slugify = (s) =>
  [...s.toLowerCase()].map((c) => (c in SLUG_MAP ? SLUG_MAP[c] : /[a-z0-9]/.test(c) ? c : '-')).join('').replace(/-+/g, '-').replace(/^-|-$/g, '');

// Хуучин TIC хаягийг (http/https, www-тэй/гүй) нэг хэлбэрт оруулна
const ticKey = (url) => {
  const m = /touristinfocenter\.mn(\/[^#]*)/i.exec(url);
  return m ? m[1].toLowerCase() : null;
};

// ------------------------------------------------------------------ зураг
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);

function sniff(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return ['image/jpeg', 'jpg'];
  if (buf.slice(0, 4).toString('hex') === '89504e47') return ['image/png', 'png'];
  if (buf.slice(0, 3).toString() === 'GIF') return ['image/gif', 'gif'];
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return ['image/webp', 'webp'];
  return null;
}

function imageOrigin(src) {
  if (src.startsWith('data:')) return 'base64';
  if (/^[a-z]:\\/i.test(src) || src.startsWith('file:')) return 'broken';
  if (/^https?:\/\//i.test(src) && !/touristinfocenter\.mn/i.test(src)) return 'third-party';
  return 'tic';
}

function imageUrl(src) {
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('//')) return 'https:' + src;
  // TIC-ийн зам кирилл, зайтай байж болно
  return TIC + encodeURI(src.startsWith('/') ? src : '/' + src);
}

async function download(src) {
  if (src.startsWith('data:')) {
    const m = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(src);
    if (!m) throw new Error('data URI буруу');
    return m[2] ? Buffer.from(m[3], 'base64') : Buffer.from(decodeURIComponent(m[3]));
  }
  const get = (url) =>
    fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (TravelHubMongolia content migration; contact@joinme.mn)' },
      redirect: 'follow',
    });
  let res = await get(imageUrl(src));
  // Wikimedia-ийн thumb (эхээсээ том хэмжээ) 400 буцаавал эх файлыг авна
  const thumb = /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/[^/]+)\/thumb\/(.+)\/[^/]+$/.exec(src);
  if (!res.ok && thumb) res = await get(`${thumb[1]}/${thumb[2]}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Зургийг Contentful-д Draft asset болгон оруулна (ID нь эх хаягаас тогтмол → дахин ажиллуулахад давхардахгүй)
async function ensureAsset(src, title, sourceNote) {
  const id = `tic-img-${sha(src)}`;
  const existing = await cma('GET', `/assets/${id}`);
  if (existing && existing.fields?.file?.[LOCALE]?.url) return id;
  const buf = await download(src);
  const type = sniff(buf);
  if (!type) throw new Error('зургийн формат танигдсангүй');
  const upload = await cma('POST', `https://upload.contentful.com/spaces/${SPACE}/uploads`, { raw: buf });
  const fileName = `${id}.${type[1]}`;
  let asset = existing;
  const body = {
    fields: {
      title: L(title.slice(0, 250)),
      description: L(sourceNote),
      file: L({ contentType: type[0], fileName, uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } } }),
    },
  };
  asset = existing
    ? await cma('PUT', `/assets/${id}`, { version: existing.sys.version, body })
    : await cma('PUT', `/assets/${id}`, { body });
  await cma('PUT', `/assets/${id}/files/${LOCALE}/process`, { version: asset.sys.version });
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const a = await cma('GET', `/assets/${id}`);
    if (a.fields?.file?.[LOCALE]?.url) return id;
  }
  throw new Error('asset процесс дуусаагүй');
}

// ------------------------------------------------------------------ нийтлэл бэлтгэх
function prepare(rows) {
  const redirectOf = new Map(); // хуучин TIC түлхүүр → шинэ зам
  const items = [];
  for (const r of rows) {
    const html = fs.readFileSync(path.join(CACHE, `${r.key}.html`), 'utf8');
    const art = extractArticle(html);
    if (!art) throw new Error(`${r.key}: нийтлэлийн бие олдсонгүй`);
    const isSoum = r['contentful_төрөл'].startsWith('soum');
    const aimag = r['аймаг'];
    const name = isSoum ? `${titleCase(art.title.split(' - ').slice(1).join(' - ').replace(/\s+СУМ$/i, ''))} сум` : `${aimag} аймаг`;
    const provinceSlugValue = isSoum ? r['шинэ_url'].split('/')[2] : r['шинэ_url'].replace(/^\/(province|destination)\//, '');
    // Дархан-Уулын шинэ_url нь /destination/... байсан ч 21 аймаг бүгд /province/<slug>-д орно
    const slug = isSoum ? slugify(name.replace(/ сум$/, '')) : provinceSlugValue;
    items.push({ row: r, art, isSoum, aimag, name, slug, provinceSlug: provinceSlugValue, oldUrl: TIC + r['хуучин_url'] });
  }
  // Сумын давхардал: нэг slug-д хэд хэдэн нийтлэл → хамгийн урт нь
  const bySlug = new Map();
  for (const it of items) {
    const k = it.isSoum ? `${it.provinceSlug}/${it.slug}` : it.slug;
    it.groupKey = k;
    const blocks0 = convert(parseHtml(it.art.body), { baseUrl: TIC + '/' });
    it.words = wordCount(plainText(blocks0));
    if (!bySlug.has(k)) bySlug.set(k, []);
    bySlug.get(k).push(it);
  }
  const primaries = [];
  for (const group of bySlug.values()) {
    group.sort((a, b) => b.words - a.words);
    const [main, ...dups] = group;
    main.duplicates = dups;
    primaries.push(main);
  }
  for (const it of primaries) {
    it.newPath = it.isSoum
      ? it.words > OWN_PAGE_MIN_WORDS
        ? `/province/${it.provinceSlug}/${it.slug}`
        : `/province/${it.provinceSlug}#${it.slug}`
      : `/province/${it.slug}`;
    for (const x of [it, ...it.duplicates]) redirectOf.set(ticKey(x.oldUrl), it.newPath);
  }
  // Багц доторх TIC холбоосыг шинэ хаяг руу
  const rewriteLink = (href) => {
    const k = ticKey(href);
    return k && redirectOf.has(k) ? SITE + redirectOf.get(k) : href;
  };
  for (const it of primaries) {
    it.blocks = convert(parseHtml(it.art.body), { baseUrl: TIC + '/', rewriteLink });
    it.text = plainText(it.blocks);
    it.words = wordCount(it.text);
    it.images = it.blocks.filter((b) => b.nodeType === '__image').map((b) => ({ src: b.src, alt: b.alt, origin: imageOrigin(b.src) }));
    const srcLine = (it.text.match(/Эх сурвалж[^\n]*/gi) || []).join(' ') + ' ' + it.row['зохиогч_эх_сурвалж'];
    it.flags = [];
    if (/лавлах/i.test(srcLine)) it.flags.push('Монгол орны лавлах');
    if (/улаан ном/i.test(srcLine)) it.flags.push('Улаан ном');
    for (const im of it.images) if (im.origin === 'third-party' || im.origin === 'base64') it.flags.push(`зураг: ${im.origin === 'base64' ? 'base64 (эх нь тодорхойгүй)' : new URL(im.src).hostname}`);
    it.needsReplacement = it.flags.length > 0;
  }
  return primaries;
}

// Зургийн түр зангилааг asset-аар солих (амжилтгүй бол хасна)
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
    try {
      const id = DRY ? 'dry-run' : await ensureAsset(b.src, `${it.name} — зураг ${n}`, `TIC: ${it.oldUrl} · Эх зураг: ${shown}${origin === 'tic' ? '' : ' · needsReplacement'}`);
      firstAsset = firstAsset || id;
      out.push({ nodeType: 'embedded-asset-block', data: { target: { sys: { type: 'Link', linkType: 'Asset', id } } }, content: [] });
    } catch (e) {
      report.push({ key: it.row.key, src: shown.slice(0, 160), error: e.message });
    }
  }
  return { content: out, firstAsset };
}

const doc = (content) => ({ nodeType: 'document', data: {}, content });
const assetLink = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } });
const entryLink = (id) => ({ sys: { type: 'Link', linkType: 'Entry', id } });

async function upsert(id, contentType, fields) {
  const cur = await cma('GET', `/entries/${id}`);
  if (!cur) return cma('PUT', `/entries/${id}`, { contentType, body: { fields } });
  return cma('PUT', `/entries/${id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
}

// ------------------------------------------------------------------ main
(async () => {
  const items = prepare(batch01Rows(loadInventory()));
  const provinces = items.filter((x) => !x.isSoum);
  const soums = items.filter((x) => x.isSoum).sort((a, b) => a.name.localeCompare(b.name, 'mn'));
  const usedDesc = new Set();
  const imageErrors = [];
  const result = { provinces: [], soums: [], imageErrors };

  // Одоо байгаа province entry-үүд (slug-аар)
  const existing = (await cma('GET', '/entries?content_type=province&limit=200')).items;
  const backup = fs.existsSync(BACKUP_ENTRIES) ? JSON.parse(fs.readFileSync(BACKUP_ENTRIES, 'utf8')) : [];
  const provinceIdBySlug = {};

  for (const it of provinces) {
    it.seoTitle = seoTitle(it.name, 'аялах гарын авлага');
    it.seoDescription = seoDescription(it.text, { name: it.name, stem: it.aimag, fallback: 'Аймгийн танилцуулга: түүх, байгаль, үзэх газрууд.' }, usedDesc);
    const found = existing.find((e) => fv(e, 'slug') === it.slug);
    const id = found ? found.sys.id : `tic-c13-${it.row.key.split('_')[1]}`;
    provinceIdBySlug[it.slug] = id;
    const { content, firstAsset } = await resolveImages(it, imageErrors);

    let body = content;
    let merged = false;
    if (found) {
      // Одоо байгаа текстийг (импортоос өмнөх нөөцөөс) хэвээр үлдээж, TIC-ийн текстийг араас нь нэмнэ
      const orig = backup.find((e) => e.sys.id === found.sys.id);
      const origDoc = orig?.fields?.description2?.[LOCALE] || (fv(found, 'sourceUrl') ? null : fv(found, 'description2'));
      if (origDoc?.content?.length) {
        body = [...origDoc.content, { nodeType: 'hr', data: {}, content: [] }, ...content];
        merged = true;
      }
    }
    const fields = {
      title: L(found ? fv(found, 'title') : it.name),
      slug: L(it.slug),
      description2: L(doc(body)),
      seoTitle: L(it.seoTitle),
      seoDescription: L(it.seoDescription),
      sourceUrl: L(it.oldUrl),
      needsReplacement: L(it.needsReplacement),
    };
    if (firstAsset && !(found && fv(found, 'image'))) fields.image = L(assetLink(firstAsset));
    if (!DRY) await upsert(id, 'province', fields);
    result.provinces.push({ id, name: it.name, slug: it.slug, words: it.words, merged, needsReplacement: it.needsReplacement, flags: it.flags, seoTitle: it.seoTitle, seoDescription: it.seoDescription, oldUrls: [it.oldUrl, ...it.duplicates.map((d) => d.oldUrl)], newPath: it.newPath });
    console.log(`${DRY ? '[dry] ' : ''}province ${it.slug} ← ${it.row.key} (${it.words} үг${merged ? ', нэгтгэв' : ''}${it.needsReplacement ? ', needsReplacement' : ''})`);
  }

  for (const it of soums) {
    const provinceId = provinceIdBySlug[it.provinceSlug];
    if (!provinceId) throw new Error(`${it.name}: аймгийн entry олдсонгүй (${it.provinceSlug})`);
    it.seoTitle = seoTitle(it.name, `${it.aimag} аймаг`);
    it.seoDescription = seoDescription(it.text, { name: `${it.name}, ${it.aimag} аймаг`, stem: it.name.replace(/ сум$/, ''), fallback: `${it.aimag} аймгийн сумын танилцуулга: түүх, газар нутаг, байгаль.` }, usedDesc);
    const id = `tic-c13-${it.row.key.split('_')[1]}`;
    const { content, firstAsset } = await resolveImages(it, imageErrors);
    const ownPage = it.words > OWN_PAGE_MIN_WORDS;
    const fields = {
      title: L(it.name),
      slug: L(it.slug),
      province: L(entryLink(provinceId)),
      ownPage: L(ownPage),
      body: L(doc(content)),
      seoTitle: L(it.seoTitle),
      seoDescription: L(it.seoDescription),
      sourceUrl: L(it.oldUrl),
      needsReplacement: L(it.needsReplacement),
    };
    if (firstAsset) fields.image = L(assetLink(firstAsset));
    if (!DRY) await upsert(id, 'soum', fields);
    result.soums.push({ id, name: it.name, slug: it.slug, words: it.words, ownPage, needsReplacement: it.needsReplacement, flags: it.flags, seoTitle: it.seoTitle, seoDescription: it.seoDescription, oldUrls: [it.oldUrl, ...it.duplicates.map((d) => d.oldUrl)], newPath: it.newPath });
    console.log(`${DRY ? '[dry] ' : ''}soum ${it.slug} ← ${it.row.key}${it.duplicates.length ? ' (+' + it.duplicates.map((d) => d.row.key).join(',') + ')' : ''} ${it.words} үг ${ownPage ? 'ХУУДАС' : 'жагсаалт'}`);
  }

  // Redirect хүснэгт: хуучин TIC хаяг бүр нэг мөр
  const redirects = [];
  for (const x of [...result.provinces, ...result.soums]) {
    for (const old of x.oldUrls) redirects.push([old, SITE + x.newPath, x.name]);
  }
  if (!DRY) {
    const dir = path.join(ROOT, 'docs', 'redirects');
    fs.mkdirSync(dir, { recursive: true });
    writeCsv(path.join(dir, 'batch-01-aimags.csv'), ['old_url', 'new_url', 'title'], redirects);
  }
  result.redirectRows = redirects.length;
  fs.writeFileSync(REPORT_JSON, JSON.stringify(result, null, 2), 'utf8');
  console.log(`redirect мөр: ${redirects.length}, зургийн алдаа: ${imageErrors.length}, CMA дуудлага: ${callCount()}`);
  for (const e of imageErrors) console.log('  зураг алгасав:', e.key, e.error, e.src);
})().catch((e) => { console.error(e); process.exit(1); });

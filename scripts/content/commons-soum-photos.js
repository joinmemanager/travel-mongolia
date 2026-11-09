// Ажил C: Wikimedia Commons-оос сум бүрт зураг хайна (Contentful-д юу ч байршуулахгүй).
// Хайлт: сумын латин нэр + аймаг, кирилл нэр, (байвал) сумын нутгийн алдартай газрууд (place.soum талбар).
// Шүүлтүүр: лиценз CC0 / CC BY / CC BY-SA / Public domain; өргөн > 1600; хэвтээ; JPEG/PNG; гарчиг, тайлбар, ангилалд сум эсвэл газрын нэр орсон;
// хүн гол сэдэв байж болзошгүй (portrait, people, woman …) файлыг хасна.
// Гаралт: tmp/soum-photos/candidates.json (сум бүрт оноогоор эрэмбэлсэн ≤3), татсан файл tmp/soum-photos/<аймаг>-<сум>/.
//   node scripts/content/commons-soum-photos.js <snapshot-хавтас> [--download]
const fs = require('fs');
const path = require('path');
const lib = require('./_lib');

const [snapDir] = process.argv.slice(2);
const DOWNLOAD = process.argv.includes('--download');
const S = path.join(lib.ROOT, 'backups', snapDir);
const OUT = path.join(lib.ROOT, 'tmp', 'soum-photos');
fs.mkdirSync(OUT, { recursive: true });
const CACHE = path.join(OUT, 'api-cache.json');
const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const UA = 'TravelHubMongoliaBot/1.0 (https://www.travelhubmongolia.com; image research for soum pages)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let last = 0;
async function api(params) {
  const q = new URLSearchParams({ format: 'json', formatversion: '2', ...params }).toString();
  if (cache[q]) return cache[q];
  const wait = last + 1000 - Date.now();
  if (wait > 0) await sleep(wait);
  last = Date.now();
  for (let i = 1; i <= 3; i++) {
    try {
      const r = await fetch(`https://commons.wikimedia.org/w/api.php?${q}`, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30000) });
      if (r.status === 429) { await sleep(5000 * i); continue; }
      const j = await r.json();
      cache[q] = j;
      return j;
    } catch (e) { if (i === 3) return {}; await sleep(3000 * i); }
  }
  return {};
}

const E = JSON.parse(fs.readFileSync(path.join(S, 'entries.json'), 'utf8'));
const byId = new Map(E.map((e) => [e.sys.id, e]));
const emblems = new Set(fs.readFileSync(path.join(lib.ROOT, 'travel-mongolia', 'lib', 'soumHeroImages.ts'), 'utf8').split('SOUM_NOT_HERO_ASSETS')[0].match(/'([^']+)'/g).map((s) => s.slice(1, -1)));
const AIMAG_EN = { arkhangai: 'Arkhangai', 'bayan-ulgii': 'Bayan-Ölgii', bayankhongor: 'Bayankhongor', bulgan: 'Bulgan', 'darkhan-uul': 'Darkhan-Uul', dornogov: 'Dornogovi', dornod: 'Dornod', dundgov: 'Dundgovi', 'gov-altai': 'Govi-Altai', govsumber: 'Govisümber', khentii: 'Khentii', khovd: 'Khovd', khuvsgul: 'Khövsgöl', orkhon: 'Orkhon', selenge: 'Selenge', sukhbaatar: 'Sükhbaatar', tuv: 'Töv', umnugov: 'Ömnögovi', uvs: 'Uvs', uvurkhangai: 'Övörkhangai', zavkhan: 'Zavkhan', ulaanbaatar: 'Ulaanbaatar' };
const LICENSE_OK = /^(cc0|cc[- ]by(-sa)?[- ]?[\d.]*|cc[- ]by(-sa)?|public domain|pd.*)$/i;
const NOT_PLACE = /(map|locator|location map|flag|coat of arms|emblem|seal|logo|diagram|chart|hunters?|kokpar|festival|naadam|ceremony|concert|dance|performance|museum exhibit|stamp|banknote)|газрын зураг|туг|сүлд|тамга/i;
const TAXON = /(birds|aves|plants|flora|fauna|animals|mammals|reptiles|insects|lepidoptera|species|taxon|botany|zoology)/i;
const PEOPLE = /\b(portrait|people|woman|women|man|men|girl|boy|child|children|family|wrestler|wrestling|selfie|face|crowd|herder|nomad[s]? (wo)?man)\b|хүмүүс|хөрөг/i;

const places = E.filter((e) => e.sys.contentType.sys.id === 'place' && lib.fv(e, 'soum'));
const soums = E.filter((e) => e.sys.contentType.sys.id === 'soum').map((e) => {
  const p = byId.get(lib.fv(e, 'province')?.sys?.id);
  const ps = p ? lib.fv(p, 'slug') : '';
  const name = lib.titleOf(e).replace(/ (сум|дүүрэг|хот|тосгон)$/, '');
  const slug = lib.fv(e, 'slug');
  const latin = slug.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join('-');
  const imgId = lib.fv(e, 'image')?.sys?.id;
  const myPlaces = places.filter((x) => lib.fv(x, 'province')?.sys?.id === p?.sys?.id && String(lib.fv(x, 'soum')).includes(name)).map((x) => lib.titleOf(x)).slice(0, 3);
  return { id: e.sys.id, name, title: lib.titleOf(e), slug, provinceSlug: ps, province: p ? lib.titleOf(p) : '', aimagEn: AIMAG_EN[ps] || '', latin, emblem: !!imgId && emblems.has(imgId), hasImage: !!imgId, ownPage: lib.fv(e, 'ownPage') === true, places: myPlaces };
}).sort((a, b) => (b.emblem - a.emblem) || (b.ownPage - a.ownPage) || (a.hasImage - b.hasImage));

const strip = (h) => String(h || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
async function searchFiles(q) {
  const j = await api({ action: 'query', list: 'search', srnamespace: '6', srlimit: '30', srsearch: q });
  return (j.query?.search || []).map((x) => x.title);
}
async function info(titles) {
  const out = [];
  for (let i = 0; i < titles.length; i += 40) {
    const j = await api({ action: 'query', prop: 'imageinfo|categories', iiprop: 'url|size|mime|extmetadata', iiurlwidth: '2400', cllimit: '30', titles: titles.slice(i, i + 40).join('|') });
    out.push(...(j.query?.pages || []));
  }
  return out;
}

(async () => {
  const result = [];
  let done = 0;
  for (const s of soums) {
    const names = [s.latin, s.name].filter(Boolean);
    const queries = [`"${s.latin}" ${s.aimagEn}`, `"${s.name}"`, ...s.places.map((p) => `"${p}"`)];
    const titles = new Set();
    for (const q of queries) for (const t of await searchFiles(q)) titles.add(t);
    const pages = titles.size ? await info([...titles]) : [];
    const cands = [];
    for (const pg of pages) {
      const ii = pg.imageinfo?.[0];
      // PNG нь бараг бүгд байршлын газрын зураг, туг (2026-11-06-ны үр дүнгээс) тул зөвхөн JPEG
      if (!ii || !/jpeg/.test(ii.mime)) continue;
      const md = ii.extmetadata || {};
      const lic = strip(md.LicenseShortName?.value);
      if (!LICENSE_OK.test(lic)) continue;
      if (!(ii.width > 1600 && ii.width > ii.height * 1.15)) continue;
      const cats = (pg.categories || []).map((c) => c.title.replace(/^Category:/, ''));
      const desc = strip(md.ImageDescription?.value);
      const hay = `${pg.title} ${desc} ${cats.join(' ')}`;
      if (PEOPLE.test(hay) || NOT_PLACE.test(hay)) continue;
      // Амьтан, ургамлын зураг (латин хоёр үгтэй нэр эсвэл ангилал)
      if (/^File:[A-Z][a-z]+ [a-z]{3,}[ .(]/.test(pg.title) || cats.some((c) => TAXON.test(c))) continue;
      const placeHit = s.places.find((p) => hay.includes(p));
      const nameHit = names.some((n) => new RegExp(`(^|[^\\p{L}])${n.replace(/[-]/g, '[- ]?')}([^\\p{L}]|$)`, 'iu').test(hay));
      if (!nameHit && !placeHit) continue;
      const aimagHit = s.aimagEn && hay.toLowerCase().includes(s.aimagEn.toLowerCase().slice(0, 5)) || hay.includes(s.province.replace(/ аймаг$/, ''));
      // Ижил нэртэй өөр аймгийн сум (Булган, Баян-Уул г.м.) андуурахгүйн тулд нэр + аймаг эсвэл газрын нэр шаардана
      if (!aimagHit && !placeHit) continue;
      const score = (placeHit ? 2 : 0) + (aimagHit ? 2 : 0) + (cats.some((c) => c.toLowerCase().includes(s.latin.toLowerCase())) ? 2 : 0) + Math.min(ii.width / 2000, 2);
      cands.push({ file: pg.title, page: ii.descriptionurl, thumb: ii.thumburl || ii.url, width: ii.width, height: ii.height, license: lic, licenseUrl: strip(md.LicenseUrl?.value), artist: strip(md.Artist?.value).slice(0, 120), description: desc.slice(0, 200), matched: placeHit || s.latin, score: +score.toFixed(2) });
    }
    cands.sort((a, b) => b.score - a.score);
    result.push({ ...s, candidates: cands.slice(0, 3) });
    if (++done % 25 === 0) { fs.writeFileSync(CACHE, JSON.stringify(cache)); console.log(new Date().toISOString(), done, '/', soums.length); }
  }
  fs.writeFileSync(CACHE, JSON.stringify(cache));
  fs.writeFileSync(path.join(OUT, 'candidates.json'), JSON.stringify(result, null, 1));
  const found = result.filter((r) => r.candidates.length);
  console.log('сум', result.length, 'зурагтай', found.length, 'сүлдтэйгээс', found.filter((r) => r.emblem).length, '/', result.filter((r) => r.emblem).length);
  if (DOWNLOAD) {
    for (const r of found) {
      const dir = path.join(OUT, `${r.provinceSlug}-${r.slug}`);
      fs.mkdirSync(dir, { recursive: true });
      for (const [i, c] of r.candidates.entries()) {
        const f = path.join(dir, `${i + 1}-original.jpg`);
        if (fs.existsSync(f)) continue;
        await sleep(1000);
        const res = await fetch(c.thumb, { headers: { 'User-Agent': UA } });
        fs.writeFileSync(f, Buffer.from(await res.arrayBuffer()));
      }
    }
    console.log('татсан');
  }
})().catch((e) => { fs.writeFileSync(CACHE, JSON.stringify(cache)); console.error(e.message); process.exit(1); });

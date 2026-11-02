// data/joinme/raw/*.json (fetch.js) → providers.json, providers.csv, README.md, match-with-tic.csv
// TIC тулгалт: backups/contentful-snapshot-2026-10-27/entries.json (localProvider, sourceUrl=touristinfocenter).
// Contentful руу ямар ч хүсэлт явуулахгүй.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');
const RAW = path.join(ROOT, 'data/joinme/raw');
const OUT = path.join(ROOT, 'data/joinme');
const SNAPSHOT = path.join(ROOT, 'backups/contentful-snapshot-2026-10-27/entries.json');
const IMG = (img) => `https://d1f6qhhrbg3j8a.cloudfront.net/img/${img.id}/original/${encodeURIComponent(img.file_name)}`;

const PROVINCE_BY_SLUG = {
  'khentii-province': 'Хэнтий', 'Dundgovi-Province': 'Дундговь', 'Sukhbaatar-Province': 'Сүхбаатар',
  zavkhan: 'Завхан', 'uvs-province': 'Увс', umnugovi: 'Өмнөговь', khuvsgul: 'Хөвсгөл',
};

const TYPE_MN = {
  tourist_camp: 'Жуулчны бааз', resort: 'Амралтын газар / рашаан', hotel: 'Зочид буудал', guesthouse: 'Гэр буудал / Guest house',
  restaurant: 'Ресторан / зоогийн газар', cafe: 'Кофе шоп', crafts: 'Гар урлал', horse_tour: 'Морин аялал', camel_tour: 'Тэмээн аялал',
  hospital: 'Эмнэлэг / ЭМТ', pharmacy: 'Эмийн сан', fuel_station: 'Шатахуун түгээх станц', government: 'Төрийн байгууллага (ЗДТГ)',
  company: 'Аж ахуйн нэгж (ХХК)', other: 'Бусад / тодорхойгүй',
};
const LODGING = new Set(['tourist_camp', 'resort', 'hotel', 'guesthouse']);

const HEADING_TYPE = [
  [/жуулчны бааз/i, 'tourist_camp'], [/амралтын газар/i, 'resort'], [/guest house|гэр \//i, 'guesthouse'],
  [/зочид буудал|^буудал$/i, 'hotel'], [/ресторан|зоогийн газар/i, 'restaurant'], [/кофе/i, 'cafe'],
  [/гар урлал/i, 'crafts'], [/морин аялл/i, 'horse_tour'], [/эмнэлэг/i, 'hospital'],
];
const NAME_TYPE = [
  [/ШТС|АХЦС|петролиум|петровис|шатахуун/i, 'fuel_station'], [/эмийн сан|эмийн эргэлтийн/i, 'pharmacy'],
  [/эрүүл мэндийн төв|эмнэлэг|клиник/i, 'hospital'], [/ЗДТГ/, 'government'],
  [/жуулчны бааз|ресорт|resort|lodge|лоож|camp/i, 'tourist_camp'], [/рашаан|амралт|зуслан/i, 'resort'],
  [/guest ?house|гэр буудал/i, 'guesthouse'], [/зочид буудал|буудал|гостиница|hotel/i, 'hotel'],
  [/ресторан|зоог|хоолны|restaurant/i, 'restaurant'], [/кофе|coffee|cafe/i, 'cafe'], [/ХХК|LLC/i, 'company'],
];
const EXACT_NAME_TYPE = [[/^гар урлал$/i, 'crafts'], [/^тэмээ$/i, 'camel_tour'], [/^морь$/i, 'horse_tour']];
const firstMatch =(rules, s) => (rules.find(([re]) => re.test(s)) || [])[1];

const clean = (s) => (s == null ? null : String(s).replace(/ /g, ' ').replace(/\s+/g, ' ').trim() || null);
const htmlText = (h) => clean((h || '').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"'));
const isLatin = (s) => !!s && /[a-z]/i.test(s) && !/[а-яөүё]/i.test(s);

function parsePhones(s) {
  if (!s) return [];
  const out = [];
  for (const m of String(s).matchAll(/(?:\+?976[\s-]?)?(\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2})(?!\d)/g)) out.push(m[1].replace(/\D/g, ''));
  return [...new Set(out)];
}

// joinme эх дэх үсгийн алдаа
const SOUM_FIX = { Тарилан: 'Тариалан', Улаангим: 'Улаангом', Малшин: 'Малчин', Хангонгор: 'Ханхонгор', Цогтцэций: 'Цогт-Цэций' };
function findSoum(...texts) {
  for (const t of texts) {
    if (!t) continue;
    const m = t.match(/([А-ЯӨҮЁ][а-яөүё]+(?:-[А-ЯӨҮЁа-яөүё][а-яөүё]+)?)\s+сум(?:ын)?(?![а-яөүё])/);
    if (m && !/^(Сумын|Аймгийн)$/.test(m[1])) {
      const s = m[1].replace(/-([а-яөүё])/g, (_, c) => '-' + c.toUpperCase());
      return SOUM_FIX[s] || s;
    }
  }
  return null;
}

// ---- 1. joinme хуудсуудыг задлах
const providers = [];
const pagesInfo = [];
const seen = new Set();
for (const file of fs.readdirSync(RAW).filter((f) => f.endsWith('.json') && f !== 'Provinces.json')) {
  const slug = file.replace(/\.json$/, '');
  const page = JSON.parse(fs.readFileSync(path.join(RAW, file), 'utf8'));
  const province = PROVINCE_BY_SLUG[slug] || page.title;
  const pageUrl = `https://joinme.mn/${slug}`;
  let heading = null; let count = 0;
  const walk = (node, comp) => {
    if (Array.isArray(node)) return node.forEach((n) => walk(n, comp));
    if (!node || typeof node !== 'object') return;
    if (node.component === 'HTMLBox') { const t = htmlText(node.content); if (t && t.length < 60) heading = t; return; }
    if (node.component === 'Address') {
      (node.items || []).forEach((it, i) => {
        const name = clean(it.name);
        if (!name) return;
        const phoneRaw = clean(it.phone);
        const key = [province, name.toLowerCase(), phoneRaw].join('|');
        if (seen.has(key)) return; // desktop/mobile хувилбарын давхардал
        seen.add(key);
        const addressField = clean(it.address);
        const location = clean(it.location);
        const headingIsSoum = heading && /\sсум$/.test(heading);
        const headingType = !headingIsSoum && firstMatch(HEADING_TYPE, heading || '');
        const nameType = firstMatch(NAME_TYPE, `${name} ${addressField || ''}`);
        // Өмнөговийн «Амралтын газар» гарчиг дор жуулчны баазууд, «Морин аялал» дор Тэмээ/Гар урлал байдаг
        const type = firstMatch(EXACT_NAME_TYPE, name)
          || (['resort', 'hotel'].includes(headingType) && LODGING.has(nameType) ? nameType : headingType)
          || nameType || 'other';
        const allText = [name, addressField, location, phoneRaw].join(' ');
        const timetable = (it.timetable || []).filter((t) => t && Object.keys(t).length);
        providers.push({
          joinme_id: `${page.id}:${node.id}:${i}`,
          joinme_page_id: page.id,
          joinme_component_id: node.id,
          name,
          name_en: isLatin(addressField) && !/\d/.test(addressField) ? addressField : null,
          type,
          type_mn: TYPE_MN[type],
          category_raw: heading,
          province,
          soum: findSoum(location, addressField) || (headingIsSoum ? findSoum(heading) : null),
          location,
          address: addressField,
          lat: null,
          lng: null,
          description: null,
          services: null,
          price: null,
          phones: parsePhones(phoneRaw),
          phone_raw: phoneRaw,
          email: (allText.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [])[0] || null,
          website: (allText.match(/https?:\/\/\S+|www\.\S+/) || [])[0] || null,
          joinme_url: pageUrl,
          booking_url: null,
          images: it.image && it.image.id ? [IMG(it.image)] : [],
          timetable: timetable.length ? timetable : null,
        });
        count++;
      });
      return;
    }
    for (const v of Object.values(node)) if (v && typeof v === 'object') walk(v);
  };
  walk(page.items);
  pagesInfo.push({ slug, province, page_id: page.id, title: page.title, count });
}
providers.sort((a, b) => a.province.localeCompare(b.province, 'mn') || a.type.localeCompare(b.type) || a.name.localeCompare(b.name, 'mn'));

// ---- 2. CSV туслах
const csvCell = (v) => {
  if (v == null) return '';
  const s = Array.isArray(v) ? v.join(' | ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const writeCsv = (file, cols, rows) => fs.writeFileSync(file, '﻿' + [cols.join(','), ...rows.map((r) => cols.map((c) => csvCell(r[c])).join(','))].join('\r\n') + '\r\n', 'utf8');

fs.writeFileSync(path.join(OUT, 'providers.json'), JSON.stringify({
  source: 'https://joinme.mn/Provinces → https://api3.cody.mn/api/v2/dynamic/joinme/<slug>',
  fetched_at: fs.statSync(path.join(RAW, 'Provinces.json')).mtime.toISOString(),
  count: providers.length,
  providers,
}, null, 2) + '\n');
const COLS = ['joinme_id', 'name', 'name_en', 'type', 'type_mn', 'category_raw', 'province', 'soum', 'location', 'address', 'lat', 'lng', 'description', 'services', 'price', 'phones', 'phone_raw', 'email', 'website', 'joinme_url', 'booking_url', 'images', 'joinme_page_id', 'joinme_component_id'];
writeCsv(path.join(OUT, 'providers.csv'), COLS, providers);

// ---- 3. TIC-тэй нэрээр тулгах
const STOP = new Set(('жуулчны бааз баазын зочид буудал буудлын амралтын газар ресорт ресторан кемп хотел эко лоож ххк зуслан хүүхдийн гэр ' +
  'tourist camp ger hotel lodge resort guest house guesthouse eco llc restaurant the and').split(' '));
const PROVINCE_WORDS = new Set(['архангай', 'хэнтий', 'дундговь', 'сүхбаатар', 'завхан', 'увс', 'өмнөговь', 'хөвсгөл', 'төв', 'булган', 'дорнод', 'дорноговь', 'баянхонгор', 'өвөрхангай', 'говь-алтай', 'сэлэнгэ', 'ховд', 'баян-өлгий', 'орхон', 'дархан-уул', 'говьсүмбэр']);
const TR = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'j', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', ө: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sh', ъ: '', ы: 'i', ь: 'i', э: 'e', ю: 'yu', я: 'ya' };
const tokens = (s) => (s || '').toLowerCase().replace(/ё/g, 'е').replace(/[^a-zа-яөү0-9-]+/g, ' ').split(' ').filter((t) => t && !STOP.has(t) && !PROVINCE_WORDS.has(t));
// Кирилл/латин хоёуланг нэг латин "skeleton" болгоно: Хан Бүргэд ~ Khan Burged, Gobi ~ Говийн
const skel = (s) => [...s].map((c) => TR[c] ?? c).join('').replace(/kh/g, 'h').replace(/[yj]/g, 'i').replace(/b/g, 'v')
  .replace(/iin(?![a-z])/g, 'i').replace(/o/g, 'u').replace(/[^a-z0-9]/g, '').replace(/(.)\1+/g, '$1');
const lev = (a, b) => {
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
};
const variants = (...names) => {
  const out = new Set();
  for (const n of names.filter(Boolean)) {
    // TIC: «Даланзадгад - Өргөө (Urguu Hotel)» → бүтэн, хаалтан доторх, хаалтгүй, «X - » угтваргүй
    const tail = n.includes(' - ') ? n.split(' - ').slice(1).join(' ') : null;
    const parts = [n, ...[...n.matchAll(/\(([^)]+)\)/g)].map((m) => m[1]), n.replace(/\([^)]*\)/g, ' '), tail && tail.replace(/\([^)]*\)/g, ' ')].filter(Boolean);
    for (const p of parts) { const k = skel(tokens(p).join(' ')); if (k.length >= 3) out.add(k); }
  }
  return [...out];
};

const snap = JSON.parse(fs.readFileSync(SNAPSHOT, 'utf8'));
const entries = Array.isArray(snap) ? snap : snap.items || snap.entries;
const val = (f) => (f == null ? null : typeof f === 'object' && !Array.isArray(f) ? f.mn ?? f.en ?? Object.values(f)[0] : f);
const tic = entries
  .filter((e) => e.sys.contentType.sys.id === 'localProvider' && /touristinfocenter/.test(val(e.fields.sourceUrl) || ''))
  .map((e) => ({ id: e.sys.id, name: val(e.fields.name), slug: val(e.fields.slug), province: val(e.fields.province), sourceUrl: val(e.fields.sourceUrl), keys: variants(val(e.fields.name)) }));

// Аймгийн төв/сумын нэр дангаараа «contains» тулгалт болохгүй (Улиастай ШТС ≠ Улиастай зочид буудал)
const PLACES = new Set(['даланзадгад', 'улиастай', 'улаангом', 'мандалговь', 'өндөрхаан', 'чингис', 'баруун-урт', 'мөрөн', 'ханбогд', 'өмнөговь', 'завхан', 'увс', 'хэнтий', 'дундговь', 'сүхбаатар'].map(skel));
// Буцаах: { m: exact | fuzzy (1 үсгийн зөрүү) | contains, rank } — rank бага нь сайн (TIC-ийн бүтэн нэр > хаалтан доторх)
const METHOD_RANK = { exact: 0, fuzzy: 1, contains: 2 };
function score(a, b) {
  let best = null;
  const take = (m, j) => { const r = METHOD_RANK[m] * 10 + j; if (!best || r < best.rank) best = { m, rank: r }; };
  for (const x of a) b.forEach((y, j) => {
    if (x === y) return take('exact', j);
    const [s, l] = x.length <= y.length ? [x, y] : [y, x];
    if (s.length >= 8 && !PLACES.has(s) && lev(x, y) <= 1) return take('fuzzy', j);
    if (s.length >= 7 && !PLACES.has(s) && l.includes(s)) take('contains', j);
  });
  return best;
}
const matches = [];
const ticMatched = new Map();
// TIC-д зөвхөн байр байдаг тул joinme-ийн байр болон тодорхойгүй төрлийг л тулгана
for (const p of providers.filter((x) => LODGING.has(x.type) || x.type === 'other')) {
  const keys = variants(p.name, p.name_en);
  const cands = [];
  for (const t of tic) {
    if (t.province && t.province !== p.province) continue;
    const s = score(keys, t.keys);
    // аймаг нь тодорхой TIC entry-г аймаггүйгээс түрүүлж сонгоно
    if (s) cands.push({ t, m: s.m, rank: METHOD_RANK[s.m] * 100 + (t.province ? 0 : 50) + (s.rank % 10) });
  }
  cands.sort((a, b) => a.rank - b.rank);
  if (cands.length) {
    const { t, m } = cands[0];
    matches.push({ p, t, m, alt: cands.length - 1 });
    if (!ticMatched.has(t.id)) ticMatched.set(t.id, p);
  }
}
const matchedJoinme = new Set(matches.map((x) => x.p.joinme_id));
const rows = [];
for (const { p, t, m, alt } of matches) rows.push({ status: 'both', match_method: m + (alt ? ` (+${alt} өөр нэр дэвшигч)` : ''), joinme_id: p.joinme_id, joinme_name: p.name, joinme_name_en: p.name_en, joinme_type: p.type, joinme_province: p.province, joinme_soum: p.soum, tic_entry_id: t.id, tic_name: t.name, tic_province: t.province, tic_slug: t.slug, tic_source_url: t.sourceUrl });
for (const p of providers) if (LODGING.has(p.type) && !matchedJoinme.has(p.joinme_id)) rows.push({ status: 'joinme_only', joinme_id: p.joinme_id, joinme_name: p.name, joinme_name_en: p.name_en, joinme_type: p.type, joinme_province: p.province, joinme_soum: p.soum });
for (const t of tic) if (!ticMatched.has(t.id)) rows.push({ status: 'tic_only', tic_entry_id: t.id, tic_name: t.name, tic_province: t.province, tic_slug: t.slug, tic_source_url: t.sourceUrl, joinme_province: null });
writeCsv(path.join(OUT, 'match-with-tic.csv'), ['status', 'match_method', 'joinme_id', 'joinme_name', 'joinme_name_en', 'joinme_type', 'joinme_province', 'joinme_soum', 'tic_entry_id', 'tic_name', 'tic_province', 'tic_slug', 'tic_source_url'], rows);

// ---- 4. Статистик + README
const by = (arr, f) => arr.reduce((o, x) => ((o[f(x)] = (o[f(x)] || 0) + 1), o), {});
const pct = (n) => `${+((100 * n) / providers.length).toFixed(1)}%`;
const filled = (f) => providers.filter((p) => { const v = p[f]; return Array.isArray(v) ? v.length : v != null && v !== ''; }).length;
const provinces = [...new Set(pagesInfo.map((x) => x.province))];
const types = Object.entries(by(providers, (p) => p.type)).sort((a, b) => b[1] - a[1]);
const sevenProv = new Set(provinces);
const ticIn7 = tic.filter((t) => sevenProv.has(t.province));
const lodgingJoinme = providers.filter((p) => LODGING.has(p.type));
const stats = {
  total: providers.length, pages: pagesInfo, types: Object.fromEntries(types),
  matrix: Object.fromEntries(provinces.map((pr) => [pr, by(providers.filter((p) => p.province === pr), (p) => p.type)])),
  both_joinme_records: matches.length, both_tic_entries: ticMatched.size,
  joinme_only_lodging: lodgingJoinme.filter((p) => !matchedJoinme.has(p.joinme_id)).length, joinme_lodging: lodgingJoinme.length,
  tic_total: tic.length, tic_only: tic.length - ticMatched.size, tic_in_7: ticIn7.length, tic_only_in_7: ticIn7.filter((t) => !ticMatched.has(t.id)).length,
  tic_no_province: tic.filter((t) => !t.province).length,
  match_methods: by(matches, (x) => x.m),
};
const FIELDS = [
  ['name', 'Нэр'], ['name_en', 'Англи нэр (address талбараас, латин бол)'], ['type', 'Төрөл (ангиллаас/нэрээс)'], ['province', 'Аймаг'], ['soum', 'Сум'],
  ['location', 'Байршил (чөлөөт текст)'], ['address', 'Хаяг/англи нэр (address талбар)'], ['phones', 'Утас'], ['images', 'Зураг'],
  ['lat', 'Координат'], ['description', 'Тайлбар'], ['services', 'Үйлчилгээ'], ['price', 'Үнэ'], ['email', 'Имэйл'], ['website', 'Вэбсайт'],
  ['booking_url', 'Захиалгын холбоос'], ['timetable', 'Цагийн хуваарь'], ['joinme_url', 'joinme хуудасны холбоос'],
];
const md = `# joinme.mn — аймгийн үйлчилгээний байгууллагууд

joinme.mn-ийн «Аймгууд» (https://joinme.mn/Provinces) хэсгийн аймгийн хуудсуудаас цуглуулсан
жуулчны бааз, зочид буудал, ресторан болон бусад байгууллагын жагсаалт. Travel Hub-ийн
«Нутгийн Монгол» болон «Байр» хэсэгт ашиглахаар бэлтгэв.

Татсан огноо: ${stats.pages.length ? fs.statSync(path.join(RAW, 'Provinces.json')).mtime.toISOString().slice(0, 10) : ''}

## Файлууд

| Файл | Агуулга |
|---|---|
| \`providers.json\` | Бүх талбартай бүрэн өгөгдөл |
| \`providers.csv\` | Excel-д нээх хувилбар (UTF-8 BOM) — олон утгатай талбар \` \\| \`-ээр тусгаарлагдсан |
| \`match-with-tic.csv\` | TIC-ээс оруулсан ${tic.length} буудалтай нэрээр тулгасан үр дүн |
| \`raw/*.json\` | joinme API-ийн түүхий хариу (дахин боловсруулахад) |

Дахин үүсгэх: \`scripts/joinme/fetch.js\` (татах) → \`scripts/joinme/build.js\` (задлах, тулгах).

## Хаанаас, яаж татсан

- joinme.mn нь React SPA (shoppy.mn/cody платформ). Хуудас бүрийн агуулга
  \`GET https://api3.cody.mn/api/v2/dynamic/joinme/<slug>\` JSON-оор ирдэг; энэ нь OAuth
  \`client_credentials\` token шаарддаг (нийтийн JS bundle-д байдаг), тусдаа нээлттэй API биш.
- Token-ыг repo-д хадгалахгүйн тулд хуудсыг headless Edge-ээр render хийж, хөтчийн өөрийн
  хүсэлтийн хариуг CDP-ээр барьж авсан. Нийт ${stats.pages.length + 1} хуудас, хооронд нь 3+ сек завсарлагатай; зөвхөн унших.
- \`/Provinces\` хуудас зөвхөн **${stats.pages.length} аймгийн** хуудас руу холбоостой (21 биш):
${stats.pages.map((x) => `  - ${x.province} — https://joinme.mn/${x.slug} (page id ${x.page_id}): ${x.count} байгууллага`).join('\n')}
- Байгууллага бүр хуудсан дээрх \`Address\` компонент (\`name, address, location, phone, image, timetable\`).
  Төрлийг өмнөх гарчгаас (жишээ нь «Жуулчны бааз»), Завханы хуудас сумаар бүлэглэгдсэн тул нэрээс нь таамагласан.
- joinme-д байгууллага бүрийн тусдаа хуудас/ID байхгүй тул \`joinme_id\` = \`<page id>:<component uuid>:<index>\`.
- Зургийн URL: \`https://d1f6qhhrbg3j8a.cloudfront.net/img/<id>/original/<file>\` (сайт өөрөө ашигладаг CDN).

## Тоо

Нийт: **${stats.total}** байгууллага, ${provinces.length} аймгийн хуудаснаас (${provinces.filter((pr) => !stats.matrix[pr] || !Object.keys(stats.matrix[pr]).length).join(', ') || '—'} хуудсанд байгууллагын жагсаалт байхгүй).

### Төрлөөр

| Төрөл | Тоо |
|---|---:|
${types.map(([t, n]) => `| ${TYPE_MN[t]} (\`${t}\`) | ${n} |`).join('\n')}

### Аймаг × төрөл

| Аймаг | ${types.map(([t]) => `\`${t}\``).join(' | ')} | Нийт |
|---|${types.map(() => '---:').join('|')}|---:|
${provinces.map((pr) => `| ${pr} | ${types.map(([t]) => (stats.matrix[pr] || {})[t] || '').join(' | ')} | ${Object.values(stats.matrix[pr] || {}).reduce((a, b) => a + b, 0)} |`).join('\n')}

## Талбарын бүрэн байдал

| Талбар | Бөглөгдсөн | % |
|---|---:|---:|
${FIELDS.map(([f, l]) => `| ${l} (\`${f}\`) | ${filled(f)} | ${pct(filled(f))} |`).join('\n')}

joinme-ийн аймгийн хуудсанд координат, тайлбар, үйлчилгээ, үнэ, захиалгын холбоос, цагийн хуваарь
огт байхгүй — эдгээр талбар хоосон (\`null\`). Имэйл ба вэбсайтад тусдаа талбар байхгүй; цөөн тохиолдолд
утас/хаяг/байршлын текстэд бичигдсэнийг regex-ээр гаргасан (жишээ нь \`http://www.Magnai Trade.mn\` гэх мэт эх нь алдаатай).
Зураг 100% боловч зарим нь давхардсан/ерөнхий зураг (жишээ нь Элит буудал ба кофе шоп нэг зурагтай).
Байгууллага бүрт тусдаа joinme хуудас байхгүй тул \`joinme_url\` нь аймгийн хуудас руу заана.

## TIC-тэй тулгалт (\`match-with-tic.csv\`)

Эх: \`backups/contentful-snapshot-2026-10-27/entries.json\` — \`localProvider\`, \`sourceUrl\` нь touristinfocenter.mn (${tic.length} entry).
Contentful руу хүсэлт илгээгээгүй.

Арга: нэрийг жижиг үсэг болгож, ерөнхий үг (жуулчны бааз, зочид буудал, hotel, camp, ХХК …) болон аймгийн нэрийг хасаад,
кирилл/латиныг нэг латин хэлбэрт хөрвүүлж (Хан Бүргэд ≈ Khan Burged), TIC нэрийн хаалтан доторх англи нэрийг ч тусад нь харьцуулсан.
Тэнцүү бол \`exact\`, 1 үсгийн зөрүүтэй (≥8 тэмдэгт) бол \`fuzzy\`, нэг нь нөгөөдөө (≥7 тэмдэгт, хотын нэр дангаараа биш) агуулагдвал \`contains\`. Аймаг хоёуланд нь байвал ижил байх ёстой.
TIC-д зөвхөн байр байдаг тул joinme-ийн байр (бааз, буудал, амралт, гэр буудал) болон \`other\` төрлийг л тулгасан.
Нэг TIC entry-д хэд хэдэн joinme бичлэг тулгагдаж болно (жишээ нь «Оргих» зочид буудал ба бааз).

| | Тоо |
|---|---:|
| Давхцсан (joinme бичлэг) | ${stats.both_joinme_records} (${Object.entries(stats.match_methods).map(([k, v]) => `${k}: ${v}`).join(', ')}) |
| Давхцсан (TIC entry) | ${stats.both_tic_entries} |
| Зөвхөн joinme-д (байр: бааз/буудал/амралт/гэр буудал) | ${stats.joinme_only_lodging} / ${stats.joinme_lodging} |
| Зөвхөн TIC-д (нийт) | ${stats.tic_only} / ${stats.tic_total} |
| Зөвхөн TIC-д (joinme хамарсан ${provinces.length} аймагт) | ${stats.tic_only_in_7} / ${stats.tic_in_7} |

\`contains\` болон \`tic_province\` хоосон тулгалтыг гараар нягтлах хэрэгтэй. joinme-ийн ресторан, кофе шоп, ШТС, эмнэлэг зэрэг байр биш
бичлэгүүд тулгалтад болон \`joinme_only\` мөрөнд ороогүй (TIC-д ийм төрөл байхгүй).

## Анхаарах зүйлс

- Өгөгдөл хуучин байж болзошгүй: аймгийн хуудсууд ихэнхдээ 2020–2024 онд шинэчлэгдсэн.
- \`address\` талбарыг joinme ихэвчлэн англи нэрэнд ашигласан, заримдаа жинхэнэ хаяг. Латин үсэгтэй, тоо агуулаагүй бол \`name_en\` гэж авсан.
- \`location\` нь «УБ-с 989 км, Улиастайгаас 5 км» маягийн чөлөөт текст; координат байхгүй.
- Утсыг 8 оронтой дугаараар задалсан (\`phones\`); эх бичвэр \`phone_raw\`-д (7 оронтой гэх мэт буруу дугаар тэнд л үлдсэн).
- Өмнөговийн «Морь», «Тэмээ», «Гэр», «Гар урлал» нэртэй ${providers.filter((p) => p.province === 'Өмнөговь' && /^(морь|тэмээ|гэр|гар урлал)$/i.test(p.name)).length} бичлэг нь малчин өрхүүд — нэр нь ерөнхий, ялгах түлхүүр нь утас + байршил.
- Хөвсгөлийн хуудас зөвхөн аяллын баннертай, байгууллагын жагсаалтгүй.
- Завханы хуудас сумаар бүлэглэгдсэн, ШТС/эмнэлэг/ЗДТГ/ХХК зэрэг аялал жуулчлалын бус бичлэг олон; төрлийг нэрээс таамагласан тул \`other\`/\`company\` төрлийг шүүх хэрэгтэй.
`;
fs.writeFileSync(path.join(OUT, 'README.md'), md);
console.log(JSON.stringify({ ...stats, matrix: undefined }, null, 1));
for (const pr of provinces) console.log(pr, JSON.stringify(stats.matrix[pr]));
for (const f of FIELDS) console.log(f[0], filled(f[0]), pct(filled(f[0])));

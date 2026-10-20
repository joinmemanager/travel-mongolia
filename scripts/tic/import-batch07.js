// TIC 7-р багц: cate20 «Эвент» (34) → event, cate21 «Зочид буудал» (110) + cate22 «Жуулчны бааз» (256) →
// localProvider (providerType accommodation). Бүгд Draft.
//
//   node scripts/tic/import-batch07.js backups/tic-cache/batch04-08 --dry
//   node scripts/tic/import-batch07.js backups/tic-cache/batch04-08          # + docs/redirects/batch-07-events-camps-hotels.csv
//   (--only=c20_6,…; --no-images)
//
// Хаана:
//  - event: /things-to-do/festivals жагсаалт (getAllEvents), дэлгэрэнгүй /recommendation/<slug> (live хэсэг).
//  - localProvider: /local/<slug> — «Нутгийн Монгол» хэсэг soft (нээгээгүй): entry Draft, хэсгийг нээхгүй.
// Дүрэм:
//  - TIC текст өөрчлөхгүй (сурталчилгааны мөрийг хасна). Буудал/баазын бүтэцтэй талбар (гэр, байшин, ресторан,
//    тав тух, од, байршил, фэйсбүүк, координат) → services, contact, bookingUrl, location.
//  - Арга хэмжээний огноо: текстийн анхны бүтэн огноо (он-сар-өдөр) → startDate, бичвэр нь dateText.
//    Огноо нь 2026-10-20-оос өмнө бол «хуучирсан» гэж тоолно (огноог хэвээр хадгална).
//  - needsVerification = true: утас, имэйл, үнэ, огноо, фэйсбүүк (TIC-ээс авсан, шалгах). Буудал/бааз бүгд true.
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, LOCALE, callCount } = require('./_cma');
const { loadInventory, writeCsv } = require('./_csv');
const { checkBudget } = require('./_budget');
const B = require('./_batch03-06');
const { parseHtml, convert, plainText, wordCount, extractArticle, decode } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');
const { TIC, imageOrigin, imageUrl, ensureAsset, commonsCredit, hostCredit } = require('./_assets');

const CACHE = process.argv[2];
const DRY = process.argv.includes('--dry');
const NO_IMAGES = process.argv.includes('--no-images');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1]?.split(',');
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }

const SITE = 'https://www.travelhubmongolia.com';
const TODAY = '2026-10-20';
const REPORT_JSON = path.join(ROOT, 'backups', 'tic-cache', `batch07-result${ONLY ? '-only' : ''}.json`);
const L = (v) => ({ [LOCALE]: v });
const link = (type, id) => ({ sys: { type: 'Link', linkType: type, id } });
const LABEL = { 20: 'Арга хэмжээ, баяр наадам', 21: 'Зочид буудал', 22: 'Жуулчны бааз' };

const AMENITY = {
  Wifi: 'Wi-Fi', Laundry: 'Угаалга', Toilet: 'Ариун цэврийн өрөө', CoferenceHall: 'Хурлын танхим', ConferenceHall: 'Хурлын танхим',
  ChildPlayGround: 'Хүүхдийн тоглоомын талбай', Restaurant: 'Ресторан', Terrace: 'Терасс', LuggageStorage: 'Ачаа хадгалах',
  GuidedTour: 'Хөтөчтэй аялал', Parking: 'Зогсоол', LuggageTransport: 'Ачаа зөөх', RoomCleaning: 'Өрөө цэвэрлэгээ',
  ChildrenBed: 'Хүүхдийн ор', RoomInternet: 'Өрөөнд интернэт', Basketball: 'Сагсан бөмбөг', Volleyball: 'Гар бөмбөг',
  FloorHeating: 'Шалны халаалт', AirCondition: 'Агааржуулагч', RoomTV: 'Өрөөнд зурагт', Karaoke: 'Караоке', Sauna: 'Саун',
  Shower: 'Шүршүүр', HotWater: 'Халуун ус', Bar: 'Баар', Horse: 'Морин аялал', HorseRiding: 'Морин аялал', Massage: 'Массаж',
  Pool: 'Усан сан', Fitness: 'Фитнес', Billiards: 'Биллиард', TableTennis: 'Ширээний теннис', Football: 'Хөл бөмбөг',
  Camel: 'Тэмээн аялал', Fishing: 'Загас агнуур', Bicycle: 'Унадаг дугуй', Souvenir: 'Бэлэг дурсгал', Bath: 'Ванн',
  Spa: 'Спа', Disco: 'Диско', Transfer: 'Тээвэр', Golf: 'Гольф', Ski: 'Цана', AdditionalHeater: 'Нэмэлт халаагуур',
  AdditionalBed: 'Нэмэлт ор', RoomDiningService: 'Өрөөнд хоол үйлчилгээ', Bike: 'Унадаг дугуй', YakRiding: 'Сарлагаар аялах',
  Shopping: 'Дэлгүүр', Pingpong: 'Ширээний теннис', AnimalObserving: 'Амьтан ажиглах',
};
const UNITS = [
  ['GerNormal', 'Энгийн гэр'], ['GerTsomtsog', 'Цомцог гэр'], ['GerLux', 'Люкс гэр'], ['HouseNormal', 'Энгийн байшин'],
  ['Houselux', 'Люкс байшин'], ['HouseLux', 'Люкс байшин'],
];

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

// Гарчиг: кирилл хэсэг өгүүлбэрийн бичлэг (эхний үг, «(»/« - »-ийн дараах үг, аймгийн нэр том), латин үг бүр том үсгээр
const AIMAG_STEMS = B.AIMAGS.map(([n]) => n.toLocaleLowerCase('mn').split('-')[0].replace(/ь$/, '')).filter((s) => !['төв', 'дархан', 'баян', 'говь', 'гов'].includes(s));
function caseName(raw) {
  const lower = raw.replace(/\s+/g, ' ').trim().toLocaleLowerCase('mn');
  let first = true;
  return lower.replace(/[\p{L}]+/gu, (w, i) => {
    const before = lower.slice(Math.max(0, i - 2), i);
    const latin = /^[a-z]/.test(w);
    const cap = first || latin || /[("«-]\s?$/.test(before) || AIMAG_STEMS.some((s) => w.startsWith(s)) || /^(монгол|чингис|тэрэлж|хөвсгөл|хархорин|орхон)/.test(w);
    first = false;
    return cap ? w[0].toLocaleUpperCase('mn') + w.slice(1) : w;
  });
}

function aimagOf(text, title, invAimag) {
  const t = title.toLocaleUpperCase('mn');
  for (const [name] of B.AIMAGS) if (t.startsWith(name.toLocaleUpperCase('mn').replace(/-/g, '')) || t.startsWith(name.toLocaleUpperCase('mn'))) return name;
  const head = text.slice(0, 600);
  for (const [name] of B.AIMAGS) {
    const stem = name.replace(/ь$/, '').replace(/-/g, '[- ]?');
    if (new RegExp(`${stem}[а-яөүё]*\\s+(аймаг|хот)`, 'i').test(head)) return name;
  }
  if (/улаанбаатар|дүүрэг|\bхороо/i.test(head)) return 'Улаанбаатар';
  return invAimag && B.AIMAG_SLUG[invAimag] ? invAimag : null;
}

// Арга хэмжээний огноо: «2014 оны 8 сарын 15», «2014.08.15», «2014-08-15», «2014 оны 8-р сарын 15-17»
function eventDate(text) {
  const pats = [
    /((?:19|20)\d{2})\s*оны\s*(\d{1,2})\s*(?:-р|-?\s*р)?\s*(?:сарын)\s*(\d{1,2})(?:\s*[-–]\s*(\d{1,2}))?/i,
    /((?:19|20)\d{2})[./-](\d{1,2})[./-](\d{1,2})/,
  ];
  for (const re of pats) {
    const m = re.exec(text);
    if (!m) continue;
    const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (mo < 1 || mo > 12 || d < 1 || d > 31) continue;
    const iso = (dd) => `${y}-${String(mo).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
    return { start: iso(d), end: m[4] && Number(m[4]) > d && Number(m[4]) <= 31 ? iso(Number(m[4])) : undefined, text: m[0].trim() };
  }
  const y = /((?:19|20)\d{2})\s*(?:оны|он)/.exec(text);
  return y ? { text: y[0], year: Number(y[1]) } : null;
}

const VERIFY_RE = /(\+?976[\s-]?\d{4}[\s-]?\d{4}|\b[789]\d{3}[\s-]?\d{4}\b|утас|tel[:.]|[\w.-]+@[\w-]+\.\w+|₮|төгрөг|\$\s?\d|\d\s?(?:usd|доллар)|үнэ)/i;

function structured(html) {
  const val = (id) => {
    const m = new RegExp(`id="MainContent_${id}"[^>]*>([^<]*)`).exec(html);
    return m ? decode(m[1]).trim() : '';
  };
  const out = { services: [] };
  for (const [id, label] of UNITS) { const v = val(`lbl${id}`); if (v && v !== '0') out.services.push(`${label}: ${v}`); }
  const rest = val('lblRestaurentCapacity');
  if (rest && rest !== '0') out.services.push(`Ресторан: ${rest.replace(/\s*хүн$/, '')} хүний суудал`);
  const amen = [...new Set([...html.matchAll(/id="MainContent_div([A-Za-z]+)"/g)].map((m) => m[1]))];
  out.unknownAmenities = amen.filter((a) => !AMENITY[a]);
  out.services.push(...amen.map((a) => AMENITY[a] || a));
  const star = /id="MainContent_iStar"[^>]*src="[^"]*star(\d)/.exec(html);
  if (star && star[1] !== '0') out.star = Number(star[1]);
  out.location = val('lblLocation');
  const fb = /id="MainContent_lnkFacebook"[^>]*href="([^"]+)"/.exec(html);
  if (fb) out.facebook = decode(fb[1]).trim();
  const lat = /id="hIDLat"\s+value="([\d.]+)"/.exec(html), lon = /id="hIDLon"\s+value="([\d.]+)"/.exec(html);
  if (lat && lon && +lat[1] > 41 && +lat[1] < 52.2 && +lon[1] > 87 && +lon[1] < 120) out.coords = { lat: +(+lat[1]).toFixed(6), lon: +(+lon[1]).toFixed(6) };
  return out;
}

(async () => {
  const rows = loadInventory().filter((r) => ['20', '21', '22'].includes(r['ангилал']));
  // Одоо байгаа slug (event.slug, localProvider.slug unique; /recommendation/<slug>-д recommendation-тай давхцахгүй)
  const used = { event: new Set(), localProvider: new Set() };
  for (const [t, set] of [['event', used.event], ['recommendation', used.event], ['localProvider', used.localProvider]]) {
    const r = await cma('GET', `/entries?content_type=${t}&limit=1000&select=sys.id,fields.slug`);
    for (const e of r.items) if (!/^tic-c2[012]-/.test(e.sys.id) && fv(e, 'slug')) set.add(fv(e, 'slug'));
  }

  const items = rows.map((r) => {
    const file = path.join(CACHE, `${r.key}.html`);
    if (!fs.existsSync(file)) throw new Error(`${r.key}: кэшд алга`);
    const html = fs.readFileSync(file, 'utf8');
    const art = extractArticle(html);
    if (!art) throw new Error(`${r.key}: нийтлэлийн бие олдсонгүй`);
    if (norm(art.title) !== norm(r['гарчиг'])) throw new Error(`${r.key}: гарчиг таарсангүй «${art.title}» ≠ «${r['гарчиг']}»`);
    const cate = Number(r['ангилал']);
    const type = cate === 20 ? 'event' : 'localProvider';
    // « - » (зайтай) зураасыг жигдэлнэ; «Баян-Өлгий» зэрэг зайгүйг хэвээр
    const title = caseName(art.title.replace(/\s+-\s*|\s*-\s+/g, ' - '));
    let slug = B.slugify(title);
    const base = slug;
    for (let n = 2; used[type].has(slug); n++) slug = `${base}-${n}`;
    used[type].add(slug);
    const newPath = type === 'event' ? `/recommendation/${slug}` : `/local/${slug}`;
    return { row: r, key: r.key, cate, type, html, art, title, slug, newPath, oldUrl: TIC + r['хуучин_url'], id: `tic-${r.key.replace('_', '-')}` };
  });

  const rewriteMap = new Map(items.map((it) => [ticKey(it.oldUrl), it.newPath]));
  const { parseCsv } = require('./_csv');
  for (const f of fs.readdirSync(path.join(ROOT, 'docs', 'redirects'))) {
    if (!f.endsWith('.csv') || f.startsWith('batch-07')) continue;
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
    if (/сонин|medee|ikon|news/i.test(srcLine)) it.flags.push('сонин/мэдээний сайт');
    if (/facebook/i.test(srcLine)) it.flags.push('Facebook');
    for (const im of it.images) if (im.origin === 'third-party') it.flags.push(`зураг: ${new URL(imageUrl(im.src)).hostname}`);
    it.needsReplacement = it.flags.length > 0;
    it.st = it.type === 'localProvider' ? structured(it.html) : { services: [] };
    it.aimag = aimagOf(`${it.st.location || ''} ${it.text}`, it.art.title, it.row['аймаг']);
    if (it.type === 'event') {
      // Бүтэн огноо (он-сар-өдөр) эсвэл inventory-ийн «өнгөрсөн огноо (YYYY)» тэмдэглэл. Зөвхөн он дурдсан нь
      // түүхийн он байж болох тул (жишээ нь Наадам 1922) огноо гэж тооцохгүй.
      const d = eventDate(it.text);
      const invYear = /өнгөрсөн огноо \((\d{4})\)/.exec(it.row['шалтгаан']);
      it.date = d?.start ? d : invYear ? { text: `${invYear[1]} он (TIC-ийн бичвэрт)`, year: Number(invYear[1]) } : null;
      it.outdated = !!it.date && (it.date.start ? it.date.start < TODAY : it.date.year < 2026);
    }
    it.verify = [];
    if (VERIFY_RE.test(it.text)) it.verify.push('утас/имэйл/үнэ текстэд');
    if (it.type === 'localProvider') it.verify.push('буудал/баазын мэдээлэл (TIC-ээс авсан, шалгах)');
    if (it.st.facebook) it.verify.push('фэйсбүүк холбоос');
    if (it.date) it.verify.push('огноо');
    it.needsVerification = it.verify.length > 0;
  }

  const plannedImages = NO_IMAGES ? 0 : items.reduce((s, it) => s + it.images.filter((i) => i.origin !== 'broken').length, 0);
  if (!ONLY) await checkBudget(items.length + plannedImages, '7-р багц (entry + зураг)');

  const usedDesc = new Set();
  for (const it of items) {
    const label = LABEL[it.cate];
    const place = it.aimag ? `${it.aimag}${it.aimag === 'Улаанбаатар' ? ' хот' : ' аймаг'}` : '';
    it.seoTitle = seoTitle(it.title, it.type === 'event' ? label : [label, it.aimag].filter(Boolean).join(', '));
    const fallback = it.type === 'event'
      ? `${label}: TIC-ийн архиваас — Travel Hub Mongolia.`
      : `${label}${place ? `, ${place}` : ''}: байршил, байр, үйлчилгээ (TIC-ээс авсан, шалгах).`;
    const textForDesc = it.text.trim() || [it.st.location, it.st.services.join(', ')].filter(Boolean).join('. ');
    it.seoDescription = seoDescription(textForDesc || it.title, { name: it.title, stem: it.title.split(/[ ,.-]/)[0], fallback }, usedDesc);
    if (it.seoDescription.length < 120) it.seoDescription = `${it.seoDescription.replace(/[.…]?$/, '.')} Travel Hub Mongolia.`.slice(0, 155);
  }

  const imageErrors = [];
  const result = { entries: [], imageErrors };

  async function resolveImages(it) {
    const out = [], assets = [];
    let n = 0;
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
        assets.push(id);
        out.push({ nodeType: 'embedded-asset-block', data: { target: link('Asset', id) }, content: [] });
      } catch (e) {
        imageErrors.push({ key: it.key, src: shown.slice(0, 160), error: e.message });
      }
    }
    return { content: out, assets: [...new Set(assets)].filter((x) => x !== 'dry-run') };
  }

  async function upsert(id, contentType, fields) {
    const cur = await cma('GET', `/entries/${id}`);
    if (!cur) return cma('PUT', `/entries/${id}`, { contentType, body: { fields } });
    if (fv(cur, 'slug') && fv(cur, 'slug') !== fields.slug[LOCALE]) fields.slug = cur.fields.slug; // байгаа slug-ийг өөрчлөхгүй
    return cma('PUT', `/entries/${id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
  }

  async function handle(it) {
    const { content, assets } = await resolveImages(it);
    const doc = { nodeType: 'document', data: {}, content };
    const common = {
      slug: L(it.slug), seoTitle: L(it.seoTitle), seoDescription: L(it.seoDescription), sourceUrl: L(it.oldUrl),
      needsReplacement: L(it.needsReplacement), needsVerification: L(it.needsVerification),
    };
    if (assets.length) common.photos = L(assets.map((a) => link('Asset', a)));
    if (it.type === 'event') {
      const fields = { title: L(it.title), ...common };
      if (content.length) fields.culturalMeaning = L(doc);
      if (it.aimag) fields.province = L(it.aimag);
      if (it.date?.start) fields.startDate = L(it.date.start);
      if (it.date?.end) fields.endDate = L(it.date.end);
      if (it.date) fields.dateText = L(it.date.text.slice(0, 250));
      if (!DRY) await upsert(it.id, 'event', fields);
    } else {
      const services = [it.cate === 21 ? 'Зочид буудал' : 'Жуулчны бааз', ...(it.st.star ? [`${it.st.star} од`] : []), ...it.st.services];
      const fields = { name: L(it.title), providerType: L('accommodation'), services: L([...new Set(services)].map((s) => s.slice(0, 250))), ...common };
      if (content.length) fields.story = L(doc);
      if (it.aimag) fields.province = L(it.aimag);
      if (it.st.coords) fields.location = L(it.st.coords);
      if (it.st.location) fields.contact = L(`Хаяг: ${it.st.location}`.slice(0, 250));
      if (it.st.facebook && /^https?:\/\//.test(it.st.facebook)) fields.bookingUrl = L(it.st.facebook.slice(0, 250));
      if (!DRY) await upsert(it.id, 'localProvider', fields);
    }
    const rec = {
      id: it.id, key: it.key, cate: it.cate, type: it.type, title: it.title, slug: it.slug, path: it.newPath, aimag: it.aimag,
      words: it.words, images: it.images.length, date: it.date, outdated: !!it.outdated, needsReplacement: it.needsReplacement, flags: it.flags,
      needsVerification: it.needsVerification, verify: it.verify, services: it.st.services, coords: it.st.coords, unknownAmenities: it.st.unknownAmenities,
      seoTitle: it.seoTitle, seoDescription: it.seoDescription,
    };
    result.entries.push(rec);
    console.log(`${DRY ? '[dry] ' : ''}${it.newPath} ← ${it.key} «${it.title}» ${it.aimag || '—'} (${it.words} үг, зураг ${it.images.length}${it.date ? `, огноо ${it.date.start || it.date.year}${it.outdated ? ' хуучирсан' : ''}` : ''}${it.st.coords ? ', coord' : ''}${it.needsVerification ? ', шалгах' : ''}${it.needsReplacement ? ', NR' : ''}) [${it.seoTitle.length}/${it.seoDescription.length}]`);
  }

  const todo = items.filter((it) => !ONLY || ONLY.includes(it.key));
  let next = 0;
  await Promise.all(Array.from({ length: DRY ? 1 : 4 }, async () => { while (next < todo.length) await handle(todo[next++]); }));
  const order = new Map(items.map((it, i) => [it.key, i]));
  result.entries.sort((a, b) => order.get(a.key) - order.get(b.key));

  if (!ONLY) {
    const redirects = items.map((it) => [it.oldUrl, SITE + it.newPath, it.title, LABEL[it.cate] + (it.type === 'localProvider' ? ' (хэсэг нээгдээгүй: /local)' : ''), it.aimag || '']);
    // TIC-ийн cate21 жагсаалтын алдаа: буудал руу cate4_more.aspx?ItemID=<буудлын id> гэж холбодог.
    // Байгалийн цогцолборт газрын ID-тай давхцаагүй буудлын cate4_more хаягийг буудал руу (давхцсан 15 нь 3-р сэдэвт).
    const cate4 = new Set(loadInventory().filter((r) => r['ангилал'] === '4').map((r) => r['хуучин_url'].split('ItemID=')[1]));
    for (const it of items.filter((x) => x.cate === 21)) {
      const idn = it.row['хуучин_url'].split('ItemID=')[1];
      if (!cate4.has(idn)) redirects.push([`${TIC}/cate4_more.aspx?ItemID=${idn}`, SITE + it.newPath, it.title, 'Зочид буудал (TIC-ийн буруу cate4 холбоос; хэсэг нээгдээгүй: /local)', it.aimag || '']);
    }
    if (!DRY) writeCsv(path.join(ROOT, 'docs', 'redirects', 'batch-07-events-camps-hotels.csv'), ['old_url', 'new_url', 'title', 'ангилал', 'аймаг'], redirects);
    result.redirectRows = redirects.length;
  }
  fs.writeFileSync(REPORT_JSON, JSON.stringify(result, null, 2), 'utf8');
  const c = (f) => result.entries.filter(f).length;
  const unknown = [...new Set(result.entries.flatMap((e) => e.unknownAmenities || []))];
  console.log(`event ${c((e) => e.type === 'event')} (хуучирсан ${c((e) => e.outdated)}, огноотой ${c((e) => e.date?.start)}), буудал ${c((e) => e.cate === 21)}, бааз ${c((e) => e.cate === 22)}, coord ${c((e) => e.coords)}, шалгах ${c((e) => e.needsVerification)}, NR ${c((e) => e.needsReplacement)}, зургийн алдаа ${imageErrors.length}, CMA ${callCount()}`);
  if (unknown.length) console.log('танихгүй тав тух:', unknown.join(', '));
  for (const e of imageErrors) console.log('  зураг алгасав:', e.key, e.error, e.src);
})().catch((e) => { console.error(e); process.exit(1); });

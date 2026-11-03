// OpenStreetMap-аас аймгийн практик үйлчилгээ (шатахуун, эмнэлэг, эмийн сан, цагдаа, банк/АТМ).
//   node scripts/osm/services.js fetch   # Overpass-аас татаж backups/osm/services-<огноо>.json-д хадгална
//   node scripts/osm/services.js build   # хадгалсан түүхий өгөгдлөөс travel-mongolia/data/services/osm/<slug>.json
// Хамрах хүрээ (эзэмшигч баталсан, 2026-11-03): нэртэй газар + нэргүй шатахуун станц, 21 аймаг (Улаанбаатар биш).
// joinme.mn-ийн мэдээлэлтэй аймагт (Завхан, Увс) зөвхөн joinme-д байхгүй төрлийг нэмнэ.
// Лиценз: © OpenStreetMap contributors (ODbL). joinme-ийн JSON-той холихгүй, data/services/osm/ дотор тусад нь.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, 'travel-mongolia', 'data', 'services', 'osm');
const JOINME = path.join(ROOT, 'travel-mongolia', 'data', 'services');
const RAW_DIR = path.join(ROOT, 'backups', 'osm');
const RAW_DATE = '2026-11-03';
const RAW = path.join(RAW_DIR, `services-${RAW_DATE}.json`);
const EPS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const AMENITY = 'fuel|hospital|clinic|doctors|pharmacy|police|bank|atm';
const TYPE = { fuel: 'fuel_station', hospital: 'hospital', clinic: 'hospital', doctors: 'hospital', pharmacy: 'pharmacy', police: 'police', bank: 'bank', atm: 'bank' };
const FUEL_NAME = 'Шатахуун түгээх станц';
// Утгагүй, туршилтын нэр: шатахуун бол нэргүй станц гэж үзнэ, бусдыг хасна (нэрсийг нэг бүрчлэн шалгасан)
const JUNK_NAME = /^(хүлээн авах|reception|bzbzbzb|haha|hi okay good luck|aa|i|u|z|х|р|vj|1|76|iur|open - 2026|ona \[2026\] visa card|hog n deer|home|ger|гэр|hodoo|bohon|zam|zamiin am|uulzvar|south gate|small station - emergency wind shelter|hudgiin baruun|7 hashaa)$/iu;
// Хүний нэрээр тэмдэглэсэн айл, өвөлжөө; цэргийн анги: олон нийтийн үйлчилгээ биш, хасна
const PRIVATE_NAME = /(^|\s)(ah|ahiin|ahiinh|ах|ахын|ахынх)(\s|$)|baajiiginh|ynh$|ынх$|uvuljuu|zunjaa|өвөлжөө|хаваржаа|намаржаа|зуслан|military post|air force/iu;

const SLUG = {
  Архангай: 'arkhangai', 'Баян-Өлгий': 'bayan-ulgii', Баянхонгор: 'bayankhongor', Булган: 'bulgan', 'Говь-Алтай': 'gov-altai',
  Говьсүмбэр: 'govsumber', 'Дархан-Уул': 'darkhan-uul', Дорноговь: 'dornogov', Дорнод: 'dornod', Дундговь: 'dundgov',
  Завхан: 'zavkhan', Орхон: 'orkhon', Өвөрхангай: 'uvurkhangai', Өмнөговь: 'umnugov', Сүхбаатар: 'sukhbaatar',
  Сэлэнгэ: 'selenge', Төв: 'tuv', Увс: 'uvs', Ховд: 'khovd', Хөвсгөл: 'khuvsgul', Хэнтий: 'khentii',
};

// Магнай Трейд-ийн колонк: OSM-д «МТ», «MT ШТС», «МТ трейд ШТС» г.м. олон хэлбэрээр (кирилл, латин холимог)
const MT_BRAND = 'Магнай Трейд (МТ)';
const MT_NAME = /^([mм][tт](ш|рейд|\s*-?\s*(штс|бинзен колонк|klonk|shatguun tvgegvvr|petroleum station|трейд(\s+штс)?))?|магнай\s+тр[еэ]йд(\s+штс)?)$/iu;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function overpass(query) {
  for (let i = 0; i < 9; i++) {
    const ep = EPS[i % EPS.length];
    try {
      const r = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': 'TravelHubMongolia-data/1.0 (contact@joinme.mn)' },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(150000),
      });
      if (r.ok) return r.json();
      console.log('  дахин', ep.split('/')[2], r.status);
    } catch (e) {
      console.log('  дахин', ep.split('/')[2], e.name);
    }
    await sleep(15000);
  }
  throw new Error('Overpass хариу өгсөнгүй');
}

async function fetchAll() {
  fs.mkdirSync(RAW_DIR, { recursive: true });
  const raw = fs.existsSync(RAW) ? JSON.parse(fs.readFileSync(RAW, 'utf8')) : {};
  const areas = await overpass('[out:json][timeout:60];area["boundary"="administrative"]["admin_level"="4"]["ISO3166-2"~"^MN-"];out tags;');
  for (const a of areas.elements) {
    const iso = a.tags['ISO3166-2'];
    const name = a.tags['name:mn'] || a.tags.name;
    if (raw[iso] || !SLUG[name]) continue;
    await sleep(5000);
    const d = await overpass(`[out:json][timeout:120];area(${a.id})->.a;(nwr["amenity"~"^(${AMENITY})$"](area.a););out center tags;`);
    raw[iso] = { id: a.id, iso, name, elements: d.elements };
    fs.writeFileSync(RAW, JSON.stringify(raw));
    console.log(name, d.elements.length);
  }
}

const nameOf = (t) => [t['name:mn'], t.name, t.brand, t.operator].map((x) => (x || '').trim()).find(Boolean) || '';

// Монгол дугаар: +976, зай, зураасыг хасаад 8 оронтой. Бусдыг (хуучин 5-6 оронтой) орхино.
function phonesOf(t) {
  return [...new Set(String(t.phone || t['contact:phone'] || '').split(/[;,/]/).map((p) => {
    const d = p.replace(/\D/g, '').replace(/^976/, '');
    return d.length === 8 ? d : '';
  }).filter(Boolean))];
}

function locationOf(t) {
  return [t['addr:district'], t['addr:subdistrict'], t['addr:city'], t['addr:street'], t['addr:housenumber']].map((x) => (x || '').trim()).filter(Boolean).join(', ') || null;
}

function distanceM(a, b) {
  const dLat = (a.lat - b.lat) * 111000;
  const dLon = (a.lon - b.lon) * 111000 * Math.cos((a.lat * Math.PI) / 180);
  return Math.hypot(dLat, dLon);
}

function build() {
  const raw = JSON.parse(fs.readFileSync(RAW, 'utf8'));
  fs.mkdirSync(OUT, { recursive: true });
  const stats = { droppedUnnamed: 0, droppedJunk: 0, droppedPrivate: 0, droppedNoCoords: 0, droppedDuplicate: 0, droppedJoinmeType: 0, reclassified: 0, mtRenamed: 0 };
  const rows = [];
  for (const r of Object.values(raw)) {
    const slug = SLUG[r.name];
    if (!slug) continue;
    const joinmeFile = path.join(JOINME, `${slug}.json`);
    const joinmeTypes = new Set(fs.existsSync(joinmeFile) ? JSON.parse(fs.readFileSync(joinmeFile, 'utf8')).items.map((x) => x.type) : []);
    const items = [];
    for (const e of r.elements) {
      const t = e.tags;
      let type = TYPE[t.amenity];
      let name = nameOf(t);
      if (PRIVATE_NAME.test(name)) { stats.droppedPrivate++; continue; }
      if (JUNK_NAME.test(name)) {
        if (type !== 'fuel_station') { stats.droppedJunk++; continue; }
        name = '';
      }
      if (!name) {
        if (type !== 'fuel_station') { stats.droppedUnnamed++; continue; }
        name = FUEL_NAME;
      }
      if (type === 'fuel_station' && MT_NAME.test(name)) { name = MT_BRAND; stats.mtRenamed++; }
      // Төрлөө буруу тэмдэглэсэн («эмнэлэг» гэсэн эмийн сан)
      if (type === 'hospital' && /эмийн сан/i.test(name)) { type = 'pharmacy'; stats.reclassified++; }
      if (joinmeTypes.has(type)) { stats.droppedJoinmeType++; continue; }
      const lat = e.lat ?? e.center?.lat;
      const lon = e.lon ?? e.center?.lon;
      if (typeof lat !== 'number' || typeof lon !== 'number') { stats.droppedNoCoords++; continue; }
      const point = { lat, lon };
      // Нэг газрыг барилга, цэг хоёроор давхар зурсан
      if (items.some((x) => x.type === type && x.name === name && name !== FUEL_NAME && distanceM(x, point) < 60)) { stats.droppedDuplicate++; continue; }
      if (items.some((x) => x.type === type && name === FUEL_NAME && distanceM(x, point) < 30)) { stats.droppedDuplicate++; continue; }
      items.push({
        id: `osm-${e.type[0]}${e.id}`,
        name,
        type,
        soum: null,
        location: locationOf(t),
        phones: phonesOf(t),
        image: null,
        source: 'osm',
        lat: Math.round(lat * 1e5) / 1e5,
        lon: Math.round(lon * 1e5) / 1e5,
      });
    }
    items.sort((a, b) => a.type.localeCompare(b.type) || a.name.localeCompare(b.name, 'mn') || a.id.localeCompare(b.id));
    fs.writeFileSync(path.join(OUT, `${slug}.json`), `${JSON.stringify({ province: r.name, slug, source: 'OpenStreetMap', license: 'ODbL', attribution: '© OpenStreetMap contributors', fetchedAt: RAW_DATE, items })}\n`);
    const c = items.reduce((o, x) => { o[x.type] = (o[x.type] || 0) + 1; return o; }, {});
    rows.push({ name: r.name, total: items.length, ...c, phones: items.filter((x) => x.phones.length).length });
  }
  rows.sort((a, b) => a.name.localeCompare(b.name, 'mn'));
  rows.forEach((x) => console.log(JSON.stringify(x)));
  const sum = rows.reduce((o, x) => { for (const k of ['total', 'fuel_station', 'hospital', 'pharmacy', 'police', 'bank', 'phones']) o[k] = (o[k] || 0) + (x[k] || 0); return o; }, {});
  console.log('аймаг', rows.length, 'нийт', JSON.stringify(sum));
  console.log('хассан', JSON.stringify(stats));
}

(async () => {
  const cmd = process.argv[2];
  if (cmd === 'fetch') await fetchAll();
  else if (cmd === 'build') build();
  else throw new Error('хэрэглээ: fetch | build');
})().catch((e) => { console.error(e.message); process.exit(1); });

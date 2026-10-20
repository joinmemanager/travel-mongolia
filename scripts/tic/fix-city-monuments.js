// heritageCategory «Хотын дурсгалт газрууд» (tic-heritage-city-monuments)-ийн places жагсаалтыг сэргээнэ (Draft).
// Шалтгаан: import-batch03-06.js --topic=6 --only=… дахин ажиллуулахад cityMonumentIds зөвхөн тэр entry-үүдээр
// (0) бичигдэж, нийтлэгдсэн хувилбарт «Нийт 0 газар», places хоосон болсон (2026-10-20 олдсон).
// Жагсаалтыг batch03-06-topic6-result.json-ийн дарааллаар (TIC жагсаалтын дараалал) heritagePlace tic-c9-*-ээс бүтээнэ.
//   node scripts/tic/fix-city-monuments.js [--dry]
const fs = require('fs');
const path = require('path');
const { cma, ROOT, LOCALE } = require('./_cma');

const DRY = process.argv.includes('--dry');
const ID = 'tic-heritage-city-monuments';

(async () => {
  const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'backups', 'tic-cache', 'batch03-06-topic6-result.json'), 'utf8'));
  const ids = r.entries.filter((e) => e.type === 'heritagePlace' && e.id.startsWith('tic-c9-')).map((e) => e.id);
  // Contentful-д байгаа эсэхийг шалгана
  const res = await cma('GET', `/entries?content_type=heritagePlace&sys.id[in]=${ids.join(',')}&limit=1000&select=sys.id`);
  const have = new Set(res.items.map((e) => e.sys.id));
  const places = ids.filter((id) => have.has(id));
  console.log(`tic-c9 heritagePlace: тайланд ${ids.length}, Contentful-д ${places.length}`);
  const cur = await cma('GET', `/entries/${ID}`);
  const fields = {
    ...cur.fields,
    count: { [LOCALE]: `Нийт ${places.length} газар` },
    places: { [LOCALE]: places.map((id) => ({ sys: { type: 'Link', linkType: 'Entry', id } })) },
  };
  if (!DRY) await cma('PUT', `/entries/${ID}`, { version: cur.sys.version, body: { fields } });
  console.log(`${DRY ? '[dry] ' : ''}${ID}: places ${places.length} (Draft)`);
})().catch((e) => { console.error(e.message); process.exit(1); });

// 3, 5, 6-р сэдэв: тусгай хамгаалалттай газар (cate2–5), байгаль (cate10–12), музей/рашаан/хотын
// дурсгалт газар (cate17, 8, 9)-ын TIC нийтлэлийн HTML-ийг кэш хавтас руу татна.
// Ажиллуулах: node scripts/tic/fetch-batch03-06.js <кэш_хавтас> [ангилал,...]
// TIC сервер рүү хүсэлт бүрийн хооронд ≥1 секунд хүлээнэ. Татсан файлыг дахин татахгүй (тасарвал үргэлжилнэ).
const fs = require('fs');
const path = require('path');
const { loadInventory } = require('./_csv');

const CACHE = process.argv[2];
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }
const CATS = (process.argv[3] || '2,3,4,5,10,11,12,17,8,9').split(',');
fs.mkdirSync(CACHE, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const rows = loadInventory().filter((r) => CATS.includes(r['ангилал']));
  console.log('нийтлэл:', rows.length);
  let n = 0;
  for (const r of rows) {
    const file = path.join(CACHE, `${r.key}.html`);
    if (fs.existsSync(file) && fs.statSync(file).size > 5000) continue;
    const url = 'https://www.touristinfocenter.mn' + r['хуучин_url'];
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 TravelHubMigration' } });
      const html = await res.text();
      fs.writeFileSync(file, html, 'utf8');
      if (++n % 25 === 0 || res.status !== 200) console.log(res.status, r.key, r['гарчиг'], html.length);
    } catch (e) {
      console.log('алдаа', r.key, e.message);
    }
    await sleep(1100);
  }
  console.log('дууслаа, шинээр татсан:', n);
})().catch((e) => { console.error(e); process.exit(1); });

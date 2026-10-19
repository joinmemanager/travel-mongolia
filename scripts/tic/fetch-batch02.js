// 2-р багц: «Монголын түүх»-ийн 44 TIC нийтлэлийн HTML-ийг кэш хавтас руу татна.
// Ажиллуулах: node scripts/tic/fetch-batch02.js <кэш_хавтас>
// TIC сервер рүү хүсэлт бүрийн хооронд ≥1 секунд хүлээнэ.
const fs = require('fs');
const path = require('path');
const { loadInventory } = require('./_csv');
const { batch02Rows } = require('./_batch02');

const CACHE = process.argv[2];
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }
fs.mkdirSync(CACHE, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const rows = batch02Rows(loadInventory());
  console.log('нийтлэл:', rows.length);
  for (const r of rows) {
    const file = path.join(CACHE, `${r.key}.html`);
    if (fs.existsSync(file) && fs.statSync(file).size > 5000) continue;
    const url = 'https://www.touristinfocenter.mn' + r['хуучин_url'];
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 TravelHubMigration' } });
    const html = await res.text();
    fs.writeFileSync(file, html, 'utf8');
    console.log(res.status, r.key, r['гарчиг'], html.length);
    await sleep(1100);
  }
})().catch((e) => { console.error(e); process.exit(1); });

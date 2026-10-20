// 4-р багц (cate1), 7-р багц (cate20 эвент, cate21 зочид буудал, cate22 жуулчны бааз), 8-р багц (мэдээ)-ын
// TIC нийтлэлийн HTML-ийг кэш хавтас руу татна. Мэдээний «АЛГАСАХ» мөрийг (inventory: хуучирсан, гадаад) татахгүй.
// Ажиллуулах: node scripts/tic/fetch-batch04-08.js <кэш_хавтас> [ангилал,...]   (анхдагч: 1,20,21,22,news)
// TIC сервер рүү хүсэлт бүрийн хооронд ≥1 секунд. Татсан файлыг дахин татахгүй (тасарвал үргэлжилнэ).
const fs = require('fs');
const path = require('path');
const { loadInventory } = require('./_csv');

const CACHE = process.argv[2];
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }
const CATS = (process.argv[3] || '1,20,21,22,news').split(',');
fs.mkdirSync(CACHE, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const rows = loadInventory().filter((r) => CATS.includes(r['ангилал']) && !(r['ангилал'] === 'news' && r['шийдвэр'] === 'АЛГАСАХ'));
  console.log('нийтлэл:', rows.length);
  let n = 0, errors = 0;
  for (const r of rows) {
    const file = path.join(CACHE, `${r.key}.html`);
    if (fs.existsSync(file) && fs.statSync(file).size > 5000) continue;
    const url = 'https://www.touristinfocenter.mn' + r['хуучин_url'];
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 TravelHubMigration' }, signal: AbortSignal.timeout(30000) });
        const html = await res.text();
        fs.writeFileSync(file, html, 'utf8');
        if (++n % 50 === 0 || res.status !== 200) console.log(res.status, n, r.key, r['гарчиг'].slice(0, 50), html.length);
        break;
      } catch (e) {
        console.log('алдаа', attempt, r.key, e.message);
        if (attempt === 3) errors++;
        await sleep(3000 * attempt);
      }
    }
    await sleep(1100);
  }
  console.log('дууслаа, шинээр татсан:', n, 'алдаа:', errors);
})().catch((e) => { console.error(e); process.exit(1); });

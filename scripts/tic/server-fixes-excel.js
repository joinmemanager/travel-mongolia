// TIC сервер дээр засах redirect-ийн жагсаалтыг кодерт өгөх Excel болгоно (docs/redirects/excel/tic-server-fixes.xlsx).
// CSV-ийг өөрчлөхгүй. Мөр бүрийн одоогийн хариуг шалгана (TIC руу ≥1 секунд тутам, redirect дагахгүй).
//   1) batch-02: cate14_more.aspx?ItemID=168 буруу хаяг руу (slug-ийн ард илүү тэмдэгт) очиж 404 өгдөг
//   2) batch-07: буудлын TIC-ийн буруу cate4_more холбоос (95) redirect-гүй, 200 буцаадаг
//   node scripts/tic/server-fixes-excel.js
const fs = require('fs');
const path = require('path');
const { parseCsv } = require('./_csv');
const { xlsx } = require('./_xlsx');

const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'docs', 'redirects');
const OUT = path.join(DIR, 'excel', 'tic-server-fixes.xlsx');
const read = (f) => parseCsv(fs.readFileSync(path.join(DIR, f), 'utf8'));
const itemId = (u) => Number((/ItemID=(\d+)/i.exec(u) || [])[1]);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fix168 = read('batch-02-history.csv').filter((r) => /\/cate14_more\.aspx\?ItemID=168$/i.test(r.old_url));
const hotels = read('batch-07-events-camps-hotels.csv').filter((r) => /\/cate4_more\.aspx\?/i.test(r.old_url));
// Байгалийн цогцолборт газрын (cate4) өөрийн ID-ууд: эдгээрийг буудал руу шилжүүлж болохгүй
const parks = read('batch-03-protected.csv').filter((r) => /\/cate4_more\.aspx\?/i.test(r.old_url)).map((r) => itemId(r.old_url));
const clash = hotels.filter((r) => parks.includes(itemId(r.old_url)));
if (fix168.length !== 1 || hotels.length !== 95 || clash.length) throw new Error(`хүлээгдээгүй тоо: 168=${fix168.length}, буудал=${hotels.length}, давхцал=${clash.length}`);

async function probe(url) {
  for (let i = 1; i <= 3; i++) {
    try {
      const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'TravelHubMongolia-redirect-check/1.0' }, signal: AbortSignal.timeout(30000) });
      await res.arrayBuffer().catch(() => {});
      return { status: res.status, location: res.headers.get('location') || '' };
    } catch (e) {
      if (i === 3) return { status: 0, location: e.message };
      await sleep(2000 * i);
    }
  }
}
const now = (p) => (p.status >= 300 && p.status < 400 ? `${p.status} → ${p.location}` : p.status === 200 ? '200 (redirect алга)' : String(p.status));

(async () => {
  const rows = [];
  const tally = {};
  for (const [r, issue] of [...fix168.map((r) => [r, 'Буруу хаяг руу redirect хийдэг (404)']), ...hotels.map((r) => [r, 'Redirect тохируулаагүй (TIC-ийн буруу cate4 холбоос, буудал)'])]) {
    const old = await probe(r.old_url);
    await sleep(1000);
    const target = await probe(r.new_url);
    const wrongTarget = old.location && old.location !== r.new_url ? await probe(old.location) : null;
    rows.push([r.old_url, now(old) + (wrongTarget ? ` (${wrongTarget.status})` : ''), r.new_url, issue, target.status]);
    tally[issue] = (tally[issue] || 0) + 1;
  }
  const head = ['Хуучин хаяг (TIC)', 'Одоогийн хариу (TIC)', 'Зөв хаяг (Travel Hub)', 'Асуудал', 'Шалгалт'];
  const counts = Object.entries(tally);
  const total = counts.reduce((n, [, c]) => n + c, 0);
  const notes = [
    ['#', 'Тэмдэглэл'],
    [1, `cate14_more.aspx?ItemID=168: одоогийн дүрмийн хаягийн төгсгөлд илүү тэмдэгт залгагдсан. Зөв хаяг: ${fix168[0].new_url}`],
    [2, `cate4_more.aspx: зөвхөн энэ хүснэгтийн ${hotels.length} ItemID-г буудлын хаяг руу шилжүүлнэ. ItemID-г яг тэнцүүгээр шалгана (ItemID=1 нь 1148-тэй таарч болохгүй).`],
    [3, `cate4_more.aspx-ийн ${parks.length} ItemID (${parks.sort((a, b) => a - b).join(', ')}) нь байгалийн цогцолборт газар. Тэдгээрийн одоогийн redirect-ийг өөрчлөхгүй.`],
    [4, 'Шалгалт = Зөв хаяг (Travel Hub)-ийн HTTP хариу. 200 = нээгдэж байна.'],
  ];
  fs.writeFileSync(OUT, xlsx([
    { name: 'Засах redirect', rows: [head, ...rows], autoFilter: true },
    { name: 'Асуудлаар тоо', rows: [['Асуудал', 'Тоо'], ...counts, ['Нийт', { f: `SUM(B2:B${counts.length + 1})`, v: total }]], boldLast: true },
    { name: 'Кодерт анхааруулах', rows: notes, colWidths: [5, 140] },
  ]));
  console.log(OUT, rows.length, 'мөр', tally);
  console.log('TIC одоогийн хариу:', rows.reduce((o, r) => { const k = r[1].replace(/ → .*/, ' →'); o[k] = (o[k] || 0) + 1; return o; }, {}));
  console.log('Travel Hub шалгалт:', rows.reduce((o, r) => { o[r[4]] = (o[r[4]] || 0) + 1; return o; }, {}));
})().catch((e) => { console.error(e.message); process.exit(1); });

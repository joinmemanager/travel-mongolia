// docs/redirects/-ийн бүх багцын хуучин TIC хаягийг live шалгана (redirect-ийг гараар дагана).
// Нийт хурд: секундэд ≤1 хүсэлт (TIC болон Travel Hub хоёуланд нь нийтдээ). CSV-ийг өөрчлөхгүй.
// Үр дүнг мөр бүрээр JSONL-д бичнэ, дахин ажиллуулбал шалгасан мөрийг алгасна (тасарвал үргэлжилнэ).
//   node scripts/tic/redirect-check.js <out.jsonl>
const fs = require('fs');
const path = require('path');
const { parseCsv } = require('./_csv');

const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'docs', 'redirects');
const OUT = process.argv[2];
if (!OUT) throw new Error('out.jsonl өгнө үү');

const files = fs.readdirSync(DIR).filter((f) => /^batch-.*\.csv$/.test(f)).sort();
const rows = files.flatMap((f) => parseCsv(fs.readFileSync(path.join(DIR, f), 'utf8')).map((r) => ({ batch: f.replace(/\.csv$/, ''), ...r })));
const done = new Set(fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').split('\n').filter(Boolean).map((l) => { const o = JSON.parse(l); return o.batch + '|' + o.old_url; }) : []);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Нийтлэг дараалал: хүсэлт бүр өмнөхөөсөө ≥1.05 секундын дараа эхэлнэ (хэдэн worker байсан ч секундэд ≤1 хүсэлт)
let gate = Promise.resolve();
function paced() {
  const turn = gate;
  gate = gate.then(() => sleep(1050));
  return turn;
}
const WORKERS = 3;

async function step(url) {
  for (let i = 1; i <= 3; i++) {
    await paced();
    try {
      const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'TravelHubMongolia-redirect-check/1.0' }, signal: AbortSignal.timeout(45000) });
      const isThm = /travelhubmongolia\.com/.test(url);
      const html = isThm && res.status === 200 ? await res.text() : (await res.arrayBuffer().catch(() => null), '');
      if ((res.status >= 500 || res.status === 429) && i < 3) { await sleep(3000 * i); continue; }
      return { status: res.status, location: res.headers.get('location') || '', soft404: /NEXT_HTTP_ERROR_FALLBACK;404|<title>[^<]*(404|олдсонгүй)/i.test(html) };
    } catch (e) {
      if (i === 3) return { status: 0, location: '', error: e.message };
      await sleep(3000 * i);
    }
  }
}

// Travel Hub-ийн эцсийн хаягийн хариуг кэшлэнэ (олон хуучин хаяг нэг хуудас руу заадаг)
const thmCache = new Map();

async function follow(url) {
  const hops = [];
  let cur = url;
  for (let n = 0; n < 8; n++) {
    let r;
    if (/travelhubmongolia\.com/.test(cur) && thmCache.has(cur)) r = thmCache.get(cur);
    else {
      r = await step(cur);
      if (/travelhubmongolia\.com/.test(cur)) thmCache.set(cur, r);
    }
    hops.push({ url: cur, status: r.status, ...(r.error ? { error: r.error } : {}), ...(r.soft404 ? { soft404: true } : {}) });
    if (r.status >= 300 && r.status < 400 && r.location) { cur = new URL(r.location, cur).href; continue; }
    return hops;
  }
  return hops;
}

(async () => {
  const todo = rows.filter((r) => !done.has(r.batch + '|' + r.old_url));
  console.log(`нийт ${rows.length}, үлдсэн ${todo.length}`);
  let i = 0;
  let next = 0;
  await Promise.all(Array.from({ length: WORKERS }, async () => {
    while (next < todo.length) {
      const r = todo[next++];
      const hops = await follow(r.old_url);
      fs.appendFileSync(OUT, JSON.stringify({ batch: r.batch, old_url: r.old_url, new_url: r.new_url, title: r.title, cat: r['ангилал'] || '', hops }) + '\n');
      if (++i % 100 === 0) console.log(new Date().toISOString(), i, '/', todo.length);
    }
  }));
  console.log('дууссан');
})().catch((e) => { console.error(e.message); process.exit(1); });

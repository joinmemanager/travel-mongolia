// Redirect CSV цэвэрлэгээ (2026-10-21, эзэмшигчийн шийдвэр): Tourist Info Center сайт ажилласаар байгаа тул
// ЗӨВХӨН Travel Hub руу хуулсан хуудсыг redirect хийнэ. Хуулаагүй хуудас (алгассан мэдээ, гадаад, ⛔) TIC дээрээ үлдэнэ.
//   - batch-08: «алгассан» мөрүүд (→ /stories) → docs/redirects/not-redirected.csv (redirect хийхгүй, TIC-д үлдэнэ)
//   - batch-07: буудал/бааз (/local/*) — хуулсан ч хуудас нь хараахан нийтлэгдээгүй → docs/redirects/pending/
//     (Б2-т /plan/accommodation/<slug> хаягаар batch-07 руу буцна)
//   - batch-04: бүгд хуулсан агуулга, өөрчлөхгүй.
//   - batch-09 (жагсаалтын хуудас)-ийг coverage.js үүсгэнэ.
// Idempotent: дахин ажиллуулахад зөөх мөр үлдээгүй бол юу ч өөрчлөхгүй.
//   node scripts/tic/clean-redirects.js
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./_cma');
const { parseCsv, writeCsv } = require('./_csv');

const DIR = path.join(ROOT, 'docs', 'redirects');
const HEAD = ['old_url', 'new_url', 'title', 'ангилал', 'аймаг'];
const NR_HEAD = ['old_url', 'title', 'шалтгаан', 'эх файл'];
const read = (f) => (fs.existsSync(f) ? parseCsv(fs.readFileSync(f, 'utf8')) : []);
const toRow = (r) => HEAD.map((h) => r[h] ?? '');

function appendUnique(file, head, rows) {
  const cur = read(file);
  const seen = new Set(cur.map((r) => r.old_url.toLowerCase()));
  const add = rows.filter((r) => !seen.has(r.old_url.toLowerCase()));
  writeCsv(file, head, [...cur, ...add].map((r) => head.map((h) => r[h] ?? '')));
  return add.length;
}

const removed = {};

// batch-08: алгассан мэдээ
{
  const f = path.join(DIR, 'batch-08-news.csv');
  const rows = read(f);
  const drop = rows.filter((r) => /алгассан/i.test(r['ангилал']));
  const keep = rows.filter((r) => !/алгассан/i.test(r['ангилал']));
  appendUnique(path.join(DIR, 'not-redirected.csv'), NR_HEAD, drop.map((r) => ({ old_url: r.old_url, title: r.title, 'шалтгаан': r['ангилал'], 'эх файл': 'batch-08-news.csv' })));
  // «хэсэг нээгдээгүй» тэмдэглэл хуучирсан: /stories/news нээгдэнэ
  writeCsv(f, HEAD, keep.map((r) => toRow({ ...r, 'ангилал': r['ангилал'].replace(/ \(хэсэг нээгдээгүй: [^)]*\)/, '') })));
  removed['batch-08-news.csv'] = drop.length;
}

// batch-07: буудал, бааз → pending
{
  const f = path.join(DIR, 'batch-07-events-camps-hotels.csv');
  const rows = read(f);
  const isLocal = (r) => /\/local\//.test(r.new_url);
  const drop = rows.filter(isLocal);
  fs.mkdirSync(path.join(DIR, 'pending'), { recursive: true });
  appendUnique(path.join(DIR, 'pending', 'batch-07-hotels-camps.csv'), HEAD, drop);
  writeCsv(f, HEAD, rows.filter((r) => !isLocal(r)).map(toRow));
  removed['batch-07-events-camps-hotels.csv'] = drop.length;
}

// Б2 (feat/tic-batch-10): буудал, баазын хуудас /plan/accommodation/<slug> бэлэн болсон тул pending/-ийн мөрүүдийг
// шинэ хаягаар batch-07 руу буцаана (slug нь /local/<slug>-тэй ижил). `--accommodation` үед л.
if (process.argv.includes('--accommodation')) {
  const pf = path.join(DIR, 'pending', 'batch-07-hotels-camps.csv');
  const f = path.join(DIR, 'batch-07-events-camps-hotels.csv');
  const pend = read(pf);
  const rows = read(f);
  const seen = new Set(rows.map((r) => r.old_url.toLowerCase()));
  const back = pend
    .filter((r) => !seen.has(r.old_url.toLowerCase()))
    .map((r) => ({ ...r, new_url: r.new_url.replace('/local/', '/plan/accommodation/'), 'ангилал': r['ангилал'].replace(/ \(хэсэг нээгдээгүй: \/local\)/, '').replace(/; хэсэг нээгдээгүй: \/local\)/, ')') }));
  writeCsv(f, HEAD, [...rows, ...back].map(toRow));
  if (pend.length) fs.unlinkSync(pf);
  if (fs.existsSync(path.join(DIR, 'pending')) && !fs.readdirSync(path.join(DIR, 'pending')).length) fs.rmdirSync(path.join(DIR, 'pending'));
  console.log('буудал, бааз batch-07 руу буцав', back.length);
}

console.log('хассан мөр', removed);

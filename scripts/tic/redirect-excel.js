// Redirect CSV-үүдийг production дээр шалгаад кодерт өгөх Excel үүсгэнэ (docs/redirects/excel/).
// CSV-ийг өөрчлөхгүй. 404 өгсөн мөр Excel-д орохгүй, 404-review.csv-д гарна.
//   node scripts/tic/redirect-excel.js
// .xlsx-ийг scripts/tic/_xlsx.js бичнэ (нэмэлт сангүй).
const fs = require('fs');
const path = require('path');
const { xlsx } = require('./_xlsx');
const { parseCsv } = require('./_csv');

const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'docs', 'redirects');
const OUT = path.join(DIR, 'excel');
const read = (f) => parseCsv(fs.readFileSync(path.join(DIR, f), 'utf8'));
// 9-р багцаас хойшлуулсан 7 мөр: cate14 ×4, cate15, cate21, cate22
const DEFERRED = /\/cate(14|15|21|22)\.aspx/;
const BATCHES = {
  'batch-07': read('batch-07-events-camps-hotels.csv'),
  'batch-10': read('batch-10-people-culture.csv'),
  'batch-09-deferred': read('batch-09-listing-pages.csv').filter((r) => DEFERRED.test(r.old_url)),
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function step(url) {
  for (let i = 1; i <= 4; i++) {
    try {
      const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'TravelHubMongolia-redirect-check/1.0' }, signal: AbortSignal.timeout(45000) });
      const html = await res.text();
      if ((res.status >= 500 || res.status === 429) && i < 4) { await sleep(2000 * i); continue; }
      return { status: res.status, location: res.headers.get('location'), html };
    } catch (e) {
      if (i === 4) return { status: 0, html: '', error: e.message };
      await sleep(2000 * i);
    }
  }
}

// Эцсийн хаяг хүртэл дагана. notFound() заримдаа 200-аар ирдэг тул агуулгыг нь ч шалгана.
async function check(url) {
  let cur = url;
  for (let hop = 0; hop < 8; hop++) {
    const r = await step(cur);
    if (r.status >= 300 && r.status < 400 && r.location) { cur = new URL(r.location, cur).href; continue; }
    const soft404 = r.status === 200 && /NEXT_HTTP_ERROR_FALLBACK;404|<title>[^<]*(404|олдсонгүй)/i.test(r.html);
    return {
      finalUrl: cur, status: soft404 ? 404 : r.status, soft404, hops: hop,
      noindex: /<meta name="robots" content="[^"]*noindex/.test(r.html),
      title: (r.html.match(/<title>([^<]*)/) || [])[1] || '',
    };
  }
  return { finalUrl: cur, status: 0, soft404: false, hops: 8, noindex: false, title: '' };
}

// «Кодерт анхааруулах» хуудас: cate14-ийн дүрмүүдийн дараалал. Хаягийг мөрүүдээс авна (CSV-тэй зөрөхгүй).
function coderNotes(rows) {
  const target = (old) => {
    const row = rows.find((r) => r[0] === `https://www.touristinfocenter.mn${old}`);
    if (!row) throw new Error(`мөр олдсонгүй: ${old}`);
    return row[1];
  };
  const pathOf = (u) => new URL(u).pathname;
  const type3 = target('/cate14.aspx?TypeID=3');
  const general = target('/cate14.aspx');
  return [
    ['Дараалал', 'Хуучин хаяг (TIC)', 'Query-ийн нөхцөл', 'Шинэ хаяг (Travel Hub)', 'Тайлбар'],
    [1, '/cate14.aspx', 'TypeID=1', target('/cate14.aspx?TypeID=1'), 'Угсаатны үүсэл'],
    [2, '/cate14.aspx', 'TypeID=2', target('/cate14.aspx?TypeID=2'), 'Улсын түүх'],
    [3, '/cate14.aspx', 'TypeID=3', type3, 'Түүхэн хүмүүс'],
    [4, '/cate14.aspx', 'Query-гүй (ерөнхий дүрэм)', general, 'Хамгийн сүүлд ажиллана'],
    [],
    ['Шаардлага: TypeID-тэй дүрмүүд query-г шалгаж, ерөнхий cate14.aspx-ийн дүрмээс ӨМНӨ ажиллах ёстой.'],
    [`Зөв жишээ: /cate14.aspx?TypeID=3 → 3-р дүрэм → ${pathOf(type3)}`],
    [`Буруу жишээ: ерөнхий дүрэм эхэлж ажиллавал /cate14.aspx?TypeID=3 → ${pathOf(general)} (буруу хуудас).`],
    ['Шалтгаан: TIC-ийн одоогийн redirect query тоохгүй байж болно (жишээ: cate10.aspx?TypeID=2 нь cate10.aspx-тэй ижил хаяг руу очдог).'],
    [`cate15.aspx нэг дүрэмтэй: TypeID=1, 2, 3 бүгд ${pathOf(target('/cate15.aspx'))} руу очно, query шалгах шаардлагагүй.`],
  ];
}

function workbook(rows, counts, notes) {
  const main = [['Хуучин хаяг (TIC)', 'Шинэ хаяг (Travel Hub)', 'Ангилал', 'Шалгалт'], ...rows];
  const total = counts.reduce((n, [, c]) => n + c, 0);
  const summary = [['Ангилал', 'Тоо'], ...counts, ['Нийт', { f: `SUM(B2:B${counts.length + 1})`, v: total }]];
  return xlsx([
    { name: 'Redirect', rows: main, autoFilter: true },
    { name: 'Ангиллаар тоо', rows: summary, boldLast: true },
    ...(notes ? [{ name: 'Кодерт анхааруулах', rows: notes, colWidths: [11, 20, 28, 62, 26] }] : []),
  ]);
}

(async () => {
  const unique = [...new Set(Object.values(BATCHES).flat().map((r) => r.new_url))];
  const results = {};
  let next = 0;
  await Promise.all(Array.from({ length: 5 }, async () => {
    while (next < unique.length) {
      const u = unique[next++];
      results[u] = await check(u);
      await sleep(100);
    }
  }));

  fs.mkdirSync(OUT, { recursive: true });
  const review = [];
  const stats = {};
  for (const [batch, rows] of Object.entries(BATCHES)) {
    const keep = [];
    const tally = {};
    for (const r of rows) {
      const c = results[r.new_url];
      const stat = c.status !== 200 ? c.status : c.hops ? 'redirect' : 200;
      if (c.status !== 200) { review.push([batch, r.old_url, r.new_url, c.finalUrl, c.status, c.soft404 ? 'soft-404' : '', r.title, r.ангилал]); continue; }
      // Шинэ хаяг: redirect-ийн гинж байвал кодер шууд эцсийн хаяг руу заана
      keep.push([r.old_url, c.finalUrl, r.ангилал, stat]);
      tally[r.ангилал] = (tally[r.ангилал] || 0) + 1;
    }
    const counts = Object.entries(tally).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'mn'));
    fs.writeFileSync(path.join(OUT, `${batch}.xlsx`), workbook(keep, counts, batch === 'batch-09-deferred' ? coderNotes(keep) : null));
    stats[batch] = { csv: rows.length, excel: keep.length, redirect: keep.filter((x) => x[3] === 'redirect').length, bad: rows.length - keep.length, noindex: rows.filter((r) => results[r.new_url].noindex).length, counts };
  }
  const cell = (v) => (/[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const head = ['batch', 'Хуучин хаяг (TIC)', 'Шинэ хаяг (Travel Hub)', 'Эцсийн хаяг', 'Шалгалт', 'Тэмдэглэл', 'Гарчиг', 'Ангилал'];
  fs.writeFileSync(path.join(OUT, '404-review.csv'), `﻿${[head, ...review].map((r) => r.map(cell).join(',')).join('\r\n')}\r\n`);
  console.log(JSON.stringify(stats, null, 1));
  console.log('шалгалтад тэнцээгүй:', review.length, 'давтагдашгүй хаяг:', unique.length);
  // Хаяг ба гарчгийн таарц (CSV-ийн гарчгийн эхний үг хуудасны <title>-д байх ёстой)
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const mismatch = Object.values(BATCHES).flat().filter((r) => !norm(results[r.new_url].title).includes(norm(r.title).split(' ')[0]));
  console.log('гарчиг зөрсөн:', mismatch.length);
  for (const r of mismatch.slice(0, 25)) console.log(' ', r.title, '=>', results[r.new_url].title, r.new_url);
  fs.writeFileSync(process.env.REDIRECT_RESULTS || path.join(require('os').tmpdir(), 'redirect-results.json'), JSON.stringify(results, null, 1));
})();

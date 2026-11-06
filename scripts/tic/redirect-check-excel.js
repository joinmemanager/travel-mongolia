// scripts/tic/redirect-check.js-ийн JSONL үр дүнг ангилж, алдаатай мөрүүдийг Excel болгоно
// (docs/redirects/excel/redirect-check-<огноо>.xlsx, өмнөх Excel-ийн хэлбэрээр «Кодерт анхааруулах» хуудастай).
//   node scripts/tic/redirect-check-excel.js <in.jsonl> [огноо]
const fs = require('fs');
const path = require('path');
const { xlsx } = require('./_xlsx');

const ROOT = path.resolve(__dirname, '..', '..');
const [IN, DAY = new Date().toISOString().slice(0, 10)] = process.argv.slice(2);
const OUT = path.join(ROOT, 'docs', 'redirects', 'excel', `redirect-check-${DAY}.xlsx`);
const rows = fs.readFileSync(IN, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

// Хаягийг харьцуулахад: fragment (#) хасна (сервер харахгүй), host жижиг үсгээр, төгсгөлийн / хасна, URL-decode
const norm = (u) => {
  try {
    const x = new URL(u);
    return decodeURI(`${x.protocol}//${x.host.toLowerCase()}${x.pathname.replace(/\/+$/, '')}${x.search}`);
  } catch { return u; }
};

const TYPES = {
  ok: 'Зөв',
  noRedirect: 'Redirect хийгдээгүй',
  wrong: 'Буруу хаяг руу',
  notFound: '404 (шинэ хаяг олдохгүй)',
  chain: 'Гинж (1-ээс олон redirect)',
  not301: '301 биш (түр redirect)',
  error: 'Холболтын/серверийн алдаа',
};

function classify(r) {
  const h = r.hops;
  const first = h[0];
  const last = h[h.length - 1];
  const redirects = h.length - 1;
  const exp = norm(r.new_url);
  const fin = norm(last.url);
  const bad404 = last.status === 404 || last.soft404;
  if (!first || first.status === 0) return { t: 'error', why: first?.error || 'хариу алга' };
  if (first.status < 300 || first.status >= 400) return { t: first.status >= 500 ? 'error' : 'noRedirect', why: `TIC ${first.status} буцаасан` };
  if (last.status === 0) return { t: 'error', why: `эцсийн хаяг: ${last.error || 'хариу алга'}` };
  if (last.status >= 300 && last.status < 400) return { t: 'chain', why: '8-аас олон redirect (давталт)' };
  if (fin !== exp) {
    const via = h.findIndex((x) => norm(x.url) === exp);
    if (via > 0) return { t: bad404 ? 'notFound' : 'chain', why: `шинэ хаяг өөрөө дахин redirect хийдэг → ${last.url} (${last.status})` };
    return { t: bad404 ? 'wrong' : 'wrong', why: `${last.url} руу очдог (${last.soft404 ? 'soft-404' : last.status})` };
  }
  if (bad404) return { t: 'notFound', why: last.soft404 ? 'хуудас 200 боловч «олдсонгүй» (soft-404)' : '404' };
  if (last.status !== 200) return { t: 'error', why: `шинэ хаяг ${last.status}` };
  if (redirects > 1) return { t: 'chain', why: h.slice(0, -1).map((x) => `${x.status}`).join(' → ') + ` → 200 (${redirects} алхам)` };
  if (first.status !== 301) return { t: 'not301', why: `TIC ${first.status} (301 байх ёстой)` };
  return { t: 'ok', why: '' };
}

const chainText = (h) => h.map((x) => `${x.status}${x.soft404 ? '(soft-404)' : ''} ${x.url}`).join('  →  ');
const results = rows.map((r) => ({ r, ...classify(r) }));
const tally = {};
for (const x of results) tally[x.t] = (tally[x.t] || 0) + 1;
const bad = results.filter((x) => x.t !== 'ok');
const byBatch = {};
for (const x of bad) byBatch[x.r.batch] = (byBatch[x.r.batch] || 0) + 1;

const main = [
  ['Хуучин хаяг (TIC)', 'Хүлээгдэж буй шинэ хаяг (Travel Hub)', 'Алдааны төрөл', 'Тайлбар', 'Одоогийн хариу (алхам бүр)', 'Багц', 'Гарчиг', 'Ангилал'],
  ...bad.sort((a, b) => a.t.localeCompare(b.t) || a.r.batch.localeCompare(b.r.batch)).map((x) => [x.r.old_url, x.r.new_url, TYPES[x.t], x.why, chainText(x.r.hops), x.r.batch, x.r.title, x.r.cat]),
];
const counts = Object.keys(TYPES).filter((k) => tally[k]).map((k) => [TYPES[k], tally[k]]);
const summary = [['Төрөл', 'Тоо'], ...counts, ['Нийт шалгасан', { f: `SUM(B2:B${counts.length + 1})`, v: rows.length }]];
const batchRows = [['Багц', 'Алдаатай мөр'], ...Object.entries(byBatch).sort()];
const notes = [
  ['#', 'Тэмдэглэл'],
  [1, `${DAY}-нд docs/redirects/-ийн бүх batch-*.csv (batch-01…11; tic-server-fixes.xlsx-ийн мөрүүд batch-02, batch-07-д багтсан)-ийн ${rows.length} хуучин TIC хаягийг live шалгасан. Хурд: секундэд ≤1 хүсэлт, redirect-ийг гараар дагасан.`],
  [2, '«Зөв» = TIC 301 → яг хүлээгдэж буй хаяг → 200. Энэ хүснэгтэд зөвхөн «зөв» биш мөрүүд орсон.'],
  [3, 'Хаягийг харьцуулахдаа #fragment-ийг тооцоогүй (браузер серверт илгээдэггүй). Жишээ: /about/nature/birds#slug руу 301 хийвэл /about/nature/birds гэж ирдэг тул зөвд тооцсон.'],
  [4, '«Гинж»: TIC → (өөр хаяг) → шинэ хаяг. Кодер TIC-ийн дүрмийг шууд эцсийн хаяг руу заахаар засна.'],
  [5, '«Буруу хаяг руу»: TIC-ийн дүрэм өөр хуудас руу заадаг. «Хүлээгдэж буй шинэ хаяг» баганын хаяг руу солино.'],
  [6, '«Redirect хийгдээгүй»: TIC хуучин хуудсаа (200) эсвэл 404 буцаадаг. Дүрэм нэмэх шаардлагатай.'],
  [7, '«404»: TIC зөв хаяг руу заадаг ч Travel Hub дээр хуудас олдохгүй байна. Энэ нь Travel Hub талын асуудал (TIC-ийн кодер засах шаардлагагүй).'],
  [8, 'Query-тэй хаяг (ItemID=, NewsID=): дүрэм ItemID-г яг тэнцүүгээр шалгах ёстой (ItemID=1 нь ItemID=1148-тэй таарч болохгүй).'],
  [9, 'Алдаатай мөрүүдийн «Хүлээгдэж буй шинэ хаяг» бүгд Travel Hub дээр 200 буцааж байгааг тусад нь шалгасан: засвар зөвхөн TIC серверийн redirect дүрэмд хийгдэнэ.'],
  [10, 'batch-07-ийн cate4_more.aspx 95 мөр, batch-02-ийн cate14_more.aspx?ItemID=168 нь tic-server-fixes.xlsx-д аль хэдийн илгээгдсэн. Одоо ч засагдаагүй байна.'],
  [11, 'batch-11-reconsider-ийн 32 мөр (News_more.aspx?CateID=0&NewsID=…) 2026-11-06-нд шинээр нэмэгдсэн тул TIC дээр хараахан тохируулагдаагүй.'],
  [12, 'batch-10-ийн cate14_more.aspx?ItemID=92 нь шинээр илэрсэн: TIC 200 буцаадаг (redirect дүрэм алга).'],
];
fs.writeFileSync(OUT, xlsx([
  { name: 'Алдаатай redirect', rows: main, autoFilter: true },
  { name: 'Төрлөөр тоо', rows: summary, boldLast: true },
  { name: 'Багцаар', rows: batchRows },
  { name: 'Кодерт анхааруулах', rows: notes, colWidths: [5, 140] },
]));
console.log(OUT);
console.log(JSON.stringify({ шалгасан: rows.length, ...Object.fromEntries(counts) }, null, 1));
console.log(JSON.stringify(byBatch));

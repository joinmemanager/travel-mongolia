// «AI-аар шинэчлэгдсэн байж болзошгүй» тоонуудын жагсаалт → docs/plan/verify-stats.csv
// Entry бүрийн 2026-11-06-ны (өнөөдрийн дахин бичихээс өмнөх) текстийг хамгийн эртний нөөцийн тексттэй харьцуулна.
// Хамгийн эртний текстэд байхгүй тоог (≥2 оронтой) жагсаана. Тоог өөрчлөхгүй, Contentful руу хүсэлт явуулахгүй.
//   node scripts/content/verify-stats.js
const fs = require('fs');
const path = require('path');
const lib = require('./_lib');
const { writeCsv } = require('../tic/_csv');

const B = path.join(lib.ROOT, 'backups');
const ORDER = ['contentful-2026-10-08', 'contentful-2026-10-15-pre-tic', 'contentful-2026-10-19-pre-batch01b', 'contentful-2026-10-19-pre-batch02', 'contentful-2026-10-20-pre-batch03-06', 'contentful-snapshot-2026-10-27', 'contentful-snapshot-2026-11-02'];
const readEntries = (d) => { const j = JSON.parse(fs.readFileSync(path.join(B, d, 'entries.json'), 'utf8')); return Array.isArray(j) ? j : j.items; };

// id → { backup, text } хамгийн эртний хувилбар
const earliest = new Map();
for (const d of ORDER) for (const e of readEntries(d)) if (!earliest.has(e.sys.id)) earliest.set(e.sys.id, { d, text: lib.textOf(e) });

const current = lib.load('entries.json');
const byId = new Map(current.map((e) => [e.sys.id, e]));
const NUM = /\d[\d\s.,]*\d|\d/g;
const norm = (s) => s.replace(/[\s.,]/g, '');
const SOURCE_RE = /(оны байдлаар|онд|оны|тооллог|статистик|судалгаа|эх сурвалж|мэдээгээр|дүнгээр|тооцоо)/i;
const AI_RE = /(хувилбар\s*:|найруулсан|статистик тоон үзүүлэлт)/i;

const rows = [];
const summary = { шалгасан: 0, өөрчлөгдсөн: 0, нөөцгүй: 0, entry: 0, тоо: 0 };
for (const e of current) {
  const text = lib.textOf(e);
  if (!/\d/.test(text)) continue;
  summary.шалгасан++;
  const old = earliest.get(e.sys.id);
  if (!old) { summary.нөөцгүй++; continue; }
  if (old.text === text) continue;
  summary.өөрчлөгдсөн++;
  const oldNums = new Set((old.text.match(NUM) || []).map(norm));
  const oldDigits = norm(old.text);
  const sentences = text.split(/(?<=[.!?])\s+|\n+/);
  const seen = new Set();
  let found = 0;
  for (const s of sentences) {
    for (const m of s.match(NUM) || []) {
      const n = norm(m);
      if (n.length < 2 || seen.has(n)) continue;
      if (oldNums.has(n) || oldDigits.includes(n)) continue;
      seen.add(n);
      found++;
      rows.push([
        e.sys.id, lib.titleOf(e), e.sys.contentType.sys.id, m.trim(), s.trim().slice(0, 300),
        SOURCE_RE.test(s) ? 'өгүүлбэрт он/эх сурвалж дурдсан' : 'эх сурвалж дурдаагүй',
        'хамгийн эртний текстэд алга', old.d, AI_RE.test(text) ? 'тийм' : '', lib.SITE + lib.urlOf(e, byId),
      ]);
    }
  }
  if (found) { summary.entry++; summary.тоо += found; }
}
const OUT = path.join(lib.ROOT, 'docs', 'plan', 'verify-stats.csv');
writeCsv(OUT, ['entry_id', 'гарчиг', 'төрөл', 'тоо', 'өгүүлбэр', 'өгүүлбэр дэх эх сурвалж', 'эх текстэд байгаа эсэх', 'харьцуулсан нөөц', 'AI-н тайлбар өгүүлбэртэй байсан', 'хаяг'], rows);
const byType = {};
for (const r of rows) byType[r[2]] = (byType[r[2]] || 0) + 1;
console.log(OUT, summary, byType);

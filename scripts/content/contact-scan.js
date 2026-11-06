// Давхар шалгалт: бүх entry-ийн текстээс зохиомол хэв маягтай утас (XXXX-2222/3333/1111/2111/2100 г.м.) болон contact@*.gov.mn хайна.
// Албан сайтаас баталгаажсан дугаарыг (stat-fix.js CONTACTS) тооцохгүй.
//   node scripts/content/contact-scan.js <snapshot-хавтас>
const fs = require('fs');
const path = require('path');
const lib = require('./_lib');
const { VERIFIED_NUMBERS } = require('./stat-fix');

const dir = path.join(lib.ROOT, 'backups', process.argv[2]);
const entries = JSON.parse(fs.readFileSync(path.join(dir, 'entries.json'), 'utf8'));
const PHONE = /\b(\d{4})[-\s]?(2222|3333|1111|2111|2100|8222|8333)\b/g;
const MAIL = /\bcontact@[\w.-]+\.(gov\.)?mn\b/gi;
const hits = [];
for (const e of entries) {
  const t = Object.values(e.fields || {}).map((v) => { const x = v?.[lib.L]; return typeof x === 'string' ? x : Array.isArray(x) ? x.join(' ') : lib.plain(x); }).join('\n');
  for (const m of t.matchAll(PHONE)) { const n = `${m[1]}-${m[2]}`; if (!VERIFIED_NUMBERS.has(n)) hits.push([e.sys.id, lib.titleOf(e), e.sys.contentType.sys.id, m[0], t.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\s+/g, ' ')]); }
  for (const m of t.matchAll(MAIL)) hits.push([e.sys.id, lib.titleOf(e), e.sys.contentType.sys.id, m[0], t.slice(Math.max(0, m.index - 60), m.index + 40).replace(/\s+/g, ' ')]);
}
console.log('олдсон', hits.length);
for (const h of hits) console.log(h.join(' | '));

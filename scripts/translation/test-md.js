// Markdown хөрвүүлэгчийн тест: экспортын бүх rich text-ийг CF → MD → CF хийж бүтэц, текстийг харьцуулна.
//   node scripts/translation/test-md.js
'use strict';
const { loadExport } = require('../payload/lib/export');
const { cfToMd, mdToCf, structureOf, plainText } = require('./lib/md');

const ex = loadExport();
const rt = {};
for (const ct of ex.contentTypes) rt[ct.sys.id] = ct.fields.filter((f) => f.type === 'RichText').map((f) => f.id);
const norm = (s) => s.replace(/\s+/g, ' ').trim();
let total = 0;
let ok = 0;
const fails = [];
for (const e of ex.entries) {
  for (const fid of rt[e.sys.contentType.sys.id] || []) {
    const doc = e.fields[fid]?.mn;
    if (!doc) continue;
    total++;
    const back = mdToCf(cfToMd(doc));
    const a = structureOf(doc);
    const b = structureOf(back);
    const same = JSON.stringify(a) === JSON.stringify(b) && norm(plainText(doc)) === norm(plainText(back));
    if (same) ok++;
    else if (fails.length < 5) fails.push(`${e.sys.id}.${fid}\n  ${JSON.stringify(a).slice(0, 300)}\n  ${JSON.stringify(b).slice(0, 300)}\n  ${norm(plainText(doc)).slice(0, 200)}\n  ${norm(plainText(back)).slice(0, 200)}`);
  }
}
console.log(`MD round-trip: ${ok}/${total}`);
fails.forEach((f) => console.log(f));
process.exit(ok === total ? 0 : 1);

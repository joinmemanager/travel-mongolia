// docs/plan/rewrite-list.csv-д entry-ийн «төлөв», «тэмдэглэл»-ийг бичнэ (дахин бичих явц).
//   node scripts/content/set-status.js <entryId> "<төлөв>" ["<тэмдэглэл>"]
const fs = require('fs');
const path = require('path');
const { parseCsv, writeCsv } = require('../tic/_csv');

const FILE = path.resolve(__dirname, '..', '..', 'docs', 'plan', 'rewrite-list.csv');
const [id, status, note] = process.argv.slice(2);
const text = fs.readFileSync(FILE, 'utf8');
const head = text.replace(/^﻿/, '').split(/\r?\n/)[0].split(',');
const rows = parseCsv(text);
const r = rows.find((x) => x.entry_id === id);
if (!r) throw new Error(`мөр алга: ${id}`);
r['төлөв'] = status;
if (note !== undefined) r['тэмдэглэл'] = note;
writeCsv(FILE, head, rows.map((x) => head.map((h) => x[h])));
console.log(id, '→', status);

// tic-inventory.csv уншигч (UTF-8 BOM, хашилттай талбар, мөр доторх шинэ мөр)
const fs = require('fs');
const path = require('path');

function parseCsv(text) {
  text = text.replace(/^﻿/, '');
  const rows = [];
  let row = [], field = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field.replace(/\r$/, '')); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const head = rows.shift();
  return rows.filter((r) => r.length > 1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}

function csvCell(v) {
  const s = String(v ?? '');
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function writeCsv(file, header, rows) {
  const body = [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n') + '\r\n';
  fs.writeFileSync(file, '﻿' + body, 'utf8');
}

function loadInventory() {
  const file = path.resolve(__dirname, '..', '..', 'docs', 'plan', 'tic-inventory.csv');
  return parseCsv(fs.readFileSync(file, 'utf8'));
}

module.exports = { parseCsv, writeCsv, loadInventory };

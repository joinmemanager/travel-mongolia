// docs/translation/glossary.csv-ийг уншиж, текстэд орсон нэр томъёог олно.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');

function parseCsvLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (q) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') q = false;
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ',') {
      out.push(cur);
      cur = '';
    } else cur += c;
  }
  out.push(cur);
  return out;
}

function loadGlossary(file = path.join(ROOT, 'docs', 'translation', 'glossary.csv')) {
  const lines = fs.readFileSync(file, 'utf8').replace(/^﻿/, '').split(/\r?\n/).filter(Boolean);
  return lines.slice(1).map((l) => {
    const [mn, en, type, note] = parseCsvLine(l);
    // «Тэс (Увс)» → хайх үг «Тэс»; англид хаалтын тайлбаргүй үндсэн хэлбэр
    return { mn, en, type, note, match: mn.replace(/\s*\(.*\)$/, ''), enCore: en.replace(/\s*\(.*\)$/, '') };
  });
}

const L = 'а-яөүёА-ЯӨҮЁ';
// Монгол үгийн нөхцөлийг (сумын, нуурт, Дадалд) зөвшөөрнө: үгийн эхнээс таарч, ард нь ≤5 үсэг
function termRegex(term) {
  const escd = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^${L}])${escd}[${L}]{0,5}(?![${L}])`, 'i');
}

// Аймаг, сум, дүүргийн нэр нь энгийн үг байж болно (Өлгий, Цэцэг, Ургамал, Тариалан): том үсгээр, өгүүлбэрийн
// эхэнд биш (эсвэл ард нь «сум/аймаг/дүүрэг») байвал л нэр гэж үзнэ.
const NAME_TYPES = new Set(['сум', 'дүүрэг', 'аймаг', 'газар']);
function nameIn(text, term) {
  const escd = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(^|[^${L}])${escd}[${L}]{0,5}(?![${L}])`, 'g');
  for (const m of text.matchAll(re)) {
    const at = m.index + m[1].length;
    const before = text.slice(0, at).replace(/[\s«"“(*_\-–—]+$/, '');
    const after = text.slice(at + term.length, at + term.length + 12);
    if (/^\S{0,5}\s+(сум|аймаг|дүүрэг)/.test(after)) return true;
    if (before && !/[.!?:\n#>]$/.test(before)) return true;
  }
  return false;
}

// Текстэд орсон нэр томъёо. Ерөнхий богино үгсийг (гол, ой, тал) хасна: худал таарц ихтэй.
function termsIn(text, glossary, { minLength = 4 } = {}) {
  return glossary.filter(
    (g) => g.match.length >= minLength && (NAME_TYPES.has(g.type) ? nameIn(text, g.match) : termRegex(g.match).test(text))
  );
}

module.exports = { loadGlossary, termsIn, termRegex, ROOT };

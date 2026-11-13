// Орчуулгын багц файлын формат (docs/translation/batches/en-NNN.md, done/en-NNN.md):
//
//   @@@ ENTRY <entryId> | <contentType> | <URL>
//   @@ FIELD <fieldId> <kind>          kind: text | textarea | richText | list
//   <утга: text/textarea — энгийн текст; richText — Markdown (lib/md.js); list — мөр бүр "- …">
//   @@@ END <entryId>
//
// Багцын эхэнд AI-д өгөх prompt <!-- PROMPT ... --> блок дотор байна, parse хийхэд алгасна.
'use strict';

const ENTRY = /^@@@ ENTRY (\S+) \| (\S+) \| (\S*)\s*$/;
const FIELD = /^@@ FIELD (\S+) (text|textarea|richText|list)\s*$/;
const END = /^@@@ END (\S+)\s*$/;

function serializeEntry(e) {
  const out = [`@@@ ENTRY ${e.id} | ${e.type} | ${e.url || ''}`];
  for (const f of e.fields) {
    out.push(`@@ FIELD ${f.id} ${f.kind}`);
    out.push(f.kind === 'list' ? f.value.map((v) => `- ${v}`).join('\n') : f.value);
  }
  out.push(`@@@ END ${e.id}`);
  return out.join('\n');
}

// → { entries: [{ id, type, url, fields: [{ id, kind, value }] }], errors: [string] }
function parseBatch(text) {
  const lines = String(text).replace(/^﻿/, '').replace(/\r\n/g, '\n').split('\n');
  const entries = [];
  const errors = [];
  let cur = null;
  let field = null;
  let buf = [];
  const closeField = () => {
    if (field) {
      const raw = buf.join('\n').trim();
      field.value = field.kind === 'list' ? raw.split('\n').map((l) => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean) : raw;
      cur.fields.push(field);
    }
    field = null;
    buf = [];
  };
  lines.forEach((line, n) => {
    let m;
    if ((m = line.match(ENTRY))) {
      if (cur) {
        errors.push(`${n + 1}-р мөр: ${cur.id}-ийн «@@@ END» мөр алга`);
        closeField();
        entries.push(cur);
      }
      cur = { id: m[1], type: m[2], url: m[3], fields: [], line: n + 1 };
    } else if ((m = line.match(FIELD))) {
      if (!cur) return errors.push(`${n + 1}-р мөр: ENTRY-гүй FIELD`);
      closeField();
      field = { id: m[1], kind: m[2] };
    } else if ((m = line.match(END))) {
      if (!cur) return errors.push(`${n + 1}-р мөр: ENTRY-гүй END`);
      if (m[1] !== cur.id) errors.push(`${n + 1}-р мөр: END ${m[1]} ≠ ENTRY ${cur.id}`);
      closeField();
      entries.push(cur);
      cur = null;
    } else if (field) buf.push(line);
  });
  if (cur) {
    errors.push(`${cur.id}: файлын төгсгөлд «@@@ END» алга (хариу тасарсан байж магадгүй)`);
    closeField();
    entries.push(cur);
  }
  return { entries, errors };
}

module.exports = { serializeEntry, parseBatch };

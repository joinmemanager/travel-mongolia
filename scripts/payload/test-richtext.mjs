// Rich text хөрвүүлэгчийн round-trip тест: экспортын бүх RichText талбар (бүх locale, ноорог + нийтлэгдсэн)
// Contentful → Lexical → Contentful хийгээд эхтэй нь normalizeCf-ээр харьцуулна. Contentful руу хүсэлтгүй.
//   node scripts/payload/test-richtext.mjs
import { createRequire } from 'module';
import { cfToLexical, lexicalToCf, normalizeCf } from '../../travel-mongolia/lib/cms/richText.ts';

const require = createRequire(import.meta.url);
const { loadExport } = require('./lib/export.js');
const ex = loadExport();

const rtFields = {};
for (const ct of ex.contentTypes) rtFields[ct.sys.id] = ct.fields.filter((f) => f.type === 'RichText').map((f) => f.id);

let total = 0;
let ok = 0;
const fails = [];
for (const list of [ex.entries, ex.publishedEntries]) {
  for (const e of list) {
    for (const fid of rtFields[e.sys.contentType.sys.id] || []) {
      for (const [loc, doc] of Object.entries(e.fields[fid] || {})) {
        if (!doc) continue;
        total++;
        const lex = cfToLexical(doc, { mediaId: (id) => `m:${id}` });
        const back = lexicalToCf(lex, { assetId: (v) => String(v).replace(/^m:/, '') });
        const a = JSON.stringify(normalizeCf(doc));
        const b = JSON.stringify(normalizeCf(back));
        if (a === b) ok++;
        else if (fails.length < 5) {
          let i = 0;
          while (a[i] === b[i]) i++;
          fails.push(`${e.sys.id} ${fid} ${loc}: …${a.slice(Math.max(0, i - 80), i + 120)}\n   ≠ …${b.slice(Math.max(0, i - 80), i + 120)}`);
        }
      }
    }
  }
}
console.log(`rich text round-trip: ${ok}/${total} ижил`);
for (const f of fails) console.log(' - ' + f);
process.exit(ok === total ? 0 : 1);

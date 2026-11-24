// rewrite-list.csv-д «дахин бичсэн» төлөвтэй хуудсуудын НООРОГ (хамгийн сүүлийн, CMA) хувилбарыг локал
// Contentful экспортоос уншиж, орчуулах талбаруудыг 50-аар нь багцлан docs/translation/batches/en-NNN.md болгоно.
// Contentful руу хүсэлт илгээхгүй (экспортыг scripts/payload/export-contentful.js / export-delta.js хийнэ).
//
//   node scripts/translation/export-batches.js [--list <rewrite-list.csv>] [--size 50] [--lang en] [--ids id1,id2] [--out dir]
//
// --list өгөхгүй бол `git show main:docs/plan/rewrite-list.csv`-ийг (main дээрх хамгийн сүүлийн жагсаалт) уншина.
// Багц бүрийн эхэнд гадны AI-д хуулж өгөх prompt (толь бичгийн тухайн багцад орсон нэр томъёотой) байна.
'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { loadExport } = require('../payload/lib/export');
const { parseCsv } = require('../tic/_csv');
const { cfToMd } = require('./lib/md');
const { serializeEntry } = require('./lib/batch');
const { loadGlossary, termsIn, ROOT } = require('./lib/glossary');

const args = process.argv.slice(2);
const arg = (n, d) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : d);
const SIZE = Number(arg('--size', 50));
const LANG = arg('--lang', 'en');
const OUT = path.resolve(ROOT, arg('--out', 'docs/translation/batches'));
const ONLY = arg('--ids') ? arg('--ids').split(',') : null;
const PREFIX = arg('--prefix', args.includes('--review') ? `${LANG}-review` : LANG);

const LANG_NAME = { en: 'American English', 'zh-CN': 'Simplified Chinese', ru: 'Russian', ko: 'Korean', ja: 'Japanese' };

const ex = loadExport();
const glossary = loadGlossary();

// Экспортоос ХОЙШ дахин бичсэн хуудсын экспорт дахь текст нь ХУУЧИН (дахин бичихээс өмнөх) байдаг (2026-11-14 илэрсэн:
// 446–454-р мөр экспортоос 5–10 минутын дараа бичигдсэн). Иймд жагсаалтыг экспорт эхэлсэн мөчийн main-ийн
// төлвөөр уншина (git түүх; дахин бичигч session эхлээд Contentful-д хадгалаад дараа нь commit хийдэг тул энэ нь
// аюулгүй тал руу алддаг). Түүнээс хойш нэмэгдсэнийг «дараагийн экспортод» гэж мэдээлнэ.
const git = (cmd) => execSync(`git ${cmd}`, { cwd: ROOT, maxBuffer: 50e6 }).toString('utf8');
const isRewritten = (r) => /^дахин бичсэн/.test(r['төлөв']);
const parseList = (csv) => parseCsv(csv.replace(/^﻿/, ''));
let listRows;
let pendingAfterExport = [];
if (arg('--list')) listRows = parseList(fs.readFileSync(path.resolve(arg('--list')), 'utf8'));
else {
  const exportedAt = ex.meta.startedAt;
  const commit = git(`rev-list -1 --before="${exportedAt}" main`).trim();
  listRows = parseList(git(`show ${commit}:docs/plan/rewrite-list.csv`));
  const atExport = new Set(listRows.filter(isRewritten).map((r) => r.entry_id));
  pendingAfterExport = parseList(git('show main:docs/plan/rewrite-list.csv')).filter((r) => isRewritten(r) && !atExport.has(r.entry_id));
  console.log(`Жагсаалт: main @ ${commit.slice(0, 7)} (экспорт эхэлсэн ${exportedAt}-ээс өмнөх сүүлийн commit)`);
}
// --review: «ГАРААР ШАЛГАХ» тэмдэглэгээтэй хуудсууд (нийтлээгүй, ноорог хувилбараар) тусдаа en-review-NNN.md-д.
// Анхдагч: тэдгээрийг хасаад, сүүлийн хувилбар нь НИЙТЛЭГДСЭН хуудсууд (нийтлээгүй/алгассан ноорог орохгүй).
// --any-status: өмнөх шиг нийтлэгдсэн эсэхийг үл харгалзана (2026-11-14-ний en-001–007 ийм байдлаар гарсан).
const REVIEW = args.includes('--review');
const needsReview = (r) => /ГАРААР ШАЛГАХ/.test(r['тэмдэглэл'] || '');
const { statusOf } = require('../payload/lib/export');
const skipped = { review: 0, unpublished: 0 };
const rows = listRows
  .filter((r) => {
    if (ONLY) return ONLY.includes(r.entry_id);
    if (!isRewritten(r)) return false;
    if (REVIEW) return needsReview(r);
    if (needsReview(r)) return skipped.review++, false;
    const e = ex.entryById.get(r.entry_id);
    if (e && !args.includes('--any-status') && statusOf(e.sys) !== 'published') return skipped.unpublished++, false;
    return true;
  })
  .sort((a, b) => Number(a['эрэмбэ']) - Number(b['эрэмбэ']));

// Орчуулах талбарууд: Contentful-д localized, mn утгатай, текст төрлийн. Дараалал: гарчиг → SEO → бусад → rich text
function translatableFields(entry) {
  const ct = ex.contentTypeById.get(entry.sys.contentType.sys.id);
  const fields = ct.fields.filter(
    (f) => f.localized && !f.disabled && !f.omitted && (['Symbol', 'Text', 'RichText'].includes(f.type) || (f.type === 'Array' && f.items.type === 'Symbol'))
  );
  const rank = (f) => (f.id === ct.displayField ? 0 : f.id === 'seoTitle' ? 1 : f.id === 'seoDescription' ? 2 : f.type === 'RichText' ? 4 : 3);
  return fields
    .sort((a, b) => rank(a) - rank(b))
    .map((f) => {
      const v = entry.fields[f.id]?.mn;
      if (v == null || v === '' || (Array.isArray(v) && !v.length)) return null;
      if (f.type === 'RichText') return { id: f.id, kind: 'richText', value: cfToMd(v) };
      if (f.type === 'Array') return { id: f.id, kind: 'list', value: v };
      return { id: f.id, kind: f.type === 'Text' ? 'textarea' : 'text', value: String(v) };
    })
    .filter((f) => f && (f.kind === 'list' ? f.value.length : f.value.trim()));
}

function prompt(batchName, entries, terms) {
  const target = LANG_NAME[LANG] || LANG;
  const glossaryLines = terms.map((g) => `- ${g.match} → ${g.en}${g.note ? `  (${g.note.replace(/URL: \S+/, '').trim()})` : ''}`).join('\n');
  return `<!-- ===== ХУУЛЖ AI-Д ӨГӨХ PROMPT (эндээс доош бүгдийг, файлын төгсгөл хүртэл хуулна) ===== -->

You are a professional travel translator. Translate the Mongolian website content below into natural, accurate ${target} for Travel Hub Mongolia (travelhubmongolia.com), a travel guide for international visitors. File: ${batchName} (${entries.length} pages).

## Output format (strict — the file is checked by a script)
1. Return the whole file in the same structure: every line that starts with "@@@ ENTRY", "@@ FIELD" or "@@@ END" must be copied EXACTLY, unchanged, in the same order. Translate only the text between them.
2. Translate every page and every field. Do not skip, merge, reorder, summarize or add pages/fields. If the reply gets too long, stop after a complete "@@@ END …" line and I will ask you to continue from the next page.
3. Output only the file content, starting with the first "@@@ ENTRY" line and ending with the last "@@@ END" line. No comments, no code fences, no notes.

## Markdown (fields marked "richText")
4. Keep the same number and order of headings (#, ##, ###), paragraphs, list items, tables (same rows and columns), and horizontal rules (---).
5. Image lines like "![image](asset:XXXX)" must stay exactly as they are, in the same position.
6. Links "[text](URL)": translate only the text, never change the URL.
7. Keep **bold**, _italic_ and <br> where they are. Keep backslash escapes (\\* \\_ \\[ \\| \\.).
8. "list" fields: one item per line, each line starting with "- ".

## Language and style
9. Use the glossary below exactly. Place names: use the given spelling (no diacritics: "Khuvsgul", "Uvurkhangai"); never translate the meaning of a proper name.
10. First mention of a Mongolian term: add a short explanation in brackets as given in the glossary notes, e.g. "ovoo (sacred stone cairn)"; later mentions use the term alone.
11. ## headings: phrase them as natural questions travelers ask (e.g. "Where is Dadal soum?", "What is there to see in Dadal?", "How do I get to Dadal?"), keeping the meaning and order of the original heading. ### headings may stay descriptive.
12. "seoTitle": at most 60 characters, starts with the main keyword (e.g. "Dadal soum, Khentii: …"), no brand name. "seoDescription": 120–155 characters, one or two complete sentences with the main keyword.
13. Facts: keep every number, date, distance and name; do not add information that is not in the source. Numbers with thousands separators (4,200), units km, m, km², °C. Mongolian currency: "MNT".
14. Tone: clear, warm, factual, second person where natural ("you can…"). Short sentences. ${LANG === 'en' ? 'American spelling (center, traveler, color).' : ''}
15. No Cyrillic letters may remain in the output.

## Glossary (terms that appear in this file)
${glossaryLines || '- (none)'}

<!-- ===== PROMPT ДУУСАВ. Доорх нь орчуулах агуулга ===== -->
`;
}

fs.mkdirSync(OUT, { recursive: true });
const missing = [];
const entries = [];
for (const r of rows) {
  const e = ex.entryById.get(r.entry_id);
  if (!e) {
    missing.push(r.entry_id);
    continue;
  }
  entries.push({ id: e.sys.id, type: e.sys.contentType.sys.id, url: r['хаяг'] || '', fields: translatableFields(e) });
}

// Аль хэдийн гаргасан багцыг (<PREFIX>-NNN.md) дахин бичихгүй: орчуулагч авсан байж болно, эх нь өөрчлөгдвөл
// шалгагч эвдэрнэ (2026-11-16-наас; өмнө нь зөвхөн done/-д хариутай багцыг). --rebuild бол done/-гүйг дахин гаргана.
// Ямар нэг багцад (en-review орно) аль хэдийн орсон хуудсыг дахин оруулахгүй — давхар орчуулахгүй.
const { parseBatch } = require('./lib/batch');
const DONE = path.join(path.dirname(OUT), 'done');
const own = new RegExp(`^${PREFIX.replace(/[-]/g, '\\-')}-\\d{3}\\.md$`);
const frozen = new Set();
const frozenIds = new Set();
for (const f of fs.readdirSync(OUT)) {
  if (!/^[a-zA-Z-]+-\d{3}\.md$/.test(f)) continue;
  const mine = own.test(f);
  if (mine && args.includes('--rebuild') && !fs.existsSync(path.join(DONE, f))) continue;
  if (mine) frozen.add(f);
  parseBatch(fs.readFileSync(path.join(OUT, f), 'utf8')).entries.forEach((e) => frozenIds.add(e.id));
}
const pool = entries.filter((e) => !frozenIds.has(e.id));
const alreadyBatched = entries.length - pool.length;
let num = 0;
const nextName = () => {
  let n;
  do n = `${PREFIX}-${String(++num).padStart(3, '0')}.md`;
  while (frozen.has(n));
  return n;
};
if (frozen.size) console.log(`Аль хэдийн гаргасан тул хөндөөгүй багц: ${[...frozen].join(", ")}`);

const files = [];
for (let i = 0; i < pool.length; i += SIZE) {
  const chunk = pool.slice(i, i + SIZE);
  const name = nextName();
  const body = chunk.map(serializeEntry).join('\n\n');
  const always = glossary.filter((g) => ['аймаг', 'сум', 'дүүрэг', 'баг', 'сумын төв', 'аймгийн төв'].includes(g.mn));
  const found = termsIn(body, glossary, { minLength: 3 });
  const terms = [...new Map([...always, ...found].map((g) => [g.mn, g])).values()];
  fs.writeFileSync(path.join(OUT, name), prompt(name, chunk, terms) + '\n' + body + '\n');
  files.push({ name, pages: chunk.length, words: body.split(/\s+/).length, terms: terms.length });
}
console.log(`Сонгогдсон ${entries.length}, өмнөх багцад орсон ${alreadyBatched}, шинэ ${pool.length} хуудас → ${files.length} шинэ файл (${path.relative(ROOT, OUT)}). Хасагдсан: ГАРААР ШАЛГАХ ${skipped.review}, нийтлэгдээгүй/алгассан ${skipped.unpublished}`);
console.table(files);
if (missing.length) console.log(`Экспортод олдоогүй entry (${missing.length}): ${missing.join(', ')}`);
console.log(`Эх сурвалж: ${path.basename(ex.dir)} (ноорог = CMA-ийн хамгийн сүүлийн хувилбар)`);
if (pendingAfterExport.length)
  console.log(
    `Экспортоос хойш дахин бичсэн ${pendingAfterExport.length} хуудас багцад ороогүй (экспортод хуучин текст нь байна). ` +
      `Шинэ экспорт (scripts/payload/export-delta.js, 4 хүсэлт) хийсний дараа энэ скриптийг дахин ажиллуулна — ` +
      `орчуулга эхэлсэн багцыг хөндөхгүй, шинэ хуудсууд дараагийн дугаартай файлд орно.`
  );

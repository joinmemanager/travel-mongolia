// Дахин бичсэн файл Contentful-ийн draft-д бүрэн хадгалагдсан эсэхийг шалгана (зөвхөн GET).
//   node scripts/content/verify-rewrite.js data/rewrites/<id>.md
// Шалгах: entry draft-ийн seoTitle/seoDescription = файлынх, rich text-ийн текст файлын текстийг агуулсан, alt.<asset> title тохирсон.
const fs = require('fs');
const { cma, LOCALE } = require('../tic/_cma');

const file = process.argv[2];
const md = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(md);
const meta = {};
for (const line of m[1].split(/\r?\n/)) { const x = /^([\w.\-]+):\s*(.*)$/.exec(line); if (x) meta[x[1]] = x[2].trim(); }
const texts = (n) => (JSON.stringify(n).match(/"value":"((?:[^"\\]|\\.)*)"/g) || []).map((s) => JSON.parse(s.slice(8))).join(' ');
const norm = (s) => s.replace(/\*\*|\{\{IMG:[\w-]+\}\}|^#{2,3}\s+|^-\s+/gm, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim();

(async () => {
  const e = await cma('GET', `/entries/${meta.id}`);
  const problems = [];
  const st = !e.sys.publishedVersion ? 'draft' : e.sys.version > e.sys.publishedVersion + 1 ? 'changed' : 'published';
  if (st !== 'changed') problems.push(`төлөв ${st} (draft өөрчлөлт алга)`);
  if (meta.seoTitle && e.fields.seoTitle?.[LOCALE] !== meta.seoTitle) problems.push('seoTitle зөрүүтэй');
  if (meta.seoDescription && e.fields.seoDescription?.[LOCALE] !== meta.seoDescription) problems.push('seoDescription зөрүүтэй');
  const have = texts(e.fields[meta.field]?.[LOCALE]).replace(/\s+/g, ' ').trim();
  const want = norm(m[2]);
  if (have.replace(/\s/g, '') !== want.replace(/\s/g, '')) problems.push(`бичвэр зөрүүтэй (contentful ${have.length} / файл ${want.length} тэмдэгт)`);
  for (const [k, v] of Object.entries(meta)) {
    if (!k.startsWith('alt.') || !v) continue;
    const a = await cma('GET', `/assets/${k.slice(4)}`);
    if (a && a.fields.title?.[LOCALE] !== v) problems.push(`alt зөрүүтэй: ${k.slice(4)}`);
  }
  console.log(problems.length ? `${meta.id} ДУТУУ: ${problems.join('; ')}` : `${meta.id} OK (v${e.sys.version}, pub v${e.sys.publishedVersion})`);
})().catch((err) => { console.error('АЛДАА:', err.message); process.exit(1); });

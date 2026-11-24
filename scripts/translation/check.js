// Орчуулсан багцыг эхтэй нь (batches/en-NNN.md) харьцуулж шалгана, тайланг done/en-NNN.report.md-д бичнэ.
//   node scripts/translation/check.js docs/translation/done/en-001.md [--source docs/translation/batches/en-001.md]
//   node scripts/translation/check.js docs/translation/done            (хавтсын бүх файл)
// АЛДАА (импорт хийхгүй): бүтэц эвдэрсэн (ENTRY/FIELD/END), дутуу/илүү хуудас, талбар, Markdown-ийн бүтэц
//   (гарчиг, жагсаалт, хүснэгт, зураг, холбоос) өөр, кирилл үсэг үлдсэн, «sum» (сум = «soum»)/«wind horse», seoTitle > 60, seoDescription > 155.
// АНХААРУУЛГА (шалгаж үзэх): толь бичгийн нэр томъёо олдсонгүй, H2 асуулт биш, урт эхээсээ хэт зөрүүтэй,
//   seoDescription < 110.
'use strict';
const fs = require('fs');
const path = require('path');
const { parseBatch } = require('./lib/batch');
const { mdToCf, structureOf } = require('./lib/md');
const { loadGlossary, termsIn, ROOT } = require('./lib/glossary');

const SEO_TITLE_MAX = 60;
const SEO_DESC_MAX = 155;
const SEO_DESC_MIN = 110;
const CYRILLIC = /[А-Яа-яЁёӨөҮү]/;

const glossary = loadGlossary();
// Нэр томъёоны шалгалт: газар, засаг захиргаа, соёлын нэр (ерөнхий үгсийг хасна — худал анхааруулга ихтэй)
const CHECK_TYPES = new Set(['аймаг', 'сум', 'дүүрэг', 'газар', 'соёл', 'хоол', 'шашин', 'түүх', 'ард түмэн', 'хамгаалалт', 'амьтан', 'дурсгал']);
const checkTerms = glossary.filter((g) => CHECK_TYPES.has(g.type));

function checkFile(donePath, sourcePath) {
  const errors = [];
  const warnings = [];
  const E = (id, msg) => errors.push(`\`${id}\` ${msg}`);
  const W = (id, msg) => warnings.push(`\`${id}\` ${msg}`);

  const src = parseBatch(fs.readFileSync(sourcePath, 'utf8'));
  const done = parseBatch(fs.readFileSync(donePath, 'utf8'));
  done.errors.forEach((e) => errors.push(`Формат: ${e}`));

  const doneById = new Map();
  for (const e of done.entries) {
    if (doneById.has(e.id)) E(e.id, 'давхардсан хуудас');
    doneById.set(e.id, e);
  }
  const srcIds = new Set(src.entries.map((e) => e.id));
  for (const e of done.entries) if (!srcIds.has(e.id)) E(e.id, 'эх файлд байхгүй хуудас (ID буруу?)');

  let okPages = 0;
  for (const s of src.entries) {
    const d = doneById.get(s.id);
    if (!d) {
      E(s.id, 'орчуулга алга (хуудас дутуу)');
      continue;
    }
    const before = errors.length;
    const dFields = new Map(d.fields.map((f) => [f.id, f]));
    for (const sf of s.fields) {
      const df = dFields.get(sf.id);
      if (!df) {
        E(s.id, `талбар «${sf.id}» алга`);
        continue;
      }
      if (df.kind !== sf.kind) E(s.id, `«${sf.id}»-ийн төрөл ${df.kind} (${sf.kind} байх ёстой)`);
      const dText = Array.isArray(df.value) ? df.value.join('\n') : df.value;
      const sText = Array.isArray(sf.value) ? sf.value.join('\n') : sf.value;
      if (!dText.trim()) E(s.id, `«${sf.id}» хоосон`);
      const cyr = dText.match(new RegExp(`.{0,25}${CYRILLIC.source}.{0,25}`));
      if (cyr) E(s.id, `«${sf.id}»-д кирилл үсэг үлдсэн: «${cyr[0].replace(/\n/g, ' ')}»`);
      // Толь бичгийн хориотой хэлбэр (URL доторхыг тооцохгүй)
      // 2026-11-24-нөөс сум = «soum» (олон тоо «soums»). «sum» нь зөвхөн нийлбэр («a sum of money», «in sum», «lump sum»)
      // эсвэл сүмийн нэрэнд («Gunjiin Sum» — Гүнжийн сүм) зөвшөөрөгдөнө.
      const plain = dText
        .replace(/\]\([^)]*\)|<[^>]*>|https?:\/\/\S+/g, '')
        .replace(/\bGunjiin Sums?\b|\bsums? of money\b|\blump sums?\b|\bin sum\b|\bsums? up\b|\bsum total\b/gi, '');
      const banned = plain.match(/.{0,25}(\bsums?\b|\bwind[ -]?horses?\b).{0,25}/i);
      if (banned) E(s.id, `«${sf.id}»-д хориотой нэр томъёо («sum» → «soum», «wind horse» → «khiimori»): «${banned[0].replace(/\n/g, ' ')}»`);
      if (sf.kind === 'list' && df.value.length !== sf.value.length) E(s.id, `«${sf.id}» жагсаалтын мөр ${df.value.length} (эхэд ${sf.value.length})`);

      if (sf.id === 'seoTitle' && [...dText].length > SEO_TITLE_MAX) E(s.id, `seoTitle ${[...dText].length} тэмдэгт (≤${SEO_TITLE_MAX}): «${dText}»`);
      if (sf.id === 'seoDescription') {
        const n = [...dText].length;
        if (n > SEO_DESC_MAX) E(s.id, `seoDescription ${n} тэмдэгт (≤${SEO_DESC_MAX})`);
        else if (n < SEO_DESC_MIN) W(s.id, `seoDescription ${n} тэмдэгт (${SEO_DESC_MIN}–${SEO_DESC_MAX} байвал сайн)`);
      }

      if (sf.kind === 'richText') {
        const a = structureOf(mdToCf(sf.value));
        const b = structureOf(mdToCf(df.value));
        if (a.blocks.join() !== b.blocks.join()) {
          let i = 0;
          while (i < a.blocks.length && a.blocks[i] === b.blocks[i]) i++;
          E(s.id, `«${sf.id}» бүтэц өөр: ${i + 1}-р блок эхэд ${a.blocks[i] || '(дууссан)'}, орчуулгад ${b.blocks[i] || '(дууссан)'} (нийт ${a.blocks.length} / ${b.blocks.length})`);
        }
        if (a.assets.join() !== b.assets.join()) E(s.id, `«${sf.id}» зургийн мөрүүд өөр (эхэд ${a.assets.length}, орчуулгад ${b.assets.length})`);
        if ([...a.links].sort().join() !== [...b.links].sort().join()) E(s.id, `«${sf.id}» холбоосын URL өөр: ${a.links.filter((l) => !b.links.includes(l)).join(', ') || 'илүү холбоос'}`);
        if (a.listItems !== b.listItems) E(s.id, `«${sf.id}» жагсаалтын мөр ${b.listItems} (эхэд ${a.listItems})`);
        if (a.cells !== b.cells) E(s.id, `«${sf.id}» хүснэгтийн нүд ${b.cells} (эхэд ${a.cells})`);
        for (const h of df.value.split('\n').filter((l) => /^##\s/.test(l))) if (!/\?\s*$/.test(h) && !/frequently asked|FAQ/i.test(h)) W(s.id, `H2 асуулт хэлбэргүй: «${h.replace(/^##\s*/, '')}»`);
        // Англи текст монголоос ойролцоогоор 0.9–1.3 дахин урт (тэмдэгтээр); хэт богино = орхигдсон байж болно
        const ratio = dText.length / Math.max(1, sText.length);
        if (ratio < 0.65 || ratio > 1.9) W(s.id, `«${sf.id}» урт эхийнхээс ${ratio.toFixed(2)} дахин (орхигдсон/нэмэгдсэн эсэхийг шалгах)`);
      }

      // Толь бичиг: эхэд байгаа нэрийн англи хэлбэр орчуулгад байх ёстой
      if (sf.kind !== 'list') {
        for (const g of [...new Map(termsIn(sText, checkTerms).map((x) => [x.match + '|' + x.enCore, x])).values()]) {
          const want = g.enCore.toLowerCase();
          if (!dText.toLowerCase().includes(want)) W(s.id, `«${sf.id}»: «${g.match}» → «${g.enCore}» олдсонгүй`);
        }
      }
    }
    for (const f of d.fields) if (!s.fields.some((x) => x.id === f.id)) E(s.id, `илүү талбар «${f.id}»`);
    if (errors.length === before) okPages++;
  }

  const name = path.basename(donePath);
  const report = [
    `# Орчуулгын шалгалт: ${name}`,
    '',
    `- Эх: \`${path.relative(ROOT, sourcePath).replace(/\\/g, '/')}\` (${src.entries.length} хуудас)`,
    `- Орчуулга: ${done.entries.length} хуудас, алдаагүй ${okPages}`,
    `- **Алдаа: ${errors.length}**, анхааруулга: ${warnings.length}`,
    `- Огноо: ${new Date().toISOString().slice(0, 16).replace('T', ' ')}`,
    '',
    errors.length ? '## Алдаа (засахгүй бол импортлохгүй)' : '## Алдаа алга — импортлоход бэлэн',
    '',
    ...errors.map((e) => `- ${e}`),
    '',
    '## Анхааруулга (уншиж шалгах)',
    '',
    ...(warnings.length ? warnings.map((w) => `- ${w}`) : ['- (алга)']),
    '',
  ].join('\n');
  const reportPath = donePath.replace(/\.md$/, '.report.md');
  fs.writeFileSync(reportPath, report);
  return { name, pages: src.entries.length, translated: done.entries.length, ok: okPages, errors: errors.length, warnings: warnings.length, report: path.relative(ROOT, reportPath) };
}

const target = path.resolve(process.argv[2] || path.join(ROOT, 'docs', 'translation', 'done'));
const srcArg = process.argv.indexOf('--source') >= 0 ? path.resolve(process.argv[process.argv.indexOf('--source') + 1]) : null;
const files = fs.statSync(target).isDirectory()
  ? fs.readdirSync(target).filter((f) => /\.md$/.test(f) && !/\.report\.md$/.test(f) && f !== 'README.md').map((f) => path.join(target, f))
  : [target];
const results = [];
for (const f of files) {
  const source = srcArg || path.join(ROOT, 'docs', 'translation', 'batches', path.basename(f));
  if (!fs.existsSync(source)) {
    console.log(`${path.basename(f)}: эх файл ${path.relative(ROOT, source)} олдсонгүй (--source өгнө үү)`);
    continue;
  }
  results.push(checkFile(f, source));
}
console.table(results);
process.exit(results.some((r) => r.errors) ? 1 : 0);

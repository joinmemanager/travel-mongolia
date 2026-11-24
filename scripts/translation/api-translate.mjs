// Орчуулгын багцыг Claude API-аар (Message Batches, −50%) орчуулна. Хуудас бүр = нэг хүсэлт.
// Толь бичиг (glossary.csv бүтнээр) + style-guide.md + дүрмүүд = system prompt, бүх хүсэлтэд ИЖИЛ тул
// prompt caching-ээр (1 цагийн TTL — Batch-д зөвлөсөн) кэшлэнэ. Хүсэлт бүрийн user хэсэг = зөвхөн нэг хуудас.
//
// Суулгах (нэг удаа): .tools/bin/pnpm install --dir scripts/translation
// Түлхүүр: ANTHROPIC_API_KEY-г travel-mongolia/.env.local-аас (Next-тэй адил) уншина, хэвлэхгүй.
//
//   node scripts/translation/api-translate.mjs count [--models haiku,sonnet] [--files en-001,en-002 | бүгд]
//        → messages.count_tokens (үнэгүй)-оор оролтын token, бүх багцын зардлын тооцоо (docs/translation/model-test/cost.json)
//   node scripts/translation/api-translate.mjs test --file en-001 --pages 5 [--models haiku,sonnet] [--max-usd 1]
//        → эхний N хуудсыг загвар бүрээр орчуулж docs/translation/model-test/<загвар>/<file>-p1-N.md-д хадгална
//   node scripts/translation/api-translate.mjs run --file en-008 --model sonnet [--max-usd 20]
//        → бүтэн багц → docs/translation/done/<file>.md (дараа нь check.js)
//   node scripts/translation/api-translate.mjs collect <batch_id> → (тасарсан бол) үр дүнг дахин татна
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const APP = path.join(ROOT, 'travel-mongolia');
const require = createRequire(import.meta.url);
const T = path.join(ROOT, 'docs', 'translation');
const OUT = path.join(T, 'model-test');

// .env.local (Next-тэй адил)
{
  const appRequire = createRequire(createRequire(path.join(APP, 'package.json')).resolve('next/package.json'));
  appRequire('@next/env').loadEnvConfig(APP, false, { info() {}, error() {} });
}
const { default: Anthropic } = await import('@anthropic-ai/sdk');
const { parseBatch, serializeEntry } = require('./lib/batch.js');
const { loadGlossary } = require('./lib/glossary.js');

// Үнэ ($ / 1M token, стандарт). Batch −50%. Кэш: бичих 1h = 2×, унших Sonnet 5.5 0.05×, Haiku 5.5 0.1×.
const MODELS = {
  haiku: { id: 'claude-haiku-5-5', in: 0.1, out: 0.5, read: 0.1 },
  sonnet: { id: 'claude-sonnet-5-5', in: 2, out: 10, read: 0.05 },
  opus: { id: 'claude-opus-5-5', in: 4, out: 20, read: 0.05 },
};
const BATCH = 0.5;
const WRITE_1H = 2;
const EFFORT_ARG = process.argv.includes('--effort') ? process.argv[process.argv.indexOf('--effort') + 1] : 'medium';
const EFFORT = EFFORT_ARG;
const MAX_TOKENS = Number(process.argv.includes('--max-tokens') ? process.argv[process.argv.indexOf('--max-tokens') + 1] : 16000);
const TAG = EFFORT === 'medium' ? '' : `-${EFFORT}`;

const args = process.argv.slice(2);
const cmd = args[0];
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const modelKeys = arg('--models', arg('--model', 'haiku,sonnet')).split(',');
const client = new Anthropic();

// ------------------------------------------------------------------ prompt
function systemPrompt() {
  const glossary = loadGlossary()
    .map((g) => `- ${g.mn} → ${g.en}${g.note ? `  (${g.note.replace(/\s*URL: \S+/, '').trim()})` : ''}`)
    .join('\n');
  const style = fs.readFileSync(path.join(T, 'style-guide.md'), 'utf8');
  return `You are a professional travel translator. Translate Mongolian website content into natural, accurate American English for Travel Hub Mongolia (travelhubmongolia.com), a travel guide for international visitors. Each user message contains exactly one page.

## Output format (strict — the result is checked by a script)
1. Return the page in the same structure: every line that starts with "@@@ ENTRY", "@@ FIELD" or "@@@ END" must be copied EXACTLY, unchanged, in the same order. Translate only the text between them.
2. Translate every field. Do not skip, merge, reorder, summarize or add fields.
3. Output only the page, starting with the "@@@ ENTRY" line and ending with the "@@@ END" line. No comments, no code fences, no notes.

## Markdown (fields marked "richText")
4. Keep the same number and order of headings (#, ##, ###), paragraphs, list items, tables (same rows and columns), and horizontal rules (---).
5. Image lines like "![image](asset:XXXX)" must stay exactly as they are, in the same position.
6. Links "[text](URL)": translate only the text, never change the URL.
7. Keep **bold**, _italic_ and <br> where they are. Keep backslash escapes (\\* \\_ \\[ \\| \\.).
8. "list" fields: one item per line, each line starting with "- ".

## Language and style
9. Use the glossary below exactly. Place names: use the given spelling (no diacritics: "Khuvsgul", "Uvurkhangai"); never translate the meaning of a proper name. Administrative unit сум is always "soum" (plural "soums"), never "sum". хийморь is "khiimori" — first mention "khiimori (a person's vital energy and good fortune)", never "wind horse".
10. First mention of a Mongolian term: add a short explanation in brackets as given in the glossary notes, e.g. "ovoo (sacred stone cairn)"; later mentions use the term alone.
11. ## headings: phrase them as natural questions travelers ask (e.g. "Where is Dadal soum?", "What is there to see in Dadal?", "How do I get to Dadal?"), keeping the meaning and order of the original heading. ### headings may stay descriptive.
12. "seoTitle": at most 60 characters, starts with the main keyword (e.g. "Dadal soum, Khentii: …"), no brand name. "seoDescription": 120–155 characters, one or two complete sentences with the main keyword.
13. Facts: keep every number, date, distance and name; do not add information that is not in the source. Numbers with thousands separators (4,200), units km, m, km², °C. Mongolian currency: "MNT".
14. Tone: clear, warm, factual, second person where natural ("you can…"). Short sentences. American spelling (center, traveler, color).
15. No Cyrillic letters may remain in the output.

## Style guide (written in Mongolian for the editors; follow it)
${style}

## Glossary (mn → en, notes in Mongolian)
${glossary}
`;
}

const SYSTEM = () => [{ type: 'text', text: systemPrompt(), cache_control: { type: 'ephemeral', ttl: '1h' } }];

function loadPages(file) {
  const p = path.join(T, 'batches', `${file}.md`);
  const { entries, errors } = parseBatch(fs.readFileSync(p, 'utf8'));
  if (errors.length) throw new Error(`${file}: ${errors.slice(0, 3).join('; ')}`);
  return entries;
}

const params = (m, page) => ({
  model: MODELS[m].id,
  max_tokens: MAX_TOKENS,
  thinking: { type: 'adaptive' },
  output_config: { effort: EFFORT },
  system: SYSTEM(),
  messages: [{ role: 'user', content: serializeEntry(page) }],
});

const usd = (m, u) => {
  const p = MODELS[m];
  const inp = (u.input_tokens || 0) * p.in + (u.cache_creation_input_tokens || 0) * p.in * WRITE_1H + (u.cache_read_input_tokens || 0) * p.in * p.read;
  return ((inp + (u.output_tokens || 0) * p.out) / 1e6) * BATCH;
};

// ------------------------------------------------------------------ count
async function count(m, text, withSystem) {
  const r = await client.messages.countTokens({
    model: MODELS[m].id,
    ...(withSystem && { system: SYSTEM().map(({ cache_control, ...b }) => b) }),
    messages: [{ role: 'user', content: text }],
  });
  return r.input_tokens;
}

async function cmdCount() {
  const files = (arg('--files') ? arg('--files').split(',') : fs.readdirSync(path.join(T, 'batches')).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))).sort();
  const res = { at: new Date().toISOString(), effort: EFFORT, models: {}, files: {} };
  for (const m of modelKeys) {
    const sysPlusOne = await count(m, '.', true);
    const one = await count(m, '.', false);
    const system = sysPlusOne - one;
    let pages = 0;
    let content = 0;
    for (const f of files) {
      const entries = loadPages(f);
      // Файлын бүх хуудсыг нэг мессежээр тоолно (хуудас тус бүрийн тоолтын нийлбэртэй бараг ижил)
      const c = (await count(m, entries.map(serializeEntry).join('\n'), false)) - one;
      res.files[f] = { ...(res.files[f] || {}), pages: entries.length, [m]: c };
      pages += entries.length;
      content += c;
    }
    res.models[m] = { model: MODELS[m].id, systemTokens: system, pages, contentTokens: content };
    console.log(m, res.models[m]);
  }
  fs.mkdirSync(OUT, { recursive: true });
  const prev = fs.existsSync(path.join(OUT, 'cost.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'cost.json'), 'utf8')) : {};
  fs.writeFileSync(path.join(OUT, 'cost.json'), JSON.stringify({ ...prev, count: res }, null, 1));
}

// ------------------------------------------------------------------ batch
async function submitAndWait(requests, label) {
  const batch = await client.messages.batches.create({ requests });
  console.log(`${label}: batch ${batch.id} (${requests.length} хүсэлт)`);
  fs.mkdirSync(OUT, { recursive: true });
  fs.appendFileSync(path.join(OUT, 'batches.log'), `${new Date().toISOString()} ${label} ${batch.id} ${requests.length}\n`);
  let b = batch;
  while (b.processing_status !== 'ended') {
    await new Promise((r) => setTimeout(r, 30_000));
    b = await client.messages.batches.retrieve(batch.id);
    console.log(`  ${b.processing_status} ok=${b.request_counts.succeeded} err=${b.request_counts.errored} …${b.request_counts.processing}`);
  }
  return collect(batch.id);
}

async function collect(id) {
  const out = new Map();
  for await (const r of await client.messages.batches.results(id)) {
    if (r.result.type !== 'succeeded') {
      out.set(r.custom_id, { error: r.result.type === 'errored' ? JSON.stringify(r.result.error) : r.result.type });
      continue;
    }
    const msg = r.result.message;
    const text = msg.content.filter((c) => c.type === 'text').map((c) => c.text).join('').trim();
    out.set(r.custom_id, { text, stop: msg.stop_reason, usage: msg.usage });
  }
  return out;
}

// Хуудасны нийт зардлын хамгийн муу тохиолдол (кэш огт таарахгүй, гаралт = max_tokens биш, эхийн 2.5×)
async function worstCase(m, pages) {
  let input = 0;
  let src = 0;
  const sys = (await count(m, '.', true)) - (await count(m, '.', false));
  for (const p of pages) {
    const c = await count(m, serializeEntry(p), false);
    src += c;
    input += sys + c;
  }
  const p = MODELS[m];
  return { usd: ((sys * p.in * WRITE_1H + input * p.in + src * 2.5 * p.out) / 1e6) * BATCH, input, src, sys };
}

async function cmdTest() {
  const file = arg('--file', 'en-001');
  const n = Number(arg('--pages', 5));
  const maxUsd = Number(arg('--max-usd', 1));
  const pages = loadPages(file).slice(0, n);
  let est = 0;
  for (const m of modelKeys) {
    const w = await worstCase(m, pages);
    console.log(`${m}: system ${w.sys}, эх ${w.src} token, хамгийн муу тохиолдолд ≈$${w.usd.toFixed(3)}`);
    est += w.usd;
  }
  if (est > maxUsd) throw new Error(`Тооцоолсон зардал $${est.toFixed(2)} > хязгаар $${maxUsd}`);
  const requests = modelKeys.flatMap((m) => pages.map((p, i) => ({ custom_id: `${m}-${i}`, params: params(m, p) })));
  const res = await submitAndWait(requests, `test ${file} p1-${n} ${modelKeys.join(',')}`);
  const summary = { file, pages: n, effort: EFFORT, at: new Date().toISOString(), models: {} };
  // Эх (шалгагчид): эхний N хуудас
  fs.writeFileSync(path.join(OUT, `${file}-p1-${n}.source.md`), pages.map(serializeEntry).join('\n\n') + '\n');
  for (const m of modelKeys) {
    const dir = path.join(OUT, m);
    fs.mkdirSync(dir, { recursive: true });
    const tot = { input_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, output_tokens: 0 };
    const parts = [];
    const issues = [];
    pages.forEach((p, i) => {
      const r = res.get(`${m}-${i}`);
      if (!r || r.error) {
        issues.push(`${p.id}: ${r?.error || 'хариу алга'}`);
        return;
      }
      if (r.stop !== 'end_turn') issues.push(`${p.id}: stop_reason ${r.stop}`);
      for (const k of Object.keys(tot)) tot[k] += r.usage[k] || 0;
      parts.push(r.text);
    });
    fs.writeFileSync(path.join(dir, `${file}-p1-${n}${TAG}.md`), parts.join('\n\n') + '\n');
    summary.models[m] = { model: MODELS[m].id, usage: tot, usd: Number(usd(m, tot).toFixed(4)), issues };
    console.log(m, summary.models[m]);
  }
  fs.writeFileSync(path.join(OUT, `${file}-p1-${n}${TAG}.usage.json`), JSON.stringify(summary, null, 1));
}

async function cmdRun() {
  const file = arg('--file');
  const m = modelKeys[0];
  const maxUsd = Number(arg('--max-usd', 20));
  const pages = loadPages(file);
  const w = await worstCase(m, pages);
  console.log(`${m} ${file}: ${pages.length} хуудас, хамгийн муу тохиолдолд ≈$${w.usd.toFixed(2)}`);
  if (w.usd > maxUsd) throw new Error(`> хязгаар $${maxUsd}`);
  const res = await submitAndWait(pages.map((p, i) => ({ custom_id: `p${i}`, params: params(m, p) })), `run ${file} ${m}`);
  const tot = { input_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0, output_tokens: 0 };
  const parts = [];
  pages.forEach((p, i) => {
    const r = res.get(`p${i}`);
    if (!r || r.error) return console.log(`АЛДАА ${p.id}: ${r?.error}`);
    for (const k of Object.keys(tot)) tot[k] += r.usage[k] || 0;
    parts.push(r.text);
  });
  fs.mkdirSync(path.join(T, 'done'), { recursive: true });
  fs.writeFileSync(path.join(T, 'done', `${file}.md`), parts.join('\n\n') + '\n');
  console.log({ usage: tot, usd: usd(m, tot).toFixed(3) });
}

// ------------------------------------------------------------------ all (бүх багц, дарааллаар, төсөвтэй)
// node scripts/translation/api-translate.mjs all --model sonnet --budget 4.5 [--hard 4.9] [--files en-001,en-002]
// - en-review-*-ийг алгасна; done/-д байгаа хуудсыг (болон эх нь өөрчлөгдөөгүй pilot-en орчуулгыг) дахин орчуулахгүй.
// - Хариу бүр .tools/translation-raw/<file>.jsonl-д шууд бичигдэнэ; илгээсэн batch-ийн id state-д → тасарвал дахин
//   ажиллуулахад төлбөр давхардахгүй (collect хийнэ).
// - Шалгагч: seoTitle/seoDescription урт → богиносгох хүсэлт; бусад алдаа → алдааг нь хэлж дахин орчуулах (2 удаа).
// - Зарцуулалт (энэ ажлын нийт) ≥ budget бол шинэ batch илгээхгүй; эхэлснийг дуусгана. budget-ээс доош байсан ч
//   дараагийн batch-ийн тооцоолсон зардал hard-аас (урьдчилсан цэнэг) давахаар бол илгээхгүй.
const RUN = path.join(T, 'api-run');
const RAW = path.join(ROOT, '.tools', 'translation-raw');
const LEDGER = path.join(RUN, 'ledger.json');

function loadLedger() {
  return fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, 'utf8')) : { model: null, spent: 0, batches: [], pending: null, files: {} };
}
function saveLedger(l) {
  fs.mkdirSync(RUN, { recursive: true });
  fs.writeFileSync(LEDGER, JSON.stringify(l, null, 1));
}
function runLog(s) {
  const line = `${new Date().toISOString().slice(0, 19).replace('T', ' ')} ${s}`;
  console.log(line);
  fs.mkdirSync(RUN, { recursive: true });
  fs.appendFileSync(path.join(RUN, 'run.log'), line + '\n');
}

// raw: id → { text, stop, usage, kind } (сүүлийнх нь хүчинтэй)
function loadRaw(file) {
  const p = path.join(RAW, `${file}.jsonl`);
  const m = new Map();
  if (fs.existsSync(p)) for (const l of fs.readFileSync(p, 'utf8').split('\n').filter(Boolean)) {
    const r = JSON.parse(l);
    if (r.kind === 'translate') m.set(r.id, r); // зөвхөн орчуулга (богиносгох хариу тусдаа)
  }
  return m;
}
// Хариунаас зөвхөн «@@@ ENTRY» … «@@@ END» хэсэг (өмнө/хойно илүү текст, code fence байвал хасна)
function pageOnly(text) {
  const s = text.indexOf('@@@ ENTRY');
  const ends = [...text.matchAll(/^@@@ END \S+\s*$/gm)];
  if (s < 0 || !ends.length) return text.trim();
  const last = ends[ends.length - 1];
  return text.slice(s, last.index + last[0].length).trim();
}
// Загвар заримдаа сүүлийн «@@@ END <id>»-г id-гүй бичих эсвэл орхидог (stop = end_turn — текст бүтэн) → нөхнө
function ensureEnd(text, id) {
  let t = text.trim().replace(/```\s*$/, '').trim();
  if (t.split('\n').some((l) => l.trim() === `@@@ END ${id}`)) return t;
  t = t.replace(/\n@@@ END\s*$/, '').trim();
  return `${t}\n@@@ END ${id}`;
}
function appendRaw(file, rec) {
  fs.mkdirSync(RAW, { recursive: true });
  fs.appendFileSync(path.join(RAW, `${file}.jsonl`), JSON.stringify(rec) + '\n');
}

// Аль хэдийн орчуулсан хуудас: done/*.md (өөр файлд ч) + pilot-en (эх нь одоогийн багцтай ижил бол)
function existingTranslations() {
  const m = new Map();
  const doneDir = path.join(T, 'done');
  if (fs.existsSync(doneDir)) for (const f of fs.readdirSync(doneDir).filter((f) => /^en-\d+\.md$/.test(f))) {
    for (const e of parseBatch(fs.readFileSync(path.join(doneDir, f), 'utf8')).entries) m.set(e.id, { entry: e, from: `done/${f}` });
  }
  return m;
}
function pilotTranslations() {
  const dir = path.join(T, 'pilot-en');
  const src = new Map();
  const sdir = path.join(dir, 'source');
  if (fs.existsSync(sdir)) for (const f of fs.readdirSync(sdir).filter((f) => f.endsWith('.md'))) {
    for (const e of parseBatch(fs.readFileSync(path.join(sdir, f), 'utf8')).entries) src.set(e.id, e);
  }
  const m = new Map();
  for (const f of fs.readdirSync(dir).filter((f) => /^\d+-.+\.md$/.test(f) && !f.endsWith('.report.md'))) {
    for (const e of parseBatch(fs.readFileSync(path.join(dir, f), 'utf8')).entries) m.set(e.id, { entry: e, source: src.get(e.id), from: `pilot-en/${f}` });
  }
  return m;
}

// check.js-ийг ажиллуулж тайлангаас хуудас бүрийн алдааг уншина
async function checkDone(file) {
  const { spawnSync } = await import('node:child_process');
  const donePath = path.join(T, 'done', `${file}.md`);
  spawnSync(process.execPath, [path.join(HERE, 'check.js'), donePath], { encoding: 'utf8' });
  const rep = fs.readFileSync(donePath.replace(/\.md$/, '.report.md'), 'utf8');
  const errSec = rep.split(/^## Алдаа/m)[1]?.split(/^## Анхааруулга/m)[0] || '';
  const byId = new Map();
  const general = [];
  for (const l of errSec.split('\n')) {
    const m = l.match(/^- `([^`]+)` (.*)$/);
    // «Формат: 62-р мөр: tic-c13-93-ийн «@@@ END» мөр алга» → тухайн хуудасных
    const fm = l.match(/^- Формат: .*?(\S+)-ийн «@@@ END»/) || l.match(/^- Формат: .*?END (\S+) ≠ ENTRY/) || l.match(/^- Формат: (\S+): файлын төгсгөлд/);
    if (m) byId.set(m[1], [...(byId.get(m[1]) || []), m[2]]);
    else if (fm) byId.set(fm[1], [...(byId.get(fm[1]) || []), l.slice(2)]);
    else if (/^- /.test(l)) general.push(l.slice(2));
  }
  const warnings = (rep.split(/^## Анхааруулга/m)[1] || '').split('\n').filter((l) => /^- `/.test(l)).length;
  return { byId, general, warnings };
}

const SEO_ONLY = /^(seoDescription \d+ тэмдэгт|seoTitle \d+ тэмдэгт)/;

const shortenParams = (m, field, text, max) => ({
  model: MODELS[m].id,
  max_tokens: 1500,
  // Sonnet 5.5-д thinking-ийг унтраах арга нь between_tools (effort ≤ high); өмнө нь thinking 400 token-ийг бүгдийг идэж хоосон хариу өгч байв
  ...(m === 'sonnet' && { thinking: { type: 'between_tools' } }),
  output_config: { effort: 'low' },
  messages: [{
    role: 'user',
    content: `Shorten this ${field === 'seoTitle' ? 'SEO page title' : 'SEO meta description'} for a Mongolia travel guide to at most ${max} characters${field === 'seoDescription' ? ' (aim for 130–150)' : ''}. Keep the main keyword at the start, keep the meaning and every name as written, American English, no Cyrillic. Return only the new text, nothing else.\n\n${text}`,
  }],
});

async function cmdAll() {
  const m = modelKeys[0];
  const budget = Number(arg('--budget', 4.5));
  const hard = Number(arg('--hard', 4.9));
  const only = arg('--files')?.split(',');
  const files = fs.readdirSync(path.join(T, 'batches')).filter((f) => /^en-\d+\.md$/.test(f)).map((f) => f.replace(/\.md$/, '')).sort().filter((f) => !only || only.includes(f));
  const L = loadLedger();
  L.model = MODELS[m].id;
  const pilots = pilotTranslations();
  let stopped = null;

  const record = (file, kind, id, r) => {
    if (r.usage) L.spent += usd(m, r.usage);
    appendRaw(file, { id, kind, at: new Date().toISOString(), ...r });
  };
  const canSend = (estimate) => {
    if (L.spent >= budget) return `зарцуулалт $${L.spent.toFixed(3)} ≥ $${budget}`;
    if (L.spent + estimate > hard) return `дараагийн batch-ийн тооцоо ($${L.spent.toFixed(2)} + ≈$${estimate.toFixed(2)}) > $${hard}`;
    return null;
  };
  // Хуудасны дундаж зардал (одоогийн ажлаас; эхэндээ туршилтын $0.033)
  const perPage = () => {
    const n = Object.values(L.files).reduce((s, f) => s + (f.translated || 0), 0);
    return n > 10 ? L.spent / n : 0.04;
  };

  // Batch илгээх/үргэлжлүүлэх. reqs: [{ custom_id, params, meta }]
  async function runBatch(file, label, reqs) {
    let id = L.pending?.file === file && L.pending?.label === label ? L.pending.id : null;
    if (!id) {
      const b = await client.messages.batches.create({ requests: reqs.map(({ custom_id, params }) => ({ custom_id, params })) });
      id = b.id;
      L.pending = { file, label, id, meta: Object.fromEntries(reqs.map((r) => [r.custom_id, r.meta])) };
      L.batches.push({ at: new Date().toISOString(), file, label, id, requests: reqs.length });
      saveLedger(L);
      runLog(`${file} ${label}: batch ${id} (${reqs.length} хүсэлт) илгээв`);
    } else runLog(`${file} ${label}: өмнө илгээсэн batch ${id}-г үргэлжлүүлэв`);
    let b = await client.messages.batches.retrieve(id);
    let tick = 0;
    while (b.processing_status !== 'ended') {
      await new Promise((r) => setTimeout(r, 30_000));
      b = await client.messages.batches.retrieve(id);
      if (++tick % 10 === 0) runLog(`  ${id}: ok=${b.request_counts.succeeded} err=${b.request_counts.errored} үлдсэн ${b.request_counts.processing}`);
    }
    const res = await collect(id);
    const meta = L.pending.meta;
    for (const [cid, r] of res) {
      const k = meta[cid].kind;
      record(file, k, meta[cid].id, r.error ? { error: r.error } : { text: k === 'translate' ? pageOnly(r.text) : r.text, stop: r.stop, usage: r.usage, field: meta[cid].field });
    }
    L.pending = null;
    saveLedger(L);
    runLog(`  ${id} дууссан; нийт зарцуулалт $${L.spent.toFixed(3)}`);
    return res;
  }

  for (const file of files) {
    const pages = loadPages(file);
    const st = (L.files[file] ||= { pages: pages.length, translated: 0, reused: 0, status: 'эхлээгүй' });
    if (st.status === 'дууссан' && !(args.includes('--recheck') && st.errors)) continue;
    const done = existingTranslations();
    const raw = loadRaw(file);
    const good = (id) => raw.get(id)?.kind === 'translate' && raw.get(id).text && raw.get(id).stop === 'end_turn';

    // Ашиглах бэлэн орчуулга
    const reuse = new Map();
    for (const p of pages) {
      const d = done.get(p.id);
      if (d && d.from !== `done/${file}.md`) reuse.set(p.id, d.entry);
      const pl = pilots.get(p.id);
      if (!reuse.has(p.id) && pl?.source && serializeEntry(pl.source) === serializeEntry(p)) reuse.set(p.id, pl.entry);
    }
    // Энэ файлын done/-д аль хэдийн байгаа (өмнөх ажиллуулалтаас) хуудсыг raw-аас сэргээнэ — raw байхгүй бол done-оос
    const ownDone = new Map((done.size ? [...done].filter(([, v]) => v.from === `done/${file}.md`) : []).map(([k, v]) => [k, v.entry]));
    const todo = pages.filter((p) => !reuse.has(p.id) && !good(p.id) && !(ownDone.has(p.id) && !raw.has(p.id)));

    if (args.includes('--dry')) {
      console.log(`${file}: ${pages.length} хуудас, бэлэн ${reuse.size} (${[...reuse.keys()].join(',')}), орчуулах ${todo.length}`);
      continue;
    }
    if (todo.length) {
      const why = canSend(todo.length * perPage() * 1.3);
      if (why && !(L.pending?.file === file)) { stopped = `${file}: ${why}`; break; }
      await runBatch(file, 'translate', todo.map((p, i) => ({ custom_id: `t${i}`, params: params(m, p), meta: { kind: 'translate', id: p.id } })));
    }

    // Угсрах → шалгах → засах (2 давталт)
    const assemble = () => {
      const r = loadRaw(file);
      const parts = [];
      const missing = [];
      for (const p of pages) {
        if (reuse.has(p.id)) parts.push(serializeEntry(reuse.get(p.id)));
        else if (r.get(p.id)?.text && r.get(p.id).stop === 'end_turn') parts.push(ensureEnd(r.get(p.id).text, p.id));
        else if (ownDone.has(p.id)) parts.push(serializeEntry(ownDone.get(p.id)));
        else missing.push(p.id);
      }
      fs.mkdirSync(path.join(T, 'done'), { recursive: true });
      fs.writeFileSync(path.join(T, 'done', `${file}.md`), parts.join('\n\n') + '\n');
      return missing;
    };
    let missing = assemble();
    let chk = await checkDone(file);
    for (let round = 1; round <= 2; round++) {
      const shorten = [];
      const retrans = [];
      const r = loadRaw(file);
      for (const p of pages) {
        if (reuse.has(p.id)) continue;
        const errs = chk.byId.get(p.id) || [];
        if (missing.includes(p.id)) retrans.push({ p, errs: [`previous attempt failed: ${r.get(p.id)?.error || r.get(p.id)?.stop || 'no output'}`] });
        else if (errs.length && errs.every((e) => SEO_ONLY.test(e))) {
          const entry = parseBatch(r.get(p.id)?.text || '').entries[0];
          for (const e of errs) {
            const field = e.startsWith('seoTitle') ? 'seoTitle' : 'seoDescription';
            const f = entry?.fields.find((x) => x.id === field);
            if (f) shorten.push({ p, field, text: f.value, max: field === 'seoTitle' ? 60 : 155 });
          }
        } else if (errs.length) retrans.push({ p, errs });
      }
      if (!shorten.length && !retrans.length) break;
      const why = L.pending?.file === file ? null : canSend((retrans.length * perPage() + shorten.length * 0.001) * 1.3);
      if (why) { stopped = `${file} засвар: ${why}`; break; }
      const reqs = [
        ...shorten.map((s, i) => ({ custom_id: `s${i}`, params: shortenParams(m, s.field, s.text, s.max), meta: { kind: 'shorten', id: s.p.id, field: s.field } })),
        ...retrans.map((x, i) => {
          const pr = params(m, x.p);
          pr.max_tokens = 32000;
          pr.messages = [{ role: 'user', content: [
            { type: 'text', text: serializeEntry(x.p) },
            { type: 'text', text: `A previous translation of this page failed the automatic check:\n${x.errs.map((e) => `- ${e}`).join('\n')}\nTranslate the page again following all rules; output only the page.` },
          ] }];
          return { custom_id: `r${i}`, params: pr, meta: { kind: 'translate', id: x.p.id } };
        }),
      ];
      runLog(`${file} засвар ${round}: богиносгох ${shorten.length}, дахин орчуулах ${retrans.length}`);
      await runBatch(file, `fix${round}`, reqs);
      // Богиносгосон утгыг хуудсанд суулгана
      const r2 = loadRaw(file);
      const lines = fs.readFileSync(path.join(RAW, `${file}.jsonl`), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
      const lastShort = new Map();
      for (const x of lines) if (x.kind === 'shorten' && x.text) lastShort.set(`${x.id}|${x.field}`, x.text.trim().replace(/^"|"$/g, ''));
      for (const s of shorten) {
        const t = lastShort.get(`${s.p.id}|${s.field}`);
        const base = r2.get(s.p.id);
        if (!t || !base?.text) continue;
        const entry = parseBatch(base.text).entries[0];
        const f = entry.fields.find((x) => x.id === s.field);
        if (f && [...t].length <= s.max) f.value = t;
        appendRaw(file, { id: s.p.id, kind: 'translate', at: new Date().toISOString(), text: serializeEntry(entry), stop: 'end_turn', note: `${s.field} богиносгосон` });
      }
      missing = assemble();
      chk = await checkDone(file);
    }
    const rr = loadRaw(file);
    st.translated = pages.filter((p) => !reuse.has(p.id) && rr.has(p.id)).length;
    st.reused = reuse.size;
    st.missing = missing.length;
    st.errors = [...chk.byId.values()].reduce((s, e) => s + e.length, 0) + chk.general.length;
    st.errorPages = [...chk.byId.keys()];
    st.warnings = chk.warnings;
    st.status = stopped ? 'засвар дутуу' : 'дууссан';
    saveLedger(L);
    runLog(`${file}: ${pages.length} хуудас (шинэ ${st.translated}, бэлэн ${st.reused}), алдаа ${st.errors}, анхааруулга ${st.warnings}; нийт $${L.spent.toFixed(3)}`);
    if (stopped) break;
  }
  L.stoppedAt = stopped;
  saveLedger(L);
  runLog(stopped ? `ЗОГСОВ: ${stopped}` : 'Бүх багц дууссан');
}

if (cmd === 'count') await cmdCount();
else if (cmd === 'test') await cmdTest();
else if (cmd === 'run') await cmdRun();
else if (cmd === 'all') await cmdAll();
else if (cmd === 'collect') console.log([...(await collect(args[1])).entries()].map(([k, v]) => `${k}: ${v.error || v.stop}`).join('\n'));
else console.log('count | test | run | collect — файлын эхний тайлбарыг үз');

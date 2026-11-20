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
9. Use the glossary below exactly. Place names: use the given spelling (no diacritics: "Khuvsgul", "Uvurkhangai"); never translate the meaning of a proper name. Administrative unit сум is always "sum" (plural "sums"), never "soum". хийморь is "khiimori" — first mention "khiimori (a person's vital energy and good fortune)", never "wind horse".
10. First mention of a Mongolian term: add a short explanation in brackets as given in the glossary notes, e.g. "ovoo (sacred stone cairn)"; later mentions use the term alone.
11. ## headings: phrase them as natural questions travelers ask (e.g. "Where is Dadal sum?", "What is there to see in Dadal?", "How do I get to Dadal?"), keeping the meaning and order of the original heading. ### headings may stay descriptive.
12. "seoTitle": at most 60 characters, starts with the main keyword (e.g. "Dadal sum, Khentii: …"), no brand name. "seoDescription": 120–155 characters, one or two complete sentences with the main keyword.
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

if (cmd === 'count') await cmdCount();
else if (cmd === 'test') await cmdTest();
else if (cmd === 'run') await cmdRun();
else if (cmd === 'collect') console.log([...(await collect(args[1])).entries()].map(([k, v]) => `${k}: ${v.error || v.stop}`).join('\n'));
else console.log('count | test | run | collect — файлын эхний тайлбарыг үз');

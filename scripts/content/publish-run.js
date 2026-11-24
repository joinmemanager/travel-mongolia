// Нийтлэлт (2026-11): Commons asset → шалгалт → entry нийтлэх → revalidate.
// Тусдаа тоолуур: CMA_BUDGET_FILE=backups/cma-budget-publish-2026-11.txt CMA_BUDGET_MAX=2400 (2,500-аас 100 үлдэхэд зогсоно).
//   node scripts/content/publish-run.js assets      — commons-* asset-уудыг нийтэлнэ
//   node scripts/content/publish-run.js check       — entry-үүдийг шалгаж tmp/publish-2026-11/check.json бичнэ
//   node scripts/content/publish-run.js entries     — check.json-ийн тэнцсэн entry-үүдийг нийтэлнэ
//   node scripts/content/publish-run.js revalidate  — нийтэлсэн хуудсуудыг /api/revalidate-ээр шинэчилнэ (≤1/сек)
// Нууц утгууд (CMA token, revalidate secret) _cma.js-ийн ENV-ээс ачаалагдана, хэзээ ч хэвлэгдэхгүй.
const fs = require('fs');
const path = require('path');
const { cma, ENV, ROOT, sleep } = require('../tic/_cma');
const { parseCsv } = require('../tic/_csv');

const OUT = path.join(ROOT, 'tmp', 'publish-2026-11');
fs.mkdirSync(OUT, { recursive: true });
const BATCH = 50;
const PAUSE = 10000;
const ALLOWED = new Set(['body', 'description2', 'description', 'seoTitle', 'seoDescription', 'image']);
const FORBIDDEN = [/Эх сурвалж\s*:/i, /Буянбадрах/i, /Монгол орны лавлах/i];
const SITE = 'https://www.travelhubmongolia.com';

const log = (...a) => {
  const line = `${new Date().toISOString()} ${a.join(' ')}`;
  console.log(line);
  fs.appendFileSync(path.join(OUT, 'run.log'), line + '\n');
};
const budgetLeft = () => {
  const f = process.env.CMA_BUDGET_FILE;
  const n = f && fs.existsSync(f) ? Number(fs.readFileSync(f, 'utf8').trim() || 0) : 0;
  return 2500 - n;
};
const mn = (e, k) => {
  const v = e.fields?.[k];
  return v ? (v.mn !== undefined ? v.mn : undefined) : undefined;
};
const chunks = (a, n) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

async function bulkGet(kind, ids) {
  const res = [];
  for (const c of chunks(ids, 100)) {
    const r = await cma('GET', `/${kind}?sys.id[in]=${c.join(',')}&limit=100`);
    res.push(...(r?.items || []));
  }
  return new Map(res.map((x) => [x.sys.id, x]));
}

function richText(node, out = []) {
  if (!node) return out;
  if (node.nodeType === 'text') out.push(node.value || '');
  (node.content || []).forEach((c) => richText(c, out));
  return out;
}
function assetLinks(value, out = new Set()) {
  if (!value || typeof value !== 'object') return out;
  if (value.sys?.type === 'Link' && value.sys.linkType === 'Asset') out.add(value.sys.id);
  if (value.nodeType === 'embedded-asset-block' && value.data?.target?.sys?.id) out.add(value.data.target.sys.id);
  for (const v of Array.isArray(value) ? value : Object.values(value)) assetLinks(v, out);
  return out;
}
const isPublished = (x) => !!x?.sys?.publishedVersion && !x.sys.archivedVersion;
const hasDraft = (x) => !x.sys.publishedVersion || x.sys.version > x.sys.publishedVersion + 1;

async function publishBatches(kind, items, label) {
  const done = [];
  const failed = [];
  const parts = chunks(items, BATCH);
  for (let i = 0; i < parts.length; i++) {
    for (const it of parts[i]) {
      if (budgetLeft() <= 100) {
        log('ЗОГСОВ: тоолуурт 100 үлдсэн');
        return { done, failed, stopped: true };
      }
      try {
        const p = await cma('PUT', `/${kind}/${it.id}/published`, { version: it.version });
        done.push({ ...it, publishedVersion: p.sys.publishedVersion });
      } catch (err) {
        failed.push({ ...it, error: String(err.message).slice(0, 200) });
        log(label, it.id, 'АЛДАА', String(err.message).slice(0, 120));
      }
    }
    log(`${label}: багц ${i + 1}/${parts.length} дууслаа, нийт ${done.length}, тоолуурт үлдсэн ${budgetLeft()}`);
    if (i < parts.length - 1) await sleep(PAUSE);
  }
  return { done, failed, stopped: false };
}

async function phaseAssets() {
  const state = JSON.parse(fs.readFileSync(path.join(ROOT, 'tmp', 'soum-photos', 'c2-state.json'), 'utf8'));
  const ids = Object.values(state).map((o) => o.asset_id);
  const got = await bulkGet('assets', ids);
  const todo = [];
  const skipped = [];
  for (const id of ids) {
    const a = got.get(id);
    if (!a) skipped.push({ id, reason: 'asset олдсонгүй' });
    else if (!a.fields?.file?.mn?.url) skipped.push({ id, reason: 'файл боловсруулагдаагүй' });
    else if (isPublished(a) && !hasDraft(a)) skipped.push({ id, reason: 'аль хэдийн нийтлэгдсэн' });
    else todo.push({ id, version: a.sys.version });
  }
  log(`asset: нийт ${ids.length}, нийтлэх ${todo.length}, алгасах ${skipped.length}`);
  const r = await publishBatches('assets', todo, 'asset');
  fs.writeFileSync(path.join(OUT, 'assets.json'), JSON.stringify({ ...r, skipped }, null, 1));
}

function frontField(id) {
  const t = fs.readFileSync(path.join(ROOT, 'data', 'rewrites', `${id}.md`), 'utf8');
  return (t.match(/^field:\s*(\S+)/m) || [])[1];
}

async function phaseCheck() {
  const rows = parseCsv(fs.readFileSync(path.join(ROOT, 'docs', 'plan', 'rewrite-list.csv'), 'utf8'));
  const rewritten = rows.filter((r) => r['төлөв'] === 'дахин бичсэн (draft)');
  const excluded = [];
  const cand = [];
  for (const r of rewritten) {
    if (/ГАРААР ШАЛГАХ/.test(r['тэмдэглэл'])) excluded.push({ id: r.entry_id, row: r['эрэмбэ'], reason: 'шалгах тэмдэглэгээтэй' });
    else cand.push(r);
  }
  const emblemSrc = fs.readFileSync(path.join(ROOT, 'travel-mongolia', 'lib', 'soumEmblems.ts'), 'utf8');
  const emblemSoums = new Set((emblemSrc.match(/'(tic-[^']+)':/g) || []).map((s) => s.slice(1, -2)));
  const entries = await bulkGet('entries', cand.map((r) => r.entry_id));
  const allAssets = new Set();
  for (const e of entries.values()) assetLinks(e.fields, allAssets);
  const assets = await bulkGet('assets', [...allAssets]);
  const pass = [];
  const skip = [];
  for (const r of cand) {
    const id = r.entry_id;
    const e = entries.get(id);
    const why = [];
    if (!e) {
      skip.push({ id, row: r['эрэмбэ'], title: r['гарчиг'], reasons: ['entry олдсонгүй'] });
      continue;
    }
    if (e.sys.archivedVersion) why.push('архивлагдсан');
    if (e.sys.publishedVersion && !hasDraft(e)) why.push('өөрчлөлтгүй (аль хэдийн нийтлэгдсэн)');
    const st = mn(e, 'seoTitle');
    const sd = mn(e, 'seoDescription');
    if (!st) why.push('SEO title хоосон');
    else if ([...st].length > 60) why.push(`SEO title ${[...st].length} тэмдэгт`);
    if (!sd) why.push('SEO description хоосон');
    else if ([...sd].length > 155) why.push(`SEO description ${[...sd].length} тэмдэгт`);
    const field = frontField(id);
    const main = mn(e, field);
    const mainText = (typeof main === 'string' ? main : richText(main).join(' ')).trim();
    if (mainText.length < 20) why.push(`текст хоосон (${field})`);
    const allText = Object.keys(e.fields)
      .map((k) => mn(e, k))
      .map((v) => (typeof v === 'string' ? v : v && v.nodeType ? richText(v).join('\n') : ''))
      .join('\n');
    for (const re of FORBIDDEN) if (re.test(allText)) why.push(`хориотой мөр: ${re.source}`);
    const links = [...assetLinks(e.fields)];
    const bad = links.filter((a) => !isPublished(assets.get(a)));
    if (bad.length) why.push(`нийтлэгдээгүй asset: ${bad.join(', ')}`);
    const bakFile = path.join(ROOT, 'backups', 'rewrite-originals', `${id}.json`);
    const orig = JSON.parse(fs.readFileSync(bakFile, 'utf8'));
    const changed = Object.keys({ ...e.fields, ...orig.fields }).filter((k) => JSON.stringify(e.fields[k]) !== JSON.stringify(orig.fields[k]));
    const other = changed.filter((k) => !ALLOWED.has(k));
    if (other.length) why.push(`зөвшөөрөөгүй талбар өөрчлөгдсөн: ${other.join(', ')}`);
    if (emblemSoums.has(id) && changed.includes('image')) why.push('hero нь сүлдийг орлосон Commons зураг; сүлдний код production-д гараагүй');
    const item = { id, row: r['эрэмбэ'], title: r['гарчиг'], url: r['хаяг'], version: e.sys.version, contentType: e.sys.contentType.sys.id, slug: mn(e, 'slug') || null };
    if (why.length) skip.push({ ...item, reasons: why });
    else pass.push(item);
  }
  fs.writeFileSync(path.join(OUT, 'check.json'), JSON.stringify({ pass, skip, excluded }, null, 1));
  log(`шалгалт: дахин бичсэн ${rewritten.length}, шалгах тэмдэглэгээтэй хассан ${excluded.length}, тэнцсэн ${pass.length}, тэнцээгүй ${skip.length}, тоолуурт үлдсэн ${budgetLeft()}`);
}

async function phaseEntries() {
  const { pass } = JSON.parse(fs.readFileSync(path.join(OUT, 'check.json'), 'utf8'));
  const prevFile = path.join(OUT, 'entries.json');
  const prev = fs.existsSync(prevFile) ? JSON.parse(fs.readFileSync(prevFile, 'utf8')) : { done: [], failed: [] };
  const doneIds = new Set(prev.done.map((d) => d.id));
  const todo = pass.filter((p) => !doneIds.has(p.id));
  log(`entry: нийтлэх ${todo.length} (өмнө нь ${doneIds.size})`);
  const r = await publishBatches('entries', todo, 'entry');
  fs.writeFileSync(prevFile, JSON.stringify({ done: [...prev.done, ...r.done], failed: r.failed, stopped: r.stopped }, null, 1));
}

async function phaseRevalidate() {
  const secret = ENV.CONTENTFUL_REVALIDATE_SECRET;
  if (!secret) throw new Error('revalidate secret олдсонгүй');
  const { done } = JSON.parse(fs.readFileSync(path.join(OUT, 'entries.json'), 'utf8'));
  const results = [];
  for (const d of done) {
    const payload = { sys: { id: d.id, type: 'Entry', contentType: { sys: { id: d.contentType } } }, fields: d.slug ? { slug: { mn: d.slug } } : {} };
    let status = 0;
    try {
      const res = await fetch(`${SITE}/api/revalidate`, { method: 'POST', headers: { 'x-revalidate-secret': secret, 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      status = res.status;
    } catch (err) {
      status = 'fetch: ' + String(err.message).slice(0, 80);
    }
    results.push({ id: d.id, url: d.url, status });
    await sleep(1100);
  }
  const ok = results.filter((r) => r.status === 200).length;
  fs.writeFileSync(path.join(OUT, 'revalidate.json'), JSON.stringify(results, null, 1));
  log(`revalidate: ${ok}/${results.length} амжилттай (sitemap.xml хүсэлт бүрт тэмдэглэгдсэн)`);
}

const phase = process.argv[2];
({ assets: phaseAssets, check: phaseCheck, entries: phaseEntries, revalidate: phaseRevalidate }[phase] || (() => { throw new Error('phase: assets|check|entries|revalidate'); }))()
  .catch((e) => { log('АЛДАА:', String(e.message).slice(0, 300)); process.exit(1); });

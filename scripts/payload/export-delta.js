// Өмнөх бүрэн экспорт дээр зөвхөн түүнээс хойш өөрчлөгдсөн entry/asset-ийг нэмж шинэ экспорт хавтас үүсгэнэ
// (зөвхөн GET; ихэвчлэн 4 хүсэлт). Бүрэн экспортыг (export-contentful.js) дахин татахгүйн тулд.
//   node scripts/payload/export-delta.js [--base backups/contentful-export-2026-11-12] [--out backups/contentful-export-YYYY-MM-DD]
// Устгасан entry-г илрүүлэхгүй (12/1-ний эцсийн шилжилтэд бүрэн экспорт хийнэ).
const fs = require('fs');
const path = require('path');
const { latestExportDir, ROOT } = require('./lib/export');

const ENV_CANDIDATES = [
  path.join(ROOT, 'travel-mongolia', '.env.local'),
  path.resolve(ROOT, '..', 'teslatraders', 'travel-mongolia', '.env.local'),
];
function readEnv() {
  const file = ENV_CANDIDATES.find((f) => fs.existsSync(f));
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
  return env;
}

const args = process.argv.slice(2);
const argVal = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : undefined);
const BASE = path.resolve(ROOT, argVal('--base') || latestExportDir());
const OUT = path.resolve(ROOT, argVal('--out') || `backups/contentful-export-${new Date().toISOString().slice(0, 10)}`);
if (BASE === OUT) throw new Error('--out нь --base-ээс өөр байх ёстой');
if (fs.existsSync(path.join(OUT, 'meta.json'))) {
  console.log(`${OUT} аль хэдийн бий. Дахин татахгүй.`);
  process.exit(0);
}

const ENV = readEnv();
const CMA = `https://api.contentful.com/spaces/${ENV.CONTENTFUL_SPACE_ID}/environments/master`;
const CDA = `https://cdn.contentful.com/spaces/${ENV.CONTENTFUL_SPACE_ID}/environments/master`;
const log = [];
async function getAll(api, resource, since, extra = '') {
  const base = api === 'cma' ? CMA : CDA;
  const token = api === 'cma' ? ENV.CONTENTFUL_MANAGEMENT_TOKEN : ENV.CONTENTFUL_ACCESS_TOKEN;
  const items = [];
  for (let skip = 0; ; ) {
    const p = `/${resource}?limit=1000&skip=${skip}&order=sys.updatedAt&sys.updatedAt[gte]=${encodeURIComponent(since)}${extra}`;
    const res = await fetch(base + p, { headers: { Authorization: `Bearer ${token}` } });
    log.push({ api, path: p.replace(/\?.*/, '?…'), status: res.status, at: new Date().toISOString() });
    if (!res.ok) throw new Error(`${api} ${resource} → ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const data = await res.json();
    items.push(...data.items);
    skip += data.items.length;
    if (skip >= data.total || !data.items.length) break;
  }
  return items;
}

(async () => {
  const read = (f) => JSON.parse(fs.readFileSync(path.join(BASE, f), 'utf8'));
  const baseMeta = read('meta.json');
  const since = baseMeta.startedAt; // экспорт эхэлсэн мөчөөс (давхцал байж болно, id-аар солино)
  const merge = (list, fresh) => {
    const byId = new Map(list.map((x) => [x.sys.id, x]));
    for (const x of fresh) byId.set(x.sys.id, x);
    return [...byId.values()];
  };
  const files = {
    'entries.cma.json': await getAll('cma', 'entries', since),
    'assets.cma.json': await getAll('cma', 'assets', since),
    'entries.cda.json': await getAll('cda', 'entries', since, '&locale=*&include=0'),
    'assets.cda.json': await getAll('cda', 'assets', since, '&locale=*'),
  };
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of ['locales.json', 'content_types.json']) fs.copyFileSync(path.join(BASE, f), path.join(OUT, f));
  const counts = {};
  for (const [f, fresh] of Object.entries(files)) {
    const merged = merge(read(f), fresh);
    fs.writeFileSync(path.join(OUT, f), JSON.stringify(merged));
    counts[f] = { updated: fresh.length, total: merged.length };
  }
  const meta = {
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    deltaOf: path.basename(BASE),
    since,
    requests: log.length,
    requestsByApi: log.reduce((a, r) => ((a[r.api] = (a[r.api] || 0) + 1), a), {}),
    counts,
    log,
  };
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta));
  console.log(JSON.stringify({ ...meta, log: undefined }, null, 1));
})().catch((e) => {
  console.error(e.message);
  console.error('хүсэлт:', log.length);
  process.exit(1);
});

// Contentful-ийн бүх агуулгыг НЭГ УДАА уншиж локал JSON-д хадгална (зөвхөн GET, Contentful-д бичихгүй).
//
//   node scripts/payload/export-contentful.js [--out backups/contentful-export-YYYY-MM-DD] [--force]
//
// Юу татах:
//   CMA  locales, content_types                → бүтэц
//   CMA  entries, assets (1000/хуудас)         → хамгийн сүүлийн (ноорог) хувилбар + sys.version/publishedVersion/archivedVersion
//   CDA  entries, assets (locale=*, include=0) → нийтлэгдсэн хувилбар («changed» entry-ийн нийтлэгдсэн утга эндээс)
// Хүсэлт бүрийг тоолж meta.json-д бичнэ (тайланд орно). Хавтас аль хэдийн бүрэн бол дахин татахгүй (--force-гүй бол).
// Token-ийг .env.local-аас уншина, хэзээ ч хэвлэхгүй. Worktree-д .env.local байхгүй бол үндсэн checkout-ынхыг уншина.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const ENV_CANDIDATES = [
  path.join(ROOT, 'travel-mongolia', '.env.local'),
  path.resolve(ROOT, '..', 'teslatraders', 'travel-mongolia', '.env.local'),
];

function readEnv() {
  const file = ENV_CANDIDATES.find((f) => fs.existsSync(f));
  if (!file) throw new Error('.env.local олдсонгүй');
  const env = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^"|"$/g, '');
  }
  return env;
}

const args = process.argv.slice(2);
const argVal = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const today = new Date().toISOString().slice(0, 10);
const OUT = path.resolve(ROOT, argVal('--out') || `backups/contentful-export-${today}`);
const FORCE = args.includes('--force');

const ENV = readEnv();
const SPACE = ENV.CONTENTFUL_SPACE_ID;
const CMA_TOKEN = ENV.CONTENTFUL_MANAGEMENT_TOKEN;
const CDA_TOKEN = ENV.CONTENTFUL_ACCESS_TOKEN;
if (!SPACE || !CMA_TOKEN || !CDA_TOKEN) throw new Error('CONTENTFUL_SPACE_ID / MANAGEMENT_TOKEN / ACCESS_TOKEN дутуу');

const CMA = `https://api.contentful.com/spaces/${SPACE}/environments/master`;
const CDA = `https://cdn.contentful.com/spaces/${SPACE}/environments/master`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const log = []; // { api, path, status, items }
async function get(api, p) {
  const base = api === 'cma' ? CMA : CDA;
  const token = api === 'cma' ? CMA_TOKEN : CDA_TOKEN;
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(base + p, { headers: { Authorization: `Bearer ${token}` } });
    const text = await res.text();
    log.push({ api, path: p, status: res.status, at: new Date().toISOString() });
    if (res.status === 429) { await sleep(2000 * attempt); continue; }
    if (!res.ok) {
      const err = new Error(`${api.toUpperCase()} GET ${p} → ${res.status}: ${text.slice(0, 300)}`);
      err.status = res.status;
      err.body = text;
      throw err;
    }
    await sleep(250);
    return JSON.parse(text);
  }
  throw new Error(`${api} GET ${p}: 429 давтагдсан`);
}

// 1000-аар хуудаслана. «Response size too big» (400) бол тухайн хуудсыг хоёр хувааж дахин уншина.
async function getAll(api, resource, extra = '') {
  const items = [];
  let skip = 0;
  let limit = 1000;
  let total = Infinity;
  while (skip < total) {
    let data;
    try {
      data = await get(api, `/${resource}?limit=${limit}&skip=${skip}&order=sys.createdAt,sys.id${extra}`);
    } catch (err) {
      if (err.status === 400 && /size/i.test(err.body || '') && limit > 50) {
        limit = Math.floor(limit / 2);
        console.log(`  ${api} ${resource}: хариу хэт том → limit ${limit}`);
        continue;
      }
      throw err;
    }
    total = data.total;
    items.push(...data.items);
    skip += data.items.length;
    console.log(`  ${api} ${resource}: ${items.length}/${total}`);
    if (!data.items.length) break;
  }
  return items;
}

function write(name, data) {
  fs.writeFileSync(path.join(OUT, name), JSON.stringify(data));
}

(async () => {
  const metaFile = path.join(OUT, 'meta.json');
  if (fs.existsSync(metaFile) && !FORCE) {
    const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
    console.log(`Экспорт аль хэдийн бий (${meta.finishedAt}, ${meta.requests} хүсэлт). Дахин татахгүй. --force-оор албадна.`);
    return;
  }
  fs.mkdirSync(OUT, { recursive: true });
  const startedAt = new Date().toISOString();

  const locales = await get('cma', '/locales');
  write('locales.json', locales.items);
  const contentTypes = await get('cma', '/content_types?limit=1000');
  write('content_types.json', contentTypes.items);

  const entries = await getAll('cma', 'entries');
  write('entries.cma.json', entries);
  const assets = await getAll('cma', 'assets');
  write('assets.cma.json', assets);

  const pubEntries = await getAll('cda', 'entries', '&locale=*&include=0');
  write('entries.cda.json', pubEntries);
  const pubAssets = await getAll('cda', 'assets', '&locale=*');
  write('assets.cda.json', pubAssets);

  const status = (sys) =>
    sys.archivedVersion ? 'archived' : !sys.publishedVersion ? 'draft' : sys.version > sys.publishedVersion + 1 ? 'changed' : 'published';
  const byStatus = (list) => list.reduce((acc, e) => ((acc[status(e.sys)] = (acc[status(e.sys)] || 0) + 1), acc), {});

  const meta = {
    startedAt,
    finishedAt: new Date().toISOString(),
    space: '(нууц)',
    requests: log.length,
    requestsByApi: log.reduce((acc, r) => ((acc[r.api] = (acc[r.api] || 0) + 1), acc), {}),
    counts: {
      locales: locales.items.length,
      contentTypes: contentTypes.items.length,
      entries: entries.length,
      assets: assets.length,
      publishedEntries: pubEntries.length,
      publishedAssets: pubAssets.length,
      entriesByStatus: byStatus(entries),
      assetsByStatus: byStatus(assets),
    },
    log,
  };
  write('meta.json', meta);
  console.log(JSON.stringify({ ...meta, log: undefined }, null, 2));
})().catch((err) => {
  // Хагас экспортыг дахин ашиглахгүйн тулд meta.json бичихгүй. Хүсэлтийн тоог ч гэсэн хадгална.
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'failed-requests-log.json'), JSON.stringify(log, null, 1));
  console.error(err.message);
  process.exit(1);
});

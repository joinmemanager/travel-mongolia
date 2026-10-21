// 2026-10-21 «А3»: шалгасан TIC ажлыг Contentful-д нийтэлнэ (asset → entry → ангилал), 50-аар багцалж.
//   node scripts/tic/publish-today.js webhooks status|off|on   # webhook-ийн төлөв / түр унтраах / өмнөх төлөвт буцаах
//   node scripts/tic/publish-today.js step <1-5> [--dry]      # алхам бүрийг нийтэлнэ (idempotent: нийтлэгдсэнийг алгасна)
// Алхамууд:
//   1) «Хотын дурсгалт газрууд»: heritagePlace tic-c9-* → heritageCategory tic-heritage-city-monuments
//   2) 8 сум, аймгийн зураг/emblem, AI/Шангри-Ла зураг салгасан, 960px зураг тавьсан entry-үүд
//      (province, soum, destination, recommendation, cultureHeritage, heritagePlace-ийн хүлээгдэж буй өөрчлөлттэй нь)
//   3) 4-р багц: place (landscape) 209 + heritagePlace 241 → heritageCategory tic-heritage-historical-sites
//   4) 7-р багцын арга хэмжээ (event) 34. Буудал, бааз (localProvider)-ыг НИЙТЛЭХГҮЙ.
//   5) 8-р багц: мэдээ (story, topic = news) 616
// Алдаа: 3 удаа хүлээгээд дахин оролдоно; бүтээгүй нь backups/tic-cache/publish-today-errors.json-д.
// Webhook нь унтарсан үед л entry нийтэлнэ (2,000 гаруй revalidate/IndexNow дуудлага явуулахгүйн тулд).
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, sleep, callCount } = require('./_cma');

const CACHE = path.join(ROOT, 'backups', 'tic-cache');
const WH_STATE = path.join(CACHE, 'webhooks-before-publish.json');
const ERRORS = path.join(CACHE, 'publish-today-errors.json');
const LOG = path.join(CACHE, 'publish-today.json');
const DRY = process.argv.includes('--dry');
const BATCH = 50;
const CONCURRENCY = 4;
const json = (f) => JSON.parse(fs.readFileSync(path.join(CACHE, f), 'utf8'));

const isPublishedClean = (x) => !!x.sys.publishedVersion && x.sys.version === x.sys.publishedVersion + 1;
const hasPending = (x) => !x.sys.publishedVersion || x.sys.version > x.sys.publishedVersion + 1;

function assetIds(fields) {
  const ids = new Set();
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (n.sys?.type === 'Link' && n.sys.linkType === 'Asset') ids.add(n.sys.id);
    for (const v of Object.values(n)) walk(v);
  };
  walk(fields);
  return ids;
}

async function all(p) {
  const out = [];
  for (let skip = 0; ; skip += 200) {
    const res = await cma('GET', `${p}${p.includes('?') ? '&' : '?'}limit=200&skip=${skip}`);
    out.push(...res.items);
    if (skip + 200 >= res.total) break;
  }
  return out;
}
async function byIds(kind, ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 100) {
    const res = await cma('GET', `/${kind}?sys.id[in]=${ids.slice(i, i + 100).join(',')}&limit=100`);
    out.push(...res.items);
  }
  return out;
}

async function pool(items, fn) {
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < items.length) await fn(items[next++]);
  }));
}

const count = {};
const errors = [];
const bump = (k) => { count[k] = (count[k] || 0) + 1; };

async function publishOne(kind, id, label) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const cur = await cma('GET', `/${kind}/${id}`);
      if (!cur) { bump(`${label} алга`); errors.push({ kind, id, label, error: 'олдсонгүй' }); return; }
      if (isPublishedClean(cur)) return bump(`${label} аль хэдийн`);
      if (kind === 'assets' && !cur.fields?.file) { bump(`${label} файлгүй (алгасав)`); errors.push({ kind, id, label, error: 'файлгүй asset' }); return; }
      if (DRY) return bump(`${label} нийтлэх`);
      await cma('PUT', `/${kind}/${id}/published`, { version: cur.sys.version });
      return bump(`${label} нийтлэв`);
    } catch (e) {
      if (attempt === 3) {
        bump(`${label} АЛДАА`);
        errors.push({ kind, id, label, error: e.message.slice(0, 400) });
        console.log('  алдаа', kind, id, e.message.slice(0, 200));
      } else await sleep(3000 * attempt);
    }
  }
}

// asset-уудыг эхэлж, дараа нь entry-г 50-аар
async function publishSet(entries, label) {
  const assets = new Set();
  for (const e of entries) for (const id of assetIds(e.fields)) assets.add(id);
  const a = [...assets];
  console.log(`${label}: entry ${entries.length}, asset ${a.length}${DRY ? ' (dry)' : ''}`);
  for (let i = 0; i < a.length; i += BATCH) await pool(a.slice(i, i + BATCH), (id) => publishOne('assets', id, 'asset'));
  for (let i = 0; i < entries.length; i += BATCH) {
    await pool(entries.slice(i, i + BATCH), (e) => publishOne('entries', e.sys.id, e.sys.contentType.sys.id));
    process.stdout.write(`  ${Math.min(i + BATCH, entries.length)}/${entries.length}\r`);
  }
  process.stdout.write('\n');
}

async function webhookGuard() {
  if (DRY) return;
  const hooks = (await cma('GET', '/webhook_definitions?limit=100', { spaceLevel: true })).items;
  const on = hooks.filter((h) => h.active);
  if (on.length) throw new Error(`Webhook идэвхтэй байна (${on.map((h) => h.name).join(', ')}). Эхлээд «webhooks off».`);
}

async function webhooks(cmd) {
  const hooks = (await cma('GET', '/webhook_definitions?limit=100', { spaceLevel: true })).items;
  if (cmd === 'status') {
    for (const h of hooks) console.log(`${h.sys.id} «${h.name}» active=${h.active} ${h.url} [${h.topics.join(', ')}]`);
    return;
  }
  if (cmd === 'off') {
    // Анхны төлөвийг нэг л удаа хадгална (дахин ажиллуулахад дарж бичихгүй)
    if (!fs.existsSync(WH_STATE)) fs.writeFileSync(WH_STATE, JSON.stringify(hooks.map((h) => ({ id: h.sys.id, name: h.name, active: h.active })), null, 2));
    for (const h of hooks.filter((x) => x.active)) {
      const { name, url, topics, filters, headers, transformation } = h;
      await cma('PUT', `/webhook_definitions/${h.sys.id}`, { spaceLevel: true, version: h.sys.version, body: { name, url, topics, filters, headers, transformation, active: false } });
      console.log(`унтраав: «${h.name}»`);
    }
    return;
  }
  if (cmd === 'on') {
    const before = JSON.parse(fs.readFileSync(WH_STATE, 'utf8'));
    for (const b of before) {
      const h = hooks.find((x) => x.sys.id === b.id);
      if (!h) { console.log('webhook олдсонгүй', b.id); continue; }
      if (h.active === b.active) { console.log(`«${h.name}» active=${h.active} (өмнөхтэй ижил)`); continue; }
      const { name, url, topics, filters, headers, transformation } = h;
      await cma('PUT', `/webhook_definitions/${h.sys.id}`, { spaceLevel: true, version: h.sys.version, body: { name, url, topics, filters, headers, transformation, active: b.active } });
      console.log(`сэргээв: «${h.name}» active=${b.active}`);
    }
    const after = (await cma('GET', '/webhook_definitions?limit=100', { spaceLevel: true })).items;
    for (const b of before) console.log(`шалгалт: «${b.name}» өмнө ${b.active}, одоо ${after.find((x) => x.sys.id === b.id)?.active}`);
  }
}

const STEPS = {
  async 1() {
    const places = (await all('/entries?content_type=heritagePlace')).filter((e) => e.sys.id.startsWith('tic-c9-'));
    const cat = await cma('GET', '/entries/tic-heritage-city-monuments');
    const linked = new Set((fv(cat, 'places') || []).map((l) => l.sys.id));
    const inCat = places.filter((p) => linked.has(p.sys.id));
    console.log(`ангилалд холбогдсон ${linked.size}, tic-c9 heritagePlace ${places.length} (ангилалд ${inCat.length})`);
    await publishSet(places, 'хотын дурсгалт газар');
    await publishSet([cat], 'ангилал');
  },
  async 2() {
    const ids = new Set();
    for (const s of json('missing-soums-result.json')) ids.add(s.id);
    const photos = json('aimag-photos-result.json');
    for (const p of photos.placed) ids.add(p.entry);
    for (const d of photos.detached) { const id = d.entry.split(' ')[1]; if (!/^[a-z-]+$/.test(id)) ids.add(id); }
    for (const id of ['6tDLtOe6nWOzZDT0sdGMd', '3t2W7uicg4pU7wXuhVuE4M', '7k1ezXLz9V1IM1rJDumXTi', '1ciXvnhrbkitFPRJkd7J28', '3Rt7pnt87NLThFVsRS7DoU']) ids.add(id);
    // Аймгийн бүх entry-ийн хүлээгдэж буй өөрчлөлт (зураг, emblem; Улаанбаатар slug-аар бүртгэгдсэн)
    for (const p of await all('/entries?content_type=province')) if (hasPending(p)) ids.add(p.sys.id);
    // AI зураг салгасан наадмын recommendation-ууд
    for (const r of await all('/entries?content_type=recommendation')) {
      if (hasPending(r) && r.sys.publishedVersion && /наадам/i.test(fv(r, 'title') || '')) ids.add(r.sys.id);
    }
    const entries = (await byIds('entries', [...ids])).filter((e) => !String(fv(e, 'title') || fv(e, 'name') || '').startsWith('[ЖИШЭЭ]'));
    const types = {};
    for (const e of entries) types[e.sys.contentType.sys.id] = (types[e.sys.contentType.sys.id] || 0) + 1;
    console.log('төрлөөр', types, 'хүлээгдэж буй', entries.filter(hasPending).length);
    for (const e of entries.filter(hasPending)) console.log(`  ${e.sys.contentType.sys.id} ${e.sys.id} «${fv(e, 'title') || fv(e, 'name')}»`);
    await publishSet(entries, '8 сум, аймаг, зураг');
  },
  async 3() {
    const r = json('batch04-result.json').entries.filter((e) => e.id && !e.existing);
    const entries = await byIds('entries', r.map((e) => e.id));
    await publishSet(entries, '4-р багц');
    await publishSet([await cma('GET', '/entries/tic-heritage-historical-sites')], 'ангилал');
  },
  async 4() {
    const r = json('batch07-result.json').entries.filter((e) => e.type === 'event');
    await publishSet(await byIds('entries', r.map((e) => e.id)), 'арга хэмжээ');
  },
  async 5() {
    const r = json('batch08-result.json').entries;
    await publishSet(await byIds('entries', r.map((e) => e.id)), 'мэдээ');
  },
};

(async () => {
  const [cmd, arg] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  if (cmd === 'webhooks') return webhooks(arg);
  if (cmd !== 'step' || !STEPS[arg]) throw new Error('хэрэглээ: webhooks status|off|on | step <1-5> [--dry]');
  await webhookGuard();
  await STEPS[arg]();
  console.log(count, `CMA ${callCount()}`);
  if (!DRY) {
    const log = fs.existsSync(LOG) ? JSON.parse(fs.readFileSync(LOG, 'utf8')) : {};
    log[`step${arg}`] = { at: new Date().toISOString(), count };
    fs.writeFileSync(LOG, JSON.stringify(log, null, 2));
    const prev = fs.existsSync(ERRORS) ? JSON.parse(fs.readFileSync(ERRORS, 'utf8')) : {};
    prev[`step${arg}`] = errors;
    fs.writeFileSync(ERRORS, JSON.stringify(prev, null, 2));
  }
})().catch((e) => { console.error(e.message); process.exit(1); });

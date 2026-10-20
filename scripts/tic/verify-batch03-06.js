// TIC 3, 5, 6-р сэдвийн production шалгалт:
//  1. Сэдэв бүрээс санамсаргүй 10 (нийт 30) шинэ хуудас: 200, robots index+follow, canonical = өөрийн хаяг, sitemap-д бий.
//     (80-аас доош үгтэй нимгэн хуудас зориуд noindex тул түүврээс хасна.)
//  2. docs/redirects/batch-03/05/06 хүснэгтийн new_url бүр 200 (#anchor-гүй хаягаар).
//  3. Sitemap-ийн lastmod = Contentful (CDA) sys.updatedAt (TIC entry-ийн түүвэр).
//   node scripts/tic/verify-batch03-06.js
const fs = require('fs');
const path = require('path');
const { ENV, ROOT } = require('./_cma');
const { parseCsv } = require('./_csv');

const SITE = 'https://www.travelhubmongolia.com';
const sample = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const get = (url) => fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'TravelHubVerify/1.0' } });

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); }));
}

(async () => {
  const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const lastmod = new Map([...sitemap.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g)].map((m) => [m[1], m[2]]));
  console.log(`sitemap: ${lastmod.size} URL`);

  // 1. Санамсаргүй 30 хуудас
  let fails = 0;
  for (const topic of [3, 5, 6]) {
    const r = JSON.parse(fs.readFileSync(path.join(ROOT, 'backups', 'tic-cache', `batch03-06-topic${topic}-result.json`), 'utf8'));
    const pages = r.entries.filter((e) => !e.existing && e.ownPage !== false && e.words >= 80 && e.path && !e.path.includes('#'));
    console.log(`\nСэдэв ${topic} (индекслэгдэх ${pages.length} хуудаснаас 10):`);
    for (const e of sample(pages, 10)) {
      const url = SITE + e.path;
      const res = await get(url);
      const html = await res.text();
      const robots = /<meta name="robots" content="([^"]+)"/.exec(html)?.[1] || '(байхгүй = index, follow)';
      const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
      const ok = res.status === 200 && !/noindex|nofollow/.test(robots) && canonical === url && lastmod.has(url);
      if (!ok) fails++;
      console.log(`  ${ok ? 'OK ' : 'ALD'} ${res.status} ${e.path} | robots: ${robots} | canonical: ${canonical === url ? 'өөрийн' : canonical} | sitemap: ${lastmod.has(url) ? 'бий' : 'АЛГА'}`);
    }
  }

  // 2. Redirect хүснэгтийн шинэ хаяг
  const urls = new Set();
  let rows = 0;
  for (const f of ['batch-03-protected.csv', 'batch-05-nature.csv', 'batch-06-culture.csv']) {
    const list = parseCsv(fs.readFileSync(path.join(ROOT, 'docs', 'redirects', f), 'utf8'));
    rows += list.length;
    for (const x of list) urls.add(x.new_url.split('#')[0]);
  }
  const bad = [];
  await pool([...urls], 6, async (u) => {
    const res = await get(u);
    await res.arrayBuffer();
    if (res.status !== 200) bad.push(`${res.status} ${u}`);
  });
  console.log(`\nRedirect: ${rows} мөр, ${urls.size} өвөрмөц шинэ хаяг, 200 биш: ${bad.length}`);
  bad.forEach((b) => console.log('  ', b));

  // 3. lastmod ↔ CDA sys.updatedAt
  const SELECT = { place: 'sys.updatedAt,fields.slug,fields.category', species: 'sys.updatedAt,fields.slug,fields.group,fields.ownPage' };
  const cda = async (type) =>
    (await (await fetch(`https://cdn.contentful.com/spaces/${ENV.CONTENTFUL_SPACE_ID}/environments/master/entries?content_type=${type}&limit=1000&select=${SELECT[type]}`, {
      headers: { Authorization: `Bearer ${ENV.CONTENTFUL_ACCESS_TOKEN}` },
    })).json()).items;
  const placeBase = (c) => (['museum', 'theatre', 'culture-center'].includes(c) ? '/things-to-do/museums' : c === 'sanatorium' ? '/things-to-do/wellness' : '/destination/protected');
  const sec = { mammal: 'wildlife', invertebrate: 'wildlife', fish: 'wildlife', reptile: 'wildlife', bird: 'birds', plant: 'plants' };
  const pairs = [
    ...(await cda('place')).map((e) => [`${SITE}${placeBase(e.fields.category)}/${e.fields.slug}`, e.sys.updatedAt]),
    ...(await cda('species')).filter((e) => e.fields.ownPage).map((e) => [`${SITE}/about/nature/${sec[e.fields.group]}/${e.fields.slug}`, e.sys.updatedAt]),
  ].filter(([u]) => lastmod.has(u));
  const mismatch = pairs.filter(([u, t]) => lastmod.get(u) !== t);
  console.log(`\nlastmod: sitemap-д байгаа ${pairs.length} TIC хуудаснаас Contentful sys.updatedAt-тай таараагүй: ${mismatch.length}`);
  mismatch.slice(0, 5).forEach(([u, t]) => console.log('  ', u, lastmod.get(u), '≠', t));
  console.log(`\nТүүврийн алдаа: ${fails}`);
})().catch((e) => { console.error(e); process.exit(1); });

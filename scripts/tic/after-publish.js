// А3-ын нийтлэлтийн дараах ажлууд (webhook унтарсан үед нийтэлсэн тул гараар):
//   node scripts/tic/after-publish.js revalidate   # /api/revalidate → бүх сайт (layout) нэг удаа
//   node scripts/tic/after-publish.js indexnow [--dry]  # шинээр нийтлэгдсэн, sitemap-д орсон URL-уудыг НЭГ хүсэлтээр
//   node scripts/tic/after-publish.js check        # sitemap тоо, жишээ хуудас 200/index/canonical, redirect new_url-ууд
// Нууц (CONTENTFUL_REVALIDATE_SECRET) .env.local-аас уншина, хэвлэхгүй.
const fs = require('fs');
const path = require('path');
const { ENV, ROOT } = require('./_cma');
const { parseCsv } = require('./_csv');

const SITE = 'https://www.travelhubmongolia.com';
const CACHE = path.join(ROOT, 'backups', 'tic-cache');
const INDEXNOW_KEY = 'dcea2c855862a6fe6bba7a250c8920c3';
const json = (f) => JSON.parse(fs.readFileSync(path.join(CACHE, f), 'utf8'));

async function sitemapUrls() {
  const xml = await (await fetch(`${SITE}/sitemap.xml`, { cache: 'no-store' })).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

// Өнөөдөр нийтэлсэн entry-үүдийн хаяг
function newPaths() {
  const p = new Set(['/destination/heritage/city-monuments', '/destination/heritage/historical-sites', '/stories/news', '/destination/landscapes']);
  for (const e of json('batch04-result.json').entries) if (e.id && !e.existing) p.add(e.path);
  for (const e of json('batch07-result.json').entries) if (e.type === 'event') p.add(e.path);
  for (const e of json('batch08-result.json').entries) p.add(e.path);
  for (const s of json('missing-soums-result.json')) p.add(s.path.split('#')[0]);
  for (const x of json('aimag-photos-result.json').placed) p.add(x.path);
  for (const s of ['dornogov', 'khentii', 'khovd', 'khuvsgul', 'orkhon', 'selenge', 'sukhbaatar', 'uvs', 'zavkhan']) p.add(`/province/${s}`);
  return [...p];
}

async function revalidate() {
  const res = await fetch(`${SITE}/api/revalidate`, {
    method: 'POST',
    headers: { 'x-revalidate-secret': ENV.CONTENTFUL_REVALIDATE_SECRET, 'content-type': 'application/json' },
    // Мэдэгдэхгүй төрөл → бүх сайтыг (layout) тэмдэглэнэ; IndexNow илгээхгүй (entryUrls хоосон)
    body: JSON.stringify({ sys: { type: 'Entry', id: 'bulk-publish-2026-10-21', contentType: { sys: { id: 'bulkPublish' } } } }),
  });
  console.log(res.status, await res.text());
}

async function indexnow(dry) {
  const inMap = new Set(await sitemapUrls());
  const urls = newPaths().map((p) => SITE + p).filter((u) => inMap.has(u));
  console.log(`шинэ хаяг ${newPaths().length}, sitemap-д орсон (index) ${urls.length}`);
  fs.writeFileSync(path.join(CACHE, 'indexnow-2026-10-21.txt'), urls.join('\n'));
  if (dry) return;
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: 'www.travelhubmongolia.com', key: INDEXNOW_KEY, keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`, urlList: urls.slice(0, 10000) }),
  });
  console.log('IndexNow', res.status, (await res.text()).slice(0, 200));
}

async function page(p) {
  const res = await fetch(SITE + encodeURI(p), { redirect: 'manual', cache: 'no-store' });
  const html = res.status === 200 ? await res.text() : '';
  const robots = /<meta name="robots" content="([^"]*)"/.exec(html)?.[1] || '';
  const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1] || '';
  return { status: res.status, robots, canonical, html, location: res.headers.get('location') };
}

async function pool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) await fn(items[i++]); }));
}

async function check() {
  const urls = await sitemapUrls();
  console.log('sitemap URL', urls.length);
  const cm = await page('/destination/heritage/city-monuments');
  console.log('city-monuments', cm.status, /Нийт\s*0\s*газар/.test(cm.html) ? 'ХООСОН' : 'хоосон биш', (cm.html.match(/heritage\/place\//g) || []).length, 'холбоос');
  const news = await page('/stories/news');
  console.log('/stories/news', news.status, news.robots, (news.html.match(/\/stories\/news\//g) || []).length, 'холбоос');
  const b4 = json('batch04-result.json').entries.filter((e) => e.id && !e.existing);
  const sample = [
    ...b4.filter((e) => e.kind === 'landscape').slice(0, 3).map((e) => e.path),
    ...b4.filter((e) => e.kind !== 'landscape').slice(0, 3).map((e) => e.path),
    ...json('batch07-result.json').entries.filter((e) => e.type === 'event').slice(0, 2).map((e) => e.path),
    ...json('batch08-result.json').entries.slice(0, 2).map((e) => e.path),
  ];
  for (const p of sample) {
    const r = await page(p);
    const okCanon = r.canonical === SITE + p || decodeURI(r.canonical) === SITE + p;
    console.log(`${r.status} ${r.robots.includes('noindex') ? 'NOINDEX' : 'index'} canonical ${okCanon ? 'OK' : r.canonical} ${p}`);
  }
  // Redirect хүснэгтийн new_url бүр 200 ба index эсэх
  const dir = path.join(ROOT, 'docs', 'redirects');
  const targets = new Set();
  for (const f of ['batch-04-places.csv', 'batch-07-events-camps-hotels.csv', 'batch-08-news.csv', 'batch-09-listing-pages.csv']) {
    for (const r of parseCsv(fs.readFileSync(path.join(dir, f), 'utf8'))) targets.add(r.new_url.replace(SITE, '').split('#')[0] || '/');
  }
  const bad = [];
  await pool([...targets], 6, async (p) => {
    const r = await page(p);
    if (r.status !== 200 || r.robots.includes('noindex')) bad.push(`${r.status} ${r.robots} ${p}${r.location ? ' → ' + r.location : ''}`);
  });
  console.log(`redirect new_url: ${targets.size} шалгав, асуудалтай ${bad.length}`);
  bad.forEach((b) => console.log('  ', b));
  fs.writeFileSync(path.join(CACHE, 'after-publish-check.json'), JSON.stringify({ sitemap: urls.length, bad }, null, 2));
}

(async () => {
  const [cmd] = process.argv.slice(2);
  if (cmd === 'revalidate') return revalidate();
  if (cmd === 'indexnow') return indexnow(process.argv.includes('--dry'));
  if (cmd === 'check') return check();
  throw new Error('хэрэглээ: revalidate | indexnow [--dry] | check');
})().catch((e) => { console.error(e.message); process.exit(1); });

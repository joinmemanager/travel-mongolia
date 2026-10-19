// Sitemap-ийн бүх URL болон цэсний бүх хуудсыг шалгана: HTTP код, robots meta, canonical.
// Алдаа гэж тооцох нь: noindex, canonical нь өөр хаяг руу (ялангуяа нүүр хуудас руу) заасан.
//   node scripts/seo/indexing-audit.js [https://www.travelhubmongolia.com] [нэмэлт/зам ...]
// Хүсэлт бүрийн хооронд 150 мс хүлээнэ.
const fs = require('fs');
const path = require('path');

const BASE = (process.argv[2] || 'https://www.travelhubmongolia.com').replace(/\/$/, '');
const EXTRA = process.argv.slice(3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function navPaths() {
  const src = fs.readFileSync(path.join(__dirname, '..', '..', 'travel-mongolia', 'lib', 'navigation.ts'), 'utf8');
  return [...new Set([...src.matchAll(/['"](\/[a-z0-9\-/]*)(?:[?#][^'"]*)?['"]/g)].map((m) => m[1]))];
}

async function sitemapPaths() {
  const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
}

const norm = (u) => u.replace(/\/$/, '') || '/';

(async () => {
  const fromSitemap = await sitemapPaths();
  const all = [...new Set([...fromSitemap, ...navPaths(), ...EXTRA])];
  const bad = [];
  for (const p of all) {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    let row = { path: p, status: res.status, inSitemap: fromSitemap.includes(p) };
    if (res.status >= 300 && res.status < 400) row.location = res.headers.get('location');
    else if (res.status === 200) {
      const html = await res.text();
      const head = html.slice(0, html.indexOf('</head>') + 7);
      row.robots = /<meta name="robots" content="([^"]*)"/.exec(head)?.[1] || '';
      row.canonical = /<link rel="canonical" href="([^"]*)"/.exec(head)?.[1] || '';
      const own = norm(BASE + p);
      row.noindex = /noindex/.test(row.robots);
      row.canonicalHome = norm(row.canonical) === norm(BASE);
      row.canonicalWrong = row.canonical && norm(row.canonical) !== own;
    }
    if (row.noindex || row.canonicalWrong || (row.inSitemap && row.status !== 200)) bad.push(row);
    await sleep(150);
  }
  console.log(`шалгасан: ${all.length} (sitemap ${fromSitemap.length})`);
  for (const r of bad) {
    console.log(
      `${r.status} ${r.path}${r.inSitemap ? ' [sitemap]' : ''}${r.noindex ? ` robots=«${r.robots}»` : ''}${r.canonicalWrong ? ` canonical=${r.canonical}${r.canonicalHome ? ' (НҮҮР)' : ''}` : ''}${r.location ? ` → ${r.location}` : ''}`
    );
  }
  console.log(`асуудалтай: ${bad.length}`);
})().catch((e) => { console.error(e); process.exit(1); });

// TIC 4, 7, 8-р багц + 8 сум + аймгийн зургийн шалгалт (Draft-ыг харуулдаг орчинд: local dev = Preview API).
//   node scripts/tic/verify-batch04-08.js http://localhost:3123
// Хуудас бүрт: HTTP 200, H1 яг нэг, canonical = өөрийн production хаяг, robots-д noindex БИШ,
// BreadcrumbList JSON-LD, зураг ачаалагдана (эхний <img>/og:image-ийн хаяг 200).
// Мөн /sitemap.xml-д Draft хуудас (4, 7, 8-р багцын шинэ хаяг) ороогүйг шалгана.
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./_cma');

const BASE = (process.argv[2] || 'http://localhost:3123').replace(/\/$/, '');
const SITE = 'https://www.travelhubmongolia.com';
const R = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'backups', 'tic-cache', f), 'utf8'));
const pick = (arr, n, seed = 7) => {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a.slice(0, n);
};

(async () => {
  const b4 = R('batch04-result.json').entries.filter((e) => !e.existing && e.words >= 80);
  const soums = R('missing-soums-result.json').filter((s) => s.ownPage);
  const b7 = fs.existsSync(path.join(ROOT, 'backups', 'tic-cache', 'batch07-result.json')) ? R('batch07-result.json').entries.filter((e) => e.type === 'event' && e.words >= 80) : [];
  const b8 = fs.existsSync(path.join(ROOT, 'backups', 'tic-cache', 'batch08-result.json')) ? R('batch08-result.json').entries.filter((e) => e.words >= 80) : [];
  const pages = [
    ...pick(b4.filter((e) => e.kind === 'landscape'), 2).map((e) => e.path),
    ...pick(b4.filter((e) => e.kind === 'heritage'), 2).map((e) => e.path),
    ...pick(soums, 2).map((s) => s.path),
    '/province/bayankhongor', // 8 сумын жагсаалт + шинэ hero
    ...pick(b7, 1).map((e) => e.path),
    ...pick(b8, 1).map((e) => e.path),
    '/destination/sukhbaataryn-talbai', // шинэ зураг
  ].slice(0, 10);

  let fails = 0;
  const rows = [];
  for (const p of pages) {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    const html = await res.text();
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
    const robots = /<meta name="robots" content="([^"]+)"/.exec(html)?.[1] || '';
    const crumbs = /"@type":"BreadcrumbList"/.test(html);
    const img = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1] || /<img[^>]+src="([^"]+)"/.exec(html)?.[1];
    let imgOk = false;
    if (img) {
      const u = img.startsWith('/') ? BASE + img.replace(/&amp;/g, '&') : img.replace(/&amp;/g, '&');
      try { imgOk = (await fetch(u, { method: 'GET' })).ok; } catch { imgOk = false; }
    }
    const ok = res.status === 200 && h1 === 1 && canonical === SITE + p && !/noindex/.test(robots) && crumbs && imgOk;
    if (!ok) fails++;
    rows.push({ p, status: res.status, h1, canonical: canonical === SITE + p ? 'өөрийн' : canonical, robots: robots || '(index)', crumbs, imgOk, ok });
    console.log(`${ok ? 'OK ' : 'ALD'} ${res.status} ${p} | H1 ${h1} | canonical ${canonical === SITE + p ? 'өөрийн' : canonical} | robots ${robots || '(index)'} | Breadcrumb ${crumbs ? 'бий' : 'АЛГА'} | зураг ${imgOk ? 'OK' : 'АЛГА'}`);
  }

  // Sitemap: Draft хуудас орох ёсгүй. Local (Preview API) дээр draft-ууд CDA-д байхгүй тул production sitemap-ийг шалгана.
  const sm = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const urls = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  const newPaths = [...b4.map((e) => e.path), ...soums.map((s) => s.path), ...b7.map((e) => e.path), ...b8.map((e) => e.path)];
  const leaked = newPaths.filter((p) => urls.has(SITE + p));
  console.log(`\nproduction sitemap: ${urls.size} URL, Draft шинэ хаягаас орсон: ${leaked.length}`);
  leaked.slice(0, 10).forEach((p) => console.log('  ', p));
  fs.writeFileSync(path.join(ROOT, 'backups', 'tic-cache', 'verify-batch04-08.json'), JSON.stringify({ base: BASE, rows, sitemap: { total: urls.size, leaked } }, null, 2));
  console.log(`\nАлдаа: ${fails}/${pages.length}`);
})().catch((e) => { console.error(e); process.exit(1); });

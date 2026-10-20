// TIC 1б багцыг production дээр шалгана (зөвхөн GET, хүсэлт бүрийн хооронд 300 мс):
//  1. 20 аймаг + Улаанбаатарын хуудсанд Contentful-ийн бүх сум (id="<slug>" анкер) байгаа эсэх
//  2. Тусдаа хуудастай сум бүр: 200, robots-д noindex/nofollow байхгүй, canonical = өөрийн хаяг, sitemap-д бий
//  3. docs/redirects/batch-01b-soums.csv-ийн new_url бүр 200, anchor-той бол тэр id HTML-д бий
//   node scripts/tic/verify-batch01b.js [https://www.travelhubmongolia.com]
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT } = require('./_cma');
const { parseCsv } = require('./_csv');

const SITE = process.argv[2] || 'https://www.travelhubmongolia.com';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pages = new Map();

// Хуудсыг нэг л удаа татна (redirect дагахгүй: 200 байх ёстой)
async function get(p) {
  if (!pages.has(p)) {
    const res = await fetch(SITE + p, { redirect: 'manual', headers: { 'User-Agent': 'TravelHubVerify/1.0' } });
    pages.set(p, { status: res.status, html: res.status === 200 ? await res.text() : '' });
    await sleep(300);
  }
  return pages.get(p);
}

const metaContent = (html, name) => new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]*)"`, 'i').exec(html)?.[1] || '';
const canonical = (html) => /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i.exec(html)?.[1] || '';

(async () => {
  const problems = [];
  const provinces = (await cma('GET', '/entries?content_type=province&limit=200')).items;
  const soums = (await cma('GET', '/entries?content_type=soum&limit=1000')).items;
  const slugOf = Object.fromEntries(provinces.map((p) => [p.sys.id, fv(p, 'slug')]));
  const batch = soums.filter((s) => slugOf[fv(s, 'province').sys.id] !== 'arkhangai');

  // 1. Аймгийн хуудсууд
  const byProvince = {};
  for (const s of batch) (byProvince[slugOf[fv(s, 'province').sys.id]] ||= []).push(s);
  for (const [slug, list] of Object.entries(byProvince).sort()) {
    const { status, html } = await get(`/province/${slug}`);
    const missing = list.filter((s) => !html.includes(`id="${fv(s, 'slug')}"`)).map((s) => fv(s, 'title'));
    console.log(`/province/${slug}: ${status}, сум ${list.length - missing.length}/${list.length}`);
    if (status !== 200 || missing.length) problems.push(`/province/${slug}: ${status}, дутуу: ${missing.join(', ')}`);
  }

  // 2. Тусдаа хуудсууд
  const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const own = batch.filter((s) => fv(s, 'ownPage') === true);
  let ok = 0;
  for (const s of own) {
    const p = `/province/${slugOf[fv(s, 'province').sys.id]}/${fv(s, 'slug')}`;
    const { status, html } = await get(p);
    const robots = metaContent(html, 'robots');
    const errs = [];
    if (status !== 200) errs.push(`HTTP ${status}`);
    if (/noindex|nofollow/i.test(robots)) errs.push(`robots «${robots}»`);
    if (canonical(html) !== `${SITE}${p}`) errs.push(`canonical «${canonical(html)}»`);
    if (!sitemap.includes(`<loc>${SITE}${p}</loc>`)) errs.push('sitemap-д алга');
    if (errs.length) problems.push(`${p}: ${errs.join('; ')}`);
    else ok++;
  }
  console.log(`тусдаа хуудас: ${ok}/${own.length} зөв`);

  // 3. Redirect хүснэгтийн шинэ хаягууд
  const rows = parseCsv(fs.readFileSync(path.join(ROOT, 'docs', 'redirects', 'batch-01b-soums.csv'), 'utf8'));
  let rok = 0;
  for (const r of rows) {
    const u = new URL(r.new_url);
    const { status, html } = await get(u.pathname);
    const anchorOk = !u.hash || html.includes(`id="${u.hash.slice(1)}"`);
    if (status === 200 && anchorOk) rok++;
    else problems.push(`redirect ${r.new_url}: ${status}${anchorOk ? '' : ', anchor алга'}`);
  }
  console.log(`redirect new_url: ${rok}/${rows.length} зөв`);
  console.log(problems.length ? `АСУУДАЛ ${problems.length}:\n  ${problems.join('\n  ')}` : 'асуудалгүй');
})().catch((e) => { console.error(e.message); process.exit(1); });

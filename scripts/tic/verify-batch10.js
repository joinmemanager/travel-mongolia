// feat/tic-batch-10-ийн хуудсуудыг local dev server (Preview API, draft) дээр шалгана: 200, H1 нэг, canonical,
// BreadcrumbList, TIC-ийн мэдэгдэл (буудал/бааз).   node scripts/tic/verify-batch10.js [http://localhost:3123]
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./_cma');

const BASE = process.argv[2] || 'http://localhost:3123';
const SITE = 'https://www.travelhubmongolia.com';
const r10 = JSON.parse(fs.readFileSync(path.join(ROOT, 'backups', 'tic-cache', 'batch10-result.json'), 'utf8')).entries;
const r07 = JSON.parse(fs.readFileSync(path.join(ROOT, 'backups', 'tic-cache', 'batch07-result.json'), 'utf8')).entries.filter((e) => e.type === 'localProvider');
const first = (s) => r10.find((e) => e.section === s)?.path;
const acc = (cate) => r07.find((e) => e.key.startsWith(cate))?.path.replace('/local/', '/plan/accommodation/');

const PAGES = [
  '/about/culture/ethnic-groups', first('ethnic-groups'),
  '/about/history/people', first('people'),
  '/about/culture/religion', first('religion'),
  '/about/traditions', first('traditions'),
  '/plan/accommodation', acc('c21_'), acc('c22_'),
  '/province/khovd', '/province/dornogov/sainshand',
  r07[0]?.path,
].filter(Boolean);

(async () => {
  const out = [];
  for (const p of PAGES) {
    const res = await fetch(BASE + p, { redirect: 'manual' });
    const html = res.status === 200 ? await res.text() : '';
    const h1 = (html.match(/<h1[\s>]/g) || []).length;
    const canonical = /<link rel="canonical" href="([^"]*)"/.exec(html)?.[1] || '';
    const crumbs = /"@type":"BreadcrumbList"/.test(html);
    const notice = /Tourist Info Center-ээс авсан/.test(html);
    const row = { path: p, status: res.status, location: res.headers.get('location') || undefined, h1, canonicalOk: canonical === SITE + p, breadcrumbList: crumbs, ticNotice: notice };
    out.push(row);
    console.log(JSON.stringify(row));
  }
  fs.writeFileSync(path.join(ROOT, 'backups', 'tic-cache', 'verify-batch10.json'), JSON.stringify(out, null, 2));
})().catch((e) => { console.error(e.message); process.exit(1); });

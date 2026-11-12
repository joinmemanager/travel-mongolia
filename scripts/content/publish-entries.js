// Эзэмшигчийн зөвшөөрсөн entry-нүүдийг нийтэлнэ (одоогийн draft хувилбарыг).
// Нийтлэхээс өмнө: entry-ийн draft нь backups/rewrite-originals-ийн нөөцөөс зөвхөн өгөгдсөн талбаруудаар ялгаатай эсэхийг шалгана.
//   node scripts/content/publish-entries.js <entryId> [<entryId> ...]
const fs = require('fs');
const path = require('path');
const { cma, ROOT } = require('../tic/_cma');

// image: Ажил C2-оор сумын hero-г Commons зургаар сольсон (холбосон asset-уудыг эхлээд нийтэлнэ).
const ALLOWED = new Set(['body', 'description2', 'description', 'seoTitle', 'seoDescription', 'image']);
(async () => {
  for (const id of process.argv.slice(2)) {
    const e = await cma('GET', `/entries/${id}`);
    // Анхны хувилбар: дахин бичихийн өмнөх нөөц, байхгүй бол Commons зураг холбохоос өмнөх нөөц
    const bak = [path.join(ROOT, 'backups', 'rewrite-originals', `${id}.json`), path.join(ROOT, 'backups', 'commons-soum-originals', `${id}.json`)].find((f) => fs.existsSync(f));
    if (!bak) { console.log(id, 'АЛГАСАВ: нөөц алга'); continue; }
    const orig = JSON.parse(fs.readFileSync(bak, 'utf8'));
    const changed = Object.keys({ ...e.fields, ...orig.fields }).filter((k) => JSON.stringify(e.fields[k]) !== JSON.stringify(orig.fields[k]));
    const other = changed.filter((k) => !ALLOWED.has(k));
    if (other.length) { console.log(id, 'АЛГАСАВ: бусад талбар өөрчлөгдсөн', other); continue; }
    const p = await cma('PUT', `/entries/${id}/published`, { version: e.sys.version });
    console.log(id, 'нийтэлсэн', { changed, version: p.sys.version, publishedVersion: p.sys.publishedVersion });
  }
})().catch((e) => { console.error('АЛДАА:', e.message); process.exit(1); });

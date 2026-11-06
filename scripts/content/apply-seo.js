// Зөвхөн seoTitle / seoDescription-ийг DRAFT болгон шинэчилнэ (бичвэрт хүрэхгүй, НИЙТЛЭХГҮЙ).
//   node scripts/content/apply-seo.js <entryId> "<seoTitle>" "<seoDescription>"
const fs = require('fs');
const path = require('path');
const { cma, ROOT, LOCALE, callCount } = require('../tic/_cma');

const [id, title, desc] = process.argv.slice(2);
if ([...title].length > 60 || [...desc].length > 155) throw new Error(`урт: ${[...title].length}/${[...desc].length}`);
(async () => {
  const e = await cma('GET', `/entries/${id}`);
  if (!e) throw new Error('entry алга');
  const BACKUP = path.join(ROOT, 'backups', 'rewrite-originals');
  fs.mkdirSync(BACKUP, { recursive: true });
  const bak = path.join(BACKUP, `${id}.json`);
  if (e.sys.publishedVersion && e.sys.version > e.sys.publishedVersion + 1 && !fs.existsSync(bak)) throw new Error('нийтлээгүй өөрчлөлттэй');
  if (!fs.existsSync(bak)) fs.writeFileSync(bak, JSON.stringify(e));
  e.fields.seoTitle = { ...(e.fields.seoTitle || {}), [LOCALE]: title };
  e.fields.seoDescription = { ...(e.fields.seoDescription || {}), [LOCALE]: desc };
  const s = await cma('PUT', `/entries/${id}`, { body: { fields: e.fields }, version: e.sys.version });
  console.log(JSON.stringify({ id, version: s.sys.version, publishedVersion: s.sys.publishedVersion, calls: callCount() }));
})().catch((e) => { console.error('АЛДАА:', e.message); process.exit(1); });

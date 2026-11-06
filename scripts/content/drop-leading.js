// Rich text-ийн эхний N node-ыг хасаж DRAFT болгон хадгална (жишээ нь бичвэрт орсон AI-н тайлбар өгүүлбэр).
// Хамгаалалт: эхний node яг өгсөн текстээр эхлэх ёстой. Эх entry-г backups/rewrite-originals/-д хадгална. НИЙТЛЭХГҮЙ.
//   node scripts/content/drop-leading.js <entryId> <field> <N> "<эхний node-ын эхлэл>" ["<seoTitle>" "<seoDescription>"]
const fs = require('fs');
const path = require('path');
const { cma, ROOT, LOCALE, callCount } = require('../tic/_cma');
const plain = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(plain).join(''));

const [id, field, n, prefix, seoTitle, seoDescription] = process.argv.slice(2);
(async () => {
  const e = await cma('GET', `/entries/${id}`);
  const BACKUP = path.join(ROOT, 'backups', 'rewrite-originals');
  const bak = path.join(BACKUP, `${id}.json`);
  if (e.sys.publishedVersion && e.sys.version > e.sys.publishedVersion + 1 && !fs.existsSync(bak)) throw new Error('нийтлээгүй өөрчлөлттэй');
  const doc = e.fields[field][LOCALE];
  if (!plain(doc.content[0]).startsWith(prefix)) throw new Error('эхний node таарсангүй: ' + plain(doc.content[0]).slice(0, 80));
  fs.mkdirSync(BACKUP, { recursive: true });
  if (!fs.existsSync(bak)) fs.writeFileSync(bak, JSON.stringify(e));
  const dropped = doc.content.splice(0, Number(n)).map((x) => plain(x).slice(0, 80));
  if (seoTitle) e.fields.seoTitle = { ...(e.fields.seoTitle || {}), [LOCALE]: seoTitle };
  if (seoDescription) e.fields.seoDescription = { ...(e.fields.seoDescription || {}), [LOCALE]: seoDescription };
  const s = await cma('PUT', `/entries/${id}`, { body: { fields: e.fields }, version: e.sys.version });
  console.log(JSON.stringify({ id, dropped, version: s.sys.version, publishedVersion: s.sys.publishedVersion, calls: callCount() }));
})().catch((e) => { console.error('АЛДАА:', e.message); process.exit(1); });

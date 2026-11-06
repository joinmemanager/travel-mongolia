// Contentful-ийн бүх зургийн asset-ийн тооллого → docs/plan/images-audit.csv
// Snapshot-аас уншина (Contentful руу хүсэлт явуулахгүй).
// «сайжруулах»: өргөн < 1200px, эсвэл JPEG/WebP-ийн шахалт хэт их (пиксел тутамд < 0.08 байт, 1 мегапикселээс том зурагт).
// Бүдэг эсэхийг файлыг татахгүйгээр мэдэх боломжгүй тул энд хэмжээгүй (tmp/images-enhanced-ийн 10 зурагт л харьцуулсан).
//   node scripts/content/images-audit.js
const path = require('path');
const lib = require('./_lib');
const { writeCsv } = require('../tic/_csv');

const OUT = path.join(lib.ROOT, 'docs', 'plan', 'images-audit.csv');
const entries = lib.load('entries.json');
const assets = lib.load('assets.json');
const byId = new Map(entries.map((e) => [e.sys.id, e]));

// asset id → [{ entry, field }]
const uses = new Map();
const add = (aid, e, field) => { if (!uses.has(aid)) uses.set(aid, []); uses.get(aid).push({ e, field }); };
function walk(node, e, field) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) return node.forEach((n) => walk(n, e, field));
  if (node.sys?.type === 'Link' && node.sys.linkType === 'Asset') return add(node.sys.id, e, field);
  if (node.nodeType === 'embedded-asset-block') return add(node.data?.target?.sys?.id, e, field + ' (бичвэр доторх)');
  if (node.content) walk(node.content, e, field);
}
for (const e of entries) for (const [k, v] of Object.entries(e.fields || {})) walk(v?.[lib.L], e, k);

const HOME_TYPES = { destination: ['coverImage'], recommendation: ['image'], cultureHeritage: ['image'] };
function placeOf(u) {
  const ct = u.e.sys.contentType.sys.id;
  if (HOME_TYPES[ct]?.includes(u.field)) return 'нүүр хуудас';
  if (ct === 'province' && u.field === 'image') return 'аймгийн hero';
  if (ct === 'province' && u.field === 'emblem') return 'аймгийн сүлд';
  return '';
}

const rows = [];
for (const a of assets) {
  const file = a.fields?.file?.[lib.L] || Object.values(a.fields?.file || {})[0];
  if (!file || !/^image\//.test(file.contentType || '')) continue;
  const w = file.details?.image?.width || 0;
  const h = file.details?.image?.height || 0;
  const kb = Math.round((file.details?.size || 0) / 1024);
  const bpp = w && h ? (file.details.size / (w * h)) : 0;
  const lossy = /jpe?g|webp/.test(file.contentType);
  const u = uses.get(a.sys.id) || [];
  const places = [...new Set(u.map(placeOf).filter(Boolean))];
  const reasons = [];
  if (w && w < 1200) reasons.push(`нарийн (${w}px)`);
  if (lossy && w * h >= 1e6 && bpp < 0.08) reasons.push(`шахалт их (${bpp.toFixed(3)} байт/пиксел)`);
  const where = u.slice(0, 4).map((x) => `${x.e.sys.contentType.sys.id}:${lib.titleOf(x.e)} (${x.field})`).join('; ') + (u.length > 4 ? `; … +${u.length - 4}` : '');
  rows.push({
    id: a.sys.id, name: file.fileName, w, h, kb, type: file.contentType, n: u.length, places: places.join(', '), where,
    status: a.sys.publishedVersion ? 'published' : 'draft', flag: reasons.length ? 'сайжруулах' : '', reasons: reasons.join('; '),
    url: file.url ? 'https:' + file.url : '',
  });
}
// Нүүр/аймгийн hero эхэнд, дараа нь ашиглалтын тоогоор
const pri = (r) => (r.places.includes('нүүр') ? 0 : r.places.includes('hero') ? 1 : r.n ? 2 : 3);
rows.sort((a, b) => pri(a) - pri(b) || (b.flag ? 1 : 0) - (a.flag ? 1 : 0) || b.n - a.n || a.w - b.w);
writeCsv(OUT, ['asset_id', 'файлын_нэр', 'өргөн×өндөр', 'хэмжээ_KB', 'төрөл', 'ашигласан_тоо', 'онцлох_байршил', 'хаана_ашиглагдсан', 'contentful', 'тэмдэглэгээ', 'шалтгаан', 'url'],
  rows.map((r) => [r.id, r.name, `${r.w}×${r.h}`, r.kb, r.type, r.n, r.places, r.where, r.status, r.flag, r.reasons, r.url]));
const flagged = rows.filter((r) => r.flag);
console.log(OUT, 'зураг', rows.length, 'сайжруулах', flagged.length, 'нарийн', rows.filter((r) => /нарийн/.test(r.reasons)).length, 'шахалт', rows.filter((r) => /шахалт/.test(r.reasons)).length, 'ашиглагдаагүй', rows.filter((r) => !r.n).length);
console.log('нүүр/hero сайжруулах:');
for (const r of flagged.filter((r) => r.places && r.places !== 'аймгийн сүлд')) console.log(' ', r.id, r.name, `${r.w}×${r.h}`, r.kb + 'KB', r.places, '|', r.reasons, '|', r.where.slice(0, 80));

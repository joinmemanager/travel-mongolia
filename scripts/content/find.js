// Сайтад байгаа хуудсыг гарчгаар хайна (дотоод холбоос сонгоход), эсвэл rewrite файлын холбоосыг шалгана.
//   node scripts/content/find.js <хэсэг үг> [<хэсэг үг> ...]
//   node scripts/content/find.js --check data/rewrites/<id>.md
const fs = require('fs');
const lib = require('./_lib');
const entries = lib.load('entries.json');
const byId = new Map(entries.map((e) => [e.sys.id, e]));
const rows = entries.filter((e) => e.sys.publishedVersion).map((e) => ({ e, url: lib.urlOf(e, byId), t: lib.titleOf(e) })).filter((r) => r.url);
const thin = (e) => {
  const f = lib.THIN_FIELD[e.sys.contentType.sys.id];
  return f ? lib.words(lib.plain(lib.fv(e, f))) < 80 : false;
};

if (process.argv[2] === '--check') {
  const md = fs.readFileSync(process.argv[3], 'utf8');
  const urls = new Set(rows.map((r) => r.url));
  let bad = 0;
  for (const m of md.matchAll(/\]\((\/[^)\s]*)\)/g)) {
    const u = m[1].split('#')[0];
    const ok = urls.has(u) || urls.has(m[1]);
    const r = rows.find((x) => x.url === u);
    console.log(ok ? 'OK ' : 'ҮГҮЙ', m[1], r ? `${r.t}${thin(r.e) ? ' (богино/noindex)' : ''}` : '');
    if (!ok) bad++;
  }
  process.exit(bad ? 1 : 0);
}
const qs = process.argv.slice(2).map((q) => q.toLowerCase());
for (const r of rows) {
  const t = r.t.toLowerCase();
  if (qs.some((q) => t.includes(q))) console.log(`${r.url}  | ${r.t} | ${r.e.sys.contentType.sys.id}${thin(r.e) ? ' | богино' : ''}`);
}

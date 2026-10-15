// crawl.ps1-ийн crawl.csv-ээс title/description-ийн урт, давхардлын тайлан (docs/seo/meta-audit.md).
// node scripts/seo/meta-audit.js <local crawl.csv> <production crawl.csv> <гаралт.md>
// Дүрэм (TIC 1-р шат): title ≤60, description 120–155 тэмдэгт, хуудас бүрт давтагдашгүй.
const fs = require('fs');
const { parseCsv } = require('../tic/_csv');

const [localCsv, prodCsv, out] = process.argv.slice(2);
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 155;

const rows = parseCsv(fs.readFileSync(localCsv, 'utf8')).filter((r) => r.status === '200' && r.title);
const prod = new Set(
  parseCsv(fs.readFileSync(prodCsv, 'utf8')).filter((r) => r.status === '200').map((r) => new URL(r.url).pathname)
);
const seen = new Set();
const pages = rows.filter((r) => { const p = new URL(r.url).pathname; if (seen.has(p) || new URL(r.url).search) return false; seen.add(p); return true; }).map((r) => {
  const path = new URL(r.url).pathname;
  return { path, title: r.title, desc: r.meta_description || '', live: prod.has(path), robots: r.robots || '' };
});
// TIC-ээс шинээр оруулсан (Draft) аймаг, сумын хуудсыг тусад нь
const isTic = (p) => /^\/province\/[^/]+(\/[^/]+)?$/.test(p.path) && !['/province/khovd', '/province/ulaanbaatar'].includes(p.path);
const existing = pages.filter((p) => !isTic(p));
const tic = pages.filter(isTic);

const len = (s) => [...s].length;
const esc = (s) => s.replace(/\|/g, '\\|');
const liveMark = (p) => (p.live ? 'live' : 'draft');

function dupGroups(list, key) {
  const m = new Map();
  for (const p of list) {
    const k = p[key].trim();
    if (!k) continue;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(p);
  }
  return [...m.entries()].filter(([, v]) => v.length > 1).sort((a, b) => b[1].length - a[1].length);
}

const longTitle = existing.filter((p) => len(p.title) > TITLE_MAX).sort((a, b) => len(b.title) - len(a.title));
const longDesc = existing.filter((p) => len(p.desc) > DESC_MAX).sort((a, b) => len(b.desc) - len(a.desc));
const shortDesc = existing.filter((p) => p.desc && len(p.desc) < DESC_MIN).sort((a, b) => len(a.desc) - len(b.desc));
const noDesc = existing.filter((p) => !p.desc);
const dupTitle = dupGroups(existing, 'title');
const dupDesc = dupGroups(existing, 'desc');
const ticBad = tic.filter((p) => len(p.title) > TITLE_MAX || len(p.desc) > DESC_MAX || len(p.desc) < DESC_MIN);

const today = new Date().toISOString().slice(0, 10);
const L = [];
L.push('# Meta audit: title, description');
L.push('');
L.push(`> ${today}. Local build-ийг (preview горим, Draft хуудсууд ч орно) \`scripts/seo/crawl.ps1\`-аар мөлхөж, \`scripts/seo/meta-audit.js\`-ээр гаргав. «live» = travelhubmongolia.com дээр одоо 200 буцаадаг, «draft» = зөвхөн preview-д (production-д noindex эсвэл цэсгүй). Засах эсэхийг дараа шийднэ, энэ ажлаар юу ч өөрчлөөгүй.`);
L.push('');
L.push(`Дүрэм: title ≤ ${TITLE_MAX}, description ${DESC_MIN}–${DESC_MAX} тэмдэгт, хуудас бүрт давтагдашгүй. Урт нь хөтөч дээр харагдах бүтэн title (layout-ын \`| Travel Mongolia\` загвартай).`);
L.push('');
L.push('## Хураангуй');
L.push('');
L.push(`| | Хуудас |`);
L.push('|---|--:|');
L.push(`| Шалгасан (TIC-ийн шинэ хуудсыг хассан) | ${existing.length} (live ${existing.filter((p) => p.live).length}) |`);
L.push(`| Title ${TITLE_MAX}-аас урт | ${longTitle.length} |`);
L.push(`| Description ${DESC_MAX}-аас урт | ${longDesc.length} |`);
L.push(`| Description ${DESC_MIN}-аас богино | ${shortDesc.length} |`);
L.push(`| Description байхгүй | ${noDesc.length} |`);
L.push(`| Давхардсан title (бүлэг / хуудас) | ${dupTitle.length} / ${dupTitle.reduce((n, [, v]) => n + v.length, 0)} |`);
L.push(`| Давхардсан description (бүлэг / хуудас) | ${dupDesc.length} / ${dupDesc.reduce((n, [, v]) => n + v.length, 0)} |`);
L.push(`| TIC 1-р багцын шинэ хуудас (21 аймаг + сум) дүрэм зөрчсөн | ${ticBad.length} / ${tic.length} |`);
L.push('');
L.push('Анхаарах: layout-ын title загвар `%s | Travel Mongolia` бөгөөд лого, TIC-ийн шинэ seoTitle-д «Travel Hub Mongolia» гэсэн нэр хэрэглэж байна. Брэндийн нэрийг нэгтгэх эсэхийг шийдэх хэрэгтэй (`lib/seo.ts` `SITE_NAME`).');
L.push('');
const table = (title, list, col) => {
  L.push(`## ${title}`);
  L.push('');
  if (!list.length) { L.push('Алга.'); L.push(''); return; }
  L.push(`| Хуудас | Төлөв | Урт | ${col === 'title' ? 'Title' : 'Description'} |`);
  L.push('|---|---|--:|---|');
  for (const p of list) L.push(`| \`${p.path}\` | ${liveMark(p)} | ${len(p[col])} | ${esc(p[col])} |`);
  L.push('');
};
table(`Title ${TITLE_MAX}-аас урт`, longTitle, 'title');
table(`Description ${DESC_MAX}-аас урт`, longDesc, 'desc');
table(`Description ${DESC_MIN}-аас богино`, shortDesc, 'desc');
if (noDesc.length) {
  L.push('## Description байхгүй');
  L.push('');
  for (const p of noDesc) L.push(`- \`${p.path}\` (${liveMark(p)})`);
  L.push('');
}
const dups = (title, groups, col) => {
  L.push(`## ${title}`);
  L.push('');
  if (!groups.length) { L.push('Алга.'); L.push(''); return; }
  for (const [text, list] of groups) {
    L.push(`- «${text}» (${list.length}): ${list.map((p) => `\`${p.path}\` (${liveMark(p)})`).join(', ')}`);
  }
  L.push('');
};
dups('Давхардсан title', dupTitle, 'title');
dups('Давхардсан description', dupDesc, 'desc');
L.push('## TIC 1-р багцын шинэ хуудсууд');
L.push('');
L.push(`${tic.length} хуудас (Draft, зөвхөн preview). seoTitle/seoDescription-ийг \`scripts/tic/_seo.js\` автоматаар үүсгэсэн. Title ${Math.min(...tic.map((p) => len(p.title)))}–${Math.max(...tic.map((p) => len(p.title)))}, description ${Math.min(...tic.map((p) => len(p.desc)))}–${Math.max(...tic.map((p) => len(p.desc)))} тэмдэгт${ticBad.length ? `, дүрэм зөрчсөн: ${ticBad.map((p) => p.path).join(', ')}` : ', бүгд дүрэмд багтсан, давхардалгүй'}.`);
L.push('');
fs.writeFileSync(out, L.join('\n'), 'utf8');
console.log(JSON.stringify({ existing: existing.length, live: existing.filter((p) => p.live).length, longTitle: longTitle.length, longDesc: longDesc.length, shortDesc: shortDesc.length, noDesc: noDesc.length, dupTitle: dupTitle.length, dupTitlePages: dupTitle.reduce((n, [, v]) => n + v.length, 0), dupDesc: dupDesc.length, dupDescPages: dupDesc.reduce((n, [, v]) => n + v.length, 0), tic: tic.length, ticBad: ticBad.length }));

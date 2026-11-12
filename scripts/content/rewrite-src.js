// Дахин бичих эх материал: rewrite-list.csv-ийн дараагийн «хүлээгдэж буй» N entry-ийн одоогийн текстийг
// Contentful-аас (CMA GET, 1 хүсэлт/entry) татаж markdown болгоод tmp/rewrite-src/<id>.md-д бичнэ.
// Мөн зураг (asset id + одоогийн alt), дотоод холбоосын сонголт (аймаг, хөрш сум, бичвэрт гарсан газар).
//   node scripts/content/rewrite-src.js <N> [--from=<эрэмбэ>]
//   node scripts/content/rewrite-src.js --id=<entryId>
const fs = require('fs');
const path = require('path');
const lib = require('./_lib');
const { parseCsv } = require('../tic/_csv');
const { cma, LOCALE } = require('../tic/_cma');

const SNAP = path.join(lib.ROOT, 'backups', 'contentful-snapshot-2026-11-06-after-statfix');
const E = JSON.parse(fs.readFileSync(path.join(SNAP, 'entries.json'), 'utf8'));
const A = JSON.parse(fs.readFileSync(path.join(SNAP, 'assets.json'), 'utf8'));
const byId = new Map(E.map((e) => [e.sys.id, e]));
const assetById = new Map(A.map((a) => [a.sys.id, a]));
const OUT = path.join(lib.ROOT, 'tmp', 'rewrite-src');
fs.mkdirSync(OUT, { recursive: true });
const FIELD = { province: 'description2', heritagePlace: 'description', localProvider: 'story', destination: 'description' };
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1];

function inl(n) {
  if (n.nodeType === 'text') {
    let v = n.value || '';
    if (v.trim() && (n.marks || []).some((m) => m.type === 'bold')) v = `**${v}**`;
    return v;
  }
  if (n.nodeType === 'hyperlink') return `[${(n.content || []).map(inl).join('')}](${n.data.uri})`;
  if (/hyperlink/.test(n.nodeType)) return `[${(n.content || []).map(inl).join('')}](${n.nodeType}:${n.data?.target?.sys?.id})`;
  return (n.content || []).map(inl).join('');
}
function md(doc) {
  const out = [];
  for (const b of doc?.content || []) {
    const t = b.nodeType;
    if (/^heading-(\d)/.test(t)) out.push(`${'#'.repeat(Number(t.slice(-1)))} ${inl(b)}`);
    else if (t === 'paragraph') { const s = inl(b).trim(); if (s) out.push(s); }
    else if (/list/.test(t)) out.push(b.content.map((li, i) => `${t === 'ordered-list' ? `${i + 1}.` : '-'} ${li.content.map(inl).join(' ').trim()}`).join('\n'));
    else if (t === 'embedded-asset-block') { const id = b.data.target.sys.id; out.push(`{{IMG:${id}}}  <!-- alt: ${assetById.get(id)?.fields?.title?.[LOCALE] || ''} -->`); }
    else if (t === 'embedded-entry-block') out.push(`{{ENTRY:${b.data.target.sys.id}}}`);
    else if (t === 'table') out.push(b.content.map((r) => '| ' + r.content.map((c) => inl(c).trim()).join(' | ') + ' |').join('\n'));
    else if (t === 'blockquote') out.push('> ' + inl(b));
    else if (t === 'hr') out.push('---');
    else out.push(`<!-- ${t} --> ${inl(b)}`);
  }
  return out.join('\n\n');
}

const published = E.filter((e) => e.sys.publishedVersion);
function linkHints(e, text) {
  const ct = e.sys.contentType.sys.id;
  const hints = [];
  const pid = lib.fv(e, 'province')?.sys?.id;
  const p = pid && byId.get(pid);
  if (p) hints.push(`аймаг: ${lib.urlOf(p, byId)} | ${lib.titleOf(p)}`);
  if (ct === 'soum' && p) {
    const sib = published.filter((x) => x.sys.contentType.sys.id === 'soum' && lib.fv(x, 'province')?.sys?.id === pid && x.sys.id !== e.sys.id && lib.fv(x, 'ownPage') === true);
    hints.push('өөр хуудастай сумууд: ' + sib.map((x) => `${lib.titleOf(x)} ${lib.urlOf(x, byId)}`).join('; '));
  }
  const seen = new Set();
  for (const x of published) {
    const t = lib.titleOf(x);
    if (x.sys.id === e.sys.id || !t || t.length < 5 || seen.has(t)) continue;
    const base = t.replace(/ (сум|аймаг|нуур|уул|хийд|агуй)$/, '');
    if (base.length < 4 || !text.includes(base)) continue;
    const u = lib.urlOf(x, byId);
    if (!u || u.includes('#')) continue;
    seen.add(t);
    hints.push(`бичвэрт гарсан: ${t} ${u} (${x.sys.contentType.sys.id})`);
    if (seen.size > 12) break;
  }
  return hints;
}

(async () => {
  let ids;
  if (arg('id')) ids = [arg('id')];
  else {
    const rows = parseCsv(fs.readFileSync(path.join(lib.ROOT, 'docs', 'plan', 'rewrite-list.csv'), 'utf8'));
    const from = Number(arg('from') || 0);
    ids = rows.filter((r) => r['төлөв'] === 'хүлээгдэж буй' && Number(r['эрэмбэ']) >= from).slice(0, Number(process.argv[2] || 5)).map((r) => `${r['эрэмбэ']}:${r.entry_id}`);
  }
  for (const x of ids) {
    const [rank, id] = x.includes(':') ? x.split(':') : ['', x];
    const e = await cma('GET', `/entries/${id}`);
    if (!e) { console.log(rank, id, 'алга'); continue; }
    const ct = e.sys.contentType.sys.id;
    const field = FIELD[ct] || 'body';
    const st = !e.sys.publishedVersion ? 'draft' : e.sys.version > e.sys.publishedVersion + 1 ? 'changed' : 'published';
    const f = (k) => e.fields?.[k]?.[LOCALE];
    const text = md(f(field));
    const words = lib.words(text.replace(/\{\{[^}]+\}\}|<!--[^>]*-->|\]\([^)]*\)/g, ' '));
    const snapE = { ...e, fields: e.fields };
    const head = [
      `# ${rank} ${id} | ${ct} | ${st} | field: ${field} | үг: ${words}`,
      `title: ${f('title') || f('name')}`, `slug: ${f('slug')}`, `url: ${lib.urlOf(byId.get(id) || snapE, byId)}`,
      `seoTitle: ${f('seoTitle') || ''}`, `seoDescription: ${f('seoDescription') || ''}`,
      ...['summary', 'excerpt', 'intro', 'description'].filter((k) => k !== field && typeof f(k) === 'string').map((k) => `${k}: ${f(k)}`),
      ...linkHints(byId.get(id) || snapE, text).map((h) => `link: ${h}`),
    ];
    fs.writeFileSync(path.join(OUT, `${id}.md`), head.join('\n') + '\n\n' + text + '\n');
    console.log(rank, id, ct, st, words);
  }
})().catch((e) => { console.error('АЛДАА', e.message); process.exit(1); });

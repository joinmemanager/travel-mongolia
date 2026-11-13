// Хуучин (Contentful-ийн локал экспорт) ба шинэ (Payload) өгөгдлөөр рендерлэсэн сайтыг харьцуулна.
// Contentful руу хүсэлт явуулахгүй. Хоёр локал сервер:
//   CMS_SOURCE=snapshot CF_SNAPSHOT_DIR=<экспорт> CMS_PREVIEW_DRAFTS=0 next dev --webpack -p 3201
//   CMS_SOURCE=payload                             CMS_PREVIEW_DRAFTS=0 next dev --webpack -p 3202
//   node scripts/payload/compare-urls.mjs [--a http://localhost:3201] [--b http://localhost:3202] [--limit N] [--sample N]
// Шалгалт: /sitemap.xml-ийн хаягийн жагсаалт ижил эсэх; хаяг бүрийн HTTP статус, <title>, canonical, H1,
// meta description, <main>-ийн текстийн hash. Үр дүн: docs/plan/payload-url-compare.md
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const args = process.argv.slice(2);
const arg = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const A = arg('--a', 'http://localhost:3201');
const B = arg('--b', 'http://localhost:3202');
const LIMIT = Number(arg('--limit', Infinity));
const SAMPLE = Number(arg('--sample', 0));

async function get(url) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(180000) });
      return { status: res.status, location: res.headers.get('location') || '', html: res.status === 200 ? await res.text() : '' };
    } catch (e) {
      if (i === 2) return { status: 0, location: '', html: '', error: e.message };
    }
  }
}

const locs = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const pick = (html, re) => (html.match(re)?.[1] || '').replace(/\s+/g, ' ').trim();
function summary(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] || html;
  const text = main
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    title: pick(html, /<title>([^<]*)<\/title>/),
    canonical: pick(html, /<link rel="canonical" href="([^"]*)"/),
    description: pick(html, /<meta name="description" content="([^"]*)"/),
    h1: pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/).replace(/<[^>]+>/g, ''),
    words: text.split(' ').length,
    hash: crypto.createHash('sha1').update(text).digest('hex').slice(0, 12),
  };
}

const [sa, sb] = await Promise.all([get(`${A}/sitemap.xml`), get(`${B}/sitemap.xml`)]);
const ua = new Set(locs(sa.html));
const ub = new Set(locs(sb.html));
const onlyA = [...ua].filter((u) => !ub.has(u));
const onlyB = [...ub].filter((u) => !ua.has(u));
let urls = [...ua].filter((u) => ub.has(u)).sort();
if (SAMPLE) urls = urls.filter((_, i) => i % Math.max(1, Math.floor(urls.length / SAMPLE)) === 0);
urls = urls.slice(0, LIMIT);

const diffs = [];
let same = 0;
let next = 0;
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (next < urls.length) {
      const u = urls[next++];
      const [ra, rb] = await Promise.all([get(A + u), get(B + u)]);
      const a = ra.status === 200 ? summary(ra.html) : { status: ra.status, location: ra.location };
      const b = rb.status === 200 ? summary(rb.html) : { status: rb.status, location: rb.location };
      const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((k) => k !== 'words');
      const d = keys.filter((k) => a[k] !== b[k]);
      if (ra.status !== rb.status) d.unshift('status');
      if (d.length) diffs.push({ url: u, fields: [...new Set(d)], a, b });
      else same++;
      if ((same + diffs.length) % 100 === 0) console.log(`${same + diffs.length}/${urls.length}`);
    }
  })
);

const md = [
  `# Хуучин ↔ Payload: хаяг, хуудасны тулгалт (${new Date().toISOString().slice(0, 16).replace('T', ' ')})`,
  '',
  `A = хуучин өгөгдөл (Contentful-ийн локал экспорт, \`CMS_SOURCE=snapshot\`), B = Payload (\`CMS_SOURCE=payload\`). Скрипт: \`travel-mongolia/scripts/payload/compare-urls.mjs\`.`,
  '',
  `| | Тоо |`,
  `|---|--:|`,
  `| sitemap.xml-ийн хаяг (A) | ${ua.size} |`,
  `| sitemap.xml-ийн хаяг (B) | ${ub.size} |`,
  `| Зөвхөн A-д | ${onlyA.length} |`,
  `| Зөвхөн B-д | ${onlyB.length} |`,
  `| Харьцуулсан хуудас | ${urls.length}${SAMPLE ? ` (дээжээр)` : ''} |`,
  `| Ижил (статус, title, canonical, description, H1, үндсэн текстийн hash) | **${same}** |`,
  `| Зөрүүтэй | **${diffs.length}** |`,
  '',
  ...(onlyA.length ? ['## Зөвхөн хуучинд байгаа хаяг', '', ...onlyA.slice(0, 50).map((u) => `- ${u}`), ''] : []),
  ...(onlyB.length ? ['## Зөвхөн Payload-д байгаа хаяг', '', ...onlyB.slice(0, 50).map((u) => `- ${u}`), ''] : []),
  ...(diffs.length
    ? ['## Зөрүү (эхний 50)', '', ...diffs.slice(0, 50).map((d) => `- \`${d.url}\`: ${d.fields.map((f) => `${f}: «${String(d.a[f]).slice(0, 80)}» ≠ «${String(d.b[f]).slice(0, 80)}»`).join('; ')}`)]
    : []),
  '',
].join('\n');
fs.writeFileSync(path.join(ROOT, 'docs', 'plan', 'payload-url-compare.md'), md);
console.log({ sitemapA: ua.size, sitemapB: ub.size, onlyA: onlyA.length, onlyB: onlyB.length, compared: urls.length, same, diffs: diffs.length });

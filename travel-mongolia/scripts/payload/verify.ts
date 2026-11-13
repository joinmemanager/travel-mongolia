// Шилжүүлэлтийн автомат тулгалт: Payload-ийн өгөгдлийг САЙТЫН ашигладаг адаптераар (lib/cms/payloadSource.ts →
// Contentful хэлбэр) уншиж, локал Contentful экспорттой талбар бүрээр харьцуулна. Contentful руу хүсэлтгүй.
//   node scripts/payload/cli.mjs run scripts/payload/verify.ts [--export <dir>]
// Шалгалт:
//   1. Тоо: content type × төлөв (нийтлэгдсэн / ноорог) — экспорт ба Payload; зураг
//   2. Нийтлэгдсэн хувилбар бүр CDA экспорттой ижил (бүх талбар; rich text-ийг бүтэц, текст, зураг, холбоосоор)
//   3. Ноорог хувилбар бүр («changed», «draft») CMA экспорттой ижил
// Үр дүн: backups/payload-verify-<огноо>.json, docs/plan/payload-verify.md (товч).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { getPayload } from 'payload';

import config from '@payload-config';

import { payloadGetEntries } from '../../lib/cms/payloadSource';
import { normalizeCf } from '../../lib/cms/richText';
import { CF_SCHEMA } from '../../payload/cfSchema';

const require = createRequire(import.meta.url);
const REPO = path.resolve(process.cwd(), '..');
const { loadExport, statusOf } = require(path.join(REPO, 'scripts/payload/lib/export.js'));
const args = process.argv.slice(2);
const ex = loadExport(args.includes('--export') ? args[args.indexOf('--export') + 1] : undefined);
const payload = await getPayload({ config });

const isEmpty = (v: any) => v === undefined || v === null || v === '' || (Array.isArray(v) && !v.length);
function norm(kind: string, v: any): any {
  if (isEmpty(v)) return null;
  if (kind === 'richText') return JSON.stringify(normalizeCf(v));
  if (kind === 'upload' || kind === 'relationship') return JSON.stringify(Array.isArray(v) ? v.map((l) => l?.sys?.id) : v?.sys?.id);
  if (kind === 'location') return JSON.stringify({ lat: v.lat, lon: v.lon });
  return JSON.stringify(v);
}

async function allFromPayload(collection: string, draft: boolean) {
  const out = new Map<string, any>();
  for (let skip = 0; ; skip += 500) {
    const res: any = await payloadGetEntries({ content_type: collection, limit: 500, skip, include: 0 }, { locale: 'mn', draft });
    for (const e of res.items) out.set(e.sys.id, e);
    if (skip + 500 >= res.total) break;
  }
  return out;
}

const report: any = { at: new Date().toISOString(), export: path.basename(ex.dir), counts: {}, mismatches: [] as any[], missing: [] as string[], extra: [] as string[] };
let compared = 0;
let equal = 0;

const TYPES = args.includes('--types') ? args[args.indexOf('--types') + 1].split(',') : null;
for (const [collection, schema] of Object.entries(CF_SCHEMA).filter(([c]) => !TYPES || TYPES.includes(c))) {
  const entries = ex.entries.filter((e: any) => e.sys.contentType.sys.id === collection && statusOf(e.sys) !== 'archived');
  const expPublished = entries.filter((e: any) => statusOf(e.sys) !== 'draft');
  const expDrafts = entries.filter((e: any) => statusOf(e.sys) !== 'published');
  const gotPublished = await allFromPayload(collection, false);
  const gotLatest = await allFromPayload(collection, true);
  report.counts[collection] = {
    exportPublished: expPublished.length,
    payloadPublished: gotPublished.size,
    exportAll: entries.length,
    payloadAll: gotLatest.size,
  };

  const check = (want: any, got: any, version: string) => {
    if (!got) return report.missing.push(`${collection}/${want.sys.id} (${version})`);
    compared++;
    const diffs: string[] = [];
    for (const f of schema.fields) {
      const a = norm(f.kind, want.fields[f.id]?.mn);
      const b = norm(f.kind, got.fields[f.id]);
      if (a !== b) diffs.push(`${f.id}: ${String(a).slice(0, 120)} ≠ ${String(b).slice(0, 120)}`);
    }
    if (diffs.length) report.mismatches.push({ id: `${collection}/${want.sys.id}`, version, diffs });
    else equal++;
  };
  for (const e of expPublished) check(ex.publishedEntryById.get(e.sys.id), gotPublished.get(e.sys.id), 'published');
  for (const e of expDrafts) check(e, gotLatest.get(e.sys.id), 'draft');
  const expIds = new Set(entries.map((e: any) => e.sys.id));
  for (const id of gotLatest.keys()) if (!expIds.has(id)) report.extra.push(`${collection}/${id}`);
}

const mediaCount = (await payload.count({ collection: 'media', overrideAccess: true })).totalDocs;
report.counts.media = { export: ex.assets.length, payload: mediaCount };
report.summary = { compared, equal, mismatches: report.mismatches.length, missing: report.missing.length, extra: report.extra.length };

const stamp = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(REPO, 'backups', `payload-verify-${stamp}.json`), JSON.stringify(report, null, 1));
const rows = Object.entries<any>(report.counts)
  .filter(([k]) => k !== 'media')
  .map(([k, c]) => `| ${k} | ${c.exportPublished} | ${c.payloadPublished} | ${c.exportAll} | ${c.payloadAll} | ${c.exportPublished === c.payloadPublished && c.exportAll === c.payloadAll ? '✅' : '❌'} |`);
const md = [
  `# Payload шилжүүлэлтийн тулгалт (${stamp})`,
  '',
  `Экспорт: \`${report.export}\`. Скрипт: \`travel-mongolia/scripts/payload/verify.ts\` (сайтын адаптераар уншиж харьцуулсан).`,
  '',
  `- Харьцуулсан хувилбар: **${compared}**, ижил: **${equal}**, зөрүүтэй: **${report.mismatches.length}**`,
  `- Payload-д дутуу: ${report.missing.length}, илүү: ${report.extra.length}`,
  `- Зураг: экспорт ${report.counts.media.export}, Payload ${report.counts.media.payload}`,
  '',
  '| Төрөл | Нийтлэгдсэн (экспорт) | Нийтлэгдсэн (Payload) | Бүгд (экспорт) | Бүгд (Payload) | |',
  '|---|--:|--:|--:|--:|---|',
  ...rows,
  '',
  ...(report.mismatches.length ? ['## Зөрүүний жишээ (эхний 20)', '', ...report.mismatches.slice(0, 20).map((m: any) => `- \`${m.id}\` (${m.version}): ${m.diffs.slice(0, 3).join('; ')}`)] : []),
  ...(report.missing.length ? ['', '## Дутуу (эхний 20)', '', ...report.missing.slice(0, 20).map((m: string) => `- ${m}`)] : []),
  '',
].join('\n');
fs.writeFileSync(path.join(REPO, 'docs', 'plan', 'payload-verify.md'), md);
console.log(JSON.stringify(report.summary), JSON.stringify(report.counts.media));
process.exit(0);

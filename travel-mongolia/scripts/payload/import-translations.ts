// Шалгагдсан орчуулгыг (docs/translation/done/en-NNN.md) Payload-ийн тухайн locale руу НООРОГ болгон оруулна.
//   node scripts/payload/cli.mjs run scripts/payload/import-translations.ts docs/translation/done/en-001.md [--locale en] [--dry]
// Дүрэм:
// - done/<нэр>.report.md байх, «Алдаа: 0» байх, файлаас шинэ байх (scripts/translation/check.js). Үгүй бол зогсоно.
// - Хуудсыг contentfulId-аар олно. Талбар бүрийг тухайн locale-д бичнэ (mn-д огт хүрэхгүй).
// - draft: true → ноорог хувилбар. publishedLocales-д нэмэхгүй: редактор шалгаад өөрөө нийтэлж, хэлийг сонгоно.
// - Дахин ажиллуулахад ижил утгаар дарж бичнэ (давхардахгүй).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { getPayload } from 'payload';

import config from '@payload-config';

import { cfToLexical } from '../../lib/cms/richText';

const require = createRequire(import.meta.url);
const REPO = path.resolve(process.cwd(), '..');
const { parseBatch } = require(path.join(REPO, 'scripts/translation/lib/batch.js'));
const { mdToCf } = require(path.join(REPO, 'scripts/translation/lib/md.js'));

const args = process.argv.slice(2);
const file = path.resolve(REPO, args.find((a) => a.endsWith('.md')) || '');
const locale = args.includes('--locale') ? args[args.indexOf('--locale') + 1] : 'en';
const dry = args.includes('--dry');

const report = file.replace(/\.md$/, '.report.md');
if (!fs.existsSync(file)) throw new Error(`Файл алга: ${file}`);
if (!fs.existsSync(report) || fs.statSync(report).mtimeMs < fs.statSync(file).mtimeMs)
  throw new Error(`Эхлээд шалгагчийг ажиллуулна уу: node scripts/translation/check.js ${path.relative(REPO, file)}`);
if (!/\*\*Алдаа: 0\*\*/.test(fs.readFileSync(report, 'utf8'))) throw new Error(`${path.basename(report)}-д алдаа байна. Засаад дахин шалгана уу.`);

const payload = await getPayload({ config });
const { entries } = parseBatch(fs.readFileSync(file, 'utf8'));

// Зургийн Contentful ID → Payload media id
const mediaCache = new Map<string, number | string | undefined>();
async function mediaIds(ids: string[]) {
  const need = ids.filter((i) => !mediaCache.has(i));
  if (need.length) {
    const res = await payload.find({ collection: 'media', where: { contentfulId: { in: need } }, limit: need.length, depth: 0, overrideAccess: true });
    for (const id of need) mediaCache.set(id, res.docs.find((d: any) => d.contentfulId === id)?.id);
  }
}

let ok = 0;
const missing: string[] = [];
for (const e of entries) {
  const found = await payload.find({
    collection: e.type as any,
    where: { contentfulId: { equals: e.id } },
    limit: 1,
    depth: 0,
    draft: true,
    overrideAccess: true,
  });
  const doc = found.docs[0];
  if (!doc) {
    missing.push(`${e.type}/${e.id}`);
    continue;
  }
  const data: Record<string, any> = {};
  for (const f of e.fields) {
    if (f.kind === 'richText') {
      const cf = mdToCf(f.value);
      const assetIds: string[] = [];
      JSON.stringify(cf, (k, v) => (k === 'id' && typeof v === 'string' ? (assetIds.push(v), v) : v));
      await mediaIds(assetIds);
      data[f.id] = cfToLexical(cf, { mediaId: (id) => mediaCache.get(id) });
    } else data[f.id] = f.value;
  }
  if (!dry) {
    await payload.update({
      collection: e.type as any,
      id: doc.id,
      locale: locale as any,
      data,
      draft: true,
      overrideAccess: true,
      context: { skipRevalidate: true },
    });
  }
  ok++;
}
console.log(`${path.basename(file)} → ${locale}: ${ok} хуудас${dry ? ' (dry run, бичээгүй)' : ' ноорог болгон хадгаллаа'}`);
if (missing.length) console.log(`Payload-д олдоогүй (${missing.length}): ${missing.join(', ')}`);
process.exit(0);

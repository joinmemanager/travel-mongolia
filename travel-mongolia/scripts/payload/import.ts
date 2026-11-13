// Contentful экспорт → Payload. Дахин ажиллуулахад давхардахгүй (contentfulId-аар тулгана), өөрчлөгдөөгүйг алгасна.
//   node scripts/payload/cli.mjs run scripts/payload/import.ts [--export <dir>] [--only media|entries] [--types a,b] [--force] [--limit N]
// Contentful руу API хүсэлт илгээхгүй: локал экспортыг уншина. Зургийн файлыг images.ctfassets.net-ээс НЭГ удаа
// татаж backups/asset-files/-д кэшлэнэ (Asset bandwidth, API хүсэлтэд тооцогдохгүй).
//
// Төлөв:
//   published → CDA-ийн (нийтлэгдсэн) утгаар нийтэлнэ
//   changed   → эхлээд CDA-ийн утгаар нийтэлж, дараа нь CMA-ийн (ноорог) утгыг ноорог хувилбар болгон хадгална
//   draft     → CMA-ийн утгаар ноорог
//   archived  → алгасна (тайланд)
// Хоёр үе шат: (A) байхгүй doc-уудыг ноорог placeholder болгон үүсгэнэ (холбоосын бүх зорилго бэлэн болохын тулд),
// (B) бүх талбарыг бичнэ. Зургууд эхэлж (rich text-ийн upload node-д media id хэрэгтэй).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

import { getPayload } from 'payload';

import config from '@payload-config';

import { cfToLexical } from '../../lib/cms/richText';
import { CF_SCHEMA, type CfField } from '../../payload/cfSchema';

const require = createRequire(import.meta.url);
const REPO = path.resolve(process.cwd(), '..');
const { loadExport, statusOf } = require(path.join(REPO, 'scripts/payload/lib/export.js'));

const args = process.argv.slice(2);
const arg = (n: string) => (args.includes(n) ? args[args.indexOf(n) + 1] : undefined);
const ex = loadExport(arg('--export'));
const ONLY = arg('--only');
const TYPES = arg('--types')?.split(',');
const FORCE = args.includes('--force');
const LIMIT = Number(arg('--limit') || Infinity);
const CACHE = path.join(REPO, 'backups', 'asset-files');
const ctx = { skipRevalidate: true };

const payload = await getPayload({ config });
const log = { started: new Date().toISOString(), export: path.basename(ex.dir), media: { created: 0, updated: 0, skipped: 0, failed: [] as string[] }, entries: {} as Record<string, any>, warnings: [] as string[] };
const warn = (s: string) => {
  if (log.warnings.length < 2000) log.warnings.push(s);
};

// Байгаа doc-ууд: contentfulId → { id, cfVersion, cfFileUrl, _status }
async function existing(collection: string) {
  const res = await payload.find({
    collection: collection as any,
    pagination: false,
    depth: 0,
    draft: true,
    overrideAccess: true,
    select: { contentfulId: true, cfVersion: true, cfFileUrl: true, _status: true } as any,
  });
  return new Map<string, any>(res.docs.map((d: any) => [d.contentfulId, d]));
}

const mn = (f: any) => f?.mn ?? undefined;

// ---------------------------------------------------------------- 1. Зураг
const mediaId = new Map<string, number | string>();

async function download(url: string, dest: string) {
  if (fs.existsSync(dest) && fs.statSync(dest).size > 0) return;
  const res = await fetch(url.startsWith('//') ? `https:${url}` : url);
  if (!res.ok) throw new Error(`татаж чадсангүй ${res.status}`);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

async function importMedia() {
  const have = await existing('media');
  for (const [cfId, d] of have) mediaId.set(cfId, d.id);
  if (ONLY === 'entries') return;
  let n = 0;
  for (const a of ex.assets) {
    if (n++ >= LIMIT) break;
    const pub = ex.publishedAssetById.get(a.sys.id);
    // Сайт одоо харуулж буй (нийтлэгдсэн) утгыг; хэзээ ч нийтлэгдээгүй бол хамгийн сүүлийнхийг
    const src = pub || a;
    const file = mn(src.fields.file) || Object.values(src.fields.file || {})[0];
    if (!file?.url) {
      log.media.failed.push(`${a.sys.id}: файлгүй`);
      continue;
    }
    const data = {
      contentfulId: a.sys.id,
      title: mn(src.fields.title) || '',
      description: mn(src.fields.description) || '',
      cfCreatedAt: a.sys.createdAt,
      cfFileUrl: file.url,
    };
    const prev = have.get(a.sys.id);
    try {
      if (prev && prev.cfFileUrl === file.url) {
        if (FORCE) {
          await payload.update({ collection: 'media', id: prev.id, data, locale: 'mn', overrideAccess: true, context: ctx });
          log.media.updated++;
        } else log.media.skipped++;
        continue;
      }
      const local = path.join(CACHE, `${a.sys.id}-${file.fileName}`.replace(/[^\w.\-]+/g, '_'));
      await download(file.url, local);
      const doc = prev
        ? await payload.update({ collection: 'media', id: prev.id, data, filePath: local, locale: 'mn', overrideAccess: true, context: ctx })
        : await payload.create({ collection: 'media', data, filePath: local, locale: 'mn', overrideAccess: true, context: ctx });
      mediaId.set(a.sys.id, doc.id);
      // Англи alt/тайлбар Contentful-д байвал
      if (src.fields.title?.en || src.fields.description?.en) {
        await payload.update({
          collection: 'media',
          id: doc.id,
          locale: 'en',
          data: { title: src.fields.title?.en, description: src.fields.description?.en },
          overrideAccess: true,
          context: ctx,
        });
      }
      prev ? log.media.updated++ : log.media.created++;
    } catch (err: any) {
      log.media.failed.push(`${a.sys.id}: ${err.message}`);
    }
    if ((log.media.created + log.media.updated) % 100 === 0) console.log(`зураг: +${log.media.created} ~${log.media.updated} =${log.media.skipped}`);
  }
}

// ---------------------------------------------------------------- 2. Entry
const docId = new Map<string, { collection: string; id: number | string }>();

function linkTarget(link: any) {
  return link?.sys?.id ? docId.get(link.sys.id) : undefined;
}

function convert(f: CfField, v: any, where: string): any {
  if (v === undefined || v === null) return undefined;
  switch (f.kind) {
    case 'richText':
      return (
        cfToLexical(v, {
          mediaId: (id) => {
            const m = mediaId.get(id);
            if (m === undefined) warn(`${where}: rich text-ийн зураг ${id} олдсонгүй (эхээр нь хадгалав)`);
            return m;
          },
        }) ?? undefined
      );
    case 'date':
      return /^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T00:00:00.000Z` : v;
    case 'location':
      return { lat: v.lat, lon: v.lon };
    case 'upload': {
      const one = (l: any) => {
        const m = mediaId.get(l?.sys?.id);
        if (m === undefined) warn(`${where}: зураг ${l?.sys?.id} олдсонгүй`);
        return m;
      };
      return f.hasMany ? (v as any[]).map(one).filter((x) => x !== undefined) : one(v);
    }
    case 'relationship': {
      const poly = (f.relationTo?.length || 0) > 1;
      const one = (l: any) => {
        const t = linkTarget(l);
        if (!t) {
          warn(`${where}: холбоос ${l?.sys?.id} олдсонгүй (устгагдсан/архивласан?)`);
          return undefined;
        }
        return poly ? { relationTo: t.collection, value: t.id } : t.id;
      };
      return f.hasMany ? (v as any[]).map(one).filter((x) => x !== undefined) : one(v);
    }
    default:
      return v;
  }
}

function dataFor(collection: string, entry: any, locale: string, sys: any) {
  const data: Record<string, any> = {};
  for (const f of CF_SCHEMA[collection].fields) {
    if (locale !== 'mn' && !f.localized) continue;
    const raw = entry.fields[f.id]?.[locale];
    if (raw === undefined) {
      // Contentful-д утгагүй талбарыг Payload-д хоосолно (дахин импортод хуучин утга үлдэхгүй)
      if (locale === 'mn') data[f.id] = f.hasMany ? [] : null;
      continue;
    }
    data[f.id] = convert(f, raw, `${collection}/${sys.id}.${f.id}`);
  }
  if (locale === 'mn') {
    Object.assign(data, {
      contentfulId: sys.id,
      cfCreatedAt: sys.createdAt,
      cfFirstPublishedAt: sys.firstPublishedAt || null,
      cfVersion: sys.version,
    });
  }
  return data;
}

async function write(collection: string, id: any, entry: any, sys: any, draft: boolean) {
  // Drafts идэвхтэй collection-д нийтлэхийн тулд _status: 'published' заавал (draft: false дангаараа нийтэлдэггүй)
  const mnData = { ...dataFor(collection, entry, 'mn', sys), _status: draft ? 'draft' : 'published' };
  await payload.update({ collection: collection as any, id, locale: 'mn', data: mnData, draft, overrideAccess: true, context: ctx });
  const hasEn = Object.values<any>(entry.fields).some((v) => v && typeof v === 'object' && 'en' in v);
  if (hasEn) {
    const enData = { ...dataFor(collection, entry, 'en', sys), _status: draft ? 'draft' : 'published' };
    await payload.update({ collection: collection as any, id, locale: 'en', data: enData, draft, overrideAccess: true, context: ctx });
  }
}

async function importEntries() {
  const types = Object.keys(CF_SCHEMA).filter((t) => !TYPES || TYPES.includes(t));
  const have: Record<string, Map<string, any>> = {};
  for (const t of Object.keys(CF_SCHEMA)) {
    have[t] = await existing(t);
    for (const [cfId, d] of have[t]) docId.set(cfId, { collection: t, id: d.id });
  }

  // (A) placeholder: байхгүй бүх doc-ыг ноорог болгон (заавал талбарыг шалгахгүй)
  for (const e of ex.entries) {
    const t = e.sys.contentType.sys.id;
    if (!types.includes(t) || docId.has(e.sys.id) || statusOf(e.sys) === 'archived') continue;
    const doc = await payload.create({
      collection: t as any,
      data: { contentfulId: e.sys.id, cfCreatedAt: e.sys.createdAt } as any,
      draft: true,
      overrideAccess: true,
      context: ctx,
    });
    docId.set(e.sys.id, { collection: t, id: doc.id });
  }

  // (B) бүтэн утга
  let n = 0;
  for (const e of ex.entries) {
    const t = e.sys.contentType.sys.id;
    if (!types.includes(t)) continue;
    if (n++ >= LIMIT) break;
    const st = (log.entries[t] ||= { published: 0, changed: 0, draft: 0, archived: 0, skipped: 0, failed: [] as string[] });
    const status = statusOf(e.sys);
    if (status === 'archived') {
      st.archived++;
      continue;
    }
    const target = docId.get(e.sys.id)!;
    const prev = have[t].get(e.sys.id);
    if (!FORCE && prev && prev.cfVersion === e.sys.version && prev._status === (status === 'published' ? 'published' : 'draft')) {
      st.skipped++;
      continue;
    }
    try {
      if (status === 'draft') {
        await write(t, target.id, e, e.sys, true);
      } else {
        const pub = ex.publishedEntryById.get(e.sys.id);
        if (!pub) throw new Error('CDA экспортод нийтлэгдсэн хувилбар алга');
        await write(t, target.id, pub, { ...e.sys, version: e.sys.version }, false);
        if (status === 'changed') await write(t, target.id, e, e.sys, true);
      }
      st[status]++;
    } catch (err: any) {
      st.failed.push(`${e.sys.id}: ${String(err.message).slice(0, 300)}`);
    }
    if (n % 200 === 0) console.log(`entry: ${n}/${ex.entries.length}`);
  }
}

if (ONLY !== 'entries') console.log('1/2 зураг…');
await importMedia();
if (ONLY !== 'media') {
  console.log('2/2 entry…');
  await importEntries();
}
(log as any).finished = new Date().toISOString();
const out = path.join(REPO, 'backups', `payload-import-${new Date().toISOString().slice(0, 19).replace(/:/g, '')}.json`);
fs.writeFileSync(out, JSON.stringify(log, null, 1));
console.log(JSON.stringify({ media: { ...log.media, failed: log.media.failed.length }, entries: Object.fromEntries(Object.entries(log.entries).map(([k, v]: any) => [k, { ...v, failed: v.failed.length }])), warnings: log.warnings.length }, null, 1));
console.log('Тайлан:', path.relative(REPO, out));
process.exit(0);

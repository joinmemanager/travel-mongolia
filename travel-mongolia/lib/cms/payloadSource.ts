import { getPayload, type Where } from 'payload';

import config from '@payload-config';
import { CF_SCHEMA, type CfField } from '@/payload/cfSchema';

import { lexicalToCf } from './richText';

// Payload-ийн өгөгдлийг Contentful-ийн CDA хариуны хэлбэрт (withoutLinkResolution: items + includes) буулгана.
// lib/contentful.ts энэ хариуг одоогийнхоо адил resolveResponse-оор холбоно, тиймээс lib/*.ts, хуудсууд,
// rich text рендерерүүд өөрчлөгдөхгүй. Дэмждэг query (кодонд ашиглагддаг бүгд, 2026-11-12):
//   content_type, sys.id, sys.id[in], fields.X, fields.X[in|nin|ne|exists], fields.X.sys.id,
//   order ('-sys.createdAt', 'fields.title', массив), select, include, limit, skip, locale.
// sys.id = Contentful-ийн хуучин ID (contentfulId), шинэ doc-д Payload-ийн id. Ингэснээр entry ID-тай
// хаягууд (/destination/<id>, /recommendation/<id>) болон кодонд бичигдсэн asset ID-ууд хэвээр.

type Query = Record<string, any>;
type Link = { sys: { type: 'Link'; linkType: 'Entry' | 'Asset'; id: string } };

const link = (linkType: 'Entry' | 'Asset', id: string): Link => ({ sys: { type: 'Link', linkType, id } });
const entryId = (doc: any) => doc?.contentfulId || String(doc?.id);
const assetId = (doc: any) => doc?.contentfulId || `payload-media-${doc?.id}`;

// Payload-ийн date (UTC ISO) → Contentful-ийн 'YYYY-MM-DD' (Улаанбаатарын цагаар, +08:00)
const ubDate = (v: string) => new Date(new Date(v).getTime() + 8 * 3600_000).toISOString().slice(0, 10);

// Contentful-ийн include-тэй ижил: items = түвшин 0; include=N бол N түвшин хүртэлх холбоосын entry/asset-ийг includes-д
// оруулна. Payload-аас нэг түвшин гүн (depth = include + 1) уншдаг тул сүүлийн түвшний холбоос ч зөв sys.id-тай
// (Contentful-ийн ID) буцна — include: 0 үед ч (Contentful ч мөн ID-г өгдөг).
class Collector {
  entries = new Map<string, any>();
  assets = new Map<string, any>();
  locale: string;
  include: number;
  constructor(locale: string, include: number) {
    this.locale = locale;
    this.include = include;
  }

  asset(m: any, level: number): Link | null {
    if (m == null) return null;
    if (typeof m !== 'object') return link('Asset', `payload-media-${m}`);
    const id = assetId(m);
    if (level <= this.include && !this.assets.has(id)) {
      this.assets.set(id, {
        sys: { id, type: 'Asset', createdAt: m.cfCreatedAt || m.createdAt, updatedAt: m.updatedAt, locale: this.locale },
        fields: {
          ...(m.title ? { title: m.title } : {}),
          ...(m.description ? { description: m.description } : {}),
          file: {
            url: m.url,
            fileName: m.filename,
            contentType: m.mimeType,
            details: { size: m.filesize, ...(m.width ? { image: { width: m.width, height: m.height } } : {}) },
          },
        },
      });
    }
    return link('Asset', id);
  }

  entry(collection: string, doc: any, level: number): Link | null {
    if (doc == null) return null;
    if (typeof doc !== 'object') return link('Entry', String(doc));
    const id = entryId(doc);
    if (level <= this.include && !this.entries.has(id)) {
      this.entries.set(id, null); // тойрог холбоосоос хамгаална
      this.entries.set(id, this.toEntry(collection, doc, level));
    }
    return link('Entry', id);
  }

  relation(f: CfField, v: any, level: number): Link | null {
    // Олон төрөлтэй (polymorphic) холбоос: { relationTo, value }
    if (v && typeof v === 'object' && 'relationTo' in v && 'value' in v) return this.entry(v.relationTo, v.value, level);
    return this.entry(f.relationTo![0], v, level);
  }

  // level = энэ талбарыг агуулж буй entry-ийн түвшин; түүний холбоосууд level + 1
  value(f: CfField, v: any, level: number): any {
    if (v == null) return undefined;
    switch (f.kind) {
      case 'richText':
        return (
          lexicalToCf(v, {
            assetId: (m: any) => this.asset(m, level + 1)?.sys.id,
          }) ?? undefined
        );
      case 'upload':
        if (f.hasMany) return (v as any[]).map((m) => this.asset(m, level + 1)).filter(Boolean);
        return this.asset(v, level + 1) ?? undefined;
      case 'relationship':
        if (f.hasMany) return (v as any[]).map((r) => this.relation(f, r, level + 1)).filter(Boolean);
        // Payload олон төрөлтэй ганц холбоосыг заримдаа 1 элементтэй массиваар буцаадаг
        return this.relation(f, Array.isArray(v) ? v[0] : v, level + 1) ?? undefined;
      case 'location':
        return v.lat != null && v.lon != null ? { lat: v.lat, lon: v.lon } : undefined;
      case 'date':
        return ubDate(v);
      default:
        return v;
    }
  }

  toEntry(collection: string, doc: any, level = 0) {
    const type = CF_SCHEMA[collection];
    const fields: Record<string, any> = {};
    for (const f of type?.fields || []) {
      const v = this.value(f, doc[f.id], level);
      if (v === undefined || v === '' || (Array.isArray(v) && !v.length)) continue;
      fields[f.id] = v;
    }
    if (doc.publishedLocales?.length) fields.publishedLocales = doc.publishedLocales;
    return {
      metadata: { tags: [] },
      sys: {
        id: entryId(doc),
        type: 'Entry',
        createdAt: doc.cfCreatedAt || doc.createdAt,
        updatedAt: doc.updatedAt,
        locale: this.locale,
        contentType: { sys: { type: 'Link', linkType: 'ContentType', id: collection } },
      },
      fields,
    };
  }
}

// Payload олон төрөлтэй ганц холбоосыг (visitorGuidance.place г.м.) depth-тэй ч populate хийлгүй { relationTo, value: id }
// хэлбэрээр буцаадаг. Тийм утгуудын doc-ийг collection тус бүрээр НЭГ query-гээр татаж орлуулна (Contentful-ийн ID хэрэгтэй).
async function hydrateBareRelations(payload: any, collection: string, docs: any[]) {
  const want = new Map<string, Set<number | string>>();
  const fields = (CF_SCHEMA[collection]?.fields || []).filter((f) => f.kind === 'relationship');
  const visit = (cb: (rel: any) => void) => {
    for (const d of docs)
      for (const f of fields) {
        const v = d[f.id];
        for (const r of Array.isArray(v) ? v : [v]) if (r && typeof r === 'object' && 'relationTo' in r && r.value != null && typeof r.value !== 'object') cb(r);
      }
  };
  visit((r) => {
    if (!want.has(r.relationTo)) want.set(r.relationTo, new Set());
    want.get(r.relationTo)!.add(r.value);
  });
  if (!want.size) return;
  const found = new Map<string, any>();
  for (const [rel, ids] of want) {
    const res = await payload.find({ collection: rel, where: { id: { in: [...ids] } }, limit: ids.size, depth: 0, draft: true, overrideAccess: true });
    for (const d of res.docs) found.set(`${rel}:${d.id}`, d);
  }
  visit((r) => {
    const d = found.get(`${r.relationTo}:${r.value}`);
    if (d) r.value = d;
  });
}

// ----------------------------------------------------------------- query → Payload where

async function payloadIdsFor(payload: any, collections: string[], cfIds: string[]): Promise<(number | string)[]> {
  const ids: (number | string)[] = [];
  for (const collection of collections) {
    const res = await payload.find({
      collection,
      where: { contentfulId: { in: cfIds } },
      limit: cfIds.length,
      depth: 0,
      draft: true,
      overrideAccess: true,
      select: { contentfulId: true },
    });
    ids.push(...res.docs.map((d: any) => d.id));
  }
  // Payload-д шинээр үүссэн doc-ийн sys.id нь өөрийн id
  ids.push(...cfIds.filter((x) => /^\d+$/.test(x)).map(Number));
  return ids;
}

const listOf = (v: any): string[] => (Array.isArray(v) ? v : String(v).split(',')).map((x) => String(x).trim()).filter(Boolean);

function sysIdWhere(values: string[]): Where {
  const numeric = values.filter((x) => /^\d+$/.test(x)).map(Number);
  return { or: [{ contentfulId: { in: values } }, ...(numeric.length ? [{ id: { in: numeric } }] : [])] };
}

async function buildWhere(payload: any, collection: string, query: Query, draft: boolean): Promise<Where> {
  const and: Where[] = [];
  if (!draft) and.push({ _status: { equals: 'published' } });
  const schema = CF_SCHEMA[collection];
  for (const [key, raw] of Object.entries(query)) {
    if (key === 'sys.id') and.push(sysIdWhere([String(raw)]));
    else if (key === 'sys.id[in]') and.push(sysIdWhere(listOf(raw)));
    else {
      const m = key.match(/^fields\.([A-Za-z0-9_]+)(\.sys\.id)?(?:\[(in|nin|ne|exists)\])?$/);
      if (!m) continue;
      const [, name, isLink, op] = m;
      // publishedLocales: Contentful-д байхгүй, Payload-ийн системийн талбар (payload/collections.ts) — sitemaps/[file]
      const f = name === 'publishedLocales' ? ({ id: name, kind: 'select' } as any) : schema?.fields.find((x) => x.id === name);
      if (!f) {
        // Схемд байхгүй талбар: Contentful 400 буцаадаг байсан → хоосон үр дүн
        and.push({ id: { equals: -1 } });
        continue;
      }
      let values: any[] = op === 'in' || op === 'nin' ? listOf(raw) : [raw];
      const path = f.kind === 'relationship' && (f.relationTo?.length || 0) > 1 ? `${name}.value` : name;
      if (isLink) values = await payloadIdsFor(payload, f.relationTo || ['media'], values.map(String));
      if (f.kind === 'number') values = values.map(Number);
      if (f.kind === 'checkbox') values = values.map((v) => v === true || v === 'true');
      if (op === 'exists') and.push({ [path]: { exists: raw === true || raw === 'true' } });
      else if (op === 'in') and.push({ [path]: { in: values } });
      else if (op === 'nin') and.push({ or: [{ [path]: { not_in: values } }, { [path]: { exists: false } }] });
      // Contentful-ийн [ne] нь талбаргүй entry-г ч оруулдаг (SQL-ийн != нь NULL-ийг хасдаг)
      else if (op === 'ne') and.push({ or: [{ [path]: { not_equals: values[0] } }, { [path]: { exists: false } }] });
      else if (isLink && !values.length) and.push({ id: { equals: -1 } });
      else and.push(isLink ? { [path]: { in: values } } : { [path]: { equals: values[0] } });
    }
  }
  return and.length ? { and } : {};
}

function sortOf(order: any): string[] | undefined {
  if (!order) return undefined;
  return listOf(order).map((o) => {
    const desc = o.startsWith('-');
    const k = o.replace(/^-/, '');
    const field = k === 'sys.createdAt' ? 'cfCreatedAt' : k === 'sys.updatedAt' ? 'updatedAt' : k === 'sys.id' ? 'contentfulId' : k.replace(/^fields\./, '');
    return `${desc ? '-' : ''}${field}`;
  });
}

function selectOf(select: any): Record<string, true> | undefined {
  if (!select) return undefined;
  const out: Record<string, true> = { contentfulId: true, cfCreatedAt: true, publishedLocales: true, _status: true, updatedAt: true, createdAt: true };
  for (const s of listOf(select)) if (s.startsWith('fields.')) out[s.slice(7).split('.')[0]] = true;
  return out;
}

export interface PayloadQueryOptions {
  locale: string;
  draft: boolean;
}

export async function payloadGetEntries(query: Query, { locale, draft }: PayloadQueryOptions) {
  const collection = query.content_type as string;
  const limit = Math.min(Number(query.limit ?? 100), 1000);
  const skip = Number(query.skip ?? 0);
  const empty = { sys: { type: 'Array' }, total: 0, skip, limit, items: [], includes: {} };
  if (!collection || !CF_SCHEMA[collection]) return empty;

  // Contentful-ийн анхдагч include = 1, дээд хязгаар 10 (энд 3)
  const include = Math.min(Number(query.include ?? 1), 3);
  const payload = await getPayload({ config });
  const where = await buildWhere(payload, collection, query, draft);
  const aligned = skip % limit === 0;
  const res = await payload.find({
    collection: collection as any,
    where,
    // order-гүй query: Contentful-ийн дараалал тодорхойгүй тул тогтмол — шинэ нь эхэндээ (snapshotSource-тэй ижил)
    sort: sortOf(query.order || '-sys.createdAt,sys.id') as any,
    limit: aligned ? limit : skip + limit,
    page: aligned ? Math.floor(skip / limit) + 1 : 1,
    depth: include + 1,
    locale: (query.locale as any) || locale,
    fallbackLocale: 'mn',
    draft,
    overrideAccess: true,
    select: selectOf(query.select) as any,
  });
  const docs = aligned ? res.docs : res.docs.slice(skip);
  await hydrateBareRelations(payload, collection, docs);

  const c = new Collector(locale, include);
  const items = docs.map((d: any) => c.toEntry(collection, d));
  const itemIds = new Set(items.map((i: any) => i.sys.id));
  return {
    sys: { type: 'Array' },
    total: res.totalDocs,
    skip,
    limit,
    items,
    includes: {
      Entry: [...c.entries.values()].filter((e) => e && !itemIds.has(e.sys.id)),
      Asset: [...c.assets.values()],
    },
  };
}

// Хуудас тухайн хэлээр нийтлэгдсэн эсэх (/en/... хуудас, хэлний sitemap)
export const isPublishedIn = (entry: any, locale: string) =>
  locale === 'mn' || (Array.isArray(entry?.fields?.publishedLocales) && entry.fields.publishedLocales.includes(locale));

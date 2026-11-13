import fs from 'fs';
import path from 'path';

// Локал Contentful экспортыг (scripts/payload/export-contentful.js) Contentful CDA-ийн хариуны хэлбэрээр өгнө.
// CMS_SOURCE=snapshot (CF_SNAPSHOT_DIR=<экспорт хавтас>). Зөвхөн локал тулгалтад: хуучин (Contentful) өгөгдлийг
// Contentful руу нэг ч хүсэлт явуулахгүйгээр сайтын ижил кодоор рендерлэж, Payload-ийнхтэй харьцуулна
// (scripts/payload/verify.ts, compare-urls). Query-ийн утга нь lib/cms/payloadSource.ts-тэй ижил.

type Query = Record<string, any>;
type Snap = { entries: any[]; assets: any[]; byId: Map<string, any>; assetById: Map<string, any> };

const cache = new Map<string, Snap>();

function load(draft: boolean): Snap {
  const dir = process.env.CF_SNAPSHOT_DIR;
  if (!dir) throw new Error('CF_SNAPSHOT_DIR тохируулаагүй');
  const key = `${dir}|${draft}`;
  if (!cache.has(key)) {
    const read = (f: string) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    // draft: CMA (хамгийн сүүлийн, ноорогтой), эс бөгөөс CDA (нийтлэгдсэн)
    const entries = read(draft ? 'entries.cma.json' : 'entries.cda.json').filter((e: any) => !e.sys.archivedVersion);
    const assets = read(draft ? 'assets.cma.json' : 'assets.cda.json');
    cache.set(key, { entries, assets, byId: new Map(entries.map((e: any) => [e.sys.id, e])), assetById: new Map(assets.map((a: any) => [a.sys.id, a])) });
  }
  return cache.get(key)!;
}

// locale=* хэлбэрийн талбарыг нэг хэл рүү (fallback mn)
function localize(item: any, locale: string) {
  const fields: Record<string, any> = {};
  for (const [k, v] of Object.entries<any>(item.fields || {})) {
    const val = v?.[locale] ?? v?.mn;
    if (val !== undefined) fields[k] = val;
  }
  return { ...item, sys: { ...item.sys, locale }, fields };
}

const listOf = (v: any): string[] => (Array.isArray(v) ? v : String(v).split(',')).map((x) => String(x).trim()).filter(Boolean);
const linkId = (v: any) => (v && typeof v === 'object' ? v.sys?.id : undefined);

function matches(e: any, query: Query): boolean {
  for (const [key, raw] of Object.entries(query)) {
    if (key === 'sys.id' && e.sys.id !== String(raw)) return false;
    if (key === 'sys.id[in]' && !listOf(raw).includes(e.sys.id)) return false;
    const m = key.match(/^fields\.([A-Za-z0-9_]+)(\.sys\.id)?(?:\[(in|nin|ne|exists)\])?$/);
    if (!m) continue;
    const [, name, isLink, op] = m;
    let v = e.fields[name];
    if (isLink) v = Array.isArray(v) ? v.map(linkId) : linkId(v);
    const vals = Array.isArray(v) ? v.map(String) : v === undefined || v === null ? [] : [String(v)];
    if (op === 'exists') {
      if ((vals.length > 0) !== (raw === true || raw === 'true')) return false;
    } else if (op === 'in') {
      if (!listOf(raw).some((x) => vals.includes(x))) return false;
    } else if (op === 'nin') {
      if (listOf(raw).some((x) => vals.includes(x))) return false;
    } else if (op === 'ne') {
      if (vals.includes(String(raw))) return false;
    } else if (!vals.includes(String(raw))) return false;
  }
  return true;
}

function compare(order: any) {
  const keys = order ? listOf(order) : [];
  return (a: any, b: any) => {
    for (const k of keys) {
      const desc = k.startsWith('-');
      const p = k.replace(/^-/, '');
      const get = (x: any) => (p.startsWith('sys.') ? x.sys[p.slice(4)] : x.fields[p.replace(/^fields\./, '')]);
      const va = get(a);
      const vb = get(b);
      if (va === vb) continue;
      if (va === undefined || va === null) return 1;
      if (vb === undefined || vb === null) return -1;
      const c = typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb));
      if (c) return desc ? -c : c;
    }
    return 0;
  };
}

export async function snapshotGetEntries(query: Query, { locale, draft }: { locale: string; draft: boolean }) {
  const snap = load(draft);
  const limit = Math.min(Number(query.limit ?? 100), 1000);
  const skip = Number(query.skip ?? 0);
  const all = snap.entries
    .filter((e) => !query.content_type || e.sys.contentType.sys.id === query.content_type)
    .map((e) => localize(e, (query.locale as string) || locale))
    .filter((e) => matches(e, query))
    .sort(compare(query.order));
  let items = all.slice(skip, skip + limit);
  if (query.select) {
    const keep = new Set(listOf(query.select).filter((s) => s.startsWith('fields.')).map((s) => s.slice(7)));
    items = items.map((e) => ({ ...e, fields: Object.fromEntries(Object.entries(e.fields).filter(([k]) => keep.has(k))) }));
  }

  // include: холбоосуудыг include түвшин хүртэл цуглуулна
  const depth = Number(query.include ?? 1);
  const inc = { Entry: new Map<string, any>(), Asset: new Map<string, any>() };
  const itemIds = new Set(items.map((e) => e.sys.id));
  const visit = (node: any, level: number) => {
    if (level > depth || !node || typeof node !== 'object') return;
    if (Array.isArray(node)) return node.forEach((n) => visit(n, level));
    if (node.sys?.type === 'Link') {
      const id = node.sys.id;
      if (node.sys.linkType === 'Asset' && !inc.Asset.has(id) && snap.assetById.has(id)) inc.Asset.set(id, localize(snap.assetById.get(id), locale));
      if (node.sys.linkType === 'Entry' && !inc.Entry.has(id) && !itemIds.has(id) && snap.byId.has(id)) {
        const linked = localize(snap.byId.get(id), locale);
        inc.Entry.set(id, linked);
        visit(linked.fields, level + 1);
      }
      return;
    }
    Object.values(node).forEach((v) => visit(v, level));
  };
  items.forEach((e) => visit(e.fields, 1));
  return {
    sys: { type: 'Array' },
    total: all.length,
    skip,
    limit,
    items,
    includes: { Entry: [...inc.Entry.values()], Asset: [...inc.Asset.values()] },
  };
}

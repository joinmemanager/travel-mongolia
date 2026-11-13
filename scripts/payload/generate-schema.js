// Contentful-ийн content type-уудаас Payload-ийн схемийг үүсгэнэ → travel-mongolia/payload/cfSchema.ts
// (commit-лэгдэнэ, гараар засаж болно). Contentful руу хүсэлт илгээхгүй, локал экспортыг уншина.
//   node scripts/payload/generate-schema.js
//
// Дүрэм:
// - Contentful-д localized (🌐) талбар → Payload localized (гарчиг, текст, rich text, SEO, жагсаалт текст).
//   Slug, ангилал, холбоос, зураг, тоо, огноо localized биш (хэл бүрт ижил).
// - `in` хязгаарлалттай Symbol → select (өгөгдөл бүгд жагсаалтад багтвал), үгүй бол text.
// - Хязгаарлалтгүй Array<Link→Entry> → өгөгдөлд байгаа төрлүүдээр relationTo.
// - Хоосон (0 entry-д утгагүй) талбарыг ч хадгална: кодонд уншдаг талбар байж болно.
const fs = require('fs');
const path = require('path');
const { loadExport, ROOT } = require('./lib/export');

const ex = loadExport(process.argv[2]);
const byType = {};
for (const e of ex.entries) (byType[e.sys.contentType.sys.id] ||= []).push(e);

const warnings = [];

function linkTypes(fieldDef, ctId, fieldId) {
  const v = (fieldDef.validations || []).find((x) => x.linkContentType);
  if (v) return v.linkContentType;
  const seen = new Set();
  for (const e of byType[ctId] || []) {
    for (const val of Object.values(e.fields[fieldId] || {})) {
      for (const link of Array.isArray(val) ? val : [val]) {
        const t = ex.entryById.get(link?.sys?.id);
        if (t) seen.add(t.sys.contentType.sys.id);
      }
    }
  }
  if (!seen.size) warnings.push(`${ctId}.${fieldId}: холбоосын төрөл тодорхойгүй`);
  return [...seen].sort();
}

function fieldOf(ct, f) {
  const base = { id: f.id, name: f.name, localized: !!f.localized, required: !!f.required };
  const vals = [...(f.validations || []), ...(f.items?.validations || [])];
  const inList = vals.find((v) => v.in)?.in;
  const unique = vals.some((v) => v.unique);
  const maxLen = vals.find((v) => v.size?.max)?.size?.max;
  if (unique) base.unique = true;
  if (maxLen) base.maxLength = maxLen; // зөвхөн admin-ий санамж (импортыг хаахгүйн тулд validate хийхгүй)

  switch (f.type) {
    case 'Symbol': {
      if (inList) {
        const bad = new Set();
        for (const e of byType[ct.sys.id] || [])
          for (const v of Object.values(e.fields[f.id] || {})) if (v != null && !inList.includes(v)) bad.add(v);
        if (!bad.size) return { ...base, kind: 'select', options: inList };
        warnings.push(`${ct.sys.id}.${f.id}: жагсаалтаас гадуур утга (${[...bad].join(', ')}) → text`);
      }
      return { ...base, kind: 'text' };
    }
    case 'Text':
      return { ...base, kind: 'textarea' };
    case 'RichText':
      return { ...base, kind: 'richText' };
    case 'Integer':
    case 'Number':
      return { ...base, kind: 'number', integer: f.type === 'Integer' };
    case 'Boolean':
      return { ...base, kind: 'checkbox' };
    case 'Date':
      return { ...base, kind: 'date' };
    case 'Location':
      return { ...base, kind: 'location' };
    case 'Object':
      return { ...base, kind: 'json' };
    case 'Link':
      if (f.linkType === 'Asset') return { ...base, kind: 'upload' };
      return { ...base, kind: 'relationship', relationTo: linkTypes(f, ct.sys.id, f.id) };
    case 'Array':
      if (f.items.type === 'Symbol') return { ...base, kind: 'text', hasMany: true };
      if (f.items.linkType === 'Asset') return { ...base, kind: 'upload', hasMany: true };
      return { ...base, kind: 'relationship', hasMany: true, relationTo: linkTypes(f.items, ct.sys.id, f.id) };
    default:
      warnings.push(`${ct.sys.id}.${f.id}: танихгүй төрөл ${f.type}`);
      return { ...base, kind: 'json' };
  }
}

const schema = {};
for (const ct of ex.contentTypes.slice().sort((a, b) => a.sys.id.localeCompare(b.sys.id))) {
  schema[ct.sys.id] = {
    name: ct.name,
    displayField: ct.displayField || 'title',
    fields: ct.fields.filter((f) => !f.disabled && !f.omitted).map((f) => fieldOf(ct, f)),
  };
}

const header = `// ҮҮСГЭСЭН ФАЙЛ: scripts/payload/generate-schema.js (Contentful-ийн content type-уудаас, ${path.basename(ex.dir)}).
// Payload-ийн collection-ууд (payload/collections.ts), импорт (scripts/payload/import.ts) болон
// Contentful хэлбэрийн өгөгдлийн давхарга (lib/cms/payloadSource.ts) энэ нэг схемийг ашиглана.
// Гараар засаж болно; дахин үүсгэвэл засвар дарагдана.

export type CfFieldKind =
  | 'text'
  | 'textarea'
  | 'richText'
  | 'number'
  | 'checkbox'
  | 'date'
  | 'location'
  | 'json'
  | 'select'
  | 'upload'
  | 'relationship';

export interface CfField {
  id: string;
  name: string;
  kind: CfFieldKind;
  localized: boolean;
  required: boolean;
  unique?: boolean;
  maxLength?: number;
  hasMany?: boolean;
  integer?: boolean;
  options?: string[];
  relationTo?: string[];
}

export interface CfType {
  name: string;
  displayField: string;
  fields: CfField[];
}

export const CF_SCHEMA: Record<string, CfType> = `;

const target = path.join(ROOT, 'travel-mongolia', 'payload', 'cfSchema.ts');
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, header + JSON.stringify(schema, null, 2) + ';\n');
console.log(`→ ${path.relative(ROOT, target)}: ${Object.keys(schema).length} төрөл, ${Object.values(schema).reduce((n, t) => n + t.fields.length, 0)} талбар`);
if (warnings.length) console.log('Анхааруулга:\n- ' + warnings.join('\n- '));

import { client } from '@/lib/contentful';

// Contentful entry-г хаягийн хэсгээр (slug эсвэл хуучин entry ID) олно.
// Эхлээд slug-аар, олдохгүй бол ID-аар хайна. ID-аар олдсон, slug-тай entry-г
// хуудас slug хаяг руу байнгын redirect хийнэ (хуучин холбоос, Google-ийн index хадгалагдана).
export async function getEntryBySlugOrId(
  contentType: string,
  param: string,
  include = 1
): Promise<{ entry: any; matchedBy: 'slug' | 'id' } | null> {
  const value = decodeURIComponent(param);
  try {
    const res = await client.getEntries({
      content_type: contentType,
      'fields.slug': value,
      limit: 1,
      include,
    } as any);
    if (res.items[0]) return { entry: res.items[0], matchedBy: 'slug' };
  } catch {
    // Төрөлд slug талбар хараахан нэмэгдээгүй бол ID-аар хайна
  }
  try {
    const res = await client.getEntries({
      content_type: contentType,
      'sys.id': value,
      limit: 1,
      include,
    } as any);
    if (res.items[0]) return { entry: res.items[0], matchedBy: 'id' };
  } catch (err) {
    console.error(`${contentType} татахад алдаа гарлаа:`, err);
  }
  return null;
}

// Entry-ийн хаягийн хэсэг: slug байвал slug, үгүй бол ID
export function entryKey(entry: any): string {
  const slug = entry?.fields?.slug;
  return typeof slug === 'string' && slug.trim() ? slug.trim() : entry.sys.id;
}

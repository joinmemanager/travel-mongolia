import { client } from '@/lib/contentful';

// Аймгийн сумд (soum төрөл, TIC-ээс шилжүүлсэн). ownPage=true бол /province/<аймаг>/<сум>
// тусдаа хуудастай, бусад нь аймгийн хуудсанд товч жагсаалтаар харагдана.
export interface Soum {
  id: string;
  title: string;
  slug: string;
  ownPage: boolean;
  body: any;
  image?: string;
  seoTitle?: string;
  seoDescription?: string;
  provinceId: string;
  provinceSlug: string;
  provinceTitle: string;
}

function imageUrl(asset: any): string | undefined {
  const url = asset?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

function toSoum(e: any): Soum {
  const f = e.fields || {};
  const p = f.province?.fields || {};
  return {
    id: e.sys.id,
    title: String(f.title || ''),
    slug: String(f.slug || e.sys.id),
    ownPage: f.ownPage === true,
    body: f.body,
    image: imageUrl(f.image),
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
    provinceId: String(f.province?.sys?.id || ''),
    provinceSlug: String(p.slug || f.province?.sys?.id || ''),
    provinceTitle: String(p.title || ''),
  };
}

// Нэг аймгийн бүх сум, нэрийн дарааллаар
export async function getSoumsOfProvince(provinceId: string): Promise<Soum[]> {
  try {
    const res = await client.getEntries({
      content_type: 'soum',
      'fields.province.sys.id': provinceId,
      order: ['fields.title'],
      limit: 200,
      include: 1,
    } as any);
    return res.items.map(toSoum).sort((a, b) => a.title.localeCompare(b.title, 'mn'));
  } catch (err) {
    console.error('Сумдын жагсаалт татахад алдаа гарлаа:', err);
    return [];
  }
}

// /province/<аймаг>/<сум>: slug-аар хайж, аймгийн slug таарсныг буцаана
export async function getSoum(provinceSlug: string, soumSlug: string): Promise<Soum | null> {
  try {
    const res = await client.getEntries({
      content_type: 'soum',
      'fields.slug': decodeURIComponent(soumSlug),
      limit: 50,
      include: 1,
    } as any);
    const found = res.items.map(toSoum).find((s) => s.provinceSlug === decodeURIComponent(provinceSlug));
    return found || null;
  } catch (err) {
    console.error('Сум татахад алдаа гарлаа:', err);
    return null;
  }
}

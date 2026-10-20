import { client } from '@/lib/contentful';
import { creditOf, type ImageCredit } from '@/lib/imageCredit';
import { assetUrl } from '@/lib/places';

// TIC-ээс шилжүүлсэн газрууд (Contentful `place` төрөл): тусгай хамгаалалттай газар, музей, театр,
// соёлын төв, рашаан сувилал. Нэгтгэсэн давхардлууд (Тэрэлж, Хөвсгөл нуур = destination; Бурхан Халдун,
// Орхоны хөндий = heritagePlace) нь өөрийн төрөлдөө үлдэж, `protectedCategory`, `provinceRef` талбараар
// энд нэгдэж жагсаагдана. Хотын дурсгалт газрууд нь heritagePlace (`provinceRef`).

export type PlaceCategory =
  | 'strictly-protected'
  | 'national-park'
  | 'nature-reserve'
  | 'natural-monument'
  | 'museum'
  | 'theatre'
  | 'culture-center'
  | 'sanatorium';

export const PROTECTED_CATEGORIES: PlaceCategory[] = ['strictly-protected', 'national-park', 'nature-reserve', 'natural-monument'];
export const CULTURE_CATEGORIES: PlaceCategory[] = ['museum', 'theatre', 'culture-center'];

export const CATEGORY_INFO: Record<PlaceCategory, { label: string; plural: string; href: string; base: string }> = {
  'strictly-protected': { label: 'Дархан цаазат газар', plural: 'Дархан цаазат газрууд', href: '/destination/strictly-protected', base: '/destination/protected' },
  'national-park': { label: 'Байгалийн цогцолборт газар', plural: 'Байгалийн цогцолборт газрууд', href: '/destination/national-parks', base: '/destination/protected' },
  'nature-reserve': { label: 'Байгалийн нөөц газар', plural: 'Байгалийн нөөц газрууд', href: '/destination/nature-reserves', base: '/destination/protected' },
  'natural-monument': { label: 'Байгалийн дурсгалт газар', plural: 'Байгалийн дурсгалт газрууд', href: '/destination/natural-monuments', base: '/destination/protected' },
  museum: { label: 'Музей', plural: 'Музейнүүд', href: '/things-to-do/museums', base: '/things-to-do/museums' },
  theatre: { label: 'Театр, урлагийн чуулга', plural: 'Театр, урлагийн чуулгууд', href: '/things-to-do/museums', base: '/things-to-do/museums' },
  'culture-center': { label: 'Соёлын төв, номын сан', plural: 'Соёлын төв, номын сангууд', href: '/things-to-do/museums', base: '/things-to-do/museums' },
  sanatorium: { label: 'Рашаан сувилал', plural: 'Рашаан сувиллууд', href: '/things-to-do/wellness', base: '/things-to-do/wellness' },
};

// Аймгийн хуудасны хэсгийн anchor (app/province/[id]/page.tsx placeGroups)
export function provinceAnchor(category: PlaceSummary['category']): string {
  if ((PROTECTED_CATEGORIES as string[]).includes(category)) return 'protected-areas';
  if (category === 'city-monument') return 'city-monuments';
  if (category === 'sanatorium') return 'sanatoriums';
  return 'museums';
}

export interface PlaceSummary {
  id: string;
  title: string;
  slug: string;
  href: string;
  category: PlaceCategory | 'city-monument';
  provinceId?: string;
  provinceSlug?: string;
  provinceTitle?: string;
  soum?: string;
  image?: { src: string; alt: string; credit?: ImageCredit };
  excerpt?: string;
}

export interface PlaceDetail extends PlaceSummary {
  body?: any;
  seoTitle?: string;
  seoDescription?: string;
}

const LIST_FIELDS = ['sys.id', 'fields.title', 'fields.slug', 'fields.category', 'fields.province', 'fields.soum', 'fields.image', 'fields.seoDescription'];

function imageOf(asset: any, alt: string): PlaceSummary['image'] {
  const src = assetUrl(asset);
  return src ? { src, alt: asset?.fields?.title || alt, credit: creditOf(asset) } : undefined;
}

function toPlace(e: any): PlaceDetail {
  const f = e.fields || {};
  const category = f.category as PlaceCategory;
  const slug = String(f.slug || e.sys.id);
  const p = f.province?.fields;
  return {
    id: e.sys.id,
    title: String(f.title || ''),
    slug,
    href: `${CATEGORY_INFO[category]?.base || '/destination/protected'}/${slug}`,
    category,
    provinceId: f.province?.sys?.id,
    provinceSlug: p?.slug,
    provinceTitle: p?.title,
    soum: f.soum,
    image: imageOf(f.image, String(f.title || '')),
    excerpt: f.seoDescription,
    body: f.body,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
  };
}

const byTitle = (a: PlaceSummary, b: PlaceSummary) => a.title.localeCompare(b.title, 'mn');

// Нэгтгэсэн entry (destination/heritagePlace) → жагсаалтын мөр
function mergedToSummary(e: any, type: 'destination' | 'heritagePlace', category: PlaceSummary['category']): PlaceSummary {
  const f = e.fields || {};
  const title = String(f.title || f.name || '');
  const slug = String(f.slug || e.sys.id);
  const p = f.provinceRef?.fields;
  return {
    id: e.sys.id,
    title,
    slug,
    href: type === 'destination' ? `/destination/${slug}` : `/destination/heritage/place/${slug}`,
    category,
    provinceId: f.provinceRef?.sys?.id,
    provinceSlug: p?.slug,
    provinceTitle: p?.title,
    image: imageOf(f.image || f.coverImage, title),
    excerpt: f.seoDescription,
  };
}

async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`${label} татахад алдаа гарлаа:`, err);
    return fallback;
  }
}

// Нэг буюу хэд хэдэн ангиллын газрууд (нэгтгэсэн destination/heritagePlace-ийг оруулаад), нэрийн дарааллаар
export async function getPlacesByCategory(categories: PlaceCategory[]): Promise<PlaceSummary[]> {
  const places = await safe(
    'Газруудын жагсаалт',
    async () => {
      const res = await client.getEntries({
        content_type: 'place',
        'fields.category[in]': categories.join(','),
        select: LIST_FIELDS,
        limit: 1000,
        include: 1,
      } as any);
      return res.items.map((e) => toPlace(e) as PlaceSummary);
    },
    [] as PlaceSummary[]
  );
  const protectedOnes = categories.filter((c) => PROTECTED_CATEGORIES.includes(c));
  const merged = protectedOnes.length
    ? await Promise.all(
        (['destination', 'heritagePlace'] as const).map((type) =>
          safe(
            `${type} (тусгай хамгаалалттай)`,
            async () => {
              const res = await client.getEntries({
                content_type: type,
                'fields.protectedCategory[in]': protectedOnes.join(','),
                select: ['sys.id', 'fields.title', 'fields.name', 'fields.slug', 'fields.provinceRef', 'fields.image', 'fields.coverImage', 'fields.seoDescription', 'fields.protectedCategory'],
                limit: 100,
                include: 1,
              } as any);
              return res.items.map((e: any) => mergedToSummary(e, type, e.fields.protectedCategory));
            },
            [] as PlaceSummary[]
          )
        )
      )
    : [];
  return [...places, ...merged.flat()].sort(byTitle);
}

export async function getPlace(slug: string, categories?: PlaceCategory[]): Promise<PlaceDetail | null> {
  return safe(
    'Газар',
    async () => {
      const res = await client.getEntries({
        content_type: 'place',
        'fields.slug': decodeURIComponent(slug),
        ...(categories ? { 'fields.category[in]': categories.join(',') } : {}),
        limit: 1,
        include: 1,
      } as any);
      return res.items[0] ? toPlace(res.items[0]) : null;
    },
    null
  );
}

// Аймгийн хуудсанд: тусгай хамгаалалттай газар, хотын дурсгалт газар, музей/театр, рашаан сувилал
export async function getPlacesOfProvince(provinceId: string): Promise<PlaceSummary[]> {
  const [places, merged] = await Promise.all([
    safe(
      'Аймгийн газрууд',
      async () => {
        const res = await client.getEntries({
          content_type: 'place',
          'fields.province.sys.id': provinceId,
          select: LIST_FIELDS,
          limit: 500,
          include: 1,
        } as any);
        return res.items.map((e) => toPlace(e) as PlaceSummary);
      },
      [] as PlaceSummary[]
    ),
    Promise.all(
      (['destination', 'heritagePlace'] as const).map((type) =>
        safe(
          `${type} (аймаг)`,
          async () => {
            const res = await client.getEntries({
              content_type: type,
              'fields.provinceRef.sys.id': provinceId,
              select: ['sys.id', 'fields.title', 'fields.name', 'fields.slug', 'fields.provinceRef', 'fields.image', 'fields.coverImage', 'fields.seoDescription', 'fields.protectedCategory'],
              limit: 500,
              include: 1,
            } as any);
            return res.items.map((e: any) =>
              mergedToSummary(e, type, e.fields.protectedCategory || 'city-monument')
            );
          },
          [] as PlaceSummary[]
        )
      )
    ),
  ]);
  return [...places, ...merged.flat()].sort(byTitle);
}

// destination / heritagePlace entry (TIC-ээс нэгтгэсэн эсвэл хотын дурсгалт газар) → PlaceFacts-ийн өгөгдөл.
// Аймаг ч, тусгай хамгаалалтын ангилал ч байхгүй бол null (хуучин entry-ийн хуудас өөрчлөгдөхгүй).
export function mergedPlaceFacts(entry: any, type: 'destination' | 'heritagePlace'): PlaceSummary | null {
  const f = entry?.fields || {};
  if (!f.provinceRef && !f.protectedCategory) return null;
  return mergedToSummary(entry, type, f.protectedCategory || 'city-monument');
}

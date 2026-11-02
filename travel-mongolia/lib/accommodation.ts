import { cache } from 'react';

import { client, rethrowOutage } from '@/lib/contentful';
import { creditOf, type ImageCredit } from '@/lib/imageCredit';

// Tourist Info Center-ээс шилжүүлсэн зочид буудал (cate21), жуулчны бааз (cate22): Contentful `localProvider`,
// providerType = accommodation, sourceUrl = touristinfocenter.mn. «Нутгийн Монгол» (/local, soft)-оос тусдаа,
// /plan/accommodation дээр жагсаалт, /plan/accommodation/<slug> хуудастай (7-р багц, 2026-10-21).
export const ACCOMMODATION_BASE = '/plan/accommodation' as const;
// joinme.mn-ээс нэмсэн (2026-11-02): sourceUrl = joinme.mn, эсвэл TIC entry-д joinmeId-тэй нөхсөн утас, байршил, зураг.
export const TIC_NOTICE = 'Энэ мэдээллийг Tourist Info Center-ээс авсан. Утас, үнэ зэрэг нь шинэчлэгдээгүй байж болно.';
const JOINME_NOTICE = 'Энэ мэдээллийг joinme.mn-ээс авсан. Утас, байршил зэрэг нь шинэчлэгдээгүй байж болно.';
const MIXED_NOTICE = 'Энэ мэдээллийг Tourist Info Center болон joinme.mn-ээс авсан. Утас, үнэ зэрэг нь шинэчлэгдээгүй байж болно.';

export type AccommodationKind = 'hotel' | 'camp' | 'resort' | 'guesthouse';
export const KIND_LABEL: Record<AccommodationKind, string> = {
  hotel: 'Зочид буудал',
  camp: 'Жуулчны бааз',
  resort: 'Амралтын газар',
  guesthouse: 'Гэр буудал',
};

export interface Accommodation {
  id: string;
  name: string;
  slug: string;
  href: string;
  kind: AccommodationKind;
  province: string;
  image?: { src: string; alt: string; credit?: ImageCredit };
  story?: any;
  services: string[];
  contact?: string;
  phones: string[];
  soum?: string;
  locationText?: string;
  fromTic: boolean;
  fromJoinme: boolean;
  priceFrom?: string;
  bookingUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const TIC_SOURCE = /touristinfocenter\.mn/i;
const JOINME_SOURCE = /joinme\.mn/i;
export const isTicAccommodation = (f: any) => f?.providerType === 'accommodation' && TIC_SOURCE.test(String(f?.sourceUrl || ''));
// /plan/accommodation-д жагсах бүх байр: TIC ба joinme. Бусад localProvider нь /local-д.
export const isDirectoryAccommodation = (f: any) => isTicAccommodation(f) || (f?.providerType === 'accommodation' && JOINME_SOURCE.test(String(f?.sourceUrl || '')));

export function accommodationNotice(items: Pick<Accommodation, 'fromTic' | 'fromJoinme'>[]): string {
  const joinme = items.some((x) => x.fromJoinme);
  if (!joinme) return TIC_NOTICE;
  return items.some((x) => x.fromTic) ? MIXED_NOTICE : JOINME_NOTICE;
}

function kindOf(f: any, services: string[]): AccommodationKind {
  if (!isTicAccommodation(f)) {
    if (f.joinmeCategory === 'hotel') return 'hotel';
    if (f.joinmeCategory === 'resort') return 'resort';
    if (f.joinmeCategory === 'guesthouse') return 'guesthouse';
    return 'camp';
  }
  // TIC cate21 → «Зочид буудал», cate22 → «Жуулчны бааз» (services-ийн эхний утга, эсвэл sourceUrl)
  return services.includes('Зочид буудал') || /cate21_/i.test(String(f.sourceUrl)) ? 'hotel' : 'camp';
}

function toAccommodation(e: any, full: boolean): Accommodation {
  const f = e.fields || {};
  const services: string[] = Array.isArray(f.services) ? f.services.map(String) : [];
  const photo = Array.isArray(f.photos) ? f.photos.find((p: any) => p?.fields?.file?.url) : undefined;
  const url: string | undefined = photo?.fields?.file?.url;
  const external: string | undefined = Array.isArray(f.externalImages) ? f.externalImages[0] : undefined;
  const slug = String(f.slug || e.sys.id);
  return {
    id: e.sys.id,
    name: String(f.name || ''),
    slug,
    href: `${ACCOMMODATION_BASE}/${slug}`,
    kind: kindOf(f, services),
    province: String(f.province || ''),
    image: url
      ? { src: url.startsWith('//') ? `https:${url}` : url, alt: photo.fields.title || f.name, credit: creditOf(photo) }
      : external
        ? { src: external, alt: f.name }
        : undefined,
    story: full ? f.story : undefined,
    services: services.filter((s) => s !== 'Зочид буудал' && s !== 'Жуулчны бааз'),
    contact: f.contact,
    phones: Array.isArray(f.phones) ? f.phones.map(String) : [],
    soum: f.soum,
    locationText: f.locationText,
    fromTic: isTicAccommodation(f),
    fromJoinme: !!f.joinmeId,
    priceFrom: f.priceFrom,
    bookingUrl: f.bookingUrl,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
  };
}

export const getAccommodations = cache(async (): Promise<Accommodation[]> => {
  try {
    const out: Accommodation[] = [];
    for (let skip = 0; ; skip += 500) {
      const res = await client.getEntries({
        content_type: 'localProvider',
        'fields.providerType': 'accommodation',
        select: ['sys.id', 'fields.name', 'fields.slug', 'fields.province', 'fields.services', 'fields.photos', 'fields.sourceUrl', 'fields.providerType', 'fields.externalImages', 'fields.joinmeCategory', 'fields.joinmeId'],
        order: ['fields.name'],
        limit: 500,
        skip,
        include: 1,
      } as any);
      out.push(...res.items.filter((e: any) => isDirectoryAccommodation(e.fields)).map((e) => toAccommodation(e, false)));
      if (skip + 500 >= res.total) break;
    }
    return out;
  } catch (err) {
    rethrowOutage(err);
    console.error('Буудал, баазыг татахад алдаа гарлаа:', err);
    return [];
  }
});

export const getAccommodation = cache(async (slug: string): Promise<Accommodation | null> => {
  try {
    const res = await client.getEntries({
      content_type: 'localProvider',
      'fields.slug': decodeURIComponent(slug),
      limit: 1,
      include: 1,
    } as any);
    const e: any = res.items[0];
    return e && isDirectoryAccommodation(e.fields) ? toAccommodation(e, true) : null;
  } catch (err) {
    rethrowOutage(err);
    console.error('Буудал, бааз татахад алдаа гарлаа:', err);
    return null;
  }
});

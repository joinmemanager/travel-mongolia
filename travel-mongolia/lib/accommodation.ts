import { cache } from 'react';

import { client, rethrowOutage } from '@/lib/contentful';
import { creditOf, type ImageCredit } from '@/lib/imageCredit';

// Tourist Info Center-ээс шилжүүлсэн зочид буудал (cate21), жуулчны бааз (cate22): Contentful `localProvider`,
// providerType = accommodation, sourceUrl = touristinfocenter.mn. «Нутгийн Монгол» (/local, soft)-оос тусдаа,
// /plan/accommodation дээр жагсаалт, /plan/accommodation/<slug> хуудастай (7-р багц, 2026-10-21).
export const ACCOMMODATION_BASE = '/plan/accommodation' as const;
export const TIC_NOTICE = 'Энэ мэдээллийг Tourist Info Center-ээс авсан. Утас, үнэ зэрэг нь шинэчлэгдээгүй байж болно.';

export type AccommodationKind = 'hotel' | 'camp';
export const KIND_LABEL: Record<AccommodationKind, string> = { hotel: 'Зочид буудал', camp: 'Жуулчны бааз' };

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
  priceFrom?: string;
  bookingUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

const TIC_SOURCE = /touristinfocenter\.mn/i;
export const isTicAccommodation = (f: any) => f?.providerType === 'accommodation' && TIC_SOURCE.test(String(f?.sourceUrl || ''));

function toAccommodation(e: any, full: boolean): Accommodation {
  const f = e.fields || {};
  const services: string[] = Array.isArray(f.services) ? f.services.map(String) : [];
  const photo = Array.isArray(f.photos) ? f.photos.find((p: any) => p?.fields?.file?.url) : undefined;
  const url: string | undefined = photo?.fields?.file?.url;
  const slug = String(f.slug || e.sys.id);
  return {
    id: e.sys.id,
    name: String(f.name || ''),
    slug,
    href: `${ACCOMMODATION_BASE}/${slug}`,
    // TIC cate21 → «Зочид буудал», cate22 → «Жуулчны бааз» (services-ийн эхний утга, эсвэл sourceUrl)
    kind: services.includes('Зочид буудал') || /cate21_/i.test(String(f.sourceUrl)) ? 'hotel' : 'camp',
    province: String(f.province || ''),
    image: url ? { src: url.startsWith('//') ? `https:${url}` : url, alt: photo.fields.title || f.name, credit: creditOf(photo) } : undefined,
    story: full ? f.story : undefined,
    services: services.filter((s) => s !== 'Зочид буудал' && s !== 'Жуулчны бааз'),
    contact: f.contact,
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
        select: ['sys.id', 'fields.name', 'fields.slug', 'fields.province', 'fields.services', 'fields.photos', 'fields.sourceUrl', 'fields.providerType'],
        order: ['fields.name'],
        limit: 500,
        skip,
        include: 1,
      } as any);
      out.push(...res.items.filter((e: any) => isTicAccommodation(e.fields)).map((e) => toAccommodation(e, false)));
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
    return e && isTicAccommodation(e.fields) ? toAccommodation(e, true) : null;
  } catch (err) {
    rethrowOutage(err);
    console.error('Буудал, бааз татахад алдаа гарлаа:', err);
    return null;
  }
});

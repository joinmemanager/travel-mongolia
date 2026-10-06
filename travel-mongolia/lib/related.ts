import type { SiteImage } from '@/lib/images';
import {
  getExperiences,
  getProducts,
  getProviders,
  providerTypeLabel,
} from '@/lib/localContent';
import { distanceKm } from '@/lib/places';
import { sharesProvince } from '@/lib/provinceNames';

// "Холбоотой аялал, туршлага, үйлчилгээ" (Content-to-Booking, C12) хэсгийн өгөгдөл.
// 1. Entry-ийн related_* талбарт сонгосон entry-үүд.
// 2. Хоосон бол ижил аймгийн (эсвэл газрын зургийн цэгт ойр) туршлага, үйлчилгээ үзүүлэгч.

export interface RelatedItem {
  id: string;
  kind: 'experience' | 'provider' | 'product';
  title: string;
  href: string;
  slug: string;
  image?: SiteImage;
  meta: string;
  // Захиалгын холбоос (туршлага, үйлчилгээ үзүүлэгчид). Хоосон бол joinme.mn
  bookingUrl?: string;
  // Analytics-д: захиалга аль үйлчилгээ үзүүлэгч рүү очиж байгаа вэ
  providerId?: string;
  isLocalProvider: boolean;
}

export interface RelatedQuery {
  experienceIds?: string[];
  providerIds?: string[];
  productIds?: string[];
  // Аймгийн нэр агуулсан текст (province талбар, heritagePlace.region г.м.)
  provinceText?: string;
  // Эдгээр цэгээс nearKm дотор байрлах үйлчилгээ үзүүлэгч (маршрутын зогсоол г.м.)
  near?: { lat: number; lon: number }[];
  nearKm?: number;
  exclude?: string[];
  limit?: number;
}

export const linkIds = (v: any): string[] =>
  (Array.isArray(v) ? v : []).map((l: any) => l?.sys?.id).filter(Boolean);

export async function getRelatedItems(q: RelatedQuery): Promise<RelatedItem[]> {
  const [experiences, providers, products] = await Promise.all([getExperiences(), getProviders(), getProducts()]);
  const exclude = new Set(q.exclude || []);
  const limit = q.limit ?? 6;

  const fromExperience = (x: (typeof experiences)[number]): RelatedItem => {
    const host = providers.find((p) => p.id === x.hostId);
    return {
      id: x.id,
      kind: 'experience',
      title: x.title,
      href: x.href,
      slug: x.slug,
      image: x.photos[0],
      meta: [x.province, x.duration, x.price].filter(Boolean).join(' · '),
      bookingUrl: x.bookingUrl || host?.bookingUrl,
      providerId: x.hostId,
      isLocalProvider: Boolean(host?.localOwned),
    };
  };
  const fromProvider = (p: (typeof providers)[number]): RelatedItem => ({
    id: p.id,
    kind: 'provider',
    title: p.name,
    href: p.href,
    slug: p.slug,
    image: p.photos[0],
    meta: [providerTypeLabel(p.providerType), p.province, p.priceFrom ? `${p.priceFrom}-аас` : '']
      .filter(Boolean)
      .join(' · '),
    bookingUrl: p.bookingUrl,
    providerId: p.id,
    isLocalProvider: p.localOwned,
  });
  const fromProduct = (x: (typeof products)[number]): RelatedItem => ({
    id: x.id,
    kind: 'product',
    title: x.name,
    href: x.producer?.href || x.href,
    slug: x.slug,
    image: x.photos[0],
    meta: [x.origin, x.producer?.title].filter(Boolean).join(' · '),
    providerId: x.producerId,
    isLocalProvider: Boolean(providers.find((p) => p.id === x.producerId)?.localOwned),
  });

  // 1. Гараар сонгосон
  const explicit: RelatedItem[] = [
    ...experiences.filter((x) => q.experienceIds?.includes(x.id)).map(fromExperience),
    ...providers.filter((p) => q.providerIds?.includes(p.id)).map(fromProvider),
    ...products.filter((x) => q.productIds?.includes(x.id)).map(fromProduct),
  ].filter((i) => !exclude.has(i.id));
  if (explicit.length > 0) return explicit.slice(0, limit);

  // 2. Автоматаар: ижил аймаг эсвэл ойролцоо
  const nearKm = q.nearKm ?? 50;
  const isNear = (loc?: { lat: number; lon: number }) =>
    Boolean(loc && q.near?.some((pt) => distanceKm(pt, loc) <= nearKm));
  const providerMatches = (p: (typeof providers)[number]) =>
    sharesProvince(q.provinceText, p.province) || isNear(p.location);

  const autoExperiences = experiences.filter((x) => {
    const host = providers.find((p) => p.id === x.hostId);
    return sharesProvince(q.provinceText, x.province) || (host ? isNear(host.location) : false);
  });
  const autoProviders = providers.filter(providerMatches);

  return [...autoExperiences.map(fromExperience), ...autoProviders.map(fromProvider)]
    .filter((i) => !exclude.has(i.id))
    .slice(0, limit);
}

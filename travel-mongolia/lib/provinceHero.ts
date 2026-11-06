import { creditOf, type ImageCredit } from '@/lib/imageCredit';
import { AI_GENERATED_ASSETS, IMAGES } from '@/lib/images';
import { PROVINCE_FACTS } from '@/lib/provinceFacts';

// Аймгийн hero зураг (app/province/[id]/page.tsx-ийн дүрэмтэй ижил):
// entry-ийн зураг ≥1000 px (emblem талбартай бол ≥900 px, AI-аар үүсгэснийг тооцохгүй),
// эс бөгөөс lib/provinceFacts.ts-ийн аймгийн hero түлхүүр, эс бөгөөс ерөнхий зураг.
// Сумын хуудас сүлдийн оронд үүнийг hero болгоно.
const HERO_MIN_WIDTH = 1000;
const PHOTO_HERO_MIN_WIDTH = 900;

export function provinceHeroImage(provinceFields: any, slug: string, alt: string): { src: string; alt: string; credit?: ImageCredit } {
  const f = provinceFields || {};
  const asset = f.image;
  const url: string | undefined = asset?.fields?.file?.url;
  const width: number = asset?.fields?.file?.details?.image?.width || 0;
  if (url && !AI_GENERATED_ASSETS[asset?.sys?.id] && width >= (f.emblem ? PHOTO_HERO_MIN_WIDTH : HERO_MIN_WIDTH)) {
    return { src: url.startsWith('//') ? `https:${url}` : url, alt, credit: creditOf(asset) };
  }
  const key = PROVINCE_FACTS[slug]?.hero;
  const img = (key && IMAGES[key]) || IMAGES.whiteHorse;
  return { ...img, alt: img.alt || alt };
}

import { cache } from 'react';

import { client, rethrowOutage } from '@/lib/contentful';
import { AI_GENERATED_ASSETS } from '@/lib/images';

// Нүүрний «Монгол улсын аймгууд» слайдерын (components/RegionMap.tsx) аймаг бүрийн зураг.
// Зөвхөн тухайн аймгийн өөрийн Contentful зураг: Unsplash, stock, гадаадын зураг ашиглахгүй
// (өмнө нь кодонд шууд бичсэн Unsplash зураг Дархан-Уулд далайн завь г.м. гарч байсан).
// Сонголтын дараалал:
//  1. hero    — аймгийн entry-ийн image (гэрэл зураг: ≥1000 px, emblem талбартай бол ≥900 px;
//               app/province/[id]/page.tsx-ийн heroSized-тэй ижил). AI-аар үүсгэснийг тооцохгүй.
//  2. gallery — аймгийн танилцуулга доторх зураг (≥500 px, «Зургийн цомог»-ийн дүрэм), сүлд/газрын зураг биш
//  3. soum    — аймгийн сумдын зураг (TIC/Commons), хэвтээ, ≥600 px, сүлд/газрын зураг биш, Commons-ийнх түрүүлнэ
//  4. emblem  — аль нь ч байхгүй бол аймгийн сүлдийг (contain) харуулна
// Contentful-д юу ч бичихгүй. Хариу lib/contentful.ts-ийн Data Cache-аас (CDA хүсэлт нэмэгдэхгүй).

export type SliderImageSource = 'hero' | 'gallery' | 'soum' | 'emblem';

export interface SliderImage {
  src: string;
  alt: string;
  source: SliderImageSource;
  credit?: string;
}

const HERO_MIN_WIDTH = 1000;
const PHOTO_HERO_MIN_WIDTH = 900;
const GALLERY_MIN_WIDTH = 500;
const SOUM_MIN_WIDTH = 600;

// Гэрэл зураг биш (сүлд, туг, газрын зураг, лого) зургийг гарчиг/тайлбараар нь танина
const NOT_PHOTO = /сүлд|(?:^|[^а-яөүё])туг(?![а-яөүё])|газрын зураг|байршил|emblem|coat[_ -]of[_ -]arms|logo|flag|map|locator|location/i;

function urlOf(asset: any): string | undefined {
  const url: string | undefined = asset?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

const dims = (asset: any): { w: number; h: number } => {
  const d = asset?.fields?.file?.details?.image || {};
  return { w: d.width || 0, h: d.height || 0 };
};

// «Зураг: <эх сурвалж>» мөрийн эх сурвалж (lib/imageCredit.ts-ийн хэлбэр)
function creditText(asset: any): string | undefined {
  const m = String(asset?.fields?.description || '').match(/Зураг:\s*([^|\n]+)/);
  return m ? m[1].trim() : undefined;
}

function isPhoto(asset: any, minWidth: number): boolean {
  const f = asset?.fields;
  if (!f || !urlOf(asset) || AI_GENERATED_ASSETS[asset?.sys?.id]) return false;
  const ct = String(f.file?.contentType || 'image/');
  if (!ct.startsWith('image/') || ct.includes('svg')) return false;
  if (dims(asset).w < minWidth) return false;
  // Тайлбарыг шалгахгүй: Commons-ийн зургийн тайлбарт эх сурвалжийн урт бичвэр (map, location г.м.) ордог
  return !NOT_PHOTO.test(`${f.title || ''} ${f.file?.fileName || ''}`);
}

function embeddedAssets(node: any, out: any[] = []): any[] {
  if (!node || typeof node !== 'object') return out;
  if (node.nodeType === 'embedded-asset-block' && node.data?.target?.fields) out.push(node.data.target);
  for (const c of node.content || []) embeddedAssets(c, out);
  return out;
}

const toImage = (asset: any, alt: string, source: SliderImageSource): SliderImage => ({
  src: urlOf(asset)!,
  alt,
  source,
  credit: creditText(asset),
});

// slug → зураг. Зураг олдоогүй аймаг жагсаалтад байхгүй (RegionMap нэрийг нь харуулна).
export const getProvinceSliderImages = cache(async (): Promise<Record<string, SliderImage>> => {
  let provinces: any[] = [];
  try {
    const res = await client.getEntries({ content_type: 'province', limit: 100, include: 1 } as any);
    provinces = res.items || [];
  } catch (err) {
    rethrowOutage(err);
    console.error('Аймгийн слайдерын зураг татахад алдаа гарлаа:', err);
    return {};
  }

  const out: Record<string, SliderImage> = {};
  const missing: any[] = [];
  for (const e of provinces) {
    const f = e.fields || {};
    const slug = String(f.slug || '');
    if (!slug) continue;
    const name = String(f.title || f.name || slug);
    // 1. Аймгийн hero гэрэл зураг
    if (isPhoto(f.image, f.emblem ? PHOTO_HERO_MIN_WIDTH : HERO_MIN_WIDTH)) {
      out[slug] = toImage(f.image, name, 'hero');
      continue;
    }
    // 2. Танилцуулга доторх зураг
    const gallery = [f.description2, f.description, f.description1]
      .flatMap((d) => embeddedAssets(d))
      .find((a) => a.sys?.id !== f.image?.sys?.id && isPhoto(a, GALLERY_MIN_WIDTH));
    if (gallery) {
      out[slug] = toImage(gallery, `${name} — ${gallery.fields.title || name}`, 'gallery');
      continue;
    }
    missing.push(e);
  }
  if (missing.length === 0) return out;

  // 3. Сумдын зураг: сумын нүүр зураг (image) болон сумын бичвэр доторх (Commons) зургууд.
  // Зураггүй аймгуудад л нэг хүсэлт (одоогоор зөвхөн Орхон, 2 сум).
  let soums: any[] = [];
  try {
    const res = await client.getEntries({
      content_type: 'soum',
      'fields.province.sys.id[in]': missing.map((e) => e.sys.id).join(','),
      select: ['sys.id', 'fields.title', 'fields.province', 'fields.image', 'fields.body'],
      order: ['fields.title'],
      limit: 1000,
      include: 1,
    } as any);
    soums = res.items || [];
  } catch (err) {
    rethrowOutage(err);
    console.error('Сумдын зураг татахад алдаа гарлаа:', err);
  }

  for (const e of missing) {
    const f = e.fields || {};
    const slug = String(f.slug);
    const name = String(f.title || f.name || slug);
    const candidates = soums
      .filter((s) => s.fields?.province?.sys?.id === e.sys.id)
      .flatMap((s) => [s.fields.image, ...embeddedAssets(s.fields.body)].map((asset) => ({ soum: s, asset })))
      .filter(({ asset }) => {
        if (!isPhoto(asset, SOUM_MIN_WIDTH)) return false;
        const { w, h } = dims(asset);
        return w >= h;
      })
      // Wikimedia Commons-оос авсан (лицензтэй, бодит газрын) зураг түрүүлнэ, дараа нь сумын нэрийн дарааллаар
      .sort((a, b) => Number(/^commons-/.test(b.asset.sys?.id || '')) - Number(/^commons-/.test(a.asset.sys?.id || '')));
    const pick = candidates[0];
    if (pick) {
      out[slug] = toImage(pick.asset, pick.asset.fields.title || `${pick.soum.fields.title}, ${name}`, 'soum');
      continue;
    }
    // 4. Сүлд
    const emblem = f.emblem || f.image;
    if (urlOf(emblem) && !AI_GENERATED_ASSETS[emblem?.sys?.id]) {
      out[slug] = { src: urlOf(emblem)!, alt: `${name} — сүлд`, source: 'emblem' };
    }
  }
  return out;
});

// Гадны зургийн CDN-ээс (Unsplash, Contentful) хэрэгтэй өргөнтэй, шахсан, орчин үеийн форматтай
// (WebP/AVIF) хувилбарыг хүснэ. Vercel-ийн зургийн оновчлолын квотыг зарцуулахгүй.
// Танигдаагүй хаяг (сайтын өөрийн /public зураг г.м.) хэвээр буцна.

export function isCdnImage(src: string): boolean {
  return /^(https?:)?\/\/images\.(unsplash\.com|ctfassets\.net)\//.test(src) || isPayloadMedia(src);
}

// Payload CMS-ийн зураг (docs/plan/payload-migration.md): R2-ийн public домэйн (MEDIA_URL, next.config.js) эсвэл
// локал /api/media/file/. Хэмжээнүүд upload хийхэд нэг удаа үүссэн: <нэр>-w480.webp … -w2400.webp
// (payload/collections.ts). Runtime-д хувиргалт хийхгүй, Vercel-ийн оновчлолын квот зарцуулахгүй.
const MEDIA_WIDTHS = [480, 960, 1600, 2400];
const MEDIA_URL = (process.env.MEDIA_URL || '').replace(/\/$/, '');
export function isPayloadMedia(src: string): boolean {
  return src.startsWith('/api/media/file/') || (!!MEDIA_URL && src.startsWith(MEDIA_URL + '/'));
}
function payloadMediaSize(src: string, width: number): string {
  const path = src.split(/[?#]/)[0];
  if (/\.svg$/i.test(path)) return src;
  const size = MEDIA_WIDTHS.find((w) => w >= width) || MEDIA_WIDTHS[MEDIA_WIDTHS.length - 1];
  return `${path.replace(/\.[a-z0-9]+$/i, '')}-w${size}.webp`;
}

// joinme.mn-ийн зураг (localProvider.externalImages): өөрийнх нь хэмжээгээр шууд, Vercel-ийн оновчлолоор дамжихгүй.
// next/image-д unoptimized-аар, хэмжээг CSS-ийн хайрцаг хязгаарлана, lazy нь next/image-ийн анхны утга.
export function isDirectImage(src: string): boolean {
  return /^https:\/\/d1f6qhhrbg3j8a\.cloudfront\.net\//.test(src);
}

// joinme.mn-ийн entry-д зураггүй үеийн ангиллын энгийн дүрс (public/placeholders). og:image, JSON-LD-д оруулахгүй.
export const placeholderImage = (icon: string) => `/placeholders/${icon}.svg`;
export const realImage = (src?: string) => (src && !src.startsWith('/placeholders/') ? src : undefined);

export function cdnImage(src: string, width: number, quality = 70): string {
  if (!isCdnImage(src)) return src;
  if (isPayloadMedia(src)) return payloadMediaSize(src, width);
  try {
    const url = new URL(src.startsWith('//') ? `https:${src}` : src);
    if (url.hostname === 'images.unsplash.com') {
      url.searchParams.set('w', String(width));
      url.searchParams.set('q', String(quality));
      url.searchParams.set('auto', 'format');
      url.searchParams.set('fit', 'crop');
    } else {
      // Contentful Images API
      url.searchParams.set('w', String(width));
      url.searchParams.set('q', String(quality));
      url.searchParams.set('fm', 'webp');
    }
    return url.toString();
  } catch {
    return src;
  }
}

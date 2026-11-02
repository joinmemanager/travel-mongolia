// Гадны зургийн CDN-ээс (Unsplash, Contentful) хэрэгтэй өргөнтэй, шахсан, орчин үеийн форматтай
// (WebP/AVIF) хувилбарыг хүснэ. Vercel-ийн зургийн оновчлолын квотыг зарцуулахгүй.
// Танигдаагүй хаяг (сайтын өөрийн /public зураг г.м.) хэвээр буцна.

export function isCdnImage(src: string): boolean {
  return /^(https?:)?\/\/images\.(unsplash\.com|ctfassets\.net)\//.test(src);
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

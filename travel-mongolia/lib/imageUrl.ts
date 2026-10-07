// Гадны зургийн CDN-ээс (Unsplash, Contentful) хэрэгтэй өргөнтэй, шахсан, орчин үеийн форматтай
// (WebP/AVIF) хувилбарыг хүснэ. Vercel-ийн зургийн оновчлолын квотыг зарцуулахгүй.
// Танигдаагүй хаяг (сайтын өөрийн /public зураг г.м.) хэвээр буцна.

export function isCdnImage(src: string): boolean {
  return /^(https?:)?\/\/images\.(unsplash\.com|ctfassets\.net)\//.test(src);
}

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

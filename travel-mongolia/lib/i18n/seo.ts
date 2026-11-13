import type { Metadata } from 'next';

import { DEFAULT_LOCALE, localeByCode, localizedPath, TRANSLATION_LOCALES } from './locales';

// hreflang + canonical: хуудас бүр өөрийн хэлний хаягаа canonical болгоно; alternates-д зөвхөн орчуулга нь
// НИЙТЛЭГДСЭН хэлүүд (publishedLocales) орно. Орчуулгагүй бол alternates хоосон → одоогийн mn хуудасны
// metadata огт өөрчлөгдөхгүй.
export function localeAlternates(path: string, locale: string, publishedLocales: string[] = []): Metadata['alternates'] {
  const published = TRANSLATION_LOCALES.filter((l) => publishedLocales.includes(l.code));
  if (!published.length) return { canonical: localizedPath(path, locale) };
  return {
    canonical: localizedPath(path, locale),
    languages: {
      mn: path,
      ...Object.fromEntries(published.map((l) => [l.hreflang, localizedPath(path, l.code)])),
      'x-default': path,
    },
  };
}

// pageMetadata()-ийн үр дүнд хэлний canonical, hreflang, og:locale-ийг тавина
export function withLocale(meta: Metadata, path: string, locale: string, publishedLocales: string[] = []): Metadata {
  const l = localeByCode(locale);
  return {
    ...meta,
    alternates: localeAlternates(path, locale, publishedLocales),
    openGraph: meta.openGraph ? { ...meta.openGraph, url: localizedPath(path, locale), locale: l?.ogLocale || 'mn_MN' } : meta.openGraph,
  };
}

export const isDefaultLocale = (locale: string) => locale === DEFAULT_LOCALE;

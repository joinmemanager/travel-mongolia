import { cache } from 'react';

import { DEFAULT_LOCALE } from './locales';

// Тухайн хүсэлтийн (render-ийн) хэл. /[lang]/... хуудас render эхлэхдээ setRequestLocale('en') дуудна,
// дараа нь lib/contentful.ts-ийн getEntries бүр энэ хэлээр уншина — ингэснээр lib/*.ts-ийн 40 орчим query
// функцэд хэлний параметр нэмэх шаардлагагүй (next-intl-ийн setRequestLocale-тэй ижил арга).
// React cache нь нэг хүсэлтэд нэг объект; route handler (sitemap г.м.) дотор үргэлж mn.
const store = cache(() => ({ locale: DEFAULT_LOCALE as string }));

export function setRequestLocale(locale: string) {
  store().locale = locale;
}

export function getRequestLocale(): string {
  try {
    return store().locale;
  } catch {
    return DEFAULT_LOCALE;
  }
}

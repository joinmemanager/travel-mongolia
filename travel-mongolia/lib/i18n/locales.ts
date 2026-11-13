// Сайтын хэлүүд: Payload-ийн locale код ↔ URL-ын угтвар ↔ hreflang.
// mn нь үндсэн хэл: URL угтваргүй (/province/...), одоогийн хаяг огт өөрчлөгдөхгүй.
// Бусад хэл: /en/..., /zh/..., /ru/..., /ko/..., /ja/... Орчуулга нь нийтлэгдээгүй (publishedLocales-д
// ороогүй) хуудас тухайн хэлээр 404, sitemap-д орохгүй (docs/plan/payload-migration.md «Routing»).

export const DEFAULT_LOCALE = 'mn' as const;

export const LOCALES = [
  { code: 'mn', prefix: '', hreflang: 'mn', label: 'Монгол', ogLocale: 'mn_MN' },
  { code: 'en', prefix: 'en', hreflang: 'en', label: 'English', ogLocale: 'en_US' },
  { code: 'zh-CN', prefix: 'zh', hreflang: 'zh-Hans', label: '中文', ogLocale: 'zh_CN' },
  { code: 'ru', prefix: 'ru', hreflang: 'ru', label: 'Русский', ogLocale: 'ru_RU' },
  { code: 'ko', prefix: 'ko', hreflang: 'ko', label: '한국어', ogLocale: 'ko_KR' },
  { code: 'ja', prefix: 'ja', hreflang: 'ja', label: '日本語', ogLocale: 'ja_JP' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];
export type LocalePrefix = Exclude<(typeof LOCALES)[number]['prefix'], ''>;

// Орчуулгын хэлүүд (mn-ээс бусад)
export const TRANSLATION_LOCALES = LOCALES.filter((l) => l.code !== DEFAULT_LOCALE);
export const URL_PREFIXES = TRANSLATION_LOCALES.map((l) => l.prefix) as LocalePrefix[];

export const localeByPrefix = (prefix: string) => TRANSLATION_LOCALES.find((l) => l.prefix === prefix);
export const localeByCode = (code: string) => LOCALES.find((l) => l.code === code);

// /province/x → /en/province/x (mn бол хэвээр)
export function localizedPath(path: string, code: string): string {
  const l = localeByCode(code);
  if (!l || !l.prefix) return path;
  return path === '/' ? `/${l.prefix}` : `/${l.prefix}${path}`;
}

// /en/province/x → { code: 'en', path: '/province/x' }
export function splitLocalePath(pathname: string): { code: LocaleCode; path: string } {
  const m = pathname.match(/^\/([a-z]{2})(\/.*)?$/);
  const l = m && localeByPrefix(m[1]);
  if (l) return { code: l.code, path: m![2] || '/' };
  return { code: DEFAULT_LOCALE, path: pathname };
}

// [lang] хувилбартай route-ууд (app/(site)/[lang]/...). Шинэ route-ийн орчуулгыг нэмэхдээ энд бүртгэнэ.
// Жагсаалтад байхгүй хуудас руу орчуулгын хуудаснаас холбоос өгөхөд монгол хувилбар руу нь заана (404 болохгүй).
export const LOCALIZED_ROUTES: RegExp[] = [/^\/province\/[^/#?]+\/[^/#?]+(?:[#?].*)?$/];

export function localizedHref(path: string, code: string): string {
  if (code === DEFAULT_LOCALE || !LOCALIZED_ROUTES.some((r) => r.test(path))) return path;
  return localizedPath(path, code);
}

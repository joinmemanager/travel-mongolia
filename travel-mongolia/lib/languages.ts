// Сайтын хэлний сонголт (Google Translate-ийн кодуудтай таарсан). Navbar-ийн хэл сонгогч болон
// footer-ийн дээрх статистикийн «Хэл» тоо (lib/siteStats.ts) эндээс уншина.
export const SITE_LANGUAGES = [
  { code: 'mn', label: 'MN', name: 'Монгол' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh-CN', label: 'ZH', name: '中文' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'ko', label: 'KO', name: '한국어' },
  { code: 'ja', label: 'JA', name: '日本語' },
] as const;

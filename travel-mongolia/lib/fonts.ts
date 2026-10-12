import { Nunito_Sans } from 'next/font/google';

// Сайтын үндсэн фонт. Зөвхөн энд тохируулна: --font-site хувьсагчийг globals.css-ийн
// --font-sans уншдаг тул бүх бичиг үүнийг авна.
// Худалдаж авсан фонт руу шилжих бол энэ файлд next/font/local-оор ижил variable нэртэй
// (--font-site) фонт үүсгэхэд л хангалттай.
// Ө, Ү, ө, ү нь cyrillic-ext subset-д байдаг тул заавал оруулна (үгүй бол өөр фонтоор гарна).
// Хувилбарууд (Ө, Ү зөв харагддаг, шалгасан): Manrope, Onest, Golos Text.
export const siteFont = Nunito_Sans({
  subsets: ['latin', 'cyrillic', 'cyrillic-ext'],
  variable: '--font-site',
  display: 'swap',
});

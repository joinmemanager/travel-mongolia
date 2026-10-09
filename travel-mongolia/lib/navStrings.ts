// Дээд цэсний (Navbar) бичвэрүүд орчуулгын түлхүүрээр. /en/ хувилбарт англи бичиг нь эндээс гарна.
// Цэсний хэсэг, хуудасны нэрс lib/navigation.ts-ийн mn/en талбараас ирнэ.
export const NAV_STRINGS = {
  mn: {
    mainNav: 'Үндсэн цэс',
    viewAll: 'Бүгдийг үзэх',
    closePanel: 'Цэс хаах',
    openMenu: 'Цэс нээх',
    closeMenu: 'Цэс хаах',
    search: 'Хайх',
    planBook: 'Төлөвлөх & захиалах',
    language: 'Хэл сонгох',
  },
  en: {
    mainNav: 'Main menu',
    viewAll: 'View all',
    closePanel: 'Close menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    search: 'Search',
    planBook: 'Plan & Book',
    language: 'Choose language',
  },
} as const;

export type NavStringKey = keyof (typeof NAV_STRINGS)['mn'];

export function navText(lang: string, key: NavStringKey): string {
  return (lang === 'en' ? NAV_STRINGS.en : NAV_STRINGS.mn)[key];
}

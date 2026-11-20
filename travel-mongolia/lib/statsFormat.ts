// Footer-ийн дээрх статистикийн өгөгдлийн хэлбэр, тоо бичих дүрэм (server ба client хоёуланд).

export interface StatItem {
  key: string;
  label: string;
  value: number;
  // true бол «+» залгана (контентын 100-аас дээш тоог доош нь бүхэлдсэн)
  plus?: boolean;
  // Тооны доорх жижиг бичиг
  note?: string;
}

export interface SiteStatsData {
  // GA4 тохируулаагүй эсвэл алдаатай бол null (мөр харагдахгүй)
  visitors: StatItem[] | null;
  content: StatItem[];
}

// Мянгатын таслалтай (1,234). Хэлнээс үл хамааран нэг хэлбэр.
export const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US');

// Контентын тоо: 100-аас дээш бол зуутаар доош бүхэлдэж «+» (3,547 → 3,500+)
export function roundedCount(key: string, label: string, n: number): StatItem {
  return n > 100 ? { key, label, value: Math.floor(n / 100) * 100, plus: true } : { key, label, value: n };
}

export const statText = (item: Pick<StatItem, 'value' | 'plus'>, value = item.value) =>
  `${formatNumber(value)}${item.plus ? '+' : ''}`;

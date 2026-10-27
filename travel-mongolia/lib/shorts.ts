// Нүүр хуудасны YouTube Shorts мөрүүд (components/shorts/) болон /stories/shorts хуудсууд.
// Хожим YouTube playlist-аас татах үед зөвхөн SHORTS_CATEGORIES-ийн videos-ийг playlist-ийн
// бичлэгүүдээр (playlistItems: snippet.resourceId.videoId, snippet.title) солиход хангалттай.

export interface Short {
  // YouTube-ийн бичлэгийн ID (youtube.com/shorts/<id>)
  id: string;
  title: string;
}

export interface ShortsCategory {
  slug: string;
  // Нүүр хуудасны табын богино нэр
  tab: string;
  title: string;
  // Ирээдүйд: YouTube playlist ID (одоохондоо хоосон)
  playlistId?: string;
  videos: Short[];
}

export const SHORTS_BASE = '/stories/shorts';

// /stories/shorts/* хуудсыг хайлтад бүртгүүлэх эсэх. Одоохондоо false: бичлэгүүд сэдвүүдийн
// хооронд түр давхардсан. true болгоход noindex арилж, sitemap-д орно (app/sitemap.ts).
export const SHORTS_INDEXABLE = false;

// Нүүр хуудасны идэвхтэй табд харагдах бичлэгийн тоо (дараа нь «Бүгдийг үзэх» карт)
export const SHORTS_PER_ROW = 5;

// Сэдэв бүрийн үндсэн бичлэг (мөрийн 1-р байранд)
const PRIMARY: (Omit<ShortsCategory, 'videos'> & { primary: Short })[] = [
  { slug: 'traditions', tab: 'Уламжлалт ёс заншил', title: 'Монголын уламжлалт ёс заншил', primary: { id: 'oV5YadlXGtg', title: 'Хүүхдэд нэр өгөх ёсон' } },
  { slug: 'historical-figures', tab: 'Түүхэн эрхмүүд', title: 'Монголын түүхэн эрхмүүд', primary: { id: '0ggvLuv1kaQ', title: 'Өгий нуур' } },
  { slug: 'buddhism', tab: 'Бурхны шашин', title: 'Монголын бурхны шашин', primary: { id: 'IojZuuEYEnQ', title: 'Майдар бурхан' } },
  { slug: 'heritage', tab: 'Түүхийн өв соёл', title: 'Монголын түүхийн өв соёл', primary: { id: 'PWuh730EyfU', title: 'Цонжинболдог - Чингис хааны морьт хөшөө' } },
  { slug: 'nature', tab: 'Байгалийн өв соёл', title: 'Монголын байгалийн өв соёл', primary: { id: '4GG-iRIGOsc', title: 'Тамчийн хавцал' } },
  { slug: 'legends', tab: 'Домог, аман түүх', title: 'Монголын домог, аман түүх', primary: { id: 'jjQDD2s4a88', title: 'Шар нохойн там' } },
  { slug: 'monasteries', tab: 'Сүм хийдүүд', title: 'Монголын сүм хийдүүд', primary: { id: 'h1dhzBGfFqU', title: 'Хамрын хийд' } },
];

// ТҮР ДҮҮРГЭЛТ: сэдэв бүр өөрийн үндсэн бичлэг + бусад 6 сэдвийн үндсэн бичлэгтэй (нийт 7).
// Мөр бүрт дараалал өөр боловч тогтмол (i-р сэдэвт i+1, i+2, … дугаартай сэдвүүд), build бүрт
// өөрчлөгдөхгүй. Сэдэв бүрийн жинхэнэ бичлэгүүд (playlist) орж ирэхэд энэ дүүргэлтийг устгана.
export const SHORTS_CATEGORIES: ShortsCategory[] = PRIMARY.map(({ slug, tab, title }, i) => ({
  slug,
  tab,
  title,
  videos: PRIMARY.map((_, k) => PRIMARY[(i + k) % PRIMARY.length].primary),
}));

export function getShortsCategory(slug: string): ShortsCategory | undefined {
  return SHORTS_CATEGORIES.find((c) => c.slug === slug);
}

export const shortsHref = (slug: string) => `${SHORTS_BASE}/${slug}`;
export const youtubeShortUrl = (id: string) => `https://www.youtube.com/shorts/${id}`;
export const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
// oardefault: босоо (Shorts) нүүр зураг. Зарим бичлэгт байхгүй тул onError дээр hqdefault руу шилжинэ.
export const shortThumb = (id: string) => `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
export const shortThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// Хайлтаас нуух metadata (SHORTS_INDEXABLE false үед)
export const SHORTS_ROBOTS = SHORTS_INDEXABLE ? undefined : { index: false, follow: true };

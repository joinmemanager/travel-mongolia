// Нүүр хуудасны YouTube Shorts мөрүүд (components/shorts/) болон «Фото/видео түүх» хэсгийн хуудсууд
// (/stories/photo-video, /stories/photo-video/<slug>; хуучин /stories/shorts/* 308, next.config.js).
// Цэсний дэд холбоосууд, хэсгийн жагсаалтын мөрүүд SHORTS_CATEGORIES-оос үүснэ (lib/navigation.ts).
// Сэдэв бүрийн бичлэгүүдийг хэл бүрийн YouTube playlist-аас серверт татна (lib/shortsData.ts, docs/shorts.md).
// Энэ файлыг client компонент ч импортолдог тул API түлхүүр, fetch, playlist ID энд байхгүй.
// Сэдвийн нэр, UI бичвэрийн орчуулга: lib/shortsI18n.ts.

// Сайтын хэлүүд: components/Navbar.tsx-ийн LANGUAGES, googtrans cookie-ийн код (components/useSiteLang.ts)
export const SHORTS_LANGS = ['mn', 'en', 'zh-CN', 'ru', 'ko', 'ja'] as const;
export type ShortsLang = (typeof SHORTS_LANGS)[number];
export const isShortsLang = (v: string | undefined): v is ShortsLang => (SHORTS_LANGS as readonly string[]).includes(v || '');

// Бичлэг сонгох дараалал: тухайн хэлний playlist → англи → монгол (хоосон, бичлэггүй, алдаатай бол дараагийнх)
export const langChain = (lang: ShortsLang): ShortsLang[] => [...new Set<ShortsLang>([lang, 'en', 'mn'])];

export interface Short {
  // YouTube-ийн бичлэгийн ID (youtube.com/shorts/<id>)
  id: string;
  title: string;
  // Бичлэг YouTube-д нийтлэгдсэн огноо (contentDetails.videoPublishedAt, VideoObject-ийн uploadDate)
  uploadDate?: string;
  // Playlist-д нэмэгдсэн огноо (snippet.publishedAt, sitemap-ийн lastmod)
  addedAt?: string;
  // Бичлэг аль хэлний playlist-аас ирсэн (VideoObject inLanguage, индексийн тоо). Байхгүй бол 'mn'.
  lang?: ShortsLang;
}

export interface ShortsCategory {
  slug: string;
  // Нүүр хуудасны табын богино нэр (монгол; бусад хэл lib/shortsI18n.ts)
  tab: string;
  title: string;
  // API ажиллахгүй, кэш байхгүй үед харуулах үндсэн бичлэг (монгол playlist-аас). Түүхэн эрхмүүдийн
  // playlist хоосон тул байхгүй (өмнөх «Өгий нуур» нь байгалийн сэдвийнх).
  fallback?: Short;
}

// Хуудсанд харуулах сэдэв: playlist-ийн бичлэгүүдтэй (эсвэл алдааны үед fallback-тай)
export interface ShortsTopic extends ShortsCategory {
  videos: Short[];
}

export const SHORTS_BASE = '/stories/photo-video';

// Next.js Data Cache: өдөрт нэг удаа шинэчилнэ, /api/revalidate?tag=shorts гараар
export const SHORTS_TAG = 'shorts';
export const SHORTS_TTL = 86400;

// Нүүр хуудасны идэвхтэй табд харагдах бичлэгийн тоо (илүү бол «+N / Бүгдийг үзэх» карт)
export const SHORTS_PER_ROW = 5;

// Хайлтад бүртгүүлэх (index, sitemap) доод хэмжээ: сэдвийн хуудас өөрийн 5+, «Бүгд» нийт 10+ бичлэгтэй
export const SHORTS_TOPIC_INDEX_MIN = 5;
export const SHORTS_ALL_INDEX_MIN = 10;

// Сэдэв бүрийн playlist ID хэлээр: lib/shortsData.ts-ийн SHORTS_PLAYLISTS
export const SHORTS_CATEGORIES: ShortsCategory[] = [
  { slug: 'traditions', tab: 'Уламжлалт ёс заншил', title: 'Монголын уламжлалт ёс заншил', fallback: { id: 'oV5YadlXGtg', title: 'Хүүхдэд нэр өгөх ёсон' } },
  { slug: 'historical-figures', tab: 'Түүхэн эрхмүүд', title: 'Монголын түүхэн эрхмүүд' },
  { slug: 'buddhism', tab: 'Бурхны шашин', title: 'Монголын бурхны шашин', fallback: { id: 'IojZuuEYEnQ', title: 'Майдар бурхан' } },
  { slug: 'heritage', tab: 'Түүхийн өв соёл', title: 'Монголын түүхийн өв соёл', fallback: { id: 'PWuh730EyfU', title: 'Цонжинболдог - Чингис хааны морьт хөшөө' } },
  { slug: 'nature', tab: 'Байгалийн өв соёл', title: 'Монголын байгалийн өв соёл', fallback: { id: '4GG-iRIGOsc', title: 'Тамчийн хавцал' } },
  { slug: 'legends', tab: 'Домог, аман түүх', title: 'Монголын домог, аман түүх', fallback: { id: 'jjQDD2s4a88', title: 'Шар нохойн там' } },
  { slug: 'monasteries', tab: 'Сүм хийдүүд', title: 'Монголын сүм хийдүүд', fallback: { id: 'h1dhzBGfFqU', title: 'Хамрын хийд' } },
];

// Playlist-ийн утгаас ID: «PL…» ID-г шууд, YouTube-ийн холбоосоос (…?list=<ID>&…) list параметрийг.
// Хоосон эсвэл танигдахгүй утга бол '' (тухайн хэлний playlist байхгүй гэж үзнэ).
export function playlistIdFrom(value: string | undefined): string {
  const v = (value || '').trim();
  const fromUrl = v.match(/[?&]list=([\w-]+)/);
  if (fromUrl) return fromUrl[1];
  return /^[\w-]+$/.test(v) ? v : '';
}

export function getShortsCategory(slug: string): ShortsCategory | undefined {
  return SHORTS_CATEGORIES.find((c) => c.slug === slug);
}

// ---------------------------------------------------------------- YouTube API-ийн хариу задлах
// Цэвэр функцууд (fetch-гүй), scripts/shorts/test-parse.js шалгадаг.

// Устсан, хувийн болсон бичлэг playlist-д ийм гарчигтай үлддэг
const UNAVAILABLE_TITLES = new Set(['Private video', 'Deleted video']);

// playlistItems.list (part=snippet,contentDetails)-ийн items → playlist дахь дарааллаар, давхардалгүй.
// videoPublishedAt байхгүй бол бичлэг нийтлэгдээгүй (хувийн, устсан, товлосон) гэж үзнэ.
export function parsePlaylistItems(items: any[]): Short[] {
  const seen = new Set<string>();
  return [...(items || [])]
    .sort((a, b) => (a?.snippet?.position ?? 0) - (b?.snippet?.position ?? 0))
    .flatMap((item): Short[] => {
      const id: string | undefined = item?.contentDetails?.videoId || item?.snippet?.resourceId?.videoId;
      const title = typeof item?.snippet?.title === 'string' ? item.snippet.title.trim() : '';
      const uploadDate: string | undefined = item?.contentDetails?.videoPublishedAt;
      if (!id || !title || UNAVAILABLE_TITLES.has(title) || !uploadDate || seen.has(id)) return [];
      seen.add(id);
      return [{ id, title, uploadDate, addedAt: item?.snippet?.publishedAt }];
    });
}

// videos.list (part=status)-ийн items → сайт дотор тоглуулж болох бичлэгийн ID. Устсан бичлэг
// хариунд огт ирдэггүй. Хувийн, embed хаасан, боловсруулалт дуусаагүй бичлэгийг хасна.
export function playableIds(items: any[]): Set<string> {
  return new Set(
    (items || [])
      .filter(
        (v) =>
          v?.id &&
          v.status?.privacyStatus !== 'private' &&
          v.status?.embeddable !== false &&
          (!v.status?.uploadStatus || v.status.uploadStatus === 'processed')
      )
      .map((v) => v.id as string)
  );
}

// ---------------------------------------------------------------- туслах

// «Бүгд»: бичлэгтэй сэдвүүдийн бүх бичлэг, сэдвийн дарааллаар, давхардалгүй
export function allShorts(topics: ShortsTopic[]): Short[] {
  return Array.from(new Map(topics.flatMap((t) => t.videos).map((v) => [v.id, v])).values());
}

// Хамгийн сүүлд playlist-д нэмэгдсэн бичлэгийн огноо (sitemap lastmod)
export function lastAdded(videos: Short[]): string | undefined {
  return videos.map((v) => v.addedAt).filter((d): d is string => !!d).sort().at(-1);
}

// Хуудасны хэлний (lang) өөрийн бичлэг л индексийн тоонд орно: өөр хэлний playlist-аас fallback-аар
// ирсэн бичлэг тоологдохгүй. Одоо сервер зөвхөн монгол хуудас render хийдэг тул lang = 'mn'.
const ownLang = (videos: Short[], lang: ShortsLang) => videos.filter((v) => (v.lang || 'mn') === lang);
export const isTopicIndexable = (t: ShortsTopic, lang: ShortsLang = 'mn') =>
  ownLang(t.videos, lang).length >= SHORTS_TOPIC_INDEX_MIN;
export const isAllIndexable = (topics: ShortsTopic[], lang: ShortsLang = 'mn') =>
  ownLang(allShorts(topics), lang).length >= SHORTS_ALL_INDEX_MIN;
export const SHORTS_NOINDEX = { index: false, follow: true };

export const shortsHref = (slug: string) => `${SHORTS_BASE}/${slug}`;
export const youtubeShortUrl = (id: string) => `https://www.youtube.com/shorts/${id}`;
export const youtubeEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
// oardefault: босоо (Shorts) нүүр зураг. Зарим бичлэгт байхгүй тул onError дээр hqdefault руу шилжинэ.
export const shortThumb = (id: string) => `https://i.ytimg.com/vi/${id}/oardefault.jpg`;
export const shortThumbFallback = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

// Index хийгдэх хуудасны VideoObject JSON-LD: зөвхөн хуудасны хэлний бичлэг, uploadDate-тэй (статик
// fallback бичлэгийг оруулахгүй). <script>-д шууд тавих мөр: гарчиг дахь «<»-г escape хийнэ.
export function shortsJsonLd(videos: Short[], lang: ShortsLang = 'mn'): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': ownLang(videos, lang)
      .filter((v) => v.uploadDate)
      .map((v) => ({
        '@type': 'VideoObject',
        name: v.title,
        thumbnailUrl: shortThumbFallback(v.id),
        uploadDate: v.uploadDate,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
        inLanguage: v.lang || 'mn',
      })),
  }).replace(/</g, '\\u003c');
}

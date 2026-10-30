import { cache } from 'react';

import {
  langChain,
  parsePlaylistItems,
  playableIds,
  playlistIdFrom,
  type Short,
  SHORTS_CATEGORIES,
  SHORTS_TAG,
  SHORTS_TTL,
  type ShortsCategory,
  type ShortsLang,
  type ShortsTopic,
} from './shorts';

// Сэдэв бүрийн бичлэгийг хэл бүрийн playlist-аас YouTube Data API v3-аар серверт татна (docs/shorts.md).
// Зөвхөн server component, route-оос импортолно (client компонент lib/shorts.ts-ийг л).
// - YOUTUBE_API_KEY: Vercel Production + Preview-д Secret. Зөвхөн энд, header-ээр (URL, log-д гарахгүй).
// - Хүсэлт бүр (хэл, playlist бүр тусдаа URL) Next.js-ийн fetch кэшид (Data Cache) 24 цаг, tag `shorts`.
//   Fetch кэш зөвхөн 200 хариуг хадгалдаг: хугацаа нь дууссаны дараах шинэчлэлт алдаа (квот, сүлжээ)
//   өгвөл өмнөх сайн хариу үлдэнэ.
// - Хэлний сонголт: тухайн хэлний playlist → англи → монгол (langChain). Хоосон ID, бичлэггүй, алдаатай
//   playlist-ийг алгасна. Монгол playlist кэшгүй алдаа өгвөл lib/shorts.ts-ийн fallback бичлэг гарна.
// Квот: playlistItems.list, videos.list тус бүр 1 unit / хуудас (50 бичлэг). Хоосон ID-д хүсэлт явахгүй.

// Хэл бүрийн 7 сэдвийн playlist. Утга нь ID («PL…») эсвэл YouTube-ийн холбоос
// (https://www.youtube.com/playlist?list=PL…) байж болно, ID-г playlistIdFrom салгана.
// '' = тухайн хэлний playlist байхгүй (англи, тэгээд монгол playlist-ийн бичлэг гарна).
// Шинэ хэлний playlist нэмэх заавар: docs/shorts.md.
export const SHORTS_PLAYLISTS: Record<ShortsLang, Record<string, string>> = {
  mn: {
    traditions: 'PLIMfWmpU8Ivs',
    'historical-figures': 'PLF1xGAd_uK44',
    buddhism: 'PLAt3jou1DKhM',
    heritage: 'PLd_YRUvE5-xk',
    nature: 'PLNqTP1hahZQA',
    legends: 'PLQQAdddZOPKI',
    monasteries: 'PLHl9G7wHh6tQ',
  },
  // YouTube дээрх нэр: nature = «Байгалийн үзэсгэлэнт газрууд», heritage = «Түүхэн дурсгалт газрууд»
  en: {
    traditions: 'https://www.youtube.com/playlist?list=PLEAnyzHRygC0',
    'historical-figures': 'https://www.youtube.com/playlist?list=PLYtu2YRrGxGQ',
    buddhism: 'https://www.youtube.com/playlist?list=PLUMYnthsKV48',
    heritage: 'https://www.youtube.com/playlist?list=PLOEIqqSi3KYQ',
    nature: 'https://www.youtube.com/playlist?list=PLZpDKrPkgbIQ',
    legends: 'https://www.youtube.com/playlist?list=PLf5oM-3fIIA8',
    monasteries: 'https://www.youtube.com/playlist?list=PLPeZA0jQCc7U',
  },
  'zh-CN': {
    traditions: 'https://www.youtube.com/playlist?list=PLN-ZAwnOtUVk',
    'historical-figures': 'https://www.youtube.com/playlist?list=PLbpkKX1HAXro',
    buddhism: 'https://www.youtube.com/playlist?list=PLFDtnqXjj_Tw',
    heritage: 'https://www.youtube.com/playlist?list=PLK99Vp_4tke8',
    nature: 'https://www.youtube.com/playlist?list=PLNqsf4RxYraY',
    legends: 'https://www.youtube.com/playlist?list=PLBgx3RZjeO-c',
    monasteries: 'https://www.youtube.com/playlist?list=PLO3ku4xUYrwk',
  },
  ru: {
    traditions: '',
    'historical-figures': '',
    buddhism: 'https://www.youtube.com/playlist?list=PLHUAZ1wvQVZw',
    heritage: 'https://www.youtube.com/playlist?list=PLOv5Wnaus2Tc',
    nature: 'https://www.youtube.com/playlist?list=PLcX2kOWnYCdM',
    legends: '',
    monasteries: '',
  },
  ko: {
    traditions: 'https://www.youtube.com/playlist?list=PLD94bZ_hx1M4',
    'historical-figures': 'https://www.youtube.com/playlist?list=PLNQXDU7R59HA',
    buddhism: 'https://www.youtube.com/playlist?list=PLTeEY9X3Ieew',
    heritage: 'https://www.youtube.com/playlist?list=PLdoHqDfN5FGs',
    nature: 'https://www.youtube.com/playlist?list=PLK3AwxyxL84s',
    legends: 'https://www.youtube.com/playlist?list=PLG9a0RbLEf9c',
    monasteries: 'https://www.youtube.com/playlist?list=PLBCsd1AdNgKc',
  },
  ja: {
    traditions: 'https://www.youtube.com/playlist?list=PLN6igQ_UPLfY',
    'historical-figures': 'https://www.youtube.com/playlist?list=PLErBy5ne1nDo',
    buddhism: 'https://www.youtube.com/playlist?list=PLO9WhIJE_rzo',
    heritage: 'https://www.youtube.com/playlist?list=PLEMDoWjBTOmA',
    nature: 'https://www.youtube.com/playlist?list=PLLd5d6kcsMxg',
    legends: 'https://www.youtube.com/playlist?list=PLJdCWlpGda6c',
    monasteries: 'https://www.youtube.com/playlist?list=PLO32UflYCCE0',
  },
};

export const playlistFor = (lang: ShortsLang, slug: string) => playlistIdFrom(SHORTS_PLAYLISTS[lang]?.[slug]);

const API = 'https://www.googleapis.com/youtube/v3';
// nextPageToken-ий хамгаалалт (50 × 20 = 1000 бичлэг)
const MAX_PAGES = 20;

async function youtube(path: string, params: Record<string, string>, init?: RequestInit): Promise<any> {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error('YOUTUBE_API_KEY тохируулаагүй');
  const res = await fetch(`${API}/${path}?${new URLSearchParams(params)}`, {
    headers: { 'X-goog-api-key': key },
    ...(init || { next: { revalidate: SHORTS_TTL, tags: [SHORTS_TAG] } }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(`${path} ${res.status} ${body?.error?.errors?.[0]?.reason || ''}`.trim());
  }
  return res.json();
}

async function fetchPlaylist(playlistId: string): Promise<Short[]> {
  const items: any[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await youtube('playlistItems', {
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: '50',
      ...(pageToken && { pageToken }),
    });
    items.push(...(data.items || []));
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  const videos = parsePlaylistItems(items);

  // Тоглуулах боломжтой эсэх (хувийн, embed хаасан)
  const playable = new Set<string>();
  for (let i = 0; i < videos.length; i += 50) {
    const ids = videos.slice(i, i + 50).map((v) => v.id);
    const data = await youtube('videos', { part: 'status', id: ids.join(','), maxResults: '50' });
    playableIds(data.items).forEach((id) => playable.add(id));
  }
  return videos.filter((v) => playable.has(v.id));
}

const withFallback = (c: ShortsCategory): ShortsTopic => ({
  ...c,
  videos: c.fallback ? [{ ...c.fallback, lang: 'mn' }] : [],
});

// Нэг render-т playlist бүрийг нэг л удаа (хэлний хэд хэдэн сонголт ижил playlist руу унаж болно).
// Алдаатай бол null.
const playlist = cache(async (id: string): Promise<Short[] | null> => {
  try {
    return await fetchPlaylist(id);
  } catch (err) {
    console.error(`Shorts: ${id} playlist татаж чадсангүй (${(err as Error)?.message})`);
    return null;
  }
});

async function topicFor(c: ShortsCategory, lang: ShortsLang): Promise<ShortsTopic> {
  let mnFailed = false;
  for (const l of langChain(lang)) {
    const id = playlistFor(l, c.slug);
    if (!id) continue;
    const videos = await playlist(id);
    if (videos === null && l === 'mn') mnFailed = true;
    if (videos?.length) return { ...c, videos: videos.map((v) => ({ ...v, lang: l })) };
  }
  return mnFailed ? withFallback(c) : { ...c, videos: [] };
}

// Нэг render-т (хуудас + generateMetadata + sitemap) хэл бүрээр нэг удаа
const topicsFor = cache(async (lang: ShortsLang): Promise<ShortsTopic[]> => {
  if (!process.env.YOUTUBE_API_KEY) {
    console.warn('Shorts: YOUTUBE_API_KEY алга, статик fallback бичлэг харуулна');
    return SHORTS_CATEGORIES.map(withFallback);
  }
  return Promise.all(SHORTS_CATEGORIES.map((c) => topicFor(c, lang)));
});

export const getShortsTopics = (lang: ShortsLang = 'mn') => topicsFor(lang);

export async function getShortsTopic(slug: string, lang: ShortsLang = 'mn'): Promise<ShortsTopic | undefined> {
  return (await topicsFor(lang)).find((t) => t.slug === slug);
}

// /api/revalidate?tag=shorts: кэшийг устгахаас өмнө API ажиллаж байгааг кэшгүйгээр шалгана (1 unit).
// Алдаатай үед кэшийг хөндөхгүй, тэгэхгүй бол сайн кэш устаж fallback 24 цаг гарна.
export async function checkShortsApi(): Promise<string | null> {
  try {
    await youtube(
      'playlistItems',
      { part: 'id', playlistId: playlistFor('mn', SHORTS_CATEGORIES[0].slug), maxResults: '1' },
      { cache: 'no-store' }
    );
    return null;
  } catch (err) {
    return (err as Error)?.message || 'алдаа';
  }
}

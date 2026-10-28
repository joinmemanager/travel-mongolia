import { cache } from 'react';

import {
  parsePlaylistItems,
  playableIds,
  type Short,
  SHORTS_CATEGORIES,
  SHORTS_TAG,
  SHORTS_TTL,
  type ShortsCategory,
  type ShortsTopic,
} from './shorts';

// Сэдэв бүрийн бичлэгийг YouTube Data API v3-аас серверт татна (docs/shorts.md). Зөвхөн server
// component, route-оос импортолно (client компонент lib/shorts.ts-ийг л).
// - YOUTUBE_API_KEY: Vercel Production + Preview-д Secret. Зөвхөн энд, header-ээр (URL, log-д гарахгүй).
// - Хүсэлт бүр Next.js-ийн fetch кэшид (Data Cache) 24 цаг, tag `shorts`. Fetch кэш зөвхөн 200 хариуг
//   хадгалдаг: хугацаа нь дууссаны дараах шинэчлэлт алдаа (квот, сүлжээ) өгвөл өмнөх сайн хариу үлдэнэ.
// - Кэш байхгүй үед алдаа гарвал тухайн сэдэв lib/shorts.ts-ийн fallback бичлэгээ харуулна.
// Квот: playlistItems.list, videos.list тус бүр 1 unit / хуудас (50 бичлэг).

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

const withFallback = (c: ShortsCategory): ShortsTopic => ({ ...c, videos: c.fallback ? [c.fallback] : [] });

// Нэг render-т (хуудас + generateMetadata + sitemap) нэг удаа
export const getShortsTopics = cache(async (): Promise<ShortsTopic[]> => {
  if (!process.env.YOUTUBE_API_KEY) {
    console.warn('Shorts: YOUTUBE_API_KEY алга, статик fallback бичлэг харуулна');
    return SHORTS_CATEGORIES.map(withFallback);
  }
  return Promise.all(
    SHORTS_CATEGORIES.map(async (c) => {
      try {
        return { ...c, videos: await fetchPlaylist(c.playlistId) };
      } catch (err) {
        console.error(`Shorts: ${c.slug} playlist татаж чадсангүй (${(err as Error)?.message}), fallback харуулна`);
        return withFallback(c);
      }
    })
  );
});

export async function getShortsTopic(slug: string): Promise<ShortsTopic | undefined> {
  return (await getShortsTopics()).find((t) => t.slug === slug);
}

// /api/revalidate?tag=shorts: кэшийг устгахаас өмнө API ажиллаж байгааг кэшгүйгээр шалгана (1 unit).
// Алдаатай үед кэшийг хөндөхгүй, тэгэхгүй бол сайн кэш устаж fallback 24 цаг гарна.
export async function checkShortsApi(): Promise<string | null> {
  try {
    await youtube(
      'playlistItems',
      { part: 'id', playlistId: SHORTS_CATEGORIES[0].playlistId, maxResults: '1' },
      { cache: 'no-store' }
    );
    return null;
  } catch (err) {
    return (err as Error)?.message || 'алдаа';
  }
}

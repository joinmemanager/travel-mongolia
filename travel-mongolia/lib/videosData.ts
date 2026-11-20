import { cache } from 'react';

import { parsePlaylistItems } from './shorts';
import { youtube } from './shortsData';
import { type Video, VIDEOS_PLAYLIST, VIDEOS_TAG, VIDEOS_TTL } from './videos';

// «Монголын үзэсгэлэн» playlist-ийн бичлэгүүдийг YouTube Data API v3-аар серверт татна (lib/shortsData.ts-ийн
// youtube(): YOUTUBE_API_KEY header-ээр, URL/log-д гарахгүй). Хүсэлт бүр Next.js-ийн fetch кэшид 24 цаг
// (tag `videos`), тиймээс өдөрт нэг л удаа API руу явна. Fetch кэш зөвхөн 200 хариуг хадгалдаг тул
// шинэчлэлт алдаа өгвөл өмнөх сайн хариу үлдэнэ. Кэшгүй алдаа (эсвэл түлхүүр байхгүй) бол null: нүүрний
// хэсэг нуугдана, /videos хуудас noindex. Квот: playlistItems + videos тус бүр 1 unit / 50 бичлэг.

const init = { next: { revalidate: VIDEOS_TTL, tags: [VIDEOS_TAG] } } as RequestInit;
const MAX_PAGES = 10;

async function fetchVideos(): Promise<Video[]> {
  const items: any[] = [];
  let pageToken: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await youtube(
      'playlistItems',
      { part: 'snippet,contentDetails', playlistId: VIDEOS_PLAYLIST, maxResults: '50', ...(pageToken && { pageToken }) },
      init
    );
    items.push(...(data.items || []));
    pageToken = data.nextPageToken;
    if (!pageToken) break;
  }
  // Playlist-ийн дараалал (position), устсан/хувийн бичлэг хасагдана
  const listed = parsePlaylistItems(items);
  const descriptions = new Map<string, string>(
    items.map((it) => [it?.contentDetails?.videoId, String(it?.snippet?.description || '')])
  );

  // Үргэлжлэх хугацаа, сайт дотор тоглуулж болох эсэх (embed хаасан, хувийн бичлэгийг хасна)
  const details = new Map<string, any>();
  for (let i = 0; i < listed.length; i += 50) {
    const ids = listed.slice(i, i + 50).map((v) => v.id);
    const data = await youtube('videos', { part: 'contentDetails,status', id: ids.join(','), maxResults: '50' }, init);
    for (const v of data.items || []) details.set(v.id, v);
  }
  return listed
    .filter((v) => {
      const d = details.get(v.id);
      return (
        d &&
        d.status?.privacyStatus !== 'private' &&
        d.status?.embeddable !== false &&
        (!d.status?.uploadStatus || d.status.uploadStatus === 'processed')
      );
    })
    .map((v) => ({
      id: v.id,
      title: v.title,
      uploadDate: v.uploadDate,
      addedAt: v.addedAt,
      duration: details.get(v.id)?.contentDetails?.duration,
      description: descriptions.get(v.id),
    }));
}

// Нэг render-т (хуудас + generateMetadata + sitemap) нэг удаа. Алдаа/түлхүүргүй бол null.
export const getVideos = cache(async (): Promise<Video[] | null> => {
  if (!process.env.YOUTUBE_API_KEY) {
    console.warn('Videos: YOUTUBE_API_KEY алга, «Монголын үзэсгэлэн» хэсэг нуугдана');
    return null;
  }
  try {
    return await fetchVideos();
  } catch (err) {
    console.error(`Videos: ${VIDEOS_PLAYLIST} playlist татаж чадсангүй (${(err as Error)?.message})`);
    return null;
  }
});

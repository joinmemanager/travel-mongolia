// «Монголын үзэсгэлэн»: хэвтээ (16:9) YouTube бичлэгүүд. Нүүр хуудсанд Shorts-ийн доор эхний 3 нь,
// /videos хуудсанд бүгд. Өгөгдөл: lib/videosData.ts (серверт, YOUTUBE_API_KEY). Энэ файлыг client
// компонент ч импортолдог тул API түлхүүр, fetch энд байхгүй.

export const VIDEOS_TITLE = 'Монголын үзэсгэлэн';
export const VIDEOS_BASE = '/videos';
// YouTube playlist (шинэ богино ID хэлбэр). Дараалал нь playlist дээрхтэй ижил.
export const VIDEOS_PLAYLIST = 'PLNhR4Ruqh138';
// Next.js Data Cache: өдөрт нэг удаа шинэчилнэ (/api/revalidate?tag=videos гараар)
export const VIDEOS_TAG = 'videos';
export const VIDEOS_TTL = 86400;
// Нүүр хуудсанд харуулах тоо
export const VIDEOS_HOME_COUNT = 3;

export interface Video {
  id: string;
  title: string;
  // ISO 8601 үргэлжлэх хугацаа (PT4M13S), videos.list contentDetails.duration
  duration?: string;
  // YouTube-д нийтлэгдсэн огноо (VideoObject uploadDate)
  uploadDate?: string;
  // Playlist-д нэмэгдсэн огноо (sitemap lastmod)
  addedAt?: string;
  description?: string;
}

// PT1H2M3S → «1:02:03», PT4M5S → «4:05»
export function formatDuration(iso?: string): string | undefined {
  const m = (iso || '').match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!m) return undefined;
  const h = Number(m[1] || 0) * 24 + Number(m[2] || 0);
  const min = Number(m[3] || 0);
  const s = Number(m[4] || 0);
  if (h + min + s === 0) return undefined;
  const pad = (n: number) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

// Нүүр зураг: hqdefault (480×360) бүх бичлэгт байдаг (maxresdefault заримд нь байхгүй, mqdefault жижиг).
// Дээд доод хар зураастай тул 16:9 хайрцагт object-cover-оор тайрч харуулна.
export const videoThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
export const videoEmbedUrl = (id: string) =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
export const videoWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

// Хамгийн сүүлд playlist-д нэмэгдсэн огноо (sitemap lastmod)
export function lastAddedVideo(videos: Video[]): string | undefined {
  return videos.map((v) => v.addedAt).filter((d): d is string => !!d).sort().at(-1);
}

// VideoObject JSON-LD (<script>-д шууд тавих мөр, «<»-г escape хийнэ)
export function videosJsonLd(videos: Video[], pageUrl: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: VIDEOS_TITLE,
    url: pageUrl,
    itemListElement: videos
      .filter((v) => v.uploadDate)
      .map((v, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'VideoObject',
          name: v.title,
          description: (v.description || '').trim().slice(0, 300) || v.title,
          thumbnailUrl: videoThumb(v.id),
          uploadDate: v.uploadDate,
          ...(v.duration && { duration: v.duration }),
          embedUrl: `https://www.youtube.com/embed/${v.id}`,
          contentUrl: videoWatchUrl(v.id),
          inLanguage: 'mn',
        },
      })),
  }).replace(/</g, '\\u003c');
}

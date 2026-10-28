import type { Metadata } from 'next';

import { ShortsComingSoon, ShortsGrid } from '@/components/shorts/Shorts';
import { metaFor } from '@/lib/pageMeta';
import { allShorts, isAllIndexable, SHORTS_NOINDEX, shortsJsonLd } from '@/lib/shorts';
import { getShortsTopics } from '@/lib/shortsData';

// «Фото/видео түүх» хэсгийн «Бүгд»: бичлэгтэй сэдвүүдийн бүх богино бичлэг (YouTube playlist, lib/shortsData.ts).
// Contentful ашиглахгүй. Hero, «Сэдвийн жагсаалт», замчлал нь (sec-photo)/layout.tsx-д.
// Нийт 10+ бичлэгтэй бол хайлтад бүртгэнэ (isAllIndexable, app/sitemap.ts), үгүй бол noindex.

// Цаг тутам дахин үүснэ (бичлэгүүд fetch кэшээс, app/page.tsx-ийн тайлбар)
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const topics = await getShortsTopics();
  return { ...metaFor('/stories/photo-video'), ...(!isAllIndexable(topics) && { robots: SHORTS_NOINDEX }) };
}

export default async function PhotoVideoStoriesPage() {
  const topics = await getShortsTopics();
  const videos = allShorts(topics);

  return (
    <div>
      {isAllIndexable(topics) && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: shortsJsonLd(videos) }} />
      )}
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-baseline mb-5">
        <h2 className="text-xl font-black tracking-tight sm:text-2xl text-neutral-900">Бүх сэдэв</h2>
        {videos.length > 0 && <p className="text-sm text-neutral-500">{videos.length} бичлэг</p>}
      </div>
      {videos.length > 0 ? <ShortsGrid videos={videos} category="all" /> : <ShortsComingSoon />}
    </div>
  );
}

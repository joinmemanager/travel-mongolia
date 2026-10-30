import type { Metadata } from 'next';

import { ShortsListing } from '@/components/shorts/Shorts';
import { metaFor } from '@/lib/pageMeta';
import { allShorts, isAllIndexable, SHORTS_NOINDEX, shortsJsonLd } from '@/lib/shorts';
import { getShortsTopics } from '@/lib/shortsData';

// «Фото/видео түүх» хэсгийн «Бүгд»: бичлэгтэй сэдвүүдийн бүх богино бичлэг (YouTube playlist, lib/shortsData.ts).
// Contentful ашиглахгүй. Hero, «Сэдвийн жагсаалт», замчлал нь (sec-photo)/layout.tsx-д.
// Сервер монгол хувилбарыг render хийнэ, өөр хэл сонгосон бол ShortsListing тухайн хэлнийхээр солино.
// Нийт 10+ монгол бичлэгтэй бол хайлтад бүртгэнэ (isAllIndexable, app/sitemap.ts), үгүй бол noindex.

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
      <ShortsListing videos={videos} category="all" />
    </div>
  );
}

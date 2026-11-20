import type { Metadata } from 'next';

import Breadcrumbs from '@/components/Breadcrumbs';
import { VideoGrid } from '@/components/videos/Videos';
import { pageMetadata, SITE_URL } from '@/lib/seo';
import { VIDEOS_BASE, VIDEOS_TITLE, videosJsonLd, videoThumb } from '@/lib/videos';
import { getVideos } from '@/lib/videosData';

// «Монголын үзэсгэлэн»: YouTube playlist-ийн бүх хэвтээ бичлэг, playlist-ийн дарааллаар (lib/videosData.ts).
// Нүүр хуудасны «Бүгдийг үзэх →» холбоос энд ирнэ. Contentful ашиглахгүй.
// Өдөрт нэг удаа дахин үүснэ: бичлэгийн жагсаалт ч fetch кэшид 24 цаг (CPU, YouTube квот хэмнэнэ).
// API алдаатай, бичлэггүй үед noindex (sitemap-д ч орохгүй, app/sitemap.ts).
export const revalidate = 86400;

const DESCRIPTION =
  'Монголын байгаль, нүүдлийн ахуй, соёлын үзэсгэлэнт газруудыг харуулсан бичлэгүүд. Сайтаас гаралгүй шууд үзээрэй.';

export async function generateMetadata(): Promise<Metadata> {
  const videos = await getVideos();
  const meta = pageMetadata({
    title: `${VIDEOS_TITLE}: Монголын тухай бичлэгүүд`,
    description: DESCRIPTION,
    path: VIDEOS_BASE,
    image: videos?.[0] ? videoThumb(videos[0].id) : undefined,
  });
  return videos?.length ? meta : { ...meta, robots: { index: false, follow: true } };
}

export default async function VideosPage() {
  const videos = await getVideos();

  return (
    <main className="py-10 px-6 pb-24 mx-auto max-w-7xl min-h-screen sm:px-10">
      {videos && videos.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: videosJsonLd(videos, `${SITE_URL}${VIDEOS_BASE}`) }}
        />
      )}
      <Breadcrumbs
        items={[
          { label: 'Нүүр', href: '/' },
          { label: VIDEOS_TITLE, href: VIDEOS_BASE },
        ]}
      />
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-baseline mb-8">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-neutral-900">{VIDEOS_TITLE}</h1>
        {videos && videos.length > 0 && (
          <p className="text-sm text-neutral-500">
            {videos.length} бичлэг
          </p>
        )}
      </div>
      <p className="mb-8 max-w-3xl text-base leading-relaxed text-neutral-600">{DESCRIPTION}</p>
      {videos && videos.length > 0 ? (
        <VideoGrid videos={videos} source="videos_page" headingLevel="h2" />
      ) : (
        <div className="py-12 px-6 text-center rounded-2xl border border-dashed bg-neutral-50 border-neutral-200">
          <p className="text-base font-bold text-neutral-800">Бичлэг түр ачаалагдсангүй</p>
          <p className="mt-1 text-sm text-neutral-500">Хэсэг хугацааны дараа дахин орж үзнэ үү.</p>
        </div>
      )}
    </main>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ShortsComingSoon, ShortsGrid } from '@/components/shorts/Shorts';
import { pageMetadata } from '@/lib/seo';
import { isTopicIndexable, SHORTS_CATEGORIES, SHORTS_NOINDEX, shortsHref, shortsJsonLd } from '@/lib/shorts';
import { getShortsTopic } from '@/lib/shortsData';

// Нэг сэдвийн бүх богино бичлэг (YouTube playlist, lib/shortsData.ts). Contentful ашиглахгүй. H1 (сэдвийн нэр),
// замчлалыг SectionPageHeader гаргана (жагсаалтын мөр = lib/navigation.ts-ийн children).
// 5+ бичлэгтэй бол хайлтад бүртгэнэ (isTopicIndexable, app/sitemap.ts), үгүй бол noindex.
interface Props {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;
// Цаг тутам дахин үүснэ (бичлэгүүд fetch кэшээс, app/page.tsx-ийн тайлбар)
export const revalidate = 3600;

export function generateStaticParams() {
  return SHORTS_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = await getShortsTopic((await params).category);
  if (!cat) return {};
  const count = cat.videos.length;
  return {
    ...pageMetadata({
      title: `${cat.title}: богино бичлэг`,
      description: count
        ? `${cat.title}-ийн тухай богино видео бичлэгүүд (${count}). Сайт дотроо тоглуулж үзээрэй.`
        : `${cat.title}-ийн тухай богино видео бичлэгүүд удахгүй нэмэгдэнэ.`,
      path: shortsHref(cat.slug),
    }),
    ...(!isTopicIndexable(cat) && { robots: SHORTS_NOINDEX }),
  };
}

export default async function ShortsCategoryPage({ params }: Props) {
  const cat = await getShortsTopic((await params).category);
  if (!cat) notFound();

  return (
    <div>
      {isTopicIndexable(cat) && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: shortsJsonLd(cat.videos) }} />
      )}
      {cat.videos.length > 0 ? (
        <>
          <p className="-mt-7 mb-6 text-sm text-neutral-500">{cat.videos.length} бичлэг</p>
          <ShortsGrid videos={cat.videos} category={cat.slug} />
        </>
      ) : (
        <ShortsComingSoon />
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ShortsGrid } from '@/components/shorts/Shorts';
import { pageMetadata } from '@/lib/seo';
import { getShortsCategory, SHORTS_CATEGORIES, SHORTS_ROBOTS, shortsHref } from '@/lib/shorts';

// Нэг сэдвийн бүх богино бичлэг. Contentful ашиглахгүй. H1 (сэдвийн нэр), замчлалыг
// SectionPageHeader гаргана (жагсаалтын мөр = lib/navigation.ts-ийн children).
interface Props {
  params: Promise<{ category: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return SHORTS_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getShortsCategory((await params).category);
  if (!cat) return {};
  return {
    ...pageMetadata({
      title: `${cat.title}: богино бичлэг`,
      description: `${cat.title}-ийн тухай богино видео бичлэгүүд (${cat.videos.length}). Сайт дотроо тоглуулж үзээрэй.`,
      path: shortsHref(cat.slug),
    }),
    ...(SHORTS_ROBOTS && { robots: SHORTS_ROBOTS }),
  };
}

export default async function ShortsCategoryPage({ params }: Props) {
  const cat = getShortsCategory((await params).category);
  if (!cat) notFound();

  return (
    <div>
      <p className="-mt-7 mb-6 text-sm text-neutral-500">{cat.videos.length} бичлэг</p>
      <ShortsGrid videos={cat.videos} category={cat.slug} />
    </div>
  );
}

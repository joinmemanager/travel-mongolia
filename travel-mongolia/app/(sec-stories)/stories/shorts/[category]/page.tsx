import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import Breadcrumbs from '@/components/Breadcrumbs';
import { ShortsGrid } from '@/components/shorts/Shorts';
import { pageMetadata } from '@/lib/seo';
import { getShortsCategory, SHORTS_BASE, SHORTS_CATEGORIES, SHORTS_ROBOTS, shortsHref } from '@/lib/shorts';

// Нэг сэдвийн бүх богино бичлэг (нүүр хуудасны «Бүгдийг үзэх»). Contentful ашиглахгүй.
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
      <Breadcrumbs
        items={[
          { label: 'Нүүр', href: '/' },
          { label: 'Богино бичлэг', href: SHORTS_BASE },
          { label: cat.title, href: shortsHref(cat.slug) },
        ]}
      />
      <h1 className="mb-4 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">{cat.title}</h1>
      <p className="mb-8 text-neutral-600">{cat.videos.length} богино бичлэг</p>
      <ShortsGrid category={cat} />
    </div>
  );
}

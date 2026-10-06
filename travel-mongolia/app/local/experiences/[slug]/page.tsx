import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import ExperienceTemplate from '@/components/templates/ExperienceTemplate';
import { getExperienceBySlug, getExperiences, getProducts } from '@/lib/localContent';
import { entryMeta } from '@/lib/pageMeta';
import { richTextToPlain, truncate } from '@/lib/seo';

// Нутгийн туршлага (Б хэсэг, /local-ийн draft төлвийг өвлөнө)
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const x = await getExperienceBySlug(slug);
  if (!x) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };
  return entryMeta({
    title: x.title,
    description: truncate(
      richTextToPlain(x.whatYouDo) || `${x.title}: ${[x.province, x.duration].filter(Boolean).join(', ')}. Нутгийн иргэдийн зохион байгуулдаг туршлага.`
    ),
    path: `/local/experiences/${x.slug}`,
    image: x.photos[0]?.src,
  });
}

export default async function ExperiencePage({ params }: Props) {
  const { slug } = await params;
  const x = await getExperienceBySlug(slug);
  if (!x) notFound();

  const [all, products] = await Promise.all([getExperiences(), getProducts()]);
  return (
    <ExperienceTemplate
      experience={x}
      others={all.filter((o) => o.id !== x.id && (o.province === x.province || o.hostId === x.hostId))}
      products={products.filter((p) => p.relatedExperience.some((r) => r.id === x.id))}
    />
  );
}

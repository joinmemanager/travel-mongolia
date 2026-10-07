import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import ExperienceTemplate from '@/components/templates/ExperienceTemplate';
import { getExperienceBySlug, getProducts, getProviders } from '@/lib/localContent';
import { getRelatedItems } from '@/lib/related';
import { entryMeta } from '@/lib/pageMeta';
import { richTextToPlain, truncate } from '@/lib/seo';

// Нутгийн туршлага (Б хэсэг, /local-ийн draft төлвийг өвлөнө)
// Кэш (ISR) 4 минут: Contentful-ын өөрчлөлт 5 минутын дотор харагдана
export const revalidate = 240;

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

  const [products, providers] = await Promise.all([getProducts(), getProviders()]);
  const host = providers.find((p) => p.id === x.hostId);
  // Зохион байгуулагч, холбоотой бүтээгдэхүүн; байхгүй бол ижил аймгийн бусад
  const related = await getRelatedItems({
    providerIds: x.hostId ? [x.hostId] : [],
    productIds: products.filter((p) => p.relatedExperience.some((r) => r.id === x.id)).map((p) => p.id),
    provinceText: x.province,
    exclude: [x.id],
  });
  return <ExperienceTemplate experience={x} related={related} isLocalProvider={Boolean(host?.localOwned)} />;
}

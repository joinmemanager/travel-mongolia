import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import StoryTemplate from '@/components/templates/StoryTemplate';
import { getStoryBySlug } from '@/lib/localContent';
import { entryMeta } from '@/lib/pageMeta';
import { getRelatedItems } from '@/lib/related';
import { richTextToPlain, truncate } from '@/lib/seo';

// Contentful-ын 'story' төрлийн нийтлэл (/stories-ийн draft төлвийг өвлөнө)
// Кэш (ISR) 4 минут: Contentful-ын өөрчлөлт 5 минутын дотор харагдана
export const revalidate = 240;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = await getStoryBySlug(slug);
  if (!s) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };
  return entryMeta({
    title: s.title,
    description: truncate(richTextToPlain(s.body) || `${s.title}: Монголын түүх.`),
    path: `/stories/${s.slug}`,
    image: s.media[0]?.src,
  });
}

export default async function StoryPage({ params }: Props) {
  const { slug } = await params;
  const s = await getStoryBySlug(slug);
  if (!s) notFound();
  // Нийтлэлд холбосон туршлага, бүтээгдэхүүн; байхгүй бол байршлын аймгийнх
  const bookings = await getRelatedItems({
    experienceIds: s.relatedExperience.map((r) => r.id),
    productIds: s.relatedProduct.map((r) => r.id),
    provinceText: s.location,
  });
  return <StoryTemplate story={s} bookings={bookings} />;
}

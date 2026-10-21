import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import React from 'react';

import ProfileTemplate from '@/components/templates/ProfileTemplate';
import { getExperiences, getProducts, getProviderBySlug, providerTypeLabel } from '@/lib/localContent';
import { entryMeta } from '@/lib/pageMeta';
import { getRelatedItems } from '@/lib/related';
import { richTextToPlain, truncate } from '@/lib/seo';

// Нутгийн үйлчилгээ үзүүлэгчийн профайл (Б хэсэг, /local-ийн draft төлвийг өвлөнө)
// Кэш (ISR) өдөрт нэг: Contentful-д Publish/Unpublish хийхэд /api/revalidate (webhook) шууд шинэчилнэ
export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProviderBySlug(slug);
  if (!p) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };
  return entryMeta({
    title: [p.name, p.province].filter(Boolean).join(', '),
    description: truncate(
      richTextToPlain(p.story) || `${p.name}: ${providerTypeLabel(p.providerType)}, ${p.province}. Үйлчилгээ, үнэ, захиалга.`
    ),
    path: `/local/${p.slug}`,
    image: p.photos[0]?.src,
  });
}

export default async function ProviderPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProviderBySlug(slug);
  if (!p) notFound();
  // TIC-ийн буудал, бааз /plan/accommodation руу шилжсэн
  if (p.movedTo) permanentRedirect(p.movedTo);

  const [experiences, products] = await Promise.all([getExperiences(), getProducts()]);
  // Энэ өрхийн туршлага, бүтээгдэхүүн; байхгүй бол ижил аймгийн бусад
  const related = await getRelatedItems({
    experienceIds: experiences.filter((x) => x.hostId === p.id).map((x) => x.id),
    productIds: products.filter((x) => x.producerId === p.id).map((x) => x.id),
    provinceText: p.province,
    exclude: [p.id],
  });
  return <ProfileTemplate provider={p} related={related} />;
}

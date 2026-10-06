import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';

import ProfileTemplate from '@/components/templates/ProfileTemplate';
import { getExperiences, getProducts, getProviderBySlug, providerTypeLabel } from '@/lib/localContent';
import { entryMeta } from '@/lib/pageMeta';
import { richTextToPlain, truncate } from '@/lib/seo';

// Нутгийн үйлчилгээ үзүүлэгчийн профайл (Б хэсэг, /local-ийн draft төлвийг өвлөнө)
export const dynamic = 'force-dynamic';

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

  const [experiences, products] = await Promise.all([getExperiences(), getProducts()]);
  return (
    <ProfileTemplate
      provider={p}
      experiences={experiences.filter((x) => x.hostId === p.id)}
      products={products.filter((x) => x.producerId === p.id)}
    />
  );
}

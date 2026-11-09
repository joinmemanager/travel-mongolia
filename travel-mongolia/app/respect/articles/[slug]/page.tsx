import React from 'react';

import SectionArticlePage, { articleMetadata } from '@/components/templates/SectionArticlePage';
import { productionStaticParams } from '@/lib/navigation';

// «Хүндэтгэлтэй аялал»-ын дэд хэсгүүдийн нийтлэл (lib/sectionArticles.ts)
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  return articleMetadata('respect', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <SectionArticlePage section="respect" slug={(await params).slug} />;
}

// Production-д ISR (lib/navigation.ts), preview-д хүсэлт бүрт (draft харуулна)
export const generateStaticParams = productionStaticParams;

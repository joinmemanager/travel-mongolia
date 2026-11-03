import React from 'react';

import SectionArticlePage, { articleMetadata } from '@/components/templates/SectionArticlePage';

// «Үр өгөөж & түншлэл»-ийн дэд хэсгүүдийн нийтлэл (lib/sectionArticles.ts)
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  return articleMetadata('impact', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <SectionArticlePage section="impact" slug={(await params).slug} />;
}

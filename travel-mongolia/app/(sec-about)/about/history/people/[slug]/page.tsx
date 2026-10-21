import type { Metadata } from 'next';

import CultureArticlePage, { cultureMetadata } from '@/components/culture/CultureArticlePage';

// Түүхэн хүний нийтлэл (cultureArticle, section = people).
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return cultureMetadata('people', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CultureArticlePage section="people" slug={(await params).slug} />;
}

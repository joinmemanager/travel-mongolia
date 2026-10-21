import type { Metadata } from 'next';

import CultureArticlePage, { cultureMetadata } from '@/components/culture/CultureArticlePage';

// Угсаатны нийтлэл (cultureArticle, section = ethnic-groups).
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return cultureMetadata('ethnic-groups', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CultureArticlePage section="ethnic-groups" slug={(await params).slug} />;
}

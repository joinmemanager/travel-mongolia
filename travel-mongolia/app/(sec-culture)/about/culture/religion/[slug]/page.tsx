import type { Metadata } from 'next';

import CultureArticlePage, { cultureMetadata } from '@/components/culture/CultureArticlePage';

// Шашин шүтлэгийн нийтлэл (cultureArticle, section = religion).
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return cultureMetadata('religion', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CultureArticlePage section="religion" slug={(await params).slug} />;
}

import type { Metadata } from 'next';

import CultureArticlePage, { cultureMetadata } from '@/components/culture/CultureArticlePage';

// Зан заншлын нийтлэл (cultureArticle, section = traditions). Жагсаалт нь /about/traditions#articles.
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return cultureMetadata('traditions', (await params).slug);
}

export default async function Page({ params }: Props) {
  return <CultureArticlePage section="traditions" slug={(await params).slug} />;
}

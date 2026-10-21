import type { Metadata } from 'next';

import SpeciesArticle, { speciesMetadata } from '@/components/species/SpeciesArticle';

// Ан амьтны нийтлэл (Contentful `species`, TIC cate10)
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return speciesMetadata((await params).slug, 'wildlife');
}

export default async function Page({ params }: Props) {
  return <SpeciesArticle slug={(await params).slug} section="wildlife" />;
}

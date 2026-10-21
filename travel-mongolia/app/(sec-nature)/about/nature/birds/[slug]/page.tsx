import type { Metadata } from 'next';

import SpeciesArticle, { speciesMetadata } from '@/components/species/SpeciesArticle';

// Шувууны урт нийтлэл (150-аас дээш үг; бусад нь /about/nature/birds каталогийн мөр). TIC cate11.
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return speciesMetadata((await params).slug, 'birds');
}

export default async function Page({ params }: Props) {
  return <SpeciesArticle slug={(await params).slug} section="birds" />;
}

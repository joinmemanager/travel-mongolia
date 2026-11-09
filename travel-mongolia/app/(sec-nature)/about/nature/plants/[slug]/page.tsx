import type { Metadata } from 'next';

import SpeciesArticle, { speciesMetadata } from '@/components/species/SpeciesArticle';
import { productionStaticParams } from '@/lib/navigation';

// Ургамлын нийтлэл (80-аас дээш үг; бусад нь /about/nature/plants жагсаалтын мөр). TIC cate12.
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return speciesMetadata((await params).slug, 'plants');
}

export default async function Page({ params }: Props) {
  return <SpeciesArticle slug={(await params).slug} section="plants" />;
}

// Production-д ISR (lib/navigation.ts), preview-д хүсэлт бүрт (draft харуулна)
export const generateStaticParams = productionStaticParams;

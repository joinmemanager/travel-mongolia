import type { Metadata } from 'next';

import PlaceArticle, { placeArticleMetadata, type PlaceArticleConfig } from '@/components/places/PlaceArticle';

// Музей, театр, соёлын төвийн нийтлэл (Contentful `place`, TIC cate17)
export const revalidate = 86400;

const CFG: PlaceArticleConfig = {
  base: '/things-to-do/museums',
  listLabel: 'Музей, театр',
  categories: ['museum', 'theatre', 'culture-center'],
  schemaType: 'TouristAttraction',
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return placeArticleMetadata((await params).slug, CFG);
}

export default async function Page({ params }: Props) {
  return <PlaceArticle slug={(await params).slug} cfg={CFG} />;
}

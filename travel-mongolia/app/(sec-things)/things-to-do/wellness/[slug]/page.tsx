import type { Metadata } from 'next';

import PlaceArticle, { placeArticleMetadata, type PlaceArticleConfig } from '@/components/places/PlaceArticle';

// Рашаан сувиллын нийтлэл (Contentful `place`, TIC cate8). Жагсаалт: /things-to-do/wellness#sanatorium
export const revalidate = 604800;

const CFG: PlaceArticleConfig = {
  base: '/things-to-do/wellness',
  listLabel: 'Амралт, рашаан сувилал',
  categories: ['sanatorium'],
  schemaType: 'HealthAndBeautyBusiness',
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

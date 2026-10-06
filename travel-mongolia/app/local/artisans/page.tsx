import React from 'react';

import LocalListingPage, { providerSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getProviders } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';

// Нутгийн Монгол: Гар урлаач (Б хэсэг, draft). "Ангиллын жагсаалт" загвар.
export const dynamic = 'force-dynamic';
export const metadata = metaFor('/local/artisans');

export default async function Page() {
  const providers = (await getProviders()).filter((p) => p.providerType === 'artisan');
  return (
    <LocalListingPage
      hero={IMAGES.gerCamp}
      kicker="НУТГИЙН МОНГОЛ"
      title="Гар урлаач"
      intro="Эсгий, арьс шир, мод, мөнгөн дарханы урлал. Гар урлаачид, тэдний бүтээл, сургалт, туршлага."
      countLabel="гар урлаач олдлоо"
      spots={providers.map(providerSpot)}
      current="/local/artisans"
    />
  );
}

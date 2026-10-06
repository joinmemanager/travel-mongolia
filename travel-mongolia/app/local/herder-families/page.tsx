import React from 'react';

import LocalListingPage, { providerSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getProviders } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';

// Нутгийн Монгол: Малчин өрх (Б хэсэг, soft). "Ангиллын жагсаалт" загвар.
export const dynamic = 'force-dynamic';
export const metadata = metaFor('/local/herder-families');

export default async function Page() {
  const providers = (await getProviders()).filter((p) => p.providerType === 'herder-family');
  return (
    <LocalListingPage
      hero={IMAGES.herderBoy}
      kicker="НУТГИЙН МОНГОЛ"
      title="Малчин өрх"
      intro="Зочид хүлээн авдаг малчин өрхүүд. Гэрт хоноглох, мал маллах, цагаан идээ хийх туршлага, үнэ, захиалга."
      countLabel="малчин өрх олдлоо"
      spots={providers.map(providerSpot)}
      current="/local/herder-families"
      inviteKey="herder-family"
    />
  );
}

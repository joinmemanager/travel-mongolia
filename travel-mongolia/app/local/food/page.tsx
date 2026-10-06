import React from 'react';

import LocalListingPage, { providerSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getProviders } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';

// Нутгийн Монгол: Нутгийн хоол (Б хэсэг, soft). "Ангиллын жагсаалт" загвар.
export const dynamic = 'force-dynamic';
export const metadata = metaFor('/local/food');

export default async function Page() {
  const providers = (await getProviders()).filter((p) => p.providerType === 'food');
  return (
    <LocalListingPage
      hero={IMAGES.lakeGers}
      kicker="НУТГИЙН МОНГОЛ"
      title="Нутгийн хоол"
      intro="Нутгийн хоол, ундаа санал болгодог айл, гуанз, жижиг үйлдвэрлэгчид. Юу амтлах, хаана, хэзээ."
      countLabel="газар олдлоо"
      spots={providers.map(providerSpot)}
      current="/local/food"
      inviteKey="food"
    />
  );
}

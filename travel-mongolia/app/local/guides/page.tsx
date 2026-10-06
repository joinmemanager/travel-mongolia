import React from 'react';

import LocalListingPage, { providerSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getProviders } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';

// Нутгийн Монгол: Нутгийн хөтөч (Б хэсэг, soft). "Ангиллын жагсаалт" загвар.
export const dynamic = 'force-dynamic';
export const metadata = metaFor('/local/guides');

export default async function Page() {
  const providers = (await getProviders()).filter((p) => p.providerType === 'guide');
  return (
    <LocalListingPage
      hero={IMAGES.eagleHunter}
      kicker="НУТГИЙН МОНГОЛ"
      title="Нутгийн хөтөч"
      intro="Нутгаа сайн мэддэг, нутгийн хөтөч нар. Мэргэшсэн чиглэл, үйлчилгээ, үнэ, захиалга."
      countLabel="хөтөч олдлоо"
      spots={providers.map(providerSpot)}
      current="/local/guides"
      inviteKey="guide"
    />
  );
}

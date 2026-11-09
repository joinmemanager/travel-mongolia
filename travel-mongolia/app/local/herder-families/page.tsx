import React from 'react';

import LocalListingPage, { providerSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getProviders } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';
import { connection } from 'next/server';
import { isPreviewEnv } from '@/lib/navigation';

// Нутгийн Монгол: Малчин өрх (Б хэсэг, live). "Ангиллын жагсаалт" загвар.
// 2026-11-06-ноос статик/ISR: ?cat= (?style=, ?days= г.м.) параметрийг жагсаалтын Suspense доторх хэсэг уншина,
// server HTML-д «Бүгд»-ийн бүтэн агуулга орно (Vercel CPU-г хэмнэх; docs/plan/performance.md).
export const metadata = metaFor('/local/herder-families');

export default async function Page() {
  if (isPreviewEnv()) await connection();
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

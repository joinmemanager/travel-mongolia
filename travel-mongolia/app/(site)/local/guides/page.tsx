import React from 'react';

import LocalListingPage, { providerSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getProviders } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';
import { connection } from 'next/server';
import { isPreviewEnv } from '@/lib/navigation';

// Нутгийн Монгол: Нутгийн хөтөч (Б хэсэг, live). "Ангиллын жагсаалт" загвар.
// 2026-11-06-ноос статик/ISR: ?cat= (?style=, ?days= г.м.) параметрийг жагсаалтын Suspense доторх хэсэг уншина,
// server HTML-д «Бүгд»-ийн бүтэн агуулга орно (Vercel CPU-г хэмнэх; docs/plan/performance.md).
export const metadata = metaFor('/local/guides');

export default async function Page() {
  if (isPreviewEnv()) await connection();
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

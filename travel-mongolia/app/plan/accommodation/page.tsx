import { connection } from 'next/server';
import React from 'react';

import AccommodationGuide from '@/components/accommodation/AccommodationGuide';
import TicAccommodationDirectory from '@/components/accommodation/TicAccommodationDirectory';
import { getAccommodations, KIND_LABEL, TIC_NOTICE } from '@/lib/accommodation';
import { isPreviewEnv } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';

// «Аяллаа төлөвлөх → Байр»: гарын авлага + Tourist Info Center-ээс шилжүүлсэн буудал, баазын лавлах (7-р багц).
// Metadata энд: layout нь /plan/accommodation/<slug>-ыг ч ороодог.
export const revalidate = 604800;
export const metadata = metaFor('/plan/accommodation');

export default async function AccommodationPage() {
  if (isPreviewEnv()) await connection();
  const items = await getAccommodations();
  return (
    <AccommodationGuide
      directory={items.length > 0 ? <TicAccommodationDirectory items={items} notice={TIC_NOTICE} kindLabel={KIND_LABEL} /> : undefined}
    />
  );
}

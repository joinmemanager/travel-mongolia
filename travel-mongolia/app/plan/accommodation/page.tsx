import { connection } from 'next/server';
import React from 'react';

import AccommodationGuide from '@/components/accommodation/AccommodationGuide';
import TicAccommodationDirectory from '@/components/accommodation/TicAccommodationDirectory';
import { accommodationNotice, getAccommodations, KIND_LABEL } from '@/lib/accommodation';
import { isPreviewEnv } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { PROVINCE_FACTS } from '@/lib/provinceFacts';

// «Аяллаа төлөвлөх → Байрлах газар»: гарын авлага + Tourist Info Center-ээс шилжүүлсэн буудал, баазын лавлах (7-р багц).
// Metadata энд: layout нь /plan/accommodation/<slug>-ыг ч ороодог.
// ?aimag=<slug> нь ?cat=-ийн адил хуудас доторх шүүлтүүр (docs/plan/section-layout.md 3.1): canonical нь query-гүй
// (metaFor), sitemap-д орохгүй, HTML нь ижил.
export const revalidate = 604800;
export const metadata = metaFor('/plan/accommodation');

const AIMAG_SLUGS = Object.fromEntries(Object.entries(PROVINCE_FACTS).map(([slug, f]) => [f.name, slug]));

export default async function AccommodationPage() {
  if (isPreviewEnv()) await connection();
  const items = await getAccommodations();
  return (
    <AccommodationGuide
      directory={items.length > 0 ? <TicAccommodationDirectory items={items} notice={accommodationNotice(items)} kindLabel={KIND_LABEL} aimagSlugs={AIMAG_SLUGS} /> : undefined}
    />
  );
}

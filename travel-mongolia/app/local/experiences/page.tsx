import React from 'react';

import LocalListingPage, { experienceSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getExperiences } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';
import { connection } from 'next/server';
import { isPreviewEnv } from '@/lib/navigation';

// Нутгийн Монгол: Нутгийн туршлага (Б хэсэг, live). "Ангиллын жагсаалт" загвар.
// 2026-11-06-ноос статик/ISR: ?cat= (?style=, ?days= г.м.) параметрийг жагсаалтын Suspense доторх хэсэг уншина,
// server HTML-д «Бүгд»-ийн бүтэн агуулга орно (Vercel CPU-г хэмнэх; docs/plan/performance.md).
export const metadata = metaFor('/local/experiences');

export default async function Page() {
  if (isPreviewEnv()) await connection();
  const experiences = await getExperiences();
  return (
    <LocalListingPage
      hero={IMAGES.gerStars}
      kicker="НУТГИЙН МОНГОЛ"
      title="Нутгийн туршлага"
      intro="Нутгийн иргэдийн зохион байгуулдаг туршлагууд: малчин айлд өнжих, эсгий хийх, уламжлалт хоол. Хэн зохион байгуулдаг, юу хийх, үнэ."
      countLabel="туршлага олдлоо"
      spots={experiences.map(experienceSpot)}
      current="/local/experiences"
      inviteKey="experiences"
    />
  );
}

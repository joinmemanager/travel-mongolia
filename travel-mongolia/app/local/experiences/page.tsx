import React from 'react';

import LocalListingPage, { experienceSpot } from '@/components/templates/LocalListingPage';
import { IMAGES } from '@/lib/images';
import { getExperiences } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';

// Нутгийн Монгол: Нутгийн туршлага (Б хэсэг, draft). "Ангиллын жагсаалт" загвар.
export const dynamic = 'force-dynamic';
export const metadata = metaFor('/local/experiences');

export default async function Page() {
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
    />
  );
}

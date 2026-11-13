'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { WELLNESS_CATEGORIES, WELLNESS_SPOTS } from '@/lib/wellnessData';

// Кодын картууд (lib/wellnessData.ts), ?cat= шүүлтүүртэй. page.tsx (server) доор нь рашаан сувиллын жагсаалт нэмнэ.
export default function WellnessListing() {
  return (
    <CategoryListing
      embedded
      intro="Эртний энергийн төвүүд, байгалийн халуун рашаан, Буддын хийдүүдийн бясалгал болон хязгааргүй уудам нутаг дахь дижитал детокс амар амгалан."
      categories={WELLNESS_CATEGORIES}
      spots={WELLNESS_SPOTS}
      countLabel="бясалгал, амралтын газар олдлоо"
      badge={(spot) => [spot.feature]}
    />
  );
}

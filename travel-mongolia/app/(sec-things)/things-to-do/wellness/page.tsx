'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { WELLNESS_CATEGORIES, WELLNESS_SPOTS } from '@/lib/wellnessData';

export default function WellnessPage() {
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

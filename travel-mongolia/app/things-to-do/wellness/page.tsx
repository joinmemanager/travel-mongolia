'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { WELLNESS_CATEGORIES, WELLNESS_SPOTS } from '@/lib/wellnessData';

export default function WellnessPage() {
  return (
    <CategoryListing
      hero={{
        src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1800&q=80',
        alt: 'Wellness Background',
      }}
      kicker="08. ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Амралт, бясалгал, сүнслэг туршлага"
      intro="Эртний энергийн төвүүд, байгалийн халуун рашаан, Буддын хийдүүдийн бясалгал болон хязгааргүй уудам нутаг дахь дижитал детокс амар амгалан."
      categories={WELLNESS_CATEGORIES}
      spots={WELLNESS_SPOTS}
      countLabel="бясалгал, амралтын газар олдлоо"
      badge={(spot) => [spot.feature]}
    />
  );
}

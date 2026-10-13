'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { CULTURE_CATEGORIES, CULTURE_SPOTS } from '@/lib/cultureData';

export default function CulturePage() {
  return (
    <CategoryListing
      embedded
      intro="Эзэнт гүрний түүхэн дурсгалууд, эртний буддын хийдүүд, ЮНЕСКО-ийн дэлхийн өв болон уламжлалт биет бус урлагийн соёлын туршлагууд."
      categories={CULTURE_CATEGORIES}
      spots={CULTURE_SPOTS}
      countLabel="газар, үзмэр олдлоо"
      badge={(spot) => [spot.period]}
    />
  );
}

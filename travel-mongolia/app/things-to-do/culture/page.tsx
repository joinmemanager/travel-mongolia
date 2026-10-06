'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { CULTURE_CATEGORIES, CULTURE_SPOTS } from '@/lib/cultureData';

export default function CulturePage() {
  return (
    <CategoryListing
      hero={{
        src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
        alt: 'Culture & Heritage Background',
      }}
      kicker="04. ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Түүх, соёл, өв"
      intro="Эзэнт гүрний түүхэн дурсгалууд, эртний буддын хийдүүд, ЮНЕСКО-ийн дэлхийн өв болон уламжлалт биет бус урлагийн соёлын туршлагууд."
      categories={CULTURE_CATEGORIES}
      spots={CULTURE_SPOTS}
      countLabel="газар, үзмэр олдлоо"
      badge={(spot) => [spot.period]}
    />
  );
}

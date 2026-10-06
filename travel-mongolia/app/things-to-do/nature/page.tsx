'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { NATURE_CATEGORIES, NATURE_SPOTS } from '@/lib/natureData';

export default function NaturePage() {
  return (
    <CategoryListing
      hero={{
        src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
        alt: 'Nature Background',
      }}
      kicker="01. ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Байгальд аялах"
      intro="Хязгааргүй үргэлжлэх уудам тал нутаг, онгон дагшин тайга, сүрлэг Алтайн оргилууд болон Тэнгэрийн заадлыг тольдох элсэн манхнууд."
      categories={NATURE_CATEGORIES}
      spots={NATURE_SPOTS}
      countLabel="газар олдлоо"
      badge={(spot) => [spot.season]}
    />
  );
}

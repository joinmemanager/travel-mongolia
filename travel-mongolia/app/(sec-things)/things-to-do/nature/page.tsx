'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { NATURE_CATEGORIES, NATURE_SPOTS } from '@/lib/natureData';

export default function NaturePage() {
  return (
    <CategoryListing
      embedded
      intro="Хязгааргүй үргэлжлэх уудам тал нутаг, онгон дагшин тайга, сүрлэг Алтайн оргилууд болон Тэнгэрийн заадлыг тольдох элсэн манхнууд."
      categories={NATURE_CATEGORIES}
      spots={NATURE_SPOTS}
      countLabel="газар олдлоо"
      badge={(spot) => [spot.season]}
    />
  );
}

'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { WILDLIFE_CATEGORIES, WILDLIFE_SPOTS } from '@/lib/wildlifeData';

export default function WildlifePage() {
  return (
    <CategoryListing
      embedded
      intro="Дэлхийд нэн ховордсон тахь, цоохор ирвэс, говийн мазаалай баавгай болон онгон дагшин байгаль дахь нүүдлийн шувуудын өлгий нутаг."
      categories={WILDLIFE_CATEGORIES}
      spots={WILDLIFE_SPOTS}
      countLabel="амьтан, ажиглалтын бүс олдлоо"
      badge={(spot) => [spot.bestTime]}
    />
  );
}

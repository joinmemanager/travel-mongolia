'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { WILDLIFE_CATEGORIES, WILDLIFE_SPOTS } from '@/lib/wildlifeData';

export default function WildlifePage() {
  return (
    <CategoryListing
      hero={{
        src: 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1800&q=80',
        alt: 'Wildlife Background',
      }}
      kicker="05. ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Зэрлэг амьтан, шувуу ажиглах"
      intro="Дэлхийд нэн ховордсон тахь, цоохор ирвэс, говийн мазаалай баавгай болон онгон дагшин байгаль дахь нүүдлийн шувуудын өлгий нутаг."
      categories={WILDLIFE_CATEGORIES}
      spots={WILDLIFE_SPOTS}
      countLabel="амьтан, ажиглалтын бүс олдлоо"
      badge={(spot) => [spot.bestTime]}
    />
  );
}

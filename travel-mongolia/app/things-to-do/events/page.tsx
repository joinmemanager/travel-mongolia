'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { EVENTS_CATEGORIES, EVENTS_SPOTS } from '@/lib/eventsData';

export default function EventsPage() {
  return (
    <CategoryListing
      hero={{
        src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
        alt: 'Events Background',
      }}
      kicker="07. ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Баяр наадам, арга хэмжээ"
      intro="Үндэсний их баяр наадам, Алтайн бүргэдийн баяр, Хөвсгөлийн мөсний баяр зэрэг Монголын өвөрмөц уламжлалт наадам, соёлын фестивалиуд."
      categories={EVENTS_CATEGORIES}
      spots={EVENTS_SPOTS}
      countLabel="баяр, арга хэмжээ олдлоо"
      badge={(spot) => [spot.date]}
    />
  );
}

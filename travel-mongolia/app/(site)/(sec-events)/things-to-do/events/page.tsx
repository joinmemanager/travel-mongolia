'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { EVENTS_CATEGORIES, EVENTS_SPOTS } from '@/lib/eventsData';

export default function EventsPage() {
  return (
    <CategoryListing
      embedded
      intro="Үндэсний их баяр наадам, Алтайн бүргэдийн баяр, Хөвсгөлийн мөсний баяр зэрэг Монголын өвөрмөц уламжлалт наадам, соёлын фестивалиуд."
      categories={EVENTS_CATEGORIES}
      spots={EVENTS_SPOTS}
      countLabel="баяр, арга хэмжээ олдлоо"
      badge={(spot) => [spot.date]}
    />
  );
}

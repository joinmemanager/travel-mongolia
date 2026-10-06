import React from 'react';

import LinkCard from '@/components/design/LinkCard';
import CategoryListing from '@/components/templates/CategoryListing';
import { IMAGES } from '@/lib/images';
import { eventDateLabel, getAllEvents } from '@/lib/localContent';
import { metaFor } from '@/lib/pageMeta';

// Баяр наадам, фестивалиуд: "Арга хэмжээ" загварын жагсаалт. Contentful-ын 'event' төрөл
// болон хуучин 'recommendation' (наадмууд) нэг жагсаалтад, дэлгэрэнгүй нь /recommendation/<slug>.
export const dynamic = 'force-dynamic';
export const metadata = metaFor('/things-to-do/festivals');

export default async function FestivalsPage() {
  const events = await getAllEvents();

  const provinces = Array.from(new Set(events.map((e) => e.province).filter(Boolean)));
  const categories = [
    { id: 'all', label: 'Бүгд' },
    ...provinces.sort((a, b) => a.localeCompare(b, 'mn')).map((p) => ({ id: p, label: p })),
  ];

  return (
    <CategoryListing
      hero={IMAGES.eagleHunter}
      kicker="ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Фестивалиуд"
      intro="Монголд жил бүр болдог фестивалиуд: Үндэсний их баяр наадам, Алтайн бүргэдийн баяр, Тэмээний баяр болон бусад."
      categories={categories}
      spots={events.map((e) => ({
        id: e.id,
        title: e.title,
        category: eventDateLabel(e) || 'Арга хэмжээ',
        categoryKey: e.province || 'other',
        location: e.province,
        region: e.organizer,
        image: e.photos[0]?.src || IMAGES.gerStars.src,
        description: '',
        href: e.href,
      }))}
      countLabel="баяр, арга хэмжээ олдлоо"
      cta="Дэлгэрэнгүй"
      emptyText="Удахгүй нэмэгдэнэ."
      footer={
        <LinkCard
          title="Холбогдох хуудсууд"
          columns={3}
          links={[
            { label: 'Арга хэмжээ, баяр наадам', href: '/things-to-do/events' },
            { label: 'Ёс заншил, уламжлал', href: '/about/traditions' },
            { label: 'Соёл, ёс заншил', href: '/respect/etiquette' },
          ]}
        />
      }
    />
  );
}

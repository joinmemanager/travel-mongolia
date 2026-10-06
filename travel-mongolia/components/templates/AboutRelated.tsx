import React from 'react';

import LinkCard from '@/components/design/LinkCard';

// /about/* хуудсуудын доод хэсгийн "Холбогдох хуудсууд" (нэрс нь цэсний нэртэй ижил)
const ABOUT_PAGES = [
  { label: 'Монгол орныг товчхон', href: '/about/at-a-glance' },
  { label: 'Монголын түүх', href: '/about/history' },
  { label: 'Өнөөгийн Монгол', href: '/about/modern' },
  { label: 'Соёл ба өв', href: '/about/culture' },
  { label: 'Ёс заншил, уламжлал', href: '/about/traditions' },
  { label: 'Байгаль', href: '/about/nature' },
  { label: 'Нүүдэлчдийн амьдрал', href: '/about/nomadic-life' },
  { label: 'Хоол', href: '/about/food' },
  { label: 'Хүмүүс', href: '/about/people' },
];

export default function AboutRelated({ current }: { current: string }) {
  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-24">
      <LinkCard
        title="Холбогдох хуудсууд"
        links={ABOUT_PAGES.filter((page) => page.href !== current)}
        columns={3}
      />
    </div>
  );
}

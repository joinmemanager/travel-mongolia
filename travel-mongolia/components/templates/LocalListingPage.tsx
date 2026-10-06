import React from 'react';

import LinkCard from '@/components/design/LinkCard';
import type { SiteImage } from '@/lib/images';
import {
  type CommunityExperience,
  type LocalProduct,
  type LocalProvider,
  providerTypeLabel,
} from '@/lib/localContent';
import { richTextToPlain, truncate } from '@/lib/seo';

import CategoryListing, { type ListingSpot } from './CategoryListing';

// /local/* ангиллын хуудсуудын хуваалцсан хэсэг: "Ангиллын жагсаалт" загвар (CategoryListing),
// шүүлтүүр нь аймгаар, доор нь бусад ангиллын холбоосны карт.

export const LOCAL_PAGES = [
  { label: 'Нутгийн туршлага', href: '/local/experiences' },
  { label: 'Нутгийн хөтөч', href: '/local/guides' },
  { label: 'Малчин өрх', href: '/local/herder-families' },
  { label: 'Гар урлаач', href: '/local/artisans' },
  { label: 'Нутгийн хоол', href: '/local/food' },
  { label: 'Нутгийн бүтээгдэхүүн', href: '/local/products' },
];

const FALLBACK = 'https://images.unsplash.com/photo-1575415868394-e3b78f3e9b3f?auto=format&fit=crop&w=1200&q=80';

export function providerSpot(p: LocalProvider): ListingSpot {
  return {
    id: p.id,
    title: p.name,
    category: providerTypeLabel(p.providerType),
    categoryKey: p.province || 'other',
    location: p.province,
    region: '',
    image: p.photos[0]?.src || FALLBACK,
    description: truncate(richTextToPlain(p.story), 140),
    href: p.href,
    badges: [p.localOwned ? 'Нутгийн өмчлөлтэй' : '', p.priceFrom ? `${p.priceFrom}-аас` : ''].filter(Boolean),
  };
}

export function experienceSpot(x: CommunityExperience): ListingSpot {
  return {
    id: x.id,
    title: x.title,
    category: x.duration || 'Туршлага',
    categoryKey: x.province || 'other',
    location: x.province,
    region: x.host?.title || '',
    image: x.photos[0]?.src || FALLBACK,
    description: truncate(richTextToPlain(x.whatYouDo), 140),
    href: x.href,
    badges: [x.price, x.season].filter(Boolean),
  };
}

export function productSpot(x: LocalProduct): ListingSpot {
  return {
    id: x.id,
    title: x.name,
    category: x.origin || 'Бүтээгдэхүүн',
    categoryKey: x.origin || 'other',
    location: x.origin,
    region: x.producer?.title || '',
    image: x.photos[0]?.src || FALLBACK,
    description: truncate(richTextToPlain(x.story) || x.whereToBuy, 140),
    // Бүтээгдэхүүн тусдаа хуудасгүй: үйлдвэрлэгчийн профайл руу
    href: x.producer?.href,
    badges: [x.season].filter(Boolean),
  };
}

export default function LocalListingPage({
  hero,
  kicker,
  title,
  intro,
  countLabel,
  spots,
  current,
}: {
  hero: SiteImage;
  kicker: string;
  title: string;
  intro: string;
  countLabel: string;
  spots: ListingSpot[];
  current: string;
}) {
  // Шүүлтүүр: жагсаалтад байгаа аймгууд
  const provinces = Array.from(new Set(spots.map((s) => s.categoryKey).filter((k) => k !== 'other')));
  const categories = [
    { id: 'all', label: 'Бүгд' },
    ...provinces.sort((a, b) => a.localeCompare(b, 'mn')).map((p) => ({ id: p, label: p })),
  ];

  return (
    <CategoryListing
      hero={hero}
      kicker={kicker}
      title={title}
      intro={intro}
      categories={categories}
      spots={spots}
      countLabel={countLabel}
      cta="Дэлгэрэнгүй"
      emptyText="Удахгүй нэмэгдэнэ."
      footer={
        <LinkCard
          title="Нутгийн Монгол"
          columns={3}
          links={[{ label: 'Бүх ангилал', href: '/local' }, ...LOCAL_PAGES.filter((l) => l.href !== current)]}
        />
      }
    />
  );
}

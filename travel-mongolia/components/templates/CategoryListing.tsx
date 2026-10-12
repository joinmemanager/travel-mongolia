'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import ImageCard from '@/components/design/ImageCard';

import ImageHero from './ImageHero';

export interface ListingCategory {
  id: string;
  label: string;
}

export interface ListingSpot {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  location: string;
  region: string;
  image: string;
  description: string;
  // Дэлгэрэнгүй хуудас (байхгүй бол карт холбоосгүй)
  href?: string;
  // Ангиллын нэрийн дараах шошгууд (badge функцийн оронд, server хуудаснаас дамжуулахад)
  badges?: string[];
}

interface Props<T extends ListingSpot> {
  hero: { src: string; alt: string };
  kicker: string;
  title: string;
  intro: string;
  categories: ListingCategory[];
  spots: T[];
  // "Нийт N ... олдлоо" мөрийн дунд хэсэг
  countLabel: string;
  // Картын шошгууд: ангиллын нэрийн дараа харуулах талбарууд (улирал, түвшин г.м.)
  badge?: (spot: T) => string[];
  // Картын доод мөр. Дэлгэрэнгүй хуудасгүй бол "Дэлгэрэнгүй үзэх"
  cta?: string;
  // Жагсаалт хоосон үед харуулах текст
  emptyText?: string;
  // Жагсаалтын доор (холбоосны карт г.м.)
  footer?: React.ReactNode;
  // Жагсаалтын дээр (хоосон ангиллын "Тун удахгүй" блок г.м.)
  notice?: React.ReactNode;
}

// "Ангиллын жагсаалт" загвар (docs/plan/templates.md): /things-to-do/*, /local/* хуудсууд.
// Зурагтай толгой → наалддаг ангиллын шүүлтүүр (?cat=) → зурагтай картуудын тор.
export default function CategoryListing<T extends ListingSpot>({
  hero,
  kicker,
  title,
  intro,
  categories,
  spots,
  countLabel,
  badge,
  cta = 'Дэлгэрэнгүй үзэх',
  emptyText,
  footer,
  notice,
}: Props<T>) {
  const searchParams = useSearchParams();
  const catQuery = searchParams.get('cat');
  const [activeTab, setActiveTab] = useState('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Цэснээс ?cat=... -ээр орж ирэхэд тухайн ангиллыг сонгоно
  useEffect(() => {
    if (catQuery) {
      setActiveTab(catQuery);
    }
  }, [catQuery]);

  const scroll = (direction: 'left' | 'right') => {
    scrollContainerRef.current?.scrollBy({ left: direction === 'left' ? -260 : 260, behavior: 'smooth' });
  };

  const filteredSpots =
    activeTab === 'all' ? spots : spots.filter((spot) => spot.categoryKey === activeTab);

  return (
    <main className="min-h-screen bg-[#fafafa] pb-24">
      <ImageHero image={hero} kicker={kicker} title={title} intro={intro} />

      {/* Ангиллын шүүлтүүр: 2 талдаа сумтай хэвтээ мөр */}
      <div className="sticky top-(--nav-h) z-40 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative flex items-center py-3.5">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous categories"
            className="w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-neutral-50 hover:shadow transition-all shrink-0 mr-2 cursor-pointer z-10"
          >
            <span className="text-base leading-none select-none">‹</span>
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 w-full justify-start md:justify-center"
          >
            {categories.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next categories"
            className="w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-neutral-50 hover:shadow transition-all shrink-0 ml-2 cursor-pointer z-10"
          >
            <span className="text-base leading-none select-none">›</span>
          </button>
        </div>
      </div>

      {/* Зурагтай картуудын тор */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-10">
        {notice && <div className="mb-10">{notice}</div>}
        <div className="flex justify-between items-end mb-6">
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Нийт {filteredSpots.length} {countLabel}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpots.map((spot) => (
            <ImageCard
              key={spot.id}
              image={{ src: spot.image, alt: spot.title }}
              eyebrow={[spot.location, spot.region].filter(Boolean).join(' • ')}
              href={spot.href}
              badges={[spot.category, ...(spot.badges || []), ...(badge ? badge(spot) : [])]}
              title={spot.title}
              desc={spot.description}
              cta={cta}
              aspect="aspect-[4/5]"
            />
          ))}
        </div>
        {filteredSpots.length === 0 && emptyText && (
          <p className="py-16 text-sm text-center text-neutral-500">{emptyText}</p>
        )}
        {footer && <div className="mt-16">{footer}</div>}
      </div>
    </main>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

import ImageCard from '@/components/design/ImageCard';
import LinkCard, { type LinkCardItem } from '@/components/design/LinkCard';
import HubHeader from '@/components/HubHeader';
import { useActiveFilter, useRegisterSectionFilters } from '@/components/section/SectionFilters';

export interface InspirationItem {
  id: string;
  categoryKey: string;
  image: string;
  title: string;
  desc: string;
  eyebrow: string;
  badges: string[];
  // Masonry торын картын өндөр (жишээ нь 'h-[360px]')
  aspect: string;
}

interface Props {
  // embedded үед (хэсгийн хуудас) kicker, title хэрэггүй: hero, H1 нь layout-д
  kicker?: string;
  title?: string;
  intro: string;
  // Цэснээс шүүлтүүр сонгож ирэх URL параметр (?cat=, ?style= г.м.)
  param: string;
  filters: { id: string; label: string }[];
  items: InspirationItem[];
  // Доод хэсгийн дараагийн/өмнөх хуудасны холбоос
  footerLinks: LinkCardItem[];
  footerNote?: string;
  // Хэсгийн хуудсанд (components/section/SectionLayout) дотор харуулах горим
  embedded?: boolean;
}

// "Ангиллын жагсаалт" загвар, /inspiration/* хувилбар (docs/plan/templates.md):
// текст толгой + шүүлтүүр → зурагтай картуудын masonry тор → дараах хуудасны холбоос.
function InspirationListingContent({ kicker, title, intro, param, filters, items, footerLinks, footerNote, embedded }: Props) {
  const searchParams = useSearchParams();
  const paramValue = searchParams.get(param);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (paramValue && filters.some((f) => f.id === paramValue)) {
      setActiveFilter(paramValue);
    }
  }, [paramValue, filters]);

  // Хэсгийн хуудсанд шүүлтүүр зүүн талын «Сэдвийн жагсаалт»-д (components/section/SectionFilters),
  // сонголт нь URL-ийн параметр (?cat=, ?style= г.м.). Хуудас доторх товчны мөр байхгүй.
  const filterSet =
    embedded && filters.length > 1 ? { param, options: filters.filter((f) => f.id !== 'all') } : null;
  useRegisterSectionFilters(filterSet);
  const urlFilter = useActiveFilter(filterSet);
  const current = embedded ? urlFilter : activeFilter;

  const filteredItems =
    current === 'all' ? items : items.filter((item) => item.categoryKey === current);

  const filterButtons = (
    <div className="flex flex-wrap gap-2 pt-8">
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          onClick={() => setActiveFilter(filter.id)}
          className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
            activeFilter === filter.id
              ? 'bg-[#15803d] text-white shadow-sm hover:bg-emerald-950'
              : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#15803d] hover:text-[#15803d]'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );

  // Masonry тор. Зураггүй (Монголынх нь шалгагдаагүй зургийг хассан) карт бараан дэвсгэртэй.
  const grid = (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      {filteredItems.map((item) => (
        <div key={item.id} className="break-inside-avoid">
          <ImageCard
            image={item.image ? { src: item.image, alt: item.title } : undefined}
            eyebrow={item.eyebrow}
            badges={item.badges}
            title={item.title}
            desc={item.desc}
            aspect={item.aspect}
          />
        </div>
      ))}
    </div>
  );

  const footer = (
    <>
      <LinkCard links={footerLinks} bare />
      {footerNote && <p className="text-xs text-neutral-400">{footerNote}</p>}
    </>
  );

  if (embedded) {
    return (
      <div>
        {intro && <p className="mb-8 max-w-3xl text-base sm:text-lg text-neutral-600 leading-relaxed">{intro}</p>}
        {grid}
        <div className="mt-16 space-y-3">{footer}</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32">
      <HubHeader kicker={kicker || ''} title={title || ''} intro={intro}>
        {filterButtons}
      </HubHeader>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-10">{grid}</div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-16 space-y-3">{footer}</div>
    </main>
  );
}

export default function InspirationListing(props: Props) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9] text-neutral-700 p-10">Уншиж байна...</div>}>
      <InspirationListingContent {...props} />
    </Suspense>
  );
}

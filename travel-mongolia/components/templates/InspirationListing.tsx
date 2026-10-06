'use client';

import { useSearchParams } from 'next/navigation';
import React, { Suspense, useEffect, useState } from 'react';

import ImageCard from '@/components/design/ImageCard';
import LinkCard, { type LinkCardItem } from '@/components/design/LinkCard';
import HubHeader from '@/components/HubHeader';

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
  kicker: string;
  title: string;
  intro: string;
  // Цэснээс шүүлтүүр сонгож ирэх URL параметр (?cat=, ?style= г.м.)
  param: string;
  filters: { id: string; label: string }[];
  items: InspirationItem[];
  // Доод хэсгийн дараагийн/өмнөх хуудасны холбоос
  footerLinks: LinkCardItem[];
  footerNote?: string;
}

// "Ангиллын жагсаалт" загвар, /inspiration/* хувилбар (docs/plan/templates.md):
// текст толгой + шүүлтүүр → зурагтай картуудын masonry тор → дараах хуудасны холбоос.
function InspirationListingContent({ kicker, title, intro, param, filters, items, footerLinks, footerNote }: Props) {
  const searchParams = useSearchParams();
  const paramValue = searchParams.get(param);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (paramValue && filters.some((f) => f.id === paramValue)) {
      setActiveFilter(paramValue);
    }
  }, [paramValue, filters]);

  const filteredItems =
    activeFilter === 'all' ? items : items.filter((item) => item.categoryKey === activeFilter);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32">
      <HubHeader kicker={kicker} title={title} intro={intro}>
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
      </HubHeader>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="break-inside-avoid">
              <ImageCard
                image={{ src: item.image, alt: item.title }}
                eyebrow={item.eyebrow}
                badges={item.badges}
                title={item.title}
                desc={item.desc}
                aspect={item.aspect}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-16 space-y-3">
        <LinkCard links={footerLinks} bare />
        {footerNote && <p className="text-xs text-neutral-400">{footerNote}</p>}
      </div>
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

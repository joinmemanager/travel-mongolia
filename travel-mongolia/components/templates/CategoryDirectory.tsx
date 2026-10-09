'use client';

import Link from 'next/link';
import React, { useRef } from 'react';

import ImageCard from '@/components/design/ImageCard';
import { liveHref } from '@/lib/navigation';

import ImageHero from './ImageHero';

export interface DirectoryPlace {
  name: string;
  region: string;
  img: string;
  // Газрын дэлгэрэнгүй хуудас (байхгүй бол карт холбоосгүй)
  href?: string;
}

export interface DirectoryGroup {
  id: string;
  // "Бүгдийг үзэх" карт хаашаа заах. Байхгүй эсвэл нийтлэгдээгүй бол карт харагдахгүй
  moreHref?: string;
  title: string;
  count: string;
  places: DirectoryPlace[];
  remainingCount: number;
}

// "Газрын ангилал" загвар (docs/plan/templates.md): /destination/landscapes, protected
// болон 4 дэд ангиллын хуудас. Зурагтай толгой → наалддаг хэсгийн цэс → хэсгүүд (children).
export default function CategoryDirectory({
  hero,
  kicker,
  title,
  intro,
  nav,
  children,
}: {
  hero: { src: string; alt: string };
  kicker: string;
  title: string;
  intro: string;
  // Наалддаг цэс: хуудасны хэсгүүд рүү үсрэх холбоосууд
  nav?: { id: string; label: string }[];
  children: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
  };

  return (
    <main className="w-full bg-white text-neutral-900 pb-28 font-sans selection:bg-[#15803d] selection:text-white">
      <ImageHero image={hero} kicker={kicker} title={title} intro={intro} />

      {nav && nav.length > 0 && (
        <div className="sticky top-(--nav-h) z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
          <div className="relative w-full max-w-7xl mx-auto flex items-center px-4">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Previous"
              className="absolute left-2 z-10 w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div
              ref={scrollRef}
              className="w-full py-3.5 px-12 flex items-center justify-start md:justify-center gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs sm:text-sm font-semibold"
            >
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-[#15803d] text-neutral-800 hover:text-white transition-colors whitespace-nowrap shrink-0"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Next"
              className="absolute right-2 z-10 w-9 h-9 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-14 space-y-24">{children}</div>
    </main>
  );
}

// Нэг ангиллын хэсэг: гарчиг + тоо, газруудын зурагтай картын тор, "бүгдийг үзэх" карт
export function DirectoryGroupSection({
  group,
  moreCount,
  moreTitle,
  moreDesc,
}: {
  group: DirectoryGroup;
  // "+N тогтоц" гэх мэт тооны дараах үг
  moreCount: string;
  moreTitle: string;
  moreDesc: string;
}) {
  const moreHref = liveHref(group.moreHref);

  return (
    <section id={group.id} className="scroll-mt-28 space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
          {group.title}
        </h2>
        <span className="text-xs sm:text-sm font-bold text-[#15803d] bg-emerald-50 px-4 py-1 rounded-full border border-emerald-200">
          {group.count}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {group.places.map((place) => (
          <ImageCard
            key={place.name}
            href={place.href}
            image={{ src: place.img, alt: place.name }}
            eyebrow={place.region}
            title={place.name}
            aspect="h-80 sm:h-96"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ))}

        {moreHref && (
          <Link
            href={moreHref}
            className="group relative rounded-3xl overflow-hidden bg-emerald-50/70 border-2 border-dashed border-emerald-300 hover:border-[#15803d] hover:bg-emerald-100/70 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center h-80 sm:h-96 cursor-pointer shadow-sm hover:shadow-xl"
          >
            <div className="w-14 h-14 rounded-full bg-[#15803d] text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-800 transition-all shadow-md">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <span className="text-base font-black text-[#15803d] uppercase tracking-wider">
              +{group.remainingCount} {moreCount}
            </span>
            <span className="text-sm sm:text-base text-neutral-900 font-extrabold mt-1">{moreTitle}</span>
            <p className="text-xs text-neutral-500 font-medium mt-2">{moreDesc}</p>
          </Link>
        )}
      </div>
    </section>
  );
}

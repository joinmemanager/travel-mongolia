'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useRef } from 'react';

import { useLanguage } from './LanguageContext';

interface Props {
  items: any[];
}

export default function TopDestinations({ items }: Props) {
  const { t } = useLanguage();
  const sliderRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden py-20 bg-white border-t border-gray-100">
      {/* 1. ТОЛГОЙ ХЭСЭГ: Ердийн өргөнтэй (max-w-7xl) хүрээндээ байна */}
      <div className="px-6 mx-auto max-w-7xl sm:px-10 lg:px-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="block mb-2 text-xs font-semibold tracking-[0.2em] text-[#15803d] uppercase">
              FEATURED DESTINATIONS
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t.featuredPlaces || 'Top Destinations'}
            </h2>
          </div>

          <div className="flex gap-2 items-center">
            <button
              onClick={() => scroll('left')}
              aria-label="Өмнөх"
              className="flex z-10 justify-center items-center w-10 h-10 text-gray-600 hover:text-black bg-white rounded-full border border-gray-200 hover:border-gray-900 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              ‹
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Дараах"
              className="flex z-10 justify-center items-center w-10 h-10 text-gray-600 hover:text-black bg-white rounded-full border border-gray-200 hover:border-gray-900 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* 2. КАРТУУД: Баруун тийшээ дэлгэцийн захаас давж гардаг бүтэц */}
      <div className="relative w-full">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-6 pr-16 pb-6 pl-6 scroll-smooth select-none sm:pl-10 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+4rem))]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item: any) => {
            const imageField = item.fields?.coverImage || item.fields?.image;
            const imageUrl = imageField?.fields?.file?.url
              ? imageField.fields.file.url.startsWith('//')
                ? `https:${imageField.fields.file.url}`
                : imageField.fields.file.url
              : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop';

            const title = item.fields?.title || 'Destination';

            return (
              <Link
                key={item.sys.id}
                href={`/destination/${item.sys.id}`}
                className="group overflow-hidden relative shrink-0 w-[290px] h-[430px] rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 sm:w-[330px]"
              >
                {/* Зураг */}
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="330px"
                  unoptimized
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Доод талын зөөлөн сүүдэр */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Нэр */}
                <div className="absolute inset-x-6 bottom-6">
                  <h3 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
                    {title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 3. ДЭЛГЭЦИЙН ЗАХЫН ЗӨӨЛӨН ЦАЙРАЛТ (Зөвхөн баруун захад тулсан хэсэгт л харагдана) */}
        <div className="absolute top-0 right-0 bottom-6 w-24 bg-gradient-to-l from-white via-white/40 to-transparent pointer-events-none sm:w-40" />
      </div>
    </section>
  );
}

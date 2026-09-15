'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
    <section className="py-20 bg-white overflow-hidden border-t border-gray-100">
      
      {/* 1. ТОЛГОЙ ХЭСЭГ: Ердийн өргөнтэй (max-w-7xl) хүрээндээ байна */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#15803d] block mb-2">
              FEATURED DESTINATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              {t.featuredPlaces || 'Top Destinations'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              aria-label="Өмнөх"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-black transition-all cursor-pointer shadow-sm active:scale-95 bg-white z-10"
            >
              ‹
            </button>
            <button
              onClick={() => scroll('right')}
              aria-label="Дараах"
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-gray-900 hover:text-black transition-all cursor-pointer shadow-sm active:scale-95 bg-white z-10"
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
          className="flex gap-6 overflow-x-auto scroll-smooth pb-6 select-none pl-6 sm:pl-10 lg:pl-[max(1.5rem,calc((100vw-80rem)/2+4rem))] pr-16"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item: any) => {
            const imageField = item.fields?.coverImage || item.fields?.image;
            const imageUrl = imageField?.fields?.file?.url
              ? (imageField.fields.file.url.startsWith('//')
                  ? `https:${imageField.fields.file.url}`
                  : imageField.fields.file.url)
              : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop';

            const title = item.fields?.title || 'Destination';

            return (
              <Link
                key={item.sys.id}
                href={`/destination/${item.sys.id}`}
                className="relative flex-shrink-0 w-[290px] sm:w-[330px] h-[430px] rounded-3xl overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-300"
              >
                {/* Зураг */}
                <Image
                  src={imageUrl}
                  alt={title}
                  fill
                  sizes="330px"
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Доод талын зөөлөн сүүдэр */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Нэр */}
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">
                    {title}
                  </h3>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 3. ДЭЛГЭЦИЙН ЗАХЫН ЗӨӨЛӨН ЦАЙРАЛТ (Зөвхөн баруун захад тулсан хэсэгт л харагдана) */}
        <div className="pointer-events-none absolute top-0 bottom-6 right-0 w-24 sm:w-40 bg-gradient-to-l from-white via-white/40 to-transparent" />
      </div>

    </section>
  );
}
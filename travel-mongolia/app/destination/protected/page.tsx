'use client';

import React, { useRef } from 'react';
import Image from 'next/image';


interface PlaceCard {
  name: string;
  region: string;
  img: string;
}

interface CategoryData {
  id: string;
  title: string;
  count: string;
  places: PlaceCard[];
  remainingCount: number;
}

const CATEGORIES: CategoryData[] = [
  {
    id: 'strictly-protected',
    title: 'Дархан цаазат газар',
    count: 'Нийт 22 бүс нутаг',
    places: [
      {
        name: 'Богд хан уул',
        region: 'Төв аймаг · 1778 он',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
      },
      {
        name: 'Говийн их дархан газар',
        region: 'Говь-Алтай · Мазаалайн өлгий',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
      {
        name: 'Отгонтэнгэр хайрхан',
        region: 'Завхан · 4,008 м',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000',
      },
    ],
    remainingCount: 19,
  },
  {
    id: 'national-parks',
    title: 'Байгалийн цогцолборт газар',
    count: 'Нийт 37 бүс нутаг',
    places: [
      {
        name: 'Хөвсгөл нуур',
        region: 'Хөвсгөл · Далай ээж',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
      },
      {
        name: 'Горхи-Тэрэлж',
        region: 'Төв аймаг · Мэлхий хад',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
      {
        name: 'Хустайн нуруу',
        region: 'Төв аймаг · Тахийн өлгий',
        img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000',
      },
    ],
    remainingCount: 34,
  },
  {
    id: 'nature-reserves',
    title: 'Байгалийн нөөц газар',
    count: 'Нийт 36 бүс нутаг',
    places: [
      {
        name: 'Их нартын чулуу',
        region: 'Дорноговь · Аргалийн нутаг',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
      {
        name: 'Батхаан уул',
        region: 'Төв аймаг · Ойт хээр',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
      },
      {
        name: 'Гүн галуут',
        region: 'Төв аймаг · Шувуудын орон',
        img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
      },
    ],
    remainingCount: 33,
  },
  {
    id: 'natural-monuments',
    title: 'Байгалийн дурсгалт газар',
    count: 'Нийт 14 бүс нутаг',
    places: [
      {
        name: 'Улаан цутгалан хүрхрээ',
        region: 'Өвөрхангай · Орхоны хөндий',
        img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1000',
      },
      {
        name: 'Хоргын тогоо',
        region: 'Архангай · Тэрхийн цагаан нуур',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
      {
        name: 'Цагаан суварга',
        region: 'Дундговь · Эртний хавцал',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
    ],
    remainingCount: 11,
  },
];

export default function ProtectedAreasPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-white text-neutral-900 pb-28 font-sans selection:bg-[#15803d] selection:text-white">
      
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2400"
          alt="Тусгай хамгаалалттай газрууд"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.45]"
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-xs sm:text-sm font-black mb-3 block">
            03. Protected Areas
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-3">
            Тусгай хамгаалалттай газраар
          </h1>
          <p className="text-white/90 text-base sm:text-lg font-normal max-w-2xl mx-auto">
            Монгол орны онгон дагшин 4 үндсэн ангиллын тусгай хамгаалалттай нутгууд
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
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
            className="w-full py-3.5 px-12 flex items-center justify-start md:justify-center gap-3 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs sm:text-sm font-semibold"
          >
            {CATEGORIES.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="px-5 py-2 rounded-full bg-neutral-100 hover:bg-[#15803d] text-neutral-800 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {sec.title}
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

      {/* 3. ТОМ БӨГӨӨД СҮРЛЭГ 4 БАГАНАТАЙ КАРТУУД */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-14 space-y-24">
        {CATEGORIES.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-28 space-y-6">
            
            {/* АНГИЛЛЫН ТОМ ГАРЧИГ БА ТОО */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
                {sec.title}
              </h2>
              <span className="text-xs sm:text-sm font-bold text-[#15803d] bg-emerald-50 px-4 py-1 rounded-full border border-emerald-200">
                {sec.count}
              </span>
            </div>

            {/* ТОМ ХЭМЖЭЭТЭЙ 4 КАРТ (3 ГАЗАР + 1 БҮГДИЙГ ҮЗЭХ КАРТ) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sec.places.map((place, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-[#15803d]/60 transition-all duration-300 flex flex-col h-80 sm:h-96"
                >
                  {/* Том зураг */}
                  <div className="relative w-full flex-1 overflow-hidden">
                    <Image
                      src={place.img}
                      alt={place.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    
                    {/* Зургийн дээрх тайлбар */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-xs font-semibold text-emerald-300 block mb-1">
                        {place.region}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                        {place.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}

              {/* 4 ДЭХ ТОМ КАРТ: "БҮГДИЙГ ҮЗЭХ" */}
              <Link
                href={`/destination/protected/${sec.id}`}
                className="group relative rounded-3xl overflow-hidden bg-emerald-50/70 border-2 border-dashed border-emerald-300 hover:border-[#15803d] hover:bg-emerald-100/70 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center h-80 sm:h-96 cursor-pointer shadow-sm hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-full bg-[#15803d] text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-800 transition-all shadow-md">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <span className="text-base font-black text-[#15803d] uppercase tracking-wider">
                  +{sec.remainingCount} газар
                </span>
                <span className="text-sm sm:text-base text-neutral-900 font-extrabold mt-1">
                  Бүх газрын лавлах
                </span>
                <p className="text-xs text-neutral-500 font-medium mt-2">
                  Интерактив газрын зураг, байршил & дэлгэрэнгүй мэдээлэл
                </p>
              </Link>
            </div>

          </section>
        ))}
      </div>

    </main>
  );
}

'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PlaceCard {
  name: string;
  region: string;
  img: string;
}

interface HeritageCategory {
  id: string;
  title: string;
  count: string;
  places: PlaceCard[];
  remainingCount: number;
}

const HERITAGE_CATEGORIES: HeritageCategory[] = [
  {
    id: 'unesco',
    title: 'UNESCO Дэлхийн өв',
    count: 'Нийт 6 дэлхийн өв бүс',
    places: [
      {
        name: 'Орхоны хөндийн соёлын дурсгал',
        region: 'Өвөрхангай, Архангай · 2004 он',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
      {
        name: 'Бурхан Халдун уул & хүрээлэн буй нутаг',
        region: 'Хэнтий · 2015 он',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
      },
      {
        name: 'Буган чулуун хөшөө, хүрэл зэвсгийн цогцолбор',
        region: 'Хөвсгөл, Архангай · 2023 он',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
    ],
    remainingCount: 3,
  },
  {
    id: 'archaeology',
    title: 'Археологийн дурсгал',
    count: 'Нийт 30+ малтлага, дурсгалт бүс',
    places: [
      {
        name: 'Ноён уулын Хүннүгийн язгууртны булш',
        region: 'Төв аймаг, Батсүмбэр · Хүннү гүрэн',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
      },
      {
        name: 'Гол мод-2 Хүннүгийн хааны бунхан',
        region: 'Архангай, Өндөр-Улаан · Дэлхийд хосгүй олдвор',
        img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000',
      },
      {
        name: 'Улаан зуухны дөрвөлжин булшнууд',
        region: 'Дорнод аймаг · Хүрлийн үеийн соёл',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
    ],
    remainingCount: 27,
  },
  {
    id: 'monasteries',
    title: 'Хийд ба сүмүүд',
    count: 'Нийт 40+ түүхэн хийд, дацан',
    places: [
      {
        name: 'Эрдэнэ зуу хийд',
        region: 'Өвөрхангай, Хархорин · 1586 онд байгуулсан',
        img: 'https://images.unsplash.com/photo-1545648816-43e993510e42?q=80&w=1000',
      },
      {
        name: 'Амарбаясгалант хийд',
        region: 'Сэлэнгэ, Бүрэнгүй · Өндөр гэгээний бүтээл',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
      {
        name: 'Гандантэгчэнлин хийд',
        region: 'Улаанбаатар · Жанрайсиг бурхны өргөө',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
    ],
    remainingCount: 37,
  },
  {
    id: 'ancient-cities',
    title: 'Түүхэн хот, суурингийн туурь',
    count: 'Нийт 25+ эртний нийслэл, бэхлэлт',
    places: [
      {
        name: 'Хархорум хотын туурь',
        region: 'Өвөрхангай · Их Монгол Улсын нийслэл',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
      {
        name: 'Хар балгас (Орду балык)',
        region: 'Архангай, Хотонт · Уйгурын эзэнт гүрэн',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000',
      },
      {
        name: 'Цогтын цагаан байшин (Чин толгой)',
        region: 'Булган, Баяннуур · XVII зууны чулуун цайз',
        img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1000',
      },
    ],
    remainingCount: 22,
  },
  {
    id: 'petroglyphs',
    title: 'Хадны зураг, бичээс',
    count: 'Нийт 20+ хадны урлагийн галерей',
    places: [
      {
        name: 'Цагаан салаа, Бага Ойгорын хадны зураг',
        region: 'Баян-Өлгий · 10,000+ чулуун дүрслэл',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
      {
        name: 'Хойд Цэнхэрийн агуйн сүг зураг',
        region: 'Ховд, Манхан · Дээд палеолитын улаан зураг',
        img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
      },
      {
        name: 'Бичигт хадны дурсгал',
        region: 'Баянхонгор · Эртний тамга, дүрслэлт хад',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
    ],
    remainingCount: 17,
  },
  {
    id: 'monuments',
    title: 'Хөшөө дурсгал, хүн чулуу',
    count: 'Нийт 20+ руни бичээс, хүн чулууд',
    places: [
      {
        name: 'Билгэ хаан & Күлтегиний гэрэлт хөшөө',
        region: 'Архангай, Хашаат · Эртний Түрэгийн бичээс',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
      },
      {
        name: 'Тоньюкук мэргэний гэрэлт хөшөө',
        region: 'Төв аймаг, Налайх · Төрийн зүтгэлтний дурсгал',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000',
      },
      {
        name: 'Тал нутгийн хүн чулуун цогцолборууд',
        region: 'Дорнод, Сүхбаатар · Өвөг дээдсийн чулуун хөрөг',
        img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000',
      },
    ],
    remainingCount: 17,
  },
  {
    id: 'nomadic-culture',
    title: 'Нүүдэлчдийн соёлын бүс',
    count: 'Нийт 15+ уламжлалт амьд соёлын голомт',
    places: [
      {
        name: 'Хөвсгөлийн тайгын Цаатан иргэд',
        region: 'Хөвсгөл, Улаан тайга · Цааны аж ахуй',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
      },
      {
        name: 'Баян-Өлгийн бүргэдийн соёл',
        region: 'Баян-Өлгий · Морьт бүргэдчдийн өв',
        img: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=1000',
      },
      {
        name: 'Өмнөговийн тэмээчдийн өв',
        region: 'Өмнөговь · Хоёр бөхт тэмээ, нүүдэлчин ахуй',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
    ],
    remainingCount: 12,
  },
];

export default function HeritageDestinationsPage() {
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
          src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2400"
          alt="Түүх, соёлын газруудаар"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.45]"
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-xs sm:text-sm font-black mb-3 block">
            05. Heritage Destinations
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-3">
            Түүх, соёлын газруудаар
          </h1>
          <p className="text-white/90 text-base sm:text-lg font-normal max-w-2xl mx-auto">
            ЮНЕСКО-гийн дэлхийн өв, эртний хаадын нийслэл хотууд, сүм хийд ба нүүдэлчдийн амьд соёл
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
<div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
  <div className="w-full max-w-7xl mx-auto flex items-center gap-2 px-4 sm:px-8 py-3">
    {/* Зүүн сум */}
    <button
      type="button"
      onClick={() => handleScroll('left')}
      aria-label="Previous"
      className="shrink-0 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>

    {/* Голын гүйдэг цэс */}
    <div
      ref={scrollRef}
      className="flex-1 flex items-center gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs sm:text-sm font-semibold"
    >
      {HERITAGE_CATEGORIES.map((sec) => (
        <a
          key={sec.id}
          href={`#${sec.id}`}
          className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-[#15803d] text-neutral-800 hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          {sec.title}
        </a>
      ))}
    </div>

    {/* Баруун сум */}
    <button
      type="button"
      onClick={() => handleScroll('right')}
      aria-label="Next"
      className="shrink-0 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  </div>
</div>

      {/* 3. 7 АНГИЛЛЫН ТОМ 4 БАГАНАТАЙ КАРТУУД */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-14 space-y-24">
        {HERITAGE_CATEGORIES.map((sec) => (
          <section key={sec.id} id={sec.id} className="scroll-mt-28 space-y-6">
            
            {/* ГАРЧИГ БА ТОО ХЭМЖЭЭ */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">
                {sec.title}
              </h2>
              <span className="text-xs sm:text-sm font-bold text-[#15803d] bg-emerald-50 px-4 py-1 rounded-full border border-emerald-200">
                {sec.count}
              </span>
            </div>

            {/* 4 ТОМ КАРТ (3 ОНЦЛОХ ГАЗАР + 1 БҮГДИЙГ ҮЗЭХ КАРТ) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sec.places.map((place, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-neutral-200/90 shadow-sm hover:shadow-xl hover:border-[#15803d]/60 transition-all duration-300 flex flex-col h-80 sm:h-96"
                >
                  <div className="relative w-full flex-1 overflow-hidden">
                    <Image
                      src={place.img}
                      alt={place.name}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    
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
                href={`/destination/heritage/${sec.id}`}
                className="group relative rounded-3xl overflow-hidden bg-emerald-50/70 border-2 border-dashed border-emerald-300 hover:border-[#15803d] hover:bg-emerald-100/70 transition-all duration-300 flex flex-col items-center justify-center p-8 text-center h-80 sm:h-96 cursor-pointer shadow-sm hover:shadow-xl"
              >
                <div className="w-14 h-14 rounded-full bg-[#15803d] text-white flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-800 transition-all shadow-md">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
                <span className="text-base font-black text-[#15803d] uppercase tracking-wider">
                  +{sec.remainingCount} дурсгал
                </span>
                <span className="text-sm sm:text-base text-neutral-900 font-extrabold mt-1">
                  Бүх түүхэн өвийн сан
                </span>
                <p className="text-xs text-neutral-500 font-medium mt-2">
                  Интерактив газрын зураг, байршил & дэлгэрэнгүй
                </p>
              </Link>
            </div>

          </section>
        ))}
      </div>

    </main>
  );
}
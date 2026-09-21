'use client';

import Link from 'next/link';
import React, { useRef } from 'react';
import Image from 'next/image';


interface ModernItem {
  title: string;
  desc: string;
  thumb: string;
}

interface ModernSection {
  id: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: ModernItem[];
}

const MODERN_SECTIONS: ModernSection[] = [
  {
    id: 'lifestyle',
    num: '01',
    tag: 'Орчин цагийн хэмнэл',
    title: 'Орчин үеийн Монголын амьдрал',
    desc: 'Уламжлалт нүүдлийн ахуй болон даяаршлын дижитал шийдлийг хослуулан хөгжүүлж буй шинэ үе, энтертайнмент соёл, эрч хүчтэй амьдралын өнгө төрх.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    items: [
      {
        title: 'Кофены соёл & Коворкинг',
        desc: 'Залуус чөлөөтэй сэтгэн ажиллах бүтээлч орчин, нийслэлийн эрч хүчтэй бизнес төвүүд.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Дижитал эрин үе',
        desc: 'Цахим банк, финтек, ухаалаг үйлчилгээ өндөр хөгжсөн бэлэн мөнгөгүй төлбөрийн хэв маяг.',
        thumb: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600',
      },
      {
        title: 'Амралтын өдрүүдийн аялал',
        desc: 'Хотын залуус амралтын өдрөөр хөдөө гарч, байгальд аялан эрүүл эрч хүчээ сэлбэх соёл.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
  {
    id: 'urban-rural',
    num: '02',
    tag: 'Хөгжил ба ялгарал',
    title: 'Хот ба хөдөөгийн амьдрал',
    desc: 'Шилэн цамхгууд сүндэрлэсэн нийслэл Улаанбаатар хот ба онгон зэлүүд байгальтайгаа зэрэгцэн орших уудам хөдөөгийн малчин ахуйн зохицол.',
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1200',
    items: [
      {
        title: 'Нийслэл Улаанбаатар хот',
        desc: 'Түүх соёл, орчин үеийн дэд бүтэц хосолсон Төв Азийн хамгийн өвөрмөц мегаполис хот.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Малчин өрхийн дэвшил',
        desc: 'Нарны дэлгэц, сансрын интернэт, мотоцикль ашигладаг орчин цагийн шинэ үеийн малчид.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Аймгийн төвүүд & Хөгжил',
        desc: 'Бүс нутгийн дэд бүтэц, авто замын сүлжээ болон аялал жуулчлалын төвүүдийн тэлэлт.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
  {
    id: 'creative-arts',
    num: '03',
    tag: 'Бүтээлч үйлдвэрлэл',
    title: 'Орчин үеийн урлаг, дизайн',
    desc: 'Монгол өв соёлыг дэлхийн контемпорари урлагтай хослуулсан шинэ үеийн загвар зохион бүтээгчид, кино найруулагчид ба уран бүтээлчид.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    items: [
      {
        title: 'Орчин үеийн Монгол загвар',
        desc: 'Үндэсний дээл, хээ угалзыг орчин үеийн өдөр тутмын загварт шингээсэн брэндүүд.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Контемпорари уран зураг',
        desc: 'Уламжлалт монгол зургийн арга барилыг модернизмтай холбосон олон улсын үзэсгэлэнгүүд.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Кино & Театр',
        desc: 'Дэлхийн кино наадмуудад шагнал хүртэж буй бие даасан уран бүтээлчдийн бүтээлүүд.',
        thumb: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600',
      },
    ],
  },
  {
    id: 'music',
    num: '04',
    tag: 'Аялгуу эгшиг',
    title: 'Хөгжим & Фестивалиуд',
    desc: 'Морин хуур, хөөмийн язгуур эгшгийг метал роктой хослуулсан дэлхийн од хамтлагуудаас эхлээд олон улсын томоохон хөгжмийн наадмууд.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    items: [
      {
        title: 'Хүннү Рок & Дэлхийн тавцан',
        desc: '"The Hu" зэрэг хамтлагууд язгуур урлагийг дэлхийн рок хөгжмийн тавцанд тунхаглаж байна.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Playtime Festival',
        desc: 'Төв Азийн хамгийн том амьд хөгжмийн фестивалиудын нэг бөгөөд дэлхийн олон орны залуусыг нэгтгэдэг.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Хип хоп & Электрон урсгал',
        desc: 'Хотын залуусын өдөр тутмын амьдрал, үзэл бодлыг илэрхийлсэн шинэ цагийн дуу хоолой.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
  {
    id: 'youth-culture',
    num: '05',
    tag: 'Ирээдүйг бүтээгчид',
    title: 'Залуусын соёл & Спорт',
    desc: 'Олимп, тив дэлхийд амжилт гаргаж буй жүдо, чөлөөт бөх, цахим спортын тамирчид болон сайн дурын нэгдэл, стартап экосистем.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200',
    items: [
      {
        title: 'Цахим спорт (Esports)',
        desc: 'CS2, PUBG Mobile зэрэг спортын төрлөөр дэлхийн аваргын цомыг эх орондоо авчирсан залуус.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Олимп & Их спорт',
        desc: 'Жүдо, чөлөөт бөх, бокс болон 3х3 сагсан бөмбөгийн төрлөөр дэлхийд өрсөлдөж буй тамирчид.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Стартап & Инноваци',
        desc: 'Дэлхийн зах зээлд өрсөлдөх зорилготой технологийн шинэ бизнес, залуу энтрепренерүүд.',
        thumb: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600',
      },
    ],
  },
];

export default function ModernMongoliaPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-white text-neutral-900 pb-36 font-sans selection:bg-[#15803d] selection:text-white">
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2400"
          alt="Өнөөгийн Монгол"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.55]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            09. Mongolia Today
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Өнөөгийн Монгол
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Орчин үеийн залуусын бүтээлч байдал, шинэлэг урлаг соёл, дижитал хөгжил ба орчин үеийн хотын амьдрал
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="relative w-full max-w-7xl mx-auto flex items-center px-2 sm:px-6">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous"
            className="absolute left-2 z-10 w-9 h-9 rounded-full bg-white/95 border border-emerald-200 shadow-md flex items-center justify-center text-emerald-800 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="w-full py-3 px-12 flex items-center gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs sm:text-sm font-bold"
          >
            {MODERN_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="px-4 py-2 rounded-full bg-emerald-50/70 border border-emerald-100 text-emerald-950 hover:bg-[#15803d] hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {sec.title}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next"
            className="absolute right-2 z-10 w-9 h-9 rounded-full bg-white/95 border border-emerald-200 shadow-md flex items-center justify-center text-emerald-800 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. ДЭЛГЭРЭНГҮЙ ХЭСГҮҮД */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-16 space-y-28">
        {MODERN_SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-28 space-y-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                  {sec.title}
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                  {sec.desc}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/about/modern/${sec.id}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#15803d] text-white hover:bg-emerald-800 transition-all font-bold text-sm sm:text-base shadow-sm hover:shadow-md group/btn"
                  >
                    <span>Дэлгэрэнгүй</span>
                    <svg 
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6 relative w-full h-64 sm:h-80 lg:h-[340px] rounded-3xl overflow-hidden shadow-md group border border-emerald-100">
                <Image
                  src={sec.imageUrl}
                  alt={sec.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group/card bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-[#15803d]/50 transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden">
                    <Image
                      src={item.thumb}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover/card:text-[#15803d] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}


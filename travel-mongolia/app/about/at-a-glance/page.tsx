'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface GlanceItem {
  title: string;
  desc: string;
  thumb: string;
}

interface GlanceSection {
  id: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: GlanceItem[];
}

const GLANCE_SECTIONS: GlanceSection[] = [
  {
    id: 'overview',
    num: '01',
    tag: 'Ерөнхий мэдээлэл & Хил хязгаар',
    title: 'Монгол Улсын тухай үндсэн мэдээлэл',
    desc: 'Монгол Улс нь Төв Азийн өндөрлөг бүсэд оршдог, хойд талаараа ОХУ, өмнө талаараа БНХАУ-тай хиллэдэг далайд гарцгүй, бүрэн эрхт ардчилсан парламентын засаглалтай улс юм.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200',
    items: [
      {
        title: 'Байршил & Хил хязгаар',
        desc: 'Төв Азийн зүрхэнд оршдог бөгөөд хойд талаараа 3,543 км, өмнө талаараа 4,709 км хиллэдэг.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Төрийн байгуулал',
        desc: 'Парламентын засаглалтай бүрэн эрхт ардчилсан улс бөгөөд Үндсэн хуульт засаглалтай.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Цагийн бүс & Мөнгөн тэмдэгт',
        desc: 'UTC+8 цагийн бүс, үндэсний мөнгөн тэмдэгт нь төгрөг (MNT) бөгөөд дижитал төлбөр өндөр хөгжсөн.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
  {
    id: 'population',
    num: '02',
    tag: 'Ард түмэн ба нийгэм',
    title: 'Хүн ам, нийслэл',
    desc: 'Монгол Улсын нийт хүн ам 3.5 сая давсан бөгөөд залуу үеийн эзлэх хувь өндөр, нийслэл Улаанбаатар хотод хүн амын талаас илүү хувь нь төвлөрөн амьдардаг.',
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1200',
    items: [
      {
        title: 'Нийслэл Улаанбаатар',
        desc: 'Эдийн засаг, соёл, боловсролын төв бөгөөд 1.6 сая гаруй оршин суугчтай орчин үеийн их хот.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Хүн амын нягтрал',
        desc: 'Нэг хавтгай дөрвөлжин км-т ногдох нягтралаараа дэлхийн хамгийн сийрэг суурьшилтай орон.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Залуусын орон',
        desc: 'Хүн амын 60 гаруй хувийг 35 хүртэлх насны залуус эзэлдэг эрч хүчтэй нийгэм.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
    ],
  },
  {
    id: 'geography',
    num: '03',
    tag: 'Уудам газар нутаг',
    title: 'Газар нутаг & Байгалийн бүс',
    desc: '1,564,116 хавтгай дөрвөлжин километр нутаг дэвсгэртэй бөгөөд хэмжээгээрээ дэлхийд 18 дугаарт эрэмбэлэгддэг, хангай говь хосолсон үзэсгэлэнт байгальтай.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    items: [
      {
        title: 'Байгалийн олон янз байдал',
        desc: 'Хөвсгөлийн тайга, Хангайн нуруу, Дорнодын уудам тал, Өмнөд говь хосолсон дөрвөн бүслүүр.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Хамгийн өндөр цэг',
        desc: 'Алтай Таван Богдын Хүйтэн оргил бөгөөд далайн түвшнээс дээш 4,374 метр өндөр.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Цэнгэг нуур, мөрөн',
        desc: 'Дэлхийн цэнгэг усны 1%-ийг агуулдаг Хөвсгөл далай, Сэлэнгэ, Орхон зэрэг ариун мөрөн голууд.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
    ],
  },
  {
    id: 'symbols',
    num: '04',
    tag: 'Тусгаар тогтнолын илэрхийлэл',
    title: 'Төрийн болон үндэсний бэлгэдэл',
    desc: 'Монгол түмний тусгаар тогтнол, түүхэн уламжлал, оюун санааны гүн утга агуулгыг илэрхийлсэн төрийн далбаа, сүлд болон үндэсний бахархалт бэлгэдлүүд.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    items: [
      {
        title: 'Төрийн далбаа & Соёмбо',
        desc: 'Мөнх хөх тэнгэр, гал голомт, ухаарал ба бат бэхийн бэлгэдэл болсон алтан соёмбо үсэг.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Төрийн сүлд',
        desc: 'Хийморь бадраах эрдэнэт хүлэг морь, бадамлянхуа цэцэг, эв нэгдлийн бат холбоот сүлд.',
        thumb: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600',
      },
      {
        title: 'Үндэсний бахархалт шувуу',
        desc: 'Хурд хүч, эрх чөлөө, тэнгэрлиг чанарын дээд илэрхийлэл болсон идлэг шонхор шувуу.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
  {
    id: 'facts',
    num: '05',
    tag: 'Дэлхийд данстай баримтууд',
    title: 'Монгол орны онцлог тоо, баримтууд',
    desc: 'Жилд 250 гаруй нартай цэлмэг өдөртэй, дэлхийн анхны дархан цаазат газар Богдхан уул, палеонтологийн хосгүй олдворуудаараа дэлхийд гайхагдсан баримтууд.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
    items: [
      {
        title: '250+ Нартай өдөр',
        desc: 'Дэлхийд "Мөнх хөх тэнгэрийн орон" хэмээн нэрлэгддэг тунгалаг, цэлмэг өдрүүдийн баялаг.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Анхны дархан цаазат газар',
        desc: 'Богдхан уулыг 1778 онд дархалсан нь дэлхийн анхны албан ёсны байгалийн тусгай хамгаалалттай газар юм.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Үлэг гүрвэлийн өлгий',
        desc: 'Баянзаг болон говиос олдсон үлэг гүрвэлийн анхны өндөг, олдворууд дэлхийн шинжлэх ухаанд хувьсгал хийсэн.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
];

export default function AtAGlancePage() {
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
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400"
          alt="Монгол орныг товчхон"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.55]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            01. Mongolia at a Glance
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Монгол орныг товчхон
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Мөнх хөх тэнгэрийн орон, нүүдэлчдийн өлгий нутгийн тухай үндсэн тоо баримтууд болон ерөнхий мэдээлэл
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
            {GLANCE_SECTIONS.map((sec) => (
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
        {GLANCE_SECTIONS.map((sec) => (
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
                    href={`/about/at-a-glance/${sec.id}`}
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
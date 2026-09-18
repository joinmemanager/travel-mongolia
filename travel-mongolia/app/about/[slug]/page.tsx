'use client';

import React, { useRef } from 'react';
import Image from 'next/image';

import { notFound, useParams } from 'next/navigation';

const aboutData: Record<string, any> = {
  // 01. МОНГОЛ ОРНЫГ ТОВЧХОН
  'glance': {
    category: '01. MONGOLIA AT A GLANCE',
    title: 'Монгол орныг товчхон',
    desc: 'Мөнх хөх тэнгэрийн орон, нүүдэлчдийн өлгий нутгийн тухай үндсэн тоо баримтууд болон ерөнхий мэдээлэл',
    heroImage: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600',
    featured: {
      title: 'Монгол Улсын тухай үндсэн мэдээлэл',
      desc: 'Монгол Улс нь Төв Азийн өндөрлөг бүсэд оршдог, хойд талаараа ОХУ, өмнө талаараа БНХАУ-тай хиллэдэг далайд гарцгүй, бүрэн эрхт ардчилсан улс юм. Газар нутгийн хэмжээгээрээ дэлхийд 18-д эрэмбэлэгддэг.',
      link: '#overview',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1000'
    },
    items: [
      { id: 'population', title: 'Хүн ам, нийслэл', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=800' },
      { id: 'geography', title: 'Газар нутаг', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800' },
      { id: 'symbols', title: 'Төрийн болон үндэсний бэлгэдэл', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
      { id: 'name', title: 'Монгол нэрийн тухай', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
      { id: 'facts', title: 'Монгол орны онцлог тоо, баримтууд', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800' }
    ]
  },

  // 03. МОНГОЛ ХҮН, ХЭЛ, ҮНДЭСТНИЙ ОНЦЛОГ
  'identity': {
    category: '03. PEOPLE, LANGUAGE & IDENTITY',
    title: 'Монгол хүн, хэл, үндэстний онцлог',
    desc: 'Монголчуудын угсаатны бүрэлдэхүүн, босоо монгол бичиг, зочломтгой уламжлал ба нүүдэлчин амьдралын хэв маяг',
    heroImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600',
    featured: {
      title: 'Монголчууд & Угсаатны бүлгүүд',
      desc: 'Халх, буриад, баяд, дөрвөд, казак зэрэг 20 гаруй ястан, угсаатны бүлгээс бүрддэг ба олон зууны турш нүүдэлчдийн нэгдмэл баялаг соёл, өв уламжлалыг өвлөн хадгалж ирсэн билээ.',
      link: '#mongolians',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000'
    },
    items: [
      { id: 'language', title: 'Монгол хэл', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800' },
      { id: 'script', title: 'Босоо монгол бичиг', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=800' },
      { id: 'names', title: 'Нэр, овгийн соёл', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
      { id: 'hospitality', title: 'Зочломтгой зан заншил', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
      { id: 'lifestyle', title: 'Монгол хүний аж төрөхүй', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800' }
    ]
  },

  // 09. ӨНӨӨГИЙН МОНГОЛ
  'today': {
    category: '09. MONGOLIA TODAY',
    title: 'Өнөөгийн Монгол',
    desc: 'Орчин үеийн залуусын бүтээлч байдал, шинэлэг урлаг соёл, дижитал хөгжил ба орчин үеийн хотын амьдрал',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600',
    featured: {
      title: 'Орчин үеийн Монголын амьдрал',
      desc: 'Уламжлалт нүүдлийн ахуй болон даяаршлын дижитал шийдлийг зэрэгцүүлэн хөгжүүлж буй орчин цагийн залуу үе, эрч хүчтэй хотын соёл, энтертайнмент салбарын өнгө төрх.',
      link: '#lifestyle',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1000'
    },
    items: [
      { id: 'urban-rural', title: 'Хот ба хөдөөгийн амьдрал', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800' },
      { id: 'creative-arts', title: 'Бүтээлч үйлдвэрлэл, орчин үеийн урлаг', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800' },
      { id: 'sports', title: 'Спорт, эрүүл амьдрал', image: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=800' },
      { id: 'music', title: 'Орчин цагийн хөгжмийн урсгал', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800' },
      { id: 'modern-heritage', title: 'Уламжлал ба орчин үе', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' }
    ]
  }
};

export default function AboutDynamicHubPage() {
  const params = useParams();
  const slugParam = params?.slug;
  const mainSlug = Array.isArray(slugParam) ? slugParam[0] : (slugParam || '');

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const data = aboutData[mainSlug];
  if (!data) return notFound();

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -250 : 250,
        behavior: 'smooth',
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative h-[480px] sm:h-[540px] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={data.heroImage}
            alt={data.title}
            fill
            sizes="100vw"
            priority
            className="object-cover brightness-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs sm:text-sm font-black tracking-widest text-[#22c55e] uppercase">
            {data.category}
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-sm sm:text-base text-gray-200 font-normal max-w-2xl mx-auto leading-relaxed">
            {data.desc}
          </p>
        </div>
      </section>

      {/* 2. ДЭЭД ТАЛЫН ГҮЙДЭГ PILL ЦЭС */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-3.5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative flex items-center">
          <button
            onClick={() => handleScroll('left')}
            className="hidden sm:flex shrink-0 w-9 h-9 mr-2 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-black hover:border-gray-900 transition-all z-10 cursor-pointer active:scale-95"
            aria-label="Previous"
          >
            ‹
          </button>

          <div
            ref={scrollContainerRef}
            className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth w-full py-1"
          >
            {/* Эхний онцолсон зүйл */}
            <a
              href={data.featured.link}
              className="px-5 py-2 text-xs font-bold rounded-full bg-[#15803d] text-white shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              {data.featured.title}
            </a>

            {/* Бусад зүйлс */}
            {data.items.map((item: any) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-5 py-2 text-xs font-bold rounded-full bg-neutral-100 text-gray-700 hover:bg-[#15803d] hover:text-white transition-all whitespace-nowrap cursor-pointer"
              >
                {item.title}
              </a>
            ))}
          </div>

          <button
            onClick={() => handleScroll('right')}
            className="hidden sm:flex shrink-0 w-9 h-9 ml-2 items-center justify-center rounded-full bg-white shadow-sm border border-gray-200 text-gray-600 hover:text-black hover:border-gray-900 transition-all z-10 cursor-pointer active:scale-95"
            aria-label="Next"
          >
            ›
          </button>
        </div>
      </nav>

      {/* 3. ДЭЛГЭРЭНГҮЙ КАРТУУДЫН ХЭСЭГ */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-12">
        {/* ЭХНИЙ ОНЦОЛСОН ХЭСЭГ: Зүүн талд гарчиг + товч, Баруун талд том зураг */}
        <div id={data.featured.link.replace('#', '')} className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              {data.featured.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-normal">
              {data.featured.desc}
            </p>
            <div className="pt-2">
              <a
                href={data.featured.link}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#15803d] text-white text-xs font-bold hover:bg-[#166534] shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Дэлгэрэнгүй</span>
                <span>→</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7 relative h-[320px] sm:h-[400px] rounded-3xl overflow-hidden shadow-md">
            <Image
              src={data.featured.image}
              alt={data.featured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* ДООД ТАЛЫН БУСАД ДӨРВӨЛЖИН КАРТУУДЫН GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
          {data.items.map((item: any) => (
            <div
              key={item.id}
              id={item.id}
              className="group relative h-[260px] sm:h-[300px] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer scroll-mt-24"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-lg sm:text-xl font-bold text-white leading-snug group-hover:underline drop-shadow-sm">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

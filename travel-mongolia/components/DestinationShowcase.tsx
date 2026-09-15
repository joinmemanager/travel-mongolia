'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface CardItem {
  title: string;
  imageUrl: string;
  isWide?: boolean;
}

interface SubSection {
  id: string;
  tabLabel: string;
  title: string;
  cards: CardItem[];
}

interface DestinationGroup {
  title: string;
  subtitle: string;
  heroImage: string;
  sections: SubSection[];
}

export const DESTINATION_DATA: Record<string, DestinationGroup> = {
  // 1. АЯЛЛЫН БҮСЭЭР
  region: {
    title: 'Аяллын бүс нутаг',
    subtitle: 'Уудам Монгол орны байгаль, газарзүйн онцлог бүхий 6 их бүс',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000',
    sections: [
      {
        id: 'central',
        tabLabel: 'Төв Монгол',
        title: 'Төв Монголын бүс',
        cards: [
          { title: 'Тэрэлжийн байгалийн цогцолбор', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200', isWide: true },
          { title: 'Богд хан уул', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
          { title: 'Чингис хааны морьт хөшөө', imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800' },
        ],
      },
      {
        id: 'khangai',
        tabLabel: 'Хангайн бүс',
        title: 'Хангайн нуруу ба Орхоны хөндий',
        cards: [
          { title: 'Орхоны хөндийн дурсгалт газар', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200', isWide: true },
          { title: 'Тэрхийн цагаан нуур', imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800' },
          { title: 'Хоргын тогоо', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
        ],
      },
      {
        id: 'khuvsgul-north',
        tabLabel: 'Хөвсгөл ба Хойд',
        title: 'Хөвсгөл нуур ба Хойд тайга',
        cards: [
          { title: 'Хөвсгөл далай', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200', isWide: true },
          { title: 'Цаатны отог', imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800' },
          { title: 'Улаан тайга', imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800' },
        ],
      },
      {
        id: 'altai-west',
        tabLabel: 'Алтай ба Баруун',
        title: 'Алтай Таван Богд ба Баруун Монгол',
        cards: [
          { title: 'Алтай Таван Богдын мөсөн гол', imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200', isWide: true },
          { title: 'Увс нуур', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
          { title: 'Бүргэдчид ба Баян-Өлгий', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800' },
        ],
      },
      {
        id: 'gobi',
        tabLabel: 'Говийн бүс',
        title: 'Өмнөговь ба Говийн гайхамшиг',
        cards: [
          { title: 'Хонгорын элсэн манхан', imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200', isWide: true },
          { title: 'Баянзаг (Улаан цав)', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800' },
          { title: 'Ёлын ам', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
        ],
      },
      {
        id: 'eastern',
        tabLabel: 'Зүүн Монгол',
        title: 'Мэнэнгийн тал ба Зүүн хязгаар',
        cards: [
          { title: 'Мэнэнгийн их тал', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200', isWide: true },
          { title: 'Буйр нуур', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
          { title: 'Дорнодын цагаан зээрийн сүрэг', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
        ],
      },
    ],
  },

  // 2. ТУСГАЙ ХАМГААЛАЛТТАЙ ГАЗРААР
  protected: {
    title: 'Тусгай хамгаалалттай газар нутаг',
    subtitle: 'Эх байгаль, онгон дагшин орчин, ховор амьтдын дархан өлгий',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000',
    sections: [
      {
        id: 'strictly-protected',
        tabLabel: 'Дархан цаазат газар',
        title: 'Дархан цаазат газар',
        cards: [
          { title: 'Богд хан уул', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200', isWide: true },
          { title: 'Говийн их дархан цаазат газар', imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800' },
          { title: 'Отгонтэнгэр хайрхан', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
          { title: 'Хөх сэрхийн нуруу', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
        ],
      },
      {
        id: 'national-parks',
        tabLabel: 'Байгалийн цогцолборт газар',
        title: 'Байгалийн цогцолборт газар',
        cards: [
          { title: 'Хөвсгөл нуурын БЦГ', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200', isWide: true },
          { title: 'Горхи-Тэрэлж', imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800' },
          { title: 'Хустайн нуруу (Тахь)', imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800' },
          { title: 'Говь Гурван Сайхан', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800' },
        ],
      },
      {
        id: 'nature-reserves',
        tabLabel: 'Байгалийн нөөц газар',
        title: 'Байгалийн нөөц газар',
        cards: [
          { title: 'Батхаан уул', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200', isWide: true },
          { title: 'Гүн Галуут', imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800' },
          { title: 'Угтам уул', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
        ],
      },
      {
        id: 'monuments',
        tabLabel: 'Байгалийн дурсгалт газар',
        title: 'Байгалийн дурсгалт газар',
        cards: [
          { title: 'Хүйсийн найман нуур', imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200', isWide: true },
          { title: 'Ээж хайрхан уул', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
          { title: 'Улаан цутгалан хүрхрээ', imageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=800' },
        ],
      },
    ],
  },

  // 3. БАЙГАЛИЙН ТОГТОЦ, ЛАНДШАФТААР (ТУСДАА ХУУДАС)
  landscapes: {
    title: 'Байгалийн тогтоц, ландшафт',
    subtitle: 'Монгол орны өвөрмөц уул нуур, элсэн манхан, хавцал тайгын үзэсгэлэн',
    heroImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2000',
    sections: [
      {
        id: 'mountains-lakes-rivers',
        tabLabel: 'Уул, нуур, гол',
        title: 'Уул, нуур, гол мөрөн',
        cards: [
          { title: 'Алтай Таван Богд', imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200', isWide: true },
          { title: 'Сэлэнгэ мөрөн', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
          { title: 'Цагаан суварга', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
        ],
      },
      {
        id: 'gobi-dunes',
        tabLabel: 'Говь, элсэн манхан',
        title: 'Говь, элсэн манхан',
        cards: [
          { title: 'Хонгорын дуут манхан', imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200', isWide: true },
          { title: 'Молцог элс', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800' },
          { title: 'Хэрмэн цав', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800' },
        ],
      },
      {
        id: 'canyons-valleys',
        tabLabel: 'Хавцал, тайга',
        title: 'Хавцал, хөндий, ой, тайга',
        cards: [
          { title: 'Чулуутын хавцал', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200', isWide: true },
          { title: 'Дархадын хотгор', imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800' },
          { title: 'Зүүн тайга', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800' },
        ],
      },
      {
        id: 'glaciers-caves',
        tabLabel: 'Мөсөн гол, агуй',
        title: 'Мөсөн гол, агуй, геологийн тогтоц',
        cards: [
          { title: 'Потанины мөсөн гол', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200', isWide: true },
          { title: 'Даян дээрхийн агуй', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
          { title: 'Гурван цэнхэрийн агуй', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800' },
        ],
      },
    ],
  },

  // 4. ТҮҮХ, СОЁЛЫН ГАЗРУУДААР (ТУСДАА ХУУДАС)
  heritage: {
    title: 'Түүх, соёлын өв газрууд',
    subtitle: 'UNESCO-д бүртгэлтэй дурсгалууд, эртний сүм хийд, хадны зургийн цогцолбор',
    heroImage: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=2000',
    sections: [
      {
        id: 'unesco',
        tabLabel: 'UNESCO өв',
        title: 'UNESCO Дэлхийн өв & Археологийн дурсгал',
        cards: [
          { title: 'Орхоны хөндийн соёлын дурсгал', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200', isWide: true },
          { title: 'Алтай нурууны хадны зургийн цогцолбор', imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800' },
          { title: 'Бурхан Халдун хайрхан', imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800' },
        ],
      },
      {
        id: 'monasteries',
        tabLabel: 'Хийд, сүм',
        title: 'Хийд, сүм & Түүхэн суурин',
        cards: [
          { title: 'Эрдэнэ зуу хийд', imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200', isWide: true },
          { title: 'Амарбаясгалант хийд', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800' },
          { title: 'Төвхөн хийдийн бүтээлийн сүм', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800' },
        ],
      },
      {
        id: 'rock-art',
        tabLabel: 'Хадны зураг',
        title: 'Хадны зураг, хөшөө дурсгал',
        cards: [
          { title: 'Цагаан салаагийн сүг зураг', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200', isWide: true },
          { title: 'Уушгийн өврийн буган хөшөө', imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800' },
          { title: 'Эртний түрэгийн хүн чулуу', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800' },
        ],
      },
    ],
  },

  // 4. АЯЛЛЫН МАРШРУТААР
  routes: {
    title: 'Аяллын шилдэг маршрутууд',
    subtitle: 'Бэлэн боловсруулсан байгалийн тойрог болон түүхэн аяллын замууд',
    heroImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000',
    sections: [
      {
        id: 'gobi-loop',
        tabLabel: 'Говийн тойрог',
        title: 'Говийн сонгодог их тойрог (7-9 хоног)',
        cards: [
          { title: 'Цагаан суварга - Баянзаг - Хонгорын элс', imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200', isWide: true },
          { title: 'Ёлын амны мөсөн хавцал', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
          { title: 'Онгийн хийдийн туурь', imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800' },
        ],
      },
      {
        id: 'orkhon-valley',
        tabLabel: 'Орхоны хөндий',
        title: 'Орхоны хөндий & Хангайн аялал (5-7 хоног)',
        cards: [
          { title: 'Хархорин & Эрдэнэзуу хийд', imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200', isWide: true },
          { title: 'Улаан цутгалан хүрхрээ', imageUrl: 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=800' },
          { title: 'Төвхөн хийдийн бясалгал', imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800' },
        ],
      },
      {
        id: 'khuvsgul',
        tabLabel: 'Хөвсгөлийн зам',
        title: 'Хөвсгөл нуур & Тайгын маршрут (6-8 хоног)',
        cards: [
          { title: 'Хөвсгөл нуурын эрэг & Завиар аялах', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200', isWide: true },
          { title: 'Амарбаясгалант хийдийн зам', imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800' },
          { title: 'Уран тогоо галт уул', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800' },
        ],
      },
      {
        id: 'altai',
        tabLabel: 'Алтайн зам',
        title: 'Баян-Өлгий & Алтайн сүрлэг маршрут (8-10 хоног)',
        cards: [
          { title: 'Алтай Таван Богдын бааз & Trekking', imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200', isWide: true },
          { title: 'Хотон, Даян нуурын тойрог', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
          { title: 'Казак айлын бүргэдийн соёл', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800' },
        ],
      },
    ],
  },
};

export default function DestinationShowcase({
  groupKey,
  subSlug,
}: {
  groupKey: string;
  subSlug?: string;
}) {
  const currentGroup = DESTINATION_DATA[groupKey] || DESTINATION_DATA.region;
  const [activeTab, setActiveTab] = useState<string>(
    subSlug && currentGroup.sections.some((s) => s.id === subSlug)
      ? subSlug
      : currentGroup.sections[0]?.id || ''
  );

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Хэрэв дэд сэдэв сонгогдсон бол тухайн табыг идэвхжүүлээд зөөлөн гүйлгэнэ
    if (subSlug && currentGroup.sections.some((s) => s.id === subSlug)) {
      setActiveTab(subSlug);
      const timer = setTimeout(() => {
        scrollToSection(subSlug);
      }, 150);
      return () => clearTimeout(timer);
    } else {
      // Ногоон үндсэн гарчиг дээр дарахад хамгийн дээд Hero хэсэг рүү бүтэн аваачна
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (currentGroup.sections[0]) {
        setActiveTab(currentGroup.sections[0].id);
      }
    }
  }, [subSlug, groupKey]);

  return (
    <div className="w-full bg-white">
      {/* 1. ТОМ HERO ЗУРАГ БОЛОН ГАРЧИГ */}
      <section className="relative w-full h-[55vh] min-h-[420px] max-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src={currentGroup.heroImage}
          alt={currentGroup.title}
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.7]"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-xs sm:text-sm uppercase tracking-[0.25em] text-white/80 font-bold mb-3 block">
            Зорих газрууд
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-sans font-bold text-white tracking-tight drop-shadow-md mb-4">
            {currentGroup.title}
          </h1>
          <p className="text-sm sm:text-lg text-white/90 font-light max-w-2xl mx-auto drop-shadow-sm">
            {currentGroup.subtitle}
          </p>
        </div>
      </section>

      {/* 2. НААЛДАХ ДЭД ТАБУУД (STICKY PILLS) */}
      <section className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-start lg:justify-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-none">
          {currentGroup.sections.map((sec) => {
            const isSelected = sec.id === activeTab;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-2 border-red-800 text-neutral-900 bg-white shadow-xs font-semibold'
                    : 'border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-black bg-white'
                }`}
              >
                {sec.tabLabel}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. КАРТУУДЫН СҮЛЖЭЭ (SWITZERLAND 3-COLUMN UNIFIED GRID) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-16 space-y-28">
        {currentGroup.sections.map((section) => (
          <section key={section.id} id={section.id} className="pt-6 scroll-mt-24">
            
            {/* Нэгдмэл 3 баганатай сүлжээ: Гарчиг 1-р нүдэнд, картууд доор нь шууд үргэлжилнэ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
              
              {/* Эхний нүд: Гарчиг */}
              <div className="flex flex-col justify-start pr-4 pt-2">
                <h2 className="text-3xl sm:text-4xl font-sans font-bold tracking-tight text-neutral-900 leading-tight">
                  {section.title}
                </h2>
              </div>

              {/* Картууд: Гарчгийн хажуугаар болон яг доогуур нь дүүргэж байрлана */}
              {section.cards.map((card, idx) => (
                <div
                  key={idx}
                  className={`group relative min-h-[300px] h-72 sm:h-80 rounded-2xl overflow-hidden cursor-pointer shadow-xs transition-transform duration-300 hover:-translate-y-1 ${
                    card.isWide ? 'sm:col-span-2' : 'col-span-1'
                  }`}
                >
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight drop-shadow-md">
                      {card.title}
                    </h3>
                  </div>
                </div>
              ))}

            </div>

          </section>
        ))}
      </div>
    </div>
  );
}
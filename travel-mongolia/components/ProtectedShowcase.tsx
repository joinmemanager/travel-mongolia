'use client';

import Image from 'next/image';
import React, { useState } from 'react';

interface CardItem {
  title: string;
  imageUrl: string;
  link?: string;
  isWide?: boolean;
}

interface CategorySection {
  id: string;
  tabLabel: string;
  title: string;
  cards: CardItem[];
}

const PROTECTED_DATA: CategorySection[] = [
  {
    id: 'strictly-protected',
    tabLabel: 'Дархан цаазат газар',
    title: 'Дархан цаазат газар',
    cards: [
      {
        title: 'Богд хан уул',
        imageUrl:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
        isWide: true,
      },
      {
        title: 'Говийн их дархан цаазат газар',
        imageUrl:
          'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800',
      },
      {
        title: 'Отгонтэнгэр уул',
        imageUrl:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
      },
      {
        title: 'Хөх сэрхийн нуруу',
        imageUrl:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800',
      },
      {
        title: 'Дорнод Монголын тал нутаг',
        imageUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800',
      },
      {
        title: 'Увс нуурын ай сав',
        imageUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
      },
    ],
  },
  {
    id: 'national-parks',
    tabLabel: 'Байгалийн цогцолборт газар',
    title: 'Байгалийн цогцолборт газар',
    cards: [
      {
        title: 'Хөвсгөл нуурын БЦГ',
        imageUrl:
          'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
        isWide: true,
      },
      {
        title: 'Горхи-Тэрэлжийн БЦГ',
        imageUrl:
          'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800',
      },
      {
        title: 'Алтай Таван Богд',
        imageUrl:
          'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800',
      },
      {
        title: 'Хустайн нуруу (Тахь)',
        imageUrl:
          'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800',
      },
      {
        title: 'Тэрхийн Цагаан нуур',
        imageUrl:
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800',
      },
      {
        title: 'Говь Гурван Сайхан',
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800',
      },
    ],
  },
  {
    id: 'nature-reserves',
    tabLabel: 'Байгалийн нөөц газар',
    title: 'Байгалийн нөөц газар',
    cards: [
      {
        title: 'Батхаан уул',
        imageUrl:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
        isWide: true,
      },
      {
        title: 'Гүн Галуут',
        imageUrl:
          'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800',
      },
      {
        title: 'Угтам уул',
        imageUrl:
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
      },
    ],
  },
  {
    id: 'monuments',
    tabLabel: 'Байгалийн дурсгалт газар',
    title: 'Байгалийн дурсгалт газар',
    cards: [
      {
        title: 'Хүйсийн найман нуур',
        imageUrl:
          'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1200',
        isWide: true,
      },
      {
        title: 'Ээж хайрхан уул',
        imageUrl:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800',
      },
      {
        title: 'Улаан цутгалан хүрхрээ',
        imageUrl:
          'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=800',
      },
    ],
  },
];

export default function ProtectedShowcase({
  defaultSlug,
}: {
  defaultSlug?: string;
}) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultSlug || PROTECTED_DATA[0].id
  );

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white">
      {/* 1. ТОМ HERO ЗУРАГ */}
      <section className="flex overflow-hidden relative justify-center items-center w-full h-[55vh] min-h-[420px] max-h-[600px]">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"
          alt="Protected Areas"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.7]"
        />
        <div className="relative z-10 px-4 mx-auto max-w-4xl text-center">
          <h1 className="font-sans text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-6xl md:text-7xl">
            Тусгай хамгаалалттай газар
          </h1>
        </div>
      </section>

      {/* 2. НААЛДДАГ ТАБУУД (STICKY PILLS) */}
      <section className="sticky top-0 z-40 w-full bg-white/95 border-b border-neutral-200/80 backdrop-blur-md shadow-xs">
        <div className="flex overflow-x-auto gap-3 justify-center items-center p-4 mx-auto max-w-6xl sm:gap-4 scrollbar-none">
          {PROTECTED_DATA.map((item) => {
            const isSelected = item.id === activeTab;
            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-2 border-red-800 text-neutral-900 bg-white shadow-xs'
                    : 'border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-black bg-white'
                }`}
              >
                {item.tabLabel}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. БҮХ ХЭСГҮҮД НЭГ ХУУДАС ДЭЭР ЦУВРАН БАЙРЛАНА */}
      <div className="py-16 px-6 mx-auto space-y-24 max-w-7xl sm:px-10">
        {PROTECTED_DATA.map((section) => (
          <section key={section.id} id={section.id} className="pt-6">
            <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-12">
              {/* Зүүн талын гарчиг (Switzerland стилээр) */}
              <div className="lg:col-span-3">
                <h2 className="font-sans text-3xl font-bold tracking-tight leading-tight text-neutral-900 sm:text-4xl">
                  {section.title}
                </h2>
              </div>

              {/* Баруун талын картуудын сүлжээ (Grid) */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:col-span-9">
                {section.cards.map((card, idx) => (
                  <div
                    key={idx}
                    className={`group relative h-64 sm:h-72 rounded-2xl overflow-hidden cursor-pointer shadow-xs transition-transform duration-300 hover:-translate-y-1 ${
                      card.isWide ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <Image
                      src={card.imageUrl}
                      alt={card.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute inset-x-5 bottom-5">
                      <h3 className="text-lg font-bold tracking-tight text-white drop-shadow-md sm:text-xl">
                        {card.title}
                      </h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';

import React, { useState, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { PlaceItem } from '@/components/InteractiveExplorerMap';

const InteractiveExplorerMap = dynamic(() => import('@/components/InteractiveExplorerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 text-neutral-400 font-semibold text-sm">
      Газрын зургийг ачааллаж байна...
    </div>
  ),
});

const ALL_PLACES: PlaceItem[] = [
  {
    id: '1',
    name: 'Хонгорын элс',
    nameEn: 'Khongor Sand Dunes',
    category: 'nature',
    aimag: 'Өмнөговь',
    coord: [43.7258, 102.3258],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800',
    description: '180 км үргэлжлэх Дуут манхан, нар жаргах үеийн элсэн долгио.',
  },
  {
    id: '2',
    name: 'Говь Мираж жуулчны бааз',
    nameEn: 'Gobi Mirage Eco Camp',
    category: 'camp',
    aimag: 'Өмнөговь',
    coord: [44.1200, 103.6500],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800',
    description: 'Эко стандартын монгол гэртэй, говийн цэлгэр байгалийг харах бааз.',
  },
  {
    id: '3',
    name: 'Хөвсгөл нуур (Хатгал)',
    nameEn: 'Lake Khuvsgul',
    category: 'nature',
    aimag: 'Хөвсгөл',
    coord: [50.4358, 100.1558],
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
    description: 'Дэлхийн хамгийн цэнгэг нууруудын нэг, усан онгоц ба морин аялал.',
  },
  {
    id: '4',
    name: 'Ашихай эко бааз',
    nameEn: 'Ashihai Camp',
    category: 'camp',
    aimag: 'Хөвсгөл',
    coord: [50.5500, 100.2200],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    description: 'Хөвсгөл далайн эрэг дагуух дээд зэрэглэлийн жуулчны бааз.',
  },
  {
    id: '5',
    name: 'Эрдэнэ зуу хийд',
    nameEn: 'Erdene Zuu Monastery',
    category: 'culture',
    aimag: 'Өвөрхангай',
    coord: [47.1983, 102.8467],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1545648816-43e993510e42?q=80&w=800',
    description: '1586 онд суурийг нь тавьсан Монголын хамгийн эртний Буддын хийд.',
  },
  {
    id: '6',
    name: 'Хархорум Ресторан & Лаунж',
    nameEn: 'Karakorum Restaurant',
    category: 'food',
    aimag: 'Өвөрхангай',
    coord: [47.2050, 102.8350],
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
    description: 'Уламжлалт монгол хоол болон европ хоолны цэс бүхий зоогийн газар.',
  },
  {
    id: '7',
    name: 'Алтай Таван Богд',
    nameEn: 'Altai Tavan Bogd',
    category: 'nature',
    aimag: 'Баян-Өлгий',
    coord: [49.1464, 87.8183],
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
    description: 'Мөнх цаст 4,374 м өндөр Хүйтэн оргил ба Потанины мөсөн гол.',
  },
  {
    id: '8',
    name: 'Бүргэдчин ресто-кафе',
    nameEn: 'Eagle Wings Resto & Cafe',
    category: 'food',
    aimag: 'Баян-Өлгий',
    coord: [48.9708, 89.9622],
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
    description: 'Өлгий хотын төвд байрлах казах уламжлалт цай, бешбармактай газар.',
  },
  {
    id: '9',
    name: 'Улаан цутгалан хүрхрээ',
    nameEn: 'Orkhon Waterfall',
    category: 'nature',
    aimag: 'Өвөрхангай',
    coord: [46.7872, 101.9706],
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=800',
    description: 'Орхон голын хадан хавцлаар 20 метрийн өндрөөс буух их хүрхрээ.',
  },
  {
    id: '10',
    name: 'Цонжин болдог',
    nameEn: 'Chinggis Khaan Statue Complex',
    category: 'culture',
    aimag: 'Төв',
    coord: [47.8114, 107.5317],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800',
    description: '40 метр өндөр Чингис хааны морьт хөшөө бүхий түүхэн цогцолбор.',
  },
  {
    id: '11',
    name: 'Тайхар чулуу',
    nameEn: 'Taikhar Rock',
    category: 'nature',
    aimag: 'Архангай',
    coord: [47.6083, 101.2858],
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
    description: 'Тамга, бичээс бүхий 20 метр өндөр байгалийн боржин цохио.',
  },
  {
    id: '12',
    name: 'Мухартын гол & Элсэн манхан',
    nameEn: 'Mukhart River Sand Dunes',
    category: 'nature',
    aimag: 'Завхан',
    coord: [47.5000, 96.5000],
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800',
    description: 'Өндөр элсэн манхны ёроолоос ундарч урсах хосгүй гол.',
  },
];

// 21 аймаг + Нийслэл хот
const ALL_AIMAGS = [
  'Бүх аймаг',
  'Архангай',
  'Баян-Өлгий',
  'Баянхонгор',
  'Булган',
  'Говь-Алтай',
  'Говьсүмбэр',
  'Дархан-Уул',
  'Дорноговь',
  'Дорнод',
  'Дундговь',
  'Завхан',
  'Орхон',
  'Өвөрхангай',
  'Өмнөговь',
  'Сүхбаатар',
  'Сэлэнгэ',
  'Төв',
  'Увс',
  'Ховд',
  'Хөвсгөл',
  'Хэнтий',
  'Улаанбаатар хот',
];

const CATEGORIES = [
  { id: 'all', label: 'Бүгд', icon: '📍' },
  { id: 'nature', label: 'Байгаль', icon: '🏔' },
  { id: 'camp', label: 'Жуулчны бааз', icon: '⛺' },
  { id: 'food', label: 'Хоол, ресторан', icon: '☕' },
  { id: 'culture', label: 'Түүх, соёл', icon: '🏛' },
];

export default function InteractiveMapExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAimag, setSelectedAimag] = useState<string>('Бүх аймаг');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(ALL_PLACES[0]);

  const aimagScrollRef = useRef<HTMLDivElement>(null);

  const scrollAimag = (direction: 'left' | 'right') => {
    if (aimagScrollRef.current) {
      const amount = direction === 'left' ? -260 : 260;
      aimagScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  // 👇 ЭНД ХУУЛЖ ТАВИНА (Ангиллын гүйлгэх хэсэг):
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const scrollCategory = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const amount = direction === 'left' ? -200 : 200;
      categoryScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const filteredPlaces = useMemo(() => {
    return ALL_PLACES.filter((place) => {
      const matchCat = selectedCategory === 'all' || place.category === selectedCategory;
      const matchAimag =
        selectedAimag === 'Бүх аймаг' ||
        place.aimag === selectedAimag ||
        (selectedAimag === 'Улаанбаатар хот' && place.aimag === 'Улаанбаатар');
      const matchSearch =
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.nameEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchAimag && matchSearch;
    });
  }, [selectedCategory, selectedAimag, searchQuery]);

  return (
    <main className="w-full h-[calc(100vh-64px)] flex flex-col bg-white overflow-hidden font-sans">
      
      {/* 1. ДЭЭД ХЭСЭГ: 21 АЙМГИЙН СУМТАЙ ХЭВТЭЭ ШҮҮЛТҮҮР */}
      <header className="h-14 border-b border-neutral-200 px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0 bg-white z-20">
        
        {/* Зүүн талын гүйлгэх сумтай аймгийн жагсаалт */}
        <div className="flex-1 min-w-0 flex items-center gap-1.5 relative">
          
          {/* Зүүн тийш гүйлгэх товч */}
          <button
            type="button"
            onClick={() => scrollAimag('left')}
            aria-label="Previous Aimags"
            className="shrink-0 w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center text-neutral-600 hover:bg-[#15803d] hover:text-white hover:border-[#15803d] transition-all cursor-pointer z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* 21 аймаг бүрэн багтсан гүйдэг хэсэг */}
          <div
            ref={aimagScrollRef}
            className="flex-1 min-w-0 flex items-center gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-1 px-1"
          >
            {ALL_AIMAGS.map((aimag) => (
              <button
                key={aimag}
                type="button"
                onClick={() => setSelectedAimag(aimag)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  selectedAimag === aimag
                    ? 'bg-[#15803d] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {aimag}
              </button>
            ))}
          </div>

          {/* Баруун тийш гүйлгэх товч */}
          <button
            type="button"
            onClick={() => scrollAimag('right')}
            aria-label="Next Aimags"
            className="shrink-0 w-7 h-7 rounded-full bg-white border border-neutral-200 shadow-2xs flex items-center justify-center text-neutral-600 hover:bg-[#15803d] hover:text-white hover:border-[#15803d] transition-all cursor-pointer z-10"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

        {/* Хайлтын инпут */}
        <div className="relative w-40 sm:w-56 shrink-0">
          <input
            type="text"
            placeholder="Хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-full bg-neutral-100 text-xs font-medium text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#15803d]"
          />
          <svg
            className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      {/* 2. ҮНДСЭН ХЭСЭГ: ЗҮҮН САМБАР + БАРУУН ТОМ LEAFLET ЗУРАГ */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* ЗҮҮН ТАЛЫН ЖАГСААЛТЫН САМБАР */}
        <aside className="w-full md:w-[380px] lg:w-[420px] h-full border-r border-neutral-200 bg-neutral-50/50 flex flex-col shrink-0 z-10">
          
          {/* АНГИЛЛЫН ДЭД ШҮҮЛТҮҮРҮҮД (Сумаар чөлөөтэй гүйнэ, тасрахгүй) */}
          <div className="w-full min-w-0 p-2 border-b border-neutral-200 bg-white">
            <div className="flex items-center gap-1 relative">
              {/* Зүүн тийш гүйлгэх сум */}
              <button
                type="button"
                onClick={() => scrollCategory('left')}
                aria-label="Previous Category"
                className="shrink-0 w-6 h-6 rounded-full bg-neutral-50 hover:bg-[#15803d] text-neutral-500 hover:text-white border border-neutral-200 flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              {/* Ангиллын товчлуурууд */}
              <div
                ref={categoryScrollRef}
                className="flex-1 min-w-0 flex items-center gap-1.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5 px-0.5"
              >
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-100 text-[#15803d]'
                        : 'bg-neutral-100/80 text-neutral-600 hover:bg-neutral-200/70 hover:text-neutral-900'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Баруун тийш гүйлгэх сум */}
              <button
                type="button"
                onClick={() => scrollCategory('right')}
                aria-label="Next Category"
                className="shrink-0 w-6 h-6 rounded-full bg-neutral-50 hover:bg-[#15803d] text-neutral-500 hover:text-white border border-neutral-200 flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Илэрцийн гарчиг */}
          <div className="px-4 py-2 text-[11px] font-bold text-neutral-500 uppercase tracking-wider bg-neutral-100/60 border-b border-neutral-200 flex justify-between">
            <span>Илэрц ({filteredPlaces.length})</span>
            <span className="text-[#15803d] font-extrabold">{selectedAimag}</span>
          </div>

          {/* Газруудын гүйдэг жагсаалт */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2 [scrollbar-width:thin]">
            {filteredPlaces.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              return (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`p-3 rounded-2xl cursor-pointer transition-all flex gap-3 bg-white border ${
                    isSelected
                      ? 'border-[#15803d] ring-2 ring-[#15803d]/20 shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={place.image}
                      alt={place.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-extrabold text-[#15803d] uppercase tracking-wider">
                          {place.aimag}
                        </span>
                        <span className="text-[11px] font-bold text-amber-500 flex items-center">
                          ★ {place.rating}
                        </span>
                      </div>
                      <h3 className="text-sm font-black text-neutral-900 truncate">
                        {place.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                        {place.description}
                      </p>
                    </div>

                    <div className="text-[10px] font-semibold text-neutral-400">
                      {place.nameEn}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredPlaces.length === 0 && (
              <div className="text-center py-12 text-xs text-neutral-400">
                Илэрц олдсонгүй. Шүүлтүүрээ өөрчилж үзнэ үү.
              </div>
            )}
          </div>

          {/* Сонгогдсон газар самбарын доор байнга харагдах */}
          {selectedPlace && (
            <div className="p-3.5 bg-white border-t border-neutral-200 flex items-center justify-between gap-3 shadow-lg">
              <div className="truncate">
                <div className="text-[11px] font-bold text-[#15803d] uppercase">{selectedPlace.aimag}</div>
                <div className="text-xs font-black text-neutral-900 truncate">{selectedPlace.name}</div>
              </div>
              <Link
                href={`/destination/explore/${selectedPlace.id}`}
                className="px-3.5 py-2 rounded-xl bg-[#15803d] text-white text-xs font-bold hover:bg-emerald-800 transition-colors whitespace-nowrap"
              >
                Дэлгэрэнгүй үзэх →
              </Link>
            </div>
          )}
        </aside>

        {/* БАРУУН ТАЛ: БҮТЭН ДЭЛГЭЦИЙН ГАЗРЫН ЗУРАГ */}
        <section className="flex-1 h-full relative bg-neutral-100">
          <InteractiveExplorerMap
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            selectedAimag={selectedAimag}
            onSelectPlace={(place) => setSelectedPlace(place)}
          />
        </section>

      </div>
    </main>
  );
}

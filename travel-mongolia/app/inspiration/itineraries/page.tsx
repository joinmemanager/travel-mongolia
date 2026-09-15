'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface ItineraryItem {
  id: string;
  category: string;
  categoryKey: string;
  days: string;
  title: string;
  subtitle: string;
  image: string;
  route: string;
  aspect: string;
}

const ITINERARY_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: '3-days', label: '3 өдөр' },
  { id: '5-days', label: '5 өдөр' },
  { id: '7-days', label: '7 өдөр' },
  { id: '10-days', label: '10 өдөр' },
  { id: '14-days', label: '14 өдөр' },
  { id: 'themed', label: 'Сэдэвчилсэн' },
];

const ITINERARY_ITEMS: ItineraryItem[] = [
  {
    id: '1',
    categoryKey: '3-days',
    category: 'Богино хугацааны',
    days: '3 Өдөр',
    title: 'Тэрэлж & Хустайн байгалийн цогцолбор',
    subtitle: 'УБ хотоос холгүй зэрлэг тахь үзэж, морь унан амрах төгс амралтын өдрүүд',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Хустай ➔ Тэрэлж ➔ УБ',
    aspect: 'h-[420px]',
  },
  {
    id: '2',
    categoryKey: '5-days',
    category: 'Дунд хугацааны',
    days: '5 Өдөр',
    title: 'Төв Монголын өв соёл & Элсэн тасархай',
    subtitle: 'Эртний Хархорум нийслэл, Эрдэнэзуу хийд, Орхоны хөндийгөөр аялах маршрут',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Элсэн тасархай ➔ Хархорум ➔ Цэнхэрийн рашаан',
    aspect: 'h-[340px]',
  },
  {
    id: '3',
    categoryKey: '7-days',
    category: 'Классик аялал',
    days: '7 Өдөр',
    title: 'Өмнөд Говийн гайхамшигт экспедиц',
    subtitle: 'Цагаан суварга, Ёлын ам, Баянзаг, Хонгорын элсийг бүрэн туулах зам',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Дундговь ➔ Өмнөговь тойрог',
    aspect: 'h-[460px]',
  },
  {
    id: '4',
    categoryKey: '10-days',
    category: 'Их аялал',
    days: '10 Өдөр',
    title: 'Хөвсгөл нуур ба Хангайн нурууны тойрог',
    subtitle: 'Цэнхэр сувд нуураас Тэрхийн цагаан нуур, Тайхар чулуу хүртэлх байгалийн аялал',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Булган ➔ Хөвсгөл ➔ Архангай ➔ УБ',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: '14-days',
    category: 'Бүрэн экспедиц',
    days: '14 Өдөр',
    title: 'Баруун Монголын Алтай Таван Богдын аялал',
    subtitle: 'Мөсөн голууд, Казах айлуудын соёл, Бүргэдийн өлгий нутгаар туулах маршрут',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    route: 'УБ ➔ Баян-Өлгий ➔ Потанины мөсөн гол ➔ Увс нуур',
    aspect: 'h-[440px]',
  },
  {
    id: '6',
    categoryKey: 'themed',
    category: 'Сэдэвчилсэн',
    days: '6 Өдөр',
    title: 'Нүүдэлчдийн хоол & Цагаан идээний замнал',
    subtitle: 'Айраг исгэх, өрөм хайлах, уламжлалт малчин айлуудаар зочлох тусгай аялал',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    route: 'Булган ➔ Өвөрхангай сумдаар',
    aspect: 'h-[330px]',
  },
];

function ItinerariesContent() {
  const searchParams = useSearchParams();
  const daysParam = searchParams.get('days');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (daysParam && ITINERARY_FILTERS.some((f) => f.id === daysParam)) {
      setActiveFilter(daysParam);
    }
  }, [daysParam]);

  const filteredItems =
    activeFilter === 'all'
      ? ITINERARY_ITEMS
      : ITINERARY_ITEMS.filter((item) => item.categoryKey === activeFilter);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32 pt-8">
      {/* Толгой хэсэг */}
      <header className="pt-10 pb-6 px-6 sm:px-12 max-w-7xl mx-auto border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#15803d] uppercase block mb-1">
              07. АЯЛАХ СЭДЭЛ
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
              Маршрутууд
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-normal leading-relaxed">
            Хугацаа, сонирхолдоо нийцүүлэн сонгох боломжтой нарийвчилсан замын зураглал, аяллын маршрутууд.
          </p>
        </div>

        {/* Шүүлтүүр товчлуурууд */}
        <div className="flex flex-wrap gap-2 pt-8">
          {ITINERARY_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-[#15803d] text-white shadow-sm hover:bg-emerald-950'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#15803d] hover:text-[#15803d]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* Masonry Moodboard Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="break-inside-avoid group relative rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end"
            >
              <div className={`relative w-full ${item.aspect} overflow-hidden`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Баруун дээд хоногийн таг */}
                <div className="absolute top-4 right-4 bg-[#15803d] text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-sm">
                  {item.days}
                </div>

                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-neutral-800 shadow-sm">
                  {item.category}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <span className="text-[10px] font-mono text-emerald-300 block mb-1">
                    🧭 {item.route}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold leading-snug group-hover:text-emerald-200 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-200 line-clamp-2 font-light leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-16 px-6 sm:px-12 max-w-7xl mx-auto flex justify-between items-center text-xs">
        <Link
          href="/inspiration/magazine"
          className="font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          ← Эхлэл рүү буцах (01. Magazine)
        </Link>
        <span className="text-neutral-400">
          Нийт 7 хэсэг бүрэн хийгдэж дууслаа
        </span>
      </div>
    </main>
  );
}

export default function ItinerariesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9] text-neutral-700 p-10">Уншиж байна...</div>}>
      <ItinerariesContent />
    </Suspense>
  );
}
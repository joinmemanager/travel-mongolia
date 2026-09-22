'use client';

import Link from 'next/link';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';


interface StyleItem {
  id: string;
  category: string;
  categoryKey: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  aspect: string; // Masonry жигд бус өндөр
}

const STYLE_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'culture', label: 'Culture' },
  { id: 'family', label: 'Family' },
  { id: 'luxury', label: 'Luxury' },
  { id: 'slow-travel', label: 'Slow Travel' },
  { id: 'photography', label: 'Photography' },
  { id: 'sustainable', label: 'Sustainable' },
];

const STYLE_ITEMS: StyleItem[] = [
  {
    id: '1',
    categoryKey: 'adventure',
    category: 'Adventure',
    title: 'Алтайн нурууны мөсөн оргил руу авирах нь',
    subtitle: 'Аглаг байгалийн сорилт, адал явдалт аялагчдад зориулав',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'Extreme Trekking',
    aspect: 'h-[440px]',
  },
  {
    id: '2',
    categoryKey: 'culture',
    category: 'Culture',
    title: 'Нүүдэлчдийн гэр барьж, өв соёлд суралцах хором',
    subtitle: 'Монгол өв уламжлалтай биечлэн танилцах боломж',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    tag: 'Heritage & Roots',
    aspect: 'h-[320px]',
  },
  {
    id: '3',
    categoryKey: 'luxury',
    category: 'Luxury',
    title: 'Говийн хязгаар дахь 5 одтой Glamping амралт',
    subtitle: 'Зэрлэг байгаль дундах дээд зэрэглэлийн тав тух',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tag: 'Premium Wilderness',
    aspect: 'h-[400px]',
  },
  {
    id: '4',
    categoryKey: 'photography',
    category: 'Photography',
    title: 'Тэнгэрийн заадас ба Хонгорын элсний нар жаргалт',
    subtitle: 'Гэрэл зургийн хальснаа буух хамгийн ховор агшнууд',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    tag: 'Golden Hour & Stars',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: 'slow-travel',
    category: 'Slow Travel',
    title: 'Орхоны хөндийгөөр морин тэргээр аниргүй аялах',
    subtitle: 'Амьдралын хурдыг сааруулж, байгальтайгаа нэгдэхүй',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    tag: 'Mindful Travel',
    aspect: 'h-[460px]',
  },
  {
    id: '6',
    categoryKey: 'family',
    category: 'Family',
    title: 'Хөвсгөл нуурын эрэг дээрх гэр бүлийн намуун аялал',
    subtitle: 'Бүх насныханд зориулсан аюулгүй, тав тухтай амралт',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80',
    tag: 'Kid Friendly',
    aspect: 'h-[340px]',
  },
  {
    id: '7',
    categoryKey: 'sustainable',
    category: 'Sustainable',
    title: 'Эко аялал: Хог хаягдалгүй, ул мөргүй зорчих хэв маяг',
    subtitle: 'Байгаль дэлхийгээ хамгаалж, орон нутгийг дэмжих нь',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    tag: 'Zero Waste Trip',
    aspect: 'h-[380px]',
  },
  {
    id: '8',
    categoryKey: 'adventure',
    category: 'Adventure',
    title: 'Баянзагийн шавар цаваар хийх мотоциклтэй аялал',
    subtitle: 'Тал хээрийн салхи сөрөн эрх чөлөөг мэдрэх өдрүүд',
    image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
    tag: 'Off-road Expedition',
    aspect: 'h-[420px]',
  },
];

function StylesContent() {
  const searchParams = useSearchParams();
  const styleParam = searchParams.get('style');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (styleParam && STYLE_FILTERS.some((f) => f.id === styleParam)) {
      setActiveFilter(styleParam);
    }
  }, [styleParam]);

  const filteredItems =
    activeFilter === 'all'
      ? STYLE_ITEMS
      : STYLE_ITEMS.filter((item) => item.categoryKey === activeFilter);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32 pt-8">
      {/* Толгой хэсэг */}
      <header className="pt-10 pb-6 px-6 sm:px-12 max-w-7xl mx-auto border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#15803d] uppercase block mb-1">
              03. АЯЛАХ СЭДЭЛ
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
              Хэв маягаар
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-normal leading-relaxed">
            Аялал бүр өөрийн гэсэн онцлогтой. Таны дотоод сэтгэл ямар аяллыг хүсэж буйд тохирох төгс хэв маягийг эндээс олоорой.
          </p>
        </div>

        {/* Шүүлтүүр товчлуурууд */}
        <div className="flex flex-wrap gap-2 pt-8">
          {STYLE_FILTERS.map((filter) => (
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Баруун дээд таг */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-neutral-800 shadow-sm">
                  {item.tag}
                </div>

                {/* Доод мэдээлэл */}
                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300 block mb-1">
                    {item.category}
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

      {/* Дараагийн хуудас руу шилжих товч */}
      <div className="mt-16 px-6 sm:px-12 max-w-7xl mx-auto flex justify-end">
        <Link
          href="/inspiration/hidden"
          className="text-xs font-semibold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1"
        >
          Дараах: 04. Hidden Mongolia →
        </Link>
      </div>
    </main>
  );
}

export default function StylesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9] text-neutral-700 p-10">Уншиж байна...</div>}>
      <StylesContent />
    </Suspense>
  );
}

'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';


interface HiddenItem {
  id: string;
  category: string;
  categoryKey: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  aspect: string;
}

const HIDDEN_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: 'nature', label: 'Байгалийн содон' },
  { id: 'heritage', label: 'Эртний туурь, түүх' },
  { id: 'isolated', label: 'Хөндөгдөөгүй аглаг' },
];

const HIDDEN_ITEMS: HiddenItem[] = [
  {
    id: '1',
    categoryKey: 'nature',
    category: 'Байгалийн содон',
    title: 'Хэрмэн цавын улаан хавцал',
    subtitle: 'Өмнөговь аймаг • Сая сая жилийн өмнөх далайн ёроол',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-01 • 1,120м',
    aspect: 'h-[440px]',
  },
  {
    id: '2',
    categoryKey: 'isolated',
    category: 'Хөндөгдөөгүй аглаг',
    title: 'Сангийн далай нуурын шувуудын чуулган',
    subtitle: 'Хөвсгөл аймаг • Жуулчдын хөл хүрээгүй аниргүй булаг',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-02 • 1,488м',
    aspect: 'h-[320px]',
  },
  {
    id: '3',
    categoryKey: 'heritage',
    category: 'Эртний туурь, түүх',
    title: 'Хамарын хийдийн 108 бясалгалын агуй',
    subtitle: 'Дорноговь аймаг • Данзанравжаа хутагтын даяаны орон',
    image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-03 • 960м',
    aspect: 'h-[400px]',
  },
  {
    id: '4',
    categoryKey: 'isolated',
    category: 'Хөндөгдөөгүй аглаг',
    title: 'Баян-Айрагийн хавцал ба хадан хүрхрээ',
    subtitle: 'Завхан аймаг • Газрын зурагт тэмдэглэгдээгүй нууц рашаан',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-04 • 2,150м',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: 'heritage',
    category: 'Эртний туурь, түүх',
    title: 'Суварга хайрханы нууц сүмбэр',
    subtitle: 'Архангай аймаг • Эрт дээр үеэс тахиж ирсэн онгон хайрхан',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-05 • 3,117м',
    aspect: 'h-[460px]',
  },
  {
    id: '6',
    categoryKey: 'nature',
    category: 'Байгалийн содон',
    title: 'Нэмэгтийн хөндийн үлэг гүрвэлийн оршуулга',
    subtitle: 'Өмнөговь аймаг • Дэлхийд алдартай палеонтологийн өлгий',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    tag: 'EXP-06 • 1,350м',
    aspect: 'h-[340px]',
  },
];

function HiddenContent() {
  const searchParams = useSearchParams();
  const catParam = searchParams.get('cat');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (catParam && HIDDEN_FILTERS.some((f) => f.id === catParam)) {
      setActiveFilter(catParam);
    }
  }, [catParam]);

  const filteredItems =
    activeFilter === 'all'
      ? HIDDEN_ITEMS
      : HIDDEN_ITEMS.filter((item) => item.categoryKey === activeFilter);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32 pt-8">
      {/* Толгой хэсэг */}
      <header className="pt-10 pb-6 px-6 sm:px-12 max-w-7xl mx-auto border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#15803d] uppercase block mb-1">
              04. АЯЛАХ СЭДЭЛ
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
              Hidden Mongolia
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-normal leading-relaxed">
            Жуулчдын хөлд талхлагдаагүй онгон дагшин газрууд болон газрын зураг дээр тэмдэглэгдээгүй нууц өнцгүүд.
          </p>
        </div>

        {/* Шүүлтүүр товчлуурууд */}
        <div className="flex flex-wrap gap-2 pt-8">
          {HIDDEN_FILTERS.map((filter) => (
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

                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-neutral-800 shadow-sm font-mono">
                  {item.tag}
                </div>

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

      <div className="mt-16 px-6 sm:px-12 max-w-7xl mx-auto flex justify-end">
        <Link
          href="/inspiration/stories"
          className="text-xs font-semibold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1"
        >
          Дараах: 05. Local Stories →
        </Link>
      </div>
    </main>
  );
}

export default function HiddenPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9] text-neutral-700 p-10">Уншиж байна...</div>}>
      <HiddenContent />
    </Suspense>
  );
}

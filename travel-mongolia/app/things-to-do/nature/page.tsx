'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { NATURE_CATEGORIES, NATURE_SPOTS } from '@/lib/natureData';

export default function NaturePage() {
  const searchParams = useSearchParams();
  const catQuery = searchParams.get('cat');
  const [activeTab, setActiveTab] = useState('all');

  // Хэрэв Navbar дээрээс "Од харах" эсвэл "Нуур, гол" дээр дарж орж ирвэл тэр таб руу автоматаар шилжүүлнэ
  useEffect(() => {
    if (catQuery) {
      setActiveTab(catQuery);
    }
  }, [catQuery]);

  const filteredSpots = activeTab === 'all'
    ? NATURE_SPOTS
    : NATURE_SPOTS.filter(spot => spot.categoryKey === activeTab);

  return (
    // ... Үлдсэн хэсэг нь яг хэвээрээ байна
    <main className="min-h-screen bg-[#fafafa] pb-24">
      {/* Header Banner */}
      <section className="relative bg-neutral-900 text-white py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80"
            alt="Nature Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
            01. ҮЗЭХ, ХИЙХ ЗҮЙЛС
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mt-3 mb-4">
            Байгальд аялах
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl font-light leading-relaxed">
            Хязгааргүй үргэлжлэх уудам тал нутаг, онгон дагшин тайга, сүрлэг Алтайн оргилууд болон Тэнгэрийн заадлыг тольдох элсэн манхнууд.
          </p>
        </div>
      </section>

      {/* 9 Дэд төрлийн шүүлтүүр */}
     <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar py-4 flex gap-2">
          {NATURE_CATEGORIES.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Аяллын газруудын Grid карт */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-10">
        <div className="flex justify-between items-end mb-6">
          <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
            Нийт {filteredSpots.length} газар олдлоо
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSpots.map(spot => (
            <div
              key={spot.id}
              className="group bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-neutral-800">
                  {spot.category}
                </span>
                <span className="absolute bottom-3 right-3 bg-neutral-950/70 text-white px-2.5 py-1 rounded-md text-[11px]">
                  {spot.season}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide">
                    {spot.location} • {spot.region}
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 mt-1 mb-2 group-hover:text-emerald-700 transition-colors">
                    {spot.title}
                  </h3>
                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Дэлгэрэнгүй үзэх <span>→</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
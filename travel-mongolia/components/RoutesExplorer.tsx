'use client';

import { liveHref } from '@/lib/navigation';

import Link from 'next/link';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import ImageHero from '@/components/templates/ImageHero';

const RealRouteMap = dynamic(() => import('@/components/RealRouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] flex items-center justify-center bg-neutral-100 rounded-2xl text-neutral-500 font-semibold text-sm">
      Интерактив газрын зургийг ачааллаж байна...
    </div>
  ),
});

import type { RelatedItem } from '@/lib/related';
import { ROUTES_LIST, type RouteItem } from '@/lib/routesData';

import { ContentContext } from './Analytics';
import RelatedBookings from './templates/RelatedBookings';

// /destination/routes-ийн интерактив хэсэг (газрын зураг, маршрутын сонголт).
// relatedByRoute: маршрут бүрийн зогсоолуудад ойр нутгийн туршлага, үйлчилгээ (server-ээс).
export default function RoutesExplorer({
  relatedByRoute,
}: {
  relatedByRoute: Record<string, RelatedItem[]>;
}) {
  const [selectedRoute, setSelectedRoute] = useState<RouteItem>(ROUTES_LIST[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-[#f8fafc] text-neutral-900 pb-20 font-sans selection:bg-[#15803d] selection:text-white">
      <ContentContext value={{ content_type: 'route', content_id: selectedRoute.id }} />
      
     {/* 1. HERO ТОМ ЗУРАГТАЙ ТОЛГОЙ ХЭСЭГ */}
      <ImageHero
        image={{
          src: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2400',
          alt: 'Аяллын маршрут, замаар',
        }}
        kicker="06. Scenic Routes & Travel Corridors"
        title="Аяллын маршрут, замаар"
        intro="Жинхэнэ хиймэл дагуул, авто замын зураг дээр маршрутаа сонгож, хоорондын зай болон зогсоолуудаа бодитоор төлөвлөөрэй."
      />

      {/* 2. НАВИГАЦИ: СУМАН ТОХИРГООТОЙ, ТАСРАХГҮЙ ЦЭВЭРХЭН ХУВИЛБАР */}
      <div className="sticky top-(--nav-h) z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 px-4 sm:px-8 py-3">
          {/* Зүүн тийш гүйлгэх сум */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous"
            className="shrink-0 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Голын гүйдэг товчлуурууд */}
          <div
            ref={scrollRef}
            className="flex-1 flex items-center gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-6"
          >
            {ROUTES_LIST.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedRoute.id === route.id
                    ? 'bg-[#15803d] text-white shadow-md shadow-emerald-700/25 scale-102'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {route.name}
              </button>
            ))}
          </div>

          {/* Баруун тийш гүйлгэх сум */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next"
            className="shrink-0 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. ЖИНХЭНЭ ИНТЕРАКТИВ ГАЗРЫН ЗУРАГ БА МЭДЭЭЛЛИЙН САМБАР */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="relative w-full bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* ЗҮҮН ТАЛ: ТУХАЙН МАРШРУТЫН МЭДЭЭЛЛИЙН САМБАР */}
          <div className="w-full lg:w-[420px] bg-white border-b lg:border-b-0 lg:border-r border-neutral-200 shrink-0 p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden shadow-xs">
                <Image
                  src={selectedRoute.image}
                  alt={selectedRoute.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                    {selectedRoute.subtitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">{selectedRoute.name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Хугацаа:</span>
                  <span className="font-extrabold text-neutral-900 text-sm">⏱ {selectedRoute.duration}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Замын урт:</span>
                  <span className="font-extrabold text-[#15803d] text-sm">📍 {selectedRoute.distance}</span>
                </div>
                {/* Route ESG block (баримт бичгийн 7-р хэсэг): улирал, зам/тээвэр */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Улирал:</span>
                  <span className="font-extrabold text-neutral-900 text-sm">{selectedRoute.season}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Зам:</span>
                  <span className="font-extrabold text-neutral-900 text-sm">{selectedRoute.road}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                {selectedRoute.desc}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                  Замын зогсоолууд ({selectedRoute.stops.length}):
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {selectedRoute.stops.map((stop, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2 rounded-xl bg-neutral-50 hover:bg-emerald-50/60 border border-neutral-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-bold text-neutral-800">{stop.name}</span>
                      </div>
                      <span className="text-neutral-400 text-[10px] truncate max-w-[140px]">{stop.highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {liveHref(selectedRoute.moreHref) && (
            <Link
              href={liveHref(selectedRoute.moreHref)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#15803d] hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Дэлгэрэнгүй маршрут, бааз & зочид буудал</span>
              <span>→</span>
            </Link>
            )}
          </div>

          {/* БАРУУН ТАЛ: БОДИТ LEAFLET ИНТЕРАКТИВ ГАЗРЫН ЗУРАГ */}
          <div className="flex-1 bg-slate-100 relative min-h-[550px] lg:min-h-[640px]">
            <RealRouteMap route={selectedRoute} />
          </div>

        </div>
      </div>

      {/* Холбоотой аялал, туршлага, үйлчилгээ: сонгосон маршрутын зогсоолуудад ойр (Route ESG block) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-16">
        <RelatedBookings
          items={relatedByRoute[selectedRoute.id] || []}
          campaign="route"
          contentId={selectedRoute.id}
        />
      </div>
    </main>
  );
}

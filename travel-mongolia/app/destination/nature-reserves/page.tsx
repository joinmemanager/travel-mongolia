'use client';

import React from 'react';
import Image from 'next/image';

export default function NatureReservesPage() {
  return (
    <main className="w-full bg-white text-neutral-900 pb-40 font-sans selection:bg-[#15803d] selection:text-white">
      
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2400"
          alt="Байгалийн нөөц газар"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.58]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            Nature Reserves
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Байгалийн нөөц газар
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Байгалийн тодорхой баялаг, амьтан, ургамлын төрөл зүйлийг хамгаалан нөхөн сэргээх түшиц нутгууд
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-24 space-y-24">
        <div className="border-b border-neutral-200 pb-5">
          <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">Ангилал & Ач холбогдол</span>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Байгалийн нөөц газрын 4 гол төрөл
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-3xl block mb-2">🌿</span>
            <h3 className="text-2xl font-bold text-neutral-900">Экологийн нөөц газар</h3>
            <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              Байгалийн тодорхой бүс, экосистемийн тэнцвэрт байдлыг хэвээр нь хадгалахад чиглэгддэг.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-3xl block mb-2">🦌</span>
            <h3 className="text-2xl font-bold text-neutral-900">Биологийн нөөц газар</h3>
            <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              Ховор амьтан, ургамлын тархац нутаг, үржил, идээшил бүсийг тусгайлан хамгаалдаг.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-3xl block mb-2">⛰️</span>
            <h3 className="text-2xl font-bold text-neutral-900">Геологийн нөөц газар</h3>
            <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              Дэлхийн царцдасын өвөрмөц тогтоц, эртний палеонтологийн олдвор бүхий ховор газрууд.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-3">
            <span className="text-3xl block mb-2">💧</span>
            <h3 className="text-2xl font-bold text-neutral-900">Усны нөөц газар</h3>
            <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              Мөрөн гол, нуур, рашаан усны эх үүсвэрийг бохирдож хомстохоос сэргийлэн хамгаалдаг.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

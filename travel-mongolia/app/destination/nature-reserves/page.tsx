'use client';

import React from 'react';

import CategoryDirectory from '@/components/templates/CategoryDirectory';
import Image from 'next/image';

export default function NatureReservesPage() {
  return (
    <CategoryDirectory
      hero={{
        src: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2400',
        alt: 'Байгалийн нөөц газар',
      }}
      kicker="Nature Reserves"
      title="Байгалийн нөөц газар"
      intro="Байгалийн тодорхой баялаг, амьтан, ургамлын төрөл зүйлийг хамгаалан нөхөн сэргээх түшиц нутгууд"
    >
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
    </CategoryDirectory>
  );
}

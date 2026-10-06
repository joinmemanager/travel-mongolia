'use client';

import React from 'react';

import CategoryDirectory from '@/components/templates/CategoryDirectory';
import Image from 'next/image';

export default function NaturalMonumentsPage() {
  return (
    <CategoryDirectory
      hero={{
        src: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=2400',
        alt: 'Байгалийн дурсгалт газар',
      }}
      kicker="Natural Monuments"
      title="Байгалийн дурсгалт газар"
      intro="Байгалийн хосгүй өвөрмөц тогтоц, сонин хачин хад чулуу, хүрхрээ, үлэг гүрвэлийн өлгий газрууд"
    >
        <div className="border-b border-neutral-200 pb-5">
          <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">Үзэсгэлэнт дурсгалууд</span>
          <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
            Монголын онцлох байгалийн дурсгалууд
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="border border-neutral-200 rounded-3xl p-8 sm:p-10 bg-white shadow-xs space-y-4">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block">Говь</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">Баянзаг & Цагаан суварга</h3>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
              Үлэг гүрвэлийн анхны өндөг олдсон улаан цав болон далайн ёроолын хурдас шавар шохойн цагаан цав цамхагууд.
            </p>
          </div>

          <div className="border border-neutral-200 p-8 sm:p-10 rounded-3xl bg-white shadow-xs space-y-4">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block">Хангай</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900">Улаан цутгалан хүрхрээ & Хорго</h3>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
              Орхоны хөндийн галт уулын базальт чулуун дундуур урсах хүрхрээ болон сөнөсөн галт уулын тогоо.
            </p>
          </div>
        </div>
    </CategoryDirectory>
  );
}

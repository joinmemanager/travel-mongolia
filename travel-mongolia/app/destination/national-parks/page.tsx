'use client';

import React from 'react';

import CategoryDirectory from '@/components/templates/CategoryDirectory';
import Image from 'next/image';

export default function NationalParksPage() {
  return (
    <CategoryDirectory
      hero={{
        src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2400',
        alt: 'Байгалийн цогцолборт газар',
      }}
      kicker="National Parks"
      title="Байгалийн цогцолборт газар"
      intro="Байгалийн гоо үзэсгэлэн, эко аялал жуулчлал, амралт зугаалга хосолсон Монголын шилдэг үндэсний паркууд"
      nav={[
        { id: 'about', label: 'Цогцолборт газрын тухай' },
        { id: 'terelj', label: 'Горхи-Тэрэлж' },
        { id: 'khuvsgul', label: 'Хөвсгөл нуур' },
        { id: 'altai', label: 'Алтай Таван Богд' },
      ]}
    >

        {/* 1. ТОЙМ */}
        <section id="about" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">01. Аялал ба байгаль</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Үндэсний цогцолборт газруудын зорилго
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              <p>
                Байгалийн цогцолборт газар нь байгалийн унаган төрх, түүх, соёлын дурсгалыг хамгаалахын зэрэгцээ хүмүүсийн танин мэдэхүй, аялал жуулчлал, амралтад зориулан зохион байгуулагдсан тусгай хамгаалалттай нутаг юм.
              </p>
              <p>
                Монгол Улсад нийт 30 гаруй байгалийн цогцолборт газар байдаг бөгөөд жуулчид морин аялал хийх, ууланд авирах, майхантай аялах, нутгийн иргэдийн ахуйтай танилцах бүрэн боломжтой.
              </p>
            </div>
            <div className="lg:col-span-5 relative h-96 sm:h-[460px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200"
                alt="Байгалийн цогцолборт газар"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2. ПАРКУУД ЖАГСААЛТ */}
        <section id="terelj" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">02. Онцлох цогцолборууд</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Хамгийн их зорьдог байгалийн паркууд
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-neutral-200 rounded-3xl overflow-hidden bg-white shadow-xs">
              <div className="relative h-64">
                <Image src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800" alt="Тэрэлж" fill unoptimized className="object-cover" />
              </div>
              <div className="p-8 space-y-3">
                <h4 className="text-2xl font-bold text-neutral-900">Горхи-Тэрэлж БЦГ</h4>
                <p className="text-base text-neutral-600 leading-relaxed">Мэлхий хад, Арьяабал бясалгалын сүм, хадат уулс, амралтын баазуудын төв.</p>
              </div>
            </div>

            <div id="khuvsgul" className="border border-neutral-200 rounded-3xl overflow-hidden bg-white shadow-xs scroll-mt-28">
              <div className="relative h-64">
                <Image src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800" alt="Хөвсгөл нуур" fill unoptimized className="object-cover" />
              </div>
              <div className="p-8 space-y-3">
                <h4 className="text-2xl font-bold text-neutral-900">Хөвсгөл нуурын БЦГ</h4>
                <p className="text-base text-neutral-600 leading-relaxed">Дэлхийн хамгийн цэнгэг нууруудын нэг, тайгын соёл, цаатан ардын нутаг.</p>
              </div>
            </div>

            <div id="altai" className="border border-neutral-200 rounded-3xl overflow-hidden bg-white shadow-xs scroll-mt-28">
              <div className="relative h-64">
                <Image src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800" alt="Алтай Таван Богд" fill unoptimized className="object-cover" />
              </div>
              <div className="p-8 space-y-3">
                <h4 className="text-2xl font-bold text-neutral-900">Алтай Таван Богд</h4>
                <p className="text-base text-neutral-600 leading-relaxed">Монголын дээвэр мөнх цаст оргилууд, Потанины мөсөн гол, хадны сүг зураг.</p>
              </div>
            </div>
          </div>
        </section>

    </CategoryDirectory>
  );
}

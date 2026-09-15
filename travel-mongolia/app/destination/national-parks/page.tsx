'use client';

import React from 'react';
import Image from 'next/image';

export default function NationalParksPage() {
  return (
    <main className="w-full bg-white text-neutral-900 pb-40 font-sans selection:bg-[#15803d] selection:text-white">
      
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2400"
          alt="Байгалийн цогцолборт газар"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.58]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            National Parks
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Байгалийн цогцолборт газар
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Байгалийн гоо үзэсгэлэн, эко аялал жуулчлал, амралт зугаалга хосолсон Монголын шилдэг үндэсний паркууд
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-start sm:justify-center gap-3 overflow-x-auto scrollbar-none text-sm font-bold">
          <a href="#about" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Цогцолборт газрын тухай</a>
          <a href="#terelj" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Горхи-Тэрэлж</a>
          <a href="#khuvsgul" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Хөвсгөл нуур</a>
          <a href="#altai" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Алтай Таван Богд</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-24 space-y-36">

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

      </div>
    </main>
  );
}
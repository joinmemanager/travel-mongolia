'use client';

import React from 'react';
import Image from 'next/image';


export default function StrictlyProtectedPage() {
  return (
    <main className="w-full bg-white text-neutral-900 pb-40 font-sans selection:bg-[#15803d] selection:text-white">
      
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2400"
          alt="Дархан цаазат газар"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.58]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            Special Protected Areas
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Дархан цаазат газар
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Унаган төрх, онгон дагшин байдлыг хадгалах хамгийн өндөр зэрэглэлийн хамгаалалттай түүхт бүс нутгууд
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-start sm:justify-center gap-3 overflow-x-auto scrollbar-none text-sm font-bold">
          <a href="#about" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Дархан цаазын тухай</a>
          <a href="#bogdkhan" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Богдхан уул</a>
          <a href="#gobi" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Их говийн ДЦГ</a>
          <a href="#khokh-serkh" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Хөх сэрхийн нуруу</a>
          <a href="#rules" className="px-5 py-2.5 rounded-full bg-[#15803d] text-white whitespace-nowrap shadow-xs">Мөрдөх журам</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-24 space-y-36">

        {/* 1. ДАРХАН ЦААЗЫН ТУХАЙ */}
        <section id="about" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">01. Хамгаалалтын статус</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Дархан цааз ба онгон байгаль
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              <p>
                Дархан цаазат газар нь байгалийн унаган төрхийг хадгалах, экологийн тэнцвэрийг хамгаалах, шинжлэх ухааны судалгаа шинжилгээ хийх зориулалт бүхий тусгай хамгаалалтын хамгийн хатуу дэглэмтэй бүс юм.
              </p>
              <p>
                Эдгээр газруудад байгалийн нөөц ашиглах, газар хагалах, мод бэлтгэх, ан агнах, үйлдвэрлэлийн үйл ажиллагаа явуулахыг хуулиар хатуу хориглодог бөгөөд аялагч зөвхөн тогтоосон зөвшөөрөгдсөн маршрутаар нэвтрэх эрхтэй байдаг.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-500 block font-bold uppercase tracking-wider mb-1">Нийт талбай</span>
                  <strong className="text-lg sm:text-xl text-neutral-900 font-bold block">14+ сая га газар</strong>
                </div>
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-500 block font-bold uppercase tracking-wider mb-1">Тусгай хамгаалалт</span>
                  <strong className="text-lg sm:text-xl text-neutral-900 font-bold block">Дэлхийн анхны дархан цааз</strong>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative h-96 sm:h-[460px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200"
                alt="Дархан цааз"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2. БОГДХАН УУЛ */}
        <section id="bogdkhan" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">02. Түүхэн өв</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Богдхан уулын дархан цаазат газар
            </h2>
          </div>

          <div className="bg-neutral-50 p-8 sm:p-14 rounded-3xl border border-neutral-200 space-y-6">
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#15803d] block">
              1778 онд албан ёсоор дархалсан дэлхийн анхны дархан цаазат уул
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
              АНУ-ын Йеллоустоноос 94 жилийн өмнө хамгаалагдсан түүхт хайрхан
            </h3>
            <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              Богдхан уул нь нийслэл Улаанбаатар хотын урд сүндэрлэх бөгөөд шилмүүст ой, хад асга, олон төрлийн ховор ан амьтан, жигүүртэн шувуудын өлгий юм. Энэ нь төрийн тахилгат хайрхан бөгөөд аялагчдад зориулсан явган аяллын тохилог жимтэй.
            </p>
          </div>
        </section>

        {/* 3. ИХ ГОВИЙН ДЦГ */}
        <section id="gobi" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">03. Говийн экосистем</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Их говийн дархан цаазат газар
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-neutral-200 p-8 sm:p-10 rounded-3xl bg-white shadow-xs space-y-4">
              <span className="text-sm uppercase tracking-widest text-[#15803d] font-black block">А хэсэг</span>
              <h4 className="text-2xl font-bold text-neutral-900">Мазаалай ба Хавтгай</h4>
              <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                Дэлхийд цор ганц говьд амьдардаг мазаалай баавгай болон зэрлэг тэмээ хавтгайн хамгийн сүүлчийн уугуул нутаг юм.
              </p>
            </div>
            <div className="border border-neutral-200 p-8 sm:p-10 rounded-3xl bg-white shadow-xs space-y-4">
              <span className="text-sm uppercase tracking-widest text-neutral-400 font-black block">Б хэсэг</span>
              <h4 className="text-2xl font-bold text-neutral-900">Хулан ба Тахь</h4>
              <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                Зүүн гарын говийн уудам хөндийд зэрлэг адуу тахь, хулан, хар сүүлт зэрэг нэн ховор хөхтөн амьтад чөлөөтэй бэлчээрлэдэг.
              </p>
            </div>
          </div>
        </section>

        {/* 4. МӨРДӨХ ЖУРАМ */}
        <section id="rules" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">04. Журам ба горим</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Аялагчдын анхаарах зүйлс
            </h2>
          </div>

          <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-14 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400">
              Дархан цаазат бүсэд нэвтрэхэд тавигдах шаардлага
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-base sm:text-lg">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl block mb-2">🎫</span>
                <strong className="text-white block mb-2">Зөвшөөрөл авах</strong>
                <p className="text-neutral-400 text-sm">Тусгай хамгаалалтын захиргаанаас зохих нэвтрэх зөвшөөрлийг урьдчилан авна.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl block mb-2">🚯</span>
                <strong className="text-white block mb-2">Хог үлдээхгүй байх</strong>
                <p className="text-neutral-400 text-sm">Байгалийн унаган тогтоцыг хамгаалж, авч очсон бүх зүйлээ буцааж авч ирнэ.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <span className="text-2xl block mb-2">🔇</span>
                <strong className="text-white block mb-2">Чимээ аниргүй байх</strong>
                <p className="text-neutral-400 text-sm">Зэрлэг ан амьтдын амгалан байдлыг алдагдуулахгүй, чанга дуу чимээ гаргахгүй.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

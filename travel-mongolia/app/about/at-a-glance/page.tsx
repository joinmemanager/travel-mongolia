'use client';

import React from 'react';
import Image from 'next/image';

export default function AtAGlancePage() {
  return (
    <main className="w-full bg-white text-neutral-900 pb-40 font-sans selection:bg-[#15803d] selection:text-white">
      
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2400"
          alt="Монгол орныг товчхон"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.58]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            01. Mongolia at a Glance
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Монгол орныг товчхон
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Хөх тэнгэрийн орон, эртний нүүдэлчдийн өлгий нутгийн газар зүй, хүн ам, төрийн бэлгэдэл ба гол тоон баримтууд
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-start sm:justify-center gap-3 overflow-x-auto scrollbar-none text-sm font-bold">
          <a href="#overview" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Үндсэн мэдээлэл</a>
          <a href="#population" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Хүн ам & Нийслэл</a>
          <a href="#geography" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Газар нутаг</a>
          <a href="#symbols" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Төрийн бэлгэдэл</a>
          <a href="#etymology" className="px-5 py-2.5 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap">Монгол нэрийн учир</a>
          <a href="#facts" className="px-5 py-2.5 rounded-full bg-[#15803d] text-white whitespace-nowrap shadow-xs">Онцлог тоо баримтууд</a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-24 space-y-36">

        {/* 1. ҮНДСЭН МЭДЭЭЛЭЛ */}
        <section id="overview" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">01. Ерөнхий тойм</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Монгол Улсын тухай үндсэн мэдээлэл
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              <p>
                Монгол Улс нь Төв Азийн өндөрлөгт, ОХУ болон БНХАУ гэсэн хоёр их гүрний дунд оршдог, далайд гарцгүй бүрэн эрхт тусгаар улс юм.
              </p>
              <p>
                Парламентын засаглалтай ардчилсан улс бөгөөд олон намын тогтолцоо, хүний эрх, чөлөөт эдийн засгийг эрхэмлэн хөгжиж байна. Мянга мянган жилийн нүүдлийн мал аж ахуйн соёлоо орчин үеийн соёлтой хослуулан авч үлдсэн дэлхийн ховорхон түшиц нутаг юм.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-500 block font-bold uppercase tracking-wider mb-1">Төрийн байгууламж</span>
                  <strong className="text-lg sm:text-xl text-neutral-900 font-bold block">Парламентын засаглал</strong>
                </div>
                <div className="bg-neutral-50 p-6 rounded-3xl border border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-500 block font-bold uppercase tracking-wider mb-1">Мөнгөн тэмдэгт</span>
                  <strong className="text-lg sm:text-xl text-neutral-900 font-bold block">Төгрөг (MNT, ₮)</strong>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 relative h-96 sm:h-[460px] rounded-3xl overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200"
                alt="Монгол ахуй"
                fill
                unoptimized
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2. ХҮН АМ & НИЙСЛЭЛ */}
        <section id="population" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">02. Демографи & Төв</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Хүн ам, нийслэл хот
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-neutral-50 rounded-3xl p-8 sm:p-10 border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-[#15803d] block mb-3">3.5+ Сая</span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Нийт хүн ам</h3>
                <p className="text-base text-neutral-600 font-normal leading-relaxed">
                  Хүн амын 60 гаруй хувийг 35-аас доош насны залуучууд эзэлдэг дэлхийн хамгийн залуу үндэстнүүдийн нэг.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-400 mt-6 block uppercase tracking-wider">Дундаж наслалт: 71 нас</span>
            </div>

            <div className="bg-neutral-50 rounded-3xl p-8 sm:p-10 border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-neutral-900 block mb-3">Улаанбаатар</span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Нийслэл хот</h3>
                <p className="text-base text-neutral-600 font-normal leading-relaxed">
                  Монгол Улсын улс төр, эдийн засаг, боловсролын төв. Нийт хүн амын тал хувь нь аж төрж байна.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-400 mt-6 block uppercase tracking-wider">Үүссэн он: 1639</span>
            </div>

            <div className="bg-neutral-50 rounded-3xl p-8 sm:p-10 border border-neutral-200 flex flex-col justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-black text-[#15803d] block mb-3">2.2 хүн/км²</span>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Хүн амын нягтрал</h3>
                <p className="text-base text-neutral-600 font-normal leading-relaxed">
                  Дэлхийн хамгийн сийрэг хүн амтай тусгаар улс. Уудам тал нутагт тайван, амар амгалан амьдрах боломж.
                </p>
              </div>
              <span className="text-xs sm:text-sm font-bold text-neutral-400 mt-6 block uppercase tracking-wider">Дэлхийд нягтралаараа #1</span>
            </div>
          </div>
        </section>

        {/* 3. ГАЗАР НУТАГ */}
        <section id="geography" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">03. Газар зүй & Байгаль</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Газар нутгийн онцлог
            </h2>
          </div>

          <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-14">
            <div className="max-w-3xl space-y-6">
              <span className="text-emerald-400 text-sm font-black uppercase tracking-widest block">Дэлхийд 18-р байр</span>
              <h3 className="text-4xl sm:text-6xl font-black leading-tight">1,564,116 км²</h3>
              <p className="text-base sm:text-xl text-neutral-300 font-light leading-relaxed">
                Баруун Европтой тэнцэхүйц уудам нутагтай. Хойноосоо урагшаа мөнх цаст уулс, хөвч тайга ой, тал хээр, өмнөд хэсэгтээ алдарт говийн экосистем хослон оршдог.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-neutral-800 text-sm sm:text-base">
                <div>
                  <span className="text-neutral-400 block mb-1">Хамгийн өндөр цэг:</span>
                  <strong className="text-white text-base sm:text-lg">Хүйтэн оргил (4,374 м)</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">Хамгийн нам дор цэг:</span>
                  <strong className="text-white text-base sm:text-lg">Хөх нуур (560 м)</strong>
                </div>
                <div>
                  <span className="text-neutral-400 block mb-1">Хилийн нийт урт:</span>
                  <strong className="text-white text-base sm:text-lg">8,252.7 км</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ТӨРИЙН БОЛОН ҮНДЭСНИЙ БЭЛГЭДЭЛ */}
        <section id="symbols" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">04. Төрийн үнэт зүйл</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Төрийн болон үндэсний бэлгэдэл
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl border border-neutral-200 bg-white shadow-xs">
              <span className="text-4xl block mb-4">🇲🇳</span>
              <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Төрийн далбаа</h4>
              <p className="text-base text-neutral-600 leading-relaxed">
                Улаан (бадран мандах), Хөх (мөнх тэнгэр), Алтан Соёмбо тэмдгээр баялаг тусгаар тогтнолын бэлгэдэл.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-neutral-200 bg-white shadow-xs">
              <span className="text-4xl block mb-4">☀️</span>
              <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Соёмбо үсэг</h4>
              <p className="text-base text-neutral-600 leading-relaxed">
                Гал, нар, сар, загас, сум бүхий монгол түмний өнө мөнхийн эв нэгдэл, эрх чөлөөний илэрхийлэл.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-neutral-200 bg-white shadow-xs">
              <span className="text-4xl block mb-4">🐎</span>
              <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Төрийн сүлд</h4>
              <p className="text-base text-neutral-600 leading-relaxed">
                Бадамлянхуа цэцэг дээрх эрдэнийн хүлэг морь, алтан соёмбо, мөнх тэнгэрийн хээ угалз.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-neutral-200 bg-white shadow-xs">
              <span className="text-4xl block mb-4">🦅</span>
              <h4 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">Үндэсний бахархал</h4>
              <p className="text-base text-neutral-600 leading-relaxed">
                Үндэсний бахархалт шувуу шонхор, бахархалт хайрхан Бурхан Халдун, үндэсний их өв морин хуур.
              </p>
            </div>
          </div>
        </section>

        {/* 5. МОНГОЛ НЭРИЙН ТУХАЙ */}
        <section id="etymology" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">05. Түүхэн сурвалж</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Монгол нэрийн тухай
            </h2>
          </div>

          <div className="bg-neutral-50 p-8 sm:p-14 rounded-3xl border border-neutral-200">
            <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-5">
              “Мөнх гал” буюу мөнхөд асаж дүрэлзэх ариун гал голомт
            </h3>
            <div className="space-y-5 text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
              <p>
                Эрдэмтэн судлаачид <strong>“Монгол”</strong> хэмээх нэрийг эртний хэлний <em>“Мөнх-Гал”</em> буюу унтрашгүй ариун гал голомт гэсэн утгаас үүссэн гэж тайлбарладаг. Мөн түүнчлэн зориг төгөлдөр, баатарлаг гэсэн санааг илэрхийлдэг.
              </p>
              <p>
                Энэхүү нэр нь Тан улсын сурвалж бичигт <em>“Мэнгу”</em> нэрээр анх тэмдэглэгдэж, улмаар 1206 онд Их Эзэн Чингис хаан Их Монгол Улсыг тунхагласнаар нийт нүүдэлчин овог аймгуудын нэгдсэн үндэсний нэр болж мөнхөрсөн түүхтэй.
              </p>
            </div>
          </div>
        </section>

        {/* 6. ОНЦЛОГ ТОО, БАРИМТУУД */}
        <section id="facts" className="scroll-mt-28">
          <div className="border-b border-neutral-200 pb-5 mb-10">
            <span className="text-sm font-black uppercase tracking-widest text-[#15803d] block mb-2">06. Factsheet</span>
            <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight">
              Монгол орны онцлог тоо, баримтууд
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-4xl sm:text-5xl font-black text-[#15803d] block mb-2">250+</span>
              <strong className="text-sm sm:text-base uppercase tracking-wider text-neutral-900 block mb-1">Нартай өдөр</strong>
              <span className="text-xs sm:text-sm text-neutral-500">Жилд нар гийгүүлэх өдөр</span>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-4xl sm:text-5xl font-black text-neutral-900 block mb-2">70M+</span>
              <strong className="text-sm sm:text-base uppercase tracking-wider text-neutral-900 block mb-1">Таван хошуу мал</strong>
              <span className="text-xs sm:text-sm text-neutral-500">Хүн амаасаа 20 дахин олон</span>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-4xl sm:text-5xl font-black text-neutral-900 block mb-2">1,580м</span>
              <strong className="text-sm sm:text-base uppercase tracking-wider text-neutral-900 block mb-1">Дундаж өндөр</strong>
              <span className="text-xs sm:text-sm text-neutral-500">Далайн түвшнээс дээш өндөр</span>
            </div>

            <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center">
              <span className="text-4xl sm:text-5xl font-black text-[#15803d] block mb-2">1206</span>
              <strong className="text-sm sm:text-base uppercase tracking-wider text-neutral-900 block mb-1">Их Монгол Улс</strong>
              <span className="text-xs sm:text-sm text-neutral-500">Түүхийг өөрчилсөн он</span>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
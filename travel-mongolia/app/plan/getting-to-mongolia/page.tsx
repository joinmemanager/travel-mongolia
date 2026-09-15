'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Олон улсын үндсэн шууд нислэгүүд
const FLIGHT_ROUTES = [
  { from: 'Сөүл (ICN) ➔ Улаанбаатар (UBN)', time: '3ц 40мин', airlines: 'MIAT, Korean Air, Asiana, Jeju Air', freq: 'Өдөр бүр олон давтамжтай' },
  { from: 'Токио (NRT) ➔ Улаанбаатар (UBN)', time: '5ц 30мин', airlines: 'MIAT, Aero Mongolia', freq: '7 хоногт 5-7 удаа' },
  { from: 'Франкфурт (FRA) ➔ Улаанбаатар (UBN)', time: '8ц 50мин', airlines: 'MIAT Mongolian Airlines', freq: 'Зуны улиралд 7 хоногт 3-5 удаа' },
  { from: 'Истанбул (IST) ➔ Улаанбаатар (UBN)', time: '8ц 15мин', airlines: 'Turkish Airlines, MIAT', freq: '7 хоногт 3-4 удаа' },
  { from: 'Бээжин (PEK/PKX) ➔ Улаанбаатар (UBN)', time: '2ц 10мин', airlines: 'Air China, MIAT', freq: 'Өдөр бүр' },
  { from: 'Бангкок (BKK) ➔ Улаанбаатар (UBN)', time: '6ц 00мин', airlines: 'MIAT (Улирлын чанартай)', freq: 'Өвлийн улиралд тогтмол' },
];

// Хилийн боомтуудын мэдээлэл
const BORDER_CROSSINGS = [
  { name: 'Алтанбулаг (ОХУ-тай хиллэх)', type: 'Авто зам', status: '24/7 нээлттэй', note: 'Олон улсын зорчигчдод нээлттэй гол боомт' },
  { name: 'Замын-Үүд (БНХАУ-тай хиллэх)', type: 'Төмөр зам & Авто зам', status: 'Цагийн хуваарьтай', note: 'Бээжин-УБ чиглэлийн үндсэн коридор' },
  { name: 'Цагааннуур (ОХУ-тай хиллэх)', type: 'Авто зам (Баян-Өлгий)', status: 'Ажлын өдрүүдэд', note: 'Баруун Монголоор зорчигчдод тохиромжтой' },
  { name: 'Сүхбаатар (ОХУ-тай хиллэх)', type: 'Олон улсын төмөр зам', status: 'Галт тэрэгний хуваариар', note: 'Транс-Монголын галт тэрэг дамжин өнгөрнө' },
];

export default function GettingToMongoliaPage() {
  const [activeNav, setActiveNav] = useState('flights');

  const navItems = [
    { id: 'flights', label: '01. Олон улсын нислэг' },
    { id: 'airport', label: '02. Чингис Хаан нисэх буудал' },
    { id: 'railway', label: '03. Төмөр зам & Галт тэрэг' },
    { id: 'borders', label: '04. Хилээр нэвтрэх & Боомтууд' },
  ];

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32">
      {/* Толгой хэсэг */}
      <header className="border-b border-neutral-200 bg-white pt-16 pb-12 px-6 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#15803d] uppercase">
              05. АЯЛЛАА ТӨЛӨВЛӨХ
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-[11px] font-mono text-neutral-500 uppercase">
              GETTING TO MONGOLIA
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Монголд ирэх
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Агаар, төмөр зам болон хуурай замын хилийн боомтоор Монгол Улсад хэрхэн ирэх тухай нарийвчилсан мэдээлэл, нисэх буудлаас хотын төв хүрэх тээвэр.
          </p>
        </div>
      </header>

      {/* Их бие: Sticky sidebar + Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Зүүн талын Sticky Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-28 space-y-2 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 px-2">
            Сэдвийн жагсаалт
          </span>
          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={() => setActiveNav(item.id)}
                className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeNav === item.id
                    ? 'bg-[#15803d]/10 text-[#15803d] font-bold'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="pt-4 mt-4 border-t border-neutral-100 flex flex-col gap-2">
            <Link
              href="/plan/before-you-travel"
              className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 px-2"
            >
              ← Өмнөх: 01. Ирэхээс өмнө
            </Link>
            <Link
              href="/plan/getting-around"
              className="text-[11px] font-bold text-[#15803d] hover:text-emerald-950 flex items-center justify-between px-2"
            >
              <span>Дараах: 03. Дотор аялах</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        {/* Баруун талын дэлгэрэнгүй хэсгүүд */}
        <div className="flex-1 w-full space-y-16">

          {/* 01. ОЛОН УЛСЫН НИСЛЭГ */}
          <section id="flights" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Олон улсын нислэг
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Монгол руу Ази, Европын томоохон хотуудаас шууд нислэгүүд тогтмол үйлддэг. Аяллын оргил үе болох 6-8 дугаар сард суудлын захиалга хурдан дүүрдэг тул тийзээ 2-3 сарын өмнө урьдчилан захиалахыг зөвлөж байна.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FLIGHT_ROUTES.map((route, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#fcfbf9] border border-neutral-200/80">
                  <span className="text-xs font-bold text-neutral-900 block mb-1">
                    ✈️ {route.from}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-neutral-600 mb-2 font-mono">
                    <span className="bg-neutral-200/60 text-neutral-800 px-2 py-0.5 rounded">
                      ⏱ {route.time}
                    </span>
                    <span>{route.freq}</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    Агаарын тээвэрлэгч: <span className="font-semibold text-neutral-700">{route.airlines}</span>
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-neutral-100 flex flex-wrap gap-4 text-xs font-semibold text-[#15803d]">
              <a href="https://www.miat.com" target="_blank" rel="noreferrer" className="hover:underline">
                MIAT Mongolian Airlines (Албан ёсны сайт) ↗
              </a>
              <span className="text-neutral-300">|</span>
              <a href="https://www.aeromongolia.mn" target="_blank" rel="noreferrer" className="hover:underline">
                Aero Mongolia ↗
              </a>
              <span className="text-neutral-300">|</span>
              <a href="https://www.hunnuair.com" target="_blank" rel="noreferrer" className="hover:underline">
                Hunnu Air ↗
              </a>
            </div>
          </section>

          {/* 02. ЧИНГИС ХААН НИСЭХ БУУДАЛ */}
          <section id="airport" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              "Чингис Хаан" олон улсын нисэх буудал (UBN)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Шинэ нисэх буудал нь Төв аймгийн Сэргэлэн сум, Хөшигийн хөндийд байрладаг бөгөөд Улаанбаатар хотын төвөөс урагш <strong>50 км</strong> зайд оршдог. Хурдны замаар хотын төв хүртэл автомашинаар 45-60 минут зарцуулна.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <span className="text-[10px] font-bold text-[#15803d] uppercase tracking-wider block mb-1">
                  Сонголт 01
                </span>
                <h4 className="text-sm font-bold text-neutral-900 mb-2">🚌 Экспресс Автобус</h4>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  Нисэх буудлаас УБ хотын төвийн цэгүүд (Сүхбаатарын талбай, Драгон, Баянмонгол) рүү тогтмол цагийн хуваариар явдаг.
                </p>
                <span className="text-xs font-mono font-bold text-neutral-800">
                  Үнэ: ~10,000₮ - 15,000₮
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <span className="text-[10px] font-bold text-[#15803d] uppercase tracking-wider block mb-1">
                  Сонголт 02
                </span>
                <h4 className="text-sm font-bold text-neutral-900 mb-2">🚕 Албан ёсны Такси</h4>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  Буудлын гарц дээр үйлчилдэг зөвшөөрөлтэй дуудлагын такси үйлчилгээ. Урьдчилан захиалах эсвэл танхим доторх лавлахаас авч болно.
                </p>
                <span className="text-xs font-mono font-bold text-neutral-800">
                  Үнэ: ~80,000₮ - 120,000₮
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <span className="text-[10px] font-bold text-[#15803d] uppercase tracking-wider block mb-1">
                  Сонголт 03
                </span>
                <h4 className="text-sm font-bold text-neutral-900 mb-2">🚐 Аяллын тосох үйлчилгээ</h4>
                <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                  Хэрэв та зочид буудал эсвэл аяллын компаниар захиалга хийсэн бол нэр бүхий самбартай жолооч танхимаас шууд тосож авна.
                </p>
                <span className="text-xs font-mono font-bold text-neutral-800">
                  Багцад багтсан байх нь элбэг
                </span>
              </div>
            </div>
          </section>

          {/* 03. ТӨМӨР ЗАМ */}
          <section id="railway" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Транс-Монголын төмөр зам
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Дэлхийд алдартай Москва - Улаанбаатар - Бээжин чиглэлийн галт тэрэг нь хуурай газраар аялагчдын хувьд мартагдашгүй содон туршлага болдог.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Бээжин ➔ Улаанбаатар (К3 / К23 галт тэрэг)</h4>
                  <p className="text-xs text-neutral-500">Замын-Үүдийн боомтоор орж ирдэг. Нийт аяллын хугацаа 27-30 цаг.</p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#15803d] shrink-0">Долоо хоногт 2 удаа</span>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">Эрхүү / Улаан-Үд ➔ Улаанбаатар</h4>
                  <p className="text-xs text-neutral-500">Байгал нуурын эргээр тойрч, Сүхбаатарын боомтоор дамжин ирдэг шууд галт тэрэг.</p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#15803d] shrink-0">Тогтмол хуваарьтай</span>
              </div>
            </div>

            <div className="mt-4 text-xs font-semibold text-[#15803d]">
              <a href="https://eticket.ubtz.mn" target="_blank" rel="noreferrer" className="hover:underline">
                УБТЗ онлайн тасалбар захиалга (eticket.ubtz.mn) ↗
              </a>
            </div>
          </section>

          {/* 04. ХИЛЭЭР НЭВТРЭХ */}
          <section id="borders" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 04</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Хилийн боомтууд & Автомашинаар нэвтрэх
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Хувийн автомашин, мотоцикл эсвэл явганаар хил давахдаа дараах олон улсын зэрэглэлийн байнгын ажиллагаатай боомтуудыг ашиглана:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BORDER_CROSSINGS.map((b, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-neutral-900">{b.name}</h4>
                    <span className="text-[10px] font-mono bg-emerald-100 text-[#15803d] px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-500 block mb-1 font-mono">
                    Төрөл: {b.type}
                  </span>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">
                    {b.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed">
              ⚠️ <strong>Хувийн тээврийн хэрэгсэлтэй нэвтрэх санамж:</strong> Гадаад улсын дугаартай машинаар Монголд нэвтрэхэд олон улсын жолооны үнэмлэх (IDP), тээврийн хэрэгслийн гэрчилгээ болон гаалийн түр горимын бичиг баримтыг боомт дээр бөглөх шаардлагатай.
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
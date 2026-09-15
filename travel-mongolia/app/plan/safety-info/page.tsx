'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// FAQ (Түгээмэл асуулт хариулт) өгөгдөл
const FAQ_DATA = [
  {
    q: 'Монголд аялахад ерөнхийдөө хэр аюулгүй вэ?',
    a: 'Монгол Улс нь дэлхийн хамгийн аюулгүй, тайван орнуудын нэгд тооцогддог. Зэвсэгт мөргөлдөөн, террорист аюул байхгүй. Харин Улаанбаатар хотын томоохон зах (Нарантуул гэх мэт), олон нийтийн тээвэрт халаасны хулгайгаас сэрэмжлэх, хөдөө хээр байгалийн хүчин зүйл, цаг агаарын огцом өөрчлөлтөд бэлтгэлтэй байх шаардлагатай.',
  },
  {
    q: 'Дрон (UAV) нисгэж бичлэг хийж болох уу?',
    a: 'Хөдөө хээр, байгалийн задгай талбайд дрон нисгэхэд асуудалгүй. Харин хилийн зурвас бүс (хилээс 30-100 км дотогш), цэргийн анги байгууламж, төрийн тусгай хамгаалалттай ордон, Чингис Хаан нисэх буудлын орчимд дрон нисгэхийг хуулиар хатуу хориглодог.',
  },
  {
    q: 'Крантны ус ууж болох уу?',
    a: 'Улаанбаатар болон бусад сууринд крантны усыг шууд уухыг зөвлөдөггүй. Савласан цэвэр ус худалдан авах эсвэл сайтар буцалгаж хэрэглэх нь тохиромжтой. Хөдөө хээр горхи, голын усыг шүүлтүүрээр шүүж ууна.',
  },
  {
    q: 'Малчин айлд орохдоо юуг анхаарах вэ?',
    a: 'Гэрийн босгон дээр гишгэхгүй байх, тоононоос уясан уяанаас барихгүй байх, гэрийн хоёр баганын хоорондуураа гарахгүй байх, айлын өгсөн аягатай цай идээг баруун гараараа (эсвэл хоёр гараараа) хүндэтгэн авах ёстой.',
  },
  {
    q: 'Заавал хийлгэх вакцин шаардлагатай юу?',
    a: 'Албан ёсоор шаардсан тусгай вакцин байхгүй. Гэхдээ хавар, зуны эхэн сард ой тайгаар (Хөвсгөл, Сэлэнгэ, Хэнтий) явах бол хачгийн энцефалитын эсрэг вакцин хийлгэсэн байх нь зүйтэй.',
  },
];

// Түргэн тусламж, ослын үед залгах утаснууд
const EMERGENCY_NUMBERS = [
  { name: 'Цагдаагийн газар (Police)', number: '102', note: 'Гэмт хэрэг, зөрчил, хулгай' },
  { name: 'Түргэн тусламж (Ambulance)', number: '103', note: 'Эрүүл мэндийн яаралтай тусламж' },
  { name: 'Онцгой байдал (Disaster & Rescue)', number: '105', note: 'Байгалийн гамшиг, төөрсөн, осол' },
  { name: 'Аялал жуулчлалын лавлах (Tourist Hotline)', number: '+976 7010-8687', note: 'Аялагчдад зориулсан мэдээлэл, дэмжлэг' },
];

export default function SafetyInfoPage() {
  const [activeNav, setActiveNav] = useState('safety');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const navItems = [
    { id: 'safety', label: '01. Ерөнхий аюулгүй байдал' },
    { id: 'local-laws', label: '02. Орон нутгийн хууль дүрэм' },
    { id: 'etiquette', label: '03. Аялагчийн ёс зүй (Taboo)' },
    { id: 'health', label: '04. Эрүүл мэнд & Эмийн сан' },
    { id: 'emergency', label: '05. Emergency тусламжийн утас' },
    { id: 'faq', label: '06. Түгээмэл асуултууд (FAQ)' },
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
              SAFETY & USEFUL INFO
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Аюулгүй байдал & Хэрэгтэй мэдээлэл
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Монголд аюулгүй, хариуцлагатай аялахад шаардлагатай орон нутгийн дүрэм журам, соёлын ёс заншил, түргэн тусламжийн холбоосууд болон чухал зөвлөгөө.
          </p>
        </div>
      </header>

      {/* Их бие */}
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
              href="/plan/services"
              className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 px-2"
            >
              ← Өмнөх: 05. Үйлчилгээ
            </Link>
            <Link
              href="/planner"
              className="text-[11px] font-bold text-[#15803d] hover:text-emerald-950 flex items-center justify-between px-2"
            >
              <span>Дараах: 07. Төлөвлөгч хэрэгсэл</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        {/* Баруун талын дэлгэрэнгүй агуулга */}
        <div className="flex-1 w-full space-y-16">

          {/* 01. ЕРӨНХИЙ АЮУЛГҮЙ БАЙДАЛ */}
          <section id="safety" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Ерөнхий аюулгүй байдал
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-900 mb-2">🏙️ Хотод (Улаанбаатар)</h4>
                <ul className="text-xs text-neutral-600 space-y-2 leading-relaxed">
                  <li>• Зах, автобусны буудал, жуулчдын бөөгнөрөл ихтэй газруудад үүргэвч, түрийвчээ сонор сэрэмжтэй авч явах.</li>
                  <li>• Шөнийн цагаар гэрэлтүүлэггүй гудамж, гэр хорооллын бүсээр ганцаараа явахаас зайлсхийх.</li>
                  <li>• Авто замын хөдөлгөөн их, явган хүний гарц дээр машин зогсож өгөх нь удаан байдаг тул зам гарахдаа анхааралтай байх.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-900 mb-2">🏕️ Хөдөө хээр аялалд</h4>
                <ul className="text-xs text-neutral-600 space-y-2 leading-relaxed">
                  <li>• Цаг агаар огцом хувирдаг (зун ч мөндөр орох, цасан шуурга тавих магадлалтай) тул дулаан хувцсаа үргэлж бэлэн байлгах.</li>
                  <li>• Хөдөө хээр бартаат замд машин эвдрэхэд өөр машин таарахгүй байх эрсдэлтэй тул 2+ машинтай цуваагаар явах нь хамгийн аюулгүй.</li>
                  <li>• Гол ус үерлэсэн үед машинтай хүчээр гатлах гэж оролдохоос зайлсхийх.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 02. ОРОН НУТГИЙН ХУУЛЬ ДҮРЭМ */}
          <section id="local-laws" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Орон нутгийн хууль & Дүрэм журам
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">🚁 Дроны дүрэм (UAV Regulation)</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Монгол Улсад дроныг зөвхөн үзэгдэх орчинд (VLOS), 120 метрээс дээшгүй өндөрт нисгэнэ. Нисэх буудал, цэргийн бааз, хилийн бүсээс 10 км-ийн зайд зөвшөөрөлгүй нисгэвэл хуулийн хариуцлага хүлээлгэдэг.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">🌲 Тусгай хамгаалалттай газар нутгийн дүрэм (National Parks)</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Дархан цаазат болон БЦГ-т нэвтрэхэд хураамж төлдөг. Ил задгай гал түлэхийг хатуу хориглох бөгөөд хогоо заавал буцааж авч гарах (Leave No Trace) дүрэм үйлчилнэ.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">🛂 Хилийн зурвас бүсэд зорчих зөвшөөрөл</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Алтай Таван Богд, Мэнэнгийн тал зэрэг улсын хилд ойр газруудаар аялах бол Хилийн цэргийн удирдах газраас урьдчилан зөвшөөрөл авах шаардлагатай. (Тур операторууд ихэвчлэн үүнийг зохицуулж өгдөг).
                </p>
              </div>
            </div>
          </section>

          {/* 03. АЯЛАГЧИЙН ЁС ЗҮЙ */}
          <section id="etiquette" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Аялагчийн ёс зүй & Цээрлэх зүйлс (Nomadic Taboos)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Нүүдэлчдийн олон зуун жилийн соёл, шүтлэгийг хүндэтгэх нь аялагч хүний нэр төрийн хэрэг юм:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200">
                <span className="text-xs font-bold text-[#15803d] block mb-1">Зөв үйлдэл (Do’s)</span>
                <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                  <li>Гэрт ороод баруун талаар нь тойрч суух</li>
                  <li>Цай, хоолыг баруун гараараа эсвэл хоёр гардан авах</li>
                  <li>Овоо таарвал нар зөв 3 удаа тойрч чулуу нэмэх</li>
                  <li>Хүний хөл дээр санамсаргүй гишгэвэл гар барих</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
                <span className="text-xs font-bold text-rose-700 block mb-1">Цээрлэх үйлдэл (Don'ts)</span>
                <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside">
                  <li>Гэрийн босгон дээр гишгэх буюу босгон дээр зогсох</li>
                  <li>Гэрийн голын хоёр баганыг налах эсвэл дундуур нь гарах</li>
                  <li>Гал голомт, зуух руу хог хаях, хөлөө жийх</li>
                  <li>Гол ус руу сүү, цагаан идээ, хог дусаах, угаах</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 04. ЭРҮҮЛ МЭНД & ЭМИЙН САН */}
          <section id="health" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 04</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Эрүүл мэнд & Эмийн бэлтгэл
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Хөдөө сумдад эмийн сан, эмнэлгийн хүртээмж хот шиг өргөн биш тул өөрт хэрэгцээтэй эм тариагаа хангалттай нөөцтэй авч явах нь чухал.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">Хоол шингээлт</h4>
                <p className="text-xs text-neutral-600">Монгол үндэсний махан хоол, цагаан идээнд дасаагүйгээс ходоод хямрахад уух эм, фермент, идэвхжүүлсэн нүүрс.</p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">Харшил & Шавьж</h4>
                <p className="text-xs text-neutral-600">Тал хээрийн ургамлын тоосны харшлын эм, тайга, нуурын хөвөөний шумуул, хөх түрүүний эсрэг цацлага (DEET).</p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">Нар, хуурайшилт</h4>
                <p className="text-xs text-neutral-600">Монгол орны хуурай, нарлаг уур амьсгалаас хамгаалах өндөр хамгаалалттай нарны тос, хамрын чийгшүүлэгч дусаалга.</p>
              </div>
            </div>
          </section>

          {/* 05. EMERGENCY ТУСЛАМЖИЙН УТАС */}
          <section id="emergency" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 05</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Шуурхай тусламж & Emergency утаснууд
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Монгол орон даяар үнэ төлбөргүй холбогдох боломжтой яаралтай тусламжийн нэгдсэн дугаарууд:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EMERGENCY_NUMBERS.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 mb-0.5">{item.name}</h4>
                    <p className="text-[11px] text-neutral-500">{item.note}</p>
                  </div>
                  <a
                    href={`tel:${item.number}`}
                    className="px-4 py-2 rounded-xl bg-emerald-50 text-[#15803d] font-mono font-black text-base hover:bg-[#15803d] hover:text-white transition-all shadow-sm"
                  >
                    📞 {item.number}
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 rounded-xl bg-neutral-100 text-neutral-600 text-xs">
              💡 Хөдөө сүлжээгүй үед гар утасны <strong>SOS Emergency Satellite</strong> (хэрэв төхөөрөмж дэмждэг бол) эсвэл ойролцоох малчны мотоцикл, радио холбоог ашиглан сум руу мэдээ дамжуулдаг.
            </div>
          </section>

          {/* 06. ТҮГЭЭМЭЛ АСУУЛТ ХАРИУЛТ (FAQ) */}
          <section id="faq" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 06</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Түгээмэл асуултууд (FAQ)
            </h2>
            <div className="space-y-3">
              {FAQ_DATA.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-neutral-200 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#fcfbf9] transition-colors cursor-pointer"
                    >
                      <span className="text-xs sm:text-sm font-bold text-neutral-900">
                        {item.q}
                      </span>
                      <span className="text-sm font-mono text-[#15803d] shrink-0">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-neutral-600 leading-relaxed border-t border-neutral-100 pt-3">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
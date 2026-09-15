'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Визний мэдээллийн жишээ өгөгдөл
const VISA_COUNTRIES = [
  { country: 'АНУ (USA)', status: 'Визгүй', days: '90 хүртэл хоног', note: 'Жуулчлалаар зорчих паспорт хүчинтэй байх' },
  { country: 'ХБНГУ (Germany)', status: 'Визгүй', days: '30 хүртэл хоног', note: 'Европын холбооны ихэнх улсууд хамаарна' },
  { country: 'БНСУ (South Korea)', status: 'Визгүй', days: '90 хүртэл хоног', note: '2025 он хүртэл түр хөнгөлөлттэй' },
  { country: 'Япон (Japan)', status: 'Визгүй', days: '30 хүртэл хоног', note: 'Энгийн паспорттай иргэд' },
  { country: 'ОХУ (Russia)', status: 'Визгүй', days: '30 хүртэл хоног', note: '180 хоногт нийт 90-ээс хэтрэхгүй' },
  { country: 'БНХАУ (China)', status: 'Виз шаардлагатай', days: 'E-Visa авах боломжтой', note: 'evisa.mn системээр урьдчилан мэдүүлнэ' },
  { country: 'Их Британи (UK)', status: 'Визгүй', days: '30 хүртэл хоног', note: 'Аялал, бизнесийн зорилгоор' },
  { country: 'Франц (France)', status: 'Визгүй', days: '30 хүртэл хоног', note: 'Шенгений бүсийн хөнгөлөлт' },
  { country: 'Австрали (Australia)', status: 'Визгүй', days: '30 хүртэл хоног', note: '30 хоногоос дээш бол виз мэдүүлнэ' },
];

// Цаг агаарын саруудын дундаж өгөгдөл
const WEATHER_DATA = [
  { month: '1-р сар', temp: '-22°C / -14°C', tag: 'Өвөл', desc: 'Хамгийн хүйтэн үе, цасны баяр' },
  { month: '2-р сар', temp: '-18°C / -8°C', tag: 'Өвөл', desc: 'Цагаан сар, цэнгэг хүйтэн өдрүүд' },
  { month: '3-р сар', temp: '-8°C / +2°C', tag: 'Хавар', desc: 'Салхи шуургатай, дулаарч эхэлнэ' },
  { month: '4-р сар', temp: '+1°C / +12°C', tag: 'Хавар', desc: 'Цаг агаар тогтворгүй, ногоо ургана' },
  { month: '5-р сар', temp: '+8°C / +20°C', tag: 'Хавар', desc: 'Тааламжтай, шувууд ирэх үе' },
  { month: '6-р сар', temp: '+15°C / +26°C', tag: 'Зун', desc: 'Аяллын улирал эхэлнэ, ногоон тал' },
  { month: '7-р сар', temp: '+18°C / +30°C', tag: 'Зун', desc: 'Их баяр наадам, хамгийн дулаан сар' },
  { month: '8-р сар', temp: '+15°C / +27°C', tag: 'Зун', desc: 'Хур бороо багасч, байгаль бүрэн ногоорно' },
  { month: '9-р сар', temp: '+8°C / +19°C', tag: 'Намар', desc: 'Алтан намар, гэрэл зурагт хамгийн тохиромжтой' },
  { month: '10-р сар', temp: '0°C / +10°C', tag: 'Намар', desc: 'Сэрүүснэ, уулархаг газраар анхны цас' },
  { month: '11-р сар', temp: '-10°C / -1°C', tag: 'Өвөл', desc: 'Өвлийн эхэн, голууд хөлдөж эхэлнэ' },
  { month: '12-р сар', temp: '-19°C / -10°C', tag: 'Өвөл', desc: 'Цас мөсний баяр, бүргэдийн өвөл' },
];

// Хувцас бэлтгэлийн чеклист
const INITIAL_PACKING_ITEMS = [
  { id: '1', name: 'Салхи, ус нэвтрүүлдэггүй салхивч (Windbreaker / Gore-Tex)', category: 'Хувцаслалт', checked: false },
  { id: '2', name: 'Уулын зориулалтын бат бөх гутал (Trekking boots)', category: 'Хувцаслалт', checked: false },
  { id: '3', name: 'Дулаан флийс (Fleece jacket) эсвэл ноолууран цамц', category: 'Хувцаслалт', checked: false },
  { id: '4', name: 'Нарны малгай, хүзүүний ороолт (Buff), нарны шил', category: 'Хувцаслалт', checked: false },
  { id: '5', name: 'Power Bank (Хөдөө цахилгаан цэнэглэгч хол байдаг тул 20,000mAh+)', category: 'Техник, хэрэгсэл', checked: false },
  { id: '6', name: 'Гар чийдэн эсвэл толгойн гэрэл (Headlamp)', category: 'Техник, хэрэгсэл', checked: false },
  { id: '7', name: 'Нарны тос (SPF 50+), уруулын тос (Чийгшил бага, хуурай)', category: 'Эрүүл мэнд & Ариун цэвэр', checked: false },
  { id: '8', name: 'Хувийн эмийн сан (Хоол боловсруулах, өвчин намдаах, харшлын эм)', category: 'Эрүүл мэнд & Ариун цэвэр', checked: false },
  { id: '9', name: 'Бэлэн мөнгө (Төгрөг - хөдөө жижиг сууринд карт уншихгүй тохиолдол бий)', category: 'Бичиг баримт & Санхүү', checked: false },
];

export default function BeforeYouTravelPage() {
  const [selectedCountry, setSelectedCountry] = useState(VISA_COUNTRIES[0].country);
  const [checklist, setChecklist] = useState(INITIAL_PACKING_ITEMS);
  const [activeNav, setActiveNav] = useState('visa');

  const currentCountryData = VISA_COUNTRIES.find((c) => c.country === selectedCountry) || VISA_COUNTRIES[0];

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const navItems = [
    { id: 'visa', label: '01. Визний шаардлага' },
    { id: 'when-to-visit', label: '02. Хэзээ аялах вэ?' },
    { id: 'weather', label: '03. Цаг агаарын төлөв' },
    { id: 'packing', label: '04. Юу авчрах вэ? (Чеклист)' },
    { id: 'money', label: '05. Мөнгө, төлбөр тооцоо' },
    { id: 'sim-internet', label: '06. SIM карт / Холбоо' },
    { id: 'insurance', label: '07. Аяллын даатгал' },
  ];

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32">
      {/* Толгой хэсэг: Field Guide Cover */}
      <header className="border-b border-neutral-200 bg-white pt-16 pb-12 px-6 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#15803d] uppercase">
              05. АЯЛЛАА ТӨЛӨВЛӨХ
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-[11px] font-mono text-neutral-500 uppercase">
              BEFORE YOU TRAVEL
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Монголд ирэхээс өмнө
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Визний нөхцөл, жилийн дөрвөн улирлын цаг агаар, ачаа тээшний чеклист болон Монгол оронд хөл тавихаас өмнө мэдэх шаардлагатай практик бэлтгэлүүд.
          </p>
        </div>
      </header>

      {/* Үндсэн их бие: 2 баганат зохион байгуулалт */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* ЗҮҮН ТАЛ: Sticky Навигаци (Quick-Jump Navigator) */}
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

          <div className="pt-4 mt-4 border-t border-neutral-100">
            <Link
              href="/plan/getting-to-mongolia"
              className="text-[11px] font-bold text-[#15803d] hover:text-emerald-950 flex items-center justify-between px-2"
            >
              <span>Дараах: 02. Ирэх зам</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        {/* БАРУУН ТАЛ: Дэлгэрэнгүй агуулга ба Интерактив хэрэгслүүд */}
        <div className="flex-1 w-full space-y-16">

          {/* 01. ВИЗ (VISA CHECKER) */}
          <section id="visa" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Визний шаардлага & Шалгагч
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Монгол Улсын Засгийн газраас аялал жуулчлалыг дэмжих хүрээнд олон улсын 60 гаруй орны иргэдийг визийн шаардлагаас чөлөөлсөн бөгөөд бусад улсын иргэд цахимаар <strong>evisa.mn</strong> системээр 72 цагийн дотор визээ мэдүүлж авах боломжтой.
            </p>

            {/* Интерактив виз шалгах хайрцаг */}
            <div className="bg-[#fcfbf9] border border-neutral-200 rounded-2xl p-6 mb-6">
              <label className="text-xs font-bold text-neutral-700 block mb-2">
                Иргэншил / Улсаа сонгож шалгана уу:
              </label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full sm:w-72 bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-neutral-800 outline-none focus:border-[#15803d]"
                >
                  {VISA_COUNTRIES.map((c) => (
                    <option key={c.country} value={c.country}>
                      {c.country}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                      currentCountryData.status === 'Визгүй'
                        ? 'bg-emerald-100 text-[#15803d] border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {currentCountryData.status}
                  </span>
                  <span className="text-xs font-mono font-semibold text-neutral-700">
                    {currentCountryData.days}
                  </span>
                </div>
              </div>
              <p className="text-xs text-neutral-500 mt-3 italic">
                * {currentCountryData.note}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs font-semibold text-[#15803d]">
              <a
                href="https://evisa.mn"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span>Албан ёсны E-Visa систем (evisa.mn)</span>
                <span>↗</span>
              </a>
              <span className="text-neutral-300">|</span>
              <a
                href="https://immigration.gov.mn"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span>Гадаадын Иргэн Харьяатын Газар</span>
                <span>↗</span>
              </a>
            </div>
          </section>

          {/* 02. ХЭЗЭЭ АЯЛАХ ВЭ? */}
          <section id="when-to-visit" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Хэзээ аялах хамгийн тохиромжтой вэ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
                <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider block mb-1">
                  Аяллын оргил үе (6 - 8 сар)
                </span>
                <h4 className="text-base font-extrabold text-neutral-900 mb-2">Зуны улирал</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Тал нутаг бүхэлдээ ногоорч, Наадам болж, Хөвсгөл, Хангайн байгаль хамгийн үзэсгэлэнтэй байдаг үе. Нислэг, буудал урьдчилан захиалах шаардлагатай.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                  Алтан үе (9 - 10 сар)
                </span>
                <h4 className="text-base font-extrabold text-neutral-900 mb-2">Намар ба Говь</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Жуулчдын хөл татарсан, гэрэл зураг авах, Говийн бүсээр аялахад халуун буурч хамгийн тааламжтай болдог алтан өдрүүд.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-100">
                <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-1">
                  Өвөрмөц туршлага (11 - 3 сар)
                </span>
                <h4 className="text-base font-extrabold text-neutral-900 mb-2">Өвлийн экспедиц</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Хөвсгөлийн Мөсний баяр, Баян-Өлгийн Бүргэдийн баяр, Цагаан сар ба цаст уулсын аниргүй сүр жавхлан.
                </p>
              </div>
            </div>
          </section>

          {/* 03. ЦАГ АГААРЫН ТӨЛӨВ */}
          <section id="weather" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Саруудын цаг агаар & Дундаж температур
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Монгол орон эрс тэс уур амьсгалтай тул зуны цагт ч шөнөдөө сэрүүсэж болзошгүйг тооцоолоорой.
            </p>

            {/* Цаг агаарын хүснэгт */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {WEATHER_DATA.map((w) => (
                <div key={w.month} className="p-4 rounded-xl border border-neutral-200/70 bg-[#fcfbf9]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-neutral-900">{w.month}</span>
                    <span className="text-[10px] font-mono bg-neutral-200/60 text-neutral-700 px-2 py-0.5 rounded-md">
                      {w.tag}
                    </span>
                  </div>
                  <div className="text-sm font-mono font-black text-[#15803d] mb-1">
                    {w.temp}
                  </div>
                  <p className="text-[11px] text-neutral-500 leading-tight">
                    {w.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 04. ЧЕКЛИСТ (ЮУ АВЧРАХ ВЭ?) */}
          <section id="packing" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 04</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
                Юу авчрах вэ? (Интерактив чеклист)
              </h2>
              <span className="text-xs font-mono text-neutral-400">
                {checklist.filter((i) => i.checked).length} / {checklist.length} бэлэн болсон
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Хайрцаг дээр дарж бэлдсэн зүйлсээ чагтлан тэмдэглээрэй:
            </p>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <label
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    item.checked
                      ? 'bg-emerald-50/50 border-[#15803d]/40 text-neutral-400 line-through'
                      : 'bg-[#fcfbf9] border-neutral-200/80 hover:border-neutral-300 text-neutral-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 text-[#15803d] rounded focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1">
                    <span className="text-xs sm:text-sm font-medium block">
                      {item.name}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                      {item.category}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* 05. МӨНГӨ, ТӨЛБӨР ТООЦОО */}
          <section id="money" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 05</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Мөнгө, валют & Төлбөрийн хэрэгсэл
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-900 mb-2">💵 Валют & Бэлэн мөнгө</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Монгол Улсын албан ёсны мөнгөн тэмдэгт нь <strong>Төгрөг (MNT)</strong>. Улаанбаатар хотын банк, валют арилжааны цэгүүд дээр ам.доллар, евро, юань, воныг чөлөөтэй сольж болно. Хөдөө орон нутагт зорчихдоо бэлэн төгрөгтэй явах нь хамгийн найдвартай.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <h4 className="text-sm font-bold text-neutral-900 mb-2">💳 Карт & ATM</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Нийслэл хотод Visa, Mastercard бүх супермаркет, ресторанд ашиглагдана. Орон нутгийн сум, суурингийн төвүүдэд Хаан банк, Голомт банкны ATM-ууд байрладаг.
                </p>
              </div>
            </div>
          </section>

          {/* 06. SIM КАРТ / ХОЛБОО */}
          <section id="sim-internet" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 06</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              SIM Карт & Интернет сүлжээ
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Чингис Хаан олон улсын нисэх буудал болон хотын төвд оператор компаниудын салбараас eSIM эсвэл физик SIM худалдан авах боломжтой.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">Mobicom & Unitel</h4>
                <p className="text-xs text-neutral-600">Хөдөө орон нутаг, авто замын дагуу хамгийн өргөн 4G/LTE сүлжээтэй үндсэн операторууд.</p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">eSIM боломжтой</h4>
                <p className="text-xs text-neutral-600">Airalo, Nomad эсвэл дотоодын операторуудын eSIM-ийг онлайнаар шууд идэвхжүүлэх боломжтой.</p>
              </div>
            </div>
          </section>

          {/* 07. АЯЛЛЫН ДААТГАЛ */}
          <section id="insurance" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 07</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Аяллын даатгал & Зөвлөмж
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal mb-4">
              Монгол орны уудам нутаг, бартаат зам, морин аялал зэрэг идэвхтэй хөдөлгөөн их шаарддаг тул <strong>яаралтай тусламж, эмнэлгийн тээвэрлэлт (medical evacuation)</strong> багтсан олон улсын аяллын даатгалд хамрагдахыг зөвлөдөг.
            </p>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#15803d] font-medium">
              💡 Зөвлөмж: Хэрэв морь унах, мотоцикл эсвэл ууланд авирах гэж байгаа бол гэрээндээ "Extreme / Adventure sports" даатгалыг тусгайлан багтаагаарай.
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}
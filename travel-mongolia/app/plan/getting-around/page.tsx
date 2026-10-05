'use client';

import React, { useState } from 'react';
import Link from 'next/link';


// Зай, хугацааны матриц өгөгдөл
const ROUTE_DISTANCES = [
  { destination: 'Өмнөговь (Даланзадгад)', distance: '550 км', road: '100% Засмал зам', carTime: '7-8 цаг', flightTime: '1ц 20мин', note: 'Ёлын ам, Баянзаг, Хонгорын элс чиглэл' },
  { destination: 'Хөвсгөл (Мөрөн)', distance: '670 км', road: '100% Засмал зам', carTime: '9-11 цаг', flightTime: '1ц 30мин', note: 'Хатгал, Хөвсгөл нуурын эрэг рүү цааш 100 км' },
  { destination: 'Архангай (Цэцэрлэг)', distance: '460 км', road: '100% Засмал зам', carTime: '6-7 цаг', flightTime: 'Нислэггүй', note: 'Тэрхийн цагаан нуур, Тайхар чулуу' },
  { destination: 'Баян-Өлгий (Өлгий)', distance: '1,650 км', road: 'Засмал + Бартаат', carTime: '26-30 цаг', flightTime: '3ц 00мин', note: 'Алтай Таван Богд, бүргэдийн өлгий нутаг' },
  { destination: 'Төв аймаг (Тэрэлж БЦГ)', distance: '65 км', road: '100% Засмал зам', carTime: '1-1.5 цаг', flightTime: 'Байхгүй', note: 'Улаанбаатараас очих хамгийн ойр байгалийн цогцолбор' },
  { destination: 'Дорнод (Чойбалсан)', distance: '660 км', road: '100% Засмал зам', carTime: '8-10 цаг', flightTime: '1ц 25мин', note: 'Зүүн бүсийн уудам тал нутаг, Мэнэнгийн тал' },
];

export default function GettingAroundPage() {
  const [activeNav, setActiveNav] = useState('car');
  const [filterSearch, setFilterSearch] = useState('');

  const navItems = [
    { id: 'car', label: '01. Автомашин (4x4 & Жолооч)' },
    { id: 'bus', label: '02. Орон нутгийн автобус' },
    { id: 'domestic-flights', label: '03. Дотоодын нислэг' },
    { id: 'train', label: '04. Галт тэрэг' },
    { id: 'car-rental', label: '05. Машин түрээс' },
    { id: 'distances', label: '06. Зай, маршрут, хугацаа' },
  ];

  const filteredRoutes = ROUTE_DISTANCES.filter((r) =>
    r.destination.toLowerCase().includes(filterSearch.toLowerCase())
  );

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
              GETTING AROUND MONGOLIA
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Монгол дотор аялах
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Уудам тал нутаг, бартаат замаар зорчих тээврийн сонголтууд, орон нутгийн нислэг, автобусны хуваарь болон гол аймгуудын хоорондох зай, туулах хугацааны тооцоо.
          </p>
        </div>
      </header>

      {/* Их бие: Sticky sidebar + агуулга */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 flex flex-col lg:flex-row gap-12 items-start">
        
        {/* ЗҮҮН ТАЛЫН НАВИГАЦИ */}
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
              href="/plan/getting-to-mongolia"
              className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 px-2"
            >
              ← Өмнөх: 02. Монголд ирэх
            </Link>
            <Link
              href="/plan/accommodation"
              className="text-[11px] font-bold text-[#15803d] hover:text-emerald-950 flex items-center justify-between px-2"
            >
              <span>Дараах: 04. Байрлах газар</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        {/* БАРУУН ТАЛ: ДЭЛГЭРЭНГҮЙ ХЭСГҮҮД */}
        <div className="flex-1 w-full space-y-16">

          {/* 01. АВТОМАШИН (4X4 & ЖОЛООЧ) */}
          <section id="car" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Автомашин (4×4 ба Туршлагатай жолооч)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Монгол орны ихэнх байгалийн үзэсгэлэнт газрууд бартаат замд байдаг тул <strong>дөрвөн дугуйн хөтлөгчтэй (4WD)</strong> тээврийн хэрэгсэл зайлшгүй шаардлагатай. Орон нутгийн замын бартаа, гол ус гатлах чадвартай нутгийн туршлагатай жолоочтой аялах нь хамгийн аюулгүй найдвартай сонголт юм.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <span className="text-[10px] font-bold text-[#15803d] uppercase tracking-wider block mb-1">Сонгодог Тээвэр</span>
                <h4 className="text-base font-bold text-neutral-900 mb-2">УАЗ-452 (Орос фургон)</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Монголын хөдөөгийн домог болсон машин. Замгүй газар, шавар шавхай, элс манханд хамгийн туулах чадвар өндөр. Дотор зай уужим бөгөөд 4-6 хүн тээштэйгээ тухтай багтана.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                <span className="text-[10px] font-bold text-[#15803d] uppercase tracking-wider block mb-1">Тав тухтай Тээвэр</span>
                <h4 className="text-base font-bold text-neutral-900 mb-2">Toyota Land Cruiser / 4x4 SUV</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Агааржуулагчтай, зөөлөн явдалтай тул тав тухыг эрхэмлэгчдэд тохиромжтой. Холын замд ядралт бага, жижиг гэр бүл эсвэл 2-3 хүнтэй группэд нэн тохиромжтой.
                </p>
              </div>
            </div>
          </section>

          {/* 02. ОРОН НУТГИЙН АВТОБУС */}
          <section id="bus" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Орон нутгийн нийтийн тээвэр (Автобус)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Улаанбаатар хотоос 21 аймгийн төв рүү өдөр бүр товлосон цагийн хуваарийн дагуу хот хоорондын том оврын автобусууд явдаг. Энэ нь төсөвт (budget) аялагчдын хувьд хамгийн хэмнэлттэй хувилбар юм.
            </p>

            <div className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-neutral-900 mb-1">Драгон & Лавай авто вокзал</h4>
                <p className="text-xs text-neutral-600">
                  Баруун болон хойд аймгууд руу <strong>Драгон авто буудал</strong>-аас, өмнөд ба зүүн аймгууд руу <strong>Лавай авто буудал</strong>-аас автобуснууд хөдөлдөг.
                </p>
              </div>
              <a
                href="https://eticket.transdep.mn"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#15803d] text-white text-xs font-bold shrink-0 hover:bg-emerald-950 transition-colors"
              >
                Онлайн тасалбар захиалах (transdep.mn) ↗
              </a>
            </div>
          </section>

          {/* 03. ДОТООДЫН НИСЛЭГ */}
          <section id="domestic-flights" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Орон нутгийн нислэг
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Хэрэв таны аяллын хугацаа бага бол Өмнөговь, Хөвсгөл, Баян-Өлгий, Увс зэрэг алслагдсан бүс нутаг руу онгоцоор нисэж 1-3 цагийн дотор очих боломжтой. Дотоодын нислэгүүд "Чингис Хаан" олон улсын нисэх буудлаас хөөрдөг.
            </p>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-neutral-200/80 bg-[#fcfbf9] flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Улаанбаатар ➔ Өлгий (Баян-Өлгий)</span>
                  <span className="text-[11px] text-neutral-500 font-mono">Нислэгийн хугацаа: ~3 цаг | MIAT, Hunnu Air</span>
                </div>
                <span className="text-xs font-bold text-[#15803d]">7 хоногт 3-5 удаа</span>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200/80 bg-[#fcfbf9] flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Улаанбаатар ➔ Мөрөн (Хөвсгөл)</span>
                  <span className="text-[11px] text-neutral-500 font-mono">Нислэгийн хугацаа: ~1 цаг 30 мин | Aero Mongolia, Hunnu Air</span>
                </div>
                <span className="text-xs font-bold text-[#15803d]">Зуны улиралд өдөр бүр</span>
              </div>

              <div className="p-4 rounded-xl border border-neutral-200/80 bg-[#fcfbf9] flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">Улаанбаатар ➔ Даланзадгад (Өмнөговь)</span>
                  <span className="text-[11px] text-neutral-500 font-mono">Нислэгийн хугацаа: ~1 цаг 20 мин | Hunnu Air, MIAT</span>
                </div>
                <span className="text-xs font-bold text-[#15803d]">Тогтмол хуваарьтай</span>
              </div>
            </div>
          </section>

          {/* 04. ГАЛТ ТЭРЭГ */}
          <section id="train" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 04</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Галт тэрэг (Төмөр замын тээвэр)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4 font-normal">
              Монголын босоо тэнхлэгийн төмөр зам нь хойд хил (Сүхбаатар / Дархан / Эрдэнэт)-ээс нийслэл Улаанбаатараар дайрч урд хил (Сайншанд / Замын-Үүд) хүрдэг. Шөнийн галт тэрэг нь тухтай орон дээр унтаж явах хамгийн боломжийн шийдэл юм.
            </p>
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-700">
              💡 <strong>Зөвлөмж:</strong> Дорноговь аймгийн Хамрын хийд (Энергийн төв), Сайншанд хот руу Улаанбаатараас орой хөдөлж өглөө очдог шөнийн галт тэрэг аялагчдын дунд маш түгээмэл байдаг.
            </div>
          </section>

          {/* 05. МАШИН ТҮРЭЭС */}
          <section id="car-rental" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 05</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
              Машин түрээс (Self-Drive Rental)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Өөрөө жолоодон аялах (Self-drive) сонирхолтой аялагчид олон улсын Sixt, Avis болон дотоодын тусгай кемпер түрээсийн компаниудаас бүрэн тоноглогдсон 4x4 машин (дээвэртээ майхантай SUV) түрээслэх боломжтой.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">Шаардагдах бичиг баримт</h4>
                <p className="text-xs text-neutral-600">Олон улсын жолооны үнэмлэх (IDP), хүчин төгөлдөр паспорт, барьцаа төлбөр (credit card deposit).</p>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9]">
                <h4 className="text-xs font-bold text-neutral-900 mb-1">GPS & Оффлайн газрын зураг</h4>
                <p className="text-xs text-neutral-600">Хөдөө замд интернэт сүлжээ тасалддаг тул Maps.me эсвэл Gaia GPS-д Монголын газрын зургийг урьдчилан татаж авах хэрэгтэй.</p>
              </div>
            </div>
          </section>

          {/* 06. ЗАЙ, МАРШРУТ, ХУГАЦААНЫ ТООЦОО */}
          <section id="distances" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 06</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900">
                  Зай, маршрут & Хугацааны тооцоо
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-normal">
                  Улаанбаатар хотоос голлох аяллын бүсүүд хүртэлх баримжаа зай ба хугацаа
                </p>
              </div>

              {/* Хайх талбар */}
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Чиглэл хайх (жишээ: Хөвсгөл)..."
                className="w-full sm:w-64 bg-[#fcfbf9] border border-neutral-300 rounded-xl px-4 py-2 text-xs text-neutral-900 outline-none focus:border-[#15803d]"
              />
            </div>

            {/* Хүснэгт */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-3">Зорилтот газар</th>
                    <th className="py-3 px-3">Зай (км)</th>
                    <th className="py-3 px-3">Замын нөхцөл</th>
                    <th className="py-3 px-3">Автомашинаар</th>
                    <th className="py-3 px-3">Нислэгээр</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-normal">
                  {filteredRoutes.map((route, idx) => (
                    <tr key={idx} className="hover:bg-[#fcfbf9] transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-neutral-900 block">{route.destination}</span>
                        <span className="text-[11px] text-neutral-500">{route.note}</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-neutral-800">{route.distance}</td>
                      <td className="py-3.5 px-3 text-neutral-600">{route.road}</td>
                      <td className="py-3.5 px-3 font-mono text-neutral-700">{route.carTime}</td>
                      <td className="py-3.5 px-3 font-mono font-semibold text-[#15803d]">{route.flightTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}

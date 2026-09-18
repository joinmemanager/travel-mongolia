'use client';

import React, { useState } from 'react';


// Үйлчилгээ эрхлэгчдийн каталог өгөгдөл
const SERVICES_DATA = {
  agencies: [
    {
      name: 'Juulchin Tourism Corporation',
      type: 'Бүх төрлийн аялал / DMC',
      established: '1954 он',
      specialty: 'Соёл, байгаль, VIP багц аяллууд',
      desc: 'Монголын ууган бөгөөд хамгийн том аялал жуулчлалын компани. Олон улсын бүх хэл дээр тур зохион байгуулах чадвартай.',
      link: 'https://juulchin.com/',
      featured: true,
    },
    {
      name: 'Nomadic Journeys',
      type: 'Эко & Wilderness Аялал',
      established: '1993 он',
      specialty: 'Морин аялал, шувуу ажиглалт, каяак',
      desc: 'Байгаль орчинд ул мөргүй аялах эко стандартыг Монголд анхлан нэвтрүүлсэн тур оператор.',
      link: 'https://www.nomadicjourneys.com/',
      featured: true,
    },
    {
      name: 'Ayan Travel',
      type: 'Гэрэл зураг & Экспедиц',
      established: '2006 он',
      specialty: 'Бүргэдийн баяр, Говь, фото аялал',
      desc: 'Мэргэжлийн гэрэл зурагчид болон адал явдалт экспедицүүдэд чиглэсэн тусгай маршрутуудаар мэргэшсэн.',
      link: 'https://www.toursmongolia.com/',
      featured: true,
    },
    {
      name: 'Discover Mongolia Travel',
      type: 'Групп & Хувийн аялал',
      established: '2004 он',
      specialty: 'Сонгодог тойрон аяллууд, Наадам',
      desc: 'Аяллын үнэ, чанарын өндөр зохицолтой, онлайн захиалгын уян хатан системтэй олон улсын тур оператор.',
      link: 'https://www.discovermongolia.mn/',
      featured: true,
    },
    // Нэмэлт аяллын компаниуд
    {
      name: 'Amicus Travel Mongolia',
      type: 'Tailor-made / Тусгай захиалгат',
      established: '2009 он',
      specialty: 'Гэр бүлийн болон соёлын нарийвчилсан тур',
      desc: 'Хувь хүн, гэр бүлийн хүсэл сонирхолд тусгайлан тохируулсан хувийн маршрут гаргадаг.',
      link: 'https://amicusmongolia.com/',
      featured: false,
    },
    {
      name: 'Great Genghis Tours',
      type: 'Түүх, адал явдал',
      established: '2012 он',
      specialty: 'Их Монгол гүрний түүхэн замнал, морин экспедиц',
      desc: 'Түүхийн ухааны судлаач хөтөч нартай хамтарсан сонирхолтой экспедицүүд зохион байгуулдаг.',
      link: 'https://greatgenghis.com/',
      featured: false,
    },
    {
      name: 'View Mongolia Travel',
      type: 'Active & Adventure',
      established: '2008 он',
      specialty: 'Уулын треккинг, Алтай Таван Богд, цаатан',
      desc: 'Баруун болон хойд бүсийн алслагдсан бартаат замын аяллуудад олон жилийн туршлагатай.',
      link: 'https://www.viewmongolia.com/',
      featured: false,
    },
  ],
  guides: [
    {
      title: 'Монголын Мэргэжлийн Хөтөч нарын Холбоо (MPGA)',
      lang: 'Англи, Франц, Герман, Япон, Солонгос, Орос, Хятад, Испани',
      desc: 'Улсын албан ёсны сертификаттай, түүх, соёл, анхны тусламжийн сургалтад хамрагдсан мэргэжлийн хөтөч нар.',
      contact: 'Холбооны мэдээллийн нэгдсэн сангаас хөтөч сонгох боломжтой.',
      link: 'https://www.facebook.com/MongolianProfessionalGuidesAssociation/',
    },
    {
      title: 'Орон нутгийн уугуул хөтөч нар (Local Spotters)',
      lang: 'Монгол, Казах (Баян-Өлгийд), энгийн англи',
      desc: 'Тухайн нутгийн газар зүй, ан амьтан, уулсын нууц замыг нүдэлсэн малчин болон орон нутгийн иргэд.',
      contact: 'Аймгийн аялал жуулчлалын төвүүд болон гестхаусуудаар дамжуулан холбогдоно.',
      link: '#',
    },
  ],
  drivers: [
    {
      vehicle: 'УАЗ Фургонтой жолооч нар (Russian Van Drivers)',
      capacity: '4 - 6 хүн + их тээш',
      area: 'Говь, Архангай, Завхан, Хөвсгөл',
      desc: 'Монголын хөдөөгийн бартаат замыг гарын таван хуруу шигээ мэддэг, машинаа хээр газар өөрөө задалж угсрах чадвартай туршлагатай жолооч нар.',
    },
    {
      vehicle: 'Toyota Land Cruiser 70/100/200 жолооч нар',
      capacity: '2 - 3 хүн',
      area: 'Бүх бүс нутаг',
      desc: 'Агааржуулагчтай, зөөлөн явдалтай, тав тухтай аяллыг эрхэмлэдэг хүмүүст зориулсан 4x4 автомашин, мэргэжлийн жолооч.',
    },
  ],
  localServices: [
    {
      name: 'Кемпинг, хээрийн хэрэгслийн түрээс',
      provider: 'Seven Summits, Ayanchin Outfitters, УБ Гестхаусууд',
      desc: 'Майхан, дулаан унтлагын уут (-10C хүртэл), газ, гал тогооны иж бүрдэл, GPS төхөөрөмжийн өдрөөр түрээслэх үйлчилгээ.',
    },
    {
      name: 'Морь, тэмээ хөлслөх үйлчилгээ',
      provider: 'Орон нутгийн малчдын нөхөрлөл (Бүх аймагт)',
      desc: 'Цагаар эсвэл өдрөөр морь, тэмээ унах, хөтөч малчны хамт аялах үйлчилгээ. (Баримжаа үнэ: 15,000₮ - 30,000₮ / цаг).',
    },
    {
      name: 'Хиймэл дагуулын холбоо (Satellite / Starlink)',
      provider: 'Mobicom, Unitel, Түрээсийн агентууд',
      desc: 'Сүлжээгүй алс хээрийн бүсэд ажиллах Garmin InReach, Iridium хиймэл дагуулын утас болон зөөврийн Starlink Mini түрээс.',
    },
  ],
};

export default function ServicesPage() {
  const [activeNav, setActiveNav] = useState('agencies');
  const [isAgenciesExpanded, setIsAgenciesExpanded] = useState(false);

  const navItems = [
    { id: 'agencies', label: '01. Аяллын компаниуд (DMC)' },
    { id: 'guides', label: '02. Хөтөч, орчуулагч' },
    { id: 'drivers', label: '03. Жолооч & 4x4 Тээвэр' },
    { id: 'local-services', label: '04. Орон нутгийн үйлчилгээ' },
    { id: 'tips', label: '05. Захиалгын зөвлөмж' },
  ];

  const visibleAgencies = isAgenciesExpanded
    ? SERVICES_DATA.agencies
    : SERVICES_DATA.agencies.filter((a) => a.featured);

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
              TRAVEL SERVICES DIRECTORY
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Аяллын үйлчилгээ
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Монголын шилдэг албан ёсны тур операторууд, мэргэжлийн сертификаттай хөтөч нар, бартаат замын найдвартай жолооч болон хээрийн туслах үйлчилгээнүүдийн нэгдсэн лавлах.
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
              href="/plan/accommodation"
              className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 px-2"
            >
              ← Өмнөх: 04. Байрлах газар
            </Link>
            <Link
              href="/plan/safety-info"
              className="text-[11px] font-bold text-[#15803d] hover:text-emerald-950 flex items-center justify-between px-2"
            >
              <span>Дараах: 06. Аюулгүй байдал</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        {/* Баруун талын дэлгэрэнгүй агуулга */}
        <div className="flex-1 w-full space-y-16">

          {/* 01. АЯЛЛЫН КОМПАНИУД */}
          <section id="agencies" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Аяллын тур оператор компаниуд
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Монгол орны өргөн уудам нутгаар аюулгүй, төлөвлөгөөтэй, хариуцлагатай аялахад тусгай зөвшөөрөлтэй тур оператор компанийг сонгох нь чухал. Эдгээр компаниуд тээвэр, буудал, хөтөч, хоол, зөвшөөрлийг нэг дор бүрэн хариуцдаг.
            </p>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Санал болгох тур операторууд ({SERVICES_DATA.agencies.length})
              </h3>
              <button
                type="button"
                onClick={() => setIsAgenciesExpanded(!isAgenciesExpanded)}
                className="text-xs font-bold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{isAgenciesExpanded ? 'Хураах ▴' : `Бүгдийг үзэх (${SERVICES_DATA.agencies.length - 4} компани) ▾`}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleAgencies.map((agency, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200 flex flex-col justify-between hover:border-neutral-300 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h4 className="text-sm font-bold text-neutral-900 leading-snug">{agency.name}</h4>
                      <span className="text-[10px] font-mono font-bold bg-neutral-200/70 text-neutral-700 px-2 py-0.5 rounded shrink-0">
                        {agency.established}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#15803d] font-semibold mb-1">
                      {agency.type}
                    </div>
                    <div className="text-[11px] text-neutral-500 mb-2">
                      Чиглэл: <span className="text-neutral-700">{agency.specialty}</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-4">
                      {agency.desc}
                    </p>
                  </div>

                  <a
                    href={agency.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-between w-full pt-3 border-t border-neutral-200/60 text-xs font-bold text-[#15803d] hover:text-emerald-950 transition-colors"
                  >
                    <span>Вэбсайт руу зочлох</span>
                    <span>↗</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* 02. ХӨТӨЧ, ОРЧУУЛАГЧ */}
          <section id="guides" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Хөтөч & Орчуулагчийн үйлчилгээ
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Монгол орны нүүдэлчин соёл, түүх, ёс заншлыг гүн гүнзгий ойлгоход хэлний өндөр мэдлэгтэй мэргэжлийн хөтөч хамгийн том гүүр болдог.
            </p>

            <div className="space-y-4">
              {SERVICES_DATA.guides.map((g, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                  <h4 className="text-sm font-bold text-neutral-900 mb-1">{g.title}</h4>
                  <div className="text-xs font-semibold text-[#15803d] mb-2 font-mono">
                    Боломжит хэлнүүд: {g.lang}
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {g.desc}
                  </p>
                  <div className="text-[11px] text-neutral-500 font-medium pt-2 border-t border-neutral-100 flex items-center justify-between">
                    <span>{g.contact}</span>
                    {g.link !== '#' && (
                      <a href={g.link} target="_blank" rel="noreferrer" className="text-[#15803d] font-bold hover:underline">
                        Холбоотой танилцах ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 03. ЖОЛООЧ & 4X4 ТЭЭВЭР */}
          <section id="drivers" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Жолооч & Бартаат замын тээвэр
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Хөдөө хээр зам тодорхойгүй, сүлжээгүй орчинд зөв зам сонгох, гол гатлах, элснээс машинаа гаргах туршлагатай жолооч сонгох нь аяллын амжилтын 80%-ийг шийддэг.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SERVICES_DATA.drivers.map((d, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200">
                  <h4 className="text-sm font-bold text-neutral-900 mb-1">{d.vehicle}</h4>
                  <div className="flex items-center gap-3 text-xs text-neutral-500 font-mono mb-2">
                    <span className="bg-emerald-50 text-[#15803d] px-2 py-0.5 rounded font-bold">Багтаамж: {d.capacity}</span>
                    <span>Бүс: {d.area}</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 04. ОРОН НУТГИЙН ҮЙЛЧИЛГЭЭ */}
          <section id="local-services" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 04</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Орон нутгийн туслах үйлчилгээнүүд
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Аяллын явцад зайлшгүй шаардагдах хэрэгслийн түрээс, хээрийн холбоо болон морь, тэмээ унах үйлчилгээнүүд.
            </p>

            <div className="space-y-3">
              {SERVICES_DATA.localServices.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-neutral-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 mb-0.5">{s.name}</h4>
                    <span className="text-[11px] text-neutral-400 block mb-1">Нийлүүлэгчид: {s.provider}</span>
                    <p className="text-xs text-neutral-600 font-light">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 05. ЗАХИАЛГЫН ЗӨВЛӨМЖ */}
          <section id="tips" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 05</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Үйлчилгээ сонгох практик зөвлөмжүүд
            </h2>
            <div className="space-y-2.5 text-xs text-neutral-700">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 font-medium">
                📄 <strong>Албан ёсны гэрээ:</strong> Аяллын компанитай заавал албан ёсны гэрээ байгуулж, үнэнд хоол, шатахуун, буудал, музейн тасалбар багтсан эсэхийг урьдчилан тусгуулаарай.
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 font-medium">
                ⏳ <strong>Урьдчилсан захиалга:</strong> 7-р сарын Наадмын үеэр сайн жолооч, хөтөч, автомашинууд 2-3 сарын өмнө бүрэн захиалагддаг тул эртнээс баталгаажуулах хэрэгтэй.
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 font-medium">
                💵 <strong>Жолоочийн шатахуун:</strong> Хэрэв зөвхөн машин жолоочтой түрээсэлж байгаа бол шатахууныг километрийн тооцоогоор тусад нь төлөх үү, өдрийн үнэд багтсан уу гэдгийг тодорхой тохиролцох хэрэгтэй.
              </div>
            </div>
          </section>

        </div>

      </div>
    </main>
  );
}

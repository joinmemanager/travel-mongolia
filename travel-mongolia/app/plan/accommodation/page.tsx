'use client';

import React, { useState } from 'react';


// БҮХ БАЙРЛАХ ГАЗРУУДЫН ДЭЛГЭРЭНГҮЙ САН
const ACCOMMODATION_DATABASE = {
  hotels: [
    {
      name: 'Shangri-La Ulaanbaatar',
      location: 'Сүхбаатар дүүрэг, Улаанбаатар',
      rating: '5 Одтой тансаг',
      tag: 'Luxury',
      desc: 'Хотын төвд байрлах олон улсын 5 одтой буудал, спа, өндөр зэрэглэлийн ресторануудтай.',
      link: 'https://www.shangri-la.com/ulaanbaatar/shangrila/',
      featured: true,
    },
    {
      name: 'The Blue Sky Hotel & Tower',
      location: 'Төв талбай, Улаанбаатар',
      rating: '5 Одтой',
      tag: 'City View',
      desc: 'Нийслэлийн төв цэгт байрлах дарвуулт цамхаг. Панорама хотын дүр төрхийг дээрээс харах боломжтой.',
      link: 'https://www.hotelbluesky.mn/',
      featured: true,
    },
    {
      name: 'Kempinski Hotel Khan Palace',
      location: 'Баянзүрх дүүрэг, Улаанбаатар',
      rating: '5 Одтой',
      tag: 'Heritage',
      desc: 'Европ үйлчилгээний стандарт, тансаг орчин, өглөөний цайны баялаг сонголттой.',
      link: 'https://www.kempinski.com/en/hotel-khan-palace',
      featured: true,
    },
    {
      name: 'Novotel Ulaanbaatar',
      location: 'Хотын төв, Улаанбаатар',
      rating: '4 Одтой',
      tag: 'Modern',
      desc: 'Орчин үеийн залууст чиглэсэн цэвэрхэн, тав тухтай өрөөнүүд болон бассейнтай.',
      link: 'https://all.accor.com/',
      featured: true,
    },
    // Нэмэлт (Бүгдийг үзэх дарахад харагдах)
    {
      name: 'Ramada Ulaanbaatar Citycenter',
      location: 'Баянгол дүүрэг, Улаанбаатар',
      rating: '4 Одтой',
      tag: 'City Central',
      desc: 'Худалдааны төв болон Гандан хийдтэй ойр, тохилог бизнес ангиллын буудал.',
      link: 'https://www.wyndhamhotels.com/ramada',
      featured: false,
    },
    {
      name: 'Best Western Premier Tuushin Hotel',
      location: 'Төрийн ордны дэргэд, УБ',
      rating: '5 Одтой',
      tag: 'Prime Location',
      desc: 'Улаанбаатарын хамгийн төв байршилтай, спа төв, дээд давхрын лаунжтай.',
      link: 'https://www.hotelbestwestern.mn/',
      featured: false,
    },
    {
      name: 'Holiday Inn Ulaanbaatar',
      location: 'Чингэлтэй дүүрэг, Улаанбаатар',
      rating: '4 Одтой',
      tag: 'Comfort',
      desc: 'IHG сүлжээний найдвартай стандарт бүхий тохилог буудал.',
      link: 'https://www.ihg.com/holidayinn/',
      featured: false,
    },
    {
      name: 'Chinggis Khaan Hotel',
      location: 'Сүхбаатар дүүрэг, Улаанбаатар',
      rating: '4 Одтой',
      tag: 'Spacious',
      desc: 'Олон жилийн түүхтэй, уужим өрөөнүүд болон хурлын том танхимтай буудал.',
      link: 'http://www.chinggis-hotel.com/',
      featured: false,
    },
    {
      name: 'Ulaanbaatar Hotel (УБ Зочид буудал)',
      location: 'Сүхбаатарын талбайн зүүн талд',
      rating: 'Түүхэн 5 од',
      tag: 'Historic Landmark',
      desc: '1961 онд байгуулагдсан Монголын ууган зочид буудал, неоклассик загварын барилга.',
      link: 'https://ubhotel.mn/',
      featured: false,
    },
  ],
  touristCamps: [
    {
      name: 'Ashihai Resort (Ашихай бааз)',
      location: 'Хөвсгөл нуур, Хатгал тосгон',
      rating: 'Шилдэг эко бааз',
      tag: 'Lakefront',
      desc: 'Хөвсгөл далайн эрэг дээр байрлах өндөр зэрэглэлийн модон байшин, тохилог гэрийн хослол.',
      link: 'https://ashihai.mn/',
      featured: true,
    },
    {
      name: 'Anar Tourist Camp (Анар бааз)',
      location: 'Тэрхийн цагаан нуур, Архангай',
      rating: 'Байгалийн үзэсгэлэн',
      tag: 'Volcano & Lake',
      desc: 'Хоргын тогоо, Тэрхийн цагаан нуурын хөвөөнд байрлах халуун устай гэр бааз.',
      link: 'https://www.facebook.com/AnarTouristCamp/',
      featured: true,
    },
    {
      name: 'Gobi Mirage Camp (Говь Мираж)',
      location: 'Өмнөговь аймаг, Ханбогд / Даланзадгад',
      rating: 'Эко үйлчилгээ',
      tag: 'Desert Comfort',
      desc: 'Говийн эко аяллын тэргүүлэгч. 100% нарны эрчим хүчээр хангагддаг олон улсын шагналт бааз.',
      link: 'https://gobimirage.mn/',
      featured: true,
    },
    {
      name: 'Terelj Star Resort (Тэрэлж Стар)',
      location: 'Горхи-Тэрэлжийн БЦГ',
      rating: 'УБ-аас 60 км',
      tag: 'Quick Escape',
      desc: 'Байгалийн содон хадны дунд байрлах, бүтэн жилийн 4 улиралд ажилладаг бааз.',
      link: 'https://tereljstar.mn/',
      featured: true,
    },
    // Нэмэлт
    {
      name: 'Gobi Nomad Lodge',
      location: 'Өмнөговь, Цогт-Овоо сум',
      rating: 'Говийн тав тух',
      tag: 'Desert Lodge',
      desc: 'Цонхоороо говийн нар жаргахыг тольдох боломжтой, тансаг зэрэглэлийн өрөө, гэрүүд.',
      link: 'https://gobinomadlodge.com/',
      featured: false,
    },
    {
      name: 'Toilogt Ger Camp',
      location: 'Хөвсгөл нуур, баруун эрэг',
      rating: 'Байгальд ээлтэй',
      tag: 'Taiga & Lake',
      desc: 'Нуурын эрэг дээр байрлах, урц болон модон сийлбэрт гэрийн сонголттой бааз.',
      link: 'https://toilogt.mn/',
      featured: false,
    },
    {
      name: 'Maikhant Camp',
      location: 'Орхоны хөндий, Өвөрхангай',
      rating: 'Ус хүрхрээний дэргэд',
      tag: 'Waterfall View',
      desc: 'Улаан цутгалан хүрхрээнээс 3 км зайд байрлах тохилог жуулчны бааз.',
      link: 'https://www.facebook.com/maikhantcamp/',
      featured: false,
    },
    {
      name: 'Secret of Khentii Resort',
      location: 'Чингис хот, Хэнтий аймаг',
      rating: 'Түүхэн бүс',
      tag: 'Eastern Steppe',
      desc: 'Их Монгол Улсын түүхэн өлгий нутагт байрлах жилийн 4 улирлын амралтын газар.',
      link: 'https://mongolian-secret-history.mn/',
      featured: false,
    },
    {
      name: 'Altai Tour Camp',
      location: 'Баян-Өлгий, Өлгий хотын ойролцоо',
      rating: 'Баруун бүс',
      tag: 'Altai Mountains',
      desc: 'Казах үндэсний эсгий гэр, бүргэдчдийн тосгоноор аялахад түшиц болох бааз.',
      link: 'https://www.facebook.com/altaitourcamp/',
      featured: false,
    },
  ],
  gerCamps: [
    {
      name: 'Three Camel Lodge',
      location: 'Гурвантэс сум, Өмнөговь',
      rating: 'National Geographic Unique Lodge',
      tag: 'World-Class Luxury',
      desc: 'Дэлхийн шилдэг эко ложуудын нэг. Гэр дотроо байгалийн чулуун шүршүүр, зоогийн газар, од харах талбайтай.',
      link: 'https://www.threecamellodge.com/',
      featured: true,
    },
    {
      name: 'Terelj Luxury Ger Camp (Тэрэлж Лож)',
      location: 'Тэрэлж, Туул голын хөвөө',
      rating: 'Glamping & Spa',
      tag: 'Nomadic Chic',
      desc: 'Монгол гэрийн уламжлалыг ноолууран ор хөнжил, өндөр тав тухтай хослуулсан тансаг кэмп.',
      link: 'https://tereljlodge.com/',
      featured: true,
    },
    {
      name: 'Jalama Meadows Wilderness Camp',
      location: 'Хан Хэнтийн ТХГН, Туул голын эх',
      rating: 'Off-grid Luxury',
      tag: 'True Wilderness',
      desc: 'Машин хүрэхгүй онгон байгальд байрлах, морин аялалтай хосолсон эко гэр кэмп.',
      link: 'https://www.nomadicjourneys.com/camps/jalama-meadows/',
      featured: true,
    },
    // Нэмэлт
    {
      name: 'Gobi Oasis Luxury Camp',
      location: 'Баянзаг орчим, Өмнөговь',
      rating: 'Sunset View',
      tag: 'Glamping',
      desc: 'Улаан цавын дэргэд байрлах агааржуулагчтай, битүүмж сайтай тансаг гэрүүд.',
      link: 'https://www.facebook.com/GobiOasisMongolia/',
      featured: false,
    },
    {
      name: 'Sweet Gobi Geodome Camp',
      location: 'Элсэн тасархай, Өвөрхангай',
      rating: 'Eco Chic',
      tag: 'Desert Sands',
      desc: 'Франц-Монголын хамтарсан эко үзэл баримтлалтай, минимал тавилгатай эко кэмп.',
      link: 'https://www.mongolia-trips.com/travel-guide/accommodation/geolodges/sweet-gobi/',
      featured: false,
    },
    {
      name: 'Ursa Major Geolodge',
      location: 'Орхоны хөндий, Өвөрхангай',
      rating: 'Astronomy Lodge',
      tag: 'Stargazing',
      desc: 'Одон орон судлалын дурантай, байгаль орчинд 100% ул мөргүй ажилладаг гэр лож.',
      link: 'https://www.mongolia-trips.com/travel-guide/accommodation/geolodges/ursa-major/',
      featured: false,
    },
  ],
  hostels: [
    {
      name: 'Danista Nomads Guesthouse',
      location: 'Хотын төв, Улаанбаатар',
      rating: 'Booking.com 9.2+',
      tag: 'Backpacker Hub',
      desc: 'Олон улсын аялагчдын дунд танил болсон, өглөөний цайтай, тур зохион байгуулдаг төв.',
      link: 'https://danistanomads.com/',
      featured: true,
    },
    {
      name: 'Top Tour & Guesthouse Mongolia',
      location: 'Энхтайваны өргөн чөлөө, Улаанбаатар',
      rating: 'Budget Friendly',
      tag: 'Solo Traveler',
      desc: 'Аяллын маршрутад хамтрагч хайх залууст тохиромжтой, төвдөө ойр үнэ багатай хостел.',
      link: 'https://toptourguesthouse.com/',
      featured: true,
    },
    {
      name: 'Khuvsgul Inn Hostel',
      location: 'Мөрөн хот, Хөвсгөл',
      rating: 'Local Gateway',
      tag: 'Regional Hub',
      desc: 'Хөвсгөл далай руу явах аялагчдад зориулсан Мөрөн хотын цэвэрхэн, найрсаг хостел.',
      link: 'https://www.facebook.com/KhuvsgulInn/',
      featured: true,
    },
    // Нэмэлт
    {
      name: 'Golden Gobi Guesthouse',
      location: 'Хотын төв, Улаанбаатар',
      rating: 'Longevity Favorite',
      tag: 'Tour Friendly',
      desc: '20 гаруй жил үйл ажиллагаа явуулж буй хямд өртөгтэй аяллын түшиц газар.',
      link: 'http://www.goldengobi.com/',
      featured: false,
    },
    {
      name: 'Sunpath Mongolia Hostel',
      location: 'Баянгол дүүрэг, Улаанбаатар',
      rating: 'Community Hub',
      tag: 'Adventure Base',
      desc: 'Төсөвт бүлгийн аяллуудаараа гаднын залуусын дунд өндөр үнэлгээтэй.',
      link: 'https://sunpath-mongolia.com/',
      featured: false,
    },
    {
      name: 'Altai Nomads Homestay & Hostel',
      location: 'Өлгий хот, Баян-Өлгий',
      rating: 'Western Gateway',
      tag: 'Trekker Base',
      desc: 'Алтай Таван Богд руу явах аялагчдын уулзах төв цэг.',
      link: 'https://www.facebook.com/AltaiNomadsHomestay/',
      featured: false,
    },
  ],
  nomadStay: [
    {
      name: 'Ger to Ger Mongolia',
      location: 'Монгол орон даяар (Төв, Говь, Алтай)',
      rating: 'Community Tourism',
      tag: 'True Nomadic',
      desc: 'Малчин өрхүүдийг шууд дэмждэг олон улсад нэр хүндтэй жинхэнэ нүүдэлчин ахуйн төсөл.',
      link: 'https://www.gertoger.org/',
      featured: true,
    },
    {
      name: 'Pastoral Nomads Network',
      location: 'Орхоны хөндий, Өвөрхангай',
      rating: 'UNESCO Heritage',
      tag: 'Cultural Heritage',
      desc: 'Орхоны хөндийн малчин айлуудын өдөр тутмын ажил, сааль, нүүдэлд хамрагдах хөтөлбөр.',
      link: 'https://www.mongolia-trips.com/travel-guide/accommodation/homestay/',
      featured: true,
    },
    // Нэмэлт
    {
      name: 'Khovsgol Reindeer (Tsaatan) Homestay',
      location: 'Цагааннуур сум, Хөвсгөл тайга',
      rating: 'Taiga Nomads',
      tag: 'Rare Experience',
      desc: 'Тайгын цаатан иргэдийн урцанд хоноглож, цаа бугын аж ахуйтай танилцах хөтөлбөр.',
      link: 'https://www.visitmongolia.com/tours/reindeer-people-tour/',
      featured: false,
    },
    {
      name: 'Eagle Hunters Family Homestay',
      location: 'Сагсай сум, Баян-Өлгий',
      rating: 'Eagle Falconry',
      tag: 'Kazakh Culture',
      desc: 'Бүргэдчин айлын эсгий гэрт амьдарч, бүргэдээр ан хийх уламжлалыг дэргэдээс нь мэдрэх боломж.',
      link: 'https://www.discover-bayanolgii.com/eagle-hunter-homestay/',
      featured: false,
    },
  ],
};

const ACCOMMODATION_COMPARISON = [
  {
    type: 'Олон улсын & Хотын зочид буудал',
    location: 'Улаанбаатар & Аймгийн төвүүд',
    comfort: '⭐⭐⭐⭐⭐',
    wifi: 'Өндөр хурдны Wi-Fi',
    bathroom: 'Өрөөндөө хувийн ванн, 00-той',
    price: '$80 - $250+ / шөнө',
  },
  {
    type: 'Стандарт жуулчны бааз (Tourist Camp)',
    location: 'Хөвсгөл, Говь, Тэрэлж, Архангай',
    comfort: '⭐⭐⭐⭐',
    wifi: 'Ресторан/Лобби орчимд',
    bathroom: 'Тусдаа байрлах нийтийн халуун шүршүүр',
    price: '$50 - $120 / шөнө (Хоол багтсан)',
  },
  {
    type: 'Дээд зэрэглэлийн гэр кэмп (Luxury Ger Camp)',
    location: 'Өмнөговь, Тэрэлж, Орхоны хөндий',
    comfort: '⭐⭐⭐⭐⭐',
    wifi: 'Хязгаарлагдмал / Starlink',
    bathroom: 'Гэр дотроо хувийн эко шүршүүр, 00',
    price: '$300 - $800+ / шөнө',
  },
  {
    type: 'Guesthouse & Hostel',
    location: 'Улаанбаатар хот & Орон нутгийн төв',
    comfort: '⭐⭐⭐',
    wifi: 'Бүрэн боломжтой',
    bathroom: 'Нийтийн дундын ариун цэврийн өрөө',
    price: '$15 - $40 / ор',
  },
  {
    type: 'Малчин айлын гэрт хоноглох (Nomad Homestay)',
    location: 'Хөдөө хээр, малчны өвөлжөө/зуслан',
    comfort: '⭐⭐ (Ахуйн нөхцөл)',
    wifi: 'Сүлжээгүй байх нь элбэг',
    bathroom: 'Хөдөөгийн задгай байгалийн 00',
    price: '$20 - $40 / шөнө (Гэрийн хоолтой)',
  },
];

export default function AccommodationPage() {
  const [activeNav, setActiveNav] = useState('hotels');

  // "Бүгдийг үзэх" дэлгэх төлөвүүд
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    hotels: false,
    touristCamps: false,
    gerCamps: false,
    hostels: false,
    nomadStay: false,
  });

  const toggleExpand = (sectionKey: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const navItems = [
    { id: 'hotels', label: '01. Зочид буудал (Hotels)' },
    { id: 'tourist-camps', label: '02. Жуулчны бааз (Tourist Camps)' },
    { id: 'ger-camps', label: '03. Ger Camp & Glamping' },
    { id: 'hostels', label: '04. Guesthouse / Hostel' },
    { id: 'nomad-stay', label: '05. Малчин айлын байр (Homestay)' },
    { id: 'comparison', label: '06. Харьцуулсан хүснэгт' },
  ];

  // Туслах функц: Карт зурах
  const renderCards = (places: typeof ACCOMMODATION_DATABASE.hotels, isExpanded: boolean) => {
    const list = isExpanded ? places : places.filter((p) => p.featured);
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((place, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[#fcfbf9] border border-neutral-200 flex flex-col justify-between hover:border-neutral-300 hover:shadow-sm transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="text-sm font-bold text-neutral-900 leading-snug">{place.name}</h4>
                <span className="text-[10px] font-mono font-bold bg-neutral-200/70 text-neutral-700 px-2 py-0.5 rounded shrink-0">
                  {place.tag}
                </span>
              </div>
              <div className="text-[11px] text-[#15803d] font-semibold mb-2 flex items-center gap-1.5">
                <span>📍 {place.location}</span>
                <span>•</span>
                <span>{place.rating}</span>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-4">
                {place.desc}
              </p>
            </div>

            <a
              href={place.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-between w-full pt-3 border-t border-neutral-200/60 text-xs font-bold text-[#15803d] hover:text-emerald-950 transition-colors"
            >
              <span>Албан ёсны сайт / Захиалах</span>
              <span>↗</span>
            </a>
          </div>
        ))}
      </div>
    );
  };

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
              ACCOMMODATION DIRECTORY
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            Байрлах газар & Захиалгын лавлах
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
            Монголд байрлах 5 үндсэн орчин, тэдгээрийн ялгаа болон албан ёсны сайтаар шууд холбогдож захиалах боломжтой баталгаат зочид буудал, жуулчны баазуудын нэгдсэн сантай танилцаарай.
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
              href="/plan/getting-around"
              className="text-[11px] font-semibold text-neutral-500 hover:text-neutral-900 px-2"
            >
              ← Өмнөх: 03. Дотор аялах
            </Link>
            <Link
              href="/plan/services"
              className="text-[11px] font-bold text-[#15803d] hover:text-emerald-950 flex items-center justify-between px-2"
            >
              <span>Дараах: 05. Үйлчилгээ</span>
              <span>→</span>
            </Link>
          </div>
        </aside>

        {/* Баруун талын дэлгэрэнгүй хэсгүүд */}
        <div className="flex-1 w-full space-y-16">

          {/* 01. ЗОЧИД БУУДАЛ */}
          <section id="hotels" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 01</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Зочид буудал (Hotels)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Нийслэл хотын олон улсын 5 одтой буудлуудаас эхлээд орон нутгийн төвүүдэд байрлах бизнес болон стандарт зочид буудлууд.
            </p>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Санал болгох зочид буудлууд ({ACCOMMODATION_DATABASE.hotels.length})
              </h3>
              <button
                type="button"
                onClick={() => toggleExpand('hotels')}
                className="text-xs font-bold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{expandedSections.hotels ? 'Хураах ▴' : 'Бүгдийг үзэх (Бусад 5 газар) ▾'}</span>
              </button>
            </div>

            {renderCards(ACCOMMODATION_DATABASE.hotels, expandedSections.hotels)}
          </section>

          {/* 02. ЖУУЛЧНЫ БААЗ */}
          <section id="tourist-camps" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Жуулчны бааз (Tourist Camps)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Хөвсгөл, Говь, Тэрэлж, Архангай зэрэг гол бүс нутгуудад байрлах уламжлалт гэр, халуун шүршүүр, зоогийн газар бүхий баазууд.
            </p>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Санал болгох баазууд ({ACCOMMODATION_DATABASE.touristCamps.length})
              </h3>
              <button
                type="button"
                onClick={() => toggleExpand('touristCamps')}
                className="text-xs font-bold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{expandedSections.touristCamps ? 'Хураах ▴' : 'Бүгдийг үзэх (Бусад 5 бааз) ▾'}</span>
              </button>
            </div>

            {renderCards(ACCOMMODATION_DATABASE.touristCamps, expandedSections.touristCamps)}
          </section>

          {/* 03. GER CAMP & GLAMPING */}
          <section id="ger-camps" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Тансаг зэрэглэлийн Ger Camp & Glamping
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Өрөөндөө хувийн шүршүүртэй, дээд зэрэглэлийн тавилгатай, дэлхийн жишигт нийцсэн тансаг зэрэглэлийн эко ложууд.
            </p>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Шилдэг Glamping баазууд ({ACCOMMODATION_DATABASE.gerCamps.length})
              </h3>
              <button
                type="button"
                onClick={() => toggleExpand('gerCamps')}
                className="text-xs font-bold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{expandedSections.gerCamps ? 'Хураах ▴' : 'Бүгдийг үзэх (Нэмэлт ложууд) ▾'}</span>
              </button>
            </div>

            {renderCards(ACCOMMODATION_DATABASE.gerCamps, expandedSections.gerCamps)}
          </section>

          {/* 04. GUESTHOUSE / HOSTEL */}
          <section id="hostels" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 04</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Guesthouse & Hostel (Төсөвт аялагчид)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Үүргэвчтэй аялагчид, залуус, аяллын хамтрагч хайж буй хүмүүст тохирсон өртөг багатай тохилог байрууд.
            </p>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Санал болгох гестхаусууд ({ACCOMMODATION_DATABASE.hostels.length})
              </h3>
              <button
                type="button"
                onClick={() => toggleExpand('hostels')}
                className="text-xs font-bold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{expandedSections.hostels ? 'Хураах ▴' : 'Бүгдийг үзэх ▾'}</span>
              </button>
            </div>

            {renderCards(ACCOMMODATION_DATABASE.hostels, expandedSections.hostels)}
          </section>

          {/* 05. МАЛЧИН АЙЛЫН ГЭРТ ХОНОГЛОХ */}
          <section id="nomad-stay" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 05</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Малчин айлын гэрт хоноглох (Nomad Homestay)
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              Орон нутгийн малчдын гэрт зочилж, нүүдэлчдийн өдөр тутмын ахуйд шууд оролцох боломжтой сүлжээнүүд.
            </p>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                Холбогдох сүлжээ & Төслүүд ({ACCOMMODATION_DATABASE.nomadStay.length})
              </h3>
              <button
                type="button"
                onClick={() => toggleExpand('nomadStay')}
                className="text-xs font-bold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{expandedSections.nomadStay ? 'Хураах ▴' : 'Бүгдийг үзэх ▾'}</span>
              </button>
            </div>

            {renderCards(ACCOMMODATION_DATABASE.nomadStay, expandedSections.nomadStay)}
          </section>

          {/* 06. ХАРЬЦУУЛСАН ХҮСНЭГТ */}
          <section id="comparison" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 06</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2">
              Байрлах газрын харьцуулсан хүснэгт
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mb-6 font-normal">
              Өөрийн аяллын төсөв болон тав тухын хэрэгцээндээ тохируулан сонгоорой:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-400 font-mono uppercase text-[10px]">
                    <th className="py-3 px-3">Төрөл</th>
                    <th className="py-3 px-3">Байршил</th>
                    <th className="py-3 px-3">Тав тух</th>
                    <th className="py-3 px-3">Интернет</th>
                    <th className="py-3 px-3">Ариун цэврийн өрөө</th>
                    <th className="py-3 px-3">Үнийн баримжаа</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-normal">
                  {ACCOMMODATION_COMPARISON.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#fcfbf9] transition-colors">
                      <td className="py-3.5 px-3 font-bold text-neutral-900">{item.type}</td>
                      <td className="py-3.5 px-3 text-neutral-600">{item.location}</td>
                      <td className="py-3.5 px-3">{item.comfort}</td>
                      <td className="py-3.5 px-3 text-neutral-600">{item.wifi}</td>
                      <td className="py-3.5 px-3 text-neutral-600">{item.bathroom}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#15803d]">{item.price}</td>
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

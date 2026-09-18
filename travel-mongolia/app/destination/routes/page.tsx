'use client';

import React, { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

import { RouteMapData } from '@/components/RealRouteMap';

const RealRouteMap = dynamic(() => import('@/components/RealRouteMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[550px] flex items-center justify-center bg-neutral-100 rounded-2xl text-neutral-500 font-semibold text-sm">
      Интерактив газрын зургийг ачааллаж байна...
    </div>
  ),
});

interface RouteItem extends RouteMapData {
  id: string;
  subtitle: string;
  road: string;
  season: string;
  desc: string;
  image: string;
}

const ROUTES_LIST: RouteItem[] = [
  {
    id: 'gobi-circuit',
    name: 'Говийн тойрог',
    subtitle: 'Classic Gobi Desert Loop',
    duration: '7 хоног',
    distance: '1,850 км',
    road: 'Засмал & шороон зам',
    season: '5–10 сар',
    desc: 'Цагаан суваргын шохойн цайз, Ёлын амны мөст хавцал, Хонгорын дуут элсэн манхан болон үлэг гүрвэлийн өлгий Баянзагийг тойрох их зам.',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    stops: [
      { name: 'Улаанбаатар', coord: [47.9188, 106.9176], highlight: 'Аяллын гарааны цэг' },
      { name: 'Цагаан суварга', coord: [44.7554, 105.7483], highlight: 'Эртний далайн ёроолын шавар хавцал' },
      { name: 'Ёлын ам', coord: [43.4883, 104.0722], highlight: 'Зуны халуунд ч мөстэй нарийн хавцал' },
      { name: 'Хонгорын элс', coord: [43.7258, 102.3258], highlight: '180 км үргэлжлэх дуут манхан' },
      { name: 'Баянзаг', coord: [44.1567, 103.7144], highlight: 'Үлэг гүрвэлийн өндөг олдсон өлгий' },
      { name: 'Онгийн хийд', coord: [45.3347, 102.8333], highlight: 'Говийн түүхэн хийдийн туурь' },
    ],
    coords: [
      [47.9188, 106.9176],
      [45.7625, 106.2711],
      [44.7554, 105.7483],
      [43.5658, 104.4250],
      [43.4883, 104.0722],
      [43.7258, 102.3258],
      [44.1567, 103.7144],
      [45.3347, 102.8333],
      [47.9188, 106.9176],
    ],
  },
  {
    id: 'orkhon-valley',
    name: 'Орхоны хөндийн маршрут',
    subtitle: 'Historic Orkhon Valley Route',
    duration: '5 хоног',
    distance: '980 км',
    road: 'Засмал голлосон',
    season: '6–9 сар',
    desc: 'Их Монгол Улсын нийслэл Хархорум, Эрдэнэ зуу хийд, базальт хадан хавцлаар буух Улаан цутгалан хүрхрээ болон Цэнхэрийн халуун рашааны зам.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    stops: [
      { name: 'Улаанбаатар', coord: [47.9188, 106.9176], highlight: 'Нийслэл хотоос эхэлнэ' },
      { name: 'Элсэн тасархай', coord: [47.3828, 103.6558], highlight: 'Хангай, говь хосолсон элсэн манхан' },
      { name: 'Хархорин (Эрдэнэ зуу)', coord: [47.1983, 102.8467], highlight: 'Эзэнт гүрний нийслэл хот' },
      { name: 'Улаан цутгалан', coord: [46.7872, 101.9706], highlight: 'Орхон голын 20м өндөр их хүрхрээ' },
      { name: 'Цэнхэрийн халуун рашаан', coord: [47.3333, 101.6667], highlight: '86°C байгалийн халуун ундарга' },
    ],
    coords: [
      [47.9188, 106.9176],
      [47.3828, 103.6558],
      [47.1983, 102.8467],
      [46.7872, 101.9706],
      [47.3333, 101.6667],
      [47.9188, 106.9176],
    ],
  },
  {
    id: 'khuvsgul-route',
    name: 'Хөвсгөлийн маршрут',
    subtitle: 'Northern Lake Khuvsgul Expedition',
    duration: '6 хоног',
    distance: '1,650 км',
    road: 'Бүрэн засмал зам',
    season: '6–9 сар',
    desc: 'Хангайн үзэсгэлэнт ойн бүсээр аялж Амарбаясгалант хийд, Уран тогоо галт уул болон дэлхийн цэвэр цэнгэг Хөвсгөл нуурыг зорих их зам.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    stops: [
      { name: 'Улаанбаатар', coord: [47.9188, 106.9176], highlight: 'Гараа' },
      { name: 'Амарбаясгалант хийд', coord: [49.4794, 105.0847], highlight: 'XVII зууны Буддын архитектурын өв' },
      { name: 'Уран тогоо', coord: [48.9889, 102.7361], highlight: 'Ой модоор хүрээлэгдсэн галт уул' },
      { name: 'Мөрөн хот', coord: [49.6342, 100.1606], highlight: 'Хөвсгөл аймгийн төв' },
      { name: 'Хатгал (Хөвсгөл нуур)', coord: [50.4358, 100.1558], highlight: 'Дэлхийн цэнгэг усны хосгүй сувд' },
    ],
    coords: [
      [47.9188, 106.9176],
      [49.4794, 105.0847],
      [48.9889, 102.7361],
      [49.6342, 100.1606],
      [50.4358, 100.1558],
      [50.9500, 100.4500],
    ],
  },
  {
    id: 'altai-route',
    name: 'Алтайн маршрут',
    subtitle: 'Western Altai Mountain Route',
    duration: '12 хоног',
    distance: '3,200 км',
    road: 'Бартаат уулын зам',
    season: '6–8 сар',
    desc: 'Монгол орны хамгийн өндөр цэг Алтай Таван Богд, Потанины мөсөн гол, өндөр уулын Хотон, Хурган нуурууд болон казах түмний соёлыг үзэх зам.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    stops: [
      { name: 'Өлгий хот', coord: [48.9708, 89.9622], highlight: 'Аяллын гараа, Баян-Өлгий аймаг' },
      { name: 'Толбо нуур', coord: [48.5600, 90.0900], highlight: 'Өндөр уулын тунгалаг нуур' },
      { name: 'Цагаан голын хөндий', coord: [49.0800, 88.5200], highlight: 'Сүү шиг цагаан туяат уулын гол' },
      { name: 'Алтай Таван Богд', coord: [49.1464, 87.8183], highlight: 'Хүйтэн оргил 4,374 м, мөсөн гол' },
      { name: 'Хотон нуур', coord: [48.6667, 88.3500], highlight: 'Тайга, уул хосолсон үзэсгэлэнт нуур' },
    ],
    coords: [
      [48.9708, 89.9622],
      [48.5600, 90.0900],
      [49.0800, 88.5200],
      [49.1464, 87.8183],
      [48.6667, 88.3500],
      [48.9708, 89.9622],
    ],
  },
  {
    id: 'eastern-route',
    name: 'Зүүн Монголын маршрут',
    subtitle: 'Eastern Steppes & Historic Route',
    duration: '6 хоног',
    distance: '1,450 км',
    road: 'Тал хээр, засмал',
    season: '6–9 сар',
    desc: 'Чингис хааны өлгий нутаг Дэлүүн болдог, Бурхан Халдун хайрхан, дэлхийн хамгийн том Мэнэнгийн уудам тал болон Буйр нуурыг холбосон зам.',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
    stops: [
      { name: 'Улаанбаатар', coord: [47.9188, 106.9176], highlight: 'Гараа' },
      { name: 'Цонжин болдог', coord: [47.8114, 107.5317], highlight: '40 м өндөр Чингисийн морьт хөшөө' },
      { name: 'Бурхан Халдун', coord: [48.7892, 108.9772], highlight: 'ЮНЕСКО дэлхийн өв, тахилгат хайрхан' },
      { name: 'Мэнэнгийн тал', coord: [47.4500, 115.5000], highlight: 'Дэлхийн хамгийн том уудам тал' },
      { name: 'Буйр нуур', coord: [47.7833, 117.7500], highlight: 'Дорнод Монголын элсэн эрэгт нуур' },
    ],
    coords: [
      [47.9188, 106.9176],
      [47.8114, 107.5317],
      [48.7892, 108.9772],
      [47.4500, 115.5000],
      [47.7833, 117.7500],
    ],
  },
  {
    id: 'ub-daytrips',
    name: 'Улаанбаатараас гарах богино замууд',
    subtitle: 'Weekend Getaways from UB',
    duration: '1–2 өдөр',
    distance: '150–350 км',
    road: 'Бүрэн засмал зам',
    season: 'Бүх улиралд',
    desc: 'Амралтын өдрүүдээр Горхи-Тэрэлж, Манзушир хийд, Чингисийн морьт хөшөө болон Хустайн нурууны тахийг үзэх нийслэл орчмын маршрутууд.',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200',
    stops: [
      { name: 'Улаанбаатар', coord: [47.9188, 106.9176], highlight: 'Төв цэг' },
      { name: 'Горхи-Тэрэлж', coord: [47.9167, 107.4500], highlight: 'Мэлхий хад, Аръяабал хийд' },
      { name: 'Цонжин болдог', coord: [47.8114, 107.5317], highlight: 'Чингис хааны морьт цогцолбор' },
      { name: 'Хустайн нуруу', coord: [47.7000, 105.9000], highlight: 'Онгон зэрлэг тахь адуу' },
    ],
    coords: [
      [47.9188, 106.9176],
      [47.9167, 107.4500],
      [47.8114, 107.5317],
      [47.7000, 105.9000],
      [47.9188, 106.9176],
    ],
  },
];

export default function ScenicRoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState<RouteItem>(ROUTES_LIST[0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-[#f8fafc] text-neutral-900 pb-20 font-sans selection:bg-[#15803d] selection:text-white">
      
     {/* 1. HERO ТОМ ЗУРАГТАЙ ТОЛГОЙ ХЭСЭГ */}
      <section className="relative w-full h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2400"
          alt="Аяллын маршрут, замаар"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.45]"
        />
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-xs sm:text-sm font-black mb-3 block">
            06. Scenic Routes & Travel Corridors
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-3">
            Аяллын маршрут, замаар
          </h1>
          <p className="text-white/90 text-base sm:text-lg font-normal max-w-2xl mx-auto">
            Жинхэнэ хиймэл дагуул, авто замын зураг дээр маршрутаа сонгож, хоорондын зай болон зогсоолуудаа бодитоор төлөвлөөрэй.
          </p>
        </div>
      </section>

      {/* 2. НАВИГАЦИ: СУМАН ТОХИРГООТОЙ, ТАСРАХГҮЙ ЦЭВЭРХЭН ХУВИЛБАР */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
        <div className="w-full max-w-7xl mx-auto flex items-center gap-2 px-4 sm:px-8 py-3">
          {/* Зүүн тийш гүйлгэх сум */}
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous"
            className="shrink-0 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Голын гүйдэг товчлуурууд */}
          <div
            ref={scrollRef}
            className="flex-1 flex items-center gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden pr-6"
          >
            {ROUTES_LIST.map((route) => (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedRoute.id === route.id
                    ? 'bg-[#15803d] text-white shadow-md shadow-emerald-700/25 scale-102'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {route.name}
              </button>
            ))}
          </div>

          {/* Баруун тийш гүйлгэх сум */}
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next"
            className="shrink-0 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-sm flex items-center justify-center text-neutral-700 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. ЖИНХЭНЭ ИНТЕРАКТИВ ГАЗРЫН ЗУРАГ БА МЭДЭЭЛЛИЙН САМБАР */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="relative w-full bg-white rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col lg:flex-row">
          
          {/* ЗҮҮН ТАЛ: ТУХАЙН МАРШРУТЫН МЭДЭЭЛЛИЙН САМБАР */}
          <div className="w-full lg:w-[420px] bg-white border-b lg:border-b-0 lg:border-r border-neutral-200 shrink-0 p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              <div className="relative w-full h-48 sm:h-52 rounded-2xl overflow-hidden shadow-xs">
                <Image
                  src={selectedRoute.image}
                  alt={selectedRoute.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
                    {selectedRoute.subtitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black">{selectedRoute.name}</h2>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Хугацаа:</span>
                  <span className="font-extrabold text-neutral-900 text-sm">⏱ {selectedRoute.duration}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                  <span className="text-neutral-400 block text-[11px]">Замын урт:</span>
                  <span className="font-extrabold text-[#15803d] text-sm">📍 {selectedRoute.distance}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                {selectedRoute.desc}
              </p>

              <div className="space-y-2">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-wider block">
                  Замын зогсоолууд ({selectedRoute.stops.length}):
                </span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {selectedRoute.stops.map((stop, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-xs p-2 rounded-xl bg-neutral-50 hover:bg-emerald-50/60 border border-neutral-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center font-bold text-[10px]">
                          {i + 1}
                        </span>
                        <span className="font-bold text-neutral-800">{stop.name}</span>
                      </div>
                      <span className="text-neutral-400 text-[10px] truncate max-w-[140px]">{stop.highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <Link
              href={`/destination/routes/${selectedRoute.id}`}
              className="w-full py-3.5 px-4 rounded-xl bg-[#15803d] hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <span>Дэлгэрэнгүй маршрут, бааз & зочид буудал</span>
              <span>→</span>
            </Link>
          </div>

          {/* БАРУУН ТАЛ: БОДИТ LEAFLET ИНТЕРАКТИВ ГАЗРЫН ЗУРАГ */}
          <div className="flex-1 bg-slate-100 relative min-h-[550px] lg:min-h-[640px]">
            <RealRouteMap route={selectedRoute} />
          </div>

        </div>
      </div>

    </main>
  );
}

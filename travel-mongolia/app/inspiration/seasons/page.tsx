'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';


interface SeasonItem {
  id: string;
  name: string;
  enName: string;
  period: string;
  temp: string;
  image: string;
  tagline: string;
  description: string;
  highlights: string[];
  bestPlaces: string[];
}

const SEASONS_DATA: SeasonItem[] = [
  {
    id: 'spring',
    name: 'Хавар',
    enName: 'Spring Awakening',
    period: '3 – 5 сар',
    temp: '-5°C ~ +15°C',
    image: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Шинэ амьдралын эхлэл ба нүүдэлчдийн төл малын дуун',
    description: 'Цас ханзарч, байгаль дэлхий нойрноосоо сэрэх цаг. Нүүдэлчин ахуйн хамгийн завгүй, амьдрал буцалсан үе.',
    highlights: ['Мал төллөх үе', 'Тэмээний баяр', 'Бүргэдийн хаврын баяр'],
    bestPlaces: ['Өмнөговь (Ёлын ам)', 'Дорноговь (Шамбалын орон)', 'Төв аймаг'],
  },
  {
    id: 'summer',
    name: 'Зун',
    enName: 'Lush Green Horizons',
    period: '6 – 8 сар',
    temp: '+18°C ~ +30°C',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Ногоон тал, цэлмэг нуур, нүүдэлчдийн их наадам',
    description: 'Дэлхий ногоон хилэн дээлээ өмсөж, аялал жуулчлалын ид оргил үе. Гол мөрөн, цэнгэг нуурууд усанд сэлэх, морь унахад төгс зохицдог.',
    highlights: ['Үндэсний Их Баяр Наадам', 'Морин аялал', 'Орхоны хөндийн майхантай аялал'],
    bestPlaces: ['Хөвсгөл нуур', 'Орхоны хөндий', 'Тэрхийн цагаан нуур'],
  },
  {
    id: 'autumn',
    name: 'Намар',
    enName: 'Golden Silence',
    period: '9 – 10 сар',
    temp: '+5°C ~ +18°C',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Алтан шаргал тайга, налгар намрын цэлмэг тэнгэр',
    description: 'Байгалийн гэрэл зурагчдын хамгийн дуртай улирал. Зөөлөн нар, шаргал модод, анир чимээгүй нам тайван орчин.',
    highlights: ['Бүргэдийн их баяр (Баян-Өлгий)', 'Шинэ айраг, сүүний найр', 'Тайгын явган аялал'],
    bestPlaces: ['Баян-Өлгий (Алтайн уулс)', 'Горхи Тэрэлж', 'Хэнтийн тайга'],
  },
  {
    id: 'winter',
    name: 'Өвөл',
    enName: 'Pure White Solitude',
    period: '11 – 2 сар',
    temp: '-15°C ~ -30°C',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    tagline: 'Мөнгөн цас, тунгалаг мөс, жинхэнэ тэсвэр хатуужлын сорил',
    description: 'Цэнхэр тэнгэрийн доорх хязгааргүй цасан цагаан тал. Хөвсгөлийн толин тунгалаг цэнхэр мөс дээгүүр чаргаар гулгах ховор мэдрэмж.',
    highlights: ['Мөсний баяр (Хөвсгөл)', 'Цагаан сарын уламжлалт баяр', 'Мөсөн дээрх нохой чарга'],
    bestPlaces: ['Хөвсгөлийн мөсөн далай', 'Улаанбаатар (Sky Resort)', 'Хонгорын элсний өвөл'],
  },
];

function SeasonsContent() {
  const searchParams = useSearchParams();
  const seasonParam = searchParams.get('season');
  const [activeSeason, setActiveSeason] = useState<string>('summer');

  useEffect(() => {
    if (seasonParam && SEASONS_DATA.some((s) => s.id === seasonParam)) {
      setActiveSeason(seasonParam);
    }
  }, [seasonParam]);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 flex flex-col justify-between pb-8">
      {/* Дээд хэсэг: Толгой мэдээлэл */}
      <div className="pt-10 pb-6 px-6 sm:px-12 max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-200">
        <div>
          <span className="text-[11px] font-bold tracking-[0.3em] text-[#15803d] uppercase block mb-1">
            02. АЯЛАХ СЭДЭЛ
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
            Дөрвөн Улирлаар
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-normal leading-relaxed">
          Монгол орон улирал бүрт тэс ондоо байгалийн өнгө төрх, соёлын гайхамшгийг өөртөө нуудаг.
        </p>
      </div>

      {/* 4 Баганат Interactive Split Showcase */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col lg:flex-row min-h-[580px] lg:min-h-[640px] p-4 sm:p-6 gap-4">
        {SEASONS_DATA.map((season) => {
          const isActive = activeSeason === season.id;

          return (
            <div
              key={season.id}
              onClick={() => setActiveSeason(season.id)}
              className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-out flex flex-col justify-end border ${
                isActive
                  ? 'lg:flex-[3.5] flex-[4] border-[#15803d]/40 shadow-xl ring-2 ring-[#15803d]/20'
                  : 'lg:flex-[1] flex-[1] border-neutral-200 hover:border-neutral-300 shadow-sm bg-white'
              }`}
            >
              {/* Арын дэвсгэр зураг */}
              <img
                src={season.image}
                alt={season.name}
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${
                  isActive ? 'scale-105 opacity-90' : 'opacity-70 hover:opacity-85'
                }`}
              />

              {/* Өнгө уусгалт */}
              <div
                className={`absolute inset-0 transition-opacity duration-700 ${
                  isActive
                    ? 'bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent'
                    : 'bg-neutral-950/30 hover:bg-neutral-950/20'
                }`}
              />

              {/* Хураангуй харагдац (Багана нарийн үед) */}
              {!isActive && (
                <div className="relative z-10 p-6 flex lg:flex-col items-center justify-between h-full">
                  <span className="text-xs font-bold text-white bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full tracking-wider">
                    {season.period}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white drop-shadow-md lg:[writing-mode:vertical-rl] lg:rotate-180">
                    {season.name}
                  </h3>
                  <span className="text-xs text-white/90 font-mono bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-md">
                    {season.temp}
                  </span>
                </div>
              )}

              {/* Дэлгэгдсэн дэлгэрэнгүй мэдээлэл (Идэвхтэй үед) */}
              {isActive && (
                <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-white">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="bg-[#15803d] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      {season.period}
                    </span>
                    <span className="text-xs font-mono text-neutral-200 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      Дундаж хэм: {season.temp}
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mb-2 text-white">
                    {season.name}
                  </h2>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-300 mb-3 tracking-wide">
                    {season.tagline}
                  </p>
                  <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed font-light mb-6 line-clamp-3 sm:line-clamp-none">
                    {season.description}
                  </p>

                  {/* Highlights & Best Places */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/20">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mb-2">
                        Онцлох үйл ажиллагаа:
                      </span>
                      <ul className="space-y-1 text-xs text-neutral-200">
                        {season.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-300 block mb-2">
                        Аялахад тохиромжтой:
                      </span>
                      <ul className="space-y-1 text-xs text-neutral-200">
                        {season.bestPlaces.map((p, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Доод хөл тайлбар */}
      <div className="pt-2 px-6 max-w-7xl mx-auto w-full flex items-center justify-between text-xs text-neutral-500">
        <span>Улирлын багана дээр дарж дэлгэрүүлэн үзнэ үү</span>
        <Link href="/inspiration/styles" className="font-semibold text-[#15803d] hover:text-emerald-950 transition-colors">
          Дараах: 03. Хэв маягаар →
        </Link>
      </div>
    </main>
  );
}

export default function SeasonsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9] text-neutral-700 p-10">Уншиж байна...</div>}>
      <SeasonsContent />
    </Suspense>
  );
}

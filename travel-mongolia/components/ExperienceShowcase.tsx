'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';

interface ActivityItem {
  id: string;
  title: string;
  category: string;
  difficulty: 'Хялбар' | 'Дунд' | 'Ахисан';
  duration: string;
  bestSeason: string;
  location: string;
  description: string;
  highlights: string[];
  imageUrl: string;
}

const EXPERIENCES: ActivityItem[] = [
  {
    id: '1',
    title: 'Малчин айлд зочилж, нүүдэлчин ахуйг 24 цаг мэдрэх',
    category: 'nomadic',
    difficulty: 'Хялбар',
    duration: '1 өдөр / 1 шөнө',
    bestSeason: '6 – 9 сар',
    location: 'Төв, Архангай',
    description: 'Жинхэнэ монгол гэрт хоноглож, өглөө үнээ саах, цагаан идээ боловсруулах, таван хошуу малын бэлчээрт хамт гарч нүүдэлчдийн гүн ухаантай биечлэн танилцана.',
    highlights: ['Монгол гэр барьж сурах', 'Айраг, цагаан идээний гар арга', 'Малчин айлын өглөөний зоог'],
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
  },
  {
    id: '2',
    title: 'Өмнөд говийн гүнд одон орон (Stargazing) ба Астро гэрэл зураг',
    category: 'nature',
    difficulty: 'Хялбар',
    duration: 'Шөнийн 6 цаг',
    bestSeason: '5 – 10 сар',
    location: 'Өмнөговь, Их газрын чулуу',
    description: 'Гэрлийн бохирдолгүй говийн уудам тэнгэрт Сүүн зам, оддын мананцрыг дуран авайгаар ажиглаж, мэргэжлийн гэрэл зурагчны хамт шөнийн зураг авалт хийнэ.',
    highlights: ['Телескопоор гариг эрхэс харах', 'Астрофотографийн зааварчилгаа', 'Шөнийн галын дэргэдэх халуун цай'],
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
  },
  {
    id: '3',
    title: 'Орхоны хүрхрээ хүртэлх 4 өдрийн хээрийн морин аялал',
    category: 'nature',
    difficulty: 'Дунд',
    duration: '4 өдөр / 3 шөнө',
    bestSeason: '6 – 8 сар',
    location: 'Өвөрхангай, Орхоны хөндий',
    description: 'Дэлхийн өв Орхоны хөндийн үзэсгэлэнт уулс, лаавын чулуурхаг хөндийгөөр мориор аялж, үдэш бүр голын эрэгт майхантай хоноглох адал явдал.',
    highlights: ['Орхоны 20м хүрхрээ үзэх', 'Төвхөн хийдээр зочлох', 'Мэргэжлийн морин хөтөч дагалдана'],
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
  },
  {
    id: '4',
    title: 'Хустайн нуруунд зэрлэг тахь & буга ажиглах эко тур',
    category: 'wildlife',
    difficulty: 'Хялбар',
    duration: 'Хагас өдөр (5 цаг)',
    bestSeason: 'Жилийн дөрвөн улирал',
    location: 'Төв аймаг (УБ-аас 90 км)',
    description: 'Дэлхийд цор ганц үлдсэн зэрлэг адуу болох тахийг байгальд нь тольдож, экосистемийн нөхөн сэргээлтийн түүхийг биологич хөтчөөс сонсоно.',
    highlights: ['Тахийн сүрэгт ойртох', 'Байгаль хамгаалагчийн яриа', 'Хөнгөн явган алхалт'],
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200',
  },
  {
    id: '5',
    title: 'Жинхэнэ чулуун хорхог болон гүзээний боодог хийх мастеркласс',
    category: 'wildlife',
    difficulty: 'Хялбар',
    duration: '4 цаг',
    bestSeason: '5 – 10 сар',
    location: 'Хэнтий, Төв аймаг',
    description: 'Голын халуун чулууг галд улайсгаж, хонины махыг битүү жигнэж болгодог эртний монголчуудын хоол хийх өв соёлд гар бие оролцож зооглоно.',
    highlights: ['Улайссан чулуу атгах ёсон', 'Уламжлалт аргаар мах амтлах', 'Хээрийн халуун шөл зооглох'],
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
  },
  {
    id: '6',
    title: 'Цэнхэрийн халуун рашаан & Байгалийн иогийн алжаал тайлах өдрүүд',
    category: 'festivals',
    difficulty: 'Хялбар',
    duration: '3 өдөр / 2 шөнө',
    bestSeason: 'Жилийн дөрвөн улирал',
    location: 'Архангай, Цэнхэр сум',
    description: 'Газрын гүнээс оргилох 86 хэмийн байгалийн эрдэст халуун рашаанд орж, нарс моддын дунд өглөөний иог хийж бие сэтгэлээ бүрэн цэнэглээрэй.',
    highlights: ['Ил задгай халуун ванн', 'Ой тайгын цэвэр агаар', 'Бүрэн Detox цэс'],
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
  },
  {
    id: '7',
    title: 'Баян-Өлгийн Бүргэдийн баярын соёл, ангийн ёслол үзэх',
    category: 'festivals',
    difficulty: 'Дунд',
    duration: '3 өдөр',
    bestSeason: '10-р сар',
    location: 'Баян-Өлгий аймаг',
    description: 'Казах түмний мянган жилийн шувуулахуйн өв, гаршуулсан бүргэдээр ан хийх гайхамшигт ур чадварын тэмцээн, морины уралдааныг дэргэдээс нь мэдэрнэ.',
    highlights: ['Бүргэдчидтэй зураг татуулах', 'Үндэсний хувцасны үзүүлбэр', 'Казах үндэсний хоол амтлах'],
    imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200',
  },
  {
    id: '8',
    title: 'Өмнөд говийн бартаат замын 4x4 Офф-роуд экспедиц',
    category: 'nature',
    difficulty: 'Ахисан',
    duration: '5 өдөр / 4 шөнө',
    bestSeason: '4 – 10 сар',
    location: 'Хэрмэн цав, Зулганайн гол',
    description: 'GPS, тусгай тоноглогдсон жийп машинаар замгүй уудам говийн гүнд нэвтэрч, Марс гаригийг санагдуулам Хэрмэн цавын улаан хавцлыг туулна.',
    highlights: ['Бартаат замын жолоодлого', 'Зэрлэг байгальд майхантай буудаллах', 'Үлэг гүрвэлийн мөр хайх'],
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200',
  },
];

const CATEGORY_TABS = [
  { key: 'all', label: 'Бүх туршлагууд' },
  { key: 'nature', label: 'Байгаль & Адал явдал' },
  { key: 'nomadic', label: 'Нүүдэлчин & Соёл' },
  { key: 'wildlife', label: 'Амьтан & Амталгаа' },
  { key: 'festivals', label: 'Баяр & Бясалгал' },
];

export default function ExperienceShowcase({
  groupKey = 'all',
  subSlug,
}: {
  groupKey?: string;
  subSlug?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    groupKey === 'all' || !groupKey ? 'all' : groupKey
  );
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredExperiences = useMemo(() => {
    return EXPERIENCES.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (difficultyFilter !== 'all' && item.difficulty !== difficultyFilter) return false;
      return true;
    });
  }, [selectedCategory, difficultyFilter]);

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen pb-32">
      
      {/* 1. HERO - Илүү эрч хүчтэй, үйлдэлд дуудсан толгой */}
      <section className="relative w-full h-[48vh] min-h-[380px] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000"
          alt="Үзэх, хийх зүйлс"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.55]"
        />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
            Things to Experience
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md mb-3">
            Монголд заавал мэдрэх аяллын туршлагууд
          </h1>
          <p className="text-white/85 text-sm sm:text-base font-light max-w-xl mx-auto">
            Зүгээр нэг үзэж өнгөрөх биш, нүүдэлчдийн ахуй, байгальтай бие сэтгэлээрээ уусах ховорхон мөчүүд
          </p>
        </div>
      </section>

      {/* 2. ТҮРГЭН СОНГОЛТЫН ТАБУУД (CATEGORY SELECTOR) */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
          
          <div className="flex items-center gap-2">
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#15803d] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Хүндрэлийн зэргийн шүүлтүүр */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 flex-shrink-0">
            <span>Түвшин:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-gray-100 text-gray-800 font-semibold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer"
            >
              <option value="all">Бүх түвшин</option>
              <option value="Хялбар">Хялбар (Gently)</option>
              <option value="Дунд">Дунд (Moderate)</option>
              <option value="Ахисан">Ахисан (Challenging)</option>
            </select>
          </div>

        </div>
      </div>

      {/* 3. ТУРШЛАГЫН БАЯЛАГ КАРТУУДЫН ЖАГСААЛТ (EXPERIENCE CARDS) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Санал болгож буй хөтөлбөрүүд
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              Таны сонгосон төрөлд {filteredExperiences.length} туршлага олдлоо
            </p>
          </div>
        </div>

        {/* 2 Баганатай дэлгэрэнгүй картууд */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row"
            >
              {/* Зүүн тал: Зураг & Шошгууд */}
              <div className="relative w-full sm:w-2/5 h-64 sm:h-auto overflow-hidden flex-shrink-0">
                <Image
                  src={exp.imageUrl}
                  alt={exp.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit">
                    📍 {exp.location}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full w-fit ${
                      exp.difficulty === 'Хялбар'
                        ? 'bg-emerald-100 text-emerald-800'
                        : exp.difficulty === 'Дунд'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {exp.difficulty}
                  </span>
                </div>
              </div>

              {/* Баруун тал: Дэлгэрэнгүй агуулга */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 font-semibold mb-2">
                    <span>⏱️ {exp.duration}</span>
                    <span>•</span>
                    <span>🗓️ {exp.bestSeason}</span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 leading-snug group-hover:text-[#15803d] transition-colors mb-2">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                    {exp.description}
                  </p>

                  {/* Гол цэгүүд (Highlights) */}
                  <div className="space-y-1.5 mb-6">
                    {exp.highlights.map((point, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
                        <span className="text-[#15803d] font-bold">✓</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900">
                    Бүрэн хөтөлбөр харах
                  </span>
                  <button className="w-9 h-9 rounded-full bg-gray-100 group-hover:bg-[#15803d] group-hover:text-white text-gray-800 flex items-center justify-center transition-all cursor-pointer">
                    →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';

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
    description:
      'Жинхэнэ монгол гэрт хоноглож, өглөө үнээ саах, цагаан идээ боловсруулах, таван хошуу малын бэлчээрт хамт гарч нүүдэлчдийн гүн ухаантай биечлэн танилцана.',
    highlights: [
      'Монгол гэр барьж сурах',
      'Айраг, цагаан идээний гар арга',
      'Малчин айлын өглөөний зоог',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
  },
  {
    id: '2',
    title: 'Өмнөд говийн гүнд одон орон (Stargazing) ба Астро гэрэл зураг',
    category: 'nature',
    difficulty: 'Хялбар',
    duration: 'Шөнийн 6 цаг',
    bestSeason: '5 – 10 сар',
    location: 'Өмнөговь, Их газрын чулуу',
    description:
      'Гэрлийн бохирдолгүй говийн уудам тэнгэрт Сүүн зам, оддын мананцрыг дуран авайгаар ажиглаж, мэргэжлийн гэрэл зурагчны хамт шөнийн зураг авалт хийнэ.',
    highlights: [
      'Телескопоор гариг эрхэс харах',
      'Астрофотографийн зааварчилгаа',
      'Шөнийн галын дэргэдэх халуун цай',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
  },
  {
    id: '3',
    title: 'Орхоны хүрхрээ хүртэлх 4 өдрийн хээрийн морин аялал',
    category: 'nature',
    difficulty: 'Дунд',
    duration: '4 өдөр / 3 шөнө',
    bestSeason: '6 – 8 сар',
    location: 'Өвөрхангай, Орхоны хөндий',
    description:
      'Дэлхийн өв Орхоны хөндийн үзэсгэлэнт уулс, лаавын чулуурхаг хөндийгөөр мориор аялж, үдэш бүр голын эрэгт майхантай хоноглох адал явдал.',
    highlights: [
      'Орхоны 20м хүрхрээ үзэх',
      'Төвхөн хийдээр зочлох',
      'Мэргэжлийн морин хөтөч дагалдана',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
  },
  {
    id: '4',
    title: 'Хустайн нуруунд зэрлэг тахь & буга ажиглах эко тур',
    category: 'wildlife',
    difficulty: 'Хялбар',
    duration: 'Хагас өдөр (5 цаг)',
    bestSeason: 'Жилийн дөрвөн улирал',
    location: 'Төв аймаг (УБ-аас 90 км)',
    description:
      'Дэлхийд цор ганц үлдсэн зэрлэг адуу болох тахийг байгальд нь тольдож, экосистемийн нөхөн сэргээлтийн түүхийг биологич хөтчөөс сонсоно.',
    highlights: [
      'Тахийн сүрэгт ойртох',
      'Байгаль хамгаалагчийн яриа',
      'Хөнгөн явган алхалт',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200',
  },
  {
    id: '5',
    title: 'Жинхэнэ чулуун хорхог болон гүзээний боодог хийх мастеркласс',
    category: 'wildlife',
    difficulty: 'Хялбар',
    duration: '4 цаг',
    bestSeason: '5 – 10 сар',
    location: 'Хэнтий, Төв аймаг',
    description:
      'Голын халуун чулууг галд улайсгаж, хонины махыг битүү жигнэж болгодог эртний монголчуудын хоол хийх өв соёлд гар бие оролцож зооглоно.',
    highlights: [
      'Улайссан чулуу атгах ёсон',
      'Уламжлалт аргаар мах амтлах',
      'Хээрийн халуун шөл зооглох',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
  },
  {
    id: '6',
    title: 'Цэнхэрийн халуун рашаан & Байгалийн иогийн алжаал тайлах өдрүүд',
    category: 'festivals',
    difficulty: 'Хялбар',
    duration: '3 өдөр / 2 шөнө',
    bestSeason: 'Жилийн дөрвөн улирал',
    location: 'Архангай, Цэнхэр сум',
    description:
      'Газрын гүнээс оргилох 86 хэмийн байгалийн эрдэст халуун рашаанд орж, нарс моддын дунд өглөөний иог хийж бие сэтгэлээ бүрэн цэнэглээрэй.',
    highlights: [
      'Ил задгай халуун ванн',
      'Ой тайгын цэвэр агаар',
      'Бүрэн Detox цэс',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
  },
  {
    id: '7',
    title: 'Баян-Өлгийн Бүргэдийн баярын соёл, ангийн ёслол үзэх',
    category: 'festivals',
    difficulty: 'Дунд',
    duration: '3 өдөр',
    bestSeason: '10-р сар',
    location: 'Баян-Өлгий аймаг',
    description:
      'Казах түмний мянган жилийн шувуулахуйн өв, гаршуулсан бүргэдээр ан хийх гайхамшигт ур чадварын тэмцээн, морины уралдааныг дэргэдээс нь мэдэрнэ.',
    highlights: [
      'Бүргэдчидтэй зураг татуулах',
      'Үндэсний хувцасны үзүүлбэр',
      'Казах үндэсний хоол амтлах',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200',
  },
  {
    id: '8',
    title: 'Өмнөд говийн бартаат замын 4x4 Офф-роуд экспедиц',
    category: 'nature',
    difficulty: 'Ахисан',
    duration: '5 өдөр / 4 шөнө',
    bestSeason: '4 – 10 сар',
    location: 'Хэрмэн цав, Зулганайн гол',
    description:
      'GPS, тусгай тоноглогдсон жийп машинаар замгүй уудам говийн гүнд нэвтэрч, Марс гаригийг санагдуулам Хэрмэн цавын улаан хавцлыг туулна.',
    highlights: [
      'Бартаат замын жолоодлого',
      'Зэрлэг байгальд майхантай буудаллах',
      'Үлэг гүрвэлийн мөр хайх',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200',
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
      if (selectedCategory !== 'all' && item.category !== selectedCategory)
        return false;
      if (difficultyFilter !== 'all' && item.difficulty !== difficultyFilter)
        return false;
      return true;
    });
  }, [selectedCategory, difficultyFilter]);

  return (
    <div className="pb-32 w-full min-h-screen bg-[#fbfbfb]">
      {/* 1. HERO - Илүү эрч хүчтэй, үйлдэлд дуудсан толгой */}
      <section className="flex overflow-hidden relative flex-col justify-center items-center px-4 w-full h-[48vh] min-h-[380px] text-center">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000"
          alt="Үзэх, хийх зүйлс"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.55]"
        />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-block py-1.5 px-4 mb-3 text-xs font-bold tracking-widest text-white uppercase bg-white/20 rounded-full backdrop-blur-md">
            Things to Experience
          </span>
          <h1 className="mb-3 text-3xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl">
            Монголд заавал мэдрэх аяллын туршлагууд
          </h1>
          <p className="mx-auto max-w-xl text-sm font-light sm:text-base text-white/85">
            Зүгээр нэг үзэж өнгөрөх биш, нүүдэлчдийн ахуй, байгальтай бие
            сэтгэлээрээ уусах ховорхон мөчүүд
          </p>
        </div>
      </section>

      {/* 2. ТҮРГЭН СОНГОЛТЫН ТАБУУД (CATEGORY SELECTOR) */}
      <div className="sticky top-0 z-30 bg-white/90 border-b border-gray-100 backdrop-blur-md shadow-xs">
        <div className="flex overflow-x-auto gap-4 justify-between items-center py-3.5 px-4 mx-auto max-w-7xl sm:px-8 scrollbar-none">
          <div className="flex gap-2 items-center">
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
          <div className="hidden shrink-0 gap-2 items-center text-xs text-gray-500 sm:flex">
            <span>Түвшин:</span>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="py-1.5 px-3 font-semibold text-gray-800 bg-gray-100 rounded-lg border-none outline-none cursor-pointer"
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
      <div className="px-4 pt-12 mx-auto max-w-7xl sm:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-black text-gray-900 sm:text-2xl">
              Санал болгож буй хөтөлбөрүүд
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              Таны сонгосон төрөлд {filteredExperiences.length} туршлага олдлоо
            </p>
          </div>
        </div>

        {/* 2 Баганатай дэлгэрэнгүй картууд */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {filteredExperiences.map((exp) => (
            <div
              key={exp.id}
              className="group flex overflow-hidden flex-col bg-white rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 sm:flex-row shadow-xs"
            >
              {/* Зүүн тал: Зураг & Шошгууд */}
              <div className="overflow-hidden relative shrink-0 w-full h-64 sm:w-2/5 sm:h-auto">
                <Image
                  src={exp.imageUrl}
                  alt={exp.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="flex absolute top-3 left-3 flex-col gap-1.5">
                  <span className="py-1 px-3 w-fit text-[11px] font-bold text-white bg-black/60 rounded-full backdrop-blur-md">
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
              <div className="flex flex-col flex-1 justify-between p-6">
                <div>
                  <div className="flex gap-3 items-center mb-2 text-[11px] font-semibold text-gray-500">
                    <span>⏱️ {exp.duration}</span>
                    <span>•</span>
                    <span>🗓️ {exp.bestSeason}</span>
                  </div>

                  <h3 className="mb-2 text-lg font-bold leading-snug text-gray-900 group-hover:text-[#15803d] transition-colors">
                    {exp.title}
                  </h3>

                  <p className="mb-4 text-xs leading-relaxed text-gray-600 line-clamp-2">
                    {exp.description}
                  </p>

                  {/* Гол цэгүүд (Highlights) */}
                  <div className="mb-6 space-y-1.5">
                    {exp.highlights.map((point, i) => (
                      <div
                        key={i}
                        className="flex gap-2 items-center text-xs text-gray-700"
                      >
                        <span className="font-bold text-[#15803d]">✓</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-900">
                    Бүрэн хөтөлбөр харах
                  </span>
                  <button className="flex justify-center items-center w-9 h-9 text-gray-800 group-hover:text-white bg-gray-100 group-hover:bg-[#15803d] rounded-full transition-all cursor-pointer">
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

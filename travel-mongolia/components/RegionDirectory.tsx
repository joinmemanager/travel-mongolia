'use client';

import Image from 'next/image';
import React, { useMemo, useState } from 'react';

interface DestinationItem {
  id: string;
  title: string;
  region: string;
  province: string;
  category: string;
  season: string;
  featured?: boolean;
  tag: string;
  description: string;
  duration: string;
  bestMonths: string;
  imageUrl: string;
}

const REGION_CAROUSEL = [
  {
    id: 'all',
    title: 'Бүгд',
    count: 128,
    imageUrl:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
  },
  {
    id: 'ulaanbaatar',
    title: 'Улаанбаатар',
    count: 34,
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
  },
  {
    id: 'central',
    title: 'Төвийн бүс',
    count: 52,
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
  },
  {
    id: 'khangai',
    title: 'Хангайн бүс',
    count: 61,
    imageUrl:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
  },
  {
    id: 'gobi',
    title: 'Говийн бүс',
    count: 47,
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
  },
  {
    id: 'altai-west',
    title: 'Баруун Монгол',
    count: 38,
    imageUrl:
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
  },
  {
    id: 'eastern',
    title: 'Зүүн Монгол',
    count: 29,
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600',
  },
  {
    id: 'khuvsgul-north',
    title: 'Хойд Монгол',
    count: 44,
    imageUrl:
      'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=600',
  },
];

const DESTINATIONS: DestinationItem[] = [
  {
    id: 'khuvsgul-lake',
    title: 'Хөвсгөл нуур',
    region: 'khuvsgul-north',
    province: 'Хөвсгөл',
    category: 'Байгаль',
    season: 'Зун',
    tag: 'Байгаль',
    description:
      'Ази тивийн цэнгэг усны хоёр дахь том нөөц, тайгын ойгоор хүрээлэгдсэн.',
    duration: '4-6 өдөр',
    bestMonths: '6-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800',
  },
  {
    id: 'gorkhi-terelj',
    title: 'Горхи-Тэрэлж',
    region: 'central',
    province: 'Төв',
    category: 'Байгаль',
    season: 'Зун',
    tag: 'Байгаль',
    description:
      'Улаанбаатараас хамгийн ойрхон, боржин хаданцартай уулархаг парк.',
    duration: '1-2 өдөр',
    bestMonths: '5-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
  },
  {
    id: 'bayanzag',
    title: 'Баянзаг',
    region: 'gobi',
    province: 'Өмнөговь',
    category: 'Адал явдал',
    season: 'Зун',
    tag: 'Адал явдал',
    description: 'Улаан хясаат хад, үлэг гүрвэлийн олдвороороо алдартай.',
    duration: '1 өдөр',
    bestMonths: '5-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800',
  },
  {
    id: 'khongor-sand',
    title: 'Хонгорын элс',
    region: 'gobi',
    province: 'Өмнөговь',
    category: 'Байгаль',
    season: 'Зун',
    featured: true,
    tag: 'Байгаль',
    description:
      'Дуулах манхан хэмээх 180 км үргэлжлэх элсэн цуваа. Тэмээн жингээр аялахад тохиромжтой.',
    duration: '2-3 өдөр',
    bestMonths: '5-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800',
  },
  {
    id: 'erdene-zuu',
    title: 'Эрдэнэ зуу',
    region: 'khangai',
    province: 'Өвөрхангай',
    category: 'Сүм хийд',
    season: 'Зун',
    tag: 'Сүм хийд',
    description: 'Монголын хамгийн эртний сүм хийд, Хархорумын өвийн төв.',
    duration: '1 өдөр',
    bestMonths: '5-10 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=800',
  },
  {
    id: 'orkhon-waterfall',
    title: 'Орхоны хүрхрээ',
    region: 'khangai',
    province: 'Өвөрхангай',
    category: 'Байгаль',
    season: 'Зун',
    tag: 'Байгаль',
    description: 'Орхоны хөндийн 20 метрийн өндөр устай үзэсгэлэнт хүрхрээ.',
    duration: '1-2 өдөр',
    bestMonths: '6-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?q=80&w=800',
  },
  {
    id: 'altai-tavan-bogd',
    title: 'Алтай Таван Богд',
    region: 'altai-west',
    province: 'Баян-Өлгий',
    category: 'Адал явдал',
    season: 'Зун',
    tag: 'Адал явдал',
    description: 'Монголын хамгийн өндөр оргил, мөнх цаст нурууны сүрлэг бүс.',
    duration: '7-10 өдөр',
    bestMonths: '7-8 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800',
  },
  {
    id: 'amarbayasgalant',
    title: 'Амарбаясгалант хийд',
    region: 'central',
    province: 'Сэлэнгэ',
    category: 'Сүм хийд',
    season: 'Зун',
    tag: 'Сүм хийд',
    description: 'Ивээн тэтгэгч уулсын дунд байрлах XVIII зууны ховор хийд.',
    duration: '1 өдөр',
    bestMonths: '5-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
  },
  {
    id: 'khustai-park',
    title: 'Хустайн нуруу',
    region: 'central',
    province: 'Төв',
    category: 'Байгаль',
    season: 'Зун',
    tag: 'Байгаль',
    description:
      'Дэлхийд ганц зэрлэг адуу — тахийн сэргээн нутагшуулсан цогцолбор газар.',
    duration: '1 өдөр',
    bestMonths: '5-10 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800',
  },
  {
    id: 'menengiin-tal',
    title: 'Мэнэнгийн тал',
    region: 'eastern',
    province: 'Дорнод',
    category: 'Байгаль',
    season: 'Зун',
    tag: 'Байгаль',
    description:
      'Дэлхийн хамгийн уудам онгон тал хээрийн экосистем, цагаан зээрийн өлгий нутаг.',
    duration: '2-3 өдөр',
    bestMonths: '6-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800',
  },
  {
    id: 'buir-lake',
    title: 'Буйр нуур',
    region: 'eastern',
    province: 'Дорнод',
    category: 'Байгаль',
    season: 'Зун',
    tag: 'Байгаль',
    description:
      'Зүүн бүсийн хамгийн том цэнгэг нуур, элсэн эрэг бүхий амралтын бүс.',
    duration: '2-3 өдөр',
    bestMonths: '6-8 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
  },
  {
    id: 'khalkh-gol',
    title: 'Халхын гол',
    region: 'eastern',
    province: 'Дорнод',
    category: 'Түүх, соёл',
    season: 'Зун',
    tag: 'Түүх, соёл',
    description:
      'Түүхэн тулалдааны дурсгалууд болон зэрлэг ан амьтан, байгалийн үзэсгэлэн.',
    duration: '3-4 өдөр',
    bestMonths: '6-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
  },
  {
    id: 'dariganga',
    title: 'Дарьганга',
    region: 'eastern',
    province: 'Сүхбаатар',
    category: 'Түүх, соёл',
    season: 'Зун',
    tag: 'Түүх, соёл',
    description:
      'Галт уулын боржин чулуу, Ганга нуур, домогт Шилийн Богд хайрхан.',
    duration: '2 өдөр',
    bestMonths: '6-9 сар',
    imageUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800',
  },
];

export default function RegionDirectory({
  initialSubSlug,
}: {
  initialSubSlug?: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(initialSubSlug || 'all');
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);

  const toggleFilter = (
    list: string[],
    setList: (v: string[]) => void,
    item: string
  ) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setSelectedProvinces([]);
    setSelectedCategories([]);
    setSelectedSeasons([]);
  };

  const filteredItems = useMemo(() => {
    return DESTINATIONS.filter((item) => {
      if (selectedRegion !== 'all' && item.region !== selectedRegion)
        return false;
      if (
        selectedProvinces.length > 0 &&
        !selectedProvinces.includes(item.province)
      )
        return false;
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(item.category)
      )
        return false;
      if (selectedSeasons.length > 0 && !selectedSeasons.includes(item.season))
        return false;
      if (
        searchQuery.trim() &&
        !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.province.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [
    searchQuery,
    selectedRegion,
    selectedProvinces,
    selectedCategories,
    selectedSeasons,
  ]);

  return (
    <div className="pb-20 w-full bg-neutral-50/50">
      {/* 1. HERO ХЭСЭГ ХАЙЛТЫН ТАЛБАРТАЙ */}
      <section className="flex overflow-hidden relative flex-col justify-center items-center w-full h-[50vh] min-h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000"
          alt="Зорих газрууд"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.65]"
        />
        <div className="relative z-10 px-4 mx-auto w-full max-w-3xl text-center">
          <h1 className="mb-3 text-4xl font-black tracking-tight text-white drop-shadow-md sm:text-6xl">
            Зорих газрууд
          </h1>
          <p className="mb-8 text-sm font-light text-white/90 sm:text-base">
            Монголын 21 аймаг, зургаан бүсийн онцлох газруудыг нээгээрэй
          </p>

          <div className="relative mx-auto max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Газар, аймаг, сэдвээр хайх..."
              className="py-3.5 pr-6 pl-12 w-full text-sm text-gray-800 bg-white rounded-full focus:outline-none ring-2 ring-emerald-600/30 shadow-xl"
            />
            <svg
              className="absolute top-1/2 left-4 w-5 h-5 text-gray-400 -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. БҮСИЙН КАРТУУД (ДЭЛГЭЦ ГОЛЛОСОН БҮРЭН БҮТЭЦ) */}
      <div className="bg-white border-b border-gray-200">
        <div className="py-6 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-3 justify-center items-start sm:grid-cols-4 sm:gap-4 md:grid-cols-8">
            {REGION_CAROUSEL.map((reg) => {
              const isSelected = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => setSelectedRegion(reg.id)}
                  className={`group w-full flex flex-col text-left p-1 rounded-2xl transition-all cursor-pointer ${
                    isSelected ? 'ring-2 ring-emerald-600' : 'hover:opacity-90'
                  }`}
                >
                  <div className="aspect-[16/11] overflow-hidden relative mb-2 w-full rounded-xl shadow-xs">
                    <Image
                      src={reg.imageUrl}
                      alt={reg.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/15" />
                  </div>
                  <span className="block text-xs font-bold leading-tight text-gray-900 truncate sm:text-[13px]">
                    {reg.title}
                  </span>
                  <span className="block mt-0.5 text-[11px] text-gray-500">
                    {reg.count} газар
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. ШҮҮЛТҮҮР БОЛОН ҮР ДҮНГИЙН СҮЛЖЭЭ */}
      <div className="px-4 pt-10 mx-auto max-w-7xl sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* ЗҮҮН ТАЛ: ШҮҮЛТҮҮРҮҮД */}
          <aside className="p-6 space-y-6 h-fit bg-white rounded-2xl border border-gray-100 lg:col-span-3 shadow-xs">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-sm font-bold text-gray-900">Шүүлтүүр</span>
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-emerald-700 hover:underline"
              >
                Цэвэрлэх
              </button>
            </div>

            {/* Бүс нутаг */}
            <div>
              <span className="block mb-3 text-xs font-bold tracking-wider text-gray-800 uppercase">
                Бүс нутаг
              </span>
              <div className="space-y-2 text-xs text-gray-700">
                {REGION_CAROUSEL.filter((r) => r.id !== 'all').map((r) => (
                  <label
                    key={r.id}
                    className="flex justify-between items-center hover:text-black cursor-pointer"
                  >
                    <span className="flex gap-2 items-center">
                      <input
                        type="radio"
                        name="region_filter"
                        checked={selectedRegion === r.id}
                        onChange={() => setSelectedRegion(r.id)}
                        className="w-4 h-4 rounded accent-emerald-700"
                      />
                      {r.title}
                    </span>
                    <span className="text-gray-400">{r.count}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Аймаг */}
            <div className="pt-4 border-t border-gray-100">
              <span className="block mb-3 text-xs font-bold tracking-wider text-gray-800 uppercase">
                Аймаг
              </span>
              <div className="space-y-2 text-xs text-gray-700">
                {[
                  'Хөвсгөл',
                  'Төв',
                  'Өмнөговь',
                  'Өвөрхангай',
                  'Баян-Өлгий',
                  'Сэлэнгэ',
                  'Сүхбаатар',
                ].map((prov) => (
                  <label
                    key={prov}
                    className="flex justify-between items-center hover:text-black cursor-pointer"
                  >
                    <span className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={selectedProvinces.includes(prov)}
                        onChange={() =>
                          toggleFilter(
                            selectedProvinces,
                            setSelectedProvinces,
                            prov
                          )
                        }
                        className="w-4 h-4 rounded accent-emerald-700"
                      />
                      {prov}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Төрөл */}
            <div className="pt-4 border-t border-gray-100">
              <span className="block mb-3 text-xs font-bold tracking-wider text-gray-800 uppercase">
                Төрөл
              </span>
              <div className="space-y-2 text-xs text-gray-700">
                {['Байгаль', 'Түүх, соёл', 'Сүм хийд', 'Адал явдал'].map(
                  (cat) => (
                    <label
                      key={cat}
                      className="flex justify-between items-center hover:text-black cursor-pointer"
                    >
                      <span className="flex gap-2 items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() =>
                            toggleFilter(
                              selectedCategories,
                              setSelectedCategories,
                              cat
                            )
                          }
                          className="w-4 h-4 rounded accent-emerald-700"
                        />
                        {cat}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>

            {/* Улирал */}
            <div className="pt-4 border-t border-gray-100">
              <span className="block mb-3 text-xs font-bold tracking-wider text-gray-800 uppercase">
                Улирал
              </span>
              <div className="space-y-2 text-xs text-gray-700">
                {['Хавар', 'Зун', 'Намар', 'Өвөл'].map((sea) => (
                  <label
                    key={sea}
                    className="flex justify-between items-center hover:text-black cursor-pointer"
                  >
                    <span className="flex gap-2 items-center">
                      <input
                        type="checkbox"
                        checked={selectedSeasons.includes(sea)}
                        onChange={() =>
                          toggleFilter(selectedSeasons, setSelectedSeasons, sea)
                        }
                        className="w-4 h-4 rounded accent-emerald-700"
                      />
                      {sea}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* БАРУУН ТАЛ: КАРТУУДЫН ЖАГСААЛТ */}
          <main className="space-y-6 lg:col-span-9">
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-gray-900">
                {filteredItems.length} газар олдлоо
              </span>
              <div className="flex gap-2 items-center text-xs text-gray-500">
                <span>Эрэмбэлэх:</span>
                <select className="font-semibold text-gray-900 bg-transparent outline-none cursor-pointer">
                  <option>Алдартай</option>
                  <option>Сүүлд нэмэгдсэн</option>
                </select>
              </div>
            </div>

            {/* Картуудын Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex overflow-hidden flex-col bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 shadow-xs"
                >
                  <div className="overflow-hidden relative w-full h-48">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 py-1 px-3 text-[11px] font-bold text-gray-800 bg-white/90 rounded-full backdrop-blur-xs">
                      {item.tag}
                    </span>
                    <button className="flex absolute top-3 right-3 justify-center items-center w-8 h-8 text-gray-700 hover:text-red-500 bg-white/80 rounded-full">
                      ♡
                    </button>
                  </div>

                  <div className="flex flex-col flex-1 justify-between p-5">
                    <div>
                      <h3 className="mb-1 text-lg font-bold text-gray-900">
                        {item.title}
                      </h3>
                      <span className="block mb-2 text-xs text-gray-400">
                        📍 {item.province} аймаг
                      </span>
                      <p className="text-xs leading-relaxed text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-4 mt-4 text-[11px] font-medium text-gray-500 border-t border-gray-100">
                      <span>🗓️ {item.bestMonths}</span>
                      <span>⏱️ {item.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

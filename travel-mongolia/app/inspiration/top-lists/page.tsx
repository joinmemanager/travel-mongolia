'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';


interface TopListItem {
  id: string;
  category: string;
  categoryKey: string;
  rank: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
  aspect: string;
}

const TOP_LIST_FILTERS = [
  { id: 'all', label: 'Бүгд' },
  { id: 'top5', label: 'Top 5' },
  { id: 'top10', label: 'Top 10' },
  { id: 'best-of-mongolia', label: 'Best of Mongolia' },
];

const TOP_LIST_ITEMS: TopListItem[] = [
  {
    id: '1',
    categoryKey: 'best-of-mongolia',
    category: 'Best of Mongolia',
    rank: '#01',
    title: 'Монголд заавал очиж үзэх 7 байгалийн гайхамшиг',
    subtitle: 'Хөвсгөл, Хонгорын элс, Алтай Таван Богд тэргүүтэй шилдэг цэгүүд',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    tag: 'Шилдэг байгаль',
    aspect: 'h-[440px]',
  },
  {
    id: '2',
    categoryKey: 'top5',
    category: 'Top 5',
    rank: '#02',
    title: 'Улаанбаатараас 2 цагийн дотор очих топ 5 амралтын цэг',
    subtitle: 'Амралтын өдрүүдээр салхинд гарахад хамгийн тохиромжтой байршлууд',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    tag: 'Амралтын өдөр',
    aspect: 'h-[330px]',
  },
  {
    id: '3',
    categoryKey: 'top10',
    category: 'Top 10',
    rank: '#03',
    title: 'Монголын хамгийн өндөр үнэлгээтэй 10 эко-лодж & кэмп',
    subtitle: 'Тав тух, байгаль орчны тэнцвэрийг төгс хангасан шилдэг баазууд',
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&q=80',
    tag: 'Шилдэг баазууд',
    aspect: 'h-[420px]',
  },
  {
    id: '4',
    categoryKey: 'best-of-mongolia',
    category: 'Best of Mongolia',
    rank: '#04',
    title: 'Гадаад жуулчдын хамгийн их дурласан Монгол 5 хоол',
    subtitle: 'Хорхог, бууз, өрөмтэй халуун талх ба үндэсний уламжлалт зоог',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    tag: 'Аяллын зоог',
    aspect: 'h-[360px]',
  },
  {
    id: '5',
    categoryKey: 'top5',
    category: 'Top 5',
    rank: '#05',
    title: 'Зэрлэг амьтад харах хамгийн өндөр магадлалтай 5 бүс нутаг',
    subtitle: 'Хустайн тахь, Говийн мазаалай, хавтгай, Алтайн аргаль угалз',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tag: 'Ан амьтан',
    aspect: 'h-[450px]',
  },
  {
    id: '6',
    categoryKey: 'top10',
    category: 'Top 10',
    rank: '#06',
    title: 'Гэрэл зурагчдын заавал очих ёстой 10 өнцөг',
    subtitle: 'Өглөөний нар ургах, оройн жаргах наран ба тэнгэрийн заадлын цэгүүд',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
    tag: 'Гэрэл зураг',
    aspect: 'h-[350px]',
  },
];

function TopListsContent() {
  const searchParams = useSearchParams();
  const filterParam = searchParams.get('list');
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    if (filterParam && TOP_LIST_FILTERS.some((f) => f.id === filterParam)) {
      setActiveFilter(filterParam);
    }
  }, [filterParam]);

  const filteredItems =
    activeFilter === 'all'
      ? TOP_LIST_ITEMS
      : TOP_LIST_ITEMS.filter((item) => item.categoryKey === activeFilter);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32 pt-8">
      {/* Толгой хэсэг */}
      <header className="pt-10 pb-6 px-6 sm:px-12 max-w-7xl mx-auto border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.3em] text-[#15803d] uppercase block mb-1">
              06. АЯЛАХ СЭДЭЛ
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
              Top Lists
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-md font-normal leading-relaxed">
            Аялагчдын бодит сэтгэгдэл, үнэлгээ болон мэргэжлийн хөтөч нарын сонгосон шилдэг жагсаалтууд.
          </p>
        </div>

        {/* Шүүлтүүр товчлуурууд */}
        <div className="flex flex-wrap gap-2 pt-8">
          {TOP_LIST_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-[#15803d] text-white shadow-sm hover:bg-emerald-950'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#15803d] hover:text-[#15803d]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* Masonry Moodboard Grid */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-10">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="break-inside-avoid group relative rounded-3xl overflow-hidden border border-neutral-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-end"
            >
              <div className={`relative w-full ${item.aspect} overflow-hidden`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                {/* Баруун дээд дугаарлалт */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-black text-[#15803d] shadow-sm font-mono">
                  {item.rank}
                </div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm">
                  {item.tag}
                </div>

                <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-emerald-300 block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold leading-snug group-hover:text-emerald-200 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-200 line-clamp-2 font-light leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-16 px-6 sm:px-12 max-w-7xl mx-auto flex justify-end">
        <Link
          href="/inspiration/itineraries"
          className="text-xs font-semibold text-[#15803d] hover:text-emerald-950 transition-colors flex items-center gap-1"
        >
          Дараах: 07. Маршрутууд →
        </Link>
      </div>
    </main>
  );
}

export default function TopListsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9] text-neutral-700 p-10">Уншиж байна...</div>}>
      <TopListsContent />
    </Suspense>
  );
}

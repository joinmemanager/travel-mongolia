'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface MagazineArticle {
  id: string;
  title: string;
  readTime: string;
  date: string;
  image: string;
  description: string;
}

interface SectionData {
  id: string;
  label: string;
  description: string;
  articles: MagazineArticle[];
}

const MAGAZINE_SECTIONS: SectionData[] = [
  {
    id: 'featured',
    label: 'Онцлох нийтлэл',
    description: 'Энэ сарын хамгийн онцгой содон аялал, гэрэл зураг болон дурсамжууд',
    articles: [
      {
        id: 'gobi-endless-silence',
        title: 'Говийн хязгааргүй нам гүмд өнгөрүүлсэн долоо хоног',
        readTime: '6 мин унших',
        date: '2026.08.12',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
        description: 'Орчин цагийн завгүй амьдралаас тасарч, Хонгорын элс ба Нэмэгтийн жалгаар аялсан хувийн тэмдэглэл.',
      },
      {
        id: 'altai-expedition',
        title: 'Алтайн сүрлэг оргилуудын дундуур хийсэн морин аялал',
        readTime: '8 мин унших',
        date: '2026.07.20',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
        description: 'Таван Богдын мөсөн голын захаар нутгийн хөтөч нартай хамт өнгөрүүлсэн өдрүүд.',
      },
      {
        id: 'khuvsgul-autumn-trails',
        title: 'Хөвсгөлийн намар: Модод алтран шаргалтах үеэр',
        readTime: '4 мин унших',
        date: '2026.09.02',
        image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=900&q=80',
        description: 'Цэнхэр сувд нуурын эргэн тойронд намрын шар нар тусах хором мөч бүрийн өнгө будгийн зохицол.',
      },
    ],
  },
  {
    id: 'latest',
    label: 'Шинэ нийтлэл',
    description: 'Хамгийн сүүлд нийтлэгдсэн шинэ адал явдал, зөвлөгөөнүүд',
    articles: [
      {
        id: 'slow-travel-orkhon-valley',
        title: 'Яаралгүй аялах урлаг: Орхоны хөндийн дугуйт аялал',
        readTime: '7 мин унших',
        date: '2026.08.01',
        image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
        description: 'Хурд хөөцөлдөлгүйгээр нутгийн айлуудаар бууж модон тэргээр нүүдэл дагах онцгой мэдрэмж.',
      },
      {
        id: 'terelj-autumn-weekend',
        title: 'Тэрэлжийн амралтын өдрүүд: Хоттой ойр байгалийн сайхан',
        readTime: '3 мин унших',
        date: '2026.08.28',
        image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
        description: 'Замын ачаалал багатай үед Тэрэлж рүү гэр бүлээрээ амарч салхинд гарах хөтөлбөр.',
      },
      {
        id: 'ub-cozy-cafes-travelers',
        title: 'Аялагчдад зориулсан Улаанбаатарын хамгийн тав тухтай кофе шопууд',
        readTime: '5 мин унших',
        date: '2026.08.15',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80',
        description: 'Аяллын замд гарахаас өмнө зураг төлөвлөгөөгөө ярилцан суух тухтай булангууд.',
      },
    ],
  },
  {
    id: 'editors-pick',
    label: 'Редакторын сонголт',
    description: 'Манай сэтгүүлийн багийнхны тусгайлан онцолж буй бүтээлүүд',
    articles: [
      {
        id: 'eagle-hunters-heritage',
        title: 'Мөсөн оргилын эзэд: Казах бүргэдчдийн өв соёл',
        readTime: '8 мин унших',
        date: '2026.07.28',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80',
        description: 'Алтайн уулсаар нутаглах бүргэдчин гэр бүлүүдийн гаршуулах уламжлалт арга барил, зан үйлийн нарийн учир.',
      },
      {
        id: 'tsagaan-suvarga-sunset',
        title: 'Цагаан суваргын жаргах наран доорх өнгөний хувирал',
        readTime: '5 мин унших',
        date: '2026.07.10',
        image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80',
        description: 'Эртний далайн ёроол бүхий шавар хананууд оройн наранд улайран туяарах үзэгдэл.',
      },
      {
        id: 'taiga-reindeer-herders',
        title: 'Тайгын гүнд цаатнуудын ахуй амьдралыг судалсан нь',
        readTime: '9 мин унших',
        date: '2026.06.30',
        image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=900&q=80',
        description: 'Зүүн ба баруун тайгын цаатнуудын амьдралын хэв маяг, экологийн тэнцвэр.',
      },
    ],
  },
  {
    id: 'popular',
    label: 'Их уншсан',
    description: 'Уншигчдын дунд хамгийн их хандалт авсан нийтлэлүүд',
    articles: [
      {
        id: 'nomadic-dairy-secrets',
        title: 'Ааруул, өрөм, айраг: Тал нутгийн супер хүнс',
        readTime: '5 мин унших',
        date: '2026.06.15',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80',
        description: 'Байгалийн цэвэр бэлчээрийн шим шингэсэн уламжлалт цагаан идээ хүний биед хэрхэн эерэг нөлөө үзүүлдэг вэ?',
      },
      {
        id: 'stargazing-ub-night-sky',
        title: 'Оддын эрхэс: Тэнгэрийн заадлыг хамгийн тод харах цэгүүд',
        readTime: '5 мин унших',
        date: '2026.05.20',
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=900&q=80',
        description: 'Гэрлийн бохирдолгүй Монгол орны уудам хээр талд астрономи болон шөнийн гэрэл зураг сонирхогчдод зориулсан гарын авлага.',
      },
      {
        id: 'packing-guide-mongolia',
        title: 'Монголд үүргэвчтэй аялахад зайлшгүй бэлдэх 10 зүйл',
        readTime: '6 мин унших',
        date: '2026.05.02',
        image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80',
        description: 'Дөрвөн улирал нэг өдөр ээлжилдэг талын цаг агаарт зориулсан практик зөвлөмжүүд.',
      },
    ],
  },
];

function MagazineContent() {
  const searchParams = useSearchParams();
  const catQuery = searchParams.get('cat');

  // URL-аас параметр орж ирвэл шууд тухайн хэсэг рүү зөөлөн гүйлгэнэ
  useEffect(() => {
    if (catQuery) {
      const element = document.getElementById(catQuery);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [catQuery]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32 pt-8">
      {/* Сэтгүүлийн толгой хэсэг */}
      <header className="pt-12 pb-8 px-6 sm:px-12 max-w-7xl mx-auto border-b border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#15803d] font-bold block mb-2">
              Volume 01 • Digital Issue
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-900 uppercase">
              Mongolia Magazine
            </h1>
          </div>
          <p className="text-sm text-neutral-600 max-w-md leading-relaxed">
            Монголын уудам нутгийн түүх, өв соёл болон бодит аяллын тэмдэглэлүүдийн нэгдсэн цахим сэтгүүл.
          </p>
        </div>
      </header>

      {/* Шүүлтүүр товчлуурууд - Дээд талд наалдаж үлдэнэ */}
      <div className="sticky top-0 z-40 bg-[#fcfbf9]/95 backdrop-blur-md border-b border-neutral-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-4 py-2 rounded-full text-xs font-bold tracking-wider transition-all cursor-pointer bg-[#15803d] text-white hover:bg-emerald-950 shadow-sm"
          >
            Бүгд (Эхлэл)
          </button>

          {MAGAZINE_SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className="px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer bg-white border border-neutral-200 text-neutral-700 hover:border-[#15803d] hover:text-[#15803d]"
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* Нэг хуудас дээрх бүх хэсгүүд (Бүгд Asymmetric Bento Grid хэлбэрээр) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-12 space-y-24">
        {MAGAZINE_SECTIONS.map((sec, idx) => {
          const lead = sec.articles[0];
          const second = sec.articles[1];
          const third = sec.articles[2];

          return (
            <section
              key={sec.id}
              id={sec.id}
              className="scroll-mt-28 border-t border-neutral-200/80 pt-10"
            >
              {/* Хэсгийн гарчиг */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-[#15803d] font-bold">
                    0{idx + 1}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
                    {sec.label}
                  </h2>
                </div>
                <p className="text-xs text-neutral-500 mt-1 sm:mt-0 font-medium">
                  {sec.description}
                </p>
              </div>

              {/* Asymmetric Bento Grid зохиомж */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* 1. Lead Story - Том өргөн блок (3 багана эзэлнэ) */}
                {lead && (
                  <article className="group relative rounded-3xl overflow-hidden border border-neutral-200 bg-neutral-900 md:col-span-2 lg:col-span-3 min-h-[420px] flex flex-col justify-end p-8 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                    <img
                      src={lead.image}
                      alt={lead.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent" />
                    <div className="relative z-10 max-w-2xl text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-[#15803d] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                          {sec.label}
                        </span>
                        <span className="text-xs text-neutral-200">
                          {lead.readTime} • {lead.date}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 group-hover:text-emerald-300 transition-colors leading-tight">
                        {lead.title}
                      </h3>
                      <p className="text-sm text-neutral-200 line-clamp-2 font-light">
                        {lead.description}
                      </p>
                    </div>
                  </article>
                )}

                {/* 2. Side Story - Өндөр босоо блок (1 багана эзэлнэ) */}
                {second && (
                  <article className="group relative rounded-3xl overflow-hidden border border-neutral-200 bg-white md:col-span-1 lg:col-span-1 min-h-[420px] flex flex-col justify-between p-6 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative h-52 rounded-2xl overflow-hidden mb-4">
                      <img
                        src={second.image}
                        alt={second.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1">
                      <div>
                        <span className="text-[11px] text-neutral-400 block mb-2 font-mono">
                          {second.date} • {second.readTime}
                        </span>
                        <h4 className="text-base font-bold text-neutral-900 group-hover:text-[#15803d] transition-colors line-clamp-3 mb-2 leading-snug">
                          {second.title}
                        </h4>
                        <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                          {second.description}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#15803d] group-hover:text-emerald-950 pt-4 inline-flex items-center gap-1 transition-colors">
                        Унших <span>→</span>
                      </span>
                    </div>
                  </article>
                )}

                {/* 3. Third Story - Доод талын өргөн блок */}
                {third && (
                  <article className="group rounded-3xl overflow-hidden border border-neutral-200 bg-white p-6 flex flex-col md:flex-row gap-6 cursor-pointer shadow-sm hover:shadow-xl hover:border-neutral-300 transition-all duration-300 md:col-span-3 lg:col-span-4">
                    <div className="relative md:w-1/3 h-52 md:h-auto rounded-2xl overflow-hidden shrink-0">
                      <img
                        src={third.image}
                        alt={third.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-1">
                      <div>
                        <div className="text-[11px] text-neutral-400 mb-2 font-mono">
                          {third.date} • {third.readTime}
                        </div>
                        <h4 className="text-xl font-bold text-neutral-900 group-hover:text-[#15803d] transition-colors line-clamp-2 mb-3">
                          {third.title}
                        </h4>
                        <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed">
                          {third.description}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-[#15803d] group-hover:text-emerald-950 pt-4 inline-flex items-center gap-1 transition-colors">
                        Дэлгэрэнгүй унших <span>→</span>
                      </span>
                    </div>
                  </article>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

export default function MagazinePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#fcfbf9] text-neutral-700 p-12">Уншиж байна...</div>}>
      <MagazineContent />
    </Suspense>
  );
}

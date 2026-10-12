'use client';

import AboutRelated from '@/components/templates/AboutRelated';

import { liveHref } from '@/lib/navigation';

import React from 'react';


interface ModernItem {
  title: string;
  desc: string;
  thumb: string;
}

interface ModernSection {
  id: string;
  // "Дэлгэрэнгүй" товч хаашаа заах (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: ModernItem[];
}

const MODERN_SECTIONS: ModernSection[] = [
  {
    id: 'lifestyle',
    num: '01',
    tag: 'Орчин цагийн хэмнэл',
    title: 'Орчин үеийн Монголын амьдрал',
    desc: 'Уламжлалт нүүдлийн ахуй болон даяаршлын дижитал шийдлийг хослуулан хөгжүүлж буй шинэ үе, энтертайнмент соёл, эрч хүчтэй амьдралын өнгө төрх.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    items: [
      {
        title: 'Кофены соёл & Коворкинг',
        desc: 'Залуус чөлөөтэй сэтгэн ажиллах бүтээлч орчин, нийслэлийн эрч хүчтэй бизнес төвүүд.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Дижитал эрин үе',
        desc: 'Цахим банк, финтек, ухаалаг үйлчилгээ өндөр хөгжсөн бэлэн мөнгөгүй төлбөрийн хэв маяг.',
        thumb: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600',
      },
      {
        title: 'Амралтын өдрүүдийн аялал',
        desc: 'Хотын залуус амралтын өдрөөр хөдөө гарч, байгальд аялан эрүүл эрч хүчээ сэлбэх соёл.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
  {
    id: 'urban-rural',
    num: '02',
    tag: 'Хөгжил ба ялгарал',
    title: 'Хот ба хөдөөгийн амьдрал',
    desc: 'Шилэн цамхгууд сүндэрлэсэн нийслэл Улаанбаатар хот ба онгон зэлүүд байгальтайгаа зэрэгцэн орших уудам хөдөөгийн малчин ахуйн зохицол.',
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1200',
    items: [
      {
        title: 'Нийслэл Улаанбаатар хот',
        desc: 'Түүх соёл, орчин үеийн дэд бүтэц хосолсон Төв Азийн хамгийн өвөрмөц мегаполис хот.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Малчин өрхийн дэвшил',
        desc: 'Нарны дэлгэц, сансрын интернэт, мотоцикль ашигладаг орчин цагийн шинэ үеийн малчид.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Аймгийн төвүүд & Хөгжил',
        desc: 'Бүс нутгийн дэд бүтэц, авто замын сүлжээ болон аялал жуулчлалын төвүүдийн тэлэлт.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
  {
    id: 'creative-arts',
    num: '03',
    tag: 'Бүтээлч үйлдвэрлэл',
    title: 'Орчин үеийн урлаг, дизайн',
    desc: 'Монгол өв соёлыг дэлхийн контемпорари урлагтай хослуулсан шинэ үеийн загвар зохион бүтээгчид, кино найруулагчид ба уран бүтээлчид.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    items: [
      {
        title: 'Орчин үеийн Монгол загвар',
        desc: 'Үндэсний дээл, хээ угалзыг орчин үеийн өдөр тутмын загварт шингээсэн брэндүүд.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Контемпорари уран зураг',
        desc: 'Уламжлалт монгол зургийн арга барилыг модернизмтай холбосон олон улсын үзэсгэлэнгүүд.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Кино & Театр',
        desc: 'Дэлхийн кино наадмуудад шагнал хүртэж буй бие даасан уран бүтээлчдийн бүтээлүүд.',
        thumb: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600',
      },
    ],
  },
  {
    id: 'music',
    moreHref: '/things-to-do/festivals',
    num: '04',
    tag: 'Аялгуу эгшиг',
    title: 'Хөгжим & Фестивалиуд',
    desc: 'Морин хуур, хөөмийн язгуур эгшгийг метал роктой хослуулсан дэлхийн од хамтлагуудаас эхлээд олон улсын томоохон хөгжмийн наадмууд.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    items: [
      {
        title: 'Хүннү Рок & Дэлхийн тавцан',
        desc: '"The Hu" зэрэг хамтлагууд язгуур урлагийг дэлхийн рок хөгжмийн тавцанд тунхаглаж байна.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Playtime Festival',
        desc: 'Төв Азийн хамгийн том амьд хөгжмийн фестивалиудын нэг бөгөөд дэлхийн олон орны залуусыг нэгтгэдэг.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Хип хоп & Электрон урсгал',
        desc: 'Хотын залуусын өдөр тутмын амьдрал, үзэл бодлыг илэрхийлсэн шинэ цагийн дуу хоолой.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
  {
    id: 'youth-culture',
    num: '05',
    tag: 'Ирээдүйг бүтээгчид',
    title: 'Залуусын соёл & Спорт',
    desc: 'Олимп, тив дэлхийд амжилт гаргаж буй жүдо, чөлөөт бөх, цахим спортын тамирчид болон сайн дурын нэгдэл, стартап экосистем.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200',
    items: [
      {
        title: 'Цахим спорт (Esports)',
        desc: 'CS2, PUBG Mobile зэрэг спортын төрлөөр дэлхийн аваргын цомыг эх орондоо авчирсан залуус.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Олимп & Их спорт',
        desc: 'Жүдо, чөлөөт бөх, бокс болон 3х3 сагсан бөмбөгийн төрлөөр дэлхийд өрсөлдөж буй тамирчид.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Стартап & Инноваци',
        desc: 'Дэлхийн зах зээлд өрсөлдөх зорилготой технологийн шинэ бизнес, залуу энтрепренерүүд.',
        thumb: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600',
      },
    ],
  },
];

export default function ModernMongoliaPage() {
  return (
    <div>
      {/* 3. ДЭЛГЭРЭНГҮЙ ХЭСГҮҮД */}
      <div className="space-y-28">
        {MODERN_SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-[calc(var(--nav-h)+5rem)] lg:scroll-mt-[calc(var(--nav-h)+1.5rem)] space-y-10"
          >
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="xl:col-span-6 space-y-5">
                <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                  {sec.title}
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                  {sec.desc}
                </p>
                {liveHref(sec.moreHref) && (
                <div className="pt-2">
                  <a
                    href={liveHref(sec.moreHref)}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#15803d] text-white hover:bg-emerald-800 transition-all font-bold text-sm sm:text-base shadow-sm hover:shadow-md group/btn"
                  >
                    <span>Дэлгэрэнгүй</span>
                    <svg 
                      className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth="2.5"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
                )}
              </div>

              <div className="xl:col-span-6 relative w-full h-64 sm:h-80 lg:h-[340px] rounded-3xl overflow-hidden shadow-md group border border-emerald-100">
                <img loading="lazy" decoding="async" src={sec.imageUrl} alt={sec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group/card bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-[#15803d]/50 transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden">
                    <img loading="lazy" decoding="async" src={item.thumb} alt={item.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
                    <h4 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover/card:text-[#15803d] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <AboutRelated current="/about/modern" embedded />
    </div>
  );
}


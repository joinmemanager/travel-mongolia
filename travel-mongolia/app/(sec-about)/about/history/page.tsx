import Link from 'next/link';
import { connection } from 'next/server';
import React from 'react';

import AboutRelated from '@/components/templates/AboutRelated';
import { getHistoryArticles, HISTORY_PERIODS, type HistoryArticle } from '@/lib/history';
import { isPreviewEnv } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/about/history');

// Үе бүрийн дэлгэрэнгүй нийтлэлүүд (historyArticle → /about/history/<slug>). Нийтлэлгүй үед харагдахгүй.
function ArticleList({ articles, title = 'Дэлгэрэнгүй нийтлэлүүд' }: { articles?: HistoryArticle[]; title?: string }) {
  if (!articles?.length) return null;
  return (
    <div className="mt-8">
      <h3 className="mb-4 text-xs font-black tracking-widest uppercase sm:text-sm text-neutral-400">{title}</h3>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {articles.map((a) => (
          <li key={a.id}>
            <Link
              href={`/about/history/${a.slug}`}
              className="flex gap-3 justify-between items-center p-4 h-full bg-white rounded-xl border transition-colors border-neutral-200 hover:border-[#15803d]"
            >
              <span className="font-semibold leading-snug text-neutral-900">{a.title}</span>
              <span aria-hidden="true" className="text-[#15803d] font-bold">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


interface HistoryPeriod {
  id: string;
  era: string;
  title: string;
  badge: string;
  desc: string;
  facts: string[];
  imageUrl: string;
}

const HISTORY_DATA: HistoryPeriod[] = [
  {
    id: 'ancient-land',
    era: 'НТӨ 800,000 – 3-р зуун',
    title: 'Эртний Монгол нутаг',
    badge: 'Палеолит & Хүрэл зэвсэг',
    desc: 'Чулуун зэвсгийн үеэс хүрэл, төмөр зэвсгийн үеийг дамжин Төв Азийн өндөрлөгт анхны соёл иргэншлүүд бүрэлджээ. Буган хөшөө, хадны сүг зургууд бол эртний нүүдэлчдийн ертөнцийг үзэх үзлийн илэрхийлэл юм.',
    facts: [
      'Цагаан агуй, Баянхонгорын Цахиуртын хөндий зэрэг эртний хүний бууцууд',
      'Буган хөшөөний соёл (ЮНЕСКО-гийн Дэлхийн өвд бүртгэгдсэн)',
      'Адууг гаршуулан анхлан уналга эдэлгээнд хэрэглэсэн өлгий нутаг',
    ],
    imageUrl: '',
  },
  {
    id: 'hunnu-empires',
    era: 'НТӨ 209 – НТ 9-р зуун',
    title: 'Хүннү ба эртний төрт улсууд',
    badge: 'Анхны нүүдэлчдийн гүрэн',
    desc: 'Модун Шаньюй НТӨ 209 онд Хүннү гүрнийг байгуулснаар Төв Азид нүүдэлчдийн анхны эзэнт гүрэн төржээ. Дараа нь Сяньби, Жужан, Түрэг, Уйгур, Кидан улсууд ээлжлэн төр барьсан түүхтэй.',
    facts: [
      '“Газар бол төрийн үндэс” — Модун Шаньюйн төрийн бодлого',
      'Аравтын систем дээр суурилсан морин цэргийн зохион байгуулалт',
      'Орхоны хөндий дэх Түрэгийн Билгэ хаан, Күлтегиний гэрэлт хөшөөнүүд',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200',
  },
  {
    id: 'great-mongol',
    era: '1206 – 1271 он',
    title: 'Их Монгол Улс',
    badge: 'Чингис хаан & Нэгдэл',
    desc: 'Тэмүжин 1206 онд Онон мөрний хөвөөнд тархай бутархай байсан бүх монгол овог аймгуудыг нэгтгэн Их Монгол Улсыг тунхаглаж, “Чингис хаан” цол өргөмжлөгдөв. Их Засаг хуулиар дэг журмыг тогтоосон үе юм.',
    facts: [
      'Их Засаг хууль: Шашин шүтэх бүрэн эрх чөлөөг дэлхийд анх баталгаажуулсан',
      'Өртөөний алба: Дэлхийн анхны тив дамнасан хурдан шуудан, харилцааны сүлжээ',
      'Дэлхийн энгээр худалдаа, соёлын сэргэлт өрнөсөн “Монголын их амар амгалан” (Pax Mongolica)',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1708873395735-dcad0140e3a2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mongol-empire',
    era: '1271 – 1368 он',
    title: 'Монголын эзэнт гүрэн',
    badge: 'Дэлхийн хамгийн том хуурай замын эзэнт гүрэн',
    desc: 'Хубилай хаан Юань гүрнийг байгуулж, нийслэлээ Хархорумаас Дайду (Бээжин)-д шилжүүлснээр эзэнт гүрэн Номхон далайгаас Дорнод Европ хүртэл өргөжиж, дэлхийн түүхийн гол тэнхлэг болсон юм.',
    facts: [
      'Хархорум: Дэлхийн улс төр, соёл, шашнуудын уулзвар болсон төв нийслэл',
      'Анх удаа төрийн баталгаатай цаасан мөнгө (Гүйлгээний хуудас) нэвтрүүлсэн',
      'Дөрвөлжин үсэг, одон орон, газрын зураг, анагаах ухааны үсрэнгүй хөгжил',
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
  },
  {
    id: 'xvii-xix-century',
    era: 'XVII – XIX зуун',
    title: 'XVII–XIX зууны Монгол',
    badge: 'Бага хаадын үе ба Манжийн эрхшээл',
    desc: 'Эзэнт гүрэн бутарсны дараа Батмөнх Даян хаан, Мандухай сэцэн хатан нар улсаа дахин нэгтгэхийг хичээсэн ч хожим дотоодын самуун, Манж Чин улсын нөлөөнд орж, шарын шашин эрчимтэй дэлгэрсэн сорилттой үе байв.',
    facts: [
      'Өндөр гэгээн Занабазар: Монголын сэргэн мандалтын урлагийн гайхамшиг, Соёмбо үсэг зохиогч',
      'Амарбаясгалант, Эрдэнэ зуу тэргүүтэй Буддын сонгодог архитектурын цогцолборууд байгуулагдав',
      'Үндэсний эрх чөлөөгөө сэргээх далд тэмцэл, эх оронч санаа үргэлжилсээр байв',
    ],
    imageUrl: '',
  },
  {
    id: 'xx-century',
    era: '1911 – 1990 он',
    title: 'XX зууны Монгол',
    badge: 'Тусгаар тогтнол & Бүтээн байгуулалт',
    desc: '1911 оны Үндэсний эрх чөлөөний хувьсгалаар VIII Богд Жавзандамба хутагтыг хаанаар өргөмжлөн тусгаар тогтнолоо сэргээв. 1921 оны Ардын хувьсгалаар БНМАУ тунхаглагдаж, орчин үеийн боловсрол, эрүүл мэнд, соёл хөгжсөн юм.',
    facts: [
      '1911.12.29: Манжийн ноёрхлыг эцэслэж тусгаар Монгол Улсыг сэргээн тунхаглав',
      '1961 он: НҮБ-ын бүрэн эрхт гишүүн улс болж, олон улсад албан ёсоор хүлээн зөвшөөрөгдөв',
      '1981 он: Монгол хүн (Ж.Гүррагчаа) сансарт ниссэн дэлхийн 10 дахь улс болов',
    ],
    imageUrl: '',
  },
  {
    id: 'modern-mongolia',
    era: '1990 оноос хойш',
    title: 'Орчин үеийн Монгол Улс',
    badge: 'Ардчилал & Чөлөөт зах зээл',
    desc: '1990 оны тайван замаар хийсэн Ардчилсан хувьсгалаар нэг намын тогтолцоог халж, 1992 оны шинэ Үндсэн хуулиар хүний эрх, хувийн өмч, чөлөөт эдийн засаг бүхий парламентын засаглалтай тусгаар Монгол Улс болж хөгжиж байна.',
    facts: [
      '1992 оны Үндсэн хууль: Ардчилсан шинэ төрийн тогтолцоог тунхаглав',
      'Дэлхийн бүх улс орнуудтай найрсаг харилцаатай, “Гуравдагч хөршийн” нээлттэй гадаад бодлого',
      'Эртний нүүдэлчдийн соёлыг орчин үеийн технологи, даяаршилтай хослуулан урагшилж байна',
    ],
    imageUrl: '',
  },
];

export default async function HistoryPage() {
  // Preview дээр Draft нийтлэлүүдийг тухай бүр шинээр харуулна (production-д статик, ISR хэвээр)
  if (isPreviewEnv()) await connection();
  const articles = await getHistoryArticles();
  const byPeriod: Record<string, HistoryArticle[]> = {};
  for (const a of articles) (byPeriod[a.period] ||= []).push(a);
  const themes = HISTORY_PERIODS.find((p) => p.id === 'themes')!;

  return (
    <div>
      
      {/* 3. ТҮҮХИЙН 7 ҮЕ ШАТЫН ТАЙМЛАЙН БҮТЭЦ */}
      <div className="space-y-36">
        {HISTORY_DATA.map((period, idx) => (
          <section
            key={period.id}
            id={period.id}
            className="scroll-mt-[calc(var(--nav-h)+5rem)] lg:scroll-mt-[calc(var(--nav-h)+1.5rem)] border-b border-neutral-200 pb-24 last:border-b-0"
          >
            {/* Толгойн үе шат ба дугаар */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl sm:text-6xl font-black text-[#15803d]">
                0{idx + 1}
              </span>
              <div className="h-[1px] bg-neutral-200 flex-1" />
              <span className="text-sm sm:text-base font-black uppercase tracking-widest text-neutral-400">
                {period.era}
              </span>
            </div>

            <div className={`grid grid-cols-1 gap-12 items-start ${period.imageUrl ? 'xl:grid-cols-12' : ''}`}>
              
              {/* Зүүн тал: Тайлбар болон Баримтууд */}
              <div className={period.imageUrl ? 'xl:col-span-7' : 'max-w-3xl'}>
                <span className="inline-block bg-emerald-50 text-[#15803d] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                  {period.badge}
                </span>

                <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight mb-6">
                  {period.title}
                </h2>

                <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed mb-8">
                  {period.desc}
                </p>

                {/* Гол баримтууд */}
                <div className="bg-neutral-50 rounded-3xl p-8 sm:p-10 border border-neutral-200 space-y-4">
                  <span className="text-xs sm:text-sm uppercase tracking-widest font-black text-neutral-400 block mb-2">
                    ТҮҮХЭН ОНЦЛОХ ҮЙЛ ЯВДЛУУД:
                  </span>
                  {period.facts.map((fact, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-3 text-base sm:text-lg text-neutral-800">
                      <span className="text-[#15803d] font-black text-xl leading-none mt-0.5">•</span>
                      <span className="leading-relaxed font-normal">{fact}</span>
                    </div>
                  ))}
                </div>

                <ArticleList articles={byPeriod[period.id]} />
              </div>

              {/* Баруун тал: Зураг (Монголынх нь шалгагдаагүй зургийг хассан бол байхгүй) */}
              {period.imageUrl && (
              <div className="xl:col-span-5">
                <div className="relative w-full h-[360px] sm:h-[480px] rounded-3xl overflow-hidden shadow-lg">
                  <img loading="lazy" decoding="async" src={period.imageUrl} alt={period.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-xs uppercase font-bold tracking-widest text-emerald-300 block mb-1">
                      Үе шат 0{idx + 1}
                    </span>
                    <p className="text-base sm:text-lg font-bold text-white">{period.title}</p>
                  </div>
                </div>
              </div>
              )}

            </div>
          </section>
        ))}

        {/* Цаг үеэр хуваагдахгүй сэдвүүд (хил, мөнгөн тэмдэгт, торгоны зам г.м.) */}
        {byPeriod.themes?.length ? (
          <section
            id={themes.id}
            className="scroll-mt-[calc(var(--nav-h)+5rem)] lg:scroll-mt-[calc(var(--nav-h)+1.5rem)] border-b border-neutral-200 pb-24 last:border-b-0"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl sm:text-6xl font-black text-[#15803d]">0{HISTORY_DATA.length + 1}</span>
              <div className="h-[1px] bg-neutral-200 flex-1" />
              <span className="text-sm sm:text-base font-black uppercase tracking-widest text-neutral-400">Бүх үе</span>
            </div>
            <div className="max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight mb-6">{themes.title}</h2>
              <p className="text-base sm:text-lg text-neutral-700 font-normal leading-relaxed">
                Тусгаар тогтнол, хил, засаг захиргаа, мөнгөн тэмдэгт, торго ба цайны зам зэрэг олон зууныг дамнасан сэдвүүд.
              </p>
              <ArticleList articles={byPeriod.themes} title="Нийтлэлүүд" />
            </div>
          </section>
        ) : null}

        {/* 4. ДАРААГИЙН ХУУДАС РУУ ШИЛЖИХ БАННЕР */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-14 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span className="text-xs sm:text-sm uppercase tracking-widest text-emerald-400 font-bold block mb-2">
              Дараагийн сэдэв
            </span>
            <h3 className="text-2xl sm:text-4xl font-black">03. Монгол хүн, хэл, үндэстний онцлог</h3>
            <p className="text-sm sm:text-base text-neutral-400 mt-2">Олон ястны өлгий нутаг, монгол бичиг, зан заншил</p>
          </div>
          <a
            href="/about/people"
            className="px-8 py-4 bg-[#15803d] hover:bg-emerald-600 text-white text-sm font-bold rounded-2xl transition-colors whitespace-nowrap shadow-sm"
          >
            Үргэлжлүүлэн үзэх →
          </a>
        </div>
      </div>
      <AboutRelated current="/about/history" embedded />

    </div>
  );
}


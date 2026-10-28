import Link from 'next/link';
import Image from 'next/image';


import CultureFestivals from '../components/CultureFestivals';
import HeroFlight from '../components/HeroFlight';
import RegionMap from '../components/RegionMap';
import SeasonRecommendations from '../components/SeasonRecommendations';
import TopDestinations from '../components/TopDestinations';
import { ShortsTabs } from '../components/shorts/Shorts';
import { client as baseClient, rethrowOutage } from '../lib/contentful';
import { SHORTS_BASE } from '../lib/shorts';
import { getShortsTopics } from '../lib/shortsData';
const client = baseClient as any;

// Цаг тутам дахин үүснэ: Shorts-ийн fetch кэш (24 цаг) шинэчлэгдсэний дараа шинэ бичлэг удалгүй гарна.
// Contentful-ын хариу 7 хоногийн Data Cache-аас (lib/contentful.ts) тул CDA хүсэлт нэмэгдэхгүй.
export const revalidate = 3600;

async function getDestinations() {
  try {
    const entries = await client.getEntries({
      content_type: 'destination',
      order: ['-sys.createdAt'],
    });
    return entries.items || [];
  } catch (err) {
    rethrowOutage(err);
    console.error('Destinations татахад алдаа гарлаа:', err);
    return [];
  }
}

async function getRecommendations() {
  try {
    const entries = await client.getEntries({
      content_type: 'recommendation',
      order: ['-sys.createdAt'],
      limit: 4,
    });
    return entries.items || [];
  } catch (err) {
    rethrowOutage(err);
    console.error('Recommendations татахад алдаа гарлаа:', err);
    return [];
  }
}

export default async function Home() {
  const destinations = await getDestinations();
  const recommendations = await getRecommendations();
  // Бичлэггүй сэдвийн таб харагдахгүй
  const shorts = (await getShortsTopics()).filter((t) => t.videos.length > 0);

  return (
    <main className="pb-36 min-h-screen text-neutral-900 selection:text-white bg-white selection:bg-[#15803d]">
      {/* 1. HERO ХЭСЭГ (ГҮЙЛГЭХЭД ТОГЛОГДОХ НИСЛЭГ) */}
      <HeroFlight />

      {/* 2. АЙМГУУДЫН ИНТЕРАКТИВ ЗУРАГ */}
      <RegionMap />

      {/* 3. ОНЦЛОХ ГАЗРУУДЫН СЛАЙДЕР */}
      <TopDestinations items={destinations} />

      {/* 4. БОГИНО БИЧЛЭГ: сэдвийн табууд + нэг мөр YouTube Shorts (lib/shortsData.ts, components/shorts/) */}
      {shorts.length > 0 && (
        <section aria-labelledby="shorts-heading" className="py-10 px-6 mx-auto max-w-7xl sm:px-10">
          <div className="flex gap-4 justify-between items-end mb-4">
            <h2 id="shorts-heading" className="text-xl font-black tracking-tight text-neutral-900 sm:text-3xl">
              Монголыг богино бичлэгээр
            </h2>
            <Link
              href={SHORTS_BASE}
              className="flex shrink-0 gap-1 items-center text-xs font-bold text-neutral-900 hover:text-[#15803d]"
            >
              Бүх бичлэг →
            </Link>
          </div>
          <ShortsTabs categories={shorts} />
        </section>
      )}

      {/* 5. УЛИРЛЫН ЗӨВЛӨМЖ ХЭСЭГ */}
      <SeasonRecommendations items={recommendations} />

      {/* 6. УЛАМЖЛАЛТ БАЯР НААДАМ ХЭСЭГ */}
      <CultureFestivals />

      {/* 7. САНАЛ БОЛГОХ МАРШРУТУУД */}
      <section className="py-16 px-6 mx-auto max-w-7xl sm:px-10">
        <div className="flex flex-col gap-3 justify-between pb-4 mb-10 border-b border-neutral-200 sm:flex-row sm:items-end">
          <div>
            <span className="block mb-1 text-xs font-bold tracking-widest text-[#15803d] uppercase">
              Аяллын чиглэл
            </span>
            <h2 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-4xl">
              Санал болгох маршрутууд
            </h2>
          </div>
          <Link
            href="/inspiration/itineraries"
            className="flex gap-1 items-center text-xs font-bold text-neutral-900 hover:text-[#15803d]"
          >
            Бүх маршрутыг харах →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {[
            {
              days: '6 өдөр / 5 шөнө',
              title: 'Орхоны хөндий & Төв Монголын сонгодог соёлын зам',
              route: 'УБ ➔ Элсэн тасархай ➔ Хархорум ➔ Хүрхрээ ➔ Цэнхэр рашаан',
              image:
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=900',
            },
            {
              days: '7 өдөр / 6 шөнө',
              title: 'Өмнөд говийн сонгодог тойрог (Элсэн манхан, хавцал)',
              route: 'УБ ➔ Цагаан суварга ➔ Ёлын ам ➔ Хонгорын элс ➔ Баянзаг',
              image:
                'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=900',
            },
          ].map((itin, idx) => (
            <div
              key={idx}
              className="group flex overflow-hidden flex-col bg-white rounded-3xl border border-neutral-200/80 hover:shadow-xl transition-all duration-300 sm:flex-row shadow-xs"
            >
              <div className="overflow-hidden relative w-full h-56 sm:w-2/5 sm:h-auto">
                <Image
                  src={itin.image}
                  alt={itin.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 py-1 px-3 text-[10px] font-bold text-white bg-neutral-900/80 rounded-full backdrop-blur-md">
                  ⏱️ {itin.days}
                </span>
              </div>
              <div className="flex flex-col flex-1 justify-between p-6">
                <div>
                  <span className="block mb-1.5 text-[11px] font-bold text-[#15803d]">
                    ЧИГЛЭЛ: {itin.route}
                  </span>
                  <h3 className="text-lg font-bold leading-snug text-neutral-900 group-hover:text-[#15803d] transition-colors">
                    {itin.title}
                  </h3>
                </div>
                <Link
                  href="/inspiration/itineraries"
                  className="flex justify-between items-center pt-4 mt-4 text-xs font-bold text-neutral-900 border-t border-neutral-100"
                >
                  <span>Маршрут үзэх</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

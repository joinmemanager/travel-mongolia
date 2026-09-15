import Image from 'next/image';
import Link from 'next/link';

import CultureFestivals from '../components/CultureFestivals';
import HeroText from '../components/HeroText';
import RegionMap from '../components/RegionMap';
import SeasonRecommendations from '../components/SeasonRecommendations';
import TopDestinations from '../components/TopDestinations';
import { client } from '../lib/contentful';

async function getDestinations() {
  try {
    const entries = await client.getEntries({
      content_type: 'destination',
      order: ['-sys.createdAt'],
    });
    return entries.items || [];
  } catch (err) {
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
    console.error('Recommendations татахад алдаа гарлаа:', err);
    return [];
  }
}

export default async function Home() {
  const destinations = await getDestinations();
  const recommendations = await getRecommendations();

  return (
    <main className="pb-36 min-h-screen text-neutral-900 selection:text-white bg-white selection:bg-[#15803d]">
      {/* 1. HERO ХЭСЭГ (ВИДЕО ДЭВСГЭР) */}
      <section className="flex overflow-hidden relative justify-center items-center w-full h-[90vh] text-center">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero.jpg"
          className="object-cover absolute inset-0 w-full h-full"
        >
          {/* Файлын нэр heroo.mp4 байгаа бол src="/heroo.mp4" байна */}
          <source src="/heroo.mp4" type="video/mp4" />
        </video>

        {/* Дээгүүр нь уусах харанхуй бүрхүүл */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Текстүүд дээр нь харагдана */}
        <div className="relative z-10">
          <HeroText />
        </div>
      </section>

      {/* 2. АЙМГУУДЫН ИНТЕРАКТИВ ЗУРАГ */}
      <RegionMap />

      {/* 3. ОНЦЛОХ ГАЗРУУДЫН СЛАЙДЕР */}
      <TopDestinations items={destinations} />

      {/* 4. ҮЗЭХ, ХИЙХ ЗҮЙЛС: ОЛОН ХЭЛБЭРТ КОНТЕНТ */}
      <section className="py-16 px-6 mx-auto max-w-7xl sm:px-10">
        <div className="mb-8">
          <span className="block mb-1 text-xs font-bold tracking-widest text-[#15803d] uppercase">
            Олон хэлбэрт контент
          </span>
          <h2 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-4xl">
            Хүссэн хэлбэрээрээ үзээрэй
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              title: 'Богино видео',
              icon: '📽️',
              image:
                'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
            },
            {
              title: 'Тайлбар видео',
              icon: '✨',
              image:
                'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600',
            },
            {
              title: 'Подкаст',
              icon: '🎧',
              image:
                'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
            },
            {
              title: 'Фото түүх',
              icon: '📖',
              image:
                'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
            },
            {
              title: 'Инфографик',
              icon: '📊',
              image:
                'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
            },
            {
              title: 'Мэдлэгийн карт',
              icon: '✏️',
              image:
                'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
            },
          ].map((media, idx) => (
            <Link
              key={idx}
              href="/things-to-do/nature"
              className="group flex overflow-hidden relative flex-col justify-end p-4 h-64 rounded-2xl hover:shadow-lg transition-all duration-300 shadow-xs"
            >
              <Image
                src={media.image}
                alt={media.title}
                fill
                unoptimized
                className="object-cover brightness-[0.70] transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="relative z-10">
                <div className="flex justify-center items-center mb-2 w-8 h-8 text-xs text-white bg-white/20 rounded-full backdrop-blur-md">
                  {media.icon}
                </div>
                <h4 className="text-xs font-bold leading-tight text-white">
                  {media.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex gap-3 justify-center items-center mt-6 text-xs text-neutral-500">
          <span>Контентоо аваарай:</span>
          <button className="flex gap-1.5 items-center py-1.5 px-4 font-medium text-neutral-700 hover:bg-neutral-50 rounded-full border border-neutral-200 transition-colors cursor-pointer">
            📥 Татаж авах
          </button>
          <button className="flex gap-1.5 items-center py-1.5 px-4 font-medium text-neutral-700 hover:bg-neutral-50 rounded-full border border-neutral-200 transition-colors cursor-pointer">
            ✈️ Хуваалцах
          </button>
        </div>
      </section>

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

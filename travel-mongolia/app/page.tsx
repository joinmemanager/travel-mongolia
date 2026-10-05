import Link from 'next/link';
import Image from 'next/image';


import CultureFestivals from '../components/CultureFestivals';
import HeroText from '../components/HeroText';
import RegionMap from '../components/RegionMap';
import SeasonRecommendations from '../components/SeasonRecommendations';
import TopDestinations from '../components/TopDestinations';
import { IMAGES } from '../lib/images';
import { client as baseClient } from '../lib/contentful';
const client = baseClient as any;

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
    <main className="pb-36 min-h-screen text-neutral-900 selection:text-white bg-cream selection:bg-gold selection:text-night">
      {/* 1. HERO ХЭСЭГ (ВИДЕО ДЭВСГЭР) */}
      <section className="flex overflow-hidden relative justify-center items-end pb-24 w-full h-[90vh] text-center">
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
        <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/35 to-night/10" />

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
          <span className="block mb-1 text-[11px] font-semibold tracking-[0.25em] text-gold-ink uppercase">
            Олон хэлбэрт контент
          </span>
          <h2 className="text-2xl font-serif font-bold text-ink sm:text-4xl">
            Хүссэн хэлбэрээрээ үзээрэй
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              title: 'Богино видео',
              icon: '📽️',
              image: IMAGES.eagleHunter.src,
              alt: IMAGES.eagleHunter.alt,
            },
            {
              title: 'Тайлбар видео',
              icon: '✨',
              image: IMAGES.gerCamp.src,
              alt: IMAGES.gerCamp.alt,
            },
            {
              title: 'Подкаст',
              icon: '🎧',
              image: IMAGES.gerStars.src,
              alt: IMAGES.gerStars.alt,
            },
            {
              title: 'Фото түүх',
              icon: '📖',
              image: IMAGES.lakeGers.src,
              alt: IMAGES.lakeGers.alt,
            },
            {
              title: 'Инфографик',
              icon: '📊',
              image: IMAGES.redCliffs.src,
              alt: IMAGES.redCliffs.alt,
            },
            {
              title: 'Мэдлэгийн карт',
              icon: '✏️',
              image: IMAGES.whiteHorse.src,
              alt: IMAGES.whiteHorse.alt,
            },
          ].map((media, idx) => (
            <Link
              key={idx}
              href="/things-to-do/nature"
              className="group flex overflow-hidden relative flex-col justify-end p-4 h-64 rounded-xl hover:shadow-lg transition-all duration-300 shadow-xs"
            >
              <Image
                src={media.image}
                alt={media.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
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
            <span className="block mb-1 text-[11px] font-semibold tracking-[0.25em] text-gold-ink uppercase">
              Аяллын чиглэл
            </span>
            <h2 className="text-2xl font-serif font-bold text-ink sm:text-4xl">
              Санал болгох маршрутууд
            </h2>
          </div>
          <Link
            href="/inspiration/itineraries"
            className="flex gap-1 items-center text-xs font-bold text-neutral-900 hover:text-gold-ink"
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
              image: IMAGES.gerCamp.src,
              alt: IMAGES.gerCamp.alt,
            },
            {
              days: '7 өдөр / 6 шөнө',
              title: 'Өмнөд говийн сонгодог тойрог (Элсэн манхан, хавцал)',
              route: 'УБ ➔ Цагаан суварга ➔ Ёлын ам ➔ Хонгорын элс ➔ Баянзаг',
              image: IMAGES.camels.src,
              alt: IMAGES.camels.alt,
            },
          ].map((itin, idx) => (
            <div
              key={idx}
              className="group flex overflow-hidden flex-col bg-white rounded-xl border border-ink/10 hover:border-gold transition-all duration-300 sm:flex-row shadow-xs"
            >
              <div className="overflow-hidden relative w-full h-56 sm:w-2/5 sm:h-auto">
                <Image
                  src={itin.image}
                  alt={itin.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 py-1 px-3 text-[10px] font-bold text-white bg-night/85 rounded-full backdrop-blur-md">
                  ⏱️ {itin.days}
                </span>
              </div>
              <div className="flex flex-col flex-1 justify-between p-6">
                <div>
                  <span className="block mb-1.5 text-[11px] font-semibold tracking-[0.15em] text-gold-ink">
                    ЧИГЛЭЛ: {itin.route}
                  </span>
                  <h3 className="font-serif text-lg font-bold leading-snug text-neutral-900 group-hover:text-gold-ink transition-colors">
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

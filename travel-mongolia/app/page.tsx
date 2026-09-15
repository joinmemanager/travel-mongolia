import Image from 'next/image';
import Link from 'next/link';
import { client } from '../lib/contentful';
import RegionMap from '../components/RegionMap';
import HeroText from '../components/HeroText';
import TopDestinations from '../components/TopDestinations';
import CultureFestivals from '../components/CultureFestivals';
import SeasonRecommendations from '../components/SeasonRecommendations';

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
    <main className="min-h-screen bg-white text-neutral-900 selection:bg-[#15803d] selection:text-white pb-36">
      
      {/* 1. HERO ХЭСЭГ (ВИДЕО ДЭВСГЭР) */}
      <section className="relative h-[90vh] w-full flex items-center justify-center text-center overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero.jpg"
          className="absolute inset-0 w-full h-full object-cover"
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
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-[#15803d] block mb-1">
            Олон хэлбэрт контент
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
            Хүссэн хэлбэрээрээ үзээрэй
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { title: 'Богино видео', icon: '📽️', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600' },
            { title: 'Тайлбар видео', icon: '✨', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600' },
            { title: 'Подкаст', icon: '🎧', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600' },
            { title: 'Фото түүх', icon: '📖', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600' },
            { title: 'Инфографик', icon: '📊', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600' },
            { title: 'Мэдлэгийн карт', icon: '✏️', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600' },
          ].map((media, idx) => (
            <Link
              key={idx}
              href="/things-to-do/nature"
              className="group relative h-64 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-end p-4"
            >
              <Image src={media.image} alt={media.title} fill unoptimized className="object-cover group-hover:scale-108 transition-transform duration-500 brightness-[0.70]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center text-xs mb-2">
                  {media.icon}
                </div>
                <h4 className="text-xs font-bold text-white leading-tight">{media.title}</h4>
              </div>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 text-xs text-neutral-500">
          <span>Контентоо аваарай:</span>
          <button className="px-4 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
            📥 Татаж авах
          </button>
          <button className="px-4 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
            ✈️ Хуваалцах
          </button>
        </div>
      </section>

      {/* 5. УЛИРЛЫН ЗӨВЛӨМЖ ХЭСЭГ */}
      <SeasonRecommendations items={recommendations} />

      {/* 6. УЛАМЖЛАЛТ БАЯР НААДАМ ХЭСЭГ */}
      <CultureFestivals />

      {/* 7. САНАЛ БОЛГОХ МАРШРУТУУД */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-neutral-200 pb-4 mb-10 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#15803d] block mb-1">
              Аяллын чиглэл
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-neutral-900 tracking-tight">
              Санал болгох маршрутууд
            </h2>
          </div>
          <Link href="/inspiration/itineraries" className="text-xs font-bold text-neutral-900 hover:text-[#15803d] flex items-center gap-1">
            Бүх маршрутыг харах →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              days: '6 өдөр / 5 шөнө',
              title: 'Орхоны хөндий & Төв Монголын сонгодог соёлын зам',
              route: 'УБ ➔ Элсэн тасархай ➔ Хархорум ➔ Хүрхрээ ➔ Цэнхэр рашаан',
              image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=900',
            },
            {
              days: '7 өдөр / 6 шөнө',
              title: 'Өмнөд говийн сонгодог тойрог (Элсэн манхан, хавцал)',
              route: 'УБ ➔ Цагаан суварга ➔ Ёлын ам ➔ Хонгорын элс ➔ Баянзаг',
              image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=900',
            },
          ].map((itin, idx) => (
            <div key={idx} className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-2/5 h-56 sm:h-auto overflow-hidden">
                <Image src={itin.image} alt={itin.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  ⏱️ {itin.days}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#15803d] block mb-1.5">ЧИГЛЭЛ: {itin.route}</span>
                  <h3 className="text-lg font-bold text-neutral-900 leading-snug group-hover:text-[#15803d] transition-colors">{itin.title}</h3>
                </div>
                <Link href="/inspiration/itineraries" className="pt-4 border-t border-neutral-100 text-xs font-bold text-neutral-900 flex items-center justify-between mt-4">
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
import Link from 'next/link';
import { photoSrc } from '@/lib/images';
import Image from 'next/image';


import CultureFestivals from '../components/CultureFestivals';
import HeroFlight from '../components/HeroFlight';
import RegionMap from '../components/RegionMap';
import SeasonRecommendations from '../components/SeasonRecommendations';
import TopDestinations from '../components/TopDestinations';
import { client as baseClient, rethrowOutage } from '../lib/contentful';
const client = baseClient as any;

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

  return (
    <main className="pb-36 min-h-screen text-neutral-900 selection:text-white bg-white selection:bg-[#15803d]">
      {/* 1. HERO ХЭСЭГ (ГҮЙЛГЭХЭД ТОГЛОГДОХ НИСЛЭГ) */}
      <HeroFlight />

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

        {/* Гадаад холбоос (YouTube, Facebook, joinme.mn). GA4: content_format_click (components/Analytics.tsx),
            joinme.mn холбоосонд joinme_click нь Analytics-ийн ерөнхий логикоор тусдаа илгээгдэнэ. */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              title: 'Богино видео',
              icon: '📽️',
              image: photoSrc('gerStars', 600),
              href: 'https://www.youtube.com/@joinmemn/shorts',
              platform: 'YouTube',
              action: 'YouTube-д үзэх',
            },
            {
              title: 'Тайлбар видео',
              icon: '✨',
              image: photoSrc('camels', 600),
              href: 'https://www.youtube.com/watch?v=pyu49PiEzgE',
              platform: 'YouTube',
              action: 'YouTube-д үзэх',
            },
            {
              title: 'Подкаст',
              icon: '🎧',
              // Монголынх эсэх нь шалгагдаагүй stock зураг (docs/section-layout/images.md)
              image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
              href: 'https://www.youtube.com/watch?v=HMIBP0sZpd4',
              platform: 'YouTube',
              action: 'YouTube-д сонсох',
            },
            {
              title: 'Фото түүх',
              icon: '📖',
              image: photoSrc('eagleHunter', 600),
              href: 'https://joinme.mn/media/1294',
              platform: 'Joinme',
              action: 'Joinme-д үзэх',
            },
            {
              title: 'Инфографик',
              icon: '📊',
              // Монголынх эсэх нь шалгагдаагүй stock зураг (docs/section-layout/images.md)
              image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
              href: 'https://www.facebook.com/photo.php?fbid=2916077865308828&set=pb.100064842455264.-2207520000&type=3',
              platform: 'Facebook',
              action: 'Facebook-т үзэх',
            },
            {
              title: 'Мэдлэгийн карт',
              icon: '✏️',
              // Монголынх эсэх нь шалгагдаагүй stock зураг (docs/section-layout/images.md)
              image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
              href: 'https://www.facebook.com/reel/3592870177548945',
              platform: 'Facebook',
              action: 'Facebook-т үзэх',
            },
          ].map((media) => (
            <a
              key={media.title}
              href={media.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${media.title} — ${media.action} (шинэ цонхонд нээгдэнэ)`}
              data-ga-event="content_format_click"
              data-ga-params={JSON.stringify({ item_name: media.title, platform: media.platform })}
              data-joinme-type="content_format"
              data-joinme-name={media.title}
              className="group flex overflow-hidden relative flex-col justify-end p-4 h-64 rounded-2xl shadow-xs transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-visible:shadow-lg focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:ring-offset-2"
            >
              <Image
                src={media.image}
                alt=""
                fill
                unoptimized
                className="object-cover brightness-[0.70] transition-transform duration-500 group-hover:scale-108 group-focus-visible:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="flex absolute top-3 right-3 z-10 gap-1 items-center py-0.5 px-2 text-[10px] font-semibold text-white bg-black/40 rounded-full backdrop-blur-md">
                {media.platform}
                <svg aria-hidden="true" viewBox="0 0 12 12" className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4.5 2H2v8h8V7.5M7 2h3v3M10 2 5.5 6.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="relative z-10">
                <div className="flex justify-center items-center mb-2 w-8 h-8 text-xs text-white bg-white/20 rounded-full backdrop-blur-md">
                  {media.icon}
                </div>
                <h4 className="text-xs font-bold leading-tight text-white">
                  {media.title}
                </h4>
              </div>
            </a>
          ))}
        </div>

        {/* Татаж авах, хуваалцах: хараахан ажиллахгүй */}
        <div className="flex flex-wrap gap-3 justify-center items-center mt-6 text-xs text-neutral-500">
          <span>Контентоо аваарай:</span>
          {['📥 Татаж авах', '✈️ Хуваалцах'].map((label) => (
            <button
              key={label}
              type="button"
              disabled
              aria-disabled="true"
              className="flex gap-1.5 items-center py-1.5 px-4 font-medium text-neutral-400 bg-neutral-50 rounded-full border border-neutral-200 cursor-not-allowed"
            >
              <span className="opacity-60">{label}</span>
              <span className="py-0.5 px-1.5 text-[10px] font-semibold text-neutral-500 bg-neutral-200 rounded-full">
                Удахгүй
              </span>
            </button>
          ))}
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

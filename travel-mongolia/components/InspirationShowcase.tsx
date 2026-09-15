'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ArticleItem {
  title: string;
  badge: string;
  author: string;
  readTime: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  isCover?: boolean;
}

interface SeasonItem {
  id: string;
  name: string;
  period: string;
  title: string;
  desc: string;
  highlights: string[];
  imageUrl: string;
}

interface StyleItem {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  features: string[];
  imageUrl: string;
}

interface ItineraryItem {
  id: string;
  duration: string;
  title: string;
  route: string;
  distance: string;
  stops: string[];
  imageUrl: string;
}

export default function InspirationShowcase({
  groupKey = 'stories',
  subSlug,
}: {
  groupKey: string;
  subSlug?: string;
}) {
  const [activeNav, setActiveNav] = useState<string>(subSlug || '');
  const isClicking = useRef(false);

  useEffect(() => {
    if (subSlug) {
      setActiveNav(subSlug);
      const timer = setTimeout(() => {
        const el = document.getElementById(subSlug);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [subSlug]);

  const scrollToId = (id: string) => {
    isClicking.current = true;
    setActiveNav(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isClicking.current = false;
      }, 800);
    }
  };

  // ---------------- 1. СЭТГҮҮЛ & ТҮҮХҮҮД (STORIES) ДАТА ----------------
  const storiesSections = [
    {
      id: 'magazine',
      tab: 'Mongolia Magazine',
      title: 'Mongolia Magazine (Шилдэг нийтлэлүүд)',
      cover: {
        title: 'Мөнх цаст Алтайн чанадад: Цаатнууд ба Бүргэдчин бүсгүй',
        author: 'Б.Тэмүүлэн',
        readTime: '8 мин',
        date: '2026.09 сар',
        badge: 'Cover Story',
        excerpt: 'Цаг хугацаа зогссон мэт онгон тайга, Алтайн сүрлэг хавцалд өв соёлоо хадгалан үлдсэн хүмүүсийн эгэл мөртлөө ер бусын амьдралын мөрөөр.',
        imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1400',
      },
      list: [
        { title: 'Хөвсгөлийн тайгын алтан намар', author: 'Д.Саруул', readTime: '4 мин', date: 'Намар', badge: 'Фото эссэ', excerpt: 'Мөнгөн ус шиг тунгалаг нуурын хөвөөгөөр мориор аялж шарласан тайгыг дуранд буулгасан нь.', imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800' },
        { title: 'Говийн уудамд Сүүн замын доор хоноглосон шөнө', author: 'Г.Болд', readTime: '5 мин', date: 'Зун', badge: 'Одон орон', excerpt: 'Гэрлийн бохирдолгүй говийн уудам тэнгэрт тэрбум одод толгой дээр асгарах мэт мэдрэмж.', imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800' },
        { title: 'Орхоны хүрхрээний өвлийн мөсөн хөшиг', author: 'Т.Эрдэнэ', readTime: '5 мин', date: 'Өвөл', badge: 'Өвөл', excerpt: 'Хасах 30 хэмд хөлдсөн байгалийн уран баримал, ойр орчмын халуун рашааны төгс зохицол.', imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800' },
      ],
    },
    {
      id: 'hidden',
      tab: 'Hidden Mongolia',
      title: 'Hidden Mongolia (Олны танил биш онгон нутаг)',
      cover: {
        title: 'Дархадын хотгор: 300 нуур, хязгааргүй өтгөн тайгын гүнд',
        author: 'Т.Эрдэнэ',
        readTime: '9 мин',
        date: 'Шинэ',
        badge: 'Экспедиц',
        excerpt: 'Машины замгүй, зөвхөн мориор эсвэл явган туулах боломжтой Дархадын хотгор бол дэлхийн хамгийн сүүлчийн онгон экосистем.',
        imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1400',
      },
      list: [
        { title: 'Дорнодын Цагаан дэлийн нууц агуй', author: 'Б.Болд', readTime: '4 мин', date: 'Зун', badge: 'Агуй', excerpt: 'Монголын хамгийн урт карстын тогтоцтой агуйн гүнд нуугдсан байгалийн содон нууцууд.', imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800' },
        { title: 'Хэрмэн цавын улаан хавцал: Марс гариг дэлхий дээр', author: 'Д.Саруул', readTime: '6 мин', date: 'Хавар', badge: 'Говь', excerpt: 'Үлэг гүрвэлийн олдворууд салхинд ил гарсан улаан шаварлаг хавцлын экспедиц.', imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800' },
      ],
    },
    {
      id: 'local-stories',
      tab: 'Local Stories',
      title: 'Local Stories (Орон нутгийн эгэл амьдрал)',
      cover: {
        title: 'Говийн жинчин өвгөний тэмээн жингээр үдсэн 50 жил',
        author: 'М.Хулан',
        readTime: '7 мин',
        date: '2026.08',
        badge: 'Өв тээгч',
        excerpt: 'Улаан цавын элсэн манхны дундуур замгүй говьд зөвхөн оддоор зүг чигээ баримжаалж аялсан хууч яриа.',
        imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1400',
      },
      list: [
        { title: 'Алтайн бүргэдчин өвөөгийн өв залгамжлал', author: 'А.Бахыт', readTime: '5 мин', date: 'Намар', badge: 'Уламжлал', excerpt: 'Анч бүргэдээ гэр бүлийн гишүүн мэт сургаж хад асганд ан хийдэг эртний соёл.', imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800' },
        { title: 'Булганы сайхан айраг эсгэх хөхүүрийн соёл', author: 'С.Баяр', readTime: '4 мин', date: 'Зун', badge: 'Өв', excerpt: 'Хөхүүрэнд өдөрт хэдэн мянган удаа бүлж байгалийн аргаар гаргаж авдаг амт чанар.', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800' },
      ],
    },
    {
      id: 'top-lists',
      tab: 'Top Lists',
      title: 'Top Lists (Сонгомол жагсаалтууд)',
      cover: {
        title: 'Монголд амьдралдаа заавал үзэх байгалийн 10 ер бусын тогтоц',
        author: 'Редакци',
        readTime: '10 мин',
        date: 'Шинэчилсэн',
        badge: 'Top 10',
        excerpt: 'Хонгорын дуут манхан, Цагаан суварга, Алтай Таван Богдоос эхлээд дэлхийд гайхагдсан шилдэг 10 газар.',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400',
      },
      list: [
        { title: 'Гэрэл зурагчны заавал очих нар жаргах 5 цэг', author: 'Г.Болд', readTime: '4 мин', date: '2026', badge: 'Top 5', excerpt: 'Мэргэжлийн гэрэл зурагчдын зөвлөсөн алтан туяа татах шилдэг байршлууд.', imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800' },
        { title: 'Одот тэнгэрийг тольдох шилдэг 5 эко гэр кэмп', author: 'Wellness', readTime: '5 мин', date: '2026', badge: 'Top 5', excerpt: 'Сүлжээгүй дижитал детокс хийж тав тухтай орчинд байгальтайгаа уусах сонголтууд.', imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800' },
      ],
    },
  ];

  // ---------------- 2. УЛИРЛААР АЯЛАХ (SEASONS) ДАТА ----------------
  const SEASONS_DATA: SeasonItem[] = [
    {
      id: 'spring',
      name: 'Хавар',
      period: '3 – 5 сар',
      title: 'Төл мал бойжих & Байгаль нойрноос сэрэхүй',
      desc: 'Малчны хотонд нялх төлийн дуу цангинаж, тал нутаг амьдралаар бялхдаг хамгийн хөдөлгөөнтэй, урин үе.',
      highlights: ['Малчин айлд төл хүлээн авах', 'Говийн урин хаврын шувуудын чуулган', 'Уулсын яргуй дэлгэрэх мөч'],
      imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900',
    },
    {
      id: 'summer',
      name: 'Зун',
      period: '6 – 8 сар',
      title: 'Ногоон тал нутаг & Их Наадмын цэнгэл',
      desc: 'Аялахад хамгийн таатай дулаан үе. Гол мөрөн цэллэлзэж, хээр тал ногоон хивс мэт ногоорон эрийн гурван наадам улс орон даяар эхэлнэ.',
      highlights: ['Үндэсний Их Баяр Наадам', 'Хөвсгөл нуурын усан аялал', 'Орхоны хөндийн майхант отог'],
      imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=900',
    },
    {
      id: 'autumn',
      name: 'Намар',
      period: '9 – 10 сар',
      title: 'Алтан намар: Тааламжтай сэрүүн аялал',
      desc: 'Шинэс мод шаргалтан, агаар тунгалагшин халуун ч биш, хүйтэн ч биш хамгийн тогтуун таатай уур амьсгал бүрдэнэ.',
      highlights: ['Алтайн Бүргэдийн баяр', 'Хөвсгөл ба Хангайн шарласан тайга', 'Өмнөд говийн намуун элсэн манхан'],
      imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=900',
    },
    {
      id: 'winter',
      name: 'Өвөл',
      period: '11 – 2 сар',
      title: 'Цасан цагаан тал & Хөх мөсний баяр',
      desc: 'Цэвэр агаар, утаагүй онгон байгаль, хөлдсөн нуурын метр зузаан мөсөн дээрх морин чарга, Цагаан сарын уламжлалт ёс заншил.',
      highlights: ['Хөх сувд Мөсний баяр', 'Өмнөговийн Түмэн тэмээний баяр', 'Скай Резорт цанын спорт'],
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900',
    },
  ];

  // ---------------- 3. АЯЛЛЫН ХЭВ МАЯГ (STYLES) ДАТА ----------------
  const STYLES_DATA: StyleItem[] = [
    {
      id: 'adventure',
      title: 'Adventure & Active',
      subtitle: 'Уулын оргилд авирах, 4х4 бартаат замаар давхих, голын каякаар урсах адал явдал',
      tags: ['#Trekking', '#4x4Offroad', '#Kayaking', '#Camping'],
      features: ['Алтай Таван Богдын мөсөн голын авиралт', 'Өмнөд говийн бартаат замын экспедиц', 'Орхоны хөндийн 4 өдрийн морин аялал'],
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200',
    },
    {
      id: 'culture',
      title: 'Culture & Heritage',
      subtitle: 'Чингис хааны өлгий нутаг, эртний Хархорум, буддын хийдүүдийн мянган жилийн соёлын өв',
      tags: ['#UNESCO', '#МонголГэр', '#ХийдСүм', '#Музей'],
      features: ['Хархорум ба Эрдэнэ зуу хийд', 'Амарбаясгалант хийдийн Буддын уран барилга', 'Чингис хаан Үндэсний музей'],
      imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200',
    },
    {
      id: 'family',
      title: 'Family Friendly',
      subtitle: 'Хүүхэд болон гэр бүлд аюулгүй, тав тухтай амралтын баазууд, танин мэдэхүйн хөтөлбөрүүд',
      tags: ['#Аюулгүй', '#ГэрБүл', '#ТахьАжиглах', '#Амралт'],
      features: ['Горхи Тэрэлж ба Чингисийн морьт хөшөө', 'Хустайн нуруунд зэрлэг тахь тольдох', 'Элсэн тасархай: Тэмээ унах аялал'],
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200',
    },
    {
      id: 'luxury',
      title: 'Luxury & Slow Travel',
      subtitle: 'Өндөр зэрэглэлийн гэр вилла, рашаан сувилал, онгоц нисдэг тэрэгний хувийн экспедицүүд',
      tags: ['#VIPGers', '#ThermalSpa', '#Helicopter', '#DigitalDetox'],
      features: ['Three Camel Lodge тансаг эко вилла', 'Цэнхэрийн халуун рашааны VIP амралт', 'Нисдэг тэргээр Монгол орныг тольдох'],
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    },
  ];

  // ---------------- 4. САНАЛ БОЛГОХ МАРШРУТ (ITINERARIES) ДАТА ----------------
  const ITINERARIES_DATA: ItineraryItem[] = [
    {
      id: '3days',
      duration: '3 Өдөр / 2 Шөнө',
      title: 'Улаанбаатар – Горхи Тэрэлж – Чингисийн морьт хөшөө',
      route: 'УБ ➔ Горхи-Тэрэлж ➔ Арьяабал хийд ➔ Цонжин Болдог ➔ УБ',
      distance: 'Нийт: 220 км (100% хатуу хучилттай)',
      stops: ['Мэлхий хад тольдох', 'Арьяабалын бясалгалын хийдээр алхах', 'Дэлхийн хамгийн том морьт хөшөөнд гарах', 'Тав тухтай гэр кэмпэд хоноглох'],
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=900',
    },
    {
      id: '5-7days',
      duration: '6 Өдөр / 5 Шөнө',
      title: 'Орхоны хөндий & Төв Монголын сонгодог соёлын зам',
      route: 'УБ ➔ Элсэн тасархай ➔ Хархорум ➔ Орхоны хүрхрээ ➔ Цэнхэрийн рашаан ➔ Угий нуур',
      distance: 'Нийт: 850 км (Засмал болон сайжруулсан зам)',
      stops: ['Элсэн манхан дээр тэмээ унах', 'Эрдэнэ зуу хийд ба Хархорум музей', 'Улаан цутгалангийн 20м хүрхрээ', 'Цэнхэрийн 86 хэмийн халуун рашаанд орох'],
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=900',
    },
    {
      id: '10-14days',
      duration: '12 Өдөр / 11 Шөнө',
      title: 'Говь болон Хангайн нурууны хосолсон их тойрон аялал',
      route: 'УБ ➔ Цагаан суварга ➔ Ёлын ам ➔ Хонгорын элс ➔ Баянзаг ➔ Орхон ➔ Тэрхийн цагаан нуур ➔ УБ',
      distance: 'Нийт: 2,400 км (Говь, хангайн холимог бартаат зам)',
      stops: ['Цагаан суваргын өнгөт хавцал', 'Хонгорын дуут манхны оргилд гарах', 'Үлэг гүрвэлийн нутаг Баянзаг', 'Хорго галт уулын тогоо дээр гарах'],
      imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=900',
    },
    {
      id: 'themed',
      duration: '8 Өдөр / 7 Шөнө',
      title: 'Цаатан зоны мөрөөр: Хөвсгөлийн тайгын морин аялал',
      route: 'Мөрөн ➔ Улаан-Уул ➔ Цагааннуур ➔ Зүүн / Баруун тайга ➔ Хөвсгөл нуур',
      distance: 'Морин аялал: 120 км тайгын гүнд',
      stops: ['Цаа бугын аж ахуйтай танилцах', 'Тайгын урцанд хоноглох', 'Цаатан иргэдийн зан заншил', 'Хөвсгөл далайн хөвөөгөөр амрах'],
      imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=900',
    },
  ];

  // Толгойн мэдээлэл сонгох
  const getHeaderInfo = () => {
    switch (groupKey) {
      case 'seasons':
        return { title: 'Улирлаар аялах увдис', subtitle: 'Дөрвөн цагийн өнгө төрх, байгалийн торгон мөчүүд', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000' };
      case 'styles':
        return { title: 'Аяллын хэв маяг', subtitle: 'Таны сонирхолд нийцэх адал явдал, өв соёл, тансаг аяллын төрхүүд', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2000' };
      case 'itineraries':
        return { title: 'Санал болгох маршрутууд', subtitle: 'Богино болон урт хугацааны нарийвчлан тооцоолсон бэлэн хөтөлбөрүүд', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000' };
      default:
        return { title: 'Сэтгүүл & Түүхүүд', subtitle: 'Монгол орны өнцөг булан бүрээс бэлтгэсэн бодит аяллын тэмдэглэлүүд', image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000' };
    }
  };

  const header = getHeaderInfo();

  return (
    <div className="w-full bg-white pb-36 font-sans">
      
      {/* 1. HERO ХЭСЭГ (Швейцар стандарт нэгдмэл санс-сериф толгой) */}
      <section className="relative w-full h-[55vh] min-h-[420px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src={header.image}
          alt={header.title}
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.70]"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-white/80 uppercase tracking-widest text-xs font-bold mb-3 block">
            Аялах сэдэл
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md mb-4">
            {header.title}
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light">
            {header.subtitle}
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ ДЭД ЦЭС */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
          {groupKey === 'stories' && storiesSections.map((s) => (
            <button key={s.id} onClick={() => scrollToId(s.id)} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeNav === s.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
              {s.tab}
            </button>
          ))}
          {groupKey === 'seasons' && SEASONS_DATA.map((s) => (
            <button key={s.id} onClick={() => scrollToId(s.id)} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeNav === s.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
              {s.name} ({s.period})
            </button>
          ))}
          {groupKey === 'styles' && STYLES_DATA.map((s) => (
            <button key={s.id} onClick={() => scrollToId(s.id)} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeNav === s.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
              {s.title}
            </button>
          ))}
          {groupKey === 'itineraries' && ITINERARIES_DATA.map((s) => (
            <button key={s.id} onClick={() => scrollToId(s.id)} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activeNav === s.id ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
              {s.duration}
            </button>
          ))}
        </div>
      </div>

      {/* 3. АГУУЛГЫН ХЭСЭГ (ЦЭС ТУС БҮРИЙН ӨВӨРМӨЦ ДИЗАЙН) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-20">

        {/* ---------------- А. СЭТГҮҮЛ & ТҮҮХҮҮД (KINFOLK EDITORIAL) ---------------- */}
        {groupKey === 'stories' && (
          <div className="space-y-36">
            {storiesSections.map((sec, idx) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-24">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-3xl sm:text-4xl font-black text-neutral-300">0{idx + 1}</span>
                  <div className="h-[1px] bg-neutral-200 flex-1" />
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-[#15803d]">{sec.tab}</span>
                </div>

                {/* Cover Billboard */}
                <div className="group cursor-pointer mb-14">
                  <div className="relative w-full h-[420px] sm:h-[540px] rounded-3xl overflow-hidden mb-8 shadow-sm">
                    <Image src={sec.cover.imageUrl} alt={sec.cover.title} fill unoptimized className="object-cover group-hover:scale-103 transition-transform duration-1000 ease-out" />
                    <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md text-neutral-900 text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                      ★ {sec.cover.badge}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-8">
                      <div className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-widest mb-3">
                        <span className="text-[#15803d]">ОНЦЛОХ НИЙТЛЭЛ</span>
                        <span>•</span>
                        <span>⏱️ {sec.cover.readTime}</span>
                        <span>•</span>
                        <span>{sec.cover.date}</span>
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight group-hover:text-[#15803d] transition-colors mb-4">{sec.cover.title}</h3>
                      <p className="text-base text-neutral-600 font-light leading-relaxed">{sec.cover.excerpt}</p>
                    </div>
                    <div className="lg:col-span-4 lg:border-l lg:border-neutral-200 lg:pl-8 pt-2">
                      <p className="text-xs uppercase tracking-widest font-bold text-neutral-400 mb-2">РЕДАКЦИЙН ТОЙМ</p>
                      <p className="text-sm italic text-neutral-700 leading-relaxed mb-6">“Онгон дагшин орчин, хүмүүсийн эгэл амьдралын холбоог хамгийн тодоор илэрхийлсэн аяллын шилдэг эссэ.”</p>
                      <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-neutral-900 group-hover:text-[#15803d] border-b border-neutral-900 pb-1">
                        Бүрэн эхийг унших →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub stories grid */}
                <div className="border-t border-neutral-200 pt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                  {sec.list.map((item, i) => (
                    <div key={i} className="group cursor-pointer flex flex-col justify-between">
                      <div>
                        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                          <Image src={item.imageUrl} alt={item.title} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-md">{item.badge}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 uppercase mb-2">
                          <span>{item.author}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>
                        <h4 className="text-lg font-bold text-neutral-900 leading-snug group-hover:text-[#15803d] transition-colors mb-2 line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-neutral-500 font-light line-clamp-2 leading-relaxed">{item.excerpt}</p>
                      </div>
                      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs mt-4">
                        <span className="text-[11px] text-neutral-400">{item.date}</span>
                        <span className="font-bold text-neutral-900 group-hover:text-[#15803d]">Унших →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* ---------------- Б. УЛИРЛААР АЯЛАХ (TALL EDITORIAL SEASON PANELS) ---------------- */}
        {groupKey === 'seasons' && (
          <div className="space-y-32">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
              {SEASONS_DATA.map((season) => (
                <div
                  key={season.id}
                  id={season.id}
                  className="group relative min-h-[580px] rounded-3xl overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-8 scroll-mt-28"
                >
                  <Image
                    src={season.imageUrl}
                    alt={season.name}
                    fill
                    unoptimized
                    className="object-cover brightness-[0.65] group-hover:scale-108 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                  {/* Дээд шошго */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-white/20">
                      {season.period}
                    </span>
                    <span className="text-3xl font-black text-white/30">0{season.name === 'Хавар' ? 1 : season.name === 'Зун' ? 2 : season.name === 'Намар' ? 3 : 4}</span>
                  </div>

                  {/* Доод агуулга */}
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white mb-2">{season.name}</h3>
                    <p className="text-xs text-white/80 font-light leading-relaxed mb-6 line-clamp-3">
                      {season.desc}
                    </p>

                    <div className="space-y-2 mb-6 pt-4 border-t border-white/20">
                      {season.highlights.map((h, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-white/90">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-3 bg-white hover:bg-[#15803d] text-neutral-900 hover:text-white text-xs font-bold rounded-2xl transition-all shadow-md cursor-pointer">
                      {season.name} аяллын хөтөлбөр үзэх →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- В. АЯЛЛЫН ХЭВ МАЯГ (INTERACTIVE STYLE BANNERS) ---------------- */}
        {groupKey === 'styles' && (
          <div className="space-y-16">
            {STYLES_DATA.map((style, sIdx) => (
              <div
                key={style.id}
                id={style.id}
                className="group relative rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 cursor-pointer scroll-mt-28"
              >
                {/* Зүүн зураг */}
                <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-[420px] overflow-hidden">
                  <Image
                    src={style.imageUrl}
                    alt={style.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md text-white text-xs font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full">
                    STYLE #0{sIdx + 1}
                  </div>
                </div>

                {/* Баруун тал: Дэлгэрэнгүй тайлбар */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {style.tags.map((t, idx) => (
                        <span key={idx} className="bg-emerald-50 text-[#15803d] text-xs font-bold px-3 py-1 rounded-lg">
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3 group-hover:text-[#15803d] transition-colors">
                      {style.title}
                    </h3>

                    <p className="text-sm text-neutral-600 leading-relaxed font-light mb-6">
                      {style.subtitle}
                    </p>

                    <div className="space-y-2.5 mb-8">
                      <span className="text-xs uppercase tracking-widest font-bold text-neutral-400 block">Онцлох туршлагууд:</span>
                      {style.features.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-neutral-800">
                          <span className="text-[#15803d] font-bold">●</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400">Холбогдох аяллууд</span>
                    <span className="text-xs font-black text-neutral-900 group-hover:text-[#15803d] inline-flex items-center gap-1">
                      Дэлгэрэнгүй үзэх →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------- Г. САНАЛ БОЛГОХ МАРШРУТ (ROUTE BLUEPRINTS) ---------------- */}
        {groupKey === 'itineraries' && (
          <div className="space-y-12">
            {ITINERARIES_DATA.map((itin) => (
              <div
                key={itin.id}
                id={itin.id}
                className="group bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 scroll-mt-28"
              >
                {/* Зүүн зураг ба Хугацаа */}
                <div className="lg:col-span-5 relative min-h-[300px] overflow-hidden">
                  <Image
                    src={itin.imageUrl}
                    alt={itin.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 bg-neutral-900/90 backdrop-blur-md text-white font-black text-xs px-4 py-2 rounded-full shadow-md">
                    ⏱️ {itin.duration}
                  </div>
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="text-[11px] font-bold text-emerald-400 block mb-1">МАРШРУТЫН БАРИМЖАА:</span>
                    <p className="text-white text-xs font-medium leading-relaxed drop-shadow-sm">{itin.distance}</p>
                  </div>
                </div>

                {/* Баруун тал: Замын зураглал & Буудлууд */}
                <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#15803d] block mb-2">
                      ЧИГЛЭЛ: {itin.route}
                    </span>

                    <h3 className="text-2xl font-black text-neutral-900 leading-snug mb-5 group-hover:text-[#15803d] transition-colors">
                      {itin.title}
                    </h3>

                    {/* Маршрутын дагуух цэгүүдийн жагсаалт */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-neutral-50 p-5 rounded-2xl border border-neutral-100">
                      {itin.stops.map((stop, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-xs text-neutral-700">
                          <span className="w-5 h-5 rounded-full bg-[#15803d] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                            {sIdx + 1}
                          </span>
                          <span className="line-clamp-1">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-400">Газрын зураг & Өдрүүдийн хуваарь</span>
                    <button className="px-5 py-2.5 bg-neutral-900 hover:bg-[#15803d] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs">
                      Хөтөлбөр татаж авах / Нээх →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
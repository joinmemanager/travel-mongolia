'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

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
        excerpt:
          'Цаг хугацаа зогссон мэт онгон тайга, Алтайн сүрлэг хавцалд өв соёлоо хадгалан үлдсэн хүмүүсийн эгэл мөртлөө ер бусын амьдралын мөрөөр.',
        imageUrl:
          'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1400',
      },
      list: [
        {
          title: 'Хөвсгөлийн тайгын алтан намар',
          author: 'Д.Саруул',
          readTime: '4 мин',
          date: 'Намар',
          badge: 'Фото эссэ',
          excerpt:
            'Мөнгөн ус шиг тунгалаг нуурын хөвөөгөөр мориор аялж шарласан тайгыг дуранд буулгасан нь.',
          imageUrl:
            'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=800',
        },
        {
          title: 'Говийн уудамд Сүүн замын доор хоноглосон шөнө',
          author: 'Г.Болд',
          readTime: '5 мин',
          date: 'Зун',
          badge: 'Одон орон',
          excerpt:
            'Гэрлийн бохирдолгүй говийн уудам тэнгэрт тэрбум одод толгой дээр асгарах мэт мэдрэмж.',
          imageUrl:
            'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=800',
        },
        {
          title: 'Орхоны хүрхрээний өвлийн мөсөн хөшиг',
          author: 'Т.Эрдэнэ',
          readTime: '5 мин',
          date: 'Өвөл',
          badge: 'Өвөл',
          excerpt:
            'Хасах 30 хэмд хөлдсөн байгалийн уран баримал, ойр орчмын халуун рашааны төгс зохицол.',
          imageUrl:
            'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800',
        },
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
        excerpt:
          'Машины замгүй, зөвхөн мориор эсвэл явган туулах боломжтой Дархадын хотгор бол дэлхийн хамгийн сүүлчийн онгон экосистем.',
        imageUrl:
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1400',
      },
      list: [
        {
          title: 'Дорнодын Цагаан дэлийн нууц агуй',
          author: 'Б.Болд',
          readTime: '4 мин',
          date: 'Зун',
          badge: 'Агуй',
          excerpt:
            'Монголын хамгийн урт карстын тогтоцтой агуйн гүнд нуугдсан байгалийн содон нууцууд.',
          imageUrl:
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800',
        },
        {
          title: 'Хэрмэн цавын улаан хавцал: Марс гариг дэлхий дээр',
          author: 'Д.Саруул',
          readTime: '6 мин',
          date: 'Хавар',
          badge: 'Говь',
          excerpt:
            'Үлэг гүрвэлийн олдворууд салхинд ил гарсан улаан шаварлаг хавцлын экспедиц.',
          imageUrl:
            'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=800',
        },
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
        excerpt:
          'Улаан цавын элсэн манхны дундуур замгүй говьд зөвхөн оддоор зүг чигээ баримжаалж аялсан хууч яриа.',
        imageUrl:
          'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1400',
      },
      list: [
        {
          title: 'Алтайн бүргэдчин өвөөгийн өв залгамжлал',
          author: 'А.Бахыт',
          readTime: '5 мин',
          date: 'Намар',
          badge: 'Уламжлал',
          excerpt:
            'Анч бүргэдээ гэр бүлийн гишүүн мэт сургаж хад асганд ан хийдэг эртний соёл.',
          imageUrl:
            'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=800',
        },
        {
          title: 'Булганы сайхан айраг эсгэх хөхүүрийн соёл',
          author: 'С.Баяр',
          readTime: '4 мин',
          date: 'Зун',
          badge: 'Өв',
          excerpt:
            'Хөхүүрэнд өдөрт хэдэн мянган удаа бүлж байгалийн аргаар гаргаж авдаг амт чанар.',
          imageUrl:
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
        },
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
        excerpt:
          'Хонгорын дуут манхан, Цагаан суварга, Алтай Таван Богдоос эхлээд дэлхийд гайхагдсан шилдэг 10 газар.',
        imageUrl:
          'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400',
      },
      list: [
        {
          title: 'Гэрэл зурагчны заавал очих нар жаргах 5 цэг',
          author: 'Г.Болд',
          readTime: '4 мин',
          date: '2026',
          badge: 'Top 5',
          excerpt:
            'Мэргэжлийн гэрэл зурагчдын зөвлөсөн алтан туяа татах шилдэг байршлууд.',
          imageUrl:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800',
        },
        {
          title: 'Одот тэнгэрийг тольдох шилдэг 5 эко гэр кэмп',
          author: 'Wellness',
          readTime: '5 мин',
          date: '2026',
          badge: 'Top 5',
          excerpt:
            'Сүлжээгүй дижитал детокс хийж тав тухтай орчинд байгальтайгаа уусах сонголтууд.',
          imageUrl:
            'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=800',
        },
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
      highlights: [
        'Малчин айлд төл хүлээн авах',
        'Говийн урин хаврын шувуудын чуулган',
        'Уулсын яргуй дэлгэрэх мөч',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=900',
    },
    {
      id: 'summer',
      name: 'Зун',
      period: '6 – 8 сар',
      title: 'Ногоон тал нутаг & Их Наадмын цэнгэл',
      desc: 'Аялахад хамгийн таатай дулаан үе. Гол мөрөн цэллэлзэж, хээр тал ногоон хивс мэт ногоорон эрийн гурван наадам улс орон даяар эхэлнэ.',
      highlights: [
        'Үндэсний Их Баяр Наадам',
        'Хөвсгөл нуурын усан аялал',
        'Орхоны хөндийн майхант отог',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=900',
    },
    {
      id: 'autumn',
      name: 'Намар',
      period: '9 – 10 сар',
      title: 'Алтан намар: Тааламжтай сэрүүн аялал',
      desc: 'Шинэс мод шаргалтан, агаар тунгалагшин халуун ч биш, хүйтэн ч биш хамгийн тогтуун таатай уур амьсгал бүрдэнэ.',
      highlights: [
        'Алтайн Бүргэдийн баяр',
        'Хөвсгөл ба Хангайн шарласан тайга',
        'Өмнөд говийн намуун элсэн манхан',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=900',
    },
    {
      id: 'winter',
      name: 'Өвөл',
      period: '11 – 2 сар',
      title: 'Цасан цагаан тал & Хөх мөсний баяр',
      desc: 'Цэвэр агаар, утаагүй онгон байгаль, хөлдсөн нуурын метр зузаан мөсөн дээрх морин чарга, Цагаан сарын уламжлалт ёс заншил.',
      highlights: [
        'Хөх сувд Мөсний баяр',
        'Өмнөговийн Түмэн тэмээний баяр',
        'Скай Резорт цанын спорт',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=900',
    },
  ];

  // ---------------- 3. АЯЛЛЫН ХЭВ МАЯГ (STYLES) ДАТА ----------------
  const STYLES_DATA: StyleItem[] = [
    {
      id: 'adventure',
      title: 'Adventure & Active',
      subtitle:
        'Уулын оргилд авирах, 4х4 бартаат замаар давхих, голын каякаар урсах адал явдал',
      tags: ['#Trekking', '#4x4Offroad', '#Kayaking', '#Camping'],
      features: [
        'Алтай Таван Богдын мөсөн голын авиралт',
        'Өмнөд говийн бартаат замын экспедиц',
        'Орхоны хөндийн 4 өдрийн морин аялал',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200',
    },
    {
      id: 'culture',
      title: 'Culture & Heritage',
      subtitle:
        'Чингис хааны өлгий нутаг, эртний Хархорум, буддын хийдүүдийн мянган жилийн соёлын өв',
      tags: ['#UNESCO', '#МонголГэр', '#ХийдСүм', '#Музей'],
      features: [
        'Хархорум ба Эрдэнэ зуу хийд',
        'Амарбаясгалант хийдийн Буддын уран барилга',
        'Чингис хаан Үндэсний музей',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200',
    },
    {
      id: 'family',
      title: 'Family Friendly',
      subtitle:
        'Хүүхэд болон гэр бүлд аюулгүй, тав тухтай амралтын баазууд, танин мэдэхүйн хөтөлбөрүүд',
      tags: ['#Аюулгүй', '#ГэрБүл', '#ТахьАжиглах', '#Амралт'],
      features: [
        'Горхи Тэрэлж ба Чингисийн морьт хөшөө',
        'Хустайн нуруунд зэрлэг тахь тольдох',
        'Элсэн тасархай: Тэмээ унах аялал',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200',
    },
    {
      id: 'luxury',
      title: 'Luxury & Slow Travel',
      subtitle:
        'Өндөр зэрэглэлийн гэр вилла, рашаан сувилал, онгоц нисдэг тэрэгний хувийн экспедицүүд',
      tags: ['#VIPGers', '#ThermalSpa', '#Helicopter', '#DigitalDetox'],
      features: [
        'Three Camel Lodge тансаг эко вилла',
        'Цэнхэрийн халуун рашааны VIP амралт',
        'Нисдэг тэргээр Монгол орныг тольдох',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
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
      stops: [
        'Мэлхий хад тольдох',
        'Арьяабалын бясалгалын хийдээр алхах',
        'Дэлхийн хамгийн том морьт хөшөөнд гарах',
        'Тав тухтай гэр кэмпэд хоноглох',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=900',
    },
    {
      id: '5-7days',
      duration: '6 Өдөр / 5 Шөнө',
      title: 'Орхоны хөндий & Төв Монголын сонгодог соёлын зам',
      route:
        'УБ ➔ Элсэн тасархай ➔ Хархорум ➔ Орхоны хүрхрээ ➔ Цэнхэрийн рашаан ➔ Угий нуур',
      distance: 'Нийт: 850 км (Засмал болон сайжруулсан зам)',
      stops: [
        'Элсэн манхан дээр тэмээ унах',
        'Эрдэнэ зуу хийд ба Хархорум музей',
        'Улаан цутгалангийн 20м хүрхрээ',
        'Цэнхэрийн 86 хэмийн халуун рашаанд орох',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=900',
    },
    {
      id: '10-14days',
      duration: '12 Өдөр / 11 Шөнө',
      title: 'Говь болон Хангайн нурууны хосолсон их тойрон аялал',
      route:
        'УБ ➔ Цагаан суварга ➔ Ёлын ам ➔ Хонгорын элс ➔ Баянзаг ➔ Орхон ➔ Тэрхийн цагаан нуур ➔ УБ',
      distance: 'Нийт: 2,400 км (Говь, хангайн холимог бартаат зам)',
      stops: [
        'Цагаан суваргын өнгөт хавцал',
        'Хонгорын дуут манхны оргилд гарах',
        'Үлэг гүрвэлийн нутаг Баянзаг',
        'Хорго галт уулын тогоо дээр гарах',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=900',
    },
    {
      id: 'themed',
      duration: '8 Өдөр / 7 Шөнө',
      title: 'Цаатан зоны мөрөөр: Хөвсгөлийн тайгын морин аялал',
      route:
        'Мөрөн ➔ Улаан-Уул ➔ Цагааннуур ➔ Зүүн / Баруун тайга ➔ Хөвсгөл нуур',
      distance: 'Морин аялал: 120 км тайгын гүнд',
      stops: [
        'Цаа бугын аж ахуйтай танилцах',
        'Тайгын урцанд хоноглох',
        'Цаатан иргэдийн зан заншил',
        'Хөвсгөл далайн хөвөөгөөр амрах',
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=900',
    },
  ];

  // Толгойн мэдээлэл сонгох
  const getHeaderInfo = () => {
    switch (groupKey) {
      case 'seasons':
        return {
          title: 'Улирлаар аялах увдис',
          subtitle: 'Дөрвөн цагийн өнгө төрх, байгалийн торгон мөчүүд',
          image:
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000',
        };
      case 'styles':
        return {
          title: 'Аяллын хэв маяг',
          subtitle:
            'Таны сонирхолд нийцэх адал явдал, өв соёл, тансаг аяллын төрхүүд',
          image:
            'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2000',
        };
      case 'itineraries':
        return {
          title: 'Санал болгох маршрутууд',
          subtitle:
            'Богино болон урт хугацааны нарийвчлан тооцоолсон бэлэн хөтөлбөрүүд',
          image:
            'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000',
        };
      default:
        return {
          title: 'Сэтгүүл & Түүхүүд',
          subtitle:
            'Монгол орны өнцөг булан бүрээс бэлтгэсэн бодит аяллын тэмдэглэлүүд',
          image:
            'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000',
        };
    }
  };

  const header = getHeaderInfo();

  return (
    <div className="pb-36 w-full font-sans bg-white">
      {/* 1. HERO ХЭСЭГ (Швейцар стандарт нэгдмэл санс-сериф толгой) */}
      <section className="flex overflow-hidden relative flex-col justify-center items-center w-full h-[55vh] min-h-[420px]">
        <Image
          src={header.image}
          alt={header.title}
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.70]"
        />
        <div className="relative z-10 px-4 mx-auto max-w-4xl text-center">
          <span className="block mb-3 text-xs font-bold tracking-widest text-white/80 uppercase">
            Аялах сэдэл
          </span>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl">
            {header.title}
          </h1>
          <p className="mx-auto max-w-2xl text-sm font-light text-white/90 sm:text-base md:text-lg">
            {header.subtitle}
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ ДЭД ЦЭС */}
      <div className="sticky top-0 z-40 bg-white/95 border-b border-gray-100 backdrop-blur-md shadow-xs">
        <div className="flex overflow-x-auto gap-2 justify-start items-center py-4 px-6 mx-auto max-w-7xl sm:gap-3 sm:justify-center sm:px-10 scrollbar-none">
          {groupKey === 'stories' &&
            storiesSections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToId(s.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === s.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {s.tab}
              </button>
            ))}
          {groupKey === 'seasons' &&
            SEASONS_DATA.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToId(s.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === s.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {s.name} ({s.period})
              </button>
            ))}
          {groupKey === 'styles' &&
            STYLES_DATA.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToId(s.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === s.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {s.title}
              </button>
            ))}
          {groupKey === 'itineraries' &&
            ITINERARIES_DATA.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollToId(s.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeNav === s.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {s.duration}
              </button>
            ))}
        </div>
      </div>

      {/* 3. АГУУЛГЫН ХЭСЭГ (ЦЭС ТУС БҮРИЙН ӨВӨРМӨЦ ДИЗАЙН) */}
      <div className="px-6 mx-auto mt-20 max-w-7xl sm:px-10">
        {/* ---------------- А. СЭТГҮҮЛ & ТҮҮХҮҮД (KINFOLK EDITORIAL) ---------------- */}
        {groupKey === 'stories' && (
          <div className="space-y-36">
            {storiesSections.map((sec, idx) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-24">
                <div className="flex gap-4 items-center mb-6">
                  <span className="text-3xl font-black text-neutral-300 sm:text-4xl">
                    0{idx + 1}
                  </span>
                  <div className="flex-1 h-[1px] bg-neutral-200" />
                  <span className="text-xs font-black tracking-[0.25em] text-[#15803d] uppercase">
                    {sec.tab}
                  </span>
                </div>

                {/* Cover Billboard */}
                <div className="group mb-14 cursor-pointer">
                  <div className="overflow-hidden relative mb-8 w-full h-[420px] rounded-3xl shadow-sm sm:h-[540px]">
                    <Image
                      src={sec.cover.imageUrl}
                      alt={sec.cover.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-103"
                    />
                    <div className="absolute top-6 left-6 py-1.5 px-4 text-xs font-black tracking-widest text-neutral-900 uppercase bg-white/95 rounded-full shadow-md backdrop-blur-md">
                      ★ {sec.cover.badge}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-12">
                    <div className="lg:col-span-8">
                      <div className="flex gap-3 items-center mb-3 text-xs font-bold tracking-widest text-neutral-400 uppercase">
                        <span className="text-[#15803d]">ОНЦЛОХ НИЙТЛЭЛ</span>
                        <span>•</span>
                        <span>⏱️ {sec.cover.readTime}</span>
                        <span>•</span>
                        <span>{sec.cover.date}</span>
                      </div>
                      <h3 className="mb-4 text-3xl font-black tracking-tight leading-tight text-neutral-900 group-hover:text-[#15803d] transition-colors sm:text-4xl">
                        {sec.cover.title}
                      </h3>
                      <p className="text-base font-light leading-relaxed text-neutral-600">
                        {sec.cover.excerpt}
                      </p>
                    </div>
                    <div className="pt-2 lg:col-span-4 lg:pl-8 lg:border-l lg:border-neutral-200">
                      <p className="mb-2 text-xs font-bold tracking-widest text-neutral-400 uppercase">
                        РЕДАКЦИЙН ТОЙМ
                      </p>
                      <p className="mb-6 text-sm italic leading-relaxed text-neutral-700">
                        “Онгон дагшин орчин, хүмүүсийн эгэл амьдралын холбоог
                        хамгийн тодоор илэрхийлсэн аяллын шилдэг эссэ.”
                      </p>
                      <span className="inline-flex gap-2 items-center pb-1 text-xs font-black tracking-wider text-neutral-900 group-hover:text-[#15803d] uppercase border-b border-neutral-900">
                        Бүрэн эхийг унших →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub stories grid */}
                <div className="grid grid-cols-1 gap-8 pt-10 border-t border-neutral-200 md:grid-cols-3">
                  {sec.list.map((item, i) => (
                    <div
                      key={i}
                      className="group flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        <div className="aspect-[16/10] overflow-hidden relative mb-4 w-full rounded-2xl">
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute top-3 left-3 py-1 px-2.5 text-[10px] font-bold text-white bg-neutral-900/80 rounded-md backdrop-blur-md">
                            {item.badge}
                          </span>
                        </div>
                        <div className="flex gap-2 items-center mb-2 text-[11px] font-bold text-neutral-400 uppercase">
                          <span>{item.author}</span>
                          <span>•</span>
                          <span>{item.readTime}</span>
                        </div>
                        <h4 className="mb-2 text-lg font-bold leading-snug text-neutral-900 group-hover:text-[#15803d] transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                        <p className="text-xs font-light leading-relaxed text-neutral-500 line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-3 mt-4 text-xs border-t border-neutral-100">
                        <span className="text-[11px] text-neutral-400">
                          {item.date}
                        </span>
                        <span className="font-bold text-neutral-900 group-hover:text-[#15803d]">
                          Унших →
                        </span>
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
            <div className="grid grid-cols-1 gap-6 items-stretch lg:grid-cols-4">
              {SEASONS_DATA.map((season) => (
                <div
                  key={season.id}
                  id={season.id}
                  className="group flex overflow-hidden relative flex-col justify-between p-8 min-h-[580px] rounded-3xl hover:shadow-2xl transition-all duration-500 scroll-mt-28 shadow-xs"
                >
                  <Image
                    src={season.imageUrl}
                    alt={season.name}
                    fill
                    unoptimized
                    className="object-cover brightness-[0.65] transition-transform duration-1000 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                  {/* Дээд шошго */}
                  <div className="flex relative z-10 justify-between items-center">
                    <span className="py-1.5 px-3.5 text-xs font-black tracking-widest text-white uppercase bg-white/20 rounded-full border border-white/20 backdrop-blur-md">
                      {season.period}
                    </span>
                    <span className="text-3xl font-black text-white/30">
                      0
                      {season.name === 'Хавар'
                        ? 1
                        : season.name === 'Зун'
                        ? 2
                        : season.name === 'Намар'
                        ? 3
                        : 4}
                    </span>
                  </div>

                  {/* Доод агуулга */}
                  <div className="relative z-10">
                    <h3 className="mb-2 text-3xl font-black text-white">
                      {season.name}
                    </h3>
                    <p className="mb-6 text-xs font-light leading-relaxed text-white/80 line-clamp-3">
                      {season.desc}
                    </p>

                    <div className="pt-4 mb-6 space-y-2 border-t border-white/20">
                      {season.highlights.map((h, idx) => (
                        <div
                          key={idx}
                          className="flex gap-2 items-center text-xs text-white/90"
                        >
                          <span className="font-bold text-emerald-400">✓</span>
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>

                    <button className="py-3 w-full text-xs font-bold text-neutral-900 hover:text-white bg-white hover:bg-[#15803d] rounded-2xl shadow-md transition-all cursor-pointer">
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
                className="group grid overflow-hidden relative grid-cols-1 rounded-3xl border border-neutral-200/80 hover:shadow-xl transition-all duration-500 cursor-pointer scroll-mt-28 lg:grid-cols-12 shadow-xs"
              >
                {/* Зүүн зураг */}
                <div className="overflow-hidden relative min-h-[340px] lg:col-span-6 lg:min-h-[420px]">
                  <Image
                    src={style.imageUrl}
                    alt={style.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-6 left-6 py-1.5 px-3.5 text-xs font-black tracking-widest text-white uppercase bg-black/60 rounded-full backdrop-blur-md">
                    STYLE #0{sIdx + 1}
                  </div>
                </div>

                {/* Баруун тал: Дэлгэрэнгүй тайлбар */}
                <div className="flex flex-col justify-between p-8 bg-white sm:p-12 lg:col-span-6">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {style.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="py-1 px-3 text-xs font-bold text-[#15803d] bg-emerald-50 rounded-lg"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="mb-3 text-2xl font-black text-neutral-900 group-hover:text-[#15803d] transition-colors sm:text-3xl">
                      {style.title}
                    </h3>

                    <p className="mb-6 text-sm font-light leading-relaxed text-neutral-600">
                      {style.subtitle}
                    </p>

                    <div className="mb-8 space-y-2.5">
                      <span className="block text-xs font-bold tracking-widest text-neutral-400 uppercase">
                        Онцлох туршлагууд:
                      </span>
                      {style.features.map((f, i) => (
                        <div
                          key={i}
                          className="flex gap-2 items-center text-xs text-neutral-800"
                        >
                          <span className="font-bold text-[#15803d]">●</span>
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                    <span className="text-xs font-bold text-neutral-400">
                      Холбогдох аяллууд
                    </span>
                    <span className="inline-flex gap-1 items-center text-xs font-black text-neutral-900 group-hover:text-[#15803d]">
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
                className="group grid overflow-hidden grid-cols-1 bg-white rounded-3xl border border-neutral-200/80 hover:shadow-xl transition-all duration-300 scroll-mt-28 lg:grid-cols-12 shadow-xs"
              >
                {/* Зүүн зураг ба Хугацаа */}
                <div className="overflow-hidden relative min-h-[300px] lg:col-span-5">
                  <Image
                    src={itin.imageUrl}
                    alt={itin.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute top-5 left-5 py-2 px-4 text-xs font-black text-white bg-neutral-900/90 rounded-full shadow-md backdrop-blur-md">
                    ⏱️ {itin.duration}
                  </div>
                  <div className="absolute inset-x-5 bottom-5">
                    <span className="block mb-1 text-[11px] font-bold text-emerald-400">
                      МАРШРУТЫН БАРИМЖАА:
                    </span>
                    <p className="text-xs font-medium leading-relaxed text-white drop-shadow-sm">
                      {itin.distance}
                    </p>
                  </div>
                </div>

                {/* Баруун тал: Замын зураглал & Буудлууд */}
                <div className="flex flex-col justify-between p-8 sm:p-10 lg:col-span-7">
                  <div>
                    <span className="block mb-2 text-xs font-bold tracking-wider text-[#15803d] uppercase">
                      ЧИГЛЭЛ: {itin.route}
                    </span>

                    <h3 className="mb-5 text-2xl font-black leading-snug text-neutral-900 group-hover:text-[#15803d] transition-colors">
                      {itin.title}
                    </h3>

                    {/* Маршрутын дагуух цэгүүдийн жагсаалт */}
                    <div className="grid grid-cols-1 gap-3 p-5 mb-6 bg-neutral-50 rounded-2xl border border-neutral-100 sm:grid-cols-2">
                      {itin.stops.map((stop, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex gap-2 items-center text-xs text-neutral-700"
                        >
                          <span className="flex shrink-0 justify-center items-center w-5 h-5 text-[10px] font-bold text-white bg-[#15803d] rounded-full">
                            {sIdx + 1}
                          </span>
                          <span className="line-clamp-1">{stop}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-neutral-100">
                    <span className="text-xs font-bold text-neutral-400">
                      Газрын зураг & Өдрүүдийн хуваарь
                    </span>
                    <button className="py-2.5 px-5 text-xs font-bold text-white bg-neutral-900 hover:bg-[#15803d] rounded-xl transition-colors cursor-pointer shadow-xs">
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

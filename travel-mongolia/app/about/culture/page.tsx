'use client';

import Image from 'next/image';

import { OrnamentRule } from '@/components/Ornament';
import { IMAGES, type SiteImage } from '@/lib/images';
import { liveHref } from '@/lib/navigation';

import React, { useRef } from 'react';



interface CultureItem {
  title: string;
  desc: string;
  thumb: string;
}

interface SubTopic {
  id: string;
  // "Дэлгэрэнгүй" товч хаашаа заах (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  num: string;
  badge: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: CultureItem[];
}

const CULTURE_SECTIONS: SubTopic[] = [
  {
    id: 'unesco',
    moreHref: '/destination/heritage/unesco',
    num: '01',
    badge: 'Дэлхийн үнэт өв',
    title: 'UNESCO өв',
    desc: 'Хүн төрөлхтний соёлын биет болон биет бус өвийн жагсаалтад бүртгэгдсэн монгол түмний оюуны болон байгалийн хосгүй бахархлууд.',
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
    items: [
      {
        title: 'Морин хуур ба Уртын дуу',
        desc: 'Хүн төрөлхтний соёлын биет бус өвийн шилдэг төлөөлөл хэмээн 2003, 2005 онд тунхаглагдсан.',
        thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600',
      },
      {
        title: 'Орхоны хөндий & Бурхан Халдун',
        desc: 'Түүх соёл, нүүдлийн иргэншлийн түшиц нутаг болон төрийн тахилгат хайрхан.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Монгол наадам & Шагайн харваа',
        desc: 'Эрийн гурван наадам, монгол шагайн харвааны зан үйл ЮНЕСКО-д бүртгэлтэй.',
        thumb: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=600',
      },
    ],
  },
  {
    id: 'archeology',
    moreHref: '/things-to-do/culture?cat=archaeology',
    num: '02',
    badge: 'Чулуун ба хүрэл зэвсэг',
    title: 'Археологийн өв',
    desc: 'Палеолитын үеэс хүрэл, төмөр зэвсгийн үеийг дамнан хадгалагдаж ирсэн хүн төрөлхтний эртний соёл иргэншлийн ул мөрүүд.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
    items: [
      {
        title: 'Буган чулуун хөшөө',
        desc: 'Төв Азийн нүүдэлчдийн 3000 жилийн тэртээх дүрслэх урлаг, ертөнцийг үзэх үзлийн дурсгал.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Хадны сүг зураг',
        desc: 'Цагаан салаа, Хойд цэнхэрийн агуйн хананд сийлэгдсэн ан амьтан, ан авлагын дүрслэлүүд.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Хүннүгийн язгууртны бунхан',
        desc: 'Ноён уул, Гол модны дурсгалаас олдсон дэлхийн анхны эзэнт гүрний үнэт эдлэлүүд.',
        thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      },
    ],
  },
  {
    id: 'monuments',
    moreHref: '/things-to-do/culture?cat=historical-sites',
    num: '03',
    badge: 'Хөшөө дурсгал ба хот суурин',
    title: 'Түүх, соёлын дурсгал',
    desc: 'Эртний төрт улсуудын нийслэл хотын туурь, хүн чулуу, бичигт хөшөөнүүдээр баялаг ил музей нутаг.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    items: [
      {
        title: 'Хархорум хотын туурь',
        desc: 'XIII зууны дэлхийн эзэнт гүрний нийслэл, дипломат болон худалдааны их төв.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Түрэгийн гэрэлт хөшөөнүүд',
        desc: 'Билгэ хаан, Күлтегиний руни бичигт хөшөөнүүд нь эртний түүхийн үнэлж баршгүй сурвалж.',
        thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
      },
      {
        title: 'Хүн чулуун дурсгалууд',
        desc: 'Тал хээрийн бүсэд өвөг дээдсээ дурсан босгосон чулуун хөрөг баримал.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
    ],
  },
  {
    id: 'music',
    moreHref: '/things-to-do/culture?cat=music-dance',
    num: '04',
    badge: 'Аялгуу эгшиг',
    title: 'Монгол хөгжим',
    desc: 'Хөх тэнгэр, байгалийн авиаг хүний хоолой болон хялгасан утсаар төгс дуурайлган эгшиглүүлдэг язгуур хөгжмийн урлаг.',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
    items: [
      {
        title: 'Морин хуур & Икэл',
        desc: 'Адууны дэл сүүлээр хийсэн хоёрхон утаснаас уянгалан гарах сэтгэлийн аялгуу.',
        thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600',
      },
      {
        title: 'Хөөмийн гайхамшиг',
        desc: 'Суурь өнгө болон исгэрээ мэт дээд өнгийг зэрэг гаргах хоолойн хосгүй ур чадвар.',
        thumb: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600',
      },
      {
        title: 'Товшуур, Лимбэ, Цуур',
        desc: 'Нүүдэлчдийн ахуй, үлгэр тууль хайлахад хэрэглэдэг эртний уламжлалт хөгжмийн зэмсгүүд.',
        thumb: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=600',
      },
    ],
  },
  {
    id: 'dance-stage',
    moreHref: '/things-to-do/culture?cat=music-dance',
    num: '05',
    badge: 'Хөдөлгөөний урлаг',
    title: 'Бүжиг, тайзны урлаг',
    desc: 'Гэрийн орон зайд багтаан бүтээсэн бий биелгээнээс шашны нууц тарнийн Цам бүжиг хүртэлх баялаг уламжлал.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200',
    items: [
      {
        title: 'Ойрадын Бий биелгээ',
        desc: 'Мөр, гар, цээжний огцом хөдөлгөөнөөр өдөр тутмын ахуйг дүрслэн харуулдаг язгуур бүжиг.',
        thumb: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600',
      },
      {
        title: 'Цам харайх ёслол',
        desc: 'Шашны сахиус тэнгэрүүдийн дүртэй баг өмсөж, хорон мууг зайлуулах багт жүжиг.',
        thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600',
      },
      {
        title: 'Үндэсний цирк & Уран нугаралт',
        desc: 'Хүний биеийн уян налархайг дээд зэргээр хөгжүүлсэн дэлхийд гайхагддаг уран нугаралт.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
    ],
  },
  {
    id: 'literature',
    num: '06',
    badge: 'Үгийн урлаг & Туульс',
    title: 'Уран зохиол',
    desc: 'Монголын нууц товчооноос эхлээд олон мянган мөрт баатарлаг туульс, ардын цэцэн билгийн үгийн сан.',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200',
    items: [
      {
        title: 'Монголын нууц товчоо (1240 он)',
        desc: 'Түүх, уран зохиол, гүн ухааны хосгүй үнэт их хөлгөн туурвил.',
        thumb: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600',
      },
      {
        title: 'Жангар & Гэсэр тууль',
        desc: 'Эх орноо хамгаалах баатруудын үйл хэргийг олон хоногоор хайлдаг аман их өв.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Үлгэр, оньсого, зүйр цэцэн үг',
        desc: 'Амьдралын гүн ухаан, ёс суртахууныг хойч үедээ өвлүүлэх түлхүүр.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
    ],
  },
  {
    id: 'fine-arts',
    moreHref: '/things-to-do/culture?cat=arts',
    num: '07',
    badge: 'Зураг ба цутгуур',
    title: 'Дүрслэх урлаг',
    desc: 'Бурхан урлалын сонгодог бүтээлүүд, Монгол зургийн өвөрмөц дэг жаяг болон орчин үеийн уран зураг.',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200',
    items: [
      {
        title: 'Занабазарын цутгуур баримал',
        desc: 'Цагаан дарь эх, Язгуурын таван бурхан тэргүүтэй монголын ренессанс бүтээлүүд.',
        thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600',
      },
      {
        title: 'Монгол зураг (Mongol Zurag)',
        desc: '“Монголын нэг өдөр” бүтээл шиг орон зайн алслалтгүй, бүх үйл явдлыг зэрэг харуулдаг дэг.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: 'Танка буюу торгон зээгт наамал',
        desc: 'Торго, даавууг хайчилж, утсаар хатган урладаг шашны ариун урлал.',
        thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      },
    ],
  },
  {
    id: 'crafts',
    moreHref: '/things-to-do/culture?cat=crafts',
    num: '08',
    badge: 'Уран дарх & Оёдол',
    title: 'Гар урлал',
    desc: 'Алт, мөнгө, мод, шир, төмөр, эсгийгээр хэрэглээний урлагийг туйлд нь хүртэл урлаж ирсэн дархчуудын өв.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200',
    items: [
      {
        title: 'Мөнгөн аяга & Хэт хутга',
        desc: 'Эрэгтэй хүний гоёл, мөнгөн тоноглолтой бүс, хэт хутганы нарийн хөөмөл сийлбэр.',
        thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      },
      {
        title: 'Эсгий ширмэл урлал',
        desc: 'Хонь ямааны ноосоор эсгий ширж, зээг тавин гэрийн ширдэг, ханын өлгүүр урлах соёл.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Модон сийлбэр',
        desc: 'Гэрийн тооно, унь, авдар дээр байгалийн зохицолт хээ угалз ухаж сийлэх ухаан.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
    ],
  },
  {
    id: 'costume',
    num: '09',
    badge: 'Дээл хувцасны соёл',
    title: 'Үндэсний хувцас',
    desc: 'Цаг уурын эрс тэс уур амьсгалд тохирсон, нас, хүйс, ястан ястны өвөрмөц хэв шинжийг хадгалсан хувцасны соёл.',
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
    items: [
      {
        title: 'Монгол дээл & Бүс',
        desc: 'Хэвлийн дулааныг барьдаг, салхи үл нэвтрэх өндөр захтай ухаалаг хувцас.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: '20 гаруй ястны өмсгөл',
        desc: 'Халх, Буриад, Дөрвөд, Баяд, Казах, Дархад өөр өөрийн малгай, ууж, энгэрийн хийцтэй.',
        thumb: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600',
      },
      {
        title: 'Монгол гутал & Оймс',
        desc: 'Газар шороогоо хамгаалсан эргэсэн хоншоортой, эсгий ширмэл оймстой дулаан гутал.',
        thumb: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=600',
      },
    ],
  },
  {
    id: 'architecture',
    moreHref: '/things-to-do/culture?cat=monasteries',
    num: '10',
    badge: 'Хот байгуулалт & Сүм хийд',
    title: 'Архитектур',
    desc: 'Нүүдлийн монгол гэрээс эхлээд Төвөд, Хятад, Монгол загварыг хослуулан бүтээсэн шашны сүм хийдийн барилгажилт.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    items: [
      {
        title: 'Амарбаясгалант хийд',
        desc: 'Монголын хамгийн бүрэн бүтэн хадгалагдан үлдсэн модон угсраат сонгодог уран барилга.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Эрдэнэ зуу цогцолбор',
        desc: '108 цагаан суварга бүхий хэрэмтэй Монголын хамгийн анхны Буддын хийд.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Гандантэгчэнлин & Чойжин лам',
        desc: 'Нийслэл хотын төвд орших ур хийц, сүр хүчний гайхамшиг болсон түүхэн сүмүүд.',
        thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
      },
    ],
  },
];

// "Монгол сэтгүүл" пилот (docs/plan/design-brief.md): хэсэг бүрийн том зураг.
// Хуучин зургуудын ихэнх нь Монголынх биш байсан (docs/plan/images.md) тул баталгаатай
// Монгол зургаар сольсон. Alt нь зурган дээр бодитоор байгаа зүйлийг тайлбарлана.
const SECTION_IMAGES: Record<string, SiteImage> = {
  unesco: IMAGES.whiteHorse,
  archeology: IMAGES.redCliffs,
  monuments: IMAGES.lakeGers,
  music: IMAGES.gerStars,
  'dance-stage': IMAGES.herderBoy,
  literature: IMAGES.camels,
  'fine-arts': IMAGES.eagleHunter,
  crafts: IMAGES.herdSnow,
  costume: IMAGES.eagleHunter,
  architecture: IMAGES.gerCamp,
};

// Нэртэй жижиг картуудад (жишээ нь "Эрдэнэ зуу") өөр газрын зураг тавьбал төөрөгдүүлэх тул
// бодит зураг орох хүртэл хээтэй орон зай харуулна.
function ItemVisual() {
  return (
    <div
      aria-hidden="true"
      className="flex relative justify-center items-center w-full h-40 bg-cream border-b border-ink/10"
    >
      <svg viewBox="0 0 24 24" className="w-10 h-10 text-gold">
        <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M12 2 L22 12 L12 22 L2 12 Z" />
          <path d="M12 6.5 L17.5 12 L12 17.5 L6.5 12 Z" />
          <path d="M7 7 L17 17 M17 7 L7 17" />
        </g>
      </svg>
    </div>
  );
}

export default function CulturePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-cream text-ink font-sans selection:bg-gold selection:text-night">

      {/* 1. HERO ХЭСЭГ: дэлгэц дүүрэн зураг, доод талдаа бараан градиент */}
      <section className="flex overflow-hidden relative items-end w-full min-h-[78vh] bg-night">
        <Image
          src={IMAGES.chinggisStatue.src}
          alt={IMAGES.chinggisStatue.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10" />
        <div className="relative px-6 pt-32 pb-14 mx-auto w-full max-w-[1200px] sm:px-10">
          <span className="block mb-4 text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
            06. Culture & Heritage
          </span>
          <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.05] text-white sm:text-7xl">
            Соёл ба өв
          </h1>
          <p className="max-w-3xl text-base leading-relaxed text-white/90 sm:text-xl">
            ЮНЕСКО-д бүртгэгдсэн дэлхийн өвүүд, эртний археологийн олдворууд, хөгжим, бүжиг, дүрслэх урлаг хийгээд монгол хүний ур ухааны цогц илэрхийлэл
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
      <div className="sticky top-0 z-40 bg-cream/95 border-b backdrop-blur-md border-ink/10">
        <div className="flex relative items-center px-2 mx-auto w-full max-w-[1200px] sm:px-6">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous"
            className="flex absolute left-2 z-10 justify-center items-center w-9 h-9 text-ink bg-white rounded-full border transition-colors cursor-pointer border-ink/15 hover:border-gold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="w-full py-3 px-10 flex items-center gap-6 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-sm"
          >
            {CULTURE_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="py-2 whitespace-nowrap shrink-0 text-ink-muted hover:text-ink transition-colors"
              >
                <span className="mr-1.5 font-serif text-gold-ink">{sec.num}.</span>
                {sec.title}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next"
            className="flex absolute right-2 z-10 justify-center items-center w-9 h-9 text-ink bg-white rounded-full border transition-colors cursor-pointer border-ink/15 hover:border-gold"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. БҮХ 10 ХЭСГИЙН БҮТЭЦ: зураг ба текст ээлжилсэн мөрүүд, цөцгий/цагаан дэвсгэр */}
      {CULTURE_SECTIONS.map((sec, index) => {
        const image = SECTION_IMAGES[sec.id] || IMAGES.gerCamp;
        const imageLeft = index % 2 === 1;
        return (
          <section
            key={sec.id}
            id={sec.id}
            className={`scroll-mt-16 py-20 ${index % 2 === 0 ? 'bg-cream' : 'bg-white'}`}
          >
            <div className="px-6 mx-auto space-y-12 max-w-[1200px] sm:px-10">
              <div className="grid grid-cols-1 gap-10 items-center lg:grid-cols-2 lg:gap-16">

                {/* Текст */}
                <div className={`space-y-6 ${imageLeft ? 'lg:order-2' : ''}`}>
                  <span className="block text-[11px] font-semibold tracking-[0.25em] text-gold-ink uppercase">
                    {sec.num}
                  </span>
                  <h2 className="font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl">
                    {sec.title}
                  </h2>
                  <OrnamentRule />
                  <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
                    {sec.desc}
                  </p>

                  {liveHref(sec.moreHref) && (
                  <div>
                    <a
                      href={liveHref(sec.moreHref)}
                      className="group/btn inline-flex gap-2.5 items-center py-3 px-6 text-sm font-semibold text-cream bg-night rounded-xl transition-colors hover:bg-ink"
                    >
                      <span>Дэлгэрэнгүй</span>
                      <svg
                        className="w-4 h-4 text-gold transition-transform transform group-hover/btn:translate-x-1"
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

                {/* Зураг */}
                <div className={`group overflow-hidden relative w-full rounded-xl aspect-[3/2] ${imageLeft ? 'lg:order-1' : ''}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

              </div>

              {/* ДООД ТАЛ: 3 ТАЙЛБАР КАРТУУД */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {sec.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="group/card flex overflow-hidden flex-col bg-white rounded-xl border transition-colors border-ink/10 hover:border-gold"
                  >
                    <ItemVisual />

                    <div className="flex flex-col flex-1 justify-between p-6 space-y-2">
                      <h4 className="font-serif text-xl font-bold leading-snug text-ink transition-colors group-hover/card:text-gold-ink">
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-ink-muted sm:text-base">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}

    </main>
  );
}

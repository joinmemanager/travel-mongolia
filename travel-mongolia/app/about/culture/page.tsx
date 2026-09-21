'use client';

import React, { useRef } from 'react';



interface CultureItem {
  title: string;
  desc: string;
  thumb: string;
}

interface SubTopic {
  id: string;
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

export default function CulturePage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <main className="w-full bg-white text-neutral-900 pb-36 font-sans selection:bg-[#15803d] selection:text-white">
      
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[65vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2400" alt="Соёл ба өв" className="absolute inset-0 w-full h-full object-cover brightness-[0.58]" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            06. Culture & Heritage
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Соёл ба өв
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            ЮНЕСКО-д бүртгэгдсэн дэлхийн өвүүд, эртний археологийн олдворууд, хөгжим, бүжиг, дүрслэх урлаг хийгээд монгол хүний ур ухааны цогц илэрхийлэл
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="relative w-full max-w-7xl mx-auto flex items-center px-2 sm:px-6">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous"
            className="absolute left-2 z-10 w-9 h-9 rounded-full bg-white/95 border border-neutral-200 shadow-md flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="w-full py-3 px-10 flex items-center gap-2 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs sm:text-sm font-bold"
          >
            {CULTURE_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-900 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {sec.num}. {sec.title}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next"
            className="absolute right-2 z-10 w-9 h-9 rounded-full bg-white/95 border border-neutral-200 shadow-md flex items-center justify-center text-neutral-800 hover:bg-neutral-900 hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. БҮХ 10 ХЭСГИЙН БҮТЭЦ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-16 space-y-28">
        {CULTURE_SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-28 space-y-10"
          >
            {/* ДЭЭД ХЭСЭГ: ЗҮҮН ТАЛД ТЕКСТ, БАРУУН ТАЛД ЗУРАГ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Зүүн тал */}
              <div className="lg:col-span-6 space-y-6">
                <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                  {sec.title}
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                  {sec.desc}
                </p>

                <div>
                  <a
                    href={`/about/culture/${sec.id}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-neutral-900 text-white hover:bg-[#15803d] transition-all font-bold text-sm sm:text-base shadow-sm group/btn"
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
              </div>

              {/* Баруун тал */}
              <div className="lg:col-span-6 relative w-full h-64 sm:h-80 lg:h-[320px] rounded-3xl overflow-hidden shadow-md group">
                <img src={sec.imageUrl} alt={sec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>

            </div>

            {/* ДООД ТАЛ: 3 ТАЙЛБАР КАРТУУД */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group/card bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-[#15803d]/50 transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden">
                    <img src={item.thumb} alt={item.title} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" />
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

    </main>
  );
}


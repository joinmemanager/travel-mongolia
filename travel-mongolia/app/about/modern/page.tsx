'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ModernItem {
  title: string;
  desc: string;
  thumb: string;
}

interface ModernSection {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: ModernItem[];
}

const MODERN_SECTIONS: ModernSection[] = [
  {
    id: 'modern-life',
    title: 'Орчин үеийн Монголын амьдрал',
    desc: 'Дижитал шилжилт, өндөр технологи, чөлөөт эдийн засаг ба ардчилсан нийгмийн ололтыг нүүдлийн баялаг соёлтойгоо төгс уялдуулан хөгжиж буй шинэ цагийн дүр төрх.',
    imageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=1200',
    items: [
      {
        title: 'Дижитал нийгэм & Финтек',
        desc: 'Бэлэн мөнгөгүй төлбөр тооцоо, цахим төрийн үйлчилгээ болон стартап экосистемийн эрчимтэй хөгжил.',
        thumb: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600',
      },
      {
        title: 'Боловсрол & Дэлхийн монголчууд',
        desc: 'Дэлхийн нэр хүндтэй их дээд сургуулиудад суралцан эх орондоо мэдлэг, шинэ соёлыг түгээгч залуу үе.',
        thumb: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600',
      },
      {
        title: 'Кофе шоп ба коворкинг соёл',
        desc: 'Залуу мэргэжилтнүүд, чөлөөт уран бүтээлчдийн шинэ санаа, хамтын ажиллагаа өрнөх бүтээлч орон зай.',
        thumb: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600',
      },
    ],
  },
  {
    id: 'city-countryside',
    title: 'Хот ба хөдөөгийн амьдрал',
    desc: 'Нэг сая гаруй хүн амтай Улаанбаатар хотын орчин үеийн хэмнэл болон тал нутгийн онгон байгаль, малчны хот айлын амар тайван амьдралын хослол.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    items: [
      {
        title: 'Улаанбаатар хотын хэмнэл',
        desc: 'Өндөр шилэн барилгууд, түгжрэл, соёлын үйл явдлууд дүүрэн эрч хүчтэй нийслэлийн өдөр тутмын амьдрал.',
        thumb: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=600',
      },
      {
        title: 'Орчин үеийн малчин өрх',
        desc: 'Нарны сэргээгдэх эрчим хүч, мотоцикл, гар утас, хиймэл дагуулын сүлжээ ашигладаг шинэ цагийн малчид.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: 'Хотоос хөдөө рүү чиглэх давалгаа',
        desc: 'Эко амьдрал, органик хөдөө аж ахуй, байгалийн аялал жуулчлалыг сонгон хөдөөг зорьж буй залуусын хөдөлгөөн.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
    ],
  },
  {
    id: 'contemporary-arts',
    title: 'Орчин үеийн урлаг, бүтээлч салбар',
    desc: 'Уламжлалт хэв маягийг эвдэж, контемпорари урлаг, дижитал арт, кино урлаг, загварын ертөнцөд өөрсдийн дуу хоолойгоо хүчтэй тунхаглаж буй бүтээлчид.',
    imageUrl: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?q=80&w=1200',
    items: [
      {
        title: 'Монголын шинэ давалгаа кино урлаг',
        desc: 'Канн, Венец, Берлиний олон улсын кино наадмуудад амжилт гаргаж буй залуу найруулагчдын бүтээлүүд.',
        thumb: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600',
      },
      {
        title: 'Контемпорари уран зураг ба инсталляци',
        desc: 'Монгол ахуй, гүн ухааныг модерн дүрслэл, орон зайн баримлаар илэрхийлэх арт галерейнуудын давалгаа.',
        thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600',
      },
      {
        title: 'Модерн загвар ба ноолуур',
        desc: 'Олон улсын тайзнаа танигдсан үндэсний элементтэй загварууд болон дэлхийн тансаг органик ноолуур.',
        thumb: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600',
      },
    ],
  },
  {
    id: 'sports',
    title: 'Спорт',
    desc: 'Олимп, тив дэлхийн дэвжээнд төрийн дууллаа эгшиглүүлсэн жүдо, чөлөөт бөх, боксоос эхлээд сагсан бөмбөг (3x3), цахим спортын дэлхийн шилдгүүд.',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200',
    items: [
      {
        title: 'Олимп ба тулааны спорт',
        desc: 'Жүдо, чөлөөт бөх, боксын төрлөөр олон арван олимпын медаль хүртсэн Монгол тамирчдын яруу алдар.',
        thumb: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=600',
      },
      {
        title: '3х3 Сагсан бөмбөгийн үсрэлт',
        desc: 'Дэлхийн чансаанд тэргүүлж, Олимпын наадамд шалгарч буй залуусын хамгийн их сонирхдог спорт.',
        thumb: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=600',
      },
      {
        title: 'Цахим спорт (Esports)',
        desc: 'CS2, PUBG Mobile зэрэг дэлхийн аварга шалгаруулах тэмцээнүүдэд түрүүлж буй авьяаслаг залуу кибер тамирчид.',
        thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600',
      },
    ],
  },
  {
    id: 'music',
    title: 'Хөгжим',
    desc: 'Хөөмий, морин хуурыг метал роктэй нэгтгэсэн Hunnu Rock урсгалаас эхлээд хип хоп, R&B, инди болон амьд хөгжмийн хүчтэй түрлэг.',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    items: [
      {
        title: 'The HU ба Хүннү рок',
        desc: 'Дэлхийн хөгжмийн чартуудыг тэргүүлж, рок хөгжмийг үндэсний өв соёлтой хослуулан дэлхийг шуугиулж буй амжилт.',
        thumb: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600',
      },
      {
        title: 'Монгол Хип Хоп & R&B',
        desc: 'Нийгмийн дуу хоолой болсон гудамжны соёлоос үүсэж, өнөөдөр залуусын хамгийн өргөн сонсдог гол жанр.',
        thumb: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600',
      },
      {
        title: 'Playtime Festival & Инди хөгжим',
        desc: 'Төв Азийн шилдэг амьд хөгжмийн наадам, хэдэн арван мянган залуусын хүсэн хүлээдэг хөгжмийн баяр.',
        thumb: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600',
      },
    ],
  },
  {
    id: 'youth-culture',
    title: 'Залуусын соёл',
    desc: 'Хүн амын дийлэнх хувийг эзэлдэг залуусын амьдралын хэв маяг, стрийтвээр загвар, кофе, фитнес, эко хандлага ба олон нийтийн эерэг хөдөлгөөнүүд.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200',
    items: [
      {
        title: 'Стрийтвээр & Хувцаслалтын стиль',
        desc: 'Дэлхийн трэндүүд болон монгол үсэг, хээ угалзыг хослуулсан орон нутгийн стрийт загварын брэндүүд.',
        thumb: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600',
      },
      {
        title: 'Идэвхтэй амьдрал & Аялал',
        desc: 'Амралтын өдрүүдээр Bogd Khan ууланд алхах, хээр хөдөө майхантай аялах, эрүүл амьдралыг эрхэмлэх хандлага.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Сайн дурын ажил & Байгаль хамгаалал',
        desc: 'Хог цэвэрлэх, мод тарих “Тэрбум мод” хөдөлгөөнд нэгдэж, байгаль орчиндоо хариуцлагатай хандах залуусын үзэл.',
        thumb: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=600',
      },
    ],
  },
  {
    id: 'tradition-modernity',
    title: 'Уламжлал ба орчин үе',
    desc: 'Өвөг дээдсээс өвлөгдсөн зан заншил, нүүдлийн ёс жудаг орчин үеийн соёлтой хэрхэн төгс зохицон амьдарч буйн бодит илэрхийлэл.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    items: [
      {
        title: 'Модерн дээлний соёл',
        desc: 'Цагаан сар, наадмаас гадна өдөр тутмын ажил, албан уулзалтад өмсөхөд зориулагдсан орчин үеийн загварт монгол хувцас.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Гэр хотхон ба эко сууц',
        desc: 'Монгол гэрийн дугуй орон зайг орчин үеийн дулаалга, панорама цонх, тав тухтай интерьертэй хослуулсан шийдлүүд.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Уламжлалт зоогийн модерн ресторан',
        desc: 'Шөл, хорхог, цагаан идээг олон улсын өндөр зэрэглэлийн ресторан шиг таваглан дэлхийн түвшинд хүргэх соёл.',
        thumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600',
      },
    ],
  },
];

export default function ModernMongoliaPage() {
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
        <Image
          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?q=80&w=2400"
          alt="Өнөөгийн Монгол"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.55]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            09. Mongolia Today
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Өнөөгийн Монгол
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Орчин цагийн амьдралын хэмнэл, хот ба хөдөөгийн ялгарал, спорт, хөгжим хийгээд уламжлалаа хадгалан хөгжиж буй бүтээлч залуусын орон
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ (ДУГААРГҮЙ, СУМТАЙ ГҮЙДЭГ ХУВИЛБАР) */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
        <div className="relative w-full max-w-7xl mx-auto flex items-center px-2 sm:px-6">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Previous"
            className="absolute left-2 z-10 w-9 h-9 rounded-full bg-white/95 border border-emerald-200 shadow-md flex items-center justify-center text-emerald-800 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="w-full py-3 px-12 flex items-center gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs sm:text-sm font-bold"
          >
            {MODERN_SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="px-4 py-2 rounded-full bg-emerald-50/70 border border-emerald-100 text-emerald-950 hover:bg-[#15803d] hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                {sec.title}
              </a>
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Next"
            className="absolute right-2 z-10 w-9 h-9 rounded-full bg-white/95 border border-emerald-200 shadow-md flex items-center justify-center text-emerald-800 hover:bg-[#15803d] hover:text-white transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. БҮХ 7 ХЭСГИЙН ЦЭГЦТЭЙ БҮТЭЦ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-16 space-y-28">
        {MODERN_SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-28 space-y-10"
          >
            {/* ДЭЭД ХЭСЭГ: ЗҮҮН ТАЛД ТЕКСТ, БАРУУН ТАЛД ТОМ ЗУРАГ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Зүүн тал */}
              <div className="lg:col-span-6 space-y-5">
                <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                  {sec.title}
                </h2>

                <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                  {sec.desc}
                </p>

                <div className="pt-2">
                  <Link
                    href={`/about/modern/${sec.id}`}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#15803d] text-white hover:bg-emerald-800 transition-all font-bold text-sm sm:text-base shadow-sm hover:shadow-md group/btn"
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
                  </Link>
                </div>
              </div>

              {/* Баруун тал: Зураг */}
              <div className="lg:col-span-6 relative w-full h-64 sm:h-80 lg:h-[340px] rounded-3xl overflow-hidden shadow-md group border border-emerald-100">
                <Image
                  src={sec.imageUrl}
                  alt={sec.title}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

            </div>

            {/* ДООД ТАЛ: 3 ТОМ ЗУРАГТ КАРТУУД */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sec.items.map((item, idx) => (
                <div
                  key={idx}
                  className="group/card bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs hover:shadow-md hover:border-[#15803d]/50 transition-all duration-300 flex flex-col"
                >
                  <div className="relative w-full h-48 sm:h-52 overflow-hidden">
                    <Image
                      src={item.thumb}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                    />
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
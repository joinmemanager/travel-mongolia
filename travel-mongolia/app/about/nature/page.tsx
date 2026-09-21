'use client';

import React from 'react';


interface NatureItem {
  title: string;
  desc: string;
  thumb: string;
}

interface NatureSection {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: NatureItem[];
}

const NATURE_SECTIONS: NatureSection[] = [
  {
    id: 'geography',
    title: 'Монгол орны газарзүй',
    desc: 'Далайд гарцгүй, далайн түвшнээс дунджаар 1,580 метр өндөрт орших 1.5 сая хавтгай дөрвөлжин километр уудам нутаг.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1400',
    items: [
      {
        title: 'Байршил & Хил хязгаар',
        desc: 'ОХУ болон БНХАУ-тай хиллэдэг, дэлхийн 18 дахь том газар нутагтай улс.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Туйлын цэгүүд',
        desc: 'Хамгийн өндөр цэг Хүйтэн оргил (4,374 м), хамгийн нам дор цэг Хөх нуурын хотгор (560 м).',
        thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
      },
      {
        title: 'Байгалийн бүс бүслүүр',
        desc: 'Мөнх цаст уулс, хөвч тайгаас эхлээд тал хээр, өргөн уудам говь цөл хосолсон орон зай.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
  {
    id: 'climate',
    title: 'Уур амьсгал',
    desc: 'Жилд дунджаар 250 гаруй цэлмэг өдөртэй тул “Мөнх хөх тэнгэрийн орон” хэмээн алдаршсан дөрвөн улирлын ялгаралтай бүс.',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1400',
    items: [
      {
        title: 'Температурын далайц',
        desc: 'Өвөл -40°C хүйтэрч, зун +40°C халдаг эх газрын эрс тэс уур амьсгалын онцлог.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Дөрвөн улирал',
        desc: 'Урин хавар, дэлгэр зун, алтан намар, өвлийн өнтэй цаг гэсэн тод мөчлөгт амьдрал.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: 'Нарлаг өдрүүд',
        desc: 'Хөх тэнгэр, тунгалаг хуурай агаар, жилийн ихэнх өдөр гэрэлтэх нарны илч.',
        thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      },
    ],
  },
  {
    id: 'gobi',
    title: 'Говь',
    desc: 'Хонгорын элс, Баянзаг, Хэрмэн цав зэрэг байгалийн уран баримал болсон элсэн манхан, заган ой бүхий дэлхийд ховор говь.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1400',
    items: [
      {
        title: 'Хонгорын элс',
        desc: '180 км урт үргэлжлэх дуут манхан, салхины аясаар хөгжим мэт эгшиглэдэг элсэн далай.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Баянзаг & Улаан хавцал',
        desc: 'Дэлхийд анх үлэг гүрвэлийн өндөг олдсон галын өнгөт алдарт улаан цав.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Говийн баянбүрдүүд',
        desc: 'Хүйтэн булаг, тоорой мод, хулсан шугуй бүхий элсэн дундах байгалийн амьдралын арал.',
        thumb: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600',
      },
    ],
  },
  {
    id: 'steppe',
    title: 'Тал хээр',
    desc: 'Нүд алдам үргэлжлэх Дорнодын уудам тал нутаг, нүүдэлчин амьдралын өлгий болсон хялганат ногоон далай.',
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1400',
    items: [
      {
        title: 'Дорнодын тал',
        desc: 'Дэлхийн хамгийн сүүлчийн онгон дагшин хялганат хээр талын асар том экосистем.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: 'Цагаан зээрийн сүрэг',
        desc: 'Зуун зуун мянгаараа сүрэглэн цахилах нүүдлийн амьдралтай хээрийн гайхамшиг.',
        thumb: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600',
      },
      {
        title: 'Шилийн Богд & Ганга нуур',
        desc: 'Дарьгангын галт уулс, хунгийн чуулган хурах талын үзэсгэлэнт уул ус.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
    ],
  },
  {
    id: 'mountains',
    title: 'Уулс',
    desc: 'Монгол Алтай, Хангай, Хэнтийн нуруудын өндөр сүрлэг оргилууд, мөсөн голууд болон хад хавцлын гайхамшиг.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400',
    items: [
      {
        title: 'Алтай Таван Богд',
        desc: 'Мөнх цаст 5 сүрлэг оргил болон Монголын хамгийн урт Потанины мөсөн гол.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Отгонтэнгэр хайрхан',
        desc: 'Хангайн нурууны ноён оргил, төрийн тахилгат Очирваань бурхны орон.',
        thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
      },
      {
        title: 'Бурхан Халдун хайрхан',
        desc: 'Чингис хааны өлгий нутаг, ЮНЕСКО-гийн соёлын өвд бүртгэгдсэн ариун шүтээн уул.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
    ],
  },
  {
    id: 'taiga',
    title: 'Ой, тайга',
    desc: 'Хөвсгөл, Хэнтийн хөвч тайга, хар мод, хуш моддын анхилуун үнэр, цаатнуудын нутагладаг онгон зэрлэг байгаль.',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1400',
    items: [
      {
        title: 'Хөвсгөлийн хөвч тайга',
        desc: 'Монголын цаатан иргэд болон цаа бугын сүргийн төрөлх онгон бүс нутаг.',
        thumb: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600',
      },
      {
        title: 'Шинэс ба хушин ой',
        desc: 'Монголын ойн сангийн 80 хувийг бүрдүүлдэг Сибирийн хар мод болон самар үржилт хуш.',
        thumb: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=600',
      },
      {
        title: 'Тайгын экосистем',
        desc: 'Халиун буга, хандгай, баавгай, булга, хүдэр зэрэг ан амьтдын амин тулгуур.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
    ],
  },
  {
    id: 'lakes-rivers',
    title: 'Гол, нуур',
    desc: 'Дэлхийн цэнгэг усны 1 хувийг агуулдаг “Далай ээж” Хөвсгөл нуураас эхлээд Хойд мөсөн далай, Номхон далайн ай савын голууд.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1400',
    items: [
      {
        title: 'Хөвсгөл нуур',
        desc: 'Азийн хамгийн цэнгэг нууруудын нэг, 2 сая гаруй жилийн настай эртний цэнхэр сувд.',
        thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      },
      {
        title: 'Сэлэнгэ, Орхон, Хэрлэн',
        desc: 'Монголын түүхийг тэтгэж ирсэн хамгийн урт, ус ихтэй гол мөрний ай савууд.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Увс нуурын хотгор',
        desc: 'Давстай их нуур, ЮНЕСКО-гийн дэлхийн байгалийн өвд бүртгэгдсэн шувуудын чуулган.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
    ],
  },
  {
    id: 'flora',
    title: 'Ургамлын аймаг',
    desc: '3,000 гаруй зүйлийн дээд ургамал, үүнээс 800 гаруй нь уламжлалт анагаах ухаанд хэрэглэгддэг шимт ургамлууд.',
    imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=1400',
    items: [
      {
        title: 'Цөлийн ба талын ургамал',
        desc: 'Таана, хөмүүл, хазаар өвс, шаваг зэрэг малын тарга хүчийг тэтгэдэг шимт ногоо.',
        thumb: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?q=80&w=600',
      },
      {
        title: 'Эмийн ургамлууд',
        desc: 'Вансэмбэрүү, алтан гагнуур, чацаргана, цөлийн аргамжин цэцэг зэрэг ховор ургамал.',
        thumb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
      },
      {
        title: 'Эндемик ургамал',
        desc: 'Зөвхөн Монголын говь, хангайд ургадаг дэлхийд өөр хаана ч байхгүй ургамлын аймгууд.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
  {
    id: 'wildlife',
    title: 'Зэрлэг амьтад',
    desc: 'Дэлхийд цор ганц говийн мазаалай баавгай, цоохор ирвэс, тахь адуу, хавтгай тэмээний өлгий нутаг.',
    imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1400',
    items: [
      {
        title: 'Мазаалай баавгай',
        desc: 'Дэлхийд ердөө 50 хүрэхгүй толгой үлдсэн говийн эрс тэс уур амьсгалд дасан зохицсон амьтан.',
        thumb: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600',
      },
      {
        title: 'Цоохор ирвэс & Тахь',
        desc: 'Өндөр уулын эзэн цоохор ирвэс болон байгальд нь эргүүлэн нутагшуулсан зэрлэг адуу Тахь.',
        thumb: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=600',
      },
      {
        title: 'Хавтгай & Хулан',
        desc: 'Зэрлэг хоёр бөхт тэмээ Хавтгай, тал говийн түргэн хөлт хулан зэрэг ховор амьтад.',
        thumb: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600',
      },
    ],
  },
  {
    id: 'geology',
    title: 'Геологи',
    desc: 'Төв Азийн нугачаа үүссэн эртний үеийн чулуулаг, унтарсан галт уулс, халуун рашаан ба эрдэс баялгийн их уурхай.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1400',
    items: [
      {
        title: 'Унтарсан галт уулс',
        desc: 'Хоргын тогоо, Дарьгангын галт уулс, лаавын урсацаас тогтсон байгалийн өвөрмөц тогтоц.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Байгалийн халуун рашаанууд',
        desc: 'Цэнхэрийн рашаан, Шаргалжуут зэрэг газрын гүнээс оргилон гарах эрдэст эмчилгээний ус.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Эрдэс баялгийн бүсүүд',
        desc: 'Зэс, нүүрс, алт, ховор элементүүдээр дэлхийд дээгүүрт тооцогдох геологийн сан.',
        thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=600',
      },
    ],
  },
  {
    id: 'paleontology',
    title: 'Палеонтологи, үлэг гүрвэл',
    desc: 'Дэлхийн үлэг гүрвэлийн судалгааны эх орон. Тарбозавр, Зауролоф, Протоцератопсын бүрэн хэлхээ яс олдсон газар.',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1400',
    items: [
      {
        title: 'Тарбозавр Батаар',
        desc: 'Ази тивд амьдарч байсан махан идэшт хамгийн хүчирхэг аварга үлэг гүрвэл.',
        thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600',
      },
      {
        title: 'Үлэг гүрвэлийн өндөг',
        desc: '1923 онд Рой Чепмен Эндрюсийн экспедиц хүн төрөлхтний түүхэнд анх удаа чулуужсан өндөг олсон түүх.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Хэрмэн цав & Нэмэгтийн хөндий',
        desc: 'Дэлхийн хамгийн том палеонтологийн ил музей хэмээгддэг олдворт улаан хавцлууд.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
];

export default function NaturePage() {
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
        <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2400" alt="Байгаль, газарзүй, амьтан" className="absolute inset-0 w-full h-full object-cover brightness-[0.55]" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            08. Nature, Geography & Wildlife
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Байгаль, газарзүй, амьтан
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Мөнх цаст өндөр уулсаас алтан шаргал говь хүртэлх онгон байгаль, ховор ан амьтад хийгээд эртний үлэг гүрвэлийн өлгий нутаг
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ (ДУГААРГҮЙ) */}
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
            {NATURE_SECTIONS.map((sec) => (
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

      {/* 3. БҮХ 11 ХЭСГИЙН ЦЭГЦТЭЙ БҮТЭЦ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-16 space-y-28">
        {NATURE_SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-28 space-y-10"
          >
            {/* ДЭЭД ХЭСЭГ */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              <div className="lg:col-span-6 space-y-5">
                <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                  {sec.title}
                </h2>

                <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                  {sec.desc}
                </p>

                <div className="pt-2">
                  <a
                    href={`/about/nature/${sec.id}`}
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
                  </a>
                </div>
              </div>

              <div className="lg:col-span-6 relative w-full h-64 sm:h-80 lg:h-[340px] rounded-3xl overflow-hidden shadow-md group border border-emerald-100">
                <img src={sec.imageUrl} alt={sec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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


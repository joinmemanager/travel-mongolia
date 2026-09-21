'use client';

import React from 'react';


interface FoodSubItem {
  title: string;
  desc: string;
  thumb: string;
}

interface FoodSection {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: FoodSubItem[];
}

const FOOD_SECTIONS: FoodSection[] = [
  {
    id: 'food-culture',
    title: 'Монгол хоолны соёл',
    desc: 'Байгаль цаг уурын эрс тэс уур амьсгалд зохицсон, улирлын чанартай хооллолтын гүн ухаан. Өвөл, хаварт “улаан идээ” буюу махаар биеийн дулааныг тэтгэж, зун, намарт “цагаан идээ”-гээр гэдэс дотроо цэвэрлэж ундаалдаг.',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200',
    items: [
      {
        title: 'Улирлын хооллолт',
        desc: 'Зуны улиралд сүү цагаагаар биеэ ариусган, өвлийн тэсгим хүйтэнд махан хүнсээр илчээ тэтгэдэг ухаан.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Шүүс зоогийн эрэмбэ',
        desc: 'Хонь, үхрийн махыг эвдэх, чанах, ахмад настанд дал дөрвөн өндөр, ууц тавьж хүндэтгэх нарийн дэг жаяг.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: 'Эмийн чанарт зоог',
        desc: 'Шар тос, халиар, таана, халгай, зэрлэг сонгино зэрэг хээрийн ургамлаар хоол амталж анагаах шимт бэлтгэл.',
        thumb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600',
      },
    ],
  },
  {
    id: 'meat-dishes',
    title: 'Махан хоол',
    desc: 'Байгалийн бэлчээрийн 80 гаруй төрлийн эмийн ургамлаар хооллосон малын мах нь өөрөө биологийн өндөр идэвхт чанартай байдаг.',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200',
    items: [
      {
        title: 'Хорхог',
        desc: 'Улайсгасан чулууг битүү саванд мах, ногоотой цуг хийж өөрийнх нь уураар жигнэж болгодог нүүдэлчдийн алдарт зоог.',
        thumb: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
      },
      {
        title: 'Боодлог',
        desc: 'Тарвага, ямааны махыг арьсанд нь хийж, халуун чулуугаар дотроос нь болгодог эртний хосгүй технологи.',
        thumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600',
      },
      {
        title: 'Чанасан мах & Шөл',
        desc: 'Давснаас өөр амтлагчгүйгээр өөрийнх нь амтаар чанасан шүүслэг мах, ядаргаа тайлах шимтэй халуун шөл.',
        thumb: 'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=600',
      },
    ],
  },
  {
    id: 'dairy',
    title: 'Цагаан идээ',
    desc: 'Таван хошуу малын сүүг боловсруулан гаргаж авдаг байгалийн цэвэр кальци, амин дэм, ашигтай бактериар баялаг эрүүл мэндийн ундарга.',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=1200',
    items: [
      {
        title: 'Өрөм & Зөөхий',
        desc: 'Үнээ, сарлагийн сүүг хөөрүүлэн самарснаар тогтдог шаргал тослог хальс ба цөцгий.',
        thumb: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600',
      },
      {
        title: 'Ааруул & Ээзгий',
        desc: 'Нар салхинд хатаан шүд бэхжүүлж, олон жил чанараа алддаггүй нүүдэлчдийн аяны шидэт хүнс.',
        thumb: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=600',
      },
      {
        title: 'Бяслаг & Аарц',
        desc: 'Сүүг ээдүүлж шахан хийдэг байгалийн органик уураг, халуун аарц нь ханиад томууг эмнэх увидастай.',
        thumb: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=600',
      },
    ],
  },
  {
    id: 'flour-dishes',
    title: 'Гурилан хоол',
    desc: 'Гар аргаар элдсэн нимгэн гурил, татсан шинэ махаар хийдэг монгол түмний өдөр тутмын болон баярын хүндэт зоогууд.',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=1200',
    items: [
      {
        title: 'Бууз & Банш',
        desc: 'Цагаан сар болон хүндтэй зочны ширээг чимдэг уураар жигнэсэн шүүслэг, амтат амттаны оргил.',
        thumb: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600',
      },
      {
        title: 'Хуушуур',
        desc: 'Үндэсний баяр наадмын гол зоог. Гаднаа шаржигнасан нимгэн гурилтай, дотроо шүүслэг халуун амтат хуушуур.',
        thumb: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?q=80&w=600',
      },
      {
        title: 'Цуйван & Гар хийцийн гоймон',
        desc: 'Жигнэсэн гурилыг махан хуургатай цуг төмөр тогоонд таглан болгодог эрчүүдийн хамгийн дуртай зоог.',
        thumb: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=600',
      },
    ],
  },
  {
    id: 'airag',
    title: 'Айраг',
    desc: 'Гүүний саам сүүг ширэн хөхүүрт олон мянган удаа бүлж исгэдэг биеийн тамирыг сэргээгч, ЮНЕСКО-д бүртгэгдсэн ундаа.',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=1200',
    items: [
      {
        title: 'Хөхүүрийн соёл',
        desc: 'Үхрийн ширээр оёсон хөхүүрт бүлж исгэх нь агаарын солилцоо явуулж айргийг зөөлөн, чимчигнэсэн болгодог.',
        thumb: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=600',
      },
      {
        title: 'Шим тэжээл ба эмчилгээ',
        desc: 'Сүрьеэ, уушгины өвчин, ходоод гэдэсний замыг эмчлэх байгалийн антибиотик, олон төрлийн витаминтай.',
        thumb: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600',
      },
      {
        title: 'Булганы сайхан айраг',
        desc: 'Хангайн шимт бэлчээрийн өвсөөр хооллосон гүүний саам, үе дамжсан исгэх нарийн ухаан.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
    ],
  },
  {
    id: 'mongolian-tea',
    title: 'Монгол цай',
    desc: 'Нүүдэлчдийн өглөө бүхэн шинэ чанасан сүүтэй цайны дээжийг тэнгэр хангайдаа өргөж эхэлдэг.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200',
    items: [
      {
        title: 'Сүүтэй цай & Хийц',
        desc: 'Хужир, сүү, шар тосоор амталж, арвайн гурил, борцоор баяжуулсан өл дарах бүтэн хоол болдог цай.',
        thumb: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600',
      },
      {
        title: 'Банштай цай',
        desc: 'Цайндаа махтай банш чанаж, шар тос хөвүүлэн хүйтний улиралд бие халааж ядаргаа тайлдаг уламжлалт зоог.',
        thumb: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=600',
      },
      {
        title: 'Цайны дээж өргөх',
        desc: 'Гэрийн эзэгтэй шинэ цайныхаа анхны дээжийг нар зөв эргэн тэнгэр, уул хангайдаа цацал өргөх ёс.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
    ],
  },
  {
    id: 'regional-cuisine',
    title: 'Бүс нутгийн хоол',
    desc: 'Хангай, говь, тал хээр, баруун хязгаарын ястан ястны байгаль цаг уур, өв соёлоо дагасан өвөрмөц хоол хүнс.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    items: [
      {
        title: 'Казах үндэстний Бешбармак',
        desc: 'Адууны махыг том хэрчсэн хавтгай гурил, сонгинотой шөлөөр баяжуулан тавагладаг баруун аймгийн зоог.',
        thumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600',
      },
      {
        title: 'Буриад талх & Өрөм',
        desc: 'Зууханд шарсан зузаан анхилуун талх дээр өтгөн шар өрөм, зэрлэг жимсний чанамал тавьж идэх соёл.',
        thumb: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600',
      },
      {
        title: 'Говийн ингэний хоормог',
        desc: 'Хоёр бөхт тэмээний өтгөн сүүгээр исгэдэг исгэлэндүү, шим тэжээл асар өндөртэй тансаг ундаа.',
        thumb: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600',
      },
    ],
  },
  {
    id: 'food-processing',
    title: 'Уламжлалт хүнс боловсруулах арга',
    desc: 'Хөргөгч, хөлдөөгчгүйгээр хүнсийг жилийн турш шинээр нь муутгалгүй хадгалах байгалийн шинжлэх ухаан.',
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=1200',
    items: [
      {
        title: 'Борц бэлтгэх технологи',
        desc: 'Өвлийн хүйтэнд үхэр, тэмээний махыг салхинд сэврээж хатаан нүдэж нунтагласнаар бага зайд их шим хадгална.',
        thumb: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
      },
      {
        title: 'Үүц бэлтгэх ёс',
        desc: 'Өвлийн эхэн сард жилийн махан хүнсийг төхөөрч хүйтэн саравчинд цасанд булаж өвлийн турш хэрэглэнэ.',
        thumb: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600',
      },
      {
        title: 'Шар тос хайлуулах',
        desc: 'Өрөм, зөөхийг хайлуулан тунгааж жилийн турш мууддаггүй эмийн чанарт ариун тос гарган авах ухаан.',
        thumb: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=600',
      },
    ],
  },
];

export default function MongolianFoodPage() {
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
        <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2400" alt="Монгол хоол, ундаа" className="absolute inset-0 w-full h-full object-cover brightness-[0.55]" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            07. Mongolian Food & Drink
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Монгол хоол, ундаа
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Байгалийн бэлчээрийн эко мах, таван эрдэнийн цагаан идээ, дэлхийд хосгүй айраг, нүүдэлчдийн шимт зоогийн их өв
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
            {FOOD_SECTIONS.map((sec) => (
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

      {/* 3. БҮХ 8 ХЭСГИЙН ЦЭГЦТЭЙ БҮТЭЦ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-16 space-y-28">
        {FOOD_SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-28 space-y-10"
          >
            {/* ДЭЭД ХЭСЭГ: ЗҮҮН ТАЛД ТЕКСТ, БАРУУН ТАЛД ТОМ ЗУРАГ */}
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
                    href={`/about/food/${sec.id}`}
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


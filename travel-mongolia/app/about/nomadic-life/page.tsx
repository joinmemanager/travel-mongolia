'use client';

import Link from 'next/link';
import React, { useRef } from 'react';
import Image from 'next/image';


interface SubItem {
  title: string;
  desc: string;
  thumb: string;
}

interface NomadicSection {
  id: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: SubItem[];
}

const NOMADIC_SECTIONS: NomadicSection[] = [
  {
    id: 'ger',
    title: 'Монгол гэр',
    desc: 'Нүүдэлчдийн олон зуун жилийн ахуй амьдралын ухааны охь болсон, байгалийн эрс тэс уур амьсгалд төгс зохицсон, угсарч буулгахад хялбар сууц.',
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
    items: [
      {
        title: 'Бүтэц ба эд анги',
        desc: 'Тооно, багана, унь, хана, хаалга зэргээс бүрдэх бөгөөд нэг ч хадаасгүйгээр тэмээний үр, сураар бэхлэгддэг.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Орон зайн бэлгэдэл',
        desc: 'Хоймор, баруун эрэгтэй тал, зүүн эмэгтэй тал гэсэн нарийн дэг эрэмбэтэй бөгөөд тооноор нарны цагийг баримталдаг.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Эсгий бүрээс',
        desc: 'Хонины цэвэр ноосоор хийсэн эсгий нь өвөл дулаан, зун сэрүүн байлгах байгалийн төгс дулаалга болдог.',
        thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600',
      },
    ],
  },
  {
    id: 'five-animals',
    title: 'Таван хошуу мал',
    desc: 'Адуу, үхэр, тэмээ, хонь, ямаа буюу монгол түмний амин зуулга, өмсөх хувцас, идэх хүнс, уналга хөсгийн эх үүсвэр болсон таван эрдэнэ.',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=1200',
    items: [
      {
        title: 'Адуу ба Тэмээ',
        desc: 'Тал нутгийн хурдан хүлэг адуу хийгээд говь цөлийн хөлөг, хоёр бөхт тэмээн сүрэг.',
        thumb: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=600',
      },
      {
        title: 'Үхэр & Сарлаг',
        desc: 'Хангайн сүрлэг сарлаг болон шимт сүү, ачлага уналгын гол тулгуур болсон үхэр сүрэг.',
        thumb: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=600',
      },
      {
        title: 'Хонь ба Ямаа',
        desc: 'Өөх тос, махны хэрэгцээг хангагч хонь болон дэлхийд гайхагддаг ноолуурын баялаг болсон ямаа.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
    ],
  },
  {
    id: 'four-seasons',
    title: 'Дөрвөн улирлын нүүдэл',
    desc: 'Бэлчээрийн соргог, усны тунгалгийг даган хаваржаа, зуслан, намаржаа, өвөлжөөний хооронд жил бүр нүүдэллэн амьдрах эко ухаан.',
    imageUrl: 'https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=1200',
    items: [
      {
        title: 'Өвөлжөө & Хаваржаа',
        desc: 'Нөмөр нөөлөг, энгэр газар мал сүргээ хүйтнээс хамгаалан суурьших өвлийн болон төлийн байршил.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Зуслан & Намаржаа',
        desc: 'Салхины сэвшээ бүхий голын хөндий, шимтэй бэлчээрт малыг таргалуулж, өвлийн бэлтгэл базаах үе.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Ачаа хөсөг & Нүүдэл',
        desc: 'Гэрээ буулган тэмээ, үхэр тэргэнд ачиж, шинэ нутаг руу цуваа болон хөдлөх эртний их аян.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
    ],
  },
  {
    id: 'herding',
    title: 'Мал маллах ухаан',
    desc: 'Байгаль дэлхий, цаг агаарын шинж байдал, од эрхэсээр цаг уурыг шинжиж мал сүргээ төллүүлэх, хариулах үе уламжилсан арга барил.',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
    items: [
      {
        title: 'Цаг агаар шинжих',
        desc: 'Мал амьтны зан авир, нар жаргах тэнгэрийн хаяа, салхины чигээр цасан болон шороон шуургыг урьдчилан таах ухаан.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Ургац, бэлчээр сонгох',
        desc: 'Таана, хөмүүл, хужир мараа бүхий газрыг нарийн тогтоон малын ашиг шимийг нэмэгдүүлнэ.',
        thumb: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
      },
      {
        title: 'Мал төллөлт',
        desc: 'Хаврын хатуу цагт шинэ төлийг дулаан байлгаж, эхэд нь эсэн мэнд дасган хөл дээр нь босгох нарийн арчилгаа.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Ахуйн багаж, хэрэгсэл',
    desc: 'Уурга, хуйцаа, ногт, хазаар, эмээл, хазаараас эхлээд өдөр тутмын амьдралд хэрэглэгддэг шир, модон уламжлалт хэрэгслүүд.',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200',
    items: [
      {
        title: 'Уурга & Хуйцаа',
        desc: 'Урт нарийн хус модоор хийсэн уурга, хуйцаагаар адуу малыг хээр талд гарамгай уургалах эрийн ур чадвар.',
        thumb: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600',
      },
      {
        title: 'Монгол эмээл, хазаар',
        desc: 'Модон суурьтай, мөнгөн тоноглол бүхий уналгад бат бөх, морины нурууг хамгаалсан хийц.',
        thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600',
      },
      {
        title: 'Сур, ширэн тоног',
        desc: 'Үхрийн ширийг элдэн хийсэн сур, цулбуур, ногт нь байгальд ээлтэй, тасрахгүй бат бөх байдаг.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
    ],
  },
  {
    id: 'eco-culture',
    title: 'Байгаль хамгаалах уламжлал',
    desc: 'Ус, булаг шанд руу сүү, цус дусаахгүй байх, газар шороог сэндийлэхгүй байх зэрэг нүүдэлчдийн байгальтайгаа зохицсон ариун ёс.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    items: [
      {
        title: 'Усаа дээдлэх цээр',
        desc: 'Урсгал ус, гол горхины ундаргыг булингартуулах, бохир оруулахыг хатуу цээрлэж хайрладаг.',
        thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      },
      {
        title: 'Уул овоо тахих',
        desc: 'Байгалийн савдаг, хангай дэлхийгээ баясгаж амьтан, ургамлыг хамгаалах сэтгэлийн их шүтлэг.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Хөрс хамгаалах ёс',
        desc: 'Газрын хөрсийг дэмий ухаж сэндийлэхийг цээрлэн, ургамлын үндсийг таслалгүй байгалийг онгон байдлаар нь хадгална.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
    ],
  },
  {
    id: 'games',
    title: 'Монгол ардын тоглоом наадам',
    desc: 'Шагай хамах, морь уралдуулах, алаг мэлхий өрөх, оньсон тоглоом зэрэг оюун ухаан, авхаалж самбаа сорьсон өв соёл.',
    imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200',
    items: [
      {
        title: 'Шагайн наадгай',
        desc: 'Хонины шагайгаар морь уралдуулах, шагай няслах, шүүрэх зэрэг малын хэлбэр дүрсийг ашигласан тоглоом.',
        thumb: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=600',
      },
      {
        title: 'Оньсон тоглоом',
        desc: 'Модыг хадаас цавуугүйгээр хооронд нь түгжин угсардаг орон зайн сэтгэлгээ хөгжүүлэх ухаан.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Алаг мэлхий өрөх',
        desc: 'Цагаан сарын шинийн нэгэнд шагайгаар мэлхийн эрхтнүүдийг өрж, шоо хаяж нааддаг уламжлалт зан үйл.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
];

export default function NomadicLifePage() {
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
        <img src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=2400" alt="Нүүдэлчин ахуй амьдрал" className="absolute inset-0 w-full h-full object-cover brightness-[0.55]" />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            04. Nomadic Life & Heritage
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Нүүдэлчин ахуй амьдрал
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Монгол гэр, таван эрдэнэ мал сүрэг, дөрвөн улирлын нүүдэл хийгээд байгальтайгаа хүйн холбоотой амьдарч ирсэн нүүдэлчдийн гүн ухаан
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ НАВИГАЦИ (ДУГААРГҮЙ, СУМТАЙ ЗӨӨЛӨН ГҮЙДЭГ) */}
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
            {NOMADIC_SECTIONS.map((sec) => (
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
        {NOMADIC_SECTIONS.map((sec) => (
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
                    href={`/about/nomadic-life/${sec.id}`}
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


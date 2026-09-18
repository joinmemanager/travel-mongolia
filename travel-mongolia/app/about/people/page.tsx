'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface PeopleItem {
  title: string;
  desc: string;
  thumb: string;
}

interface PeopleSection {
  id: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: PeopleItem[];
}

const PEOPLE_SECTIONS: PeopleSection[] = [
  {
    id: 'mongolians',
    num: '01',
    tag: 'Язгуур өв ба угсаатан',
    title: 'Монголчууд',
    desc: 'Эртний нүүдэлчин овог аймгуудаас эхтэй монгол туургатан нь эв нэгдэл, эрх чөлөө, байгаль дэлхийгээ дээдлэн хамгаалдаг өнө эртний оюун санааны баялаг өвтэй ард түмэн билээ.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    items: [
      {
        title: 'Язгуур угсаа',
        desc: 'Төв Азийн өндөрлөгт олон зуун жил нутаглаж, төрт ёсыг үндэслэсэн өвөг дээдсийн үр сад.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
      {
        title: 'Зан чанарын онцлог',
        desc: 'Уужим ухаан, байгальтайгаа зохицох мэдрэмж, зочломтгой халуун дулаан зан төлөв.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Ахмадаа дээдлэх ёс',
        desc: 'Үг сургаалыг сонсож, ургийн уламжлалаа хүндэтгэн дагаж мөрддөг өвөрмөц ёс зүй.',
        thumb: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=600',
      },
    ],
  },
  {
    id: 'ethnic-groups',
    num: '02',
    tag: 'Олон янз соёлын өнгө',
    title: 'Угсаатны бүлгүүд',
    desc: 'Халх, буриад, баяд, дөрвөд, казак, захчин, урианхай зэрэг 20 гаруй ястан өөрсдийн аялгуу, өвөрмөц дээл хувцас, зан үйлээрээ Монгол түмний соёлыг баяжуулдаг.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200',
    items: [
      {
        title: 'Баруун Монголын ястнууд',
        desc: 'Ойрад түмний өвөрмөц бүжиг, товшуур хөгжим, баатарлаг туульсийн их өв соёл.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Буриад зоны өв',
        desc: 'Ёохор харайх бүжиг, уран хийцийн дээл хувцас, нандин гар урлалын гайхамшиг.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Казак түмний соёл',
        desc: 'Бүргэдээр ан хийх хосгүй эрдэм, гар хатгамал бүхий өнгөлөг эсгий гэр, ёс заншил.',
        thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=600',
      },
    ],
  },
  {
    id: 'language-script',
    num: '03',
    tag: 'Оюуны тусгаар тогтнол',
    title: 'Монгол хэл ба Монгол бичиг',
    desc: 'Алтай язгуурын яруу тансаг монгол хэл болон тэнгэрээс газар луу нар зөв урсдаг босоо монгол бичиг нь хүн төрөлхтний соёлын үнэт эрдэнэ юм.',
    imageUrl: 'https://images.unsplash.com/photo-1578637387939-43c525550085?q=80&w=1200',
    items: [
      {
        title: 'Босоо монгол бичиг',
        desc: 'Мянга гаруй жилийн түүхтэй, үсэг бүр нь тэнгэр, газар, хүний холбоосыг агуулсан бичиг.',
        thumb: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600',
      },
      {
        title: 'Уран бичлэг (Каллиграфи)',
        desc: 'Бийр янтай нийлүүлэн сэтгэлийн эрч хүчийг цаасан дээр амилуулах дүрслэх урлаг.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Аман зохиолын баялаг',
        desc: 'Ерөөл, магтаал, зүйр цэцэн үгээр дамжин үеэс үед уламжлагдсан үгийн их сан хөмрөг.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
  {
    id: 'hospitality',
    num: '04',
    tag: 'Тал нутгийн соёл',
    title: 'Зочломтгой зан заншил',
    desc: 'Хээр талын аялагчийг танихгүй ч халуун цай, шүүс зоогоор дайлж үддэг, үүд хаалгаа хэзээд нээлттэй байлгадаг нүүдэлчдийн эрхэм ёсон.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    items: [
      {
        title: 'Цай барих ёсон',
        desc: 'Гэрт орж ирсэн хүнд хамгийн түрүүнд сая чанасан сүүтэй цайгаа хоёр гардан барьдаг.',
        thumb: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600',
      },
      {
        title: 'Хөөрөг зөрүүлэх',
        desc: 'Бие биеийн амар мэндийг лавлан, хөөргөө хүндэтгэлтэйгээр солилцон үнэрлэж мэндэлнэ.',
        thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600',
      },
      {
        title: 'Хүндэтгэлийн зоог',
        desc: 'Шүүс тавих, цагаан идээгээр дайлах, гийчнийг үдэх үеийн бэлэг дэмбэрлийн уламжлал.',
        thumb: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
      },
    ],
  },
  {
    id: 'lifestyle',
    num: '05',
    tag: 'Ахуй амьдралын ухаан',
    title: 'Монгол хүний аж төрөхүй',
    desc: 'Нар мандахаас жаргах хүртэл байгаль эхтэйгээ хамт сэрж, дөрвөн улирлын байгалийн өөрчлөлтийг урьдчилан таньж амьдардаг амьдралын философи.',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
    items: [
      {
        title: 'Од эрхэс шинжих ухаан',
        desc: 'Тэнгэрийн хаяа, оддын байрлал, салхины чигээр цаг агаарыг урьдчилан тааварладаг.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
      {
        title: 'Эрүүл амьдралын хэв маяг',
        desc: 'Цэвэр агаар, байгалийн цэвэр хүнс, өдөр тутмын байнгын хөдөлгөөнтэй эрүүл амьдрал.',
        thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=600',
      },
      {
        title: 'Үр хүүхдээ хүмүүжүүлэх',
        desc: 'Мал ахуйд сургаж, хөдөлмөрч чанар, байгальд хайртай сэтгэлийг багаас нь суулгадаг.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
    ],
  },
];

export default function PeoplePage() {
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
          src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2400"
          alt="Монгол хүн, хэл, үндэстний онцлог"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.55]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            03. People, Language & Identity
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Монгол хүн, хэл, үндэстний онцлог
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Монголчуудын угсаатны бүрэлдэхүүн, босоо монгол бичиг, зочломтгой уламжлал ба нүүдэлчин амьдралын хэв маяг
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
            {PEOPLE_SECTIONS.map((sec) => (
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

      {/* 3. ДЭЛГЭРЭНГҮЙ ХЭСГҮҮД */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-16 space-y-28">
        {PEOPLE_SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-28 space-y-10"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6 space-y-5">
                <h2 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                  {sec.title}
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">
                  {sec.desc}
                </p>
                <div className="pt-2">
                  <Link
                    href={`/about/people/${sec.id}`}
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
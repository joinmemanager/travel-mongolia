'use client';

import Link from 'next/link';
import React, { useRef } from 'react';
import Image from 'next/image';


interface TraditionItem {
  title: string;
  desc: string;
  thumb: string;
}

interface TraditionSection {
  id: string;
  num: string;
  tag: string;
  title: string;
  desc: string;
  imageUrl: string;
  items: TraditionItem[];
}

const TRADITION_SECTIONS: TraditionSection[] = [
  {
    id: 'birth-naming',
    num: '01',
    tag: 'Амьдралын эхлэл ба бэлгэдэл',
    title: 'Төрөх, нэр өгөх ёс',
    desc: 'Монголчууд шинэ хүн мэндлэхийг “Нар үзлээ” хэмээн ихэд бэлгэшээж, хүүхдийн угаалга, өлгий барих ёс болон даахь үргээх уламжлалыг өвлүүлж иржээ.',
    imageUrl: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
    items: [
      {
        title: 'Угаалга ба өлгий барих',
        desc: 'Шинэ мэндэлсэн үрд төрсний дараах өдрүүдэд хонины ясны шөлөөр угааж, зөөлөн эсгий өлгийд бэлтгэдэг ёс.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Нэр хайрлах дэг',
        desc: 'Ургийн хамгийн ахмад хүн эсвэл эрдэмт лам хуврагаар шинжүүлэн, чихэнд нь гурван удаа шивнэдэг.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Даахь үргээх ёслол',
        desc: 'Хүүхдийн 3-5 насанд өвөг дээдэс, ураг саднаараа цугларч үсийг нь ариусган ерөөлийн үгтэй хайчилдаг.',
        thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600',
      },
    ],
  },
  {
    id: 'wedding',
    num: '02',
    tag: 'Гал голомт бадраах их ёс',
    title: 'Монгол хуримын ёс',
    desc: 'Худ ураг барилдах, бэр гуйх, шинэ өргөө гэр босгох болон гал асаах нарийн зан үйлээр дамжуулан шинэ өрхийг бүтээдэг эртний их дэг.',
    imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200',
    items: [
      {
        title: 'Бэр гуйх & Сүй тавих',
        desc: 'Хадаг, сүүтэй цай дээжлэн очиж хоёр талын ураг удмын холбоог албан ёсоор баталгаажуулдаг.',
        thumb: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600',
      },
      {
        title: 'Шинэ гэр барих',
        desc: 'Хоёр талын төрөл садан хамтран шинэ хосод зориулан цагаан эсгий өргөө гэрийг нар зөв тойруулан босгоно.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Гал тахих ёслол',
        desc: 'Тулганд нь шинэ гал өрдөж, өөх тос өргөн гал голомтыг нь мөнхөд өөдөө бадрахыг ураг төрлөөрөө ерөөнө.',
        thumb: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=600',
      },
    ],
  },
  {
    id: 'hospitality',
    num: '03',
    tag: 'Хүндэтгэл ба нөхөрлөл',
    title: 'Зочлох, дайлах ёс',
    desc: 'Нүүдэлчдийн найрсаг зан, танихгүй гийчнийг ч халуун цай, шүүс зоогоор дайлж үддэг тал нутгийн эрхэмсэг ёсон.',
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=1200',
    items: [
      {
        title: 'Цайны дээж барих',
        desc: 'Гэрт орж ирсэн зочинд хамгийн түрүүнд сая чанасан сүүтэй цайны дээжийг хоёр гардан барьдаг.',
        thumb: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=600',
      },
      {
        title: 'Хөөрөг зөрүүлэх',
        desc: 'Хөөргөө хоёр гараар хүлээн авч, толгойг нь бага зэрэг мултлан үнэрлэж бие биеийн амар мэндийг лавлана.',
        thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600',
      },
      {
        title: 'Шүүс зоог тавих',
        desc: 'Хүндэт зочинд бүтэн хонины ууц, дал дөрвөн өндөр тавьж зоог барин, хутганы ирийг өөр рүүгээ харуулж өгдөг.',
        thumb: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
      },
    ],
  },
  {
    id: 'tsagaan-sar',
    num: '04',
    tag: 'Хаврын тэргүүн баяр',
    title: 'Цагаан сар',
    desc: 'Өвлийг өнтэй давж, хавартай амар мэнд золгосны үндэсний их баяр. Ураг төрлийн бат холбоо, ахмадаа хүндэтгэх дэг ёс.',
    imageUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
    items: [
      {
        title: 'Битүүний ёслол',
        desc: 'Хуучин оныг үдэж, бүх өр зээлийг дуусган ширээгээ бүрэн идээгээр засч гэдсээ цатгалан үддэг үдэш.',
        thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=600',
      },
      {
        title: 'Амар мэндийн их золголт',
        desc: 'Шинийн нэгний өглөө насны эрэмбээр дүү нь ахмад хүнийхээ тохойг доороос нь түшин хадаг дэлгэн золгоно.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: 'Ул боов & Таваг засах',
        desc: 'Жаргал, зовлонгийн тооллоор сондгой үе тавьж, эргэн тойронд нь цагаан идээгээр баяжуулан засдаг.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
    ],
  },
  {
    id: 'naadam',
    num: '05',
    tag: 'Төрт ёсны цэнгэл',
    title: 'Үндэсний их баяр Наадам',
    desc: 'Эрийн гурван наадам: Хүчит бөх, хурдан морь, үндэсний сур харваагаар шандас, цэц мэргэнээ сорьдог дэлхийн өв соёл.',
    imageUrl: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200',
    items: [
      {
        title: 'Хүчит 512 бөх',
        desc: 'Дэвээ шаваа, уран мэх, жудаг ёс, хүч чадлын дээд илэрхийлэл болсон барилдаан.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: 'Хурдан морины уралдаан',
        desc: 'Зургаан насны морьд хээр талд олон арван бээр замыг уралдаж шандасаа сорино.',
        thumb: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=600',
      },
      {
        title: 'Үндэсний сур харваа',
        desc: 'Эвэр элэгт нум сумаар хана болон хасаа харвах цэц мэргэн, оюуны төвлөрлийн ухаан.',
        thumb: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600',
      },
    ],
  },
  {
    id: 'shamanism',
    num: '06',
    tag: 'Мөнх тэнгэрийн шүтлэг',
    title: 'Бөө мөргөл',
    desc: 'Монголчуудын анхдагч шүтлэг. 99 тэнгэр, лус савдаг, байгалийн далд хүч ба өвөг дээдсийн онгодтой харилцах язгуур уламжлал.',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200',
    items: [
      {
        title: 'Хэнгэрэг & Цан',
        desc: 'Онгодын хүлэг хэмээн дээдэлж, дуу чимээ, ритмээр нь далд ертөнцийг холбодог гол хөгжим.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Оргой ба майхавч',
        desc: 'Бөөгийн өмсгөл хувцас, нүүр халхлах унжлага, шувуу амьтны өд чимэг бүхий хуяг.',
        thumb: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=600',
      },
      {
        title: 'Хүрэл толь',
        desc: 'Муу хүчийг буцаан ойлгох хамгаалалт бөгөөд сүнс онгодыг хуралдуулах гол зэмсэг.',
        thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
      },
    ],
  },
  {
    id: 'buddhism',
    num: '07',
    tag: 'Гэгээрэл ба амар амгалан',
    title: 'Буддын шашин',
    desc: 'XVI зуунд Төвөдөөс дэлгэрсэн шарын шашин буюу Гэлүгба урсгал нь монгол ахуй, гүн ухаан, урлаг соёлтой салшгүй нэгдсэн байна.',
    imageUrl: 'https://images.unsplash.com/photo-1545648816-43e993510e42?q=80&w=1200',
    items: [
      {
        title: 'Төвөдөөс уламжилсан Гэлүгба',
        desc: 'Алтан хаан Содномжамц хутагтад "Далай лам" цол өргөснөөр Монголд өргөн тархжээ.',
        thumb: 'https://images.unsplash.com/photo-1545648816-43e993510e42?q=80&w=600',
      },
      {
        title: 'Өндөр гэгээн Занабазарын өв',
        desc: 'Монголын анхдугаар Богд Занабазарын бүтээсэн цутгуур бурхад ба соёлын хосгүй огил.',
        thumb: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600',
      },
      {
        title: 'Сүм хийдийн номын их өргөө',
        desc: 'Эрдэнэ зуу, Амарбаясгалант хийдүүд нь соён гэгээрэл, эрдэм шинжилгээний төвүүд байв.',
        thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600',
      },
    ],
  },
  {
    id: 'folklore-myths',
    num: '08',
    tag: 'Аман зохиол & Итгэл үнэмшил',
    title: 'Ардын шүтлэг, домог',
    desc: 'Овоо тахилга, уул усаа аргадах ёс болон байгальтайгаа зохицон амьдрах ухааныг үлгэр, домгоор өвлүүлсэн уламжлал.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200',
    items: [
      {
        title: 'Овоо тахих зан үйл',
        desc: 'Уулын савдаг, хангай дэлхийдээ цай сүүний дээж өргөж, нар зөв гурав тойрч чулуу нэмдэг ёс.',
        thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
      },
      {
        title: 'Алтан гадас одны домог',
        desc: 'Тэнгэрийн манаач хоёр алаг морь, долоон бурхан одоор орон зайн чигээ баримталдаг ухаан.',
        thumb: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=600',
      },
      {
        title: 'Хөхөө Намжилын домог',
        desc: 'Жигүүрт хүлэг мориндоо зориулж морин хуур хөгжмийг бүтээсэн хүний сэтгэлийн нандин түүх.',
        thumb: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600',
      },
    ],
  },
  {
    id: 'rituals',
    num: '09',
    tag: 'Улирлын баяр & Өв соёл',
    title: 'Уламжлалт баяр, зан үйл',
    desc: 'Нүүдэлчдийн ажил хөдөлмөр, мал маллах арга ухаан болон байгалийн өөрчлөлтийг дагаж тэмдэглэдэг тусгай наадмууд.',
    imageUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=1200',
    items: [
      {
        title: 'Гүү барих & Үрс гаргах',
        desc: 'Зуны эхэнд анхны гүүгээ барьж айраг исгэх найр хийж, намар нь гүүгээ тавьж үрсээ мялаана.',
        thumb: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?q=80&w=600',
      },
      {
        title: 'Бүргэдийн баяр',
        desc: 'Казах түмний гаршуулсан бүргэдээр ан хийлгэх өвөрмөц уламжлал ба дэлхийд гайхагддаг соёл.',
        thumb: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=600',
      },
      {
        title: 'Түмэн тэмээний баяр',
        desc: 'Өмнөговь аймагт хоёр бөхт тэмээг алдаршуулан зохиодог уралдаан, тэмээтэй поло тоглоом.',
        thumb: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=600',
      },
    ],
  },
];

export default function TraditionsPage() {
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
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400"
          alt="Ёс заншил, уламжлал, шүтлэг"
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.55]"
        />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <span className="text-emerald-400 uppercase tracking-[0.3em] text-sm sm:text-base font-black mb-4 block">
            05. Traditions, Customs & Beliefs
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-md mb-6 leading-tight">
            Ёс заншил, уламжлал, шүтлэг
          </h1>
          <p className="text-white/95 text-base sm:text-xl md:text-2xl max-w-3xl mx-auto font-normal leading-relaxed">
            Хүний амьдралын мөчлөг, нүүдэлчдийн эрхэм ёсон, үндэсний их баяр наадам хийгээд мөнх тэнгэр, Буддын гүн ухааны өв
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

          {/* Цэсний нэрс (тоогүй болсон) */}
          <div
            ref={scrollRef}
            className="w-full py-3 px-12 flex items-center gap-2.5 overflow-x-auto scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs sm:text-sm font-bold"
          >
            {TRADITION_SECTIONS.map((sec) => (
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

      {/* 3. БҮХ 9 ХЭСГИЙН ЦЭГЦТЭЙ БҮТЭЦ */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-16 space-y-28">
        {TRADITION_SECTIONS.map((sec) => (
          <section
            key={sec.id}
            id={sec.id}
            className="scroll-mt-28 space-y-10"
          >
            {/* ДЭЭД ХЭСЭГ: ЗҮҮН ТАЛД ТЕКСТ (НОГООН ЭЛЕМЕНТҮҮДТЭЙ), БАРУУН ТАЛД ЗУРАГ */}
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
                    href={`/about/traditions/${sec.id}`}
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

            {/* ДООД ТАЛ: 3 ТАЙЛБАР КАРТУУД */}
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


'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface UtilityCard {
  title: string;
  badge: string;
  desc: string;
  bullets: string[];
  tips?: string;
  actionText?: string;
  icon: string;
}

interface PlanSection {
  id: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  items: UtilityCard[];
}

interface PlanGroupData {
  title: string;
  subtitle: string;
  heroImage: string;
  sections: PlanSection[];
}

const PLAN_DATA: Record<string, PlanGroupData> = {
  // 1. ИРЭХЭЭС ӨМНӨ & ИРЭХ
  'before-you-go': {
    title: 'Ирэхээс өмнө & Ирэх',
    subtitle: 'Визний журам, аяллын улирал, гар тээш, валют, SIM картын бүрэн лавлах',
    heroImage: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=2000',
    sections: [
      {
        id: 'visa-weather',
        tabLabel: 'Виз, цаг агаар, бэлтгэл',
        title: 'Виз, цаг агаар & Юу авчрах вэ?',
        subtitle: 'Хилээр нэвтрэхээс эхлээд аяллын цүнхээ хэрхэн зөв бэлтгэх зөвлөмж',
        items: [
          {
            icon: '🛂',
            badge: 'Цахим виз',
            title: 'Визний нөхцөл (E-Visa & Безвиз)',
            desc: 'Монгол улс 34 орны иргэдэд визгүй зорчих, 99 орны иргэдэд E-Visa олгодог.',
            bullets: [
              'E-Visa-г evisa.mn-ээр 48 цагт авах боломжтой',
              'Паспортын хүчинтэй хугацаа 6 сараас дээш байх',
              '30 хоногоос дээш хугацаагаар зорчих бол бүртгүүлэх',
            ],
            tips: 'Зөвлөгөө: Аяллын бичиг баримтынхаа дижитал хуулбарыг утсан дээрээ хадгалаарай.',
            icon: '🛂',
          },
          {
            icon: '🌦️',
            badge: 'Уур амьсгал',
            title: 'Цаг агаар & Аяллын улирал',
            desc: 'Эрс тэс уур амьсгалтай тул нэг өдөрт 4 улирлын өнгө үзэх боломжтой.',
            bullets: [
              'Зуны сарууд (6-8 сар): +20°C-аас +35°C (Хамгийн дулаан)',
              'Шөнийн цагт хангай, говьд температур огцом буурдаг',
              'Нарны хэт ягаан туяаны индекс өндөр байдаг',
            ],
            tips: 'Зөвлөгөө: Давхарлаж өмсөх хувцас авч явах нь хамгийн тохиромжтой.',
            icon: '🌦️',
          },
          {
            icon: '🎒',
            badge: 'Чек-лист',
            title: 'Аяллын цүнхэнд заавал байх зүйлс',
            desc: 'Хөдөө хээр, бартаат замд өдөр тутмын тав тухыг хангах эд зүйлс.',
            bullets: [
              'Салхи усны хамгаалалттай хүрэм, дулаан өмд',
              'Бартаат замын алхалтын пүүз, усны хамгаалалттай гутал',
              'Powerbank (өндөр багтаамжтай), хувийн анхны тусламжийн эмийн сан',
            ],
            tips: 'Шумуул, шавьж үргээгч болон SPF50+ нарны тос заавал авчраарай.',
            icon: '🎒',
          },
        ],
      },
      {
        id: 'money-sim',
        tabLabel: 'Мөнгө, SIM & Нислэг',
        title: 'Мөнгө, Төлбөр, SIM & Нисэх буудал',
        subtitle: 'Орон нутгийн харилцаа холбоо, карт болон бэлэн мөнгөний хэрэглээ',
        items: [
          {
            icon: '💳',
            badge: 'Төлбөр тооцоо',
            title: 'Мөнгө, Валют & Картын хэрэглээ',
            desc: 'Үндэсний мөнгөн тэмдэгт төгрөг (MNT). Хот сууринд карт өргөн хэрэглэгддэг.',
            bullets: [
              'Улаанбаатарт Visa, Mastercard бүх дэлгүүрт ажиллана',
              'Хөдөөгийн жижиг суманд сүлжээ тасрах үед бэлэн мөнгө хэрэг болно',
              'АТМ болон банкны салбарууд төв аймгуудад хангалттай бий',
            ],
            tips: 'Зөвлөгөө: Хөдөө хээрийн аялалд гарахдаа 100-200 мянган төгрөг бэлнээр бэлдээрэй.',
            icon: '💳',
          },
          {
            icon: '📶',
            badge: 'Харилцаа холбоо',
            title: 'eSIM & Орон нутгийн SIM карт',
            desc: 'Нисэх буудал болон хотын төвөөс Unitel, Mobicom-ийн дугаар шууд авах боломжтой.',
            bullets: [
              'eSIM дэмждэг утастай бол ирэхээсээ өмнө онлайнаар захиалах',
              'Орон нутагт Unitel болон Mobicom сүлжээ хамгийн өргөн тархсан',
              '4G дата багцтай жуулчны картууд 15,000 - 50,000 төгрөг',
            ],
            tips: 'Хөдөө аглаг байгальд өдөрт хэдэн цаг сүлжээгүй байхыг тооцоолоорой.',
            icon: '📶',
          },
          {
            icon: '✈️',
            badge: 'Тээвэр',
            title: 'Чингис Хаан ОУНБ & Төмөр зам',
            desc: 'Улаанбаатараас урагш 50 км зайд байрлах шинэ олон улсын нисэх буудал.',
            bullets: [
              'Буудлаас хот руу экспресс автобус 80-90 минут тутамд явдаг',
              'Такси дуудах албан ёсны цэгүүд буудлын 1-р давхарт байрлана',
              'Транс-Сибирийн төмөр замаар ОХУ, БНХАУ-аас галт тэргээр ирэх боломжтой',
            ],
            tips: 'Нисэх буудлын экспресс автобусны тийзийг терминал дотроос авна.',
            icon: '✈️',
          },
        ],
      },
    ],
  },

  // 2. ТЭЭВЭР & БАЙРЛАХ ГАЗАР
  'transport-stay': {
    title: 'Тээвэр & Байрлах газар',
    subtitle: 'Бартаат замын тээврийн хэрэгсэл, дотоод нислэг, гэр кэмп, зочид буудлын сонголтууд',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2000',
    sections: [
      {
        id: 'vehicles-flight',
        tabLabel: 'Машин түрээс, Дотоод нислэг',
        title: 'Тээврийн сонголтууд & Бартаат зам',
        subtitle: 'Монгол орны уудам нутагт шилжин явах тохиромжтой хувилбарууд',
        items: [
          {
            icon: '🚙',
            badge: '4x4 Тээвэр',
            title: 'Машин түрээс & Жолоочтой түрээс',
            desc: 'Монголын хөдөө замын 60 гаруй хувь нь шороон бартаат замтай байдаг.',
            bullets: [
              'Өөрөө жолоодох бол Toyota Land Cruiser эсвэл УАЗ Пургон хамгийн тохиромжтой',
              'Нутгийн туршлагатай жолооч хөтөчтэй явах нь төөрөх эрсдэлгүй, найдвартай',
              'Олон улсын жолооны үнэмлэх (IDP) заавал шаардагдана',
            ],
            tips: 'Өдөрт 250-350 км-ээс илүү замын төлөвлөгөө бүү хийгээрэй (шороон замд хугацаа их шаардагдана).',
            icon: '🚙',
          },
          {
            icon: '🛫',
            badge: 'Дотоод нислэг',
            title: 'Хунну Эйр, МИАТ Дотоод чиглэл',
            desc: 'Хол аймгууд руу цаг хэмнэх хамгийн оновчтой шийдэл.',
            bullets: [
              'Өлгий (Алтай Таван богд), Мөрөн (Хөвсгөл), Даланзадгад (Өмнөговь) чиглэлүүд',
              'Зуны оргил үед тийз хурдан дуусдаг тул 1-2 сарын өмнө захиалах',
              'Тээшний жингийн хязгаар ихэвчлэн 15 кг байдаг',
            ],
            tips: 'Цаг агаарын нөхцөл байдлаас шалтгаалж нислэг хойшлогдох магадлалтайг тооцоорой.',
            icon: '🛫',
          },
        ],
      },
      {
        id: 'accommodation-types',
        tabLabel: 'Байрлах газрууд (Гэр кэмп, Зочид буудал)',
        title: 'Байрлах сонголтууд & Монгол ахуй',
        subtitle: 'Тансаг зэрэглэлийн гэр вилланаас авахуулаад малчин айл, майхант отог',
        items: [
          {
            icon: '🛖',
            badge: 'Жуулчны бааз',
            title: 'Уламжлалт Гэр Кэмпүүд',
            desc: 'Байгалийн үзэсгэлэнт газруудад байрлах, тав тух хангасан гэрүүд.',
            bullets: [
              'Цахилгаан халаалт, зуухтай тул шөнөдөө маш дулаахан',
              'Тусдаа ресторан, халуун хүйтэн шүршүүртэй',
              'Тансаг зэрэглэлийн (En-suite) дотроо 00-той гэрүүд бий',
            ],
            tips: 'Үдэш зууханд мод түлэх дуу чимээ нь аяллын хамгийн таатай дурсамж болдог.',
            icon: '🛖',
          },
          {
            icon: '⛺',
            badge: 'Хээрийн кемпинг',
            title: 'Малчин айлд буух & Майхантай хоноглох',
            desc: 'Жинхэнэ нүүдэлчин амьдралыг мэдрэх, байгальтайгаа ойртох хувилбар.',
            bullets: [
              'Малчин айлын гэрт зочноор буухдаа бэлэг, чихэр авч очих нь зохимжтой',
              'Хүссэн газартаа байгаль хамгаалагчийн зөвшөөрөлтэй майхан барих',
              'Байгальд ул мөргүй (Leave No Trace) аялах зарчмыг хатуу баримтлах',
            ],
            tips: 'Гол усны эргээс 50 метрээс багагүй зайд майхнаа бариарай.',
            icon: '⛺',
          },
        ],
      },
    ],
  },

  // 3. ҮЙЛЧИЛГЭЭ & АЮУЛГҮЙ БАЙДАЛ
  'safety-faq': {
    title: 'Үйлчилгээ & Аюулгүй байдал',
    subtitle: 'Аяллын компани сонгох, эмнэлгийн тусламж, соёлын ёс зүй болон түгээмэл асуултууд',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000',
    sections: [
      {
        id: 'safety-health',
        tabLabel: 'Аюулгүй байдал & Эрүүл мэнд',
        title: 'Эрүүл мэнд, Даатгал & Аюулгүй байдал',
        subtitle: 'Эрсдэлгүй, тайван аялахад туслах зөвлөмжүүд',
        items: [
          {
            icon: '🏥',
            badge: 'Эрүүл мэнд',
            title: 'Эмийн сан & Аяллын даатгал',
            desc: 'Хөдөө аялалд эмнэлгийн тусламж хол зайд байдаг тул хувийн бэлтгэл чухал.',
            bullets: [
              'Олон улсын яаралтай тусламжийн даатгал заавал хийлгэх',
              'Хувийн уудаг эм, ходоод гэдэсний болон харшлын эм авч явах',
              'Цэвэршүүлсэн савласан ус байнга хэрэглэх',
            ],
            tips: 'Яаралтай тусламжийн утас: 103 (Эмнэлэг), 102 (Цагдаа), 105 (Онцгой байдал).',
            icon: '🏥',
          },
          {
            icon: '🤝',
            badge: 'Соёлын ёс зүй',
            title: 'Монгол гэрийн ёс заншил',
            desc: 'Нүүдэлчдийн ахуй соёлыг хүндэтгэх энгийн дүрмүүд.',
            bullets: [
              'Гэрийн босгон дээр гишгэж болохгүй, дээгүүр нь алхах',
              'Гэрийн багана дундуур хөндлөн гарч явахгүй байх',
              'Цай, идээ өгөхөд баруун гараараа эсвэл хоёр гардан хүлээн авах',
            ],
            tips: 'Малчин айлын нохойноос сэрэмжилж, эзнийг нь дуустал ойртохгүй байх хэрэгтэй.',
            icon: '🤝',
          },
        ],
      },
      {
        id: 'faq-section',
        tabLabel: 'Түгээмэл асуултууд (FAQ)',
        title: 'Аялагчдын асуудаг түгээмэл 4 асуулт',
        subtitle: 'Аялалд гарахаас өмнө мэдэх шаардлагатай гол хариултууд',
        items: [
          {
            icon: '❓',
            badge: 'FAQ 01',
            title: 'Монголд хэлний бэрхшээл гарах уу?',
            desc: 'Улаанбаатарт залуус англиар чөлөөтэй ярьдаг.',
            bullets: [
              'Хөдөө орон нутагт англи хэл ховор тул Google Translate эсвэл орчуулагч хөтөчтэй явах нь зүйтэй',
              'Нутгийн иргэд биеийн хэлэмжээр ойлголцоход маш найрсаг, тусч ханддаг',
            ],
            icon: '❓',
          },
          {
            icon: '❓',
            badge: 'FAQ 02',
            title: 'Цагаан хоолтон хүнд тохиромжтой юу?',
            desc: 'Монгол хоол мах зонхилдог ч одоо цагаан хоол олоход амархан болсон.',
            bullets: [
              'Жуулчны баазууд цагаан хоол захиалгаар хийж өгдөг',
              'Хөдөө явахдаа өөрт хэрэгцээт ногоо, самар, лаазалсан бүтээгдэхүүнээ УБ-аас базаах нь зүйтэй',
            ],
            icon: '❓',
          },
        ],
      },
    ],
  },
};

export default function PlanShowcase({
  groupKey = 'before-you-go',
  subSlug,
}: {
  groupKey: string;
  subSlug?: string;
}) {
  const currentGroup = PLAN_DATA[groupKey] || PLAN_DATA['before-you-go'];
  const [activeTab, setActiveTab] = useState<string>(
    subSlug || currentGroup.sections[0]?.id || ''
  );
  const isClickScrolling = useRef(false);

  useEffect(() => {
    if (subSlug && currentGroup.sections.some((s) => s.id === subSlug)) {
      setActiveTab(subSlug);
      const timer = setTimeout(() => {
        const el = document.getElementById(subSlug);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (currentGroup.sections[0]) {
        setActiveTab(currentGroup.sections[0].id);
      }
    }
  }, [subSlug, groupKey, currentGroup]);

  const scrollToSection = (id: string) => {
    isClickScrolling.current = true;
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isClickScrolling.current = false;
      }, 800);
    }
  };

  return (
    <div className="w-full bg-[#fafaf9] text-neutral-900 pb-36 font-sans">
      
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
        <Image
          src={currentGroup.heroImage}
          alt={currentGroup.title}
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.65]"
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="text-white/80 uppercase tracking-widest text-xs font-bold mb-3 block">
            Аяллаа төлөвлөх
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md mb-4">
            {currentGroup.title}
          </h1>
          <p className="text-white/90 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light">
            {currentGroup.subtitle}
          </p>
        </div>
      </section>

      {/* 2. НААЛДДАГ ДЭД ЦЭС */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-none">
          {currentGroup.sections.map((sec) => {
            const isActive = activeTab === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                }`}
              >
                {sec.tabLabel}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. ХЭРЭГСЭЛ, ЗӨВЛӨМЖИЙН БҮТЭЦ (SWISS PRACTICAL CARDS) */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-16 space-y-32">
        {currentGroup.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            
            <div className="border-b border-neutral-200 pb-4 mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">
                {section.title}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                {section.subtitle}
              </p>
            </div>

            {/* Картууд: 2 эсвэл 3 баганатай практик блокууд */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {section.items.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Толгойн хэсэг */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="bg-emerald-50 text-[#15803d] text-[11px] font-bold px-3 py-1 rounded-full">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-neutral-600 font-light leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    {/* Буллет жагсаалт */}
                    <div className="space-y-2.5 mb-6">
                      {item.bullets.map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-neutral-700">
                          <span className="text-[#15803d] font-bold mt-0.5">•</span>
                          <span className="leading-snug">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Зөвлөгөө / Тэмдэглэл */}
                  {item.tips && (
                    <div className="pt-4 border-t border-neutral-100 bg-neutral-50/60 -mx-8 -mb-8 p-6 rounded-b-3xl mt-4">
                      <p className="text-[11px] text-neutral-600 font-medium leading-relaxed">
                        💡 {item.tips}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </section>
        ))}

        {/* 4. ДООД ТАЛЫН ИНТЕРАКТИВ ТӨЛӨВЛӨГЧИЙН ХОЛБООС БАННЕР */}
        <div className="bg-neutral-900 text-white rounded-3xl p-8 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold block mb-2">
              ИНТЕРАКТИВ СИСТЕМ (C08)
            </span>
            <h3 className="text-2xl sm:text-4xl font-black mb-3 leading-tight">
              Өөрийн аяллын төлөвлөгөөг шууд гаргах
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Газруудаа сонгож, өдрөөр хуваарилан газрын зураг дээр маршрут болон нийт туулах зайгаа автоматаар тооцоолоорой.
            </p>
          </div>
          <Link
            href="/plan/planner"
            className="whitespace-nowrap px-8 py-4 bg-[#15803d] hover:bg-emerald-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg hover:shadow-emerald-900/40 flex items-center gap-2"
          >
            <span>Төлөвлөгч рүү очих</span>
            <span>→</span>
          </Link>
        </div>

      </div>

    </div>
  );
}
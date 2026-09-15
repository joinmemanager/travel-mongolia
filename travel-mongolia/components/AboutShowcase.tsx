'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface SubSection {
  id: string;
  tabLabel: string;
  title: string;
  category: string;
  description: string;
  imageUrl: string;
}

interface GroupPageData {
  title: string;
  subtitle: string;
  heroImage: string;
  sections: SubSection[];
}

const ABOUT_GROUPS: Record<string, GroupPageData> = {
  // 1. ЕРӨНХИЙ & ТҮҮХ
  history_group: {
    title: 'Ерөнхий & Түүх',
    subtitle: 'Мөнх хөх тэнгэрийн орон ба зуун зууны түүхэн өв',
    heroImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000',
    sections: [
      {
        id: 'glance',
        tabLabel: 'Товчхон',
        category: 'Ерөнхий & Түүх',
        title: 'Монгол орныг товчхон (Газар нутаг, бэлгэдэл)',
        description:
          'Мөнх хөх тэнгэрийн орон, уудам тал нутаг, нүүдэлчдийн өлгий. 1.56 сая хавтгай дөрвөлжин км нутаг дэвсгэртэй, дэлхийн хамгийн сийрэг хүн амтай, онгон дагшин байгалиа нандигнан хадгалж үлдсэн гайхамшигт нутаг билээ.',
        imageUrl:
          'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1200',
      },
      {
        id: 'history',
        tabLabel: 'Монголын түүх',
        category: 'Ерөнхий & Түүх',
        title: 'Монголын их түүх (Хүннү, Их Монгол Улс, 20-р зуун)',
        description:
          'МЭӨ III зууны Хүннүгийн их эзэнт гүрнээс эхлээд Чингис хааны байгуулсан Их Монгол Улс, 20-р зууны түүхэн сэргэн мандалт хүртэлх дэлхийн түүхийг донсолгосон бахархалт түүхийн өлгий.',
        imageUrl:
          'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?q=80&w=1200',
      },
      {
        id: 'people',
        tabLabel: 'Хүн ард & Хэл',
        category: 'Ерөнхий & Түүх',
        title: 'Монгол хүн, хэл, үндэстний онцлог',
        description:
          'Байгаль дэлхийтэйгээ зохицон амьдардаг нүүдэлчдийн уужим сэтгэл, хүндэтгэлтэй зан чанар. Мянга илүү жилийн түүхтэй босоо Монгол бичиг, өвөрмөц хэл аялгуу, олон ястны баялаг соёл.',
        imageUrl:
          'https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1200',
      },
    ],
  },

  // 2. АХУЙ, ЁС ЗАНШИЛ & СОЁЛ
  culture_group: {
    title: 'Ахуй, Ёс заншил & Соёл',
    subtitle: 'Мянганы нүүдэлчин амьдралын ухаан ба амьд өв соёл',
    heroImage:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000',
    sections: [
      {
        id: 'nomadic-life',
        tabLabel: 'Нүүдэлчин ахуй',
        category: 'Ахуй, Ёс заншил & Соёл',
        title: 'Нүүдэлчин ахуй (Гэр, 5 хошуу мал, нүүдэл)',
        description:
          'Эсгий гэр, таван хошуу мал, дөрвөн улирлын нүүдлийн амьдралын ухаан. Зөвхөн Монголд л мэдэрч болох жинхэнэ нүүдэлчдийн найрсаг зочломтгой зан, ахуй амьдралын хэмнэлийг биеэр мэдрээрэй.',
        imageUrl:
          'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200',
      },
      {
        id: 'traditions',
        tabLabel: 'Ёс заншил',
        category: 'Ахуй, Ёс заншил & Соёл',
        title: 'Ёс заншил, уламжлал, шүтлэг',
        description:
          'Байгаль эхээ хайрлан дээдлэх уламжлал, төрт ёсны зан заншил, ахмадаа хүндэтгэх ёс, бөө мөргөл болон бурхны шашны олон зуун жилийн оюун санааны нандин өв соёл.',
        imageUrl:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200',
      },
      {
        id: 'culture',
        tabLabel: 'Соёл ба өв',
        category: 'Ахуй, Ёс заншил & Соёл',
        title: 'Соёл ба өв (Хөгжим, бүжиг, урлаг)',
        description:
          'ЮНЕСКО-гийн хүн төрөлхтний биет бус соёлын өвд бүртгэгдсэн Морин хуурын эгшиг, Уртын дуу, Хөөмэйн ид шид, цамын бүжиг болон үндэсний урлагийн гайхамшиг.',
        imageUrl:
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200',
      },
    ],
  },

  // 3. БАЙГАЛЬ & ӨНӨӨГИЙН ДҮР ТӨРХ
  nature_group: {
    title: 'Байгаль & Өнөөгийн дүр төрх',
    subtitle: 'Хязгааргүй онгон байгаль ба орчин цагийн шинэ хэмнэл',
    heroImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000',
    sections: [
      {
        id: 'food',
        tabLabel: 'Хоол, ундаа',
        category: 'Байгаль & Өнөөгийн дүр төрх',
        title: 'Монгол үндэсний зоог, идээ ундаа',
        description:
          'Байгалийн цэвэр бэлчээрийн органик мах, шим тэжээлт цагаан идээ, дэлхийд ганц айрагны амт. Дөрвөн улирлын онцлогт тохирсон монгол хоолны соёл таны аяллын амтыг хөглөнө.',
        imageUrl:
          'https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=1200',
      },
      {
        id: 'nature',
        tabLabel: 'Байгаль & Палеонтологи',
        category: 'Байгаль & Өнөөгийн дүр төрх',
        title: 'Байгаль, газарзүй, палеонтологи',
        description:
          'Алтай, Хангайн сүрлэг уулс, цэнгэг нуурууд болон үлэг гүрвэлийн өлгий болсон Говь цөл. Дэлхийн байгаль, геологийн хамгийн сонирхолтой тогтоцуудыг өөртөө агуулдаг.',
        imageUrl:
          'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200',
      },
      {
        id: 'modern',
        tabLabel: 'Өнөөгийн Монгол',
        category: 'Байгаль & Өнөөгийн дүр төрх',
        title: 'Өнөөгийн Монгол (Хотын амьдрал, залуусын соёл)',
        description:
          'Нүүдэлчин уламжлал ба орчин үеийн хөгжлийн гайхалтай зохицол. Улаанбаатар хотын кофе шопууд, загварын үзүүлбэр, залуусын арт галерей болон бүтээлч төслүүд.',
        imageUrl:
          'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1200',
      },
    ],
  },
};

// Slug-аас хамаарч аль бүлэг рүү хандахыг тодорхойлох зураглал
const SLUG_TO_GROUP: Record<string, string> = {
  // Ерөнхий нүүрнүүд
  'history-group': 'history_group',
  'culture-group': 'culture_group',
  'nature-group': 'nature_group',

  // Дэд сэдвүүд
  glance: 'history_group',
  history: 'history_group',
  people: 'history_group',
  'nomadic-life': 'culture_group',
  traditions: 'culture_group',
  culture: 'culture_group',
  food: 'nature_group',
  nature: 'nature_group',
  modern: 'nature_group',
};

export default function AboutShowcase({
  defaultSlug = 'glance',
}: {
  defaultSlug?: string;
}) {
  const currentGroupKey = SLUG_TO_GROUP[defaultSlug] || 'history_group';
  const currentGroup = ABOUT_GROUPS[currentGroupKey];

  const [activeTab, setActiveTab] = useState<string>(
    defaultSlug && currentGroup.sections.some((s) => s.id === defaultSlug)
      ? defaultSlug
      : currentGroup.sections[0].id
  );

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Хэрэв ерөнхий бүлгийн хуудас руу орвол хамгийн дээд хэсэгт байлгана
    if (defaultSlug && defaultSlug.endsWith('-group')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveTab(currentGroup.sections[0].id);
      return;
    }

    // Дэд сэдэв сонгосон үед тухайн сэдэв рүү гүйнэ
    if (
      defaultSlug &&
      currentGroup.sections.some((s) => s.id === defaultSlug)
    ) {
      setActiveTab(defaultSlug);
      setTimeout(() => {
        scrollToSection(defaultSlug);
      }, 100);
    }
  }, [defaultSlug]);

  return (
    <div className="w-full bg-white">
      {/* 1. ТОМ HERO ЗУРАГ БОЛОН ҮНДСЭН ГАРЧИГ */}
      <section className="flex overflow-hidden relative justify-center items-center w-full h-[55vh] min-h-[420px] max-h-[600px]">
        <Image
          src={currentGroup.heroImage}
          alt={currentGroup.title}
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.7]"
        />
        <div className="relative z-10 px-4 mx-auto max-w-4xl text-center">
          <span className="block mb-3 text-xs font-bold tracking-[0.25em] text-white/80 uppercase sm:text-sm">
            Монголын тухай
          </span>
          <h1 className="mb-4 font-sans text-4xl font-bold tracking-tight text-white drop-shadow-md sm:text-6xl md:text-7xl">
            {currentGroup.title}
          </h1>
          <p className="mx-auto max-w-2xl text-sm font-light text-white/90 drop-shadow-sm sm:text-lg">
            {currentGroup.subtitle}
          </p>
        </div>
      </section>

      {/* 2. ДЭЭД ХАНАНД НААЛДАЖ ҮЛДЭХ ТАБУУД (STICKY PILLS) */}
      <section className="sticky top-0 z-40 w-full bg-white/95 border-b border-neutral-200/80 backdrop-blur-md shadow-xs">
        <div className="flex overflow-x-auto gap-3 justify-center items-center p-4 mx-auto max-w-6xl sm:gap-4 scrollbar-none">
          {currentGroup.sections.map((sec) => {
            const isSelected = sec.id === activeTab;
            return (
              <button
                key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                className={`px-6 py-2.5 rounded-full text-sm sm:text-base font-medium transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'border-2 border-red-800 text-neutral-900 bg-white shadow-xs font-semibold'
                    : 'border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-black bg-white'
                }`}
              >
                {sec.tabLabel}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. БҮХ ДЭД ХЭСГҮҮД ДООШОО ЦУВРАН БАЙРЛАХ БҮТЭЦ */}
      <div className="py-16 px-6 mx-auto space-y-28 max-w-6xl sm:px-10">
        {currentGroup.sections.map((sec, index) => {
          const isImageLeft = index % 2 === 0;
          return (
            <section
              key={sec.id}
              id={sec.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-6 scroll-mt-24 ${
                isImageLeft ? '' : 'lg:grid-flow-dense'
              }`}
            >
              {/* Зураг */}
              <div
                className={`relative h-[360px] sm:h-[450px] w-full rounded-2xl overflow-hidden shadow-sm ${
                  isImageLeft ? '' : 'lg:col-start-2'
                }`}
              >
                <Image
                  src={sec.imageUrl}
                  alt={sec.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Мэдээлэл */}
              <div
                className={`flex flex-col justify-center max-w-lg ${
                  isImageLeft ? 'lg:pl-4' : 'lg:col-start-1 lg:pr-4'
                }`}
              >
                <span className="mb-3 text-xs font-bold tracking-wider text-emerald-700 uppercase">
                  {sec.category}
                </span>
                <h2 className="mb-6 text-3xl font-bold tracking-tight leading-tight text-neutral-900 sm:text-4xl">
                  {sec.title}
                </h2>
                <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                  {sec.description}
                </p>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

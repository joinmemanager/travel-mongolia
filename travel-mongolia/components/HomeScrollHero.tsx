'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import HeroText from './HeroText';
import HeroVideo from './HeroVideo';

// Нүүр хуудасны "гүйлгэхэд өгүүлдэг" hero. Дэлгэц дүүрэн хэсэг гүйлгэхэд наалдаж (sticky),
// 6 дүр зураг ээлжлэн солигдоно: зураг аажмаар томорч (Ken Burns), дараагийнх руу уусаж,
// текст доороос гарч ирнэ.
// - Эхний дүр зураг: одоогийн видео / poster ба H1 (HeroText), өөрчлөгдөөгүй.
// - Бусад зураг (public/home/*.webp) тухайн дүр зураг ойртоход л ачаалагдана.
// - Утас (767px хүртэл): энгийн уусалт, Ken Burns, текстийн хөдөлгөөнгүй.
// - "Reduce motion": хөдөлгөөн, уусалтгүй, шууд солигдоно.
// Зургийн эх сурвалж: docs/plan/images.md.

interface Scene {
  title?: string;
  text?: string;
  href: string;
  image?: { src: string; alt: string };
}

const SCENES: Scene[] = [
  // 1. Тал нутаг, адуу: одоогийн hero (видео, H1 "Монголд тавтай морил")
  { href: '/destination/region' },
  {
    title: 'Алтайн цаст оргилууд',
    text: 'Бүргэдчдийн нутаг Алтайн мөнх цаст уулсын дунд адал явдалт аялал хүлээж байна.',
    href: '/things-to-do/adventure',
    image: { src: '/home/altai-eagle.webp', alt: 'Цастай уулсын өмнө морьтой зогсох бүргэдчин' },
  },
  {
    title: 'Говийн элсэн манхан',
    text: 'Хоёр бөхт тэмээгээр говийн элсэн манхны дундуур аялаарай.',
    href: '/destination/region?region=gobi',
    image: { src: '/home/gobi-camels.webp', alt: 'Элсэн манхан дундуур алхаж буй хоёр бөхт тэмээнүүд' },
  },
  {
    title: 'Хөвсгөл нуур',
    text: 'Тайгын ойгоор хүрээлэгдсэн, Монголын хамгийн гүн нуурын тунгалаг усыг хараарай.',
    href: '/destination/khuvsgul-nuur',
    image: { src: '/home/khuvsgul.webp', alt: 'Ойт уулсаар хүрээлэгдсэн Хөвсгөл нуур дээгүүр явж буй завь' },
  },
  {
    title: 'Зуны нүүдэлчин ахуй',
    text: 'Малчин айлын гэрт хоноглож, уудам тал нутгийн зуныг мэдрээрэй.',
    href: '/about/nomadic-life',
    image: { src: '/home/ger-summer.webp', alt: 'Уулын бэлд, ногоон хөндийд байрлах монгол гэрүүд' },
  },
  {
    title: 'Өвлийн гэр',
    text: 'Цастай өвлийн нүүдэлчин амьдралыг нутгийн өрхүүдтэй хамт мэдрээрэй.',
    href: '/local',
    image: { src: '/home/ger-winter.webp', alt: 'Цасанд хучигдсан, хээтэй модон хаалгатай монгол гэр' },
  },
];

const N = SCENES.length;

export default function HomeScrollHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // Зургийг тухайн дүр зураг ойртоход л ачаална (идэвхтэй + дараагийнх)
  const [loaded, setLoaded] = useState<Set<number>>(() => new Set([0, 1]));
  const [small, setSmall] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mqSmall = window.matchMedia('(max-width: 767px)');
    const mqReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setSmall(mqSmall.matches);
      setReduced(mqReduced.matches);
    };
    update();
    mqSmall.addEventListener('change', update);
    mqReduced.addEventListener('change', update);
    return () => {
      mqSmall.removeEventListener('change', update);
      mqReduced.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
        const index = Math.min(N - 1, Math.floor(progress * (N - 1) + 0.5));
        setActive(index);
        setLoaded((prev) => {
          if (prev.has(index) && prev.has(Math.min(N - 1, index + 1))) return prev;
          const next = new Set(prev);
          next.add(index);
          next.add(Math.min(N - 1, index + 1));
          return next;
        });
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Дүр зураг руу үсрэх (баруун талын цэгүүд)
  const goTo = (i: number) => {
    const el = sectionRef.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: el.offsetTop + (total * i) / (N - 1),
      behavior: reduced ? 'auto' : 'smooth',
    });
  };

  const fade = reduced ? '' : 'transition-opacity duration-1000 ease-out';
  const kenBurns = !reduced && !small;

  return (
    <section
      ref={sectionRef}
      aria-label="Монголын дүр зургууд"
      className="relative w-full"
      // Дүр зураг бүрт утсан дээр 60vh, компьютер дээр 80vh гүйлгэлт
      style={{ height: `calc(100vh + ${(N - 1) * (small ? 60 : 80)}vh)` }}
    >
      <div className="overflow-hidden sticky top-0 w-full h-screen text-center">
        {/* Дэвсгэр зураг, видео */}
        {SCENES.map((scene, i) => (
          <div
            key={i}
            aria-hidden="true"
            className={`absolute inset-0 ${fade} ${i === active ? 'opacity-100' : 'opacity-0'}`}
          >
            {i === 0 ? (
              <HeroVideo className="object-cover absolute inset-0 w-full h-full" />
            ) : (
              loaded.has(i) &&
              scene.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={scene.image.src}
                  alt=""
                  decoding="async"
                  className="object-cover absolute inset-0 w-full h-full"
                  style={
                    kenBurns
                      ? {
                          transform: i === active ? 'scale(1.12)' : 'scale(1)',
                          transition: 'transform 12s linear',
                        }
                      : undefined
                  }
                />
              )
            )}
          </div>
        ))}

        {/* Дээгүүр нь уусах харанхуй бүрхүүл (өмнөхтэй ижил) */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Текстүүд: идэвхтэй нь доороос гарч ирнэ */}
        {SCENES.map((scene, i) => {
          const isActive = i === active;
          const motion = reduced
            ? ''
            : small
              ? 'transition-opacity duration-700'
              : 'transition-all duration-700 ease-out';
          const offset = reduced || small || isActive ? 'translate-y-0' : 'translate-y-10';
          return (
            <div
              key={i}
              aria-hidden={!isActive}
              className={`flex absolute inset-0 justify-center items-center px-6 ${motion} ${offset} ${
                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="relative z-10 text-white">
                {i === 0 ? (
                  <HeroText />
                ) : (
                  <div className="px-6 mx-auto max-w-3xl">
                    {scene.image && <span className="sr-only">{scene.image.alt}</span>}
                    <p className="mb-4 text-3xl font-black tracking-tight drop-shadow-xl sm:text-6xl">{scene.title}</p>
                    <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-white/95 drop-shadow sm:text-xl">
                      {scene.text}
                    </p>
                  </div>
                )}
                <Link
                  href={scene.href}
                  tabIndex={isActive ? 0 : -1}
                  className="inline-flex gap-2 items-center py-3 px-6 mt-8 text-sm font-bold text-white rounded-full border backdrop-blur-sm transition-colors bg-white/10 border-white/40 hover:bg-white hover:text-neutral-900"
                >
                  Дэлгэрэнгүй
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          );
        })}

        {/* Дүр зургийн цэгүүд */}
        <nav aria-label="Дүр зургууд" className="flex absolute right-4 top-1/2 z-20 flex-col gap-3 -translate-y-1/2 sm:right-8">
          {SCENES.map((scene, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={scene.title || 'Монголд тавтай морил'}
              aria-current={i === active ? 'true' : undefined}
              className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                i === active ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </nav>
      </div>
    </section>
  );
}

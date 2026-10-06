import Image from 'next/image';
import React from 'react';

// Hero-ийн 3 хувилбарын нэг (docs/plan/templates.md):
//   1. Нүүр хуудасны hero (app/page.tsx, өөрчлөхгүй)
//   2. Зурагтай толгой: энэ компонент (about, things-to-do, газрын ангилал, газрын дэлгэрэнгүй)
//   3. Текст толгой: components/HubHeader.tsx (hub, гарын авлага)
export default function ImageHero({
  image,
  kicker,
  title,
  intro,
  children,
}: {
  image: { src: string; alt: string };
  kicker?: string;
  title: string;
  intro?: React.ReactNode;
  // Гарчгийн доор харуулах нэмэлт (шошго, товч г.м.)
  children?: React.ReactNode;
}) {
  return (
    <section className="flex overflow-hidden relative justify-center items-center w-full h-[55vh] min-h-[420px]">
      {image.src && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover brightness-[0.5]"
        />
      )}
      <div className="relative z-10 px-6 mx-auto max-w-4xl text-center">
        {kicker && (
          <span className="block mb-3 text-xs font-black tracking-[0.3em] text-emerald-400 uppercase sm:text-sm">
            {kicker}
          </span>
        )}
        <h1 className="mb-4 text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md sm:text-6xl">
          {title}
        </h1>
        {intro && (
          <p className="mx-auto max-w-2xl text-base font-normal leading-relaxed sm:text-lg text-white/90">
            {intro}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

'use client';

import Image, { type ImageLoader } from 'next/image';
import React from 'react';

import ImageCreditLine from '@/components/ImageCreditLine';
import type { ImageCredit } from '@/lib/imageCredit';
import { cdnImage, isCdnImage } from '@/lib/imageUrl';

// Unsplash, Contentful зургийг тэдний CDN-ээс дэлгэцийн өргөнд тохируулан (WebP/AVIF) авна.
// Сайтын өөрийн зураг (/hero.jpg г.м.) Next.js-ийн оновчлолоор дамжина.
const cdnLoader: ImageLoader = ({ src, width, quality }) => cdnImage(src, width, quality || 65);

// Hero-ийн 3 хувилбарын нэг (docs/plan/templates.md):
//   1. Нүүр хуудасны hero (app/page.tsx, өөрчлөхгүй)
//   2. Зурагтай толгой: энэ компонент (about, things-to-do, газрын ангилал, газрын дэлгэрэнгүй)
//   3. Текст толгой: components/HubHeader.tsx (hub, гарын авлага)
export default function ImageHero({
  image,
  kicker,
  title,
  intro,
  topLeft,
  children,
  titleAs: TitleTag = 'h1',
  compact = false,
  badge,
}: {
  // credit: Contentful asset-ийн зохиогч (lib/imageCredit.ts), зургийн баруун доод буланд
  image: { src: string; alt: string; credit?: ImageCredit };
  kicker?: string;
  title: string;
  intro?: React.ReactNode;
  // Зургийн зүүн дээд буланд (буцах холбоос г.м.)
  topLeft?: React.ReactNode;
  // Гарчгийн доор харуулах нэмэлт (шошго, товч г.м.)
  children?: React.ReactNode;
  // Гарчгийн tag: хуудас бүрт нэг H1 байх тул хэсгийн дэд хуудсанд 'p' (components/section/SectionHero.tsx)
  titleAs?: 'h1' | 'p';
  // Намхан толгой (≈48vh): доор нь мэдээллийн тууз байх хуудсанд (аймгийн хуудас)
  compact?: boolean;
  // Гарчгийн дээрх жижиг тэмдэг (аймгийн сүлд г.м.)
  badge?: React.ReactNode;
}) {
  return (
    <section
      className={`flex relative justify-center items-center w-full ${compact ? 'h-[48vh] min-h-[360px]' : 'h-[55vh] min-h-[420px]'}`}
    >
      {image.src && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          loader={isCdnImage(image.src) ? cdnLoader : undefined}
          sizes="100vw"
          className="object-cover brightness-[0.5]"
        />
      )}
      {topLeft && (
        <div className={`absolute z-20 sm:left-12 lg:left-16 ${compact ? 'top-[4.5rem] left-4 sm:top-6' : 'top-28 left-6'}`}>
          {topLeft}
        </div>
      )}
      <div className="relative z-10 px-6 mx-auto max-w-4xl text-center">
        {badge}
        {kicker && (
          <span className="block mb-3 text-xs font-black tracking-[0.3em] text-emerald-400 uppercase sm:text-sm">
            {kicker}
          </span>
        )}
        <TitleTag className="mb-4 text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md sm:text-6xl">
          {title}
        </TitleTag>
        {intro && (
          <p className="mx-auto max-w-2xl text-base font-normal leading-relaxed sm:text-lg text-white/90">
            {intro}
          </p>
        )}
        {children}
      </div>
      {image.credit && (
        <ImageCreditLine
          credit={image.credit}
          className="absolute right-3 bottom-2 z-20 max-w-[80%] text-right text-[11px] leading-tight text-white/70 drop-shadow"
        />
      )}
    </section>
  );
}

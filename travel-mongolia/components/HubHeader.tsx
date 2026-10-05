import Image from 'next/image';
import React from 'react';

import type { SiteImage } from '@/lib/images';

import Breadcrumbs, { type Crumb } from './Breadcrumbs';

// "Монгол сэтгүүл" толгой хэсэг (docs/plan/design-brief.md):
//   image өгвөл: дэлгэц дүүрэн зураг, доод талдаа зөөлөн бараан градиент, цагаан serif гарчиг
//   image-гүй бол: цөцгий дэвсгэр, бэхэн serif гарчиг
// Аль алинд нь жижиг, зайтай eyebrow шошго гарчгийн дээр.
export default function HubHeader({
  crumbs,
  kicker,
  kickerEn,
  title,
  intro,
  image,
  children,
}: {
  crumbs: Crumb[];
  kicker: string;
  kickerEn: string;
  title: string;
  intro: string;
  image?: SiteImage;
  children?: React.ReactNode;
}) {
  if (image) {
    return (
      <header className="flex overflow-hidden relative items-end w-full min-h-[78vh] bg-night">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Доод талын зөөлөн бараан градиент: цагаан текст уншигдахуйц */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/10"
        />
        <div className="relative px-6 pt-32 pb-14 mx-auto w-full max-w-[1200px] sm:px-10">
          <Breadcrumbs items={crumbs} tone="dark" />
          <p className="mb-4 text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
            {kicker} <span aria-hidden="true">·</span> {kickerEn}
          </p>
          <h1 className="mb-5 max-w-3xl font-serif text-4xl font-bold leading-[1.1] text-white sm:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">{intro}</p>
          {children}
        </div>
      </header>
    );
  }

  return (
    <header className="px-6 pt-14 pb-14 bg-cream border-b border-ink/10 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Breadcrumbs items={crumbs} />
        <p className="mb-4 text-[11px] font-semibold tracking-[0.25em] text-gold-ink uppercase">
          {kicker} <span aria-hidden="true">·</span> {kickerEn}
        </p>
        <h1 className="mb-5 max-w-3xl font-serif text-4xl font-bold leading-[1.1] text-ink sm:text-6xl">
          {title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">{intro}</p>
        {children}
      </div>
    </header>
  );
}

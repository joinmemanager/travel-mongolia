import Image from 'next/image';
import React from 'react';

import Breadcrumbs, { type Crumb } from './Breadcrumbs';

// Hub болон гарын авлагын хуудсуудын толгой хэсэг: замчлал, ногоон шошго (eyebrow), H1.
// Зурагтай бол бараан ногоон overlay, зураггүй бол зөөлөн ногоон градиент дэвсгэр.
export default function HubHeader({
  crumbs,
  kicker,
  kickerEn,
  title,
  intro,
  imageUrl,
  children,
}: {
  crumbs: Crumb[];
  kicker: string;
  kickerEn: string;
  title: string;
  intro: string;
  imageUrl?: string;
  children?: React.ReactNode;
}) {
  const hasImage = Boolean(imageUrl);

  return (
    <header
      className={`relative overflow-hidden px-6 pt-12 pb-14 sm:px-12 lg:px-16 border-b ${
        hasImage
          ? 'border-brand-900 bg-brand-950'
          : 'border-brand-100 bg-gradient-to-br from-brand-100 via-brand-50 to-white'
      }`}
    >
      {hasImage && (
        <>
          <Image src={imageUrl!} alt="" fill priority unoptimized className="object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-brand-950/75" />
        </>
      )}

      <div className="relative max-w-7xl mx-auto">
        <Breadcrumbs items={crumbs} tone={hasImage ? 'dark' : 'light'} />

        {/* Ногоон шошго (eyebrow) */}
        <span
          className={`inline-flex gap-2 items-center mb-4 py-1 px-3 text-[11px] font-bold tracking-[0.2em] uppercase rounded-full ${
            hasImage ? 'text-brand-100 bg-brand-800/80' : 'text-brand-800 bg-brand-100'
          }`}
        >
          {kicker}
          <span aria-hidden="true" className={hasImage ? 'text-brand-400' : 'text-brand-400'}>•</span>
          <span className="font-semibold tracking-wider">{kickerEn}</span>
        </span>

        <h1
          className={`text-3xl sm:text-5xl font-black tracking-tight mb-4 ${
            hasImage ? 'text-white' : 'text-brand-950'
          }`}
        >
          {title}
        </h1>
        <p
          className={`text-sm sm:text-base max-w-2xl leading-relaxed ${
            hasImage ? 'text-brand-50' : 'text-neutral-700'
          }`}
        >
          {intro}
        </p>
        {children}
      </div>
    </header>
  );
}

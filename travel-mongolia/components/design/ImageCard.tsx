import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { SiteImage } from '@/lib/images';

import { GOLD_TEXT } from './tokens';

// б. Зурагтай карт: зурган дээрээ бараан градиенттэй, цагаан гарчигтай.
// Зураггүй бол бараан дэвсгэр дээр ижил байдлаар харагдана.
// href байхгүй бол (дэлгэрэнгүй хуудасгүй жагсаалтын карт) холбоосгүй харагдана.
export default function ImageCard({
  href,
  image,
  title,
  desc,
  eyebrow,
  badges,
  cta,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
}: {
  href?: string;
  image?: SiteImage;
  title: string;
  desc?: string;
  eyebrow?: string;
  // Зургийн зүүн дээд буланд харагдах шошгууд (ангилал, улирал г.м.)
  badges?: string[];
  // Картын доод мөрийн текст (жишээ нь "Дэлгэрэнгүй үзэх")
  cta?: string;
  aspect?: string;
  sizes?: string;
}) {
  const className = `group block overflow-hidden relative h-full rounded-3xl bg-neutral-900 shadow-sm ${aspect}`;
  const content = (
    <>
      {image && (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
      />
      {badges && badges.length > 0 && (
        <div className="flex absolute top-3 left-3 flex-wrap gap-1.5">
          {badges.filter(Boolean).map((badge, i) => (
            <span
              key={`${i}-${badge}`}
              className="py-1 px-2.5 text-[11px] font-semibold rounded-full backdrop-blur-md bg-white/90 text-neutral-800"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-6">
        {eyebrow && (
          <span className={`block mb-2 text-[10px] font-bold tracking-widest uppercase ${GOLD_TEXT}`}>
            {eyebrow}
          </span>
        )}
        <h3 className="mb-1 text-xl font-bold leading-snug text-white">{title}</h3>
        {desc && <p className="text-sm leading-relaxed text-white/85 line-clamp-2">{desc}</p>}
        {cta && (
          <span className="inline-flex gap-1 items-center mt-3 text-xs font-semibold text-white transition-transform group-hover:translate-x-1">
            {cta} <span aria-hidden="true">→</span>
          </span>
        )}
      </div>
    </>
  );

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}

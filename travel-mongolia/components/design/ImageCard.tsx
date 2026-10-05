import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { SiteImage } from '@/lib/images';

import { GOLD_TEXT } from './tokens';

// б. Зурагтай карт: зурган дээрээ бараан градиенттэй, цагаан гарчигтай.
// Зураггүй бол бараан дэвсгэр дээр ижил байдлаар харагдана.
export default function ImageCard({
  href,
  image,
  title,
  desc,
  eyebrow,
  aspect = 'aspect-[4/3]',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px',
}: {
  href: string;
  image?: SiteImage;
  title: string;
  desc?: string;
  eyebrow?: string;
  aspect?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={href}
      className={`group block overflow-hidden relative h-full rounded-3xl bg-neutral-900 shadow-sm ${aspect}`}
    >
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
      <div className="absolute inset-x-0 bottom-0 p-6">
        {eyebrow && (
          <span className={`block mb-2 text-[10px] font-bold tracking-widest uppercase ${GOLD_TEXT}`}>
            {eyebrow}
          </span>
        )}
        <h3 className="mb-1 text-xl font-bold leading-snug text-white">{title}</h3>
        {desc && <p className="text-sm leading-relaxed text-white/85 line-clamp-2">{desc}</p>}
      </div>
    </Link>
  );
}

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import ImageHero from '@/components/templates/ImageHero';

// Хэсгийн hero. Гарчиг (хэсгийн нэр) нь үндсэн хаяг дээр H1, дэд хуудсанд энгийн том бичиг:
// дэд хуудасны H1 нь баруун талын агуулгын эхэнд (SectionPageHeader).
export default function SectionHero({
  baseHref,
  image,
  kicker,
  title,
  intro,
}: {
  baseHref: string;
  image: { src: string; alt: string };
  kicker: string;
  title: string;
  intro: string;
}) {
  const pathname = usePathname();
  return (
    <ImageHero
      image={image}
      kicker={kicker}
      title={title}
      intro={intro}
      titleAs={pathname === baseHref ? 'h1' : 'p'}
    />
  );
}

import Link from 'next/link';
import React from 'react';

import { ContentContext, type ContentContextValue } from '@/components/Analytics';
import ImageCard from '@/components/design/ImageCard';
import LinkCard, { type LinkCardItem } from '@/components/design/LinkCard';
import type { PlaceCardData } from '@/lib/places';

import ImageHero from './ImageHero';

// "Газрын дэлгэрэнгүй" загвар (docs/plan/templates.md): /destination/[id],
// /destination/heritage/place/[id], /province/[id].
// Зурагтай толгой → (наалддаг цэс) → агуулга + (баруун талд газрын зураг, цаг агаар)
// → "Ойролцоох газрууд" зурагтай картууд → "Холбогдох хуудсууд" холбоосны карт.
export default function PlaceTemplate({
  image,
  title,
  subtitle,
  back,
  jsonLd,
  nav,
  aside,
  nearby,
  bookings,
  analytics,
  links,
  children,
}: {
  image: { src: string; alt: string };
  title: string;
  subtitle?: string;
  back: { href: string; label: string };
  // Google-д зориулсан бүтэцтэй өгөгдөл (schema.org)
  jsonLd?: object;
  // Наалддаг цэс: хуудасны хэсгүүд рүү үсрэх холбоосууд
  nav?: { id: string; label: string }[];
  // Баруун талын багана (газрын зураг, цаг агаар г.м.)
  aside?: React.ReactNode;
  // Ойролцоох (эсвэл бусад) газрууд. Хоосон бол хэсэг харагдахгүй
  nearby?: { title: string; places: PlaceCardData[] };
  // "Холбоотой аялал, туршлага, үйлчилгээ" (components/templates/RelatedBookings)
  bookings?: React.ReactNode;
  // GA4: content_id, content_type, province (components/Analytics.tsx)
  analytics?: ContentContextValue;
  links: LinkCardItem[];
  children: React.ReactNode;
}) {
  return (
    <main className="w-full min-h-screen bg-white text-neutral-900 pb-28 font-sans">
      {analytics && <ContentContext value={analytics} />}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <ImageHero
        image={image}
        title={title}
        intro={subtitle}
        topLeft={
          <Link
            href={back.href}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all text-xs sm:text-sm font-medium"
          >
            <span aria-hidden="true">←</span>
            <span>{back.label}</span>
          </Link>
        }
      />

      {nav && nav.length > 0 && (
        <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
          <div className="max-w-5xl mx-auto px-6 flex items-center justify-start sm:justify-center gap-8 sm:gap-14 overflow-x-auto py-5 text-base sm:text-lg font-normal tracking-tight text-neutral-600 no-scrollbar">
            {nav.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="hover:text-black transition-colors whitespace-nowrap font-medium">
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div
        className={`mx-auto px-6 sm:px-10 mt-14 ${
          aside ? 'max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-12' : 'max-w-4xl'
        }`}
      >
        <div className={aside ? 'lg:col-span-2' : ''}>{children}</div>
        {aside && <div className="space-y-8">{aside}</div>}
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-20 space-y-12">
        {bookings}
        {nearby && nearby.places.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">{nearby.title}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.places.map((place) => (
                <ImageCard
                  key={place.id}
                  href={place.href}
                  image={place.image}
                  title={place.title}
                  eyebrow={place.region}
                />
              ))}
            </div>
          </section>
        )}

        <LinkCard title="Холбогдох хуудсууд" links={links} columns={3} />
      </div>
    </main>
  );
}

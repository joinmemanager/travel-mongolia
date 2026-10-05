'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IMAGES } from '@/lib/images';

interface Props {
  items: any[];
}

export default function SeasonRecommendations({ items }: Props) {
  if (!items || items.length === 0) return null;

  // Дээд талын том карт (isFeatured: true эсвэл хамгийн эхнийх)
  const featuredItem = items.find((i) => i.fields?.isFeatured) || items[0];
  // Доод талын 3 карт
  const subItems = items
    .filter((i) => i.sys.id !== featuredItem?.sys.id)
    .slice(0, 3);

  const getImageUrl = (item: any) => {
    const img = item?.fields?.image || item?.fields?.coverImage;
    const url = img?.fields?.file?.url;
    if (!url)
      return IMAGES.gerCamp.src;
    return url.startsWith('//') ? `https:${url}` : url;
  };

  return (
    <section className="py-20 bg-white border-t border-neutral-100">
      <div className="px-6 mx-auto max-w-7xl sm:px-10 lg:px-16">
        {/* ДЭЭД ЭГНЭЭ */}
        <div className="grid grid-cols-1 gap-8 items-stretch mb-8 lg:grid-cols-12">
          {/* Зүүн гарчиг */}
          <div className="flex flex-col justify-start pt-2 lg:col-span-4">
            <span className="block mb-3 text-[11px] font-semibold tracking-[0.25em] text-gold-ink uppercase">
              RECOMMENDATIONS
            </span>
            <h2 className="text-3xl font-serif font-bold leading-[1.2] text-ink sm:text-4xl">
              Зуны улирлын <br /> зөвлөмж
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-600">
              Монгол орны хамгийн үзэсгэлэнт улиралд үзэх боломжтой онцлох
              маршрут, байгалийн тогтоцууд.
            </p>
          </div>

          {/* Баруун талын ТОМ карт */}
          {featuredItem && (
            <div className="lg:col-span-8">
              <Link
                href={`/recommendation/${featuredItem.sys.id}`}
                className="group block overflow-hidden relative w-full h-[280px] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer sm:h-[340px]"
              >
                <Image
                  src={getImageUrl(featuredItem)}
                  alt={featuredItem.fields?.title || 'Recommendation'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute inset-x-6 bottom-6 sm:bottom-8 sm:left-8">
                  <h3 className="font-serif max-w-xl text-xl font-bold tracking-tight text-white drop-shadow-md sm:text-3xl">
                    {featuredItem.fields?.title}
                  </h3>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* ДООД ЭГНЭЭ: 3 жижиг карт */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {subItems.map((item) => (
            <Link
              key={item.sys.id}
              href={`/recommendation/${item.sys.id}`}
              className="group block overflow-hidden relative w-full h-[260px] rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer sm:h-[300px]"
            >
              <Image
                src={getImageUrl(item)}
                alt={item.fields?.title || 'Recommendation'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute inset-x-6 bottom-6">
                <h4 className="text-lg font-bold tracking-tight text-white drop-shadow-md sm:text-xl">
                  {item.fields?.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  items: any[];
}

export default function SeasonRecommendations({ items }: Props) {
  if (!items || items.length === 0) return null;

  // Дээд талын том карт (isFeatured: true эсвэл хамгийн эхнийх)
  const featuredItem = items.find((i) => i.fields?.isFeatured) || items[0];
  // Доод талын 3 карт
  const subItems = items.filter((i) => i.sys.id !== featuredItem?.sys.id).slice(0, 3);

  const getImageUrl = (item: any) => {
    const img = item?.fields?.image || item?.fields?.coverImage;
    const url = img?.fields?.file?.url;
    if (!url) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200';
    return url.startsWith('//') ? `https:${url}` : url;
  };

  return (
    <section className="py-20 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        
        {/* ДЭЭД ЭГНЭЭ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-8">
          
          {/* Зүүн гарчиг */}
          <div className="lg:col-span-4 flex flex-col justify-start pt-2">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#15803d] block mb-3">
              RECOMMENDATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-normal leading-[1.2]">
              Зуны улирлын <br /> зөвлөмж
            </h2>
            <p className="mt-4 text-neutral-600 text-sm leading-relaxed max-w-sm">
              Монгол орны хамгийн үзэсгэлэнт улиралд үзэх боломжтой онцлох маршрут, байгалийн тогтоцууд.
            </p>
          </div>

          {/* Баруун талын ТОМ карт */}
          {featuredItem && (
            <div className="lg:col-span-8">
              <Link
                href={`/recommendation/${featuredItem.sys.id}`}
                className="relative block w-full h-[280px] sm:h-[340px] rounded-3xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <Image
                  src={getImageUrl(featuredItem)}
                  alt={featuredItem.fields?.title || 'Recommendation'}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8">
                  <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight drop-shadow-md max-w-xl">
                    {featuredItem.fields?.title}
                  </h3>
                </div>
              </Link>
            </div>
          )}

        </div>

        {/* ДООД ЭГНЭЭ: 3 жижиг карт */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subItems.map((item) => (
            <Link
              key={item.sys.id}
              href={`/recommendation/${item.sys.id}`}
              className="relative block w-full h-[260px] sm:h-[300px] rounded-3xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Image
                src={getImageUrl(item)}
                alt={item.fields?.title || 'Recommendation'}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-md">
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
import Link from 'next/link';
import React from 'react';

import { liveHref } from '@/lib/navigation';

export interface TopicItem {
  title: string;
  desc: string;
  // Зураг. Хоосон бол зураггүй карт (Монголынх нь шалгагдаагүй зургийг хассан, docs/section-layout/images.md)
  thumb?: string;
  // Тухайн сэдвийн тусдаа хуудас. Байвал карт бүхэлдээ холбоос болж «Дэлгэрэнгүй →» гарна.
  // Хуудасгүй картууд: docs/section-layout/cards-without-pages.md
  href?: string;
}

export interface TopicSection {
  id: string;
  title: string;
  desc: string;
  // Хэсгийн «Дэлгэрэнгүй» товч (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  imageUrl?: string;
  items: TopicItem[];
}

const ArrowIcon = ({ className }: { className: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

function TopicCard({ item }: { item: TopicItem }) {
  const href = liveHref(item.href);
  const body = (
    <>
      {item.thumb && (
        <div className="relative w-full h-48 sm:h-52 overflow-hidden">
          <img
            loading="lazy"
            decoding="async"
            src={item.thumb}
            alt={item.title}
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-6 flex-1 flex flex-col space-y-2">
        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 group-hover/card:text-[#15803d] transition-colors leading-snug">
          {item.title}
        </h3>
        <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">{item.desc}</p>
        {href && (
          <span className="mt-auto pt-3">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#15803d] text-white text-sm sm:text-base font-bold shadow-sm group-hover/card:bg-emerald-800 transition-colors">
              Дэлгэрэнгүй
              <ArrowIcon className="w-4 h-4 transition-transform group-hover/card:translate-x-1" />
            </span>
          </span>
        )}
      </div>
    </>
  );
  const className =
    'group/card bg-white rounded-3xl overflow-hidden border border-neutral-200/80 shadow-xs transition-all duration-300 flex flex-col';
  return href ? (
    <Link href={href} className={`${className} hover:shadow-md hover:border-[#15803d]/60`}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

// /about/* хуудсуудын нийтлэг хэсгүүд: зүүн талд текст, баруун талд зураг, доор нь 3 карт.
// <section id data-toc> нь хэсгийн жагсаалтад (components/section/SectionSidebar) anchor болж орно.
export default function TopicSections({ sections }: { sections: TopicSection[] }) {
  return (
    <div className="space-y-28">
      {sections.map((sec) => {
        const more = liveHref(sec.moreHref);
        return (
          <section
            key={sec.id}
            id={sec.id}
            data-toc={sec.title}
            className="scroll-mt-[calc(var(--nav-h)+5rem)] lg:scroll-mt-[calc(var(--nav-h)+1.5rem)] space-y-10"
          >
            <div className={`grid grid-cols-1 gap-8 items-center ${sec.imageUrl ? 'xl:grid-cols-12 xl:gap-12' : ''}`}>
              <div className={`space-y-5 ${sec.imageUrl ? 'xl:col-span-6' : 'max-w-3xl'}`}>
                <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight leading-tight">
                  {sec.title}
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 font-normal leading-relaxed">{sec.desc}</p>
                {more && (
                  <div className="pt-2">
                    <Link
                      href={more}
                      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#15803d] text-white hover:bg-emerald-800 transition-all font-bold text-sm sm:text-base shadow-sm hover:shadow-md group/btn"
                    >
                      <span>Дэлгэрэнгүй</span>
                      <ArrowIcon className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>

              {sec.imageUrl && (
                <div className="xl:col-span-6 relative w-full h-64 sm:h-80 xl:h-[340px] rounded-3xl overflow-hidden shadow-md group border border-emerald-100">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={sec.imageUrl}
                    alt={sec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {sec.items.map((item) => (
                <TopicCard key={item.title} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

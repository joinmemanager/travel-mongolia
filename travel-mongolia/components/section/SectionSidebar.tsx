'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

import type { SectionRow } from '@/lib/sections';

// Хэсгийн «Сэдвийн жагсаалт» (components/GuidePage.tsx-ийн жагсаалттай ижил харагдана).
// Компьютер (lg+): зүүн талд наалддаг цагаан карт. Утас: hero-гийн доор, дээд цэсний доор наалддаг
// хэвтээ гүйдэг товчнууд. Мөр бүр тусдаа хаяг тул <Link>: хуудас бүтнээр ачаалагдахгүй.
// scroll={false}: агуулгын эхэнд гүйлгэхийг SectionPageHeader хийнэ (H1 нь layout-д байдаг).
export default function SectionSidebar({ rows }: { rows: SectionRow[] }) {
  const pathname = usePathname();
  const chipsRef = useRef<HTMLDivElement>(null);
  const isActive = (row: SectionRow) => row.href === pathname;

  // Утсан дээр идэвхтэй товчийг харагдах хэсэгт гүйлгэнэ (зөвхөн хэвтээ чиглэлд)
  useEffect(() => {
    const box = chipsRef.current;
    const chip = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!box || !chip) return;
    box.scrollTo({ left: chip.offsetLeft - (box.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
  }, [pathname]);

  return (
    <>
      {/* Утас: наалддаг хэвтээ товчнууд */}
      <nav
        aria-label="Сэдвийн жагсаалт"
        className="lg:hidden sticky top-(--nav-h) z-30 -mx-6 sm:-mx-10 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs"
      >
        <div
          ref={chipsRef}
          className="flex gap-2 px-6 sm:px-10 py-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {rows.map((row) => (
            <Link
              key={row.href}
              href={row.href}
              scroll={false}
              aria-current={isActive(row) ? 'page' : undefined}
              className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors ${
                isActive(row)
                  ? 'bg-[#15803d] text-white'
                  : 'bg-emerald-50/70 border border-emerald-100 text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              {row.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Компьютер: зүүн талын карт */}
      <aside className="hidden lg:block w-64 shrink-0 sticky top-[calc(var(--nav-h)+1.5rem)] space-y-2 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
        <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 px-2">
          Сэдвийн жагсаалт
        </span>
        <nav aria-label="Сэдвийн жагсаалт" className="space-y-1">
          {rows.map((row) => (
            <Link
              key={row.href}
              href={row.href}
              scroll={false}
              aria-current={isActive(row) ? 'page' : undefined}
              className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive(row)
                  ? 'bg-[#15803d]/10 text-[#15803d] font-bold'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`}
            >
              {row.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

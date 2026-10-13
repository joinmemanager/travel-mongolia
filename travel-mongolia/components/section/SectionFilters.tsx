'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

// Хэсгийн хуудасны шүүлтүүр (?cat=, ?style= г.м.). Хуудас (CategoryListing, InspirationListing)
// ангиллуудаа энд бүртгэнэ, зүүн талын «Сэдвийн жагсаалт» (SectionSidebar) тэдгээрийг идэвхтэй мөрийн
// доор харуулна. Сонгосон ангилал URL-ийн параметрт хадгалагдана: хуучин ?cat= холбоосууд ажиллана,
// canonical нь query-гүй хэвээр (lib/pageMeta.ts).

export interface FilterOption {
  id: string;
  label: string;
}

export interface SectionFilterSet {
  // URL параметрийн нэр (cat, style, list)
  param: string;
  // «Бүгд»-ээс бусад ангиллууд
  options: FilterOption[];
  // Идэвхтэй ангилал ('all' = Бүгд). Хуудас URL-аас уншиж дамжуулна: жагсаалт (layout) useSearchParams
  // дуудвал статик хуудсуудын prerender эвдэрнэ.
  active?: string;
}

const Ctx = createContext<{
  filters: SectionFilterSet | null;
  setFilters: (f: SectionFilterSet | null) => void;
}>({ filters: null, setFilters: () => {} });

export function SectionFiltersProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<SectionFilterSet | null>(null);
  return <Ctx.Provider value={{ filters, setFilters }}>{children}</Ctx.Provider>;
}

export function useSectionFilters() {
  return useContext(Ctx).filters;
}

// Хуудаснаас: ангиллуудаа жагсаалтад бүртгэнэ (хуудаснаас гарахад арилна)
export function useRegisterSectionFilters(set: SectionFilterSet | null) {
  const { setFilters } = useContext(Ctx);
  const key = set ? `${set.param}:${set.active}:${set.options.map((o) => `${o.id}=${o.label}`).join('|')}` : '';
  useEffect(() => {
    setFilters(set);
    return () => setFilters(null);
    // key нь set-ийн агуулга: өөрчлөгдсөн үед л дахин бүртгэнэ
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, setFilters]);
}

// Хуудаснаас: идэвхтэй ангилал = URL-ийн параметр, мэдэгдэхгүй утга бол 'all'
export function useActiveFilter(set: SectionFilterSet | null): string {
  const searchParams = useSearchParams();
  const value = set ? searchParams.get(set.param) : null;
  return value && set?.options.some((o) => o.id === value) ? value : 'all';
}

// Ангилал сонгох: хуудсыг дахин ачаалахгүй, server рүү хүсэлт явуулахгүйгээр URL-ийг солино
// (Next.js-ийн replaceState нь useSearchParams-тай синк хийгддэг)
export function useSelectFilter() {
  const pathname = usePathname();
  return useCallback(
    (param: string, id: string) => {
      const params = new URLSearchParams(window.location.search);
      if (id === 'all') params.delete(param);
      else params.set(param, id);
      const query = params.toString();
      window.history.replaceState(null, '', `${pathname}${query ? `?${query}` : ''}`);
      // Агуулгын эхлэл дээд цэсний ард орсон бол түүн рүү гүйлгэнэ (жагсаалт богиносож болно)
      const top = document.getElementById('section-top');
      if (top && top.getBoundingClientRect().top < 100) top.scrollIntoView({ behavior: 'smooth' });
    },
    [pathname]
  );
}

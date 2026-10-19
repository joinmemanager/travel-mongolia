'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { activeRow, type SectionRow } from '@/lib/sections';

import { useSectionFilters, useSelectFilter } from './SectionFilters';

interface Anchor {
  id: string;
  label: string;
}

// Агуулгын доторх хэсгүүд: [data-toc] эсвэл id-тай <section>. Нэр нь data-toc, үгүй бол эхний гарчиг.
// Өөр олдсон хэсгийн дотор байгааг (дэд хэсэг) алгасна.
function findAnchors(root: HTMLElement): Anchor[] {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-toc][id], section[id]'));
  return nodes
    .filter((el) => !nodes.some((other) => other !== el && other.contains(el)))
    .map((el) => ({
      id: el.id,
      label: (el.dataset.toc || el.querySelector('h2, h3')?.textContent || '').trim(),
    }))
    .filter((a) => a.label);
}

// Хэсгийн «Сэдвийн жагсаалт» (components/GuidePage.tsx-ийн жагсаалттай ижил харагдана).
// Компьютер (lg+): зүүн талд наалддаг цагаан карт. Идэвхтэй мөрийн доор догол мөрөөр:
//   - хуудас шүүлтүүртэй бол (CategoryListing, InspirationListing → SectionFilters) ангиллууд:
//     дарахад тухайн ангиллын картууд л харагдана, эх мөр дээр дарахад «Бүгд»;
//   - үгүй бол хуудасны доторх хэсгүүд (anchor), гүйлгэхэд идэвхтэй нь тодорно.
// Утас: hero-гийн доор, дээд цэсний доор наалддаг хэвтээ товчнууд (мөрүүд, ганц хуудастай хэсэгт
// anchor-ууд), шүүлтүүртэй хуудсанд доор нь хоёр дахь мөрөөр ангиллууд.
// Мөр бүр тусдаа хаяг тул <Link>: хуудас бүтнээр ачаалагдахгүй.
// scroll={false}: агуулгын эхэнд гүйлгэхийг SectionPageHeader хийнэ (H1 нь layout-д байдаг).
export default function SectionSidebar({ rows, contentId }: { rows: SectionRow[]; contentId: string }) {
  const pathname = usePathname();
  const chipsRef = useRef<HTMLDivElement>(null);
  const filterChipsRef = useRef<HTMLDivElement>(null);
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [activeAnchor, setActiveAnchor] = useState<string>('');
  const filters = useSectionFilters();
  const activeFilter = filters?.active || 'all';
  const selectFilter = useSelectFilter();
  const active = activeRow(rows, pathname).row;
  const isActive = (row: SectionRow) => row === active;
  // Шүүлтүүр, anchor хоёулаа байвал шүүлтүүрийг нь харуулна (давхардуулахгүй)
  const showAnchors = !filters && anchors.length > 0;
  // Ганц хуудастай хэсэгт утасны товчнууд нь хуудасны доторх хэсгүүд
  const anchorChips = rows.length === 1 && showAnchors;

  // Хуудас солигдох бүрт доторх хэсгүүдийг дахин уншина (async хуудас хожуу ирж болох тул ажиглана)
  useEffect(() => {
    const root = document.getElementById(contentId);
    if (!root) return;
    const read = () => {
      const next = findAnchors(root);
      setAnchors((prev) =>
        prev.length === next.length && prev.every((a, i) => a.id === next[i].id && a.label === next[i].label)
          ? prev
          : next
      );
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname, contentId]);

  // Scroll-spy: дээд цэсний доор хамгийн сүүлд гарсан хэсэг идэвхтэй
  useEffect(() => {
    if (!showAnchors) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const offset = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 4) * 16 + 120;
      let current = '';
      for (const a of anchors) {
        const el = document.getElementById(a.id);
        if (el && el.getBoundingClientRect().top <= offset) current = a.id;
      }
      setActiveAnchor(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [anchors, showAnchors]);

  // Утсан дээр идэвхтэй товчийг харагдах хэсэгт гүйлгэнэ (зөвхөн хэвтээ чиглэлд)
  useEffect(() => {
    for (const box of [chipsRef.current, filterChipsRef.current]) {
      const chip = box?.querySelector<HTMLElement>('[data-active="true"]');
      if (box && chip) box.scrollTo({ left: chip.offsetLeft - (box.clientWidth - chip.offsetWidth) / 2, behavior: 'smooth' });
    }
  }, [pathname, activeAnchor, activeFilter, filters]);

  // Шүүлтүүртэй хуудасны эх мөр дээр дарахад «Бүгд» (хуудас солигдохгүй)
  const onRowClick = (row: SectionRow) => (e: React.MouseEvent) => {
    if (isActive(row) && filters) {
      e.preventDefault();
      selectFilter(filters.param, 'all');
    }
  };

  const chipClass = (active: boolean) =>
    `px-4 py-2.5 rounded-full text-[15px] leading-none whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
      active
        ? 'bg-[#15803d] text-white font-semibold'
        : 'bg-emerald-50/70 border border-emerald-100 text-emerald-950 font-medium hover:bg-emerald-100'
    }`;
  const subClass = (active: boolean) =>
    `block w-full text-left px-2 py-1.5 rounded-lg text-[15px] leading-snug transition-colors cursor-pointer ${
      active ? 'text-[#15803d] font-semibold' : 'text-neutral-500 font-medium hover:text-neutral-900'
    }`;

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
          {anchorChips
            ? anchors.map((a) => (
                <a key={a.id} href={`#${a.id}`} data-active={a.id === activeAnchor} className={chipClass(a.id === activeAnchor)}>
                  {a.label}
                </a>
              ))
            : rows.map((row) => (
                <Link
                  key={row.href}
                  href={row.href}
                  scroll={false}
                  onClick={onRowClick(row)}
                  aria-current={isActive(row) ? 'page' : undefined}
                  data-active={isActive(row)}
                  className={chipClass(isActive(row))}
                >
                  {row.label}
                </Link>
              ))}
        </div>
        {filters && (
          <div
            ref={filterChipsRef}
            role="group"
            aria-label="Ангилал"
            className="flex gap-2 px-6 sm:px-10 pb-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {[{ id: 'all', label: 'Бүгд' }, ...filters.options].map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => selectFilter(filters.param, o.id)}
                aria-pressed={o.id === activeFilter}
                data-active={o.id === activeFilter}
                className={`px-3.5 py-2 rounded-full text-sm leading-none whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  o.id === activeFilter
                    ? 'bg-emerald-100 text-[#15803d] font-semibold border border-emerald-300'
                    : 'bg-white border border-neutral-200 text-neutral-700 font-medium'
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Компьютер: зүүн талын карт */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-[calc(var(--nav-h)+1.5rem)] max-h-[calc(100vh-var(--nav-h)-3rem)] overflow-y-auto bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
        <span className="text-[13px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 px-3">
          Сэдвийн жагсаалт
        </span>
        <nav aria-label="Сэдвийн жагсаалт">
          <ul className="space-y-1">
            {rows.map((row) => (
              <li key={row.href}>
                <Link
                  href={row.href}
                  scroll={false}
                  onClick={onRowClick(row)}
                  aria-current={isActive(row) ? 'page' : undefined}
                  className={`block px-3 py-2.5 rounded-xl text-[17px] leading-snug transition-all ${
                    isActive(row)
                      ? 'bg-[#15803d]/10 text-[#15803d] font-semibold'
                      : 'text-neutral-700 font-medium hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {row.label}
                </Link>
                {isActive(row) && filters && (
                  <ul role="group" aria-label="Ангилал" className="mt-1 mb-2 ml-4 pl-3 border-l-2 border-emerald-100 space-y-0.5">
                    {filters.options.map((o) => (
                      <li key={o.id}>
                        <button
                          type="button"
                          onClick={() => selectFilter(filters.param, o.id)}
                          aria-pressed={o.id === activeFilter}
                          className={subClass(o.id === activeFilter)}
                        >
                          {o.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {isActive(row) && showAnchors && (
                  <ul className="mt-1 mb-2 ml-4 pl-3 border-l-2 border-emerald-100 space-y-0.5">
                    {anchors.map((a) => (
                      <li key={a.id}>
                        <a
                          href={`#${a.id}`}
                          aria-current={a.id === activeAnchor ? 'location' : undefined}
                          className={subClass(a.id === activeAnchor)}
                        >
                          {a.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}

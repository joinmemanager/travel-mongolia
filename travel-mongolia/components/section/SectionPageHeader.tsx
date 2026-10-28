'use client';

import { usePathname } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

import Breadcrumbs, { type Crumb } from '@/components/Breadcrumbs';
import { activeRow, type SectionRow } from '@/lib/sections';

// Баруун талын агуулгын эхлэл: замчлал (+ BreadcrumbList JSON-LD) ба дэд хуудасны H1.
// Үндсэн хаяг дээр H1 нь hero-гийн гарчиг тул энд H1 гарахгүй.
export default function SectionPageHeader({
  baseHref,
  sectionTitle,
  parentCrumb,
  rows,
}: {
  baseHref: string;
  sectionTitle: string;
  parentCrumb?: Crumb;
  rows: SectionRow[];
}) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const isBase = pathname === baseHref;
  // Нийтлэлийн хуудас (/about/history/<slug>): эцэг мөр идэвхтэй, замчлал, H1-ийг хуудас өөрөө гаргана
  const { row: current, nested } = activeRow(rows, pathname);

  const crumbs: Crumb[] = [
    { label: 'Нүүр', href: '/' },
    ...(parentCrumb ? [parentCrumb] : []),
    { label: sectionTitle, href: baseHref },
    ...(!isBase && current ? [{ label: current.label, href: current.href }] : []),
  ];

  // Жагсаалтаас өөр мөр сонгоход агуулгын эхлэл дээд цэс, наалддаг товчны ард орсон бол түүн рүү гүйлгэнэ.
  // Hero харагдаж байвал (хуудасны дээд хэсэгт) гүйлгэхгүй.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const el = ref.current;
    if (el && el.getBoundingClientRect().top < 140) el.scrollIntoView({ behavior: 'smooth' });
  }, [pathname]);

  return (
    <div
      ref={ref}
      id="section-top"
      className="pt-8 lg:pt-0 mb-10 scroll-mt-[calc(var(--nav-h)+4.5rem)] lg:scroll-mt-[calc(var(--nav-h)+1.5rem)]"
    >
      {/* Нийтлэлийн хуудас замчлалаа (гарчигтайгаа) өөрөө гаргана */}
      {!nested && <Breadcrumbs items={crumbs} />}
      {!isBase && current && !nested && (
        <h1 className="text-3xl sm:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
          {current.label}
        </h1>
      )}
    </div>
  );
}

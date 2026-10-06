import Link from 'next/link';
import React from 'react';

import { liveHref } from '@/lib/navigation';
import type { GuideLink, GuideSection } from '@/lib/respectData';

import Breadcrumbs, { type Crumb } from './Breadcrumbs';

// Гарын авлага маягийн хуудас (/plan/* хуудсуудын загвартай ижил):
// толгой хэсэг (замчлал, H1), зүүн талд хэсгийн жагсаалт, баруун талд хэсгүүд.
export default function GuidePage({
  crumbs,
  kicker,
  kickerEn,
  title,
  intro,
  sections,
  related,
  children,
  bottomBand,
}: {
  crumbs: Crumb[];
  kicker: string;
  kickerEn: string;
  title: string;
  intro: string;
  sections: GuideSection[];
  related: GuideLink[];
  // Хэсгүүдийн өмнө харуулах нэмэлт контент (жишээ нь hub хуудасны амлалт)
  children?: React.ReactNode;
  // Хуудасны хамгийн доор, footer-ийн яг дээр харуулах тууз (components/design/PatternBand)
  bottomBand?: React.ReactNode;
}) {
  // Production дээр draft/planned хуудас руу заасан холбоосыг харуулахгүй
  const liveRelated = related.filter((link) => liveHref(link.href));

  return (
    <main className={`min-h-screen bg-[#fcfbf9] text-neutral-900 ${bottomBand ? '' : 'pb-32'}`}>
      {/* Толгой хэсэг */}
      <header className="border-b border-neutral-200 bg-white pt-12 pb-12 px-6 sm:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <Breadcrumbs items={crumbs} />
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#15803d] uppercase">
              {kicker}
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-[11px] font-mono text-neutral-500 uppercase">
              {kickerEn}
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
            {intro}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 flex flex-col lg:flex-row gap-12 items-start">
        {/* Зүүн талын хэсгийн жагсаалт */}
        {sections.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28 space-y-2 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 px-2">
              Сэдвийн жагсаалт
            </span>
            <nav className="space-y-1">
              {sections.map((sec, i) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
                >
                  {String(i + 1).padStart(2, '0')}. {sec.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <div className="flex-1 w-full space-y-16">
          {children}

          {sections.map((sec, i) => (
            <section
              key={sec.id}
              id={sec.id}
              className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm"
            >
              <span className="block mb-2 text-[11px] font-mono font-bold text-[#15803d]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">
                {sec.title}
              </h2>
              {sec.intro && (
                <p className="mb-5 text-sm text-neutral-600 leading-relaxed">
                  {sec.intro}
                </p>
              )}
              <ul className="space-y-3">
                {sec.points.map((point) => (
                  <li
                    key={point}
                    className="flex gap-3 text-sm text-neutral-700 leading-relaxed"
                  >
                    <span aria-hidden="true" className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-[#15803d]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Холбогдох хуудсууд */}
          {liveRelated.length > 0 && (
            <section className="p-8 sm:p-10 rounded-3xl border border-neutral-200/80 bg-white shadow-sm">
              <h2 className="text-lg font-black text-neutral-900 mb-4">
                Холбогдох хуудсууд
              </h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {liveRelated.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex justify-between items-center p-4 rounded-2xl bg-[#fcfbf9] border border-neutral-200 text-sm font-semibold text-neutral-800 hover:border-[#15803d] hover:text-[#15803d] transition-colors"
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
      {bottomBand && <div className="mt-32">{bottomBand}</div>}
    </main>
  );
}

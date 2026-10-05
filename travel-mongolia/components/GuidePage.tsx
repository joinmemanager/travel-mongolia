import Link from 'next/link';
import React from 'react';

import { liveHref } from '@/lib/navigation';
import type { GuideLink, GuideSection } from '@/lib/respectData';

import type { Crumb } from './Breadcrumbs';
import HubHeader from './HubHeader';

// Гарын авлага маягийн хуудас (/plan/* хуудсуудын бүтэцтэй ижил):
// толгой хэсэг (HubHeader), зүүн талд хэсгийн жагсаалт, баруун талд хэсгүүд.
// Хэсгүүд цагаан болон цайвар ногоон дэвсгэрийг ээлжлэн хэрэглэнэ.
export default function GuidePage({
  crumbs,
  kicker,
  kickerEn,
  title,
  intro,
  imageUrl,
  sections,
  related,
  children,
}: {
  crumbs: Crumb[];
  kicker: string;
  kickerEn: string;
  title: string;
  intro: string;
  imageUrl?: string;
  sections: GuideSection[];
  related: GuideLink[];
  // Хэсгүүдийн өмнө харуулах нэмэлт контент (жишээ нь hub хуудасны амлалт)
  children?: React.ReactNode;
}) {
  // Production дээр draft/planned хуудас руу заасан холбоосыг харуулахгүй
  const liveRelated = related.filter((link) => liveHref(link.href));

  return (
    <main className="min-h-screen bg-brand-50 text-neutral-900 pb-32">
      <HubHeader
        crumbs={crumbs}
        kicker={kicker}
        kickerEn={kickerEn}
        title={title}
        intro={intro}
        imageUrl={imageUrl}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 flex flex-col lg:flex-row gap-12 items-start">
        {/* Зүүн талын хэсгийн жагсаалт */}
        {sections.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28 space-y-2 bg-white p-5 rounded-2xl border border-brand-100 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-brand-800 uppercase block mb-3 px-2">
              Сэдвийн жагсаалт
            </span>
            <nav className="space-y-1">
              {sections.map((sec, i) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="flex gap-2 items-center px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-brand-50 hover:text-brand-800 transition-all"
                >
                  <span className="flex justify-center items-center w-5 h-5 shrink-0 text-[10px] font-bold text-brand-800 bg-brand-100 rounded-full">
                    {i + 1}
                  </span>
                  {sec.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <div className="flex-1 w-full space-y-10">
          {children}

          {sections.map((sec, i) => (
            <section
              key={sec.id}
              id={sec.id}
              className={`scroll-mt-28 p-8 sm:p-10 rounded-3xl border border-t-4 border-brand-100 border-t-brand-600 shadow-sm ${
                i % 2 === 0 ? 'bg-white' : 'bg-brand-50'
              }`}
            >
              <div className="flex gap-4 items-center mb-5">
                <span className="flex justify-center items-center w-10 h-10 shrink-0 text-sm font-black text-brand-800 bg-brand-100 rounded-full">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-brand-950">{sec.title}</h2>
              </div>
              {sec.intro && (
                <p className="mb-5 text-sm text-neutral-700 leading-relaxed">{sec.intro}</p>
              )}
              <ul className="space-y-3">
                {sec.points.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-neutral-800 leading-relaxed">
                    {/* Цайвар ногоон дугуй дэвсгэртэй icon */}
                    <span
                      aria-hidden="true"
                      className="flex justify-center items-center mt-0.5 w-5 h-5 shrink-0 bg-brand-100 rounded-full"
                    >
                      <svg className="w-3 h-3 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Холбогдох хуудсууд */}
          {liveRelated.length > 0 && (
            <section className="p-8 sm:p-10 rounded-3xl border border-brand-100 bg-white shadow-sm">
              <h2 className="text-lg font-black text-brand-950 mb-4">Холбогдох хуудсууд</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {liveRelated.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex justify-between items-center p-4 rounded-2xl bg-brand-50 border border-brand-100 text-sm font-semibold text-brand-800 hover:border-brand-600 hover:bg-white hover:shadow-md transition-all"
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
    </main>
  );
}

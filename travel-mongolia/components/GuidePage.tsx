import React from 'react';

import type { GuideLink, GuideSection } from '@/lib/respectData';

import type { Crumb } from './Breadcrumbs';
import LinkCard from './design/LinkCard';
import HubHeader from './HubHeader';

export interface TocItem {
  id: string;
  label: string;
}

// "Гарын авлага/нийтлэл" загвар (docs/plan/templates.md): /plan/*, /respect/*.
// Текст толгой (HubHeader) → зүүн талд наалддаг сэдвийн жагсаалт → хэсгүүд →
// доод хэсэгт "Холбогдох хуудсууд" холбоосны карт (components/design/LinkCard).
// Хэсгүүдийг өгөгдлөөр (sections) эсвэл өөрийн JSX-ээр (children + toc) дамжуулж болно.
export default function GuidePage({
  crumbs,
  kicker,
  kickerEn,
  title,
  intro,
  sections = [],
  toc,
  activeToc,
  onTocSelect,
  related,
  children,
  bottomBand,
}: {
  crumbs?: Crumb[];
  kicker: string;
  kickerEn: string;
  title: string;
  intro: string;
  sections?: GuideSection[];
  // Хэсгүүдийг children-ээр өгөх үед зүүн талын жагсаалт (жишээ нь /plan/* хуудсууд)
  toc?: TocItem[];
  // Сонгогдсон сэдвийг тодруулах (сонголттой)
  activeToc?: string;
  onTocSelect?: (id: string) => void;
  related: GuideLink[];
  // Хэсгүүдийн өмнө харуулах нэмэлт контент (жишээ нь hub хуудасны амлалт)
  children?: React.ReactNode;
  // Хуудасны хамгийн доор, footer-ийн яг дээр харуулах тууз (components/design/PatternBand)
  bottomBand?: React.ReactNode;
}) {
  const tocItems: TocItem[] =
    toc ||
    sections.map((sec, i) => ({
      id: sec.id,
      label: `${String(i + 1).padStart(2, '0')}. ${sec.title}`,
    }));

  return (
    <main className={`min-h-screen bg-[#fcfbf9] text-neutral-900 ${bottomBand ? '' : 'pb-32'}`}>
      <HubHeader crumbs={crumbs} kicker={kicker} kickerEn={kickerEn} title={title} intro={intro} />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 flex flex-col lg:flex-row gap-12 items-start">
        {/* Зүүн талын сэдвийн жагсаалт */}
        {tocItems.length > 0 && (
          <aside className="hidden lg:block w-64 shrink-0 sticky top-28 space-y-2 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
            <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 px-2">
              Сэдвийн жагсаалт
            </span>
            <nav className="space-y-1">
              {tocItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={onTocSelect ? () => onTocSelect(item.id) : undefined}
                  className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeToc === item.id
                      ? 'bg-[#15803d]/10 text-[#15803d] font-bold'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  {item.label}
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

          {/* Холбогдох хуудсууд: холбоосны карт (production дээр нийтлэгдээгүйг нууна) */}
          <LinkCard title="Холбогдох хуудсууд" links={related} />
        </div>
      </div>
      {bottomBand && <div className="mt-32">{bottomBand}</div>}
    </main>
  );
}

import Link from 'next/link';
import React from 'react';

import type { SiteImage } from '@/lib/images';
import { liveHref } from '@/lib/navigation';
import type { GuideLink, GuideSection } from '@/lib/respectData';

import type { Crumb } from './Breadcrumbs';
import HubHeader from './HubHeader';

// Гарын авлага маягийн хуудас ("Монгол сэтгүүл", docs/plan/design-brief.md):
// толгой хэсэг (HubHeader, зурагтай бол дэлгэц дүүрэн), зүүн талд хэсгийн жагсаалт, хэсгүүд.
export default function GuidePage({
  crumbs,
  kicker,
  kickerEn,
  title,
  intro,
  image,
  sections,
  related,
  children,
}: {
  crumbs: Crumb[];
  kicker: string;
  kickerEn: string;
  title: string;
  intro: string;
  image?: SiteImage;
  sections: GuideSection[];
  related: GuideLink[];
  // Хэсгүүдийн өмнө харуулах нэмэлт контент (жишээ нь hub хуудасны амлалт)
  children?: React.ReactNode;
}) {
  // Production дээр draft/planned хуудас руу заасан холбоосыг харуулахгүй
  const liveRelated = related.filter((link) => liveHref(link.href));

  return (
    <main className="min-h-screen bg-cream text-ink pb-28">
      <HubHeader
        crumbs={crumbs}
        kicker={kicker}
        kickerEn={kickerEn}
        title={title}
        intro={intro}
        image={image}
      />

      <div className="flex flex-col gap-12 items-start px-6 pt-16 mx-auto max-w-[1200px] sm:px-10 lg:flex-row">
        {/* Зүүн талын хэсгийн жагсаалт */}
        {sections.length > 0 && (
          <aside className="hidden sticky top-28 shrink-0 p-5 w-64 bg-white rounded-xl border border-ink/10 lg:block">
            <span className="block mb-3 px-2 text-[11px] font-semibold tracking-[0.25em] text-gold-ink uppercase">
              Сэдвийн жагсаалт
            </span>
            <nav className="space-y-1">
              {sections.map((sec, i) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className="block py-2 px-3 text-sm text-ink-muted hover:text-ink rounded-lg hover:bg-cream transition-colors"
                >
                  <span className="mr-2 font-serif text-gold-ink">{i + 1}.</span>
                  {sec.title}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <div className="flex-1 space-y-12 w-full">
          {children}

          {sections.map((sec, i) => (
            <section
              key={sec.id}
              id={sec.id}
              className="scroll-mt-28 p-8 bg-white rounded-xl border border-ink/10 sm:p-12"
            >
              <p className="mb-2 font-serif text-sm text-gold-ink">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2 className="mb-5 font-serif text-2xl font-bold text-ink sm:text-3xl">{sec.title}</h2>
              {sec.intro && (
                <p className="mb-6 text-base leading-relaxed text-ink-muted">{sec.intro}</p>
              )}
              <ul className="space-y-4">
                {sec.points.map((point) => (
                  <li key={point} className="flex gap-4 text-base leading-relaxed text-ink">
                    <span aria-hidden="true" className="mt-2.5 w-1.5 h-1.5 shrink-0 bg-gold rotate-45" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {/* Холбогдох хуудсууд */}
          {liveRelated.length > 0 && (
            <section className="p-8 bg-white rounded-xl border border-ink/10 sm:p-12">
              <h2 className="mb-6 font-serif text-xl font-bold text-ink">Холбогдох хуудсууд</h2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {liveRelated.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex justify-between items-center p-4 text-sm font-semibold text-ink bg-cream rounded-xl border border-ink/10 hover:border-gold transition-colors"
                    >
                      <span>{link.label}</span>
                      <span aria-hidden="true" className="text-gold-ink transition-transform group-hover:translate-x-1">→</span>
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

import React from 'react';

import { isPreviewEnv, liveHref } from '@/lib/navigation';
import { getSection, sectionRows, sectionTitle } from '@/lib/sections';

import SectionHero from './SectionHero';
import SectionPageHeader from './SectionPageHeader';
import SectionSidebar from './SectionSidebar';

// Хэсгийн хуудасны хүрээ (docs/plan/section-layout.md). Route group-ийн layout.tsx-ээс дуудна:
//   app/(sec-about)/layout.tsx → <SectionLayout sectionId="about">{children}</SectionLayout>
// Нэг group доторх хуудас хооронд шилжихэд hero, жагсаалт байрандаа үлдэж зөвхөн children солигдоно.
export default function SectionLayout({
  sectionId,
  children,
}: {
  sectionId: string;
  children: React.ReactNode;
}) {
  const section = getSection(sectionId);
  const title = sectionTitle(section);
  // Production дээр нийтлэгдээгүй мөрийг нууна. Preview дээр planned (хуудасгүй) мөрөөс бусад нь харагдана.
  const rows = sectionRows(section).filter((r) =>
    isPreviewEnv() ? r.status !== 'planned' : liveHref(r.href)
  );

  return (
    <main className="w-full bg-white text-neutral-900 pb-36 font-sans selection:bg-[#15803d] selection:text-white">
      <SectionHero
        baseHref={section.baseHref}
        image={section.hero.image}
        kicker={section.hero.kicker}
        title={title}
        intro={section.hero.intro}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:flex lg:gap-12 lg:items-start lg:pt-12">
        <SectionSidebar rows={rows} />
        <div className="flex-1 min-w-0">
          <SectionPageHeader baseHref={section.baseHref} sectionTitle={title} rows={rows} />
          {children}
        </div>
      </div>
    </main>
  );
}

import { connection } from 'next/server';
import React from 'react';

import CultureCards from '@/components/culture/CultureCards';
import { CULTURE_SECTIONS, getCultureArticles, type CultureSection } from '@/lib/cultureArticles';
import { isPreviewEnv } from '@/lib/navigation';

// cultureArticle-ийн жагсаалтын хуудас (/about/culture/ethnic-groups, /religion, /about/history/people).
// Хэсгийн дэд хуудас тул H1, замчлалыг SectionPageHeader гаргана (нав-ийн мөрийн нэрээр).
export default async function CultureListPage({ section, intro }: { section: CultureSection; intro: string }) {
  if (isPreviewEnv()) await connection();
  const items = await getCultureArticles(section);
  return (
    <div className="space-y-12">
      <p className="max-w-[70ch] text-base leading-relaxed sm:text-lg text-neutral-700">{intro}</p>
      <section id="articles" data-toc="Нийтлэлүүд">
        <h2 className="mb-6 text-2xl font-black tracking-tight sm:text-3xl text-neutral-900">
          {CULTURE_SECTIONS[section].title} <span className="text-neutral-400">({items.length})</span>
        </h2>
        <CultureCards items={items} />
      </section>
    </div>
  );
}

import { connection } from 'next/server';
import React from 'react';

import SpeciesCards from '@/components/species/SpeciesCards';
import SpeciesCatalog from '@/components/species/SpeciesCatalog';
import { isPreviewEnv } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { getSpeciesList } from '@/lib/species';

// «Түүх & өв → Байгаль → Ургамал» (TIC cate12): 80-аас дээш үгтэй нь нийтлэлтэй, бусад нь жагсаалтын мөр (#slug).
export const revalidate = 86400;
export const metadata = metaFor('/about/nature/plants');

export default async function PlantsPage() {
  if (isPreviewEnv()) await connection();
  const plants = await getSpeciesList(['plant']);
  const withPage = plants.filter((p) => p.ownPage);
  const brief = plants.filter((p) => !p.ownPage);
  return (
    <div className="space-y-16">
      <p className="max-w-[70ch] text-base leading-relaxed sm:text-lg text-neutral-700">
        Монгол орны мод, бут, эмийн болон хүнсний ургамал, мөөгний тухай нийтлэлүүд.
      </p>
      <section id="articles" data-toc="Нийтлэлүүд">
        <h2 className="mb-6 text-2xl font-black tracking-tight sm:text-3xl text-neutral-900">
          Нийтлэлүүд <span className="text-neutral-400">({withPage.length})</span>
        </h2>
        <SpeciesCards items={withPage} />
      </section>
      {brief.length > 0 && (
        <section id="catalog" data-toc="Товч мэдээлэл">
          <h2 className="mb-6 text-2xl font-black tracking-tight sm:text-3xl text-neutral-900">
            Товч мэдээлэл <span className="text-neutral-400">({brief.length})</span>
          </h2>
          <SpeciesCatalog
            noun="ургамал"
            items={brief.map((p) => ({ id: p.id, slug: p.slug, title: p.title, latinName: p.latinName, summary: p.summary, image: p.image?.src }))}
          />
        </section>
      )}
    </div>
  );
}

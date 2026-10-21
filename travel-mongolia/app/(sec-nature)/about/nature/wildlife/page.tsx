import { connection } from 'next/server';
import React from 'react';

import SpeciesCards from '@/components/species/SpeciesCards';
import { isPreviewEnv } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { getSpeciesList, WILDLIFE_GROUPS } from '@/lib/species';

// «Түүх & өв → Байгаль → Ан амьтан»: TIC cate10 (TypeID 1–4: хөхтөн, сээр нуруугүй, загас, хоёр нутагтан/мөлхөгч).
// Бүлэг бүр section[id] тул «Сэдвийн жагсаалт» тэдгээрийг дэд мөрөөр харуулна.
export const revalidate = 604800;
export const metadata = metaFor('/about/nature/wildlife');

export default async function WildlifePage() {
  if (isPreviewEnv()) await connection();
  const all = await getSpeciesList(WILDLIFE_GROUPS.map((g) => g.id));
  return (
    <div className="space-y-16">
      <p className="max-w-[70ch] text-base leading-relaxed sm:text-lg text-neutral-700">
        Монгол орны хөхтөн амьтад, хоёр нутагтан, мөлхөгчид, загас болон шавжийн тухай нийтлэлүүд. Ихэнх нь
        Монгол Улсын Улаан номд орсон ховор, нэн ховор зүйл.
      </p>
      {WILDLIFE_GROUPS.map((g) => {
        const items = all.filter((s) => s.group === g.id);
        if (items.length === 0) return null;
        return (
          <section key={g.id} id={g.id} data-toc={g.title}>
            <h2 className="mb-6 text-2xl font-black tracking-tight sm:text-3xl text-neutral-900">
              {g.title} <span className="text-neutral-400">({items.length})</span>
            </h2>
            <SpeciesCards items={items} />
          </section>
        );
      })}
    </div>
  );
}

import { connection } from 'next/server';
import React from 'react';

import PlaceList from '@/components/places/PlaceList';
import { isPreviewEnv } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { CATEGORY_INFO, CULTURE_CATEGORIES, getPlacesByCategory } from '@/lib/tourismPlaces';

// «Үзэх, хийх зүйлс → Музей, театр» (TIC cate17: музей, театр/урлагийн чуулга, соёлын төв/номын сан).
// «Түүх, соёлын аялал» (/things-to-do/culture) нь туршлагын картууд тул байгууллагын жагсаалтыг тусад нь.
// Ангилал бүр section[id] тул «Сэдвийн жагсаалт» дэд мөрөөр харуулна.
export const revalidate = 604800;
export const metadata = metaFor('/things-to-do/museums');

export default async function MuseumsPage() {
  if (isPreviewEnv()) await connection();
  const all = await getPlacesByCategory(CULTURE_CATEGORIES);
  return (
    <div className="space-y-16">
      <p className="max-w-[70ch] text-base leading-relaxed sm:text-lg text-neutral-700">
        Улаанбаатар болон аймгийн төвүүдийн музей, театр, урлагийн чуулга, соёлын төв, номын сангууд: түүх,
        үзмэр, байршил.
      </p>
      {CULTURE_CATEGORIES.map((c) => {
        const items = all.filter((p) => p.category === c);
        if (items.length === 0) return null;
        return (
          <section key={c} id={c} data-toc={CATEGORY_INFO[c].plural}>
            <h2 className="mb-6 text-2xl font-black tracking-tight sm:text-3xl text-neutral-900">
              {CATEGORY_INFO[c].plural} <span className="text-neutral-400">({items.length})</span>
            </h2>
            <PlaceList places={items} columns={2} />
          </section>
        );
      })}
    </div>
  );
}

import { connection } from 'next/server';
import React from 'react';

import PlaceList from '@/components/places/PlaceList';
import { isPreviewEnv } from '@/lib/navigation';
import { CATEGORY_INFO, getPlacesByCategory, type PlaceCategory } from '@/lib/tourismPlaces';

// Тусгай хамгаалалттай газрын ангиллын хуудсанд (/destination/strictly-protected г.м.) бүх газрын жагсаалт.
// Газар бүр /destination/protected/<slug> (эсвэл нэгтгэсэн destination/heritagePlace) хуудас руу.
// Server component: CategoryDirectory-ийн children-д шууд оруулна.
export default async function ProtectedPlacesSection({
  categories,
  id = 'all-places',
  kicker = 'Бүх газар',
  title,
}: {
  categories: PlaceCategory[];
  id?: string;
  kicker?: string;
  title?: string;
}) {
  // Preview дээр Draft entry-г хүсэлт бүрт шинээр уншина
  if (isPreviewEnv()) await connection();
  const places = await getPlacesByCategory(categories);
  if (places.length === 0) return null;
  const heading = title || CATEGORY_INFO[categories[0]].plural;
  // Олон ангилалтай бол (/destination/protected) ангилал бүрээр бүлэглэнэ
  const groups = categories.length > 1
    ? categories.map((c) => ({ c, items: places.filter((p) => p.category === c) })).filter((g) => g.items.length)
    : [{ c: categories[0], items: places }];

  return (
    <section id={id} className="scroll-mt-28">
      <div className="pb-5 mb-10 border-b border-neutral-200">
        <span className="block mb-2 text-sm font-black tracking-widest uppercase text-[#15803d]">{kicker}</span>
        <h2 className="text-3xl font-black tracking-tight sm:text-5xl text-neutral-900">
          {heading} <span className="text-neutral-400">({places.length})</span>
        </h2>
      </div>
      <div className="space-y-14">
        {groups.map((g) => (
          <div key={g.c}>
            {groups.length > 1 && (
              <h3 className="mb-5 text-xl font-bold sm:text-2xl text-neutral-900">
                {CATEGORY_INFO[g.c].plural} <span className="text-neutral-400">({g.items.length})</span>
              </h3>
            )}
            <PlaceList places={g.items} />
          </div>
        ))}
      </div>
    </section>
  );
}

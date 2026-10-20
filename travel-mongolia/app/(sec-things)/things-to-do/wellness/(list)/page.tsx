import React from 'react';

import PlaceList from '@/components/places/PlaceList';
import { getPlacesByCategory } from '@/lib/tourismPlaces';

import WellnessListing from './WellnessListing';

// «Амралт, рашаан сувилал»: дээд хэсэг нь кодын картууд (WellnessListing, ?cat= шүүлтүүр), доор нь TIC-ээс
// шилжүүлсэн рашаан сувиллууд (Contentful `place`, category=sanatorium) → /things-to-do/wellness/<slug>.
// (list) route group: layout.tsx-ийн metadata, force-dynamic нь [slug] нийтлэлийг ороохгүй.
export default async function WellnessPage() {
  const sanatoriums = await getPlacesByCategory(['sanatorium']);
  return (
    <>
      <WellnessListing />
      {sanatoriums.length > 0 && (
        <section id="sanatorium" data-toc="Рашаан сувиллууд" className="mt-20">
          <h2 className="mb-2 text-2xl font-black tracking-tight sm:text-3xl text-neutral-900">
            Рашаан сувиллууд <span className="text-neutral-400">({sanatoriums.length})</span>
          </h2>
          <p className="mb-8 max-w-[70ch] text-base leading-relaxed text-neutral-600">
            Монголын халуун, хүйтэн рашаан, шавар, элсэн сувиллууд: байршил, эмчилгээний онцлог.
          </p>
          <PlaceList places={sanatoriums} columns={2} />
        </section>
      )}
    </>
  );
}

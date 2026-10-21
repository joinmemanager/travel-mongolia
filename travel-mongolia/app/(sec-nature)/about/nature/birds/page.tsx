import { connection } from 'next/server';
import React from 'react';

import SpeciesCatalog from '@/components/species/SpeciesCatalog';
import { isPreviewEnv } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { getSpeciesList } from '@/lib/species';

// «Монголын шувууд» каталог (TIC cate11, 467 нийтлэл). Ихэнх нь богино (нэр, латин нэр, нэг зураг) тул
// тусдаа хуудасгүй мөр (#slug), 150-аас дээш үгтэй нь /about/nature/birds/<slug> нийтлэлтэй.
export const revalidate = 604800;
export const metadata = metaFor('/about/nature/birds');

export default async function BirdsPage() {
  if (isPreviewEnv()) await connection();
  const birds = await getSpeciesList(['bird']);
  const articles = birds.filter((b) => b.ownPage).length;
  return (
    <div>
      <p className="mb-8 max-w-[70ch] text-base leading-relaxed sm:text-lg text-neutral-700">
        Монгол оронд бүртгэгдсэн шувуудын {birds.length} зүйл: монгол, латин нэр, зураг, товч тайлбар. Үүнээс{' '}
        {articles} зүйл нь дэлгэрэнгүй нийтлэлтэй.
      </p>
      <SpeciesCatalog
        noun="зүйл шувуу"
        items={birds.map((b) => ({
          id: b.id,
          slug: b.slug,
          title: b.title,
          latinName: b.latinName,
          summary: b.summary,
          image: b.image?.src,
          href: b.ownPage ? b.href : undefined,
        }))}
      />
    </div>
  );
}

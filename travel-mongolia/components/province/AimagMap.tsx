import Link from 'next/link';
import React from 'react';

import { AIMAG_MAP_VIEWBOX, AIMAG_SHAPES } from '@/lib/aimagMap';

import AimagMapHover from './AimagMapHover';

// Монголын 21 аймаг + Улаанбаатар (Natural Earth, public domain; docs/maps/README.md).
// Тухайн аймаг ногоон, бусад нь цайвар саарал; аймаг бүр өөрийн хуудас руу холбогдоно.
// SVG нь server HTML-д бүтнээрээ байна, hover-ийн нэрийг л client тал харуулна.
export default function AimagMap({ active }: { active: string }) {
  const current = AIMAG_SHAPES.find((s) => s.slug === active);
  return (
    <figure className="p-5 bg-white rounded-2xl border border-neutral-200/70">
      <figcaption className="mb-3 text-xs font-semibold tracking-wider uppercase text-neutral-500">
        Байршил{current ? ` · ${current.name}` : ''}
      </figcaption>
      <AimagMapHover>
        <svg viewBox={AIMAG_MAP_VIEWBOX} className="w-full h-auto" aria-label="Монголын аймгуудын газрын зураг">
          {AIMAG_SHAPES.map((s) =>
            s.slug === active ? null : (
              <Link key={s.slug} href={`/province/${s.slug}`} prefetch={false} data-name={s.name} aria-label={s.name}>
                <path
                  d={s.d}
                  className="fill-neutral-200 stroke-white transition-colors hover:fill-[#9cc7a8]"
                  strokeWidth={0.8}
                  strokeLinejoin="round"
                />
              </Link>
            )
          )}
          {/* Идэвхтэй аймгийг хамгийн сүүлд зурж хүрээг нь бүтэн харуулна */}
          {current && (
            <path d={current.d} data-name={current.name} fill="#15803d" stroke="#0b3b20" strokeWidth={1} strokeLinejoin="round">
              <title>{current.name}</title>
            </path>
          )}
        </svg>
      </AimagMapHover>
    </figure>
  );
}

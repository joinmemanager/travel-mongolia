'use client';

import Link from 'next/link';
import React, { useMemo, useState } from 'react';

import type { Accommodation, AccommodationKind } from '@/lib/accommodation';
import { cdnImage } from '@/lib/imageUrl';

// Tourist Info Center-ээс шилжүүлсэн буудал, баазын лавлах: аймаг, төрлөөр шүүнэ.
// Бүх мөр server HTML-д байна (шүүлт зөвхөн нууна), хайлтын систем бүх холбоосыг харна.
export default function TicAccommodationDirectory({
  items,
  notice,
  kindLabel,
}: {
  items: Accommodation[];
  notice: string;
  kindLabel: Record<AccommodationKind, string>;
}) {
  const [aimag, setAimag] = useState('');
  const [kind, setKind] = useState<AccommodationKind | ''>('');
  const aimags = useMemo(
    () => [...new Set(items.map((x) => x.province).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'mn')),
    [items]
  );
  const visible = (x: Accommodation) => (!aimag || x.province === aimag) && (!kind || x.kind === kind);
  const shown = items.filter(visible).length;
  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
      active ? 'bg-[#15803d] border-[#15803d] text-white' : 'bg-white border-neutral-200 text-neutral-700 hover:border-[#15803d]'
    }`;

  return (
    <section id="directory" className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[11px] font-mono font-bold text-[#15803d]">SECTION 07</span>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">Буудал, баазын лавлах</h2>
      <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-900">{notice}</p>

      <div className="flex flex-wrap gap-2 items-center mb-4">
        <button type="button" className={chip(kind === '')} onClick={() => setKind('')}>
          Бүгд
        </button>
        {(Object.keys(kindLabel) as AccommodationKind[]).map((k) => (
          <button key={k} type="button" className={chip(kind === k)} onClick={() => setKind(k)}>
            {kindLabel[k]} ({items.filter((x) => x.kind === k).length})
          </button>
        ))}
        <label className="flex gap-2 items-center ml-auto text-xs font-bold text-neutral-600">
          Аймаг
          <select
            value={aimag}
            onChange={(e) => setAimag(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-800"
          >
            <option value="">Бүх аймаг</option>
            {aimags.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="mb-4 text-xs text-neutral-500">{shown} газар</p>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {items.map((x) => (
          <li key={x.id} hidden={!visible(x)}>
            <Link
              href={x.href}
              className="flex gap-3 items-center p-3 h-full rounded-2xl border transition-colors border-neutral-200 bg-[#fcfbf9] hover:border-[#15803d]"
            >
              <div className="overflow-hidden w-20 h-16 rounded-xl shrink-0 bg-neutral-100">
                {x.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cdnImage(x.image.src, 200)} alt={x.name} loading="lazy" className="object-cover w-full h-full" />
                )}
              </div>
              <div className="min-w-0">
                <span className="block text-sm font-bold leading-snug text-neutral-900">{x.name}</span>
                <span className="block mt-0.5 text-[11px] font-semibold text-[#15803d]">
                  {kindLabel[x.kind]}
                  {x.province ? ` · ${x.province}` : ''}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

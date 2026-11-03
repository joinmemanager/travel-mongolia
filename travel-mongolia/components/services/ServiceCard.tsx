import React from 'react';

import { placeholderImage } from '@/lib/imageUrl';
import { mapHref, type ProvinceService, SERVICE_ICON } from '@/lib/serviceTypes';

// Нэг үйлчилгээний карт: аймгийн хуудас, /plan/useful-services хоёуланд.
export default function ServiceCard({ item: x, aimag }: { item: ProvinceService; aimag?: string }) {
  const where = [x.soum && `${x.soum} сум`, x.location].filter(Boolean).join('. ');
  return (
    <li className="flex gap-3 p-3 bg-white rounded-2xl border border-neutral-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={x.image || placeholderImage(SERVICE_ICON[x.type])} alt={x.name} loading="lazy" className="object-cover w-16 h-16 rounded-xl shrink-0 bg-neutral-100" />
      <div className="min-w-0 text-sm">
        <p className="font-bold leading-snug text-neutral-900">{x.name}</p>
        {aimag && <p className="mt-0.5 text-xs font-semibold text-[#15803d]">{aimag}</p>}
        {where && <p className="mt-0.5 text-xs text-neutral-500">{where}</p>}
        {x.phones.map((p) => (
          <a key={p} href={`tel:+976${p}`} className="inline-block mt-1 mr-2 text-xs font-semibold text-[#15803d] hover:underline">
            {p}
          </a>
        ))}
        {typeof x.lat === 'number' && (
          <a href={mapHref(x)} target="_blank" rel="noreferrer" className="inline-block mt-1 text-xs font-semibold text-[#15803d] hover:underline">
            Газрын зураг ↗
          </a>
        )}
      </div>
    </li>
  );
}

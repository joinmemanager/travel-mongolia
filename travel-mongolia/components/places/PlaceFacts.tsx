import Link from 'next/link';
import React from 'react';

import { CATEGORY_INFO, provinceAnchor, type PlaceSummary } from '@/lib/tourismPlaces';

// Газрын товч мэдээлэл: ангилал (жагсаалт руу холбоостой), харьяалах аймаг (аймгийн хуудас руу), сум
export default function PlaceFacts({ place }: { place: PlaceSummary }) {
  const cat =
    place.category === 'city-monument' ? undefined
    : place.category === 'heritage-site' ? { label: 'Түүх, соёлын дурсгалт газар', href: '/destination/heritage' }
    : CATEGORY_INFO[place.category];
  return (
    <div className="p-5 rounded-2xl border border-neutral-200 bg-neutral-50">
      <h2 className="mb-3 text-sm font-bold text-neutral-900">Товч мэдээлэл</h2>
      <dl className="space-y-3 text-sm">
        {cat && (
          <div>
            <dt className="text-xs font-bold tracking-wider uppercase text-neutral-500">Ангилал</dt>
            <dd>
              <Link href={cat.href} className="font-semibold text-[#15803d] hover:underline">
                {cat.label}
              </Link>
            </dd>
          </div>
        )}
        {place.provinceTitle && (
          <div>
            <dt className="text-xs font-bold tracking-wider uppercase text-neutral-500">Харьяалах аймаг</dt>
            <dd>
              {place.provinceSlug ? (
                <Link href={`/province/${place.provinceSlug}#${provinceAnchor(place.category)}`} className="font-semibold text-[#15803d] hover:underline">
                  {place.provinceTitle}
                </Link>
              ) : (
                place.provinceTitle
              )}
            </dd>
          </div>
        )}
        {place.soum && (
          <div>
            <dt className="text-xs font-bold tracking-wider uppercase text-neutral-500">Сум, дүүрэг</dt>
            <dd className="text-neutral-800">{place.soum}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

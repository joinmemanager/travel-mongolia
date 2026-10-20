import Link from 'next/link';
import React from 'react';

import ImageCard from '@/components/design/ImageCard';
import { CATEGORY_INFO, type PlaceSummary } from '@/lib/tourismPlaces';

// TIC-ээс шилжүүлсэн газруудын зурагтай картын тор (тусгай хамгаалалттай газар, музей, рашаан г.м.).
// eyebrow: аймаг (эсвэл ангилал). Зураггүй газар бараан дэвсгэртэй харагдана.
export default function PlaceList({
  places,
  eyebrow = 'province',
  columns = 3,
}: {
  places: PlaceSummary[];
  eyebrow?: 'province' | 'category' | 'both';
  columns?: 2 | 3;
}) {
  if (places.length === 0) return null;
  const label = (p: PlaceSummary) => {
    const cat = p.category === 'city-monument' ? 'Хотын дурсгалт газар' : CATEGORY_INFO[p.category]?.label;
    const prov = p.provinceTitle;
    if (eyebrow === 'category') return cat;
    if (eyebrow === 'both') return [cat, prov].filter(Boolean).join(' · ');
    return prov;
  };
  return (
    <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 ${columns === 3 ? 'lg:grid-cols-3' : ''}`}>
      {places.map((p) => (
        <ImageCard
          key={p.id}
          href={p.href}
          image={p.image ? { src: p.image.src, alt: p.image.alt } : undefined}
          title={p.title}
          eyebrow={label(p)}
          cta="Дэлгэрэнгүй"
          aspect="aspect-[4/3]"
        />
      ))}
    </div>
  );
}

// Нэр, аймгийн энгийн жагсаалт (олон газартай хэсэгт, жишээ нь аймгийн хуудсанд)
export function PlaceLinkList({ places }: { places: PlaceSummary[] }) {
  if (places.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {places.map((p) => (
        <li key={p.id}>
          <Link
            href={p.href}
            className="flex gap-3 justify-between items-center p-4 bg-white rounded-xl border transition-colors border-neutral-200/50 hover:border-[#15803d]"
          >
            <span className="font-medium text-neutral-900">{p.title}</span>
            <span className="text-sm font-semibold whitespace-nowrap text-[#15803d]">Дэлгэрэнгүй →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

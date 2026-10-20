import Link from 'next/link';
import React from 'react';

import { cdnImage } from '@/lib/imageUrl';
import type { Species } from '@/lib/species';

// Тусдаа хуудастай амьтан, ургамлын зурагтай картууд (нэр, латин нэр)
export default function SpeciesCards({ items }: { items: Species[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((s) => (
        <li key={s.id} id={s.slug} className="scroll-mt-[calc(var(--nav-h)+7rem)]">
          <Link href={s.href} className="block overflow-hidden h-full bg-white rounded-2xl border transition-colors group border-neutral-200 hover:border-[#15803d]">
            <div className="overflow-hidden aspect-[4/3] bg-neutral-100">
              {s.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cdnImage(s.image.src, 480)}
                  alt={s.title}
                  loading="lazy"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-3 sm:p-4">
              <span className="block font-bold leading-snug text-neutral-900">{s.title}</span>
              {s.latinName && (
                <span className="block mt-0.5 text-xs italic sm:text-sm text-neutral-500" translate="no">
                  {s.latinName}
                </span>
              )}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

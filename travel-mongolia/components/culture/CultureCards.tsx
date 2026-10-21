import Link from 'next/link';
import React from 'react';

import type { CultureArticle } from '@/lib/cultureArticles';
import { cdnImage } from '@/lib/imageUrl';

// cultureArticle-ийн жагсаалт: зурагтай нь карт, зураггүй нь энгийн мөр
export default function CultureCards({ items }: { items: CultureArticle[] }) {
  if (items.length === 0) {
    return <p className="text-neutral-500">Нийтлэл удахгүй нэмэгдэнэ.</p>;
  }
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {items.map((a) => (
        <li key={a.id} id={a.slug} className="scroll-mt-[calc(var(--nav-h)+7rem)]">
          <Link href={a.href} className="flex overflow-hidden flex-col h-full bg-white rounded-2xl border transition-colors group border-neutral-200 hover:border-[#15803d]">
            <div className="overflow-hidden aspect-[4/3] bg-neutral-100">
              {a.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cdnImage(a.image.src, 480)}
                  alt={a.title}
                  loading="lazy"
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <span className="block p-3 font-bold leading-snug sm:p-4 text-neutral-900">{a.title}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

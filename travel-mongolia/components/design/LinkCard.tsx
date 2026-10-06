import Link from 'next/link';
import React from 'react';

import { liveHref } from '@/lib/navigation';

export interface LinkCardItem {
  label: string;
  href: string;
  desc?: string;
}

// в. Холбоосны карт: цагаан карт, дотроо цайвар холбоосны хайрцагнууд (→ сумтай).
// Production дээр нийтлэгдээгүй хуудас руу заасан холбоос харагдахгүй (liveHref).
export default function LinkCard({
  title,
  links,
  columns = 2,
  bare = false,
}: {
  title?: string;
  links: LinkCardItem[];
  columns?: 2 | 3;
  // Аль хэдийн цагаан карт дотор байвал гадна картгүйгээр зөвхөн хайрцагнуудыг харуулна
  bare?: boolean;
}) {
  const live = links.filter((link) => liveHref(link.href));
  if (live.length === 0) return null;

  return (
    <div className={bare ? '' : 'p-8 bg-white rounded-3xl border shadow-sm sm:p-10 border-neutral-200/80'}>
      {title && <h2 className="mb-4 text-lg font-black text-neutral-900">{title}</h2>}
      <ul className={`grid grid-cols-1 gap-3 ${columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2'}`}>
        {live.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex gap-3 justify-between items-center p-4 h-full text-sm font-semibold text-neutral-800 rounded-2xl border transition-colors bg-[#fcfbf9] border-neutral-200 hover:border-[#15803d] hover:text-[#15803d]"
            >
              <span>
                {link.label}
                {link.desc && (
                  <span className="block mt-0.5 text-xs font-normal text-neutral-500">{link.desc}</span>
                )}
              </span>
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

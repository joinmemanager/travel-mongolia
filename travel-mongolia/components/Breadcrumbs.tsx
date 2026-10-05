import Link from 'next/link';
import React from 'react';

import { liveHref } from '@/lib/navigation';
import { SITE_URL } from '@/lib/seo';

export interface Crumb {
  label: string;
  href: string;
}

// Хуудасны дээд талын замчлал + Google-д зориулсан BreadcrumbList бүтэцтэй өгөгдөл.
// Сүүлийн элемент нь одоогийн хуудас (холбоосгүй).
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: `${SITE_URL}${item.href === '/' ? '' : item.href}`,
    })),
  };

  return (
    <nav aria-label="Замчлал" className="mb-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap gap-1.5 items-center text-xs text-neutral-500">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.href} className="flex gap-1.5 items-center">
              {/* Сүүлийн элемент эсвэл production дээр нийтлэгдээгүй хуудас: холбоосгүй */}
              {isLast || !liveHref(item.href) ? (
                <>
                  <span
                    aria-current={isLast ? 'page' : undefined}
                    className={isLast ? 'font-semibold text-neutral-800' : ''}
                  >
                    {item.label}
                  </span>
                  {!isLast && <span aria-hidden="true" className="text-neutral-300">/</span>}
                </>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-[#15803d] transition-colors">
                    {item.label}
                  </Link>
                  <span aria-hidden="true" className="text-neutral-300">/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

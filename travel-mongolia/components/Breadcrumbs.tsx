import Link from 'next/link';
import React from 'react';

import { liveHref } from '@/lib/navigation';
import { SITE_URL } from '@/lib/seo';

export interface Crumb {
  label: string;
  href: string;
}

const TONES = {
  // Цөцгий дэвсгэр
  light: {
    link: 'text-ink-muted hover:text-gold-ink',
    current: 'font-semibold text-ink',
    plain: 'text-ink-muted',
    sep: 'text-gold',
  },
  // Зурган hero дээр (бараан градиент)
  dark: {
    link: 'text-white/80 hover:text-white',
    current: 'font-semibold text-white',
    plain: 'text-white/80',
    sep: 'text-gold',
  },
};

// Хуудасны дээд талын замчлал + Google-д зориулсан BreadcrumbList бүтэцтэй өгөгдөл.
// Сүүлийн элемент нь одоогийн хуудас (холбоосгүй).
export default function Breadcrumbs({
  items,
  tone = 'light',
}: {
  items: Crumb[];
  tone?: 'light' | 'dark';
}) {
  const t = TONES[tone];
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
    <nav aria-label="Замчлал" className="mb-5">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ol className="flex flex-wrap gap-1.5 items-center text-xs">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          // Сүүлийн элемент эсвэл production дээр нийтлэгдээгүй хуудас: холбоосгүй
          const linked = !isLast && liveHref(item.href);
          return (
            <li key={item.href} className="flex gap-1.5 items-center">
              {linked ? (
                <Link href={item.href} className={`${t.link} transition-colors`}>
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? t.current : t.plain}
                >
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className={t.sep}>/</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

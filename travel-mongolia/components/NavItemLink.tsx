import Link from 'next/link';
import React from 'react';

import { isPreviewEnv, type NavItem, type NavStatus } from '@/lib/navigation';

// Төлөвийн тэмдгийн өнгө: цэсний цагаан, footer-ийн бараан дэвсгэрт тус тусдаа
const BADGE_COLORS: Record<'light' | 'dark', Record<Exclude<NavStatus, 'live'>, string>> = {
  light: {
    planned: 'text-amber-800 bg-amber-100',
    draft: 'text-sky-800 bg-sky-100',
    soft: 'text-emerald-800 bg-emerald-100',
  },
  dark: {
    planned: 'text-amber-200 bg-amber-900/40',
    draft: 'text-sky-200 bg-sky-900/40',
    soft: 'text-emerald-200 bg-emerald-900/40',
  },
};

const BADGE_TEXT = {
  planned: { mn: 'Тун удахгүй', en: 'Coming soon' },
  draft: { mn: 'Ноорог', en: 'Draft' },
  // soft: production дээр тэмдэггүй, preview дээр л "Хэсэгчлэн" гэж харагдана
  soft: { mn: 'Хэсэгчлэн', en: 'Soft' },
};

// Цэс, footer-ийн нэг холбоос. Production дээр зөвхөн live зүйлс ирнэ. Preview дээр:
//   draft   - дарагддаг холбоос + "Ноорог" тэмдэг
//   planned - холбоосгүй, "Тун удахгүй" тэмдэгтэй, дарахад юу ч болохгүй
//   soft    - энгийн холбоос (production дээр ч), preview дээр "Хэсэгчлэн" тэмдэгтэй
export default function NavItemLink({
  item,
  className,
  badgeClassName,
  tone = 'light',
  onClick,
  english = false,
  children,
}: {
  item: NavItem;
  className: string;
  // Тэмдгийн хэмжээ, зай (өнгийг төлөвөөр нь энд сонгоно)
  badgeClassName: string;
  tone?: 'light' | 'dark';
  onClick?: () => void;
  english?: boolean;
  children: React.ReactNode;
}) {
  const badge =
    item.status === 'live' || (item.status === 'soft' && !isPreviewEnv()) ? null : (
      <span className={`${badgeClassName} ${BADGE_COLORS[tone][item.status]}`}>
        {english ? BADGE_TEXT[item.status].en : BADGE_TEXT[item.status].mn}
      </span>
    );

  if (item.status === 'planned') {
    return (
      <span aria-disabled="true" className={`${className} cursor-not-allowed opacity-60`}>
        {children}
        {badge}
      </span>
    );
  }

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener" onClick={onClick} className={className}>
        {children}
        <span aria-hidden="true"> ↗</span>
        {badge}
      </a>
    );
  }

  // mailto: гэх мэт сайтаас гадуурх энгийн холбоос
  if (!item.href.startsWith('/')) {
    return (
      <a href={item.href} onClick={onClick} className={className}>
        {children}
        {badge}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {children}
      {badge}
    </Link>
  );
}

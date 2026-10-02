import Link from 'next/link';
import React from 'react';

import type { NavItem } from '@/lib/navigation';

// Цэс, footer-ийн нэг холбоос. Бэлэн биш зүйл (зөвхөн preview дээр ирдэг) нь
// холбоосгүй, "Тун удахгүй" тэмдэгтэй, дарахад юу ч болохгүй.
export default function NavItemLink({
  item,
  className,
  comingSoonClassName,
  onClick,
  english = false,
  children,
}: {
  item: NavItem;
  className: string;
  comingSoonClassName: string;
  onClick?: () => void;
  english?: boolean;
  children: React.ReactNode;
}) {
  if (!item.ready) {
    return (
      <span aria-disabled="true" className={`${className} cursor-not-allowed opacity-60`}>
        {children}
        <span className={comingSoonClassName}>{english ? 'Coming soon' : 'Тун удахгүй'}</span>
      </span>
    );
  }

  if (item.external) {
    return (
      <a href={item.href} target="_blank" rel="noopener" onClick={onClick} className={className}>
        {children}
        <span aria-hidden="true"> ↗</span>
      </a>
    );
  }

  // mailto: гэх мэт сайтаас гадуурх энгийн холбоос
  if (!item.href.startsWith('/')) {
    return (
      <a href={item.href} onClick={onClick} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}

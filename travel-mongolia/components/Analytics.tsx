'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { isJoinmeUrl } from '@/lib/booking';

// GA4 контентын хэмжилт (docs/analytics.md). app/layout.tsx-ийн GA tag-д хүрэхгүй:
// тэр tag-ийн үүсгэсэн window.dataLayer / gtag-ийг л ашиглана. Footer дотор (бүх хуудсанд) байрлана.
//
// 1. Хуудас бүр: dataLayer-т { content_id, content_type, province } (event: content_context),
//    gtag('set', ...) (дараагийн event-үүдэд хавсарна), gtag('event', 'content_view', ...).
//    Дэлгэрэнгүй хуудсууд <ContentContext>-оор утгаа өгнө, бусад нь хаягаас тооцоологдоно.
// 2. Event-ууд: click_to_experience, click_to_provider, booking_click, view_respect_guide.
// 3. joinme_click: joinme.mn руу очих аливаа холбоос. Дээрх event-ээс тусдаа, нэг дарахад нэг удаа.

export interface ContentContextValue {
  content_id: string;
  content_type: string;
  province?: string;
}

// Дэлгэрэнгүй хуудас (Contentful entry) өөрийн контентын мэдээллийг өгнө. Server компонентод ч ажиллана.
export function ContentContext({ value }: { value: ContentContextValue }) {
  return <span hidden data-content-context={JSON.stringify(value)} />;
}

// Хаягийн эхний хэсгээр ангилна (ContentContext байхгүй хуудсанд)
const TYPE_BY_SECTION: Record<string, string> = {
  '': 'home',
  about: 'article',
  plan: 'guide',
  respect: 'guide',
  'things-to-do': 'listing',
  inspiration: 'listing',
  destination: 'place',
  province: 'province',
  recommendation: 'event',
  local: 'local',
  stories: 'story',
  impact: 'hub',
  planner: 'tool',
};

const LOCAL_CATEGORIES = ['guides', 'herder-families', 'artisans', 'food', 'products', 'experiences'];

function contextFromPath(path: string): ContentContextValue {
  const section = path.split('/')[1] || '';
  return { content_id: path, content_type: TYPE_BY_SECTION[section] || 'page', province: '' };
}

function readContext(path: string): ContentContextValue {
  const el = document.querySelector('[data-content-context]');
  if (el) {
    try {
      const v = JSON.parse(el.getAttribute('data-content-context') || '');
      return { content_id: v.content_id || path, content_type: v.content_type || 'page', province: v.province || '' };
    } catch {
      // буруу JSON бол хаягаас
    }
  }
  return contextFromPath(path);
}

// GA tag-ийн gtag() байхгүй үед ч dataLayer-т ижил хэлбэрээр (arguments) хийнэ
function gtag(..._args: any[]) {
  const w = window as any;
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}

// Холбоосны хаягаас event таних (data-ga-event байхгүй үед)
function eventFromHref(href: string): string {
  let path = '';
  try {
    const u = new URL(href, window.location.origin);
    if (u.origin !== window.location.origin) return '';
    path = u.pathname;
  } catch {
    return '';
  }
  const parts = path.split('/').filter(Boolean);
  if (parts[0] !== 'local') return '';
  if (parts[1] === 'experiences' && parts[2]) return 'click_to_experience';
  if (parts.length === 2 && !LOCAL_CATEGORIES.includes(parts[1])) return 'click_to_provider';
  return '';
}

const cleanText = (el: Element | null | undefined) => (el?.textContent || '').replace(/\s+/g, ' ').replace('↗', '').trim();

// joinme_click-ийн параметр. Товч өөрөө data-joinme-type / data-joinme-name өгч болно (FactsCard, RelatedBookings).
// Үгүй бол: цэс, footer дахь холбоос = nav + холбоосны текст; бусад нь хуудасны content_type,
// дэлгэрэнгүй хуудасны гарчиг (h1), эсвэл холбоосны текст.
function joinmeParams(link: HTMLAnchorElement, ctx: ContentContextValue) {
  const base = { link_url: link.href, page_path: window.location.pathname };
  const type = link.getAttribute('data-joinme-type');
  const name = link.getAttribute('data-joinme-name');
  if (!type && !name && link.closest('header, footer')) {
    return { ...base, content_type: 'nav', item_name: cleanText(link) };
  }
  const isDetail = !!document.querySelector('[data-content-context]');
  return {
    ...base,
    content_type: type || ctx.content_type,
    item_name: name || (isDetail ? cleanText(document.querySelector('main h1, h1')) : '') || cleanText(link),
  };
}

export default function Analytics() {
  const pathname = usePathname();

  // 1. Хуудасны контентын мэдээлэл
  useEffect(() => {
    if (!pathname) return;
    const ctx = readContext(pathname);
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: 'content_context', ...ctx });
    gtag('set', ctx);
    gtag('event', 'content_view', ctx);
    if (pathname === '/respect' || pathname.startsWith('/respect/')) {
      gtag('event', 'view_respect_guide', ctx);
    }
  }, [pathname]);

  // 2. Товшилтын event-ууд
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // auxclick: зөвхөн дунд товч (шинэ tab). Зүүн товч click-ээр ирнэ, давхардахгүй.
      if (e.type === 'auxclick' && e.button !== 1) return;
      const target = e.target as Element | null;
      if (!target) return;
      const tagged = target.closest('[data-ga-event]');
      const link = target.closest('a');
      if (link && isJoinmeUrl(link.href)) {
        gtag('event', 'joinme_click', joinmeParams(link, readContext(window.location.pathname)));
      }
      if (e.type === 'auxclick') return;
      const name = tagged?.getAttribute('data-ga-event') || (link ? eventFromHref(link.href) : '');
      if (!name) return;
      let params: Record<string, any> = {};
      try {
        params = JSON.parse(tagged?.getAttribute('data-ga-params') || '{}');
      } catch {
        params = {};
      }
      const ctx = readContext(window.location.pathname);
      gtag('event', name, { ...ctx, ...params, link_url: link?.href || '' });
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, []);

  return null;
}

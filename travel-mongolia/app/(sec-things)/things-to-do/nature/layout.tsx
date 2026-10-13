import { metaFor } from '@/lib/pageMeta';

// Хуудас ?cat= (?style=, ?days= г.м.) параметрийг useSearchParams-аар уншдаг тул хүсэлт бүрт render хийнэ.
// Статик болговол server HTML-д агуулга (H1) орохгүй болно (docs/plan/performance.md).
export const dynamic = 'force-dynamic';

export const metadata = metaFor('/things-to-do/nature');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

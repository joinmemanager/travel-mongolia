import { metaFor } from '@/lib/pageMeta';

// 2026-11-06-ноос статик/ISR: ?cat= (?style=, ?days= г.м.) параметрийг жагсаалтын Suspense доторх хэсэг уншина,
// server HTML-д «Бүгд»-ийн бүтэн агуулга орно (Vercel CPU-г хэмнэх; docs/plan/performance.md).

export const metadata = metaFor('/things-to-do/nature');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

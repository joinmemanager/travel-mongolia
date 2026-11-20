'use client';

import React, { useEffect, useRef, useState } from 'react';

import { statText, type SiteStatsData, type StatItem } from '@/lib/statsFormat';

// Footer-ийн дээрх статистик. Өгөгдөл: lib/siteStats.ts (server), JS ачаалагдсаны дараа /api/stats-аас
// шинэчилнэ (хуудас 7 хоногт нэг үүсдэг тул зочдын тоо хоцрохгүй).
// Хөдөлгөөн: server HTML-д эцсийн тоо (SEO, JS-гүй үед). JS ачаалагдахад хэсэг дэлгэцээс гадуур бол тоог 0
// болгоод, анх харагдах үед 1.5 секундэд ease-out-аар өсгөнө (нэг л удаа). prefers-reduced-motion үед хөдлөхгүй.
// Тоо бүр эцсийн утгынхаа өргөнийг (ch) урьдчилан эзэлнэ, tabular-nums тул CLS 0.

const DURATION = 1500;
const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);

function Num({ item, progress, className }: { item: StatItem; progress: number; className: string }) {
  const final = statText(item);
  return (
    <span
      translate="no"
      className={`notranslate inline-block tabular-nums ${className}`}
      style={{ minWidth: `${final.length}ch` }}
    >
      {progress >= 1 ? final : statText(item, item.value * progress)}
    </span>
  );
}

export default function SiteStats({ initial }: { initial: SiteStatsData }) {
  const [data, setData] = useState(initial);
  const [progress, setProgress] = useState(1);
  const ref = useRef<HTMLElement>(null);

  // Хамгийн сүүлийн (өдөрт 1 удаа кэшлэгдсэн) тоо
  useEffect(() => {
    let alive = true;
    fetch('/api/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: SiteStatsData | null) => {
        if (alive && d && Array.isArray(d.content)) setData(d);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let first = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (first) {
          first = false;
          // Ачаалахад аль хэдийн харагдаж байвал эцсийн тоогоор үлдээнэ (анивчихгүй)
          if (entry.isIntersecting) return io.disconnect();
          setProgress(0);
          return;
        }
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / DURATION);
          setProgress(p >= 1 ? 1 : easeOut(p));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const { visitors, content } = data;
  if (!visitors?.length && !content.length) return null;

  return (
    <section ref={ref} aria-label="Сайтын статистик" className="bg-[#f5f5f2] border-t border-neutral-200">
      <div className="px-6 py-10 mx-auto space-y-8 max-w-7xl sm:px-10 lg:px-16">
        {visitors && visitors.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
            {visitors.map((item) => (
              <li key={item.key} className="flex flex-col">
                <Num item={item} progress={progress} className="text-[28px] font-medium leading-none text-neutral-900 sm:text-[32px]" />
                <span className="mt-2 text-sm text-neutral-600">{item.label}</span>
                {item.note && <span className="mt-0.5 text-xs text-neutral-500">{item.note}</span>}
              </li>
            ))}
          </ul>
        )}
        {content.length > 0 && (
          <ul
            className={`grid grid-cols-6 gap-x-4 gap-y-5 md:grid-cols-5 ${
              visitors?.length ? 'pt-6 border-t border-neutral-200' : ''
            }`}
          >
            {content.map((item, i) => (
              <li key={item.key} className={`flex flex-col md:col-span-1 ${i < 3 ? 'col-span-2' : 'col-span-3'}`}>
                <Num item={item} progress={progress} className="text-xl font-semibold leading-none text-[#15803d]" />
                <span className="mt-1.5 text-xs text-neutral-600">{item.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

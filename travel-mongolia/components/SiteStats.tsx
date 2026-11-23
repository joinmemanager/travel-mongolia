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
  // Хайрцгийн өргөнийг эцсийн тоо (::before, data-final) тогтооно. Тоолж буй тоо тэр хайрцагт зүүнээс эхэлдэг
  // тул текстийн эхлэх цэг хөдлөхгүй (CLS 0). Псевдо-элементийн текст индекслэгдэхгүй тул тоо давхардахгүй.
  return (
    <span
      translate="no"
      data-final={final}
      className={`notranslate inline-grid tabular-nums before:invisible before:content-[attr(data-final)] before:[grid-area:1/1] ${className}`}
    >
      <span className="[grid-area:1/1] text-left">{progress >= 1 ? final : statText(item, item.value * progress)}</span>
    </span>
  );
}

// Сайтын бусад icon-той ижил хэв маяг (Heroicons outline, 24×24, stroke; жишээ нь Navbar-ийн байршлын тэмдэг)
const ICON_PATHS: Record<string, string[]> = {
  // Газрын зураг
  provinces: ['M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z'],
  // Байршлын тэмдэг
  soums: ['M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z', 'M14.5 10a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'],
  // Баримт
  pages: ['M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z'],
  // Зураг
  images: ['m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z'],
  // Хэл
  languages: ['m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802'],
  // Зочид: хүмүүс, нүд, хуанли, график
  total: ['M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z'],
  yesterday: ['M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'],
  week: ['M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5'],
  month: ['M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z'],
};

function StatIcon({ name }: { name: string }) {
  const paths = ICON_PATHS[name];
  if (!paths) return null;
  return (
    <svg aria-hidden="true" className="mx-auto mb-3 w-6 h-6 text-[#C0DD97]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      {paths.map((d) => (
        <path key={d} strokeLinecap="round" strokeLinejoin="round" d={d} />
      ))}
    </svg>
  );
}

// Нэг мөр: гар утсанд grid (дээд мөр 2×2, доод мөр 3+2, тусгаарлагчгүй), компьютерт тэнцүү өргөнтэй багана, хооронд нь
// нимгэн хагас тунгалаг цагаан босоо тусгаарлагч.
function StatRow({ items, progress, big }: { items: StatItem[]; progress: number; big: boolean }) {
  return (
    <ul
      className={`grid gap-y-9 md:divide-x md:divide-white/25 ${
        big ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-6 md:grid-cols-5'
      }`}
    >
      {items.map((item, i) => (
        <li
          key={item.key}
          className={`flex flex-col items-center px-1 text-center md:col-span-1 md:px-6 ${
            big ? '' : i < 3 ? 'col-span-2' : 'col-span-3'
          }`}
        >
          <StatIcon name={item.key} />
          <Num
            item={item}
            progress={progress}
            className={`font-extrabold leading-none text-white ${
              big ? 'text-[34px] md:text-[52px]' : 'text-[30px] sm:text-[32px] md:text-[46px]'
            }`}
          />
          <span className="mt-2.5 text-sm text-[#C0DD97] md:text-[15px]">{item.label}</span>
          {item.note && <span className="mt-1 text-xs text-[#C0DD97]">{item.note}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function SiteStats({ initial }: { initial: SiteStatsData }) {
  const [data, setData] = useState(initial);
  const [progress, setProgress] = useState(1);
  const ref = useRef<HTMLElement>(null);
  const hasData = !!data.visitors?.length || data.content.length > 0;

  // Хамгийн сүүлийн (өдөрт 1 удаа кэшлэгдсэн) тоо. Хоосон хариугаар (Contentful түр алдаа) байгаа тоог
  // дарахгүй. Server HTML хоосон ирсэн хуудсанд (build үеийн 429) хэсэг эндээс нөхөгдөнө.
  useEffect(() => {
    let alive = true;
    fetch('/api/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: SiteStatsData | null) => {
        if (alive && d && Array.isArray(d.content) && (d.content.length > 0 || !!d.visitors?.length)) setData(d);
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
  }, [hasData]);

  const { visitors, content } = data;
  if (!hasData) return null;

  return (
    // Сайтын хамгийн бараан ногоон (#14532d, Tailwind green-900), footer-ийн бараан хэсгийн шууд дээр.
    // Ялгарал (WCAG AA): цагаан 9.1:1, шошгоны #C0DD97 6.1:1.
    <section ref={ref} aria-labelledby="site-stats-title" className="bg-[#14532d] text-white">
      <div className="px-4 py-14 mx-auto max-w-6xl sm:px-10 md:py-16 lg:px-16">
        <h2 id="site-stats-title" className="mb-10 text-2xl font-extrabold tracking-tight text-center text-white md:mb-12 md:text-3xl">
          Монголыг нэг дор
        </h2>
        {visitors && visitors.length > 0 && (
          <>
            <StatRow items={visitors} progress={progress} big />
            <hr className="my-10 mx-auto max-w-4xl border-0 border-t border-white/20 md:my-12" />
          </>
        )}
        {content.length > 0 && <StatRow items={content} progress={progress} big={false} />}
      </div>
    </section>
  );
}

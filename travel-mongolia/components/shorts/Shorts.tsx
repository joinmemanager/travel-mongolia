'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  SHORTS_PER_ROW,
  type Short,
  type ShortsCategory,
  shortsHref,
  shortThumb,
  shortThumbFallback,
  youtubeEmbedUrl,
  youtubeShortUrl,
} from '@/lib/shorts';

// YouTube Shorts-ийн босоо картууд + сайт дотор тоглуулах modal (lib/shorts.ts).
// iframe нь modal нээгдэх хүртэл ачаалагдахгүй, хаахад устгагдана (бичлэг зогсоно).
// GA4: картын shorts_play, «Бүгдийг үзэх»-ийн shorts_view_all (data-ga-event, components/Analytics.tsx).

// Нүүр зураг: oardefault (босоо) байхгүй бол hqdefault. Байхгүй үед YouTube 404-тэй хамт 120×90
// саарал зураг буцаадаг (onError ажиллахгүй) тул ачаалсны дараа хэмжээг нь шалгана. Зураг
// hydration-оос өмнө ачаалагдсан байж болох тул mount үед ч шалгана. Vercel Image Optimization ашиглахгүй.
function ShortThumb({ id }: { id: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const fallback = useCallback(() => {
    const img = ref.current;
    if (img && !img.src.endsWith('/hqdefault.jpg')) img.src = shortThumbFallback(id);
  }, [id]);
  const check = useCallback(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth <= 120) fallback();
  }, [fallback]);
  useEffect(check, [check]);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={shortThumb(id)}
      onLoad={check}
      onError={fallback}
      alt=""
      loading="lazy"
      decoding="async"
      className="object-cover absolute inset-0 w-full h-full transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
    />
  );
}

function ShortCard({ video, category, onPlay }: { video: Short; category: string; onPlay: () => void }) {
  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`${video.title} — бичлэг тоглуулах`}
      aria-haspopup="dialog"
      data-ga-event="shorts_play"
      data-ga-params={JSON.stringify({ video_id: video.id, video_title: video.title, category })}
      className="group overflow-hidden relative w-full text-left rounded-2xl shadow-xs transition-all duration-300 aspect-[9/16] bg-neutral-900 hover:shadow-lg hover:scale-[1.03] focus-visible:shadow-lg focus-visible:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:ring-offset-2"
    >
      <ShortThumb id={video.id} />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t to-transparent from-black/80 via-black/10" />
      <span
        aria-hidden="true"
        className="flex absolute top-1/2 left-1/2 justify-center items-center w-12 h-12 text-white rounded-full backdrop-blur-sm transition-colors -translate-x-1/2 -translate-y-1/2 bg-black/45 group-hover:bg-[#15803d] group-focus-visible:bg-[#15803d]"
      >
        <svg viewBox="0 0 24 24" className="ml-0.5 w-5 h-5" fill="currentColor">
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </span>
      <span className="absolute right-0 bottom-0 left-0 p-3 text-xs font-bold leading-snug text-white sm:text-sm line-clamp-3">
        {video.title}
      </span>
    </button>
  );
}

// «Бүгдийг үзэх» карт: уулын жагсаалтын «+N тогтоц / Бүх лавлах сан» (DirectoryGroupSection)-ийн загвар
function ViewAllCard({ category, remaining }: { category: ShortsCategory; remaining: number }) {
  return (
    <Link
      href={shortsHref(category.slug)}
      data-ga-event="shorts_view_all"
      data-ga-params={JSON.stringify({ category: category.slug })}
      className="group flex flex-col justify-center items-center p-4 text-center rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer aspect-[9/16] bg-emerald-50/70 border-emerald-300 shadow-xs hover:border-[#15803d] hover:bg-emerald-100/70 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d] focus-visible:ring-offset-2"
    >
      <span className="flex justify-center items-center mb-4 w-12 h-12 text-white rounded-full shadow-md transition-all sm:w-14 sm:h-14 bg-[#15803d] group-hover:scale-110 group-hover:bg-emerald-800">
        <svg aria-hidden="true" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </span>
      {remaining > 0 && (
        <span className="text-base font-black tracking-wider text-[#15803d] sm:text-lg">+{remaining} бичлэг</span>
      )}
      <span className="mt-1 text-sm font-extrabold text-neutral-900 sm:text-base">Бүгдийг үзэх</span>
      <span className="mt-2 text-[11px] font-medium leading-snug text-neutral-500 sm:text-xs">
        {category.title}-ийн бүх богино бичлэг
      </span>
    </Link>
  );
}

const FOCUSABLE = 'button, [href], iframe, [tabindex]:not([tabindex="-1"])';

function ShortsModal({
  videos,
  index,
  onIndex,
  onClose,
}: {
  videos: Short[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const video = videos[index];
  const count = videos.length;
  const prev = () => onIndex((index - 1 + count) % count);
  const next = () => onIndex((index + 1) % count);

  // Нээгдэхэд хаах товч дээр focus, арын хуудас гүйлгэгдэхгүй; хаахад өмнөх focus руу буцна
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onIndex((index - 1 + count) % count);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onIndex((index + 1) % count);
      } else if (e.key === 'Tab') {
        // Focus modal дотроо эргэлдэнэ
        const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) || []);
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && (active === first || !dialogRef.current?.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialogRef.current?.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [index, count, onIndex, onClose]);

  const arrow =
    'flex shrink-0 justify-center items-center w-10 h-10 text-white rounded-full transition-colors sm:w-12 sm:h-12 bg-white/10 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white';

  // body руу: эцэг элементийн transform/overflow fixed байрлалд нөлөөлөхгүй
  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Богино бичлэг: ${video.title}`}
      className="flex fixed inset-0 z-[100] flex-col justify-center items-center p-4 bg-black/90"
      onClick={(e) => {
        // Дэвсгэр (бичлэг, товчноос гадуур) дээр дарахад хаагдана
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.backdrop) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Хаах"
        className="flex absolute top-3 right-3 justify-center items-center w-11 h-11 text-2xl text-white rounded-full transition-colors sm:top-5 sm:right-5 bg-white/10 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span aria-hidden="true">×</span>
      </button>

      <div data-backdrop="1" className="flex gap-2 items-center sm:gap-6">
        <button type="button" onClick={prev} aria-label="Өмнөх бичлэг" className={arrow}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        {/* 9:16, дэлгэцийн өндөр болон өргөнд (сумтай нь) багтана */}
        <div
          className="overflow-hidden bg-black rounded-2xl shadow-2xl aspect-[9/16]"
          style={{ height: 'min(calc(100dvh - 9rem), calc((100vw - 8rem) * 16 / 9))' }}
        >
          <iframe
            key={video.id}
            src={youtubeEmbedUrl(video.id)}
            title={video.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <button type="button" onClick={next} aria-label="Дараагийн бичлэг" className={arrow}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div data-backdrop="1" className="px-2 mt-3 max-w-md text-center">
        <p className="text-sm font-bold text-white sm:text-base">{video.title}</p>
        <p data-backdrop="1" className="mt-1 text-xs text-neutral-400">
          <span data-backdrop="1">{index + 1} / {count}</span>
          <span aria-hidden="true" data-backdrop="1" className="mx-2">·</span>
          <a
            href={youtubeShortUrl(video.id)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white focus-visible:text-white focus-visible:outline-none"
          >
            YouTube-д үзэх<span className="sr-only"> (шинэ цонхонд нээгдэнэ)</span>
          </a>
        </p>
      </div>
    </div>,
    document.body
  );
}

function usePlayer() {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  return { index, setIndex, close };
}

// Нүүр хуудасны нэг мөр: эхний 4 бичлэг + «Бүгдийг үзэх». Утсан дээр хажуу тийш гүйлгэгдэнэ.
export function ShortsRow({ category }: { category: ShortsCategory }) {
  const { index, setIndex, close } = usePlayer();
  const shown = category.videos.slice(0, SHORTS_PER_ROW);
  const cell = 'w-[42%] shrink-0 snap-start md:w-auto';

  return (
    <>
      <div className="flex overflow-x-auto gap-3 px-6 pt-1 pb-3 -mx-6 snap-x snap-mandatory scroll-px-6 sm:gap-4 sm:px-10 sm:-mx-10 sm:scroll-px-10 md:grid md:grid-cols-5 md:overflow-visible md:px-0 md:mx-0 md:pb-1">
        {shown.map((v, i) => (
          <div key={v.id} className={cell}>
            <ShortCard video={v} category={category.slug} onPlay={() => setIndex(i)} />
          </div>
        ))}
        <div className={cell}>
          <ViewAllCard category={category} remaining={category.videos.length - shown.length} />
        </div>
      </div>
      {index !== null && <ShortsModal videos={category.videos} index={index} onIndex={setIndex} onClose={close} />}
    </>
  );
}

// «Бүгдийг үзэх» хуудасны тор: сэдвийн бүх бичлэг
export function ShortsGrid({ category }: { category: ShortsCategory }) {
  const { index, setIndex, close } = usePlayer();
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {category.videos.map((v, i) => (
          <li key={v.id}>
            <ShortCard video={v} category={category.slug} onPlay={() => setIndex(i)} />
          </li>
        ))}
      </ul>
      {index !== null && <ShortsModal videos={category.videos} index={index} onIndex={setIndex} onClose={close} />}
    </>
  );
}

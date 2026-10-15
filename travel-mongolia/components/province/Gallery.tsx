'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { cdnImage } from '@/lib/imageUrl';

export interface GalleryImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

// «Зургийн цомог»: жижиг зургийн сүлжээ, дарахад томруулж харуулна (lightbox: ←/→, Esc).
export default function Gallery({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [index, close, step]);

  const current = index === null ? null : images[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="block overflow-hidden w-full rounded-xl aspect-[4/3] bg-neutral-100 focus-visible:outline-2 focus-visible:outline-[#15803d]"
              aria-label={`Зургийг томруулах: ${img.alt}`}
            >
              <img
                src={cdnImage(img.src, 480)}
                alt={img.alt}
                loading="lazy"
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          className="flex fixed inset-0 z-[100] justify-center items-center p-4 bg-black/90"
          onClick={close}
        >
          <img
            src={cdnImage(current.src, 1600, 80)}
            alt={current.alt}
            className="max-w-full max-h-[85vh] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 w-11 h-11 text-2xl text-white rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Хаах"
          >
            ✕
          </button>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                className="absolute left-3 top-1/2 w-11 h-11 text-2xl text-white rounded-full -translate-y-1/2 bg-white/10 hover:bg-white/20"
                aria-label="Өмнөх зураг"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); step(1); }}
                className="absolute right-3 top-1/2 w-11 h-11 text-2xl text-white rounded-full -translate-y-1/2 bg-white/10 hover:bg-white/20"
                aria-label="Дараагийн зураг"
              >
                ›
              </button>
              <p className="absolute bottom-4 left-1/2 text-sm text-white/80 -translate-x-1/2 tabular-nums">
                {(index ?? 0) + 1} / {images.length}
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
}

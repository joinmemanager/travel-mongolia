'use client';

import React, { useEffect, useRef, useState } from 'react';

// Нүүр хуудасны дэвсгэр видео (docs/plan/performance.md).
// Эхлээд зөвхөн poster (hero.jpg-ийн шахсан WebP хувилбар, морьтой хүү) харагдана. Компьютер дээр видео (WebM, MP4, ~2.5 MB)
// ачаалагдаж тоглоно. Жижиг дэлгэц (767px хүртэл) болон "data saver" горимд видео татагдахгүй.
export default function HeroVideo({ className }: { className: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const small = window.matchMedia('(max-width: 767px)').matches;
    const saveData = (navigator as any).connection?.saveData === true;
    if (!small && !saveData) setPlay(true);
  }, []);

  useEffect(() => {
    if (!play || !ref.current) return;
    ref.current.load();
    ref.current.play().catch(() => {
      // Autoplay хориглогдсон бол poster хэвээр харагдана
    });
  }, [play]);

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      preload={play ? 'auto' : 'none'}
      poster="/hero-poster.webp"
      className={className}
    >
      {play && (
        <>
          <source src="/heroo.webm" type="video/webm" />
          <source src="/heroo.mp4" type="video/mp4" />
        </>
      )}
    </video>
  );
}

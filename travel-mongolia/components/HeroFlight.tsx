'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

import HeroText from './HeroText';
import { liveHref } from '../lib/navigation';

// Нүүр хуудасны "нислэг" hero. 400vh өндөр хэсэг гүйлгэхэд дэлгэц дүүрэн хэсэг наалдаж (sticky),
// гүйлгэлтийн 0–100% нь бичлэгийн эхнээс төгсгөл хүртэлх хугацаа болно. Бичлэг өөрөө хэзээ ч
// тоглохгүй: доош гүйлгэвэл урагшилж, зогсвол зогсож, дээш гүйлгэвэл ухарна.
// - Бичлэг: public/hero/hero-flight-{desktop,mobile}.mp4, хоёулаа 720p (эх файл 720p тул томруулаагүй).
//   6 кадр тутамд keyframe тул currentTime-ийг аль ч кадр руу гацалтгүй үсрүүлнэ (хэмжилт:
//   docs/hero-quality/README.md). Эх файлууд (flight-1/2/3.mp4) git-д ороогүй.
// - Эхлээд зөвхөн poster (эхний кадр, WebP) харагдана, энэ нь LCP. Бичлэгийг хуудас бүрэн
//   ачаалсны дараа бүтнээр нь татаж (blob), бэлэн болмогц poster-ийн оронд гаргана.
// - Утас (767px хүртэл) болон "data saver" горимд илүү шахсан mobile хувилбар (~5.6MB, компьютерт ~14MB).
// - "Reduce motion": бичлэг татагдахгүй, хөдөлгөөнгүй poster, H1 ба товч шууд харагдана (CSS).
// - H1 (HeroText) HTML-д үргэлж байна, зөвхөн opacity нь өөрчлөгдөнө (SEO).

const SECTION_VH = 400;
// Бичиг бүрийн харагдах хүрээ (гүйлгэлтийн хувь), fade нь уусах урт
const BLOCKS = [
  { from: 0, to: 0.2, fade: 0.06 },
  { from: 0.35, to: 0.75, fade: 0.06 },
  { from: 0.8, to: 1, fade: 0.08 },
];

// p нь [from, to] дотор байхад 1, захаараа fade-ийн уртад уусна. Эхний бичиг 0%-д, сүүлийнх 100%-д бүрэн харагдана.
function blockOpacity(p: number, { from, to, fade }: (typeof BLOCKS)[number]) {
  const fadeIn = from <= 0 ? 1 : (p - from) / fade;
  const fadeOut = to >= 1 ? 1 : (to - p) / fade;
  return Math.min(1, Math.max(0, Math.min(fadeIn, fadeOut)));
}

export default function HeroFlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const startHref = liveHref('/planner') ?? '/destination/region';

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const video = videoRef.current;
    let ready = false; // бичлэг бүрэн татагдсан эсэх
    let target = 0; // гүйлгэлтийн байрлал (0–1)
    let current = 0; // зөөлрүүлсэн байрлал
    let frame = 0;
    let objectUrl = '';
    const controller = new AbortController();

    const progress = () => {
      const el = sectionRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      return total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
    };

    const render = () => {
      BLOCKS.forEach((b, i) => {
        const node = blockRefs.current[i];
        if (!node) return;
        const o = blockOpacity(current, b);
        node.style.opacity = String(o);
        node.style.transform = `translateY(${(1 - o) * 24}px)`;
        node.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
      });
      // Өмнөх seek дуусаагүй бол дараагийн кадрыг хүлээнэ (seek-үүд дараалалд хуримтлагдахгүй)
      if (ready && video && !video.seeking && video.duration) {
        const t = current * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.5 / 24) video.currentTime = t;
      }
    };

    // requestAnimationFrame-ээр зөөлрүүлнэ: байрлал бүрт зорилго руу 15%-иар ойртоно
    const tick = () => {
      current += (target - current) * 0.15;
      if (Math.abs(target - current) < 0.0005) current = target;
      render();
      frame = current === target ? 0 : requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = progress();
      if (!frame) frame = requestAnimationFrame(tick);
    };

    // Хуудас ачаалагдсаны дараа бичлэгийг бүтнээр нь татна. Бүтэн татсан тул гүйлгэх үед
    // сүлжээнээс хэсэгчлэн уншиж гацахгүй.
    const loadVideo = async () => {
      if (!video) return;
      const conn = (navigator as any).connection;
      const small = window.matchMedia('(max-width: 767px)').matches || conn?.saveData === true;
      try {
        const res = await fetch(small ? '/hero/hero-flight-mobile.mp4' : '/hero/hero-flight-desktop.mp4', {
          signal: controller.signal,
        });
        if (!res.ok) return;
        objectUrl = URL.createObjectURL(await res.blob());
        video.src = objectUrl;
        video.addEventListener(
          'loadeddata',
          () => {
            ready = true;
            video.style.opacity = '1';
            render();
          },
          { once: true }
        );
        video.load();
      } catch {
        // Татаж чадаагүй бол poster хэвээр харагдана
      }
    };

    let idle = 0;
    const scheduleLoad = () => {
      const ric = (window as any).requestIdleCallback;
      idle = ric ? ric(loadVideo, { timeout: 2000 }) : window.setTimeout(loadVideo, 200);
    };
    if (document.readyState === 'complete') scheduleLoad();
    else window.addEventListener('load', scheduleLoad, { once: true });

    target = current = progress();
    render();
    // Гүйлгэлт seek-ийн дундуур зогссон бол сүүлийн байрлал руу дахин очно
    video?.addEventListener('seeked', render);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      controller.abort();
      cancelAnimationFrame(frame);
      (window as any).cancelIdleCallback?.(idle);
      window.clearTimeout(idle);
      window.removeEventListener('load', scheduleLoad);
      video?.removeEventListener('seeked', render);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // Бичиг бүрийн нийтлэг загвар. "Reduce motion" үед эхний хоёр нуугдаж, сүүлийнх шууд харагдана.
  const block = 'flex absolute inset-0 justify-center items-center px-6 text-center text-white will-change-[opacity,transform]';

  return (
    <section
      ref={sectionRef}
      aria-label="Монголын тал нутгаар нисэх нь"
      className="relative w-full motion-reduce:!h-svh"
      style={{ height: `${SECTION_VH}vh` }}
    >
      <div className="overflow-hidden sticky top-0 w-full h-svh">
        {/* Poster: эхний кадр, LCP */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero/hero-flight-poster.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="object-cover absolute inset-0 w-full h-full"
        />
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          className="object-cover absolute inset-0 w-full h-full opacity-0 transition-opacity duration-300 motion-reduce:hidden"
        />

        {/* Бичиг уншигдахуйц байх бүрхүүл */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

        <div
          ref={(n) => { blockRefs.current[0] = n; }}
          className={`${block} motion-reduce:hidden`}
        >
          <p className="max-w-4xl text-3xl font-black tracking-tight drop-shadow-xl sm:text-6xl">
            Монголын тал нутаг таныг хүлээж байна
          </p>
        </div>

        <div
          ref={(n) => { blockRefs.current[1] = n; }}
          className={`${block} motion-reduce:hidden`}
          style={{ opacity: 0 }}
        >
          <p className="text-3xl font-black tracking-tight drop-shadow-xl sm:text-6xl">Нүүдэлчдийн нутаг</p>
        </div>

        {/* Хуудасны цорын ганц H1 (HeroText) энд байна. Гараар (Tab) товч руу ирвэл бүрэн харагдана. */}
        <div
          ref={(n) => { blockRefs.current[2] = n; }}
          className={`${block} flex-col motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!pointer-events-auto focus-within:!opacity-100`}
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <HeroText />
          <Link
            href={startHref}
            className="relative z-10 inline-flex gap-2 items-center py-3 px-7 mt-8 text-sm font-bold text-neutral-900 bg-white rounded-full shadow-lg transition-colors hover:bg-[#15803d] hover:text-white sm:text-base"
          >
            Аялалаа эхлүүлэх
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

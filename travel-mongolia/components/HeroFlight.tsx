'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';

import { useLanguage } from './LanguageContext';
import { liveHref } from '../lib/navigation';

// Нүүр хуудасны "нислэг" hero. 400vh өндөр хэсэг гүйлгэхэд дэлгэц дүүрэн хэсэг наалдаж (sticky),
// гүйлгэлтийн 0–100% нь бичлэгийн эхнээс төгсгөл хүртэлх хугацаа болно. Бичлэг өөрөө хэзээ ч
// тоглохгүй: доош гүйлгэвэл урагшилж, зогсвол зогсож, дээш гүйлгэвэл ухарна.
// - Эхлээд зөвхөн poster (эхний кадр, WebP) харагдана, энэ нь LCP. Хуудас бүрэн ачаалсны дараа:
//   1. "video" горим: public/hero/hero-flight-{desktop,mobile}.mp4-ийг бүтнээр нь (blob) татаж,
//      play() + pause()-аар "сэрээгээд" (iOS Safari үүнгүйгээр seek хийхэд кадраа шинэчилдэггүй),
//      seek-ийн дараа кадр үнэхээр шинэчлэгдэж байгааг requestVideoFrameCallback-ээр шалгана.
//      6 кадр тутамд keyframe тул гацалтгүй (хэмжилт: docs/hero-quality/README.md).
//   2. "frames" горим (нөөц): play() хориглогдсон (жишээ нь iPhone-ий Low Power Mode) эсвэл кадр
//      шинэчлэгдэхгүй бол public/hero/frames/*.webp (секундэд 12 кадр, 720p, ~5.8MB)-ийг canvas дээр
//      зурна. play() хориглогдсон бол хэрэглэгчийн анхны хүрэлтээр дахин сэрээж, болбол video руу буцна.
//   Аль горим ажиллаж байгааг console-д "[HeroFlight]" гэж бичнэ.
// - Утас (767px хүртэл) болон "data saver" горимд илүү шахсан mobile хувилбар (~5.6MB, компьютерт ~14MB).
// - "Reduce motion": юу ч татагдахгүй, хөдөлгөөнгүй poster, H1 ба товч шууд харагдана (CSS).
// - Хуудасны цорын ганц H1 энд (эхний бичиг), HTML-д үргэлж байна (SEO).
// - Эх файлууд (flight-1/2/3.mp4) git-д ороогүй, дахин гаргах: scripts/hero/build-hero-flight.sh.

const SECTION_VH = 400;
const FRAME_COUNT = 205;
const frameUrl = (i: number) => `/hero/frames/${String(i + 1).padStart(3, '0')}.webp`;
const log = (...args: unknown[]) => console.info('[HeroFlight]', ...args);

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

// Үйл явдал болох эсвэл хугацаа дуусахыг хүлээнэ
function once(el: EventTarget, type: string, ms: number) {
  return new Promise<boolean>((resolve) => {
    const timer = window.setTimeout(() => resolve(false), ms);
    el.addEventListener(type, () => { window.clearTimeout(timer); resolve(true); }, { once: true });
  });
}

export default function HeroFlight() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const startHref = liveHref('/planner') ?? '/destination/region';

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      log('горим: poster (prefers-reduced-motion)');
      return;
    }

    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    let mode: 'poster' | 'video' | 'frames' = 'poster';
    let disposed = false;
    let target = 0; // гүйлгэлтийн байрлал (0–1)
    let current = 0; // зөөлрүүлсэн байрлал
    let raf = 0;
    let objectUrl = '';
    let videoLoaded = false;
    let playBlocked = false; // play() хориглогдсон тул нөөц горимд орсон (хүрэлтээр дахин оролдоно)
    const controller = new AbortController();
    const hasRVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;

    // ---------------------------------------------------------------- video горим
    // Seek хийсний дараа кадр дэлгэцэнд гарсныг хянана. 2.5 секунд гарахгүй бол нөөц горим руу.
    let seekPendingSince = 0;
    let rvfcArmed = false;
    const armFrameWatch = () => {
      if (!hasRVFC || rvfcArmed) return;
      rvfcArmed = true;
      (video as any).requestVideoFrameCallback(() => {
        rvfcArmed = false;
        seekPendingSince = 0;
      });
    };

    const seekVideo = () => {
      if (video.seeking || !video.duration) return;
      const time = current * (video.duration - 0.05);
      if (Math.abs(video.currentTime - time) <= 0.5 / 24) return;
      if (!seekPendingSince) seekPendingSince = performance.now();
      armFrameWatch();
      video.currentTime = time;
    };

    // ---------------------------------------------------------------- frames горим
    const images: (HTMLImageElement | undefined)[] = new Array(FRAME_COUNT);
    const loaded: boolean[] = new Array(FRAME_COUNT).fill(false);
    let drawn = -1;
    let ctx: CanvasRenderingContext2D | null = null;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        drawn = -1;
      }
    };

    const drawFrame = () => {
      if (!ctx) return;
      const want = Math.round(current * (FRAME_COUNT - 1));
      // Хүссэн кадр ачаалагдаагүй бол хамгийн ойрын ачаалагдсаныг зурна
      let idx = -1;
      for (let d = 0; d < FRAME_COUNT && idx < 0; d++) {
        if (loaded[want - d]) idx = want - d;
        else if (loaded[want + d]) idx = want + d;
      }
      if (idx < 0 || idx === drawn) return;
      const img = images[idx]!;
      // object-fit: cover
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
      if (drawn < 0) canvas.style.opacity = '1';
      drawn = idx;
    };

    // Кадруудыг нэг зэрэг 6-аар татна. video горим руу буцвал татахаа зогсооно, дахин хэрэг болбол үргэлжлүүлнэ.
    let queue: number[] | null = null;
    let inFlight = 0;
    const pump = () => {
      while (queue && queue.length && inFlight < 6 && mode === 'frames' && !disposed) {
        const i = queue.shift()!;
        const img = new Image();
        img.decoding = 'async';
        inFlight++;
        img.onload = () => {
          inFlight--;
          loaded[i] = true;
          if (mode === 'frames') drawFrame();
          pump();
        };
        img.onerror = () => { inFlight--; pump(); };
        img.src = frameUrl(i);
        images[i] = img;
      }
    };

    const startFrames = (reason: string) => {
      if (mode === 'frames' || disposed) return;
      log(`горим: frames (нөөц), шалтгаан: ${reason}`);
      mode = 'frames';
      video.style.opacity = '0';
      if (!ctx) {
        ctx = canvas.getContext('2d');
        sizeCanvas();
        // Одоогийн байрлалаас эхлэн дараалуулна
        const start = Math.round(current * (FRAME_COUNT - 1));
        queue = Array.from({ length: FRAME_COUNT }, (_, i) => (start + i) % FRAME_COUNT);
      } else {
        drawn = -1;
        canvas.style.opacity = '1';
        drawFrame();
      }
      pump();
    };

    const useVideo = (how: string) => {
      log(`горим: video (${how})`);
      mode = 'video';
      seekPendingSince = 0;
      video.style.opacity = '1';
      canvas.style.opacity = '0';
      seekVideo();
    };

    // ---------------------------------------------------------------- зурах
    const render = () => {
      BLOCKS.forEach((b, i) => {
        const node = blockRefs.current[i];
        if (!node) return;
        const o = blockOpacity(current, b);
        node.style.opacity = String(o);
        node.style.transform = `translateY(${(1 - o) * 24}px)`;
        node.style.pointerEvents = o > 0.5 ? 'auto' : 'none';
      });
      if (mode === 'video') {
        if (seekPendingSince && performance.now() - seekPendingSince > 2500) {
          startFrames('seek хийсэн ч кадр 2.5 секунд шинэчлэгдсэнгүй');
          return drawFrame();
        }
        seekVideo();
      } else if (mode === 'frames') {
        drawFrame();
      }
    };

    // requestAnimationFrame-ээр зөөлрүүлнэ: кадр бүрт зорилго руу 15%-иар ойртоно
    const tick = () => {
      current += (target - current) * 0.15;
      if (Math.abs(target - current) < 0.0005) current = target;
      render();
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const progress = () => {
      const el = sectionRef.current;
      if (!el) return 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      return total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0;
    };

    const onScroll = () => {
      target = progress();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      if (ctx) sizeCanvas();
      onScroll();
    };

    // ---------------------------------------------------------------- бичлэг ачаалах, шалгах
    // "Сэрээх": play() дуудаад шууд pause(). Хүрэлтийн дотроос дуудвал хэрэглэгчийн үйлдэл гэж тооцогдоно.
    const wake = async () => {
      try {
        await video.play();
        video.pause();
        return true;
      } catch (err) {
        log('play() амжилтгүй:', (err as Error)?.name || err);
        return false;
      }
    };

    // Seek хийхэд кадр үнэхээр шинэчлэгдэж байгааг шалгана: зорилтот хугацааны кадр дэлгэцэнд гарах ёстой
    const verifySeek = () =>
      new Promise<boolean>((resolve) => {
        const now = current * (video.duration - 0.05);
        const time = Math.abs(video.currentTime - now) > 0.1 ? now : Math.min(video.duration - 0.05, now + 0.125);
        let finished = false;
        const timer = window.setTimeout(() => { finished = true; resolve(false); }, 2000);
        const done = () => { finished = true; window.clearTimeout(timer); resolve(true); };
        if (hasRVFC) {
          const check = (_: number, meta: { mediaTime: number }) => {
            if (finished) return;
            if (Math.abs(meta.mediaTime - time) < 0.1) done();
            else (video as any).requestVideoFrameCallback(check);
          };
          (video as any).requestVideoFrameCallback(check);
        } else {
          video.addEventListener('seeked', done, { once: true });
        }
        video.style.opacity = '1';
        video.currentTime = time;
      });

    const tryVideo = async (how: string) => {
      if (!(await wake())) return false;
      if (!(await verifySeek())) {
        playBlocked = false;
        startFrames('seek хийхэд кадр шинэчлэгдсэнгүй');
        return false;
      }
      playBlocked = false;
      useVideo(how);
      return true;
    };

    const loadVideo = async () => {
      // Шалгахад: ?hero=frames нөөц горимыг албадна
      if (new URLSearchParams(window.location.search).get('hero') === 'frames') {
        return startFrames('URL-д ?hero=frames');
      }
      const conn = (navigator as any).connection;
      const small = window.matchMedia('(max-width: 767px)').matches || conn?.saveData === true;
      const src = small ? '/hero/hero-flight-mobile.mp4' : '/hero/hero-flight-desktop.mp4';
      try {
        const res = await fetch(src, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        objectUrl = URL.createObjectURL(await res.blob());
        if (disposed) return;
        // iOS: muted, playsinline-ийг property болон attribute хоёуланд нь тавина
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.preload = 'auto';
        video.src = objectUrl;
        video.load();
        if (!(await once(video, 'loadeddata', 15000))) throw new Error('loadeddata ирсэнгүй');
        if (disposed) return;
        videoLoaded = true;
        log(`бичлэг ачаалагдлаа: ${src}`);
        if (!(await tryVideo('play/pause-аар сэрсэн'))) {
          if (mode === 'poster') {
            playBlocked = true;
            startFrames('play() хориглогдсон, хүрэлтээр дахин оролдоно');
          }
        }
      } catch (err) {
        if (disposed) return;
        startFrames(`бичлэг ачаалж чадсангүй (${(err as Error)?.message || err})`);
      }
    };

    // Хэрэглэгчийн анхны хүрэлт: play() хориглогдсон байсан бол дахин сэрээж үзнэ. iOS зарим үед
    // touchstart-ийг хэрэглэгчийн үйлдэл гэж тооцдоггүй тул touchend дээр ч оролдоно (нийт 3 удаа).
    let touchTries = 0;
    let touchBusy = false;
    const removeTouch = () => {
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchend', onTouch);
    };
    const onTouch = async (e: Event) => {
      if (!videoLoaded || mode === 'video' || !playBlocked || touchBusy) return;
      touchBusy = true;
      touchTries++;
      log(`${e.type}: бичлэгийг дахин сэрээж байна (${touchTries}/3)`);
      const ok = await tryVideo(`${e.type}-ээр сэрсэн`);
      touchBusy = false;
      if (ok || !playBlocked || touchTries >= 3) removeTouch();
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
    video.addEventListener('seeked', render);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchend', onTouch, { passive: true });

    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(raf);
      (window as any).cancelIdleCallback?.(idle);
      window.clearTimeout(idle);
      window.removeEventListener('load', scheduleLoad);
      video.removeEventListener('seeked', render);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      removeTouch();
      images.forEach((img) => img && (img.src = ''));
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  // Бичиг бүрийн нийтлэг загвар
  const block = 'flex absolute inset-0 flex-col justify-center items-center px-6 text-center text-white will-change-[opacity,transform]';

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
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          className="object-cover absolute inset-0 w-full h-full opacity-0 motion-reduce:hidden"
        />
        {/* Нөөц горимын кадрууд */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-0 motion-reduce:hidden"
        />

        {/* Бичиг уншигдахуйц байх бүрхүүл */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

        {/* 0–20%: хуудасны цорын ганц H1 ба дэд гарчиг. Ачаалахад шууд харагдана. */}
        <div ref={(n) => { blockRefs.current[0] = n; }} className={block}>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight drop-shadow-xl sm:text-7xl">
            {t.heroTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg font-light leading-relaxed text-white/95 drop-shadow sm:mt-6 sm:text-2xl">
            Монголын тал нутаг таныг хүлээж байна
          </p>
        </div>

        {/* 35–75% */}
        <div
          ref={(n) => { blockRefs.current[1] = n; }}
          className={`${block} motion-reduce:hidden`}
          style={{ opacity: 0 }}
        >
          <p className="text-3xl font-black tracking-tight drop-shadow-xl sm:text-6xl">Нүүдэлчдийн нутаг</p>
        </div>

        {/* 80–100%: товч. "Reduce motion" үед H1-ийн доор шууд харагдана, гараар (Tab) ирвэл ч харагдана. */}
        <div
          ref={(n) => { blockRefs.current[2] = n; }}
          className={`${block} motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!pointer-events-auto motion-reduce:justify-end motion-reduce:pb-[18svh] focus-within:!opacity-100`}
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <Link
            href={startHref}
            className="inline-flex gap-2 items-center py-4 px-8 text-base font-bold text-neutral-900 bg-white rounded-full shadow-lg transition-colors hover:bg-[#15803d] hover:text-white sm:text-lg"
          >
            Аялалаа эхлүүлэх
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

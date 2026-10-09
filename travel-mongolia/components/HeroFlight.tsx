'use client';

import Link from 'next/link';
import React, { useEffect, useRef } from 'react';
import { preload } from 'react-dom';

import { useLanguage } from './LanguageContext';
import { HERO_ASSETS } from '../lib/heroAssets';
import { liveHref } from '../lib/navigation';

// Нүүр хуудасны "нислэг" hero. 400vh өндөр хэсэг гүйлгэхэд дэлгэц дүүрэн хэсэг наалдаж (sticky),
// гүйлгэлтийн 0–100% нь бичлэгийн эхнээс төгсгөл хүртэлх хугацаа болно. Бичлэг өөрөө хэзээ ч
// тоглохгүй: доош гүйлгэвэл урагшилж, зогсвол зогсож, дээш гүйлгэвэл ухарна.
// - Эхлээд poster (эхний кадр, WebP) харагдана, энэ нь LCP. 2 секундээс удаан бол дээр нь ачааллын тэмдэг.
// - Хоёр шаттай ачаалал (файлууд: lib/heroAssets.ts, нэрэнд hash тул immutable кэш):
//   1. Хөнгөн хувилбар (480p, ~1.8MB): HTML доторх script fetchpriority=high-аар шууд татаж, бэлэн болмогц
//      гүйлгэлтээр хөдөлнө.
//   2. Тод хувилбар (компьютерт 720p ~14MB, утсанд 720p ~5.6MB): ар талд татаж, хөнгөнийх дээр
//      тунгалаг байдлаар бэлдэнэ. Яг одоогийн кадр руу seek хийж, тэр кадр гарсны дараа л ил болгодог
//      тул солигдох нь анзаарагдахгүй. Data saver эсвэл удаан сүлжээнд (2g/3g) татахгүй.
// - "video" горим: бичлэгийг бүтнээр нь (blob) татаж, play() + pause()-аар "сэрээгээд" (iOS Safari
//   үүнгүйгээр seek хийхэд кадраа шинэчилдэггүй), seek-ийн дараа кадр үнэхээр шинэчлэгдэж байгааг
//   requestVideoFrameCallback-ээр шалгана. 6 кадр тутамд keyframe (docs/hero-quality/README.md).
// - "frames" горим (нөөц): play() хориглогдсон (жишээ нь iPhone-ий Low Power Mode) эсвэл кадр
//   шинэчлэгдэхгүй бол WebP кадруудыг (секундэд 12 кадр, 720p, ~5.8MB) canvas дээр зурна. play()
//   хориглогдсон бол хэрэглэгчийн анхны хүрэлтээр дахин сэрээж, болбол video руу буцна. ?hero=frames албадна.
//   Аль горим ажиллаж байгааг console-д "[HeroFlight]" гэж, хуудас нээгдсэнээс хойших ms-тэй бичнэ.
// - "Reduce motion": бичлэг татагдахгүй, хөдөлгөөнгүй poster, H1 ба товч шууд харагдана (CSS).
// - Хуудасны цорын ганц H1 энд (80–100%-ийн бичиг), HTML-д үргэлж байна, зөвхөн opacity нь өөрчлөгдөнө (SEO).
// - Эх файлууд (flight-1/2/3.mp4) git-д ороогүй, дахин гаргах: scripts/hero/build-hero-flight.sh.

const SECTION_VH = 400;
const FRAME_COUNT = HERO_ASSETS.frameCount;
const frameUrl = (i: number) => `${HERO_ASSETS.frames}/${String(i + 1).padStart(3, '0')}.webp`;
const log = (msg: string) => console.info('[HeroFlight]', msg, `(${Math.round(performance.now())}ms)`);

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
  const lightRef = useRef<HTMLVideoElement>(null);
  const hiRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const startHref = liveHref('/planner') ?? '/destination/region';

  // <head>-д poster-ийн preload (LCP)
  preload(HERO_ASSETS.poster, { as: 'image', fetchPriority: 'high' });

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      log('горим: poster (prefers-reduced-motion)');
      return;
    }

    const light = lightRef.current!;
    const hi = hiRef.current!;
    const canvas = canvasRef.current!;
    const spinner = spinnerRef.current!;
    let active = light; // гүйлгэлтээр удирдагдаж буй бичлэг
    let mode: 'poster' | 'video' | 'frames' = 'poster';
    let disposed = false;
    let target = 0; // гүйлгэлтийн байрлал (0–1)
    let current = 0; // зөөлрүүлсэн байрлал
    let raf = 0;
    const objectUrls: string[] = [];
    let videoLoaded = false;
    let playBlocked = false; // play() хориглогдсон тул нөөц горимд орсон (хүрэлтээр дахин оролдоно)
    let hiReady = false; // тод хувилбар ачаалагдсан
    let hiState: 'none' | 'busy' | 'needs-touch' | 'done' = 'none';
    const controller = new AbortController();
    const hasRVFC = 'requestVideoFrameCallback' in HTMLVideoElement.prototype;
    const timeAt = (el: HTMLVideoElement) => current * (el.duration - 0.05);

    // ---------------------------------------------------------------- ачааллын тэмдэг
    // 2 секундийн дараа CSS-ээр (globals.css .hero-spinner) өөрөө гарч ирнэ, энд зөвхөн нууна
    const hideSpinner = () => {
      spinner.style.display = 'none';
    };

    // ---------------------------------------------------------------- video горим
    // Seek хийсний дараа кадр дэлгэцэнд гарсныг хянана. 2.5 секунд гарахгүй бол нөөц горим руу.
    let seekPendingSince = 0;
    let rvfcArmed = false;
    const armFrameWatch = () => {
      if (!hasRVFC || rvfcArmed) return;
      rvfcArmed = true;
      (active as any).requestVideoFrameCallback(() => {
        rvfcArmed = false;
        seekPendingSince = 0;
      });
    };

    const seekVideo = () => {
      if (active.seeking || !active.duration) return;
      const time = timeAt(active);
      if (Math.abs(active.currentTime - time) <= 0.5 / 24) return;
      if (!seekPendingSince) seekPendingSince = performance.now();
      armFrameWatch();
      active.currentTime = time;
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
      if (drawn < 0) {
        canvas.style.opacity = '1';
        hideSpinner();
      }
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
      light.style.opacity = '0';
      hi.style.opacity = '0';
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
      log(`горим: video, ${active === hi ? 'тод' : 'хөнгөн'} хувилбар (${how})`);
      mode = 'video';
      seekPendingSince = 0;
      active.style.opacity = '1';
      canvas.style.opacity = '0';
      hideSpinner();
      seekVideo();
      maybeUpgrade();
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
    // Бүтнээр нь татаж blob URL болгоно (гүйлгэх үед сүлжээнээс хэсэгчлэн уншиж гацахгүй)
    const fetchBlob = async (url: string, priority: 'high' | 'low') => {
      const res = await fetch(url, { signal: controller.signal, priority } as RequestInit);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const objectUrl = URL.createObjectURL(await res.blob());
      objectUrls.push(objectUrl);
      return objectUrl;
    };

    // iOS: muted, playsinline-ийг property болон attribute хоёуланд нь тавина
    const attach = async (el: HTMLVideoElement, objectUrl: string) => {
      el.muted = true;
      el.defaultMuted = true;
      el.playsInline = true;
      el.setAttribute('muted', '');
      el.setAttribute('playsinline', '');
      el.preload = 'auto';
      el.src = objectUrl;
      el.load();
      if (!(await once(el, 'loadeddata', 15000))) throw new Error('loadeddata ирсэнгүй');
    };

    // "Сэрээх": play() дуудаад шууд pause(). Хүрэлтийн дотроос дуудвал хэрэглэгчийн үйлдэл гэж тооцогдоно.
    const wake = async (el: HTMLVideoElement) => {
      try {
        await el.play();
        el.pause();
        return true;
      } catch (err) {
        log(`play() амжилтгүй: ${(err as Error)?.name || err}`);
        return false;
      }
    };

    // time хугацааны кадр дэлгэцэнд гарахыг хүлээнэ. strict үед зөвхөн requestVideoFrameCallback-д
    // итгэнэ (iOS дээр seeked ирсэн ч кадр шинэчлэгдэхгүй байж болно). strict биш үед seeked-ийн
    // дараа 2 кадр хүлээхэд хангалттай (тод хувилбар нуугдмал байх үед).
    const showFrame = (el: HTMLVideoElement, time: number, strict: boolean) =>
      new Promise<boolean>((resolve) => {
        let finished = false;
        const finish = (ok: boolean) => {
          if (finished) return;
          finished = true;
          window.clearTimeout(timer);
          resolve(ok);
        };
        const timer = window.setTimeout(() => finish(false), 2000);
        if (hasRVFC) {
          const check = (_: number, meta: { mediaTime: number }) => {
            if (finished) return;
            if (Math.abs(meta.mediaTime - time) < 0.1) finish(true);
            else (el as any).requestVideoFrameCallback(check);
          };
          (el as any).requestVideoFrameCallback(check);
        }
        if (!hasRVFC || !strict) {
          el.addEventListener('seeked', () => {
            if (!hasRVFC) return finish(true);
            requestAnimationFrame(() => requestAnimationFrame(() => finish(true)));
          }, { once: true });
        }
        el.currentTime = time;
      });

    // Хөнгөн хувилбарыг шалгах: одоогийн байрлалаас 3 кадр зөрүүтэй хугацаа руу seek хийж кадр гарахыг хүлээнэ
    const verifySeek = () => {
      const now = timeAt(light);
      const time = Math.abs(light.currentTime - now) > 0.1 ? now : Math.min(light.duration - 0.05, now + 0.125);
      light.style.opacity = '1';
      return showFrame(light, time, true);
    };

    const tryVideo = async (how: string) => {
      if (!(await wake(light))) return false;
      if (!(await verifySeek())) {
        playBlocked = false;
        startFrames('seek хийхэд кадр шинэчлэгдсэнгүй');
        return false;
      }
      playBlocked = false;
      useVideo(how);
      return true;
    };

    // Тод хувилбар руу шилжих: нуугдмал байхад нь одоогийн кадр руу seek хийж, тэр кадр гарсны
    // дараа ил болгоно. Хооронд нь гүйлгэсэн бол дахин тааруулна (5 удаа хүртэл).
    async function maybeUpgrade() {
      if (!hiReady || hiState === 'busy' || hiState === 'done' || mode !== 'video' || disposed) return;
      hiState = 'busy';
      if (!(await wake(hi))) {
        hiState = 'needs-touch';
        log('тод хувилбарыг сэрээж чадсангүй, хүрэлтээр дахин оролдоно');
        return;
      }
      for (let i = 0; i < 5; i++) {
        const time = timeAt(hi);
        if (!(await showFrame(hi, time, false))) break;
        if (Math.abs(timeAt(hi) - time) < 1 / 24) {
          if (mode !== 'video' || disposed) break;
          // Тод хувилбар одоогийн кадрыг харуулж байна: дээрээс нь ил болгож, хөнгөнийг чөлөөлнө.
          // Кадрын хяналтыг тод хувилбар дээр шинээр эхлүүлнэ.
          active = hi;
          seekPendingSince = 0;
          rvfcArmed = false;
          hi.style.opacity = '1';
          hiState = 'done';
          requestAnimationFrame(() => {
            light.style.opacity = '0';
            light.removeAttribute('src');
            light.load();
          });
          log(`тод хувилбар руу шилжлээ (${hi.currentTime.toFixed(2)}с)`);
          return;
        }
      }
      hiState = 'none';
      window.setTimeout(maybeUpgrade, 300);
    }

    const loadHi = async () => {
      const conn = (navigator as any).connection;
      if (conn?.saveData || /(^|-)(2g|3g)$/.test(conn?.effectiveType || '')) {
        log(`тод хувилбарыг татахгүй (saveData=${!!conn?.saveData}, effectiveType=${conn?.effectiveType})`);
        return;
      }
      const src = window.matchMedia('(max-width: 767px)').matches ? HERO_ASSETS.mobile : HERO_ASSETS.desktop;
      try {
        await attach(hi, await fetchBlob(src, 'low'));
        if (disposed) return;
        hiReady = true;
        log(`тод хувилбар ачаалагдлаа: ${src}`);
        maybeUpgrade();
      } catch (err) {
        if (!disposed) log(`тод хувилбарыг ачаалж чадсангүй (${(err as Error)?.message || err}), хөнгөнөөрөө үлдэнэ`);
      }
    };

    // HTML доторх script эрт эхлүүлсэн татлагыг ашиглана. Байхгүй (client-side шилжилт) эсвэл
    // бүтэлгүйтсэн бол өөрөө татна.
    const lightBlobUrl = async () => {
      const early: Promise<Blob> | undefined = (window as any).__heroLight;
      delete (window as any).__heroLight;
      if (early) {
        try {
          const objectUrl = URL.createObjectURL(await early);
          objectUrls.push(objectUrl);
          return objectUrl;
        } catch (err) {
          log(`эрт татлага бүтэлгүйтэв (${(err as Error)?.message || err}), дахин татна`);
        }
      }
      return fetchBlob(HERO_ASSETS.light, 'high');
    };

    const loadLight = async () => {
      // Шалгахад: ?hero=frames нөөц горимыг албадна
      if (new URLSearchParams(window.location.search).get('hero') === 'frames') {
        return startFrames('URL-д ?hero=frames');
      }
      try {
        await attach(light, await lightBlobUrl());
        if (disposed) return;
        videoLoaded = true;
        log(`хөнгөн хувилбар ачаалагдлаа: ${HERO_ASSETS.light}`);
        if (!(await tryVideo('play/pause-аар сэрсэн')) && mode === 'poster') {
          playBlocked = true;
          startFrames('play() хориглогдсон, хүрэлтээр дахин оролдоно');
        }
        loadHi();
      } catch (err) {
        if (disposed) return;
        startFrames(`бичлэг ачаалж чадсангүй (${(err as Error)?.message || err})`);
      }
    };

    // Хэрэглэгчийн хүрэлт: play() хориглогдсон байсан бол хөнгөн хувилбарыг (3 удаа хүртэл), эсвэл
    // тод хувилбарыг дахин сэрээж үзнэ. iOS зарим үед touchstart-ийг хэрэглэгчийн үйлдэл гэж
    // тооцдоггүй тул touchend дээр ч оролдоно. play()-г хүрэлтийн дотроос шууд дуудна.
    let touchTries = 0;
    let touchBusy = false;
    const onTouch = async (e: Event) => {
      if (touchBusy) return;
      if (videoLoaded && mode !== 'video' && playBlocked && touchTries < 3) {
        touchBusy = true;
        touchTries++;
        log(`${e.type}: бичлэгийг дахин сэрээж байна (${touchTries}/3)`);
        await tryVideo(`${e.type}-ээр сэрсэн`);
        touchBusy = false;
      } else if (hiState === 'needs-touch' && mode === 'video') {
        hiState = 'none';
        maybeUpgrade();
      }
    };

    target = current = progress();
    render();
    // Hydration болмогц хөнгөн хувилбарыг татна (window load-ийг хүлээхгүй)
    loadLight();
    // Гүйлгэлт seek-ийн дундуур зогссон бол сүүлийн байрлал руу дахин очно
    const onSeeked = (e: Event) => { if (e.target === active) render(); };
    light.addEventListener('seeked', onSeeked);
    hi.addEventListener('seeked', onSeeked);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('touchstart', onTouch, { passive: true });
    window.addEventListener('touchend', onTouch, { passive: true });

    return () => {
      disposed = true;
      controller.abort();
      cancelAnimationFrame(raf);
      light.removeEventListener('seeked', onSeeked);
      hi.removeEventListener('seeked', onSeeked);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('touchend', onTouch);
      images.forEach((img) => img && (img.src = ''));
      objectUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, []);

  // Бичиг бүрийн нийтлэг загвар
  const block = 'flex absolute inset-0 flex-col justify-center items-center px-6 text-center text-white will-change-[opacity,transform]';
  const videoClass = 'object-cover absolute inset-0 w-full h-full opacity-0 motion-reduce:hidden';

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
          src={HERO_ASSETS.poster}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="object-cover absolute inset-0 w-full h-full"
        />
        {/* Хөнгөн бичлэгийг HTML задлагдаж байхад нь (JS hydration-ийг хүлээлгүй) fetchpriority=high-аар
            татаж эхэлнэ. <link rel=preload as=fetch> ашиглаагүй шалтгаан: preload дуусаагүй байхад fetch()
            түүнтэй холбогдвол Chrome/Edge удаан сүлжээнд "Failed to fetch" өгч байсан. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!/[?&]hero=frames/.test(location.search)){window.__heroLight=fetch(${JSON.stringify(HERO_ASSETS.light)},{priority:'high'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.blob()});window.__heroLight.catch(function(){})}`,
          }}
        />
        {/* Хөнгөн, дээр нь тод хувилбар */}
        <video ref={lightRef} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1} className={videoClass} />
        <video ref={hiRef} muted playsInline preload="auto" disablePictureInPicture aria-hidden="true" tabIndex={-1} className={videoClass} />
        {/* Нөөц горимын кадрууд */}
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full opacity-0 motion-reduce:hidden"
        />

        {/* Бичиг уншигдахуйц байх бүрхүүл */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

        {/* Ачаалал 2 секундээс удаан бол харагдана. Навигацийн өндрөөр hero-гийн доод хэсэг эхэндээ
            дэлгэцээс гадуур байдаг тул доороос 8rem өндөрт байрлана. */}
        <div
          ref={spinnerRef}
          role="status"
          aria-label="Бичлэг ачаалж байна"
          className="hero-spinner absolute bottom-32 left-1/2 z-10 w-7 h-7 rounded-full border-2 pointer-events-none border-white/25 border-t-white/80 motion-reduce:hidden"
        />

        {/* 0–20% */}
        <div
          ref={(n) => { blockRefs.current[0] = n; }}
          className={`${block} motion-reduce:hidden`}
        >
          <p className="max-w-4xl text-3xl font-black tracking-tight drop-shadow-xl sm:text-6xl">
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

        {/* 80–100%: хуудасны цорын ганц H1, тайлбар ба товч. HTML-д үргэлж байна (SEO).
            "Reduce motion" үед шууд харагдана, гараар (Tab) товч руу ирвэл ч харагдана. */}
        <div
          ref={(n) => { blockRefs.current[2] = n; }}
          className={`${block} motion-reduce:!opacity-100 motion-reduce:!transform-none motion-reduce:!pointer-events-auto focus-within:!opacity-100`}
          style={{ opacity: 0, pointerEvents: 'none' }}
        >
          <div className="px-6 mx-auto max-w-4xl">
            <span className="block mb-4 text-xs font-bold tracking-[0.3em] text-white/90 uppercase drop-shadow sm:text-sm">
              {t.heroTag}
            </span>
            <h1 className="mb-6 text-4xl font-black tracking-tight drop-shadow-xl sm:text-7xl">{t.heroTitle}</h1>
            <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-white/95 drop-shadow sm:text-xl">
              {t.heroDesc}
            </p>
          </div>
          <Link
            href={startHref}
            className="inline-flex gap-2 items-center py-3 px-7 mt-8 text-sm font-bold text-neutral-900 bg-white rounded-full shadow-lg transition-colors hover:bg-[#15803d] hover:text-white sm:text-base"
          >
            Аялалаа эхлүүлэх
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

import React, { useEffect, useRef, useState } from 'react';

// /about-us-ийн hero өгүүлбэр. Тодруулсан үг бүр дээр хулганаар заахад (утсанд дарахад) жижиг цагаан tooltip.
// Tooltip нь absolute тул байрлал хөдлөхгүй (CLS 0). Тоонууд сайтын өгөгдлөөс (app/about-us/page.tsx).

interface Term {
  text: string;
  tip: string;
  // Tooltip-ийг Google Translate орчуулахгүй (хэлний нэрс)
  tipNoTranslate?: boolean;
}

function Highlight({ term, open, onToggle }: { term: Term; open: boolean; onToggle: () => void }) {
  return (
    <span className="group relative inline-block">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="text-[#D7F0B0] underline decoration-[#D7F0B0]/70 decoration-2 underline-offset-[6px] cursor-help outline-none rounded focus-visible:ring-2 focus-visible:ring-white/70"
      >
        {term.text}
      </button>
      <span
        role="tooltip"
        {...(term.tipNoTranslate ? { translate: 'no' as const } : {})}
        className={`${term.tipNoTranslate ? 'notranslate ' : ''}pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[min(16rem,80vw)] -translate-x-1/2 rounded-lg bg-white px-3 py-1.5 text-center text-xs font-semibold leading-snug text-neutral-800 shadow-lg transition-opacity duration-150 sm:text-sm ${
          open ? 'visible opacity-100' : 'invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100'
        }`}
      >
        {term.tip}
      </span>
    </span>
  );
}

export default function AboutHeroSentence({
  provinces,
  soums,
  languages,
  languageList,
}: {
  provinces: number;
  // Сумын бодит тоо; өгөгдөл олдохгүй бол null (тоогүй бичнэ)
  soums: number | null;
  languages: number;
  languageList: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  // Утсанд: өөр газар дарахад tooltip хаагдана
  useEffect(() => {
    if (open === null) return;
    const close = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);

  const terms: Term[] = [
    { text: `${provinces} аймгийн`, tip: soums ? `${soums} сумын баталгаатай мэдээлэл` : 'Сумдын баталгаатай мэдээлэл' },
    { text: 'байгаль', tip: 'Хамгаалалттай газар, амьтан, ургамал' },
    { text: 'өв соёл', tip: 'Түүх, домог, аман түүх' },
    { text: 'нутгийн иргэдийн', tip: 'Малчин өрх, гар урчууд' },
    { text: `${languages} хэлээр`, tip: languageList, tipNoTranslate: true },
  ];
  const h = (i: number) => (
    <Highlight term={terms[i]} open={open === i} onToggle={() => setOpen(open === i ? null : i)} />
  );

  return (
    <p
      ref={ref}
      className="max-w-4xl text-[21px] font-bold leading-[1.6] text-center text-white sm:text-2xl md:text-[30px] md:leading-[1.55]"
    >
      Бид Монголын {h(0)} {h(1)}, {h(2)}, {h(3)} түүхийг {h(4)} дэлхийд хүргэдэг.
    </p>
  );
}

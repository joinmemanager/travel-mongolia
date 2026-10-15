'use client';

import React, { useId, useState } from 'react';

// Урт танилцуулгын үлдсэн хэсэг. Бүтэн текст server HTML-д байна (хайлтын системд харагдана),
// зөвхөн CSS-ээр нуугдаж, «Дэлгэрэнгүй унших» товчоор нээгдэнэ.
export default function ReadMore({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <>
      <div id={id} className={open ? '' : 'hidden'}>
        {children}
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex gap-1 items-center mt-2 text-base font-semibold text-[#15803d] hover:text-[#0b3b20]"
      >
        {open ? 'Хураах ▴' : 'Дэлгэрэнгүй унших ▾'}
      </button>
    </>
  );
}

'use client';

import React, { useRef, useState } from 'react';

// Газрын зураг дээр хулганы доорх аймгийн нэрийг (data-name) жижиг шошгоор харуулна
export default function AimagMapHover({ children }: { children: React.ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ name: string; x: number; y: number } | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = (e.target as Element).closest('[data-name]');
    const rect = box.current?.getBoundingClientRect();
    if (!el || !rect) return setTip(null);
    setTip({ name: el.getAttribute('data-name') || '', x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div ref={box} className="relative" onPointerMove={onMove} onPointerLeave={() => setTip(null)}>
      {children}
      {tip && (
        <span
          className="absolute z-10 px-2 py-1 text-xs font-semibold text-white whitespace-nowrap rounded-md -translate-x-1/2 pointer-events-none bg-[#0b3b20]"
          style={{ left: tip.x, top: tip.y - 30 }}
        >
          {tip.name}
        </span>
      )}
    </div>
  );
}

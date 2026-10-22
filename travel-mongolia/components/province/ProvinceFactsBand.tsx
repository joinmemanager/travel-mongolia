import React from 'react';

import { DARK_GREEN_BG, GOLD_TEXT, MUTED_ON_DARK } from '@/components/design/tokens';

export interface FactItem {
  label: string;
  value: string;
  unit?: string;
}

// Hero-гийн доорх бараан ногоон тууз: алтан тоо, цайвар шошго (design/tokens.ts).
// Хоосон утгыг дуудагч тал шүүнэ; нэг ч утгагүй бол тууз харагдахгүй.
// Багана: утас 2, tablet 3 (2 мөр), xl (≥1280) нэг мөрөнд агуулгын өргөнөөр (auto) тэгш зайтай.
// Аймгийн төвийн хамгийн урт нэр «Даланзадгад» (11 үсэг, lib/provinceFacts.ts) 1fr баганад багтахгүй
// дараагийн багана руу наалдаж байсан (2026-10-22). min-w-0 + overflow-wrap нь сүүлчийн хамгаалалт.
export default function ProvinceFactsBand({ items, note }: { items: FactItem[]; note?: string }) {
  if (!items.length) return null;
  return (
    <section aria-label="Аймгийн үндсэн үзүүлэлтүүд" className={`${DARK_GREEN_BG} text-white`}>
      <div className="px-6 py-8 mx-auto max-w-7xl sm:px-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 sm:gap-x-8 xl:grid-flow-col xl:grid-cols-none xl:auto-cols-auto xl:justify-between xl:gap-x-6">
          {items.map((x) => (
            <div key={x.label} className="min-w-0 xl:border-l xl:border-white/10 xl:pl-6 xl:first:border-l-0 xl:first:pl-0">
              <dt className={`text-xs font-semibold tracking-wider uppercase ${MUTED_ON_DARK}`}>{x.label}</dt>
              <dd className={`mt-1 text-xl font-black tabular-nums leading-tight [overflow-wrap:anywhere] sm:text-2xl xl:text-3xl ${GOLD_TEXT}`}>
                {x.value}
                {x.unit && <span className="ml-1 text-sm font-bold sm:text-base">{x.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
        {note && <p className={`mt-6 text-xs ${MUTED_ON_DARK} opacity-80`}>{note}</p>}
      </div>
    </section>
  );
}

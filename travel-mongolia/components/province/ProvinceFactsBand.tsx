import React from 'react';

import { DARK_GREEN_BG, GOLD_TEXT, MUTED_ON_DARK } from '@/components/design/tokens';

export interface FactItem {
  label: string;
  value: string;
  unit?: string;
}

// Hero-гийн доорх бараан ногоон тууз: алтан тоо, цайвар шошго (design/tokens.ts).
// Хоосон утгыг дуудагч тал шүүнэ; нэг ч утгагүй бол тууз харагдахгүй.
export default function ProvinceFactsBand({ items, note }: { items: FactItem[]; note?: string }) {
  if (!items.length) return null;
  return (
    <section aria-label="Аймгийн үндсэн үзүүлэлтүүд" className={`${DARK_GREEN_BG} text-white`}>
      <div className="px-6 py-8 mx-auto max-w-7xl sm:px-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none">
          {items.map((x) => (
            <div key={x.label} className="lg:border-l lg:border-white/10 lg:pl-6 lg:first:border-l-0 lg:first:pl-0">
              <dt className={`text-xs font-semibold tracking-wider uppercase ${MUTED_ON_DARK}`}>{x.label}</dt>
              <dd className={`mt-1 text-2xl font-black tabular-nums sm:text-3xl ${GOLD_TEXT}`}>
                {x.value}
                {x.unit && <span className="ml-1 text-base font-bold">{x.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
        {note && <p className={`mt-6 text-xs ${MUTED_ON_DARK} opacity-80`}>{note}</p>}
      </div>
    </section>
  );
}

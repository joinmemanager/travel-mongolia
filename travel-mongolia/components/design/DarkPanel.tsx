import React from 'react';

import { DARK_GREEN_BG, GOLD_TEXT, MUTED_ON_DARK } from './tokens';

export interface DarkPanelItem {
  title: string;
  text: string;
}

// а. Бараан ногоон самбар ("Аялагчийн амлалт"-ын бүтэц): гүн бараан ногоон дэвсгэр,
// алтан шаргал дугаар, цагаан гарчиг. Сайтын үндсэн фонт (lib/fonts.ts).
export default function DarkPanel({
  id,
  title,
  intro,
  items,
}: {
  id?: string;
  title: string;
  intro?: string;
  items: DarkPanelItem[];
}) {
  return (
    <section id={id} className={`scroll-mt-28 p-8 rounded-3xl shadow-sm sm:p-10 ${DARK_GREEN_BG}`}>
      <h2 className="mb-2 text-2xl font-black text-white sm:text-3xl">{title}</h2>
      {intro && <p className={`mb-8 text-sm leading-relaxed ${MUTED_ON_DARK}`}>{intro}</p>}
      <ol className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${intro ? '' : 'mt-8'}`}>
        {items.map((item, i) => (
          <li key={item.title} className="flex gap-4 p-5 rounded-2xl border bg-white/5 border-white/10">
            <span className={`text-2xl font-black tabular-nums ${GOLD_TEXT}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <h3 className="mb-1 text-base font-bold text-white">{item.title}</h3>
              <p className={`text-sm leading-relaxed ${MUTED_ON_DARK}`}>{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

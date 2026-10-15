'use client';

import { useEffect, useState } from 'react';

import { symbolToEmoji, symbolToText, WEATHER_SOURCE, type WeatherNow } from '@/lib/weather';

// Аймгийн төвийн цаг агаар: /api/weather/<slug> (server талд 1 цаг кэшилсэн MET Norway).
// Ачаалж байхад ижил өндөртэй хоосон карт (хуудас үсрэхгүй), алдаа гарвал карт алга болно.
export default function WeatherCard({ slug, center }: { slug: string; center?: string }) {
  const [data, setData] = useState<WeatherNow | null | 'error'>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather/${slug}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => !cancelled && setData(d?.ok ? d : 'error'))
      .catch(() => !cancelled && setData('error'));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (data === 'error') return null;

  return (
    <div className="p-5 bg-white rounded-2xl border border-neutral-200/70 min-h-[148px]" aria-busy={!data}>
      <p className="mb-3 text-xs font-semibold tracking-wider uppercase text-neutral-500">
        Цаг агаар{center ? ` · ${center}` : ''}
      </p>
      {data && (
        <>
          <div className="flex gap-4 justify-between items-center">
            <div className="flex gap-3 items-center">
              <span className="text-3xl" aria-hidden="true">{symbolToEmoji(data.symbol)}</span>
              <div>
                <div className="text-2xl font-black tabular-nums text-neutral-900">{Math.round(data.temperature)}°C</div>
                <div className="text-xs font-medium text-neutral-500">{symbolToText(data.symbol)}</div>
              </div>
            </div>
            {data.tomorrow && (
              <div className="text-right">
                <div className="text-xs font-medium text-neutral-500">Маргааш</div>
                <div className="text-sm font-semibold tabular-nums text-neutral-800">
                  <span aria-hidden="true">{symbolToEmoji(data.tomorrow.symbol)} </span>
                  {Math.round(data.tomorrow.max)}° / {Math.round(data.tomorrow.min)}°
                </div>
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] text-neutral-400">
            Эх сурвалж:{' '}
            <a href={WEATHER_SOURCE.href} target="_blank" rel="noreferrer" className="underline hover:text-neutral-600">
              {WEATHER_SOURCE.label}
            </a>
          </p>
        </>
      )}
    </div>
  );
}

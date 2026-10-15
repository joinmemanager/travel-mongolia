'use client';

import { useEffect, useState } from 'react';

import { symbolToEmoji, symbolToText, WEATHER_SOURCE, type WeatherNow } from '@/lib/weather';

interface Props {
  lat: number;
  lon: number;
}

// Газрын одоогийн цаг агаар: /api/weather/at/<lat>/<lon> (MET Norway, server талд 1 цаг кэш).
// Координатыг 2 орон хүртэл бөөрөнхийлж кэшийн хаягийг цөөн байлгана (≈1 км нарийвчлал).
export default function WeatherWidget({ lat, lon }: Props) {
  const [weather, setWeather] = useState<WeatherNow | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/weather/at/${lat.toFixed(2)}/${lon.toFixed(2)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        if (data?.ok) setWeather(data);
        else setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  if (error) {
    return (
      <div className="text-sm text-neutral-400">Цаг агаарын мэдээлэл татагдсангүй</div>
    );
  }

  if (!weather) {
    return <div className="text-sm text-neutral-400">Цаг агаар ачааллаж байна...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{symbolToEmoji(weather.symbol)}</span>
        <div>
          <div className="text-2xl font-black text-neutral-900">
            {Math.round(weather.temperature)}°C
          </div>
          <div className="text-xs text-neutral-500 font-medium">
            {symbolToText(weather.symbol)}
          </div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-neutral-400">
        Эх сурвалж:{' '}
        <a href={WEATHER_SOURCE.href} target="_blank" rel="noreferrer" className="underline hover:text-neutral-600">
          {WEATHER_SOURCE.label}
        </a>
      </p>
    </div>
  );
}

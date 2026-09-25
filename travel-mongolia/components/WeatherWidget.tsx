'use client';

import { useEffect, useState } from 'react';

interface Props {
  lat: number;
  lon: number;
}

interface WeatherData {
  temperature: number;
  weathercode: number;
}

function weatherCodeToText(code: number): string {
  if (code === 0) return 'Цэлмэг';
  if (code <= 3) return 'Багавтар үүлтэй';
  if (code <= 48) return 'Манантай';
  if (code <= 67) return 'Бороотой';
  if (code <= 77) return 'Цастай';
  if (code <= 82) return 'Аадар бороотой';
  if (code <= 99) return 'Аянга цахилгаантай';
  return 'Тодорхойгүй';
}

function weatherCodeToEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

export default function WeatherWidget({ lat, lon }: Props) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
    )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.current_weather) {
          setWeather({
            temperature: data.current_weather.temperature,
            weathercode: data.current_weather.weathercode,
          });
        } else {
          setError(true);
        }
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
    <div className="flex items-center gap-3">
      <span className="text-3xl">{weatherCodeToEmoji(weather.weathercode)}</span>
      <div>
        <div className="text-2xl font-black text-neutral-900">
          {Math.round(weather.temperature)}°C
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          {weatherCodeToText(weather.weathercode)}
        </div>
      </div>
    </div>
  );
}
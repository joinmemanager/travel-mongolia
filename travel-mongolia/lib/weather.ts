// Open-Meteo-ийн WMO цаг агаарын код → монгол тайлбар, icon (components/WeatherWidget, аймгийн хуудас)

export function weatherCodeToText(code: number): string {
  if (code === 0) return 'Цэлмэг';
  if (code <= 3) return 'Багавтар үүлтэй';
  if (code <= 48) return 'Манантай';
  if (code <= 67) return 'Бороотой';
  if (code <= 77) return 'Цастай';
  if (code <= 82) return 'Аадар бороотой';
  if (code <= 99) return 'Аянга цахилгаантай';
  return 'Тодорхойгүй';
}

export function weatherCodeToEmoji(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  if (code <= 99) return '⛈️';
  return '🌡️';
}

// /api/weather/[slug]-ийн хариу
export interface ProvinceWeather {
  ok: true;
  temperature: number;
  code: number;
  tomorrow: { max: number; min: number; code: number };
}

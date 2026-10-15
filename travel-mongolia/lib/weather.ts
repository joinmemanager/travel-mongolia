// MET Norway Locationforecast-ийн symbol_code → монгол тайлбар, icon (WeatherWidget, аймгийн карт).
// Кодын жагсаалт: https://api.met.no/weatherapi/weathericon/2.0/documentation
// (жишээ нь «partlycloudy_day», «lightsnowshowers_night»; _day/_night/_polartwilight-ийг хасна)

function base(symbol: string): string {
  return symbol.replace(/_(day|night|polartwilight)$/, '');
}

export function symbolToText(symbol: string): string {
  const s = base(symbol);
  if (s.includes('thunder')) return 'Аянга цахилгаантай';
  if (s === 'clearsky') return 'Цэлмэг';
  if (s === 'fair') return 'Багавтар үүлтэй';
  if (s === 'partlycloudy') return 'Үүлшинэ';
  if (s === 'cloudy') return 'Үүлэрхэг';
  if (s === 'fog') return 'Манантай';
  if (s.includes('sleet')) return 'Нойтон цастай';
  if (s.includes('snowshowers')) return 'Цас орно';
  if (s.includes('snow')) return s.startsWith('heavy') ? 'Их цастай' : 'Цастай';
  if (s.includes('rainshowers')) return 'Аадар бороотой';
  if (s.includes('rain')) return s.startsWith('heavy') ? 'Хүчтэй бороотой' : 'Бороотой';
  return 'Тодорхойгүй';
}

export function symbolToEmoji(symbol: string): string {
  const s = base(symbol);
  const night = symbol.endsWith('_night');
  if (s.includes('thunder')) return '⛈️';
  if (s === 'clearsky') return night ? '🌙' : '☀️';
  if (s === 'fair') return night ? '🌙' : '🌤️';
  if (s === 'partlycloudy') return '⛅';
  if (s === 'cloudy') return '☁️';
  if (s === 'fog') return '🌫️';
  if (s.includes('snow') || s.includes('sleet')) return '❄️';
  if (s.includes('showers')) return '🌦️';
  if (s.includes('rain')) return '🌧️';
  return '🌡️';
}

// /api/weather/*-ийн хариу
export interface WeatherNow {
  ok: true;
  temperature: number;
  symbol: string;
  tomorrow: { max: number; min: number; symbol: string } | null;
}

export const WEATHER_SOURCE = { label: 'MET Norway', href: 'https://www.met.no/en' };

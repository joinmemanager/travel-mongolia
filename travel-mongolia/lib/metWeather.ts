import type { WeatherNow } from '@/lib/weather';

// MET Norway Locationforecast 2.0 (https://api.met.no/doc/TermsOfService):
//  - тодорхой User-Agent (сайтын нэр + холбоо барих имэйл) заавал
//  - координат 4-өөс олон оронгүй
//  - хариуг кэшлэх: дуудагч route-ууд 1 цаг кэшилнэ (Expires нь ≈30 мин, тиймээс ачаалал багасна)
// Мэдээ: Норвегийн цаг уурын хүрээлэн (MET Norway), CC BY 4.0 / NLOD 2.0 — картын доор эх сурвалжийг бичнэ.
const USER_AGENT = 'TravelHubMongolia/1.0 (+https://www.travelhubmongolia.com; contact@joinme.mn)';
const MONGOLIA_UTC_OFFSET_H = 8;

const localDate = (iso: string) =>
  new Date(Date.parse(iso) + MONGOLIA_UTC_OFFSET_H * 3600 * 1000).toISOString().slice(0, 10);

export async function fetchMetWeather(lat: number, lon: number): Promise<WeatherNow | null> {
  const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat.toFixed(4)}&lon=${lon.toFixed(4)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const series: any[] = (await res.json())?.properties?.timeseries || [];
    const now = series[0];
    const temperature = now?.data?.instant?.details?.air_temperature;
    const symbol = now?.data?.next_1_hours?.summary?.symbol_code || now?.data?.next_6_hours?.summary?.symbol_code;
    if (typeof temperature !== 'number' || !symbol) return null;

    // Маргааш (Монголын цагаар): тухайн өдрийн цэгүүдийн температурын дээд/доод, өдрийн 08:00-ийн 12 цагийн төлөв
    const tomorrowDate = localDate(new Date(Date.now() + 24 * 3600 * 1000).toISOString());
    const day = series.filter((t) => localDate(t.time) === tomorrowDate);
    const temps = day.map((t) => t.data?.instant?.details?.air_temperature).filter((v): v is number => typeof v === 'number');
    const morning = day.find((t) => t.data?.next_12_hours?.summary?.symbol_code) || day[0];
    const tomorrowSymbol = morning?.data?.next_12_hours?.summary?.symbol_code || morning?.data?.next_6_hours?.summary?.symbol_code;
    return {
      ok: true,
      temperature,
      symbol,
      tomorrow: temps.length && tomorrowSymbol ? { max: Math.max(...temps), min: Math.min(...temps), symbol: tomorrowSymbol } : null,
    };
  } catch {
    return null;
  }
}

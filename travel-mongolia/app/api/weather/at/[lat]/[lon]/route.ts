import { fetchMetWeather } from '@/lib/metWeather';

// Дурын цэгийн цаг агаар (components/WeatherWidget: өвийн газрын хуудас). MET Norway-д User-Agent
// заавал тул хөтчөөс шууд биш, энэ route-аар дамжина. Хаяг бүр (координат 2 оронтой) 1 цаг кэшлэгдэнэ.
// Монголын нутгийн ойролцоох координатаас өөрийг хүлээж авахгүй (бусдын хэрэглээнээс сэргийлнэ).
export const revalidate = 3600;

const inRange = (lat: number, lon: number) => lat >= 40 && lat <= 53 && lon >= 86 && lon <= 121;

export async function GET(_req: Request, { params }: { params: Promise<{ lat: string; lon: string }> }) {
  const { lat: latRaw, lon: lonRaw } = await params;
  const lat = Number(latRaw);
  const lon = Number(lonRaw);
  if (!/^-?\d{1,3}\.\d{2}$/.test(latRaw) || !/^-?\d{1,3}\.\d{2}$/.test(lonRaw) || !inRange(lat, lon)) {
    return Response.json({ ok: false }, { status: 400 });
  }
  return Response.json((await fetchMetWeather(lat, lon)) || { ok: false });
}

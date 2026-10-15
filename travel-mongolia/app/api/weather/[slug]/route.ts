import { PROVINCE_FACTS } from '@/lib/provinceFacts';

// Аймгийн төвийн цаг агаар (Open-Meteo, түлхүүргүй). Аймгийн хуудас ISR-ээр өдөрт нэг л үүсдэг
// тул цаг агаарыг хуудаснаас тусад нь энэ route-аар 1 цаг кэшилнэ: Contentful-ын API дуудлагад
// нөлөөлөхгүй. Алдаа гарвал { ok: false } буцаана, карт харагдахгүй.
export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PROVINCE_FACTS)
    .filter((slug) => PROVINCE_FACTS[slug].coords)
    .map((slug) => ({ slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const coords = PROVINCE_FACTS[slug]?.coords;
  if (!coords) return Response.json({ ok: false }, { status: 404 });
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${coords[0]}&longitude=${coords[1]}` +
      '&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min' +
      '&timezone=Asia%2FUlaanbaatar&forecast_days=2';
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(String(res.status));
    const d = await res.json();
    const temperature = d?.current?.temperature_2m;
    const code = d?.current?.weather_code;
    const max = d?.daily?.temperature_2m_max?.[1];
    const min = d?.daily?.temperature_2m_min?.[1];
    if (![temperature, code, max, min].every((v) => typeof v === 'number')) throw new Error('хоосон хариу');
    return Response.json({
      ok: true,
      temperature,
      code,
      tomorrow: { max, min, code: d.daily.weather_code[1] },
    });
  } catch {
    return Response.json({ ok: false });
  }
}

import { fetchMetWeather } from '@/lib/metWeather';
import { PROVINCE_FACTS } from '@/lib/provinceFacts';

// Аймгийн төвийн цаг агаар (MET Norway, lib/metWeather.ts). Аймгийн хуудас ISR-ээр өдөрт нэг л
// үүсдэг тул цаг агаарыг хуудаснаас тусад нь энэ route-аар 1 цаг кэшилнэ: Contentful-ын API дуудлагад
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
  return Response.json((await fetchMetWeather(coords[0], coords[1])) || { ok: false });
}

import { getSiteStats } from '@/lib/siteStats';

// Footer-ийн дээрх статистикийн тоо (components/SiteStats.tsx JS ачаалагдсаны дараа уншина).
// Хуудсууд 7 хоногт нэг үүсдэг тул зочдын тоог энэ route-аар шинэчилнэ. Build үед static болгохгүй:
// тэр үед Contentful 429 өгвөл хоосон хариу нэг өдөр кэшлэгдэх байсан. Өгөгдөл нь lib/siteStats.ts-ийн
// Data Cache-ээс (өдөрт 1) ирэх тул хүсэлт бүр Contentful руу явахгүй; CDN-д өдөрт 1 удаа кэшлэнэ.
export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await getSiteStats();
  const ok = stats.content.length > 0 || !!stats.visitors?.length;
  return Response.json(stats, {
    status: ok ? 200 : 503,
    headers: {
      'Cache-Control': ok ? 'public, s-maxage=86400, stale-while-revalidate=3600' : 'no-store',
    },
  });
}

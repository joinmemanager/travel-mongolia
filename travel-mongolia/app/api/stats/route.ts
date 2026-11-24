import { isPreviewEnv } from '@/lib/navigation';
import { ga4LastError, getSiteStats, visitorsSettled } from '@/lib/siteStats';

// Footer-ийн дээрх статистикийн тоо (components/SiteStats.tsx JS ачаалагдсаны дараа уншина).
// Хуудсууд 7 хоногт нэг үүсдэг тул зочдын тоог энэ route-аар шинэчилнэ. Build үед static болгохгүй:
// тэр үед Contentful 429 өгвөл хоосон хариу нэг өдөр кэшлэгдэх байсан. Өгөгдөл нь lib/siteStats.ts-ийн
// Data Cache-ээс (өдөрт 1) ирэх тул хүсэлт бүр Contentful руу явахгүй.
// CDN кэш: бүрэн хариу 1 өдөр. GA4 тохируулсан мөртлөө зочдын тоо ирээгүй бол зөвхөн 5 минут (өмнө нь
// visitors:null хариу CDN-д 1 өдөр үлдэж, GA4 засагдсан ч харагдахгүй байв, 2026-11-24).
export const dynamic = 'force-dynamic';

export async function GET() {
  const stats = await getSiteStats();
  const ok = stats.content.length > 0 || !!stats.visitors?.length;
  const settled = ok && stats.content.length > 0 && visitorsSettled(stats);
  // Preview/staging дээр GA4-ийн алдааны кодыг (нууцгүй, жишээ нь "auth", "missing_env") харуулна
  const body = isPreviewEnv() && !stats.visitors ? { ...stats, visitorsError: ga4LastError() } : stats;
  return Response.json(body, {
    status: ok ? 200 : 503,
    headers: {
      'Cache-Control': !ok
        ? 'no-store'
        : settled
          ? 'public, s-maxage=86400, stale-while-revalidate=3600'
          : 'public, s-maxage=300',
    },
  });
}

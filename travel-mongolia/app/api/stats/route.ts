import { getSiteStats } from '@/lib/siteStats';

// Footer-ийн дээрх статистикийн тоо (components/SiteStats.tsx JS ачаалагдсаны дараа уншина).
// Хуудсууд 7 хоногт нэг үүсдэг тул зочдын тоог энэ route-аар өдөрт 1 удаа шинэчилнэ.
export const revalidate = 86400;

export async function GET() {
  return Response.json(await getSiteStats());
}

import { getSiteStats } from '@/lib/siteStats';

import SiteStats from './SiteStats';

// Footer-ийн дээрх статистикийн server хэсэг: тоог server HTML-д оруулна (lib/siteStats.ts, өдөрт 1 кэш)
export default async function SiteStatsSection() {
  const stats = await getSiteStats();
  if (!stats.visitors?.length && !stats.content.length) return null;
  return <SiteStats initial={stats} />;
}

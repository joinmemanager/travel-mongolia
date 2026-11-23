import { getSiteStats } from '@/lib/siteStats';

import SiteStats from './SiteStats';

// Footer-ийн дээрх статистикийн server хэсэг: тоог server HTML-д оруулна (lib/siteStats.ts, өдөрт 1 кэш).
// Тоо хоосон ирсэн ч (build үеийн Contentful 429) client компонентыг гаргана: тэр /api/stats-аас нөхнө.
export default async function SiteStatsSection() {
  return <SiteStats initial={await getSiteStats()} />;
}

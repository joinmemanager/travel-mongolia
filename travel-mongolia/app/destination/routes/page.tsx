import React from 'react';

import RoutesExplorer from '@/components/RoutesExplorer';
import { getRelatedItems, type RelatedItem } from '@/lib/related';
import { ROUTES_LIST } from '@/lib/routesData';

// Аяллын маршрутууд. Интерактив хэсэг нь components/RoutesExplorer (client).
// Маршрут бүрийн зогсоолуудаас 50 км дотор байрлах нутгийн туршлага, үйлчилгээг энд тооцоолно.
export const revalidate = 240;

export default async function ScenicRoutesPage() {
  const entries = await Promise.all(
    ROUTES_LIST.map(async (route) => {
      const items = await getRelatedItems({
        near: route.stops.map((s) => ({ lat: s.coord[0], lon: s.coord[1] })),
        nearKm: 50,
      });
      return [route.id, items] as [string, RelatedItem[]];
    })
  );
  return <RoutesExplorer relatedByRoute={Object.fromEntries(entries)} />;
}

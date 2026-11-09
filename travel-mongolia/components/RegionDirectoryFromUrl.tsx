'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';

import RegionDirectory, { type ExternalSearchItem } from '@/components/RegionDirectory';

// /destination/region?region=<id>: параметрийг client талд уншина, ингэснээр хуудас статик/ISR болно
// (өмнө нь server талд searchParams уншдаг тул хүсэлт бүрт render хийгддэг байв). Server HTML-д
// (Suspense fallback) «бүх бүс»-ийн хувилбар орно; canonical нь /destination/region тул SEO өөрчлөгдөхгүй.
export default function RegionDirectoryFromUrl({ externalItems }: { externalItems: ExternalSearchItem[] }) {
  const region = useSearchParams().get('region') || undefined;
  return <RegionDirectory key={region ?? 'all'} initialSubSlug={region} externalItems={externalItems} />;
}

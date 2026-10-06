'use client';

import React from 'react';

import CategoryDirectory, { DirectoryGroupSection } from '@/components/templates/CategoryDirectory';
import { IMAGES } from '@/lib/images';

// Нүүр хуудсанд ангилал бүрээс хэдэн карт харуулах вэ; бүгдийг нь /destination/heritage/[category] дээр харуулна
const PREVIEW_COUNT = 3;

export interface HeritagePlace {
  id: string;
  name: string;
  region: string;
  img: string;
}

interface HeritageCategory {
  id: string;
  title: string;
  count: string;
  places: HeritagePlace[];
  remainingCount: number;
}

// /destination/heritage: "Газрын ангилал" загвар (components/templates/CategoryDirectory)
export default function HeritagePageClient({
  categories,
}: {
  categories: HeritageCategory[];
}) {
  return (
    <CategoryDirectory
      hero={IMAGES.chinggisStatue}
      kicker="05. Heritage Destinations"
      title="Түүх, соёлын газруудаар"
      intro="ЮНЕСКО-гийн дэлхийн өв, эртний хаадын нийслэл хотууд, сүм хийд ба нүүдэлчдийн амьд соёл"
      nav={categories.map((sec) => ({ id: sec.id, label: sec.title }))}
    >
      {categories.map((sec) => (
        <DirectoryGroupSection
          key={sec.id}
          group={{
            id: sec.id,
            title: sec.title,
            count: sec.count,
            moreHref: `/destination/heritage/${sec.id}`,
            remainingCount: sec.remainingCount,
            places: sec.places.slice(0, PREVIEW_COUNT).map((place) => ({
              name: place.name,
              region: place.region,
              img: place.img,
              href: `/destination/heritage/place/${place.id}`,
            })),
          }}
          moreCount="дурсгал"
          moreTitle="Бүх түүхэн өвийн сан"
          moreDesc="Интерактив газрын зураг, байршил & дэлгэрэнгүй"
        />
      ))}
    </CategoryDirectory>
  );
}

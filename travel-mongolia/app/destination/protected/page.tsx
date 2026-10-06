'use client';

import CategoryDirectory, { DirectoryGroupSection } from '@/components/templates/CategoryDirectory';

interface PlaceCard {
  name: string;
  region: string;
  img: string;
}

interface CategoryData {
  id: string;
  // "Дэлгэрэнгүй" товч хаашаа заах (docs/plan/broken-links.md). Байхгүй бол товч харагдахгүй
  moreHref?: string;
  title: string;
  count: string;
  places: PlaceCard[];
  remainingCount: number;
}

const CATEGORIES: CategoryData[] = [
  {
    id: 'strictly-protected',
    moreHref: '/destination/strictly-protected',
    title: 'Дархан цаазат газар',
    count: 'Нийт 22 бүс нутаг',
    places: [
      {
        name: 'Богд хан уул',
        region: 'Төв аймаг · 1778 он',
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000',
      },
      {
        name: 'Говийн их дархан газар',
        region: 'Говь-Алтай · Мазаалайн өлгий',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
      {
        name: 'Отгонтэнгэр хайрхан',
        region: 'Завхан · 4,008 м',
        img: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1000',
      },
    ],
    remainingCount: 19,
  },
  {
    id: 'national-parks',
    moreHref: '/destination/national-parks',
    title: 'Байгалийн цогцолборт газар',
    count: 'Нийт 37 бүс нутаг',
    places: [
      {
        name: 'Хөвсгөл нуур',
        region: 'Хөвсгөл · Далай ээж',
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
      },
      {
        name: 'Горхи-Тэрэлж',
        region: 'Төв аймаг · Мэлхий хад',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
      {
        name: 'Хустайн нуруу',
        region: 'Төв аймаг · Тахийн өлгий',
        img: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=1000',
      },
    ],
    remainingCount: 34,
  },
  {
    id: 'nature-reserves',
    moreHref: '/destination/nature-reserves',
    title: 'Байгалийн нөөц газар',
    count: 'Нийт 36 бүс нутаг',
    places: [
      {
        name: 'Их нартын чулуу',
        region: 'Дорноговь · Аргалийн нутаг',
        img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000',
      },
      {
        name: 'Батхаан уул',
        region: 'Төв аймаг · Ойт хээр',
        img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000',
      },
      {
        name: 'Гүн галуут',
        region: 'Төв аймаг · Шувуудын орон',
        img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1000',
      },
    ],
    remainingCount: 33,
  },
  {
    id: 'natural-monuments',
    moreHref: '/destination/natural-monuments',
    title: 'Байгалийн дурсгалт газар',
    count: 'Нийт 14 бүс нутаг',
    places: [
      {
        name: 'Улаан цутгалан хүрхрээ',
        region: 'Өвөрхангай · Орхоны хөндий',
        img: 'https://images.unsplash.com/photo-1511497584788-87676104235f?q=80&w=1000',
      },
      {
        name: 'Хоргын тогоо',
        region: 'Архангай · Тэрхийн цагаан нуур',
        img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000',
      },
      {
        name: 'Цагаан суварга',
        region: 'Дундговь · Эртний хавцал',
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1000',
      },
    ],
    remainingCount: 11,
  },
];

export default function ProtectedAreasPage() {
  return (
    <CategoryDirectory
      hero={{
        src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2400',
        alt: 'Тусгай хамгаалалттай газрууд',
      }}
      kicker="03. Protected Areas"
      title="Тусгай хамгаалалттай газраар"
      intro="Монгол орны онгон дагшин 4 үндсэн ангиллын тусгай хамгаалалттай нутгууд"
      nav={CATEGORIES.map((sec) => ({ id: sec.id, label: sec.title }))}
    >
      {CATEGORIES.map((sec) => (
        <DirectoryGroupSection
          key={sec.id}
          group={sec}
          moreCount="газар"
          moreTitle="Бүх газрын лавлах"
          moreDesc="Интерактив газрын зураг, байршил & дэлгэрэнгүй мэдээлэл"
        />
      ))}
    </CategoryDirectory>
  );
}

import React from 'react';

import LinkCard from '@/components/design/LinkCard';
import RegionDirectory, {
  type ExternalSearchItem,
} from '@/components/RegionDirectory';
import { client } from '@/lib/contentful';
import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/destination/region');

interface Props {
  searchParams: Promise<{ region?: string }>;
}

function plainText(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value.nodeType === 'text') return value.value || '';
  if (Array.isArray(value.content)) {
    return value.content.map(plainText).join(' ');
  }
  return '';
}

interface ProvinceLink {
  title: string;
  center: string;
  href: string;
}

// Contentful-д нэмсэн түүхэн өв, аймгуудыг хайлт болон "Аймаг, хотууд" хэсэгт ашиглана
async function getContentfulData(): Promise<{
  searchItems: ExternalSearchItem[];
  provinces: ProvinceLink[];
}> {
  try {
    const [places, provinces] = await Promise.all([
      client.getEntries({ content_type: 'heritagePlace', limit: 200 }),
      client.getEntries({ content_type: 'province', limit: 100 }),
    ]);

    const placeItems = places.items.map((item: any) => {
      const f = item.fields || {};
      return {
        id: `heritage-${item.sys.id}`,
        title: String(f.name || ''),
        subtitle: String(f.region || ''),
        group: 'Түүхэн өв',
        href: `/destination/heritage/place/${f.slug || item.sys.id}`,
        keywords: [plainText(f.description)],
      };
    });

    const provinceItems = provinces.items.map((item: any) => {
      const f = item.fields || {};
      return {
        id: `province-${item.sys.id}`,
        title: String(f.title || ''),
        subtitle: String(f.center ? `Төв: ${f.center}` : ''),
        group: 'Аймаг, хот',
        href: `/province/${f.slug || item.sys.id}`,
        keywords: [
          ...[f.highlights].flat().filter(Boolean).map(String),
          plainText(f.description2),
        ],
      };
    });

    const provinceLinks = provinceItems
      .filter((i) => i.title)
      .map((i) => ({
        title: i.title,
        center: i.subtitle,
        href: i.href,
      }))
      .sort((a, b) => a.title.localeCompare(b.title, 'mn'));

    return {
      searchItems: [...placeItems, ...provinceItems].filter((i) => i.title),
      provinces: provinceLinks,
    };
  } catch (err) {
    console.error('Хайлтын Contentful өгөгдөл татахад алдаа гарлаа:', err);
    return { searchItems: [], provinces: [] };
  }
}

export default async function RegionPage({ searchParams }: Props) {
  const { region } = await searchParams;
  const { searchItems, provinces } = await getContentfulData();

  return (
    <main className="min-h-screen bg-white">
      <RegionDirectory
        key={region ?? 'all'}
        initialSubSlug={region}
        externalItems={searchItems}
      />

      {/* Contentful-д нэмэгдсэн аймаг бүр энд автоматаар холбогдоно (цэсний "Аймгууд" энэ хэсэг рүү заана) */}
      {provinces.length > 0 && (
        <section
          id="provinces"
          className="scroll-mt-24 px-4 py-16 mx-auto max-w-7xl sm:px-6"
        >
          <h2 className="mb-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
            Аймаг, хотууд
          </h2>
          <p className="mb-8 text-sm text-gray-500">
            Аймаг, хот бүрийн үзэх газрууд, аялах мэдээлэл
          </p>
          {/* Холбоосны карт (components/design/LinkCard) */}
          <LinkCard
            bare
            columns={3}
            links={provinces.map((p) => ({ label: p.title, href: p.href, desc: p.center }))}
          />
        </section>
      )}

      <div className="px-4 pb-16 mx-auto max-w-7xl sm:px-6">
        <LinkCard
          title="Холбогдох хуудсууд"
          columns={3}
          links={[
            { label: 'Түүхэн өв, дурсгалт газрууд', href: '/destination/heritage' },
            { label: 'Байгалийн тогтоц, ландшафт', href: '/destination/landscapes' },
            { label: 'Тусгай хамгаалалттай газрууд', href: '/destination/protected' },
            { label: 'Аяллын чиглэлүүд', href: '/destination/routes' },
            { label: 'Газрын зураг', href: '/destination/map' },
          ]}
        />
      </div>
    </main>
  );
}

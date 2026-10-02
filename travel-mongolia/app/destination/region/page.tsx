import React from 'react';
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

// Contentful-д нэмсэн түүхэн өв, аймгуудыг хайлтад оруулна
async function getContentfulSearchItems(): Promise<ExternalSearchItem[]> {
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
        href: `/destination/heritage/place/${item.sys.id}`,
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

    return [...placeItems, ...provinceItems].filter((i) => i.title);
  } catch (err) {
    console.error('Хайлтын Contentful өгөгдөл татахад алдаа гарлаа:', err);
    return [];
  }
}

export default async function RegionPage({ searchParams }: Props) {
  const { region } = await searchParams;
  const externalItems = await getContentfulSearchItems();

  return (
    <main className="min-h-screen bg-white">
      <RegionDirectory
        key={region ?? 'all'}
        initialSubSlug={region}
        externalItems={externalItems}
      />
    </main>
  );
}

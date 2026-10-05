import Link from 'next/link';
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
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {provinces.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group block p-5 h-full bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all shadow-xs"
                >
                  <span className="block text-base font-bold text-gray-900 group-hover:text-[#15803d] transition-colors">
                    {p.title}
                  </span>
                  {p.center && (
                    <span className="block mt-1 text-xs text-gray-500">
                      {p.center}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

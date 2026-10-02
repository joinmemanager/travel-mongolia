import { client } from '@/lib/contentful';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import MongoliaLocatorMap from '@/components/MongoliaLocatorMap';
import WeatherWidget from '@/components/WeatherWidget';
import { pageMetadata, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';

// generateMetadata болон хуудас хоёулаа ашиглах тул нэг л удаа татна
const getPlace = cache(async (id: string) => {
  try {
    return (await client.getEntry(id)) as any;
  } catch (err) {
    console.error('Heritage place fetch error:', err);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getPlace(id);
  if (!entry) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };

  const f = entry.fields;
  const plain = richTextToPlain(f.description);
  return pageMetadata({
    title: f.region ? `${f.name}, ${f.region}` : f.name,
    description: truncate(
      plain || `${f.name}: Монголын түүх, соёлын дурсгалт газар. Байршил, цаг агаар, аялах мэдээлэл.`
    ),
    path: `/destination/heritage/place/${id}`,
    image: getImageUrl(f.image),
  });
}

function getImageUrl(imageField: any): string {
  if (!imageField)
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600';
  const url = imageField?.fields?.file?.url || '';
  if (!url) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600';
  }
  return url.startsWith('//') ? `https:${url}` : url;
}

function renderRichText(node: any): any {
  if (!node) return null;
  if (typeof node === 'string') return node;
  if (node.nodeType === 'text') return node.value;

  if (node.nodeType === 'paragraph') {
    return (
      <p className="mb-4 text-base leading-relaxed text-neutral-700">
        {node.content?.map((child: any, idx: number) => (
          <span key={idx}>{renderRichText(child)}</span>
        ))}
      </p>
    );
  }

  if (Array.isArray(node.content)) {
    return node.content.map((child: any, idx: number) => (
      <span key={idx}>{renderRichText(child)}</span>
    ));
  }

  return null;
}

export default async function HeritagePlaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getPlace(id);

  // Байхгүй хуудсыг 404 болгосноор Google хоосон хуудсыг index-д оруулахгүй
  if (!entry) notFound();

  const f = entry.fields;
  const imgUrl = getImageUrl(f.image);
  const lat = f.coordinates?.lat;
  const lon = f.coordinates?.lon;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: f.name,
    description: truncate(richTextToPlain(f.description), 300) || undefined,
    image: imgUrl,
    url: `${SITE_URL}/destination/heritage/place/${id}`,
    address: {
      '@type': 'PostalAddress',
      addressRegion: f.region || undefined,
      addressCountry: 'MN',
    },
    geo:
      typeof lat === 'number' && typeof lon === 'number'
        ? { '@type': 'GeoCoordinates', latitude: lat, longitude: lon }
        : undefined,
  };

  return (
    <main className="w-full bg-white text-neutral-900 pb-28 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-end overflow-hidden">
        <Image
          src={imgUrl}
          alt={f.name || ''}
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.55]"
        />
        <div className="relative z-10 px-6 sm:px-10 pb-10 max-w-7xl mx-auto w-full">
          <Link href="/destination/heritage" className="text-white/80 text-sm font-semibold mb-3 inline-block hover:text-white">
            ← Бүх түүхэн өв
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {f.name}
          </h1>
          <p className="text-white/90 text-sm sm:text-base font-medium mt-2">{f.region}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-14 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {f.description ? (
            renderRichText(f.description)
          ) : (
            <p className="text-neutral-500 italic">Энэ газрын дэлгэрэнгүй тайлбар удахгүй нэмэгдэнэ.</p>
          )}
        </div>

        <div className="space-y-8">
          {typeof lat === 'number' && typeof lon === 'number' && (
            <div className="rounded-2xl border border-neutral-200 p-5 bg-neutral-50">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Байршил</h3>
              <MongoliaLocatorMap lat={lat} lon={lon} />
            </div>
          )}

          {typeof lat === 'number' && typeof lon === 'number' && (
            <div className="rounded-2xl border border-neutral-200 p-5">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Цаг агаар</h3>
              <WeatherWidget lat={lat} lon={lon} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
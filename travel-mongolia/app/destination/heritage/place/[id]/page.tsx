import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import MongoliaLocatorMap from '@/components/MongoliaLocatorMap';
import WeatherWidget from '@/components/WeatherWidget';
import { GuidanceBlock, PlaceEsgBlocks } from '@/components/templates/DetailBlocks';
import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { entryKey, getEntryBySlugOrId } from '@/lib/entries';
import { getHeritagePlaceCards, nearestPlaces } from '@/lib/places';
import { getGuidanceFor } from '@/lib/localContent';
import { pageMetadata, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';

// 'heritagePlace' entry-г slug-аар (хуучин холбоосод ID-аар) татна.
// generateMetadata болон хуудас хоёулаа ашиглах тул нэг л удаа татна.
const getPlace = cache(async (param: string) => getEntryBySlugOrId('heritagePlace', param));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const found = await getPlace(id);
  if (!found) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };
  const entry = found.entry as any;

  const f = entry.fields;
  const plain = richTextToPlain(f.description);
  return pageMetadata({
    title: f.region ? `${f.name}, ${f.region}` : f.name,
    description: truncate(
      plain || `${f.name}: Монголын түүх, соёлын дурсгалт газар. Байршил, цаг агаар, аялах мэдээлэл.`
    ),
    path: `/destination/heritage/place/${entryKey(entry)}`,
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
  const found = await getPlace(id);

  // Байхгүй хуудсыг 404 болгосноор Google хоосон хуудсыг index-д оруулахгүй
  if (!found) notFound();
  const entry = found.entry as any;
  // Хуучин ID хаягаар орж ирвэл slug хаяг руу байнгын redirect
  if (found.matchedBy === 'id' && entryKey(entry) !== id) {
    permanentRedirect(`/destination/heritage/place/${entryKey(entry)}`);
  }

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
    url: `${SITE_URL}/destination/heritage/place/${entryKey(entry)}`,
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

  const hasCoords = typeof lat === 'number' && typeof lon === 'number';
  const nearby = hasCoords ? nearestPlaces({ lat, lon }, await getHeritagePlaceCards(), entry.sys.id) : [];

  // Хэрхэн зөв аялах (visitorGuidance)
  const guidance = await getGuidanceFor(entry.sys.id);

  return (
    <PlaceTemplate
      image={{ src: imgUrl, alt: f.name || '' }}
      title={f.name}
      subtitle={f.region}
      back={{ href: '/destination/heritage', label: 'Бүх түүхэн өв' }}
      jsonLd={jsonLd}
      nearby={{ title: 'Ойролцоох газрууд', places: nearby }}
      links={[
        { label: 'Түүхэн өв, дурсгалт газрууд', href: '/destination/heritage' },
        { label: 'Зорих газрууд', href: '/destination/region' },
        { label: 'Газрын зураг', href: '/destination/map' },
      ]}
      aside={
        hasCoords ? (
          <>
            <div className="rounded-2xl border border-neutral-200 p-5 bg-neutral-50">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Байршил</h3>
              <MongoliaLocatorMap lat={lat} lon={lon} />
            </div>
            <div className="rounded-2xl border border-neutral-200 p-5">
              <h3 className="text-sm font-bold text-neutral-900 mb-3">Цаг агаар</h3>
              <WeatherWidget lat={lat} lon={lon} />
            </div>
          </>
        ) : undefined
      }
    >
      {f.description ? (
        renderRichText(f.description)
      ) : (
        <p className="text-neutral-500 italic">Энэ газрын дэлгэрэнгүй тайлбар удахгүй нэмэгдэнэ.</p>
      )}
      <PlaceEsgBlocks fields={(found.entry as any).fields} />
      <GuidanceBlock items={guidance} />
    </PlaceTemplate>
  );
}

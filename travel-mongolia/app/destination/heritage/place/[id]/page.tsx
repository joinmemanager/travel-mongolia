import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { cache } from 'react';
import MongoliaLocatorMap from '@/components/MongoliaLocatorMap';
import WeatherWidget from '@/components/WeatherWidget';
import { GuidanceBlock, PlaceEsgBlocks } from '@/components/templates/DetailBlocks';
import PlaceFacts from '@/components/places/PlaceFacts';
import RichText from '@/components/RichText';
import RelatedBookings from '@/components/templates/RelatedBookings';
import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { entryKey, getEntryBySlugOrId } from '@/lib/entries';
import { getHeritagePlaceCards, nearestPlaces } from '@/lib/places';
import { getGuidanceFor } from '@/lib/localContent';
import { getRelatedItems, linkIds } from '@/lib/related';
import { isThinContent, NOINDEX, pageMetadata, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';
import { creditOf } from '@/lib/imageCredit';
import { photoSrc } from '@/lib/images';
import { mergedPlaceFacts } from '@/lib/tourismPlaces';

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
  const meta = pageMetadata({
    title: f.region ? `${f.name}, ${f.region}` : f.name,
    description: f.seoDescription || truncate(
      plain || `${f.name}: Монголын түүх, соёлын дурсгалт газар. Байршил, цаг агаар, аялах мэдээлэл.`
    ),
    path: `/destination/heritage/place/${entryKey(entry)}`,
    image: getImageUrl(f.image),
  });
  // Тайлбаргүй (placeholder цэвэрлэсэн) газрыг агуулга нэмэгдэх хүртэл хайлтад оруулахгүй
  return isThinContent(f.description) ? { ...meta, robots: NOINDEX } : meta;
}

function getImageUrl(imageField: any): string {
  if (!imageField)
    return photoSrc('gerCamp', 1600);
  const url = imageField?.fields?.file?.url || '';
  if (!url) {
    return photoSrc('gerCamp', 1600);
  }
  return url.startsWith('//') ? `https:${url}` : url;
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

  // Холбоотой аялал, туршлага, үйлчилгээ: related_* талбар, байхгүй бол ижил аймаг
  const placeFields: any = entry.fields || {};
  const related = await getRelatedItems({
    experienceIds: linkIds(placeFields.relatedExperience),
    providerIds: linkIds(placeFields.relatedProvider),
    productIds: linkIds(placeFields.relatedProduct),
    provinceText: placeFields.province || placeFields.region,
    near: hasCoords ? [{ lat, lon }] : [],
  });

  // Хэрхэн зөв аялах (visitorGuidance)
  const guidance = await getGuidanceFor(entry.sys.id);
  // Аймаг (provinceRef), тусгай хамгаалалтын ангилал (TIC-ээс нэгтгэсэн, хотын дурсгалт газар)
  const facts = mergedPlaceFacts(entry, 'heritagePlace');

  return (
    <PlaceTemplate
      image={{ src: imgUrl, alt: f.name || '', credit: creditOf(f.image) }}
      title={f.name}
      subtitle={f.region}
      back={{ href: '/destination/heritage', label: 'Бүх түүхэн өв' }}
      analytics={{ content_type: 'heritage', content_id: entryKey(entry), province: placeFields.province || placeFields.region || '' }}
      bookings={<RelatedBookings items={related} campaign="heritage" contentId={entryKey(entry)} />}
      jsonLd={jsonLd}
      nearby={{ title: 'Ойролцоох газрууд', places: nearby }}
      breadcrumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Түүхэн өв, дурсгалт газрууд', href: '/destination/heritage' },
        { label: f.name || '', href: `/destination/heritage/place/${entryKey(entry)}` },
      ]}
      links={[
        { label: 'Түүхэн өв, дурсгалт газрууд', href: '/destination/heritage' },
        { label: 'Зорих газрууд', href: '/destination/region' },
        { label: 'Газрын зураг', href: '/destination/map' },
      ]}
      aside={
        hasCoords || facts ? (
          <>
            {facts && <PlaceFacts place={facts} />}
            {hasCoords && (
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
            )}
          </>
        ) : undefined
      }
    >
      {f.description ? (
        <div className="text-neutral-700">
          <RichText document={f.description} />
        </div>
      ) : (
        <p className="text-neutral-500 italic">Энэ газрын дэлгэрэнгүй тайлбар удахгүй нэмэгдэнэ.</p>
      )}
      <PlaceEsgBlocks fields={(found.entry as any).fields} />
      <GuidanceBlock items={guidance} />
    </PlaceTemplate>
  );
}

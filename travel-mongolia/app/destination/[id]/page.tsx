export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import React, { cache } from 'react';

import { GuidanceBlock, PlaceEsgBlocks } from '@/components/templates/DetailBlocks';
import RelatedBookings from '@/components/templates/RelatedBookings';
import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { entryKey, getEntryBySlugOrId } from '@/lib/entries';
import { getDestinationCards } from '@/lib/places';
import { getGuidanceFor } from '@/lib/localContent';
import { getRelatedItems, linkIds } from '@/lib/related';
import { pageMetadata, richTextToPlain, truncate } from '@/lib/seo';

interface Props {
  params: Promise<{ id: string }>;
}

// 'destination' төрлийн entry-г slug-аар (хуучин холбоосод ID-аар) татна.
// generateMetadata болон хуудас хоёулаа ашиглах тул нэг л удаа татна.
const getDestination = cache(async (param: string) => getEntryBySlugOrId('destination', param));

function getImageUrl(fields: any): string | undefined {
  const url = (fields.image || fields.coverImage)?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await getDestination(id);
  if (!found) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };
  const destination = found.entry;

  const fields = destination.fields as any;
  return pageMetadata({
    title: fields.title,
    description: truncate(
      richTextToPlain(fields.description) ||
        fields.subtitle ||
        `${fields.title}: Монголд аялах онцлох газар, үзэх зүйлс, аяллын мэдээлэл.`
    ),
    path: `/destination/${entryKey(destination)}`,
    image: getImageUrl(fields),
  });
}

function parseRichText(node: any): any {
  if (!node) return null;
  if (typeof node === 'string') return node;

  if (node.nodeType === 'text') {
    return node.value;
  }

  if (node.nodeType === 'paragraph') {
    return (
      <p className="mb-4 text-base sm:text-lg leading-relaxed text-neutral-800">
        {node.content?.map((child: any, idx: number) => (
          <React.Fragment key={idx}>{parseRichText(child)}</React.Fragment>
        ))}
      </p>
    );
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child: any, idx: number) => (
      <div key={idx}>{parseRichText(child)}</div>
    ));
  }

  return null;
}

export default async function DestinationDetailPage({ params }: Props) {
  const { id } = await params;
  const found = await getDestination(id);

  if (!found) {
    notFound();
  }
  const destination = found.entry;
  // Хуучин ID хаягаар орж ирвэл slug хаяг руу байнгын redirect
  if (found.matchedBy === 'id' && entryKey(destination) !== id) {
    permanentRedirect(`/destination/${entryKey(destination)}`);
  }

  const fields = destination.fields as any;
  const imageUrl =
    getImageUrl(fields) ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600';

  // Ихэнх газар координатгүй тул зайгаар эрэмбэлэхгүй: "Бусад газрууд"
  const others = (await getDestinationCards()).filter((p) => p.id !== destination.sys.id).slice(0, 3);

  // Холбоотой аялал, туршлага, үйлчилгээ: related_* талбар, байхгүй бол ижил аймаг
  const placeFields: any = found.entry.fields || {};
  const related = await getRelatedItems({
    experienceIds: linkIds(placeFields.relatedExperience),
    providerIds: linkIds(placeFields.relatedProvider),
    productIds: linkIds(placeFields.relatedProduct),
    provinceText: placeFields.province,
  });

  // Хэрхэн зөв аялах (visitorGuidance)
  const guidance = await getGuidanceFor(destination.sys.id);

  return (
    <PlaceTemplate
      image={{ src: imageUrl, alt: fields.title || 'Destination' }}
      title={fields.title || 'Destination'}
      back={{ href: '/#highlights', label: 'Нүүр хуудас руу буцах' }}
      analytics={{ content_type: 'destination', content_id: entryKey(destination), province: placeFields.province || '' }}
      bookings={<RelatedBookings items={related} campaign="destination" contentId={entryKey(destination)} />}
      nearby={{ title: 'Бусад газрууд', places: others }}
      links={[
        { label: 'Зорих газрууд', href: '/destination/region' },
        { label: 'Түүхэн өв, дурсгалт газрууд', href: '/destination/heritage' },
        { label: 'Газрын зураг', href: '/destination/map' },
      ]}
    >
      <div className="text-neutral-800">
        {fields.description ? (
          parseRichText(fields.description)
        ) : (
          <p className="text-base sm:text-lg text-neutral-500 italic">
            Тун удахгүй дэлгэрэнгүй мэдээлэл нэмэгдэнэ...
          </p>
        )}
      </div>
      <PlaceEsgBlocks fields={(found.entry as any).fields} />
      <GuidanceBlock items={guidance} />
    </PlaceTemplate>
  );
}

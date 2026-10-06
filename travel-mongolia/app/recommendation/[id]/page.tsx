import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import React, { cache } from 'react';

import EventTemplate from '@/components/templates/EventTemplate';
import { entryKey, getEntryBySlugOrId } from '@/lib/entries';
import {
  type EventItem,
  getAllEvents,
  getEventBySlug,
  recommendationToEvent,
} from '@/lib/localContent';
import { getRelatedItems } from '@/lib/related';
import { pageMetadata, richTextToPlain, truncate } from '@/lib/seo';

// Арга хэмжээний дэлгэрэнгүй ("Арга хэмжээ" загвар). Эхлээд 'event' төрлөөс slug-аар,
// олдохгүй бол хуучин 'recommendation' (наадмууд)-аас slug эсвэл хуучин ID-аар хайна.
export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

type Found =
  | { kind: 'event'; event: EventItem }
  | { kind: 'recommendation'; event: EventItem; entry: any; matchedBy: 'slug' | 'id' };

const getItem = cache(async (param: string): Promise<Found | null> => {
  const event = await getEventBySlug(param);
  if (event) return { kind: 'event', event };
  const found = await getEntryBySlugOrId('recommendation', param);
  if (!found) return null;
  return { kind: 'recommendation', event: recommendationToEvent(found.entry), entry: found.entry, matchedBy: found.matchedBy };
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };

  const e = item.event;
  if (item.kind === 'recommendation') {
    // Хуучин хуудастай ижил гарчиг, тайлбар
    const fields = item.entry.fields as any;
    const url = (fields.image || fields.coverImage)?.fields?.file?.url;
    return pageMetadata({
      title: fields.title,
      description: truncate(
        richTextToPlain(fields.description) ||
          `${fields.title}: Монголд аялахад санал болгох газар, туршлага.`
      ),
      path: `/recommendation/${entryKey(item.entry)}`,
      image: url ? (url.startsWith('//') ? `https:${url}` : url) : undefined,
    });
  }
  return pageMetadata({
    title: e.title,
    description: truncate(
      richTextToPlain(e.culturalMeaning) ||
        `${e.title}: ${[e.province, e.organizer].filter(Boolean).join(', ')}. Огноо, соёлын утга, зөв оролцох зөвлөмж.`
    ),
    path: `/recommendation/${e.slug}`,
    image: e.photos[0]?.src,
  });
}

export default async function EventPage({ params }: Props) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  // Хуучин ID хаягаар орж ирвэл slug хаяг руу байнгын redirect
  if (item.kind === 'recommendation' && item.matchedBy === 'id' && entryKey(item.entry) !== id) {
    permanentRedirect(`/recommendation/${entryKey(item.entry)}`);
  }

  const others = (await getAllEvents()).filter((o) => o.id !== item.event.id).slice(0, 3);
  // Арга хэмжээний нутгийн үйлчилгээ; байхгүй бол ижил аймгийнх
  const related = await getRelatedItems({
    providerIds: item.event.localServices.map((r) => r.id),
    provinceText: item.event.province,
  });
  return (
    <EventTemplate
      event={item.event}
      others={others}
      related={related}
      back={
        item.kind === 'event'
          ? { href: '/things-to-do/festivals', label: 'Фестивалиуд' }
          : { href: '/', label: 'Нүүр хуудас руу буцах' }
      }
    />
  );
}

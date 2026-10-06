import React from 'react';

import RichText from '@/components/RichText';
import { IMAGES } from '@/lib/images';
import { type EventItem, eventDateLabel } from '@/lib/localContent';

import { BulletList, FactsCard, InfoBlock, RefLink } from './DetailBlocks';
import PlaceTemplate from './PlaceTemplate';

// "Арга хэмжээ" загвар (/recommendation/<slug>): баримт бичгийн 7-р хэсгийн Event block-ууд
// (огноо, нутгийн зохион байгуулагч, соёлын утга, зөв оролцох зөвлөмж, нутгийн үйлчилгээ,
// захиалга). 'event' төрөл болон хуучин 'recommendation' (наадмууд) хоёуланд нь.
export default function EventTemplate({
  event: e,
  others,
  back,
}: {
  event: EventItem;
  others: EventItem[];
  back: { href: string; label: string };
}) {
  return (
    <PlaceTemplate
      image={e.photos[0] || IMAGES.gerStars}
      title={e.title}
      subtitle={[eventDateLabel(e), e.province].filter(Boolean).join(' · ')}
      back={back}
      nearby={{
        title: 'Бусад баяр наадам',
        places: others.map((o) => ({
          id: o.id,
          href: o.href,
          title: o.title,
          region: [eventDateLabel(o), o.province].filter(Boolean).join(' · '),
          image: o.photos[0],
        })),
      }}
      links={[
        { label: 'Фестивалиуд', href: '/things-to-do/festivals' },
        { label: 'Арга хэмжээ, баяр наадам', href: '/things-to-do/events' },
        { label: 'Соёл, ёс заншил', href: '/respect/etiquette' },
      ]}
      aside={
        <FactsCard
          facts={[
            { label: 'Огноо', value: eventDateLabel(e) },
            { label: 'Аймаг', value: e.province },
            { label: 'Зохион байгуулагч', value: e.organizer },
          ]}
          bookingUrl={e.bookingUrl}
          bookingLabel="Аялал захиалах"
        />
      }
    >
      <InfoBlock title="Соёлын утга">{e.culturalMeaning ? <RichText document={e.culturalMeaning} /> : null}</InfoBlock>

      <InfoBlock title="Зөв оролцох зөвлөмж">
        {e.howToParticipate.length > 0 ? <BulletList items={e.howToParticipate} /> : null}
      </InfoBlock>

      <InfoBlock title="Нутгийн үйлчилгээ">
        {e.localServices.length > 0 ? (
          <ul className="space-y-2">
            {e.localServices.map((s) => (
              <li key={s.id} className="text-base">
                <RefLink href={s.href} title={s.title} />
              </li>
            ))}
          </ul>
        ) : null}
      </InfoBlock>
    </PlaceTemplate>
  );
}

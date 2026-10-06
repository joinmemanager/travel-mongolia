import React from 'react';

import RichText from '@/components/RichText';
import { IMAGES } from '@/lib/images';
import type { CommunityExperience, LocalProduct } from '@/lib/localContent';

import { FactsCard, InfoBlock, RefLink } from './DetailBlocks';
import PlaceTemplate from './PlaceTemplate';

// "Туршлага" загвар (/local/experiences/<slug>): баримт бичгийн 7-р хэсгийн Experience block-ууд
// (хэн зохион байгуулдаг, нутгийн оролцоо, юу сурах/мэдрэх, бүлгийн хэмжээ,
// соёлын зөв харилцаа, захиалга). Хоосон хэсэг харагдахгүй.
export default function ExperienceTemplate({
  experience: x,
  others,
  products,
}: {
  experience: CommunityExperience;
  others: CommunityExperience[];
  products: LocalProduct[];
}) {
  const related = [
    ...products.map((p) => ({ id: p.id, href: p.href, title: p.name, region: p.origin, image: p.photos[0] })),
    ...others.map((o) => ({
      id: o.id,
      href: o.href,
      title: o.title,
      region: [o.province, o.duration].filter(Boolean).join(' · '),
      image: o.photos[0],
    })),
  ].slice(0, 6);

  return (
    <PlaceTemplate
      image={x.photos[0] || IMAGES.gerCamp}
      title={x.title}
      subtitle={[x.province, x.duration].filter(Boolean).join(' · ')}
      back={{ href: '/local/experiences', label: 'Нутгийн туршлага' }}
      nearby={{ title: 'Бусад туршлага', places: related }}
      links={[
        { label: 'Нутгийн туршлага', href: '/local/experiences' },
        { label: 'Малчин өрх', href: '/local/herder-families' },
        { label: 'Нутгийн хөтөч', href: '/local/guides' },
        { label: 'Соёл, ёс заншил', href: '/respect/etiquette' },
      ]}
      aside={
        <FactsCard
          facts={[
            { label: 'Зохион байгуулагч', value: x.host ? <RefLink href={x.host.href} title={x.host.title} /> : '' },
            { label: 'Аймаг', value: x.province },
            { label: 'Хугацаа', value: x.duration },
            { label: 'Бүлгийн хэмжээ', value: x.groupSize },
            { label: 'Улирал', value: x.season },
            { label: 'Үнэ', value: x.price },
          ]}
          bookingUrl={x.bookingUrl}
        />
      }
    >
      <InfoBlock title="Хэн зохион байгуулдаг">
        {x.host ? (
          <p className="text-base sm:text-lg">
            <RefLink href={x.host.href} title={x.host.title} />
          </p>
        ) : null}
      </InfoBlock>

      <InfoBlock title="Нутгийн оролцоо">
        {x.community ? <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line">{x.community}</p> : null}
      </InfoBlock>

      <InfoBlock title="Юу хийх, мэдрэх вэ">{x.whatYouDo ? <RichText document={x.whatYouDo} /> : null}</InfoBlock>

      <InfoBlock title="Бүлгийн хэмжээ">
        {x.groupSize ? <p className="text-base sm:text-lg">{x.groupSize}</p> : null}
      </InfoBlock>

      <InfoBlock title="Соёлын зөв харилцаа">
        {x.culturalGuidance ? (
          <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line">{x.culturalGuidance}</p>
        ) : null}
      </InfoBlock>
    </PlaceTemplate>
  );
}

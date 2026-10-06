import React from 'react';

import RichText from '@/components/RichText';
import { IMAGES } from '@/lib/images';
import {
  choiceBadges,
  type LocalProvider,
  PROVIDER_TYPES,
  providerTypeLabel,
} from '@/lib/localContent';

import type { RelatedItem } from '@/lib/related';

import { BulletList, ChoiceBadges, FactsCard, InfoBlock } from './DetailBlocks';
import PlaceTemplate from './PlaceTemplate';
import RelatedBookings from './RelatedBookings';

// "Профайл" загвар (/local/<slug>): баримт бичгийн 7-р хэсгийн Provider block-ууд
// (хэн бэ, хаана, нутгийн өмчлөл/оролцоо, үйлчилгээ, үнэ/захиалга, лиценз/гэрчилгээ)
// ба 9-р хэсгийн "Local & Responsible Choice" тэмдэгүүд. Хоосон хэсэг харагдахгүй.
export default function ProfileTemplate({
  provider: p,
  related,
}: {
  provider: LocalProvider;
  // Энэ өрхийн туршлага, бүтээгдэхүүн; байхгүй бол ижил аймгийнх (lib/related.ts)
  related: RelatedItem[];
})  {
  const typeLabel = providerTypeLabel(p.providerType);
  const category = PROVIDER_TYPES.find((t) => t.id === p.providerType);
  const badges = choiceBadges(p);

  return (
    <PlaceTemplate
      image={p.photos[0] || IMAGES.herderBoy}
      title={p.name}
      subtitle={[typeLabel, p.province].filter(Boolean).join(' · ')}
      back={
        category?.href
          ? { href: category.href, label: category.mn }
          : { href: '/local', label: 'Нутгийн Монгол' }
      }
      bookings={<RelatedBookings items={related} campaign="provider" contentId={p.slug} />}
      links={[
        { label: 'Нутгийн туршлага', href: '/local/experiences' },
        { label: 'Нутгийн хөтөч', href: '/local/guides' },
        { label: 'Малчин өрх', href: '/local/herder-families' },
        { label: 'Гар урлаач', href: '/local/artisans' },
        { label: 'Нутгийн хоол', href: '/local/food' },
        { label: 'Нутгийн бүтээгдэхүүн', href: '/local/products' },
      ].filter((l) => l.href !== category?.href)}
      aside={
        <FactsCard
          facts={[
            { label: 'Төрөл', value: typeLabel },
            { label: 'Хаана', value: p.province },
            { label: 'Үнэ', value: p.priceFrom ? `${p.priceFrom}-аас` : '' },
            { label: 'Холбоо барих', value: p.contact },
            { label: 'Тусгай зөвшөөрөл', value: p.licenseIfRequired },
          ]}
          bookingUrl={p.bookingUrl}
          campaign="provider"
          contentId={p.slug}
          providerId={p.id}
          isLocalProvider={p.localOwned}
        />
      }
    >
      {badges.length > 0 && (
        <div className="mb-12">
          <ChoiceBadges badges={badges} />
        </div>
      )}

      <InfoBlock title="Хэн бэ">{p.story ? <RichText document={p.story} /> : null}</InfoBlock>

      <InfoBlock title="Нутгийн өмчлөл, оролцоо">
        {p.localOwned || p.communityParticipation || p.womenOrYouthLed ? (
          <BulletList
            items={[
              p.localOwned ? 'Нутгийн хүн, өрх эзэмшдэг.' : '',
              p.communityParticipation,
              p.womenOrYouthLed ? 'Эмэгтэйчүүд эсвэл залуучууд удирддаг.' : '',
            ].filter(Boolean)}
          />
        ) : null}
      </InfoBlock>

      <InfoBlock title="Үйлчилгээ">
        {p.services.length > 0 ? <BulletList items={p.services} /> : null}
      </InfoBlock>

      <InfoBlock title="Хариуцлагатай дадал">
        {p.responsiblePractices.length > 0 ? <BulletList items={p.responsiblePractices} /> : null}
      </InfoBlock>

      <InfoBlock title="Лиценз, гэрчилгээ">
        {p.licenseIfRequired || p.recognizedCertification ? (
          <BulletList
            items={[
              p.licenseIfRequired ? `Тусгай зөвшөөрөл: ${p.licenseIfRequired}` : '',
              p.recognizedCertification ? `Гэрчилгээ: ${p.recognizedCertification}` : '',
            ].filter(Boolean)}
          />
        ) : null}
      </InfoBlock>
    </PlaceTemplate>
  );
}

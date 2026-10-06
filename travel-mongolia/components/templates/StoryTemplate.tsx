import Image from 'next/image';
import React from 'react';

import RichText from '@/components/RichText';
import { IMAGES } from '@/lib/images';
import { formatDate, type StoryEntry } from '@/lib/localContent';
import type { RelatedItem } from '@/lib/related';
import { STORY_CATEGORIES } from '@/lib/stories';

import { InfoBlock } from './DetailBlocks';
import PlaceTemplate from './PlaceTemplate';
import RelatedBookings from './RelatedBookings';

const LANGUAGE: Record<string, string> = { mn: 'Монгол', en: 'English', zh: '中文' };

// "Нийтлэл" загвар (/stories/<slug>): баримт бичгийн 7-р хэсгийн Article/Story block-ууд
// (эх сурвалж, зохиогч/ярилцагч, зураг/видео, холбоотой газар, холбоотой туршлага, хэл,
// шинэчилсэн огноо).
export default function StoryTemplate({ story: s, bookings }: { story: StoryEntry; bookings: RelatedItem[] }) {
  const topic = STORY_CATEGORIES.find((c) => c.id === s.topic);
  const related = [...s.relatedPlace, ...s.relatedExperience, ...s.relatedProduct];

  return (
    <PlaceTemplate
      image={s.media[0] || IMAGES.gerStars}
      title={s.title}
      subtitle={[topic?.mn, s.location].filter(Boolean).join(' · ')}
      back={{ href: '/stories', label: 'Түүх & өв' }}
      bookings={<RelatedBookings items={bookings} campaign="story" contentId={s.slug} />}
      links={related.map((r) => ({ label: r.title, href: r.href }))}
      aside={
        <div className="lg:sticky lg:top-28 p-6 rounded-2xl border border-neutral-200 bg-[#fcfbf9]">
          <dl className="space-y-4">
            {[
              { label: 'Ярилцагч', value: s.storyteller },
              { label: 'Редактор', value: s.editor },
              { label: 'Байршил', value: s.location },
              { label: 'Хэл', value: LANGUAGE[s.language] || s.language },
              { label: 'Шинэчилсэн', value: formatDate(s.updatedDate) },
            ]
              .filter((f) => f.value)
              .map((f) => (
                <div key={f.label}>
                  <dt className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">{f.label}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-neutral-900">{f.value}</dd>
                </div>
              ))}
          </dl>
        </div>
      }
    >
      {s.body ? <div className="mb-12"><RichText document={s.body} /></div> : null}

      <InfoBlock title="Зураг">
        {s.media.length > 1 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {s.media.slice(1).map((m) => (
              <div key={m.src} className="overflow-hidden relative rounded-2xl aspect-[4/3] bg-neutral-100">
                <Image src={m.src} alt={m.alt} fill sizes="(max-width: 640px) 100vw, 400px" className="object-cover" />
              </div>
            ))}
          </div>
        ) : null}
      </InfoBlock>

      <InfoBlock title="Видео">
        {s.videoUrl ? (
          <a href={s.videoUrl} target="_blank" rel="noreferrer" className="text-[#15803d] underline">
            Видеог үзэх ↗
          </a>
        ) : null}
      </InfoBlock>

      <InfoBlock title="Эх сурвалж">
        {s.source ? <p className="text-sm leading-relaxed whitespace-pre-line text-neutral-600">{s.source}</p> : null}
      </InfoBlock>
    </PlaceTemplate>
  );
}

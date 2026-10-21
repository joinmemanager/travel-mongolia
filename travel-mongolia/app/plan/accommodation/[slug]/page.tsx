import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import RichText from '@/components/RichText';
import { ACCOMMODATION_BASE, getAccommodation, KIND_LABEL, TIC_NOTICE } from '@/lib/accommodation';
import { cdnImage } from '@/lib/imageUrl';
import { isPreviewEnv } from '@/lib/navigation';
import { entryMeta } from '@/lib/pageMeta';
import { isThinContent, NOINDEX, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';

// Tourist Info Center-ээс шилжүүлсэн зочид буудал, жуулчны баазын хуудас (localProvider, 7-р багц).
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = await getAccommodation((await params).slug);
  if (!a) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  const meta = entryMeta({
    title: a.seoTitle || `${a.name} — ${KIND_LABEL[a.kind]}`,
    description: a.seoDescription || truncate(richTextToPlain(a.story) || `${a.name}: ${KIND_LABEL[a.kind]}, ${a.province}.`),
    path: a.href,
    image: a.image?.src,
  });
  const out = a.seoTitle ? { ...meta, title: { absolute: a.seoTitle } } : meta;
  return isThinContent(a.story) ? { ...out, robots: NOINDEX } : out;
}

export default async function AccommodationDetailPage({ params }: Props) {
  if (isPreviewEnv()) await connection();
  const a = await getAccommodation((await params).slug);
  if (!a) notFound();

  const url = `${SITE_URL}${a.href}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': a.kind === 'hotel' ? 'Hotel' : 'Campground',
    name: a.name,
    url,
    image: a.image?.src,
    address: { '@type': 'PostalAddress', addressRegion: a.province || undefined, addressCountry: 'MN' },
  };

  return (
    <main className="min-h-screen bg-[#fcfbf9] pb-24 text-neutral-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="px-4 pt-8 mx-auto max-w-3xl sm:px-6">
        <Breadcrumbs
          items={[
            { label: 'Нүүр', href: '/' },
            { label: 'Байр', href: ACCOMMODATION_BASE },
            { label: a.name, href: a.href },
          ]}
        />
        <Link
          href={`${ACCOMMODATION_BASE}#directory`}
          className="inline-block mb-4 bg-emerald-50 text-[#15803d] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full hover:bg-emerald-100"
        >
          {KIND_LABEL[a.kind]}
          {a.province ? ` · ${a.province}` : ''}
        </Link>
        <h1 className="mb-6 text-3xl font-black tracking-tight leading-tight sm:text-5xl">{a.name}</h1>
        <p className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">{TIC_NOTICE}</p>

        {a.image && (
          <figure className="overflow-hidden mb-8 rounded-2xl bg-neutral-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cdnImage(a.image.src, 1200)} alt={a.image.alt} className="object-cover w-full max-h-[460px]" />
          </figure>
        )}

        {(a.contact || a.priceFrom || a.services.length > 0) && (
          <dl className="grid gap-3 p-5 mb-8 text-sm bg-white rounded-2xl border border-neutral-200 sm:grid-cols-2">
            {a.contact && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-bold tracking-wider uppercase text-neutral-400">Холбоо барих, хаяг</dt>
                <dd className="mt-1 whitespace-pre-line text-neutral-700">{a.contact}</dd>
              </div>
            )}
            {a.priceFrom && (
              <div>
                <dt className="text-xs font-bold tracking-wider uppercase text-neutral-400">Үнэ (TIC-ийн мэдээлэл)</dt>
                <dd className="mt-1 text-neutral-700">{a.priceFrom}</dd>
              </div>
            )}
            {a.services.length > 0 && (
              <div>
                <dt className="text-xs font-bold tracking-wider uppercase text-neutral-400">Үйлчилгээ</dt>
                <dd className="mt-1 text-neutral-700">{a.services.join(', ')}</dd>
              </div>
            )}
          </dl>
        )}

        <div className="text-neutral-700">
          <RichText document={a.story} />
        </div>

        <p className="mt-10">
          <Link href={`${ACCOMMODATION_BASE}#directory`} className="font-semibold text-[#15803d] hover:underline">
            ← Буудал, баазын лавлах руу буцах
          </Link>
        </p>
      </article>
    </main>
  );
}

import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { connection } from 'next/server';
import React, { cache } from 'react';

import RichText from '@/components/RichText';
import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { isPreviewEnv } from '@/lib/navigation';
import { pageMetadata, richTextToPlain, truncate } from '@/lib/seo';
import { getSoum, getSoumsOfProvince } from '@/lib/soums';

// Сумын дэлгэрэнгүй (/province/<аймаг>/<сум>). Зөвхөн ownPage=true (150-аас дээш үгтэй) сумд
// тусдаа хуудастай; бусдыг нь аймгийн хуудасны "Сумд" хэсэг рүү (#<сум>) шилжүүлнэ.
export const revalidate = 86400;

interface Props {
  params: Promise<{ id: string; soum: string }>;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000';

const loadSoum = cache(async (id: string, soum: string) => getSoum(id, soum));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, soum } = await params;
  const s = await loadSoum(id, soum);
  if (!s || !s.ownPage) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };
  const meta = pageMetadata({
    title: s.seoTitle || `${s.title}, ${s.provinceTitle}`,
    description: s.seoDescription || truncate(richTextToPlain(s.body)),
    path: `/province/${s.provinceSlug}/${s.slug}`,
    image: s.image,
  });
  return s.seoTitle ? { ...meta, title: { absolute: s.seoTitle } } : meta;
}

export default async function SoumPage({ params }: Props) {
  if (isPreviewEnv()) await connection();

  const { id, soum } = await params;
  const s = await loadSoum(id, soum);
  if (!s) notFound();
  if (!s.ownPage) permanentRedirect(`/province/${s.provinceSlug}#${s.slug}`);

  // Нэг аймгийн тусдаа хуудастай бусад сумд
  const siblings = (await getSoumsOfProvince(s.provinceId)).filter((x) => x.ownPage && x.slug !== s.slug);

  return (
    <PlaceTemplate
      image={{ src: s.image || FALLBACK_IMAGE, alt: s.title }}
      title={s.title}
      subtitle={s.provinceTitle}
      back={{ href: `/province/${s.provinceSlug}#soums`, label: `${s.provinceTitle} руу буцах` }}
      analytics={{ content_type: 'soum', content_id: `${s.provinceSlug}/${s.slug}`, province: s.provinceTitle }}
      nav={[{ id: 'overview', label: 'Танилцуулга' }]}
      links={[
        { label: s.provinceTitle, href: `/province/${s.provinceSlug}` },
        ...siblings.map((x) => ({ label: x.title, href: `/province/${s.provinceSlug}/${x.slug}` })),
        { label: 'Зорих газрууд', href: '/destination/region' },
      ]}
    >
      <section id="overview" className="pt-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-6">Танилцуулга</h2>
        <div className="text-neutral-700">
          <RichText document={s.body} />
        </div>
      </section>
    </PlaceTemplate>
  );
}

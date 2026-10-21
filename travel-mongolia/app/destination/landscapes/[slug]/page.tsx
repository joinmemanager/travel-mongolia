import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React, { cache } from 'react';

import PlaceFacts from '@/components/places/PlaceFacts';
import RichText from '@/components/RichText';
import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { IMAGES } from '@/lib/images';
import { isPreviewEnv } from '@/lib/navigation';
import { isThinContent, NOINDEX, pageMetadata, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';
import { CATEGORY_INFO, getPlace, getPlacesByCategory } from '@/lib/tourismPlaces';

// Байгалийн үзэсгэлэнт газрын дэлгэрэнгүй (/destination/landscapes/<slug>, Contentful `place` landscape, TIC cate1).
// Жагсаалт: /destination/landscapes#all-places, аймгийн хуудасны #landscapes.
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE = '/destination/landscapes';
const loadPlace = cache(async (slug: string) => getPlace(slug, ['landscape']));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await loadPlace(slug);
  if (!p) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  const meta = pageMetadata({
    title: p.seoTitle || `${p.title} — ${CATEGORY_INFO.landscape.label}`,
    description: p.seoDescription || truncate(richTextToPlain(p.body)),
    path: `${BASE}/${p.slug}`,
    image: p.image?.src,
  });
  const out = p.seoTitle ? { ...meta, title: { absolute: p.seoTitle } } : meta;
  // Богино (80 үгээс доош) нийтлэлийг агуулга нэмэгдэх хүртэл хайлтад оруулахгүй
  return isThinContent(p.body) ? { ...out, robots: NOINDEX } : out;
}

export default async function LandscapePlacePage({ params }: Props) {
  if (isPreviewEnv()) await connection();
  const { slug } = await params;
  const p = await loadPlace(slug);
  if (!p) notFound();
  const cat = CATEGORY_INFO.landscape;

  // Ижил аймгийн бусад байгалийн газар, байхгүй бол бусад
  const all = (await getPlacesByCategory(['landscape'])).filter((x) => x.id !== p.id);
  const sameProvince = all.filter((x) => p.provinceId && x.provinceId === p.provinceId);
  const others = (sameProvince.length ? sameProvince : all).slice(0, 3);

  const url = `${SITE_URL}${BASE}/${p.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['TouristAttraction', 'Landform'],
    name: p.title,
    description: p.seoDescription,
    image: p.image?.src,
    url,
    address: { '@type': 'PostalAddress', addressRegion: p.provinceTitle, addressCountry: 'MN' },
  };

  return (
    <PlaceTemplate
      image={{ src: p.image?.src || IMAGES.whiteHorse.src, alt: p.image?.alt || p.title, credit: p.image?.credit }}
      title={p.title}
      subtitle={[cat.label, p.provinceTitle].filter(Boolean).join(' · ')}
      back={{ href: `${BASE}#all-places`, label: cat.plural }}
      analytics={{ content_type: 'landscape', content_id: p.slug, province: p.provinceTitle || '' }}
      jsonLd={jsonLd}
      breadcrumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Байгалийн тогтоц, ландшафт', href: BASE },
        { label: p.title, href: `${BASE}/${p.slug}` },
      ]}
      aside={<PlaceFacts place={p} />}
      nearby={{
        title: sameProvince.length ? `${p.provinceTitle} дахь бусад байгалийн газар` : `Бусад ${cat.plural.toLowerCase()}`,
        places: others.map((x) => ({ id: x.id, href: x.href, title: x.title, region: x.provinceTitle, image: x.image && { src: x.image.src, alt: x.image.alt } })),
      }}
      links={[
        { label: 'Байгалийн тогтоц, ландшафт', href: BASE },
        { label: 'Тусгай хамгаалалттай газрууд', href: '/destination/protected' },
        ...(p.provinceSlug ? [{ label: p.provinceTitle || '', href: `/province/${p.provinceSlug}#landscapes` }] : []),
      ]}
    >
      <div className="text-neutral-700">
        <RichText document={p.body} />
      </div>
    </PlaceTemplate>
  );
}

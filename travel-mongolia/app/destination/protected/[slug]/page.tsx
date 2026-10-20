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
import { CATEGORY_INFO, getPlace, getPlacesByCategory, PROTECTED_CATEGORIES } from '@/lib/tourismPlaces';

// Тусгай хамгаалалттай газрын дэлгэрэнгүй (/destination/protected/<slug>, Contentful `place`, TIC cate2–5).
// Ангиллын жагсаалт: /destination/strictly-protected, /national-parks, /nature-reserves, /natural-monuments.
export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

const loadPlace = cache(async (slug: string) => getPlace(slug, PROTECTED_CATEGORIES));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await loadPlace(slug);
  if (!p) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  const meta = pageMetadata({
    title: p.seoTitle || `${p.title} — ${CATEGORY_INFO[p.category as keyof typeof CATEGORY_INFO].label}`,
    description: p.seoDescription || truncate(richTextToPlain(p.body)),
    path: `/destination/protected/${p.slug}`,
    image: p.image?.src,
  });
  const out = p.seoTitle ? { ...meta, title: { absolute: p.seoTitle } } : meta;
  // Богино (80 үгээс доош) нийтлэлийг агуулга нэмэгдэх хүртэл хайлтад оруулахгүй
  return isThinContent(p.body) ? { ...out, robots: NOINDEX } : out;
}

export default async function ProtectedPlacePage({ params }: Props) {
  if (isPreviewEnv()) await connection();
  const { slug } = await params;
  const p = await loadPlace(slug);
  if (!p) notFound();
  const cat = CATEGORY_INFO[p.category as keyof typeof CATEGORY_INFO];

  // Ижил аймгийн бусад тусгай хамгаалалттай газар, байхгүй бол ижил ангиллынх
  const all = (await getPlacesByCategory(PROTECTED_CATEGORIES)).filter((x) => x.id !== p.id);
  const sameProvince = all.filter((x) => p.provinceId && x.provinceId === p.provinceId);
  const others = (sameProvince.length ? sameProvince : all.filter((x) => x.category === p.category)).slice(0, 3);

  const url = `${SITE_URL}/destination/protected/${p.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['TouristAttraction', 'Park'],
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
      back={{ href: cat.href, label: cat.plural }}
      analytics={{ content_type: 'protected-area', content_id: p.slug, province: p.provinceTitle || '' }}
      jsonLd={jsonLd}
      aside={<PlaceFacts place={p} />}
      nearby={{
        title: sameProvince.length ? `${p.provinceTitle} дахь бусад тусгай хамгаалалттай газар` : `Бусад ${cat.plural.toLowerCase()}`,
        places: others.map((x) => ({ id: x.id, href: x.href, title: x.title, region: x.provinceTitle, image: x.image && { src: x.image.src, alt: x.image.alt } })),
      }}
      links={[
        { label: cat.plural, href: cat.href },
        { label: 'Тусгай хамгаалалттай газрууд', href: '/destination/protected' },
        ...(p.provinceSlug ? [{ label: p.provinceTitle || '', href: `/province/${p.provinceSlug}` }] : []),
      ]}
    >
      <div className="text-neutral-700">
        <RichText document={p.body} />
      </div>
    </PlaceTemplate>
  );
}

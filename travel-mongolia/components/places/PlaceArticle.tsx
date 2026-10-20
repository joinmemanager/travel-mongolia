import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import PlaceFacts from '@/components/places/PlaceFacts';
import RichText from '@/components/RichText';
import { isPreviewEnv } from '@/lib/navigation';
import { entryMeta } from '@/lib/pageMeta';
import { getSection, sectionTitle } from '@/lib/sections';
import { isThinContent, NOINDEX, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';
import { CATEGORY_INFO, getPlace, getPlacesByCategory, type PlaceCategory } from '@/lib/tourismPlaces';

// «Үзэх, хийх зүйлс» хэсэг доторх газрын нийтлэл: музей/театр/соёлын төв (/things-to-do/museums/<slug>),
// рашаан сувилал (/things-to-do/wellness/<slug>). (sec-things) layout-ын hero, жагсаалт хадгалагдана.
export interface PlaceArticleConfig {
  base: string;
  listLabel: string;
  categories: PlaceCategory[];
  schemaType: string;
}

export async function placeArticleMetadata(slug: string, cfg: PlaceArticleConfig): Promise<Metadata> {
  const p = await getPlace(slug, cfg.categories);
  if (!p) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  const meta = entryMeta({
    title: p.seoTitle || `${p.title} — ${CATEGORY_INFO[p.category as PlaceCategory].label}`,
    description: p.seoDescription || truncate(richTextToPlain(p.body)),
    path: `${cfg.base}/${p.slug}`,
    image: p.image?.src,
  });
  const out = p.seoTitle ? { ...meta, title: { absolute: p.seoTitle } } : meta;
  return isThinContent(p.body) ? { ...out, robots: NOINDEX } : out;
}

export default async function PlaceArticle({ slug, cfg }: { slug: string; cfg: PlaceArticleConfig }) {
  if (isPreviewEnv()) await connection();
  const p = await getPlace(slug, cfg.categories);
  if (!p) notFound();
  const cat = CATEGORY_INFO[p.category as PlaceCategory];
  const things = getSection('things');

  // Ижил аймгийн, үгүй бол ижил ангиллын бусад газар
  const all = (await getPlacesByCategory(cfg.categories)).filter((x) => x.id !== p.id);
  const sameProvince = all.filter((x) => p.provinceId && x.provinceId === p.provinceId && x.category === p.category);
  const related = (sameProvince.length >= 3 ? sameProvince : [...sameProvince, ...all.filter((x) => x.category === p.category && !sameProvince.includes(x))]).slice(0, 6);

  const url = `${SITE_URL}${cfg.base}/${p.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': cfg.schemaType,
    name: p.title,
    description: p.seoDescription,
    image: p.image?.src,
    url,
    address: { '@type': 'PostalAddress', addressRegion: p.provinceTitle, addressCountry: 'MN' },
  };

  return (
    <article className="max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { label: 'Нүүр', href: '/' },
          { label: sectionTitle(things), href: things.baseHref },
          { label: cfg.listLabel, href: cfg.base },
          { label: p.title, href: `${cfg.base}/${p.slug}` },
        ]}
      />
      <Link
        href={`${cfg.base}#${p.category}`}
        className="inline-block mb-4 bg-emerald-50 text-[#15803d] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full hover:bg-emerald-100"
      >
        {cat.label}
      </Link>
      <h1 className="mb-8 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">{p.title}</h1>

      <div className="mb-8">
        <PlaceFacts place={p} />
      </div>

      <div className="text-neutral-700">
        <RichText document={p.body} />
      </div>

      {related.length > 0 && (
        <nav aria-label="Бусад газар" className="pt-8 mt-12 border-t border-neutral-200">
          <h2 className="mb-4 text-lg font-bold text-neutral-900">Бусад {cat.plural.toLowerCase()}</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((x) => (
              <li key={x.id}>
                <Link href={x.href} className="block p-4 rounded-xl border transition-colors border-neutral-200 hover:border-[#15803d]">
                  <span className="font-semibold text-neutral-900">{x.title}</span>
                  {x.provinceTitle && <span className="block text-sm text-neutral-500">{x.provinceTitle}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p className="mt-10">
        <Link href={cfg.base} className="font-semibold text-[#15803d] hover:underline">
          ← {cfg.listLabel} руу буцах
        </Link>
      </p>
    </article>
  );
}

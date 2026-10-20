import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import RichText from '@/components/RichText';
import { isPreviewEnv } from '@/lib/navigation';
import { entryMeta } from '@/lib/pageMeta';
import { getSection, sectionTitle } from '@/lib/sections';
import { isThinContent, NOINDEX, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';
import { getSpecies, getSpeciesList, GROUP_LABEL, SPECIES_SECTION_TITLE, WILDLIFE_GROUPS } from '@/lib/species';

// «Түүх & өв → Байгаль» хэсгийн амьтан, шувуу, ургамлын нийтлэл (/about/nature/<section>/<slug>).
// (sec-nature) layout дотор тул hero, «Сэдвийн жагсаалт» хадгалагдаж, тухайн дэд хуудасны мөр идэвхтэй.
type Section = 'wildlife' | 'birds' | 'plants';

export async function speciesMetadata(slug: string, section: Section): Promise<Metadata> {
  const s = await getSpecies(slug, section);
  if (!s) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  const path = `/about/nature/${section}/${s.slug}`;
  const meta = entryMeta({
    title: s.seoTitle || `${s.title} — ${GROUP_LABEL[s.group]}`,
    description: s.seoDescription || truncate(richTextToPlain(s.body)),
    path,
    image: s.image?.src,
  });
  const out = s.seoTitle ? { ...meta, title: { absolute: s.seoTitle } } : meta;
  return isThinContent(s.body) ? { ...out, robots: NOINDEX } : out;
}

export default async function SpeciesArticle({ slug, section }: { slug: string; section: Section }) {
  if (isPreviewEnv()) await connection();
  const s = await getSpecies(slug, section);
  if (!s) notFound();

  const nature = getSection('nature');
  const listHref = `/about/nature/${section}`;
  const groupAnchor = section === 'wildlife' ? `${listHref}#${s.group}` : listHref;
  // Нэг бүлгийн бусад (тусдаа хуудастай) зүйл
  const others = (await getSpeciesList([s.group])).filter((x) => x.ownPage && x.id !== s.id);
  const i = Math.max(0, others.findIndex((x) => x.title.localeCompare(s.title, 'mn') > 0));
  const related = [...others.slice(i), ...others.slice(0, i)].slice(0, 6);

  const url = `${SITE_URL}/about/nature/${section}/${s.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: s.title,
    alternativeHeadline: s.latinName,
    description: s.seoDescription,
    image: s.image?.src,
    url,
    mainEntityOfPage: url,
    inLanguage: 'mn',
    about: { '@type': 'Taxon', name: s.latinName || s.title, alternateName: s.title },
    publisher: { '@type': 'Organization', name: 'Travel Hub Mongolia', url: SITE_URL },
  };
  const groupTitle = section === 'wildlife' ? WILDLIFE_GROUPS.find((g) => g.id === s.group)?.title : SPECIES_SECTION_TITLE[section];

  return (
    <article className="max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { label: 'Нүүр', href: '/' },
          { label: sectionTitle(nature), href: nature.baseHref },
          { label: SPECIES_SECTION_TITLE[section], href: listHref },
          { label: s.title, href: `${listHref}/${s.slug}` },
        ]}
      />
      <Link
        href={groupAnchor}
        className="inline-block mb-4 bg-emerald-50 text-[#15803d] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full hover:bg-emerald-100"
      >
        {groupTitle}
      </Link>
      <h1 className="mb-2 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">{s.title}</h1>
      {s.latinName && (
        <p className="mb-8 text-lg italic text-neutral-500" translate="no">
          {s.latinName}
        </p>
      )}

      <div className="text-neutral-700">
        <RichText document={s.body} />
      </div>

      {related.length > 0 && (
        <nav aria-label="Бусад зүйл" className="pt-8 mt-12 border-t border-neutral-200">
          <h2 className="mb-4 text-lg font-bold text-neutral-900">{groupTitle}: бусад</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((x) => (
              <li key={x.id}>
                <Link href={x.href} className="block p-4 rounded-xl border transition-colors border-neutral-200 hover:border-[#15803d]">
                  <span className="font-semibold text-neutral-900">{x.title}</span>
                  {x.latinName && <span className="block text-sm italic text-neutral-500">{x.latinName}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p className="mt-10">
        <Link href={groupAnchor} className="font-semibold text-[#15803d] hover:underline">
          ← {SPECIES_SECTION_TITLE[section]} руу буцах
        </Link>
      </p>
    </article>
  );
}

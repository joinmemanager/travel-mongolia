import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React from 'react';

import Breadcrumbs, { type Crumb } from '@/components/Breadcrumbs';
import RichText from '@/components/RichText';
import { CULTURE_SECTIONS, getCultureArticle, getCultureArticles, type CultureSection } from '@/lib/cultureArticles';
import { isPreviewEnv } from '@/lib/navigation';
import { entryMeta } from '@/lib/pageMeta';
import { getSection, sectionTitle } from '@/lib/sections';
import { isThinContent, NOINDEX, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';

// TIC 10-р багцын нийтлэл (cultureArticle): угсаатан, түүхэн хүмүүс, шашин, зан заншил.
// Хэсгийн (SectionLayout) дотор тул hero, «Сэдвийн жагсаалт» хадгалагдана; H1, замчлалыг энд гаргана.
const SECTION_OF: Record<CultureSection, string> = { 'ethnic-groups': 'culture', religion: 'culture', traditions: 'culture', people: 'about' };

export function cultureCrumbs(section: CultureSection): Crumb[] {
  const s = CULTURE_SECTIONS[section];
  const sec = getSection(SECTION_OF[section]);
  const crumbs: Crumb[] = [
    { label: 'Нүүр', href: '/' },
    { label: sectionTitle(sec), href: sec.baseHref },
  ];
  if (s.parent.href !== sec.baseHref) crumbs.push(s.parent);
  if (s.base !== s.parent.href) crumbs.push({ label: s.title, href: s.base });
  return crumbs;
}

export async function cultureMetadata(section: CultureSection, slug: string): Promise<Metadata> {
  const a = await getCultureArticle(section, slug);
  if (!a) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  const meta = entryMeta({
    title: a.seoTitle || `${a.title} — ${CULTURE_SECTIONS[section].title}`,
    description: a.seoDescription || truncate(richTextToPlain(a.body)),
    path: a.href,
    image: a.image?.src,
  });
  const out = a.seoTitle ? { ...meta, title: { absolute: a.seoTitle } } : meta;
  return isThinContent(a.body) ? { ...out, robots: NOINDEX } : out;
}

export default async function CultureArticlePage({ section, slug }: { section: CultureSection; slug: string }) {
  if (isPreviewEnv()) await connection();
  const a = await getCultureArticle(section, slug);
  if (!a) notFound();
  const s = CULTURE_SECTIONS[section];
  const listHref = section === 'traditions' ? `${s.base}#articles` : s.base;

  // Хэсгийн бусад нийтлэл (цагаан толгойн дараалал, одоогийнхоос хойш)
  const others = (await getCultureArticles(section)).filter((x) => x.id !== a.id);
  const i = Math.max(0, others.findIndex((x) => x.title.localeCompare(a.title, 'mn') > 0));
  const related = [...others.slice(i), ...others.slice(0, i)].slice(0, 6);

  const url = `${SITE_URL}${a.href}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.seoDescription,
    image: a.image?.src,
    url,
    mainEntityOfPage: url,
    inLanguage: 'mn',
    publisher: { '@type': 'Organization', name: 'Travel Hub Mongolia', url: SITE_URL },
  };

  return (
    <article className="max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs items={[...cultureCrumbs(section), { label: a.title, href: a.href }]} />
      <Link
        href={listHref}
        className="inline-block mb-4 bg-emerald-50 text-[#15803d] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full hover:bg-emerald-100"
      >
        {s.title}
      </Link>
      <h1 className="mb-8 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">{a.title}</h1>

      <div className="text-neutral-700">
        <RichText document={a.body} />
      </div>

      {related.length > 0 && (
        <nav aria-label="Бусад нийтлэл" className="pt-8 mt-12 border-t border-neutral-200">
          <h2 className="mb-4 text-lg font-bold text-neutral-900">{s.title}: бусад</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((x) => (
              <li key={x.id}>
                <Link href={x.href} className="block p-4 rounded-xl border transition-colors border-neutral-200 hover:border-[#15803d]">
                  <span className="font-semibold text-neutral-900">{x.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <p className="mt-10">
        <Link href={listHref} className="font-semibold text-[#15803d] hover:underline">
          ← {s.title} руу буцах
        </Link>
      </p>
    </article>
  );
}

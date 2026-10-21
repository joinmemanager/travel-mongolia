import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React, { cache } from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import RichText from '@/components/RichText';
import { isPreviewEnv } from '@/lib/navigation';
import { getNews, NEWS_BASE, newsDate } from '@/lib/news';
import { entryMeta } from '@/lib/pageMeta';
import { isThinContent, NOINDEX, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';

// TIC-ийн мэдээний архивын нийтлэл (story, topic «news»). «Түүхүүд» хэсэг (sec-stories) дотор: H1, замчлал энд.
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

const load = cache(async (slug: string) => getNews(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await load(slug);
  if (!a) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  const meta = entryMeta({
    title: a.seoTitle || a.title,
    description: a.seoDescription || truncate(richTextToPlain(a.body)),
    path: `${NEWS_BASE}/${a.slug}`,
    image: a.image?.src,
  });
  const out = a.seoTitle ? { ...meta, title: { absolute: a.seoTitle } } : meta;
  return isThinContent(a.body) ? { ...out, robots: NOINDEX } : out;
}

export default async function NewsArticlePage({ params }: Props) {
  if (isPreviewEnv()) await connection();
  const { slug } = await params;
  const a = await load(slug);
  if (!a) notFound();

  const url = `${SITE_URL}${NEWS_BASE}/${a.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.title,
    description: a.seoDescription,
    image: a.image?.src,
    datePublished: a.publishedDate,
    url,
    mainEntityOfPage: url,
    inLanguage: 'mn',
    publisher: { '@type': 'Organization', name: 'Travel Hub Mongolia', url: SITE_URL },
  };

  return (
    <article className="max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Breadcrumbs
        items={[
          { label: 'Нүүр', href: '/' },
          { label: 'Түүхүүд', href: '/stories' },
          { label: 'Мэдээний архив', href: NEWS_BASE },
          { label: a.title, href: `${NEWS_BASE}/${a.slug}` },
        ]}
      />
      {a.publishedDate && (
        <p className="mb-3 text-sm text-neutral-500">
          <time dateTime={a.publishedDate}>{newsDate(a.publishedDate)}</time> · touristinfocenter.mn-ийн архиваас
        </p>
      )}
      <h1 className="mb-8 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">{a.title}</h1>
      <div className="text-neutral-700">
        <RichText document={a.body} />
      </div>
      <p className="mt-10">
        <Link href={NEWS_BASE} className="font-semibold text-[#15803d] hover:underline">
          ← Мэдээний архив руу буцах
        </Link>
      </p>
    </article>
  );
}

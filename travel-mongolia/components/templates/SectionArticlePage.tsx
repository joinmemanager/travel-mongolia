import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import RichText from '@/components/RichText';
import { isPreviewEnv } from '@/lib/navigation';
import { entryMeta } from '@/lib/pageMeta';
import { ARTICLE_SECTIONS, type ArticleSection, getSectionArticle } from '@/lib/sectionArticles';
import { richTextToPlain, truncate } from '@/lib/seo';

// Дэд хэсгийн нийтлэлийн хуудас (/local/articles, /respect/articles, /impact/articles). «Эх сурвалж» нь body-ийн төгсгөлд.
export async function articleMetadata(section: ArticleSection, slug: string): Promise<Metadata> {
  const a = await getSectionArticle(section, slug);
  if (!a) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  return entryMeta({
    title: a.seoTitle || a.title,
    description: a.excerpt || truncate(richTextToPlain(a.body)),
    path: a.href,
  });
}

export default async function SectionArticlePage({ section, slug }: { section: ArticleSection; slug: string }) {
  if (isPreviewEnv()) await connection();
  const a = await getSectionArticle(section, slug);
  if (!a) notFound();
  const hub = ARTICLE_SECTIONS[section];
  // Цэсний дэд хэсэг нь хэсгийн эхний хуудас өөрөө бол замчлалд давтахгүй
  const back = a.place || { href: hub.href, label: hub.mn };

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900">
      <article className="max-w-3xl mx-auto px-6 sm:px-0 py-12">
        <Breadcrumbs
          items={[
            { label: 'Нүүр', href: '/' },
            { label: hub.mn, href: hub.href },
            ...(back.href === hub.href ? [] : [back]),
            { label: a.title, href: a.href },
          ]}
        />
        <h1 className="mb-8 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">{a.title}</h1>
        <div className="text-neutral-700">
          <RichText document={a.body} />
        </div>
        <p className="mt-10">
          <Link href={back.href} className="font-semibold text-[#15803d] hover:underline">
            ← {back.label} руу буцах
          </Link>
        </p>
      </article>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React, { cache } from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import RichText from '@/components/RichText';
import { getHistoryArticle, getHistoryArticles, HISTORY_PERIODS } from '@/lib/history';
import { isPreviewEnv } from '@/lib/navigation';
import { getSection, sectionTitle } from '@/lib/sections';
import { pageMetadata, richTextToPlain, SITE_URL, truncate } from '@/lib/seo';

// «Монголын түүх»-ийн нийтлэл (historyArticle). «Монголын тухай» хэсгийн (sec-about) дотор тул hero,
// «Сэдвийн жагсаалт» хадгалагдаж, жагсаалтад «Монголын түүх» мөр идэвхтэй байна. H1, замчлалыг энд гаргана.
interface Props {
  params: Promise<{ slug: string }>;
}

const loadArticle = cache(async (slug: string) => getHistoryArticle(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const a = await loadArticle(slug);
  if (!a) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  const meta = pageMetadata({
    title: a.seoTitle || `${a.title} — Монголын түүх`,
    description: a.seoDescription || truncate(richTextToPlain(a.body)),
    path: `/about/history/${a.slug}`,
    image: a.image?.src,
  });
  // seoTitle-д брэнд орсон байж болох тул layout-ын загварыг давхар залгахгүй
  return a.seoTitle ? { ...meta, title: { absolute: a.seoTitle } } : meta;
}

export default async function HistoryArticlePage({ params }: Props) {
  if (isPreviewEnv()) await connection();
  const { slug } = await params;
  const a = await loadArticle(slug);
  if (!a) notFound();

  const period = HISTORY_PERIODS.find((p) => p.id === a.period);
  // Нэг үеийн өмнөх, дараагийн нийтлэл
  const siblings = (await getHistoryArticles()).filter((x) => x.period === a.period);
  const i = siblings.findIndex((x) => x.id === a.id);
  const prev = i > 0 ? siblings[i - 1] : undefined;
  const next = i >= 0 && i < siblings.length - 1 ? siblings[i + 1] : undefined;

  const about = getSection('about');
  const url = `${SITE_URL}/about/history/${a.slug}`;
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
      <Breadcrumbs
        items={[
          { label: 'Нүүр', href: '/' },
          { label: sectionTitle(about), href: about.baseHref },
          { label: 'Монголын түүх', href: '/about/history' },
          { label: a.title, href: `/about/history/${a.slug}` },
        ]}
      />
      {period && (
        <Link
          href={`/about/history#${period.id}`}
          className="inline-block mb-4 bg-emerald-50 text-[#15803d] text-xs sm:text-sm font-bold px-4 py-1.5 rounded-full hover:bg-emerald-100"
        >
          {period.title}
        </Link>
      )}
      <h1 className="mb-8 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">{a.title}</h1>

      <div className="text-neutral-700">
        <RichText document={a.body} />
      </div>

      {(prev || next) && (
        <nav aria-label="Энэ үеийн бусад нийтлэл" className="grid grid-cols-1 gap-3 pt-8 mt-12 border-t sm:grid-cols-2 border-neutral-200">
          {prev ? (
            <Link href={`/about/history/${prev.slug}`} className="p-4 rounded-xl border transition-colors border-neutral-200 hover:border-[#15803d]">
              <span className="block mb-1 text-xs font-bold tracking-widest uppercase text-neutral-400">← Өмнөх</span>
              <span className="font-semibold text-neutral-900">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/about/history/${next.slug}`} className="p-4 text-right rounded-xl border transition-colors border-neutral-200 hover:border-[#15803d]">
              <span className="block mb-1 text-xs font-bold tracking-widest uppercase text-neutral-400">Дараах →</span>
              <span className="font-semibold text-neutral-900">{next.title}</span>
            </Link>
          )}
        </nav>
      )}

      <p className="mt-10">
        <Link href={period ? `/about/history#${period.id}` : '/about/history'} className="font-semibold text-[#15803d] hover:underline">
          ← Монголын түүх рүү буцах
        </Link>
      </p>
    </article>
  );
}

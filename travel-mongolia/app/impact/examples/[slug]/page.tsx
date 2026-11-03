import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import React, { cache } from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import RichText from '@/components/RichText';
import { getInternationalReport, REPORTS_BASE, SOURCE_TYPE_LABEL } from '@/lib/internationalReports';
import { isPreviewEnv } from '@/lib/navigation';
import { entryMeta } from '@/lib/pageMeta';
import { richTextToPlain, truncate } from '@/lib/seo';

// Олон улсын тайлангийн монгол хураангуй (story, topic «international»). /impact/examples-ийн soft төлвийг өвлөнө (noindex).
export const revalidate = 604800;

interface Props {
  params: Promise<{ slug: string }>;
}

const load = cache(async (slug: string) => getInternationalReport(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const r = await load(slug);
  if (!r) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false }, alternates: { canonical: null } };
  return entryMeta({
    title: r.seoTitle || r.title,
    description: r.seoDescription || truncate(richTextToPlain(r.body)),
    path: `${REPORTS_BASE}/${r.slug}`,
  });
}

export default async function InternationalReportPage({ params }: Props) {
  if (isPreviewEnv()) await connection();
  const { slug } = await params;
  const r = await load(slug);
  if (!r) notFound();

  const facts = [
    { label: 'Хэвлэгч', value: r.publisher },
    { label: 'Он', value: r.year },
    { label: 'Төрөл', value: r.sourceType && SOURCE_TYPE_LABEL[r.sourceType] },
  ].filter((x) => x.value);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900">
      <article className="max-w-3xl mx-auto px-6 sm:px-0 py-12">
        <Breadcrumbs
          items={[
            { label: 'Нүүр', href: '/' },
            { label: 'Үр өгөөж & түншлэл', href: '/impact' },
            { label: 'Олон улсын жишиг ба тайлан', href: REPORTS_BASE },
            { label: r.title, href: `${REPORTS_BASE}/${r.slug}` },
          ]}
        />
        <h1 className="mb-8 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">{r.title}</h1>

        <aside className="mb-10 p-6 bg-white rounded-2xl border border-neutral-200/80 shadow-sm">
          <dl className="grid gap-4 mb-4 sm:grid-cols-3">
            {facts.map((x) => (
              <div key={x.label}>
                <dt className="text-xs font-bold tracking-wide text-neutral-500 uppercase">{x.label}</dt>
                <dd className="mt-1 font-semibold text-neutral-900">{x.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mb-5 text-sm leading-relaxed text-neutral-600">Энэ бол эх тайлангийн монгол хураангуй, бүтэн орчуулга биш.</p>
          {r.originalUrl && (
            <a
              href={r.originalUrl}
              target="_blank"
              rel="noopener"
              className="inline-flex gap-2 items-center py-3 px-6 text-sm font-bold text-white bg-[#15803d] hover:bg-neutral-900 rounded-full transition-colors"
            >
              Англиар унших →
            </a>
          )}
        </aside>

        <div className="text-neutral-700">
          <RichText document={r.body} />
        </div>
        <p className="mt-10">
          <Link href={REPORTS_BASE} className="font-semibold text-[#15803d] hover:underline">
            ← Олон улсын жишиг ба тайлан руу буцах
          </Link>
        </p>
      </article>
    </main>
  );
}

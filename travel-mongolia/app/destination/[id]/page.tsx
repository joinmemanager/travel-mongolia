export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React, { cache } from 'react';

import { client } from '@/lib/contentful';
import { pageMetadata, richTextToPlain, truncate } from '@/lib/seo';

interface Props {
  params: Promise<{ id: string }>;
}

// Зөвхөн 'destination' төрлийн entry-г id-аар нь татна.
// generateMetadata болон хуудас хоёулаа ашиглах тул нэг л удаа татна.
const getDestination = cache(async (id: string) => {
  try {
    const res = await client.getEntries({
      content_type: 'destination',
      'sys.id': id,
      limit: 1,
    });
    return res.items[0] || null;
  } catch (err) {
    console.error('Destination татахад алдаа гарлаа:', err);
    return null;
  }
});

function getImageUrl(fields: any): string | undefined {
  const url = (fields.image || fields.coverImage)?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const destination = await getDestination(id);
  if (!destination) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };

  const fields = destination.fields as any;
  return pageMetadata({
    title: fields.title,
    description: truncate(
      richTextToPlain(fields.description) ||
        fields.subtitle ||
        `${fields.title}: Монголд аялах онцлох газар, үзэх зүйлс, аяллын мэдээлэл.`
    ),
    path: `/destination/${id}`,
    image: getImageUrl(fields),
  });
}

function parseRichText(node: any): any {
  if (!node) return null;
  if (typeof node === 'string') return node;

  if (node.nodeType === 'text') {
    return node.value;
  }

  if (node.nodeType === 'paragraph') {
    return (
      <p className="mb-4 text-base sm:text-lg leading-relaxed text-neutral-800">
        {node.content?.map((child: any, idx: number) => (
          <React.Fragment key={idx}>{parseRichText(child)}</React.Fragment>
        ))}
      </p>
    );
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child: any, idx: number) => (
      <div key={idx}>{parseRichText(child)}</div>
    ));
  }

  return null;
}

export default async function DestinationDetailPage({ params }: Props) {
  const { id } = await params;
  const destination = await getDestination(id);

  if (!destination) {
    notFound();
  }

  const fields = destination.fields as any;
  const imageUrl =
    getImageUrl(fields) ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600';

  return (
    <main className="min-h-screen bg-white pb-24">
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center">
        <img
          src={imageUrl}
          alt={fields.title || 'Destination'}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-28 left-6 sm:left-12 lg:left-16 z-20">
          <a
            href="/#highlights"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md transition-all text-sm font-medium"
          >
            <span>&larr;</span>
            <span>Нүүр хуудас руу буцах</span>
          </a>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-tight">
            {fields.title || 'Destination'}
          </h1>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 sm:px-10 mt-12">
        <div className="text-neutral-800">
          {fields.description ? (
            parseRichText(fields.description)
          ) : (
            <p className="text-base sm:text-lg text-neutral-500 italic">
              Тун удахгүй дэлгэрэнгүй мэдээлэл нэмэгдэнэ...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

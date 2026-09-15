import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/contentful';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

async function getDestination(id: string) {
  try {
    const entry = await client.getEntry(id);
    return entry;
  } catch (error) {
    return null;
  }
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
  const imageField = fields.image || fields.coverImage;
  const imageUrl = imageField?.fields?.file?.url
    ? (imageField.fields.file.url.startsWith('//')
        ? `https:${imageField.fields.file.url}`
        : imageField.fields.file.url)
    : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600';

  return (
    <main className="min-h-screen bg-white pb-24">
      <section className="relative h-[65vh] min-h-[480px] w-full flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={fields.title || 'Destination'}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute top-28 left-6 sm:left-12 lg:left-16 z-20">
          <Link
            href="/#highlights"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all text-xs sm:text-sm font-sans font-medium cursor-pointer"
          >
            <span>←</span>
            <span>Нүүр хуудас руу буцах</span>
          </Link>
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-sans font-medium tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-tight">
            {fields.title}
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
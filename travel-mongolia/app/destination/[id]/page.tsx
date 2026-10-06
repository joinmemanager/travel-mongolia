export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React, { cache } from 'react';

import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { client } from '@/lib/contentful';
import { getDestinationCards } from '@/lib/places';
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

  // Ихэнх газар координатгүй тул зайгаар эрэмбэлэхгүй: "Бусад газрууд"
  const others = (await getDestinationCards()).filter((p) => p.id !== id).slice(0, 3);

  return (
    <PlaceTemplate
      image={{ src: imageUrl, alt: fields.title || 'Destination' }}
      title={fields.title || 'Destination'}
      back={{ href: '/#highlights', label: 'Нүүр хуудас руу буцах' }}
      nearby={{ title: 'Бусад газрууд', places: others }}
      links={[
        { label: 'Зорих газрууд', href: '/destination/region' },
        { label: 'Түүхэн өв, дурсгалт газрууд', href: '/destination/heritage' },
        { label: 'Газрын зураг', href: '/destination/map' },
      ]}
    >
      <div className="text-neutral-800">
        {fields.description ? (
          parseRichText(fields.description)
        ) : (
          <p className="text-base sm:text-lg text-neutral-500 italic">
            Тун удахгүй дэлгэрэнгүй мэдээлэл нэмэгдэнэ...
          </p>
        )}
      </div>
    </PlaceTemplate>
  );
}

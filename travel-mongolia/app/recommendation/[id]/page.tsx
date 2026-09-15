import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/contentful';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

async function getRecommendation(id: string) {
  try {
    const entry = await client.getEntry(id);
    return entry;
  } catch (error) {
    return null;
  }
}

export default async function RecommendationDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getRecommendation(id);

  if (!item) {
    notFound();
  }

  const fields = item.fields as any;
  const imageField = fields.image || fields.coverImage;
  const imageUrl = imageField?.fields?.file?.url
    ? (imageField.fields.file.url.startsWith('//')
        ? `https:${imageField.fields.file.url}`
        : imageField.fields.file.url)
    : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600';

  return (
    <main className="min-h-screen bg-white pb-24">
      {/* 1. HERO ХЭСЭГ */}
      <section className="relative h-[65vh] min-h-[460px] w-full">
        {/* Арын том зураг */}
        <Image
          src={imageUrl}
          alt={fields.title || 'Recommendation'}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Нэгдсэн бараан уусалттай бүрхүүл */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25" />

        {/* Буцах товч (Дээд талын байрлал) */}
        <div className="absolute top-28 left-6 sm:left-12 lg:left-16 z-20">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all text-xs sm:text-sm font-medium cursor-pointer"
          >
            <span>←</span>
            <span>Нүүр хуудас руу буцах</span>
          </Link>
        </div>

        {/* Гарчиг (Доод талын байрлал) */}
        <div className="absolute bottom-12 left-6 sm:left-12 lg:left-16 right-6 max-w-5xl z-20">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">
            {fields.title}
          </h1>
        </div>
      </section>

      {/* 2. АГУУЛГЫН ХЭСЭГ */}
      <div className="max-w-4xl mx-auto px-6 sm:px-10 mt-12">
        <div className="prose prose-lg text-neutral-700 leading-relaxed">
          {fields.description ? (
            <p className="text-base sm:text-lg whitespace-pre-line text-neutral-800">
              {fields.description}
            </p>
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
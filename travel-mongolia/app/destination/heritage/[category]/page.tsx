import { client } from '@/lib/contentful';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import ImageCard from '@/components/design/ImageCard';
import ImageHero from '@/components/templates/ImageHero';
import { pageMetadata, truncate } from '@/lib/seo';

function getImageUrl(imageField: any): string {
  if (!imageField)
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000';

  const url = imageField?.fields?.file?.url || '';

  if (!url) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000';
  }

  return url.startsWith('//') ? `https:${url}` : url;
}

// generateMetadata болон хуудас хоёулаа ашиглах тул нэг л удаа татна
const getHeritageCategory = cache(async (category: string) => {
  try {
    // Нүүр хуудас slug-гүй ангилалд sys.id ашигладаг тул хоёуланг нь дэмжинэ
    const res = await client.getEntries({
      content_type: 'heritageCategory',
      'fields.slug': category,
      include: 2,
      limit: 1,
    });

    let entry: any = res.items[0];
    if (!entry) {
      const byId = await client.getEntries({
        content_type: 'heritageCategory',
        'sys.id': category,
        include: 2,
        limit: 1,
      });
      entry = byId.items[0];
    }
    if (!entry) return null;

    const f = entry.fields;
    return {
      title: f.title || '',
      count: f.count || '',
      places: (f.places || [])
        .filter((placeRef: any) => placeRef?.fields)
        .map((placeRef: any) => {
          const pf = placeRef.fields;
          return {
            id: placeRef.sys.id,
            name: pf.name || '',
            region: pf.region || '',
            img: getImageUrl(pf.image),
          };
        }),
    };
  } catch (err) {
    console.error('Heritage category fetch error:', err);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const data = await getHeritageCategory(decodeURIComponent(category));
  if (!data) return { title: 'Мэдээлэл олдсонгүй', robots: { index: false } };

  const names = data.places.slice(0, 4).map((p: any) => p.name).filter(Boolean);
  return pageMetadata({
    title: `${data.title}: Монголын түүхэн өв`,
    description: truncate(
      `Монголын ${data.title}${names.length ? `: ${names.join(', ')}` : ''} болон бусад дурсгалт газруудын байршил, зураг, тайлбар.`
    ),
    path: `/destination/heritage/${category}`,
    image: data.places[0]?.img,
  });
}

export default async function HeritageCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = await getHeritageCategory(decodeURIComponent(category));

  // Байхгүй хуудсыг 404 болгосноор Google хоосон хуудсыг index-д оруулахгүй
  if (!data) notFound();

  const heroImg = data.places[0]?.img || getImageUrl(null);

  return (
    <main className="w-full bg-white text-neutral-900 pb-28 font-sans selection:bg-[#15803d] selection:text-white">
      <ImageHero
        image={{ src: heroImg, alt: data.title }}
        title={data.title}
        intro={data.count || undefined}
        topLeft={
          <Link
            href="/destination/heritage"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all text-xs sm:text-sm font-medium"
          >
            <span aria-hidden="true">←</span>
            <span>Бүх түүхэн өв</span>
          </Link>
        }
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-14">
        {data.places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.places.map((place: any) => (
              <ImageCard
                key={place.id}
                href={`/destination/heritage/place/${place.id}`}
                image={{ src: place.img, alt: place.name }}
                eyebrow={place.region}
                title={place.name}
                aspect="h-80 sm:h-96"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ))}
          </div>
        ) : (
          <p className="text-neutral-500 italic text-center py-12">
            Энэ ангилалд одоогоор газар нэмэгдээгүй байна.
          </p>
        )}
      </div>
    </main>
  );
}

import { client } from '@/lib/contentful';
import Image from 'next/image';
import Link from 'next/link';
import HeritagePlaceCard from '@/components/HeritagePlaceCard';

function getImageUrl(imageField: any): string {
  if (!imageField)
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000';

  const url = imageField?.fields?.file?.url || '';

  if (!url) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000';
  }

  return url.startsWith('//') ? `https:${url}` : url;
}

async function getHeritageCategory(category: string) {
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
}

export default async function HeritageCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const data = await getHeritageCategory(decodeURIComponent(category));

  if (!data) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Мэдээлэл олдсонгүй</h1>
        <Link href="/destination/heritage" className="text-[#15803d] font-semibold mt-4 inline-block">
          ← Буцах
        </Link>
      </main>
    );
  }

  const heroImg = data.places[0]?.img || getImageUrl(null);

  return (
    <main className="w-full bg-white text-neutral-900 pb-28 font-sans selection:bg-[#15803d] selection:text-white">
      <section className="relative w-full h-[40vh] min-h-[300px] flex items-end overflow-hidden">
        <Image
          src={heroImg}
          alt={data.title}
          fill
          priority
          unoptimized
          className="object-cover brightness-[0.45]"
        />
        <div className="relative z-10 px-6 sm:px-10 pb-10 max-w-7xl mx-auto w-full">
          <Link href="/destination/heritage" className="text-white/80 text-sm font-semibold mb-3 inline-block hover:text-white">
            ← Бүх түүхэн өв
          </Link>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {data.title}
          </h1>
          {data.count && (
            <p className="text-white/90 text-sm sm:text-base font-medium mt-2">{data.count}</p>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 mt-14">
        {data.places.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.places.map((place: any) => (
              <HeritagePlaceCard key={place.id} place={place} />
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

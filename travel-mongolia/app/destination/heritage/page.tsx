import { client } from '@/lib/contentful';
import HeritagePageClient from '@/components/HeritagePageClient';

function getImageUrl(imageField: any): string {
  if (!imageField)
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000';

  const url = imageField?.fields?.file?.url || '';

  if (!url) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000';
  }

  return url.startsWith('//') ? `https:${url}` : url;
}

async function getHeritageCategories() {
  try {
    const res = await client.getEntries({
      content_type: 'heritageCategory',
      include: 2,
      order: ['fields.title'],
    });

    return res.items.map((item: any) => {
      const f = item.fields;

      const places = (f.places || []).map((placeRef: any) => {
        const pf = placeRef?.fields;
        return {
          id: placeRef?.sys?.id || '',
          name: pf?.name || '',
          region: pf?.region || '',
          img: getImageUrl(pf?.image),
        };
      });

      return {
        id: f.slug || item.sys.id,
        title: f.title || '',
        count: f.count || '',
        places,
        remainingCount: f.remainingCount ?? 0,
      };
    });
  } catch (err) {
    console.error('Heritage categories fetch error:', err);
    return [];
  }
}

export default async function HeritageDestinationsPage() {
  const categories = await getHeritageCategories();

  return <HeritagePageClient categories={categories} />;
}
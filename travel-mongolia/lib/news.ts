import { client } from '@/lib/contentful';
import { creditOf, type ImageCredit } from '@/lib/imageCredit';

// TIC-ийн мэдээний архив (Contentful `story`, topic = «news», 8-р багц). Иргэдийн зөвшөөрөлтэй түүх
// (consentObtained) биш тул /stories-ийн жагсаалтад орохгүй: тусдаа /stories/news, /stories/news/<slug>.
// Хуудасны төлөв: PAGE_STATUS['/stories/news'] (lib/navigation.ts).
export const NEWS_BASE = '/stories/news' as const;

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  publishedDate?: string;
  image?: { src: string; alt: string; credit?: ImageCredit };
  body?: any;
  source?: string;
  seoTitle?: string;
  seoDescription?: string;
  updatedAt?: string;
}

function toNews(e: any, withBody: boolean): NewsArticle {
  const f = e.fields || {};
  const media = Array.isArray(f.media) ? f.media[0] : undefined;
  const url: string | undefined = media?.fields?.file?.url;
  return {
    id: e.sys.id,
    title: String(f.title || ''),
    slug: String(f.slug || e.sys.id),
    publishedDate: f.publishedDate,
    image: url ? { src: url.startsWith('//') ? `https:${url}` : url, alt: media.fields.title || f.title, credit: creditOf(media) } : undefined,
    body: withBody ? f.body : undefined,
    source: f.source,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
    updatedAt: e.sys.updatedAt,
  };
}

// Бүх мэдээ (body-гүй), шинээс хуучин руу
export async function getNewsList(): Promise<NewsArticle[]> {
  try {
    const out: NewsArticle[] = [];
    for (let skip = 0; ; skip += 1000) {
      const res = await client.getEntries({
        content_type: 'story',
        'fields.topic': 'news',
        select: ['sys.id', 'sys.updatedAt', 'fields.title', 'fields.slug', 'fields.publishedDate', 'fields.media', 'fields.seoDescription'],
        order: ['-fields.publishedDate'],
        limit: 1000,
        skip,
        include: 1,
      } as any);
      out.push(...res.items.map((e) => toNews(e, false)));
      if (skip + 1000 >= res.total) break;
    }
    return out;
  } catch (err) {
    console.error('Мэдээ татахад алдаа гарлаа:', err);
    return [];
  }
}

export async function getNews(slug: string): Promise<NewsArticle | null> {
  try {
    const res = await client.getEntries({
      content_type: 'story',
      'fields.topic': 'news',
      'fields.slug': decodeURIComponent(slug),
      limit: 1,
      include: 1,
    } as any);
    return res.items[0] ? toNews(res.items[0], true) : null;
  } catch (err) {
    console.error('Мэдээ татахад алдаа гарлаа:', err);
    return null;
  }
}

// «2013.05.21»
export function newsDate(iso?: string): string {
  if (!iso) return '';
  const d = iso.slice(0, 10).split('-');
  return d.length === 3 ? `${d[0]}.${d[1]}.${d[2]}` : iso;
}

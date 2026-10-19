import { client } from '@/lib/contentful';
import { creditOf, type ImageCredit } from '@/lib/imageCredit';

// «Монголын түүх»-ийн нийтлэлүүд (historyArticle, TIC cate14-ээс шилжүүлсэн). /about/history хуудасны
// үе бүрийн (period = хэсгийн id) доор жагсаагдаж, /about/history/<slug> хуудастай.
export interface HistoryArticle {
  id: string;
  title: string;
  slug: string;
  period: string;
  order: number;
  image?: { src: string; alt: string; credit?: ImageCredit };
  body?: any;
  seoTitle?: string;
  seoDescription?: string;
}

// Үеүдийн нэр (түүхийн хуудасны хэсгүүдтэй ижил дараалал). «themes» нь цаг үеэр хуваагдахгүй сэдвүүд.
export const HISTORY_PERIODS: { id: string; title: string }[] = [
  { id: 'ancient-land', title: 'Эртний Монгол нутаг' },
  { id: 'hunnu-empires', title: 'Хүннү ба эртний төрт улсууд' },
  { id: 'great-mongol', title: 'Их Монгол Улс' },
  { id: 'mongol-empire', title: 'Монголын эзэнт гүрэн' },
  { id: 'xvii-xix-century', title: 'XVII–XIX зууны Монгол' },
  { id: 'xx-century', title: 'XX зууны Монгол' },
  { id: 'modern-mongolia', title: 'Орчин үеийн Монгол Улс' },
  { id: 'themes', title: 'Сэдэвчилсэн түүх' },
];

function toArticle(e: any, withBody: boolean): HistoryArticle {
  const f = e.fields || {};
  const url: string | undefined = f.image?.fields?.file?.url;
  return {
    id: e.sys.id,
    title: String(f.title || ''),
    slug: String(f.slug || e.sys.id),
    period: String(f.period || 'themes'),
    order: typeof f.order === 'number' ? f.order : 999,
    image: url ? { src: url.startsWith('//') ? `https:${url}` : url, alt: f.image.fields.title || f.title, credit: creditOf(f.image) } : undefined,
    body: withBody ? f.body : undefined,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
  };
}

const byOrder = (a: HistoryArticle, b: HistoryArticle) => a.order - b.order || a.title.localeCompare(b.title, 'mn');

// Бүх нийтлэл (body-гүй), үе доторх дарааллаар. Алдаа гарвал хоосон (хуудас статик хэсгээрээ харагдана).
export async function getHistoryArticles(): Promise<HistoryArticle[]> {
  try {
    const res = await client.getEntries({
      content_type: 'historyArticle',
      select: ['sys.id', 'fields.title', 'fields.slug', 'fields.period', 'fields.order', 'fields.image', 'fields.seoDescription'],
      limit: 1000,
      include: 1,
    } as any);
    return res.items.map((e) => toArticle(e, false)).sort(byOrder);
  } catch (err) {
    console.error('Түүхийн нийтлэлүүдийг татахад алдаа гарлаа:', err);
    return [];
  }
}

export async function getHistoryArticle(slug: string): Promise<HistoryArticle | null> {
  try {
    const res = await client.getEntries({
      content_type: 'historyArticle',
      'fields.slug': decodeURIComponent(slug),
      limit: 1,
      include: 1,
    } as any);
    return res.items[0] ? toArticle(res.items[0], true) : null;
  } catch (err) {
    console.error('Түүхийн нийтлэл татахад алдаа гарлаа:', err);
    return null;
  }
}

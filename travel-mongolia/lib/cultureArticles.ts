import { client, rethrowOutage } from '@/lib/contentful';
import { creditOf, type ImageCredit } from '@/lib/imageCredit';

// TIC 10-р багц (Contentful `cultureArticle`): угсаатан, түүхэн хүмүүс (cate14), шашин (cate15), зан заншил (cate16).
// `section` нь хаягийг тодорхойлно. Жагсаалт, дэлгэрэнгүй хуудас нь «Соёл, өв» (sec-culture) эсвэл
// «Монголын тухай» (sec-about) хэсгийн дотор.
export type CultureSection = 'ethnic-groups' | 'people' | 'religion' | 'traditions';

export const CULTURE_SECTIONS: Record<CultureSection, { title: string; base: string; parent: { label: string; href: string }; noun: string }> = {
  'ethnic-groups': { title: 'Угсаатнууд', base: '/about/culture/ethnic-groups', parent: { label: 'Соёл ба өв', href: '/about/culture' }, noun: 'угсаатан' },
  people: { title: 'Түүхэн хүмүүс', base: '/about/history/people', parent: { label: 'Монголын түүх', href: '/about/history' }, noun: 'түүхэн хүн' },
  religion: { title: 'Шашин шүтлэг', base: '/about/culture/religion', parent: { label: 'Соёл ба өв', href: '/about/culture' }, noun: 'нийтлэл' },
  traditions: { title: 'Зан заншлын нийтлэлүүд', base: '/about/traditions', parent: { label: 'Ёс заншил, уламжлал', href: '/about/traditions' }, noun: 'нийтлэл' },
};

export interface CultureArticle {
  id: string;
  title: string;
  slug: string;
  section: CultureSection;
  order: number;
  href: string;
  image?: { src: string; alt: string; credit?: ImageCredit };
  body?: any;
  seoTitle?: string;
  seoDescription?: string;
}

function toArticle(e: any, withBody: boolean): CultureArticle {
  const f = e.fields || {};
  const url: string | undefined = f.image?.fields?.file?.url;
  const section = (f.section || 'traditions') as CultureSection;
  const slug = String(f.slug || e.sys.id);
  return {
    id: e.sys.id,
    title: String(f.title || ''),
    slug,
    section,
    order: typeof f.order === 'number' ? f.order : 999,
    href: `${CULTURE_SECTIONS[section].base}/${slug}`,
    image: url ? { src: url.startsWith('//') ? `https:${url}` : url, alt: f.image.fields.title || f.title, credit: creditOf(f.image) } : undefined,
    body: withBody ? f.body : undefined,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
  };
}

const byOrder = (a: CultureArticle, b: CultureArticle) => a.order - b.order || a.title.localeCompare(b.title, 'mn');

// Хэсгийн бүх нийтлэл (body-гүй). Алдаа гарвал хоосон (хуудас статик хэсгээрээ харагдана).
export async function getCultureArticles(section: CultureSection): Promise<CultureArticle[]> {
  try {
    const res = await client.getEntries({
      content_type: 'cultureArticle',
      'fields.section': section,
      select: ['sys.id', 'fields.title', 'fields.slug', 'fields.section', 'fields.order', 'fields.image', 'fields.seoDescription'],
      limit: 1000,
      include: 1,
    } as any);
    return res.items.map((e) => toArticle(e, false)).sort(byOrder);
  } catch (err) {
    rethrowOutage(err);
    console.error('Соёлын нийтлэлүүдийг татахад алдаа гарлаа:', err);
    return [];
  }
}

export async function getCultureArticle(section: CultureSection, slug: string): Promise<CultureArticle | null> {
  try {
    const res = await client.getEntries({
      content_type: 'cultureArticle',
      'fields.section': section,
      'fields.slug': decodeURIComponent(slug),
      limit: 1,
      include: 1,
    } as any);
    return res.items[0] ? toArticle(res.items[0], true) : null;
  } catch (err) {
    rethrowOutage(err);
    console.error('Соёлын нийтлэл татахад алдаа гарлаа:', err);
    return null;
  }
}

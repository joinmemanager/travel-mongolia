import { client, rethrowOutage } from '@/lib/contentful';

// «Олон улсын жишиг ба тайлан» (Contentful `story`, topic = «international»): олон улсын тайлангийн монгол хураангуй.
// Иргэдийн зөвшөөрөлтэй түүх (consentObtained) биш тул /stories-ийн жагсаалт, sitemap-д орохгүй.
// Хуудасны төлөв: PAGE_STATUS['/impact/examples'] (lib/navigation.ts). PDF-ийг сайтад байршуулахгүй, зөвхөн эх рүү холбоно.
export const REPORTS_BASE = '/impact/examples' as const;

export const SOURCE_TYPE_LABEL: Record<string, string> = {
  standard: 'Стандарт',
  policy: 'Бодлого',
  research: 'Судалгаа',
  statistics: 'Статистик',
  'company-report': 'Компанийн тайлан',
};

export interface InternationalReport {
  id: string;
  title: string;
  slug: string;
  href: string;
  publisher?: string;
  year?: number;
  sourceType?: string;
  originalUrl?: string;
  body?: any;
  seoTitle?: string;
  seoDescription?: string;
}

function toReport(e: any, withBody: boolean): InternationalReport {
  const f = e.fields || {};
  const slug = String(f.slug || e.sys.id);
  return {
    id: e.sys.id,
    title: String(f.title || ''),
    slug,
    href: `${REPORTS_BASE}/${slug}`,
    publisher: f.publisher,
    year: f.year,
    sourceType: f.sourceType,
    originalUrl: f.originalUrl,
    body: withBody ? f.body : undefined,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
  };
}

// Бүх тайлан (body-гүй), шинээс хуучин руу. Алдаа гарвал хоосон.
export async function getInternationalReports(): Promise<InternationalReport[]> {
  try {
    const res = await client.getEntries({
      content_type: 'story',
      'fields.topic': 'international',
      select: ['sys.id', 'fields.title', 'fields.slug', 'fields.publisher', 'fields.year', 'fields.sourceType', 'fields.originalUrl', 'fields.seoDescription'],
      limit: 100,
      include: 0,
    } as any);
    return res.items
      .map((e) => toReport(e, false))
      .sort((a, b) => (b.year || 0) - (a.year || 0) || a.title.localeCompare(b.title, 'mn'));
  } catch (err) {
    rethrowOutage(err);
    console.error('Олон улсын тайлан татахад алдаа гарлаа:', err);
    return [];
  }
}

export async function getInternationalReport(slug: string): Promise<InternationalReport | null> {
  try {
    const res = await client.getEntries({
      content_type: 'story',
      'fields.topic': 'international',
      'fields.slug': decodeURIComponent(slug),
      limit: 1,
      include: 0,
    } as any);
    return res.items[0] ? toReport(res.items[0], true) : null;
  } catch (err) {
    rethrowOutage(err);
    console.error('Олон улсын тайлан татахад алдаа гарлаа:', err);
    return null;
  }
}

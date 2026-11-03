import { cache } from 'react';

import { client, rethrowOutage } from '@/lib/contentful';

// «Нутгийн Монгол», «Хүндэтгэлтэй аялал», «Үр өгөөж & түншлэл»-ийн дэд хэсгүүдийн нийтлэл (Contentful `story`,
// topic = local / respect / impact, эх: docs/content/, scripts/contentful/section-articles.js).
// Иргэдийн зөвшөөрөлтэй түүх (consentObtained) биш тул /stories-ийн жагсаалтад орохгүй: хаяг нь /<хэсэг>/articles/<slug>,
// дэд хуудас бүрт ArticleTeaser карт.
export type ArticleSection = 'local' | 'respect' | 'impact';

export const ARTICLE_SECTIONS: Record<ArticleSection, { mn: string; href: string; base: string }> = {
  local: { mn: 'Нутгийн Монгол', href: '/local', base: '/local/articles' },
  respect: { mn: 'Хүндэтгэлтэй аялал', href: '/respect', base: '/respect/articles' },
  impact: { mn: 'Үр өгөөж & түншлэл', href: '/impact', base: '/impact/articles' },
};

export const isArticleSection = (topic: unknown): topic is ArticleSection =>
  typeof topic === 'string' && topic in ARTICLE_SECTIONS;

export const articleHref = (section: ArticleSection, slug: string) => `${ARTICLE_SECTIONS[section].base}/${slug}`;

// Нийтлэл цэсний аль дэд хэсэгт харагдах вэ (цэсний lib/navigation.ts-ийн href, нэр)
export const ARTICLE_PLACES: Record<string, { href: string; label: string }> = {
  'respectful-herder-stay': { href: '/local/experiences', label: 'Нутгийн туршлага' },
  'local-guide-value': { href: '/local/guides', label: 'Нутгийн хөтөч' },
  'herder-households-today': { href: '/local/herder-families', label: 'Малчин өрх' },
  'ger-to-felt-crafts': { href: '/local/artisans', label: 'Гар урлаач' },
  'airag-and-dairy': { href: '/local/food', label: 'Нутгийн хоол' },
  'choosing-local-products': { href: '/local/products', label: 'Нутгийн бүтээгдэхүүн' },
  'responsible-travel': { href: '/respect', label: 'Хариуцлагатай аяллын гарын авлага' },
  'herder-visit-etiquette': { href: '/respect/etiquette', label: 'Соёл, ёс заншил' },
  'protecting-the-steppe': { href: '/respect/nature', label: 'Байгальд ээлтэй аялал' },
  'safe-travel-tips': { href: '/plan/safety-info', label: 'Аюулгүй байдал' },
  'accessible-travel-tips': { href: '/respect/accessible', label: 'Хүртээмжтэй аялал' },
  'tourism-income-local': { href: '/impact#local-impact', label: 'Орон нутгийн үр өгөөж' },
  'project-lessons': { href: '/impact#projects', label: 'Түншлэлийн төслүүд' },
  'destination-management': { href: '/impact#provinces', label: 'Аймаг, DMO' },
  'tourism-business-value': { href: '/impact#businesses', label: 'Аяллын бизнес' },
  'who-funds-tourism': { href: '/impact#donors', label: 'Хандивлагч, хөрөнгө оруулагч' },
};

const PLACE_ORDER = Object.keys(ARTICLE_PLACES);

export interface SectionArticle {
  id: string;
  title: string;
  slug: string;
  href: string;
  section: ArticleSection;
  place?: { href: string; label: string };
  excerpt: string;
  seoTitle?: string;
  body?: any;
}

function toArticle(e: any): SectionArticle {
  const f = e.fields || {};
  const slug = String(f.slug || e.sys.id);
  return {
    id: e.sys.id,
    title: String(f.title || ''),
    slug,
    href: articleHref(f.topic, slug),
    section: f.topic,
    place: ARTICLE_PLACES[slug],
    excerpt: String(f.seoDescription || ''),
    seoTitle: f.seoTitle,
    body: f.body,
  };
}

// Хэсгийн нийтлэлүүд (body-гүй), цэсний дарааллаар
export const getSectionArticles = cache(async (section: ArticleSection): Promise<SectionArticle[]> => {
  try {
    const res = await client.getEntries({
      content_type: 'story',
      'fields.topic': section,
      select: ['sys.id', 'fields.title', 'fields.slug', 'fields.topic', 'fields.seoTitle', 'fields.seoDescription'],
      limit: 100,
      include: 0,
    } as any);
    return res.items.map(toArticle).sort((a, b) => PLACE_ORDER.indexOf(a.slug) - PLACE_ORDER.indexOf(b.slug));
  } catch (err) {
    rethrowOutage(err);
    console.error('Хэсгийн нийтлэл татахад алдаа гарлаа:', err);
    return [];
  }
});

// Цэсний нэг дэд хэсгийн нийтлэл (href нь ARTICLE_PLACES-ийнх)
export async function getArticleAt(section: ArticleSection, href: string): Promise<SectionArticle | undefined> {
  return (await getSectionArticles(section)).find((a) => a.place?.href === href);
}

export const getSectionArticle = cache(async (section: ArticleSection, slug: string): Promise<SectionArticle | null> => {
  try {
    const res = await client.getEntries({
      content_type: 'story',
      'fields.topic': section,
      'fields.slug': decodeURIComponent(slug),
      limit: 1,
      include: 0,
    } as any);
    return res.items[0] ? toArticle(res.items[0]) : null;
  } catch (err) {
    rethrowOutage(err);
    console.error('Хэсгийн нийтлэл татахад алдаа гарлаа:', err);
    return null;
  }
});

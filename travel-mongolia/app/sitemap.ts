import type { MetadataRoute } from 'next';

import { client } from '@/lib/contentful';
import { isUnpublishedPage } from '@/lib/navigation';
import { PAGE_META } from '@/lib/pageMeta';
import { SITE_URL } from '@/lib/seo';

// Contentful-д шинэ контент нэмэгдэхэд sitemap цаг тутам шинэчлэгдэнэ
export const revalidate = 3600;

async function contentfulEntries(contentType: string) {
  try {
    const res = await client.getEntries({ content_type: contentType, limit: 1000 });
    return res.items as any[];
  } catch (err) {
    console.error(`Sitemap: ${contentType} татахад алдаа гарлаа`, err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    // Production дээр live биш (draft/planned) хуудсыг sitemap-д оруулахгүй
    ...Object.keys(PAGE_META).filter((path) => !isUnpublishedPage(path)).map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const [places, categories, provinces, recommendations, destinations] =
    await Promise.all([
      contentfulEntries('heritagePlace'),
      contentfulEntries('heritageCategory'),
      contentfulEntries('province'),
      contentfulEntries('recommendation'),
      contentfulEntries('destination'),
    ]);

  // Сайтын холбоосуудтай ижил хаягийг ашиглана (slug байвал slug, үгүй бол id)
  const dynamicPages: MetadataRoute.Sitemap = [
    ...places.map((e) => ({
      url: `${SITE_URL}/destination/heritage/place/${e.sys.id}`,
      lastModified: e.sys.updatedAt,
      priority: 0.6,
    })),
    ...categories.map((e) => ({
      url: `${SITE_URL}/destination/heritage/${e.fields.slug || e.sys.id}`,
      lastModified: e.sys.updatedAt,
      priority: 0.6,
    })),
    ...provinces.map((e) => ({
      url: `${SITE_URL}/province/${e.fields.slug || e.sys.id}`,
      lastModified: e.sys.updatedAt,
      priority: 0.7,
    })),
    ...recommendations.map((e) => ({
      url: `${SITE_URL}/recommendation/${e.sys.id}`,
      lastModified: e.sys.updatedAt,
      priority: 0.5,
    })),
    // Нүүр хуудасны "Онцлох газрууд" картууд /destination/<id> руу холбогддог
    ...destinations.map((e) => ({
      url: `${SITE_URL}/destination/${e.sys.id}`,
      lastModified: e.sys.updatedAt,
      priority: 0.7,
    })),
  ];

  return [...staticPages, ...dynamicPages];
}

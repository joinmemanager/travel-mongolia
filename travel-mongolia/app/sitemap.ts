import type { MetadataRoute } from 'next';

import { client } from '@/lib/contentful';
import { ACCOMMODATION_BASE, isTicAccommodation } from '@/lib/accommodation';
import { CULTURE_SECTIONS, type CultureSection } from '@/lib/cultureArticles';
import { entryKey } from '@/lib/entries';
import { isUnpublishedPage, REDIRECTED_PATHS } from '@/lib/navigation';
import { NEWS_BASE } from '@/lib/news';
import { PAGE_META } from '@/lib/pageMeta';
import { isThinContent, SITE_URL } from '@/lib/seo';
import { SPECIES_SECTION } from '@/lib/species';
import { CATEGORY_INFO, type PlaceCategory } from '@/lib/tourismPlaces';

const placeBase = (c: PlaceCategory) => CATEGORY_INFO[c]?.base || '/destination/protected';

// Хүсэлт бүрт Contentful-ээс шинээр үүсгэнэ. revalidate = 3600 (ISR) үед production-ийн sitemap
// шинэчлэгдэлгүй 10-15-аас өмнөх өгөгдлөөр үлдэж, шинэ аймаг, сумд ороогүй байв (2026-10-19).
// Google sitemap-ийг өдөрт цөөн удаа татдаг тул CDA-ийн дуудлага бага.
export const dynamic = 'force-dynamic';

// Хуудаслан татна: TIC-ийн мэдээ (body-тэй 600+) нэг хариунд багтахгүй (Contentful-ийн хариуны хэмжээний хязгаар)
async function contentfulEntries(contentType: string, query: Record<string, unknown> = {}) {
  try {
    const items: any[] = [];
    for (let skip = 0; ; skip += 250) {
      const res = await client.getEntries({ content_type: contentType, limit: 250, skip, ...query } as any);
      items.push(...res.items);
      if (skip + 250 >= res.total) break;
    }
    return items;
  } catch (err) {
    console.error(`Sitemap: ${contentType} татахад алдаа гарлаа`, err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    // Production дээр live биш (draft/planned) хуудсыг sitemap-д оруулахгүй
    ...Object.keys(PAGE_META).filter((path) => !isUnpublishedPage(path) && !REDIRECTED_PATHS[path]).map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  const [places, categories, provinces, recommendations, destinations, stories, soums, historyArticles, tourismPlaces, species, events, cultureArticles, providers] =
    await Promise.all([
      contentfulEntries('heritagePlace'),
      contentfulEntries('heritageCategory'),
      contentfulEntries('province'),
      contentfulEntries('recommendation'),
      contentfulEntries('destination'),
      contentfulEntries('story'),
      contentfulEntries('soum'),
      contentfulEntries('historyArticle'),
      contentfulEntries('place'),
      contentfulEntries('species'),
      contentfulEntries('event'),
      contentfulEntries('cultureArticle'),
      contentfulEntries('localProvider', { 'fields.providerType': 'accommodation' }),
    ]);

  // Сайтын холбоосуудтай ижил хаягийг ашиглана (slug байвал slug, үгүй бол id)
  const dynamicPages: MetadataRoute.Sitemap = [
    // Агуулга нимгэн (noindex) өвийн газрыг оруулахгүй (lib/seo.ts isThinContent)
    ...places.filter((e) => !isThinContent(e.fields.description)).map((e) => ({
      url: `${SITE_URL}/destination/heritage/place/${entryKey(e)}`,
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
    // Тусдаа хуудастай сумд (бусад нь аймгийн хуудсанд жагсаалтаар)
    ...soums
      .filter((e) => e.fields.ownPage === true && e.fields.province?.fields?.slug)
      .map((e) => ({
        url: `${SITE_URL}/province/${e.fields.province.fields.slug}/${e.fields.slug}`,
        lastModified: e.sys.updatedAt,
        priority: 0.5,
      })),
    // «Монголын түүх»-ийн нийтлэлүүд
    ...historyArticles.map((e) => ({
      url: `${SITE_URL}/about/history/${entryKey(e)}`,
      lastModified: e.sys.updatedAt,
      priority: 0.6,
    })),
    // TIC-ийн газрууд (тусгай хамгаалалттай, музей/театр, рашаан), амьтан/ургамал (тусдаа хуудастай нь).
    // Богино (80 үгээс доош, noindex) болон production дээр нийтлэгдээгүй хэсгийн хуудсыг оруулахгүй.
    ...tourismPlaces
      .filter((e) => !isThinContent(e.fields.body))
      .map((e) => ({ path: `${placeBase(e.fields.category)}/${entryKey(e)}`, e }))
      .concat(
        species
          .filter((e) => e.fields.ownPage === true && !isThinContent(e.fields.body))
          .map((e) => ({ path: `/about/nature/${SPECIES_SECTION[e.fields.group] || 'wildlife'}/${entryKey(e)}`, e }))
      )
      .filter(({ path }) => !isUnpublishedPage(path))
      .map(({ path, e }) => ({ url: `${SITE_URL}${path}`, lastModified: e.sys.updatedAt, priority: 0.5 })),
    // TIC-ийн арга хэмжээ (event) мөн /recommendation/<slug> хаягтай
    ...[...recommendations, ...events].map((e) => ({
      url: `${SITE_URL}/recommendation/${entryKey(e)}`,
      lastModified: e.sys.updatedAt,
      priority: 0.5,
    })),
    // Хуучин /destination/<id> хаяг slug хаяг руу redirect хийдэг тул sitemap-д slug хаяг
    ...destinations.map((e) => ({
      url: `${SITE_URL}/destination/${entryKey(e)}`,
      lastModified: e.sys.updatedAt,
      priority: 0.7,
    })),
    // Түүх & өв hub-ийн нийтлэлүүд: зөвшөөрөлтэй, "[ЖИШЭЭ]" биш, /stories live үед
    ...stories
      .filter((e) => e.fields.consentObtained === true && !String(e.fields.title || '').startsWith('[ЖИШЭЭ]'))
      .map((e) => `/stories/${entryKey(e)}`)
      .filter((path) => !isUnpublishedPage(path))
      .map((path) => ({ url: `${SITE_URL}${path}`, priority: 0.6 })),
    // TIC 10-р багц: угсаатан, түүхэн хүмүүс, шашин, зан заншил (хэсэг нь live үед, богиныг оруулахгүй)
    ...cultureArticles
      .filter((e) => CULTURE_SECTIONS[e.fields.section as CultureSection] && !isThinContent(e.fields.body))
      .map((e) => ({ path: `${CULTURE_SECTIONS[e.fields.section as CultureSection].base}/${entryKey(e)}`, e }))
      .filter(({ path }) => !isUnpublishedPage(path))
      .map(({ path, e }) => ({ url: `${SITE_URL}${path}`, lastModified: e.sys.updatedAt, priority: 0.5 })),
    // TIC-ийн зочид буудал, жуулчны бааз (/plan/accommodation/<slug>)
    ...providers
      .filter((e) => isTicAccommodation(e.fields) && !isThinContent(e.fields.story))
      .map((e) => ({ path: `${ACCOMMODATION_BASE}/${entryKey(e)}`, e }))
      .filter(({ path }) => !isUnpublishedPage(path))
      .map(({ path, e }) => ({ url: `${SITE_URL}${path}`, lastModified: e.sys.updatedAt, priority: 0.4 })),
    // TIC-ийн мэдээний архив: богино (noindex) мэдээг оруулахгүй, /stories/news live үед
    ...stories
      .filter((e) => e.fields.topic === 'news' && !isThinContent(e.fields.body))
      .map((e) => ({ path: `${NEWS_BASE}/${entryKey(e)}`, e }))
      .filter(({ path }) => !isUnpublishedPage(path))
      .map(({ path, e }) => ({ url: `${SITE_URL}${path}`, lastModified: e.sys.updatedAt, priority: 0.4 })),
  ];

  return [...staticPages, ...dynamicPages];
}

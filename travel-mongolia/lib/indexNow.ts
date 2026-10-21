import { SITE_URL } from '@/lib/seo';
import { CATEGORY_INFO, type PlaceCategory } from '@/lib/tourismPlaces';
import { SPECIES_SECTION } from '@/lib/species';

// IndexNow (Bing, Yandex, Seznam, Naver г.м. хайлтын системүүд хуваалцдаг): шинэ/шинэчлэгдсэн хуудсыг шууд мэдэгдэнэ.
// Түлхүүр нь нууц биш: public/<key>.txt файлаар эзэмшлийг баталгаажуулна (https://www.indexnow.org/documentation).
// Contentful-ийн Publish/Unpublish webhook (/api/revalidate) entry-ийн хуудсыг production дээр илгээнэ.
// Бүх sitemap-ийг нэг дор илгээх: scripts/seo/indexnow-submit.js
export const INDEXNOW_KEY = 'dcea2c855862a6fe6bba7a250c8920c3';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

// Contentful webhook-ийн entry (fields нь locale-оор) → сайтын хаяг. Тодорхойгүй бол хоосон.
export function entryUrls(contentType: string, fields: Record<string, any> | undefined, key: string | null): string[] {
  if (!key) return [];
  const f = (id: string) => {
    const v = fields?.[id];
    return v && typeof v === 'object' && !Array.isArray(v) ? (v.mn ?? Object.values(v)[0]) : v;
  };
  const paths: string[] = [];
  switch (contentType) {
    case 'province':
      paths.push(`/province/${key}`);
      break;
    case 'destination':
      paths.push(`/destination/${key}`);
      break;
    case 'heritagePlace':
      paths.push(`/destination/heritage/place/${key}`);
      break;
    case 'heritageCategory':
      paths.push(`/destination/heritage/${key}`);
      break;
    case 'historyArticle':
      paths.push(`/about/history/${key}`);
      break;
    case 'recommendation':
    case 'event':
      paths.push(`/recommendation/${key}`);
      break;
    case 'story':
      // Зөвхөн TIC-ийн мэдээний архив (иргэдийн түүх зөвшөөрлөөс хамаарна)
      if (f('topic') === 'news') paths.push(`/stories/news/${key}`);
      break;
    case 'place': {
      const info = CATEGORY_INFO[f('category') as PlaceCategory];
      if (info) paths.push(`${info.base}/${key}`, info.href);
      break;
    }
    case 'species': {
      const section = SPECIES_SECTION[f('group')] || 'wildlife';
      if (f('ownPage') === true) paths.push(`/about/nature/${section}/${key}`);
      paths.push(`/about/nature/${section}`);
      break;
    }
    default:
      return [];
  }
  return paths.map((p) => `${SITE_URL}${p}`);
}

// URL-уудыг IndexNow руу илгээнэ (нэг хүсэлтэд ≤10,000). Алдаа гарвал webhook-ийг унагахгүй.
export async function submitIndexNow(urls: string[]): Promise<number | null> {
  if (urls.length === 0) return null;
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls.slice(0, 10000),
      }),
      signal: AbortSignal.timeout(8000),
    });
    return res.status;
  } catch (err) {
    console.error('IndexNow илгээхэд алдаа гарлаа:', err);
    return null;
  }
}

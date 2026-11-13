import { revalidatePath, revalidateTag } from 'next/cache';

import { CONTENTFUL_TAG, contentfulTypeTag } from '@/lib/contentful';
import { URL_PREFIXES } from '@/lib/i18n/locales';

// Нийтлэгдсэн / нийтлэлтээс буусан entry-ийн хуудсуудыг шинэчилнэ. Хоёр эх үүсвэр дуудна:
// - Contentful webhook (app/api/revalidate/route.ts)
// - Payload-ийн afterChange / afterDelete hook (payload/hooks.ts)
// (2026-11-12 хүртэл route.ts дотор байсан, Payload-тай хуваалцахын тулд энд зөөв.)

// Тухайн төрлийн entry-г холбоосоор (include) агуулж харуулдаг төрлүүд: тэдний query-ийн кэшийг мөн шинэчилнэ.
// Жагсаалтад байхгүй төрөл (cultureHeritage, visitorGuidance г.м.) нийтлэгдвэл өмнөх шигээ бүх Contentful кэшийг.
const LINKED_BY: Record<string, string[]> = {
  province: ['soum', 'place', 'heritagePlace', 'destination', 'event'],
  soum: [],
  place: ['story'],
  heritagePlace: ['heritageCategory', 'story', 'destination'],
  heritageCategory: [],
  destination: ['story', 'recommendation'],
  historyArticle: [],
  cultureArticle: [],
  species: [],
  story: [],
  event: [],
  recommendation: [],
  localProvider: ['communityExperience', 'localProduct', 'event', 'province', 'destination', 'heritagePlace'],
  communityExperience: ['localProduct', 'province', 'destination', 'heritagePlace', 'story'],
  localProduct: ['communityExperience', 'province', 'destination', 'heritagePlace', 'story'],
  faqItem: ['province', 'destination'],
};

// Төрөл бүрийн хуудсууд. key = slug (байхгүй бол entry ID). key тодорхойгүй (Unpublish-ийн
// payload-д талбар байдаггүй) бол тухайн route-ийн бүх хуудсыг тэмдэглэнэ.
type Target = { path: string; type?: 'page' | 'layout' };

// /local/<ангилал> жагсаалтууд (localProvider, story-ийн нийтлэл): 2026-11-06-ноос ISR (өмнө нь force-dynamic)
const LOCAL_LISTS: Target[] = ['artisans', 'experiences', 'food', 'guides', 'herder-families', 'products'].map((c) => ({ path: `/local/${c}` }));

export function targetsFor(contentType: string, key: string | null): Target[] | null {
  const one = (literal: string, pattern: string): Target =>
    key ? { path: literal } : { path: pattern, type: 'page' };
  switch (contentType) {
    case 'province':
      return [
        key ? { path: `/province/${key}` } : { path: '/province/[id]', type: 'layout' },
        { path: '/destination/region' },
      ];
    case 'soum':
      // Сумын хуудас болон аймгийн хуудасны жагсаалт: аймгийн slug-ийг webhook мэдэхгүй тул бүх аймаг, сумын хуудсыг
      return [{ path: '/province/[id]', type: 'layout' }];
    case 'destination':
      return [one(`/destination/${key}`, '/destination/[id]'), { path: '/' }, { path: '/province/[id]', type: 'page' }];
    case 'recommendation':
    case 'event':
      // /things-to-do/festivals нь 2026-11-06-ноос ISR (өмнө нь force-dynamic)
      return [one(`/recommendation/${key}`, '/recommendation/[id]'), { path: '/' }, { path: '/things-to-do/festivals' }];
    case 'cultureHeritage':
      return [{ path: '/' }];
    case 'heritageCategory':
      return [one(`/destination/heritage/${key}`, '/destination/heritage/[category]'), { path: '/destination/heritage' }];
    case 'heritagePlace':
      return [
        one(`/destination/heritage/place/${key}`, '/destination/heritage/place/[id]'),
        { path: '/destination/heritage/[category]', type: 'page' },
        { path: '/destination/heritage' },
        { path: '/destination/region' },
        { path: '/province/[id]', type: 'page' },
      ];
    case 'historyArticle':
      return [one(`/about/history/${key}`, '/about/history/[slug]'), { path: '/about/history' }];
    case 'place':
      // TIC: тусгай хамгаалалттай газар, музей/театр, рашаан. Ангиллыг webhook мэдэхгүй тул гурван route-ийг
      return [
        one(`/destination/protected/${key}`, '/destination/protected/[slug]'),
        one(`/things-to-do/museums/${key}`, '/things-to-do/museums/[slug]'),
        one(`/things-to-do/wellness/${key}`, '/things-to-do/wellness/[slug]'),
        one(`/destination/landscapes/${key}`, '/destination/landscapes/[slug]'),
        { path: '/destination/landscapes' },
        { path: '/destination/protected' },
        { path: '/destination/strictly-protected' },
        { path: '/destination/national-parks' },
        { path: '/destination/nature-reserves' },
        { path: '/destination/natural-monuments' },
        { path: '/things-to-do/museums' },
        { path: '/things-to-do/wellness' },
        { path: '/province/[id]', type: 'page' },
      ];
    case 'species':
      // TIC: ан амьтан, шувуу, ургамал (/about/nature/<бүлэг>/<slug>, каталог #slug)
      return [
        one(`/about/nature/wildlife/${key}`, '/about/nature/wildlife/[slug]'),
        one(`/about/nature/birds/${key}`, '/about/nature/birds/[slug]'),
        one(`/about/nature/plants/${key}`, '/about/nature/plants/[slug]'),
        { path: '/about/nature/wildlife' },
        { path: '/about/nature/birds' },
        { path: '/about/nature/plants' },
      ];
    case 'story':
      // Түүх & өв hub-ийн нийтлэл, TIC-ийн мэдээ (topic = news, /stories/news/<slug>) эсвэл олон улсын тайлан (topic = international)
      return [
        one(`/stories/${key}`, '/stories/[slug]'),
        { path: '/stories' },
        one(`/stories/news/${key}`, '/stories/news/[slug]'),
        { path: '/stories/news' },
        one(`/impact/examples/${key}`, '/impact/examples/[slug]'),
        { path: '/impact/examples' },
        // Дэд хэсгүүдийн нийтлэл (topic = local / respect / impact, lib/sectionArticles.ts) ба карттай хуудсууд.
        // /local/<ангилал> нь force-dynamic, /impact-ийг доор бүх төрөлд тэмдэглэдэг.
        one(`/local/articles/${key}`, '/local/articles/[slug]'),
        ...LOCAL_LISTS,
        one(`/respect/articles/${key}`, '/respect/articles/[slug]'),
        one(`/impact/articles/${key}`, '/impact/articles/[slug]'),
        { path: '/local' },
        { path: '/respect' },
        { path: '/respect/etiquette' },
        { path: '/respect/nature' },
        { path: '/respect/accessible' },
        { path: '/plan/safety-info' },
      ];
    case 'cultureArticle':
      // section-ийг webhook-ийн payload-аас уншина (Unpublish-д байхгүй → дөрвөн route-ийг бүгдийг)
      return [
        one(`/about/culture/ethnic-groups/${key}`, '/about/culture/ethnic-groups/[slug]'),
        one(`/about/culture/religion/${key}`, '/about/culture/religion/[slug]'),
        one(`/about/traditions/${key}`, '/about/traditions/[slug]'),
        one(`/about/history/people/${key}`, '/about/history/people/[slug]'),
        { path: '/about/culture/ethnic-groups' },
        { path: '/about/culture/religion' },
        { path: '/about/traditions' },
        { path: '/about/history/people' },
      ];
    case 'localProvider':
      // TIC-ийн буудал, бааз (providerType = accommodation) нь /plan/accommodation/<slug>
      return [
        one(`/local/${key}`, '/local/[slug]'),
        { path: '/local' },
        ...LOCAL_LISTS,
        one(`/plan/accommodation/${key}`, '/plan/accommodation/[slug]'),
        { path: '/plan/accommodation' },
      ];
    case 'communityExperience':
      return [one(`/local/experiences/${key}`, '/local/experiences/[slug]'), { path: '/local' }, ...LOCAL_LISTS];
    case 'localProduct':
      return [{ path: '/local' }, ...LOCAL_LISTS];
    default:
      // visitorGuidance, faqItem г.м. олон хуудсанд холбогддог төрөл: бүх сайтыг тэмдэглэнэ
      return null;
  }
}

// Орчуулгын хуудсууд (/en/..., /[lang]/...): ижил route-ийн хэлний хувилбар
function localizedTargets(t: Target): Target[] {
  if (t.path === '/sitemap.xml') return [];
  if (t.type) return [{ path: `/[lang]${t.path === '/' ? '' : t.path}`, type: t.type }];
  return URL_PREFIXES.map((p) => ({ path: `/${p}${t.path === '/' ? '' : t.path}` }));
}

export function revalidateEntry(contentType: string, key: string | null): { tags: string[]; revalidated: string[] } {
  // Зөвхөн тухайн төрөл, түүнийг агуулдаг төрлүүд, content_type-гүй query-ийн кэш (өмнө нь бүх кэш = бүх хуудас)
  const linked = LINKED_BY[contentType];
  const tags = linked ? [contentType, ...linked].map(contentfulTypeTag).concat(contentfulTypeTag()) : [CONTENTFUL_TAG];
  for (const t of tags) revalidateTag(t, { expire: 0 });
  const targets = targetsFor(contentType, key);
  const done: string[] = [];
  if (!targets) {
    revalidatePath('/', 'layout');
    done.push('/ (layout)');
  } else {
    const all = [...targets, { path: '/impact' }, { path: '/sitemap.xml' }];
    for (const t of [...all, ...all.flatMap(localizedTargets)]) {
      if (t.type) revalidatePath(t.path, t.type);
      else revalidatePath(t.path);
      done.push(t.type ? `${t.path} (${t.type})` : t.path);
    }
  }
  return { tags, revalidated: done };
}

import { unstable_cache } from 'next/cache';

import sitemap from '@/app/sitemap';
import { contentfulEntries } from '@/lib/contentfulAll';
import { fetchGa4Visitors, ga4Configured } from '@/lib/ga4';
import { SITE_LANGUAGES } from '@/lib/languages';
import { roundedCount, type SiteStatsData, type StatItem } from '@/lib/statsFormat';

// Footer-ийн дээрх статистик (components/SiteStats.tsx).
// Зочид: GA4 Data API (lib/ga4.ts). Тохируулаагүй бол мөр бүхэлдээ харагдахгүй, ямар ч тоо зохиохгүй.
// Агуулга: app/sitemap.ts-тэй ижил Contentful query-уудаас (lib/contentfulAll.ts, Data Cache-ийг хуваалцана)
// тоолно, Contentful руу нэмэлт хүсэлт явахгүй. Бүгдийг өдөрт 1 удаа кэшилнэ.

// touristinfocenter.mn-ийн (2015 оноос) нийт зочдын бодит тоо. Эзэмшигч баталгаатай тоо өгвөл энд
// оруулна: «Нийт зочин»-д нэмэгдэж, доор нь «2015 оноос хойш (TIC-ийн түүхтэй)» гэж гарна. null = ашиглахгүй.
export const TIC_HISTORICAL_VISITORS: number | null = null;

const DAY = 86400;
// Нийслэлийн дүүргүүд нь `soum` төрлийн entry, `ulaanbaatar` province-д харьяалагдана (CLAUDE.md)
const CAPITAL = 'ulaanbaatar';

// app/sitemap.ts-ийн query-уудтай яг ижил (кэшийн түлхүүр нь query)
const SITEMAP_TYPES: [string, Record<string, unknown>?][] = [
  ['heritagePlace'], ['heritageCategory'], ['province'], ['recommendation'], ['destination'], ['story'],
  ['soum'], ['historyArticle'], ['place'], ['species'], ['event'], ['cultureArticle'],
  ['localProvider', { 'fields.providerType': 'accommodation' }],
];

// Entry-үүдийн талбаруудад (зураг, gallery, rich text-ийн шигтгээ) холбогдсон давхардаагүй Asset-ууд
function collectAssets(node: unknown, ids: Set<string>, seen: Set<object>) {
  if (!node || typeof node !== 'object' || seen.has(node)) return;
  seen.add(node);
  const sys = (node as any).sys;
  if (sys?.type === 'Asset' && sys.id && String((node as any).fields?.file?.contentType || 'image').startsWith('image')) {
    ids.add(sys.id);
    return;
  }
  for (const v of Array.isArray(node) ? node : Object.values(node)) collectAssets(v, ids, seen);
}

async function contentStats(): Promise<StatItem[]> {
  const [pages, ...lists] = await Promise.all([
    sitemap(),
    ...SITEMAP_TYPES.map(([type, query]) => contentfulEntries(type, query)),
  ]);
  const byType = Object.fromEntries(SITEMAP_TYPES.map(([type], i) => [type, lists[i] as any[]]));
  const provinces = byType.province.filter((e) => e.fields?.slug !== CAPITAL).length;
  const soums = byType.soum.filter((e) => e.fields?.province?.fields?.slug !== CAPITAL).length;
  const assets = new Set<string>();
  const seen = new Set<object>();
  for (const list of lists) for (const e of list as any[]) collectAssets(e.fields, assets, seen);

  return [
    roundedCount('provinces', 'Аймаг', provinces),
    roundedCount('soums', 'Сум', soums),
    roundedCount('pages', 'Хуудас', (pages as unknown[]).length),
    roundedCount('images', 'Зураг', assets.size),
    { key: 'languages', label: 'Хэл', value: SITE_LANGUAGES.length },
  ].filter((s) => s.value > 0);
}

async function visitorStats(): Promise<StatItem[] | null> {
  const ga = await fetchGa4Visitors();
  if (!ga) return null;
  const total: StatItem =
    TIC_HISTORICAL_VISITORS != null
      ? { key: 'total', label: 'Нийт зочин', value: ga.total + TIC_HISTORICAL_VISITORS, note: '2015 оноос хойш (TIC-ийн түүхтэй)' }
      : { key: 'total', label: 'Нийт зочин', value: ga.total };
  return [
    total,
    { key: 'yesterday', label: 'Өчигдөр', value: ga.yesterday },
    { key: 'week', label: 'Өнгөрсөн 7 хоногт', value: ga.week },
    { key: 'month', label: 'Өнгөрсөн сард', value: ga.month },
  ];
}

// Алдаа гарвал кэшлэхгүй (unstable_cache дотор throw), тухайн хэсгийг харуулахгүй
const cachedContent = unstable_cache(contentStats, ['site-stats', 'content'], { revalidate: DAY });
// Түлхүүрт GA4 тохируулсан эсэх: env нэмсний дараах deploy-д хуучин null кэшээс уншихгүй
const cachedVisitors = (on: boolean) =>
  unstable_cache(visitorStats, ['site-stats', 'visitors', on ? 'ga4' : 'none'], { revalidate: DAY })();

// Процесс бүрт нэг удаа: layout бүх хуудсанд дуудагддаг тул build-ийн worker дотор (ялангуяа Data Cache-гүй
// Preview API-тай орчинд) хуудас бүр Contentful руу дахин хүсэлт илгээхээс сэргийлнэ. Амжилттай бол 1 өдөр,
// агуулгын тоо хоосон (алдаа) бол 10 минут санана.
let memo: { until: number; promise: Promise<SiteStatsData> } | null = null;

export function getSiteStats(): Promise<SiteStatsData> {
  if (memo && Date.now() < memo.until) return memo.promise;
  const promise = loadSiteStats();
  memo = { until: Date.now() + DAY * 1000, promise };
  promise.then((s) => {
    if (!s.content.length && memo?.promise === promise) memo.until = Date.now() + 10 * 60 * 1000;
  });
  return promise;
}

async function loadSiteStats(): Promise<SiteStatsData> {
  const [content, visitors] = await Promise.all([
    cachedContent().catch((err) => (console.error('SiteStats: агуулгын тоо', err), [] as StatItem[])),
    (ga4Configured() ? cachedVisitors(true) : Promise.resolve(null)).catch(
      (err) => (console.error('SiteStats: GA4', err), null)
    ),
  ]);
  return { content, visitors };
}

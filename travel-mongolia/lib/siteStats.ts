import { unstable_cache } from 'next/cache';

import sitemap from '@/app/sitemap';
import { contentfulEntries } from '@/lib/contentfulAll';
import { Ga4Error, fetchGa4Visitors, ga4Configured, type Ga4ErrorCode } from '@/lib/ga4';
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
// v2: StatItem.raw (бүхэлдээгүй тоо, /about-us) нэмэгдсэн тул хуучин кэшээс уншихгүй
const cachedContent = unstable_cache(contentStats, ['site-stats', 'content-v2'], { revalidate: DAY });
// Түлхүүрт GA4 тохируулсан эсэх: env нэмсний дараах deploy-д хуучин null кэшээс уншихгүй
// Алдаа (throw) кэшлэгдэхгүй. v2: 2026-11-24-нөөс өмнөх оролдлогын кэштэй холилдохгүй.
const cachedVisitors = unstable_cache(visitorStats, ['site-stats', 'visitors', 'ga4-v2'], { revalidate: DAY });

// Сүүлийн GA4 алдааны код (нууцгүй): preview дээр /api/stats-д «visitorsError» болж харагдана
let lastGa4Error: Ga4ErrorCode | null = null;
export const ga4LastError = () => lastGa4Error;

// Процесс бүрт нэг удаа: layout бүх хуудсанд дуудагддаг тул build-ийн worker дотор (ялангуяа Data Cache-гүй
// Preview API-тай орчинд) хуудас бүр Contentful руу дахин хүсэлт илгээхээс сэргийлнэ. Амжилттай бол 1 өдөр.
// Агуулгын тоо хоосон (алдаа) бол зөвхөн 1 минут санана: дараагийн хуудсууд дахин оролдоно. Өмнө нь 10 минут
// санадаг байсан тул 429 авсан build-ийн worker-ийн бүх хуудас (staging дээр ~1/6) хэсэггүй үлдэж байв (2026-11-23).
// GA4 тохируулсан мөртлөө зочдын тоо ирээгүй (алдаа) бол 5 минут л санана: нэг удаагийн алдаагаар өдөржин
// зочдын мөргүй үлдэхгүй (2026-11-24: staging/production дээр мөр гараагүй).
let memo: { until: number; promise: Promise<SiteStatsData> } | null = null;

export function getSiteStats(): Promise<SiteStatsData> {
  if (memo && Date.now() < memo.until) return memo.promise;
  const promise = loadSiteStats();
  memo = { until: Date.now() + DAY * 1000, promise };
  promise.then((s) => {
    if (memo?.promise !== promise) return;
    if (!s.content.length) memo.until = Date.now() + 60 * 1000;
    else if (!s.visitors && ga4Configured()) memo.until = Date.now() + 5 * 60 * 1000;
  });
  return promise;
}

// true = зочдын тоо бүрэн (эсвэл GA4 тохируулаагүй тул ирэх ч үгүй): /api/stats урт хугацаагаар кэшилж болно
export const visitorsSettled = (s: SiteStatsData) => !!s.visitors?.length || !ga4Configured();

// Contentful 429 (хүсэлтийн хязгаар) түр зуурын тул нэг удаа 3 секундын дараа дахин оролдоно
async function contentWithRetry(): Promise<StatItem[]> {
  try {
    return await cachedContent();
  } catch (err) {
    console.warn('SiteStats: агуулгын тоо, дахин оролдоно', (err as Error)?.message);
    await new Promise((r) => setTimeout(r, 3000));
    return cachedContent();
  }
}

let warnedMissing = false;

async function loadVisitors(): Promise<StatItem[] | null> {
  if (!ga4Configured()) {
    lastGa4Error = 'missing_env';
    // Процесс бүрт нэг удаа: аль хувьсагч энэ орчинд (build эсвэл runtime) хүрээгүйг бичнэ
    if (!warnedMissing) {
      warnedMissing = true;
      const missing = ['GA4_PROPERTY_ID', 'GA4_CLIENT_EMAIL', 'GA4_PRIVATE_KEY'].filter((k) => !process.env[k]?.trim());
      console.warn(`SiteStats: GA4 тохируулаагүй, зочдын мөр харагдахгүй (${missing.join(', ')} байхгүй; VERCEL_ENV=${process.env.VERCEL_ENV || '-'})`);
    }
    return null;
  }
  try {
    const v = await cachedVisitors();
    lastGa4Error = null;
    return v;
  } catch (err) {
    lastGa4Error = err instanceof Ga4Error ? err.code : 'api_error';
    // Ga4Error-ийн мессеж нууц утгагүй (код + Google-ийн алдааны тайлбар)
    console.error(`SiteStats: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

async function loadSiteStats(): Promise<SiteStatsData> {
  const [content, visitors] = await Promise.all([
    contentWithRetry().catch((err) => (console.error('SiteStats: агуулгын тоо', err), [] as StatItem[])),
    loadVisitors(),
  ]);
  return { content, visitors };
}

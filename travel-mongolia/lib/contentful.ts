import { createClient } from 'contentful';
import resolveResponse from 'contentful-resolve-response';
import { unstable_cache } from 'next/cache';

import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { isPreviewEnv } from '@/lib/navigation';

// Агуулгын эх үүсвэр (2026-11-12, docs/plan/payload-migration.md):
//   CMS_SOURCE=contentful (анхдагч, production өнөөдөр) | payload (Payload CMS, Local API) | snapshot (локал экспорт)
// Гурвуулаа Contentful CDA-ийн «withoutLinkResolution» хэлбэрийн хариу буцаадаг тул доорх кэш, resolveResponse,
// бүх lib/*.ts, хуудсууд өөрчлөгдөхгүй. Шилжилт = орчны хувьсагч солих; буцаах = буцааж солих.
export const CMS_SOURCE = (process.env.CMS_SOURCE || 'contentful') as 'contentful' | 'payload' | 'snapshot';

// Preview орчинд (Vercel preview, local) ноорог хувилбарыг харуулна: Contentful-д CONTENTFUL_PREVIEW_ACCESS_TOKEN
// байвал Preview API, Payload/snapshot-д draft хувилбар (CMS_PREVIEW_DRAFTS=0 бол унтраана).
// Production үргэлж зөвхөн нийтлэгдсэн контент.
export const contentfulPreview =
  isPreviewEnv() &&
  (CMS_SOURCE === 'contentful' ? !!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN : process.env.CMS_PREVIEW_DRAFTS !== '0');

// Contentful client-ийг анх хэрэгтэй үед үүсгэнэ (Payload/snapshot горимд Contentful-ийн түлхүүр шаардлагагүй)
let raw: ReturnType<typeof createClient> | null = null;
function contentfulClient() {
  if (!raw) {
    raw = createClient({
      space: process.env.CONTENTFUL_SPACE_ID as string,
      accessToken: (contentfulPreview
        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
        : process.env.CONTENTFUL_ACCESS_TOKEN) as string,
      host: contentfulPreview ? 'preview.contentful.com' : 'cdn.contentful.com',
    });
  }
  return raw;
}

// Contentful-ийн хүсэлтийг Next.js-ийн Data Cache-д хадгална (2026-10-21, API хязгаар 100K/сар хэтэрсэн).
// SDK нь axios ашигладаг тул fetch cache-д ордоггүй байсан: хуудас бүр дахин үүсэх бүрт 2–10 хүсэлт явдаг байв.
// - Түлхүүр = эх үүсвэр + хэл + query. Хариуг холбоосгүй (withoutLinkResolution) хадгалж, буцаахдаа SDK-тай адил
//   resolveResponse-оор холбоно (холбоос тойрог үүсгэж болох тул JSON-д хадгалах боломжгүй).
// - Хугацаа 7 хоног. Нийтлэхэд webhook (/api/revalidate) эсвэл Payload-ийн hook (payload/hooks.ts) тухайн төрлийн
//   `contentful:<type>` tag-ийг шууд хүчингүй болгоно.
// - Vercel-ийн Data Cache deploy хооронд хадгалагддаг тул шинэ deploy бүх хуудсыг дахин татахгүй.
export const CONTENTFUL_TAG = 'contentful';
// Content type-аар нь tag (2026-11-06, Vercel CPU): нийтлэхэд зөвхөн тухайн төрлийг (болон түүнийг холбоосоор агуулдаг
// төрлүүдийг, lib/revalidateEntry.ts) хүчингүй болгоно. Ерөнхий tag бүх хуудсыг (~3,000) нэг дор хуучирсан болгож
// bot-ууд бүгдийг дахин render хийлгэдэг байв. content_type-гүй query 'contentful:any'-д орж, нийтлэл бүрт шинэчлэгдэнэ.
export const contentfulTypeTag = (type?: string) => `contentful:${type || 'any'}`;
const DATA_TTL = 7 * 24 * 60 * 60;

// Агуулгын эх үүсвэр ажиллахгүй (Contentful: сүлжээ, 401/403/429/5xx, хязгаар хэтэрсэн; Payload: DB холболт)
// үеийн алдаа. Дуудагч catch-д залгилгүй rethrowOutage()-оор дамжуулна: ISR дахин үүсэхэд алдаа гарвал Next.js өмнөх
// сайн хуудсаа үзүүлсээр байна (хоосон жагсаалт, 404-ийг кэшлэхгүй). 400/404/422 (буруу query, төрөл үүсээгүй) бол
// өмнөх шигээ залгина.
export class ContentfulOutageError extends Error {
  constructor(public status: number | undefined, cause: unknown) {
    super(`Агуулгын эх үүсвэр ажиллахгүй байна (${status ?? 'сүлжээ'})`, { cause });
    this.name = 'ContentfulOutageError';
  }
}

function statusOf(err: any): number | undefined {
  try {
    const s = JSON.parse(err?.message || '').status;
    return typeof s === 'number' ? s : undefined;
  } catch {
    return undefined;
  }
}

export function rethrowOutage(err: unknown): void {
  if (err instanceof ContentfulOutageError) throw err;
}

type Query = Record<string, any>;

async function fetchRaw(query: Query, locale: string) {
  if (CMS_SOURCE === 'payload') {
    try {
      const { payloadGetEntries } = await import('@/lib/cms/payloadSource');
      return JSON.parse(JSON.stringify(await payloadGetEntries(query, { locale, draft: contentfulPreview })));
    } catch (err) {
      throw new ContentfulOutageError(undefined, err);
    }
  }
  if (CMS_SOURCE === 'snapshot') {
    const { snapshotGetEntries } = await import('@/lib/cms/snapshotSource');
    return snapshotGetEntries(query, { locale, draft: contentfulPreview });
  }
  try {
    // Contentful горимд хэл үргэлж mn (Contentful-д орчуулга нийтлэх publishedLocales байхгүй тул /en/... хуудас 404)
    return JSON.parse(JSON.stringify(await contentfulClient().withoutLinkResolution.getEntries(query)));
  } catch (err) {
    const status = statusOf(err);
    if (status === 400 || status === 404 || status === 422) throw err;
    throw new ContentfulOutageError(status, err);
  }
}

async function getEntries(query: Query = {}): Promise<any> {
  // Хуудасны хэл (/en/... хуудас setRequestLocale('en') дуудсан бол), эс бөгөөс mn
  const locale = CMS_SOURCE === 'contentful' ? 'mn' : (query.locale as string) || getRequestLocale();
  // Contentful горимд кэшийн түлхүүр хуучнаараа (deploy-ийн дараа Data Cache хоосрохгүй)
  const keyParts = CMS_SOURCE === 'contentful' ? ['contentful', 'cda'] : ['contentful', CMS_SOURCE, locale];
  // Preview: ноорог засвар webhook/hook-гүй тул кэшлэхгүй (preview-д цөөн хүн ордог)
  const data = contentfulPreview
    ? await fetchRaw(query, locale)
    : await unstable_cache(() => fetchRaw(query, locale), [...keyParts, JSON.stringify(query)], {
        tags: [CONTENTFUL_TAG, contentfulTypeTag(query.content_type)],
        revalidate: DATA_TTL,
      })();
  return { ...data, items: resolveResponse(data, { removeUnresolved: false, itemEntryPoints: ['fields'] }) };
}

// Монголын бус (Шангри-Ла) зургийг 2026-10-21-нд Contentful-ийн entry-үүдээс салгаж нийтэлсэн тул
// хариунаас хасах шүүлтүүр (stripNonMongolianAssets) шаардлагагүй болсон.
// Кодонд зөвхөн getEntries ашигладаг.
export const client = { getEntries } as unknown as Pick<ReturnType<typeof createClient>, 'getEntries'>;

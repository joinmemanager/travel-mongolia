import { createClient } from 'contentful';
import resolveResponse from 'contentful-resolve-response';
import { unstable_cache } from 'next/cache';

import { isPreviewEnv } from '@/lib/navigation';

// Preview орчинд (Vercel preview, local) CONTENTFUL_PREVIEW_ACCESS_TOKEN байвал Preview API-аар
// Draft entry-г ч харуулна. Production үргэлж Delivery API (зөвхөн нийтлэгдсэн контент).
export const contentfulPreview = isPreviewEnv() && !!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

const raw = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: (contentfulPreview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN) as string,
  host: contentfulPreview ? 'preview.contentful.com' : 'cdn.contentful.com',
});

// Contentful-ийн хүсэлтийг Next.js-ийн Data Cache-д хадгална (2026-10-21, API хязгаар 100K/сар хэтэрсэн).
// SDK нь axios ашигладаг тул fetch cache-д ордоггүй байсан: хуудас бүр дахин үүсэх бүрт 2–10 хүсэлт явдаг байв.
// - Түлхүүр = query (+ CDA/CPA). Хариуг холбоосгүй (withoutLinkResolution) хадгалж, буцаахдаа SDK-тай адил
//   resolveResponse-оор холбоно (холбоос тойрог үүсгэж болох тул JSON-д хадгалах боломжгүй).
// - Хугацаа 7 хоног. Нийтлэхэд webhook (/api/revalidate) `contentful` tag-ийг шууд хүчингүй болгоно.
// - Vercel-ийн Data Cache deploy хооронд хадгалагддаг тул шинэ deploy бүх хуудсыг Contentful-аас дахин татахгүй.
export const CONTENTFUL_TAG = 'contentful';
const DATA_TTL = 7 * 24 * 60 * 60;

// Contentful ажиллахгүй (сүлжээ, 401/403/429/5xx, хязгаар хэтэрсэн) үеийн алдаа. Дуудагч catch-д залгилгүй
// rethrowOutage()-оор дамжуулна: ISR дахин үүсэхэд алдаа гарвал Next.js өмнөх сайн хуудсаа үзүүлсээр байна
// (хоосон жагсаалт, 404-ийг кэшлэхгүй). 400/404/422 (буруу query, төрөл үүсээгүй) бол өмнөх шигээ залгина.
export class ContentfulOutageError extends Error {
  constructor(public status: number | undefined, cause: unknown) {
    super(`Contentful ажиллахгүй байна (${status ?? 'сүлжээ'})`, { cause });
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

async function fetchRaw(query: Query) {
  try {
    // toPlainObject-той объект → JSON-д хадгалагдах энгийн объект
    return JSON.parse(JSON.stringify(await raw.withoutLinkResolution.getEntries(query)));
  } catch (err) {
    const status = statusOf(err);
    if (status === 400 || status === 404 || status === 422) throw err;
    throw new ContentfulOutageError(status, err);
  }
}

async function getEntries(query: Query = {}): Promise<any> {
  // Preview (CPA): Draft засвар webhook-гүй тул кэшлэхгүй (preview-д цөөн хүн ордог)
  const data = contentfulPreview
    ? await fetchRaw(query)
    : await unstable_cache(() => fetchRaw(query), ['contentful', 'cda', JSON.stringify(query)], {
        tags: [CONTENTFUL_TAG],
        revalidate: DATA_TTL,
      })();
  return { ...data, items: resolveResponse(data, { removeUnresolved: false, itemEntryPoints: ['fields'] }) };
}

// Монголын бус (Шангри-Ла) зургийг 2026-10-21-нд Contentful-ийн entry-үүдээс салгаж нийтэлсэн тул
// хариунаас хасах шүүлтүүр (stripNonMongolianAssets) шаардлагагүй болсон.
// Кодонд зөвхөн getEntries ашигладаг.
export const client = { getEntries } as unknown as Pick<typeof raw, 'getEntries'>;

import { timingSafeEqual } from 'crypto';
import { revalidatePath, revalidateTag } from 'next/cache';
import { after } from 'next/server';

import { CONTENTFUL_TAG, contentfulTypeTag } from '@/lib/contentful';
import { entryUrls, submitIndexNow } from '@/lib/indexNow';
import { revalidateEntry } from '@/lib/revalidateEntry';
import { SHORTS_BASE, SHORTS_LANGS, SHORTS_TAG } from '@/lib/shorts';
import { checkShortsApi } from '@/lib/shortsData';

// Contentful webhook (Entry.publish / Entry.unpublish) → тухайн entry-ийн хуудсыг шууд шинэчилнэ.
// Хуудсууд 7 хоногт нэг л дахин үүсдэг (revalidate = 604800), Contentful-ын хариу Data Cache-д 7 хоног
// хадгалагддаг (lib/contentful.ts) тул Contentful-ын өөрчлөлт энэ замаар л даруй харагдана.
// Холбогдсон entry (зураг, сум, ангилал) олон query-д ордог тул Data Cache-ийг бүхэлд нь (`contentful` tag)
// хүчингүй болгоно: хуудас бүр дахин үүсэх үедээ л Contentful руу хүсэлт явуулна. Webhook-ийг scripts/tic/setup-revalidate.js тохируулсан:
//   POST https://www.travelhubmongolia.com/api/revalidate
//   header x-revalidate-secret: CONTENTFUL_REVALIDATE_SECRET
// revalidatePath нь хуудсыг зөвхөн "хуучирсан" гэж тэмдэглэнэ, дараагийн зочлолтоор шинээр үүснэ
// (олон хуудсыг нэг дор дахин үүсгэж API дуудлага үрэхгүй).

function validSecret(given: string | null): boolean {
  const expected = process.env.CONTENTFUL_REVALIDATE_SECRET;
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Contentful-ын webhook-ийн талбар locale-аар ирнэ: { slug: { mn: '...' } }
function fieldValue(fields: any, id: string): any {
  const v = fields?.[id];
  if (v && typeof v === 'object' && !Array.isArray(v)) return v.mn ?? Object.values(v)[0];
  return v;
}

export async function POST(req: Request) {
  if (!validSecret(req.headers.get('x-revalidate-secret'))) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  // Богино бичлэгийг гараар шинэчлэх (docs/shorts.md): POST /api/revalidate?tag=shorts, ижил secret header.
  // YouTube API ажиллахгүй үед кэшийг хөндөхгүй (сайн кэш устаж fallback гарахаас сэргийлнэ).
  if (new URL(req.url).searchParams.get('tag') === SHORTS_TAG) {
    const apiError = await checkShortsApi();
    if (apiError) {
      console.error(`Shorts revalidate: YouTube API алдаа (${apiError}), кэш хэвээр`);
      return Response.json({ ok: false, tag: SHORTS_TAG, error: apiError }, { status: 503 });
    }
    revalidateTag(SHORTS_TAG, { expire: 0 });
    // Бусад хэлний JSON (app/api/shorts/[lang])
    const langPaths = SHORTS_LANGS.filter((l) => l !== 'mn').map((l) => `/api/shorts/${l}`);
    const paths = ['/', SHORTS_BASE, '/sitemap.xml', ...langPaths];
    revalidatePath('/');
    revalidatePath(SHORTS_BASE, 'layout');
    revalidatePath('/sitemap.xml');
    langPaths.forEach((p) => revalidatePath(p));
    return Response.json({ ok: true, tag: SHORTS_TAG, revalidated: paths });
  }

  let payload: any;
  try {
    payload = JSON.parse(await req.text());
  } catch {
    return Response.json({ ok: false, error: 'invalid json' }, { status: 400 });
  }

  const sys = payload?.sys || {};
  const contentType: string = sys.contentType?.sys?.id || '';
  const slug = fieldValue(payload?.fields, 'slug');
  const key = typeof slug === 'string' && slug.trim() ? slug.trim() : sys.type === 'Entry' && sys.id ? sys.id : null;

  const { tags, revalidated: done } = revalidateEntry(contentType, key);

  // IndexNow: production дээр entry-ийн хуудсыг хайлтын системд мэдэгдэнэ (хариуг хүлээлгэхгүй)
  const urls = process.env.VERCEL_ENV === 'production' ? entryUrls(contentType, payload?.fields, key) : [];
  if (urls.length) after(() => submitIndexNow(urls).then((status) => console.log('IndexNow', status, urls.join(' '))));

  return Response.json({ ok: true, contentType, id: sys.id, tags, revalidated: done, indexNow: urls });
}

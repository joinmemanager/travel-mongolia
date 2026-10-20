import { timingSafeEqual } from 'crypto';
import { revalidatePath } from 'next/cache';
import { after } from 'next/server';

import { entryUrls, submitIndexNow } from '@/lib/indexNow';

// Contentful webhook (Entry.publish / Entry.unpublish) → тухайн entry-ийн хуудсыг шууд шинэчилнэ.
// Хуудсууд өдөрт нэг л дахин үүсдэг (revalidate = 86400) тул Contentful-ын өөрчлөлт энэ замаар л
// даруй харагдана. Webhook-ийг scripts/tic/setup-revalidate.js тохируулсан:
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

// Төрөл бүрийн хуудсууд. key = slug (байхгүй бол entry ID). key тодорхойгүй (Unpublish-ийн
// payload-д талбар байдаггүй) бол тухайн route-ийн бүх хуудсыг тэмдэглэнэ.
type Target = { path: string; type?: 'page' | 'layout' };

function targetsFor(contentType: string, key: string | null): Target[] | null {
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
      return [one(`/recommendation/${key}`, '/recommendation/[id]'), { path: '/' }];
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
      return [one(`/stories/${key}`, '/stories/[slug]'), { path: '/stories' }];
    case 'localProvider':
      return [one(`/local/${key}`, '/local/[slug]'), { path: '/local' }];
    case 'communityExperience':
      return [one(`/local/experiences/${key}`, '/local/experiences/[slug]'), { path: '/local' }];
    case 'localProduct':
      return [{ path: '/local/products' }, { path: '/local' }];
    default:
      // visitorGuidance, faqItem г.м. олон хуудсанд холбогддог төрөл: бүх сайтыг тэмдэглэнэ
      return null;
  }
}

export async function POST(req: Request) {
  if (!validSecret(req.headers.get('x-revalidate-secret'))) {
    return Response.json({ ok: false, error: 'unauthorized' }, { status: 401 });
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

  const targets = targetsFor(contentType, key);
  const done: string[] = [];
  if (!targets) {
    revalidatePath('/', 'layout');
    done.push('/ (layout)');
  } else {
    for (const t of [...targets, { path: '/impact' }, { path: '/sitemap.xml' }]) {
      if (t.type) revalidatePath(t.path, t.type);
      else revalidatePath(t.path);
      done.push(t.type ? `${t.path} (${t.type})` : t.path);
    }
  }

  // IndexNow: production дээр entry-ийн хуудсыг хайлтын системд мэдэгдэнэ (хариуг хүлээлгэхгүй)
  const urls = process.env.VERCEL_ENV === 'production' ? entryUrls(contentType, payload?.fields, key) : [];
  if (urls.length) after(() => submitIndexNow(urls).then((status) => console.log('IndexNow', status, urls.join(' '))));

  return Response.json({ ok: true, contentType, id: sys.id, revalidated: done, indexNow: urls });
}

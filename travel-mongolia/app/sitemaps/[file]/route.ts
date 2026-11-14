import { CMS_SOURCE, client, rethrowOutage } from '@/lib/contentful';
import { localeByCode, localeByPrefix, localizedPath } from '@/lib/i18n/locales';
import { SITE_URL } from '@/lib/seo';

// Хэл бүрийн sitemap: /sitemaps/en.xml, /sitemaps/zh.xml … (robots.txt-д жагсаасан). Зөвхөн тухайн хэлээр
// НИЙТЛЭГДСЭН (publishedLocales) хуудсууд, hreflang-ийн хамт. Үндсэн /sitemap.xml (монгол) өөрчлөгдөөгүй.
// Одоогоор [lang] хувилбартай route: сумын хуудас (lib/i18n/locales.ts LOCALIZED_ROUTES). Route нэмэхэд энд нэмнэ.
export const revalidate = 86400;

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const m = (await params).file.match(/^([a-z]{2})\.xml$/);
  const l = m && localeByPrefix(m[1]);
  if (!l) return new Response('Not found', { status: 404 });

  const urls: { path: string; locales: string[]; lastmod?: string }[] = [];
  // Contentful горимд publishedLocales байхгүй (бүх хэлний sitemap хоосон) — Contentful руу хүсэлт явуулахгүй
  if (CMS_SOURCE !== 'contentful') try {
    for (let skip = 0; ; skip += 250) {
      const res: any = await client.getEntries({
        content_type: 'soum',
        'fields.publishedLocales[in]': l.code,
        'fields.ownPage': true,
        select: ['sys.id', 'sys.updatedAt', 'fields.slug', 'fields.province', 'fields.publishedLocales'],
        include: 1,
        limit: 250,
        skip,
        locale: l.code,
      } as any);
      for (const e of res.items) {
        const prov = e.fields.province?.fields?.slug;
        if (prov) urls.push({ path: `/province/${prov}/${e.fields.slug}`, locales: e.fields.publishedLocales || [], lastmod: e.sys.updatedAt });
      }
      if (skip + 250 >= res.total) break;
    }
  } catch (err) {
    rethrowOutage(err);
    console.error(`Sitemap ${l.code}:`, err);
  }

  const body = urls
    .map((u) => {
      const alts = [
        `<xhtml:link rel="alternate" hreflang="mn" href="${esc(SITE_URL + u.path)}"/>`,
        ...u.locales.map((c) => `<xhtml:link rel="alternate" hreflang="${localeByCode(c)?.hreflang || c}" href="${esc(SITE_URL + localizedPath(u.path, c))}"/>`),
      ].join('');
      return `<url><loc>${esc(SITE_URL + localizedPath(u.path, l.code))}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}${alts}</url>`;
    })
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${body}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } }
  );
}

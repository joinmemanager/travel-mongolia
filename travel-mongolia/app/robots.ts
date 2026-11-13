import type { MetadataRoute } from 'next';

import { CMS_SOURCE } from '@/lib/contentful';
import { URL_PREFIXES } from '@/lib/i18n/locales';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /admin: Payload CMS-ийн удирдлага (app/(payload))
      disallow: ['/api/', '/admin'],
    },
    // Хэлний sitemap-ууд зөвхөн Payload горимд (Contentful-д орчуулга нийтлэгддэггүй тул хоосон байх байсан)
    sitemap: [`${SITE_URL}/sitemap.xml`, ...(CMS_SOURCE === 'payload' ? URL_PREFIXES.map((p) => `${SITE_URL}/sitemaps/${p}.xml`) : [])],
  };
}

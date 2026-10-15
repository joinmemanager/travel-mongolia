import { createClient } from 'contentful';

import { isPreviewEnv } from '@/lib/navigation';

// Preview орчинд (Vercel preview, local) CONTENTFUL_PREVIEW_ACCESS_TOKEN байвал Preview API-аар
// Draft entry-г ч харуулна. Production үргэлж Delivery API (зөвхөн нийтлэгдсэн контент).
export const contentfulPreview = isPreviewEnv() && !!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID as string,
  accessToken: (contentfulPreview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN) as string,
  host: contentfulPreview ? 'preview.contentful.com' : 'cdn.contentful.com',
});

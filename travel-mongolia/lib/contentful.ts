import { createClient } from 'contentful';

import { NON_MONGOLIAN_ASSETS } from '@/lib/images';
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

// Монголын бус гэж бүртгэгдсэн asset-ийн (lib/images.ts) файлыг хариунаас хасна: entry-ийн зураг,
// rich text доторх зураг аль алинд нь зураггүй болно. Задалсан холбоосууд нэг объектыг хуваалцдаг
// тул asset бүрийг нэг удаа өөрчлөхөд хангалттай.
function stripNonMongolianAssets<T>(data: T): T {
  const seen = new WeakSet<object>();
  const walk = (node: any) => {
    if (!node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);
    if (node.sys?.type === 'Asset' && NON_MONGOLIAN_ASSETS[node.sys.id]) {
      delete node.fields;
      return;
    }
    for (const v of Object.values(node)) walk(v);
  };
  walk(data);
  return data;
}

export const client = {
  ...raw,
  getEntries: (async (query?: any) => stripNonMongolianAssets(await raw.getEntries(query))) as typeof raw.getEntries,
};

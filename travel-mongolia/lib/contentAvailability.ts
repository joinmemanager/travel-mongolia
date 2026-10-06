import { cache } from 'react';

import { client } from '@/lib/contentful';
import { SAMPLE_PREFIX } from '@/lib/localContent';
import { type ContentSource, isPreviewEnv } from '@/lib/navigation';
import { getStories } from '@/lib/stories';

// Contentful-аас уншдаг цэсний зүйлс, хэсгүүдийн автомат дүрэм:
// production дээр "[ЖИШЭЭ]"-ээс бусад entry байхгүй эх сурвалж хоосон гэж тооцогдож, нуугдана.
// Анхны бодит entry нийтлэгдэхэд 5 минутын дотор автоматаар харагдана (доорх cache).
// Preview дээр бүх зүйл харагдана (хоосон Set).

async function titles(contentType: string, select: string): Promise<any[]> {
  try {
    const res = await client.getEntries({ content_type: contentType, limit: 1000, select } as any);
    return (res.items as any[]).filter((e) => {
      const t = String(e.fields?.title || e.fields?.name || '');
      return t && !t.startsWith(SAMPLE_PREFIX);
    });
  } catch {
    // Төрөл үүсээгүй эсвэл Contentful хүрэхгүй бол хоосон
    return [];
  }
}

// app/layout.tsx нь хүсэлт бүрт ажилладаг тул Contentful-ыг 5 минутад нэг л удаа асууна
const TTL_MS = 5 * 60 * 1000;
let memo: { at: number; value: Set<ContentSource> } | null = null;

export const getEmptySources = cache(async (): Promise<Set<ContentSource>> => {
  if (isPreviewEnv()) return new Set();
  if (memo && Date.now() - memo.at < TTL_MS) return memo.value;
  const empty = new Set<ContentSource>();

  const [providers, experiences, products, stories] = await Promise.all([
    titles('localProvider', 'fields.name,fields.providerType'),
    titles('communityExperience', 'fields.title'),
    titles('localProduct', 'fields.name'),
    getStories(),
  ]);

  const hasProvider = (type: string) => providers.some((p) => p.fields?.providerType === type);
  if (experiences.length === 0) empty.add('local:experiences');
  if (!hasProvider('guide')) empty.add('local:guide');
  if (!hasProvider('herder-family')) empty.add('local:herder-family');
  if (!hasProvider('artisan')) empty.add('local:artisan');
  if (!hasProvider('food')) empty.add('local:food');
  if (products.length === 0) empty.add('local:products');
  // getStories нь production дээр "[ЖИШЭЭ]" нийтлэлийг аль хэдийн хасдаг
  if (!stories.some((s) => s.category === 'photo-video')) empty.add('stories:photo-video');
  memo = { at: Date.now(), value: empty };
  return empty;
});

import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionBeforeChangeHook } from 'payload';

// Шинэ doc-д Contentful-ийн sys.createdAt-ийн оронд үүсгэсэн огноог (эрэмбэ '-sys.createdAt' ажиллахын тулд)
export const stampCreatedAt: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' && !data.cfCreatedAt) data.cfCreatedAt = new Date().toISOString();
  return data;
};

// Нийтлэх / нийтлэлтээс буулгахад сайтын кэш, хуудсыг шинэчилнэ (Contentful webhook-тэй ижил: lib/revalidateEntry.ts).
// Импорт (context.skipRevalidate) болон Next-ээс гадуурх скриптэд (revalidateTag ажиллахгүй) алгасна.
async function revalidate(collection: string, doc: any) {
  try {
    const { revalidateEntry } = await import('../lib/revalidateEntry');
    revalidateEntry(collection, doc?.slug || doc?.contentfulId || (doc?.id != null ? String(doc.id) : null));
  } catch (err) {
    if (process.env.NEXT_RUNTIME) console.error('Payload revalidate алдаа', collection, err);
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = async ({ collection, doc, previousDoc, context }) => {
  if (context?.skipRevalidate) return doc;
  const wasOrIsPublished = doc?._status === 'published' || previousDoc?._status === 'published';
  if (wasOrIsPublished) await revalidate(collection.slug, doc);
  return doc;
};

export const revalidateAfterDelete: CollectionAfterDeleteHook = async ({ collection, doc, context }) => {
  if (!context?.skipRevalidate) await revalidate(collection.slug, doc);
  return doc;
};

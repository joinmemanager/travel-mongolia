// Орчуулгыг нийтлэх (admin-д «Орчуулга нийтлэгдсэн хэлүүд»-д хэлийг сонгоод Publish дарахтай ижил), локал туршилтад.
//   node scripts/payload/cli.mjs run scripts/payload/publish-translation.ts <collection> <contentfulId,...> [--locale en] [--unpublish]
// Анхаар: Payload-д нийтлэх нь тухайн doc-ийн хамгийн сүүлийн хувилбарыг (монгол ноорог байвал түүнийг ч) нийтэлнэ.
import { getPayload } from 'payload';

import config from '@payload-config';

const [collection, idsArg] = process.argv.slice(2);
const args = process.argv.slice(2);
const locale = args.includes('--locale') ? args[args.indexOf('--locale') + 1] : 'en';
const unpublish = args.includes('--unpublish');
if (!collection || !idsArg) throw new Error('collection ба contentfulId-ууд');

const payload = await getPayload({ config });
for (const cfId of idsArg.split(',')) {
  const doc = (await payload.find({ collection: collection as any, where: { contentfulId: { equals: cfId } }, draft: true, depth: 0, limit: 1, overrideAccess: true })).docs[0] as any;
  if (!doc) {
    console.log(`${cfId}: олдсонгүй`);
    continue;
  }
  const set = new Set<string>(doc.publishedLocales || []);
  if (unpublish) set.delete(locale);
  else set.add(locale);
  await payload.update({
    collection: collection as any,
    id: doc.id,
    data: { publishedLocales: [...set], _status: 'published' } as any,
    overrideAccess: true,
  });
  console.log(`${cfId}: publishedLocales = [${[...set].join(', ')}]`);
}
process.exit(0);

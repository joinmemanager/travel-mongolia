import { client, rethrowOutage } from '@/lib/contentful';

// Нэг төрлийн бүх entry-г хуудаслан татна: TIC-ийн мэдээ (body-тэй 600+) нэг хариунд багтахгүй
// (Contentful-ийн хариуны хэмжээний хязгаар). app/sitemap.ts болон lib/siteStats.ts хоёулаа ашиглана:
// query нь ижил тул lib/contentful.ts-ийн Data Cache-ийг хуваалцаж, Contentful руу нэмэлт хүсэлт явахгүй.
// Алдаа гарвал хоосон жагсаалт (Contentful унасан бол ContentfulOutageError-ийг дамжуулна).
export async function contentfulEntries(contentType: string, query: Record<string, unknown> = {}) {
  try {
    const items: any[] = [];
    for (let skip = 0; ; skip += 250) {
      const res = await client.getEntries({ content_type: contentType, limit: 250, skip, ...query } as any);
      items.push(...res.items);
      if (skip + 250 >= res.total) break;
    }
    return items;
  } catch (err) {
    rethrowOutage(err);
    console.error(`Contentful: ${contentType} татахад алдаа гарлаа`, err);
    return [];
  }
}

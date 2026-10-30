import { SHORTS_LANGS } from '@/lib/shorts';
import { getShortsTopics } from '@/lib/shortsData';

// Монголоос бусад хэлний богино бичлэг (lib/shortsData.ts, сонголт: тухайн хэл → англи → монгол).
// Сайтын хэл googtrans cookie-гоор солигддог (URL-гүй) тул сервер монгол хувилбарыг render хийж,
// components/shorts/useShortsLang.ts хэл солигдсон үед эндээс татна. Хуудсуудын адил цаг тутам
// дахин үүснэ, YouTube-ийн хүсэлтүүд fetch кэшээс (24 цаг) тул квот нэмэгдэхгүй.

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return SHORTS_LANGS.filter((l) => l !== 'mn').map((lang) => ({ lang }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const requested = (await params).lang;
  const lang = SHORTS_LANGS.find((l) => l === requested && l !== 'mn');
  if (!lang) return Response.json({ error: 'unknown lang' }, { status: 404 });
  const topics = await getShortsTopics(lang);
  return Response.json({
    lang,
    topics: topics.map((t) => ({
      slug: t.slug,
      videos: t.videos.map(({ id, title, lang }) => ({ id, title, lang })),
    })),
  });
}

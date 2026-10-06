import { getStoryEntries } from '@/lib/localContent';
import { richTextToPlain, truncate } from '@/lib/seo';

// "Түүх & өв" hub-ийн (/stories, ia-plan.md C10, 5в) өгөгдөл.
//
// НООРОГ: одоохондоо сайтад байгаа хуудсуудыг түүхийн карт болгон холбосон.
// 6-р үед Contentful-ын Story төрлөөс уншина. StoryCard-ийн талбарууд тэр төрлийн
// талбаруудтай (title, excerpt, slug -> href, category, coverImage, publishDate, featured)
// нийцэхээр хийгдсэн тул зөвхөн getStories()-г солиход хангалттай.

export type StoryCategoryId =
  | 'culture'
  | 'nature'
  | 'nomadic'
  | 'food'
  | 'people'
  | 'photo-video';

export interface StoryCategory {
  id: StoryCategoryId;
  mn: string;
  en: string;
}

export interface StoryCard {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  category: StoryCategoryId;
  imageUrl?: string;
  // ISO огноо. Байхгүй бол "Сүүлийн түүхүүд" хэсэгт тодорхойлсон дарааллаар гарна
  publishedAt?: string;
  featured?: boolean;
}

export const STORY_CATEGORIES: StoryCategory[] = [
  { id: 'culture', mn: 'Соёл, өв', en: 'Culture & Heritage' },
  { id: 'nature', mn: 'Байгаль', en: 'Nature' },
  { id: 'nomadic', mn: 'Нүүдэлчдийн амьдрал', en: 'Nomadic Life' },
  { id: 'food', mn: 'Хоол', en: 'Food' },
  { id: 'people', mn: 'Хүмүүс', en: 'People' },
  { id: 'photo-video', mn: 'Фото/видео түүх', en: 'Photo & Video Stories' },
];

// Одоо байгаа хуудсууд (гарчиг, тайлбар нь lib/pageMeta.ts-тэй ижил)
const EXISTING_CONTENT: StoryCard[] = [
  {
    id: 'heritage',
    title: 'Монголын түүхэн өв, дурсгалт газрууд',
    excerpt: 'Хийд, эртний хот, хөшөө дурсгал, хадны зургийг ангиллаар нь үзээрэй.',
    href: '/destination/heritage',
    category: 'culture',
    featured: true,
  },
  {
    id: 'hidden',
    title: 'Нууц үзэсгэлэнт газрууд',
    excerpt: 'Жуулчид төдийлөн очдоггүй Монголын нууц, үзэсгэлэнт газрууд.',
    href: '/inspiration/hidden',
    category: 'nature',
    featured: true,
  },
  {
    id: 'top-lists',
    title: 'Шилдэг жагсаалтууд',
    excerpt: 'Монголд заавал очих газрууд, заавал турших туршлага, шилдэг нуур, уулс.',
    href: '/inspiration/top-lists',
    category: 'nature',
  },
  {
    id: 'culture',
    title: 'Монголын соёл ба өв',
    excerpt: 'Уламжлалт соёл, урлаг, хөөмий, морин хуур, бичиг үсэг, ЮНЕСКО-ийн өв.',
    href: '/about/culture',
    category: 'culture',
  },
  {
    id: 'traditions',
    title: 'Ёс заншил, уламжлал, шүтлэг',
    excerpt: 'Цагаан сар, овоо тахих, бөө мөргөл, буддын шашин, цээрлэх ёс.',
    href: '/about/traditions',
    category: 'culture',
  },
  {
    id: 'nature',
    title: 'Монголын байгаль, газарзүй, амьтан',
    excerpt: 'Говь, тал хээр, тайга, Алтайн нуруу, нуур голууд, ховор зэрлэг амьтад.',
    href: '/about/nature',
    category: 'nature',
  },
  {
    id: 'nomadic-life',
    title: 'Нүүдэлчин ахуй амьдрал',
    excerpt: 'Гэр, таван хошуу мал, улирлын нүүдэл, зочломтгой ёс заншил.',
    href: '/about/nomadic-life',
    category: 'nomadic',
  },
  {
    id: 'food',
    title: 'Монгол хоол, ундаа',
    excerpt: 'Цагаан идээ, айраг, боодог, хорхог зэрэг уламжлалт хоол ундаа.',
    href: '/about/food',
    category: 'food',
  },
  {
    id: 'people',
    title: 'Монгол хүн, хэл, үндэстний онцлог',
    excerpt: 'Ястан угсаатнууд, монгол хэл, кирилл болон монгол бичиг.',
    href: '/about/people',
    category: 'people',
  },
];

// Одоо байгаа хуудсууд + Contentful-ын 'story' төрлийн нийтлэлүүд (Б хэсэг).
// Contentful-д нийтлэл байхгүй (эсвэл төрөл үүсээгүй) бол зөвхөн одоо байгаа хуудсууд.
export async function getStories(): Promise<StoryCard[]> {
  const entries = await getStoryEntries();
  const fromContentful: StoryCard[] = entries
    .filter((s) => STORY_CATEGORIES.some((c) => c.id === s.topic))
    .map((s) => ({
      id: `story-${s.id}`,
      title: s.title,
      excerpt: truncate(richTextToPlain(s.body), 120),
      href: s.href,
      category: s.topic as StoryCategoryId,
      imageUrl: s.media[0]?.src,
      publishedAt: s.updatedDate || undefined,
    }));
  return [...EXISTING_CONTENT, ...fromContentful];
}

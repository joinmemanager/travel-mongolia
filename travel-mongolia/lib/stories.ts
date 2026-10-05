// "Түүх & өв" hub-ийн (/stories, ia-plan.md C10, 5в) өгөгдөл.
//
// НООРОГ: одоохондоо сайтад байгаа хуудсуудыг түүхийн карт болгон холбосон.
// 6-р үед Contentful-ын Story төрлөөс уншина. StoryCard-ийн талбарууд тэр төрлийн
// талбаруудтай (title, excerpt, slug -> href, category, coverImage, publishDate, featured)
// нийцэхээр хийгдсэн тул зөвхөн getStories()-г солиход хангалттай.

import { IMAGES, type SiteImage } from './images';

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
  // Contentful-ын coverImage-д тохирно (alt тексттэй)
  image?: SiteImage;
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
    id: 'local-stories',
    title: 'Нутгийн хүмүүсийн түүх',
    excerpt: 'Малчид, урлаачид, хөтөч нарын амьдрал, туршлагаас сэдэвлэсэн түүхүүд.',
    href: '/inspiration/stories',
    category: 'people',
  },
  {
    id: 'magazine',
    title: 'Аяллын нийтлэлүүд',
    excerpt: 'Монголын аялал, соёл, байгаль, хүмүүсийн тухай нийтлэл, ярилцлага.',
    href: '/inspiration/magazine',
    category: 'photo-video',
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

// Одоо байгаа хуудсуудын картын зураг (Монголынх нь шалгагдсан, docs/plan/images.md)
const EXISTING_IMAGES: Record<string, SiteImage> = {
  heritage: IMAGES.chinggisStatue,
  hidden: IMAGES.redCliffs,
  'local-stories': IMAGES.herderBoy,
  magazine: IMAGES.gerStars,
  'top-lists': IMAGES.camels,
  culture: IMAGES.gerCamp,
  traditions: IMAGES.lakeGers,
  nature: IMAGES.whiteHorse,
  'nomadic-life': IMAGES.herdSnow,
  food: IMAGES.gerCamp,
  people: IMAGES.eagleHunter,
};

// 6-р үед энд Contentful-ын Story төрлийг татна
export async function getStories(): Promise<StoryCard[]> {
  return EXISTING_CONTENT.map((story) => ({
    ...story,
    image: story.image || EXISTING_IMAGES[story.id],
  }));
}

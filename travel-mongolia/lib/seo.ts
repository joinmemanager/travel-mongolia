import type { Metadata } from 'next';

// Production домэйн. NEXT_PUBLIC_SITE_URL тохируулаагүй үед www домэйнийг ашиглана
// (apex домэйн www руу 308-аар шилждэг тул canonical, sitemap нь www байх ёстой).
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.travelhubmongolia.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Travel Hub Mongolia';

export const DEFAULT_OG_IMAGE = '/hero.jpg';

// Хайлтын үр дүнд харагдах тайлбарыг ~160 тэмдэгтэд багтаана
export function truncate(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
}

// Contentful rich text-ийг энгийн текст болгоно
export function richTextToPlain(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.nodeType === 'text') return node.value || '';
  if (Array.isArray(node.content)) {
    return node.content.map(richTextToPlain).join(' ');
  }
  return '';
}

export const TITLE_MAX = 60;
const BRAND_SUFFIX = ` | ${SITE_NAME}`;

// Хайлтын үр дүнгийн гарчиг ≤60 тэмдэгт: layout-ын « | Travel Hub Mongolia»-тай багтвал загвараар,
// багтахгүй бол брэндгүйгээр (absolute); гарчиг өөрөө урт бол сүүлийн «, …» хэсгүүдийг хасна
// (жишээ нь «Нэр, Аймаг · 2023 он» → «Нэр»), тэгээд ч урт бол үгийн хил дээр тайрна.
export function fitTitle(title: string): Metadata['title'] {
  const len = (s: string) => [...s].length;
  if (len(title) + BRAND_SUFFIX.length <= TITLE_MAX) return title;
  let t = title;
  while (len(t) > TITLE_MAX && t.includes(', ')) t = t.slice(0, t.lastIndexOf(', '));
  return { absolute: len(t) > TITLE_MAX ? truncate(t, TITLE_MAX) : t };
}

// Хуудас бүрийн metadata: title, description, canonical, OG/Twitter
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const images = [{ url: image || DEFAULT_OG_IMAGE }];
  return {
    title: fitTitle(title),
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'mn_MN',
      type: 'website',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

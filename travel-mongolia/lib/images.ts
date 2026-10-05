// Монголынх нь шалгагдсан зургууд (docs/plan/images.md). Зурагтай картад (components/design/ImageCard) хэрэглэнэ.
// Зөвхөн Монголд авсан нь шалгагдсан зургууд. Шинэ зураг нэмэхдээ эх сурвалжийг images.md-д бичнэ.

export interface SiteImage {
  src: string;
  alt: string;
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=2000`;

export const IMAGES = {
  // public/hero.jpg (сайтын анхны hero зураг)
  herderBoy: {
    src: '/hero.jpg',
    alt: 'Ногоон тал нутагт морь унаж, хонь хариулж буй монгол хүү',
  },
  gerCamp: {
    src: unsplash('1575415868394-e3b78f3e9b3f'),
    alt: 'Уулын бэлд, ногоон хөндийд байрлах монгол гэрүүд',
  },
  gerStars: {
    src: unsplash('1535219241072-7d3c28a49a5c'),
    alt: 'Од түгсэн шөнийн тэнгэр ба Сүүн зам доорх монгол гэр',
  },
  whiteHorse: {
    src: unsplash('1630326867210-bf4b2cdd2019'),
    alt: 'Цасан оргилтой уулын бэлд бэлчиж буй цагаан морь, хол гэрүүд',
  },
  chinggisStatue: {
    src: unsplash('1708873395735-dcad0140e3a2'),
    alt: 'Цонжин болдог дахь Чингис хааны морьт хөшөө',
  },
  lakeGers: {
    src: unsplash('1591804860948-cdb450a32b77'),
    alt: 'Нуурын эрэг дээрх хоёр монгол гэр ба бэлчиж буй морьд',
  },
  herdSnow: {
    src: unsplash('1707669904577-2ebc6f95a826'),
    alt: 'Цас орсон уулын бэлд бэлчиж буй хонь, ямааны сүрэг',
  },
  camels: {
    src: unsplash('1571821807771-62cf66ac3f14'),
    alt: 'Элсэн манхан дундуур алхаж буй хоёр бөхт тэмээнүүд',
  },
  eagleHunter: {
    src: unsplash('1742205025290-f8d83fe1bb58'),
    alt: 'Цастай уулсын өмнө морьтой зогсох бүргэдчин',
  },
  redCliffs: {
    src: unsplash('1537212429608-6b5f5449cdf8'),
    alt: 'Говийн улаан шаварлаг хадан цохио, үдшийн гэрэлд',
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof IMAGES;

// Сайтын үндсэн цэс болон footer-ийн холбоосууд нэг дор.
// Нэр, холбоос, бэлэн эсэхийг зөвхөн энд өөрчилнө (docs/plan/ia-plan.md, 5а үе).
//
// ready: false бол хуудас хараахан бэлэн биш:
//   - Preview (VERCEL_ENV !== 'production') дээр "Тун удахгүй" тэмдэгтэй, дарахад юу ч болохгүй.
//   - Production дээр огт харагдахгүй. Нэг ч бэлэн зүйлгүй хэсэг бүхэлдээ нуугдана.

export interface NavItem {
  mn: string;
  en: string;
  href: string;
  ready: boolean;
  // Гадаад сайт: шинэ tab-д нээгдэнэ
  external?: boolean;
  // Dropdown-д зүйлийн доор жижиг холбоосоор харагдах дэд хуудсууд
  children?: NavItem[];
}

// Бэлэн, сайтын доторх энгийн холбоос (дэд холбоосуудад)
const page = (mn: string, en: string, href: string): NavItem => ({
  mn,
  en,
  href,
  ready: true,
});

export interface NavSection {
  id: string;
  mn: string;
  en: string;
  items: NavItem[];
}

const BOOK_NOW_URL =
  'https://joinme.mn?utm_source=travelhubmongolia&utm_medium=referral&utm_campaign=nav';

export const MAIN_NAVIGATION: NavSection[] = [
  {
    id: 'explore',
    mn: 'Монголыг нээ',
    en: 'Explore Mongolia',
    items: [
      {
        mn: 'Монголын тухай', en: 'About Mongolia', href: '/about/at-a-glance', ready: true,
        children: [
          page('Монгол орныг товчхон', 'Mongolia at a Glance', '/about/at-a-glance'),
          page('Монголын түүх', 'History', '/about/history'),
          page('Өнөөгийн Монгол', 'Modern Mongolia', '/about/modern'),
        ],
      },
      {
        mn: 'Зорих газрууд', en: 'Destinations', href: '/destination/region', ready: true,
        children: [
          page('Бүс нутаг, аймгууд', 'Regions & Provinces', '/destination/region'),
          page('Түүхэн өв, дурсгалт газрууд', 'Heritage Sites', '/destination/heritage'),
          page('Байгалийн тогтоц, ландшафт', 'Landscapes', '/destination/landscapes'),
          page('Тусгай хамгаалалттай газрууд', 'Protected Areas', '/destination/protected'),
          page('Дархан цаазат газрууд', 'Strictly Protected Areas', '/destination/strictly-protected'),
          page('Байгалийн цогцолборт газрууд', 'National Parks', '/destination/national-parks'),
          page('Байгалийн нөөц газрууд', 'Nature Reserves', '/destination/nature-reserves'),
          page('Байгалийн дурсгалт газрууд', 'Natural Monuments', '/destination/natural-monuments'),
        ],
      },
      {
        mn: 'Үзэх, хийх зүйлс', en: 'Things to Do', href: '/things-to-do/nature', ready: true,
        children: [
          page('Байгальд аялах', 'Nature & Outdoors', '/things-to-do/nature'),
          page('Адал явдалт аялал', 'Adventure', '/things-to-do/adventure'),
          page('Түүх, соёлын аялал', 'Culture & History', '/things-to-do/culture'),
          page('Хоол, ундааны туршлага', 'Food & Drink', '/things-to-do/food'),
          page('Нүүдэлчин ахуйг мэдрэх', 'Nomadic Experiences', '/things-to-do/nomadic'),
          page('Амралт, рашаан сувилал', 'Wellness', '/things-to-do/wellness'),
          page('Зэрлэг амьтан, шувуу ажиглах', 'Wildlife', '/things-to-do/wildlife'),
          page('Аяллын хэв маягаар', 'Travel Styles', '/inspiration/styles'),
        ],
      },
      {
        // Түр: /stories бэлэн болох хүртэл (ia-plan.md 5в үед /stories руу сольж redirect хийнэ)
        mn: 'Түүхүүд', en: 'Stories', href: '/inspiration/stories', ready: true,
        children: [
          page('Нууц үзэсгэлэнт газрууд', 'Hidden Mongolia', '/inspiration/hidden'),
          page('Шилдэг жагсаалтууд', 'Top Lists', '/inspiration/top-lists'),
        ],
      },
      { mn: 'Арга хэмжээ, баяр наадам', en: 'Events', href: '/things-to-do/events', ready: true },
      { mn: 'Газрын зураг', en: 'Map', href: '/destination/map', ready: true },
    ],
  },
  {
    id: 'plan',
    mn: 'Төлөвлөх & захиалах',
    en: 'Plan & Book',
    items: [
      { mn: 'Аялал төлөвлөгч', en: 'Trip Planner', href: '/planner', ready: true },
      {
        mn: 'Аяллууд', en: 'Tours', href: '/destination/routes', ready: true,
        children: [
          page('Аяллын чиглэлүүд', 'Routes', '/destination/routes'),
          page('Аяллын маршрутууд', 'Itineraries', '/inspiration/itineraries'),
        ],
      },
      { mn: 'Туршлагууд', en: 'Experiences', href: '/local/experiences', ready: false },
      { mn: 'Байр', en: 'Accommodation', href: '/plan/accommodation', ready: true },
      { mn: 'Нутгийн үйлчилгээ', en: 'Local Services', href: '/plan/services', ready: true },
      {
        mn: 'Тээвэр', en: 'Transport', href: '/plan/getting-around', ready: true,
        children: [
          page('Монгол дотор аялах', 'Getting Around', '/plan/getting-around'),
          page('Монголд хэрхэн ирэх вэ', 'Getting to Mongolia', '/plan/getting-to-mongolia'),
        ],
      },
      { mn: 'Захиалах', en: 'Book now', href: BOOK_NOW_URL, ready: true, external: true },
    ],
  },
  {
    id: 'stories',
    mn: 'Түүх & өв',
    en: 'Stories & Heritage',
    items: [
      {
        mn: 'Соёл, өв', en: 'Culture & Heritage', href: '/about/culture', ready: true,
        children: [
          page('Соёл ба өв', 'Culture & Heritage', '/about/culture'),
          page('Ёс заншил, уламжлал', 'Traditions', '/about/traditions'),
        ],
      },
      { mn: 'Байгаль', en: 'Nature', href: '/about/nature', ready: true },
      { mn: 'Нүүдэлчдийн амьдрал', en: 'Nomadic Life', href: '/about/nomadic-life', ready: true },
      { mn: 'Хоол', en: 'Food', href: '/about/food', ready: true },
      { mn: 'Хүмүүс', en: 'People', href: '/about/people', ready: true },
      // Түр: /stories бэлэн болох хүртэл (ia-plan.md 5в үед /stories руу сольж redirect хийнэ)
      { mn: 'Фото/видео түүх', en: 'Photo & Video Stories', href: '/inspiration/magazine', ready: true },
      {
        mn: 'Аялахаас өмнө', en: 'Learn Before You Go', href: '/plan/before-you-travel', ready: true,
        children: [
          page('Аялахаас өмнө мэдэх зүйлс', 'Before You Travel', '/plan/before-you-travel'),
          page('Хэзээ аялах вэ: улирлаар', 'When to Go', '/inspiration/seasons'),
        ],
      },
    ],
  },
  {
    id: 'local',
    mn: 'Нутгийн Монгол',
    en: 'Local Mongolia',
    items: [
      { mn: 'Нутгийн туршлага', en: 'Community Experiences', href: '/local/experiences', ready: false },
      { mn: 'Нутгийн хөтөч', en: 'Local Guides', href: '/local/guides', ready: false },
      { mn: 'Малчин өрх', en: 'Herder Families', href: '/local/herder-families', ready: false },
      { mn: 'Гар урлаач', en: 'Artisans', href: '/local/artisans', ready: false },
      { mn: 'Нутгийн хоол', en: 'Local Food', href: '/local/food', ready: false },
      { mn: 'Нутгийн бүтээгдэхүүн', en: 'Local Products', href: '/local/products', ready: false },
    ],
  },
  {
    id: 'respect',
    mn: 'Хүндэтгэлтэй аялал',
    en: 'Travel with Respect',
    items: [
      { mn: 'Хариуцлагатай аяллын гарын авлага', en: 'Responsible Travel Guide', href: '/respect', ready: false },
      { mn: 'Соёл, ёс заншил', en: 'Culture & Etiquette', href: '/respect/etiquette', ready: false },
      { mn: 'Байгальд ээлтэй аялал', en: 'Nature Guidance', href: '/respect/nature', ready: false },
      { mn: 'Аюулгүй байдал', en: 'Safety', href: '/plan/safety-info', ready: true },
      { mn: 'Хүртээмжтэй аялал', en: 'Accessible Travel', href: '/respect/accessible', ready: false },
    ],
  },
  {
    id: 'impact',
    mn: 'Үр өгөөж & түншлэл',
    en: 'Impact & Partners',
    items: [
      { mn: 'Орон нутгийн үр өгөөж', en: 'Local Impact', href: '/impact', ready: false },
      { mn: 'Түншлэлийн төслүүд', en: 'Partner Projects', href: '/impact/projects', ready: false },
      { mn: 'Аймаг, DMO', en: 'Provinces & DMOs', href: '/impact/provinces', ready: false },
      { mn: 'Аяллын бизнес', en: 'Tourism Businesses', href: '/impact/businesses', ready: false },
      { mn: 'Хандивлагч, хөрөнгө оруулагч', en: 'Donors & Investors', href: '/impact/donors', ready: false },
    ],
  },
];

// Footer-ийн баганууд (лого, сошиал, холбоо барих хэсгээс бусад)
export const FOOTER_NAVIGATION: NavSection[] = [
  {
    id: 'regions',
    mn: 'Бүс нутаг',
    en: 'Regions',
    items: [
      { mn: 'Төв Монгол', en: 'Central Mongolia', href: '/destination/region?region=central', ready: true },
      { mn: 'Хангайн бүс', en: 'Khangai', href: '/destination/region?region=khangai', ready: true },
      { mn: 'Хөвсгөл ба Хойд Монгол', en: 'Khuvsgul & the North', href: '/destination/region?region=khuvsgul-north', ready: true },
      { mn: 'Говийн бүс', en: 'Gobi', href: '/destination/region?region=gobi', ready: true },
      { mn: 'Алтай ба Баруун Монгол', en: 'Altai & the West', href: '/destination/region?region=altai-west', ready: true },
      { mn: 'Зүүн Монгол', en: 'Eastern Mongolia', href: '/destination/region?region=eastern', ready: true },
    ],
  },
  {
    id: 'useful',
    mn: 'Хэрэгцээт мэдээлэл',
    en: 'Useful Information',
    items: [
      { mn: 'Виз & Зорчих нөхцөл', en: 'Visas & Entry', href: '/plan/before-you-travel#visa', ready: true },
      { mn: 'Цаг агаар ба улирал', en: 'Weather & Seasons', href: '/inspiration/seasons', ready: true },
      { mn: 'Тээвэр, машин түрээс', en: 'Transport & Car Rental', href: '/plan/getting-around', ready: true },
      { mn: 'Аяллын аюулгүй байдал', en: 'Travel Safety', href: '/plan/safety-info', ready: true },
    ],
  },
];

// Footer-ийн доод мөрийн холбоосууд
export const FOOTER_LEGAL: NavItem[] = [
  { mn: 'Нууцлалын бодлого', en: 'Privacy Policy', href: '/privacy', ready: false },
  { mn: 'Үйлчилгээний нөхцөл', en: 'Terms of Service', href: '/terms', ready: false },
  { mn: 'Холбоо барих', en: 'Contact', href: 'mailto:contact@joinme.mn', ready: true },
];

// Production дээр бэлэн биш зүйлсийг хасна. Серверт дуудна (VERCEL_ENV нь client-д байхгүй).
export function showUnreadyNavItems(): boolean {
  return process.env.VERCEL_ENV !== 'production';
}

export function visibleSections(
  sections: NavSection[],
  showUnready: boolean
): NavSection[] {
  if (showUnready) return sections;
  return sections
    .map((s) => ({ ...s, items: visibleItems(s.items, false) }))
    .filter((s) => s.items.length > 0);
}

export function visibleItems(items: NavItem[], showUnready: boolean): NavItem[] {
  if (showUnready) return items;
  return items
    .filter((i) => i.ready)
    .map((i) =>
      i.children ? { ...i, children: i.children.filter((c) => c.ready) } : i
    );
}

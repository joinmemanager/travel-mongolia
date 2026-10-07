// Сайтын үндсэн цэс болон footer-ийн холбоосууд нэг дор.
// Нэр, холбоос, бэлэн эсэхийг зөвхөн энд өөрчилнө (docs/plan/ia-plan.md, 5а үе).
//
// status (docs/plan/ia-plan.md, 1-р хэсгийн 7-р зарчим):
//   live    - нийтлэгдсэн. Хаа сайгүй харагдана.
//   draft   - хуудас бий, контент шалгагдаагүй. Preview дээр цэснээс дарагддаг, "Ноорог"
//             тэмдэгтэй. Production дээр цэсэнд харагдахгүй, noindex, sitemap-д орохгүй.
//   planned - хуудас хараахан байхгүй. Preview дээр "Тун удахгүй", дарагдахгүй.
//             Production дээр харагдахгүй.
//   soft    - хэсэгчлэн нээсэн. Production дээр цэсэнд харагдаж, хуудас нээгдэнэ, гэхдээ
//             noindex, sitemap-д орохгүй (Google-д хараахан бүртгүүлэхгүй).
// Production дээр нэг ч live зүйлгүй хэсэг бүхэлдээ нуугдана.

export type NavStatus = 'live' | 'soft' | 'draft' | 'planned';

export interface NavItem {
  mn: string;
  en: string;
  href: string;
  status: NavStatus;
  // Гадаад сайт: шинэ tab-д нээгдэнэ
  external?: boolean;
  // Dropdown-д зүйлийн доор жижиг холбоосоор харагдах дэд хуудсууд
  children?: NavItem[];
}

// Нийтлэгдсэн, сайтын доторх энгийн холбоос (дэд холбоосуудад)
const page = (mn: string, en: string, href: string): NavItem => ({
  mn,
  en,
  href,
  status: 'live',
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
        mn: 'Монголын тухай', en: 'About Mongolia', href: '/about/at-a-glance', status: 'live',
        children: [
          page('Монгол орныг товчхон', 'Mongolia at a Glance', '/about/at-a-glance'),
          page('Монголын түүх', 'History', '/about/history'),
          page('Өнөөгийн Монгол', 'Modern Mongolia', '/about/modern'),
        ],
      },
      {
        mn: 'Зорих газрууд', en: 'Destinations', href: '/destination/region', status: 'live',
        children: [
          page('Бүс нутгууд', 'Regions', '/destination/region'),
          page('Аймгууд', 'Provinces', '/destination/region#provinces'),
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
        mn: 'Үзэх, хийх зүйлс', en: 'Things to Do', href: '/things-to-do/nature', status: 'live',
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
        // ia-plan.md 5в: /inspiration/stories, /inspiration/magazine нь /stories руу redirect (next.config.js)
        mn: 'Түүхүүд', en: 'Stories', href: '/stories', status: 'live',
        children: [
          page('Нууц үзэсгэлэнт газрууд', 'Hidden Mongolia', '/inspiration/hidden'),
          page('Шилдэг жагсаалтууд', 'Top Lists', '/inspiration/top-lists'),
        ],
      },
      {
        mn: 'Арга хэмжээ, баяр наадам', en: 'Events', href: '/things-to-do/events', status: 'live',
        children: [
          page('Баяр наадам, арга хэмжээ', 'Events', '/things-to-do/events'),
          page('Фестивалиуд', 'Festivals', '/things-to-do/festivals'),
        ],
      },
      { mn: 'Газрын зураг', en: 'Map', href: '/destination/map', status: 'live' },
    ],
  },
  {
    id: 'plan',
    mn: 'Төлөвлөх & захиалах',
    en: 'Plan & Book',
    items: [
      { mn: 'Аялал төлөвлөгч', en: 'Trip Planner', href: '/planner', status: 'live' },
      {
        mn: 'Аяллууд', en: 'Tours', href: '/destination/routes', status: 'live',
        children: [
          page('Аяллын чиглэлүүд', 'Routes', '/destination/routes'),
          page('Аяллын маршрутууд', 'Itineraries', '/inspiration/itineraries'),
        ],
      },
      { mn: 'Туршлагууд', en: 'Experiences', href: '/local/experiences', status: 'soft' },
      { mn: 'Байр', en: 'Accommodation', href: '/plan/accommodation', status: 'live' },
      { mn: 'Нутгийн үйлчилгээ', en: 'Local Services', href: '/plan/services', status: 'live' },
      {
        mn: 'Тээвэр', en: 'Transport', href: '/plan/getting-around', status: 'live',
        children: [
          page('Монгол дотор аялах', 'Getting Around', '/plan/getting-around'),
          page('Монголд хэрхэн ирэх вэ', 'Getting to Mongolia', '/plan/getting-to-mongolia'),
        ],
      },
      { mn: 'Захиалах', en: 'Book now', href: BOOK_NOW_URL, status: 'live', external: true },
    ],
  },
  {
    id: 'stories',
    mn: 'Түүх & өв',
    en: 'Stories & Heritage',
    items: [
      {
        mn: 'Соёл, өв', en: 'Culture & Heritage', href: '/about/culture', status: 'live',
        children: [
          page('Соёл ба өв', 'Culture & Heritage', '/about/culture'),
          page('Ёс заншил, уламжлал', 'Traditions', '/about/traditions'),
        ],
      },
      { mn: 'Байгаль', en: 'Nature', href: '/about/nature', status: 'live' },
      { mn: 'Нүүдэлчдийн амьдрал', en: 'Nomadic Life', href: '/about/nomadic-life', status: 'live' },
      { mn: 'Хоол', en: 'Food', href: '/about/food', status: 'live' },
      { mn: 'Хүмүүс', en: 'People', href: '/about/people', status: 'live' },
      // Түр: /stories бэлэн болох хүртэл (ia-plan.md 5в үед /stories руу сольж redirect хийнэ)
      { mn: 'Фото/видео түүх', en: 'Photo & Video Stories', href: '/stories/photo-video', status: 'soft' },
      {
        mn: 'Аялахаас өмнө', en: 'Learn Before You Go', href: '/plan/before-you-travel', status: 'live',
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
      { mn: 'Нутгийн туршлага', en: 'Community Experiences', href: '/local/experiences', status: 'soft' },
      { mn: 'Нутгийн хөтөч', en: 'Local Guides', href: '/local/guides', status: 'soft' },
      { mn: 'Малчин өрх', en: 'Herder Families', href: '/local/herder-families', status: 'soft' },
      { mn: 'Гар урлаач', en: 'Artisans', href: '/local/artisans', status: 'soft' },
      { mn: 'Нутгийн хоол', en: 'Local Food', href: '/local/food', status: 'soft' },
      { mn: 'Нутгийн бүтээгдэхүүн', en: 'Local Products', href: '/local/products', status: 'soft' },
    ],
  },
  {
    id: 'respect',
    mn: 'Хүндэтгэлтэй аялал',
    en: 'Travel with Respect',
    items: [
      { mn: 'Хариуцлагатай аяллын гарын авлага', en: 'Responsible Travel Guide', href: '/respect', status: 'live' },
      { mn: 'Соёл, ёс заншил', en: 'Culture & Etiquette', href: '/respect/etiquette', status: 'live' },
      { mn: 'Байгальд ээлтэй аялал', en: 'Nature Guidance', href: '/respect/nature', status: 'live' },
      { mn: 'Аюулгүй байдал', en: 'Safety', href: '/plan/safety-info', status: 'live' },
      { mn: 'Хүртээмжтэй аялал', en: 'Accessible Travel', href: '/respect/accessible', status: 'live' },
    ],
  },
  {
    id: 'impact',
    mn: 'Үр өгөөж & түншлэл',
    en: 'Impact & Partners',
    items: [
      // /impact/* дэд хуудсын оронд нэг хуудасны хэсгүүд рүү anchor-оор заана (ia-plan.md 5г)
      { mn: 'Орон нутгийн үр өгөөж', en: 'Local Impact', href: '/impact#local-impact', status: 'soft' },
      { mn: 'Түншлэлийн төслүүд', en: 'Partner Projects', href: '/impact#projects', status: 'soft' },
      { mn: 'Аймаг, DMO', en: 'Provinces & DMOs', href: '/impact#provinces', status: 'soft' },
      { mn: 'Аяллын бизнес', en: 'Tourism Businesses', href: '/impact#businesses', status: 'soft' },
      { mn: 'Хандивлагч, хөрөнгө оруулагч', en: 'Donors & Investors', href: '/impact#donors', status: 'soft' },
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
      { mn: 'Төв Монгол', en: 'Central Mongolia', href: '/destination/region?region=central', status: 'live' },
      { mn: 'Хангайн бүс', en: 'Khangai', href: '/destination/region?region=khangai', status: 'live' },
      { mn: 'Хөвсгөл ба Хойд Монгол', en: 'Khuvsgul & the North', href: '/destination/region?region=khuvsgul-north', status: 'live' },
      { mn: 'Говийн бүс', en: 'Gobi', href: '/destination/region?region=gobi', status: 'live' },
      { mn: 'Алтай ба Баруун Монгол', en: 'Altai & the West', href: '/destination/region?region=altai-west', status: 'live' },
      { mn: 'Зүүн Монгол', en: 'Eastern Mongolia', href: '/destination/region?region=eastern', status: 'live' },
    ],
  },
  {
    id: 'useful',
    mn: 'Хэрэгцээт мэдээлэл',
    en: 'Useful Information',
    items: [
      { mn: 'Виз & Зорчих нөхцөл', en: 'Visas & Entry', href: '/plan/before-you-travel#visa', status: 'live' },
      { mn: 'Цаг агаар ба улирал', en: 'Weather & Seasons', href: '/inspiration/seasons', status: 'live' },
      { mn: 'Тээвэр, машин түрээс', en: 'Transport & Car Rental', href: '/plan/getting-around', status: 'live' },
      { mn: 'Аяллын аюулгүй байдал', en: 'Travel Safety', href: '/plan/safety-info', status: 'live' },
    ],
  },
];

// Footer-ийн доод мөрийн холбоосууд
export const FOOTER_LEGAL: NavItem[] = [
  { mn: 'Нууцлалын бодлого', en: 'Privacy Policy', href: '/privacy', status: 'soft' },
  { mn: 'Үйлчилгээний нөхцөл', en: 'Terms of Service', href: '/terms', status: 'soft' },
  { mn: 'Холбоо барих', en: 'Contact', href: 'mailto:contact@joinme.mn', status: 'live' },
];

// Цэсэнд (одоохондоо) ороогүй хуудсуудын төлөв. Цэсний зүйлтэй адил дүрмээр ажиллана.
export const PAGE_STATUS: Record<string, NavStatus> = {
  // Түүх & өв hub (C10): live. /stories/<slug> нийтлэлүүд энэ төлвийг өвлөнө.
  '/stories': 'live',
  // Анхны фото/видео нийтлэл орох хүртэл soft (live болгохыг эзэмшигч шийднэ)
  '/stories/photo-video': 'soft',
  // Нутгийн Монгол hub: soft. /local/<slug> профайлууд энэ төлвийг өвлөнө.
  '/local': 'soft',
};

// Өөр хаяг руу байнгын redirect хийдэг хаягууд (next.config.js). Sitemap-д оруулахгүй.
export const REDIRECTED_PATHS: Record<string, string> = {
  '/inspiration/stories': '/stories',
  '/inspiration/magazine': '/stories',
};

// Preview (эсвэл local) орчин эсэх. SITE_ENV-ийг next.config.js build хийх үед server,
// client хоёуланд нь өгдөг тул client компонентод ч ажиллана.
// Preview дээр live бус зүйлс ч харагдана, production дээр зөвхөн live.
export function isPreviewEnv(): boolean {
  return (process.env.SITE_ENV || process.env.VERCEL_ENV) !== 'production';
}

// ---------------------------------------------------------------- хуудасны төлөв
// Хуудасны төлвийг PAGE_STATUS болон цэсний status-аас уншина (нэг эх сурвалж). live
// биш хуудас production дээр robots noindex, sitemap-д орохгүй, цэсэнд харагдахгүй, түүн
// рүү заасан товч, холбоос (liveHref) нуугдана. Хуудас өөрөө 200 буцаана.
// Аль алинд нь байхгүй хуудсыг live гэж үзнэ.

const pathOf = (href: string) => href.split(/[?#]/)[0];

function allNavItems(): NavItem[] {
  return [...MAIN_NAVIGATION, ...FOOTER_NAVIGATION]
    .flatMap((s) => s.items)
    .concat(FOOTER_LEGAL)
    .flatMap((i) => [i, ...(i.children || [])]);
}

// Нээлттэй байдлын дараалал: planned < draft < soft < live
const OPENNESS: Record<NavStatus, number> = { planned: 0, draft: 1, soft: 2, live: 3 };

// Хуудасны төлөв: PAGE_STATUS (эсвэл хамгийн ойрын эцэг хуудасных, жишээ нь /local/<slug> нь
// /local-ийнх), үгүй бол цэсний зүйлсийн хамгийн хаалттай төлөв, аль алинд нь байхгүй бол live.
export function pageStatus(path: string): NavStatus {
  if (PAGE_STATUS[path]) return PAGE_STATUS[path];
  const parent = Object.keys(PAGE_STATUS)
    .filter((p) => path.startsWith(`${p}/`))
    .sort((a, b) => b.length - a.length)[0];
  if (parent && PAGE_STATUS[parent] !== 'live') return PAGE_STATUS[parent];
  const entries = allNavItems().filter(
    (i) => i.href.startsWith('/') && pathOf(i.href) === path
  );
  if (entries.length === 0) return 'live';
  return entries.reduce<NavStatus>(
    (acc, i) => (OPENNESS[i.status] < OPENNESS[acc] ? i.status : acc),
    'live'
  );
}

// Production дээр нээгдэх (цэс, холбоосонд харагдах) хуудас: live эсвэл soft
export function isPageLive(path: string): boolean {
  return OPENNESS[pageStatus(path)] >= OPENNESS.soft;
}

// Хайлтад бүртгүүлэх (index, sitemap) хуудас: зөвхөн live
export function isPageIndexable(path: string): boolean {
  return pageStatus(path) === 'live';
}

// Хуудас доторх товч, холбоосонд: production дээр live биш хуудас руу заавал undefined
// буцаана (товчийг харуулахгүй). Сайтаас гадуурх холбоос, preview дээр хэвээр.
export function liveHref(href?: string): string | undefined {
  if (!href) return undefined;
  if (!href.startsWith('/') || isPreviewEnv()) return href;
  return isPageLive(pathOf(href)) ? href : undefined;
}

// Энэ орчинд (production) хуудсыг хайлтаас нуух ёстой эсэх (noindex, sitemap-гүй): live биш бүх хуудас
export function isUnpublishedPage(path: string): boolean {
  return !isPreviewEnv() && !isPageIndexable(path);
}

// Production дээр цэсэнд харагдах зүйл: live эсвэл soft
const shownInProduction = (i: NavItem) => OPENNESS[i.status] >= OPENNESS.soft;

export function visibleSections(
  sections: NavSection[],
  preview: boolean
): NavSection[] {
  if (preview) return sections;
  return sections
    .map((s) => ({ ...s, items: visibleItems(s.items, false) }))
    .filter((s) => s.items.length > 0);
}

export function visibleItems(
  items: NavItem[],
  preview: boolean
): NavItem[] {
  if (preview) return items;
  return items
    .filter(shownInProduction)
    .map((i) =>
      i.children
        ? { ...i, children: i.children.filter(shownInProduction) }
        : i
    );
}

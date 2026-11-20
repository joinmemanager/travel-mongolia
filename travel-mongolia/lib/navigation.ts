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

import { SHORTS_BASE, SHORTS_CATEGORIES, shortsHref } from './shorts';
import { shortsName } from './shortsI18n';

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
  // Хэсгийн «Сэдвийн жагсаалт»-д (lib/sections.ts) цэснийхээс өөр, бүтэн нэрээр харагдах бол
  sectionLabel?: string;
  // Компьютерийн mega menu-д 3-р түвшний холбоос MENU_CHILD_LIMIT-ээс олон бол зөвхөн featured-ийг
  // харуулна (үлдсэн нь «Бүгдийг үзэх (N)»-ээр). Гар утасны цэс бүгдийг харуулна.
  featured?: boolean;
}

// Mega menu-д дэд цэс бүрийн доор харуулах 3-р түвшний холбоосын дээд хязгаар
export const MENU_CHILD_LIMIT = 5;

// Дэд цэсний anchor (#...) нь хуудасны бодит <section id>-тай таарах ёстой. Хэсгийн үндсэн хаяг руу
// заасан anchor нь «Сэдвийн жагсаалт»-д мөр болж орохгүй (lib/sections.ts sectionRows).

// Нийтлэгдсэн, сайтын доторх энгийн холбоос (дэд холбоосуудад)
const page = (mn: string, en: string, href: string): NavItem => ({
  mn,
  en,
  href,
  status: 'live',
});

// Mega menu-д харагдах (featured) холбоос
const top = (item: NavItem): NavItem => ({ ...item, featured: true });

export interface NavSection {
  id: string;
  mn: string;
  en: string;
  items: NavItem[];
}

// «Фото/видео түүх» (богино бичлэг): цэсэнд үргэлж. Index/noindex, sitemap-ийг бичлэгийн тоогоор хуудас
// өөрөө шийднэ (lib/shorts.ts isTopicIndexable / isAllIndexable, app/sitemap.ts)
const SHORTS_STATUS: NavStatus = 'live';

// Богино бичлэгийн сэдвүүд (lib/shorts.ts): цэсэнд богино нэр, хэсгийн жагсаалтад бүтэн нэр
const shortsChildren = (): NavItem[] =>
  SHORTS_CATEGORIES.map((c) => ({
    mn: c.tab,
    en: shortsName(c, 'en').tab,
    href: shortsHref(c.slug),
    status: SHORTS_STATUS,
    sectionLabel: c.title,
  }));

// «Архив, түүхүүд»-ийн mega menu-д харагдах сэдвүүд (lib/shorts.ts slug)
const FEATURED_SHORTS = ['traditions', 'historical-figures', 'buddhism', 'legends'];

// «Захиалах»: цэсний гадна, header-ийн жижиг товч (components/Navbar.tsx). Footer-т ч бий.
export const BOOK_NOW_URL =
  'https://joinme.mn?utm_source=travelhubmongolia&utm_medium=referral&utm_campaign=nav';

// Хайлтын хажуух газрын зургийн icon-ий хаяг
export const MAP_HREF = '/destination/map';

// Цэс v2 (2026-11-20, эзэмшигчийн жагсаалт, docs/plan/menu-v2-final.docx): 5 хэсэг, 35 дэд цэс.
// Дэд цэс бүр одоо байгаа хуудас руу очно, URL өөрчлөгдөөгүй. Нэг дэд цэсэнд хэд хэдэн хуудас тохирвол
// 3-р түвшний холбоос болсон. Шинэ 4 хуудас (/nature/*) контент хангалтгүй тул soft (noindex, sitemap-гүй).
// Хэсгийн хуудсуудын хажуугийн жагсаалт энэ цэснээс биш, доорх SECTION_PAGE_NAV-аас уншина.
export const MAIN_NAVIGATION: NavSection[] = [
  {
    id: 'nature',
    mn: 'Байгалийн өв',
    en: 'Natural Heritage',
    items: [
      { mn: 'Байгаль, экосистем', en: 'Nature & Ecosystems', href: '/destination/landscapes', status: 'live' },
      { mn: 'Геологийн өв', en: 'Geological Heritage', href: '/nature/geology', status: 'soft' },
      { mn: 'Палеонтологийн өв', en: 'Paleontological Heritage', href: '/nature/paleontology', status: 'soft' },
      {
        mn: 'Амьтны аймаг', en: 'Fauna', href: '/about/nature', status: 'live',
        children: [
          page('Ан амьтан', 'Wildlife', '/about/nature/wildlife'),
          page('Шувууд', 'Birds', '/about/nature/birds'),
        ],
      },
      { mn: 'Ургамлын аймаг', en: 'Flora', href: '/about/nature/plants', status: 'live' },
      {
        mn: 'Тусгай хамгаалалттай газар', en: 'Protected Areas', href: '/destination/protected', status: 'live',
        children: [
          page('Тусгай хамгаалалттай газрууд', 'Protected Areas', '/destination/protected'),
          page('Дархан цаазат газрууд', 'Strictly Protected Areas', '/destination/strictly-protected'),
          page('Байгалийн цогцолборт газрууд', 'National Parks', '/destination/national-parks'),
          page('Байгалийн нөөц газрууд', 'Nature Reserves', '/destination/nature-reserves'),
          page('Байгалийн дурсгалт газрууд', 'Natural Monuments', '/destination/natural-monuments'),
        ],
      },
      { mn: 'ЮНЕСКО-гийн байгалийн өв', en: 'UNESCO Natural Heritage', href: '/nature/unesco', status: 'soft' },
      {
        mn: 'Олон улсын ач холбогдолтой газрууд', en: 'Sites of International Importance',
        href: '/nature/international-sites', status: 'soft',
      },
    ],
  },
  {
    id: 'heritage',
    mn: 'Түүх, соёл',
    en: 'History & Heritage',
    items: [
      {
        mn: 'Монголын түүх', en: 'Mongolian History', href: '/about/at-a-glance', status: 'live',
        children: [
          page('Монголын түүх', 'History', '/about/history'),
          // TIC cate14 түүхэн хүмүүс (10-р багц, 2026-10-21)
          page('Түүхэн хүмүүс', 'Historical Figures', '/about/history/people'),
          page('Монгол орныг товчхон', 'Mongolia at a Glance', '/about/at-a-glance'),
          page('Өнөөгийн Монгол', 'Modern Mongolia', '/about/modern'),
        ],
      },
      { mn: 'Археологийн өв', en: 'Archaeological Heritage', href: '/destination/heritage', status: 'live' },
      { mn: 'ЮНЕСКО-гийн соёлын өв', en: 'UNESCO Cultural Heritage', href: '/about/culture', status: 'live' },
      {
        mn: 'Ёс, уламжлал', en: 'Customs & Traditions', href: '/about/people', status: 'live',
        children: [
          top(page('Ёс заншил, уламжлал', 'Traditions', '/about/traditions')),
          top(page('Монголчууд', 'Mongolians', '/about/people#mongolians')),
          page('Угсаатны бүлгүүд', 'Ethnic Groups', '/about/people#ethnic-groups'),
          // TIC cate14 угсаатан (10-р багц). Жагсаалтад заагаагүй тул ойрын «Ёс, уламжлал»-д
          top(page('Угсаатнууд', 'Ethnic Groups (Articles)', '/about/culture/ethnic-groups')),
          top(page('Хэл, бичиг', 'Language & Script', '/about/people#language-script')),
          top(page('Зочломтгой ёс', 'Hospitality', '/about/people#hospitality')),
          page('Аж төрөх ёс', 'Way of Life', '/about/people#lifestyle'),
        ],
      },
      // TIC cate15 шашин (10-р багц, 2026-10-21)
      { mn: 'Шашин, шүтлэг', en: 'Religion & Beliefs', href: '/about/culture/religion', status: 'live' },
      {
        mn: 'Монгол хоол', en: 'Mongolian Cuisine', href: '/about/food', status: 'live',
        children: [
          page('Махан хоол', 'Meat Dishes', '/about/food#meat-dishes'),
          page('Цагаан идээ', 'Dairy', '/about/food#dairy'),
          page('Гурилан хоол', 'Flour Dishes', '/about/food#flour-dishes'),
          page('Айраг', 'Airag', '/about/food#airag'),
          page('Монгол цай', 'Mongolian Tea', '/about/food#mongolian-tea'),
        ],
      },
      {
        // ia-plan.md 5в: /inspiration/stories, /inspiration/magazine нь /stories руу redirect (next.config.js)
        mn: 'Архив, түүхүүд', en: 'Archives & Stories', href: '/stories', status: 'live',
        children: [
          { mn: 'Фото/видео түүх', en: 'Photo & Video Stories', href: SHORTS_BASE, status: SHORTS_STATUS, featured: true },
          ...shortsChildren().map((c) => (FEATURED_SHORTS.some((s) => c.href === shortsHref(s)) ? top(c) : c)),
        ],
      },
    ],
  },
  {
    id: 'explore',
    mn: 'Монгол орноор',
    en: 'Explore Mongolia',
    items: [
      {
        mn: 'Бүс нутаг', en: 'Regions', href: '/destination/region', status: 'live',
        children: [
          page('Бүс нутгууд', 'Regions', '/destination/region'),
          page('Аймгууд', 'Provinces', '/destination/region#provinces'),
          page('Газрын зураг', 'Map', MAP_HREF),
        ],
      },
      {
        mn: 'Үзэх, хийх зүйлс', en: 'Things to Do', href: '/things-to-do', status: 'live',
        children: [
          top(page('Байгальд аялах', 'Nature & Outdoors', '/things-to-do/nature')),
          top(page('Адал явдалт аялал', 'Adventure', '/things-to-do/adventure')),
          top(page('Түүх, соёлын аялал', 'Culture & History', '/things-to-do/culture')),
          // TIC cate17 (2026-10-20, эзэмшигч баталсан)
          page('Музей, театр', 'Museums & Theatres', '/things-to-do/museums'),
          page('Хоол, ундааны туршлага', 'Food & Drink', '/things-to-do/food'),
          top(page('Нүүдэлчин ахуйг мэдрэх', 'Nomadic Experiences', '/things-to-do/nomadic')),
          top(page('Амралт, рашаан сувилал', 'Wellness', '/things-to-do/wellness')),
          page('Зэрлэг амьтан, шувуу ажиглах', 'Wildlife', '/things-to-do/wildlife'),
          page('Аяллын хэв маягаар', 'Travel Styles', '/inspiration/styles'),
          page('Нууц үзэсгэлэнт газрууд', 'Hidden Mongolia', '/inspiration/hidden'),
          page('Шилдэг жагсаалтууд', 'Top Lists', '/inspiration/top-lists'),
        ],
      },
      {
        mn: 'Нутгийн амьдрал', en: 'Local Life', href: '/about/nomadic-life', status: 'live',
        children: [
          top(page('Монгол гэр', 'The Ger', '/about/nomadic-life#ger')),
          top(page('Таван хошуу мал', 'Five Animals', '/about/nomadic-life#five-animals')),
          top(page('Улирлын нүүдэл', 'Seasonal Moves', '/about/nomadic-life#four-seasons')),
          page('Мал маллах ухаан', 'Herding Know-how', '/about/nomadic-life#herding'),
          top(page('Ардын тоглоом', 'Folk Games', '/about/nomadic-life#games')),
          top(page('Малчин өрх', 'Herder Families', '/local/herder-families')),
        ],
      },
      // Хуучин «Төлөвлөх & захиалах › Туршлагууд»-тай нэг хуудас: нэг болгосон
      { mn: 'Нутгийн туршлага', en: 'Local Experiences', href: '/local/experiences', status: 'live' },
      {
        mn: 'Амт ба урлал', en: 'Taste & Craft', href: '/local/food', status: 'live',
        children: [
          page('Нутгийн хоол', 'Local Food', '/local/food'),
          page('Гар урлаач', 'Artisans', '/local/artisans'),
          page('Нутгийн бүтээгдэхүүн', 'Local Products', '/local/products'),
        ],
      },
      {
        // Хуучин хоёр «Байрлах газар»-ыг (дэд холбоостой нь) нэг болгосон
        mn: 'Байрлах газар', en: 'Accommodation', href: '/plan/accommodation', status: 'live',
        children: [
          top(page('Зочид буудал', 'Hotels', '/plan/accommodation#hotels')),
          top(page('Жуулчны бааз', 'Tourist Camps', '/plan/accommodation#tourist-camps')),
          top(page('Гэр кэмп', 'Ger Camps', '/plan/accommodation#ger-camps')),
          page('Хостел', 'Guesthouses & Hostels', '/plan/accommodation#hostels'),
          top(page('Малчин айлд', 'Homestays', '/plan/accommodation#nomad-stay')),
          top(page('Буудал, баазын лавлах', 'Directory', '/plan/accommodation#directory')),
        ],
      },
      {
        mn: 'Нутгийн үйлчилгээ', en: 'Local Services', href: '/local/guides', status: 'live',
        children: [
          page('Нутгийн хөтөч', 'Local Guides', '/local/guides'),
          page('Аяллын үйлчилгээ', 'Travel Services', '/plan/services'),
          page('Хэрэгтэй үйлчилгээ', 'Useful Services', '/plan/useful-services'),
        ],
      },
      {
        mn: 'Баяр, арга хэмжээ', en: 'Festivals & Events', href: '/things-to-do/events', status: 'live',
        children: [
          page('Уламжлалт баяр наадам', 'Traditional Festivals', '/things-to-do/events'),
          page('Фестивалиуд', 'Festivals', '/things-to-do/festivals'),
        ],
      },
    ],
  },
  {
    id: 'respect',
    mn: 'Ээлтэй аялал',
    en: 'Travel with Respect',
    items: [
      {
        mn: 'Аяллын ёс зүй', en: 'Travel Etiquette', href: '/respect/etiquette', status: 'live',
        children: [
          top(page('Гэрт орох ёс', 'Entering a Ger', '/respect/etiquette#ger')),
          top(page('Зочлох ёс', 'Hospitality', '/respect/etiquette#hospitality')),
          page('Хоол, цай', 'Food & Tea', '/respect/etiquette#food'),
          top(page('Овоо', 'Ovoo', '/respect/etiquette#ovoo')),
          top(page('Хийд', 'Monasteries', '/respect/etiquette#religious')),
          top(page('Зураг авах', 'Taking Photos', '/respect/etiquette#photos')),
        ],
      },
      {
        mn: 'Байгальд ээлтэй', en: 'Nature-Friendly Travel', href: '/respect/nature', status: 'live',
        children: [
          top(page('Хог хаягдал', 'Waste', '/respect/nature#waste')),
          top(page('Ус', 'Water', '/respect/nature#water')),
          top(page('Гал', 'Fire', '/respect/nature#fire')),
          page('Зам', 'Tracks', '/respect/nature#tracks'),
          top(page('Зэрлэг амьтан', 'Wildlife', '/respect/nature#wildlife')),
          top(page('Тусгай хамгаалалттай газар', 'Protected Areas', '/respect/nature#protected')),
        ],
      },
      {
        mn: 'Аюулгүй аялал', en: 'Safe Travel', href: '/plan/safety-info', status: 'live',
        children: [
          page('Ерөнхий зөвлөгөө', 'General Advice', '/plan/safety-info#safety'),
          page('Хууль, дүрэм', 'Local Rules', '/plan/safety-info#local-laws'),
          page('Эрүүл мэнд', 'Health', '/plan/safety-info#health'),
          page('Яаралтай утас', 'Emergency Numbers', '/plan/safety-info#emergency'),
          page('Түгээмэл асуулт', 'FAQ', '/plan/safety-info#faq'),
        ],
      },
      {
        mn: 'Хүртээмжтэй аялал', en: 'Accessible Travel', href: '/respect/accessible', status: 'live',
        children: [
          page('Хөдөлгөөний бэрхшээлтэй', 'Reduced Mobility', '/respect/accessible#mobility'),
          page('Ахмад настан', 'Older Travellers', '/respect/accessible#seniors'),
          page('Хүүхэдтэй аялагчид', 'Travelling with Children', '/respect/accessible#families'),
          page('Урьдчилан холбогдох', 'Contact Us First', '/respect/accessible#contact'),
        ],
      },
      {
        mn: 'Аяллаа төлөвлөх', en: 'Plan Your Trip', href: '/plan/before-you-travel', status: 'live',
        children: [
          top(page('Аялахаас өмнө мэдэх зүйлс', 'Before You Travel', '/plan/before-you-travel')),
          top(page('Хэзээ аялах вэ: улирлаар', 'When to Go', '/inspiration/seasons')),
          top(page('Аялал төлөвлөгч', 'Trip Planner', '/planner')),
          top(page('Монгол дотор аялах', 'Getting Around', '/plan/getting-around')),
          top(page('Монголд хэрхэн ирэх вэ', 'Getting to Mongolia', '/plan/getting-to-mongolia')),
          page('Аяллын чиглэлүүд', 'Routes', '/destination/routes'),
          page('Аяллын маршрутууд', 'Itineraries', '/inspiration/itineraries'),
        ],
      },
      { mn: 'Хариуцлагатай сонголт', en: 'Responsible Choices', href: '/respect', status: 'live' },
    ],
  },
  {
    id: 'impact',
    mn: 'Хамтын хөгжил',
    en: 'Partnership & Impact',
    items: [
      // /impact/* дэд хуудсын оронд нэг хуудасны хэсгүүд рүү anchor-оор заана (ia-plan.md 5г)
      { mn: 'Нутгийн хөгжил', en: 'Local Development', href: '/impact#local-impact', status: 'live' },
      { mn: 'Хамтын төслүүд', en: 'Joint Projects', href: '/impact#projects', status: 'live' },
      {
        mn: 'Түнш байгууллагууд', en: 'Partner Organizations', href: '/impact#provinces', status: 'live',
        children: [
          page('Аймаг, DMO', 'Provinces & DMOs', '/impact#provinces'),
          page('Аяллын бизнес', 'Tourism Businesses', '/impact#businesses'),
        ],
      },
      { mn: 'Хамтран ажиллах', en: 'Work With Us', href: '/impact#donors', status: 'live' },
      // Google Form-тэй хуудас: live (цэсэнд харагдана), гэхдээ хуудас өөрөө noindex, sitemap-д ороогүй.
      // /impact/articles-д жагсаалтын хуудас байхгүй (зөвхөн /impact/articles/<slug>) тул холбоос нэмээгүй.
      { mn: 'Судалгаа, тайлан', en: 'Research & Reports', href: '/impact/survey', status: 'live' },
      {
        mn: 'Олон улсын туршлага', en: 'International Practice', href: '/impact/examples', status: 'live',
        // Contentful `story` (topic: international), slug нь scripts/contentful/esg-examples.js-ээс
        children: [
          top(page('GSTC шалгуур', 'GSTC Criteria', '/impact/examples/gstc-criteria')),
          top(page('OECD', 'OECD', '/impact/examples/oecd-recovery')),
          top(page('Европын парламент', 'European Parliament', '/impact/examples/eu-tourism')),
          top(page('Словени', 'Slovenia', '/impact/examples/slovenia-green')),
          top(page('Booking Holdings', 'Booking Holdings', '/impact/examples/booking-holdings')),
          page('Marriott', 'Marriott', '/impact/examples/marriott-serve-360'),
        ],
      },
    ],
  },
];

// Хэсгийн хуудсуудын (app/(sec-*)/, lib/sections.ts) хажуугийн «Сэдвийн жагсаалт», hero гарчиг, замчлал.
// Цэс v2-оос өмнөх бүтцээр хадгалсан: эдгээр хуудсын route group-ууд, URL өөрчлөгдөөгүй тул жагсаалт нь
// хуудсуудаа бүтнээр нь харуулсаар байна. Цэсэнд харагдахгүй.
export const SECTION_PAGE_NAV: NavItem[] = [
  {
    mn: 'Монголын тухай', en: 'About Mongolia', href: '/about/at-a-glance', status: 'live',
    children: [
      page('Монгол орныг товчхон', 'Mongolia at a Glance', '/about/at-a-glance'),
      page('Монголын түүх', 'History', '/about/history'),
      page('Түүхэн хүмүүс', 'Historical Figures', '/about/history/people'),
      page('Өнөөгийн Монгол', 'Modern Mongolia', '/about/modern'),
    ],
  },
  {
    mn: 'Үзэх, хийх зүйлс', en: 'Things to Do', href: '/things-to-do', status: 'live',
    children: [
      page('Байгальд аялах', 'Nature & Outdoors', '/things-to-do/nature'),
      page('Адал явдалт аялал', 'Adventure', '/things-to-do/adventure'),
      page('Түүх, соёлын аялал', 'Culture & History', '/things-to-do/culture'),
      page('Музей, театр', 'Museums & Theatres', '/things-to-do/museums'),
      page('Хоол, ундааны туршлага', 'Food & Drink', '/things-to-do/food'),
      page('Нүүдэлчин ахуйг мэдрэх', 'Nomadic Experiences', '/things-to-do/nomadic'),
      page('Амралт, рашаан сувилал', 'Wellness', '/things-to-do/wellness'),
      page('Зэрлэг амьтан, шувуу ажиглах', 'Wildlife', '/things-to-do/wildlife'),
      page('Аяллын хэв маягаар', 'Travel Styles', '/inspiration/styles'),
    ],
  },
  {
    mn: 'Түүхүүд', en: 'Stories', href: '/stories', status: 'live',
    children: [
      page('Нууц үзэсгэлэнт газрууд', 'Hidden Mongolia', '/inspiration/hidden'),
      page('Шилдэг жагсаалтууд', 'Top Lists', '/inspiration/top-lists'),
    ],
  },
  {
    mn: 'Арга хэмжээ, баяр наадам', en: 'Events', href: '/things-to-do/events', status: 'live',
    children: [
      page('Уламжлалт баяр наадам', 'Traditional Festivals', '/things-to-do/events'),
      page('Фестивалиуд', 'Festivals', '/things-to-do/festivals'),
    ],
  },
  {
    mn: 'Соёл, өв', en: 'Culture & Heritage', href: '/about/culture', status: 'live',
    children: [
      page('Соёл ба өв', 'Culture & Heritage', '/about/culture'),
      page('Ёс заншил, уламжлал', 'Traditions', '/about/traditions'),
      page('Угсаатнууд', 'Ethnic Groups', '/about/culture/ethnic-groups'),
      page('Шашин шүтлэг', 'Religion', '/about/culture/religion'),
    ],
  },
  {
    mn: 'Байгаль', en: 'Nature', href: '/about/nature', status: 'live',
    children: [
      page('Ан амьтан', 'Wildlife', '/about/nature/wildlife'),
      page('Шувууд', 'Birds', '/about/nature/birds'),
      page('Ургамал', 'Plants', '/about/nature/plants'),
    ],
  },
  {
    mn: 'Нүүдэлчдийн амьдрал', en: 'Nomadic Life', href: '/about/nomadic-life', status: 'live',
    children: [
      page('Монгол гэр', 'The Ger', '/about/nomadic-life#ger'),
      page('Таван хошуу мал', 'Five Animals', '/about/nomadic-life#five-animals'),
      page('Улирлын нүүдэл', 'Seasonal Moves', '/about/nomadic-life#four-seasons'),
      page('Мал маллах ухаан', 'Herding Know-how', '/about/nomadic-life#herding'),
      page('Ардын тоглоом', 'Folk Games', '/about/nomadic-life#games'),
    ],
  },
  {
    mn: 'Хоол', en: 'Food', href: '/about/food', status: 'live',
    children: [
      page('Махан хоол', 'Meat Dishes', '/about/food#meat-dishes'),
      page('Цагаан идээ', 'Dairy', '/about/food#dairy'),
      page('Гурилан хоол', 'Flour Dishes', '/about/food#flour-dishes'),
      page('Айраг', 'Airag', '/about/food#airag'),
      page('Монгол цай', 'Mongolian Tea', '/about/food#mongolian-tea'),
    ],
  },
  {
    mn: 'Хүмүүс', en: 'People', href: '/about/people', status: 'live',
    children: [
      page('Монголчууд', 'Mongolians', '/about/people#mongolians'),
      page('Угсаатны бүлгүүд', 'Ethnic Groups', '/about/people#ethnic-groups'),
      page('Хэл, бичиг', 'Language & Script', '/about/people#language-script'),
      page('Зочломтгой ёс', 'Hospitality', '/about/people#hospitality'),
      page('Аж төрөх ёс', 'Way of Life', '/about/people#lifestyle'),
    ],
  },
  {
    mn: 'Фото/видео түүх', en: 'Photo & Video Stories', href: SHORTS_BASE, status: SHORTS_STATUS,
    children: shortsChildren(),
  },
  {
    mn: 'Аялахаас өмнө', en: 'Learn Before You Go', href: '/plan/before-you-travel', status: 'live',
    children: [
      page('Аялахаас өмнө мэдэх зүйлс', 'Before You Travel', '/plan/before-you-travel'),
      page('Хэзээ аялах вэ: улирлаар', 'When to Go', '/inspiration/seasons'),
    ],
  },
];

// Footer-ийн баганууд (лого, сошиал, холбоо барих хэсгээс бусад). Цэс v2-д footer өөрчлөгдөөгүй:
// эхний багана нь хуучин «Төлөвлөх & захиалах» хэсэг (дээд цэснээс хасагдсан).
export const FOOTER_NAVIGATION: NavSection[] = [
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
      { mn: 'Туршлагууд', en: 'Experiences', href: '/local/experiences', status: 'live' },
      { mn: 'Байрлах газар', en: 'Accommodation', href: '/plan/accommodation', status: 'live' },
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
  // Богино бичлэгийн хэсэг: live (index-ийг хуудас бичлэгийн тоогоор шийднэ). /stories/photo-video/<slug> өвлөнө.
  [SHORTS_BASE]: SHORTS_STATUS,
  // TIC-ийн мэдээний архив (8-р багц): эзэмшигч 2026-10-21-нд live болгосон. /stories/news/<slug> өвлөнө.
  '/stories/news': 'live',
  // Нутгийн Монгол hub: live (2026-11-03). /local/<slug> профайлууд өөрсдөө noindex (app/local/[slug]/page.tsx).
  '/local': 'live',
  // Олон улсын тайлангийн хураангуй: live (2026-11-03). /impact/examples/<slug> энэ төлвийг өвлөнө.
  '/impact/examples': 'live',
};

// Өөр хаяг руу байнгын redirect хийдэг хаягууд (next.config.js). Sitemap-д оруулахгүй.
export const REDIRECTED_PATHS: Record<string, string> = {
  '/inspiration/stories': '/stories',
  '/inspiration/magazine': '/stories',
  // Богино бичлэгийн хуучин хаяг (/stories/shorts/<slug> → /stories/photo-video/<slug>)
  '/stories/shorts': SHORTS_BASE,
};

// Preview (эсвэл local) орчин эсэх. SITE_ENV-ийг next.config.js build хийх үед server,
// client хоёуланд нь өгдөг тул client компонентод ч ажиллана.
// Preview дээр live бус зүйлс ч харагдана, production дээр зөвхөн live.
export function isPreviewEnv(): boolean {
  return (process.env.SITE_ENV || process.env.VERCEL_ENV) !== 'production';
}

// [slug] хуудсуудын generateStaticParams: хоосон жагсаалт = build үед үүсгэхгүй, эхний хүсэлтээр render хийж ISR-ээр кэшлэнэ.
// Үүнгүй бол Next.js dynamic segment-тэй хуудсыг хүсэлт бүрт render хийдэг (Vercel CPU, 2026-11-06). Preview-д идэвхгүй:
// тэнд connection()-оор хүсэлт бүрт render хийж draft харуулдаг, хоёулаа зэрэг байвал 500 алдаа гардаг.
export const productionStaticParams = isPreviewEnv() ? undefined : async () => [];

// ---------------------------------------------------------------- хуудасны төлөв
// Хуудасны төлвийг PAGE_STATUS болон цэсний status-аас уншина (нэг эх сурвалж). live
// биш хуудас production дээр robots noindex, sitemap-д орохгүй, цэсэнд харагдахгүй, түүн
// рүү заасан товч, холбоос (liveHref) нуугдана. Хуудас өөрөө 200 буцаана.
// Аль алинд нь байхгүй хуудсыг live гэж үзнэ.

const pathOf = (href: string) => href.split(/[?#]/)[0];

function allNavItems(): NavItem[] {
  return [...MAIN_NAVIGATION, ...FOOTER_NAVIGATION]
    .flatMap((s) => s.items)
    .concat(FOOTER_LEGAL, SECTION_PAGE_NAV)
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

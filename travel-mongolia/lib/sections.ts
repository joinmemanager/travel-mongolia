// Хэсгийн хуудсуудын нэгдсэн загвар (docs/plan/section-layout.md).
// Мега цэсний баганын гарчиг дээр дарахад нээгдэх хэсэг бүрийн hero, зүүн талын «Сэдвийн жагсаалт».
// Жагсаалтын мөрүүдийг MAIN_NAVIGATION-ийн тухайн зүйлийн children-оос үүсгэнэ (нэг эх сурвалж),
// тиймээс нэр, хаяг, төлвийг зөвхөн lib/navigation.ts-д өөрчилнө.
// Hero зургийг бүгдийг энд нэг дор тохируулна.

import { IMAGES, type SiteImage } from './images';
import { MAIN_NAVIGATION, type NavItem } from './navigation';

export interface SectionHeroConfig {
  image: SiteImage;
  // Гарчгийн дээрх жижиг бичиг
  kicker: string;
  intro: string;
}

export interface SectionConfig {
  id: string;
  // MAIN_NAVIGATION дахь зүйлийн href (= хэсгийн үндсэн хаяг)
  baseHref: string;
  hero: SectionHeroConfig;
  // Жагсаалтын эхний мөрийн нэр (үндсэн хаяг). Байхгүй бол «Тойм»
  overviewLabel?: string;
  // Hero-гийн гарчиг цэсний нэрээс өөр бол (breadcrumb-д цэсний нэр хэвээр)
  heroTitle?: string;
  // Замчлалд «Нүүр»-ийн дараа, хэсгийн өмнө орох эцэг хуудас
  parentCrumb?: { label: string; href: string };
  // Жагсаалтаас мөр сонгоход илгээх GA4 event (components/Analytics.tsx). Параметр нь
  // { [param]: мөрийн хаягийн сүүлийн хэсэг, эхний мөрөнд 'all', source }
  rowEvent?: { name: string; param: string; source: string };
}

export interface SectionRow {
  label: string;
  href: string;
  status: NavItem['status'];
  // rowEvent-ээс: data-ga-event, data-ga-params
  ga?: { event: string; params: string };
}

// Hero зургууд docs/plan/images.md-ийн Монголынх нь шалгагдсан зургуудаас.
// Хоол, Хүмүүс, Фото/видеод тохирох зураг хараахан байхгүй: хамгийн ойрыг түр тавьсан.
export const SECTIONS: SectionConfig[] = [
  // ---- Монголыг нээ
  {
    id: 'about',
    baseHref: '/about/at-a-glance',
    hero: {
      image: IMAGES.whiteHorse,
      kicker: 'Монголыг нээ',
      intro: 'Мөнх хөх тэнгэрийн орон, нүүдэлчдийн өлгий нутгийн газарзүй, түүх, өнөөгийн амьдралын тухай товч танилцуулга.',
    },
  },
  {
    id: 'things',
    baseHref: '/things-to-do',
    hero: {
      image: IMAGES.camels,
      kicker: 'Монголыг нээ',
      intro: 'Байгаль, адал явдал, соёл, хоол, нүүдэлчин ахуй: Монголд үзэж, хийж болох бүхэн.',
    },
  },
  {
    id: 'stories',
    baseHref: '/stories',
    hero: {
      image: IMAGES.gerStars,
      kicker: 'Монголыг нээ',
      intro: 'Монголын соёл, байгаль, нүүдэлчдийн амьдрал, хоол, хүмүүсийн тухай түүхүүд.',
    },
  },
  {
    id: 'events',
    baseHref: '/things-to-do/events',
    // Эзэмшигчийн шийдвэр (2026-10-12): цэс, жагсаалт, хуудасны гарчигт «Уламжлалт баяр наадам»
    overviewLabel: 'Уламжлалт баяр наадам',
    hero: {
      image: IMAGES.eagleHunter,
      kicker: 'Монголыг нээ',
      intro: 'Наадам, Цагаан сар, Бүргэдийн баяр зэрэг Монголын уламжлалт баяр наадам, фестивалиуд.',
    },
  },
  // ---- Түүх & өв
  {
    id: 'culture',
    baseHref: '/about/culture',
    hero: {
      image: IMAGES.chinggisStatue,
      kicker: 'Түүх & өв',
      intro: 'Монголын уламжлалт соёл, урлаг, ёс заншил, ЮНЕСКО-д бүртгэгдсэн өв.',
    },
  },
  {
    id: 'nature',
    baseHref: '/about/nature',
    hero: {
      image: IMAGES.redCliffs,
      kicker: 'Түүх & өв',
      intro: 'Говь, тал хээр, тайга, Алтайн нуруу болон Монголын ховор зэрлэг амьтад.',
    },
  },
  {
    id: 'nomadic',
    baseHref: '/about/nomadic-life',
    hero: {
      image: IMAGES.herdSnow,
      kicker: 'Түүх & өв',
      intro: 'Гэр, таван хошуу мал, улирлын нүүдэл: нүүдэлчдийн өдөр тутмын амьдрал.',
    },
  },
  {
    id: 'food',
    baseHref: '/about/food',
    hero: {
      image: IMAGES.gerCamp, // түр: хоолны шалгагдсан зураг хэрэгтэй
      kicker: 'Түүх & өв',
      intro: 'Цагаан идээ, айраг, бууз, хорхог: уламжлалт монгол хоол, ундаа.',
    },
  },
  {
    id: 'people',
    baseHref: '/about/people',
    hero: {
      image: IMAGES.herderBoy,
      kicker: 'Түүх & өв',
      intro: 'Монгол үндэстэн, ястан угсаатнууд, хэл бичиг, хүмүүсийн онцлог.',
    },
  },
  {
    // Богино бичлэгийн сэдвүүд (lib/shorts.ts): мөрүүд нь цэсний children (lib/navigation.ts)
    id: 'photo-video',
    baseHref: '/stories/photo-video',
    overviewLabel: 'Бүгд',
    heroTitle: 'Монгол орныг богино бичлэгээр',
    // ia-plan.md C10: /stories нь «Түүх & өв» hub
    parentCrumb: { label: 'Түүх & өв', href: '/stories' },
    rowEvent: { name: 'shorts_category_select', param: 'category', source: 'section_page' },
    hero: {
      image: IMAGES.eagleHunter,
      kicker: 'Түүх & өв',
      intro: 'Монголын уламжлал, түүх, шашин, байгалийн өв соёлыг богино бичлэгээр сонирхоорой.',
    },
  },
  {
    id: 'before',
    baseHref: '/plan/before-you-travel',
    hero: {
      image: IMAGES.lakeGers,
      kicker: 'Түүх & өв',
      intro: 'Виз, мөнгө, холбоо, улирал: Монголд аялахаас өмнө мэдэх хэрэгтэй зүйлс.',
    },
  },
];

const pathOf = (href: string) => href.split(/[?#]/)[0];

export function getSection(id: string): SectionConfig {
  const section = SECTIONS.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}

// Цэсний зүйл: хэсгийн нэр (hero гарчиг, breadcrumb) болон дэд хуудсууд
function navItemOf(section: SectionConfig): NavItem | undefined {
  return MAIN_NAVIGATION.flatMap((s) => s.items).find(
    (i) => pathOf(i.href) === section.baseHref
  );
}

export function sectionTitle(section: SectionConfig): string {
  return navItemOf(section)?.mn || '';
}

// Жагсаалтын мөрүүд: эхнийх нь үргэлж үндсэн хаяг, нэр нь «Тойм» (эсвэл overviewLabel).
export function sectionRows(section: SectionConfig): SectionRow[] {
  const item = navItemOf(section);
  const children = (item?.children || []).filter((c) => pathOf(c.href) !== section.baseHref);
  const ga = (value: string) =>
    section.rowEvent && {
      event: section.rowEvent.name,
      params: JSON.stringify({ [section.rowEvent.param]: value, source: section.rowEvent.source }),
    };
  return [
    {
      label: section.overviewLabel || 'Тойм',
      href: section.baseHref,
      status: item?.status || 'live',
      ga: ga('all'),
    },
    ...children.map((c) => ({
      label: c.sectionLabel || c.mn,
      href: c.href,
      status: c.status,
      ga: ga(pathOf(c.href).split('/').pop() || ''),
    })),
  ];
}

// Идэвхтэй мөр: хаяг нь яг таарсан, үгүй бол хамгийн урт эцэг мөр (жишээ нь /about/history/khunnu →
// «Монголын түүх»). Ийм дэд хуудас (нийтлэл) замчлал, H1-ээ өөрөө гаргана.
export function activeRow(rows: SectionRow[], pathname: string): { row?: SectionRow; nested: boolean } {
  const exact = rows.find((r) => r.href === pathname);
  if (exact) return { row: exact, nested: false };
  const parent = rows
    .filter((r) => pathname.startsWith(`${r.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return { row: parent, nested: !!parent };
}

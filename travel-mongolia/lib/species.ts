import { client } from '@/lib/contentful';
import { creditOf, type ImageCredit } from '@/lib/imageCredit';
import { assetUrl } from '@/lib/places';

// Монголын амьтан, ургамал (Contentful `species`, TIC cate10–12). «Түүх & өв → Байгаль» хэсгийн
// /about/nature/wildlife, /birds, /plants. ownPage=false бол зөвхөн каталогийн мөр (#slug).
export type SpeciesGroup = 'mammal' | 'invertebrate' | 'fish' | 'reptile' | 'bird' | 'plant';

// Бүлэг → хэсгийн дэд хуудас
export const SPECIES_SECTION: Record<string, 'wildlife' | 'birds' | 'plants'> = {
  mammal: 'wildlife',
  invertebrate: 'wildlife',
  fish: 'wildlife',
  reptile: 'wildlife',
  bird: 'birds',
  plant: 'plants',
};

export const SPECIES_SECTION_TITLE: Record<'wildlife' | 'birds' | 'plants', string> = {
  wildlife: 'Ан амьтан',
  birds: 'Шувууд',
  plants: 'Ургамал',
};

// Ан амьтны хуудасны бүлгүүд (дараалал, гарчиг, anchor)
export const WILDLIFE_GROUPS: { id: SpeciesGroup; title: string }[] = [
  { id: 'mammal', title: 'Хөхтөн амьтад' },
  { id: 'reptile', title: 'Хоёр нутагтан, мөлхөгчид' },
  { id: 'fish', title: 'Загас, усны амьтад' },
  { id: 'invertebrate', title: 'Шавж, сээр нуруугүй амьтад' },
];

export const GROUP_LABEL: Record<SpeciesGroup, string> = {
  mammal: 'Хөхтөн',
  reptile: 'Хоёр нутагтан, мөлхөгч',
  fish: 'Загас',
  invertebrate: 'Шавж, сээр нуруугүй',
  bird: 'Шувуу',
  plant: 'Ургамал',
};

export interface Species {
  id: string;
  title: string;
  slug: string;
  latinName?: string;
  group: SpeciesGroup;
  ownPage: boolean;
  order: number;
  href: string;
  summary?: string;
  image?: { src: string; alt: string; credit?: ImageCredit };
  body?: any;
  seoTitle?: string;
  seoDescription?: string;
}

export function speciesHref(group: string, slug: string, ownPage: boolean): string {
  const section = SPECIES_SECTION[group] || 'wildlife';
  return ownPage ? `/about/nature/${section}/${slug}` : `/about/nature/${section}#${slug}`;
}

function toSpecies(e: any, withBody: boolean): Species {
  const f = e.fields || {};
  const slug = String(f.slug || e.sys.id);
  const src = assetUrl(f.image);
  const ownPage = f.ownPage === true;
  return {
    id: e.sys.id,
    title: String(f.title || ''),
    slug,
    latinName: f.latinName || undefined,
    group: f.group,
    ownPage,
    order: typeof f.order === 'number' ? f.order : 9999,
    href: speciesHref(f.group, slug, ownPage),
    summary: f.summary,
    image: src ? { src, alt: String(f.title || ''), credit: creditOf(f.image) } : undefined,
    body: withBody ? f.body : undefined,
    seoTitle: f.seoTitle,
    seoDescription: f.seoDescription,
  };
}

const byTitle = (a: Species, b: Species) => a.title.localeCompare(b.title, 'mn');

// Нэг буюу хэд хэдэн бүлгийн бүх зүйл (body-гүй), нэрийн дарааллаар
export async function getSpeciesList(groups: SpeciesGroup[]): Promise<Species[]> {
  try {
    const res = await client.getEntries({
      content_type: 'species',
      'fields.group[in]': groups.join(','),
      select: ['sys.id', 'fields.title', 'fields.slug', 'fields.latinName', 'fields.group', 'fields.ownPage', 'fields.order', 'fields.summary', 'fields.image'],
      limit: 1000,
      include: 1,
    } as any);
    return res.items.map((e) => toSpecies(e, false)).sort(byTitle);
  } catch (err) {
    console.error('Амьтан, ургамлын жагсаалт татахад алдаа гарлаа:', err);
    return [];
  }
}

// Тусдаа хуудастай зүйл (section-ий бүлэгт таарсан)
export async function getSpecies(slug: string, section: 'wildlife' | 'birds' | 'plants'): Promise<Species | null> {
  try {
    const res = await client.getEntries({
      content_type: 'species',
      'fields.slug': decodeURIComponent(slug),
      limit: 1,
      include: 1,
    } as any);
    const s = res.items[0] ? toSpecies(res.items[0], true) : null;
    return s && s.ownPage && SPECIES_SECTION[s.group] === section ? s : null;
  } catch (err) {
    console.error('Амьтан, ургамал татахад алдаа гарлаа:', err);
    return null;
  }
}

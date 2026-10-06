import { cache } from 'react';

import { client } from '@/lib/contentful';
import type { SiteImage } from '@/lib/images';
import { isPreviewEnv } from '@/lib/navigation';
import { assetUrl } from '@/lib/places';

// Б хэсгийн Contentful төрлүүд (scripts/contentful/01-content-types.ps1):
// localProvider, communityExperience, localProduct, event, story, visitorGuidance.
// Төрөл хараахан үүсээгүй эсвэл хоосон бол бүх функц хоосон жагсаалт буцаана.
// "[ЖИШЭЭ]"-ээр эхэлсэн жишээ entry зөвхөн preview дээр харагдана.

export const SAMPLE_PREFIX = '[ЖИШЭЭ]';

// "Захиалах" товч: bookingUrl байхгүй бол joinme.mn (lib/navigation.ts-ийн BOOK_NOW_URL-тэй ижил utm)
export const JOINME_BOOKING_URL =
  'https://joinme.mn?utm_source=travelhubmongolia&utm_medium=referral&utm_campaign=local';

export type ProviderType =
  | 'herder-family'
  | 'guide'
  | 'artisan'
  | 'food'
  | 'small-business'
  | 'accommodation';

// Ангиллын нэр (цэсний нэртэй ижил) ба ангиллын хуудас
export const PROVIDER_TYPES: { id: ProviderType; mn: string; href?: string }[] = [
  { id: 'herder-family', mn: 'Малчин өрх', href: '/local/herder-families' },
  { id: 'guide', mn: 'Нутгийн хөтөч', href: '/local/guides' },
  { id: 'artisan', mn: 'Гар урлаач', href: '/local/artisans' },
  { id: 'food', mn: 'Нутгийн хоол', href: '/local/food' },
  { id: 'small-business', mn: 'Жижиг бизнес' },
  { id: 'accommodation', mn: 'Байр' },
];

export const providerTypeLabel = (t: string) => PROVIDER_TYPES.find((p) => p.id === t)?.mn || '';

export interface LinkedRef {
  id: string;
  slug: string;
  title: string;
  href: string;
}

export interface LocalProvider {
  id: string;
  slug: string;
  href: string;
  name: string;
  providerType: ProviderType;
  province: string;
  location?: { lat: number; lon: number };
  story: any;
  services: string[];
  priceFrom: string;
  bookingUrl: string;
  contact: string;
  localOwned: boolean;
  communityParticipation: string;
  responsiblePractices: string[];
  recognizedCertification: string;
  licenseIfRequired: string;
  womenOrYouthLed: boolean;
  photos: SiteImage[];
}

export interface CommunityExperience {
  id: string;
  slug: string;
  href: string;
  title: string;
  host?: LinkedRef;
  hostId?: string;
  community: string;
  province: string;
  duration: string;
  groupSize: string;
  whatYouDo: any;
  culturalGuidance: string;
  price: string;
  season: string;
  bookingUrl: string;
  photos: SiteImage[];
}

export interface LocalProduct {
  id: string;
  slug: string;
  href: string;
  name: string;
  producer?: LinkedRef;
  producerId?: string;
  origin: string;
  story: any;
  season: string;
  whereToBuy: string;
  relatedExperience: LinkedRef[];
  photos: SiteImage[];
}

export interface EventItem {
  id: string;
  slug: string;
  href: string;
  title: string;
  startDate: string;
  endDate: string;
  organizer: string;
  province: string;
  culturalMeaning: any;
  howToParticipate: string[];
  localServices: LinkedRef[];
  bookingUrl: string;
  photos: SiteImage[];
  // Хуучин 'recommendation' төрлөөс ирсэн бол улирал
  season: string;
}

export interface StoryEntry {
  id: string;
  slug: string;
  href: string;
  title: string;
  topic: string;
  body: any;
  media: SiteImage[];
  videoUrl: string;
  location: string;
  relatedPlace: LinkedRef[];
  relatedExperience: LinkedRef[];
  relatedProduct: LinkedRef[];
  source: string;
  storyteller: string;
  editor: string;
  language: string;
  updatedDate: string;
}

// ------------------------------------------------------------------ туслах
const str = (v: any) => (typeof v === 'string' ? v.trim() : '');
const strList = (v: any): string[] => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);

const isVisible = (title: string) => isPreviewEnv() || !title.startsWith(SAMPLE_PREFIX);

function photos(v: any, alt: string): SiteImage[] {
  const list = Array.isArray(v) ? v : v ? [v] : [];
  return list
    .map((a: any) => assetUrl(a))
    .filter(Boolean)
    .map((src: any) => ({ src: String(src), alt }));
}

function entrySlug(e: any): string {
  return str(e?.fields?.slug) || e?.sys?.id || '';
}

// Холбогдсон entry-ийн нэр, хаяг (төрлөөс хамаарч)
function linkedRef(e: any): LinkedRef | undefined {
  if (!e?.fields || !e?.sys) return undefined;
  const type = e.sys.contentType?.sys?.id;
  const f = e.fields;
  const slug = entrySlug(e);
  const title = str(f.title) || str(f.name);
  if (!title || !isVisible(title)) return undefined;
  const href =
    type === 'localProvider' ? `/local/${slug}`
    : type === 'communityExperience' ? `/local/experiences/${slug}`
    : type === 'localProduct' ? '/local/products'
    : type === 'destination' ? `/destination/${slug}`
    : type === 'heritagePlace' ? `/destination/heritage/place/${slug}`
    : type === 'province' ? `/province/${slug}`
    : type === 'event' ? `/recommendation/${slug}`
    : '';
  return href ? { id: e.sys.id, slug, title, href } : undefined;
}
const linkedRefs = (v: any): LinkedRef[] =>
  (Array.isArray(v) ? v : []).map(linkedRef).filter(Boolean) as LinkedRef[];

async function entriesOf(contentType: string, query: Record<string, any> = {}): Promise<any[]> {
  try {
    const res = await client.getEntries({ content_type: contentType, limit: 500, include: 2, ...query } as any);
    return res.items as any[];
  } catch {
    // Төрөл Contentful-д хараахан үүсээгүй (scripts/contentful/01-content-types.ps1)
    return [];
  }
}

// ------------------------------------------------------------------ хөрвүүлэлт
function toProvider(e: any): LocalProvider {
  const f = e.fields || {};
  const name = str(f.name);
  const slug = entrySlug(e);
  const loc = f.location;
  return {
    id: e.sys.id,
    slug,
    href: `/local/${slug}`,
    name,
    providerType: f.providerType,
    province: str(f.province),
    location: typeof loc?.lat === 'number' && typeof loc?.lon === 'number' ? { lat: loc.lat, lon: loc.lon } : undefined,
    story: f.story || null,
    services: strList(f.services),
    priceFrom: str(f.priceFrom),
    bookingUrl: str(f.bookingUrl),
    contact: str(f.contact),
    localOwned: f.localOwned === true,
    communityParticipation: str(f.communityParticipation),
    responsiblePractices: strList(f.responsiblePractices),
    recognizedCertification: str(f.recognizedCertification),
    licenseIfRequired: str(f.licenseIfRequired),
    womenOrYouthLed: f.womenOrYouthLed === true,
    photos: photos(f.photos, name),
  };
}

function toExperience(e: any): CommunityExperience {
  const f = e.fields || {};
  const title = str(f.title);
  const slug = entrySlug(e);
  return {
    id: e.sys.id,
    slug,
    href: `/local/experiences/${slug}`,
    title,
    host: linkedRef(f.host),
    hostId: f.host?.sys?.id,
    community: str(f.community),
    province: str(f.province),
    duration: str(f.duration),
    groupSize: str(f.groupSize),
    whatYouDo: f.whatYouDo || null,
    culturalGuidance: str(f.culturalGuidance),
    price: str(f.price),
    season: str(f.season),
    bookingUrl: str(f.bookingUrl),
    photos: photos(f.photos, title),
  };
}

function toProduct(e: any): LocalProduct {
  const f = e.fields || {};
  const name = str(f.name);
  const slug = entrySlug(e);
  return {
    id: e.sys.id,
    slug,
    href: '/local/products',
    name,
    producer: linkedRef(f.producer),
    producerId: f.producer?.sys?.id,
    origin: str(f.origin),
    story: f.story || null,
    season: str(f.season),
    whereToBuy: str(f.whereToBuy),
    relatedExperience: linkedRefs(f.relatedExperience),
    photos: photos(f.photos, name),
  };
}

function toEvent(e: any): EventItem {
  const f = e.fields || {};
  const title = str(f.title);
  const slug = entrySlug(e);
  return {
    id: e.sys.id,
    slug,
    href: `/recommendation/${slug}`,
    title,
    startDate: str(f.startDate),
    endDate: str(f.endDate),
    organizer: str(f.organizer),
    province: str(f.province),
    culturalMeaning: f.culturalMeaning || null,
    howToParticipate: strList(f.howToParticipate),
    localServices: linkedRefs(f.localServices),
    bookingUrl: str(f.bookingUrl),
    photos: photos(f.photos, title),
    season: '',
  };
}

// Хуучин 'recommendation' төрлийг (наадмууд) арга хэмжээ болгон харуулна
export function recommendationToEvent(e: any): EventItem {
  const f = e.fields || {};
  const title = str(f.title);
  const slug = entrySlug(e);
  return {
    id: e.sys.id,
    slug,
    href: `/recommendation/${slug}`,
    title,
    startDate: '',
    endDate: '',
    organizer: '',
    province: '',
    culturalMeaning: null,
    howToParticipate: [],
    localServices: [],
    bookingUrl: str(f.linkUrl),
    photos: photos(f.image || f.coverImage, title),
    season: str(f.season),
  };
}

function toStory(e: any): StoryEntry {
  const f = e.fields || {};
  const title = str(f.title);
  const slug = entrySlug(e);
  return {
    id: e.sys.id,
    slug,
    href: `/stories/${slug}`,
    title,
    topic: str(f.topic),
    body: f.body || null,
    media: photos(f.media, title),
    videoUrl: str(f.videoUrl),
    location: str(f.location),
    relatedPlace: linkedRefs(f.relatedPlace),
    relatedExperience: linkedRefs(f.relatedExperience),
    relatedProduct: linkedRefs(f.relatedProduct),
    source: str(f.source),
    storyteller: str(f.storyteller),
    editor: str(f.editor),
    language: str(f.language),
    updatedDate: str(f.updatedDate),
  };
}

// ------------------------------------------------------------------ татах
export const getProviders = cache(async (): Promise<LocalProvider[]> =>
  (await entriesOf('localProvider', { order: 'fields.name' }))
    .map(toProvider)
    .filter((p) => p.name && isVisible(p.name))
);

export const getExperiences = cache(async (): Promise<CommunityExperience[]> =>
  (await entriesOf('communityExperience', { order: 'fields.title' }))
    .map(toExperience)
    .filter((x) => x.title && isVisible(x.title))
);

export const getProducts = cache(async (): Promise<LocalProduct[]> =>
  (await entriesOf('localProduct', { order: 'fields.name' }))
    .map(toProduct)
    .filter((x) => x.name && isVisible(x.name))
);

export const getEvents = cache(async (): Promise<EventItem[]> =>
  (await entriesOf('event', { order: 'fields.startDate' }))
    .map(toEvent)
    .filter((x) => x.title && isVisible(x.title))
);

// Зөвхөн нийтлэх зөвшөөрөл авсан (consentObtained) нийтлэлүүд (баримт бичгийн 13-р хэсэг)
export const getStoryEntries = cache(async (): Promise<StoryEntry[]> =>
  (await entriesOf('story', { 'fields.consentObtained': true, order: '-fields.updatedDate' }))
    .map(toStory)
    .filter((x) => x.title && isVisible(x.title))
);

async function bySlug(contentType: string, slug: string): Promise<any | null> {
  const items = await entriesOf(contentType, { 'fields.slug': decodeURIComponent(slug), limit: 1 });
  return items[0] || null;
}

export const getProviderBySlug = cache(async (slug: string) => {
  const e = await bySlug('localProvider', slug);
  const p = e ? toProvider(e) : null;
  return p && isVisible(p.name) ? p : null;
});

export const getExperienceBySlug = cache(async (slug: string) => {
  const e = await bySlug('communityExperience', slug);
  const x = e ? toExperience(e) : null;
  return x && isVisible(x.title) ? x : null;
});

export const getEventBySlug = cache(async (slug: string) => {
  const e = await bySlug('event', slug);
  const x = e ? toEvent(e) : null;
  return x && isVisible(x.title) ? x : null;
});

export const getStoryBySlug = cache(async (slug: string) => {
  const items = await entriesOf('story', {
    'fields.slug': decodeURIComponent(slug),
    'fields.consentObtained': true,
    limit: 1,
  });
  const x = items[0] ? toStory(items[0]) : null;
  return x && isVisible(x.title) ? x : null;
});

// Тухайн газарт хамаарах аялагчийн зөвлөмж (visitorGuidance.place)
export const getGuidanceFor = cache(async (entryId: string) => {
  const items = await entriesOf('visitorGuidance', { 'fields.place.sys.id': entryId });
  return items
    .map((e: any) => {
      const f = e.fields || {};
      return {
        id: e.sys.id,
        title: str(f.title),
        culturalEtiquette: strList(f.culturalEtiquette),
        natureGuidance: strList(f.natureGuidance),
        safety: strList(f.safety),
        season: str(f.season),
        source: str(f.source),
      };
    })
    .filter((g) => isVisible(g.title));
});

// ------------------------------------------------------------------ "Local & Responsible Choice"
// Баримт бичгийн 9-р хэсгийн 4 тэмдэг. Зөвхөн өгөгдөлд нотолгоо байгаа үед харагдана.
export function choiceBadges(p: LocalProvider): { label: string; desc: string }[] {
  const badges: { label: string; desc: string }[] = [];
  if (p.localOwned)
    badges.push({ label: 'Нутгийн үйлчилгээ үзүүлэгч', desc: 'Нутгийн хүн/өрх/жижиг бизнестэй шууд холбоотой' });
  if (p.communityParticipation)
    badges.push({ label: 'Нутгийн иргэдэд түшиглэсэн', desc: p.communityParticipation });
  if (p.responsiblePractices.length > 0)
    badges.push({ label: 'Хариуцлагатай дадал', desc: p.responsiblePractices.join(' · ') });
  if (p.recognizedCertification)
    badges.push({ label: 'Хүлээн зөвшөөрөгдсөн гэрчилгээ', desc: p.recognizedCertification });
  return badges;
}

// Огноог "2027.10.02" хэлбэрээр
export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = iso.slice(0, 10).split('-');
  return d.length === 3 ? `${d[0]}.${d[1]}.${d[2]}` : iso;
}

export function eventDateLabel(e: EventItem): string {
  if (e.startDate && e.endDate && e.endDate.slice(0, 10) !== e.startDate.slice(0, 10))
    return `${formatDate(e.startDate)} – ${formatDate(e.endDate)}`;
  return formatDate(e.startDate) || e.season;
}

// Арга хэмжээний жагсаалт: 'event' төрөл (огноогоор) + хуучин 'recommendation' (наадмууд)
export const getAllEvents = cache(async (): Promise<EventItem[]> => {
  const [events, recs] = await Promise.all([getEvents(), entriesOf('recommendation')]);
  return [...events, ...recs.map(recommendationToEvent).filter((x) => x.title)];
});

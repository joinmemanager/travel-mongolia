import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, permanentRedirect } from 'next/navigation';
import { connection } from 'next/server';
import React, { cache } from 'react';

import { ContentContext } from '@/components/Analytics';
import ImageCard from '@/components/design/ImageCard';
import LinkCard from '@/components/design/LinkCard';
import AimagMap from '@/components/province/AimagMap';
import Gallery from '@/components/province/Gallery';
import OpenDetailsOnHash from '@/components/province/OpenDetailsOnHash';
import ProvinceFactsBand, { type FactItem } from '@/components/province/ProvinceFactsBand';
import ReadMore from '@/components/province/ReadMore';
import WeatherCard from '@/components/province/WeatherCard';
import RichText from '@/components/RichText';
import { GuidanceBlock, PlaceEsgBlocks } from '@/components/templates/DetailBlocks';
import ImageHero from '@/components/templates/ImageHero';
import RelatedBookings from '@/components/templates/RelatedBookings';
import { getEntryBySlugOrId } from '@/lib/entries';
import { creditOf } from '@/lib/imageCredit';
import { AI_GENERATED_ASSETS, IMAGES } from '@/lib/images';
import { cdnImage } from '@/lib/imageUrl';
import { getGuidanceFor } from '@/lib/localContent';
import { isPreviewEnv, liveHref } from '@/lib/navigation';
import { getHeritagePlaceCards } from '@/lib/places';
import { POPULATION_YEAR, PROVINCE_ALIASES, PROVINCE_FACTS } from '@/lib/provinceFacts';
import { getRelatedItems, linkIds } from '@/lib/related';
import { splitRichText } from '@/lib/richTextParts';
import { pageMetadata, richTextToPlain, truncate } from '@/lib/seo';
import { getSoumsOfProvince } from '@/lib/soums';
import PlaceList from '@/components/places/PlaceList';
import { CULTURE_CATEGORIES, getPlacesOfProvince, PROTECTED_CATEGORIES, type PlaceSummary } from '@/lib/tourismPlaces';

interface Props {
  params: Promise<{ id: string }>;
}

// Аймгийн entry-д том зураггүй үеийн hero: lib/provinceFacts.ts-ийн аймаг бүрийн түр зураг, байхгүй бол энэ
const FALLBACK_IMAGE = IMAGES.whiteHorse;

// generateMetadata болон хуудас хоёулаа ашиглах тул нэг л удаа татна.
// slug-аар (хуучин холбоосод entry ID-аар) хайна. include: 1 нь танилцуулга доторх зургийг задална.
const getProvince = cache(async (rawId: string) => getEntryBySlugOrId('province', rawId.toLowerCase().trim(), 1));

// Entry-ийн зураг; AI-аар үүсгэсэн нь (lib/images.ts AI_GENERATED_ASSETS) тооцохгүй
function imageOf(f: any): string | undefined {
  const asset = f.image || f.coverImage;
  if (AI_GENERATED_ASSETS[asset?.sys?.id]) return undefined;
  const url = asset?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

// Hero-д сунгахад бүдгэрэхгүй өргөн. TIC-ээс орсон аймгийн зураг ихэвчлэн ≈250 px-ийн сүлд байдаг:
// түүнийг hero биш, гарчгийн дээрх тэмдэг болгоно.
const HERO_MIN_WIDTH = 1000;
// «Зургийн цомог»-т орох хамгийн бага өргөн (сүлд, icon зэрэг жижиг зургийг оруулахгүй)
const GALLERY_MIN_WIDTH = 500;

function imageWidth(f: any): number {
  return (f.image || f.coverImage)?.fields?.file?.details?.image?.width || 0;
}

// highlights нь Contentful-д нэг мөр текст ("А, Б, В"), хуучин өгөгдөлд массив байж болно
function highlightList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === 'string') return v.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

const num = (n: number) => n.toLocaleString('en-US');
const text = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);

// Ховд, Улаанбаатарын entry-д загвараас үлдсэн утга (center «Мэдээлэл», population «100,000», area «төв»).
// 2026-10-15-нд Contentful-ийн Draft-аас хоосолсон (scripts/contentful/placeholders.js), гэхдээ нийтлэгдсэн
// хувилбарт Publish хийх хүртэл үлдэнэ: тэр болтол эдгээрийг хоосон гэж үзэж статик утгыг харуулна.
const PLACEHOLDERS = new Set(['Мэдээлэл', '100,000', 'төв']);
const cfText = (v: unknown) => {
  const t = text(v);
  return t && !PLACEHOLDERS.has(t) ? t : undefined;
};
// Тоон үзүүлэлт (талбай, хүн ам) цифргүй бол хүчингүй
const cfNumber = (v: unknown) => {
  const t = cfText(v);
  return t && /\d/.test(t) ? t : undefined;
};

// Мэдээллийн тууз: Contentful-ийн утга эхэнд, байхгүй бол lib/provinceFacts.ts. Хоосон мөр харагдахгүй.
function factItems(slug: string, f: any): { items: FactItem[]; usedStatic: boolean } {
  const s: Partial<(typeof PROVINCE_FACTS)[string]> = PROVINCE_FACTS[slug] || {};
  let usedStatic = false;
  const items: FactItem[] = [];
  // Contentful-ийн текст эсвэл статик утга (аль нь ч байхгүй бол мөр харагдахгүй)
  const add = (label: string, cf: string | undefined, value: string | undefined, unit?: string) => {
    if (cf) items.push({ label, value: cf });
    else if (value) {
      items.push({ label, value, unit });
      usedStatic = true;
    }
  };
  add('Талбай', cfNumber(f.area), s.area ? num(s.area) : undefined, 'км²');
  add(cfNumber(f.population) ? 'Хүн ам' : `Хүн ам (${POPULATION_YEAR})`, cfNumber(f.population), s.population ? num(s.population) : undefined);
  add('Аймгийн төв', cfText(f.center), s.center);
  add('Улаанбаатараас', undefined, s.distanceFromUb ? num(s.distanceFromUb) : undefined, 'км');
  add('Сумын тоо', undefined, s.soums ? String(s.soums) : undefined);
  add('Дундаж өндөршил', undefined, s.elevation ? num(s.elevation) : undefined, 'м');
  return { items, usedStatic };
}

// Хэсгийн гарчиг: зүүн талдаа ногоон зураастай
function Section({
  id,
  title,
  tint,
  children,
}: {
  id: string;
  title: string;
  tint: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-28 rounded-3xl px-6 py-10 sm:px-10 ${tint ? 'bg-[#f1f7f2]' : 'bg-white'}`}>
      <h2 className="pl-4 mb-6 text-2xl font-black tracking-tight border-l-4 border-[#15803d] text-neutral-900 sm:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await getProvince(id);
  if (!found) {
    // Өөр бичлэг (umnugovi г.м.) redirect, мэдэгдэхгүй slug 404 болно (хуудсыг үз). Contentful
    // түр алдаа өгсөн ч мэдэгдэх аймаг өөрийн canonical-тай, index хэвээр (layout-ын «/» canonical-ийг
    // өвлөвөл Google нүүр хуудасны давхардал гэж үздэг).
    const slug = decodeURIComponent(id).toLowerCase().trim();
    const s = PROVINCE_FACTS[slug];
    if (!s) return { title: 'Аймгийн мэдээлэл', alternates: { canonical: null } };
    return pageMetadata({
      title: `${s.name}${slug === 'ulaanbaatar' ? '' : ' аймаг'}: үзэх газрууд, аялах мэдээлэл`,
      description: `${s.name} аймагт аялах гарын авлага: үзэх газрууд, төв, хүн ам, газар нутгийн мэдээлэл.`,
      path: `/province/${slug}`,
      image: s.hero ? IMAGES[s.hero].src : undefined,
    });
  }

  const f = found.entry.fields as any;
  const name = f.title || f.name;
  const slug = f.slug || found.entry.sys.id;
  const meta = pageMetadata({
    title: f.seoTitle || `${name}: үзэх газрууд, аялах мэдээлэл`,
    description:
      f.seoDescription ||
      truncate(
        richTextToPlain(f.description2 || f.description || f.description1) ||
          `${name}-д аялах гарын авлага: үзэх газрууд, төв, хүн ам, газар нутгийн мэдээлэл.`
      ),
    path: `/province/${slug}`,
    image: (imageWidth(f) >= HERO_MIN_WIDTH && imageOf(f)) || (PROVINCE_FACTS[slug]?.hero && IMAGES[PROVINCE_FACTS[slug].hero!].src) || undefined,
  });
  // seoTitle-д брэнд аль хэдийн орсон тул layout-ын "| Travel Hub Mongolia" загварыг давхар залгахгүй
  return f.seoTitle ? { ...meta, title: { absolute: f.seoTitle } } : meta;
}

export default async function ProvinceDetailPage({ params }: Props) {
  // Preview дээр Draft-ыг тухай бүр шинээр харуулна (production-д статик, ISR хэвээр)
  if (isPreviewEnv()) await connection();

  const { id } = await params;
  const found = await getProvince(id);
  const contentfulEntry = found?.entry;
  // Хуучин entry ID хаягаар орж ирвэл slug хаяг руу
  if (found?.matchedBy === 'id' && contentfulEntry?.fields?.slug) {
    permanentRedirect(`/province/${contentfulEntry.fields.slug}`);
  }

  const f: any = contentfulEntry?.fields || {};
  const provinceSlug: string = f.slug || decodeURIComponent(id).toLowerCase().trim();
  const staticFacts = PROVINCE_FACTS[provinceSlug];
  if (!contentfulEntry) {
    // /province/umnugovi → /province/umnugov г.м. Мэдэгдэхгүй slug нь 200 + noindex биш, 404.
    const alias = PROVINCE_ALIASES[provinceSlug];
    if (alias) permanentRedirect(`/province/${alias}`);
    if (!staticFacts) notFound();
  }
  const name: string = contentfulEntry
    ? f.title || f.name
    : staticFacts
      ? `${staticFacts.name} аймаг`
      : `${decodeURIComponent(id).replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())} аймаг`;
  const description =
    f.description2 ||
    f.description ||
    f.description1 ||
    (contentfulEntry ? '' : 'Энэхүү аймгийн дэлгэрэнгүй танилцуулга тун удахгүй нэмэгдэнэ.');
  const { intro, more, images: allImages } = splitRichText(description);
  const images = allImages.filter((img) => !img.width || img.width >= GALLERY_MIN_WIDTH);
  const entryImage = imageOf(f);
  const ownHero = entryImage && imageWidth(f) >= HERO_MIN_WIDTH ? entryImage : undefined;
  const hero = ownHero
    ? { src: ownHero, alt: name, credit: creditOf(f.image || f.coverImage) }
    : (staticFacts?.hero && IMAGES[staticFacts.hero]) || FALLBACK_IMAGE;
  // Сүлд: тусдаа `emblem` талбар (hero-д гэрэл зураг тавьсан аймаг), эсвэл hero болохооргүй жижиг entry зураг
  const emblemUrl = f.emblem?.fields?.file?.url;
  const emblem = emblemUrl
    ? (emblemUrl.startsWith('//') ? `https:${emblemUrl}` : emblemUrl)
    : entryImage && !ownHero
      ? entryImage
      : undefined;
  const { items: facts, usedStatic } = factItems(provinceSlug, f);
  const highlights = highlightList(f.highlights);
  const provinceStem = String(name).replace(/ аймаг$/, '');
  // Улаанбаатар аймаг биш: «Сумд» хэсэг нь дүүргүүд
  const isCapital = provinceSlug === 'ulaanbaatar';
  const ofUnit = isCapital ? 'хотын' : 'аймгийн';

  // Энэ аймагт байрлах түүхэн өвийн газрууд (region талбарт аймгийн нэр орсон)
  const placesHere = (await getHeritagePlaceCards())
    .filter((p) => p.region && p.region.includes(provinceStem))
    .slice(0, 3);

  // Холбоотой аялал, туршлага, үйлчилгээ: related_* талбар, байхгүй бол ижил аймаг
  const related = await getRelatedItems({
    experienceIds: linkIds(f.relatedExperience),
    providerIds: linkIds(f.relatedProvider),
    productIds: linkIds(f.relatedProduct),
    provinceText: name,
  });

  // Хэрхэн зөв аялах (visitorGuidance), сумд
  const [guidance, soums, placesOfProvince] = contentfulEntry
    ? await Promise.all([
        getGuidanceFor(contentfulEntry.sys.id),
        getSoumsOfProvince(contentfulEntry.sys.id),
        getPlacesOfProvince(contentfulEntry.sys.id),
      ])
    : [[], [], [] as PlaceSummary[]];
  // TIC-ээс шилжүүлсэн газрууд (lib/tourismPlaces.ts): тусгай хамгаалалттай, хотын дурсгалт, музей/театр, рашаан
  const placeGroups = [
    { id: 'protected-areas', title: `${provinceStem} ${ofUnit} тусгай хамгаалалттай газрууд`, items: placesOfProvince.filter((p) => (PROTECTED_CATEGORIES as string[]).includes(p.category)) },
    { id: 'landscapes', title: `${provinceStem} ${ofUnit} байгалийн үзэсгэлэнт газрууд`, items: placesOfProvince.filter((p) => p.category === 'landscape') },
    { id: 'heritage-sites', title: `${provinceStem} ${ofUnit} түүх, соёлын дурсгалт газрууд`, items: placesOfProvince.filter((p) => p.category === 'heritage-site') },
    { id: 'city-monuments', title: `${provinceStem} ${ofUnit} хотын дурсгалт газрууд`, items: placesOfProvince.filter((p) => p.category === 'city-monument') },
    { id: 'museums', title: 'Музей, театр, соёлын төв', items: placesOfProvince.filter((p) => (CULTURE_CATEGORIES as string[]).includes(p.category)) },
    { id: 'sanatoriums', title: 'Рашаан сувилал', items: placesOfProvince.filter((p) => p.category === 'sanatorium') },
  ].filter((g) => g.items.length > 0);
  const soumPages = soums.filter((s) => s.ownPage);
  const soumBriefs = soums.filter((s) => !s.ownPage);
  const plannerHref = liveHref('/planner');

  // Хэсгүүд ээлжлэн цагаан / цайвар ногоон дэвсгэртэй
  let n = 0;
  const tint = () => n++ % 2 === 1;

  return (
    <main className="pb-28 w-full min-h-screen font-sans bg-white text-neutral-900">
      <ContentContext value={{ content_type: 'province', content_id: provinceSlug, province: name }} />

      <ImageHero
        compact
        image={hero}
        title={name}
        badge={
          emblem && (
            <img
              src={cdnImage(emblem, 192)}
              alt={`${provinceStem} ${ofUnit} сүлд`}
              width={96}
              height={96}
              className="object-contain p-1.5 mx-auto mb-4 w-20 h-20 bg-white rounded-2xl shadow-lg sm:w-24 sm:h-24"
            />
          )
        }
        topLeft={
          <Link
            href="/#map"
            className="inline-flex gap-2 items-center px-4 py-2 text-xs font-medium rounded-full border backdrop-blur-md transition-all bg-black/40 hover:bg-black/60 text-white/90 hover:text-white border-white/10 sm:text-sm"
          >
            <span aria-hidden="true">←</span>
            <span>Нүүр хуудас руу буцах</span>
          </Link>
        }
      />

      <ProvinceFactsBand
        items={facts}
        note={
          usedStatic
            ? `Эх сурвалж: ҮСХ (${POPULATION_YEAR} оны тооллого), Wikipedia, touristinfocenter.mn; дундаж өндөршил — Copernicus DEM-ээс тооцоолсон.`
            : undefined
        }
      />

      <div className="grid grid-cols-1 gap-8 px-4 mx-auto mt-8 max-w-7xl sm:px-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12 lg:mt-12">
        {/* Sidebar: утсан дээр агуулгын дээд хэсэгт, компьютерт баруун талд наалддаг */}
        <aside className="lg:order-last">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <div className="sm:row-span-2 lg:row-span-1">
              <AimagMap active={provinceSlug} />
            </div>
            {plannerHref && (
              <Link
                href={plannerHref}
                className="flex justify-center items-center px-6 py-4 text-base font-bold text-white rounded-2xl shadow-sm transition-colors bg-[#15803d] hover:bg-[#0b3b20]"
              >
                Аялал төлөвлөх →
              </Link>
            )}
            {staticFacts?.coords && <WeatherCard slug={provinceSlug} center={cfText(f.center) || staticFacts.center} />}
          </div>
        </aside>

        <div className="space-y-6 min-w-0">
          {/* Танилцуулга: эхний 3 догол мөр, үлдсэн нь «Дэлгэрэнгүй унших» (HTML-д бүтнээрээ) */}
          <Section id="overview" title="Танилцуулга" tint={tint()}>
            <div className="max-w-[70ch]">
              <RichText document={intro} />
              {more && (
                <ReadMore>
                  <RichText document={more} />
                </ReadMore>
              )}
            </div>
          </Section>

          {images.length > 0 && (
            <Section id="gallery" title="Зургийн цомог" tint={tint()}>
              <Gallery images={images} />
            </Section>
          )}

          {highlights.length > 0 && (
            <Section id="highlights" title="Онцлох газрууд" tint={tint()}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {highlights.map((spot, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-center p-4 bg-white rounded-xl border transition-colors border-neutral-200/50 hover:border-neutral-300"
                  >
                    <span className="text-lg" aria-hidden="true">📍</span>
                    <span className="font-medium text-neutral-800">{spot}</span>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Сумд. Тусдаа хуудастай нь холбоос, бусад нь товч танилцуулгатай жагсаалт */}
          {soums.length > 0 && (
            <Section id="soums" title={`${provinceStem} ${ofUnit} ${isCapital ? 'дүүргүүд' : 'сумд'}`} tint={tint()}>
              {soumPages.length > 0 && (
                <ul className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2">
                  {soumPages.map((s) => (
                    <li key={s.id} id={s.slug} className="scroll-mt-28">
                      <Link
                        href={`/province/${provinceSlug}/${s.slug}`}
                        className="flex gap-3 justify-between items-center p-4 bg-white rounded-xl border transition-colors border-neutral-200/50 hover:border-[#15803d]"
                      >
                        <span className="font-medium text-neutral-900">{s.title}</span>
                        <span className="text-sm font-semibold text-[#15803d]">Дэлгэрэнгүй →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {soumBriefs.length > 0 && (
                <div className="space-y-3">
                  <OpenDetailsOnHash />
                  {soumBriefs.map((s) => (
                    <details
                      key={s.id}
                      id={s.slug}
                      className="bg-white rounded-xl border group scroll-mt-28 border-neutral-200/70 open:bg-neutral-50"
                    >
                      <summary className="flex gap-3 justify-between items-center p-4 font-medium list-none cursor-pointer text-neutral-900">
                        <span>{s.title}</span>
                        <span aria-hidden="true" className="transition-transform text-neutral-400 group-open:rotate-45">+</span>
                      </summary>
                      <div className="px-4 pb-2 max-w-[70ch]">
                        <RichText document={s.body} />
                      </div>
                    </details>
                  ))}
                </div>
              )}
            </Section>
          )}

          {placeGroups.map((g) => (
            <Section key={g.id} id={g.id} title={g.title} tint={tint()}>
              <PlaceList places={g.items} eyebrow="category" columns={2} />
            </Section>
          ))}

          <Section id="guide" title="Аялахад анхаарах зүйлс" tint={tint()}>
            <p className="max-w-[70ch] text-base leading-relaxed text-neutral-700 sm:text-lg">
              Аялалд гарахаас өмнө цаг агаарын нөхцөл байдал, зам харгуй болон шатахуун түгээх станцын байршлыг урьдчилан судлахыг зөвлөж байна. Мөн орон нутгийн байгаль хамгаалагчидтай холбогдон тусгай хамгаалалттай газар нутгийн дэглэмтэй танилцаарай.
            </p>
          </Section>

          <PlaceEsgBlocks fields={contentfulEntry?.fields} />
          <GuidanceBlock items={guidance} />
        </div>
      </div>

      <div className="px-6 mx-auto mt-20 space-y-12 max-w-7xl sm:px-10">
        <RelatedBookings items={related} campaign="province" contentId={provinceSlug} />
        {placesHere.length > 0 && (
          <section>
            <h2 className="pl-4 mb-6 text-2xl font-black tracking-tight border-l-4 border-[#15803d] text-neutral-900 sm:text-3xl">
              Ойролцоох газрууд
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {placesHere.map((place) => (
                <ImageCard key={place.id} href={place.href} image={place.image} title={place.title} eyebrow={place.region} />
              ))}
            </div>
          </section>
        )}
        <LinkCard
          title="Холбогдох хуудсууд"
          columns={3}
          links={[
            { label: 'Зорих газрууд', href: '/destination/region' },
            { label: 'Түүхэн өв, дурсгалт газрууд', href: '/destination/heritage' },
            { label: 'Газрын зураг', href: '/destination/map' },
          ]}
        />
      </div>
    </main>
  );
}

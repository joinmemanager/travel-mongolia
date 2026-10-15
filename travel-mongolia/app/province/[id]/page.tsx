import type { Metadata } from 'next';
import Link from 'next/link';
import { permanentRedirect } from 'next/navigation';
import { connection } from 'next/server';
import React, { cache } from 'react';

import RichText from '@/components/RichText';
import { GuidanceBlock, PlaceEsgBlocks } from '@/components/templates/DetailBlocks';
import RelatedBookings from '@/components/templates/RelatedBookings';
import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { getEntryBySlugOrId } from '@/lib/entries';
import { getHeritagePlaceCards } from '@/lib/places';
import { getGuidanceFor } from '@/lib/localContent';
import { isPreviewEnv } from '@/lib/navigation';
import { getRelatedItems, linkIds } from '@/lib/related';
import { pageMetadata, richTextToPlain, truncate } from '@/lib/seo';
import { getSoumsOfProvince } from '@/lib/soums';

interface Props {
  params: Promise<{ id: string }>;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000';

// generateMetadata болон хуудас хоёулаа ашиглах тул нэг л удаа татна.
// slug-аар (хуучин холбоосод entry ID-аар) хайна. include: 1 нь танилцуулга доторх зургийг задална.
const getProvince = cache(async (rawId: string) => getEntryBySlugOrId('province', rawId.toLowerCase().trim(), 1));

function imageOf(f: any): string | undefined {
  const url = (f.image || f.coverImage)?.fields?.file?.url;
  if (!url) return undefined;
  return url.startsWith('//') ? `https:${url}` : url;
}

// highlights нь Contentful-д нэг мөр текст ("А, Б, В"), хуучин өгөгдөлд массив байж болно
function highlightList(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String).filter(Boolean);
  if (typeof v === 'string') return v.split(/[,;\n]/).map((s) => s.trim()).filter(Boolean);
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const found = await getProvince(id);
  // Contentful-д байхгүй аймгийн түр хуудсыг хайлтад оруулахгүй
  if (!found) return { title: 'Аймгийн мэдээлэл', robots: { index: false } };

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
    image: imageOf(f),
  });
  // seoTitle-д брэнд аль хэдийн орсон тул layout-ын "| Travel Mongolia" загварыг давхар залгахгүй
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
  const name: string = contentfulEntry
    ? f.title || f.name
    : `${decodeURIComponent(id).replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())} аймаг`;
  const description =
    f.description2 ||
    f.description ||
    f.description1 ||
    (contentfulEntry ? '' : 'Энэхүү аймгийн дэлгэрэнгүй танилцуулга тун удахгүй нэмэгдэнэ.');
  const facts = [
    { label: 'Төв хот', value: f.center },
    { label: 'Хүн ам', value: f.population },
    { label: 'Газар нутаг', value: f.area },
  ].filter((x) => x.value);
  const highlights = highlightList(f.highlights);
  const provinceSlug: string = f.slug || id;

  // Энэ аймагт байрлах түүхэн өвийн газрууд (region талбарт аймгийн нэр орсон)
  const provinceStem = String(name).replace(/ аймаг$/, '');
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
  const [guidance, soums] = contentfulEntry
    ? await Promise.all([getGuidanceFor(contentfulEntry.sys.id), getSoumsOfProvince(contentfulEntry.sys.id)])
    : [[], []];
  const soumPages = soums.filter((s) => s.ownPage);
  const soumBriefs = soums.filter((s) => !s.ownPage);

  const nav = [
    { id: 'overview', label: 'Тойм мэдээлэл' },
    ...(facts.length ? [{ id: 'facts', label: 'Үзүүлэлтүүд' }] : []),
    ...(highlights.length ? [{ id: 'highlights', label: 'Үзэх газрууд' }] : []),
    ...(soums.length ? [{ id: 'soums', label: 'Сумд' }] : []),
    { id: 'guide', label: 'Аяллын зөвлөгөө' },
  ];

  return (
    <PlaceTemplate
      image={{ src: imageOf(f) || FALLBACK_IMAGE, alt: name }}
      title={name}
      back={{ href: '/#map', label: 'Нүүр хуудас руу буцах' }}
      analytics={{ content_type: 'province', content_id: provinceSlug, province: name }}
      bookings={<RelatedBookings items={related} campaign="province" contentId={provinceSlug} />}
      nav={nav}
      nearby={{ title: 'Ойролцоох газрууд', places: placesHere }}
      links={[
        { label: 'Зорих газрууд', href: '/destination/region' },
        { label: 'Түүхэн өв, дурсгалт газрууд', href: '/destination/heritage' },
        { label: 'Газрын зураг', href: '/destination/map' },
      ]}
    >
        {/* Хэсэг 1: Ерөнхий танилцуулга */}
        <section id="overview" className="pt-16 scroll-mt-20">
          <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-6">
            Танилцуулга
          </h2>
          <div className="text-neutral-700">
            <RichText document={description} />
          </div>
        </section>

        {/* Хэсэг 2: Тоон үзүүлэлтүүд */}
        {facts.length > 0 && (
          <section id="facts" className="pt-16 scroll-mt-20 border-t border-neutral-100 mt-12">
            <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-6">
              Аймгийн үзүүлэлтүүд
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {facts.map((x) => (
                <div key={x.label} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60">
                  <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                    {x.label}
                  </span>
                  <span className="text-xl font-medium text-neutral-900">{x.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Хэсэг 3: Үзэх газрууд */}
        {highlights.length > 0 && (
          <section id="highlights" className="pt-16 scroll-mt-20 border-t border-neutral-100 mt-12">
            <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-6">
              Онцлох газрууд
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {highlights.map((spot, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200/50 hover:border-neutral-300 transition-colors"
                >
                  <span className="text-lg">📍</span>
                  <span className="text-neutral-800 font-medium">{spot}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Хэсэг 4: Сумд. Тусдаа хуудастай нь холбоос, бусад нь товч танилцуулгатай жагсаалт */}
        {soums.length > 0 && (
          <section id="soums" className="pt-16 scroll-mt-20 border-t border-neutral-100 mt-12">
            <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-6">
              {provinceStem} аймгийн сумд
            </h2>
            {soumPages.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {soumPages.map((s) => (
                  <li key={s.id} id={s.slug} className="scroll-mt-28">
                    <Link
                      href={`/province/${provinceSlug}/${s.slug}`}
                      className="flex items-center justify-between gap-3 p-4 rounded-xl bg-neutral-50 border border-neutral-200/50 hover:border-[#15803d] transition-colors"
                    >
                      <span className="text-neutral-900 font-medium">{s.title}</span>
                      <span className="text-sm font-semibold text-[#15803d]">Дэлгэрэнгүй →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {soumBriefs.length > 0 && (
              <div className="space-y-3">
                {soumBriefs.map((s) => (
                  <details
                    key={s.id}
                    id={s.slug}
                    className="group scroll-mt-28 rounded-xl border border-neutral-200/70 bg-white open:bg-neutral-50"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 font-medium text-neutral-900">
                      <span>{s.title}</span>
                      <span aria-hidden="true" className="text-neutral-400 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="px-4 pb-2">
                      <RichText document={s.body} />
                    </div>
                  </details>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Хэсэг 5: Аяллын зөвлөмж */}
        <section id="guide" className="pt-16 scroll-mt-20 border-t border-neutral-100 mt-12">
          <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-4">
            Аялахад анхаарах зүйлс
          </h2>
          <p className="text-neutral-600 leading-relaxed font-light">
            Аялалд гарахаас өмнө цаг агаарын нөхцөл байдал, зам харгуй болон шатахуун түгээх станцын байршлыг урьдчилан судлахыг зөвлөж байна. Мөн орон нутгийн байгаль хамгаалагчидтай холбогдон тусгай хамгаалалттай газар нутгийн дэглэмтэй танилцаарай.
          </p>
        </section>
      <PlaceEsgBlocks fields={contentfulEntry?.fields} />
      <GuidanceBlock items={guidance} />
    </PlaceTemplate>
  );
}

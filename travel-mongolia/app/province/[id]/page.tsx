import type { Metadata } from 'next';
import React, { cache } from 'react';

import { GuidanceBlock, PlaceEsgBlocks } from '@/components/templates/DetailBlocks';
import RelatedBookings from '@/components/templates/RelatedBookings';
import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { client } from '@/lib/contentful';
import { getHeritagePlaceCards } from '@/lib/places';
import { getGuidanceFor } from '@/lib/localContent';
import { getRelatedItems, linkIds } from '@/lib/related';
import { pageMetadata, richTextToPlain, truncate } from '@/lib/seo';

interface Props {
  params: Promise<{ id: string }>;
}

function parseRichText(node: any): any {
  if (!node) return null;
  if (typeof node === 'string') return node;
  if (node.nodeType === 'text') return node.value;

  if (node.nodeType === 'paragraph') {
    return (
      <p className="mb-6 text-lg leading-relaxed text-neutral-700 font-light">
        {node.content?.map((child: any, idx: number) => (
          <React.Fragment key={idx}>{parseRichText(child)}</React.Fragment>
        ))}
      </p>
    );
  }

  if (node.content && Array.isArray(node.content)) {
    return node.content.map((child: any, idx: number) => (
      <div key={idx}>{parseRichText(child)}</div>
    ));
  }
  return null;
}

// generateMetadata болон хуудас хоёулаа ашиглах тул нэг л удаа татна
const getProvinceFromContentful = cache(async (rawId: string) => {
  const cleanId = decodeURIComponent(rawId).toLowerCase().trim();

  try {
    const entries = await client.getEntries({
      content_type: 'province',
    });

    if (!entries.items || entries.items.length === 0) return null;

    return (
      entries.items.find((item: any) => {
        const f = item.fields || {};
        const slug = f.slug ? String(f.slug).toLowerCase().trim() : '';
        const title = f.title ? String(f.title).toLowerCase().trim() : '';
        const entryTitle = f.name ? String(f.name).toLowerCase().trim() : '';

        return (
          slug === cleanId ||
          title.includes(cleanId) ||
          cleanId.includes(title) ||
          entryTitle.includes(cleanId) ||
          item.sys.id === rawId
        );
      }) || null
    );
  } catch (error) {
    console.error('Contentful алдаа:', error);
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const entry = await getProvinceFromContentful(id);
  // Contentful-д байхгүй аймгийн түр хуудсыг хайлтад оруулахгүй
  if (!entry) return { title: 'Аймгийн мэдээлэл', robots: { index: false } };

  const f = entry.fields as any;
  const name = f.title || f.name;
  const imgUrl = (f.image || f.coverImage)?.fields?.file?.url;
  return pageMetadata({
    title: `${name}: үзэх газрууд, аялах мэдээлэл`,
    description: truncate(
      richTextToPlain(f.description2 || f.description || f.description1) ||
        `${name}-д аялах гарын авлага: үзэх газрууд, төв, хүн ам, газар нутгийн мэдээлэл.`
    ),
    path: `/province/${id}`,
    image: imgUrl ? (imgUrl.startsWith('//') ? `https:${imgUrl}` : imgUrl) : undefined,
  });
}

export default async function ProvinceDetailPage({ params }: Props) {
  const { id } = await params;
  const contentfulEntry = await getProvinceFromContentful(id);

  let province: any = {};

  if (contentfulEntry) {
    const f = contentfulEntry.fields as any;
    const imgField = f.image || f.coverImage;
    const imgUrl = imgField?.fields?.file?.url;

    province = {
      name: f.title || f.name || 'Ховд аймаг',
      center: f.center || 'Жаргалант хот',
      population: f.population || '90,000+',
      area: f.area || '76,100 км²',
      image: imgUrl
        ? imgUrl.startsWith('//')
          ? `https:${imgUrl}`
          : imgUrl
        : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000',
      description: f.description2 || f.description || f.description1 || '',
      highlights: Array.isArray(f.highlights)
        ? f.highlights
        : ['Алтан Хөхий уул', 'Цамбагарав хайрхан', 'Хар-Ус нуур', 'Гурван цэнхэрийн агуй'],
    };
  } else {
    province = {
      name: `${id.toUpperCase().replace('-', ' ')} аймаг`,
      center: 'Төв суурин',
      population: 'Мэдээлэлгүй',
      area: 'Мэдээлэлгүй',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000',
      description: 'Энэхүү аймгийн дэлгэрэнгүй танилцуулга тун удахгүй Contentful дээр шинэчлэгдэн орох болно.',
      highlights: ['Байгалийн үзэсгэлэн', 'Түүх соёлын дурсгал'],
    };
  }

  // Энэ аймагт байрлах түүхэн өвийн газрууд (region талбарт аймгийн нэр орсон)
  const provinceStem = String(province.name).replace(/ аймаг$/, '');
  const placesHere = (await getHeritagePlaceCards())
    .filter((p) => p.region && p.region.includes(provinceStem))
    .slice(0, 3);

  // Холбоотой аялал, туршлага, үйлчилгээ: related_* талбар, байхгүй бол ижил аймаг
  const placeFields: any = contentfulEntry?.fields || {};
  const related = await getRelatedItems({
    experienceIds: linkIds(placeFields.relatedExperience),
    providerIds: linkIds(placeFields.relatedProvider),
    productIds: linkIds(placeFields.relatedProduct),
    provinceText: province.name,
  });

  // Хэрхэн зөв аялах (visitorGuidance)
  const guidance = contentfulEntry ? await getGuidanceFor(contentfulEntry.sys.id) : [];

  return (
    <PlaceTemplate
      image={{ src: province.image, alt: province.name }}
      title={province.name}
      back={{ href: '/#map', label: 'Нүүр хуудас руу буцах' }}
      analytics={{ content_type: 'province', content_id: id, province: province.name }}
      bookings={<RelatedBookings items={related} campaign="province" contentId={id} />}
      nav={[
        { id: 'overview', label: 'Тойм мэдээлэл' },
        { id: 'facts', label: 'Үзүүлэлтүүд' },
        { id: 'highlights', label: 'Үзэх газрууд' },
        { id: 'guide', label: 'Аяллын зөвлөгөө' },
      ]}
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
            {typeof province.description === 'object' ? (
              parseRichText(province.description)
            ) : (
              <p className="text-lg leading-relaxed whitespace-pre-line text-neutral-700 font-light">
                {province.description}
              </p>
            )}
          </div>
        </section>

        {/* Хэсэг 2: Тоон үзүүлэлтүүд */}
        <section id="facts" className="pt-16 scroll-mt-20 border-t border-neutral-100 mt-12">
          <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-6">
            Аймгийн үзүүлэлтүүд
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                Төв хот
              </span>
              <span className="text-xl font-medium text-neutral-900">{province.center}</span>
            </div>
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                Хүн ам
              </span>
              <span className="text-xl font-medium text-neutral-900">{province.population}</span>
            </div>
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60">
              <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                Газар нутаг
              </span>
              <span className="text-xl font-medium text-neutral-900">{province.area}</span>
            </div>
          </div>
        </section>

        {/* Хэсэг 3: Үзэх газрууд */}
        <section id="highlights" className="pt-16 scroll-mt-20 border-t border-neutral-100 mt-12">
          <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-6">
            Онцлох газрууд
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {province.highlights.map((spot: string, idx: number) => (
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

        {/* Хэсэг 4: Аяллын зөвлөмж */}
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

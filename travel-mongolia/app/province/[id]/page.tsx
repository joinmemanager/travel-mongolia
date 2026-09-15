import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/contentful';

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

async function getProvinceFromContentful(rawId: string) {
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

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* 1. HERO ХЭСЭГ: Зургийн яг голд байрлах цэвэрхэн гарчиг */}
      <section className="relative h-[72vh] min-h-[520px] w-full flex items-center justify-center">
        <Image
          src={province.image}
          alt={province.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* Зөөлөн харанхуй бүрхүүл */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Буцах товч */}
        <div className="absolute top-28 left-6 sm:left-12 lg:left-16 z-20">
          <Link
            href="/#map"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-md border border-white/10 transition-all text-xs sm:text-sm font-medium cursor-pointer"
          >
            <span>←</span>
            <span>Нүүр хуудас руу буцах</span>
          </Link>
        </div>

        {/* Гол гарчиг */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
            {province.name}
          </h1>
        </div>
      </section>

     {/* 2. SUB-NAVIGATION (Томруулсан, цэвэрхэн Arial/Sans фонттой цэс) */}
      <nav className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-center gap-8 sm:gap-14 overflow-x-auto py-5 text-base sm:text-lg font-normal font-sans tracking-tight text-neutral-600 no-scrollbar">
          <a
            href="#overview"
            className="hover:text-black transition-colors whitespace-nowrap font-medium"
          >
            Тойм мэдээлэл
          </a>
          <a
            href="#facts"
            className="hover:text-black transition-colors whitespace-nowrap font-medium"
          >
            Үзүүлэлтүүд
          </a>
          <a
            href="#highlights"
            className="hover:text-black transition-colors whitespace-nowrap font-medium"
          >
            Үзэх газрууд
          </a>
          <a
            href="#guide"
            className="hover:text-black transition-colors whitespace-nowrap font-medium"
          >
            Аяллын зөвлөгөө
          </a>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 sm:px-10">
        {/* Хэсэг 1: Ерөнхий танилцуулга */}
        <section id="overview" className="pt-16 scroll-mt-36">
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
        <section id="facts" className="pt-16 scroll-mt-36 border-t border-neutral-100 mt-12">
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
        <section id="highlights" className="pt-16 scroll-mt-36 border-t border-neutral-100 mt-12">
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
        <section id="guide" className="pt-16 scroll-mt-36 border-t border-neutral-100 mt-12">
          <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-4">
            Аялахад анхаарах зүйлс
          </h2>
          <p className="text-neutral-600 leading-relaxed font-light">
            Аялалд гарахаас өмнө цаг агаарын нөхцөл байдал, зам харгуй болон шатахуун түгээх станцын байршлыг урьдчилан судлахыг зөвлөж байна. Мөн орон нутгийн байгаль хамгаалагчидтай холбогдон тусгай хамгаалалттай газар нутгийн дэглэмтэй танилцаарай.
          </p>
        </section>
      </div>
    </main>
  );
}
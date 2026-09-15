import Image from 'next/image';
import React from 'react';

import { client } from '@/lib/contentful';

// Зургийн URL-ийг Contentful-ийн ямар ч бүтцээс алдаагүй гаргаж авах туслах функц
function getImageUrl(imageField: any): string {
  if (!imageField)
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200';

  // Хэрэв зураг нь массив (олон зураг) байвал хамгийн эхнийхийг авна
  const target = Array.isArray(imageField) ? imageField[0] : imageField;

  let url = target?.fields?.file?.url || target?.file?.url || '';

  if (typeof target === 'string') {
    url = target;
  }

  if (!url) {
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200';
  }

  return url.startsWith('//') ? `https:${url}` : url;
}

// Rich Text хөрвүүлэгч функц
function renderRichText(node: any): any {
  if (!node) return null;
  if (typeof node === 'string') return node;
  if (node.nodeType === 'text') return node.value;

  if (node.nodeType === 'paragraph') {
    return (
      <p className="mb-2 text-sm leading-relaxed text-neutral-600">
        {node.content?.map((child: any, idx: number) => (
          <React.Fragment key={idx}>{renderRichText(child)}</React.Fragment>
        ))}
      </p>
    );
  }

  if (Array.isArray(node.content)) {
    return node.content.map((child: any, idx: number) => (
      <React.Fragment key={idx}>{renderRichText(child)}</React.Fragment>
    ));
  }

  return null;
}

async function getFestivals() {
  try {
    const res = await client.getEntries({
      limit: 50,
    });

    const festivals = res.items.filter((item: any) => {
      const type = item.sys.contentType?.sys?.id?.toLowerCase() || '';
      const title = String(item.fields?.title || '').toLowerCase();
      return (
        type.includes('festival') ||
        type.includes('culture') ||
        type.includes('heritage') ||
        title.includes('наадам') ||
        title.includes('цагаан сар')
      );
    });

    // Хэрэв order дугаар байвал түүгээр нь эрэмбэлнэ
    return festivals.sort((a: any, b: any) => {
      const orderA = a.fields?.order ?? 99;
      const orderB = b.fields?.order ?? 99;
      return orderA - orderB;
    });
  } catch (err) {
    console.error('Festivals data fetch error:', err);
    return [];
  }
}

export default async function CultureFestivals() {
  const items = await getFestivals();

  return (
    <section className="py-20 px-6 mx-auto max-w-7xl">
      {/* Дээд гарчиг */}
      <div className="mb-12">
        <span className="text-xs font-bold tracking-widest text-[#15803d] uppercase">
          CULTURE & HERITAGE
        </span>
        <h2 className="mt-2 mb-4 text-3xl font-bold text-neutral-900 sm:text-4xl">
          Монголын Уламжлалт Баяр Наадам
        </h2>
        <p className="max-w-3xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Дэлхийд цор ганц нүүдэлчин түмний онцлог, эртний ёс заншил, улирлын
          мөчлөгт нийцсэн өвөрмөц баяруудыг өөрийн биеэр мэдрээрэй.
        </p>
      </div>

      {/* Картууд */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {items.map((item: any) => {
          const f = item.fields;

          // Энд зургаа ямар ч бүтцээс ухаж олох функцийг дуудаж байна:
          const fullImgUrl = getImageUrl(
            f.image || f.coverImage || f.thumbnail
          );

          return (
            <div
              key={item.sys.id}
              className="group flex overflow-hidden flex-col bg-white rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Зураг */}
              <div className="overflow-hidden relative w-full h-64 sm:h-72">
                <Image
                  src={fullImgUrl}
                  alt={f.title || 'Culture'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Шошгууд */}
                <div className="flex absolute inset-x-4 top-4 justify-between items-center pointer-events-none">
                  {f.tag && (
                    <span className="py-1.5 px-3 text-xs font-medium text-white bg-black/50 rounded-full border border-white/20 backdrop-blur-md">
                      {f.tag}
                    </span>
                  )}
                  {f.date && (
                    <span className="py-1.5 px-3 ml-auto text-xs font-semibold text-neutral-900 bg-white/90 rounded-full shadow-sm backdrop-blur-md">
                      🗓️ {f.date}
                    </span>
                  )}
                </div>

                {f.subtitle && (
                  <div className="absolute bottom-4 left-6">
                    <span className="text-[11px] font-bold tracking-widest text-white/80 uppercase">
                      {f.subtitle}
                    </span>
                  </div>
                )}
              </div>

              {/* Мэдээлэл */}
              <div className="flex flex-col flex-1 justify-between p-6 sm:p-8">
                <div>
                  <h3 className="mb-3 text-xl font-bold text-neutral-900 group-hover:text-[#15803d] transition-colors sm:text-2xl">
                    {f.title}
                  </h3>

                  <div className="text-sm leading-relaxed text-neutral-600 line-clamp-3">
                    {typeof f.description === 'object' ? (
                      renderRichText(f.description)
                    ) : (
                      <p>{f.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

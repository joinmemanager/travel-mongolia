import React from 'react';
import Image from 'next/image';
import { client } from '@/lib/contentful';

// Зургийн URL-ийг Contentful-ийн ямар ч бүтцээс алдаагүй гаргаж авах туслах функц
function getImageUrl(imageField: any): string {
  if (!imageField) return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200';

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
      <p className="text-neutral-600 text-sm leading-relaxed mb-2">
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
    <section className="max-w-7xl mx-auto px-6 py-20">
      {/* Дээд гарчиг */}
      <div className="mb-12">
        <span className="text-[#15803d] text-xs font-bold tracking-widest uppercase">
          CULTURE & HERITAGE
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mt-2 mb-4">
          Монголын Уламжлалт Баяр Наадам
        </h2>
        <p className="text-neutral-600 max-w-3xl text-sm sm:text-base leading-relaxed">
          Дэлхийд цор ганц нүүдэлчин түмний онцлог, эртний ёс заншил, улирлын мөчлөгт нийцсэн өвөрмөц баяруудыг өөрийн биеэр мэдрээрэй.
        </p>
      </div>

      {/* Картууд */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.map((item: any) => {
          const f = item.fields;
          
          // Энд зургаа ямар ч бүтцээс ухаж олох функцийг дуудаж байна:
          const fullImgUrl = getImageUrl(f.image || f.coverImage || f.thumbnail);

          return (
            <div 
              key={item.sys.id} 
              className="group bg-white rounded-3xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Зураг */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <Image
                  src={fullImgUrl}
                  alt={f.title || 'Culture'}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Шошгууд */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  {f.tag && (
                    <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
                      {f.tag}
                    </span>
                  )}
                  {f.date && (
                    <span className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-neutral-900 text-xs font-semibold shadow-sm ml-auto">
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
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3 group-hover:text-[#15803d] transition-colors">
                    {f.title}
                  </h3>
                  
                  <div className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
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
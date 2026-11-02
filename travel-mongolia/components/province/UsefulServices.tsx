import React from 'react';

import { getProvinceServices, SERVICE_LABEL, type ServiceType } from '@/lib/provinceServices';

// «Хэрэгтэй үйлчилгээ»: аймгийн шатахуун, эмнэлэг, эмийн сан, ЗДТГ. Мэдээлэлгүй аймагт юу ч гаргахгүй.
export default function UsefulServices({ provinceSlug }: { provinceSlug: string }) {
  const items = getProvinceServices(provinceSlug);
  if (items.length === 0) return null;
  const types = (Object.keys(SERVICE_LABEL) as ServiceType[]).filter((t) => items.some((x) => x.type === t));
  return (
    <section id="useful-services">
      <h2 className="pl-4 mb-2 text-2xl font-black tracking-tight border-l-4 border-[#15803d] text-neutral-900 sm:text-3xl">
        Хэрэгтэй үйлчилгээ
      </h2>
      <p className="mb-6 text-sm text-neutral-500">Эх сурвалж: joinme.mn. Утас, байршил зэрэг нь шинэчлэгдээгүй байж болно.</p>
      <div className="space-y-8">
        {types.map((t) => (
          <div key={t}>
            <h3 className="mb-3 text-lg font-bold text-neutral-900">
              {SERVICE_LABEL[t]} <span className="text-neutral-400">({items.filter((x) => x.type === t).length})</span>
            </h3>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items
                .filter((x) => x.type === t)
                .map((x) => (
                  <li key={x.id} className="flex gap-3 p-3 bg-white rounded-2xl border border-neutral-200">
                    {x.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={x.image} alt={x.name} loading="lazy" className="object-cover w-16 h-16 rounded-xl shrink-0 bg-neutral-100" />
                    )}
                    <div className="min-w-0 text-sm">
                      <p className="font-bold leading-snug text-neutral-900">{x.name}</p>
                      {(x.soum || x.location) && (
                        <p className="mt-0.5 text-xs text-neutral-500">{[x.soum && `${x.soum} сум`, x.location].filter(Boolean).join('. ')}</p>
                      )}
                      {x.phones.map((p) => (
                        <a key={p} href={`tel:+976${p}`} className="inline-block mt-1 mr-2 text-xs font-semibold text-[#15803d] hover:underline">
                          {p}
                        </a>
                      ))}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

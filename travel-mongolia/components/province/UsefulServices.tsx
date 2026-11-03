import Link from 'next/link';
import React from 'react';

import LazyServiceGroup from '@/components/services/LazyServiceGroup';
import ServiceCard from '@/components/services/ServiceCard';
import ServiceSources from '@/components/services/ServiceSources';
import { getProvinceServices } from '@/lib/provinceServices';
import { rankServices, SERVICE_LABEL, SERVICES_BASE, type ServiceType } from '@/lib/serviceTypes';

// Цөөн бол хуудсанд шууд, олон бол нээх үед нь ачаална
const INLINE_UP_TO = 12;

// «Хэрэгтэй үйлчилгээ»: аймгийн шатахуун, эмнэлэг, эмийн сан, цагдаа, банк, ЗДТГ. Мэдээлэлгүй аймагт юу ч гаргахгүй.
export default function UsefulServices({ provinceSlug }: { provinceSlug: string }) {
  const items = getProvinceServices(provinceSlug);
  if (items.length === 0) return null;
  const types = (Object.keys(SERVICE_LABEL) as ServiceType[]).filter((t) => items.some((x) => x.type === t));
  const ranked = rankServices(items.map((x) => ({ ...x, aimag: provinceSlug })));
  return (
    <section id="useful-services" className="scroll-mt-28">
      <h2 className="pl-4 mb-2 text-2xl font-black tracking-tight border-l-4 border-[#15803d] text-neutral-900 sm:text-3xl">
        Хэрэгтэй үйлчилгээ
      </h2>
      <ServiceSources
        joinme={items.some((x) => !x.source)}
        osm={items.some((x) => x.source === 'osm')}
        className="mb-6 text-sm text-neutral-500"
      />
      <div className="space-y-4">
        {types.map((t) => {
          const list = ranked.filter((x) => x.type === t);
          if (list.length > INLINE_UP_TO) {
            return <LazyServiceGroup key={t} slug={provinceSlug} type={t} label={SERVICE_LABEL[t]} count={list.length} />;
          }
          return (
            <details key={t} open className="group">
              <summary className="flex gap-2 items-center py-2 text-lg font-bold list-none cursor-pointer text-neutral-900">
                <span aria-hidden="true" className="text-neutral-400 transition-transform group-open:rotate-90">›</span>
                {SERVICE_LABEL[t]} <span className="text-neutral-400">({list.length})</span>
              </summary>
              <ul className="grid grid-cols-1 gap-3 mt-2 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((x) => (
                  <ServiceCard key={x.id} item={x} />
                ))}
              </ul>
            </details>
          );
        })}
      </div>
      <p className="mt-6">
        <Link href={`${SERVICES_BASE}?aimag=${provinceSlug}`} className="font-semibold text-[#15803d] hover:underline">
          Бүх аймгийн хэрэгтэй үйлчилгээ →
        </Link>
      </p>
    </section>
  );
}

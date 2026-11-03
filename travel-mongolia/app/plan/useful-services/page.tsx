import React from 'react';

import LinkCard from '@/components/design/LinkCard';
import HubHeader from '@/components/HubHeader';
import ServicesDirectory, { type ServiceRow } from '@/components/services/ServicesDirectory';
import { metaFor } from '@/lib/pageMeta';
import { PROVINCE_FACTS } from '@/lib/provinceFacts';
import { getProvinceServices, SERVICE_PROVINCES } from '@/lib/provinceServices';
import { SERVICE_LABEL, SERVICES_BASE, type ServiceType } from '@/lib/serviceTypes';

// «Хэрэгтэй үйлчилгээ»: аймгуудын шатахуун, эмнэлэг, эмийн сан, цагдаа, банк, ЗДТГ-ын лавлах (data/services/, Contentful биш).
// ?aimag=, ?type= нь ?cat=-ийн адил хуудас доторх шүүлтүүр (docs/plan/section-layout.md 3.1): canonical нь query-гүй (metaFor), sitemap-д орохгүй.
export const metadata = metaFor('/plan/useful-services');

const TYPE_ORDER = Object.keys(SERVICE_LABEL) as ServiceType[];

export default function UsefulServicesPage() {
  const aimags = SERVICE_PROVINCES
    .map((slug) => ({ slug, name: PROVINCE_FACTS[slug]?.name || slug }))
    .sort((a, b) => a.name.localeCompare(b.name, 'mn'));
  const rows: ServiceRow[] = aimags.flatMap((a) =>
    getProvinceServices(a.slug)
      .map((x) => ({ ...x, aimag: a.slug }))
      .sort((x, y) => TYPE_ORDER.indexOf(x.type) - TYPE_ORDER.indexOf(y.type) || x.name.localeCompare(y.name, 'mn'))
  );
  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-24">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Хэрэгтэй үйлчилгээ', href: SERVICES_BASE },
        ]}
        kicker="АЯЛЛАА ТӨЛӨВЛӨХ"
        kickerEn="USEFUL SERVICES"
        title="Хэрэгтэй үйлчилгээ"
        intro="Аймаг бүрийн шатахуун түгээх станц, эмнэлэг, эмийн сан, цагдаа, банк, АТМ. Аймаг, төрлөөр нь шүүж, байршлыг газрын зургаас хараарай."
      />
      <div className="px-6 pt-10 mx-auto space-y-16 max-w-7xl sm:px-12 lg:px-16">
        <ServicesDirectory rows={rows} aimags={aimags} />
        <LinkCard
          title="Холбогдох хуудсууд"
          columns={3}
          links={[
            { label: 'Аяллын үйлчилгээ: компани, хөтөч, жолооч', href: '/plan/services' },
            { label: 'Байрлах газар', href: '/plan/accommodation' },
            { label: 'Аюулгүй байдал', href: '/plan/safety-info' },
          ]}
        />
      </div>
    </main>
  );
}

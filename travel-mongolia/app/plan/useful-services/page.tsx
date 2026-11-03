import React from 'react';

import LinkCard from '@/components/design/LinkCard';
import HubHeader from '@/components/HubHeader';
import ServicesDirectory, { type AimagSummary } from '@/components/services/ServicesDirectory';
import { metaFor } from '@/lib/pageMeta';
import { PROVINCE_FACTS } from '@/lib/provinceFacts';
import { getProvinceServices, SERVICE_PROVINCES } from '@/lib/provinceServices';
import { rankServices, SERVICES_BASE, type ServiceRow, type ServiceType } from '@/lib/serviceTypes';

// «Хэрэгтэй үйлчилгээ»: аймгуудын шатахуун, эмнэлэг, эмийн сан, цагдаа, банк, ЗДТГ-ын лавлах (data/services/, Contentful биш).
// ?aimag=, ?type= нь ?cat=-ийн адил хуудас доторх шүүлтүүр (docs/plan/section-layout.md 3.1): canonical нь query-гүй (metaFor), sitemap-д орохгүй.
// Хуудсанд эхний 60 мөр, тоо л орно; бусдыг client аймгийн JSON-оос ачаална.
export const metadata = metaFor('/plan/useful-services');

const INITIAL_ROWS = 60;

export default function UsefulServicesPage() {
  const slugs = SERVICE_PROVINCES
    .map((slug) => ({ slug, name: PROVINCE_FACTS[slug]?.name || slug }))
    .sort((a, b) => a.name.localeCompare(b.name, 'mn'));
  const aimags: AimagSummary[] = slugs.map((a) => ({
    ...a,
    counts: getProvinceServices(a.slug).reduce<Partial<Record<ServiceType, number>>>((o, x) => {
      o[x.type] = (o[x.type] || 0) + 1;
      return o;
    }, {}),
  }));
  const rows: ServiceRow[] = slugs.flatMap((a) => getProvinceServices(a.slug).map((x) => ({ ...x, aimag: a.slug })));
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
        <ServicesDirectory initial={rankServices(rows).slice(0, INITIAL_ROWS)} aimags={aimags} />
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

import React from 'react';

import DarkPanel from '@/components/design/DarkPanel';
import LinkCard from '@/components/design/LinkCard';
import PatternBand from '@/components/design/PatternBand';
import HubHeader from '@/components/HubHeader';
import { IMPACT_HUB as hub, partnerMailto } from '@/lib/impactData';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { getProvinceLinks } from '@/lib/provinces';

// "Үр өгөөж & түншлэл" hub (ia-plan.md C14, 5г). Төлөв: draft (цэсний 5 зүйл).
// /impact/* дэд хуудсын оронд нэг хуудас, 5 хэсэг. Цэс хэсэг бүр рүү anchor-оор заана.
// НООРОГ текст: lib/impactData.ts
export const metadata = metaFor('/impact');

const SECTIONS = [
  { id: 'local-impact', title: hub.localImpact.title },
  { id: 'projects', title: hub.projects.title },
  { id: 'provinces', title: hub.provinces.title },
  { id: 'businesses', title: hub.businesses.title },
  { id: 'donors', title: hub.donors.title },
];

function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: number;
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-28 bg-white p-8 sm:p-10 rounded-3xl border border-neutral-200/80 shadow-sm"
    >
      <span className="block mb-2 text-[11px] font-mono font-bold text-[#15803d]">
        {String(index).padStart(2, '0')}
      </span>
      <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-4">{title}</h2>
      <p className="mb-6 text-sm text-neutral-600 leading-relaxed max-w-3xl">{intro}</p>
      {children}
    </section>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center p-6 min-h-24 rounded-2xl border border-dashed border-neutral-300 text-sm text-neutral-500">
      {text}
    </div>
  );
}

function PartnerButton({ label, subject }: { label: string; subject: string }) {
  return (
    <a
      href={partnerMailto(subject)}
      className="inline-flex gap-2 items-center py-3 px-6 text-sm font-bold text-white bg-neutral-900 hover:bg-[#15803d] rounded-full transition-colors"
    >
      {label}
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default async function ImpactHubPage() {
  // Аймгийн хуудсууд live биш болбол production дээр харагдахгүй
  const provinces = (await getProvinceLinks()).filter((p) => liveHref(p.href));

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Үр өгөөж & түншлэл', href: '/impact' },
        ]}
        kicker={hub.kicker}
        kickerEn={hub.kickerEn}
        title={hub.title}
        intro={hub.intro}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 flex flex-col lg:flex-row gap-12 items-start">
        {/* Зүүн талын хэсгийн жагсаалт */}
        <aside className="hidden lg:block w-64 shrink-0 sticky top-28 space-y-2 bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block mb-3 px-2">
            Хэсгүүд
          </span>
          <nav className="space-y-1">
            {SECTIONS.map((sec, i) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all"
              >
                {String(i + 1).padStart(2, '0')}. {sec.title}
              </a>
            ))}
          </nav>
        </aside>

        <div className="flex-1 w-full space-y-16">
          {/* 01. Орон нутгийн үр өгөөж: зөвхөн үзүүлэлтийн нэр, тоо зохиохгүй */}
          <Section id="local-impact" index={1} title={hub.localImpact.title} intro={hub.localImpact.intro}>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {hub.localImpact.metrics.map((metric) => (
                <li
                  key={metric}
                  className="p-6 rounded-2xl bg-[#fcfbf9] border border-neutral-200"
                >
                  <span className="block mb-2 text-sm font-bold text-neutral-900">{metric}</span>
                  <span className="text-xs font-semibold text-neutral-400">Мэдээлэл удахгүй</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 02. Түншлэлийн төслүүд */}
          <Section id="projects" index={2} title={hub.projects.title} intro={hub.projects.intro}>
            <div className="space-y-6">
              <EmptyNote text={hub.projects.empty} />
              <PartnerButton label={hub.projects.cta} subject={hub.projects.mailSubject} />
            </div>
          </Section>

          {/* 03. Аймаг, DMO: Contentful-ын аймгууд автоматаар */}
          <Section id="provinces" index={3} title={hub.provinces.title} intro={hub.provinces.intro}>
            {provinces.length > 0 ? (
              // Холбоосны карт (components/design/LinkCard)
              <LinkCard
                bare
                columns={3}
                links={provinces.map((p) => ({ label: p.title, href: p.href, desc: p.center }))}
              />
            ) : (
              <EmptyNote text={hub.provinces.empty} />
            )}
          </Section>

          {/* 04. Аяллын бизнес */}
          <Section id="businesses" index={4} title={hub.businesses.title} intro={hub.businesses.intro}>
            <PartnerButton label={hub.businesses.cta} subject={hub.businesses.mailSubject} />
          </Section>

          {/* 05. Хандивлагч, хөрөнгө оруулагч: бараан ногоон самбар */}
          <DarkPanel
            id="donors"
            title={hub.donors.title}
            intro={hub.donors.intro}
            items={hub.donors.outcomes}
          />
        </div>
      </div>

      {/* Хээтэй тууз: footer-ийн яг дээр */}
      <div className="mt-32">
        <PatternBand />
      </div>
    </main>
  );
}

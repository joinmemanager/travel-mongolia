import Link from 'next/link';
import React from 'react';

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
      // Цагаан болон цайвар ногоон дэвсгэрийг ээлжлэн, дээд талдаа ногоон зураас
      className={`scroll-mt-28 p-8 sm:p-10 rounded-3xl border border-t-4 border-brand-100 border-t-brand-600 shadow-sm ${
        index % 2 === 1 ? 'bg-white' : 'bg-brand-50'
      }`}
    >
      <div className="flex gap-4 items-center mb-4">
        <span className="flex justify-center items-center w-10 h-10 shrink-0 text-sm font-black text-brand-800 bg-brand-100 rounded-full">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-brand-950">{title}</h2>
      </div>
      <p className="mb-6 text-sm text-neutral-700 leading-relaxed max-w-3xl">{intro}</p>
      {children}
    </section>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center p-6 min-h-24 rounded-2xl border-2 border-dashed border-brand-200 bg-white text-sm font-semibold text-brand-800">
      {text}
    </div>
  );
}

function PartnerButton({ label, subject }: { label: string; subject: string }) {
  return (
    <a href={partnerMailto(subject)} className="btn-primary">
      {label}
      <span aria-hidden="true">→</span>
    </a>
  );
}

export default async function ImpactHubPage() {
  // Аймгийн хуудсууд live биш болбол production дээр харагдахгүй
  const provinces = (await getProvinceLinks()).filter((p) => liveHref(p.href));

  return (
    <main className="min-h-screen bg-brand-50 text-neutral-900 pb-32">
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
        <aside className="hidden lg:block w-64 shrink-0 sticky top-28 space-y-2 bg-white p-5 rounded-2xl border border-brand-100 shadow-sm">
          <span className="text-[10px] font-bold tracking-widest text-brand-800 uppercase block mb-3 px-2">
            Хэсгүүд
          </span>
          <nav className="space-y-1">
            {SECTIONS.map((sec, i) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-brand-50 hover:text-brand-800 transition-all"
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
                  className="flex gap-4 items-start p-6 rounded-2xl bg-white border border-brand-100"
                >
                  {/* Цайвар ногоон дугуй дэвсгэртэй icon */}
                  <span
                    aria-hidden="true"
                    className="flex justify-center items-center w-10 h-10 shrink-0 bg-brand-100 rounded-full"
                  >
                    <svg className="w-5 h-5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-4 3 3 5-6" />
                    </svg>
                  </span>
                  <span>
                    <span className="block mb-1 text-sm font-bold text-brand-950">{metric}</span>
                    {/* Тоо зохиохгүй: бодит өгөгдөл цугларахаас өмнө */}
                    <span className="text-xs font-semibold text-neutral-600">Мэдээлэл удахгүй</span>
                  </span>
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
              <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {provinces.map((p) => (
                  <li key={p.href}>
                    <Link
                      href={p.href}
                      className="group block p-5 h-full rounded-2xl bg-white border border-brand-100 hover:border-brand-600 hover:shadow-lg hover:shadow-brand-900/10 transition-all"
                    >
                      <span className="block font-bold text-brand-950 group-hover:text-brand-700 transition-colors">
                        {p.title}
                      </span>
                      {p.center && (
                        <span className="block mt-1 text-xs text-neutral-600">{p.center}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyNote text={hub.provinces.empty} />
            )}
          </Section>

          {/* 04. Аяллын бизнес */}
          <Section id="businesses" index={4} title={hub.businesses.title} intro={hub.businesses.intro}>
            <PartnerButton label={hub.businesses.cta} subject={hub.businesses.mailSubject} />
          </Section>

          {/* 05. Хандивлагч, хөрөнгө оруулагч */}
          <Section id="donors" index={5} title={hub.donors.title} intro={hub.donors.intro}>
            <ol className="space-y-4">
              {hub.donors.outcomes.map((outcome, i) => (
                <li key={outcome.title} className="flex gap-4">
                  <span className="flex justify-center items-center w-9 h-9 shrink-0 text-sm font-black text-white bg-brand-700 rounded-full tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-brand-950">{outcome.title}</h3>
                    <p className="text-sm text-neutral-700 leading-relaxed">{outcome.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Section>
        </div>
      </div>
    </main>
  );
}

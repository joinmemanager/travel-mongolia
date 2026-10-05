import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import HubHeader from '@/components/HubHeader';
import SectionHeading from '@/components/SectionHeading';
import { IMPACT_HUB as hub, partnerMailto } from '@/lib/impactData';
import { IMAGES, type SiteImage } from '@/lib/images';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { getProvinceLinks } from '@/lib/provinces';

// "Үр өгөөж & түншлэл" hub (ia-plan.md C14, 5г). Төлөв: draft (цэсний 5 зүйл).
// /impact/* дэд хуудсын оронд нэг хуудас, 5 хэсэг. Цэс хэсэг бүр рүү anchor-оор заана.
// НООРОГ текст: lib/impactData.ts. Загвар: "Монгол сэтгүүл" (docs/plan/design-brief.md).
export const metadata = metaFor('/impact');

const SECTIONS = [
  { id: 'local-impact', title: hub.localImpact.title },
  { id: 'projects', title: hub.projects.title },
  { id: 'provinces', title: hub.provinces.title },
  { id: 'businesses', title: hub.businesses.title },
  { id: 'donors', title: hub.donors.title },
];

// Зураг ба текст ээлжилсэн мөр. Хэсгүүд цөцгий ба цагаан дэвсгэрийг ээлжлэн.
function Row({
  id,
  index,
  title,
  intro,
  image,
  children,
}: {
  id: string;
  index: number;
  title: string;
  intro: string;
  image: SiteImage;
  children?: React.ReactNode;
}) {
  const imageRight = index % 2 === 0;
  return (
    <section id={id} className={`scroll-mt-24 py-20 ${index % 2 === 1 ? 'bg-cream' : 'bg-white'}`}>
      <div className="grid grid-cols-1 gap-10 items-start px-6 mx-auto max-w-[1200px] sm:px-10 lg:grid-cols-2 lg:gap-16">
        <div
          className={`overflow-hidden relative rounded-xl aspect-[3/2] lg:sticky lg:top-28 ${
            imageRight ? 'lg:order-2' : ''
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
        <div>
          <SectionHeading eyebrow={String(index).padStart(2, '0')} title={title} />
          <p className="mt-6 mb-8 text-base leading-relaxed text-ink-muted">{intro}</p>
          {children}
        </div>
      </div>
    </section>
  );
}

function EmptyNote({ text }: { text: string }) {
  return (
    <div className="flex justify-center items-center p-6 min-h-24 text-sm text-ink-muted rounded-xl border border-dashed border-ink/20">
      {text}
    </div>
  );
}

function PartnerButton({ label, subject }: { label: string; subject: string }) {
  return (
    <a
      href={partnerMailto(subject)}
      className="group inline-flex gap-2 items-center py-3 px-6 text-sm font-semibold text-cream bg-night rounded-xl hover:bg-ink transition-colors"
    >
      {label}
      <span aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-1">→</span>
    </a>
  );
}

export default async function ImpactHubPage() {
  // Аймгийн хуудсууд live биш болбол production дээр харагдахгүй
  const provinces = (await getProvinceLinks()).filter((p) => liveHref(p.href));

  return (
    <main className="min-h-screen bg-cream text-ink">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Үр өгөөж & түншлэл', href: '/impact' },
        ]}
        kicker={hub.kicker}
        kickerEn={hub.kickerEn}
        title={hub.title}
        intro={hub.intro}
        image={IMAGES.herderBoy}
      />

      {/* Хэсгүүдийн жагсаалт */}
      <nav aria-label="Хэсгүүд" className="bg-white border-b border-ink/10">
        <div className="flex overflow-x-auto gap-8 px-6 py-4 mx-auto max-w-[1200px] text-sm whitespace-nowrap sm:px-10 no-scrollbar">
          {SECTIONS.map((sec, i) => (
            <a key={sec.id} href={`#${sec.id}`} className="text-ink-muted hover:text-ink transition-colors">
              <span className="mr-1.5 font-serif text-gold-ink">{i + 1}.</span>
              {sec.title}
            </a>
          ))}
        </div>
      </nav>

      {/* 01. Орон нутгийн үр өгөөж: зөвхөн үзүүлэлтийн нэр, тоо зохиохгүй */}
      <Row id="local-impact" index={1} title={hub.localImpact.title} intro={hub.localImpact.intro} image={IMAGES.herdSnow}>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hub.localImpact.metrics.map((metric) => (
            <li key={metric} className="p-6 bg-white rounded-xl border border-ink/10">
              <span className="block mb-3 font-serif text-lg font-bold leading-snug text-ink">{metric}</span>
              <span className="text-[11px] font-semibold tracking-[0.2em] text-gold-ink uppercase">
                Мэдээлэл удахгүй
              </span>
            </li>
          ))}
        </ul>
      </Row>

      {/* 02. Түншлэлийн төслүүд */}
      <Row id="projects" index={2} title={hub.projects.title} intro={hub.projects.intro} image={IMAGES.gerCamp}>
        <div className="space-y-6">
          <EmptyNote text={hub.projects.empty} />
          <PartnerButton label={hub.projects.cta} subject={hub.projects.mailSubject} />
        </div>
      </Row>

      {/* 03. Аймаг, DMO: Contentful-ын аймгууд автоматаар */}
      <Row id="provinces" index={3} title={hub.provinces.title} intro={hub.provinces.intro} image={IMAGES.whiteHorse}>
        {provinces.length > 0 ? (
          <ul className="grid grid-cols-2 gap-4">
            {provinces.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group block p-5 h-full bg-white rounded-xl border border-ink/10 hover:border-gold transition-colors"
                >
                  <span className="block font-serif text-lg font-bold text-ink">{p.title}</span>
                  {p.center && <span className="block mt-1 text-xs text-ink-muted">{p.center}</span>}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote text={hub.provinces.empty} />
        )}
      </Row>

      {/* 04. Аяллын бизнес */}
      <Row id="businesses" index={4} title={hub.businesses.title} intro={hub.businesses.intro} image={IMAGES.lakeGers}>
        <PartnerButton label={hub.businesses.cta} subject={hub.businesses.mailSubject} />
      </Row>

      {/* 05. Хандивлагч, хөрөнгө оруулагч: бараан хэсэг */}
      <section id="donors" className="scroll-mt-24 py-20 bg-night">
        <div className="px-6 mx-auto max-w-[1200px] sm:px-10">
          <SectionHeading eyebrow="05" title={hub.donors.title} tone="dark" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-night-muted">{hub.donors.intro}</p>
          <ol className="grid grid-cols-1 gap-x-12 gap-y-10 mt-12 md:grid-cols-2">
            {hub.donors.outcomes.map((outcome, i) => (
              <li key={outcome.title} className="flex gap-5">
                <span className="font-serif text-3xl font-bold leading-none text-gold tabular-nums">{i + 1}</span>
                <div>
                  <h3 className="mb-1 font-serif text-lg font-bold text-white">{outcome.title}</h3>
                  <p className="text-sm leading-relaxed text-night-muted">{outcome.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}

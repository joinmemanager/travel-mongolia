import Link from 'next/link';
import React from 'react';

import { JOINME_BOOKING_URL } from '@/lib/localContent';
import { liveHref } from '@/lib/navigation';

// Profile / Experience / Event / Story загваруудын нийтлэг хэсгүүд (PlaceTemplate дотор).

// Нэг агуулгын хэсэг: гарчиг + агуулга. Агуулгагүй бол харагдахгүй.
export function InfoBlock({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  if (!children || (Array.isArray(children) && children.filter(Boolean).length === 0)) return null;
  return (
    <section id={id} className="scroll-mt-28 mb-12">
      <h2 className="mb-4 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">{title}</h2>
      <div className="text-neutral-700">{children}</div>
    </section>
  );
}

// Цэгтэй жагсаалт
export function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-relaxed">
          <span aria-hidden="true" className="mt-2.5 w-1.5 h-1.5 shrink-0 rounded-full bg-[#15803d]" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

// Баруун талын товч мэдээлэл: зөвхөн утгатай мөрүүд + "Захиалах" товч
export function FactsCard({
  facts,
  bookingUrl,
  bookingLabel = 'Захиалах',
}: {
  facts: { label: string; value?: React.ReactNode }[];
  bookingUrl?: string;
  bookingLabel?: string;
}) {
  const rows = facts.filter((f) => f.value);
  const href = bookingUrl || JOINME_BOOKING_URL;
  return (
    <div className="lg:sticky lg:top-28 p-6 rounded-2xl border border-neutral-200 bg-[#fcfbf9] space-y-5">
      {rows.length > 0 && (
        <dl className="space-y-4">
          {rows.map((f) => (
            <div key={f.label}>
              <dt className="text-[11px] font-bold tracking-wider text-neutral-400 uppercase">{f.label}</dt>
              <dd className="mt-0.5 text-sm font-semibold text-neutral-900">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex justify-between items-center py-3 px-5 w-full text-sm font-bold text-white bg-[#15803d] hover:bg-emerald-800 rounded-full transition-colors"
      >
        <span>{bookingLabel}</span>
        <span aria-hidden="true">↗</span>
      </a>
      {!bookingUrl && <p className="text-xs text-neutral-500">Захиалга joinme.mn дээр хийгдэнэ.</p>}
    </div>
  );
}

// "Local & Responsible Choice" тэмдэгүүд (баримт бичгийн 9-р хэсэг)
export function ChoiceBadges({ badges }: { badges: { label: string; desc: string }[] }) {
  if (badges.length === 0) return null;
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {badges.map((b) => (
        <li key={b.label} className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/60">
          <span className="flex gap-2 items-center text-sm font-bold text-[#15803d]">
            <span aria-hidden="true">✓</span>
            {b.label}
          </span>
          <span className="block mt-1 text-xs leading-relaxed text-neutral-600">{b.desc}</span>
        </li>
      ))}
    </ul>
  );
}

// Холбогдсон entry-ийн нэр. Production дээр нийтлэгдээгүй хуудас руу бол холбоосгүй текст.
export function RefLink({ href, title }: { href: string; title: string }) {
  if (!liveHref(href)) return <>{title}</>;
  return (
    <Link href={href} className="text-[#15803d] hover:underline">
      {title}
    </Link>
  );
}

// "Хэрхэн зөв аялах": тухайн газарт холбогдсон visitorGuidance entry-үүд (баримт бичгийн 7, 8-р хэсэг).
// Entry байхгүй бол юу ч харагдахгүй.
export function GuidanceBlock({
  items,
}: {
  items: { id: string; culturalEtiquette: string[]; natureGuidance: string[]; safety: string[]; season: string; source: string }[];
}) {
  if (items.length === 0) return null;
  const groups = [
    { title: 'Соёлын ёс', points: items.flatMap((g) => g.culturalEtiquette) },
    { title: 'Байгаль хамгаалал', points: items.flatMap((g) => g.natureGuidance) },
    { title: 'Аюулгүй байдал', points: items.flatMap((g) => g.safety) },
  ].filter((g) => g.points.length > 0);
  const sources = items.map((g) => g.source).filter(Boolean);
  return (
    <InfoBlock id="guidance" title="Хэрхэн зөв аялах">
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.title}>
            <h3 className="mb-3 text-sm font-bold tracking-wider text-[#15803d] uppercase">{g.title}</h3>
            <BulletList items={g.points} />
          </div>
        ))}
        {sources.length > 0 && <p className="text-xs text-neutral-500">Эх сурвалж: {sources.join('; ')}</p>}
      </div>
    </InfoBlock>
  );
}

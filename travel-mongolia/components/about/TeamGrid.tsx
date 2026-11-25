'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';

import type { TeamGroup, TeamMember } from '@/data/team';

// /about-us-ийн хүмүүсийн сүлжээ: дугуй зураг (байхгүй/ачаалагдахгүй бол нэрийн эхний үсэг), нэр, албан тушаал,
// имэйл (mailto). Карт дээр дарахад танилцуулгатай жижиг цонх (<dialog>: Esc, гадна дарахад хаагдана). Зургийн
// хэмжээ тогтмол (next/image fill + тогтмол хайрцаг) тул CLS 0. Нэрийг Google Translate орчуулахгүй.
// Одоогоор зөвхөн mn талбарууд гарна (main дээр англи route байхгүй, data/team.ts).

// Аватар ≤112px: хамгийн жижиг эх зураг 400px тул 2x дэлгэцэнд ч сунгагдахгүй
const LAYOUT: Record<TeamGroup, { grid: string; avatar: string; initials: string; sizes: string }> = {
  executive: {
    grid: 'grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6',
    avatar: 'w-24 h-24 md:w-28 md:h-28',
    initials: 'text-2xl md:text-3xl',
    sizes: '112px',
  },
  creative: {
    grid: 'grid-cols-2 gap-x-6 gap-y-10 mx-auto max-w-4xl md:grid-cols-4',
    avatar: 'w-24 h-24 md:w-28 md:h-28',
    initials: 'text-2xl md:text-3xl',
    sizes: '112px',
  },
};

// «Э. Цоморлиг» → «ЭЦ»
const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function Avatar({ member, className, initialsClass, sizes }: { member: TeamMember; className: string; initialsClass: string; sizes: string }) {
  const [failed, setFailed] = useState(false);
  const name = member.name.mn;
  return (
    <span className={`relative flex shrink-0 justify-center items-center overflow-hidden rounded-full bg-[#14532d]/10 ${className}`}>
      {member.photo && !failed ? (
        <Image src={member.photo} alt={name} fill sizes={sizes} className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true" translate="no" className={`notranslate font-extrabold text-[#14532d] ${initialsClass}`}>
          {initialsOf(name)}
        </span>
      )}
    </span>
  );
}

function EmailLink({ email, className = '' }: { email: string; className?: string }) {
  return (
    <a
      href={`mailto:${email}`}
      translate="no"
      className={`notranslate inline-block max-w-full text-xs sm:text-sm text-neutral-600 underline decoration-neutral-300 underline-offset-2 break-all hover:text-[#15803d] hover:decoration-[#15803d] ${className}`}
    >
      {email}
    </a>
  );
}

export default function TeamGrid({ members, group }: { members: TeamMember[]; group: TeamGroup }) {
  const layout = LAYOUT[group];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<TeamMember | null>(null);

  const openMember = (m: TeamMember) => {
    setActive(m);
    dialogRef.current?.showModal();
  };

  return (
    <>
      <ul className={`grid ${layout.grid}`}>
        {members.map((m) => (
          <li key={m.id} className="flex flex-col items-center text-center">
            <button
              type="button"
              onClick={() => openMember(m)}
              aria-haspopup="dialog"
              className="group flex flex-col items-center w-full text-center rounded-2xl outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[#15803d]"
            >
              <Avatar
                member={m}
                className={`${layout.avatar} ring-4 ring-white shadow-sm transition-transform group-hover:scale-105`}
                initialsClass={layout.initials}
                sizes={layout.sizes}
              />
              <span translate="no" className="notranslate mt-3 font-bold leading-tight text-neutral-900 group-hover:text-[#15803d]">
                {m.name.mn}
              </span>
              <span className="mt-1 text-sm font-semibold text-[#15803d]">{m.role.mn}</span>
            </button>
            {m.email && <EmailLink email={m.email} className="mt-1" />}
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby={`team-dialog-${group}`}
        onClose={() => setActive(null)}
        onClick={(e) => {
          // Цонхны гадна (backdrop) дарахад хаана
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="p-0 m-auto w-[min(30rem,calc(100vw-2rem))] max-h-[calc(100dvh-2rem)] overflow-y-auto border-0 outline-none rounded-3xl shadow-2xl backdrop:bg-black/50"
      >
        {active && (
          <div className="relative p-7 text-center">
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              aria-label="Хаах"
              className="flex absolute top-3 right-3 justify-center items-center w-9 h-9 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Avatar key={active.id} member={active} className="mx-auto w-24 h-24" initialsClass="text-2xl" sizes="96px" />
            <h3 id={`team-dialog-${group}`} translate="no" className="notranslate mt-4 text-xl font-extrabold text-neutral-900">
              {active.name.mn}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#15803d]">{active.role.mn}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-left text-neutral-700">{active.bio.mn}</p>
            {active.email && <EmailLink email={active.email} className="mt-4" />}
          </div>
        )}
      </dialog>
    </>
  );
}

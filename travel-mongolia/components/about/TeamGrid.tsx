'use client';

import Image from 'next/image';
import React, { useRef, useState } from 'react';

import type { TeamGroup, TeamMember } from '@/data/team';

// /about-us-ийн хүмүүсийн сүлжээ: дугуй зураг (байхгүй бол нэрийн эхний үсэг), нэр, албан тушаал.
// Карт дээр дарахад танилцуулгатай жижиг цонх (<dialog>: Esc, гадна дарахад хаагдана). Зургийн хэмжээ
// тогтмол (next/image fill + тогтмол хайрцаг) тул CLS 0. Нэрийг Google Translate орчуулахгүй.

const LAYOUT: Record<TeamGroup, { grid: string; avatar: string; initials: string; sizes: string }> = {
  advisor: { grid: 'grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-5', avatar: 'w-28 h-28', initials: 'text-3xl', sizes: '112px' },
  team: { grid: 'grid-cols-2 gap-x-6 gap-y-9 md:grid-cols-5', avatar: 'w-24 h-24', initials: 'text-2xl', sizes: '96px' },
  creator: { grid: 'grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-6', avatar: 'w-20 h-20', initials: 'text-xl', sizes: '80px' },
};

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function Avatar({ member, className, initialsClass, sizes }: { member: TeamMember; className: string; initialsClass: string; sizes: string }) {
  return (
    <span className={`relative flex shrink-0 justify-center items-center overflow-hidden rounded-full bg-[#14532d]/10 ${className}`}>
      {member.photo ? (
        <Image src={member.photo} alt={member.name} fill sizes={sizes} className="object-cover" />
      ) : (
        <span aria-hidden="true" translate="no" className={`notranslate font-extrabold text-[#14532d] ${initialsClass}`}>
          {initialsOf(member.name)}
        </span>
      )}
    </span>
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
          <li key={m.id}>
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
                {m.name}
              </span>
              <span className="mt-1 text-sm font-semibold text-[#15803d]">{m.role}</span>
            </button>
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
        className="p-0 m-auto w-[min(26rem,calc(100vw-2rem))] border-0 outline-none rounded-3xl shadow-2xl backdrop:bg-black/50"
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
            <Avatar member={active} className="mx-auto w-24 h-24" initialsClass="text-2xl" sizes="96px" />
            <h3 id={`team-dialog-${group}`} translate="no" className="notranslate mt-4 text-xl font-extrabold text-neutral-900">
              {active.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[#15803d]">{active.role}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-neutral-700">{active.bio}</p>
          </div>
        )}
      </dialog>
    </>
  );
}

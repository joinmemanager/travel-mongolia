'use client';

import React, { useState } from 'react';

import ComingSoon from '@/components/design/ComingSoon';
import ImageCard from '@/components/design/ImageCard';
import type { SiteImage } from '@/lib/images';
import { inviteSubject, LOCAL_INVITES } from '@/lib/localInvites';

export interface HubProviderCard {
  id: string;
  href: string;
  name: string;
  province: string;
  image?: SiteImage;
  localOwned: boolean;
  community: boolean;
  // "[ЖИШЭЭ]" entry (зөвхөн preview дээр ирнэ, ангиллыг хоосон гэж тооцоход ордоггүй)
  isSample: boolean;
}

export interface HubSection {
  id: string;
  title: string;
  href?: string;
  items: HubProviderCard[];
  // Хоосон үеийн урилга (lib/localInvites.ts)
  inviteKey: string;
}

const FILTERS = [
  { id: 'localOwned', label: 'Нутгийн өмчлөлтэй' },
  { id: 'community', label: 'Нутгийн иргэдэд түшиглэсэн' },
] as const;

type FilterId = (typeof FILTERS)[number]['id'];

// /local hub-ийн хэсгүүд: providerType-аар ангилсан зурагтай картууд + 2 шүүлтүүр.
// Бодит ("[ЖИШЭЭ]" биш) entry-гүй ангилалд "Тун удахгүй" блок, урилга, "Хамтран ажиллах" товч.
export default function LocalHubClient({ sections, emptyText }: { sections: HubSection[]; emptyText: string }) {
  const [active, setActive] = useState<FilterId[]>([]);

  const toggle = (id: FilterId) =>
    setActive((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));

  const filtering = active.length > 0;
  const visible = sections
    .map((s) => ({
      ...s,
      empty: !s.items.some((p) => !p.isSample),
      items: s.items.filter((p) => active.every((f) => p[f])),
    }))
    // Шүүлтүүр сонгосон үед зөвхөн тохирох картуудтай ангилал
    .filter((s) => (filtering ? s.items.length > 0 : true));

  return (
    <div className="space-y-16">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Шүүлтүүр">
        {FILTERS.map((f) => {
          const on = active.includes(f.id);
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(f.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                on
                  ? 'bg-[#15803d] text-white shadow-sm hover:bg-emerald-950'
                  : 'bg-white border border-neutral-200 text-neutral-700 hover:border-[#15803d] hover:text-[#15803d]'
              }`}
            >
              {on ? '✓ ' : ''}
              {f.label}
            </button>
          );
        })}
      </div>

      {visible.length === 0 && <p className="py-8 text-sm text-neutral-500">{emptyText}</p>}

      {visible.map((s) => (
        <section key={s.id} id={s.id} className="scroll-mt-28">
          <h2 className="mb-6 text-2xl sm:text-3xl font-black text-neutral-900">{s.title}</h2>
          {s.empty && !filtering && (
            <div className="mb-6">
              <ComingSoon
                title={LOCAL_INVITES[s.inviteKey]?.text || s.title}
                invite={LOCAL_INVITES[s.inviteKey]?.invite}
                ctaSubject={inviteSubject(s.inviteKey)}
              />
            </div>
          )}
          {s.items.length > 0 && (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {s.items.map((p) => (
              <li key={p.id}>
                <ImageCard
                  href={p.href}
                  image={p.image}
                  title={p.name}
                  eyebrow={p.province}
                  badges={[p.localOwned ? 'Нутгийн өмчлөлтэй' : '', p.community ? 'Нутгийн иргэдэд түшиглэсэн' : ''].filter(Boolean)}
                />
              </li>
            ))}
          </ul>
          )}
        </section>
      ))}
    </div>
  );
}

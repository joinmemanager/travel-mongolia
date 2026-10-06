import React from 'react';

import { partnerMailto } from '@/lib/impactData';

// "Тун удахгүй" блок: хоосон ангилал, хэсэгт (батлагдсан холбоосны картын хэв маяг:
// цагаан карт, ногоон тэмдэглэгээ, ногоон товч). Шинэ өнгө, фонт нэмээгүй.
export default function ComingSoon({
  title,
  text,
  invite,
  ctaSubject,
  ctaLabel = 'Хамтран ажиллах',
}: {
  title: string;
  text?: string;
  // Үйлчилгээ үзүүлэгчдэд хандсан урилга (/local/*)
  invite?: string;
  // Байвал contact@joinme.mn руу энэ гарчигтай имэйл бичих товч гарна
  ctaSubject?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="p-8 bg-white rounded-3xl border border-dashed shadow-sm sm:p-10 border-neutral-300">
      <span className="block mb-2 text-[11px] font-mono font-bold tracking-[0.25em] text-[#15803d] uppercase">
        Тун удахгүй
      </span>
      <h3 className="mb-2 text-lg font-black text-neutral-900">{title}</h3>
      {text && <p className="text-sm leading-relaxed text-neutral-600">{text}</p>}
      {invite && <p className="mt-4 text-sm font-semibold leading-relaxed text-neutral-800">{invite}</p>}
      {ctaSubject && (
        <a
          href={partnerMailto(ctaSubject)}
          className="inline-flex gap-2 items-center py-3 px-5 mt-5 text-sm font-bold text-white bg-[#15803d] hover:bg-emerald-800 rounded-full transition-colors"
          data-ga-event="partner_contact_click"
          data-ga-params={JSON.stringify({ subject: ctaSubject })}
        >
          <span>{ctaLabel}</span>
          <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  );
}

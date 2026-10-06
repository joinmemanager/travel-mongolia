import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { type BookingCampaign, bookingHref } from '@/lib/booking';
import { liveHref } from '@/lib/navigation';
import type { RelatedItem } from '@/lib/related';

// "Холбоотой аялал, туршлага, үйлчилгээ" (Content-to-Booking, C12).
// Production дээр нийтлэгдээгүй хуудас руу заасан карт харагдахгүй; карт үлдэхгүй бол хэсэг ч харагдахгүй.
// Холбоосууд дээрх data-ga-* шинжийг components/Analytics.tsx уншиж GA4 руу илгээнэ.
export default function RelatedBookings({
  items,
  campaign,
  contentId,
  title = 'Холбоотой аялал, туршлага, үйлчилгээ',
}: {
  items: RelatedItem[];
  // Энэ хуудасны контентын төрөл, slug (utm_campaign, utm_content)
  campaign: BookingCampaign;
  contentId: string;
  title?: string;
}) {
  const visible = items.filter((i) => liveHref(i.href));
  if (visible.length === 0) return null;

  return (
    <section id="related-bookings" className="scroll-mt-28">
      <h2 className="mb-6 text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">{title}</h2>
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => {
          const clickEvent =
            item.kind === 'experience' ? 'click_to_experience' : item.kind === 'provider' ? 'click_to_provider' : '';
          const canBook = item.kind !== 'product';
          return (
            <li key={item.id} className="flex overflow-hidden flex-col h-full bg-white rounded-3xl border shadow-sm border-neutral-200/80">
              <Link
                href={item.href}
                className="group block"
                data-ga-event={clickEvent || undefined}
                data-ga-params={JSON.stringify({ target_id: item.slug, provider_id: item.providerId || '' })}
              >
                <div className="overflow-hidden relative aspect-[4/3] bg-neutral-900">
                  {item.image && (
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-5">
                  {item.meta && <span className="block mb-1 text-xs font-semibold text-[#15803d]">{item.meta}</span>}
                  <h3 className="text-lg font-bold leading-snug text-neutral-900 group-hover:text-[#15803d]">{item.title}</h3>
                </div>
              </Link>
              {canBook && (
                <a
                  href={bookingHref(item.bookingUrl, campaign, contentId)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-between items-center py-3 px-5 mx-5 mt-auto mb-5 text-sm font-bold text-white bg-[#15803d] hover:bg-emerald-800 rounded-full transition-colors"
                  data-ga-event="booking_click"
                  data-ga-params={JSON.stringify({
                    provider_id: item.providerId || '',
                    is_local_provider: item.isLocalProvider,
                    target_id: item.slug,
                  })}
                >
                  <span>Захиалах</span>
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

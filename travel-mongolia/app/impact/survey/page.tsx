import type { Metadata } from 'next';
import React from 'react';

import HubHeader from '@/components/HubHeader';
import { pageMetadata } from '@/lib/seo';

// «Үр өгөөж & түншлэл» › «Судалгаанд оролцох»: Google Form-ийг шигтгэсэн хуудас.
// Зөвхөн маягттай тул noindex, PAGE_META-д оруулаагүй (тиймээс sitemap-д орохгүй, app/sitemap.ts).
// «Шинэ цонхонд нээх» товч GA4-д survey_open event илгээнэ (components/Analytics.tsx, data-ga-event).
const FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSee1ZREBM3Iet36MHGcX9xuz_0uHLkRE5A2kla2lbSxfO1s-A/viewform';
const TITLE = 'Судалгаанд оролцох';
// Маягтын гарчиг, зорилгоос (2026-11-06)
const INTRO =
  'Монголын аялал жуулчлалын бизнесийн орчинд ойрын хугацаанд тулгамдаж буй асуудал, ирээдүйн чиг хандлагын судалгаа. Салбарын төлөөллүүдээс 2027–2030 онд тулгарах байгаль орчин, нийгэм, засаглалын (ESG) эрсдэл, бэлэн байдал, шаардлагатай дэмжлэгийг тодорхойлох зорилготой.';

export const metadata: Metadata = {
  ...pageMetadata({ title: TITLE, description: INTRO, path: '/impact/survey' }),
  robots: { index: false, follow: true },
};

export default function SurveyPage() {
  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Үр өгөөж & түншлэл', href: '/impact' },
          { label: TITLE, href: '/impact/survey' },
        ]}
        kicker="СУДАЛГАА"
        kickerEn="SURVEY"
        title={TITLE}
        intro={INTRO}
      >
        <a
          href={FORM_URL}
          target="_blank"
          rel="noopener"
          data-ga-event="survey_open"
          data-ga-params='{"source":"survey_page"}'
          className="inline-flex items-center mt-6 px-5 py-3 rounded-full bg-[#15803d] text-sm font-semibold text-white hover:bg-[#166534] transition-colors"
        >
          Шинэ цонхонд нээх →
        </a>
      </HubHeader>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <iframe
          src={`${FORM_URL}?embedded=true`}
          title="Судалгааны маягт: Монголын аялал жуулчлалын бизнесийн орчин"
          className="block w-full h-[80vh] min-h-[560px] rounded-2xl border border-neutral-200 bg-white"
          loading="lazy"
        >
          Ачааллаж байна…
        </iframe>
      </div>
    </main>
  );
}

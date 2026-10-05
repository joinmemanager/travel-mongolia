import Link from 'next/link';

import GuidePage from '@/components/GuidePage';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { RESPECT_HUB as hub } from '@/lib/respectData';

export const metadata = metaFor('/respect');

export default function RespectHubPage() {
  return (
    <GuidePage
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Хүндэтгэлтэй аялал', href: '/respect' },
      ]}
      kicker={hub.kicker}
      kickerEn={hub.kickerEn}
      title={hub.title}
      intro={hub.intro}
      sections={[]}
      related={hub.related}
    >
      {/* Аялагчийн амлалт */}
      <section
        id="pledge"
        className="scroll-mt-28 p-8 sm:p-10 rounded-3xl bg-white border border-t-4 border-brand-100 border-t-brand-600 shadow-sm"
      >
        <h2 className="text-2xl sm:text-3xl font-black text-brand-950 mb-2">{hub.pledgeTitle}</h2>
        <p className="mb-8 text-sm text-neutral-700">{hub.pledgeIntro}</p>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {hub.pledge.map((item, i) => (
            <li
              key={item.title}
              className="flex gap-4 p-5 rounded-2xl bg-brand-50 border border-brand-100"
            >
              {/* Дугаарласан ногоон дугуй */}
              <span className="flex justify-center items-center w-9 h-9 shrink-0 text-sm font-black text-white bg-brand-700 rounded-full tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-bold text-brand-950 mb-1">{item.title}</h3>
                <p className="text-sm text-neutral-700 leading-relaxed">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Дэд хуудсууд */}
      <section className="p-8 sm:p-10 rounded-3xl border border-brand-100 bg-brand-50 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-black text-brand-950 mb-6">
          {hub.subpagesTitle}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Production дээр draft/planned дэд хуудсыг харуулахгүй */}
          {hub.subpages.filter((page) => liveHref(page.href)).map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="group block p-6 h-full rounded-2xl bg-white border border-t-4 border-brand-100 border-t-brand-600 hover:border-brand-600 hover:shadow-lg hover:shadow-brand-900/10 transition-all"
              >
                <span className="flex justify-between items-center mb-2 text-lg font-bold text-brand-950 group-hover:text-brand-700 transition-colors">
                  {page.label}
                  <span
                    aria-hidden="true"
                    className="flex justify-center items-center w-8 h-8 text-brand-700 bg-brand-100 rounded-full"
                  >
                    →
                  </span>
                </span>
                <span className="block text-sm text-neutral-700 leading-relaxed">
                  {page.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </GuidePage>
  );
}

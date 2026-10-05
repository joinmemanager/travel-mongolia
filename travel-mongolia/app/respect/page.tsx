import Link from 'next/link';

import GuidePage from '@/components/GuidePage';
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
        className="scroll-mt-28 p-8 sm:p-10 rounded-3xl bg-[#15803d] text-white shadow-sm"
      >
        <h2 className="text-2xl sm:text-3xl font-black mb-2">{hub.pledgeTitle}</h2>
        <p className="mb-8 text-sm text-white/80">{hub.pledgeIntro}</p>
        <ol className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {hub.pledge.map((item, i) => (
            <li
              key={item.title}
              className="flex gap-4 p-5 rounded-2xl bg-white/10 border border-white/15"
            >
              <span className="text-2xl font-black text-white/60 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-base font-bold mb-1">{item.title}</h3>
                <p className="text-sm text-white/85 leading-relaxed">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Дэд хуудсууд */}
      <section className="p-8 sm:p-10 rounded-3xl border border-neutral-200/80 bg-white shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-6">
          {hub.subpagesTitle}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {hub.subpages.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="group block p-6 h-full rounded-2xl bg-[#fcfbf9] border border-neutral-200 hover:border-[#15803d] transition-colors"
              >
                <span className="flex justify-between items-center mb-2 text-lg font-bold text-neutral-900 group-hover:text-[#15803d] transition-colors">
                  {page.label}
                  <span aria-hidden="true">→</span>
                </span>
                <span className="block text-sm text-neutral-600 leading-relaxed">
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

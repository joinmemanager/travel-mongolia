import Link from 'next/link';
import React from 'react';

import HubHeader from '@/components/HubHeader';
import { liveHref } from '@/lib/navigation';
import { NATURE_HERITAGE, type NaturePath } from '@/lib/natureHeritage';

// «Байгалийн өв» хэсгийн шинэ хуудсууд (/nature/*, lib/natureHeritage.ts): товч танилцуулга ба сайтад
// аль хэдийн байгаа холбогдох хуудсуудын жагсаалт. Production дээр live биш хуудас руу холбоос гарахгүй (liveHref).
export default function NatureHeritagePage({ path }: { path: NaturePath }) {
  const page = NATURE_HERITAGE[path];
  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: page.title, href: path },
        ]}
        kicker="БАЙГАЛИЙН ӨВ"
        kickerEn={page.kickerEn}
        title={page.title}
        intro={page.intro}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-10 sm:py-14 space-y-12">
        {page.groups.map((group) => {
          const links = group.links.filter((l) => liveHref(l.href));
          return (
            <section key={group.title} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">{group.title}</h2>
              {group.desc && <p className="text-sm sm:text-base text-neutral-600 max-w-3xl">{group.desc}</p>}
              {links.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="group block h-full p-5 bg-white rounded-2xl border border-neutral-200 hover:border-[#15803d] transition-colors"
                      >
                        <span className="block font-bold text-neutral-900 group-hover:text-[#15803d]">{l.label}</span>
                        <span className="block mt-1 text-sm text-neutral-600">{l.desc}</span>
                        <span className="inline-block mt-3 text-sm font-bold text-[#15803d]">Дэлгэрэнгүй →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-500">Энэ ангиллын газруудын мэдээлэл удахгүй нэмэгдэнэ.</p>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}

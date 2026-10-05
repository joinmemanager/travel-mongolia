import Image from 'next/image';
import Link from 'next/link';

import GuidePage from '@/components/GuidePage';
import SectionHeading from '@/components/SectionHeading';
import { IMAGES, type SiteImage } from '@/lib/images';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { RESPECT_HUB as hub } from '@/lib/respectData';

export const metadata = metaFor('/respect');

// Дэд хуудасны картын зураг ("Монгол сэтгүүл" пилот, docs/plan/images.md)
const SUBPAGE_IMAGES: Record<string, SiteImage> = {
  '/respect/etiquette': IMAGES.lakeGers,
  '/respect/nature': IMAGES.whiteHorse,
  '/respect/accessible': IMAGES.herderBoy,
  '/plan/safety-info': IMAGES.redCliffs,
};

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
      image={IMAGES.gerCamp}
      sections={[]}
      related={hub.related}
    >
      {/* Аялагчийн амлалт: бараан хэсэг */}
      <section id="pledge" className="scroll-mt-28 p-8 bg-night rounded-xl sm:p-12">
        <SectionHeading eyebrow={hub.pledgeIntro} title={hub.pledgeTitle} tone="dark" />
        <ol className="grid grid-cols-1 gap-x-10 gap-y-8 mt-10 md:grid-cols-2">
          {hub.pledge.map((item, i) => (
            <li key={item.title} className="flex gap-5">
              <span className="font-serif text-3xl font-bold leading-none text-gold tabular-nums">
                {i + 1}
              </span>
              <div>
                <h3 className="mb-1 font-serif text-lg font-bold text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed text-night-muted">{item.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Дэд хуудсууд: зурган дээрээ гарчигтай картууд */}
      <section>
        <SectionHeading title={hub.subpagesTitle} />
        <ul className="grid grid-cols-1 gap-6 mt-10 sm:grid-cols-2">
          {/* Production дээр draft/planned дэд хуудсыг харуулахгүй */}
          {hub.subpages.filter((page) => liveHref(page.href)).map((page) => {
            const image = SUBPAGE_IMAGES[page.href] || IMAGES.gerCamp;
            return (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="group block overflow-hidden relative rounded-xl aspect-[3/2] bg-night"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 560px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="mb-1 font-serif text-2xl font-bold text-white">{page.label}</h3>
                    <p className="text-sm leading-relaxed text-white/85">{page.desc}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </GuidePage>
  );
}

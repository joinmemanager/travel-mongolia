import DarkPanel from '@/components/design/DarkPanel';
import ImageCard from '@/components/design/ImageCard';
import PatternBand from '@/components/design/PatternBand';
import GuidePage from '@/components/GuidePage';
import { RESPECT_REVIEW_NOTICE } from '@/lib/respectData';
import { IMAGES, type SiteImage } from '@/lib/images';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { RESPECT_HUB as hub } from '@/lib/respectData';

export const metadata = metaFor('/respect');

// Дэд хуудасны картын зураг (Монголынх нь шалгагдсан, docs/plan/images.md)
const SUBPAGE_IMAGES: Record<string, SiteImage> = {
  '/respect/etiquette': IMAGES.lakeGers,
  '/respect/nature': IMAGES.whiteHorse,
  '/respect/accessible': IMAGES.herderBoy,
  '/plan/safety-info': IMAGES.redCliffs,
};

export default function RespectHubPage() {
  return (
    <GuidePage
      notice={RESPECT_REVIEW_NOTICE}
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
      bottomBand={<PatternBand />}
    >
      {/* Дэд хуудсууд: зурагтай картууд */}
      <section className="p-8 sm:p-10 rounded-3xl border border-neutral-200/80 bg-white shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-6">
          {hub.subpagesTitle}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Production дээр draft/planned дэд хуудсыг харуулахгүй */}
          {hub.subpages.filter((page) => liveHref(page.href)).map((page) => (
            <li key={page.href}>
              <ImageCard
                href={page.href}
                image={SUBPAGE_IMAGES[page.href]}
                title={page.label}
                desc={page.desc}
                sizes="(max-width: 640px) 100vw, 420px"
              />
            </li>
          ))}
        </ul>
      </section>

      {/* Аялагчийн амлалт: бараан ногоон самбар */}
      <DarkPanel id="pledge" title={hub.pledgeTitle} intro={hub.pledgeIntro} items={hub.pledge} />
    </GuidePage>
  );
}

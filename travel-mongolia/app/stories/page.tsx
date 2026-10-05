import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import HubHeader from '@/components/HubHeader';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import {
  getStories,
  STORY_CATEGORIES,
  type StoryCard,
  type StoryCategoryId,
} from '@/lib/stories';

// "Түүх & өв" hub (ia-plan.md C10, 5в). Төлөв: draft (lib/navigation.ts PAGE_STATUS).
// НООРОГ: одоохондоо сайтад байгаа хуудсуудыг карт болгосон (lib/stories.ts).
export const metadata = metaFor('/stories');

const CATEGORY_LABEL = Object.fromEntries(
  STORY_CATEGORIES.map((c) => [c.id, c.mn])
) as Record<StoryCategoryId, string>;

// Ангиллын шошгын өнгө: ногоон давамгайлна, фото/видео нь элсэн шаргал
const CATEGORY_TAG: Record<StoryCategoryId, string> = {
  culture: 'text-brand-800 bg-brand-100',
  nature: 'text-brand-800 bg-brand-100',
  nomadic: 'text-brand-800 bg-brand-100',
  food: 'text-brand-800 bg-brand-100',
  people: 'text-brand-800 bg-brand-100',
  'photo-video': 'text-sand-800 bg-sand-100',
};

const LATEST_COUNT = 6;

function StoryCardView({ story }: { story: StoryCard }) {
  return (
    <Link
      href={story.href}
      className="group flex flex-col h-full overflow-hidden bg-white rounded-3xl border border-t-4 border-brand-100 border-t-brand-600 shadow-sm hover:border-brand-600 hover:shadow-lg hover:shadow-brand-900/10 transition-all"
    >
      {story.imageUrl && (
        <div className="relative w-full h-44">
          <Image src={story.imageUrl} alt={story.title} fill unoptimized className="object-cover" />
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        <span
          className={`self-start mb-3 py-1 px-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full ${CATEGORY_TAG[story.category]}`}
        >
          {CATEGORY_LABEL[story.category]}
        </span>
        <h3 className="mb-2 text-lg font-bold text-brand-950 group-hover:text-brand-700 transition-colors">
          {story.title}
        </h3>
        <p className="flex-1 text-sm text-neutral-700 leading-relaxed">{story.excerpt}</p>
        <span className="flex gap-2 items-center mt-4 text-sm font-bold text-brand-700">
          Унших
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

function EmptyCard() {
  return (
    <div className="flex items-center justify-center p-6 h-full min-h-32 rounded-3xl border-2 border-dashed border-brand-200 text-sm font-semibold text-brand-800">
      Түүх удахгүй нэмэгдэнэ
    </div>
  );
}

// Бүтэн өргөнтэй хэсэг: цагаан болон цайвар ногоон дэвсгэрийг ээлжлэн
function Band({
  index,
  id,
  title,
  subtitle,
  children,
}: {
  index: number;
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-8 py-14 ${index % 2 === 0 ? 'bg-white' : 'bg-brand-50'}`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16">
        <div className="flex gap-3 items-baseline mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-brand-950">{title}</h2>
          {subtitle && (
            <span className="text-[10px] font-semibold tracking-wider text-brand-800 uppercase">
              {subtitle}
            </span>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

export default async function StoriesHubPage() {
  // Production дээр нийтлэгдээгүй хуудас руу заасан картыг харуулахгүй
  const stories = (await getStories()).filter((s) => liveHref(s.href));

  const featured = stories.filter((s) => s.featured);
  const latest = stories
    .filter((s) => !s.featured)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    .slice(0, LATEST_COUNT);

  let band = 0;

  return (
    <main className="min-h-screen bg-white text-neutral-900 pb-16">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Түүх & өв', href: '/stories' },
        ]}
        kicker="ТҮҮХ & ӨВ"
        kickerEn="STORIES & HERITAGE"
        title="Монголын түүхүүд"
        intro="Монголын соёл, байгаль, нүүдэлчдийн амьдрал, хоол, хүмүүсийн тухай түүхүүд. Сэдвээ сонгоод уншаарай."
      >
        {/* Ангиллын товчлол */}
        <nav aria-label="Түүхийн ангилал" className="flex flex-wrap gap-2 mt-8">
          {STORY_CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="py-2 px-4 text-xs font-bold text-brand-800 bg-white border border-brand-200 hover:bg-brand-700 hover:border-brand-700 hover:text-white rounded-full transition-colors"
            >
              {c.mn}
            </a>
          ))}
        </nav>
      </HubHeader>

      {featured.length > 0 && (
        <Band index={band++} title="Онцлох түүх">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featured.map((story) => (
              <li key={story.id}>
                <StoryCardView story={story} />
              </li>
            ))}
          </ul>
        </Band>
      )}

      {latest.length > 0 && (
        <Band index={band++} title="Сүүлийн түүхүүд">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((story) => (
              <li key={story.id}>
                <StoryCardView story={story} />
              </li>
            ))}
          </ul>
        </Band>
      )}

      {STORY_CATEGORIES.map((category) => {
        const items = stories.filter((s) => s.category === category.id);
        return (
          <Band
            key={category.id}
            index={band++}
            id={category.id}
            title={category.mn}
            subtitle={category.en}
          >
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.length > 0 ? (
                items.map((story) => (
                  <li key={story.id}>
                    <StoryCardView story={story} />
                  </li>
                ))
              ) : (
                <li>
                  <EmptyCard />
                </li>
              )}
              {category.id === 'photo-video' && liveHref('/stories/photo-video') && (
                <li className="flex items-center">
                  <Link href="/stories/photo-video" className="btn-primary">
                    Бүх фото/видео түүх
                    <span aria-hidden="true">→</span>
                  </Link>
                </li>
              )}
            </ul>
          </Band>
        );
      })}
    </main>
  );
}

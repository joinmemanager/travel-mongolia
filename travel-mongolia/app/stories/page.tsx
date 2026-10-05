import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import HubHeader from '@/components/HubHeader';
import SectionHeading from '@/components/SectionHeading';
import { IMAGES } from '@/lib/images';
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
// Загвар: "Монгол сэтгүүл" (docs/plan/design-brief.md).
export const metadata = metaFor('/stories');

const CATEGORY_LABEL = Object.fromEntries(
  STORY_CATEGORIES.map((c) => [c.id, c.mn])
) as Record<StoryCategoryId, string>;

const LATEST_COUNT = 6;

// Зурган дээрээ гарчигтай карт (4:5 эсвэл онцлох нь 3:2), hover үед зураг томорно
function StoryCardView({ story, wide = false }: { story: StoryCard; wide?: boolean }) {
  return (
    <Link
      href={story.href}
      className={`group block overflow-hidden relative rounded-xl bg-night ${
        wide ? 'aspect-[3/2]' : 'aspect-[4/5]'
      }`}
    >
      {story.image && (
        <Image
          src={story.image.src}
          alt={story.image.alt}
          fill
          sizes={wide ? '(max-width: 768px) 100vw, 600px' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 390px'}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/30 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <p className="mb-2 text-[11px] font-semibold tracking-[0.25em] text-gold uppercase">
          {CATEGORY_LABEL[story.category]}
        </p>
        <h3 className="mb-2 font-serif text-xl font-bold leading-snug text-white sm:text-2xl">
          {story.title}
        </h3>
        <p className="text-sm leading-relaxed text-white/85 line-clamp-2">{story.excerpt}</p>
      </div>
    </Link>
  );
}

function EmptyCard() {
  return (
    <div className="flex justify-center items-center p-6 h-full min-h-40 text-sm text-ink-muted rounded-xl border border-dashed border-ink/20">
      Түүх удахгүй нэмэгдэнэ
    </div>
  );
}

// Хэсгүүд цөцгий ба цагаан дэвсгэрийг ээлжлэн
function Band({
  index,
  id,
  eyebrow,
  title,
  children,
}: {
  index: number;
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-8 py-20 ${index % 2 === 0 ? 'bg-cream' : 'bg-white'}`}>
      <div className="px-6 mx-auto max-w-[1200px] sm:px-10">
        <SectionHeading eyebrow={eyebrow} title={title} className="mb-10" />
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
    <main className="min-h-screen bg-cream text-ink">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Түүх & өв', href: '/stories' },
        ]}
        kicker="ТҮҮХ & ӨВ"
        kickerEn="STORIES & HERITAGE"
        title="Монголын түүхүүд"
        intro="Монголын соёл, байгаль, нүүдэлчдийн амьдрал, хоол, хүмүүсийн тухай түүхүүд. Сэдвээ сонгоод уншаарай."
        image={IMAGES.eagleHunter}
      >
        {/* Ангиллын товчлол */}
        <nav aria-label="Түүхийн ангилал" className="flex flex-wrap gap-2 mt-8">
          {STORY_CATEGORIES.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="py-2 px-4 text-xs font-semibold text-white rounded-full border border-white/40 hover:border-gold hover:text-gold transition-colors"
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
                <StoryCardView story={story} wide />
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
            eyebrow={category.en}
            title={category.mn}
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
                  <Link
                    href="/stories/photo-video"
                    className="group inline-flex gap-2 items-center py-3 px-6 text-sm font-semibold text-cream bg-night rounded-xl hover:bg-ink transition-colors"
                  >
                    Бүх фото/видео түүх
                    <span aria-hidden="true" className="text-gold transition-transform group-hover:translate-x-1">→</span>
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

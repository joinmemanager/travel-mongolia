import Image from 'next/image';
import Link from 'next/link';

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

const LATEST_COUNT = 6;

function StoryCardView({ story }: { story: StoryCard }) {
  return (
    <Link
      href={story.href}
      className="group flex flex-col h-full overflow-hidden bg-white rounded-3xl border border-neutral-200/80 shadow-sm hover:border-[#15803d] hover:shadow-md transition-all"
    >
      {story.imageUrl && (
        <div className="relative w-full h-44">
          <Image
            src={story.imageUrl}
            alt={story.title}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-6">
        <span className="mb-2 text-[10px] font-bold tracking-widest text-[#15803d] uppercase">
          {CATEGORY_LABEL[story.category]}
        </span>
        <h3 className="mb-2 text-lg font-bold text-neutral-900 group-hover:text-[#15803d] transition-colors">
          {story.title}
        </h3>
        <p className="flex-1 text-sm text-neutral-600 leading-relaxed">{story.excerpt}</p>
        <span aria-hidden="true" className="mt-4 text-sm font-bold text-neutral-900">→</span>
      </div>
    </Link>
  );
}

function EmptyCard() {
  return (
    <div className="flex items-center justify-center p-6 h-full min-h-32 rounded-3xl border border-dashed border-neutral-300 text-sm text-neutral-500">
      Түүх удахгүй нэмэгдэнэ
    </div>
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

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32">
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
              className="py-2 px-4 text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-full transition-colors"
            >
              {c.mn}
            </a>
          ))}
        </nav>
      </HubHeader>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12 space-y-16">
        {/* Онцлох түүх */}
        {featured.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl sm:text-3xl font-black text-neutral-900">Онцлох түүх</h2>
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {featured.map((story) => (
                <li key={story.id}>
                  <StoryCardView story={story} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Сүүлийн түүхүүд */}
        {latest.length > 0 && (
          <section>
            <h2 className="mb-6 text-2xl sm:text-3xl font-black text-neutral-900">Сүүлийн түүхүүд</h2>
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((story) => (
                <li key={story.id}>
                  <StoryCardView story={story} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Ангилал тус бүр */}
        {STORY_CATEGORIES.map((category) => {
          const items = stories.filter((s) => s.category === category.id);
          return (
            <section key={category.id} id={category.id} className="scroll-mt-8">
              <div className="flex gap-3 items-baseline mb-6">
                <h2 className="text-2xl font-black text-neutral-900">{category.mn}</h2>
                <span className="text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                  {category.en}
                </span>
              </div>
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
                  <li>
                    <Link
                      href="/stories/photo-video"
                      className="flex items-center justify-between p-6 h-full rounded-3xl bg-[#15803d] text-white font-bold hover:bg-emerald-800 transition-colors"
                    >
                      Бүх фото/видео түүх
                      <span aria-hidden="true">→</span>
                    </Link>
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}

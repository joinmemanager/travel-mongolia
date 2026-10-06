import Link from 'next/link';

import ImageCard from '@/components/design/ImageCard';
import PatternBand from '@/components/design/PatternBand';
import HubHeader from '@/components/HubHeader';
import { IMAGES, type SiteImage } from '@/lib/images';
import { isPreviewEnv, liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import {
  getStories,
  STORY_CATEGORIES,
  type StoryCard,
  type StoryCategoryId,
} from '@/lib/stories';

// "Түүх & өв" hub (ia-plan.md C10, 5в). Төлөв: live (lib/navigation.ts PAGE_STATUS).
// Сайтад байгаа хуудсуудын карт + Contentful-ын 'story' нийтлэлүүд (lib/stories.ts).
export const metadata = metaFor('/stories');

const CATEGORY_LABEL = Object.fromEntries(
  STORY_CATEGORIES.map((c) => [c.id, c.mn])
) as Record<StoryCategoryId, string>;

const LATEST_COUNT = 6;

// Одоо байгаа хуудсуудын картын зураг (Монголынх нь шалгагдсан, docs/plan/images.md).
// 6-р үед Contentful-ын Story төрлийн coverImage-ээр солигдоно.
const STORY_IMAGES: Record<string, SiteImage> = {
  heritage: IMAGES.chinggisStatue,
  hidden: IMAGES.redCliffs,
  'local-stories': IMAGES.herderBoy,
  magazine: IMAGES.gerStars,
  'top-lists': IMAGES.camels,
  culture: IMAGES.gerCamp,
  traditions: IMAGES.lakeGers,
  nature: IMAGES.whiteHorse,
  'nomadic-life': IMAGES.herdSnow,
  food: IMAGES.gerCamp,
  people: IMAGES.eagleHunter,
};

// Зурагтай карт (components/design/ImageCard)
function StoryCardView({ story }: { story: StoryCard }) {
  return (
    <ImageCard
      href={story.href}
      image={
        STORY_IMAGES[story.id] ||
        (story.imageUrl ? { src: story.imageUrl, alt: story.title } : IMAGES.gerStars)
      }
      eyebrow={CATEGORY_LABEL[story.category]}
      title={story.title}
      desc={story.excerpt}
    />
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
  // Production дээр түүхгүй ангиллыг (цэс, хэсэг) нуух. Preview дээр "удахгүй" карттай харагдана.
  const preview = isPreviewEnv();
  const categories = STORY_CATEGORIES.filter(
    (c) => preview || stories.some((s) => s.category === c.id)
  );

  const featured = stories.filter((s) => s.featured);
  const latest = stories
    .filter((s) => !s.featured)
    .sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
    .slice(0, LATEST_COUNT);

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900">
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
          {categories.map((c) => (
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
        {categories.map((category) => {
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

      {/* Хээтэй тууз: footer-ийн яг дээр */}
      <div className="mt-32">
        <PatternBand />
      </div>
    </main>
  );
}

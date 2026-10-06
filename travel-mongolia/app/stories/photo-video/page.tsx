import Link from 'next/link';

import ComingSoon from '@/components/design/ComingSoon';
import HubHeader from '@/components/HubHeader';
import { SAMPLE_PREFIX } from '@/lib/localContent';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { getStories } from '@/lib/stories';

// Фото/видео түүх (ia-plan.md C10, 5в). Төлөв: soft (lib/navigation.ts PAGE_STATUS), анхны фото/видео нийтлэл орсны дараа live.
// НООРОГ: Contentful-ын Story төрөл (6-р үе) бэлэн болтол одоо байгаа нийтлэлүүд рүү холбоно.
export const metadata = metaFor('/stories/photo-video');

export default async function PhotoVideoStoriesPage() {
  const stories = (await getStories()).filter(
    (s) => s.category === 'photo-video' && liveHref(s.href)
  );

  return (
    <main className="min-h-screen bg-[#fcfbf9] text-neutral-900 pb-32">
      <HubHeader
        crumbs={[
          { label: 'Нүүр', href: '/' },
          { label: 'Түүх & өв', href: '/stories' },
          { label: 'Фото/видео түүх', href: '/stories/photo-video' },
        ]}
        kicker="ТҮҮХ & ӨВ"
        kickerEn="PHOTO & VIDEO STORIES"
        title="Фото/видео түүх"
        intro="Монголын байгаль, нүүдэлчдийн амьдрал, нутгийн хүмүүсийн тухай зураг, видео түүхүүд."
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-12">
        {/* "[ЖИШЭЭ]"-ээс бусад фото/видео нийтлэлгүй бол "Тун удахгүй" блок */}
        {!stories.some((s) => !s.title.startsWith(SAMPLE_PREFIX)) && (
          <div className="mb-10">
            <ComingSoon title="Фото, видео түүхүүд удахгүй нэмэгдэнэ." />
          </div>
        )}
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <li key={story.id}>
              <Link
                href={story.href}
                className="group block p-6 h-full bg-white rounded-3xl border border-neutral-200/80 shadow-sm hover:border-[#15803d] transition-colors"
              >
                <h2 className="mb-2 text-lg font-bold text-neutral-900 group-hover:text-[#15803d] transition-colors">
                  {story.title}
                </h2>
                <p className="text-sm text-neutral-600 leading-relaxed">{story.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

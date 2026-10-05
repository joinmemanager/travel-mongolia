import Link from 'next/link';

import HubHeader from '@/components/HubHeader';
import { liveHref } from '@/lib/navigation';
import { metaFor } from '@/lib/pageMeta';
import { getStories } from '@/lib/stories';

// Фото/видео түүх (ia-plan.md C10, 5в). Төлөв: draft (lib/navigation.ts PAGE_STATUS).
// НООРОГ: Contentful-ын Story төрөл (6-р үе) бэлэн болтол одоо байгаа нийтлэлүүд рүү холбоно.
export const metadata = metaFor('/stories/photo-video');

export default async function PhotoVideoStoriesPage() {
  const stories = (await getStories()).filter(
    (s) => s.category === 'photo-video' && liveHref(s.href)
  );

  return (
    <main className="min-h-screen bg-brand-50 text-neutral-900 pb-32">
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
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => (
            <li key={story.id}>
              <Link
                href={story.href}
                className="group block p-6 h-full bg-white rounded-3xl border border-t-4 border-brand-100 border-t-brand-600 shadow-sm hover:border-brand-600 hover:shadow-lg hover:shadow-brand-900/10 transition-all"
              >
                <h2 className="mb-2 text-lg font-bold text-brand-950 group-hover:text-brand-700 transition-colors">
                  {story.title}
                </h2>
                <p className="text-sm text-neutral-700 leading-relaxed">{story.excerpt}</p>
              </Link>
            </li>
          ))}
          <li>
            <div className="flex items-center justify-center p-6 h-full min-h-32 rounded-3xl border-2 border-dashed border-brand-200 text-sm font-semibold text-brand-800">
              Фото, видео түүхүүд удахгүй нэмэгдэнэ
            </div>
          </li>
        </ul>
      </div>
    </main>
  );
}

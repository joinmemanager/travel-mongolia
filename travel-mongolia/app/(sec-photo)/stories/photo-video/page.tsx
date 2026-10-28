import type { Metadata } from 'next';

import { ShortsGrid } from '@/components/shorts/Shorts';
import { metaFor } from '@/lib/pageMeta';
import { SHORTS_ALL, SHORTS_ROBOTS } from '@/lib/shorts';

// «Фото/видео түүх» хэсгийн «Бүгд»: сэдэв бүрийн эхний богино бичлэг. Contentful ашиглахгүй (lib/shorts.ts).
// Hero, «Сэдвийн жагсаалт», замчлал нь (sec-photo)/layout.tsx-д. Хайлтад бүртгэх эсэхийг SHORTS_INDEXABLE шийднэ.
export const metadata: Metadata = {
  ...metaFor('/stories/photo-video'),
  ...(SHORTS_ROBOTS && { robots: SHORTS_ROBOTS }),
};

export default function PhotoVideoStoriesPage() {
  return (
    <div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 items-baseline mb-5">
        <h2 className="text-xl font-black tracking-tight sm:text-2xl text-neutral-900">Бүх сэдэв</h2>
        <p className="text-sm text-neutral-500">{SHORTS_ALL.length} бичлэг</p>
      </div>
      <ShortsGrid videos={SHORTS_ALL} category="all" />
    </div>
  );
}

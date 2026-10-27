import type { Metadata } from 'next';
import Link from 'next/link';

import Breadcrumbs from '@/components/Breadcrumbs';
import { pageMetadata } from '@/lib/seo';
import { SHORTS_BASE, SHORTS_CATEGORIES, SHORTS_ROBOTS, shortsHref, shortThumbFallback } from '@/lib/shorts';

// Богино бичлэгийн (YouTube Shorts) сэдвүүд. Contentful ашиглахгүй (lib/shorts.ts).
// Хайлтад бүртгэх эсэхийг SHORTS_INDEXABLE (lib/shorts.ts) шийднэ.
export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Богино бичлэг: Монголын соёл, байгаль',
    description:
      'Монголын уламжлалт ёс заншил, түүх, бурхны шашин, байгалийн өв, домог, сүм хийдийн тухай богино видео бичлэгүүд сэдвээр.',
    path: SHORTS_BASE,
  }),
  ...(SHORTS_ROBOTS && { robots: SHORTS_ROBOTS }),
};

export default function ShortsIndexPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Нүүр', href: '/' },
          { label: 'Богино бичлэг', href: SHORTS_BASE },
        ]}
      />
      <h1 className="mb-6 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">Богино бичлэг</h1>
      <p className="mb-10 max-w-[70ch] text-neutral-600">
        Монголын соёл, түүх, байгалийн тухай богино видеонууд сэдвээр. Сэдвээ сонгоод бичлэгээ сайт дотроо үзээрэй.
      </p>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SHORTS_CATEGORIES.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={shortsHref(cat.slug)}
              className="group flex gap-4 items-center p-3 rounded-2xl border transition-all border-neutral-200 hover:border-[#15803d] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#15803d]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shortThumbFallback(cat.videos[0].id)}
                alt=""
                loading="lazy"
                decoding="async"
                className="object-cover w-16 h-24 rounded-xl shrink-0 bg-neutral-100"
              />
              <span>
                <span className="block font-bold leading-snug text-neutral-900 group-hover:text-[#15803d]">{cat.title}</span>
                <span className="block mt-1 text-sm text-neutral-500">{cat.videos.length} бичлэг</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

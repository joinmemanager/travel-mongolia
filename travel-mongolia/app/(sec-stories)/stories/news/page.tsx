import Link from 'next/link';
import { connection } from 'next/server';

import Breadcrumbs from '@/components/Breadcrumbs';
import { isPreviewEnv } from '@/lib/navigation';
import { getNewsList, NEWS_BASE, newsDate } from '@/lib/news';
import { metaFor } from '@/lib/pageMeta';

// TIC-ийн мэдээний архив (8-р багц). Төлөв: draft (lib/navigation.ts PAGE_STATUS), эзэмшигч шийднэ.
export const revalidate = 604800;
export const metadata = metaFor('/stories/news');

export default async function NewsArchivePage() {
  if (isPreviewEnv()) await connection();
  const news = await getNewsList();
  // Оноор бүлэглэнэ
  const years = new Map<string, typeof news>();
  for (const n of news) {
    const y = n.publishedDate?.slice(0, 4) || 'Огноогүй';
    if (!years.has(y)) years.set(y, []);
    years.get(y)!.push(n);
  }

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'Нүүр', href: '/' },
          { label: 'Түүхүүд', href: '/stories' },
          { label: 'Мэдээний архив', href: NEWS_BASE },
        ]}
      />
      <h1 className="mb-6 text-3xl font-black tracking-tight leading-tight sm:text-5xl text-neutral-900">Мэдээний архив</h1>
      <p className="mb-10 max-w-[70ch] text-neutral-600">
        touristinfocenter.mn сайтад 2010–2016 онд нийтлэгдсэн аялал жуулчлал, соёл, байгалийн мэдээ ({news.length}). Нийтэлсэн огноог хэвээр үлдээсэн тул мэдээлэл хуучирсан байж болно.
      </p>
      {[...years.entries()].map(([year, items]) => (
        <section key={year} id={`y${year}`} data-toc={year} className="mb-12 scroll-mt-28">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">
            {year} <span className="text-neutral-400">({items.length})</span>
          </h2>
          <ul className="divide-y divide-neutral-200">
            {items.map((n) => (
              <li key={n.id} className="py-3">
                <Link href={`${NEWS_BASE}/${n.slug}`} className="font-semibold text-neutral-900 hover:text-[#15803d]">
                  {n.title}
                </Link>
                {n.publishedDate && <span className="ml-2 text-sm text-neutral-500">{newsDate(n.publishedDate)}</span>}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

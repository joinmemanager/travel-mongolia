'use client';

import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';

import { cdnImage } from '@/lib/imageUrl';
import { normalizeSearchText } from '@/lib/searchText';

// Шувуу, ургамлын каталог: зураг, монгол нэр, латин нэр, товч тайлбар, хайлт, үсгийн шүүлтүүр.
// Мөр бүр id=<slug> (anchor) тул TIC-ийн хуучин хаяг /about/nature/birds#<slug> руу шилжинэ.
// Бүх мөр server HTML-д байна (шүүлтүүр зөвхөн харагдацыг нууна).
export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  latinName?: string;
  summary?: string;
  image?: string;
  // Тусдаа нийтлэлтэй бол
  href?: string;
}

export default function SpeciesCatalog({ items, noun = 'зүйл' }: { items: CatalogItem[]; noun?: string }) {
  const [query, setQuery] = useState('');
  const [letter, setLetter] = useState('');
  const [onlyArticles, setOnlyArticles] = useState(false);
  const [hash, setHash] = useState('');

  // #slug-аар орж ирвэл тэр мөрийг тодруулна (шүүлтүүрийг цэвэрлэнэ)
  useEffect(() => {
    const update = () => setHash(decodeURIComponent(window.location.hash.slice(1)));
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);

  const letters = useMemo(() => [...new Set(items.map((i) => i.title[0]?.toLocaleUpperCase('mn')).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'mn')), [items]);
  const q = normalizeSearchText(query);
  const visible = (i: CatalogItem) =>
    (!letter || i.title[0]?.toLocaleUpperCase('mn') === letter) &&
    (!onlyArticles || !!i.href) &&
    (!q || normalizeSearchText(`${i.title} ${i.latinName || ''} ${i.summary || ''}`).includes(q));
  const count = items.filter(visible).length;

  return (
    <div>
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center">
        <label className="flex-1">
          <span className="sr-only">Хайх</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Монгол эсвэл латин нэрээр хайх…"
            className="py-3 px-4 w-full text-base bg-white rounded-xl border outline-none border-neutral-300 focus:border-[#15803d]"
          />
        </label>
        <label className="flex gap-2 items-center text-sm font-medium cursor-pointer text-neutral-700">
          <input type="checkbox" checked={onlyArticles} onChange={(e) => setOnlyArticles(e.target.checked)} className="w-4 h-4 accent-[#15803d]" />
          Дэлгэрэнгүй нийтлэлтэй
        </label>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-6" role="group" aria-label="Эхний үсгээр шүүх">
        {['', ...letters].map((l) => (
          <button
            key={l || 'all'}
            type="button"
            onClick={() => setLetter(l)}
            aria-pressed={letter === l}
            className={`min-w-9 px-2.5 py-1.5 text-sm font-semibold rounded-lg transition-colors ${
              letter === l ? 'bg-[#15803d] text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            {l || 'Бүгд'}
          </button>
        ))}
      </div>
      <p className="mb-4 text-sm text-neutral-500" aria-live="polite">
        {count} {noun}
      </p>

      <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
        {items.map((i) => (
          <li
            key={i.id}
            id={i.slug}
            hidden={!visible(i) && hash !== i.slug}
            className={`flex gap-4 py-4 scroll-mt-[calc(var(--nav-h)+7rem)] ${hash === i.slug ? 'bg-emerald-50 -mx-3 px-3 rounded-xl' : ''}`}
          >
            <div className="overflow-hidden w-20 h-20 rounded-xl sm:w-24 sm:h-24 shrink-0 bg-neutral-100">
              {i.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cdnImage(i.image, 192)} alt={i.title} loading="lazy" width={96} height={96} className="object-cover w-full h-full" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-neutral-900">
                {i.href ? (
                  <Link href={i.href} className="hover:text-[#15803d]">
                    {i.title}
                  </Link>
                ) : (
                  i.title
                )}
              </h3>
              {i.latinName && (
                <p className="text-sm italic text-neutral-500" translate="no">
                  {i.latinName}
                </p>
              )}
              {i.summary && <p className="mt-1 text-sm leading-relaxed text-neutral-700 line-clamp-3">{i.summary}</p>}
              {i.href && (
                <Link href={i.href} className="inline-block mt-2 text-sm font-semibold text-[#15803d] hover:underline">
                  Дэлгэрэнгүй →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

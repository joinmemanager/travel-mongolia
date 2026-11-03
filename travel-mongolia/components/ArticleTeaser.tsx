import Link from 'next/link';
import React from 'react';

import type { SectionArticle } from '@/lib/sectionArticles';

// Дэд хэсгийн нийтлэл рүү заасан карт (/local/*, /respect/*, /plan/safety-info, /impact)
export default function ArticleTeaser({ article }: { article: SectionArticle }) {
  return (
    <Link
      href={article.href}
      className="block p-6 sm:p-8 bg-white rounded-3xl border border-neutral-200/80 shadow-sm hover:border-[#15803d] transition-colors"
    >
      <span className="block mb-2 text-xs font-bold text-[#15803d]">Нийтлэл</span>
      <span className="block mb-3 text-xl sm:text-2xl font-black leading-snug text-neutral-900">{article.title}</span>
      {article.excerpt && <span className="block mb-4 max-w-3xl text-sm leading-relaxed text-neutral-600">{article.excerpt}</span>}
      <span className="text-sm font-semibold text-[#15803d]">Унших →</span>
    </Link>
  );
}

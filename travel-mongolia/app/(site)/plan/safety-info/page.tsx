import React from 'react';

import ArticleTeaser from '@/components/ArticleTeaser';
import { getArticleAt } from '@/lib/sectionArticles';

import SafetyInfoClient from './SafetyInfoClient';

// «Хүндэтгэлтэй аялал» › «Аюулгүй байдал»: гарын авлага + нийтлэлийн карт. Metadata: layout.tsx
export const revalidate = 604800;

export default async function SafetyInfoPage() {
  const article = await getArticleAt('respect', '/plan/safety-info');
  return <SafetyInfoClient article={article && <ArticleTeaser article={article} />} />;
}

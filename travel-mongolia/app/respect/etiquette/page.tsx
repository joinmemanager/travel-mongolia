import ArticleTeaser from '@/components/ArticleTeaser';
import GuidePage from '@/components/GuidePage';
import { RESPECT_REVIEW_NOTICE } from '@/lib/respectData';
import { metaFor } from '@/lib/pageMeta';
import { ETIQUETTE_GUIDE as guide } from '@/lib/respectData';
import { getArticleAt } from '@/lib/sectionArticles';

export const metadata = metaFor('/respect/etiquette');
export const revalidate = 604800;

export default async function EtiquettePage() {
  const article = await getArticleAt('respect', '/respect/etiquette');
  return (
    <GuidePage
      notice={RESPECT_REVIEW_NOTICE}
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Хүндэтгэлтэй аялал', href: '/respect' },
        { label: guide.title, href: '/respect/etiquette' },
      ]}
      {...guide}
    >
      {article && <ArticleTeaser article={article} />}
    </GuidePage>
  );
}

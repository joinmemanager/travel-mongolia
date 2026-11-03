import ArticleTeaser from '@/components/ArticleTeaser';
import GuidePage from '@/components/GuidePage';
import { RESPECT_REVIEW_NOTICE } from '@/lib/respectData';
import { metaFor } from '@/lib/pageMeta';
import { NATURE_GUIDE as guide } from '@/lib/respectData';
import { getArticleAt } from '@/lib/sectionArticles';

export const metadata = metaFor('/respect/nature');
export const revalidate = 604800;

export default async function NatureGuidancePage() {
  const article = await getArticleAt('respect', '/respect/nature');
  return (
    <GuidePage
      notice={RESPECT_REVIEW_NOTICE}
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Хүндэтгэлтэй аялал', href: '/respect' },
        { label: guide.title, href: '/respect/nature' },
      ]}
      {...guide}
    >
      {article && <ArticleTeaser article={article} />}
    </GuidePage>
  );
}

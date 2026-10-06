import GuidePage from '@/components/GuidePage';
import { RESPECT_REVIEW_NOTICE } from '@/lib/respectData';
import { metaFor } from '@/lib/pageMeta';
import { NATURE_GUIDE as guide } from '@/lib/respectData';

export const metadata = metaFor('/respect/nature');

export default function NatureGuidancePage() {
  return (
    <GuidePage
      notice={RESPECT_REVIEW_NOTICE}
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Хүндэтгэлтэй аялал', href: '/respect' },
        { label: guide.title, href: '/respect/nature' },
      ]}
      {...guide}
    />
  );
}

import GuidePage from '@/components/GuidePage';
import { RESPECT_REVIEW_NOTICE } from '@/lib/respectData';
import { metaFor } from '@/lib/pageMeta';
import { ACCESSIBLE_GUIDE as guide } from '@/lib/respectData';

export const metadata = metaFor('/respect/accessible');

export default function AccessibleTravelPage() {
  return (
    <GuidePage
      notice={RESPECT_REVIEW_NOTICE}
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Хүндэтгэлтэй аялал', href: '/respect' },
        { label: guide.title, href: '/respect/accessible' },
      ]}
      {...guide}
    />
  );
}

import GuidePage from '@/components/GuidePage';
import { metaFor } from '@/lib/pageMeta';
import { ACCESSIBLE_GUIDE as guide } from '@/lib/respectData';

export const metadata = metaFor('/respect/accessible');

export default function AccessibleTravelPage() {
  return (
    <GuidePage
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Хүндэтгэлтэй аялал', href: '/respect' },
        { label: guide.title, href: '/respect/accessible' },
      ]}
      {...guide}
    />
  );
}

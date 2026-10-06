import GuidePage from '@/components/GuidePage';
import { metaFor } from '@/lib/pageMeta';
import { NATURE_GUIDE as guide } from '@/lib/respectData';

export const metadata = metaFor('/respect/nature');

export default function NatureGuidancePage() {
  return (
    <GuidePage
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Хүндэтгэлтэй аялал', href: '/respect' },
        { label: guide.title, href: '/respect/nature' },
      ]}
      {...guide}
    />
  );
}

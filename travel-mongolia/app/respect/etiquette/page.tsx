import GuidePage from '@/components/GuidePage';
import { metaFor } from '@/lib/pageMeta';
import { ETIQUETTE_GUIDE as guide } from '@/lib/respectData';

export const metadata = metaFor('/respect/etiquette');

export default function EtiquettePage() {
  return (
    <GuidePage
      crumbs={[
        { label: 'Нүүр', href: '/' },
        { label: 'Хүндэтгэлтэй аялал', href: '/respect' },
        { label: guide.title, href: '/respect/etiquette' },
      ]}
      {...guide}
    />
  );
}

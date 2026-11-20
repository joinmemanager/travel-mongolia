import NatureHeritagePage from '@/components/NatureHeritagePage';
import { metaFor } from '@/lib/pageMeta';

// «Байгалийн өв» хэсгийн шинэ хуудас (цэс v2). Контент: lib/natureHeritage.ts. Цэсэнд soft: noindex, sitemap-гүй.
export const metadata = metaFor('/nature/unesco');

export default function Page() {
  return <NatureHeritagePage path="/nature/unesco" />;
}

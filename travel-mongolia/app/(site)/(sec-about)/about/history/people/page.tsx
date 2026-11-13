import CultureListPage from '@/components/culture/CultureListPage';
import { metaFor } from '@/lib/pageMeta';

// «Монголын түүх → Түүхэн хүмүүс» (TIC cate14 TypeID 3, 10-р багц).
export const revalidate = 604800;
export const metadata = metaFor('/about/history/people');

export default function Page() {
  return <CultureListPage section="people" intro="Монголын түүхэнд нэрээ үлдээсэн хаад, хатад, жанжид, эрдэмтэн, шашны зүтгэлтнүүдийн тухай нийтлэлүүд." />;
}

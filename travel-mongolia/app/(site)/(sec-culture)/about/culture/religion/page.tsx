import CultureListPage from '@/components/culture/CultureListPage';
import { metaFor } from '@/lib/pageMeta';

// «Соёл, өв → Шашин шүтлэг» (TIC cate15, 10-р багц).
export const revalidate = 604800;
export const metadata = metaFor('/about/culture/religion');

export default function Page() {
  return <CultureListPage section="religion" intro="Монголчуудын бөө мөргөл, буддын шашин, хийд, бурхан шүтээн, тахилга, шашны зан үйлийн тухай нийтлэлүүд." />;
}

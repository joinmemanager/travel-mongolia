import CultureListPage from '@/components/culture/CultureListPage';
import { metaFor } from '@/lib/pageMeta';

// «Соёл, өв → Угсаатнууд» (TIC cate14 TypeID 1, 10-р багц).
export const revalidate = 86400;
export const metadata = metaFor('/about/culture/ethnic-groups');

export default function Page() {
  return <CultureListPage section="ethnic-groups" intro="Монгол Улсын нутагт амьдардаг халх, ойрад, буриад, казах зэрэг угсаатан, ястны гарал үүсэл, зан заншлын тухай нийтлэлүүд." />;
}

import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/about/food');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

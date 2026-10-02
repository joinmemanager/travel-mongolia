import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/about/at-a-glance');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/destination/routes');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

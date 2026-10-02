import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/inspiration/top-lists');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

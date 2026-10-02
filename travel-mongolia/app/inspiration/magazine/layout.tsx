import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/inspiration/magazine');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

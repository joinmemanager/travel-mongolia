import { metaFor } from '@/lib/pageMeta';

export const metadata = metaFor('/things-to-do/events');

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import SectionLayout from '@/components/section/SectionLayout';

// «Нүүдэлчдийн амьдрал» хэсэг: /about/nomadic-life.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="nomadic">{children}</SectionLayout>;
}

import SectionLayout from '@/components/section/SectionLayout';

// «Түүхүүд» хэсэг: /stories (Тойм), /inspiration/hidden, /inspiration/top-lists.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="stories">{children}</SectionLayout>;
}

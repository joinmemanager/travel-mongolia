import SectionLayout from '@/components/section/SectionLayout';

// «Хоол» хэсэг: /about/food.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="food">{children}</SectionLayout>;
}

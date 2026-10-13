import SectionLayout from '@/components/section/SectionLayout';

// «Үзэх, хийх зүйлс» хэсэг: /things-to-do (Тойм), /things-to-do/*, /inspiration/styles.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="things">{children}</SectionLayout>;
}

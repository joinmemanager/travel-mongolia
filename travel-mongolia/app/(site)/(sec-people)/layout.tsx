import SectionLayout from '@/components/section/SectionLayout';

// «Хүмүүс» хэсэг: /about/people.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="people">{children}</SectionLayout>;
}

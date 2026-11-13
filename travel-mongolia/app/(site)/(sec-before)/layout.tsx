import SectionLayout from '@/components/section/SectionLayout';

// «Аялахаас өмнө» хэсэг: /plan/before-you-travel (Тойм), /inspiration/seasons.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="before">{children}</SectionLayout>;
}

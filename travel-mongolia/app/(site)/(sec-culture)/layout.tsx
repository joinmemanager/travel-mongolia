import SectionLayout from '@/components/section/SectionLayout';

// «Соёл, өв» хэсэг: /about/culture (Тойм), /about/traditions.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="culture">{children}</SectionLayout>;
}

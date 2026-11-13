import SectionLayout from '@/components/section/SectionLayout';

// «Байгаль» хэсэг: /about/nature.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="nature">{children}</SectionLayout>;
}

import SectionLayout from '@/components/section/SectionLayout';

// «Монголын тухай» хэсэг: /about/at-a-glance (Тойм), /about/history, /about/modern.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="about">{children}</SectionLayout>;
}

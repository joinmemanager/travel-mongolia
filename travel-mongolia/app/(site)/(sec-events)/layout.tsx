import SectionLayout from '@/components/section/SectionLayout';

// «Арга хэмжээ, баяр наадам» хэсэг: /things-to-do/events (Тойм), /things-to-do/festivals.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="events">{children}</SectionLayout>;
}

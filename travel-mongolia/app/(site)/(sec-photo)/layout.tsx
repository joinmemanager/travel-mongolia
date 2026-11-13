import SectionLayout from '@/components/section/SectionLayout';

// «Фото/видео түүх» хэсэг: /stories/photo-video.
// Route group нь URL-д ордоггүй (docs/plan/section-layout.md).
export default function Layout({ children }: { children: React.ReactNode }) {
  return <SectionLayout sectionId="photo-video">{children}</SectionLayout>;
}

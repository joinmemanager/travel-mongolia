// /en, /zh, /ru, /ko, /ja хэлний хуудсуудын ROOT layout (2026-11-16). Сайтын root layout (app/(site)/layout.tsx)
// <html lang="mn">-тэй тул орчуулсан хуудсуудыг тусдаа route group-д (app/(i18n)/) салгаж, server-rendered HTML-д
// <html lang="en"> г.м. зөв гаргана. URL өөрчлөгдөөгүй (/en/province/...). Хоёр root layout-ийн хооронд шилжихэд
// хөтөч хуудсыг бүтэн ачаална (хэл солих үед л).
//
// app/(site)/layout.tsx-ийг огт өөрчлөөгүй: metadata (Search Console verification орно) тэндээс import, GA4 ижил ID.
// Google Translate-ийн скрипт энд байхгүй: хуудас аль хэдийн тухайн хэлээр (хэл солигчийг жинхэнэ хуудас руу шилжүүлэх
// төлөвлөгөө: docs/plan/payload-migration.md §5). Танихгүй угтвар (/xx/...) 404. Navbar/Footer нь (site)-тэй ижил.
export const revalidate = 604800;

import '../../(site)/globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { metadata as siteMetadata } from '@/app/(site)/layout';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageContext';
import Navbar from '@/components/Navbar';
import { siteFont } from '@/lib/fonts';
import { LOCALES, localeByPrefix } from '@/lib/i18n/locales';
import {
  ABOUT_US_HREF,
  FOOTER_LEGAL,
  FOOTER_NAVIGATION,
  MAIN_NAVIGATION,
  isPreviewEnv,
  liveHref,
  visibleItems,
  visibleSections,
} from '@/lib/navigation';

// Хуудас бүр (withLocale) өөрийн title, description, canonical, hreflang, og:locale-ийг тавина
export const metadata: Metadata = siteMetadata;

export function generateStaticParams() {
  return LOCALES.filter((l) => l.prefix).map((l) => ({ lang: l.prefix }));
}

export default async function LangRootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = localeByPrefix(lang);
  if (!l) notFound();
  const preview = isPreviewEnv();

  return (
    <html lang={l.hreflang} className={siteFont.variable}>
      <body className="font-sans bg-white text-neutral-900 antialiased" data-site-lang={l.code}>
        <LanguageProvider>
          <Navbar sections={visibleSections(MAIN_NAVIGATION, preview)} />
          {children}
          {/* Footer-ийн дээрх статистик (SiteStatsSection) энд байхгүй: шошгууд зөвхөн монгол (lib/siteStats.ts) */}
          <Footer
            groups={visibleSections(FOOTER_NAVIGATION, preview)}
            legal={visibleItems(FOOTER_LEGAL, preview)}
            aboutHref={liveHref(ABOUT_US_HREF)}
          />
        </LanguageProvider>
      </body>
      {/* Google Analytics 4: (site)/layout.tsx-тэй ижил ID */}
      <GoogleAnalytics gaId="G-PBZBEDW93X" />
    </html>
  );
}

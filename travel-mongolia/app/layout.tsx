export const dynamic = 'force-dynamic';

import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';
import Script from 'next/script';

import Footer from '@/components/Footer';
import {
  FOOTER_LEGAL,
  FOOTER_NAVIGATION,
  MAIN_NAVIGATION,
  showUnreadyNavItems,
  visibleItems,
  visibleSections,
} from '@/lib/navigation';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from '@/lib/seo';

import { LanguageProvider } from '../components/LanguageContext';
import Navbar from '../components/Navbar';

const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
});

const siteDescription =
  'Монголд аялах бүх мэдээлэл нэг дор: үзэх газрууд, нүүдэлчин соёл, баяр наадам, аяллын маршрут, байрлах газар, аяллын зөвлөгөө.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Travel Mongolia | Монголд аялах аяллын гарын авлага',
    template: `%s | ${SITE_NAME}`,
  },
  description: siteDescription,
  applicationName: SITE_NAME,
  alternates: { canonical: '/' },
  openGraph: {
    siteName: SITE_NAME,
    locale: 'mn_MN',
    type: 'website',
    url: '/',
    title: 'Travel Mongolia | Монголд аялах аяллын гарын авлага',
    description: siteDescription,
    images: [{ url: DEFAULT_OG_IMAGE }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: { index: true, follow: true },
  // Google Search Console-д сайтын эзэмшлийг баталгаажуулах
  verification: {
    google: 'zRrRNy93t2vrJ0mbrdKRgk-zHX0UZazj7BHcjprmSnI',
  },
};

// Google-д сайтын нэрийг таниулах бүтэцтэй өгөгдөл
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'mn',
  description: siteDescription,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Production дээр бэлэн биш цэсийг нуух, preview дээр "Тун удахгүй"-гээр харуулах
  const showUnready = showUnreadyNavItems();

  return (
    <html lang="mn">
      <body
        className={`${rubik.className} bg-white text-neutral-900 antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <LanguageProvider>
          {/* Дээд талын үндсэн цэс */}
          <Navbar sections={visibleSections(MAIN_NAVIGATION, showUnready)} />
          {children}
          <Footer
            groups={visibleSections(FOOTER_NAVIGATION, showUnready)}
            legal={visibleItems(FOOTER_LEGAL, showUnready)}
          />
        </LanguageProvider>

        {/* Google Translate-ийн илүүдэл баннерыг нуух тусгай загвар */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .goog-te-banner-frame.skiptranslate { display: none !important; }
              body { top: 0px !important; }
              #google_translate_element { display: none; }
              .goog-tooltip { display: none !important; }
              .goog-tooltip:hover { display: none !important; }
              .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
            `,
          }}
        />

        {/* Нууц элемент */}
        <div id="google_translate_element"></div>

        {/* Бүх сайтыг сонгосон хэл рүү шууд орчуулах хөдөлгүүр */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                new google.translate.TranslateElement({
                  pageLanguage: 'mn',
                  includedLanguages: 'mn,en,zh-CN,ru,ko,ja',
                  autoDisplay: false
                }, 'google_translate_element');
              }
            `,
          }}
        />
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
      {/* Google Analytics 4: root layout-д нэг л удаа ачаалагдана */}
      <GoogleAnalytics gaId="G-PBZBEDW93X" />
    </html>
  );
}

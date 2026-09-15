import './globals.css';

import { Rubik } from 'next/font/google';
import Script from 'next/script';

import Footer from '@/components/Footer';

import { LanguageProvider } from '../components/LanguageContext';
import Navbar from '../components/Navbar';

const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-rubik',
  display: 'swap',
});

export const metadata = {
  title: 'Travel Mongolia | Discover the Land of Blue Sky',
  description:
    'Experience authentic nomadic culture, stunning landscapes, and unforgettable journeys in Mongolia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body
        className={`${rubik.className} bg-white text-neutral-900 antialiased`}
      >
        <LanguageProvider>
          {/* Дээд талын үндсэн цэс */}
          <Navbar />
          {children}
          <Footer />
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
    </html>
  );
}

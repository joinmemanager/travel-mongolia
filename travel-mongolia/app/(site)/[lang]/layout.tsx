import { notFound } from 'next/navigation';

import { localeByPrefix } from '@/lib/i18n/locales';

// /en, /zh, /ru, /ko, /ja хэлний хуудсуудын бүрхүүл. Сайтын root layout (app/(site)/layout.tsx, Google tag-тай)
// <html lang="mn"> тул энд агуулгыг хэлний lang-тай div-ээр ороож, хөтөч дээр <html lang>-ийг сольно.
// Танихгүй угтвар (/xx/...) 404. docs/plan/payload-migration.md «Routing».
export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l = localeByPrefix(lang);
  if (!l) notFound();
  return (
    <div lang={l.hreflang} data-site-lang={l.code}>
      {children}
      <script dangerouslySetInnerHTML={{ __html: `document.documentElement.lang=${JSON.stringify(l.hreflang)}` }} />
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import SoumPage, { generateMetadata as soumMetadata } from '@/app/(site)/province/[id]/[soum]/page';
import { localeByPrefix } from '@/lib/i18n/locales';
import { setRequestLocale } from '@/lib/i18n/requestLocale';
import { productionStaticParams } from '@/lib/navigation';

// /<хэл>/province/<аймаг>/<сум>: монгол хуудасны компонентыг тухайн хэлээр. Орчуулга нийтлэгдээгүй бол 404.
export const revalidate = 604800;

type Props = { params: Promise<{ lang: string; id: string; soum: string }> };

async function enter(params: Props['params']) {
  const p = await params;
  const l = localeByPrefix(p.lang);
  if (!l) notFound();
  setRequestLocale(l.code);
  return p;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await enter(params);
  return soumMetadata({ params: Promise.resolve(p) });
}

export default async function LocalizedSoumPage({ params }: Props) {
  const p = await enter(params);
  return SoumPage({ params: Promise.resolve(p) });
}

export const generateStaticParams = productionStaticParams;

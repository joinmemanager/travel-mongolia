import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { connection } from 'next/server';
import React, { cache } from 'react';

import RichText from '@/components/RichText';
import PlaceTemplate from '@/components/templates/PlaceTemplate';
import { cdnImage } from '@/lib/imageUrl';
import { PROVINCE_ALIASES } from '@/lib/provinceFacts';
import { isPreviewEnv } from '@/lib/navigation';
import { pageMetadata, richTextToPlain, truncate } from '@/lib/seo';
import { soumEmblemUrl } from '@/lib/soumEmblems';
import { SOUM_EMBLEM_ASSETS, SOUM_NOT_HERO_ASSETS } from '@/lib/soumHeroImages';
import { getSoum, getSoumsOfProvince } from '@/lib/soums';
import { productionStaticParams } from '@/lib/navigation';
import { DEFAULT_LOCALE, localizedHref } from '@/lib/i18n/locales';
import { getRequestLocale } from '@/lib/i18n/requestLocale';
import { withLocale } from '@/lib/i18n/seo';
import { ui } from '@/lib/i18n/ui';

// Сумын дэлгэрэнгүй (/province/<аймаг>/<сум>). Зөвхөн ownPage=true (150-аас дээш үгтэй) сумд
// тусдаа хуудастай; бусдыг нь аймгийн хуудасны "Сумд" хэсэг рүү (#<сум>) шилжүүлнэ.
// Орчуулга: /<хэл>/province/<аймаг>/<сум> (app/(site)/[lang]/...) энэ компонентыг хэлээр нь дуудна. Тухайн хэлээр
// нийтлэгдээгүй (publishedLocales) сум 404. mn хувилбарын гаралт өөрчлөгдөөгүй.
export const revalidate = 604800;

interface Props {
  params: Promise<{ id: string; soum: string }>;
}


const loadSoum = cache(async (id: string, soum: string) => getSoum(id, soum));

// Тухайн хэлээр нээгдэх эсэх
const visibleIn = (s: { publishedLocales: string[] }, locale: string) => locale === DEFAULT_LOCALE || s.publishedLocales.includes(locale);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, soum } = await params;
  const locale = getRequestLocale();
  const s = await loadSoum(id, soum);
  // Олдохгүй (404) эсвэл аймгийн хуудас руу redirect хийдэг сум: layout-ын «/» canonical-ийг өвлүүлэхгүй
  if (!s || !s.ownPage || !visibleIn(s, locale))
    return { title: ui(locale)('notFound'), robots: { index: false }, alternates: { canonical: null } };
  const path = `/province/${s.provinceSlug}/${s.slug}`;
  const meta = pageMetadata({
    title: s.seoTitle || `${s.title}, ${s.provinceTitle}`,
    description: s.seoDescription || truncate(richTextToPlain(s.body)),
    path,
    image: s.image && !(s.imageId && (SOUM_EMBLEM_ASSETS.has(s.imageId) || SOUM_NOT_HERO_ASSETS.has(s.imageId))) ? s.image : s.provinceHero.src,
  });
  const localized = withLocale(meta, path, locale, s.publishedLocales);
  return s.seoTitle ? { ...localized, title: { absolute: s.seoTitle } } : localized;
}

export default async function SoumPage({ params }: Props) {
  if (isPreviewEnv()) await connection();

  const { id, soum } = await params;
  const locale = getRequestLocale();
  const t = ui(locale);
  // Орчуулгатай route руу хэлээр нь, бусад руу монгол хувилбар руу (lib/i18n/locales.ts LOCALIZED_ROUTES)
  const lp = (p: string) => localizedHref(p, locale);
  const s = await loadSoum(id, soum);
  if (!s || !visibleIn(s, locale)) {
    if (locale !== DEFAULT_LOCALE) notFound();
    // /province/umnugovi/<сум> → /province/umnugov/<сум>
    const alias = PROVINCE_ALIASES[decodeURIComponent(id).toLowerCase()];
    if (alias) permanentRedirect(`/province/${alias}/${soum}`);
    notFound();
  }
  if (!s.ownPage) permanentRedirect(lp(`/province/${s.provinceSlug}#${s.slug}`));

  // Нэг аймгийн тусдаа хуудастай бусад сумд
  const siblings = (await getSoumsOfProvince(s.provinceId)).filter((x) => x.ownPage && x.slug !== s.slug);
  const facts = [
    { label: t('soumCenter'), value: s.center },
    { label: t('population'), value: s.population },
    { label: t('area'), value: s.area },
  ].filter((x) => x.value);

  // Сумын зураг сүлд/лого бол hero-д сунгахгүй: hero = аймгийн hero, сүлд нь гарчгийн дээрх 96px дугуй тэмдэг.
  // Газрын зураг, хөрөг (SOUM_NOT_HERO_ASSETS) мөн hero болохгүй. Ангилал: docs/plan/soum-hero-emblems.csv
  const isEmblem = !!s.imageId && SOUM_EMBLEM_ASSETS.has(s.imageId);
  const notHero = isEmblem || (!!s.imageId && SOUM_NOT_HERO_ASSETS.has(s.imageId));
  // Зураггүй сумд ч аймгийн hero-г харуулна
  const heroImage = s.image && !notHero ? { src: s.image, alt: s.title, credit: s.imageCredit } : s.provinceHero;
  // Hero-г Commons зургаар сольсон сумдын сүлд (lib/soumEmblems.ts) мөн тэмдэг хэвээр харагдана
  const emblemSrc = isEmblem ? s.image : soumEmblemUrl(s.id);
  const badge =
    emblemSrc ? (
      <img
        src={cdnImage(emblemSrc, 192)}
        alt={t('emblemOf', { x: s.title })}
        width={96}
        height={96}
        className="object-contain p-1.5 mx-auto mb-4 w-20 h-20 bg-white rounded-full shadow-lg sm:w-24 sm:h-24"
      />
    ) : undefined;

  return (
    <PlaceTemplate
      image={heroImage}
      badge={badge}
      title={s.title}
      subtitle={s.provinceTitle}
      back={{ href: lp(`/province/${s.provinceSlug}#soums`), label: t('backTo', { x: s.provinceTitle }) }}
      analytics={{ content_type: 'soum', content_id: `${s.provinceSlug}/${s.slug}`, province: s.provinceTitle }}
      nav={[{ id: 'overview', label: t('overview') }]}
      breadcrumbs={[
        { label: t('home'), href: lp('/') },
        { label: t('provinces'), href: lp('/destination/region#provinces') },
        { label: s.provinceTitle, href: lp(`/province/${s.provinceSlug}`) },
        { label: s.title, href: lp(`/province/${s.provinceSlug}/${s.slug}`) },
      ]}
      links={[
        { label: s.provinceTitle, href: lp(`/province/${s.provinceSlug}`) },
        ...siblings
          .filter((x) => visibleIn(x, locale))
          .map((x) => ({ label: x.title, href: lp(`/province/${s.provinceSlug}/${x.slug}`) })),
        { label: t('destinations'), href: lp('/destination/region') },
      ]}
    >
      <section id="overview" className="pt-16 scroll-mt-20">
        <h2 className="text-2xl sm:text-3xl font-medium text-neutral-900 mb-6">{t('overview')}</h2>
        {facts.length > 0 && (
          <dl className="grid grid-cols-1 gap-3 mb-8 sm:grid-cols-3">
            {facts.map((x) => (
              <div key={x.label} className="p-4 bg-white rounded-xl border border-neutral-200/70">
                <dt className="text-sm text-neutral-500">{x.label}</dt>
                <dd className="mt-1 font-medium text-neutral-900">{x.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="text-neutral-700">
          <RichText document={s.body} />
        </div>
      </section>
    </PlaceTemplate>
  );
}

// Production-д ISR (lib/navigation.ts), preview-д хүсэлт бүрт (draft харуулна)
export const generateStaticParams = productionStaticParams;

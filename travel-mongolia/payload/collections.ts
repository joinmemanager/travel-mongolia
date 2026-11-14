import path from 'path';
import { fileURLToPath } from 'url';

import type { Access, CollectionConfig, Field, FieldAccess } from 'payload';

import { TRANSLATION_LOCALES } from '../lib/i18n/locales';
import { CF_SCHEMA, type CfField } from './cfSchema';
import { revalidateAfterChange, revalidateAfterDelete, stampCreatedAt } from './hooks';

// Contentful-ийн 18 content type → 18 Payload collection (slug нь content type-ийн id-тай ИЖИЛ, ингэснээр
// lib/cms/payloadSource.ts-ийн Contentful хэлбэрийн query-г шууд буулгана). Талбарууд payload/cfSchema.ts-аас.
//
// Эрх (users.role):
//   admin      — бүгд, хэрэглэгч удирдах
//   editor     — агуулга үүсгэх, засах, нийтлэх (устгах эрхгүй)
//   translator — зөвхөн mn-ээс бусад хэлний localized талбарыг засна (slug, холбоос, зураг г.м. засахгүй)
// Нэвтрээгүй (сайт, REST): зөвхөн нийтлэгдсэн хувилбар.

type Role = 'admin' | 'editor' | 'translator';
const roleOf = (req: any): Role | undefined => req?.user?.role;

export const isAdmin: Access = ({ req }) => roleOf(req) === 'admin';
const isEditor: Access = ({ req }) => roleOf(req) === 'admin' || roleOf(req) === 'editor';
const canUpdate: Access = ({ req }) => {
  const r = roleOf(req);
  if (r === 'admin' || r === 'editor') return true;
  // Орчуулагч монгол эхийг өөрчлөхгүй
  return r === 'translator' && req.locale !== 'mn';
};
const publishedOrUser: Access = ({ req }) => (req?.user ? true : { _status: { equals: 'published' } });
// Хэлнээс хамаардаггүй талбар (slug, ангилал, холбоос, зураг): орчуулагч засахгүй
const notTranslator: FieldAccess = ({ req }) => roleOf(req) !== 'translator';

const GROUPS: Record<string, string> = {
  province: 'Газар нутаг',
  soum: 'Газар нутаг',
  place: 'Газар нутаг',
  heritagePlace: 'Газар нутаг',
  heritageCategory: 'Газар нутаг',
  destination: 'Газар нутаг',
  historyArticle: 'Түүх, соёл, байгаль',
  cultureArticle: 'Түүх, соёл, байгаль',
  cultureHeritage: 'Түүх, соёл, байгаль',
  species: 'Түүх, соёл, байгаль',
  story: 'Нийтлэл, арга хэмжээ',
  event: 'Нийтлэл, арга хэмжээ',
  recommendation: 'Нийтлэл, арга хэмжээ',
  localProvider: 'Нутгийн үйлчилгээ',
  communityExperience: 'Нутгийн үйлчилгээ',
  localProduct: 'Нутгийн үйлчилгээ',
  visitorGuidance: 'Нутгийн үйлчилгээ',
  faqItem: 'Нутгийн үйлчилгээ',
};

function toField(f: CfField): Field {
  // Localized заавал талбар зөвхөн монгол (үндсэн) хэлэнд заавал: орчуулагч хэсэгчилсэн орчуулгаа хадгалж чадна,
  // орчуулга бүрэн эсэхийг publishedLocales шийднэ. Хэлээс үл хамаарах талбарт ердийн required.
  const requiredInMn = f.required && f.localized;
  const common = {
    name: f.id,
    label: f.name,
    localized: f.localized || undefined,
    required: (f.required && !f.localized) || undefined,
    ...(requiredInMn
      ? {
          // Ноорогт шалгахгүй (Payload-ийн required-тэй адил)
          validate: (value: unknown, { req, data }: { req: { locale?: string }; data?: { _status?: string } }) =>
            data?._status === 'draft' ||
            (req?.locale && req.locale !== 'mn') ||
            (value !== null && value !== undefined && value !== '') ||
            'Монгол хэлэнд заавал бөглөнө',
        }
      : {}),
    ...(f.localized ? {} : { access: { update: notTranslator, create: notTranslator } }),
    ...(f.maxLength ? { admin: { description: `Хайлтын системд ≤${f.maxLength} тэмдэгт` } } : {}),
  };
  switch (f.kind) {
    case 'text':
      return f.hasMany
        ? ({ ...common, type: 'text', hasMany: true } as Field)
        : ({ ...common, type: 'text', unique: f.unique || undefined, index: f.id === 'slug' || undefined } as Field);
    case 'textarea':
      return { ...common, type: 'textarea' } as Field;
    case 'richText':
      return { ...common, type: 'richText' } as Field;
    case 'number':
      return { ...common, type: 'number', admin: { ...(common as any).admin, step: f.integer ? 1 : undefined } } as Field;
    case 'checkbox':
      return { ...common, type: 'checkbox' } as Field;
    case 'date':
      return { ...common, type: 'date', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'yyyy-MM-dd' } } } as Field;
    case 'json':
      return { ...common, type: 'json' } as Field;
    case 'select':
      return { ...common, type: 'select', options: f.options!.map((o) => ({ label: o, value: o })), index: true } as Field;
    case 'location':
      return {
        ...common,
        type: 'group',
        fields: [
          { name: 'lat', type: 'number' },
          { name: 'lon', type: 'number' },
        ],
      } as Field;
    case 'upload':
      return { ...common, type: 'upload', relationTo: 'media', hasMany: f.hasMany || undefined } as Field;
    case 'relationship': {
      const rel = f.relationTo || [];
      return {
        ...common,
        type: 'relationship',
        relationTo: rel.length === 1 ? rel[0] : rel,
        hasMany: f.hasMany || undefined,
        index: !f.hasMany || undefined,
      } as Field;
    }
  }
}

// Бүх агуулгын collection-д нэмэгдэх талбарууд
const systemFields: Field[] = [
  {
    name: 'publishedLocales',
    label: 'Орчуулга нийтлэгдсэн хэлүүд',
    type: 'select',
    hasMany: true,
    index: true,
    options: TRANSLATION_LOCALES.map((l) => ({ label: l.label, value: l.code })),
    admin: {
      position: 'sidebar',
      description:
        'Энд сонгосон хэлээр л /en/, /zh/… хуудас нээгдэж, sitemap-д орно. Орчуулга бүрэн, шалгагдсаны дараа сонгоно.',
    },
    access: { update: ({ req }) => !!req.user },
  },
  {
    name: 'contentfulId',
    label: 'Contentful ID',
    type: 'text',
    unique: true,
    index: true,
    admin: { position: 'sidebar', readOnly: true, description: 'Шилжүүлэлтийн тулгалт; хуудасны хаягт ашиглагддаг тул өөрчлөхгүй.' },
  },
  { name: 'cfCreatedAt', type: 'date', index: true, admin: { position: 'sidebar', readOnly: true, hidden: true } },
  { name: 'cfFirstPublishedAt', type: 'date', admin: { position: 'sidebar', readOnly: true, hidden: true } },
  // Шилжүүлэлтийн скрипт (scripts/payload/import.ts) өөрчлөгдөөгүй entry-г алгасахад: Contentful-ийн sys.version
  { name: 'cfVersion', type: 'number', admin: { position: 'sidebar', readOnly: true, hidden: true } },
];

export const contentCollections: CollectionConfig[] = Object.entries(CF_SCHEMA).map(([slug, type]) => ({
  slug,
  labels: { singular: type.name, plural: type.name },
  admin: {
    useAsTitle: type.displayField,
    group: GROUPS[slug] || 'Бусад',
    defaultColumns: [type.displayField, ...(type.fields.some((f) => f.id === 'slug') && type.displayField !== 'slug' ? ['slug'] : []), '_status', 'updatedAt'],
    listSearchableFields: [type.displayField, ...(type.fields.some((f) => f.id === 'slug') ? ['slug'] : [])],
  },
  access: { read: publishedOrUser, create: isEditor, update: canUpdate, delete: isAdmin, readVersions: ({ req }) => !!req.user },
  versions: { drafts: { schedulePublish: true }, maxPerDoc: 25 },
  hooks: {
    beforeChange: [stampCreatedAt],
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [...type.fields.map(toField), ...systemFields],
}));

// Зураг: Contentful asset-ийн title → alt текст, description → тайлбар/кредит («Зураг: …» мөр, lib/imageCredit.ts).
// Хэмжээнүүд upload хийхэд НЭГ удаа үүснэ (runtime-д хувиргалт хийхгүй). Нэр нь тогтмол: <файл>-w960.webp,
// тиймээс lib/imageUrl.ts cdnImage() URL-аас шууд тооцно. withoutEnlargement: true → жижиг зургийг томруулахгүй,
// гэхдээ файл заавал үүснэ (хаяг эвдрэхгүй).
export const MEDIA_WIDTHS = [480, 960, 1600, 2400] as const;

export const media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Зураг', plural: 'Зургууд' },
  admin: { group: 'Зураг', useAsTitle: 'title', defaultColumns: ['filename', 'title', 'updatedAt'] },
  access: { read: () => true, create: isEditor, update: canUpdate, delete: isAdmin },
  upload: {
    // R2 байхгүй (локал) үед файлууд энд; R2-тэй үед storage-s3 локал хадгалалтыг унтраана
    staticDir: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.payload-media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    adminThumbnail: 'w480',
    imageSizes: MEDIA_WIDTHS.map((w) => ({
      name: `w${w}`,
      width: w,
      withoutEnlargement: true,
      formatOptions: { format: 'webp', options: { quality: 72 } },
      generateImageName: ({ originalName }: { originalName: string }) => `${originalName}-w${w}.webp`,
    })),
  },
  hooks: { beforeChange: [stampCreatedAt] },
  fields: [
    { name: 'title', label: 'Гарчиг / alt текст', type: 'text', localized: true },
    {
      name: 'description',
      label: 'Тайлбар, зургийн эх сурвалж',
      type: 'textarea',
      localized: true,
      admin: { description: '«Зураг: Зохиогч, лиценз | URL» мөр зургийн доор кредит болж гарна.' },
    },
    { name: 'contentfulId', type: 'text', unique: true, index: true, admin: { position: 'sidebar', readOnly: true } },
    { name: 'cfCreatedAt', type: 'date', admin: { position: 'sidebar', readOnly: true, hidden: true } },
    // Файл солигдсон эсэхийг (дахин импортод) мэдэх: Contentful-ийн файлын URL
    { name: 'cfFileUrl', type: 'text', admin: { position: 'sidebar', readOnly: true, hidden: true } },
  ],
};

export const users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Хэрэглэгч', plural: 'Хэрэглэгчид' },
  admin: { useAsTitle: 'email', group: 'Тохиргоо' },
  auth: { maxLoginAttempts: 5, lockTime: 15 * 60 * 1000, useAPIKey: false },
  access: {
    read: ({ req }) => (roleOf(req) === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: isAdmin,
    update: ({ req }) => (roleOf(req) === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: isAdmin,
  },
  fields: [
    { name: 'name', type: 'text' },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Админ', value: 'admin' },
        { label: 'Редактор', value: 'editor' },
        { label: 'Орчуулагч', value: 'translator' },
      ],
      access: { update: ({ req }) => roleOf(req) === 'admin' },
    },
  ],
};

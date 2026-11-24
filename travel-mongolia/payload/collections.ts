import path from 'path';
import { fileURLToPath } from 'url';

import type {
  Access,
  CollectionBeforeChangeHook,
  CollectionBeforeOperationHook,
  CollectionBeforeValidateHook,
  CollectionConfig,
  Field,
  FieldAccess,
} from 'payload';
import { APIError } from 'payload';
import { totpAccess } from 'payload-totp';

import { TRANSLATION_LOCALES } from '../lib/i18n/locales';
import { CF_SCHEMA, type CfField } from './cfSchema';
import { revalidateAfterChange, revalidateAfterDelete, stampCreatedAt } from './hooks';
import { ADMIN_2FA_ENABLED } from './security/totpOptions';
import { twoFactorEndpoints } from './security/twoFactor';

// Contentful-ийн 18 content type → 18 Payload collection (slug нь content type-ийн id-тай ИЖИЛ, ингэснээр
// lib/cms/payloadSource.ts-ийн Contentful хэлбэрийн query-г шууд буулгана). Талбарууд payload/cfSchema.ts-аас.
//
// Эрх (users.role):
//   admin      — бүгд, хэрэглэгч удирдах
//   editor     — агуулга үүсгэх, засах, нийтлэх (устгах эрхгүй)
//   translator — зөвхөн mn-ээс бусад хэлний localized талбарыг засна (slug, холбоос, зураг г.м. засахгүй)
// Нэвтрээгүй (сайт, REST): зөвхөн нийтлэгдсэн хувилбар.
//
// ОДООХОНДОО (2026-11): бүх хэрэглэгч admin — ALL_USERS_ADMIN = true үед role талбар нуугдаж, хадгалах бүрт
// 'admin' болно. Editor/translator эрхийг идэвхжүүлэх: false болгоход л болно (дээрх access функцууд бэлэн).
//
// 2FA: ADMIN_2FA_ENABLED (payload/security/totpOptions.ts) — одоо УНТРААЛТТАЙ, имэйл + нууц үгээр нэвтэрнэ.
// Асаалттай үед payload-totp plugin бүх collection-ий access-ийг «2FA кодоор баталгаажсан сесс» шалгалтаар ороодог;
// унтраалттай үед totpAccess() нь доторх функцыг шууд дууддаг. Сайт Local API-аар (overrideAccess) уншдаг тул нөлөөгүй.
export const ALL_USERS_ADMIN = true;

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
// Нийтлэгдсэнийг хэн ч (REST) уншина; ноорогийг зөвхөн нэвтэрсэн (2FA асаалттай бол баталгаажсан) хэрэглэгч. Plugin-ий ороолтыг
// read-д унтраасан (custom.totp.disableAccessWrapper) — эс бөгөөс нэвтрээгүй хүнд нийтлэгдсэн ч хаагдана.
const signedIn = totpAccess(() => true);
const publishedOrUser: Access = async (args) =>
  args.req?.user && (await signedIn(args)) === true ? true : { _status: { equals: 'published' } };
const publicRead = { totp: { disableAccessWrapper: { read: true } } };
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
  custom: publicRead,
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
  // Зураг нийтэд нээлттэй (R2-гүй локалд /api/media/file/... сайтад хэрэглэгддэг)
  custom: publicRead,
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

// «Бидний тухай» (/about-us)-ийн хүмүүс: зөвлөхүүд, гүйцэтгэх баг, уран бүтээлчид. Хуудас lib/team.ts-ээр уншина
// (CMS_SOURCE=payload; нийтлэгдсэн хүн байхгүй бол data/team.ts-ийн жишээ). Талбарууд data/team.ts-ийн TeamMember-тэй.
const revalidateAboutUs = async ({ doc, context }: { doc: any; context?: any }) => {
  if (context?.skipRevalidate) return doc;
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/about-us');
  } catch {
    // Next-ээс гадуурх скрипт
  }
  return doc;
};

export const team: CollectionConfig = {
  slug: 'team',
  labels: { singular: 'Хүн (Бидний тухай)', plural: 'Бидний тухай: хүмүүс' },
  admin: {
    useAsTitle: 'name',
    group: 'Бидний тухай',
    defaultColumns: ['name', 'group', 'role', 'order', '_status'],
    description: 'Сайтын «Бидний тухай» хуудсанд гарах хүмүүс. Нийтэлсэн хүн л харагдана; дараалал нь «Дараалал» талбараар.',
  },
  access: { read: publishedOrUser, create: isEditor, update: canUpdate, delete: isAdmin, readVersions: ({ req }) => !!req.user },
  custom: publicRead,
  versions: { drafts: true, maxPerDoc: 10 },
  hooks: { afterChange: [revalidateAboutUs], afterDelete: [revalidateAboutUs] },
  fields: [
    { name: 'name', label: 'Нэр', type: 'text', required: true, localized: true },
    {
      name: 'group',
      label: 'Хэсэг',
      type: 'select',
      required: true,
      defaultValue: 'team',
      options: [
        { label: 'Зөвлөхүүд', value: 'advisor' },
        { label: 'Гүйцэтгэх баг', value: 'team' },
        { label: 'Уран бүтээлчид', value: 'creator' },
      ],
      access: { update: notTranslator },
    },
    { name: 'role', label: 'Албан тушаал / мэргэжил', type: 'text', localized: true },
    { name: 'bio', label: 'Танилцуулга (1–2 өгүүлбэр)', type: 'textarea', localized: true, admin: { description: 'Карт дээр дарахад гарна.' } },
    {
      name: 'photo',
      label: 'Зураг',
      type: 'upload',
      relationTo: 'media',
      access: { update: notTranslator },
      admin: { description: 'Дөрвөлжин, нүүр төвдөө байх зураг (≥400×400). Байхгүй бол нэрийн эхний үсэг гарна.' },
    },
    {
      name: 'order',
      label: 'Дараалал',
      type: 'number',
      defaultValue: 100,
      access: { update: notTranslator },
      admin: { position: 'sidebar', description: 'Хэсэг дотор бага тоо эхэнд (1, 2, 3 …).' },
    },
  ],
};

// Хэрэглэгчийг кодоор үүсгэхгүй: анхны хэрэглэгчийг /admin/create-first-user хуудсаар (Payload нь хэрэглэгч
// нэг ч байхгүй үед л зөвшөөрдөг; дараа нь Forbidden). Production-д DB хоосон байсан ч тэр хуудсыг хаана
// (гадны хүн «анхны админ» болох эрсдэл) — зөвхөн PAYLOAD_ALLOW_FIRST_USER=1 үед нээгдэнэ.
const guardFirstUser: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' && !req.user && process.env.VERCEL_ENV === 'production' && process.env.PAYLOAD_ALLOW_FIRST_USER !== '1') {
    throw new APIError('Production-д анхны хэрэглэгчийг энэ хуудсаар үүсгэхгүй. Preview дээр үүсгэнэ үү.', 403, undefined, true);
  }
  if (ALL_USERS_ADMIN) data.role = 'admin';
  return data;
};

// Нууц үг ≥ 12 тэмдэгт: үүсгэх (Create first user, Create New), солих (Change Password), сэргээх (reset-password).
// Payload-ийн өөрийн шалгалт 3 тэмдэгт л шаарддаг. create/update-д data.password нь beforeValidate-д байна.
export const PASSWORD_MIN_LENGTH = 12;
const passwordTooShort = (pw: unknown) => typeof pw === 'string' && [...pw].length < PASSWORD_MIN_LENGTH;
// APIError (isPublic): мессеж admin-ий мэдэгдэл (toast)-д шууд гарна (ValidationError бол «field is invalid» л харагдана)
const passwordError = () => new APIError(`Нууц үг хамгийн багадаа ${PASSWORD_MIN_LENGTH} тэмдэгт байна.`, 400, undefined, true);
const checkPasswordLength: CollectionBeforeValidateHook = ({ data }) => {
  if (passwordTooShort(data?.password)) throw passwordError();
  return data;
};
const checkResetPasswordLength: CollectionBeforeOperationHook = ({ args, operation }) => {
  if (operation === 'resetPassword' && passwordTooShort((args as any)?.data?.password)) throw passwordError();
  return args;
};

export const users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Хэрэглэгч', plural: 'Хэрэглэгчид' },
  admin: { useAsTitle: 'email', group: 'Тохиргоо', defaultColumns: ['email', 'name', 'role', 'updatedAt'] },
  auth: {
    // Нууц үг (2FA асаалттай бол код, нөөц код ч) 5 удаа буруу → хаяг 15 минут түгжигдэнэ
    maxLoginAttempts: 5,
    lockTime: 15 * 60 * 1000,
    // Сесс: идэвхгүй 4 цаг → дахин нэвтэрнэ (admin нээлттэй, идэвхтэй байхад автоматаар сунгагдана)
    tokenExpiration: 4 * 60 * 60,
    cookies: { secure: process.env.NODE_ENV === 'production', sameSite: 'Lax' },
    useAPIKey: false,
  },
  access: {
    read: ({ req }) => (roleOf(req) === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false),
    create: isAdmin,
    update: ({ req }) => (roleOf(req) === 'admin' ? true : req.user ? { id: { equals: req.user.id } } : false),
    delete: isAdmin,
    // Түгжээг («Force Unlock») зөвхөн админ тайлна
    unlock: isAdmin,
  },
  // 2FA (нөөц кодын endpoint, хэрэглэгчийн хуудасны 2FA хэсэг) зөвхөн ADMIN_2FA_ENABLED үед
  endpoints: ADMIN_2FA_ENABLED ? twoFactorEndpoints : [],
  hooks: { beforeOperation: [checkResetPasswordLength], beforeValidate: [checkPasswordLength], beforeChange: [guardFirstUser] },
  fields: [
    { name: 'name', label: 'Нэр', type: 'text' },
    {
      name: 'role',
      label: 'Эрх',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Админ', value: 'admin' },
        { label: 'Редактор', value: 'editor' },
        { label: 'Орчуулагч', value: 'translator' },
      ],
      access: { update: ({ req }) => roleOf(req) === 'admin' },
      admin: {
        hidden: ALL_USERS_ADMIN,
        description: 'Админ — бүх эрх. Редактор — агуулга засах, нийтлэх. Орчуулагч — зөвхөн монголоос бусад хэл.',
      },
    },
    ...(ADMIN_2FA_ENABLED
      ? [
          {
            name: 'twoFactorUI',
            type: 'ui',
            admin: { components: { Field: '/payload/admin/TwoFactorClient#UserTwoFactorField' }, disableListColumn: true },
          } as Field,
        ]
      : []),
    // 2FA-ийн нөөц кодын HMAC (payload/security/twoFactor.ts). API-д хэзээ ч гарахгүй. 2FA унтраалттай үед ч
    // багана хэвээр (дахин асаахад migration хэрэггүй).
    {
      name: 'recoveryCodes',
      type: 'json',
      hidden: true,
      access: { create: () => false, read: () => false, update: () => false },
    },
  ],
};

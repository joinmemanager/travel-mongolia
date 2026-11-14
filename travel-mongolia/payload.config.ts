import path from 'path';
import { fileURLToPath } from 'url';

import { postgresAdapter } from '@payloadcms/db-postgres';
import { EXPERIMENTAL_TableFeature, lexicalEditor } from '@payloadcms/richtext-lexical';
import { s3Storage } from '@payloadcms/storage-s3';
import { en } from '@payloadcms/translations/languages/en';
import { ru } from '@payloadcms/translations/languages/ru';
import { buildConfig } from 'payload';
import sharp from 'sharp';

import { DEFAULT_LOCALE, LOCALES } from './lib/i18n/locales';
import { contentCollections, media, users } from './payload/collections';

// Payload CMS 3 (docs/plan/payload-migration.md). Сайт өгөгдлийг Local API-аар шууд DB-ээс уншина
// (lib/cms/payloadSource.ts), HTTP API хэрэглэхгүй. Admin: /admin.
//
// Орчны хувьсагч (утгыг Vercel / .env.local-д эзэмшигч оруулна, docs/plan/payload-report.md):
//   PAYLOAD_SECRET          — заавал (production). Байхгүй бол зөвхөн локалд туршилтын түлхүүр.
//   DATABASE_URI            — Neon Postgres (pooled, ?sslmode=require). Байхгүй бол локал Postgres 17
//                             (scripts/payload/local-db.sh, postgres://127.0.0.1:5433).
//   R2_BUCKET, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_PUBLIC_URL
//                           — Cloudflare R2 (S3 API). Байхгүй бол зураг локал хавтаст (.payload-media/).

const dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === 'production';
const LOCAL_DB = 'postgres://postgres:postgres@127.0.0.1:5433/postgres';

const r2 =
  process.env.R2_BUCKET && process.env.R2_ENDPOINT && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY
    ? {
        bucket: process.env.R2_BUCKET,
        endpoint: process.env.R2_ENDPOINT,
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
        publicUrl: (process.env.R2_PUBLIC_URL || '').replace(/\/$/, ''),
      }
    : null;

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || (isProd ? '' : 'local-dev-only-secret-not-for-production'),
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  admin: {
    user: users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: ' — Travel Hub Mongolia CMS' },
  },
  i18n: { supportedLanguages: { en, ru }, fallbackLanguage: 'en' },
  collections: [...contentCollections, media, users],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [...defaultFeatures, EXPERIMENTAL_TableFeature()],
  }),
  localization: {
    locales: LOCALES.map((l) => ({ code: l.code, label: l.label })),
    defaultLocale: DEFAULT_LOCALE,
    // Орчуулаагүй талбар монголоор (mn) гарна. Хуудас тухайн хэлээр нээгдэх эсэхийг publishedLocales шийднэ.
    fallback: true,
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || LOCAL_DB,
      max: 5,
      // Сул холболтыг эрт хаана: Neon-ий pooler болон serverless орчин удаан сул холболтыг тасалдаг (ECONNRESET)
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    },
    migrationDir: path.resolve(dirname, 'payload/migrations'),
    // Схемийг локал болон production-д ижил migration-оор (payload/migrations). Dev push-ийг PAYLOAD_DB_PUSH=1-ээр
    // асаана (анхдагчаар унтраалттай: production-той ижил замаар туршина).
    push: process.env.PAYLOAD_DB_PUSH === '1',
  }),
  sharp,
  graphQL: { disable: true },
  telemetry: false,
  // Төрлүүдийг гараар үүсгэнэ (node scripts/payload/cli.mjs generate:types); dev-д ачаалах бүрт процесс эхлүүлэхгүй
  typescript: { autoGenerate: false, outputFile: path.resolve(dirname, 'payload/payload-types.ts') },
  upload: { limits: { fileSize: 25_000_000 } },
  plugins: r2
    ? [
        s3Storage({
          bucket: r2.bucket,
          config: {
            endpoint: r2.endpoint,
            region: 'auto',
            forcePathStyle: true,
            credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
          },
          collections: {
            media: {
              prefix: 'media',
              // Зургийг R2-ийн public домэйноос шууд (Vercel-ээр дамжуулахгүй, function CPU зарцуулахгүй)
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) => `${r2.publicUrl}/${prefix ? `${prefix}/` : ''}${filename}`,
            },
          },
          // Vercel-ийн 4.5 MB хүсэлтийн хязгаарыг тойрч браузераас шууд R2 руу (R2 CORS-д PUT зөвшөөрөх)
          clientUploads: true,
        }),
      ]
    : [],
});


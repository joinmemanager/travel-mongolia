# Contentful → Payload CMS, 6 хэл: шинжилгээ ба хэрэгжүүлэлт (1-р үе шат)

Branch: `feat/payload` (worktree `C:\project\teslatraders-payload`). Огноо: 2026-11-12…13.
Өмнөх судалгаа: branch `docs/cms-migration-plan` → `docs/plan/cms-migration-plan.md` (CMS сонголт, үнэ, эрсдэл).
Тайлан ба дараагийн алхам: [payload-report.md](payload-report.md).

## 1. Шинжилгээ

### 1.1 Эх өгөгдөл

Contentful-аас нэг удаа бүрэн экспорт хийсэн (`scripts/payload/export-contentful.js`, 16 хүсэлт), дараа нь
өөрчлөгдсөнийг нэмсэн (`export-delta.js`, 4 хүсэлт). Бүх шинжилгээ, импорт, тулгалт локал JSON-оос
(`backups/contentful-export-2026-11-13/`, git-д ордоггүй).

| | Тоо |
|---|--:|
| Locale | 2: `mn` (үндсэн), `en` (fallback mn) |
| Content type | 18 (faqItem хоосон) |
| Entry | 3,538: нийтлэгдсэн 3,164, **changed (ноорогтой) 371**, draft 3 |
| Asset | 2,250 (240 MB; jpeg 2,151, png 84); «Зураг:» кредиттэй 2,209 |
| Rich text node | paragraph 26.7K, list-item 9.2K, heading-2/3/4, hyperlink 1,251, **embedded-asset-block 2,079**, table 19 (221 нүд), hr, blockquote. **Embedded entry алга** |

«changed» 371-ийн 339 нь сум — нөгөө session-ий дахин бичсэн ноорог. Импорт нийтлэгдсэн хувилбарыг нийтэлж,
ноорогийг нь Payload-ийн ноорог хувилбар болгон хадгална (алдагдахгүй).

Content type бүрийн талбар, төрөл, заавал эсэх, mn/en утгатай entry-ийн тоо, хязгаарлалт:
**[payload-analysis.generated.md](payload-analysis.generated.md)** (`scripts/payload/analyze-export.js` үүсгэсэн).

### 1.2 Холбоосууд (reference)

| Хаанаас | Талбар | Хаашаа |
|---|---|---|
| soum, place | `province` | province |
| heritagePlace, destination | `provinceRef` | province |
| heritageCategory | `places` (олон) | heritagePlace |
| story | `relatedPlace` (олон, олон төрөл) | destination / heritagePlace / province |
| visitorGuidance | `place` (олон төрөл) | destination / heritagePlace / province |
| province, destination, heritagePlace | `relatedExperience/Provider/Product` | communityExperience / localProvider / localProduct |
| event | `localServices` | localProvider |
| communityExperience / localProduct | `host` / `producer` | localProvider |
| province, destination | `faq` | faqItem |
| Бүгд | `image`, `photos`, `media`, `ogImage`, `emblem`, `coverImage` | asset |

### 1.3 Contentful-ийг уншдаг route-ууд

Бүх уншилт нэг функцээр (`lib/contentful.ts` → `client.getEntries(query)`), 41 газраас. Ашиглагддаг query: `content_type`,
`sys.id`, `fields.X`, `fields.X[in]`, `fields.X[ne]`, `fields.X.sys.id`, `order`, `select`, `include`, `limit`, `skip`.

| Route | Content type |
|---|---|
| `/` | destination, recommendation, cultureHeritage |
| `/province/[id]`, `/province/[id]/[soum]` | province, soum, place, heritagePlace, destination, visitorGuidance, localProvider |
| `/destination/[id]`, `/recommendation/[id]` | destination, recommendation, event (+ related) |
| `/destination/heritage`, `/[category]`, `/place/[id]` | heritageCategory, heritagePlace |
| `/destination/protected/[slug]`, `/landscapes/[slug]`, 5 ангиллын хуудас | place (+ heritagePlace, destination) |
| `/things-to-do/museums/[slug]`, `/wellness/[slug]`, `/festivals`, `/events` | place, event |
| `/about/history/[slug]`, `/people/[slug]`, `/about/culture/*/[slug]`, `/about/traditions/[slug]` | historyArticle, cultureArticle |
| `/about/nature/{wildlife,birds,plants}/[slug]` | species |
| `/stories/*`, `/stories/news/[slug]`, `/impact/examples/[slug]`, `/{local,respect,impact}/articles/[slug]` | story |
| `/local/*`, `/plan/accommodation/[slug]` | localProvider, communityExperience, localProduct |
| `/destination/region` (хайлт), `/sitemap.xml`, `/api/revalidate` | бүгд |

## 2. Архитектур

```
app/
  (site)/              ← сайтын бүх хуудас (2026-11-12 зөөсөн; URL өөрчлөгдөөгүй — route group)
    layout.tsx         ← хуучин app/layout.tsx яг хэвээр (Google verification + GA4), зөвхөн 2 import мөр @/-ээр
    [lang]/…           ← /en, /zh, /ru, /ko, /ja (одоогоор сумын хуудас)
  (payload)/           ← Payload admin (/admin) ба REST (/api/<collection>), өөрийн root layout
  api/, sitemap.ts, robots.ts, sitemaps/[file]/   ← layout-гүй route-ууд хэвээр
payload.config.ts      ← Postgres (Neon / локал), R2 (S3 adapter), localization 6 хэл, Lexical
payload/cfSchema.ts    ← Contentful-ийн схем (scripts/payload/generate-schema.js үүсгэсэн)
payload/collections.ts ← 18 collection + media + users, эрх, hook
payload/migrations/    ← production-д `payload migrate`
lib/contentful.ts      ← CMS_SOURCE=contentful|payload|snapshot
lib/cms/payloadSource.ts   ← Payload → Contentful хэлбэрийн хариу (сайтын код өөрчлөгдөхгүй)
lib/cms/snapshotSource.ts  ← локал экспорт → ижил хэлбэр (тулгалтад)
lib/cms/richText.ts        ← Contentful rich text ⇄ Lexical (6,454/6,454 round-trip ижил)
```

**Яагаад Payload-ийн өгөгдлийг Contentful хэлбэрт буулгасан бэ:** 41 query, 20+ lib файл, rich text рендерерүүд
(`RichText.tsx`, `richTextParts.ts`, `seo.ts`)-ийг өөрчлөхгүй. Шилжилт = `CMS_SOURCE=payload` орчны хувьсагч;
буцаах = `contentful`. Кэш (`unstable_cache`, `contentful:<type>` tag) хэвээр; Payload-ийн `afterChange` hook нь
webhook-тэй ижил `lib/revalidateEntry.ts`-ийг дуудна (хэлний хуудсуудыг ч шинэчилнэ).

**Сонголтууд (эргэлзээтэй үед аюулгүйг сонгосон):**

| Шийдвэр | Шалтгаан |
|---|---|
| Payload **3.93.0** (4.0 биш) | 4.0 beta; 3.x тогтвортой, Next 16.3.3+ дэмждэг |
| **pnpm** 10 (yarn 1 биш) | Payload yarn 1-ийг дэмждэггүй. `pnpm import`-оор одоогийн хувилбаруудыг хадгалсан. `yarn.lock` хэвээр үлдсэн (merge хийхэд устгана) |
| Collection slug = Contentful content type id | Query буулгалт шууд, кодын өөрчлөлт 0 |
| `sys.id` = Contentful-ийн хуучин ID (`contentfulId`) | Entry ID-тай хаягууд (`/destination/<id>`, `/recommendation/<id>`), кодонд бичигдсэн asset ID хэвээр |
| Зургийн хэмжээ upload үед (480/960/1600/2400 webp), нэр `<файл>-w960.webp` | Runtime хувиргалтгүй, Vercel-ийн зургийн квотгүй; `cdnImage()` URL-аас шууд тооцно |
| R2 зураг public домэйноос шууд | Vercel function CPU, трафик зарцуулахгүй |
| Хэлний хуудсыг `publishedLocales` талбараар нээх | Fallback-ийн монгол текст англи хаягаар индексжихээс сэргийлнэ |
| Admin-ий UI хэл: англи / орос | Payload-д монгол орчуулга байхгүй; талбарын нэр монголоор |
| Локал DB: **Postgres 17** (EDB portable) | PGlite туршсан — каталогийн query ≈1 сек, migration 10 минутад дуусаагүй. Neon-той ижил хувилбар |

## 3. Collection ба localization

- 18 collection (Contentful-ийн талбар бүр), `media`, `users`. Талбарын төрлийн буулгалт:
  Symbol → text (`in` хязгаарлалттай бол select), Text → textarea, RichText → richText (Lexical + хүснэгт),
  Integer → number, Boolean → checkbox, Date → date, Location → group {lat, lon}, Link Asset → upload,
  Link Entry → relationship (олон төрөлтэй бол polymorphic), Array&lt;Symbol&gt; → text hasMany.
- **Locale:** `mn` (үндсэн, fallback), `en`, `zh-CN`, `ru`, `ko`, `ja`.
- **Localized** = Contentful-д localized талбар: гарчиг/нэр, бүх бичвэр, rich text, `seoTitle`, `seoDescription`,
  жагсаалт текст (services г.м.), зургийн `title` (alt) ба `description` (кредит). **Slug, ангилал, холбоос, зураг,
  тоо, огноо хэлээс үл хамаарна** (slug хэл бүрт ижил).
- Нэмэлт талбар бүх collection-д: `publishedLocales` (орчуулга нийтлэгдсэн хэлүүд), `contentfulId`, `cfCreatedAt`,
  `cfFirstPublishedAt`, `cfVersion` (импортын тулгалт).
- Ноорог/нийтлэл: `versions.drafts` + хуваарьт нийтлэлт (`schedulePublish`), 25 хувилбар хүртэл.
- Эрх: `admin` (бүгд), `editor` (үүсгэх, засах, нийтлэх), `translator` (зөвхөн mn-ээс бусад хэлний localized талбар).

## 4. Routing ба SEO

| Хаяг | Хэл | Тайлбар |
|---|---|---|
| `/province/khentii/dadal` | mn | **Огт өөрчлөгдөөгүй** (HTML, canonical, redirect) |
| `/en/province/khentii/dadal` | en | `publishedLocales`-д `en` байвал 200, үгүй бол 404 |
| `/zh/…`, `/ru/…`, `/ko/…`, `/ja/…` | zh-CN, ru, ko, ja | ижил |
| `/xx/…` (танихгүй угтвар) | — | 404 |

- `app/(site)/[lang]/province/[id]/[soum]/page.tsx` нь монгол хуудасны компонентыг `setRequestLocale()`-той дуудна
  (next-intl-ийн арга). Өгөгдлийн давхарга тухайн хэлээр уншина. Загварын бичвэр: `lib/i18n/ui.ts`.
- **canonical:** хуудас бүр өөрийн хэлний хаяг. **hreflang:** зөвхөн нийтлэгдсэн хэлүүд + `x-default` = mn
  (`lib/i18n/seo.ts`). Орчуулгагүй монгол хуудасны metadata өмнөхтэй ижил.
- **Sitemap:** `/sitemap.xml` (монгол) өөрчлөгдөөгүй. Хэл бүр `/sitemaps/en.xml` … (hreflang-тай), robots.txt-д
  Payload горимд л жагсаана.
- Орчуулгын хуудаснаас [lang] хувилбаргүй хуудас руу (аймгийн хуудас г.м.) холбоос монгол хувилбар руу заана
  (`LOCALIZED_ROUTES`, 404 гарахгүй).
- `<html lang>`: root layout (Google tag-тай, өөрчлөхгүй) `mn`; хэлний хуудсанд агуулга `lang="en"` div-д, хөтөч дээр
  `document.documentElement.lang` сольдог. Google агуулгын хэлийг текстээс, hreflang-аас тодорхойлдог тул SEO-д
  нөлөөгүй. Бүрэн шийдэл (хэл бүрийн root layout) — GA-г давхардуулахгүйн тулд эзэмшигчтэй ярилцана (5.4).
- **Shorts:** `useSiteLang` орчуулгын хуудсанд URL-ийн хэлийг, бусад үед өмнөх шигээ googtrans cookie-г уншина.
  `/api/shorts/[lang]` хэвээр. Монгол хуудсанд үйлдэл огт өөрчлөгдөөгүй.
- **Дараагийн route-ууд** (12-р сард англиар бүх хуудас): аймаг, газар (protected/landscapes/museums/wellness),
  өвийн газар, түүх/соёлын нийтлэл, амьтан, мэдээ, нүүр, жагсаалтууд. Route бүрд: [lang] wrapper + `ui.ts`-ийн
  түлхүүр + `LOCALIZED_ROUTES` + хэлний sitemap-д төрөл. Цэс (`lib/navigation.ts`-д `en` нэр бий) ба footer-ийг
  pathname-ээр хэл сонгодог болгох.

## 5. Google Translate хэл солигчийг жинхэнэ хуудас руу шилжүүлэх төлөвлөгөө (одоохондоо солихгүй)

1. **Одоо:** Navbar-ийн хэл солигч `googtrans` cookie тавьж, Google Translate widget хуудсыг хөтөч дээр орчуулна.
2. **Шилжилт (хэл бүрээр, орчуулга бэлэн болсон хэлэнд):**
   - Хэл сонгоход: тухайн хуудасны тэр хэлний хувилбар байгаа эсэхийг (`<link rel="alternate" hreflang>`-ээс уншина —
     сервер аль хэдийн render хийсэн) шалгаад **байвал** `/en/...` руу шилжүүлж googtrans cookie-г устгана.
   - **Байхгүй бол** (тухайн хуудас орчуулагдаагүй) өмнөх шигээ Google Translate (fallback), дээр нь «Энэ хуудас
     машин орчуулга» гэсэн жижиг тэмдэглэл.
   - Орчуулгын хуудсанд «Монгол» сонгоход угтваргүй хаяг руу.
3. Хэл бүрийн хувилбарын эзлэх хувь 80%-иас давбал тухайн хэлний Google Translate-ийг унтраах (зөвхөн жинхэнэ
   хуудас).
4. Хэмжилт: GA4-д `language_switch` event (`from`, `to`, `mode: real|machine`).
5. Shorts-ийн хэлний логик нэг эх сурвалжаас (`readSiteLang`) уншдаг тул нэмэлт өөрчлөлт шаардахгүй.

## 6. Шилжүүлэх скрипт ба тулгалт

```bash
# Contentful → локал JSON (нэг удаа; 12/1-нд --out-тэй шинээр)
node scripts/payload/export-contentful.js            # ≈16 хүсэлт
node scripts/payload/export-delta.js                 # дараа нь зөвхөн өөрчлөгдсөн, ≈4 хүсэлт
# Payload (travel-mongolia/)
node scripts/payload/cli.mjs migrate                 # схем
node scripts/payload/cli.mjs run scripts/payload/import.ts --export ../backups/contentful-export-<огноо>
node scripts/payload/cli.mjs run scripts/payload/verify.ts --export ../backups/contentful-export-<огноо>
```

- **Импорт** (`import.ts`): зураг эхэлж (файлыг CDN-ээс нэг удаа татаж `backups/asset-files/`-д кэшлэнэ — API
  хүсэлт биш), дараа нь entry хоёр үе шаттай (placeholder → бүтэн утга). published → нийтэлнэ; changed → нийтэлсэн
  хувилбар + ноорог; draft → ноорог; archived → алгасна.
- **Idempotent:** `contentfulId`-аар тулгана; `cfVersion` (Contentful sys.version) өөрчлөгдөөгүй entry, `cfFileUrl`
  өөрчлөгдөөгүй зураг алгасагдана. Дахин ажиллуулахад давхардахгүй, 12/1-нд зөвхөн өөрчлөгдсөнийг шинэчилнэ.
- **Тулгалт** (`verify.ts`): сайтын адаптераар уншиж экспорттой талбар бүрээр (rich text-ийг бүтэц, текст, зураг,
  холбоосоор), тоог төрөл × төлөвөөр харьцуулна → `docs/plan/payload-verify.md`.
- **URL-ийн тулгалт:** `next dev`-ийг `CMS_SOURCE=snapshot` (хуучин өгөгдөл) ба `CMS_SOURCE=payload` хоёроор
  ажиллуулж `/sitemap.xml`-ийн хаяг бүр, хуудасны гарчиг/canonical/H1/үндсэн текстийн hash-ийг харьцуулна
  (`scripts/payload/compare-urls.mjs`). Contentful руу хүсэлт явуулахгүй.

## 7. Хурд ба зардал: Vercel Pro ба Cloudflare

Үнэ 2026-11-13-нд албан ёсны хуудаснаас (эх сурвалж доор). CPU-ийн хэмжээ нь `docs/plan/vercel-cpu.md`-ийн хэмжилт
ба таамаг (render ≈0.5 CPU-сек) дээр.

**Ачааллын тооцоо (6 хэл):** хаяг ≈3,000 (mn) → бүх хэл бүрэн орчуулагдвал ≈18,000. Хуудас ISR-ээр 7 хоногт ≈1
удаа (эсвэл нийтлэхэд) render. CPU: 18,000 × 0.5 сек ≈ 2.5 цаг / 7 хоног ≈ **11 цаг/сар**; production deploy бүр
ISR-ийг шинэчилдэг тул 7 хоногт 3 deploy бол дээд тал нь ≈ **40 цаг/сар**. Payload-ийн DB уншилт I/O (хүлээлт) тул
Fluid-ийн «Active CPU»-д бараг нэмэгдэхгүй.

| | **Vercel Pro** | **Cloudflare Workers (OpenNext)** |
|---|---|---|
| Суурь | $20/сар (1 seat), **$20 usage кредит** багтсан | $5/сар |
| CPU | Active CPU $0.128/цаг → 11–40 цаг = **$1.4–5.1** | 30 сая CPU-мс (=8.3 цаг) багтсан, дараа $0.02/сая мс (=$0.072/цаг) → **$0–2.3** |
| Санах ой | $0.0106/GB-цаг → 2 GB × ≈50–150 цаг ≈ **$1–3** | Тооцдоггүй |
| Хүсэлт | CDN 10 сая/сар багтсан; function $0.60/сая; ISR унших $0.40/сая, бичих $4/сая | 10 сая/сар багтсан, дараа $0.30/сая |
| Трафик | 1 TB/сар багтсан | Үнэгүй |
| **Нийт (тооцоо)** | **$20/сар** (хэрэглээ $3–9 кредитэд багтана) | $5–8/сар + шилжүүлэх ажил |
| Эрсдэл | Одоогийн тохиргоо, ажиллаж байгаа | Next 16 + Payload-ийг Workers-т (OpenNext) ажиллуулах: bundle-ийн хэмжээ, Sharp ажиллахгүй (зургийн хэмжээг R2/Images-ээр), ISR-д R2/KV кэш тохируулах, Postgres-д Hyperdrive. **Их ажил, эрсдэлтэй** |

**Зөвлөмж:** Vercel Pro дээр үлдэх (6 хэлтэй ч $20-ийн кредит дотор). Cloudflare-ийг **R2 (зураг)** болон
шаардлагатай бол DNS/CDN-д ашиглана. Cloudflare Pages-ийн function нь Workers-аар тооцогддог (Cloudflare-ийн
хуудсанд бичсэн) тул тусдаа сонголт биш. Vercel → Usage-ийн бодит тоог 1-р сард хэлүүд нэмэгдэхэд дахин шалгана;
Active CPU сард 100 цагаас давбал (≈$13) render-ийн шалтгааныг дахин судална.

## Эх сурвалж (2026-11-13)

- Vercel үнэ: https://vercel.com/pricing (Pro $20/seat, $20 кредит, Active CPU $0.128/цаг, санах ой $0.0106/GB-цаг,
  CDN 10 сая хүсэлт, 1 TB трафик, ISR $0.40/$4 сая)
- Cloudflare Workers үнэ: https://developers.cloudflare.com/workers/platform/pricing/ ($5/сар, 10 сая хүсэлт,
  30 сая CPU-мс, $0.30/сая хүсэлт, $0.02/сая CPU-мс, egress үнэгүй; R2 10 GB үнэгүй, $0.015/GB-сар)
- Payload: https://payloadcms.com/docs (localization, drafts, upload/imageSizes, storage-s3, postgres adapter)

# Payload CMS + 6 хэл: 1-р үе шатын тайлан

Огноо: 2026-11-14. Branch: **`feat/payload`** (worktree `C:\project\teslatraders-payload`). **Push хийгээгүй,
main-д merge хийгээгүй.** Contentful-д нэг ч бичилт хийгээгүй.

Дэлгэрэнгүй төлөвлөгөө, архитектур: [payload-migration.md](payload-migration.md).

## 1. Товчоор

| # | Ажил | Төлөв |
|---|---|---|
| 1 | Шинжилгээ (content type, талбар, холбоос, rich text, asset, route) | ✅ [payload-migration.md](payload-migration.md) §1, [payload-analysis.generated.md](payload-analysis.generated.md) |
| 2 | Payload 3.93 апп дотор (Postgres/Neon, R2/S3), локал Postgres | ✅ `/admin` ажиллаж байна; локал Postgres 17 |
| 3 | 18 collection, 6 locale, localized талбар, slug хэл бүрт ижил | ✅ + initial migration |
| 4 | Routing `/en/...` г.м., hreflang, canonical, хэлний sitemap, GT шилжилтийн төлөвлөгөө, shorts | ✅ сумын хуудсаар пилот (бусад route — 12-р сард) |
| 5 | Шилжүүлэх скрипт (ноорог + нийтлэгдсэн, idempotent), автомат тулгалт | ✅ — тоо §3-т |
| 6 | Орчуулгын бэлтгэл: толь бичиг 556, хэв маяг, 10 пилот, экспорт/импорт/шалгагч, API харьцуулалт | ✅ `docs/translation/` |
| 7 | Vercel Pro ба Cloudflare-ийн зардал | ✅ payload-migration.md §7 — Vercel Pro-д үлдэх ($20/сар) |

**Contentful-ийн хүсэлт: нийт 27** (бүгд унших): бүрэн экспорт 16 (CMA 9, CDA 7; 11/12) + өөрчлөгдсөний экспорт 4
(CMA 2, CDA 2; 11/13) + өөрчлөгдсөний экспорт 7 (11/16; §9). Зургийн файлыг `images.ctfassets.net`-ээс нэг удаа татсан (API хүсэлт биш, Asset bandwidth,
≈240 MB) — `backups/asset-files/`-д кэшлэгдсэн, дахин татахгүй.

## 2. Юу хийгдсэн

**Код (`feat/payload`):**
- Сайтын бүх route `app/(site)/`-д (URL өөрчлөгдөөгүй), Payload `app/(payload)/` (`/admin`, `/api/<collection>`).
  `app/(site)/layout.tsx` = хуучин `app/layout.tsx`, Google verification ба GA4 **яг хэвээр** (зөвхөн 2 import мөр).
- `CMS_SOURCE=contentful` анхдагч → main-д merge хийсэн ч Contentful-ээс уншсаар (production өөрчлөгдөхгүй).
  `payload` болгоход Payload-аас, `snapshot` — локал экспортоос (тулгалтад).
- Payload-ийн өгөгдлийг Contentful-ийн хариуны хэлбэрт буулгадаг адаптер — 41 query, бүх хуудас өөрчлөгдөөгүй.
- Rich text Contentful ⇄ Lexical: **6,454 / 6,454** баримт round-trip ижил.
- Зураг: upload үед 4 хэмжээ (webp), `cdnImage()` шууд тооцно; R2 public домэйноос.
- `/en/province/<аймаг>/<сум>` (бусад 4 хэл ижил): орчуулга нийтлэгдээгүй бол 404; canonical, hreflang,
  `/sitemaps/<хэл>.xml`; `/xx/...` 404. Shorts URL-ийн хэлийг уншдаг болсон.
- Нийтлэхэд кэш шинэчлэх (Contentful webhook-ийн логикийг `lib/revalidateEntry.ts`-д гаргаж, Payload hook-той
  хуваалцсан; хэлний хаягууд нэмэгдсэн).
- `pnpm` 10 рүү (Payload yarn 1-ийг дэмждэггүй), Vercel build: `DATABASE_URI` байвал migration.

**Шалгалт:** `tsc` — шинэ код алдаагүй (өмнөх 2 алдаа хэвээр: `map/page.tsx`, `RoutesExplorer.tsx`). Локал
`next dev`: `/`, сум, аймаг, `sitemap.xml`, `robots.txt` 200; `/en/...` (орчуулгагүй) 404; `/admin` 200.

**Орчуулга (`docs/translation/`):** [HOW-TO.md](../translation/HOW-TO.md), [glossary.csv](../translation/glossary.csv)
(556), [style-guide.md](../translation/style-guide.md), [pilot-en/](../translation/pilot-en/) (10 хуудас, шалгагч
алдаа 0), [batches/](../translation/batches/) (313 хуудас → 7 файл; экспортоос хойш дахин бичсэн 394 нь дараагийн экспортод), шалгагч, Payload импорт,
[api-comparison.md](../translation/api-comparison.md).

**Redirect** (тусдаа ажил, branch `docs/redirect-check-1112`): 3,371 хаягаас 3,370 зөв; зөвхөн
`cate14_more.aspx?ItemID=92` үлдсэн — `docs/redirects/coder-note-2026-11-12.md`.

## 3. Шилжүүлэлтийн тулгалт (локал)

Экспорт `contentful-export-2026-11-13`-ийг локал Postgres-д импортлоод хоёр шатаар тулгасан (Contentful руу
хүсэлтгүй: «хуучин» талыг локал экспортоос `CMS_SOURCE=snapshot`-оор сайтын ижил кодоор рендерлэсэн).

**1) Өгөгдөл** — [payload-verify.md](payload-verify.md) (`verify.ts`, сайтын адаптераар уншиж талбар бүрээр):

| | Экспорт | Payload |
|---|--:|--:|
| Entry-ийн хувилбар (нийтлэгдсэн + ноорог), талбар бүрээр ижил | 3,956 | **3,956 ижил, зөрүү 0** |
| 18 төрөл тус бүрийн тоо (нийтлэгдсэн / бүгд) | | **18/18 таарсан** |
| Зураг (asset) | 2,250 | 2,250 |
| Rich text round-trip (Contentful → Lexical → Contentful) | 6,454 | 6,454 ижил |
| Орчуулгын Markdown round-trip (`scripts/translation/test-md.js`) | 3,215 | 3,215 ижил |

**2) Хаяг, хуудас** — [payload-url-compare.md](payload-url-compare.md) (`compare-urls.mjs`):

| | Хуучин (snapshot) | Payload |
|---|--:|--:|
| `sitemap.xml`-ийн хаяг | 2,297 | 2,297 (зөвхөн нэг талд: 0) |
| Дээжийн 329 хуудас: статус, title, canonical, description, H1, `<main>` текстийн hash | | **329 ижил** |

Генерацлагдсан тайланд 13 зөрүү харагдана: бүгд **нэг талд л** 500/холболт тасарсан (8 GB RAM-тэй машинд хоёр
`next dev` зэрэг ~4 GB-аар ажиллаж, сул санах ой ~120 MB болсон). Тэр 13-ыг серверийг нэг нэгээр нь асаагаад дахин
татахад 13/13 ижил гарсан. Өгөгдлийн зөрүү биш.

**Тулгалтын явцад олдож засагдсан алдаа:**
- `cfCreatedAt` нь CMA-ийн `createdAt` байсан; сайтын эрэмбэ CDA-ийн `sys.createdAt`-аас (= анх нийтэлсэн огноо)
  хамаардаг → `firstPublishedAt` болгож засав (импорт + DB-ийн бүх хүснэгт). `order`-гүй query-д хоёр эх үүсвэрт
  ижил тогтмол эрэмбэ.
- **Зөвхөн `next dev`-д:** `unstable_cache` 2 MB-аас том хариуг dev горимд алдаа болгон шиддэг → `sitemap.ts`
  хоосон жагсаалт авч сумын 303 хаяг локал sitemap-аас алга болж байсан. `feat/payload`-д засагдсан
  (`lib/contentful.ts`: татсан өгөгдлийг кэшгүй буцаана). **Production-д нөлөөгүй** (2026-11-14 шалгасан): Next.js
  16.3.5 production-д зөвхөн анхааруулга бичиж өгөгдлөө буцаадаг (`incremental-cache`: `if (this.dev) throw`);
  live `sitemap.xml`-д 2,301 хаяг байна. (Өмнөх хувилбарт «production-д ч байгаа» гэж буруу бичсэн байсныг засав.)
- Postgres-ийн сул холболт тасрах (ECONNRESET) → pool-ийн timeout + нэг удаа дахин оролдох.
- `/sitemaps/en.xml` хоосон байсан (`publishedLocales`-ээр шүүх query) → засав.

**3) `/en` end-to-end (локал, Payload):** пилотын Дадал, Тэсийг `import-translations.ts`-ээр en ноорог болгон
оруулж → нийтлэхээс өмнө `/en/province/khentii/dadal` **404** → `publish-translation.ts`-ээр нийтэлсний дараа
(кэш шинэчлэгдсэний дараа):
- `/en/province/khentii/dadal`, `/en/province/zavkhan/tes` — **200**, англи title/H1/description,
  canonical `/en/...`, hreflang `mn` + `en` + `x-default`;
- монгол `/province/khentii/dadal` — canonical өөрчлөгдөөгүй, hreflang `en` нэмэгдсэн;
- орчуулаагүй `/en/province/zavkhan/bayantes` ба нийтлээгүй хэл `/zh/province/khentii/dadal` — **404**;
- `/sitemaps/en.xml` — 2 хаяг hreflang-тай; `/sitemaps/zh.xml` — хоосон; `robots.txt` — `/admin` хаалттай,
  хэлний sitemap-ууд (зөвхөн `CMS_SOURCE=payload` үед).

Анхаар: CLI-аар нийтлэхэд dev серверийн Data Cache шинэчлэгдэхгүй (тусдаа процесс). Admin-аас нийтлэхэд hook
нь `contentful:soum` tag-ийг шууд хүчингүй болгоно. Мөн Payload-д нийтлэх нь тухайн хуудасны **монгол ноорогийг ч**
нийтэлдэг (локал DB-д Дадал, Тэсийн монгол ноорог нийтлэгдсэн) — §7.

## 4. Үлдсэн ажил

| Ажил | Хэзээ | Тэмдэглэл |
|---|---|---|
| Neon, R2 түлхүүр оруулах (§5) | 11-р сарын 20 хүртэл | Таны хийх |
| Preview дээр бүтэн туршилт (`CMS_SOURCE=payload`, Neon + R2) | Түлхүүрийн дараа | Push хийх зөвшөөрөл хэрэгтэй (`feat/payload`-ийг preview болгох) |
| Зургийг R2 руу: импортыг R2-тэй орчинд дахин (зөвхөн зураг) | Түлхүүрийн дараа | Локал кэшээс, Contentful-д хүсэлтгүй |
| `[lang]` хувилбар: аймаг, газар, өвийн газар, нийтлэл, амьтан, мэдээ, нүүр, жагсаалт | 12-р сар | Сумын загвараар; цэс/footer-ийг хэлээр |
| Англи орчуулга: en-001–019 (893 хуудас) + en-review (90) → бусад ≈2,000 | 12-р сар | §9, HOW-TO; Batch API автоматжуулалтад `ANTHROPIC_API_KEY` |
| Хэл солигчийг жинхэнэ хуудас руу (§5 төлөвлөгөө) | 12-р сарын эцэс | payload-migration.md §5 |
| ~~2FA / admin-ий хамгаалалт~~ | ✅ 11/24 | §12–13: lockout, session, нууц үг ≥12; 2FA бэлэн боловч унтраалттай (`ADMIN_2FA_ENABLED`) |
| `next.config.js`-ийн `eslint` түлхүүр Next 16-д танигдахгүй (анхааруулга) | Хүссэн үедээ | Өмнө нь ч байсан |

## 5. Танаас хэрэгтэй зүйл: `.env.local` ба Vercel-д нэмэх хувьсагчид

Утгыг та оруулна. `.env.local`-ийг би нээгээгүй. Vercel-д **Preview**-д эхлээд, 12/1-нд Production-д.

| Нэр | Юу | Хаанаас |
|---|---|---|
| `DATABASE_URI` | Neon Postgres-ийн **pooled** холболт: `postgresql://…-pooler…/…?sslmode=require` | Neon → Project → Connection string (Pooled), Postgres 17, бүс: Singapore (aws-ap-southeast-1) ойр |
| `PAYLOAD_SECRET` | 32+ тэмдэгтийн санамсаргүй мөр (session/JWT) | `openssl rand -hex 32` г.м. Preview, Production-д өөр өөр |
| `R2_BUCKET` | Bucket-ийн нэр (жишээ `thm-media`) | Cloudflare → R2 → Create bucket |
| `R2_ENDPOINT` | `https://<ACCOUNT_ID>.r2.cloudflarestorage.com` | R2 → bucket → Settings (S3 API) |
| `R2_ACCESS_KEY_ID` | R2 API token-ий Access Key ID | R2 → Manage API tokens (Object Read & Write, тухайн bucket) |
| `R2_SECRET_ACCESS_KEY` | Нөгөө хэсэг | ижил |
| `R2_PUBLIC_URL` | Зургийн public домэйн, жишээ `https://media.travelhubmongolia.com` | R2 → bucket → Custom Domains (эсвэл r2.dev хаяг) |
| `CMS_SOURCE` | `payload` — **зөвхөн шилжих үед** (Preview-д туршихад, 12/1-нд Production-д) | — |

R2-ийн CORS-д сайтын домэйнээс `PUT` зөвшөөрөх (admin-аас том зураг шууд upload хийхэд).

## 6. 12/1-ний шилжилт — алхам алхмаар

**Өмнө (11/20–11/30):** түлхүүр (§5) → `feat/payload`-ийг push хийж preview (таны зөвшөөрлөөр) → preview-д
`CMS_SOURCE=payload`, Neon-д migration, бүтэн импорт → `verify.ts` + `compare-urls.mjs` → редакторуудад admin-ий
заавар, хэрэглэгч үүсгэх → `main`-ийн өөрчлөлтийг `feat/payload` руу merge (шинэ файлыг `app/(site)/`-д зөөх).

**12/1 (ачаалал багатай цагт, ≈3 цаг):**

| # | Алхам | Хэн | Шалгах |
|---|---|---|---|
| 1 | **Content freeze** зарлах: Contentful-д засвар хийхгүй (дахин бичих session-ийг зогсоох) | Та | — |
| 2 | Эцсийн экспорт: `node scripts/payload/export-contentful.js --out backups/contentful-export-2026-12-01` (≈16 хүсэлт) | Claude | meta.json-ийн тоо |
| 3 | Neon-ийн **branch/snapshot** (буцаах цэг) | Claude/Та | Neon → Branches |
| 4 | Импорт (Production DB, R2): `import.ts --export …2026-12-01` — өөрчлөгдсөнийг л шинэчилнэ | Claude | тайлан: failed 0 |
| 5 | `verify.ts` — зөрүү 0, тоо таарна; `compare-urls.mjs` — sitemap ижил, хуудсууд ижил | Claude | payload-verify.md |
| 6 | `feat/payload` → `main` merge, push (таны зөвшөөрлөөр) | Claude | build success |
| 7 | Vercel Production: `CMS_SOURCE=payload` + §5-ийн бүх хувьсагч → Redeploy | Та/Claude | production deploy success |
| 8 | Production-ийн 30 гол хаяг: 200, title, canonical; `sitemap.xml`-ийн тоо өмнөхтэй ижил; GA4 realtime, Search Console verification meta | Claude | тайлан |
| 9 | Admin-д нэг тестийн засвар → нийтлэх → хуудас шинэчлэгдсэн эсэх (кэш, IndexNow) | Та | — |
| 10 | Freeze-ийг цуцлах: засвар зөвхөн Payload-д | Та | — |

**Буцаах:** Vercel-д `CMS_SOURCE=contentful` → Redeploy (≈5 мин). Contentful-ийг 60 хоног хөндөхгүй.
12/1-ээс хойш Payload-д орсон засвар Contentful-д байхгүйг анхаар.

## 7. Эрсдэл

| Эрсдэл | Магадлал | Бууруулах |
|---|---|---|
| App-ийн бүтцийг `(site)` руу зөөсөн → main-тай merge хийхэд нөгөө session-ий шинэ/засварласан файлууд | Өндөр | Git rename-ийг танина; шинэ файлыг `app/(site)/`-д зөөнө; merge-ийг freeze-ийн дараа нэг удаа |
| `yarn.lock` устгаж pnpm руу: Vercel build орчин | Дунд | Preview-д эхлээд шалгана; `packageManager: pnpm@10.34.9` |
| Neon cold start / холболт | Бага | Pooled URI, ISR + Data Cache; DB алдааг outage гэж үзээд хуучин хуудсаа харуулна |
| Зургийн URL солигдох (ctfassets → R2) → Google Images | Дунд | Хуудасны URL өөрчлөгдөхгүй; зураг дахин индексжинэ |
| Хэлний хуудсууд тусдаа root layout-тай (`app/(i18n)`, §9): Navbar/Footer-ийн өөрчлөлтийг хоёр layout-д | Бага | Хоёулаа ижил компонент ашигладаг; зөвхөн layout-ийн JSX давхардсан |
| Payload 4.0 руу шинэчлэх | Гарцаагүй (2027) | 3.x-д admin-ийг бага өөрчилсөн |
| Орчуулгын чанар (AI) | Дунд | Толь бичиг, шалгагч, хүний шалгалт, `publishedLocales`-ээр зөвхөн шалгасныг нээх |
| Admin-д 2FA байхгүй (шийдвэрээр, §13) — нууц үг л хамгаална | Дунд | ≥12 тэмдэгт, 5 оролдлого/15 мин түгжээ; хүн бүрт тусдаа хаяг, ажлаас гарахад нууц үг солих; шаардлагатай бол `ADMIN_2FA_ENABLED = true` |
| Орчуулга нийтлэхэд монгол ноорог ч хамт нийтлэгдэнэ (Payload-ийн draft нь баримт бүхэлдээ) | Дунд | 12/1-ээс өмнө 339 сумын монгол ноорогийг нийтлэх/цэвэрлэх; дараа нь монгол засварыг нийтлээгүй үлдээхгүй байх |
| Нөгөө session 12/1 хүртэл Contentful-д ноорог нэмсээр | Тодорхой | Эцсийн экспорт бүх ноорогийг авна (changed → Payload-ийн ноорог) |

## 8. Локал орчин (Claude-д / дараагийн session-д)

- Node: `.tools/node/node.exe` (v24.22.3, албан ёсны zip, SHA-256 шалгасан), pnpm: `.tools/bin/pnpm` (10.34.9).
- Postgres 17: `sh travel-mongolia/scripts/payload/local-db.sh start` (порт 5433, өгөгдөл `.tools/pgdata`).
- Payload CLI: `node scripts/payload/cli.mjs migrate | generate:importmap | run <скрипт>` (tsx-ийн оронд Node-ийн
  type-stripping; tsx undici-г эвддэг).
- Бүгд gitignore-д: `.tools/`, `backups/`, `travel-mongolia/.payload-media/`.

## 9. 11/16-ны нэмэлт: шинэ экспорт, орчуулгын багц, `<html lang>`

**Нийтлэлт (нөгөө session, 11/16 09:37–10:17):** дахин бичсэн 983 хуудаснаас **881 нийтлэгдсэн** (алдаа 0),
«ГАРААР ШАЛГАХ» тэмдэглэгээтэй **92 нийтлээгүй**, 10 алгассан (9 нь сүлдний кодыг production-д гартал хүлээж буй сум,
1 нь аль хэдийн нийтлэгдсэн Баянтүмэн). Commons-ийн 128 зураг нийтлэгдсэн. Тоолуур 09:55-аас хойш өөрчлөгдөөгүй
тул хүлээлт шууд дууссан.

**Экспорт:** `backups/contentful-export-2026-11-16` (11/13-ныхан дээр өөрчлөгдсөнийг нэмсэн бүтэн хуулбар; 12/1-ний
шилжилтэд хадгална, gitignore). **Contentful-д 7 хүсэлт** (бүгд GET): CMA 3, CDA 3, мөн эхний оролдлого 1 нь
Contentful-ийн 7 MB-ийн хариуны хязгаараас болж 400 буцсан → `export-delta.js` хуудасны хэмжээг автоматаар
багасгадаг болсон. Өөрчлөгдсөн: CMA entry 989, asset 576; CDA entry 881, asset 128.

**Шинэ багцууд** (`docs/translation/batches/`, бүгд эхэндээ en-001-тэй ижил бэлэн prompt-той):

| Файл | Хуудас | Юу |
|---|--:|---|
| en-008 … en-018 (11 файл) | 50 тус бүр | Нийтлэгдсэн дахин бичсэн хуудсууд |
| en-019 | 30 | ижил |
| **Нийт шинэ** | **580** | en-001–007-той давхардаагүй |
| en-review-001 | 50 | «ГАРААР ШАЛГАХ» (нийтлээгүй, ноорог хувилбар) |
| en-review-002 | 40 | ижил |
| **en-review нийт** | **90** | 92-оос 2 нь en-006-д аль хэдийн орсон тул давхардуулаагүй: 421 Чингис хаан олон улсын нисэх онгоцны буудал, 431 Их Майдар цогцолбор |

- Дүн: дахин бичсэн **983 хуудас бүгд 21 багцад яг нэг удаа** орсон (en-001–019: 893, en-review: 90).
- Нийтлэгдээгүй/алгассан 9 хуудас шинэ багцад ороогүй. en-001–007-д аль хэдийн байгаа 9 сум (Дадал, Буянт, Манхан,
  Хэрлэн, Эрдэнэдалай, Баянгол, Жавхлант, Ховд, Хяргас) одоо монголоороо нийтлэгдээгүй (сүлдний кодыг хүлээж буй) —
  текст нь эцсийн тул орчуулж болно, монгол нь нийтлэгдсэний дараа англиа нийтэлнэ.
- Бүтцийн шалгалт: 21 файл бүгд OK (prompt, ENTRY/END, давхардсан id алга, Markdown round-trip ижил). Шалгагчийг
  (`check.js`) en-008, en-review-001 дээр өөртэй нь ажиллуулахад бүтэц/талбар/Markdown-ийн алдаа 0 (зөвхөн
  орчуулаагүй тул «кирилл үлдсэн»).
- `export-batches.js`: гаргасан багцыг дахин бичихгүй (орчуулагч авсан байж болно), аль нэг багцад орсон хуудсыг
  дахин оруулахгүй, анхдагчаар зөвхөн нийтлэгдсэн хуудас, `--review` — «ГАРААР ШАЛГАХ».

**`<html lang>`:** хэлний хуудсууд (`/en`, `/zh`, `/ru`, `/ko`, `/ja`) `app/(i18n)/[lang]/`-д өөрийн root layout-тай
болсон → server-rendered HTML-д `<html lang="en">` (zh-д `zh-Hans` г.м.). URL өөрчлөгдөөгүй. `app/(site)/layout.tsx`
огт хөндөөгүй: verification-тэй metadata-г тэндээс import, GA4 ижил ID. Орчуулсан хуудсанд Google Translate-ийн
скрипт ачаалахгүй. Локал (Payload) шалгалт: `/en/province/khentii/dadal` 200, `lang="en"`, англи title, canonical,
verification, GA4; монгол Дадал `lang="mn"` хэвээр, hreflang en; орчуулаагүй/нийтлээгүй хэл/танихгүй угтвар 404.

**Дараагийн алхам:**
1. Орчуулга: en-008-аас эхлэн HOW-TO-гийн дагуу (en-review-ийг монгол нь шалгагдсаны дараа — эх нь өөрчлөгдвөл
   орчуулга хуучирна).
2. 9 сумын сүлдний код production-д гарч, монгол нь нийтлэгдсэний дараа тэдгээрийн англиа нийтлэх.
3. Neon/R2 түлхүүр (§5) → preview туршилт → 12/1-ний шилжилт (§6; эцсийн экспорт нь энэ экспорт дээр delta).

## 10. 11/20: Neon + R2 дээр бүтэн импорт, нэр томъёо, Shorts, API орчуулгын туршилт

**Neon + R2 (Contentful-д хүсэлтгүй, `contentful-export-2026-11-16`-аас):**

| Шалгалт | Үр дүн |
|---|---|
| Migration (Neon) | `initial` + `r2_storage` + `mn_collation` — бүгд хэрэглэгдсэн |
| Импорт | entry 3,538, зураг 2,361; **failed 0** ([тайлан](../../backups/) `payload-import-2026-11-20T091003.json`) |
| R2 | 11,805 объект (2,361 × эх + 4 хэмжээ), 657 MB; **дутуу 0, илүү 0** |
| Сайжруулсан зураг (`tmp/images-enhanced`, asset id-аар) | **2,205 / 2,205** нь эхийн оронд орсон; үлдсэн 156 нь эх |
| `verify.ts` | 3,747 хувилбар **бүгд ижил, зөрүү 0**; 18/18 төрлийн тоо таарсан ([payload-verify.md](payload-verify.md)) |
| `compare-urls.mjs` | sitemap 2,372 = 2,372 (зөвхөн нэг талд 0); дээжийн 339 хуудаснаас **336 ижил**, 3 нь сайжруулсан зургийн цомог (доор); **бодит зөрүү 0** ([payload-url-compare.md](payload-url-compare.md)) |

**Явцад олдож засагдсан алдаа (production-д ч нөлөөлөх байсан):**
1. **R2 багана дутуу** — анхны migration R2 plugin-гүй орчинд үүссэн тул `media.prefix`, `_objectkey` алга → бүх зураг
   алдаа. `20261120_042234_r2_storage` migration нэмэв. Цаашид `migrate:create`-ийг R2-ийн env-тэй ажиллуулах
   (эс бөгөөс эдгээр баганыг DROP хийх migration үүснэ).
2. **Зураг R2-д чимээгүй алгасагдах** — импорт бүх дуудлагад нэг `context` объект дамжуулж байсан; storage plugin
   түүнд файлын төлөв хадгалдаг тул эхнийхээс бусад нь upload хийгдээгүй (doc үүссэн, файл 404). Дуудлага бүрт шинэ
   context.
3. **Neon холболт тасрах** («Connection terminated unexpectedly») — listener-гүй pg client-ийн `error` event процессыг
   унагадаг байсан (импорт 2 удаа 1,600 зураг / 2,600 entry дээр унасан). Импортод pool/client-ийн error listener
   нэмэв; дахин ажиллуулахад дууссаныг алгасдаг тул өгөгдөл давхардаагүй.
4. **Кирилл эрэмбэ** — Neon-ий DB `C.UTF-8` collation-тай: `order: 'fields.name'` нь «Өндөр», «Үүлэн»-ийг жагсаалтын
   төгсгөлд гаргаж байсан (`/local/food` г.м.). `20261120_100000_mn_collation` migration: `*_locales.title/name`
   18 баганыг `und-x-icu` (Ө нь О-гийн, Ү нь У-гийн дараа, латин эхэнд — Contentful/snapshot-той ижил).
5. **Тэнцүү утгын эрэмбэ** — `startDate`-гүй 33 арга хэмжээний дараалал тогтмол бус байв → хоёр адаптерт
   `sys.id`-аар tiebreak.
6. Локал тулгалтын хуурамч зөрүү: `next dev`-ийн `.next/dev/cache/fetch-cache` 11/13-ны экспортын өгөгдлийг
   хадгалсаар байсан (sitemap 2,297 гэж харагдсан) — тулгалтын өмнө кэшийг цэвэрлэх.

**Хүлээгдэж буй ялгаа (алдаа биш):** сайжруулсан зураг 2× том тул 250px-ийн зарим зураг 500px болж аймгийн
«Зургийн цомог»-т орох босгыг давна (Дорнод, Өмнөговь, Баянхонгор) — шинэ сайт дээр цомог нэмэгдэж харагдана.

**Нэр томъёо (орчуулга):** сум → «sum» (олон тоо «sums», «soum» хэрэглэхгүй); хийморь → эхэндээ «khiimori (a person's
vital energy and good fortune)», дараа нь «khiimori», «wind horse» хэзээ ч үгүй. Засагдсан газар: `glossary.csv` 327,
21 багцын prompt 2,557, `pilot-en` 10 орчуулгад **239** («soum's» 8-ыг оруулаад) + README 1, style-guide 8, build-glossary.js / export-batches.js-ийн жишээ 5+.
`done/` хоосон (0). «wind horse» орчуулгад 0 удаа байсан. `check.js` одоо «soum», «wind horse»-ийг АЛДАА гэж барина;
pilot-en 10 файл алдаа 0. **Анхаар:** ажлын хуулбарын `glossary.csv` Excel-ээр cp1251 болж бүх кирилл «?» болсон
байсан — HEAD-ээс сэргээж засав (эвдэрсэн хуулбар `.tools/glossary.corrupted-backup.csv`). Excel-ээр хадгалахгүй.

**Shorts (EN):** кэш биш. `lib/shortsData.ts`-ийн англи playlist-ууд бүгд зөв ID, бүгд байдаг; нийтэд харагдах бичлэг:
traditions 2, historical-figures 1, buddhism 3, heritage 2, nature 3, **legends 0, monasteries 0** → хоосон тул монгол
руу fallback. YouTube Studio-д бичлэгийг Public болгож яг тэр playlist-д нэмэх; дараа нь
`POST /api/revalidate?tag=shorts` (header `x-revalidate-secret`) — зөвхөн shorts-ийн кэш, API алдвал хуучнаа үлдээнэ.
Main-д код өөрчлөөгүй.

**API орчуулга:** [model-test/README.md](../translation/model-test/README.md) — туршилт $0.195; бүх 983 хуудас
Sonnet 5.5 ≈ $9.7, Haiku 5.5 ≈ $0.75 (чанар муу), Opus ≈ $19. Зөвлөмж Sonnet. Скрипт
`scripts/translation/api-translate.mjs` (Batch API + 1 цагийн prompt cache).

**Preview:** Vercel Preview-д `CMS_SOURCE=payload` хэрэгтэй (Git branch: `feat/payload`-д л) — эс бөгөөс preview
Contentful-ээс уншина. Build нь `DATABASE_URI` байвал migration-ыг өөрөө ажиллуулна (`scripts/vercel-build.sh`).

**12/1-д бэлэн үү:** өгөгдөл, зураг, тулгалт — **бэлэн** (Neon дээр). Үлдсэн нь: preview-г push хийж бодит Vercel
орчинд шалгах, admin-ий 2FA, `main`-ийн шинэ өөрчлөлтийг `feat/payload` руу merge, эцсийн экспорт/импорт
(`--enhanced` хамт; шинэ R2 багана, collation migration аль хэдийн Neon-д).

## 11. 11/24: `main`-ийг `feat/payload` руу merge

`main` (`4f0c1d5`) → `feat/payload`: merge-base `3b61cc6`-аас хойших 336 commit (773 файл; ихэнх нь `data/rewrites/*.md`
ба `docs/`). Код: цэс v2 + mega menu, «Байгалийн өв»-ийн 4 хуудас (`/nature/*`), «Монголын үзэсгэлэн» (`/videos`,
нүүрний хэсэг), footer-ийн дээрх статистик + GA4 (`/api/stats`), «Бидний тухай» (`/about-us`), header-ийн засвар,
аймгийн слайдерын өөрийн зураг, аймгийн alias redirect (`next.config.js`), сүлдтэй сумд, joinme/publish-run скрипт.

**Байршил:** шинэ хуудсуудыг `app/(site)/about-us`, `app/(site)/nature`, `app/(site)/videos` руу зөөв; `app/api/stats`
нь `app/api/`-д (payload-ийн хувилбарт ч `api` тэнд). Бусад өөрчлөгдсөн хуудсыг git rename-ээр `app/(site)/`-д
автоматаар нэгтгэсэн. `app/(site)/layout.tsx`-ийн Search Console verification, GA4 хэвээр (зөвхөн statistics/footer
нэмэгдсэн).

**Зөрчил (3), хоёр талыг хадгалсан:**

| Файл | Шийдэл |
|---|---|
| `next.config.js` | Payload-ийн `withPayload`, R2 host + main-ийн `provinceAliases` redirect хоёулаа |
| `app/(site)/page.tsx` | main-ийн шинэ import (бичлэг, слайдер) `@/` alias-аар |
| `app/(site)/province/[id]/[soum]/page.tsx` | main-ийн `emblemSrc` (Commons hero-той сумын сүлд) + payload-ийн `t('emblemOf')` орчуулга |

**Payload горимд ажиллуулахын тулд нэмсэн засвар:**
1. `app/(i18n)/[lang]/layout.tsx` — main `PLAN_SECTION_ID`-г хассан тул хэлний layout эвдэрч байсан; footer v2
   (`FOOTER_NAVIGATION`, «Бидний тухай» холбоос) тусгав. Статистикийн хэсгийг хэлний хуудсанд **оруулаагүй**: шошго нь
   зөвхөн монгол (`lib/siteStats.ts`). Орчуулсны дараа нэмнэ.
2. `lib/cms/payloadSource.ts` — **зэрэгцээ query-ийн хязгаар (3)**: статистик layout-д build-ийн 7 worker бүрт 13 төрлийн
   бүх entry-г sitemap-тэй зэрэг татаж Neon-ий pool (max 5)-ыг дүүргэж «timeout exceeded when trying to connect» → build
   унаж байсан. Одоо build амжилттай.
3. `lib/cms/payloadSource.ts` — **олон төрөлтэй холбоосын шүүлт** (`fields.place.sys.id` г.м.): өмнө нь зөвхөн
   `place.value`-аар шүүдэг тул өөр collection-ий ижил id-тай doc таарч байв (Орхоны хөндийн хуудсанд Хөвсгөлийн
   `visitorGuidance`). Merge-ээс өмнө ч байсан алдаа, `compare-urls`-аар илэрсэн. Одоо `relationTo`-гоор хамт.
4. `lib/soumEmblems.ts` — 12 сүлд `images.ctfassets.net`-ээр шууд заагдсан байсан. `soumEmblemUrl()`: `CMS_SOURCE=payload`
   үед R2 хуулбар (Neon-д 12/12 байгааг шалгав, R2 200). Contentful хаагдсаны дараа ч ажиллана.
5. Contentful-ээс уншдаг шинэ код (`lib/contentfulAll.ts`, `lib/siteStats.ts`, `lib/provinceSlider.ts`, `app/sitemap.ts`)
   бүгд `lib/contentful.ts`-ийн `client.getEntries`-ээр явдаг тул адаптерт өөрчлөлтгүй ажиллана (query бүгд дэмжигдсэн).
   Бичлэг (`lib/videosData.ts`) YouTube API-аас — CMS-ээс хамааралгүй.

**Шалгалт:**

| | Үр дүн |
|---|---|
| `tsc --noEmit` | өмнөх 2 алдаа л (map/page, RoutesExplorer) + gitignore-той `_scratch` |
| `next build` (Turbopack, `CMS_SOURCE=payload`, Neon, цэвэр кэш) | ✅ 118/118 static, pool timeout 0 |
| `next build` (`CMS_SOURCE=snapshot`, 11/16 экспорт) | ✅ |
| Smoke 15 хаяг × 3 горим (payload / snapshot / **contentful** dev) | бүгд 200 эсвэл хүлээгдсэн 308; цэс v2, статистик (21 аймаг, 300 сум, 2,300 хуудас, 2,200 зураг, 6 хэл), слайдер 10 зураг; payload-д зураг бүгд R2 (ctfassets 0) |
| `/province/umnugovi` | 308 → `/province/umnugov` (гурван горимд), `/province/south-gobi/bayandalai` → `/province/umnugov/bayandalai` |
| `compare-urls.mjs` (snapshot ↔ payload) | sitemap 2,377 = 2,377; 340 хуудаснаас **338 ижил**, 2 нь «Зургийн цомог» (Архангай, Баян-Өлгий; §10-ын хүлээгдэж буй ялгаа) → **бодит зөрүү 0** |

Локалд `YOUTUBE_API_KEY`, GA4 түлхүүр байхгүй тул нүүрний бичлэгийн хэсэг нуугдаж, `/videos` noindex, зочдын мөр
харагдахгүй — preview дээр (Vercel env-тэй) шалгана. Contentful горимын шалгалт Preview API-аар ≈ хэдэн арван унших
хүсэлт зарцуулсан (бичилт 0).

**Анхаар:** `next build`-ийг `NEXT_DIST_DIR=.next-*`-ээр ажиллуулбал тэр хавтас gitignore-д байхгүй тул Tailwind түүнийг
сканнердаж CSS эвдэрнэ (локал dev 500), мөн build tsconfig.json-д зам нэмдэг — ажлын дараа хавтсыг устгаж,
tsconfig-ийг буцаах.

**Preview:** `/api/stats`-ийн анхны хариу payload горимд ≈20 сек (13 төрлийн бүх entry, хязгаартай зэрэгцээ),
дараа нь өдөрт 1 кэш.

## 12. 11/24: Admin-ий 2FA, эрх, анхны бүртгэл, «Бидний тухай»-ийн хүмүүс

| | Хийсэн |
|---|---|
| 2FA | `payload-totp` 3.0.7 (Payload ^3.88-тай нийцтэй), **бүх хэрэглэгчид заавал** (`forceSetup`). Setup/Verify хуудсыг монголоор (`payload/admin/TwoFactorViews.tsx`), QR олон утсаар уншуулах заавартай; «Аюулгүй байдал» хуудас (`/admin/security`): QR-ийг дахин харуулах (шинэ утас), 10 нөөц код (HMAC-аар хадгална, нэг удаа харуулна), 2FA-г шинээр тохируулах. Админ бусдын 2FA-г Users-ээс шинэчилнэ |
| Эрх | `ALL_USERS_ADMIN = true` (role нуугдмал, үргэлж admin). Editor/translator access функцууд хэвээр — `false` болгоход идэвхжинэ |
| Анхны бүртгэл | Кодоор үүсгэхгүй. Payload `first-register` хэрэглэгч байвал 403 (шалгав). Production-д (`VERCEL_ENV=production`) нэвтрээгүй үүсгэлтийг бүр хаасан, `PAYLOAD_ALLOW_FIRST_USER=1`-ээр түр нээнэ. **Neon-д одоо хэрэглэгч 0** → preview-ийн `/admin` «Create first user» харуулна |
| Аюулгүй байдал | 5 буруу оролдлого (нууц үг / 2FA код / нөөц код) → 15 мин түгжээ; session 4 цаг идэвхгүй; cookie Secure+Lax; `unlock` зөвхөн admin; robots Disallow + `X-Robots-Tag: noindex`, `X-Frame-Options: SAMEORIGIN`, admin meta noindex |
| serverURL | Зөвхөн production-д (preview-д 2FA redirect, CSRF production домэйн руу заагдахгүй) |
| `team` collection | «Бидний тухай»-ийн хүмүүс CMS-ээс (`lib/team.ts`; нийтлэгдсэн хүн байхгүй бол хуучин жишээ) |
| Ноорог → preview | Preview орчинд «Save Draft» хийхэд ч кэш шинэчлэгдэнэ (`payload/hooks.ts`) |
| Migration | `20261124_024225_admin_2fa`, `20261124_024919_team` — **Neon-д `admin_2fa` аль хэдийн орсон** (`migrate:create`-ийн дараах `migrate` `.env.local`-ийн DATABASE_URI-аар явсан; нэмэлт багана/хүснэгт, сайтад нөлөөгүй). `team` нь preview build-ээр орно |
| Заавар | `docs/admin/ЗААВАР.md` + `.docx`, дэлгэцийн 15 зураг (`docs/admin/img/`) |

**Шалгалт** (локал Postgres + `next build`/`next start`, headless Edge): 23/23 — анхны бүртгэл → QR → буруу код
алдаа → зөв код → 10 нөөц код → QR дахин (ижил түлхүүр) → гарах/нэвтрэх → нөөц кодоор (дахин ашиглахад татгалзсан)
→ TOTP; нэвтрээгүй REST нийтлэгдсэнийг уншина, users 403; хоёр дахь first-register 403; robots, X-Robots-Tag;
2FA-гүй сесс users 403, ноорог 0, нөөц код 401; 5 буруу код → түгжээ. `tsc` — өмнөх 2 алдаа л.

## 13. 11/24 (орой): 2FA-г унтраав — имэйл + нууц үгээр нэвтрэх

Эзэмшигчийн шийдвэр: 2FA хэрэглэхгүй. Код устгаагүй, **нэг flag**: `payload/security/totpOptions.ts` →
`ADMIN_2FA_ENABLED = false`. Унтраалттай үед payload-totp `disabled` (access-ийн ороолт, strategy, provider, хуудас,
endpoint нэмэхгүй), манай Setup/Verify/Security хуудас, нөөц кодын endpoint, хэрэглэгчийн хуудасны 2FA хэсэг
бүртгэгдэхгүй. DB-ийн схем (`totp_secret`, `recovery_codes`, `totp_attempts`) хэвээр — `migrate:create`
шинэ өөрчлөлт олоогүй. Дахин асаах: `true` → `generate:importmap` → build.

Хэвээр: 5 буруу нууц үг → 15 мин түгжээ, 4 цагийн session, Secure/Lax cookie, noindex/X-Frame-Options, production-д
«Create first user» хаалттай. **Шинэ:** нууц үг ≥ 12 тэмдэгт (create/update/reset-password). Заавар
(`docs/admin/ЗААВАР.md`, `.docx`)-аас 2FA-ийн хэсгийг хасаж, «Нууц үг: хэнтэй хуваалцах, хаана хадгалах» нэмэв.

**Шалгалт** (локал Postgres + `next build`/`next start`): 16/16 — `/admin` → create-first-user; 11 тэмдэгттэй нууц үг
400 («Нууц үг хамгийн багадаа 12 тэмдэгт байна.»), 12+ → admin; хоёр дахь first-register 403; имэйл+нууц үгээр
нэвтэрч users-ийг уншина (2FA шаардахгүй), `/admin` totp руу шилжихгүй, `/admin/setup-totp` 404, нөөц кодын endpoint
404; нэвтрээгүй REST нийтлэгдсэнийг уншина, users 403; нууц үгийг 11 тэмдэгт болгох 400; X-Robots-Tag, X-Frame-Options,
robots; session 4 цаг; 5 буруу нууц үг → түгжээ. `tsc` — өмнөх 2 алдаа л.

## 14. 11/24: en-001…en-007-ийн англи орчуулгыг Neon-д ноорог болгон оруулав

- Шалгагч (`scripts/translation/check.js docs/translation/done`): 7 файл, 313 хуудас, **алдаа 0** (анхааруулга 590 — уншиж шалгах төрлийн).
- `import-translations.ts`-ээр Neon-ий Payload-д `en` locale-д **ноорог** болгон оруулав: en-001…006 тус бүр 50, en-007 13 → **313/313 хуудас**, алгассан хуудас 0 (бүгд `contentfulId`-аар олдсон).
- Хамгаалалтын шалгалт (импортын өмнө, дараа хийсэн snapshot-ын харьцуулалт):
  - Монгол ноорог: агуулгын талбар 0 өөрчлөгдсөн. Зөвхөн `_status` 302 хуудсанд `published` → `draft` болсон: сүүлийн хувилбар нь шинэ en ноорог болсныг заана. Үлдсэн 11 нь өмнө нь ч нийтлээгүй mn ноорогтой байсан бөгөөд тэр ноорог хэвээр үлдсэн.
  - Нийтлэгдсэн mn болон en: 313 хуудсанд 0 өөрчлөлт, сайт дээр харагдах зүйл өөрчлөгдөөгүй.
  - en ноорог: 313 хуудасны орчуулсан бүх талбар дүүрсэн.
- Нийтлээгүй. Редактор admin-д хуудас бүрийг шалгаад нийтэлнэ. **Анхаар:** 11 хуудас нийтлээгүй mn өөрчлөлттэй тул тэдгээрийг нийтлэхэд mn өөрчлөлт хамт нийтлэгдэнэ.

## 15. 11/25: «Бидний тухай»-ийн 10 хүн — Payload руу орох эсэх, төлөвлөгөө

**Нөхцөл байдал.** `main` дээр (`feat/about-us-team`) `data/team.ts`-д бодит 10 хүн орсон: гүйцэтгэх баг 6, уран
бүтээлчдийн баг 4; хүн бүр `name/role/bio` × `{mn, en}`, `email` (заавал биш), `photo` (`/images/team/<нэр>.jpg`),
`group: 'executive' | 'creative'`, `order`. `SHOW_ABOUT_US = true`.

**12/1-ний шилжилтэд өөрөө орохгүй.** Шалтгаан:

| | Одоогийн `feat/payload` | Хэрэгтэй |
|---|---|---|
| Импорт | `scripts/payload/import.ts` нь зөвхөн Contentful-ийн экспортыг оруулна; `team` collection-д юу ч оруулдаггүй | 10 хүнийг `data/team.ts`-ээс оруулах seed |
| `group` | `advisor \| team \| creator` (migration `20261124_024919_team`) | `executive \| creative` |
| `email` | талбар байхгүй | `email` (text/email, localized биш, заавал биш) |
| `slug` | талбар байхгүй (`lib/team.ts` нь `d.slug \|\| d.id`) | `slug` (unique) — seed-ийг дахин ажиллуулахад давхардахгүй |
| Төрөл | `lib/team.ts` нь `TeamMember`-ийг `name: string` гэж буулгана | `main`-ийн шинэ төрөл `name/role/bio: {mn, en}` — main-ийг merge хийхэд `lib/team.ts`, `app/(site)/about-us/page.tsx` (`SECTIONS` → `TEAM_GROUPS`) засна |
| Fallback | Нийтэлсэн хүн 0 бол `data/team.ts` | merge-ийн дараа энэ fallback бодит 10 хүнийг (mn) харуулна — seed хийгээгүй ч сайт эвдрэхгүй |

**Төлөвлөгөө (cutover-оос өмнө, `feat/payload` дээр):**

1. `main`-ийг `feat/payload` руу merge (`data/team.ts`, `components/about/TeamGrid.tsx`, `lib/navigation.ts`,
   `lib/pageMeta.ts`, `app/about-us/page.tsx` → `app/(site)/about-us/page.tsx`).
2. `payload/collections.ts` `team`: `group`-ийн сонголтыг `executive` («Гүйцэтгэх баг»), `creative` («Уран бүтээлчдийн
   баг») болгох, `email`, `slug` талбар нэмэх. `migrate:create team_v2` — хуучин утгыг `team`/`advisor` → `executive`,
   `creator` → `creative` болгох SQL (одоо Neon-ий `team` хоосон ч enum солих шаардлагатай). **Локал DB-д**
   `DATABASE_URI=postgres://postgres:postgres@127.0.0.1:5433/postgres`-ээр туршина.
3. `scripts/payload/seed-team.ts` (`node scripts/payload/cli.mjs run scripts/payload/seed-team.ts`):
   `data/team.ts`-ийн `TEAM`-ийг уншиж хүн бүрт — `public/images/team/<нэр>.jpg`-ийг `media`-д (R2) upload (alt = mn нэр,
   `slug`-аар байгаа эсэхийг шалгана) → `team`-д `locale: 'mn'`-ээр create (`_status: 'published'`) → ижил doc-ийг
   `locale: 'en'`-ээр update (en name/role/bio). `slug`-аар upsert тул дахин ажиллуулж болно.
4. `lib/team.ts`: Payload-ийн doc-ийг `{mn, en}` болгож буулгах (mn, en хоёр locale-оор унших эсвэл `locale: 'all'`),
   `email` нэмэх; `GROUPS = ['executive', 'creative']`.
5. Шалгалт: локал `next build` + `next start`, `CMS_SOURCE=payload` үед `/about-us` 6 + 4, зураг R2-оос, `/en/...`
   route-д (`app/(i18n)/[lang]`) about-us одоо байхгүй — en талбар CMS-д хадгалагдана, харуулах route дараа.
6. «TODO: түр текст» гэсэн 4 хүний (Отгонтөгс, Цацалмаа, Урангоо, Мичидмаа) bio-г эзэмшигч баталгаажуулсны дараа
   admin-д засна.

Зураг: 11/25-нд `C:\project\team-photos` хавтас олдоогүй тул `public/images/team/` хоосон — seed-ийн өмнө 10 файл заавал
байх ёстой.

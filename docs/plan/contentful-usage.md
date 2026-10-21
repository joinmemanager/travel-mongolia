# Contentful API хэрэглээ ба хэмнэлт (2026-10-21)

> Нөхцөл: энэ сард **112.6K / 100K** (free plan). Хязгаар хэтэрвэл CDA/CPA/GraphQL 11-р сарын 1 хүртэл зогсож болно.
> Засвар: branch `fix/reduce-contentful-requests` (local commit, push хийгээгүй).
> Тооцоо кодоос хийсэн (Contentful руу хүсэлт илгээгээгүй, CDA төлөвийг шалгах 1 хүсэлтээс бусад). Тоонууд ойролцоо.

## 1. CDA төлөв

`GET cdn.contentful.com/spaces/{id}/environments/master/entries?limit=1` → **200 OK** (`x-cache: MISS`, total 2,524).
2026-10-21-ний байдлаар Delivery API **ажиллаж байна**, зогсоогоогүй.

## 2. Одоогийн кодын хүсэлт (засвараас өмнө)

Үндсэн шалтгаан: Contentful SDK нь axios ашигладаг тул Next.js-ийн fetch cache-д **ордоггүй**. `react.cache` нь
зөвхөн нэг render доторх давхардлыг арилгадаг. Хуудас дахин үүсэх бүрт Contentful руу бүх хүсэлт дахин явдаг.

### Нэг хуудас render хийхэд

| Хуудас | Хэдэн хуудас | Хүсэлт / render | Юу татдаг |
|---|--:|--:|---|
| layout, Navbar, Footer | бүх | **0** | цэс, хайлтын индекс статик (lib/navigation.ts) |
| Нүүр `/` | 1 | 2–3 | destination, recommendation (+ наадам) |
| Аймаг `/province/[id]` | 22 | **~10** | аймаг, heritagePlace бүгд, guidance, сумд, газрууд ×3, related ×3 |
| Өвийн газар `/destination/heritage/place/[id]` | ~380 | **~6** | газар, guidance, heritagePlace бүгд, related ×3 (localProvider, experience, product) |
| Destination `/destination/[id]` | ~30 | ~6 | дээрхтэй адил |
| Арга хэмжээ/зөвлөмж `/recommendation/[id]` | ~80 | ~7 | 2–4 төрлөөр хайх, бүх event + recommendation, related ×3 |
| Газар (landscapes, protected, museums, wellness) | ~560 | ~3 | газар + ангиллын жагсаалт (тусгай хамгаалалттайд +2) |
| Сум `/province/[id]/[soum]` | ~150 | 2 | сум, аймгийн сумд |
| Мэдээ `/stories/news/[slug]` | ~580 | 1 | мэдээ |
| Соёлын нийтлэл (нийтлэгдвэл) | 304 | 3 | metadata, хуудас тус бүр (react.cache-гүй) + жагсаалт |
| Буудал/бааз (нийтлэгдвэл) | 366 | 1 | |
| Жагсаалтын хуудсууд | ~40 | 1–3 | |

Sitemap-ийн 1,855 хуудсаар жинлэсэн дундаж нь render тутамд **~3 хүсэлт**. Бүх хуудсыг нэг удаа бүрэн үүсгэхэд **~5,800 хүсэлт** явна.

### Бусад

| Эх үүсвэр | Нэг удаад | Тайлбар |
|---|--:|---|
| `sitemap.xml` (10-19-өөс `force-dynamic`) | **~20** | 13 төрөл, 250-аар хуудаслана. Google, Bing болон бусад bot дуудах бүрт |
| `next build` (production эсвэл preview) | ~40–60 | build үед зөвхөн параметргүй статик хуудсууд үүснэ (`generateStaticParams` ганцхан, цаг агаарынх, Contentful-гүй) |
| Шинэ deploy | ≤ 5,800 | deploy бүрт ISR кэш шинээр эхэлдэг. Bot хандах бүрт хуудас бүр дахин Contentful-аас татагдана |
| Preview deploy | CPA | preview хуудсууд `connection()`-той, хандалт бүрт render хийнэ (хандалт цөөн) |
| `/api/revalidate` (webhook) | 0 | зөвхөн хуудсыг «хуучирсан» гэж тэмдэглэнэ. Дараагийн хандалт render хийнэ |
| Цаг агаар `/api/weather` | 0 | MET Norway, Contentful биш |
| Скриптүүд (CMA: импорт, нийтлэлт) | — | 10-р сард ~3,200 entry, ~2,200 asset үүсгэж нийтэлсэн. Asset тутамд ~7, entry тутамд ~4 хүсэлт → **~35–45K**. CMA энэ 100K-д тоологддог эсэхийг Contentful → Usage хуудаснаас шалгах |

### 10-р сарын хэрэглээг юу зарцуулсан бэ (тооцоо)

| Хугацаа / эх үүсвэр | Тохиргоо | Сард (ойролцоо) |
|---|---|--:|
| 10-01–07 | бүх хуудас `force-dynamic`, хандалт бүрт 1–6 хүсэлт | их (bot, зочин бүр) |
| 10-07–15 | `revalidate = 240`: хуудас бүр 4 минут тутам дахин үүсэх боломжтой | их |
| 10-15-аас | `revalidate = 86400`: bot хуудас бүрийг өдөрт нэг ч гэсэн хандвал ≤ 5,800/өдөр | 30–90K/сар хэмнэлээр |
| production deploy | 10-р сард ~40 гаруй deploy (main дээр ~130 commit), deploy бүр ISR кэшийг шинэчилнэ | 10–30K |
| sitemap | ~20 × bot-ын дуудлага (өдөрт 10–30) | 6–18K/сар |
| build (preview + production) | ~100 build × ~50 | ~5K |
| CMA скриптүүд (тоологддог бол) | импорт, нийтлэлт | 35–45K |

**Хамгийн их зарцуулдаг нь:** (1) хуудас дахин үүсэх бүрт кэшгүй хүсэлт явдаг (ISR × хуудасны тоо × deploy-ийн тоо). (2) Bulk импорт, нийтлэлтийн CMA хүсэлт (хэрэв тоологддог бол). (3) `force-dynamic` sitemap.

## 3. Засвар (`fix/reduce-contentful-requests`)

1. **Contentful Data Cache** (`lib/contentful.ts`): `client.getEntries` бүрийг `unstable_cache`-д 7 хоног хадгална (`contentful` tag).
   - Хариуг холбоосгүй хадгалж, буцаахдаа SDK-тай адил `contentful-resolve-response`-оор холбоно.
   - Vercel-ийн Data Cache deploy хооронд хадгалагддаг. Тиймээс шинэ deploy болон build Contentful руу дахин хүсэлт явуулахгүй (deploy хийсний дараа шалгах).
   - Preview (CPA) кэшлэхгүй, учир нь draft засвар webhook дуудахгүй.
2. **Webhook** (`/api/revalidate`): нийтлэх бүрт `revalidateTag('contentful', { expire: 0 })` болон өмнөх `revalidatePath`. Нийтэлсэн агуулга даруй харагдана.
3. **ISR:** бүх хуудас `revalidate = 86400` → **604800 (7 хоног)**. Шинэчлэл нь webhook-оор явна.
4. **sitemap.xml:** `force-dynamic` → **`revalidate = 86400`** (өдөрт 1). Webhook нийтлэх бүрт `/sitemap.xml`-ийг шинэчилнэ (өмнө нь ч хийдэг байсан).
5. **Давхардсан fetch:** layout, цэс Contentful ашигладаггүй. Нэг render доторх давхардал Data Cache-ээр нэгтгэгдэнэ (жишээ нь `getCultureArticle` metadata болон хуудас тус бүрийг нэг хүсэлтээр).
6. **generateStaticParams:** Contentful-ийн хуудсуудад байхгүй (build үед урьдчилан үүсгэдэггүй, анхны хандалтаар үүсгэж кэшлэдэг). Өөрчлөх шаардлагагүй.
7. **Vercel Ignored Build Step** (`vercel.json` `ignoreCommand` → `scripts/vercel-ignore-build.sh`):
   - `travel-mongolia/` өөрчлөгдөөгүй commit (docs, scripts) build хийхгүй.
   - Preview зөвхөн commit мессежид `[preview]` байх эсвэл `staging` үед build хийнэ.
   - Production үргэлж build хийнэ.
8. **Contentful зогсвол** (`ContentfulOutageError`, `rethrowOutage`): доор харна уу.

### Засварын дараах тооцоо

| Эх үүсвэр | Сард |
|---|--:|
| Хуудас: өвөрмөц query ~2,000 (хуудас тутамд ~1 + нийтлэг жагсаалт ~50), 7 хоногт нэг дүүргэнэ | ≤ 9K |
| Нийтлэх бүрт кэш цэвэрлэх (зөвхөн дахин үүсэх хуудсуудын хүсэлт) | 1–3K |
| sitemap (өдөрт 1 × ~20, ихэнх нь кэшээс) | ≤ 600 |
| build, deploy (Data Cache-ээс) | ~0–1K |
| **CDA нийт** | **~5–13K / сар** (одоогийнхоос ~85–95% бага) |
| CMA: bulk нийтлэлт (10-р багц, буудал ~700 entry) | ~2–3K удаа нэг |

Анхаарах: Vercel Data Cache-д нэг бичлэг 2MB-аас ихгүй байх ёстой. Том хариу (мэдээний жагсаалт, `include: 2`-той localProvider, body-той sitemap query) кэшлэгдэхгүй байж болзошгүй, гэхдээ хуудас 7 хоногт нэг л үүснэ. Build log-оос «over 2MB» анхааруулга шалгах.

## 4. Contentful зогссон үед сайт эвдрэх үү

**Засвараас өмнө (одоогийн production):** эвдэрнэ.
- Бүх lib функц (27 catch) Contentful-ийн алдааг залгиж, хоосон жагсаалт эсвэл `null` буцаадаг. Дэлгэрэнгүй хуудас `notFound()` болно.
- ISR дахин үүсэх үед алдаа шидэгддэггүй тул Next.js хоосон эсвэл 404 хуудсыг **шинэ хувилбар болгож кэшлэнэ**.
- CDA зогссоноос хойш ~1 хоногийн дотор (revalidate = 86400) bot хандсан хуудас бүр хоосон эсвэл 404 болно.
- Sitemap зөвхөн статик хуудастай болно. Google URL-уудыг алдана.

**Засварын дараа:**
- Contentful ажиллахгүй (сүлжээ, 401/403/429/5xx) үед `ContentfulOutageError` catch-аар дамжин шидэгдэнэ.
- ISR дахин үүсэхдээ алдаа өгвөл Next.js **өмнөх сайн хуудсаа** үзүүлсээр байна. Data Cache-ийн хуучин өгөгдөл ч хэвээр.
- Хэзээ ч үүсээгүй хуудас 500 өгнө (кэшлэгдэхгүй, дараа нь дахин оролдоно).
- Build Contentful-гүй үед унана. Энэ нь хоосон сайт deploy болохоос сэргийлнэ, production өмнөх deploy дээрээ үлдэнэ.
- Query-ийн алдаа (400/404/422, жишээ нь төрөл үүсээгүй) өмнө шигээ залгигдана.

## 5. Production дээрх нийтлэгдээгүй хуудсууд (засаагүй)

| Хаяг | Production дээр |
|---|---|
| `/about/culture/ethnic-groups`, `/about/culture/religion`, `/about/history/people` | **200, хоосон**: «Угсаатнууд (0)», «Нийтлэл удахгүй нэмэгдэнэ.». Цэсэнд draft тул харагдахгүй, noindex, sitemap-д ороогүй |
| `/about/traditions` | Хэвийн: статик агуулга харагдана, нийтлэлийн хэсэг 0 үед нуугдана |
| `/plan/accommodation` | Хэвийн: хуучин гарын авлага харагдана, лавлах 0 үед нуугдана |
| `/plan/accommodation/<slug>`, соёлын нийтлэлийн дэлгэрэнгүй хуудас | **404** (entry draft) |

Анхаарах: `batch-07` (461 буудал/бааз) болон `batch-10` (304) redirect CSV-ийн new_url-ууд одоогоор **404**. Кодлогч TIC дээр redirect-ийг нийтлэхээс өмнө тавивал 404 руу шилжинэ.

## 6. 11-р сарын 1-нээс өмнө

**Хийж болох:**
- Энэ засварыг review хийх. Шийдвэр: Contentful зогсохоос өмнө production-д гаргах уу (доорх асуултыг харна уу).
- Код, дизайны ажлыг (fix/province-hero-band г.м.) local дээр хийх (`next build --experimental-build-mode compile` Contentful-гүй).
- Баримт бичиг, later-todo.

**Хийхгүй:**
- Импорт, нийтлэлт, bulk скрипт (CMA).
- Push, preview build, production deploy (энэ засвар орохоос өмнө build бүр Contentful руу хүсэлт явуулна, deploy бүр ISR кэшийг шинэчилнэ).
- `sitemap.xml`-ийг дахин дахин татах шалгалт (1 удаа = ~20 хүсэлт).
- Local `next dev`/`next build`-ийг жинхэнэ token-той ажиллуулах.

# Vercel Fluid Active CPU: шалтгаан ба засвар (2026-11-09)

Нөхцөл: 11/1–11/6-нд үнэгүй 4 цагийн 90% (≈3.6 цаг ≈ 12,960 CPU-секунд, өдөрт ≈2,160).

## Шалтгаан (кодоор болон production header-ээр батлагдсан)

| # | Шалтгаан | Нотолгоо | Нөлөө |
|---|---|---|---|
| 1 | `[slug]`/`[id]`-тэй 27 route-д `generateStaticParams` байгаагүй тул Next.js хүсэлт бүрт render хийдэг байв (province, сум, газар, мэдээ, түүх, амьтан ...) | production: `/province/khovd` 3 удаа дараалан `MISS`, `private, no-store`, 1.3–1.5 сек | Хамгийн их. Sitemap-ийн ≈3,000 хаягийн ихэнх нь энэ |
| 2 | Нийтлэл бүрт webhook `contentful` tag-ийг бүхэлд нь хүчингүй болгодог байв | `app/api/revalidate/route.ts` | Бөөнөөр нийтлэхэд бүх кэш устана |
| 3 | 22 жагсаалтын хуудас `force-dynamic` (`?cat=` client талд уншихын тулд) | `/things-to-do/food` `MISS`, `no-store` | Дунд |
| 4 | `/destination/region` server талд `searchParams` уншдаг, 1.16 MB | `MISS`, `no-store` | Дунд (том хуудас, цэсэнд олон холбоос) |
| 5 | Production deploy бүр ISR кэшийг шинэчилдэг | Vercel-ийн ажиллагаа | Кодоор засагдахгүй: push-ийг нэгтгэх |

Эх сурвалж биш гэж шалгасан: `/sitemap.xml` (өдөрт 1 удаа), `/api/shorts` (цагт 1), `/plan/useful-services` (ISR), зургийн оновчлол (Contentful зураг өөрийн CDN-ээс, Fluid CPU-д тоологдохгүй).

## Засвар

| Засвар | Файл | SEO / Contentful |
|---|---|---|
| 27 route: хоосон `generateStaticParams` (зөвхөн production-д; preview-д draft харуулсаар) | `lib/navigation.ts` `productionStaticParams` | HTML ижил. CDA нэмэгдэхгүй, буурна |
| 22 жагсаалт, seasons, magazine: `force-dynamic` хасаж, `useSearchParams`-ийг Suspense дотор; fallback нь бүтэн жагсаалт | `CategoryListing`, `InspirationListing` | Server HTML-д H1, бүх карт хэвээр |
| `/destination/region`: параметрийг client талд, хайлтын текстийн давхардсан үгийг хассан (1.16 MB → 0.94 MB) | `RegionDirectoryFromUrl`, `region/page.tsx` | Canonical нь параметргүй тул өөрчлөлтгүй; хайлтын үр дүн ижил |
| Webhook: `contentful:<type>` tag, зөвхөн тухайн төрөл ба түүнийг агуулдаг төрлүүд | `lib/contentful.ts`, `route.ts` `LINKED_BY` | Нийтлэл хуучирсан хэвээр үлдэхгүй |
| festivals, `/local/*`-ийг webhook-ийн шинэчлэлтэд нэмсэн | `route.ts` | ISR болсон ч нийтлэхэд шууд шинэчлэгдэнэ |

## Шалгалт (local `next build` + `next start`)

| Шалгалт | Production горим | Preview горим |
|---|---|---|
| `/province/khovd`, сум, мэдээ | MISS → HIT (HIT 5–20 мс) | хүсэлт бүрт, draft харагдана |
| `/province/no-such-aimag` | 404 | 404 |
| `/province/umnugovi` | 308 | 308 |
| `/things-to-do/adventure?cat=horse` | Нийт 8 → 1, hydration алдаагүй | — |
| Build-ийн ƒ route | зөвхөн API | — |

Анхаар: эхний хувилбар preview горимд 500 алдаа өгсөн (`connection()` + `generateStaticParams`); тиймээс зөвхөн production-д идэвхжүүлсэн.

## Өмнөх, дараах тооцоо (ойролцоо)

Vercel-ийн analytics-т хандаагүй тул render тутмын CPU-г **0.5 секунд гэж таамагласан**.

| | Өмнө | Дараа |
|---|--:|--:|
| Хүсэлт бүрт render хийгддэг route | 50 | 0 (API-аас бусад) |
| 7 хоногт CPU | ≈15,100 сек (хэмжсэн хэрэглээ) | ≈1,500 сек (≈3,000 хаяг × 1 render), deploy бүрт дээр нь ≈1,500 хүртэл |
| Хэмнэлт | | deploy-гүй 7 хоногт ≈90%, 7 хоногт 3 deploy-той ≈60% |

Бодит үр дүнг push хийснээс хойш 24–48 цагийн дараа Vercel → Usage дээр шалгана. Deploy-г нэгтгэх нь хамгийн том үлдсэн хөшүүрэг.

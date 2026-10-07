# Сайтын хурдны шинжилгээ

> Огноо: 2026-10-07. Branch: `feat/performance`. Хэмжилтийг кодоос болон `public/` хавтаснаас хийсэн (Lighthouse ажиллуулаагүй: локал Node байхгүй, production-д deploy хийх хязгаар дүүрсэн). Merge хийсний дараа PageSpeed Insights-аар өмнө/дараа хэмжинэ.

## Асуудлууд, ач холбогдлоор

| # | Асуудал | Нөлөө | Төлөв |
|---|---|---|---|
| 1 | **`app/layout.tsx`-ийн `dynamic = 'force-dynamic'`**: бүх хуудас хүсэлт бүрт server дээр дахин render хийгдэж, хуудас бүр Contentful руу 1–6 хүсэлт явуулна. Ямар ч хуудас CDN-д кэшлэгддэггүй. | Маш их. Хариу өгөх хугацаа (TTFB) удаан, Contentful-ын хүсэлтийн тоо их | **Засагдсан** (доор) |
| 2 | **Hero зургууд шахагдаагүй**: `ImageHero` 30 орчим хуудсанд `unoptimized` горимоор 1800–2400 px JPG ачаалдаг. Гар утсан дээр ч бүтэн хэмжээгээрээ татагддаг. `/local/*` хуудсуудын нөөц зураг `/hero.jpg` 3.7 MB. | Их (LCP) | **Засагдсан** (доор) |
| 3 | **Нүүр хуудасны видео** `public/heroo.mp4` 21.9 MB, poster `hero.jpg` 3.7 MB. `RegionMap`-ийн AI аймгийн зургууд (`hovd1.png` г.м.) тус бүр 2–2.7 MB PNG. | Маш их (нүүр хуудсанд) | **Хийгээгүй**: нүүр хуудас өөрчлөхгүй дүрэмтэй. Санал: видеог 720p H.264/WebM (≤3 MB) болгож шахах, poster-ийг WebP ≤200 KB, PNG-үүдийг WebP болгох. Эзэмшигчийн зөвшөөрлөөр |
| 4 | **38 хуудас бүхэлдээ `'use client'`**: about, plan, things-to-do, inspiration, destination ангиллын хуудсууд. Статик текст, өгөгдөл JavaScript-ээр давхар татагддаг (about хуудас бүр 300–450 мөр). | Дунд (JS-ийн хэмжээ, TBT) | Хийгээгүй. Санал: интерактив хэсгийг (цэс, шүүлтүүр) жижиг client компонент болгож, хуудсыг server компонент болгох. Хуудас бүрт шалгалт шаардлагатай тул тусдаа ажил |
| 5 | **Google Translate script** (`translate.google.com/.../element.js`) бүх хуудсанд `afterInteractive`-аар ачаалагддаг. | Дунд (гуравдагч талын JS) | Хийгээгүй. Санал: `strategy="lazyOnload"` эсвэл хэрэглэгч хэл сонгох үед л ачаалах. Хэл солих ажиллагааг шалгасны дараа |
| 6 | **Body зургууд** (about, сэтгүүл) `<img>`-ээр бүгд шууд ачаалагддаг. | Бага–дунд | **Засагдсан**: `loading="lazy"`, `decoding="async"` |
| 7 | **URL параметр уншдаг хуудсууд** (`?cat=`, `?style=`, `?days=`): things-to-do 8, inspiration 7, `/local/*` ангилал 6, festivals. `useSearchParams`-тай тул статик болгохгүй. | Бага (хүсэлт бүрт render) | Хэвээр (`force-dynamic`). Санал: параметрийг server талд `searchParams`-аар уншиж, хуудсыг кэшлэх боломжтой болгох |
| 8 | **Contentful хүсэлтүүд**: `getEntries`-ийн хариу Next.js-ийн fetch cache-д ордоггүй (SDK өөрийн HTTP клиент ашигладаг). Нэг хуудсанд `react.cache`-ээр давхардлыг арилгасан. | Бага (кэш нэмэгдсэн тул) | Хэвээр. #1 засварын дараа хуудас бүр 4 минутад нэг л удаа Contentful руу хүсэлт явуулна |
| 9 | **Фонт**: Rubik 4 жин, `next/font`-оор, `display: swap`. | Бага | Асуудалгүй |

## Хийсэн засварууд

### 1. Хуудсуудыг кэшлэх (ISR)

- `app/layout.tsx`: `dynamic = 'force-dynamic'`-ийн оронд **`revalidate = 240`**. Хуудас build хийх үед бэлтгэгдэж, CDN-ээс шууд үйлчилнэ. 4 минут тутам дэвсгэрт шинэчлэгдэнэ (stale-while-revalidate). Ингэснээр Contentful-д нийтэлсэн өөрчлөлт **5 минутын дотор** харагдана. Google tag-ийн мөрүүдэд хүрээгүй.
- Contentful-ын дэлгэрэнгүй хуудсууд `force-dynamic`-аас `revalidate = 240` болсон. Эхний хандалтаар бэлтгэгдэж, дараа нь кэшээс үйлчилнэ.
  - `/destination/[id]`, `/recommendation/[id]`, `/local/[slug]`, `/local/experiences/[slug]`, `/stories/[slug]`, `/local`.
  - Хуучин ID-аас slug руу хийдэг redirect хэвээр ажиллана.
- `/impact`, `/destination/routes`: 3600-аас 240 болсон (5 минутын шаардлага).
- **URL параметр уншдаг 15 хуудас** өөрсдийн `layout.tsx`-д `force-dynamic` хэвээр байна. Статик болговол server HTML-д H1, агуулга орохгүй болж SEO-д муу. Эдгээр: things-to-do 8, inspiration 7. `/local/*` ангилал болон festivals аль хэдийн `force-dynamic`.
- `sitemap.xml` 3600 хэвээр.

### 2. Hero зургийг шахах

- `components/templates/ImageHero.tsx`: Unsplash, Contentful-ын зургийг тэдний өөрийн CDN-ээс дэлгэцийн өргөн бүрт (`srcset`) WebP/AVIF, q=65-аар авна (`lib/imageUrl.ts`). Vercel-ийн зургийн оновчлолын квотыг зарцуулахгүй.
  - Жишээ: 2400 px JPG (~600–900 KB)-ийн оронд утсан дээр 640–828 px WebP (~60–120 KB).
- Сайтын өөрийн зураг (`/hero.jpg`, 3.7 MB) Next.js-ийн оновчлолоор дамжина (`unoptimized` хасагдсан).
- Харагдах байдал өөрчлөгдөөгүй: ижил зураг, ижил тайралт, hero нь өмнөх шигээ `priority`.

### 3. Body зургийг хойшлуулж ачаалах

About 9 хуудас ба `/inspiration/magazine`-ийн 20 `<img>`-д `loading="lazy" decoding="async"` нэмсэн. Эхний дэлгэцэнд харагддаг `/inspiration/seasons`-ийн зургийг хэвээр үлдээсэн.

## Өөрчлөгдөөгүй зүйлс

URL, текст, дизайн, title, description, canonical, robots, sitemap-ийн агуулга, Google tag-ууд (GA4, Search Console), нүүр хуудас.

## Дараагийн алхам (санал)

1. Merge-ийн дараа PageSpeed Insights: `/`, `/about/culture`, `/things-to-do/nature`, `/destination/heritage/place/orkhony-khundii`. Өмнөх утгыг merge-ээс өмнө production дээр авах.
2. Нүүр хуудасны видео, poster, AI PNG-үүдийг шахах (#3). Эзэмшигчийн зөвшөөрлөөр.
3. `'use client'` хуудсуудыг server компонент болгох (#4), нэг бүлгээр (жишээ нь `/plan/*`) эхлэх.
4. Google Translate-ийг хэрэглэгч хэл сонгох үед ачаалах (#5).
5. URL параметртэй хуудсуудыг server `searchParams` руу шилжүүлж кэшлэх (#7).

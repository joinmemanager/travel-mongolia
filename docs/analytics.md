# Analytics (GA4): контентоос захиалга хүртэлх хэмжилт

> Огноо: 2026-10-06. Код: `travel-mongolia/components/Analytics.tsx`, `components/templates/RelatedBookings.tsx`, `lib/booking.ts`.

## Ерөнхий

- GA4 tag (`G-PBZBEDW93X`) `app/layout.tsx`-д хэвээр байна, өөрчлөөгүй. Энэ хэмжилт тэр tag-ийн үүсгэсэн `window.dataLayer`, `gtag()`-ийг л ашиглана.
- `components/Analytics.tsx` нь Footer дотор, бүх хуудсанд ажиллана. Харагдах зүйлгүй.
- Хувь хүний мэдээлэл (нэр, утас, и-мэйл) илгээхгүй. Зөвхөн контентын ID, төрөл, аймаг.

## 1. Хуудас бүрийн контентын мэдээлэл

Хуудас нээгдэх, эсвэл сайт дотор шилжих бүрт:

| Хаана | Юу |
|---|---|
| `dataLayer.push` | `{ event: 'content_context', content_id, content_type, province }` (GTM-ийн хэлбэр) |
| `gtag('set', …)` | `content_id`, `content_type`, `province`. Энэ хуудсанд дараа нь илгээгдэх бүх event-д хавсарна |
| `gtag('event', 'content_view', …)` | Ижил 3 параметр |

Утгууд хаанаас ирэх вэ:

| Хуудас | content_type | content_id | province |
|---|---|---|---|
| `/destination/<slug>` | `destination` | slug | `province` талбар |
| `/destination/heritage/place/<slug>` | `heritage` | slug | `province` эсвэл `region` |
| `/province/<slug>` | `province` | slug | аймгийн нэр |
| `/local/<slug>` | `provider` | slug | аймаг |
| `/local/experiences/<slug>` | `experience` | slug | аймаг |
| `/recommendation/<slug>` | `event` | slug | аймаг |
| `/stories/<slug>` | `story` | slug | байршил |
| `/destination/routes` | `route` | сонгосон маршрутын id | — |
| Бусад хуудас | хаягийн эхний хэсгээр: `article` (about), `guide` (plan, respect), `listing` (things-to-do, inspiration), `local`, `hub`, `home` г.м. | хаяг (`/about/culture`) | — |

Дэлгэрэнгүй хуудсууд `<ContentContext>` (нуугдмал элемент)-оор утгаа өгдөг (`PlaceTemplate`-ийн `analytics` prop).

## 2. Event-ууд

| Event | Хэзээ | Параметр |
|---|---|---|
| `click_to_experience` | `/local/experiences/<slug>` руу холбоос дарахад (хаана ч байсан) | `target_id` (туршлагын slug), `provider_id`, `link_url` + хуудасны 3 параметр |
| `click_to_provider` | `/local/<slug>` (профайл) руу холбоос дарахад | `target_id`, `provider_id`, `link_url` + хуудасны 3 параметр |
| `booking_click` | "Захиалах" / "Аялал захиалах" товч дарахад | **`provider_id`** (Contentful entry ID), **`is_local_provider`** (`localOwned`), `target_id`, `link_url` + хуудасны 3 параметр |
| `view_respect_guide` | `/respect`, `/respect/*` хуудас нээгдэхэд | хуудасны 3 параметр |
| `shorts_play` | Богино бичлэгийн (YouTube Shorts) карт дарахад: нүүр хуудасны сэдвийн мөрүүд, `/stories/shorts/<сэдэв>` (2026-10-27). Бичлэг сайт дотор modal-д тоглоно, modal доторх өмнөх/дараах сум event илгээхгүй | `video_id` (YouTube ID), `video_title`, `category` (сэдвийн slug: `traditions`, `historical-figures`, `buddhism`, `heritage`, `nature`, `legends`, `monasteries`) + хуудасны 3 параметр |
| `shorts_view_all` | Нүүр хуудасны мөрийн «Бүгдийг үзэх» карт дарахад (2026-10-27) | `category` (сэдвийн slug), `link_url` + хуудасны 3 параметр |
| ~~`content_format_click`~~ | 2026-10-22 – 10-27: нүүр хуудасны «Олон хэлбэрт контент»-ын 6 карт. Тэр хэсгийг Shorts-ийн мөрүүдээр сольсон тул **илгээгдэхээ больсон** (GA4-д хуучин өгөгдөл үлдэнэ) | `item_name`, `platform`, `link_url` |
| `joinme_click` | joinme.mn руу очих аливаа холбоос дарахад (доор) | `link_url`, `page_path`, `content_type`, `item_name` |

Холбоосууд дээрх `data-ga-event`, `data-ga-params` шинжээс уншдаг. Шинэ товчинд event нэмэх бол тэр 2 шинжийг тавихад хангалттай.

### `joinme_click` (2026-10-14)

joinme.mn (эсвэл `*.joinme.mn`) руу очих **аливаа** `<a>` дээр дарахад илгээгдэнэ: дэлгэрэнгүй хуудасны "Захиалах", холбоотой картын "Захиалах", цэс/footer-ийн "Захиалах", контент доторх холбоос г.м. Холбоосны хаягаар (`isJoinmeUrl`, `lib/booking.ts`) танина, тиймээс шинэ товчинд юу ч нэмэх шаардлагагүй.

| Параметр | Утга |
|---|---|
| `link_url` | Очих хаяг (UTM-тэй) |
| `page_path` | Дарсан хуудасны хаяг (`/local/experiences/...`) |
| `content_type` | Товчны `data-joinme-type` (`experience`, `provider`, `event`, `destination` г.м.). Цэс, footer-ийн холбоос бол `nav`. Бусад үед хуудасны `content_type` |
| `item_name` | Товчны `data-joinme-name` (аялал, газар, үйлчилгээ үзүүлэгчийн нэр). Цэс, footer-ийн холбоос бол холбоосны текст ("Захиалах"). Бусад үед дэлгэрэнгүй хуудасны гарчиг (h1), эсвэл холбоосны текст |

- `FactsCard` нь `campaign` болон `itemName` prop-оос, `RelatedBookings` нь картын `kind`, `title`-аас эдгээр шинжийг тавина.
- `booking_click`-аас **тусдаа** event. "Захиалах" товч дарахад хоёулаа нэг нэг удаа илгээгдэнэ (`booking_click` хуучнаараа, параметр нь өөрчлөгдөөгүй).
- Нэг дарахад нэг л удаа: `document`-ын нэг capture listener (Analytics зөвхөн Footer-т нэг удаа mount хийгдэнэ). Дунд товчоор (шинэ tab) дарахыг `auxclick`-ээр тоолно. Зүүн товч `auxclick` үүсгэдэггүй тул давхардахгүй.
- GA4: `item_name`, `page_path`, `link_url`-ийг custom dimension-д бүртгэвэл тайланд харагдана (`content_type` аль хэдийн бүртгэлтэй). Хэрэгтэй бол `joinme_click`-ийг key event болгоно.

## 3. Joinme руу очих холбоосын UTM

`lib/booking.ts`: joinme.mn руу очих холбоос бүр:

```
utm_source=travelhubmongolia
utm_medium=referral
utm_campaign=<контентын төрөл>   destination, heritage, province, provider, experience, event, story, route
utm_content=<slug>                тухайн хуудасны slug (маршрутад маршрутын id)
```

Үйлчилгээ үзүүлэгчийн өөрийн сайт руу (`bookingUrl` нь joinme биш) холбоосыг өөрчлөхгүй. Цэсний "Захиалах" товч өмнөх `utm_campaign=nav`-тай хэвээр.

## 4. GA4 дээр хийх тохиргоо (нэг удаа)

1. **Admin → Custom definitions → Create custom dimension** (Event scope):
   - `content_id`, `content_type`, `province`, `provider_id`, `is_local_provider`, `target_id`.
   - Богино бичлэгт: `video_id`, `video_title`, `category`.
   Бүртгэхгүй бол утгууд цуглах боловч тайланд харагдахгүй.
2. **Admin → Events → Mark as key event**: `booking_click`.
3. Шалгах: **Admin → DebugView** дээр preview хаягаа нээж товч дарахад event-үүд харагдана (Chrome-ийн "Google Analytics Debugger" өргөтгөл эсвэл `?debug_mode=1`).

## 5. Impact Dashboard-д GA-ийн тоо холбох (дараагийн алхам)

`/impact#local-impact` одоогоор Contentful-ын тоог автоматаар харуулна (`lib/impact.ts`). GA-аас ирэх тоонууд "Мэдээлэл удахгүй" гэж үлдсэн:

| Үзүүлэлт | GA4-ийн тооцоо |
|---|---|
| Контентоос захиалга руу шилжсэн хувь | `booking_click` хийсэн session ÷ `content_view` хийсэн session (сүүлийн 90 хоног) |
| Нутгийн үйлчилгээ үзүүлэгч рүү очсон захиалгын товшилт | `booking_click`, `is_local_provider = true` |
| Туршлага руу шилжсэн хувь | `click_to_experience` ÷ `content_view` |

Холбох арга (санал):

1. Google Cloud дээр service account үүсгэж, GA4 property-д **Viewer** эрх өгнө.
2. Vercel-ийн environment variable-д `GA4_PROPERTY_ID`, `GA4_SERVICE_ACCOUNT_KEY` нэмнэ. **Commit хийхгүй.**
3. `lib/impact.ts`-д GA4 Data API (`runReport`)-аар дээрх тоог татаж, цагт нэг удаа cache хийнэ (`revalidate = 3600`).
4. Тоо 0 эсвэл өгөгдөл хангалтгүй (жишээ нь 100-аас бага session) бол "Мэдээлэл удахгүй" хэвээр үлдээнэ.

Захиалгын бодит тоо (хэдэн захиалга, хэдэн төгрөг) GA-д байхгүй. Үүнийг joinme.mn-ийн захиалгын өгөгдлөөс `utm_source=travelhubmongolia`-аар шүүж авна.

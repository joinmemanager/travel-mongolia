# Go-live жагсаалт: сайтыг бүрэн нээхээс өмнө

> Огноо: 2026-10-06. Төлөв: Б (Contentful, /local) болон В (ESG, Content-to-Booking, analytics) хэсгийн дараа.
> Алхам бүрийг тусдаа branch дээр хийж, preview дээр шалгаад merge хийнэ (CLAUDE.md "Ажлын дүрэм").
> `app/layout.tsx`-ийн Google tag-уудад хэзээ ч хүрэхгүй.

## 0. Шийдвэрүүд (эзэмшигч)

- [ ] **Хотын наадам (`7hzN5C6m5qhG3yM4WRvSin`)**: Contentful дээрх нийтлэгдээгүй `isFeatured = true` өөрчлөлтийг нийтлэх эсэх. Нийтлэвэл нүүр хуудасны улирлын зөвлөмжид онцлох болж, slug (`khotyn-naadam`) хамт нийтлэгдэнэ. Хуучин ID хаяг нь slug руу redirect хийж эхэлнэ.
- [ ] Аль хэсгийг нээх вэ: `/local/*`, `/stories`, `/respect/*`, `/impact`. Бүгдийг нэг дор, эсвэл хэсэг хэсгээр.
- [ ] `/impact` дээрх тоо: Contentful-д бодит entry хангалттай нэмэгдсэн эсэх. 0 гэсэн тоогоор нээх үү, эсвэл хүлээх үү.

## 1. Contentful-ын бэлтгэл

- [ ] **Жишээ entry устгах:** `powershell -ExecutionPolicy Bypass -File scripts\contentful\03-sample-entries.ps1 -Remove`. Эхлээд `-Remove -DryRun`-оор шалгана. Жагсаалт: `docs/plan/sample-entries.md` (12 entry).
- [ ] Contentful дээр `[ЖИШЭЭ]` гэж хайхад юу ч олдохгүй байгааг шалгах.
- [ ] **ESG талбарууд:** `scripts\contentful\04-esg-fields.ps1`-ийг ажиллуулах (эхлээд `-DryRun`). Ингэснээр destination, heritagePlace, province-д province, heritageFeatures, localPeople, related* талбар нэмэгдэнэ.
- [ ] **Бодит контент:** нутгийн үйлчилгээ үзүүлэгч, туршлага, бүтээгдэхүүн, арга хэмжээ, нийтлэлийг `docs/contentful-guide.md`-ийн дагуу нэмэх. Хэсэг бүрт хамгийн багадаа хэдэн entry байхыг эзэмшигч шийднэ.
- [ ] Нийтлэл бүр "Зөвшөөрөл авсан" = Yes, эх сурвалж, редактортой байгааг шалгах.
- [ ] Зураг бүр Монголынх, зөвшөөрөлтэй, Title (alt) бичигдсэн байгааг шалгах.
- [ ] Хуучин контентын асуудалтай зургуудыг солих (`docs/plan/images.md`). Жишээ нь Бали сүмийн зураг ~30 газар, AI аймгийн зургууд, Төвд хийдийн зураг.
- [ ] Management token-ийг шинээр үүсгэж (чатад бичигдсэн хуучнуудыг хүчингүй болгох), `.env.local`-д солих.

## 2. Draft → live (`travel-mongolia/lib/navigation.ts`)

- [ ] `/local` hub: `PAGE_STATUS['/local']`-ийг `'live'` болгох. Ингэснээр `/local/<slug>` профайлууд ч live болно.
- [ ] Цэсний "Нутгийн Монгол" хэсгийн 6 зүйл ба "Туршлагууд" (`/local/experiences`): `status: 'live'`.
- [ ] `/stories`, `/stories/photo-video`: `PAGE_STATUS`-д `'live'`. Ингэснээр `/stories/<slug>` нийтлэлүүд ч live болно.
- [ ] Цэсний "Түүхүүд" → `/stories`, "Фото/видео түүх" → `/stories/photo-video` руу шилжүүлэх (ia-plan.md 5в).
- [ ] `/respect`, `/respect/etiquette`, `/respect/nature`, `/respect/accessible`: `status: 'live'`.
- [ ] `/impact` (5 anchor холбоос): `status: 'live'`.
- [ ] Live болгосны дараа "Холбоотой аялал, туршлага, үйлчилгээ" хэсэг газрын хуудсуудад автоматаар гарч эхэлнэ. Учир нь `/local` хуудсууд руу заасан картууд нээгдэнэ. Preview дээр шалгах.

## 3. Redirect (`travel-mongolia/next.config.js` → `redirects()`)

- [ ] `/inspiration/stories` → `/stories` (байнгын).
- [ ] `/inspiration/magazine` → `/stories` (байнгын).
- [ ] Сайт доторх эдгээр хаяг руу заасан холбоосуудыг шинэ хаяг руу солих (`lib/stories.ts`, цэс, `RelatedBookings` биш бусад).
- [ ] Хуучин ID хаягууд slug руу redirect хийж байгааг шалгах (`/destination/<id>`, `/destination/heritage/place/<id>`, `/recommendation/<id>`).

## 4. SEO шалгалт

- [ ] `powershell -ExecutionPolicy Bypass -File scripts\seo\crawl.ps1 -Date <огноо>`, дараа нь `compare.ps1`-ээр өмнөх baseline-тай харьцуулах.
  - 404 шинээр гараагүй.
  - Шинэ live хуудсууд `index, follow`-той, title/description/canonical/H1 зөв.
  - Draft хэвээр үлдсэн хуудсууд `noindex`.
  - Google tag-ууд (GA `G-PBZBEDW93X`, Search Console verification) тус бүр 1 удаа.
- [ ] `sitemap.xml`-д шинэ live хуудсууд (`/local/*`, `/stories/*`, `/respect/*`, `/impact`) орсон, draft хуудсууд ороогүй.
- [ ] `robots.txt` хэвээр.
- [ ] **Google Search Console:** Sitemaps → `https://www.travelhubmongolia.com/sitemap.xml` дахин илгээх. URL Inspection-аар `/local`, `/stories` зэрэг гол шинэ хуудсыг "Request indexing" хийх.
- [ ] Search Console → Pages хэсэгт redirect болон 404-ийг 1–2 долоо хоногийн дараа дахин шалгах.

## 5. Analytics (GA4)

- [ ] `docs/analytics.md`-ийн 4-р хэсэг: custom dimension-ууд (`content_id`, `content_type`, `province`, `provider_id`, `is_local_provider`, `target_id`) бүртгэх. `booking_click`-ийг key event болгох.
- [ ] DebugView дээр `content_view`, `click_to_experience`, `click_to_provider`, `booking_click`, `view_respect_guide` ирж байгааг шалгах.
- [ ] joinme.mn тал дээр `utm_source=travelhubmongolia`-аар ирсэн захиалгыг ялгаж харах боломжтой эсэхийг шалгах.

## 6. Эцсийн шалгалт

- [ ] Бүх шинэ хуудсыг гар утас, компьютер дээр нээж харах.
- [ ] "Захиалах" товчнууд зөв хаяг руу (joinme.mn эсвэл үйлчилгээ үзүүлэгчийн сайт) UTM-тэй очиж байгаа.
- [ ] Нүүр хуудас, газрын зураг, төлөвлөгч өөрчлөгдөөгүй.
- [ ] `docs/baseline/<огноо>`-д crawl-ийн үр дүнг commit хийх.

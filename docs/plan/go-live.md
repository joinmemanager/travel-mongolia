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

Төлөвүүд: `live` (бүрэн), `soft` (цэсэнд харагдана, нээгдэнэ, гэхдээ noindex, sitemap-гүй), `draft` (зөвхөн preview), `planned`. Contentful-аас уншдаг хоосон ангилалд ("[ЖИШЭЭ]"-г тооцохгүй) "Тун удахгүй" блок харагдана, `/local/*`-д урилга, "Хамтран ажиллах" товчтой.

- [ ] `/local` hub: одоо `soft` (feat/soft-launch). Бүрэн нээх үед `PAGE_STATUS['/local']`-ийг `'live'` болгох. Ингэснээр `/local/<slug>` профайлууд ч live болно.
- [ ] Цэсний "Нутгийн Монгол" хэсгийн 6 зүйл ба "Туршлагууд": одоо `soft`. Бүрэн нээх үед `status: 'live'`.
- [x] `/stories`: live (feat/soft-launch).
- [ ] `/stories/photo-video`: одоо `soft`. Анхны фото/видео нийтлэл орсны дараа эзэмшигчийн шийдвэрээр `live`.
- [x] Цэсний "Түүхүүд" → `/stories`, "Фото/видео түүх" → `/stories/photo-video` (feat/soft-launch).
- [x] `/respect`, `/respect/etiquette`, `/respect/nature`, `/respect/accessible`: live, "шинэчилж байна" тэмдэглэл хасагдсан (feat/respect-live).
- [x] `/impact`: `soft` (цэсэнд харагдана, noindex). Өгөгдөлгүй KPI-ийн оронд "Үр дүнгийн тоо мэдээлэл удахгүй нийтлэгдэнэ" блок. Бүрэн нээх үед `live` болгоно.
- [ ] Live болгосны дараа "Холбоотой аялал, туршлага, үйлчилгээ" хэсэг газрын хуудсуудад автоматаар гарч эхэлнэ. Учир нь `/local` хуудсууд руу заасан картууд нээгдэнэ. Preview дээр шалгах.

## 3. Redirect (`travel-mongolia/next.config.js` → `redirects()`)

- [x] `/inspiration/stories` → `/stories`, `/inspiration/magazine` → `/stories` (байнгын, `next.config.js`).
- [x] Сайт доторх холбоосууд шинэчлэгдсэн (цэс, `lib/stories.ts`, inspiration-ийн дараах/өмнөх холбоос).
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

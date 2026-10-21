# Өнөөдрийн ажлын тайлан (2026-10-21)

Явц: [today-progress.md](today-progress.md).

## 1. А хэсэг: нийтлэх (дууссан)

- **Merge/deploy:** `feat/tic-batch-4-7-8` → `main` fast-forward (`5db84de`), `staging` = main. Авто горим `main` руу push хийхийг хаасан тул push-ийг та өөрөө хийсэн. Vercel production **Ready**. Production дээр `/stories/news` index болсныг шалгасан.
- **Нийтэлсэн тоо** (алдаа 0, `scripts/tic/publish-today.js`):

| Алхам | Entry | Asset |
|---|--:|--:|
| 1) «Хотын дурсгалт газрууд» | ангилал 1 (138 газар аль хэдийн нийтлэгдсэн байсан; ангиллын холбоос л draft байсан тул жагсаалт хоосон харагдаж байсан) | 0 |
| 2) 8 сум, аймаг, зураг, AI/Шангри-Ла салгасан | 40 (аймаг 22, сум 8, destination 4, recommendation 4, cultureHeritage 1, heritagePlace 1) | 35 |
| 3) 4-р багц | 451 (газар 209, түүх/соёлын дурсгал 241, ангилал 1) | 276 |
| 4) Арга хэмжээ | 34 | 39 |
| 5) Мэдээ | 616 | 262 |
| **Нийт** | **1,142** | **612** |

- **Webhook:** ганц webhook байдаг («Travel Hub — on-demand revalidate», IndexNow үүн дотроос дуудагддаг). Өмнө нь active=true байсан. Нийтлэлтийн үеэр түр унтраасан, одоо active=true. Буцааж асаасны дараа шалгасан.
- **Revalidate:** `/api/revalidate` руу нэг удаа хүсэлт илгээж бүх сайтыг шинэчилсэн (200).
- **IndexNow:** 1 хүсэлтээр **1,047 URL** илгээсэн (хариу 200). Шинэ 1,133 хаягаас зөвхөн sitemap-д орсон буюу index хийгдэх хуудсуудыг илгээсэн.
- **Sitemap:** **834 → 1,855** URL.
- **Production шалгалт:**
  - «Хотын дурсгалт газрууд» жагсаалт хоосон биш.
  - `/stories/news` 200, index.
  - Жишээ 10 хуудас 200, canonical зөв. `aav-khad` богино тул noindex, энэ нь санаатай.
  - main-ийн redirect хүснэгтийн 1,117 new_url бүгд 200. Үүнээс 85 нь богино контенттой тул noindex.
- **Нийтлэгдээгүй entry:** алдаагаар нийтлэгдээгүй entry байхгүй. Буудал, баазын 366 entry-г санаатайгаар draft хэвээр үлдээсэн (Б2).

## 2. Гарчиг

- **261 гарчиг засагдсан:** 4-р багц 57, арга хэмжээ 3, буудал 13, бааз 32, мэдээ 156.
  - Эх нь TIC хуудасны `<title>` таг. Тэнд гарчиг жинхэнэ бичлэгээрээ байдаг («4 улсын…», «Д.Отгонбаяр: …»).
  - Мөн инициал (Ц.Дамдинсүрэн), ром тоо (II, VII, XIII), товчлол (МНТ, УБ, МУ), мөн таны жишээ «Зэд-Хантай-Бүтээлийн нуруу».
- **Эргэлзээтэй 17 гарчиг** [title-review.md](title-review.md)-д байна (өмнө / санал).

## 3. Redirect CSV

| Файл | main дээр | feat/tic-batch-10 дээр | Хассан |
|---|--:|--:|--:|
| batch-04-places | 453 | 453 | 0 |
| batch-07-events-camps-hotels | 34 | 495 | 461 (буудал, бааз; Б2-т `/plan/accommodation/<slug>`-аар буцсан) |
| batch-08-news | 642 | 642 | 1,648 (алгассан мэдээ) |
| batch-09-listing-pages | 21 | 28 | 347 (жагсаалт 14, cate25/27/28 нийтлэл 29, ❓ түр 304); Б-д cate14/15/16/21/22-ын 7 жагсаалт буцсан |
| batch-10-people-culture | — | 304 | — |

- Хассан мөрүүд [not-redirected.csv](../redirects/not-redirected.csv)-д бүртгэгдсэн (Б дээр 1,684). Эдгээр нь TIC дээрээ үлдэх хуудсууд.
- old_url давхардал 0.

## 4. Б хэсэг (feat/tic-batch-10, бүгд Draft)

- **10-р багц: 304 Draft.** Угсаатан 25, түүхэн хүмүүс 48, шашин 102, зан заншил 129.
  - Шинэ `cultureArticle` төрөл.
  - Зургийн алдаа 0, needsReplacement 145.
  - Coverage: **❓ = 0** (✅ 3,163 · ↪️ 28 · ⛔ 1,730).
- **Буудал/бааз:** `/plan/accommodation` дээр 366 газрын лавлах (аймаг, төрлөөр шүүнэ) ба дэлгэрэнгүй хуудас нэмсэн. «Энэ мэдээллийг Tourist Info Center-ээс авсан…» мэдэгдэл хуудас бүрт бий. `/local`-оос хасагдсан, `/local/<slug>` нь 308-аар шинэ хаяг руу шилжинэ.
- **Аймгийн breadcrumb:** Нүүр › Аймгууд › Аймаг (+ BreadcrumbList). Сумын хуудсанд «Аймгууд» шат нэмсэн.
- **eslint:** `eslint.config.mjs` нэмснээр `yarn lint` ажилладаг болсон: 199 асуудал (185 алдаа, 14 анхааруулга). Засаагүй.
- **Build:** build OK. Preview `success`: https://travel-mongolia-ilas-git-feat-tic-batch-10-joinme1.vercel.app
- `NON_MONGOLIAN_ASSETS` кодын шүүлтүүрийг хассан. Шангри-Ла зураг Contentful дээр салж нийтлэгдсэн.

## 5. Contentful record

**5,417 / 10,000** (entry 3,194, asset 2,223). Өглөө 4,819 байсан.

## 6. Preview дээр шалгах 10 линк

Урд нь: `https://travel-mongolia-ilas-git-feat-tic-batch-10-joinme1.vercel.app`

1. `/about/culture/ethnic-groups` — угсаатнууд (25)
2. `/about/culture/ethnic-groups/mongol-khemeekh-nernii-uchir`
3. `/about/history/people` — түүхэн хүмүүс (48)
4. `/about/history/people/chingis-khaan`
5. `/about/culture/religion` — шашин (102)
6. `/about/traditions#articles` — зан заншлын 129 нийтлэл, жишээ `/about/traditions/aaruul`
7. `/plan/accommodation#directory` — 366 буудал/бааз, шүүлтүүр
8. `/plan/accommodation/terelj-bayanmongol-resort` — TIC мэдэгдэлтэй дэлгэрэнгүй
9. `/province/khovd` — 960px hero + сүлд + breadcrumb
10. `/province/dornogov/sainshand` — Нүүр › Аймгууд › Дорноговь › Сайншанд

## 7. Шийдэх асуултууд

1. **Б-г main руу merge хийх үү?** Merge хийсний дараа 304 нийтлэл болон 366 буудал/баазыг нийтлэх эсэхийг шийднэ. Шинэ цэсний 3 зүйл (Угсаатнууд, Шашин шүтлэг, Түүхэн хүмүүс) одоогоор draft төлөвтэй.
2. **Push:** авто горим `main` руу push хийхийг хаадаг. Merge бүрт push-ийг та хийх үү, эсвэл `git push origin main`-д зөвшөөрлийн дүрэм нэмэх үү?
3. **title-review.md-ийн 17 гарчиг** зөв эсэхийг шалгана уу.
4. **10-р багцын needsReplacement 145** («Монгол орны лавлах» г.м.): нийтлэхээс өмнө солих уу, эсвэл байгаагаар нь нийтлэх үү?
5. **darkhan.jpg (960px):** Дархан хотын тусдаа entry байхгүй тул тавиагүй. Хаана ашиглах вэ?
6. **orkhon.jpg 960×222** (панорама) hero дээр бүдэг харагдаж магадгүй. Илүү том зураг байгаа юу?
7. **85 богино хуудас** (noindex, 80-аас цөөн үг): нэмж бичих үү, эсвэл ингээд үлдээх үү?

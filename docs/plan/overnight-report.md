# Шөнийн ажлын тайлан (2026-10-20)

Branch: `feat/tic-batch-4-7-8` (push хийсэн, Vercel preview `success`).
Preview: https://travel-mongolia-ilas-git-feat-tic-batch-4-7-8-joinme1.vercel.app (Vercel эрхээр нэвтэрч үзнэ).
**Contentful дээр юу ч нийтлээгүй, устгаагүй.** Бүх шинэ entry, asset, өөрчлөлт Draft. Production өөрчлөгдөөгүй.

## 1. Багц тус бүр

| Багц | Үүссэн (Draft) | Алгассан | Алдаа | Хаана |
|---|--:|--:|---|---|
| 8 сум | 8 (7 шинэ + Баянхонгор сумын хоосон Draft-ийг бөглөсөн) | 0 | 0 | `/province/<аймаг>/<сум>` (5) эсвэл аймгийн «Сумд» жагсаалт (3) |
| 4-р багц (cate1, 453) | 450 + 1 ангилал: байгалийн газар 209, түүх/соёлын дурсгал 241; «13-р зуун цогцолбор»-д 1 нэгтгэсэн | 2 (өмнөх багцад байсан → redirect) | зураг 0 | `/destination/landscapes/<slug>`, `/destination/heritage/place/<slug>`, `/destination/heritage/historical-sites` |
| 7-р багц (cate20–22, 400) | арга хэмжээ 34, зочид буудал 110, жуулчны бааз 256 | 0 | зураг 6 (TIC-ийн эвдэрсэн `file://` зам) | арга хэмжээ: `/recommendation/<slug>` + Фестивалиуд жагсаалт. Буудал/бааз: `/local/<slug>` — **хэсэг нээгдээгүй** (soft) |
| 8-р багц (мэдээ) | 616 | 47 (гадаад/холбоогүй 46, орос хэл 1) + inventory-д АЛГАСАХ 1,601 | зураг 35 (гуравдагч сайтын үхсэн холбоос) | `/stories/news/<slug>` (шинэ, **draft** хуудас) |

- Хуучирсан арга хэмжээ (огноо өнгөрсөн): **13** (огноог хэвээр хадгалсан). Бүтэн огноотой 1.
- «TIC-ээс авсан, шалгах» (`needsVerification`): 396 (бүх буудал/бааз + утас/үнэ/огноотой арга хэмжээ).
- `needsReplacement=true` (лавлах ном, сонин, гуравдагч зураг): 4-р багц 66, 7-р 1, 8-р 34.
- 8 сумын текст Travel Hub өөрөө бичсэн: sourceUrl хоосон, needsReplacement=false. **8 сумын тоо баримтыг шалгах.** Нөхөх 22 зүйл: [missing-soums-todo.md](missing-soums-todo.md).
- Мэдээний 1-р ажиллуулалт урт sourceUrl-ээс болж 424 дээр зогссон; засаад дахин ажиллуулсан (давхардал үүсээгүй).
- Олдсон хуучин алдаа: «Хотын дурсгалт газрууд» ангиллын жагсаалт **production дээр хоосон** («Нийт 0 газар»). Draft-аар 138 газрыг сэргээсэн — нийтэлбэл засагдана.

## 2. Зураг

- **Тавьсан (14 файл, 16 entry):** arkhangai, bayan-ulgii, bayankhongor, bulgan, darkhan-uul (+ Дархан-Уул destination), dornod, dundgov, gov-altai, govsumber, tuv, ulaanbaatar, umnugov, uvurkhangai — аймгийн hero; sukhbaatar-square → Сүхбаатарын талбай.
- **Сайжруулах:** govsumber (1024px), gov-altai (8199×687 панорама, голоос 3:1 тайрсан).
- **Жижиг тул тавиагүй (960px):** dornogov, khentii, khovd, khuvsgul, orkhon, selenge, sukhbaatar, uvs, zavkhan, terelj, orkhon-valley, darkhan, naadam.
- **Нэр таараагүй:** алга. burkhan-khaldun.jpg байхгүй — алгассан.
- Аймгийн хуучин TIC сүлд устгагдаагүй: шинэ `emblem` талбарт шилжиж, hero дээр тэмдэг хэвээр.
- **Салгасан AI зураг (9 entry):** Улаанбаатар, Ховд (аймаг), Тэрэлж, Орхоны хөндий, Сүхбаатарын талбай, Дархан-Уул (destination), Улсын/Хотын/Сумын наадам (recommendation). Шинэ зураг байхгүйд TIC-ийн жинхэнэ зураг тавьсан. AI asset-ууд устгагдаагүй, AI зурагтай entry үлдээгүй.
- Эх сурвалж тодорхойгүй — credit хоосон: [photo-sources.md](../province-design/photo-sources.md).

## 3. TIC хамрах шалгалт ([tic-coverage.md](tic-coverage.md))

| ✅ шилжсэн | ↪️ зөвхөн redirect | ⛔ алгассан | ❓ шийдээгүй |
|--:|--:|--:|--:|
| 2,859 | 35 (жагсаалтын хуудас) | 1,730 | **304** |

❓ = 0 биш. 304 нь багцад ороогүй ангилал: cate14 угсаатнууд (25) ба түүхэн хүмүүс (48), cate15 шашин шүтлэг (102), cate16 зан заншил (129). 404 гарахгүйн тулд ангиллын хуудас руу түр redirect тавьсан (batch-09).

## 4. Contentful record

**4,819 / 10,000** (entry 2,890, asset 1,929). Эхэлэхэд 2,564 байсан. 9,000-ийн хязгаарт хүрээгүй.

## 5. Redirect CSV

| Файл | Мөр |
|---|--:|
| batch-04-places.csv | 453 |
| batch-07-events-camps-hotels.csv | 495 (+95 нь TIC-ийн буруу `cate4_more` буудлын холбоос) |
| batch-08-news.csv | 2,290 (бүх мэдээ, алгассан нь `/stories` руу) |
| batch-09-listing-pages.csv | 368 (жагсаалтын хуудас 35, алгассан cate25/27/28 нийтлэл 29, ❓ түр redirect 304) |

Бүх batch-01…09-д нэг old_url давхардаагүй, бүх new_url `https://www.travelhubmongolia.com`-оор эхэлдэг. Нээгдээгүй хэсэг рүү заасан мөр: batch-07 461 (`/local`), batch-08 642 (`/stories/news`), batch-09 22 (`/local/guides`).

## 6. Өглөө preview дээр шалгах 10 линк

Урд нь: `https://travel-mongolia-ilas-git-feat-tic-batch-4-7-8-joinme1.vercel.app`

1. `/province/bayankhongor` — шинэ hero + сүлд, «Сумд»-д Баянхонгор, Баян-Овоо сум; «Байгалийн үзэсгэлэнт газрууд», «Түүх, соёлын дурсгалт газрууд» хэсэг
2. `/province/dornogov/sainshand` — сумын хуудас, тоо баримтын карт
3. `/province/khuvsgul/renchinlkhumbe`
4. `/province/ulaanbaatar` — AI зургийн оронд шинэ hero
5. `/destination/landscapes#all-places` — 209 газрын жагсаалт
6. `/destination/landscapes/bayanzag`
7. `/destination/heritage/historical-sites` — 241 газар
8. `/destination/heritage/place/khushuutiin-khadny-zurag`
9. `/recommendation/tumen-temeenii-bayar` — арга хэмжээ (Фестивалиуд жагсаалтад)
10. `/stories/news` — мэдээний архив (616)

Нэмэлт: `/destination/sukhbaataryn-talbai`, `/destination/heritage/city-monuments` (сэргээсэн 138), `/local/terelj-bayanmongol-resort` (бааз).

Шалгалт (local, Preview API): 10 хуудас бүгд 200, H1 нэг, canonical өөрийн, noindex биш, зураг ачаалагдсан. BreadcrumbList шинэ хуудсуудад бий (сум, арга хэмжээний хуудсанд нэмсэн); аймгийн болон `/destination/<slug>` хуудсанд өмнөх загвараараа байхгүй. Production sitemap-д draft хуудас 0. `next build` алдаагүй. `yarn lint` ажиллахгүй (repo-д eslint.config алга, өмнөх байдал).

## 7. Шийдэх асуултууд

1. **Нийтлэх:** preview-г зөвшөөрвөл нийтлэх скрипт (asset → entry → ангилал) бичиж ажиллуулъя. «Хотын дурсгалт газрууд» хоосон байгаа тул түүнийг түрүүлж нийтлэх үү?
2. **❓ 304 нийтлэл** (cate14 угсаатан/түүхэн хүмүүс, cate15 шашин, cate16 зан заншил): хаана байрлуулах вэ? Санал: cate14 → `/about/history`-д «Угсаатнууд», «Түүхэн хүмүүс» хэсэг (historyArticle); cate15/16 → `/about/culture/<slug>`, `/about/traditions/<slug>` шинэ нийтлэлийн route.
3. **Буудал, бааз (366)** `/local/<slug>` (soft) дээр орсон. `/plan/accommodation` (live) дээр жагсаалт, `/plan/accommodation/<slug>` хуудас хийх үү?
4. **Мэдээний архив** `/stories/news` draft. Live болгох уу? Inventory-д АЛГАСАХ гэсэн 1,601 мэдээг (хуучирсан үйл явдал, гадаад) оруулахгүй байх нь зөв үү?
5. TIC-ийн «Tours.aspx», cate27/28 (гадаад) хаягийг travelhubmongolia.com нүүр рүү заасан (дүрмийн дагуу). Хуучин төлөвлөгөөнд joinme.mn руу байсан — аль нь вэ?
6. Монголын бус (Шангри-Ла) зураг «Үндэсний их баяр наадам» (cultureHeritage), «Аймгийн наадам», «13-р зуун цогцолбор»-д үлдсэн (код нууж байгаа). «Хөвсгөл нуур» destination-ий stock зураг Монголынх эсэхийг шалгах.
7. Гарчгийг ТОМ үсгээс автоматаар өгүүлбэрийн бичлэгт шилжүүлсэн; олон оноосон нэртэй гарчиг («Зэд, хантай, бүтээлийн нуруу» г.м.) засах шаардлагатай байж болно.
8. Аймгийн хуудсанд breadcrumb (BreadcrumbList) нэмэх үү?

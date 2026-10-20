# TIC шилжүүлэлт: 3, 5, 6-р сэдвийн явц

> Branch: `feat/tic-batch03-06` (main-аас, 2026-10-20). Тасарвал энэ файлын «Дараагийн алхам»-аас үргэлжлүүлнэ.
> Скрипт: `scripts/tic/*-batch03-06.js`. HTML кэш: `backups/tic-cache/batch03-06/` (gitignored, дахин татахгүй).

## 0. Бэлтгэл

- [x] Branch үүсгэсэн. main дээр untracked publish скрипт байгаагүй (`publish-batch01b.js`, `verify-batch01b.js` нь `91840e1`-д аль хэдийн commit хийгдсэн).
- [x] `.claude/settings.local.json` (commit хийхгүй, `.gitignore`-д нэмсэн): зөвшөөрөл, хориг.
- [x] Inventory-ийн тоо:

| Ангилал | Нэр | Нийт | ХУУЛАХ | ШАЛГАХ | АЛГАСАХ |
|---|---|--:|--:|--:|--:|
| cate2 | Дархан цаазат газар | 18 | 17 | 1 | 0 |
| cate3 | Байгалийн нөөц газар | 19 | 19 | 0 | 0 |
| cate4 | Байгалийн цогцолборт газар | 22 | 22 | 0 | 0 |
| cate5 | Байгалийн дурсгалт газар | 22 | 20 | 2 | 0 |
| cate8 | Рашаан сувилал | 29 | 26 | 3 | 0 |
| cate9 | Хотын дурсгалт газар | 146 | 117 | 29 | 0 |
| cate10 | Ан амьтан (TypeID 1–4) | 131 | 125 | 6 | 0 |
| cate11 | Шувууд | 467 | 64 | 403 | 0 |
| cate12 | Ургамал | 91 | 72 | 19 | 0 |
| cate17 | Музей, театр, соёлын төв (TypeID 1–3) | 62 | 49 | 13 | 0 |
| **Нийт** | | **1,007** | **531** | **476** | **0** |

- [x] HTML татах (`fetch-batch03-06.js`, 1,007 хуудас, алдаа 0)
- [x] Contentful нөөц: `backups/contentful-2026-10-20-pre-batch03-06/` (427 entry, 258 asset)
- [x] Schema (`schema-batch03-06.js`): шинэ `place`, `species` төрөл; `heritagePlace`, `destination`-д `provinceRef`, `protectedCategory`, `sourceUrl`, `needsReplacement`

## Шийдвэрүүд

- Шинэ Contentful төрөл: `place` (тусгай хамгаалалттай газар, музей/театр/соёлын төв, рашаан сувилал), `species` (ан амьтан, шувуу, ургамал). 15 → 17 төрөл.
- Хотын дурсгалт газар (cate9) → одоо байгаа `heritagePlace` төрөл + шинэ `heritageCategory` «Хотын дурсгалт газрууд» (`/destination/heritage/city-monuments`).
- Давхардал (шинээр үүсгэхгүй, одоогийн entry-д TIC текстийг нэмнэ): Горхи-Тэрэлж → destination `terelj`, Хөвсгөл нуур → destination `khuvsgul-nuur`, Бурхан Халдун → heritagePlace `burkhan-khaldun`, Орхоны хөндий → heritagePlace `orkhony-khundii`, Сүхбаатарын талбай → destination `sukhbaataryn-talbai`.

## 1. 3-р сэдэв: Тусгай хамгаалалттай газрууд

- [x] Импорт (`import-batch03-06.js --topic=3`): 80 entry (74 шинэ `place` + 4 нэгтгэл + Богдхан уул/Улаан тайгын давхардал), redirect 81 мөр, зураг 1 алдаа (gereg.mn 404, Ноён уул)
- [x] Хуудас: `/destination/protected/<slug>` (PlaceTemplate), 5 жагсаалтын хуудсанд «Бүх газар» (`ProtectedPlacesSection`), аймгийн хуудсанд `#protected-areas`, нэгтгэсэн destination/heritagePlace хуудсанд ангилал/аймгийн хайрцаг
- TIC-ийн cate4/зочид буудлын ID давхцал: cate4-ийн 22 мөрийг cate4.aspx жагсаалтаас авсан; импорт татсан хуудасны гарчиг inventory-тэй таарч байгааг шалгадаг (22/22 таарсан, буудал орж ирээгүй). Давхцсан 15 ID-ийн `cate4_more` хаяг цогцолборт газар руу redirect.

## 2. 5-р сэдэв: Байгаль

- [x] Хуудас: `/about/nature/wildlife`, `/birds` (каталог, хайлт, үсгийн шүүлтүүр, `#slug`), `/plants` + `[slug]` нийтлэлүүд; цэсэнд «Байгаль»-ийн 3 дэд мөр (draft)
- [ ] Импорт (`--topic=5`): ажиллаж байна

## 3. 6-р сэдэв: Музей, рашаан, хотын дурсгалт газар

- [ ] import, хуудас

## Дараагийн алхам

HTML татаж дуусахыг хүлээх → `_batch03-06.js` (ангилал, аймаг, давхардлын хүснэгт).

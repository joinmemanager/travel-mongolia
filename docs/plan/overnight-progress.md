# Шөнийн ажил: TIC 4, 7, 8-р багц + 8 сум + аймгийн зураг — явц

> 2026-10-20 эхэлсэн. Branch: `feat/tic-batch-4-7-8`. Бүх Contentful өөрчлөлт **Draft** (publish хийхгүй).
> Тасарвал энэ файлыг уншаад дууссан ([x]) алхмыг алгасна. Импорт скриптүүд idempotent (entry id тогтмол).

- [x] Алхам 0: Бэлтгэл — branch `feat/tic-batch-4-7-8` (main-аас, pull: up to date), өмнөх скрипт/тайланг уншсан, `missing-soums-texts.md` хадгалсан
- [x] Алхам 1: 8 сум — 8 soum entry Draft (`scripts/tic/import-missing-soums.js`): 7 шинэ (`th-soum-<аймаг>-<сум>`) + Баянхонгор сумын гараар үүсгэсэн хоосон Draft entry (`sSy2hhvn66fJfGagZeRKL`)-ийг бөглөсөн (slug хэвээр). ownPage (>150 үг): Сайншанд, Улаангом, Рашаант, Рэнчинлхүмбэ, Цэцэрлэг; жагсаалтаар: Баянхонгор, Баян-Овоо, Өлгий. «[нэмэх]» 22 мөр → `missing-soums-todo.md`. Сумын хуудсанд center/population/area карт нэмсэн. Алдаа 0
- [x] Алхам 2: Аймгийн зураг — 14 asset (Draft), 16 entry. 13 аймгийн hero + Сүхбаатарын талбай + Дархан-Уул destination. <1000px 13 файл тавиагүй. province-д `emblem` талбар нэмж, хуучин TIC сүлдийг тэнд шилжүүлсэн. AI зураг 6 entry-ээс салгасан (УБ, Ховд, Тэрэлж, Орхоны хөндий, Сүхбаатарын талбай, Дархан-Уул destination). Наадмын 3 recommendation-ийн AI зургийг 7-р багцын TIC зургаар сольсон (улсын ← c20_8, хотын ← c20_9, сумын ← c20_94). AI зурагтай entry үлдээгүй. `docs/province-design/photo-sources.md`
- [x] Алхам 3: 4-р багц cate1 — 453 мөр: 209 `place` landscape (`/destination/landscapes/<slug>`), 241 `heritagePlace` tic-c1-* + heritageCategory `historical-sites`, «13-р зуун цогцолбор»-д нэгтгэсэн 1, өмнөх багцад байсан 2 (c1_174 → c9_24, c1_162 → c5_18) redirect. NR 66, зургийн алдаа 0, координат TIC текстэд 0. `docs/redirects/batch-04-places.csv` 453 мөр. Мөн олдсон алдаа: city-monuments ангиллын places хоосон байсныг Draft-аар сэргээсэн (`fix-city-monuments.js`)
- [x] Алхам 4: 7-р багц — 34 event (/recommendation/<slug>, festivals жагсаалт; хуучирсан 13), 110 зочид буудал + 256 жуулчны бааз = 366 localProvider accommodation (/local/<slug> — хэсэг нээгдээгүй, soft). needsVerification 396. Зургийн алдаа 6 (c22_250 TIC-ийн эвдэрсэн file:// зам); давхар encode-ийн 4 алдааг засаж дахин оруулсан. batch-07 CSV 495 мөр (+95 cate4_more буруу холбоос)
- [ ] Алхам 5: 8-р багц мэдээ
- [ ] Алхам 6: TIC бүрэн хамрах шалгалт
- [ ] Алхам 7: Redirect хүснэгт
- [ ] Алхам 8: Build, preview шалгалт
- [ ] Алхам 9: Өглөөний тайлан

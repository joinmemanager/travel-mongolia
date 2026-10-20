# Шөнийн ажил: TIC 4, 7, 8-р багц + 8 сум + аймгийн зураг — явц

> 2026-10-20. Branch: `feat/tic-batch-4-7-8`. Бүх Contentful өөрчлөлт **Draft** (publish хийгээгүй).
> Тасарвал энэ файлыг уншаад дууссан ([x]) алхмыг алгасна. Импорт скриптүүд idempotent (entry id тогтмол, байгаа slug хэвээр).
> Тайлан: [overnight-report.md](overnight-report.md).

- [x] Алхам 0: Бэлтгэл — branch (main-аас), өмнөх скрипт/тайлан уншсан, `missing-soums-texts.md` хадгалсан
- [x] Алхам 1: 8 сум — `import-missing-soums.js`: 7 шинэ + Баянхонгор сумын гараар үүсгэсэн хоосон Draft entry-г бөглөсөн. «[нэмэх]» 22 → `missing-soums-todo.md`. Алдаа 0
- [x] Алхам 2: Аймгийн зураг — `import-aimag-photos.js`: 14 asset, 16 entry; province.emblem талбар; AI зураг бүх entry-ээс салсан (наадмын 3 recommendation-ийг 7-р багцын TIC зургаар). `docs/province-design/photo-sources.md`
- [x] Алхам 3: 4-р багц cate1 — `import-batch04.js`: 209 landscape place + 241 heritagePlace + ангилал, 1 нэгтгэсэн, 2 redirect. Зургийн алдаа 0. city-monuments ангиллын хоосон places-ийг сэргээсэн (`fix-city-monuments.js`)
- [x] Алхам 4: 7-р багц — `import-batch07.js`: 34 event, 366 localProvider. Зургийн алдаа 6 (TIC-ийн эвдэрсэн file:// зам)
- [x] Алхам 5: 8-р багц — `import-batch08.js`: 616 мэдээ (story/news). 1-р ажиллуулалт sourceUrl >256-аар 424 дээр зогссон → засаж дахин ажиллуулсан. Зургийн алдаа 35 (гуравдагч сайт)
- [x] Алхам 6: Хамрах шалгалт — `coverage.js` → `tic-coverage.md`: ✅ 2,859 · ↪️ 35 · ⛔ 1,730 · ❓ 304
- [x] Алхам 7: Redirect CSV — batch-04/07/08/09, давхардал 0, бүгд travelhubmongolia.com
- [x] Алхам 8: local build OK, 10 хуудасны шалгалт (`verify-batch04-08.js`), push, preview `success`
- [x] Алхам 9: Тайлан

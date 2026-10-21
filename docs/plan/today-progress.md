# Өнөөдрийн ажил (2026-10-21): (А) нийтлэх + (Б) 10-р багц draft — явц

> Тасарвал энэ файлыг уншаад дууссан ([x]) алхмыг алгасна. Скриптүүд idempotent.
> Тайлан: [today-report.md](today-report.md).

## А хэсэг — нийтлэх
- [x] А1.1 Гарчиг: `fix-titles.js --apply` — 261 засав (4-р 57, арга хэмжээ 3, буудал 13, бааз 32, мэдээ 156; TIC-ийн <title> тагийн бичлэгээр), эргэлзээтэй 17 → title-review.md
- [x] А1.2 Шангри-Ла: `detach-non-mongolian.js` — 3 entry-ээс салгав (13-р зуун, Аймгийн наадам, Үндэсний Их Баяр Наадам), asset хэвээр. Кодын `NON_MONGOLIAN_ASSETS` нуултыг нийтэлсний дараа Б branch-д цэвэрлэнэ (тэр болтол production-д хамгаална)
- [x] А1.3 960px: `import-aimag-photos-960.js` — 12 файл: 9 аймгийн hero (сүлд → emblem), Тэрэлж, Орхоны хөндий, naadam → 2 наадмын entry; darkhan.jpg тавиагүй (entry алга). Код: emblem-тэй аймагт 900px+ hero (`heroSized`)
- [x] А1.4 Redirect: `clean-redirects.js` + `coverage.js`. batch-04 453 (0 хассан), batch-07 34 (461 буудал/бааз → pending/, Б2-т буцна), batch-08 642 (1,648 хассан), batch-09 21 (347 хассан: жагсаалт 14, cate25/27/28 29, ❓ түр 304). Хассан нь not-redirected.csv (1,691). Давхардал 0
- [x] А1.5 Код: /stories/news live; sitemap (хуудаслалт, event, мэдээ); revalidate/IndexNow-д мэдээ, event. `next build` OK, tsc зөвхөн өмнөх 2 алдаа. Commit, push
- [ ] А2 main руу merge, staging, production deploy Ready
- [ ] А3.1 Webhook-уудын төлөв бичиж, түр идэвхгүй болгох
- [ ] А3.2 Нийтлэх: 1) хотын дурсгалт 138 2) сум/аймаг/AI 3) 4-р багц 4) арга хэмжээ 5) мэдээ
- [ ] А3.3 Webhook сэргээх, шалгах
- [ ] А3.4 /api/revalidate бүх сайт
- [ ] А3.5 IndexNow bulk
- [ ] А3.6 Production шалгалт

## Б хэсэг — feat/tic-batch-10 (draft)
- [ ] Б1 10-р багц: 304 нийтлэл
- [ ] Б2 Буудал, бааз → /plan/accommodation
- [ ] Б3 Аймгийн хуудасны breadcrumb
- [ ] Б4 eslint.config
- [ ] Б5 build, push, preview
- [ ] Тайлан

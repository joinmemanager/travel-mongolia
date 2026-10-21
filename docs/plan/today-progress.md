# Өнөөдрийн ажил (2026-10-21): (А) нийтлэх + (Б) 10-р багц draft — явц

> Тасарвал энэ файлыг уншаад дууссан ([x]) алхмыг алгасна. Скриптүүд idempotent.
> Тайлан: [today-report.md](today-report.md).

## А хэсэг — нийтлэх
- [x] А1.1 Гарчиг: `fix-titles.js --apply` — 261 засав (4-р 57, арга хэмжээ 3, буудал 13, бааз 32, мэдээ 156; TIC-ийн <title> тагийн бичлэгээр), эргэлзээтэй 17 → title-review.md
- [x] А1.2 Шангри-Ла: `detach-non-mongolian.js` — 3 entry-ээс салгав (13-р зуун, Аймгийн наадам, Үндэсний Их Баяр Наадам), asset хэвээр. Кодын `NON_MONGOLIAN_ASSETS` нуултыг нийтэлсний дараа Б branch-д цэвэрлэнэ (тэр болтол production-д хамгаална)
- [x] А1.3 960px: `import-aimag-photos-960.js` — 12 файл: 9 аймгийн hero (сүлд → emblem), Тэрэлж, Орхоны хөндий, naadam → 2 наадмын entry; darkhan.jpg тавиагүй (entry алга). Код: emblem-тэй аймагт 900px+ hero (`heroSized`)
- [x] А1.4 Redirect: `clean-redirects.js` + `coverage.js`. batch-04 453 (0 хассан), batch-07 34 (461 буудал/бааз → pending/, Б2-т буцна), batch-08 642 (1,648 хассан), batch-09 21 (347 хассан: жагсаалт 14, cate25/27/28 29, ❓ түр 304). Хассан нь not-redirected.csv (1,691). Давхардал 0
- [x] А1.5 Код: /stories/news live; sitemap (хуудаслалт, event, мэдээ); revalidate/IndexNow-д мэдээ, event. `next build` OK, tsc зөвхөн өмнөх 2 алдаа. Commit, push
- [x] А2 main, staging = 5db84de (push-ийг эзэмшигч хийсэн: авто горим main push-ийг хаасан). Vercel `success`, production дээр /stories/news index — Ready. Sitemap өмнө 834
- [x] А3.1 Webhook: 1 ширхэг «Travel Hub — on-demand revalidate» (3iZ9r7SNBoM74h3fUUp9zb, Entry.publish/unpublish → /api/revalidate, IndexNow үүн дотроос) — өмнө active=true. Түр active=false болгосон (backups/tic-cache/webhooks-before-publish.json)
- [x] А3.2 `publish-today.js step 1-5`, алдаа 0: 1) ангилал 1 (138 газар аль хэдийн нийтлэгдсэн байсан, ангиллын холбоос л draft байсан) 2) entry 40 (аймаг 22, сум 8, destination 4, recommendation 4, cultureHeritage 1, heritagePlace 1) + asset 35 3) place 209 + heritagePlace 241 + ангилал 1 + asset 276 4) event 34 + asset 39 5) мэдээ 616 + asset 262. Нийт entry 1,142, asset 612
- [x] А3.3 Webhook active=true (өмнөхтэй ижил), шалгасан
- [x] А3.4 /api/revalidate → / (layout) 200
- [x] А3.5 IndexNow: 1 хүсэлт, 1,047 URL (шинэ 1,133-аас sitemap-д орсон index хуудас), хариу 200. Жагсаалт: backups/tic-cache/indexnow-2026-10-21.txt
- [x] А3.6 Production: sitemap 834 → 1,855. city-monuments 200, хоосон биш. /stories/news 200 index. Жишээ 10 хуудас 200, canonical зөв (aav-khad богино тул noindex — санаатай). main-ийн redirect new_url 1,117: бүгд 200, 85 нь богино (noindex: landscapes 31, heritage 19, news 35), 404 = 0. Нийтлэгдээгүй entry (алдаа) 0; буудал/бааз 366 санаатай draft

## Б хэсэг — feat/tic-batch-10 (draft)
- [x] Б1 10-р багц: шинэ төрөл `cultureArticle` (`schema-batch10.js`), `import-batch10.js` — 304 Draft (угсаатан 25, түүхэн хүмүүс 48, шашин 102, зан заншил 129), зургийн алдаа 0, needsReplacement 145. Жагсаалт + дэлгэрэнгүй хуудас (SectionLayout), цэс draft. batch-10-people-culture.csv 304. Coverage ❓ = 0
- [x] Б2 /plan/accommodation: лавлах (аймаг, төрлөөр шүүх) + /plan/accommodation/<slug>, TIC мэдэгдэл. Entry-д өөрчлөлт хэрэггүй (providerType=accommodation + TIC sourceUrl-аар кодоор чиглүүлсэн), /local-оос хассан, /local/<slug> → 308. batch-07 руу 461 мөр шинэ хаягаар буцсан (495)
- [x] Б3 Аймгийн хуудсанд Breadcrumbs (Нүүр › Аймгууд › Аймаг) + BreadcrumbList; сумын хуудсанд «Аймгууд» шат нэмсэн
- [x] Б4 eslint.config.mjs (next core-web-vitals + typescript): 199 асуудал (185 алдаа, 14 анхааруулга) — засаагүй
- [x] Б5 next build OK, tsc зөвхөн өмнөх 2 алдаа; local verify-batch10.js 14 хуудас OK. Мөн NON_MONGOLIAN_ASSETS шүүлтүүрийг хассан
- [ ] Тайлан

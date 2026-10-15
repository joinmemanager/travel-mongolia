# Аймгийн хуудасны шинэ загвар

> 2026-10-15, branch `feat/tic-phase1`. Local production build (`next build --webpack` → `next start`, preview горим тул Draft контент харагдана), headless Edge.

| | |
|---|---|
| Компьютер, дээд хэсэг (1440 px) | [desktop-top.webp](desktop-top.webp) |
| Компьютер, гүйлгэсэн: sidebar наалдсан | [desktop-scrolled.webp](desktop-scrolled.webp) |
| Компьютер, бүтэн хуудас | [desktop-full.webp](desktop-full.webp) |
| Ховд (өөрийн зурагтай, Contentful-ийн entry-тэй) | [desktop-khovd.webp](desktop-khovd.webp) |
| Таблет (900 px) | [tablet-top.webp](tablet-top.webp) |
| Утас, дээд хэсэг (390 px) | [mobile-top.webp](mobile-top.webp) |
| Утас: sidebar-ийн картууд агуулгын дээр | [mobile-sidebar.webp](mobile-sidebar.webp) |
| Утас: танилцуулга, сумд | [mobile-content.webp](mobile-content.webp) |

## Бүтэц

1. Намхан hero (48vh), H1 = монгол нэр. Entry-ийн зураг 1000 px-ээс нарийн (TIC-ийн аймгийн нийтлэлийн зураг бүгд ≈250 px-ийн сүлд) бол hero-д Монголын баталгаажсан зураг (`IMAGES.whiteHorse`), сүлд нь гарчгийн дээр тэмдэг болно.
2. Бараан ногоон тууз, алтан тоо: талбай, хүн ам, аймгийн төв, Улаанбаатараас зай, сумын тоо, дундаж өндөршил. Contentful-ийн `area`/`population`/`center` эхэнд, байхгүй бол `lib/provinceFacts.ts` (эх сурвалж файлд). Утгагүй мөр харагдахгүй.
3. Хоёр багана (≥1024 px): агуулга (мөр ≈70 тэмдэгт) + наалддаг sidebar. Таблетад sidebar хоёр баганатай, утсанд агуулгын дээр нэг баганаар.
4. Sidebar: 21 аймаг + УБ-ийн SVG газрын зураг (Natural Earth, public domain, [docs/maps](../maps/README.md)), hover-т нэр, дарахад тухайн аймаг; «Аялал төлөвлөх →» (`/planner`); цаг агаар (`/api/weather/<slug>`, Open-Meteo, 1 цаг кэш, алдаа гарвал карт харагдахгүй).
5. Танилцуулга: эхний 3 догол мөр, үлдсэн нь «Дэлгэрэнгүй унших ▾» (бүтэн текст server HTML-д).
6. «Зургийн цомог»: текст доторх 500 px-ээс өргөн зургууд, lightbox (←/→, Esc). TIC-ийн 21 аймгийн нийтлэлд том зураг байхгүй тул одоогоор аль ч хуудсанд харагдахгүй (босгыг түр 100 px болгож lightbox-ыг шалгасан).
7. Хэсгийн гарчиг зүүн талдаа ногоон зураастай, хэсгүүд ээлжлэн цагаан / #f1f7f2. «Сумд» хэсгийн дотоод зохион байгуулалт хэвээр.

## Гүйцэтгэл

Lighthouse суулгах боломжгүй тул ижил нөхцөлд (CDP, 4x CPU удаашруулалт, 1.6 Мбит/с, 150 мс, 390 px) өмнөх commit-ийн (5c18826) build-тэй харьцуулав. Хоёул preview горимд хуудсыг хүсэлт бүрт Contentful-оос үүсгэдэг тул LCP хэлбэлзэлтэй.

| | Хуучин загвар | Шинэ загвар |
|---|--:|--:|
| LCP (hero зураг) | 4.7–9.8 с | 4.0–6.9 с |
| TBT (≥50 мс long task) | 0.5–1.0 с | 0.6–1.0 с |
| CLS | 0 | 0 |
| JS | 287 KB | 289 KB |
| Нийт татсан | 538 KB | 622 KB |

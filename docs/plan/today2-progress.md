# Өнөөдрийн 2-р ажил (2026-10-21): 10-р багц + буудал/бааз нийтлэх — явц

> Тасарвал энэ файлыг уншаад дууссан ([x]) алхмыг алгасна. Скриптүүд idempotent.
>
> **2026-10-21: ЗОГСООСОН.** Contentful API хязгаар хэтэрсэн тул 11-р сарын 1 хүртэл хойшилсон.
> Push хийгээгүй (preview build Contentful хүсэлт зарцуулна). Webhook-д хүрээгүй (active=true хэвээр).
>
> **2026-11-02: ҮРГЭЛЖЛҮҮЛСЭН.** Нийтлэлт дууссан. Үлдсэн нь: 3.4 IndexNow (доор) болон [later-todo.md](later-todo.md).

## 1. Merge + push
- [x] 1.1 feat/tic-batch-10 → main fast-forward (c04e137)
- [x] 1.2 Эзэмшигч `git push origin main` + `git push origin main:staging` (origin/main = origin/staging = c04e137)
- [x] 1.3 Vercel production Ready (2 deploy success). /about/culture/ethnic-groups, /about/history/people 200

## 2. Нийтлэхээс өмнөх засвар (Contentful-д DRAFT өөрчлөлт хийсэн, нийтлээгүй)
- [x] 2.1 title-review 17 → TITLE_FIX, `fix-titles.js --apply`: 17 засав (15 + 2: tic-c1-424, tic-c1-543 өмнө автомат
      дүрмээр засагдсан байсан тул «зөвхөн том/жижиг үсэг ялгаатай» нөхцөл нэмж дахин ажиллуулсан). title-review.md хүснэгт хоосорсон
- [x] 2.2 Орхон (tic-c13-15): image aimag-photo-orkhon → tic-img-13a7a6c2972c8251 (өмнөх hero, TIC сүлд), emblem хоосон
      (10-19-ний төлөв). aimag-photo-orkhon asset хэвээр. `scripts/tic/fix-orkhon-darkhan.js`
- [x] 2.3 darkhan.jpg → шинэ asset aimag-photo-darkhan (Draft) → Дархан-Уулын Дархан сум tic-c13-271 image
      (хуучин tic-img-49f978efc01c40a7 asset хэвээр). Хэнтийн Дархан сум (tic-c13-1315)-д хүрээгүй
- [x] 2.4 6 сумын баталгаажсан баримт → missing-soums-texts.md + META, `import-missing-soums.js` (8 entry PUT).
      Баянхонгор (630 км, 10 баг, 33,147, Шаргалжуут 54 км), Баян-Овоо (төв Баян-Овоо, 88%), Сайншанд (463 км, 5 баг,
      28,097, Зүүнбаян), Улаангом (1,336 км), Өлгий (1940, 13 баг, эдийн засаг — 179 үг болж ХУУДАСтай болно:
      /province/bayan-ulgii/ulgii), Цэцэрлэг (5,876 (2000)). Рашаант, Рэнчинлхүмбэ-д мэдээлэл өгөгдөөгүй.
      missing-soums-todo.md 22 → 13 мөр

> Дээрх entry-үүд өмнө нийтлэгдсэн тул одоо «changed» төлөвтэй — production хуучин хувилбарыг харуулсаар байна.
> 3-р алхамд нийтлэх: 17 гарчгийн entry, tic-c13-15, tic-c13-271 (+ asset aimag-photo-darkhan), 8 сум
> (missing-soums-result.json).

## 3. Нийтлэх (2026-11-02)
- [x] 3.1 Эзэмшигч webhook-ийг гараар унтраасан (active=false шалгасан)
- [x] 3.2 Нийтлэсэн: entry 698 (cultureArticle 302, localProvider 366, changed 28, Улаан тайга 2), asset 462. Алдаа 0.
      Management API 1,219 хүсэлт (дараах засваруудыг оруулаад). Delivery API хэмжээгүй.
      Лог: `backups/tic-cache/publish-2026-11-02.json`, нөөц: `backups/contentful-snapshot-2026-11-02/`
  - Давхардал: Зан заншлын хувилбар нийтлэгдсэн (tic-c16-122, tic-c16-121). Шашны хувилбар (tic-c15-60, tic-c15-57) болон
    тэдний 2 зураг draft хэвээр; redirect cate15 ItemID 60, 57 → /about/traditions (f791bc1)
  - «Төрийн долоон эрдэнэ» (tic-c16-121): бурханд, бурханы, бурхны → том үсгээр, нийтэлсэн
  - Улаан тайга: tic-c2-68 «Улаан тайгын дархан цаазат газар», tic-c4-13 «Улаан тайгын байгалийн цогцолборт газар»,
    slug өөрчлөгдөөгүй
  - Устгасан 5 asset (AI 4, Шангри-Ла 1), файлын хуулбар `backups/deleted-assets-2026-11-02/`. TIC-ийн 16 зураг хэвээр
  - Цэсний 3 зүйл (Түүхэн хүмүүс, Угсаатнууд, Шашин шүтлэг) live болсон (f791bc1, deploy хийгдсэн; production дээр
    index, h1, цэс шалгасан)
- [x] 3.3 Эзэмшигч webhook-ийг асаасан (active=true шалгасан)
- [ ] 3.4 Revalidate хийсэн. **IndexNow илгээгээгүй:** sitemap шинэчлэгдээгүй (1,859, last-modified 2026-11-02 01:11:53 UTC).
      2026-11-03-нд шалгах: `node backups/contentful-snapshot-2026-11-02/sitemap-diff.js` (өглөөний
      `sitemap-before.txt`-тэй харьцуулна, локал дээр ≈370 URL нэмэгдэхээр гарсан), шинэчлэгдсэн бол `--send`
- [x] 3.5 Production шалгалт: жишээ 15 хуудас хүлээгдсэн хариутай, Шашны 2 хаяг 404. Sitemap-ийн шалгалт 3.4-т

## 4. fix/province-hero-band — ДУУССАН
- [x] 4.1 Hero → ногоон зурвас залгах, breadcrumb доор (3b5427a, main-д)
- [x] 4.2 Тоон баганын давхцал (3b5427a). Production HTML-ийг /province/arkhangai, /province/khovd дээр шалгасан
- [x] 4.3 Production дээр гарсан

## 5. later-todo.md
- [x] 5.1 [later-todo.md](later-todo.md) бичсэн (sitemap revalidatePath г.м.)

# Аймгийн гэрэл зургийн эх сурвалж

> 2026-10-20. Эх: `C:\project\aimag-photos` (эзэмшигчийн өгсөн 27 файл, хавтсыг өөрчлөөгүй). Скрипт: `scripts/tic/import-aimag-photos.js`.
> Шахалт: ffmpeg, ≤2400px өргөн, JPEG `-q:v 4` (≈82 чанар), EXIF хассан. Asset id = `aimag-photo-<файл>`, бүгд **Draft**.
> **Эх сурвалж тодорхойгүй — хожим шалгах.** Credit талбар (asset description-ийн «Зураг:» мөр) хоосон, сайт дээр зохиогч харагдахгүй.

## Тавьсан (14 файл, 16 entry)

| Файл | Эх хэмжээ (px) | Тавьсан хэмжээ | Entry | Хаяг | Эх сурвалж |
|---|--:|--:|---|---|---|
| arkhangai.jpg | 5464×3640 | 2400×1598 | province `tic-c13-1` | /province/arkhangai | тодорхойгүй — хожим шалгах |
| bayan-ulgii.jpg | 5390×3690 | 2400×1644 | province `tic-c13-5` | /province/bayan-ulgii | тодорхойгүй — хожим шалгах |
| bayankhongor.jpg | 5464×3640 | 2400×1598 | province `tic-c13-6` | /province/bayankhongor | тодорхойгүй — хожим шалгах |
| bulgan.jpg | 5464×3640 | 2400×1598 | province `tic-c13-7` | /province/bulgan | тодорхойгүй — хожим шалгах |
| darkhan-uul.jpg | 6000×4000 | 2400×1600 | province `tic-c13-10`; destination `5z3JM5JvdnFX4cUieV9Mrc` (AI зургийн оронд) | /province/darkhan-uul, /destination/5z3JM5JvdnFX4cUieV9Mrc | тодорхойгүй — хожим шалгах |
| dornod.jpg | 7008×4672 | 2400×1600 | province `tic-c13-12` | /province/dornod | тодорхойгүй — хожим шалгах |
| dundgov.jpg | 4000×2252 | 2400×1352 | province `tic-c13-13` | /province/dundgov | тодорхойгүй — хожим шалгах |
| gov-altai.jpg | 8199×687 | 2060×686 (голоос 3:1 тайрсан) | province `tic-c13-8` | /province/gov-altai | тодорхойгүй — хожим шалгах |
| govsumber.jpg | 1024×561 | 1024×562 | province `tic-c13-9` | /province/govsumber | тодорхойгүй — хожим шалгах |
| tuv.jpg | 4752×3168 | 2400×1600 | province `tic-c13-20` | /province/tuv | тодорхойгүй — хожим шалгах |
| ulaanbaatar.jpg | 11000×4362 | 2400×952 | province `0VbEWiwTyIIqS5SXEmK1e` (AI зургийн оронд) | /province/ulaanbaatar | тодорхойгүй — хожим шалгах |
| umnugov.jpg | 5464×3640 | 2400×1598 | province `tic-c13-17` | /province/umnugov | тодорхойгүй — хожим шалгах |
| uvurkhangai.jpg | 5464×3640 | 2400×1598 | province `tic-c13-16` | /province/uvurkhangai | тодорхойгүй — хожим шалгах |
| sukhbaatar-square.jpg | 6016×4016 | 2400×1602 | destination `4E7saPDvAwtwwnw0GFpQSg` (AI зургийн оронд) | /destination/sukhbaataryn-talbai | тодорхойгүй — хожим шалгах |

Аймгийн хуучин зураг (TIC-ийн ≈250px сүлд) устгагдаагүй: шинэ `emblem` талбарт шилжиж, hero дээрх тэмдэг хэвээр харагдана.

## Сайжруулах шаардлагатай (тавьсан)

| Файл | Хэмжээ | Шалтгаан |
|---|--:|---|
| govsumber.jpg | 1024×561 | 1000–1599px: hero-д бага зэрэг бүдгэрнэ |
| gov-altai.jpg | 8199×687 | Панорама (12:1), өндөр нь 687px. 3:1-ээр голоос нь тайрч тавьсан; ≥1600px өндөр/өргөнтэй энгийн харьцаатай зураг хэрэгтэй |

## Сайжруулах — 960px (2026-10-21-нд тавьсан)

Эзэмшигчийн шийдвэрээр (2026-10-21) 960px өргөнтэй зургийг ч тавьсан. Шахалт өмнөхтэй ижил (ffmpeg `-q:v 4`, EXIF хассан, өргөн хэвээр 960).
Скрипт: `scripts/tic/import-aimag-photos-960.js`. Asset id = `aimag-photo-<файл>`, **Draft (А3-д нийтэлнэ)**.
Аймгийн хуучин зураг (TIC сүлд) `emblem` талбарт шилжсэн. `emblem`-тэй аймагт 900px+ зураг hero болно (`heroSized`, app/province/[id]/page.tsx).
**Бүгд сайжруулах — 960px:** ≥1600px өргөнтэй зургаар солих хэрэгтэй (hero дээр бүдэг харагдана).

| Файл | Хэмжээ | Тавьсан | Тэмдэглэл |
|---|--:|---|---|
| dornogov.jpg | 960×720 | /province/dornogov (hero) | сайжруулах — 960px |
| khentii.jpg | 960×638 | /province/khentii (hero) | сайжруулах — 960px |
| khovd.jpg (khovd.JPG) | 960×576 | /province/khovd (hero) | сайжруулах — 960px |
| khuvsgul.jpg | 960×621 | /province/khuvsgul (hero) | сайжруулах — 960px |
| orkhon.jpg | 960×222 | /province/orkhon (hero) | сайжруулах — 960px; панорама (4.3:1), өндөр 222px — хамгийн бүдэг |
| selenge.jpg | 960×720 | /province/selenge (hero) | сайжруулах — 960px |
| sukhbaatar.jpg | 960×636 | /province/sukhbaatar (hero) | сайжруулах — 960px |
| uvs.jpg | 960×640 | /province/uvs (hero) | сайжруулах — 960px |
| zavkhan.jpg | 960×487 | /province/zavkhan (hero) | сайжруулах — 960px |
| terelj.jpg | 960×540 | /destination/terelj (coverImage, TIC зургийн оронд) | сайжруулах — 960px |
| orkhon-valley.jpg | 960×720 | /destination/heritage/place/orkhony-khundii (TIC зургийн оронд) | сайжруулах — 960px |
| naadam.jpg | 960×640 | cultureHeritage «Үндэсний Их Баяр Наадам», recommendation «Аймгийн наадам» (Шангри-Ла зургийг салгасны оронд) | сайжруулах — 960px |
| darkhan.jpg | 960×720 | **тавиагүй** — Дархан хотын тусдаа entry алга, Дархан-Уул аймагт 6000px зураг бий | — |

Нэр таараагүй файл: алга (22 аймгийн файл бүгд slug-тай таарсан). `burkhan-khaldun.jpg` байхгүй — алгассан.

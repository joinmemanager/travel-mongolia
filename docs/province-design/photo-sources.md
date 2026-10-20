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

## Жижиг тул тавиагүй (<1000px, одоогийн зураг хэвээр)

| Файл | Хэмжээ | Хаана тавих байсан | Одоо |
|---|--:|---|---|
| dornogov.jpg | 960×720 | /province/dornogov | TIC сүлд + шалгагдсан түр hero |
| khentii.jpg | 960×638 | /province/khentii | мөн адил |
| khovd.jpg (khovd.JPG) | 960×576 | /province/khovd | AI зургийг салгаж TIC сүлд |
| khuvsgul.jpg | 960×621 | /province/khuvsgul | TIC сүлд |
| orkhon.jpg | 960×222 | /province/orkhon | TIC сүлд |
| selenge.jpg | 960×720 | /province/selenge | TIC сүлд |
| sukhbaatar.jpg | 960×636 | /province/sukhbaatar | TIC сүлд |
| uvs.jpg | 960×640 | /province/uvs | TIC сүлд |
| zavkhan.jpg | 960×487 | /province/zavkhan | TIC сүлд |
| terelj.jpg | 960×540 | /destination/terelj | AI зургийг салгаж TIC-ийн зураг |
| orkhon-valley.jpg | 960×720 | /destination/heritage/place/orkhony-khundii | AI зургийг салгаж TIC-ийн зураг |
| darkhan.jpg | 960×720 | Дархан хот (тусдаа entry алга) → darkhan-uul | тавиагүй |
| naadam.jpg | 960×640 | Наадмын entry-үүд | тавиагүй (AI зургийг TIC зургаар солив, overnight-report.md) |

Нэр таараагүй файл: алга (22 аймгийн файл бүгд slug-тай таарсан). `burkhan-khaldun.jpg` байхгүй — алгассан.

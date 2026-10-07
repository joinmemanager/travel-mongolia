# Зургийн эх сурвалж

> Код дахь тодорхойлолт: `travel-mongolia/lib/images.ts`. Огноо: 2026-10-05.

## Монголынх нь шалгагдсан зургууд (`lib/images.ts`)

Unsplash-ийн зургууд "mongolia" хайлтын үр дүнгээс авсан. Нэг бүрчлэн нүдээр шалгаж, Монголын байгаль, соёл мөн гэдгийг баталгаажуулсан. Unsplash License: үнэгүй, арилжааны хэрэглээ зөвшөөрөгдсөн, зохиогчийг дурдах шаардлагагүй.

| Түлхүүр | Эх сурвалж | Агуулга |
|---|---|---|
| `herderBoy` | `public/hero.jpg` (сайтын өөрийн) | Морьтой хүү, тал нутаг, хонь |
| `gerCamp` | Unsplash `photo-1575415868394-e3b78f3e9b3f` | Уулын бэлийн гэрүүд |
| `gerStars` | Unsplash `photo-1535219241072-7d3c28a49a5c` | Од түгсэн тэнгэр, гэр |
| `whiteHorse` | Unsplash `photo-1630326867210-bf4b2cdd2019` | Цасан уулын бэлийн цагаан морь |
| `chinggisStatue` | Unsplash `photo-1708873395735-dcad0140e3a2` | Цонжин болдог, Чингис хааны хөшөө |
| `lakeGers` | Unsplash `photo-1591804860948-cdb450a32b77` | Нуурын эргийн гэрүүд |
| `herdSnow` | Unsplash `photo-1707669904577-2ebc6f95a826` | Цастай уулын бэлийн мал сүрэг |
| `camels` | Unsplash `photo-1571821807771-62cf66ac3f14` | Элсэн манхан, хоёр бөхт тэмээ |
| `eagleHunter` | Unsplash `photo-1742205025290-f8d83fe1bb58` | Бүргэдчин, цастай уулс |
| `redCliffs` | Unsplash `photo-1537212429608-6b5f5449cdf8` | Говийн улаан хадан цохио (Баянзаг бололтой) |

Alt текстэд зөвхөн нүдээр баталгаажсан зүйлийг бичсэн. Тодорхой газрын нэрийг зөвхөн Цонжин болдог дээр бичсэн. Баянзаг гэдгийг шалгасны дараа alt-д нэмж болно.

## Сайтад байгаа, асуудалтай зургууд

| Зураг | Асуудал | Санал |
|---|---|---|
| Unsplash `photo-1544644181-1484b3fdfc62` | Бали (Индонез) дахь Улун Дану сүм. `/about/culture` болон бусад олон хуудсанд байна. | Пилотын хуудсуудаас хассан. Бусад хуудсаас ч солих хэрэгтэй. |
| Unsplash `photo-1507525428034-b723cf961d3e` | Халуун орны далайн эрэг. `/about/culture`-д байсан. | Солих хэрэгтэй. |
| Unsplash-ийн бусад ерөнхий байгалийн зургууд (`photo-1506744038136…`, `photo-1470071459604…` гэх мэт) | Монголынх эсэх нь тодорхойгүй ерөнхий stock зураг | Шалгаж, шаардлагатай бол солих. |
| `public/ulaanbaatar.png`, `hovd1.png` болон бусад аймгийн PNG | Хиймэл оюунаар (AI) үүсгэсэн бололтой. Жишээ нь хотын зурган дээр "Ulaanbaatar" гэсэн бичиг, утгагүй самбарууд байна. | Бодит газар мэт харуулахгүй. Бодит гэрэл зургаар солих. |
| Contentful `13-р зуун цогцолбор` (`songzanlin-monastery-above-tibetan-town-in-shangri…jpg`) | Хятадын Шангри-Ла дахь Төвд хийдийн зураг | Contentful дээр солих |
| Contentful-ын `ChatGPT_Image_…png` нэртэй 3 зураг | AI-аар үүсгэсэн | Бодит гэрэл зургаар солих |

## Нүүр хуудасны дүр зургууд (`public/home/`, 2026-10-07)

`components/HomeScrollHero.tsx`-ийн 6 дүр зураг. Бүгд WebP. Нийт 1.38 MB, үүнд эхний poster ч орсон. Эхнийхээс бусад нь тухайн дүр зураг ойртоход л ачаалагдана.

| # | Файл | Эх сурвалж | Байршил (Unsplash-ийн тэмдэглэгээ / шалгалт) |
|---|---|---|---|
| 1 | `public/hero-poster.webp` (+ `heroo.webm`, `heroo.mp4`) | Сайтын өөрийн `hero.jpg`, видео | Монгол (дээрх хүснэгтийн `herderBoy`) |
| 2 | `home/altai-eagle.webp` | Unsplash `photo-1742205025290-f8d83fe1bb58` | Монгол (дээрх `eagleHunter`, нүдээр шалгасан) |
| 3 | `home/gobi-camels.webp` | Unsplash `photo-1571821807771-62cf66ac3f14` | Монгол (дээрх `camels`) |
| 4 | `home/khuvsgul.webp` | Unsplash [eDcdGQRSVj8](https://unsplash.com/photos/a-body-of-water-with-trees-on-the-side-eDcdGQRSVj8), Sodo Sane, 2022-10-03 | "Khuvsgul Lake, Mongolia" |
| 5 | `home/ger-summer.webp` | Unsplash `photo-1575415868394-e3b78f3e9b3f` | Монгол (дээрх `gerCamp`) |
| 6 | `home/ger-winter.webp` | Unsplash [MusNPAkRimQ](https://unsplash.com/photos/a-yurt-covered-in-snow-on-a-snowy-day-MusNPAkRimQ), Ash Hayes, 2022-02-16 | "Mongolia" |

Ашиглаагүй зургууд:
- `lakeGers` (`photo-1591804860948`): ард нь элсэн манхантай нуур тул Хөвсгөл биш.
- Contentful-ын "Хөвсгөл нуур" нүүр зураг: нэр нь "winter-river-cutting-through-a-forest-landscape". Байршил нь баталгаагүй stock зураг.
- `herdSnow`: цастай уул, ногоон бэлчээр, гэргүй тул "өвлийн гэр"-т тохирохгүй.

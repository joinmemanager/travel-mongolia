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

## Хэсгийн хуудсуудаас Монголын бус зургийг цэвэрлэсэн (2026-10-13)

`feat/section-layout`: Монголыг нээ, Түүх & өв цэсний 11 хэсэгт ашиглагдсан 57 Unsplash зургийг нүдээр шалгаж,
Монголынх биш нь тодорхой 35 зураг (Таж Махал, Бали, Фүжи, Эверест, Yosemite, Eltz шилтгээн, арслан, бар, dim sum г.м.)
болон устсан 4 зургийг 197 газраас сольсон эсвэл түр хассан. Дэлгэрэнгүй жагсаалт:
[docs/section-layout/images.md](../section-layout/images.md).

## Үлдсэн Монголын бус зургийг цэвэрлэсэн (2026-10-15)

`feat/tic-phase1`: дээрх болон [section-layout/images.md](../section-layout/images.md)-д бүртгэгдсэн Монголын бус 11 зураг хэсгийн хуудсуудаас гадуур **69 газар** үлдсэн байсныг цэвэрлэв: **44** газрыг картын сэдэвт төрлөөрөө тохирох шалгагдсан зургаар (`photoSrc()`, `lib/images.ts`) сольж, **25** газарт тохирох зураг байхгүй тул зургийг хасав (карт бараан/саарал дэвсгэртэй).

Contentful: Шангри-Ла хийдийн asset (`59VlPhvyHRGOKuI6RIW5oz`) `lib/images.ts` → `NON_MONGOLIAN_ASSETS`-д орж, `lib/contentful.ts` бүх хариунаас хасна (13-р зуун цогцолбор, аймгийн/үндэсний наадмын entry зураггүй харагдана). AI-аар үүсгэсэн 4 asset (`AI_GENERATED_ASSETS`) аймгийн hero-д хэрэглэгдэхгүй, бусад газарт бодит зургаар солих хүртэл үлдэнэ.

| Файл | Карт, блок | Өмнөх зураг | Шинэ зураг |
|---|---|---|---|
| `app/destination/landscapes/page.tsx` | Мөнххайрхан уул | Бали, Улун Дану сүм | Цасан уулын бэлийн цагаан морь (`whiteHorse`) |
| `app/destination/landscapes/page.tsx` | Хөвсгөл нуур | халуун орны далайн эрэг | Нуурын эргийн гэрүүд (`lakeGers`) |
| `app/destination/landscapes/page.tsx` | Увс нуур | АНУ-ын Yosemite | — (хассан: эгнээнд ижил зураг давхардахгүй) |
| `app/destination/landscapes/page.tsx` | Тэрхийн цагаан нуур | Германы Eltz шилтгээн | — (хассан: эгнээнд ижил зураг давхардахгүй) |
| `app/destination/landscapes/page.tsx` | Орхон гол | зураг устсан (404) | — (хассан) |
| `app/destination/landscapes/page.tsx` | Хэрлэн гол | АНУ-ын Yosemite | — (хассан) |
| `app/destination/landscapes/page.tsx` | Баянзаг (Улаан хэрэм) | Германы Eltz шилтгээн | Говийн улаан хад (`redCliffs`) |
| `app/destination/landscapes/page.tsx` | Хэрмэн цав | АНУ-ын Arches, VW автобус | — (хассан: эгнээнд ижил зураг давхардахгүй) |
| `app/destination/landscapes/page.tsx` | Элсэн тасархай | АНУ-ын Arches, VW автобус | Тэмээ, элсэн манхан (`camels`) |
| `app/destination/landscapes/page.tsx` | Бөөрөг дэлийн элс | Германы Eltz шилтгээн | — (хассан: эгнээнд ижил зураг давхардахгүй) |
| `app/destination/landscapes/page.tsx` | Чулуутын голын хавцал | зураг устсан (404) | — (хассан) |
| `app/destination/landscapes/page.tsx` | Батхааны хушин ой | АНУ-ын Yosemite | — (хассан) |
| `app/destination/landscapes/page.tsx` | Мэнэнгийн тал | АНУ-ын Yosemite | Морьтой хүү, тал (`herderBoy`) |
| `app/destination/landscapes/page.tsx` | Дарьгангын тэгш өндөрлөг | АНУ-ын Arches, VW автобус | — (хассан) |
| `app/destination/landscapes/page.tsx` | Потанины мөсөн гол | Бали, Улун Дану сүм | — (хассан) |
| `app/destination/landscapes/page.tsx` | Шаргалжуутын халуун рашаан | халуун орны далайн эрэг | — (хассан) |
| `app/destination/landscapes/page.tsx` | Цэнхэрийн халуун рашаан | зураг устсан (404) | — (хассан) |
| `app/destination/landscapes/page.tsx` | Цагаан суварга | барууны хурим | — (хассан) |
| `app/destination/landscapes/page.tsx` | Даян дээрхийн агуй | Германы Eltz шилтгээн | — (хассан) |
| `app/destination/landscapes/page.tsx` | Хоргын галт уулын тогоо | АНУ-ын Yosemite | — (хассан) |
| `app/destination/landscapes/page.tsx` | hero | АНУ-ын Yosemite | Цасан уулын бэлийн цагаан морь (`whiteHorse`) |
| `app/destination/protected/page.tsx` | Хөвсгөл нуур | халуун орны далайн эрэг | Нуурын эргийн гэрүүд (`lakeGers`) |
| `app/destination/protected/page.tsx` | Горхи-Тэрэлж | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `app/destination/protected/page.tsx` | Хустайн нуруу | Бали, Улун Дану сүм | — (хассан) |
| `app/destination/protected/page.tsx` | Их нартын чулуу | Германы Eltz шилтгээн | — (хассан) |
| `app/destination/protected/page.tsx` | Гүн галуут | барууны хурим | — (хассан) |
| `app/destination/protected/page.tsx` | Улаан цутгалан хүрхрээ | зураг устсан (404) | — (хассан) |
| `app/destination/protected/page.tsx` | Хоргын тогоо | АНУ-ын Yosemite | — (хассан) |
| `app/destination/national-parks/page.tsx` | hero | АНУ-ын Yosemite | Цасан уулын бэлийн цагаан морь (`whiteHorse`) |
| `app/destination/national-parks/page.tsx` | Тэрэлж | Бали, Улун Дану сүм | Уулын бэлийн гэрүүд (`gerCamp`) |
| `app/destination/national-parks/page.tsx` | Хөвсгөл нуур | АНУ-ын Yosemite | Нуурын эргийн гэрүүд (`lakeGers`) |
| `app/destination/map/page.tsx` | Говь Мираж жуулчны бааз | Германы Eltz шилтгээн | Тэмээ, элсэн манхан (`camels`) |
| `app/destination/map/page.tsx` | Хөвсгөл нуур (Хатгал) | халуун орны далайн эрэг | Нуурын эргийн гэрүүд (`lakeGers`) |
| `app/destination/map/page.tsx` | Эрдэнэ зуу хийд | зураг устсан (404) | — (хассан) |
| `app/destination/map/page.tsx` | Улаан цутгалан хүрхрээ | зураг устсан (404) | — (хассан) |
| `app/destination/map/page.tsx` | Цонжин болдог | Бали, Улун Дану сүм | Цонжин болдог (`chinggisStatue`) |
| `app/destination/map/page.tsx` | Тайхар чулуу | АНУ-ын Yosemite | — (хассан) |
| `components/RegionDirectory.tsx` | Бүгд (бүс) | Бали, Улун Дану сүм | Морьтой хүү, тал (`herderBoy`) |
| `components/RegionDirectory.tsx` | Улаанбаатар (бүс) | АНУ-ын Yosemite | — (хассан) |
| `components/RegionDirectory.tsx` | Хойд Монгол (бүс) | зураг устсан (404) | Нуурын эргийн гэрүүд (`lakeGers`) |
| `components/RegionDirectory.tsx` | Хөвсгөл нуур | Бали, Улун Дану сүм | Нуурын эргийн гэрүүд (`lakeGers`) |
| `components/RegionDirectory.tsx` | Горхи-Тэрэлж | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `components/RegionDirectory.tsx` | Эрдэнэ зуу | Азийн усан завь | — (хассан) |
| `components/RegionDirectory.tsx` | Буйр нуур | халуун орны далайн эрэг | Нуурын эргийн гэрүүд (`lakeGers`) |
| `components/RegionMap.tsx` | Хөвсгөл | Непал, Эверестийн суварга | Нуурын эргийн гэрүүд (`lakeGers`) |
| `components/RegionMap.tsx` | Баянхонгор | Энэтхэг, Таж Махал | Тэмээ, элсэн манхан (`camels`) |
| `components/RegionMap.tsx` | Өмнөговь | Энэтхэг, Таж Махал | Говийн улаан хад (`redCliffs`) |
| `components/RegionMap.tsx` | Хэнтий | Непал, Эверестийн суварга | Морьтой хүү, тал (`herderBoy`) |
| `lib/routesData.ts` | Хархорумын маршрут | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `lib/routesData.ts` | Хангайн ойн маршрут | халуун орны далайн эрэг | Цасан уулын бэлийн цагаан морь (`whiteHorse`) |
| `lib/routesData.ts` | Чингисийн өлгий нутгийн маршрут | Бали, Улун Дану сүм | Цонжин болдог (`chinggisStatue`) |
| `app/inspiration/itineraries/page.tsx` | Нүүдэлчдийн хоол & Цагаан идээ | Непал, Эверестийн суварга | Цастай уулын бэлийн сүрэг (`herdSnow`) |
| `app/inspiration/magazine/page.tsx` | Ааруул, өрөм, айраг | Непал, Эверестийн суварга | Уулын бэлийн гэрүүд (`gerCamp`) |
| `app/inspiration/stories/page.tsx` | Адуу хураах үүр | Непал, Эверестийн суварга | Цасан уулын бэлийн цагаан морь (`whiteHorse`) |
| `app/page.tsx` | Богино видео | АНУ-ын Yosemite | Од, гэр (`gerStars`) |
| `app/page.tsx` | Тайлбар видео | АНУ-ын Arches, VW автобус | Тэмээ, элсэн манхан (`camels`) |
| `app/page.tsx` | Фото түүх | Бали, Улун Дану сүм | Бүргэдчин (`eagleHunter`) |
| `app/destination/[id]/page.tsx` | fallback | АНУ-ын Yosemite | Цасан уулын бэлийн цагаан морь (`whiteHorse`) |
| `app/destination/heritage/[category]/page.tsx` | fallback | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `app/destination/heritage/[category]/page.tsx` | fallback | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `app/destination/heritage/page.tsx` | fallback | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `app/destination/heritage/page.tsx` | fallback | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `app/destination/heritage/place/[id]/page.tsx` | fallback | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `app/destination/heritage/place/[id]/page.tsx` | fallback | АНУ-ын Yosemite | Уулын бэлийн гэрүүд (`gerCamp`) |
| `components/CultureFestivals.tsx` | fallback | АНУ-ын Yosemite | Морьтой хүү, тал (`herderBoy`) |
| `components/CultureFestivals.tsx` | fallback | АНУ-ын Yosemite | Морьтой хүү, тал (`herderBoy`) |
| `components/SeasonRecommendations.tsx` | fallback | АНУ-ын Yosemite | Нуурын эргийн гэрүүд (`lakeGers`) |
| `components/TopDestinations.tsx` | fallback | АНУ-ын Yosemite | Цасан уулын бэлийн цагаан морь (`whiteHorse`) |
| `components/RoutesExplorer.tsx` | hero | АНУ-ын Arches, VW автобус | Уулын бэлийн гэрүүд (`gerCamp`) |

Бүртгэгдээгүй, Монголынх эсэх нь тодорхойгүй ерөнхий Unsplash зургууд (ой, уул, нар жаргах г.м., жишээ нь `1509316975850`, `1464822759023`, `1519681393784`) болон `public/*.png` AI зургууд хэвээр. Тэдгээрийг дараагийн шатанд шалгана.

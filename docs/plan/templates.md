# Хуудасны загварын (template) судалгаа

> Огноо: 2026-10-05. Эх сурвалж: `travel-mongolia/app/**/page.tsx` (55 хуудас), `docs/TravelHubMongolia_2.0.md`-ийн 7-р хэсэг.
> Код өөрчлөөгүй. Энэ бол нэгтгэх ажлын санал.

## Тойм

- **55 хуудас** одоогоор **20 өөр загвар (layout)** ашиглаж байна.
- Ижил төрлийн хуудсууд ихэвчлэн нэг компонент ашиглаагүй, файлаар хуулагдсан. Жишээ нь `things-to-do`-ийн 7 хуудас бие биенийхээ 86–89% ижил хуулбар. Үүнээс болж нэг өөрчлөлтийг хэдэн файлд давтан хийх шаардлагатай болдог. "Дэлгэрэнгүй" товчийг засахад 12 загварт засвар хийсэн нь үүний жишээ.
- Нүүр хэсгийн (hero) өндөр 10 гаруй янз байна: 90vh, 72vh, 65vh (гурван өөр `min-h`-тай), 45vh, 40vh, `py-24` бараан блок, `pt-10/12/16` текст толгой.
- **Ашиглагдаагүй 5 компонент** байна: `AboutShowcase`, `DestinationShowcase`, `InspirationShowcase`, `PlanShowcase`, `ProtectedShowcase`. Нийт 2,632 мөр. Аль ч хуудас тэдгээрийг import хийдэггүй.
- Баримт бичгийн 7 template-аас **Tour Product** болон **Provider**-т тохирох хуудас одоогоор байхгүй. Захиалга joinme.mn дээр хийгддэг, `/local/*` хуудсууд төлөвлөгдсөн байгаа.

## 1. Одоогийн 20 загвар

| # | Загвар | Хуудсууд | Гол бүтэц | Хэрэгжилт |
|---|---|---|---|---|
| 1 | Нүүр хуудас | `/` | 90vh видео hero, слайдер, бүсийн газрын зураг, улирал, наадам | Олон компонент |
| 2 | About урт нийтлэл | `/about/at-a-glance`, `culture`, `food`, `modern`, `nature`, `nomadic-life`, `people`, `traditions` (8) | 65vh зурагтай hero → наалддаг хэсгийн цэс → хэсэг бүр (зураг + жишээ + "Дэлгэрэнгүй") | 8 файлд хуулагдсан (58–73% ижил) |
| 3 | About он цагийн хэлхээс | `/about/history` | 65vh hero → наалддаг цэс → он цагийн хэлхээс, бараан CTA | Тусдаа (culture-тай 21% ижил) |
| 4 | Үзэх, хийх зүйлсийн ангилал | `/things-to-do/adventure`, `culture`, `events`, `food`, `nature`, `nomadic`, `wellness`, `wildlife` (8) | Бараан `py-24` hero → шүүлтүүр chip → картын тор (`lib/*Data.ts`) | 7 файлд хуулагдсан (86–89%, nature нь 65%) |
| 5 | Experience showcase | `/things-to-do/festivals` | `ExperienceShowcase` компонент (`groupKey`) | Ганц хуудас ашигладаг |
| 6 | Аялах сэдлийн нийтлэлийн жагсаалт | `/inspiration/hidden`, `stories`, `top-lists`, `styles`, `itineraries`, `seasons` (6) | `pt-10` текст толгой → карт/жагсаалт | 6 файлд хуулагдсан (63–71%) |
| 7 | Сэтгүүл | `/inspiration/magazine` | `pt-12` толгой → наалддаг цэс → хэсгүүд | Тусдаа |
| 8 | Төлөвлөлтийн гарын авлага | `/plan/accommodation`, `before-you-travel`, `getting-around`, `getting-to-mongolia`, `safety-info`, `services` (6) | `pt-16` толгой → зүүн талд наалддаг жагсаалт (`aside`) → хэсгийн картууд | Бүрхүүл нь 6 файлд хуулагдсан (35–47%, агуулга өөр) |
| 9 | Газрын ангиллын лавлах (45vh) | `/destination/landscapes`, `protected`, `routes` (3) | 45vh hero → наалддаг цэс → хэсэг бүр газрын карттай | 3 файл (59%) |
| 10 | Газрын ангиллын хуудас (65vh) | `/destination/national-parks`, `strictly-protected`, `natural-monuments`, `nature-reserves` (4) | 65vh hero → (цэс) → жагсаалт, CTA | 4 файл (52–61%) |
| 11 | Бүсийн лавлах | `/destination/region` | `RegionDirectory` 50vh hero + хайлт → бүс → шүүлтүүр + тор → аймгууд | Компонент |
| 12 | Түүхэн өвийн hub ба ангилал | `/destination/heritage`, `/destination/heritage/[category]` | `HeritagePageClient` (наалддаг цэс + мөр бүрт карт) / 40vh hero + тор | 2 өөр хэрэгжилт |
| 13 | Газрын дэлгэрэнгүй A | `/destination/[id]` | 65vh hero (min 480px) → rich text | Contentful `destination` |
| 14 | Газрын дэлгэрэнгүй B | `/destination/heritage/place/[id]` | 40vh hero → текст + баруун талд газрын зураг, цаг агаар, JSON-LD | Contentful `heritagePlace` |
| 15 | Аймгийн дэлгэрэнгүй | `/province/[id]` | 72vh hero → наалддаг цэс → тойм, үзүүлэлт, газрууд, зөвлөгөө | Contentful `province` |
| 16 | Зөвлөмжийн дэлгэрэнгүй | `/recommendation/[id]` | 65vh hero (min 460px) → текст | Contentful `recommendation` |
| 17 | Гарын авлага (шинэ) | `/respect`, `/respect/etiquette`, `/respect/nature`, `/respect/accessible` (4) | `GuidePage`: текст толгой → зүүн талд жагсаалт → хэсгийн картууд → холбогдох хуудсууд | Нэг компонент |
| 18 | Hub (шинэ) | `/stories`, `/stories/photo-video`, `/impact` (3) | `HubHeader` (текст толгой) → хэсгүүд, картууд | Нэг толгой компонент |
| 19 | Газрын зураг | `/destination/map` | Дэлгэц дүүрэн газрын зураг + хажуугийн самбар | Тусгай |
| 20 | Аялал төлөвлөгч | `/planner` | Интерактив хэрэгсэл | Тусгай |

## 2. Хуудас бүрийн template ангилал

Баримт бичгийн 7-р хэсгийн template-ууд дээр **Hub** (олон зүйлийг жагсааж, цааш чиглүүлдэг хуудас), **Тусгай хуудас** (интерактив хэрэгсэл) гэсэн хоёр ангилал нэмсэн.

| Template | Хуудсууд | Одоогийн загвар (# дээрх хүснэгтээс) |
|---|---|---|
| **Destination / Place** | `/destination/[id]`, `/destination/heritage/place/[id]`, `/province/[id]` | 13, 14, 15: **3 өөр загвар** |
| **Experience** | `/things-to-do/adventure`, `culture`, `food`, `nature`, `nomadic`, `wellness`, `wildlife` | 4 |
| **Event** | `/things-to-do/events`, `/things-to-do/festivals`, `/recommendation/[id]` (одоогийн 4 entry бүгд наадам) | 4, 5, 16: **3 өөр загвар** |
| **Route / Itinerary** | `/destination/routes`, `/inspiration/itineraries` | 9, 6: **2 өөр загвар** |
| **Tour Product** | — (захиалга joinme.mn дээр) | — |
| **Provider** | — (`/local/*` planned). `/plan/accommodation`, `/plan/services` нь үйлчилгээ үзүүлэгчдийн жагсаалт, ирээдүйд Provider профайл руу холбогдоно | 8 |
| **Article / Story** | `/about/*` (9); `/inspiration/hidden`, `stories`, `top-lists`, `styles`, `seasons`; `/plan/before-you-travel`, `getting-around`, `getting-to-mongolia`, `safety-info`; `/respect/etiquette`, `nature`, `accessible` | 2, 3, 6, 8, 17: **5 өөр загвар** |
| **Hub** | `/stories`, `/stories/photo-video`, `/respect`, `/impact`, `/inspiration/magazine`, `/destination/region`, `/destination/heritage`, `/destination/heritage/[category]`, `/destination/landscapes`, `/destination/protected`, `/destination/national-parks`, `/destination/strictly-protected`, `/destination/natural-monuments`, `/destination/nature-reserves`, `/plan/accommodation`, `/plan/services` | 7, 9, 10, 11, 12, 17, 18, 8: **8 өөр загвар** |
| **Тусгай хуудас** | `/`, `/destination/map`, `/planner` | 1, 19, 20 |

## 3. Ижил төрлийн хуудсууд өөр загвартай газрууд

1. **Газрын дэлгэрэнгүй (Place): 3 загвар.** `/destination/[id]`, `/destination/heritage/place/[id]`, `/province/[id]` гурав бүгд Contentful-ын нэг газрыг харуулдаг. Гэтэл hero-ийн өндөр (65vh, 40vh, 72vh), бүтэц, боломжууд нь өөр өөр. Газрын зураг, цаг агаар, JSON-LD зөвхөн түүхэн өвийн хуудсанд байна.
2. **Event: 3 загвар.** `events` нь things-to-do-ийн хуулбар, `festivals` нь `ExperienceShowcase` ашигладаг, `/recommendation/[id]` нь тусдаа хуудас. Наадмын мэдээлэл гурван өөр газар, гурван өөр харагдах байдалтай байна.
3. **Experience: 1 загварыг 7 файлд хуулсан.** Мөн яг ижил үүрэгтэй `ExperienceShowcase` компонент байгаа ч зөвхөн `festivals` ашигладаг.
4. **Article / Story: 5 загвар.** About хуудсууд, inspiration хуудсууд, plan гарын авлагууд, respect гарын авлагууд бүгд "гарчиг → хэсгүүд" бүтэцтэй боловч 4 өөр бүрхүүл ашигладаг. `/plan/*`-ийн толгой ба `aside` бүрхүүл нь шинэ `GuidePage`-тэй бараг ижил.
5. **Route / Itinerary: 2 загвар.** `/destination/routes` (газрын зурагтай маршрут) ба `/inspiration/itineraries` (өдөр өдрөөр) нь нэг сэдэв боловч холбоогүй.
6. **Газрын ангиллын хуудсууд: 2 загвар.** `/destination/protected`-ийн 4 дэд ангиллын хуудас (`national-parks` гэх мэт) 65vh hero-той, харин эх `protected` болон `landscapes` 45vh-тэй. Нэг цэсний дор байгаа хуудсууд өөр харагддаг.
7. **Нүүр хэсэг (hero): 10 гаруй хувилбар.** Нэг төрлийн хуудсуудад ч өндөр нь зөрдөг.

## 4. Нэгтгэх санал

Баримт бичгийн 7-р хэсгийн ESG block-уудыг (ia-plan.md 8-р үе) template бүрт **нэг удаа** нэмэхийн тулд эхлээд загваруудыг нэгтгэх нь зүйтэй. Одоогийн байдлаар бол блок бүрийг 7–9 файлд давтан хийх болно. Давуу эрэмбээр:

| Эрэмбэ | Санал | Нэгтгэх загвар | Үр ашиг | Эрсдэл |
|---|---|---|---|---|
| 1 | **PlaceTemplate**: газрын дэлгэрэнгүй 3 хуудсыг нэг загварт оруулах. `/destination/heritage/place/[id]`-ийн бүтцийг (газрын зураг, цаг агаар, JSON-LD) суурь болгоно. 7-р хэсгийн Destination/Place block-ууд энд ордог: гол түүх, хэрхэн зөв аялах, холбоотой туршлага. | 13, 14, 15 → 1 | Contentful-аас ирдэг тул шинэ газар нэмэхэд бүгд ижил харагдана. SEO (JSON-LD) бүгдэд хүрнэ. | Бага. Өгөгдөл Contentful-д байгаа. |
| 2 | **ExperienceCategoryTemplate**: things-to-do-ийн 8 хуудсыг нэг компонент + `lib/*Data.ts` өгөгдөлд шилжүүлэх. `ExperienceShowcase` аль хэдийн `groupKey`-ээр параметртэй тул түүнийг суурь болгож, хуулбаруудыг устгана. | 4, 5 → 1 | 7 хуулбар арилна. 6-р үеийн Contentful-ын Community Experience төрөлд бэлэн болно. | Дунд. `nature` хуудас бусдаасаа ялгаатай (65%). |
| 3 | **GuidePage-ийг `/plan/*` хуудсуудад хэрэглэх**: 6 хуудасны толгой болон `aside` бүрхүүлийг `GuidePage`/`HubHeader`-ээр солих. Хэсгүүдийн агуулга хэвээр үлдэнэ (`children`). | 8, 17 → 1 | Ижил бүрхүүлийн 6 хуулбар арилна. Өнгө, breadcrumb, SEO автоматаар нэгдэнэ. | Бага. |
| 4 | **ArticleTemplate**: about (8) болон inspiration (5) хуудсуудыг хэсгийн өгөгдлөөр (`sections[]`, аль хэдийн `moreHref`-тэй) зурдаг нэг загварт оруулах. Он цагийн хэлхээсийг (`/about/history`) хэсгийн нэг төрөл болгоно. Энэ нь 6-р үеийн Story төрөлтэй давхцана. | 2, 3, 6 → 1 | 14 файл нэгдэнэ. Контентыг Contentful руу шилжүүлэхэд хялбар болно. | Дунд. Хэсэг бүрийн хэлбэр харилцан адилгүй. |
| 5 | **EventTemplate**: `/things-to-do/events`, `festivals`, `/recommendation/[id]` гурвыг нэг event жагсаалт + нэг event дэлгэрэнгүй загвар болгох. 7-р хэсгийн Event block-ууд (огноо, зохион байгуулагч, зөв оролцох зөвлөмж) энд ордог. | 4 (events), 5, 16 → 2 | Наадмын мэдээлэл нэг газарт төвлөрнө. | Дунд. `recommendation` төрлийг event гэж үзэх эсэхийг шийднэ. |
| 6 | **CategoryDirectoryTemplate**: `/destination/landscapes`, `protected` болон 4 дэд ангиллын хуудсыг нэг загварт оруулах. | 9, 10 → 1 | Нэг цэсний хуудсууд ижил харагдана. | Бага. |
| 7 | **Hero-г 3 хувилбарт оруулах**: нүүр хуудасны hero, зурагтай толгой, текст толгой (`HubHeader`). Зурагтай хувилбарыг `HubHeader`-т нэмэх шаардлагатай. Бусад бүх hero-г эдгээрээр солино. | 10+ → 3 | Хуудас хооронд шилжихэд нэгэн хэв маягтай харагдана. | Бага. Зургийн хэмжээ өөрчлөгдөнө. |
| 8 | **Ашиглагдаагүй 5 компонентыг устгах** (2,632 мөр). | — | Код цэвэрлэгээ. | Маш бага. Эзэмшигч баталсны дараа. |

Санал болгох дараалал: **8 → 3 → 1 → 2 → 6 → 7 → 4 → 5**. Эхэнд нь хурдан, эрсдэл багатай ажлууд, араас нь их хэмжээний нэгтгэл орно. 4 болон 5 нь 6-р үеийн Contentful төрлүүдтэй (Story, Community Experience) хамт хийхэд хамгийн тохиромжтой.

## 5. Шинэ зураглал (feat/templates, 2026-10-06)

Эзэмшигчийн баталсан бүлэглэл. Загвар бүр нэг компонентоор хэрэгжсэн тул өөрчлөлтийг нэг газар хийнэ.

| Бүлэг | Хуудсууд | Компонент | Батлагдсан элементүүд (design-brief.md) |
|---|---|---|---|
| **Hub** | `/stories`, `/stories/photo-video`, `/impact`, `/respect`, `/destination/region` (`/local` төлөвлөгдсөн, хуудас байхгүй) | `HubHeader` (текст толгой); `/respect` нь `GuidePage`; `/destination/region` нь `RegionDirectory` + `ImageHero` | Зурагтай картууд → нэг бараан ногоон самбар → доор холбоосны карт |
| **Гарын авлага / нийтлэл** | `/plan/*` (6), `/respect/*` (3), `/about/*` (9) | `GuidePage` (`/plan/*`, `/respect/*`); `/about/*` нь `ImageHero` + `AboutRelated` | Доод хэсэгт "Холбогдох хуудсууд" холбоосны карт |
| **Ангиллын жагсаалт** | `/things-to-do/*` (8), газрын ангиллын хуудсууд (7 + `/destination/heritage/[category]`), `/inspiration/*` (7) | `CategoryListing`, `CategoryDirectory` + `DirectoryGroupSection`, `InspirationListing` | Зурагтай картуудын тор (`ImageCard`) |
| **Газрын дэлгэрэнгүй** | `/destination/[id]`, `/destination/heritage/place/[id]`, `/province/[id]` | `PlaceTemplate` | "Ойролцоох газрууд" зурагтай картууд + холбоосны карт |
| **Арга хэмжээ, Профайл/туршлага** | `/things-to-do/festivals`, `/recommendation/[id]`, `/local/*` | Өөрчлөөгүй | Б хэсэгт Contentful-ын төрлүүдтэй хамт хийнэ |
| **Тусгай (өөрчлөхгүй)** | `/`, `/destination/map`, `/planner` | Өөрчлөөгүй | — |

Компонентууд `travel-mongolia/components/templates/` дотор: `ImageHero`, `CategoryListing`, `CategoryDirectory`, `InspirationListing`, `PlaceTemplate`, `AboutRelated`. Элементүүд `components/design/` дотор хэвээр.

### Hero-ийн 3 хувилбар

1. **Нүүр хуудасны hero**: `app/page.tsx`, өөрчлөөгүй.
2. **Зурагтай толгой** (`ImageHero`, 55vh, min 420px): about, things-to-do, газрын ангилал, routes, region, heritage, газрын дэлгэрэнгүй.
3. **Текст толгой** (`HubHeader`): hub, гарын авлага, inspiration.

Үлдсэн 2 өөр hero: `/things-to-do/festivals` (`ExperienceShowcase`) ба `/recommendation/[id]`. Хоёулаа "Арга хэмжээ" бүлэгт орж, Б хэсэгт шийдэгдэнэ.

### 4-р хэсгийн саналуудын төлөв

| Санал | Төлөв |
|---|---|
| 8. Ашиглагдаагүй 5 компонент устгах | Хийсэн. Мөн ашиглагдахаа больсон `HeritagePlaceCard`-ыг устгасан |
| 3. `/plan/*`-д `GuidePage` | Хийсэн. Өмнөх/дараах холбоосууд "Холбогдох хуудсууд" карт руу шилжсэн |
| 1. PlaceTemplate | Хийсэн |
| 2. Things-to-do нэг загвар | 8 хуудас хийсэн. `festivals` нь Event тул Б хэсэгт үлдсэн |
| 6. Газрын ангиллын нэг загвар | Хийсэн. Мөн `/destination/heritage`. `routes` нь газрын зурагтай тул зөвхөн hero-г нэгтгэсэн |
| 7. Hero 3 хувилбар | Хийсэн (дээрх 2 Event хуудаснаас бусад) |
| 4. ArticleTemplate (about-ийн биеийг нэгтгэх) | Хийгээгүй. Hero болон доод холбоосыг нэгтгэсэн, хэсгүүдийн бие нь хуудас бүрт хэвээр. Б хэсэгт Story төрөлтэй хамт хийнэ |
| 5. EventTemplate | Хийгээгүй (Б хэсэг) |

### Санаатайгаар хийгээгүй зүйлс

- **Бараан ногоон самбар** зөвхөн `/respect` (амлалт) болон `/impact` (хандивлагчид) дээр байна. `/stories`, `/destination/region`-д тохирох гол мессежийн текст байхгүй тул шинэ текст зохиоогүй.
- **`/impact`-д зурагтай карт байхгүй.** Үр өгөөжийн бодит зураг, төсөл одоогоор алга. Зохиомол зураг тавиагүй.
- **"Ойролцоох газрууд"** зөвхөн координатаар эрэмбэлэх боломжтой үед гарна. Түүхэн өвийн газар бүр координаттай. Аймагт тухайн аймгийн нэр `region` талбарт орсон түүхэн өвийн газрууд гарна. Одоогийн 2 аймагт таарах газар байхгүй тул хэсэг харагдахгүй. `destination` төрлийн 5 газраас 1 нь л координаттай тул тэнд "Бусад газрууд" гэж гаргасан.

### Загварын тоо

| | Өмнө | Одоо |
|---|---|---|
| Хуудасны загвар (layout) | 20 | 18 (Б хэсгийн 2 Event хуудсыг оролцуулаад) |
| Hero-ийн хувилбар | 10 гаруй | 3 (+ Б хэсгийн 2 Event хуудас) |

Одоогийн 18 (эхний 16 нь энэ ажлын дараах, сүүлийн 2 нь Б хэсэгт нэгтгэгдэх Event):
1. Нүүр
2. Газрын зураг
3. Төлөвлөгч
4. `GuidePage`
5. `HubHeader` hub
6. `CategoryListing`
7. `InspirationListing`
8. `CategoryDirectory`
9. `PlaceTemplate`
10. About нийтлэл
11. About он цагийн хэлхээс
12. Heritage ангилал
13. `RegionDirectory`
14. Routes газрын зураг
15. Улирал (`/inspiration/seasons`)
16. Сэтгүүл (`/inspiration/magazine`)
17. Event жагсаалт (`/things-to-do/festivals`, `ExperienceShowcase`)
18. Event дэлгэрэнгүй (`/recommendation/[id]`)

# Хэсгийн хуудсуудын нэгдсэн загвар (SectionLayout): төлөвлөгөө

> Огноо: 2026-10-12. Төлөв: **эзэмшигч баталсан (2026-10-12)**, шийдвэрүүд 8-р хэсэгт. Пилот: «Монголын тухай».
> Хамрах хүрээ: «Монголыг нээ»-гийн 4 хэсэг, «Түүх & өв»-ийн 7 хэсэг. Зорих газрууд, Газрын зураг,
> Нутгийн Монгол, Хүндэтгэлтэй аялал, Үр өгөөж & түншлэлийг хөндөхгүй.

## 1. Зорилго (товч)

Мега цэсний баганын гарчиг эсвэл «Бүгдийг үзэх →» дээр дарахад нээгдэх хэсгийн хуудас:

```
┌──────────────────────────────────────────────────────────┐
│  HERO (бүтэн өргөн зураг · жижиг дээд бичиг · гарчиг ·   │  ← layout, байрандаа үлдэнэ
│        товч тайлбар). Доор нь товчнуудын мөр БАЙХГҮЙ.   │
├───────────────┬──────────────────────────────────────────┤
│ СЭДВИЙН       │ Breadcrumb                               │
│ ЖАГСААЛТ      │ H1 (зөвхөн дэд хуудсанд)                 │  ← сонгосон дэд сэдвийн
│ ▌Тойм         │ …одоогийн картууд, жагсаалтууд…          │    агуулга (page.tsx)
│  Дэд сэдэв 2  │                                          │
│  Дэд сэдэв 3  │                                          │
└───────────────┴──────────────────────────────────────────┘
Утсан дээр: жагсаалт → hero-гийн доор, дээд цэсний доор наалддаг хэвтээ гүйдэг товчнууд.
```

Жагсаалтын карт нь `components/GuidePage.tsx`-ийн «Сэдвийн жагсаалт»-тай ижил харагдана: цагаан карт,
`rounded-2xl border-neutral-200/80 shadow-sm`, идэвхтэй мөр `bg-[#15803d]/10 text-[#15803d]`.

## 2. Хэсэг бүрийн хүснэгт

Template-ийн товчлол: **IH** = `ImageHero` + наалддаг anchor товчны мөр + `AboutRelated`;
**CL** = `CategoryListing` (ImageHero + наалддаг `?cat=` шүүлтүүр + карт); **IL** = `InspirationListing`
(HubHeader + `?cat=` шүүлтүүр + masonry); **HUB** = `HubHeader` + өөрийн JSX; **GP** = `GuidePage`
(HubHeader + дотоод TOC). Бүх хаяг одоо **тусдаа хуудас** (цэсэнд `?cat=` эсвэл гадаад холбоос байхгүй).

### Монголыг нээ

| Хэсэг | Үндсэн URL | Жагсаалтын мөр | URL | Template | Контентын эх |
|---|---|---|---|---|---|
| **Монголын тухай** | `/about/at-a-glance` | Тойм (= Монгол орныг товчхон) | `/about/at-a-glance` | IH | код |
| | | Монголын түүх | `/about/history` | IH | код |
| | | Өнөөгийн Монгол | `/about/modern` | IH | код |
| **Үзэх, хийх зүйлс** | одоо `/things-to-do/nature` → санал: **`/things-to-do` (шинэ)** | Тойм (шинэ) | `/things-to-do` | — (байхгүй) | код (шинэ) |
| | | Байгальд аялах | `/things-to-do/nature` | CL | код (`natureData.ts`) |
| | | Адал явдалт аялал | `/things-to-do/adventure` | CL | код |
| | | Түүх, соёлын аялал | `/things-to-do/culture` | CL | код |
| | | Хоол, ундааны туршлага | `/things-to-do/food` | CL | код |
| | | Нүүдэлчин ахуйг мэдрэх | `/things-to-do/nomadic` | CL | код |
| | | Амралт, рашаан сувилал | `/things-to-do/wellness` | CL | код |
| | | Зэрлэг амьтан, шувуу ажиглах | `/things-to-do/wildlife` | CL | код |
| | | Аяллын хэв маягаар | `/inspiration/styles` | IL | код |
| **Түүхүүд** | `/stories` | Тойм (= одоогийн hub) | `/stories` | HUB | Contentful `story` + код |
| | | Нууц үзэсгэлэнт газрууд | `/inspiration/hidden` | IL | код |
| | | Шилдэг жагсаалтууд | `/inspiration/top-lists` | IL | код |
| **Арга хэмжээ, баяр наадам** | `/things-to-do/events` | Тойм (= Баяр наадам, арга хэмжээ) | `/things-to-do/events` | CL | код (`eventsData.ts`) |
| | | Фестивалиуд | `/things-to-do/festivals` | CL (server) | Contentful `event` + `recommendation` |

### Түүх & өв

| Хэсэг | Үндсэн URL | Жагсаалтын мөр | URL | Template | Контентын эх |
|---|---|---|---|---|---|
| **Соёл, өв** | `/about/culture` | Тойм (= Соёл ба өв) | `/about/culture` | IH | код |
| | | Ёс заншил, уламжлал | `/about/traditions` | IH | код |
| **Байгаль** | `/about/nature` | Тойм | `/about/nature` | IH | код |
| **Нүүдэлчдийн амьдрал** | `/about/nomadic-life` | Тойм | `/about/nomadic-life` | IH | код |
| **Хоол** | `/about/food` | Тойм | `/about/food` | IH | код |
| **Хүмүүс** | `/about/people` | Тойм | `/about/people` | IH | код |
| **Фото/видео түүх** (soft) | `/stories/photo-video` | Тойм | `/stories/photo-video` | HUB | Contentful `story` |
| **Аялахаас өмнө** | `/plan/before-you-travel` | Тойм (= Аялахаас өмнө мэдэх зүйлс) | `/plan/before-you-travel` | GP | код |
| | | Хэзээ аялах вэ: улирлаар | `/inspiration/seasons` | HUB (`?season=`) | код |

**Нэг хуудастай 5 хэсэг** (Байгаль, Нүүдэлчдийн амьдрал, Хоол, Хүмүүс, Фото/видео): жагсаалтад зөвхөн «Тойм» л
гарна. Санал (3.2): идэвхтэй мөрийн доор тухайн хуудасны дотоод хэсгүүдийг (одоо hero-гийн доорх
anchor товчны мөрөнд байгаа `#id`-ууд) догол мөрөөр жагсаана. Ингэвэл хасагдах товчны мөрийн үүргийг
жагсаалт авна, нэг мөртэй хоосон карт гарахгүй.

## 3. `?cat=`, хаягийн өөрчлөлт

### 3.1 `?cat=` шүүлтүүр

Цэсний дэд зүйлсийн аль нь ч `?cat=` биш. `?cat=` (мөн `?season=`) нь зөвхөн **хуудас доторх шүүлтүүр**:

- `/things-to-do/{nature,food,nomadic,culture,events}?cat=…` — `/about/*` хуудсуудын «Дэлгэрэнгүй» товчнууд
  (≈25 холбоос) ингэж заадаг. `CategoryListing` уншдаг.
- `/inspiration/{styles,hidden,top-lists}?cat=…`, `/inspiration/seasons?season=…` — хуудсан дээрх шүүлтүүрийн товчнууд.

**Санал: хэвээр үлдээнэ.** Шүүлтүүр нь дэд сэдэв биш, тусдаа хуудас болгох агуулга (тайлбар, H1) алга.
`metaFor` → `pageMetadata` аль хэдийн `alternates.canonical`-ийг query-гүй цэвэр хаягаар өгдөг тул
`?cat=` хувилбарууд Google-д давхардахгүй. 308 redirect хэрэггүй. Шүүлтүүрийн товчнууд баруун талын
агуулга дотор үлдэнэ, харин бүтэн өргөн **наалддаг** биш болно (утсан дээр хэсгийн товчнуудтай давхцахгүйн тулд).

### 3.2 Өөрчлөгдөх хаягууд

| Хуучин | Шинэ | Шалтгаан |
|---|---|---|
| — | **`/things-to-do`** (шинэ хуудас) | «Үзэх, хийх зүйлс»-д тойм хуудас байхгүй. `MAIN_NAVIGATION`-д энэ зүйлийн `href` нь `/things-to-do/nature` (эхний дэд хуудастай ижил). |

Өөр ямар ч хаяг өөрчлөгдөхгүй, redirect нэмэхгүй. Route group (`(…)`) хавтас URL-д ордоггүй.

`/things-to-do` одоо 404 буцаадаг тул redirect хэрэггүй. Тойм агуулга: 8 дэд сэдвийн зурагтай карт
(одоогийн hero зураг, гарчиг, тайлбарыг ашиглана) + богино оршил. Шинэ хуудас тул ia-plan.md-ийн 7-р
зарчмаар **draft**-аар орно (5-р хэсгийн R3-ыг үз).

## 4. Hero зураг

Hero layout-д байх тул хэсгийн бүх хуудсанд **нэг зураг** гарна (одоо хуудас бүр өөр зурагтай).
`docs/plan/images.md`-ийн дагуу Монголынх нь шалгагдсан зураг `lib/images.ts`-д 10 л байна. Санал:

| Хэсэг | Санал болгох зураг | Тэмдэглэл |
|---|---|---|
| Монголын тухай | `herderBoy` | одоогийн `photo-1519681393784` нь шалгагдаагүй stock |
| Үзэх, хийх зүйлс | `camels` | одоогийн 4 хуудас ижил шалгагдаагүй `photo-1544735716` |
| Түүхүүд | `gerStars` | hub-д одоо hero зураг байхгүй |
| Арга хэмжээ, баяр наадам | `eagleHunter` | Фестивалиуд аль хэдийн ашигладаг |
| Соёл, өв | `chinggisStatue` | |
| Байгаль | `whiteHorse` | |
| Нүүдэлчдийн амьдрал | `herdSnow` | |
| Аялахаас өмнө | `lakeGers` | одоо HubHeader (зураггүй) |
| Хоол | ⚠ байхгүй (түр `gerCamp`) | хоолны шалгагдсан зураг хэрэгтэй |
| Хүмүүс | ⚠ байхгүй (түр `redCliffs`?) | хүмүүсийн шалгагдсан зураг хэрэгтэй |
| Фото/видео түүх | ⚠ байхгүй (түр `gerStars`) | |

→ **3 шинэ зураг** хэрэгтэй (хоол, хүмүүс, фото/видео). Эзэмшигч өгөх эсвэл би Unsplash-аас санал болгоод
нүдээр шалгуулна. Хүлээх хооронд дээрх түр зургууд.

## 5. Техникийн шийдэл

### 5.1 Хуваалцсан layout: route group

Next.js-д layout нь зөвхөн нэг хавтасны доорх хуудсуудад хуваалцагдана. Нэг хэсгийн хуудсууд өөр өөр
хавтсанд байдаг (жишээ нь «Үзэх, хийх зүйлс» = `/things-to-do/*` + `/inspiration/styles`). Тиймээс хэсэг
бүрт **route group** (URL-д ордоггүй `(нэр)` хавтас) хийж, тухайн хэсгийн хуудсуудыг дотор нь зөөнө:

```
app/
  (sec-about)/layout.tsx            about/at-a-glance, about/history, about/modern
  (sec-things)/layout.tsx           things-to-do/page.tsx (шинэ), things-to-do/{nature…wildlife}, inspiration/styles
  (sec-stories)/layout.tsx          stories/page.tsx, inspiration/hidden, inspiration/top-lists
  (sec-events)/layout.tsx           things-to-do/events, things-to-do/festivals
  (sec-culture)/layout.tsx          about/culture, about/traditions
  (sec-nature)/layout.tsx           about/nature
  (sec-nomadic)/layout.tsx          about/nomadic-life
  (sec-food)/layout.tsx             about/food
  (sec-people)/layout.tsx           about/people
  (sec-photo)/layout.tsx            stories/photo-video
  (sec-before)/layout.tsx           plan/before-you-travel, inspiration/seasons
```

- Нэг замын хавтас (`about/`, `things-to-do/`, `inspiration/`, `stories/`) хэд хэдэн group-д хуваагдаж болно,
  эцсийн URL давхцахгүй л бол Next зөвшөөрдөг. Хамрах хүрээнээс гадуурх хуудсууд (`/inspiration/itineraries`,
  `/stories/[slug]`, `/plan/*` бусад) хуучин байрандаа үлдэнэ.
- Хуудас бүрийн одоогийн `layout.tsx` (`metaFor`, `force-dynamic`) хуудастайгаа хамт зөөгдөнө, тиймээс
  **title, description, canonical, robots хуудас бүрт хэвээр**.
- Group layout бүр нэг мөр: `<SectionLayout sectionId="things">{children}</SectionLayout>`.
- Нэг group доторх хуудас хооронд `<Link>`-ээр шилжихэд layout дахин render хийгдэхгүй: hero, жагсаалт
  байрандаа, зөвхөн баруун тал солигдоно, URL шинэчлэгдэнэ. Server HTML-д хуудас бүр бүтэн гарна.
- Өөр хэсэг рүү шилжихэд (жишээ нь цэсээр) layout солигдоно. Энэ хүлээгдэж буй үр дүн.

### 5.2 Шинэ файлууд

| Файл | Үүрэг |
|---|---|
| `lib/sections.ts` | Хэсэг бүрийн тохиргоо: `id`, hero (зураг, дээд бичиг, гарчиг, тайлбар), мөрүүд (`label`, `href`), `baseHref`. Мөрүүдийг `MAIN_NAVIGATION`-ийн тухайн зүйлийн `children`-оос үүсгэнэ (нэг эх сурвалж), эхний мөрийг «Тойм» гэж нэрлэнэ. Нэг хуудастай хэсэгт дотоод anchor-ууд. |
| `components/section/SectionLayout.tsx` | Server компонент: `SectionHero` + 2 баганат хүрээ (`aside` + `main`). `visibleItems`-ээр production дээр live/soft бус мөрийг нууна. |
| `components/section/SectionHero.tsx` | `ImageHero`-гийн загвар (зураг, дээд бичиг, гарчиг, тайлбар). Гарчиг нь үндсэн URL дээр `<h1>`, дэд хуудсанд `<p>` (ижил хэмжээ). `usePathname`-аар шийднэ (client жижиг хэсэг, SSR-д зөв гарна). |
| `components/section/SectionSidebar.tsx` | Client. Desktop (`lg`+): GuidePage-ийн «Сэдвийн жагсаалт» карт, `sticky top-[calc(var(--nav-h)+1.5rem)]`. Утас: hero-гийн доор `sticky top-(--nav-h)` хэвтээ гүйдэг товчнууд, идэвхтэй товч харагдах хэсэг рүү гүйлгэнэ. Идэвхтэй мөр `usePathname`-аар. `<Link>`. |
| `components/section/SectionPageHeader.tsx` | Баруун талын эхэнд: `Breadcrumbs` (+ BreadcrumbList JSON-LD) ба дэд хуудсанд `<h1>` (мөрийн нэр). Үндсэн URL дээр H1-гүй (H1 hero-д). Layout-д `usePathname`-аар render хийнэ, тиймээс хуудас бүрт нэмэх шаардлагагүй. |
| `app/(sec-things)/things-to-do/page.tsx` + `layout.tsx` | «Үзэх, хийх зүйлс»-ийн шинэ Тойм. |

### 5.3 Өөрчлөгдөх файлууд

| Файл | Өөрчлөлт |
|---|---|
| `app/about/{at-a-glance,history,modern,culture,traditions,nature,nomadic-life,food,people}/page.tsx` (9) | `ImageHero` болон наалддаг anchor товчны мөрийг хасна. `<main>` → `<div>` (layout `<main>` өгнө). Хэсгүүд, картууд, `AboutRelated` хэвээр. Anchor id-ууд үлдэнэ (жагсаалт, ia-plan 8-р хэсгийн холбоосууд ашигладаг). 12 баганат тор, 3 баганат картын тор нарийн баганад `lg:` → `xl:` руу шилжинэ. |
| `components/templates/CategoryListing.tsx` | `embedded` горим: hero-гүй, `<main>`-гүй, шүүлтүүрийн мөр наалддаггүй, тор `md:2 xl:3`. Нутгийн Монгол (`/local/*`) хуучин горимоор үлдэнэ. |
| `app/things-to-do/*/page.tsx` (9) | `embedded` дамжуулна, hero props хасагдана (зураг Тойм картад шилжинэ). |
| `components/templates/InspirationListing.tsx` | `embedded` горим: HubHeader-гүй. `/inspiration/itineraries` хуучин горимоор. |
| `app/inspiration/{styles,hidden,top-lists,seasons}/page.tsx` | `embedded`, HubHeader хасна. |
| `app/stories/page.tsx`, `app/stories/photo-video/page.tsx` | HubHeader ба ангиллын anchor товчны мөрийг хасна (stories hub-ийн ангиллууд жагсаалтад anchor болж орно уу гэдгийг 7-р хэсгээс үз). |
| `components/GuidePage.tsx`, `app/plan/before-you-travel/page.tsx` | `embedded` горим: HubHeader-гүй, дотоод TOC-ийг хэсгийн жагсаалтын идэвхтэй мөрийн доор шилжүүлнэ (хоёр sidebar зэрэгцэхгүй). `/plan/*`, `/respect/*` хуучнаараа. |
| `lib/navigation.ts` | «Үзэх, хийх зүйлс»-ийн `href` → `/things-to-do` (Тойм live болсон үед, R3). |
| `lib/pageMeta.ts` | `/things-to-do` title/description. |
| `lib/searchIndex.ts`, `app/sitemap.ts` | `/things-to-do` нэмнэ (sitemap нь `isPageIndexable`-ээр өөрөө шүүнэ). |
| `travel-mongolia/CLAUDE.md`, `docs/plan/templates.md` | Шинэ «Хэсгийн хуудас» загварыг тайлбарлана. |

Хөндөхгүй: `app/layout.tsx` (Google tag-ууд), `Navbar.tsx` (баганын гарчиг, «Бүгдийг үзэх →» аль хэдийн `item.href` руу заадаг).

### 5.4 SEO

- **H1:** хуудас бүрт яг нэг. Үндсэн URL: hero гарчиг = H1. Дэд хуудас: hero гарчиг `<p>`, H1 = баруун талын
  эхэнд мөрийн нэр. Одоогийн template-уудын H1 (`ImageHero`, `HubHeader`) `embedded` горимд гарахгүй.
- **Title, description, canonical:** хуудас бүрийн `metaFor`, өөрчлөхгүй.
- **Breadcrumb + JSON-LD:** одоо зөвхөн `/stories`, `/plan/before-you-travel`, `/stories/photo-video` дээр бий,
  `/about/*`, `/things-to-do/*`, `/inspiration/*` дээр байхгүй. Шинээр бүгдэд нь нэг ижил:
  `Нүүр / <Хэсэг (үндсэн URL)> / <Дэд сэдэв>`. Үндсэн URL дээр `Нүүр / <Хэсэг>`. Цэсний бүлгийн нэрийг
  (Монголыг нээ, Түүх & өв) өөрийн хуудасгүй тул оруулахгүй.
- **Server HTML:** hero, жагсаалт, H1, агуулга бүгд SSR-д гарна (`usePathname` client компонентод ч SSR хийгддэг).
  `force-dynamic` layout-ууд хэвээр.

## 6. Эрсдэл, анхаарах зүйлс

- **R1. Олон файл зөөнө (~30 хавтас).** `git mv` хийснээр түүх хадгалагдана. Зөөсний дараа `@/` импортууд
  өөрчлөгдөхгүй, гэхдээ харьцангуй импорт байвал засна. Build-ийг local-д (VS Code-ийн Electron Node) ажиллуулж шалгана.
- **R2. Route group дахь давхцал.** Ижил URL хоёр group-д байвал build унана. Нэг хэсэг = нэг group, хүснэгт 2-оос
  өөр хуудас зөөхгүй.
- **R3. `/things-to-do` draft байх үед.** `pageStatus`-ийн дүрмээр `PAGE_STATUS['/things-to-do'] = 'draft'`
  гэвэл бүх `/things-to-do/*` хуудас draft-ыг өвлөж production-оос нуугдана. Тиймээс PAGE_STATUS ашиглахгүй:
  цэсний `href`-ийг `/things-to-do/nature` хэвээр үлдээж, Тойм мөрийг `isPageLive` / `liveHref`-ээр нууна
  (Тойм хуудсыг `PAGE_STATUS`-ийн оронд тусдаа `EXACT_PAGE_STATUS`-аар draft болгох жижиг өөрчлөлт хэрэгтэй).
  Эзэмшигч зөвшөөрсний дараа `href`-ийг солиод live болгоно.
- **R4. Агуулгын өргөн.** Sidebar (~256px) нэмэгдэхэд баруун тал ~960px болно. `/about/*`-ийн том 2 баганат
  блокууд, 3 баганат картууд шахагдана. Breakpoint-уудыг нэг нэгээр шалгана (1024, 1280, 1440).
- **R5. Нэг хэсгийн бүх хуудас нэг hero зурагтай болно.** Одоогийн хуудас бүрийн өөр зураг алга болно.
  Хүсвэл зураг нь `things-to-do` Тойм картад, `/about/*` хэсгүүдийн дотор хэвээр бий.
- **R6. Scroll.** Next `<Link>` нь шинэ сегментийн эхэнд гүйлгэдэг. Hero өндөр (55vh) тул жагсаалтаас дарахад
  баруун талын эхэнд очих нь зөв. Утсан дээр hero дахин харагдахгүйн тулд мөн адил. Хуучин `#anchor` холбоосууд
  (`/about/culture#costume` г.м.) ажиллах ёстой: шалгана.
- **R7. Давхар гарчиг.** `/things-to-do/events` ба `/things-to-do/festivals` хоёулаа «Баяр наадам, арга хэмжээ»
  H1/гарчигтай. Шинэ загварт events = «Тойм», festivals = «Фестивалиуд» гэж ялгагдана. Metadata title давхардаж
  байгаа эсэхийг шалгаж засна.
- **R8. Нэршлийн зөрүү.** `/stories` hub-ийн дээд бичиг одоо «ТҮҮХ & ӨВ», гэтэл цэсэнд «Монголыг нээ › Түүхүүд».
  Hero гарчиг «Түүхүүд» болно.
- **R9. Утасны наалддаг мөр.** Дээд цэс (`--nav-h`) + хэсгийн товчнууд + (things-to-do дээр) `?cat=` шүүлтүүр
  гурав давхар наалдвал дэлгэц багасна. Тиймээс `?cat=` шүүлтүүр наалддаггүй болно.
- **R10. Vercel-ийн deploy хязгаар.** Бүгдийг нэг branch (`feat/section-layout`) дээр хийж, цөөн push хийнэ.
- **R11. Production дээр нуугдсан мөр.** `visibleItems` soft/live-ийг харуулна. Фото/видео (soft) жагсаалтад
  гарна, гэхдээ noindex хэвээр.

## 7. Эзэмшигчээс асуух шийдвэрүүд

1. **«Үзэх, хийх зүйлс»-ийн Тойм:** шинэ `/things-to-do` хуудас (санал) уу, эсвэл «Байгальд аялах»-ыг Тойм гэж үзэх үү?
2. **Нэг хуудастай 5 хэсэг:** жагсаалтад дотоод хэсгүүдийг anchor-оор жагсаах (санал) уу, эсвэл «Тойм» ганц мөр үү?
   `/stories` hub-ийн ангиллууд (Соёл, Байгаль…) ч мөн адил anchor болох уу?
3. **Hero зураг:** 4-р хэсгийн хуваарь болон 3 шинэ зураг.
4. **Ажлын дараалал:** нэг PR (бүх 11 хэсэг) эсвэл эхлээд «Монголын тухай»-гаар пилот хийж preview дээр
   харуулаад, дараа нь үлдсэнийг (санал).

## 8. Эзэмшигчийн шийдвэрүүд (2026-10-12)

1. **`/things-to-do` Тойм хуудас хийнэ**, 8 дэд сэдвийн карттай, төлөв **live**. Draft өвлөх асуудал (R3) гарахгүй.
2. **Нэг хуудастай хэсгүүд:** зүүн талын жагсаалтыг хуудасны доторх хэсгүүдийн anchor-оор дүүргэнэ
   (Хүндэтгэлтэй аялал хуудасны «Сэдвийн жагсаалт» шиг, гүйлгэхэд идэвхтэй мөр солигдоно).
3. **Hero зураг:** шалгагдсан 10 зургаас хуваарилна. Хоол, Хүмүүс, Фото/видеод хамгийн ойрыг түр тавина.
   Бүх hero зураг `lib/sections.ts`-д нэг газар тохируулагдана.
4. **Пилот:** эхлээд зөвхөн «Монголын тухай», `feat/section-layout` branch. Зөвшөөрлийн дараа үлдсэн 10 хэсэг.
5. **Нэр солих:** «Арга хэмжээ, баяр наадам» хэсгийн «Баяр наадам, арга хэмжээ» мөр → **«Уламжлалт баяр наадам»**
   (цэс, жагсаалт, хуудасны гарчиг). Хаяг (`/things-to-do/events`) өөрчлөгдөхгүй. (R7-г шийднэ.)

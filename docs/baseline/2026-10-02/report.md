# SEO baseline: www.travelhubmongolia.com (2026-10-02)

Энэ тайланг `scripts/seo/crawl.ps1` автоматаар үүсгэсэн. Өгөгдөл: `crawl.csv` (URL бүрийн мэдээлэл), `links.csv` (дотоод холбоосууд).

## Гол дүгнэлт (гараар нэмсэн)

1. **79 эвдэрсэн дотоод холбоос.**
   - 77 нь "Монголын тухай" болон "Зорих газрууд"-ын хуудсууд дээрх "дэлгэрэнгүй" товчнууд. Тэдгээр нь байхгүй дэд хуудас руу заадаг, жишээ нь `/about/culture/<id>` ([about/culture/page.tsx:369](../../../travel-mongolia/app/about/culture/page.tsx#L369)), `/destination/landscapes/<id>`, `/destination/protected/<id>`, `/destination/routes/gobi-circuit`, `/destination/explore/1`.
   - 2 нь цэсний холбоос: `/about/today`, `/about/identity`.
   - Шийдэл: дэд хуудсуудыг үүсгэх, эсвэл товчийг тухайн хуудсан доторх `#хэсэг` руу заалгах.
2. **`/destination/<id>` 5 хуудас Google-д нүүр хуудасны давхар хуулбар мэт харагдана.** Эдгээр хуудсанд `generateMetadata` байхгүй. Тиймээс root layout-ийн `canonical: '/'`, title болон description-ийг өвлөж, canonical нь нүүр хуудас руу заадаг. Google тэднийг index-д оруулахгүй байх магадлалтай.
3. **Цэсний холбоосуудыг Google харахгүй байж магадгүй.** Mega-menu зөвхөн browser дээр, хулганаар нээхэд үүсдэг. Тиймээс серверийн HTML-д цэсний холбоосууд байхгүй. Үүнээс болж sitemap-ийн 28 хуудсанд ямар ч HTML хуудаснаас холбоос ирдэггүй (§8). Footer-ийн "Бүс нутаг" болон "Хэрэгцээт мэдээлэл"-ийн холбоосууд бүгд `/` руу заадаг тул тэд ч энэ дутагдлыг нөхөхгүй.
4. **Түүхэн өвийн 3 газрын description ижил.** Contentful-д "бла бла" гэсэн түр текст байгаа (§4).
5. **`/destination/map` хуудсанд H1 байхгүй** (§5).
6. **Robots ба sitemap зөв ажиллаж байна.** Redirect байхгүй, sitemap-ийн бүх URL `www`-ээр эхэлдэг, Googlebot хаагдаагүй. Зөвхөн Contentful-д бүртгэлгүй аймгийн хуудас (`/province/bayan-olgii`) `noindex`-тэй, энэ нь хүлээгдэж буй үйлдэл.

## Тойм

- Мөлхсөн URL: **255**
- sitemap.xml: status 200, **58** URL
- sitemap-д `https://www.travelhubmongolia.com`-оор эхлээгүй URL: **0**
- Цэсний (Navbar.tsx) дотоод холбоос: **157**

| Status | Тоо |
|---|---|
| 200 | 176 |
| 404 | 79 |

## 1. Эвдэрсэн холбоосууд

Сайтын хуудас эсвэл цэснээс заасан боловч 4xx/5xx буцаадаг хаягууд.

| Эвдэрсэн хаяг | Status | Хаанаас холбогдсон |
|---|---|---|
| `/about/identity` | 404 | Цэс (Navbar.tsx) |
| `/about/today` | 404 | Цэс (Navbar.tsx) |
| `/about/at-a-glance/symbols` | 404 | /about/at-a-glance |
| `/about/at-a-glance/population` | 404 | /about/at-a-glance |
| `/about/at-a-glance/overview` | 404 | /about/at-a-glance |
| `/about/at-a-glance/geography` | 404 | /about/at-a-glance |
| `/about/at-a-glance/facts` | 404 | /about/at-a-glance |
| `/about/culture/architecture` | 404 | /about/culture |
| `/about/culture/music` | 404 | /about/culture |
| `/about/culture/monuments` | 404 | /about/culture |
| `/about/culture/crafts` | 404 | /about/culture |
| `/about/culture/unesco` | 404 | /about/culture |
| `/about/culture/literature` | 404 | /about/culture |
| `/about/culture/fine-arts` | 404 | /about/culture |
| `/about/culture/costume` | 404 | /about/culture |
| `/about/culture/archeology` | 404 | /about/culture |
| `/about/culture/dance-stage` | 404 | /about/culture |
| `/about/food/mongolian-tea` | 404 | /about/food |
| `/about/food/food-culture` | 404 | /about/food |
| `/about/food/food-processing` | 404 | /about/food |
| `/about/food/flour-dishes` | 404 | /about/food |
| `/about/food/meat-dishes` | 404 | /about/food |
| `/about/food/regional-cuisine` | 404 | /about/food |
| `/about/food/dairy` | 404 | /about/food |
| `/about/food/airag` | 404 | /about/food |
| `/about/modern/music` | 404 | /about/modern |
| `/about/modern/lifestyle` | 404 | /about/modern |
| `/about/modern/youth-culture` | 404 | /about/modern |
| `/about/modern/creative-arts` | 404 | /about/modern |
| `/about/modern/urban-rural` | 404 | /about/modern |
| `/about/nature/steppe` | 404 | /about/nature |
| `/about/nature/geology` | 404 | /about/nature |
| `/about/nature/wildlife` | 404 | /about/nature |
| `/about/nature/mountains` | 404 | /about/nature |
| `/about/nature/lakes-rivers` | 404 | /about/nature |
| `/about/nature/paleontology` | 404 | /about/nature |
| `/about/nature/climate` | 404 | /about/nature |
| `/about/nature/flora` | 404 | /about/nature |
| `/about/nature/gobi` | 404 | /about/nature |
| `/about/nature/taiga` | 404 | /about/nature |
| `/about/nature/geography` | 404 | /about/nature |
| `/about/nomadic-life/eco-culture` | 404 | /about/nomadic-life |
| `/about/nomadic-life/ger` | 404 | /about/nomadic-life |
| `/about/nomadic-life/games` | 404 | /about/nomadic-life |
| `/about/nomadic-life/tools` | 404 | /about/nomadic-life |
| `/about/nomadic-life/five-animals` | 404 | /about/nomadic-life |
| `/about/nomadic-life/herding` | 404 | /about/nomadic-life |
| `/about/nomadic-life/four-seasons` | 404 | /about/nomadic-life |
| `/about/people/mongolians` | 404 | /about/people |
| `/about/people/ethnic-groups` | 404 | /about/people |
| `/about/people/lifestyle` | 404 | /about/people |
| `/about/people/hospitality` | 404 | /about/people |
| `/about/people/language-script` | 404 | /about/people |
| `/about/traditions/wedding` | 404 | /about/traditions |
| `/about/traditions/birth-naming` | 404 | /about/traditions |
| `/about/traditions/shamanism` | 404 | /about/traditions |
| `/about/traditions/folklore-myths` | 404 | /about/traditions |
| `/about/traditions/hospitality` | 404 | /about/traditions |
| `/about/traditions/buddhism` | 404 | /about/traditions |
| `/about/traditions/rituals` | 404 | /about/traditions |
| `/about/traditions/naadam` | 404 | /about/traditions |
| `/about/traditions/tsagaan-sar` | 404 | /about/traditions |
| `/destination/landscapes/gobi` | 404 | /destination/landscapes |
| `/destination/landscapes/rivers` | 404 | /destination/landscapes |
| `/destination/landscapes/caves-geology` | 404 | /destination/landscapes |
| `/destination/landscapes/mountains` | 404 | /destination/landscapes |
| `/destination/landscapes/canyons` | 404 | /destination/landscapes |
| `/destination/landscapes/glaciers` | 404 | /destination/landscapes |
| `/destination/landscapes/steppes` | 404 | /destination/landscapes |
| `/destination/landscapes/springs` | 404 | /destination/landscapes |
| `/destination/landscapes/sand-dunes` | 404 | /destination/landscapes |
| `/destination/landscapes/lakes` | 404 | /destination/landscapes |
| `/destination/landscapes/forest-taiga` | 404 | /destination/landscapes |
| `/destination/explore/1` | 404 | /destination/map |
| `/destination/protected/natural-monuments` | 404 | /destination/protected |
| `/destination/protected/strictly-protected` | 404 | /destination/protected |
| `/destination/protected/nature-reserves` | 404 | /destination/protected |
| `/destination/protected/national-parks` | 404 | /destination/protected |
| `/destination/routes/gobi-circuit` | 404 | /destination/routes |

## 2. 404 болон алдаатай хуудсууд

| URL | Status | sitemap-д | Цэсэнд | Орж ирэх холбоос |
|---|---|---|---|---|
| `https://www.travelhubmongolia.com/about/identity` | 404  |  | тийм | 0 |
| `https://www.travelhubmongolia.com/about/today` | 404  |  | тийм | 0 |
| `https://www.travelhubmongolia.com/about/at-a-glance/symbols` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/at-a-glance/population` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/at-a-glance/overview` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/at-a-glance/geography` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/at-a-glance/facts` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/architecture` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/music` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/monuments` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/crafts` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/unesco` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/literature` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/fine-arts` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/costume` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/archeology` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/culture/dance-stage` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/food/mongolian-tea` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/food/food-culture` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/food/food-processing` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/food/flour-dishes` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/food/meat-dishes` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/food/regional-cuisine` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/food/dairy` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/food/airag` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/modern/music` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/modern/lifestyle` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/modern/youth-culture` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/modern/creative-arts` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/modern/urban-rural` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/steppe` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/geology` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/wildlife` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/mountains` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/lakes-rivers` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/paleontology` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/climate` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/flora` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/gobi` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/taiga` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nature/geography` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nomadic-life/eco-culture` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nomadic-life/ger` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nomadic-life/games` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nomadic-life/tools` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nomadic-life/five-animals` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nomadic-life/herding` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/nomadic-life/four-seasons` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/people/mongolians` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/people/ethnic-groups` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/people/lifestyle` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/people/hospitality` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/people/language-script` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/wedding` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/birth-naming` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/shamanism` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/folklore-myths` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/hospitality` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/buddhism` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/rituals` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/naadam` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/about/traditions/tsagaan-sar` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/destination/landscapes/gobi` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/rivers` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/caves-geology` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/mountains` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/canyons` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/glaciers` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/steppes` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/springs` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/sand-dunes` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/lakes` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/landscapes/forest-taiga` | 404  |  |  | 5 |
| `https://www.travelhubmongolia.com/destination/explore/1` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/destination/protected/natural-monuments` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/destination/protected/strictly-protected` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/destination/protected/nature-reserves` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/destination/protected/national-parks` | 404  |  |  | 1 |
| `https://www.travelhubmongolia.com/destination/routes/gobi-circuit` | 404  |  |  | 7 |

## 3. Redirect

_Олдсонгүй._

## 4. Title болон meta description

Шалгасан хуудас: 59. `?region=` гэх мэт query-тэй хувилбаруудыг үндсэн хуудастайгаа ижил тул энд оруулаагүй.

### Хоосон title (0)

_Олдсонгүй._

### Давхардсан title (1 бүлэг)

- **6 хуудас**: "Travel Mongolia \| Монголд аялах аяллын гарын авлага"
  - `/`
  - `/destination/3Rt7pnt87NLThFVsRS7DoU`
  - `/destination/5z3JM5JvdnFX4cUieV9Mrc`
  - `/destination/4E7saPDvAwtwwnw0GFpQSg`
  - `/destination/6tDLtOe6nWOzZDT0sdGMd`
  - `/destination/5gHuNvalGv5MYMexAUrWEX`

### Хоосон description (0)

_Олдсонгүй._

### Давхардсан description (2 бүлэг)

- **7 хуудас**: "Монголд аялах бүх мэдээлэл нэг дор: үзэх газрууд, нүүдэлчин соёл, баяр наадам, аяллын маршрут, байрлах газар, аяллын зөвлөгөө."
  - `/`
  - `/destination/3Rt7pnt87NLThFVsRS7DoU`
  - `/destination/5z3JM5JvdnFX4cUieV9Mrc`
  - `/destination/4E7saPDvAwtwwnw0GFpQSg`
  - `/destination/6tDLtOe6nWOzZDT0sdGMd`
  - `/destination/5gHuNvalGv5MYMexAUrWEX`
  - `/province/bayan-olgii`
- **3 хуудас**: "Орхон хөндийн соёлын дурсгал бол бла бла бла бла бла бла бла бла бла бал бла бла бла лб алб лай"
  - `/destination/heritage/place/3t2W7uicg4pU7wXuhVuE4M`
  - `/destination/heritage/place/5HTDX995PID2jrXG8wPHkZ`
  - `/destination/heritage/place/4Nd4SuwgpInDup4z0QKs4g`

## 5. H1

### H1 байхгүй хуудас (1)

- `/destination/map` (Монголын аяллын интерактив газрын зураг \| Travel Mongolia)

### Нэгээс олон H1-тэй хуудас (0)

_Олдсонгүй._

## 6. sitemap-д байгаа ч цэснээс холбоосгүй хуудсууд

Query болон #-ийг хасаад замаар нь харьцуулсан. Contentful-ийн динамик хуудсууд (аймаг, түүхэн өв, зөвлөмж, онцлох газар) цэсэнд байх албагүй тул тусад нь жагсаав. Тэдгээрт бусад хуудаснаас холбоос байгаа эсэхийг "Орж ирэх холбоос" баганаас харна.

### Статик хуудас (5)

| Зам | Орж ирэх холбоос |
|---|---|
| `/destination/national-parks` | 0 |
| `/destination/natural-monuments` | 0 |
| `/destination/nature-reserves` | 0 |
| `/destination/protected` | 0 |
| `/things-to-do/festivals` | 0 |

### Динамик (Contentful) хуудас (15)

| Зам | Гарчиг | Орж ирэх холбоос |
|---|---|---|
| `/destination/3Rt7pnt87NLThFVsRS7DoU` | Travel Mongolia \| Монголд аялах аяллын гарын авлага | 1 |
| `/destination/4E7saPDvAwtwwnw0GFpQSg` | Travel Mongolia \| Монголд аялах аяллын гарын авлага | 1 |
| `/destination/5gHuNvalGv5MYMexAUrWEX` | Travel Mongolia \| Монголд аялах аяллын гарын авлага | 1 |
| `/destination/5z3JM5JvdnFX4cUieV9Mrc` | Travel Mongolia \| Монголд аялах аяллын гарын авлага | 1 |
| `/destination/6tDLtOe6nWOzZDT0sdGMd` | Travel Mongolia \| Монголд аялах аяллын гарын авлага | 1 |
| `/destination/heritage/place/3t2W7uicg4pU7wXuhVuE4M` | Орхоны хөндийн соёлын дурсгал, Өвөрхангай, Архангай · 2004 он \| Travel Mongolia | 9 |
| `/destination/heritage/place/4Nd4SuwgpInDup4z0QKs4g` | Бурхан Халдун уул & хүрээлэн буй нутаг, Хэнтий · 2015 он \| Travel Mongolia | 9 |
| `/destination/heritage/place/5HTDX995PID2jrXG8wPHkZ` | Буган чулуун хөшөө, хүрэл зэвсгийн цогцолбор, Хөвсгөл, Архангай · 2023 он \| Travel Mongolia | 9 |
| `/destination/heritage/unesco` | UNESCO Дэлхийн өв: Монголын түүхэн өв \| Travel Mongolia | 8 |
| `/province/khovd` | Ховд аймаг: үзэх газрууд, аялах мэдээлэл \| Travel Mongolia | 0 |
| `/province/ulaanbaatar` | Улаанбаатар: үзэх газрууд, аялах мэдээлэл \| Travel Mongolia | 0 |
| `/recommendation/1ciXvnhrbkitFPRJkd7J28` | Аймгийн наадам \| Travel Mongolia | 1 |
| `/recommendation/46P2ZsGTkRyowahv3BBgde` | Улсын их баяр наадам \| Travel Mongolia | 1 |
| `/recommendation/5dVnJSUkYMpfLavAKvqyfA` | Сумын наадам \| Travel Mongolia | 1 |
| `/recommendation/7hzN5C6m5qhG3yM4WRvSin` | Хотын наадам \| Travel Mongolia | 1 |

## 7. Цэсэнд байгаа ч sitemap-д ороогүй хуудсууд

| Зам | Status |
|---|---|
| `/about/identity` | 404 |
| `/about/today` | 404 |

## 8. Сайтын аль ч хуудаснаас холбоосгүй (orphan) хуудсууд

sitemap-д байгаа, 200 буцаадаг ч мөлхсөн HTML-ийн аль ч хуудаснаас `<a href>` холбоос ирдэггүй хуудсууд. Цэсний холбоосууд browser дээр л зурагддаг тул Google тэдгээрийг харахгүй байж магадгүй гэдгийг анхаарна уу.

| Зам | Цэсэнд |
|---|---|
| `/about/at-a-glance` | тийм |
| `/about/culture` | тийм |
| `/about/food` | тийм |
| `/about/history` | тийм |
| `/about/modern` | тийм |
| `/about/nature` | тийм |
| `/about/nomadic-life` | тийм |
| `/about/traditions` | тийм |
| `/destination/landscapes` | тийм |
| `/destination/map` | тийм |
| `/destination/national-parks` |  |
| `/destination/natural-monuments` |  |
| `/destination/nature-reserves` |  |
| `/destination/protected` |  |
| `/destination/routes` | тийм |
| `/destination/strictly-protected` | тийм |
| `/inspiration/seasons` | тийм |
| `/things-to-do/adventure` | тийм |
| `/things-to-do/culture` | тийм |
| `/things-to-do/events` | тийм |
| `/things-to-do/festivals` |  |
| `/things-to-do/food` | тийм |
| `/things-to-do/nomadic` | тийм |
| `/things-to-do/wellness` | тийм |
| `/things-to-do/wildlife` | тийм |
| `/destination/region` | тийм |
| `/province/khovd` |  |
| `/province/ulaanbaatar` |  |

## 9. Canonical

| URL | Canonical |
|---|---|
| `/destination/3Rt7pnt87NLThFVsRS7DoU` | `https://www.travelhubmongolia.com` |
| `/destination/5z3JM5JvdnFX4cUieV9Mrc` | `https://www.travelhubmongolia.com` |
| `/destination/4E7saPDvAwtwwnw0GFpQSg` | `https://www.travelhubmongolia.com` |
| `/destination/6tDLtOe6nWOzZDT0sdGMd` | `https://www.travelhubmongolia.com` |
| `/destination/5gHuNvalGv5MYMexAUrWEX` | `https://www.travelhubmongolia.com` |
| `/province/bayan-olgii` | `https://www.travelhubmongolia.com` |

## 10. noindex

- `https://www.travelhubmongolia.com/province/bayan-olgii`: noindex

## Дахин ажиллуулах

```powershell
powershell -ExecutionPolicy Bypass -File scripts\seo\crawl.ps1                  # өнөөдрийн огноогоор
powershell -ExecutionPolicy Bypass -File scripts\seo\compare.ps1 -Old docs\baseline\2026-10-02 -New docs\baseline\<шинэ огноо>
```

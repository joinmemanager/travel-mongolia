# Эвдэрсэн "Дэлгэрэнгүй" холбоосыг засах санал

> Эх сурвалж: `docs/baseline/2026-10-02-3/` (77 эвдэрсэн холбоос, 404). Огноо: 2026-10-02.
> Төлөв: **Батлагдсан (2026-10-02), `fix/broken-links` branch дээр хэрэгжүүлсэн.** В ангиллын сэдвүүд `ia-plan.md`-ийн 8-р хэсэгт.

## Нэгтгэл

| Шийдэл | Тоо | Утга |
|---|---|---|
| **А** | **52** | Ойролцоо агуулгатай одоо байгаа хуудас руу чиглүүлэх |
| **Б** | **2** | Contentful-ын entry-ийн хуудас руу чиглүүлэх |
| **В** | **23** | Тохирох хуудас байхгүй тул товчийг түр нуух |
| Нийт | 77 | |

**Хэрэгжүүлэх тухай:** Эдгээр товч хуудас бүрт гараар бичигдээгүй. Хэсэг бүрийн өгөгдлөөс загвараар үүсдэг (жишээ нь ``href={`/about/culture/${sec.id}`}``). Тиймээс засвар нь 12 загварт хийгдэнэ:
- Хэсэг бүрийн өгөгдөлд `moreHref` талбар нэмнэ.
- Тэр талбаргүй хэсгийн товчийг харуулахгүй (В).

Хоёр зүйлийг анхаарах хэрэгтэй:
- **Мөлхөгч зарим загварыг бүрэн хараагүй.** `/destination/routes` нь 5 маршрут бүрт, `/destination/map` нь газар бүрт товч үүсгэдэг. Мөлхөгч зөвхөн анх сонгогдсон 1-ийг нь харсан. Иймээс доорх шийдэл тухайн загварын бүх товчид үйлчилнэ.
- **Хуудас доторх хэсэг рүү зааж болно.** А шийдлийн зарим нь `?cat=` (things-to-do хуудсуудын ангиллын шүүлтүүр) эсвэл `#хэсэг` (хуудасны хэсэг рүү үсрэх) ашиглана. Эдгээрийн хүрэх хуудас бүгд 200 буцааж байгааг шалгасан.

## 1. Монгол орныг товчхон (`/about/at-a-glance`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Монгол Улсын тухай үндсэн мэдээлэл | Дэлгэрэнгүй | `/about/at-a-glance/overview` | **В**. Мэдээлэл энэ хуудсан дээрээ бүрэн байгаа |
| Хүн ам, нийслэл | Дэлгэрэнгүй | `/about/at-a-glance/population` | **А** → `/about/people` |
| Газар нутаг & Байгалийн бүс | Дэлгэрэнгүй | `/about/at-a-glance/geography` | **А** → `/about/nature#geography` |
| Төрийн болон үндэсний бэлгэдэл | Дэлгэрэнгүй | `/about/at-a-glance/symbols` | **В** |
| Монгол орны онцлог тоо, баримтууд | Дэлгэрэнгүй | `/about/at-a-glance/facts` | **В** |

## 2. Соёл ба өв (`/about/culture`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| UNESCO өв | Дэлгэрэнгүй | `/about/culture/unesco` | **Б** → `/destination/heritage/unesco` (Contentful `heritageCategory` "UNESCO Дэлхийн өв") |
| Археологийн өв | Дэлгэрэнгүй | `/about/culture/archeology` | **А** → `/things-to-do/culture?cat=archaeology` |
| Түүх, соёлын дурсгал | Дэлгэрэнгүй | `/about/culture/monuments` | **А** → `/things-to-do/culture?cat=historical-sites` |
| Монгол хөгжим | Дэлгэрэнгүй | `/about/culture/music` | **А** → `/things-to-do/culture?cat=music-dance` |
| Бүжиг, тайзны урлаг | Дэлгэрэнгүй | `/about/culture/dance-stage` | **А** → `/things-to-do/culture?cat=music-dance` |
| Уран зохиол | Дэлгэрэнгүй | `/about/culture/literature` | **В**. 5в-д `/stories` бэлэн болоход дахин авч үзнэ |
| Дүрслэх урлаг | Дэлгэрэнгүй | `/about/culture/fine-arts` | **А** → `/things-to-do/culture?cat=arts` |
| Гар урлал | Дэлгэрэнгүй | `/about/culture/crafts` | **А** → `/things-to-do/culture?cat=crafts` |
| Үндэсний хувцас | Дэлгэрэнгүй | `/about/culture/costume` | **В** |
| Архитектур | Дэлгэрэнгүй | `/about/culture/architecture` | **А** → `/things-to-do/culture?cat=monasteries` (хийд, сүмийн архитектур) |

## 3. Хоол (`/about/food`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Монгол хоолны соёл | Дэлгэрэнгүй | `/about/food/food-culture` | **А** → `/things-to-do/food` |
| Махан хоол | Дэлгэрэнгүй | `/about/food/meat-dishes` | **А** → `/things-to-do/food?cat=national-dishes` |
| Цагаан идээ | Дэлгэрэнгүй | `/about/food/dairy` | **А** → `/things-to-do/food?cat=dairy-products` |
| Гурилан хоол | Дэлгэрэнгүй | `/about/food/flour-dishes` | **А** → `/things-to-do/food?cat=national-dishes` |
| Айраг | Дэлгэрэнгүй | `/about/food/airag` | **А** → `/things-to-do/food?cat=airag-fermentation` |
| Монгол цай | Дэлгэрэнгүй | `/about/food/mongolian-tea` | **А** → `/things-to-do/food?cat=mongolian-tea` |
| Бүс нутгийн хоол | Дэлгэрэнгүй | `/about/food/regional-cuisine` | **А** → `/things-to-do/food?cat=regional-food` |
| Уламжлалт хүнс боловсруулах арга | Дэлгэрэнгүй | `/about/food/food-processing` | **В** |

## 4. Өнөөгийн Монгол (`/about/modern`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Орчин үеийн Монголын амьдрал | Дэлгэрэнгүй | `/about/modern/lifestyle` | **В** |
| Хот ба хөдөөгийн амьдрал | Дэлгэрэнгүй | `/about/modern/urban-rural` | **В** |
| Орчин үеийн урлаг, дизайн | Дэлгэрэнгүй | `/about/modern/creative-arts` | **В** |
| Хөгжим & Фестивалиуд | Дэлгэрэнгүй | `/about/modern/music` | **А** → `/things-to-do/festivals` |
| Залуусын соёл & Спорт | Дэлгэрэнгүй | `/about/modern/youth-culture` | **В** |

## 5. Байгаль (`/about/nature`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Монгол орны газарзүй | Дэлгэрэнгүй | `/about/nature/geography` | **А** → `/destination/region` |
| Уур амьсгал | Дэлгэрэнгүй | `/about/nature/climate` | **А** → `/inspiration/seasons` |
| Говь | Дэлгэрэнгүй | `/about/nature/gobi` | **А** → `/things-to-do/nature?cat=gobi` |
| Тал хээр | Дэлгэрэнгүй | `/about/nature/steppe` | **А** → `/destination/landscapes#steppes` |
| Уулс | Дэлгэрэнгүй | `/about/nature/mountains` | **А** → `/things-to-do/nature?cat=mountains` |
| Ой, тайга | Дэлгэрэнгүй | `/about/nature/taiga` | **А** → `/things-to-do/nature?cat=forest` |
| Гол, нуур | Дэлгэрэнгүй | `/about/nature/lakes-rivers` | **А** → `/things-to-do/nature?cat=lakes-rivers` |
| Ургамлын аймаг | Дэлгэрэнгүй | `/about/nature/flora` | **В** |
| Зэрлэг амьтад | Дэлгэрэнгүй | `/about/nature/wildlife` | **А** → `/things-to-do/wildlife` |
| Геологи | Дэлгэрэнгүй | `/about/nature/geology` | **А** → `/destination/landscapes#caves-geology` |
| Палеонтологи, үлэг гүрвэл | Дэлгэрэнгүй | `/about/nature/paleontology` | **В** |

## 6. Нүүдэлчдийн амьдрал (`/about/nomadic-life`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Монгол гэр | Дэлгэрэнгүй | `/about/nomadic-life/ger` | **А** → `/things-to-do/nomadic?cat=ger-stay` |
| Таван хошуу мал | Дэлгэрэнгүй | `/about/nomadic-life/five-animals` | **А** → `/things-to-do/nomadic?cat=herding` |
| Дөрвөн улирлын нүүдэл | Дэлгэрэнгүй | `/about/nomadic-life/four-seasons` | **А** → `/things-to-do/nomadic?cat=migration` |
| Мал маллах ухаан | Дэлгэрэнгүй | `/about/nomadic-life/herding` | **А** → `/things-to-do/nomadic?cat=herding` |
| Ахуйн багаж, хэрэгсэл | Дэлгэрэнгүй | `/about/nomadic-life/tools` | **В** |
| Байгаль хамгаалах уламжлал | Дэлгэрэнгүй | `/about/nomadic-life/eco-culture` | **В**. 5б-д `/respect/nature` бэлэн болоход тийш чиглүүлнэ |
| Монгол ардын тоглоом наадам | Дэлгэрэнгүй | `/about/nomadic-life/games` | **В** |

## 7. Хүмүүс (`/about/people`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Монголчууд | Дэлгэрэнгүй | `/about/people/mongolians` | **В** |
| Угсаатны бүлгүүд | Дэлгэрэнгүй | `/about/people/ethnic-groups` | **В** |
| Монгол хэл ба Монгол бичиг | Дэлгэрэнгүй | `/about/people/language-script` | **В** |
| Зочломтгой зан заншил | Дэлгэрэнгүй | `/about/people/hospitality` | **А** → `/about/traditions#hospitality` |
| Монгол хүний аж төрөхүй | Дэлгэрэнгүй | `/about/people/lifestyle` | **А** → `/about/nomadic-life` |

## 8. Ёс заншил, уламжлал (`/about/traditions`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Төрөх, нэр өгөх ёс | Дэлгэрэнгүй | `/about/traditions/birth-naming` | **В** |
| Монгол хуримын ёс | Дэлгэрэнгүй | `/about/traditions/wedding` | **В** |
| Зочлох, дайлах ёс | Дэлгэрэнгүй | `/about/traditions/hospitality` | **А** → `/things-to-do/nomadic?cat=visit-herder` |
| Цагаан сар | Дэлгэрэнгүй | `/about/traditions/tsagaan-sar` | **А** → `/things-to-do/events?cat=tsagaan-sar` |
| Үндэсний их баяр Наадам | Дэлгэрэнгүй | `/about/traditions/naadam` | **Б** → `/recommendation/46P2ZsGTkRyowahv3BBgde` (Contentful `recommendation` "Улсын их баяр наадам"). Өөр сонголт (А): `/things-to-do/events?cat=naadam` |
| Бөө мөргөл | Дэлгэрэнгүй | `/about/traditions/shamanism` | **В** |
| Буддын шашин | Дэлгэрэнгүй | `/about/traditions/buddhism` | **А** → `/things-to-do/culture?cat=monasteries` |
| Ардын шүтлэг, домог | Дэлгэрэнгүй | `/about/traditions/folklore-myths` | **В** |
| Уламжлалт баяр, зан үйл | Дэлгэрэнгүй | `/about/traditions/rituals` | **А** → `/things-to-do/events` |

## 9. Байгалийн тогтоц, ландшафт (`/destination/landscapes`)

Хэсэг бүрийн сүүлийн карт "+N тогтоц. Бүх лавлах сан. Интерактив газрын зураг, байршил & дэлгэрэнгүй" гэсэн тексттэй. Картын текст өөрөө газрын зураг руу заадаг тул бүгдийг газрын зургийн хуудас руу чиглүүлнэ.

| Хэсэг (эхний газар) | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Уулс (Мөнххайрхан уул) | + 37 тогтоц, Бүх лавлах сан | `/destination/landscapes/mountains` | **А** → `/destination/map` |
| Нуурууд (Тэрхийн цагаан нуур) | + 27 тогтоц, Бүх лавлах сан | `/destination/landscapes/lakes` | **А** → `/destination/map` |
| Голууд (Хэрлэн гол) | + 22 тогтоц, Бүх лавлах сан | `/destination/landscapes/rivers` | **А** → `/destination/map` |
| Говь (Хэрмэн цав) | + 17 тогтоц, Бүх лавлах сан | `/destination/landscapes/gobi` | **А** → `/destination/map` |
| Элсэн манхан (Бөөрөг дэлийн элс) | + 12 тогтоц, Бүх лавлах сан | `/destination/landscapes/sand-dunes` | **А** → `/destination/map` |
| Хавцал (Дүнгэнээгийн хавцал) | + 22 тогтоц, Бүх лавлах сан | `/destination/landscapes/canyons` | **А** → `/destination/map` |
| Ой, тайга (Батхааны хушин ой) | + 15 тогтоц, Бүх лавлах сан | `/destination/landscapes/forest-taiga` | **А** → `/destination/map` |
| Тал хээр (Дарьгангын тэгш өндөрлөг) | + 13 тогтоц, Бүх лавлах сан | `/destination/landscapes/steppes` | **А** → `/destination/map` |
| Мөсөн гол (Гранигийн мөсөн гол) | + 7 тогтоц, Бүх лавлах сан | `/destination/landscapes/glaciers` | **А** → `/destination/map` |
| Рашаан (Хужиртын рашаан) | + 27 тогтоц, Бүх лавлах сан | `/destination/landscapes/springs` | **А** → `/destination/map` |
| Агуй, геологи (Хоргын галт уулын тогоо) | + 22 тогтоц, Бүх лавлах сан | `/destination/landscapes/caves-geology` | **А** → `/destination/map` |

## 10. Тусгай хамгаалалттай газрууд (`/destination/protected`)

Ангилал бүрт тусдаа хуудас аль хэдийн бий.

| Хэсэг (эхний газар) | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Дархан цаазат газар (Отгонтэнгэр хайрхан) | + 19 газар, Бүх газрын лавлах | `/destination/protected/strictly-protected` | **А** → `/destination/strictly-protected` |
| Байгалийн цогцолборт газар (Хустайн нуруу) | + 34 газар, Бүх газрын лавлах | `/destination/protected/national-parks` | **А** → `/destination/national-parks` |
| Байгалийн нөөц газар (Гүн галуут) | + 33 газар, Бүх газрын лавлах | `/destination/protected/nature-reserves` | **А** → `/destination/nature-reserves` |
| Байгалийн дурсгалт газар (Цагаан суварга) | + 11 газар, Бүх газрын лавлах | `/destination/protected/natural-monuments` | **А** → `/destination/natural-monuments` |

## 11. Аяллын чиглэлүүд (`/destination/routes`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Говийн тойрог (мөн бусад 4 маршрут: Орхон, Хөвсгөл, Алтай, Зүүн) | Дэлгэрэнгүй маршрут, бааз & зочид буудал → | `/destination/routes/gobi-circuit` (болон `/destination/routes/<маршрут>`) | **А** → `/inspiration/itineraries` (өдөр өдрөөр гаргасан аяллын маршрутууд) |

## 12. Газрын зураг (`/destination/map`)

| Хэсэг | Товч | Эвдэрсэн хаяг | Шийдэл |
|---|---|---|---|
| Сонгосон газар (Мухартын гол & Элсэн манхан, мөн бусад бүх газар) | Дэлгэрэнгүй үзэх → | `/destination/explore/1` (болон `/destination/explore/<id>`) | **В**. Газар бүрийн дэлгэрэнгүй хуудас байхгүй. Газрын мэдээлэл аль хэдийн газрын зургийн хажуугийн самбарт харагддаг |

## Холбоосгүй 2 аймгийн хуудас

`/province/khovd`, `/province/ulaanbaatar` хоёр хуудас sitemap-д бий, гэхдээ бусад хуудаснаас холбоос ирдэггүй. Шалтгаан:
- Нүүр хуудасны аймгийн карусель (`components/RegionMap.tsx`) нэг удаад зөвхөн одоо харагдаж буй нэг аймгийн холбоосыг HTML-д гаргадаг.
- `/destination/region` хуудсанд аймгийн хуудас руу холбоос огт байхгүй.

**Санал (давуу эрэмбээр):**

1. **`/destination/region` хуудсанд "Аймаг, хотууд" хэсэг нэмэх (зөвлөмж).**
   - Contentful-ын `province` төрлийн бүх entry-г серверт татаад, `/province/<slug>` холбоосын жагсаалт болгон харуулна.
   - Шинэ аймаг Contentful-д нэмэгдэхэд автоматаар холбоостой болно.
   - Энэ хуудас цэсний "Монголыг нээ › Зорих газрууд"-аас холбогдсон тул Google хоёр алхмаар хүрнэ.
2. **Цэсэнд "Аймгууд" дэд холбоос нэмэх.** ia-plan.md-ийн 2-р хэсэгт "Монголыг нээ › Аймгууд" гэж төлөвлөсөн боловч одоогийн цэсэнд ороогүй. 1-р саналын хэсгийг (`/destination/region#provinces`) "Зорих газрууд"-ын дэд холбоос болгож болно.
3. **Footer-т нэмэхийг санал болгохгүй.** Аймаг 21 + Улаанбаатар байх тул footer хэт урт болно. Мөн тэдгээрийн ихэнх нь Contentful-д хараахан ороогүй байна.

Нэмэлт ажиглалт: Карусель Contentful-д бүртгэлгүй аймгийн хуудсуудыг (жишээ нь `/province/bayan-olgii`) ч мөн холбодог. Ийм хуудас `noindex`-тэй түр хуудас болж гардаг. 1-р санал хэрэгжсэний дараа каруселийг зөвхөн Contentful-д байгаа аймгуудыг холбохоор өөрчилж болно.

# Tourist Info Center → Travel Hub шилжүүлэлтийн жагсаалт

> 2026-10-13. Зөвхөн жагсаалт: repo-ийн код, Contentful-д өөрчлөлт хийгээгүй (Contentful-ээс зөвхөн GET).
> Эх сурвалж: https://www.touristinfocenter.mn (хүсэлт бүрийн хооронд ≥1 секунд, нийт ~4,950 хүсэлт).
> Нийтлэл бүрийн дэлгэрэнгүй: [tic-inventory.csv](tic-inventory.csv) (нэг нийтлэл = нэг мөр, redirect багана орсон).

## Хураангуй

- **4,893 нийтлэл** уншсан: 21 ангилал (cate1–cate28-аас 404 буцаасан cate6, 7, 18, 19, 23, 24, 26-г хассан; TypeID шүүлтүүрийн доор нуугдсан жагсаалтуудыг оруулсан) + News.aspx-ийн 46 хуудас (2,290 мэдээ).
- **ХУУЛАХ 1,966** · **ШАЛГАХ 1,297** · **АЛГАСАХ 1,630**.
- ХУУЛАХ нийтлэлүүдэд 638,653 үг, 1,462 зураг байна. 650 нийтлэл зураггүй.
- Travel Hub-д **2 шинэ Contentful төрөл** (species, soum) болон **7 шинэ хуудас/route** хэрэгтэй. Төрлийн тоо 13 → 15 (Free тарифын хязгаар 25).
- Contentful-д аль хэдийн байгаа **8 газар** давхардаж байна (Тэрэлж, Хөвсгөл нуур, Орхоны хөндий, Бурхан Халдун г.м.). Тэдгээрийг шинээр үүсгэлгүй одоогийн entry-д нэгтгэнэ.
- **Тусдаа хуудасгүй 239 картын 84**-ийг, **зураггүй 158 газрын 41**-ийг TIC-ийн нийтлэл/зураг дүүргэж чадна.
- Contentful Free: 10,000 record (entry + asset). Одоо 34 ашиглаж байна. Зөвхөн ХУУЛАХ-ыг зурагтай нь оруулбал ≈ **3,448 (34%)**, ШАЛГАХ-ыг бүгдийг нэмбэл ≈ **5,652 (57%)**. Хязгаарт багтана. Харин сард 100K API дуудлагын хязгаар илүү эрсдэлтэй (доор «Эрсдэл» хэсгийг үз).
- Гол эрсдэл нь зохиогчийн эрх. 300 орчим нийтлэлд «Эх сурвалж: Монгол орны лавлах», 40 орчимд «Улаан ном» гэж бичсэн, 214 зургийг гуравдагч сайтаас (Facebook CDN, montsame, ikon…) шууд холбосон байна.

## Ангиллын тоо

| Ангилал | TIC хуудас | Нийт | ХУУЛАХ | ШАЛГАХ | АЛГАСАХ | Үг | Зураг | Contentful төрөл | Шинэ хаяг |
|---|---|--:|--:|--:|--:|--:|--:|---|---|
| Байгаль, түүхийн дурсгалт газар | `cate1.aspx` | 453 | 403 | 50 | 0 | 119,286 | 284 | destination / heritagePlace | `/destination/<slug>, /destination/heritage/place/<slug>` |
| Дархан цаазат газар | `cate2.aspx` | 18 | 17 | 1 | 0 | 5,206 | 15 | destination (ДЦГ) | `/destination/<slug>` |
| Байгалийн нөөц газар | `cate3.aspx` | 19 | 19 | 0 | 0 | 5,179 | 18 | destination (БНГ) | `/destination/<slug>` |
| Байгалийн цогцолбор газар | `cate4.aspx` | 22 | 22 | 0 | 0 | 7,340 | 22 | destination (БЦГ) | `/destination/<slug>` |
| Байгалийн дурсгалт газар | `cate5.aspx` | 22 | 20 | 2 | 0 | 8,027 | 14 | destination (БДГ) | `/destination/<slug>` |
| Рашаан сувилал | `cate8.aspx` | 29 | 26 | 3 | 0 | 8,686 | 19 | destination (рашаан) | `/destination/<slug>` |
| Хотын дурсгалт газар | `cate9.aspx` | 146 | 117 | 29 | 0 | 25,635 | 110 | heritagePlace / destination | `/destination/heritage/place/<slug>` |
| Монгол орны ан амьтан | `cate10.aspx` | 131 | 125 | 6 | 0 | 53,319 | 124 | species* (ан амьтан) | `/about/nature/wildlife/<slug>*` |
| Монгол орны шувууд | `cate11.aspx` | 467 | 64 | 403 | 0 | 26,642 | 467 | species* (шувуу) | `/about/nature/birds/<slug>*` |
| Монгол орны ургамал | `cate12.aspx` | 91 | 72 | 19 | 0 | 15,048 | 51 | species* (ургамал) | `/about/nature/plants/<slug>*` |
| МУ-ын аймаг, сум, дүүрэг | `cate13.aspx` | 366 | 340 | 26 | 0 | 89,659 | 324 | province / soum* | `/province/<aimag>, /province/<aimag>/<sum>*` |
| Монголын түүх | `cate14.aspx` | 117 | 116 | 1 | 0 | 95,585 | 115 | story (түүх) | `/stories/<slug>` |
| Монголчуудын шашин шүтлэг | `cate15.aspx` | 102 | 87 | 15 | 0 | 37,537 | 82 | story (шашин) | `/stories/<slug>` |
| Монгол зан заншил, соёлын өв | `cate16.aspx` | 129 | 125 | 4 | 0 | 63,892 | 132 | story (зан заншил) | `/stories/<slug>` |
| Музей, театр, соёлын төв | `cate17.aspx` | 62 | 49 | 13 | 0 | 19,408 | 65 | destination (музей, театр) | `/destination/<slug>` |
| Эвент | `cate20.aspx` | 34 | 16 | 18 | 0 | 10,517 | 42 | event | `/events/<slug>*` |
| Зочид буудал | `cate21.aspx` | 110 | 0 | 110 | 0 | 2,754 | 91 | localProvider (hotel) | `/plan/accommodation/<slug>*` |
| Жуулчны бааз | `cate22.aspx` | 256 | 55 | 201 | 0 | 16,881 | 94 | localProvider (ger-camp) | `/plan/accommodation/<slug>*` |
| Аяллын хөтчийн лавлах | `cate25.aspx` | 21 | 0 | 0 | 21 | 0 | 0 | — (хувийн мэдээлэл) | `—` |
| Гайхамшигт дэлхий | `cate27.aspx` | 3 | 0 | 0 | 3 | 4,615 | 3 | — (гадаад) | `—` |
| Улс орнууд | `cate28.aspx` | 5 | 0 | 0 | 5 | 2,409 | 1 | — (гадаад) | `—` |
| Мэдээ мэдээлэл (News.aspx, 46 хуудас) | `News.aspx` | 2,290 | 293 | 396 | 1,601 | 626,877 | 761 | story | `/stories/<slug>` |
| **Нийт** | | **4,893** | **1,966** | **1,297** | **1,630** | **1,244,502** | **2,834** | | |

`*` = одоо байхгүй, шинээр хийх төрөл эсвэл route. Хаягийн slug-ийг гарчгаас кирилл → латин (`ө, ү → u`, `х → kh`) дүрмээр үүсгэсэн. Давхцсан slug-д аймгийн нэрийг залгасан. Хаяг бүр CSV-ийн `шинэ_url` баганад байна.

Tours.aspx нь нийтлэл биш, joinme.mn-ийн 7 бүтээгдэхүүний холбоос (Бангкок, Токио, Турк, Бээжин, Балба, намрын аялал, ATB). Бүгд гадаад аялал тул **АЛГАСАХ**. CSV-д оруулаагүй, redirect нь `Tours.aspx → https://joinme.mn/`.

### Ангилах дүрэм (автомат, дараа нь гар аргаар түүвэрлэж шалгасан)

- **АЛГАСАХ**: cate27 Гайхамшигт дэлхий, cate28 Улс орнууд. cate25 хөтчийн лавлахад хувь хүний утас, имэйл, нас байгаа тул дэлгэрэнгүйг нь татаагүй. Мэдээний дотроос:
  - хуучирсан үйл явдлын мэдээ: 1,007
  - гадаад сэдэв: 402
  - хуучирсан богино мэдээ: 171
  - гарчигт тодорхой он заасан: 21
  - «Хуучирсан үйл явдлын мэдээ» гэдэг нь гарчиг нь мэдээний үйл үгээр төгссөн (‑лаа, ‑жээ, ‑на, ‑в…) бөгөөд 300 үгээс богино мэдээ. Жишээ: «5000 хүн Туул голыг цэвэрлэнэ», «Тэмээний баяр удахгүй болно».
- **ШАЛГАХ**:
  - богино: 559
  - Буудал/бааз: богино: 206
  - Мэдээ: хуучирсан байж болох: 170
  - Мэдээ: үйл явдлын мэдээ боловч урт: 100
  - Буудал/бааз: агуулга хоосон: 73
  - Мэдээ: Монголтой холбоо тодорхойгүй: 53
  - Мэдээ: богино: 34
  - Мэдээ: TIC дотор давхардсан: 31
  - Буудал/бааз: фэйсбүүк холбоос хуучирсан байж болно: 19
  - TIC дотор давхардсан: 18
  - өнгөрсөн огноо: 13
  - Буудал/бааз: үнэ хуучирсан байж болно: 9
  - Мэдээ: гарчигт тодорхой он заасан: 7
  - Буудал/бааз: үнэ, фэйсбүүк холбоос хуучирсан байж болно: 4
  - Мэдээ: орос хэл дээрх нийтлэл: 1
- Шувууны 467 нийтлэлийн 403 нь 80 үгээс богино (дунджаар 19 үг: нэр, латин нэр, нэг зураг). Үүнийг нийтлэл биш, **зурагтай зүйлийн каталог** байдлаар species төрөлд бүгдийг оруулахыг санал болгож байна. Тэгвэл ШАЛГАХ-ын 403-ыг ХУУЛАХ гэж тооцож болно.
- Буудал, баазын мэдээлэл ихэвчлэн бүтэцтэй талбарт (гэр/байшингийн тоо, байршил, фэйсбүүк, од, тав тух) хадгалагдсан, тайлбар нь хоосон эсвэл богино. Утас, үнэ, фэйсбүүк холбоос хуучирсан байж болох тул эзэмшигчээр баталгаажуулах шаардлагатай.
- Мэдээний огноо: 2010–2015 онд 2,063, 2016-аас хойш 227. Мэдээний ХУУЛАХ 293 нь хуучирдаггүй сэдэвтэй (жишээ нь «Жижигхэн Монгол морь», «Ямаан усны бичээс») боловч нэг бүрчлэн гүйлгэж харах хэрэгтэй.

## Contentful төрөл, цэсний санал

| Төрөл | ХУУЛАХ | ШАЛГАХ | Тайлбар |
|---|--:|--:|---|
| destination | 399 | 70 | Байгалийн газар, тусгай хамгаалалттай газар, рашаан, музей. `protectedStatus` (ДЦГ/БЦГ/БНГ/БДГ), `tags` талбар нэмэх |
| heritagePlace | 273 | 28 | Хийд, хөшөө, хадны зураг, хиргисүүр, балгас, хотын дурсгал |
| story | 622 | 416 | Түүх, шашин, зан заншил, хуучирдаггүй мэдээ. `topic` талбараар ангилна |
| species* | 261 | 428 | **Шинэ төрөл.** name, latinName, group (ан амьтан/шувуу/ургамал/загас/шавж), redListStatus, image, body, source |
| province | 20 | 1 | 21 аймаг. Ховд, Улаанбаатар, Дархан-Уул аль хэдийн бий, нэгтгэнэ |
| soum* | 320 | 25 | **Шинэ төрөл.** 339 сум + 6 дүүрэг. province холбоос, center, area, population, body |
| event | 16 | 18 | Баяр наадам. startDate нь ихэнхдээ хуучирсан тул жил бүр давтагддаг эсэхээр шалгана |
| localProvider | 55 | 311 | Буудал (providerType=hotel), бааз (providerType=ger-camp). Гэр/байшингийн тоо, тав тух → services |

Нэгтгэх шаардлагатай давхардал (Contentful-д entry бий, TIC-ийн бичвэрээр дүүргэнэ):

| TIC нийтлэл | Contentful entry | Хаяг |
|---|---|---|
| [АРВАН ГУРАВДУГААР ЗУУН ЦОГЦОЛБОР](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=407) (284 үг) | destination «13-р зуун цогцолбор» | `/destination/13th-century` |
| [БУРХАН ХАЛДУН (ДАРХАН ЦААЗАТ ГАЗАР, ТӨРИЙН ТАХИЛГАТ УУЛ)](https://www.touristinfocenter.mn/cate2_more.aspx?ItemID=63) (579 үг) | heritagePlace «Бурхан Халдун уул & хүрээлэн буй нутаг» | `/destination/heritage/place/burkhan-khaldun` |
| [ГОРХИ ТЭРЭЛЖ](https://www.touristinfocenter.mn/cate4_more.aspx?ItemID=3) (469 үг) | destination «Тэрэлж» | `/destination/terelj` |
| [ОРХОНЫ ХӨНДИЙ](https://www.touristinfocenter.mn/cate4_more.aspx?ItemID=9) (435 үг) | heritagePlace «Орхоны хөндийн соёлын дурсгал» | `/destination/heritage/place/orkhony-khundii` |
| [ХӨВСГӨЛ НУУРЫН АЙ САВ](https://www.touristinfocenter.mn/cate4_more.aspx?ItemID=18) (647 үг) | destination «Хөвсгөл нуур» | `/destination/khuvsgul-nuur` |
| [ЖАНЖИН Д.СҮХБААТАРЫН ТАЛБАЙ БА ХӨШӨӨ](https://www.touristinfocenter.mn/cate9_more.aspx?ItemID=20) (480 үг) | destination «Сүхбаатарын талбай» | `/destination/sukhbaataryn-talbai` |
| [ДАРХАН-УУЛ АЙМАГ](https://www.touristinfocenter.mn/cate13_more.aspx?ItemID=10) (254 үг) | destination «Дархан-Уул аймаг» | `/destination/darkhan-uul` |
| [ХОВД АЙМАГ](https://www.touristinfocenter.mn/cate13_more.aspx?ItemID=23) (280 үг) | province «Ховд аймаг» | `/province/khovd` |

Мөн 120 нийтлэлийн нэр Travel Hub-ийн кодын статик карт, хэсгүүдэд дурдагддаг (жишээ нь «Амарбаясгалант хийд», «Хонгорын элс», «Буйр нуур»). Эдгээрт тусдаа хуудас одоогоор байхгүй тул шинээр үүсгэвэл давхардал үүсэхгүй, харин картыг шинэ хуудас руу холбоно. Тэрэлжийн 30 орчим бааз, Улаанбаатарын буудлууд CSV-д «холбоотой» гэж тэмдэглэгдсэн (тухайн газрын хуудсанд «Байрлах газар» блокоор холбох).

## Шинэ дэд хуудсууд

| Хуудас | Санал болгох хаяг | Цэс | Агуулга |
|---|---|---|---|
| Ан амьтан | `/about/nature/wildlife` + `/[slug]` | Монголыг нээ › Байгаль | 131 (хөхтөн, хэвлээр явагч, загас, шавж; TypeID 1–4) |
| Шувууд | `/about/nature/birds` + `/[slug]` | Монголыг нээ › Байгаль | 467 (ихэнх нь богино каталог) |
| Ургамал | `/about/nature/plants` + `/[slug]` | Монголыг нээ › Байгаль | 91 |
| Музей, театр | `/things-to-do/culture/museums` (жагсаалт, дэлгэрэнгүй нь `/destination/<slug>`) | Үзэх, хийх › Соёл | 62 |
| Сумд, дүүрэг | `/province/<aimag>/<sum>` (аймгийн хуудсанд жагсаалт) | Очих газар › Аймгууд | 345 |
| Арга хэмжээний дэлгэрэнгүй | `/events/<slug>` (одоо event-ийн дэлгэрэнгүй route алга) | Арга хэмжээ, баяр наадам | 34 |
| Байрлах газрын дэлгэрэнгүй | `/plan/accommodation/<slug>` (+ аймаг, төрлийн шүүлтүүр) | Аялал төлөвлөх › Байрлах газар | 366 |
| Шашин шүтлэг (сонголттой) | `/about/religion` эсвэл `/about/culture` дотор блок | Түүх & өв | 102 |

Одоо байгаа хуудсууд жагсаалтаар дүүрнэ: `/destination/strictly-protected` (18), `/nature-reserves` (19), `/national-parks` (22), `/natural-monuments` (22), `/things-to-do/wellness` (29 рашаан), `/destination/heritage` (≈300), `/about/history` (117).

## Тусдаа хуудасгүй картуудыг дүүргэх

[cards-without-pages.md](../section-layout/cards-without-pages.md)-ийн 239 картын **84**-д тохирох TIC нийтлэл олдсон (нэрээр автоматаар тулгаж, гар аргаар шалгасан; 9 буруу тааралтыг хасаж, түлхүүр үгийн хайлтаар 40 тааралт нэмсэн). Үлдсэн картууд нь ихэвчлэн орчин үеийн сэдэв (кофе шоп, хип хоп, дижитал) эсвэл аяллын санал тул TIC-д агуулга алга.

| # | Карт | Санал болгосон хаяг | TIC нийтлэл | Үг |
|--:|---|---|---|--:|
| 3 | Цагийн бүс & Мөнгөн тэмдэгт | `/stories/tsagiin-bus-mungun-temdegt` | [МОНГОЛЫН МӨНГӨН ТЭМДЭГТИЙН ТҮҮХ](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=114) | 1818 |
| 6 | Хамгийн өндөр цэг | `/stories/khamgiin-undur-tseg` | [МӨНХ ЦАСТ ХАМГИЙН ӨНДӨР ОРГИЛУУД](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=421) | 160 |
| 8 | Төрийн далбаа & Соёмбо | `/stories/turiin-dalbaa-soyombo` | [ТУЛГАР ТӨРИЙН АНХНЫ ДАЛБАА](https://www.touristinfocenter.mn/News_more.aspx?CateID=0&NewsID=420) | 179 |
| 27 | Морин хуур ба Уртын дуу | `/stories/morin-khuur-ba-urtyn-duu` | [МОРИН ХУУР](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=15) | 377 |
| 30 | Хадны сүг зураг | `/stories/khadny-sug-zurag` | [БИЧИГТ ХАДНЫ ЗУРАГ](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=274) | 748 |
| 32 | Хархорум хотын туурь | `/stories/kharkhorum-khotyn-tuuri` | [ХАРХОРУМ ХОТ](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=38) | 1861 |
| 33 | Түрэгийн гэрэлт хөшөөнүүд | `/stories/turegiin-gerelt-khushuunuud` | [ТОНЬЮКУКЫН ГЭРЭЛТ ХӨШӨӨ (ТҮҮХ СОЁЛЫН ДУРСГАЛТ ГАЗАР)](https://www.touristinfocenter.mn/cate5_more.aspx?ItemID=11) | 3036 |
| 34 | Хүн чулуун дурсгалууд | `/stories/khun-chuluun-dursgaluud` | [ХҮН ЧУЛУУН ДУРСГАЛ](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=413) | 258 |
| 35 | Морин хуур & Икэл | `/stories/morin-khuur-ikel` | [МОРИН ХУУР](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=15) | 377 |
| 36 | Хөөмийн гайхамшиг | `/stories/khuumiin-gaikhamshig` | [ХӨӨМЭЙ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=20) | 361 |
| 39 | Цам харайх ёслол | `/stories/tsam-kharaikh-yoslol` | [ЦАМ ХАРАЙХ](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=66) | 985 |
| 41 | Монголын нууц товчоо (1240 он) | `/stories/mongolyn-nuuts-tovchoo` | [МОНГОЛЫН НУУЦ ТОВЧООНЫ ТҮҮХ](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=123) | 473 |
| 42 | Жангар & Гэсэр тууль | `/stories/jangar-geser-tuuli` | [ТУУЛЬ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=108) | 896 |
| 50 | Монгол дээл & Бүс | `/stories/mongol-deel-bus` | [МОНГОЛ ДЭЭЛНИЙ СОЁЛ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=114) | 494 |
| 53 | Амарбаясгалант хийд | `/stories/amarbayasgalant-khiid` | [АМАРБАЯСГАЛАНТ ХИЙД](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=525) | 670 |
| 54 | Эрдэнэ зуу цогцолбор | `/stories/erdene-zuu-tsogtsolbor` | [ЭРДЭНЭ ЗУУ](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=74) | 255 |
| 55 | Гандантэгчэнлин & Чойжин лам | `/stories/gandantegchenlin-choijin-lam` | [ЧОЙЖИН ЛАМ](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=42) | 165 |
| 59 | Бэр гуйх & Сүй тавих | `/stories/ber-guikh-sui-tavikh` | [БЭР ГУЙХ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=40) | 165 |
| 60 | Шинэ гэр барих | `/stories/shine-ger-barikh` | [МОНГОЛ ГЭР БАРИХ ДАРААЛАЛ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=93) | 173 |
| 61 | Гал тахих ёслол | `/stories/gal-takhikh-yoslol` | [ГАЛЫН ТЭНГЭР ТАХИХ ЁСЛОЛ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=158) | 337 |
| 62 | Цайны дээж барих | `/stories/tsainy-deej-barikh` | [ЦАЙНЫ ДЭЭЖ ӨРГӨХ ЁСОН БА ЦЭЭР](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=153) | 356 |
| 63 | Хөөрөг зөрүүлэх | `/stories/khuurug-zuruulekh` | [ХӨӨРӨГ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=33) | 698 |
| 67 | Ул боов & Таваг засах | `/stories/ul-boov-tavag-zasakh` | [УЛ БООВ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=171) | 246 |
| 69 | Хурдан морины уралдаан | `/stories/khurdan-moriny-uraldaan` | [ХУРДАН МОРИНЫ УРАЛДААН](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=90) | 378 |
| 70 | Үндэсний сур харваа | `/stories/undesnii-sur-kharvaa` | [МОНГОЛ СУРЫН ХАРВАА](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=91) | 1256 |
| 75 | Өндөр гэгээн Занабазарын өв | `/stories/undur-gegeen-zanabazaryn-uv` | [ӨНДӨР ГЭГЭЭН ЗАНАБАЗАР](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=88) | 548 |
| 80 | Гүү барих & Үрс гаргах | `/stories/guu-barikh-urs-gargakh` | [ГҮҮНИЙ ҮРС ГАРГАХ БУЮУ ГҮҮ БАРИХ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=72) | 329 |
| 81 | Бүргэдийн баяр | `/stories/burgediin-bayar` | [БҮРГЭДИЙН БАЯР](https://www.touristinfocenter.mn/News_more.aspx?CateID=0&NewsID=4387) | 261 |
| 82 | Түмэн тэмээний баяр | `/stories/tumen-temeenii-bayar` | [ТҮМЭН ТЭМЭЭНИЙ БАЯР](https://www.touristinfocenter.mn/cate20_more.aspx?ItemID=6) | 1343 |
| 88 | Хонгорын элс | `/stories/khongoryn-els` | [ХОНГОРЫН ЭЛС](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=39) | 616 |
| 89 | Баянзаг & Улаан хавцал | `/stories/bayanzag-ulaan-khavtsal` | [БАЯНЗАГ](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=60) | 170 |
| 93 | Шилийн Богд & Ганга нуур | `/stories/shiliin-bogd-ganga-nuur` | [ШИЛИЙН БОГД](https://www.touristinfocenter.mn/cate5_more.aspx?ItemID=7) | 213 |
| 94 | Алтай Таван Богд | `/stories/altai-tavan-bogd` | [АЛТАЙ ТАВАН БОГД](https://www.touristinfocenter.mn/cate4_more.aspx?ItemID=1) | 486 |
| 95 | Отгонтэнгэр хайрхан | `/stories/otgontenger-khairkhan` | [ОТГОНТЭНГЭР УУЛ](https://www.touristinfocenter.mn/cate2_more.aspx?ItemID=56) | 478 |
| 98 | Шинэс ба хушин ой | `/stories/shines-ba-khushin-oi` | [ШИНЭС МОД](https://www.touristinfocenter.mn/cate12_more.aspx?ItemID=70) | 128 |
| 101 | Увс нуурын хотгор | `/stories/uvs-nuuryn-khotgor` | [УВС НУУРЫН АЙ САВ](https://www.touristinfocenter.mn/cate2_more.aspx?ItemID=57) | 296 |
| 105 | Мазаалай баавгай | `/stories/mazaalai-baavgai` | [МАЗААЛАЙ (URUS ARCTOS GOBIENSIS SOCOLOVET ORLOV, 1992)](https://www.touristinfocenter.mn/cate10_more.aspx?ItemID=5) | 1890 |
| 106 | Цоохор ирвэс & Тахь | `/stories/tsookhor-irves-takhi` | [ЦООХОР ИРВЭС (PANTHERA UNICIA SCHREBER, 1775)](https://www.touristinfocenter.mn/cate10_more.aspx?ItemID=13) | 1465 |
| 107 | Хавтгай & Хулан | `/stories/khavtgai-khulan` | [ХАВТГАЙ ТЭМЭЭ (CAMELUS FERUS PRZEWALSKI, 1883)](https://www.touristinfocenter.mn/cate10_more.aspx?ItemID=99) | 1789 |
| 109 | Байгалийн халуун рашаанууд | `/stories/baigaliin-khaluun-rashaanuud` | [ЦЭНХЭРИЙН ХАЛУУН РАШААН](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=442) | 172 |
| 113 | Хэрмэн цав & Нэмэгтийн хөндий | `/stories/khermen-tsav-nemegtiin-khundii` | [ХЭРМЭН ЦАВ](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=44) | 130 |
| 114 | Бүтэц ба эд анги | `/stories/butets-ba-ed-angi` | [МОНГОЛ ГЭРИЙН БҮРДЭЛ ХЭСГҮҮД](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=94) | 1476 |
| 115 | Орон зайн бэлгэдэл | `/stories/oron-zain-belgedel` | [МОНГОЛ ГЭРИЙН ДОТОРХИ ЗОХИОН БАЙГУУЛАЛТ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=95) | 233 |
| 116 | Эсгий бүрээс | `/stories/esgii-burees` | [ЭСГИЙ ХИЙХ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=99) | 303 |
| 117 | Адуу ба Тэмээ | `/stories/aduu-ba-temee` | [ТАВАН ХОШУУ МАЛ - АДУУ](https://www.touristinfocenter.mn/cate10_more.aspx?ItemID=87) | 1072 |
| 127 | Монгол эмээл, хазаар | `/stories/mongol-emeel-khazaar` | [ЭМЭЭЛ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=82) | 270 |
| 132 | Шагайн наадгай | `/stories/shagain-naadgai` | [ТОГЛООМ НААДГАЙ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=89) | 1340 |
| 133 | Оньсон тоглоом | `/stories/onison-togloom` | [ОЮУНТҮЛХҮҮР ТОГЛООМ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=86) | 137 |
| 134 | Алаг мэлхий өрөх | `/stories/alag-melkhii-urukh` | [АЛАГ МЭЛХИЙ ӨРӨХ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=84) | 378 |
| 141 | Өрөм & Зөөхий | `/stories/urum-zuukhii` | [ӨРӨМ ЗӨӨХИЙ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=147) | 245 |
| 142 | Ааруул & Ээзгий | `/stories/aaruul-eezgii` | [ААРУУЛ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=143) | 112 |
| 143 | Бяслаг & Аарц | `/stories/byaslag-aarts` | [БЯСЛАГ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=146) | 163 |
| 144 | Бууз & Банш | `/stories/buuz-bansh` | [МОНГОЛ ХООЛ - БУУЗ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=140) | 407 |
| 149 | Булганы сайхан айраг | `/stories/bulgany-saikhan-airag` | [АЙРАГ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=145) | 334 |
| 150 | Сүүтэй цай & Хийц | `/stories/suutei-tsai-khiits` | [СҮҮТЭЙ ЦАЙ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=152) | 442 |
| 152 | Цайны дээж өргөх | `/stories/tsainy-deej-urgukh` | [ЦАЙНЫ ДЭЭЖ ӨРГӨХ ЁСОН БА ЦЭЭР](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=153) | 356 |
| 159 | Язгуур угсаа | `/stories/yazguur-ugsaa` | [МОНГОЛ УГСААТАН, ТҮҮНИЙ БҮРЭЛДЭХҮҮН](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=57) | 259 |
| 163 | Буриад зоны өв | `/stories/buriad-zony-uv` | [БУРИАД](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=61) | 761 |
| 164 | Казак түмний соёл | `/stories/kazak-tumnii-soyol` | [КАЗАК ҮНДЭСТНИЙ СОЁЛ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=7) | 478 |
| 165 | Босоо монгол бичиг | `/stories/bosoo-mongol-bichig` | [УЙГАРЖИН МОНГОЛ БИЧИГ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=17) | 315 |
| 169 | Хөөрөг зөрүүлэх | `/stories/khuurug-zuruulekh` | [ХӨӨРӨГ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=33) | 698 |
| 174 | Хонгорын элс | `/destination/khongoryn-els` | [ХОНГОРЫН ЭЛС](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=39) | 616 |
| 176 | Алтай Таван Богд | `/destination/altai-tavan-bogd` | [АЛТАЙ ТАВАН БОГД](https://www.touristinfocenter.mn/cate4_more.aspx?ItemID=1) | 486 |
| 178 | Алтай Таван Богдын авиралт ба мөсөн голын трек | `/local/experiences/altai-tavan-bogdyn-aviralt-ba` | [АЛТАЙ ТАВАН БОГД](https://www.touristinfocenter.mn/cate4_more.aspx?ItemID=1) | 486 |
| 179 | Дархадын хотгор, Хөвсгөлийн тайгын морин аялал | `/local/experiences/darkhadyn-khotgor-khuvsguliin-taigyn-morin` | [ДАРХАДЫН ХОТГОР](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=62) | 250 |
| 186 | Эрдэнэ зуу хийд | `/destination/erdene-zuu-khiid` | [ЭРДЭНЭ ЗУУ](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=74) | 255 |
| 187 | Чингис хааны морьт хөшөө цогцолбор | `/destination/chingis-khaany-morit-khushuu-tsogtsolbor` | [ЦОНЖИНБОЛДОГ - ЧИНГИС ХААНЫ МОРЬТ ХӨШӨӨ](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=48) | 346 |
| 190 | Цагаан суварга ба Цахиуртын хөндий | `/destination/tsagaan-suvarga-ba-tsakhiurtyn-khundii` | [ЦАГААН СУВАРГА](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=46) | 147 |
| 191 | Морин хуур, хөөмэйн уламжлалт урлаг | `/destination/morin-khuur-khuumein-ulamjlalt-urlag` | [МОРИН ХУУР](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=15) | 377 |
| 194 | Хөхүүрийн шимийн айраг амтлах аялал | `/local/experiences/khukhuuriin-shimiin-airag-amtlakh-ayalal` | [АЙРАГ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=145) | 334 |
| 196 | Монгол бууз, хуушуур чимхэх мастеркласс | `/local/experiences/mongol-buuz-khuushuur-chimkhekh-masterklass` | [МОНГОЛ ХООЛ - БУУЗ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=140) | 407 |
| 199 | Булганы Сайхан сумын айраг исгэх соёл | `/local/experiences/bulgany-saikhan-sumyn-airag-isgekh` | [АЙРАГ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=145) | 334 |
| 201 | Уламжлалт өрөм, ааруул боловсруулах | `/local/experiences/ulamjlalt-urum-aaruul-bolovsruulakh` | [ААРУУЛ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=143) | 112 |
| 204 | Цэнхэрийн халуун рашааны спа ретрит | `/local/experiences/tsenkheriin-khaluun-rashaany-spa-retrit` | [ЦЭНХЭРИЙН ХАЛУУН РАШААН](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=442) | 172 |
| 205 | Хамарын хийд ба Дэлхийн энергийн төв | `/local/experiences/khamaryn-khiid-ba-delkhiin-energiin` | [ХАМАРЫН ХИЙД](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=544) | 1045 |
| 209 | Хустайн нурууны зэрлэг тахь ажиглалт | `/destination/khustain-nuruuny-zerleg-takhi-ajiglalt` | [ХУСТАЙН НУРУУ](https://www.touristinfocenter.mn/cate4_more.aspx?ItemID=20) | 304 |
| 210 | Алтайн нурууны цоохор ирвэсийн мөрөөр | `/destination/altain-nuruuny-tsookhor-irvesiin-muruur` | [ЦООХОР ИРВЭС (PANTHERA UNICIA SCHREBER, 1775)](https://www.touristinfocenter.mn/cate10_more.aspx?ItemID=13) | 1465 |
| 211 | Говийн Их Дархан Цаазат Газар (Мазаалай) | `/destination/goviin-ikh-darkhan-tsaazat-gazar` | [ГОВИЙН ИХ ДАРХАН ГАЗАР А, Б](https://www.touristinfocenter.mn/cate2_more.aspx?ItemID=52) | 279 |
| 215 | Алтайн бүргэдийн баяр | `/recommendation/altain-burgediin-bayar` | [БҮРГЭДИЙН БАЯР](https://www.touristinfocenter.mn/News_more.aspx?CateID=0&NewsID=4387) | 261 |
| 216 | Түмэн тэмээний баяр | `/recommendation/tumen-temeenii-bayar` | [ТҮМЭН ТЭМЭЭНИЙ БАЯР](https://www.touristinfocenter.mn/cate20_more.aspx?ItemID=6) | 1343 |
| 217 | Хөх сувд - Хөвсгөлийн мөсний баяр | `/recommendation/khukh-suvd-khuvsguliin-musnii-bayar` | [ХӨХ СУВД - ХӨВСГӨЛИЙН МӨСНИЙ БАЯР](https://www.touristinfocenter.mn/cate20_more.aspx?ItemID=5) | 490 |
| 218 | Уламжлалт Цагаан сарын баяр | `/recommendation/ulamjlalt-tsagaan-saryn-bayar` | [ЦАГААН САРЫН БАЯР](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=116) | 1835 |
| 221 | Нүүдэлчдийн гэр барьж, өв соёлд суралцах хором | `/local/experiences/nuudelchdiin-ger-barij-uv-soyold` | [МОНГОЛ ГЭР БАРИХ ДАРААЛАЛ](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=93) | 173 |
| 232 | Суварга хайрханы нууц сүмбэр | `/destination/suvarga-khairkhany-nuuts-sumber` | [СУВАРГА ХАЙРХАН (ТӨРИЙН ТАХИЛГАТ УУЛ)](https://www.touristinfocenter.mn/cate1_more.aspx?ItemID=157) | 199 |

## Зураггүй газруудыг дүүргэх

[images.md](../section-layout/images.md)-ийн «Түр хассан» 158 газрын **41**-д TIC-ийн нийтлэлд байгаа зураг тохирно. Ашиглахаас өмнө зургийг нүдээр шалгаж, эрхийг тодруулах хэрэгтэй (доорх эрсдэлийг үз).

| Хуудас | Карт | TIC нийтлэл | Зургийн тоо | Эхний зураг |
|---|---|---|--:|---|
| /about/culture | Морин хуур ба Уртын дуу | МОРИН ХУУР | 1 | https://www.touristinfocenter.mn/Images/Cate/1/4cv3voua.jpg |
| /about/culture | Орхоны хөндий & Бурхан Халдун | ОРХОНЫ ХӨНДИЙ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/tbio0d0g.jpg |
| /about/culture | Монгол наадам & Шагайн харваа | ШАГАЙН ХАРВАА | 2 | https://www.touristinfocenter.mn/Images/Cate/1/x25mjlxq.jpg |
| /about/culture | Хүн чулуун дурсгалууд | ХҮН ЧУЛУУН ДУРСГАЛ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Хүн чулуу.jpg |
| /about/culture | Морин хуур & Икэл | МОРИН ХУУР | 1 | https://www.touristinfocenter.mn/Images/Cate/1/4cv3voua.jpg |
| /about/culture | Хөөмийн гайхамшиг | ХӨӨМЭЙ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Хөөмий.jpg |
| /about/culture | Цам харайх ёслол | ЦАМ ХАРАЙХ | 2 | https://www.touristinfocenter.mn/Images/Cate/1/Цам 1.jpg |
| /about/culture | Жангар & Гэсэр тууль | ТУУЛЬ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Тууль хайлах.jpg |
| /about/culture | Үндэсний хувцас | МОНГОЛ ҮНДЭСНИЙ ХУВЦАС | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Монгол малгай.jpg |
| /about/culture | Монгол дээл & Бүс | МОНГОЛ ДЭЭЛНИЙ СОЁЛ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Монгол дээл.jpg |
| /about/culture | Амарбаясгалант хийд | АМАРБАЯСГАЛАНТ ХИЙД | 1 | https://www.touristinfocenter.mn/Images/Cate/1/5jtdmnun.jpg |
| /about/traditions | Хөөрөг зөрүүлэх | ХӨӨРӨГ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Хөөрөг даалин.jpg |
| /about/traditions | Үндэсний сур харваа | МОНГОЛ СУРЫН ХАРВАА | 1 | https://www.touristinfocenter.mn/Images/Cate/1/bwct43jx.jpg |
| /about/traditions | Өндөр гэгээн Занабазарын өв | ӨНДӨР ГЭГЭЭН ЗАНАБАЗАР | 1 | https://www.touristinfocenter.mn/Images/Cate/1/insyyj5m.jpg |
| /about/traditions | Гүү барих & Үрс гаргах | ГҮҮНИЙ ҮРС ГАРГАХ БУЮУ ГҮҮ БАРИХ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/wm4jacro.jpg |
| /about/nature | Мазаалай баавгай | МАЗААЛАЙ (URUS ARCTOS GOBIENSIS SOCOLOVET ORLOV, 1992) | 1 | https://www.touristinfocenter.mn/Images/Cate/1/4hrt22eh.jpg |
| /about/nature | Цоохор ирвэс & Тахь | ЦООХОР ИРВЭС (PANTHERA UNICIA SCHREBER, 1775) | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Цоохор ирвэс.jpg |
| /about/nature | Хавтгай & Хулан | ХАВТГАЙ ТЭМЭЭ (CAMELUS FERUS PRZEWALSKI, 1883) | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Хавтгай.jpg |
| /about/nature | Байгалийн халуун рашаанууд | ЦЭНХЭРИЙН ХАЛУУН РАШААН | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Цэнхэрийн халуун рашаан.jpg |
| /about/nomadic-life | Орон зайн бэлгэдэл | МОНГОЛ ГЭРИЙН ДОТОРХИ ЗОХИОН БАЙГУУЛАЛТ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Монгол гэрийн зохион байгуулалт.jpg |
| /about/nomadic-life | Монгол эмээл, хазаар | ЭМЭЭЛ | 2 | https://www.touristinfocenter.mn/Images/Cate/1/Эмээл.jpg |
| /about/food | Махан хоол | МОНГОЛЧУУДЫН МАХАН ХООЛ | 2 | https://www.touristinfocenter.mn/Images/Cate/1/Махан хоол.jpg |
| /about/food | Цагаан идээ | ЦАГААН ИДЭЭ | 12 | https://www.touristinfocenter.mn/Images/Cate/1/Цагаан идээ - Ааруул.jpg |
| /about/food | Өрөм & Зөөхий | ӨРӨМ ЗӨӨХИЙ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/lbd0i2ss.jpg |
| /about/food | Ааруул & Ээзгий | ААРУУЛ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/m3dc1qik.jpg |
| /about/food | Бяслаг & Аарц | БЯСЛАГ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/vaeha3s1.jpg |
| /about/food | Бууз & Банш | МОНГОЛ ХООЛ - БУУЗ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Бууз.jpg |
| /about/food | Айраг | АЙРАГ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/ysusfeqq.jpg |
| /about/food | Булганы сайхан айраг | АЙРАГ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/ysusfeqq.jpg |
| /about/food | Сүүтэй цай & Хийц | СҮҮТЭЙ ЦАЙ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Сүүтэй цай.jpg |
| /about/food | Цайны дээж өргөх | ЦАЙНЫ ДЭЭЖ ӨРГӨХ ЁСОН БА ЦЭЭР | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Deej orgoh.jpg |
| /about/people | Язгуур угсаа | МОНГОЛ УГСААТАН, ТҮҮНИЙ БҮРЭЛДЭХҮҮН | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Монгол угсаатан.jpg |
| /about/people | Буриад зоны өв | БУРИАД | 2 | https://www.touristinfocenter.mn/Images/Cate/1/poqyqfuk.jpg |
| /about/people | Хөөрөг зөрүүлэх | ХӨӨРӨГ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Хөөрөг даалин.jpg |
| lib/cultureData.ts | Эрдэнэ зуу хийд | ЭРДЭНЭ ЗУУ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Эрдэнэзуу.jpg |
| lib/cultureData.ts | Морин хуур, хөөмэйн уламжлалт урлаг | МОРИН ХУУР | 1 | https://www.touristinfocenter.mn/Images/Cate/1/4cv3voua.jpg |
| lib/foodData.ts | Хөхүүрийн шимийн айраг амтлах аялал | АЙРАГ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/ysusfeqq.jpg |
| lib/foodData.ts | Монгол бууз, хуушуур чимхэх мастеркласс | МОНГОЛ ХООЛ - БУУЗ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Бууз.jpg |
| lib/nomadicData.ts | Булганы Сайхан сумын айраг исгэх соёл | АЙРАГ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/ysusfeqq.jpg |
| lib/wellnessData.ts | Цэнхэрийн халуун рашааны спа ретрит | ЦЭНХЭРИЙН ХАЛУУН РАШААН | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Цэнхэрийн халуун рашаан.jpg |
| lib/wildlifeData.ts | Хустайн нурууны зэрлэг тахь ажиглалт | ХУСТАЙН НУРУУ | 1 | https://www.touristinfocenter.mn/Images/Cate/1/Хустайн нуруу 2.jpg |

## Contentful-ийн хязгаар

Space «Blank» (org Joinme.mn), нэг environment (`master`), 2 locale (`mn`, `en`). Энэ нь Free тарифын шинж: CMA-аар locale нэмэхэд 403 буцдаг. Тарифын хязгаарыг API өгдөггүй тул Contentful-ийн Free тарифын FAQ-ийн тоог ашиглав: **10,000 record (entry + asset), 25 content type, 2 locale, 2 environment, сард 100K API дуудлага, сард 50 GB asset bandwidth**.

| | Entry | Asset | Record | Хязгаарын хувь |
|---|--:|--:|--:|--:|
| Одоо (2026-10-13) | 28 | 6 | 34 | <1% |
| + ХУУЛАХ (нэгтгэлийг хассан) | +1,958 | +1,456 | 3,448 | 34% |
| + ШАЛГАХ бүгд | +1,297 | +907 | 5,652 | 57% |
| + 239 картын шинэ хуудас, 158 зураг | +239 | +158 | 6,049 | 60% |
| Content type | 13 → 15 | | | 60% (25-аас) |

Тооцоонд TIC сервер дээрх, гуравдагч сайтын болон base64 зургийг тус бүр нэг asset гэж тооцсон. Locale нэмэгдэхэд record өсдөггүй. Дүгнэлт: **record-ийн хязгаарт багтана**, 3,951 нөөц үлдэнэ.

API дуудлага: 2026-08-30-аас хойш CDA 20,592, CMA 6,018 дуудлага (≈ сард 14K CDA). Шилжүүлэлт өөрөө (entry үүсгэх, нийтлэх, asset upload, процесс) ≈ 14,045 CMA дуудлага. Нэг сард багтах ч өөр ажилтай давхцахгүйн тулд 2 сард хувааж хийх нь аюулгүй. CMA 7 хүсэлт/сек хурдны хязгаартай.

## Redirect

Нийтлэл бүрийн хуучин зам (`хуучин_url`) → шинэ хаяг (`redirect_to`) CSV-д бий. АЛГАСАХ нийтлэлийг ангиллын хуудас руу шилжүүлнэ. Ангиллын дүрэм:

| Хуучин | Шинэ | Тоо |
|---|---|--:|
| `/cate1_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/destination/landscapes`) | 453 |
| `/cate2_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/destination/strictly-protected`) | 18 |
| `/cate3_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/destination/nature-reserves`) | 19 |
| `/cate4_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/destination/national-parks`) | 22 |
| `/cate5_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/destination/natural-monuments`) | 22 |
| `/cate8_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/things-to-do/wellness`) | 29 |
| `/cate9_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/province/ulaanbaatar`) | 146 |
| `/cate10_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/things-to-do/wildlife`) | 131 |
| `/cate11_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/things-to-do/wildlife`) | 467 |
| `/cate12_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/about/nature`) | 91 |
| `/cate13_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/destination/region`) | 366 |
| `/cate14_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/about/history`) | 117 |
| `/cate15_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/about/culture`) | 102 |
| `/cate16_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/about/traditions`) | 129 |
| `/cate17_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/things-to-do/culture`) | 62 |
| `/cate20_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/things-to-do/events`) | 34 |
| `/cate21_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/plan/accommodation`) | 110 |
| `/cate22_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/plan/accommodation`) | 256 |
| `/cate25_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/local/guides`) | 21 |
| `/cate27_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `https://joinme.mn/`) | 3 |
| `/cate28_more.aspx?ItemID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `https://joinme.mn/`) | 5 |
| `/News_more.aspx?CateID=0&NewsID=<id>` | нийтлэл бүрийн `шинэ_url` (АЛГАСАХ → `/stories`) | 2,290 |
| `/cate1.aspx` (ангиллын жагсаалт) | `/destination/landscapes` | 1 |
| `/cate2.aspx` (ангиллын жагсаалт) | `/destination/strictly-protected` | 1 |
| `/cate3.aspx` (ангиллын жагсаалт) | `/destination/nature-reserves` | 1 |
| `/cate4.aspx` (ангиллын жагсаалт) | `/destination/national-parks` | 1 |
| `/cate5.aspx` (ангиллын жагсаалт) | `/destination/natural-monuments` | 1 |
| `/cate8.aspx` (ангиллын жагсаалт) | `/things-to-do/wellness` | 1 |
| `/cate9.aspx` (ангиллын жагсаалт) | `/province/ulaanbaatar` | 1 |
| `/cate10.aspx` (ангиллын жагсаалт) | `/things-to-do/wildlife` | 1 |
| `/cate11.aspx` (ангиллын жагсаалт) | `/things-to-do/wildlife` | 1 |
| `/cate12.aspx` (ангиллын жагсаалт) | `/about/nature` | 1 |
| `/cate13.aspx` (ангиллын жагсаалт) | `/destination/region` | 1 |
| `/cate14.aspx` (ангиллын жагсаалт) | `/about/history` | 1 |
| `/cate15.aspx` (ангиллын жагсаалт) | `/about/culture` | 1 |
| `/cate16.aspx` (ангиллын жагсаалт) | `/about/traditions` | 1 |
| `/cate17.aspx` (ангиллын жагсаалт) | `/things-to-do/culture` | 1 |
| `/cate20.aspx` (ангиллын жагсаалт) | `/things-to-do/events` | 1 |
| `/cate21.aspx` (ангиллын жагсаалт) | `/plan/accommodation` | 1 |
| `/cate22.aspx` (ангиллын жагсаалт) | `/plan/accommodation` | 1 |
| `/cate25.aspx` (ангиллын жагсаалт) | `/local/guides` | 1 |
| `/cate27.aspx` (ангиллын жагсаалт) | `https://joinme.mn/` | 1 |
| `/cate28.aspx` (ангиллын жагсаалт) | `https://joinme.mn/` | 1 |
| `/News.aspx` (ангиллын жагсаалт) | `/stories` | 1 |
| `/Home.aspx`, `/` | `/` | 1 |
| `/Tours.aspx` | `https://joinme.mn/` | 1 |

Жишээ (ХУУЛАХ):

```
/cate1_more.aspx?ItemID=131  →  /destination/avarga-toson-nuur
/cate1_more.aspx?ItemID=589  →  /destination/heritage/place/tal-nutgiin-akhan-duus-khushuu
/cate4_more.aspx?ItemID=21  →  /destination/tsambagarav-uul
/cate10_more.aspx?ItemID=135  →  /about/nature/wildlife/daguuryn-suvdan-khyasaa
/cate13_more.aspx?ItemID=267  →  /province/govsumber/bayantal
/cate13_more.aspx?ItemID=154  →  /province/bayankhongor/buutsagaan
/cate15_more.aspx?ItemID=24  →  /stories/jamsran-burkhan
/cate20_more.aspx?ItemID=66  →  /events/ulaanbaatar-marafon-olon-ulsyn-guilt
/News_more.aspx?CateID=0&NewsID=6443  →  /stories/13-buddagiin-neg-m
/News_more.aspx?CateID=0&NewsID=4416  →  /stories/rashaant-khot
/News_more.aspx?CateID=0&NewsID=4415  →  /stories/nen-khovor-amtad
/cate1_more.aspx?ItemID=407  →  /destination/13th-century
/cate2_more.aspx?ItemID=63  →  /destination/heritage/place/burkhan-khaldun
/cate4_more.aspx?ItemID=3  →  /destination/terelj
```

Анхаарах зүйлс:

- Хуучин зам нь query string-тэй (`?ItemID=`, `?NewsID=`) тул энгийн path redirect ажиллахгүй. Мянга мянган дүрмийг `next.config` эсвэл `vercel.json`-д бичих нь Vercel-ийн route-ийн хязгаарт тулна. **Middleware + JSON map** (CSV-ээс үүсгэнэ) эсвэл Vercel-ийн bulk redirect хэрэгтэй.
- `touristinfocenter.mn` домэйныг Vercel руу заах эсвэл хуучин IIS сервер дээр 301 дүрэм тавих эсэхийг шийдэх хэрэгтэй. Аль ч тохиолдолд Search Console-д домэйн шилжүүлэлтийг бүртгэнэ.
- **TIC сайтын алдаа**: «Зочид буудал» (cate21) жагсаалт дэлгэрэнгүй рүү `cate4_more.aspx?ItemID=<id>` гэж холбодог, жинхэнэ хуудас нь `cate21_more.aspx`. Буудлын 15 ID (2, 3, 4, 6, 7, 9, 11, 12, 14, 15, 16, 17, 18, 21, 22) байгалийн цогцолборт газрын ID-тай давхцдаг. Тэр URL нь цогцолборт газрыг харуулдаг тул цогцолборт газар руу шилжүүлнэ. Давхцаагүй 95 буудлын `cate4_more` URL хоосон хуудас буцаадаг тул буудлын шинэ хаяг руу шилжүүлж болно.

## Эрсдэл

1. **Зохиогчийн эрх (хамгийн том эрсдэл).** «Эх сурвалж» мөртэй 446 нийтлэлээс ≈300 нь «Монгол орны лавлах» (Ч.Буянбадрах эмхэтгэл), ≈40 нь «Монгол Улсын Улаан ном 2013»-аас авсан. Мэдээ нь Өдрийн сонин, medee.mn, ikon.mn-ээс давтан нийтэлсэн. Зураг: TIC сервер дээр 2,403 (эх сурвалж тодорхойгүй), гуравдагч сайтаас шууд холбосон 265 (Facebook CDN, montsame, gogo, ikon, wikimedia…). Хуулахаас өмнө эрхийг тодруулах эсвэл бичвэрийг шинээр бичих (эх сурвалжийг `sources` талбарт заах) хэрэгтэй.
2. **Хуучирсан мэдээлэл.** Мэдээний 80% нь 2010–2015 оных. Буудал, баазын утас, үнэ, од, фэйсбүүк хуудас шалгагдаагүй. Сум, аймгийн хүн ам, талбайн тоо хуучин тооллогынх байж болно. `lastUpdated` болон `reviewedBy` талбарыг бөглөж нийтлэх нь зүйтэй.
3. **Хувийн мэдээлэл.** cate25 хөтчийн лавлахад 21 хүний утас, имэйл, нас, ажлын газар байна. Шилжүүлэхгүй. Хөтчийг `localProvider`-оор зөвшөөрөлтэйгээр шинээр бүртгэнэ.
4. **Contentful API.** `/destination/[id]`, `/stories/[slug]` нь `revalidate = 240` (4 минут). 3,000+ шинэ хуудас нэмэгдэхэд ISR-ийн дахин үүсгэлт, мөлхөгч (bot) зэргээс CDA дуудлага сарын 100K хязгаарт ойртож болно. Урт revalidate эсвэл webhook-оор revalidate хийх, жагсаалтыг нэг хүсэлтээр (`limit: 1000`) татах хэрэгтэй.
5. **Автомат ангиллын алдаа.** Ангилал, аймгийн нэр, давхардлыг дүрмээр тогтоосон. Гарчгийн дээжээр шалгасан ч мэдээний ХУУЛАХ/ШАЛГАХ-ыг нэг бүрчлэн гүйлгэж харах шаардлагатай. 1,551 нийтлэлд аймаг тодорхойлогдоогүй.
6. **TIC доторх давхардал.** 98 нийтлэл ижил гарчигтай (жишээ нь «Спортын төв ордон» cate9 ба cate17-д, «Хэнтий - Дадал сум» хоёр удаа). Тэдгээрийг ШАЛГАХ гэж тэмдэглэсэн. Урт хувилбарыг нь авна.
7. **Зургийн чанар, формат.** 87 зураг HTML дотор base64-ээр, 13 нь `C:\…` эвдэрсэн замтай. Зургийн нягтрал, хэмжээг энэ удаа шалгаагүй; hero-д ашиглах бол тус бүрийг харах хэрэгтэй.
8. **Англи хувилбар.** `en` locale бий ч TIC-ийн бүх агуулга монгол хэлтэй (≈ 640K үг ХУУЛАХ). Орчуулгын ажлын хэмжээ их. Эхлээд `mn`-ээр нийтэлж, `en`-ийг fallback-аар үлдээх нь бодитой.
9. **Contentful schema өөрчлөлт.** species, soum төрөл, destination-д `protectedStatus`, `tags` талбар нэмэх нь content model-ийн өөрчлөлт. Тусдаа ажлаар, backup (`scripts/contentful/00-backup.ps1`) хийсний дараа гүйцэтгэнэ.

## CSV-ийн баганууд

`key` (cate<N>_<ItemID> эсвэл n_<NewsID>), `ангилал`, `ангиллын_нэр`, `TypeID`, `гарчиг`, `хуучин_url`, `үгийн_тоо`, `зургийн_тоо`, `эхний_зураг`, `огноо` (зөвхөн мэдээнд), `зохиогч_эх_сурвалж`, `аймаг`, `сум`, `бүтэцтэй_талбар` (буудал/баазын гэр, байшин, байршил, тав тух, од, фэйсбүүк; аймгийн хаяг), `шийдвэр`, `шалтгаан`, `contentful_төрөл`, `цэс`, `шинэ_url`, `redirect_to`, `travelhub_давхардал`, `дүүргэх_карт`, `дүүргэх_зураг`. UTF-8 (BOM-той, Excel-д шууд нээгдэнэ).

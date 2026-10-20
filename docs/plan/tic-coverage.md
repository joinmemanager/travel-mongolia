# TIC бүрэн хамрах шалгалт

> 2026-10-20. `node scripts/tic/coverage.js`. Эх: [tic-inventory.csv](tic-inventory.csv) (4893 нийтлэл) + docs/redirects/batch-*.csv.
> Contentful-д бүх шинэ entry Draft — «✅ шилжсэн» нь хаяг, entry бэлэн гэсэн үг (нийтлэгдээгүй).

## Тоо

| Ангилал | Тоо |
|---|--:|
| ✅ шилжсэн (шинэ хаягтай) | 2859 |
| ↪️ зөвхөн redirect (TIC-ийн жагсаалт, ангиллын хуудас; inventory-д ороогүй) | 35 |
| ⛔ алгассан | 1730 |
| ❓ шийдээгүй | 304 |
| **Inventory нийт** (✅ + ⛔ + ❓) | **4893** / 4893 |

### ⛔ шалтгаан

| Шалтгаан | Тоо |
|---|--:|
| хуучирсан үйл явдлын мэдээ | 1007 |
| гадаад сэдэв | 410 |
| хуучирсан богино мэдээ | 171 |
| давхардал (TIC дотор) | 50 |
| гадаад / Монголтой холбоогүй сэдэв | 46 |
| хувийн мэдээлэл (хөтчийн утас, имэйл, нас) | 21 |
| гарчигт тодорхой он заасан | 21 |
| давхардал (өмнөх багцад бий, redirect) | 2 |
| нийтлэл биш (байгууллагуудын утас, хаягийн жагсаалт) | 1 |
| орос хэл дээрх нийтлэл | 1 |

Алгассан мөр бүр redirect-тэй (ангиллын хуудас, «Түүхүүд» эсвэл нэгтгэсэн хуудас руу), 404 болохгүй.

### Ангиллаар (✅ / ⛔ / ❓)

| TIC ангилал | ✅ | ⛔ | ❓ |
|---|--:|--:|--:|
| cate1 | 451 | 2 | 0 |
| cate2 | 16 | 2 | 0 |
| cate3 | 19 | 0 | 0 |
| cate4 | 22 | 0 | 0 |
| cate5 | 22 | 0 | 0 |
| cate8 | 28 | 1 | 0 |
| cate9 | 141 | 5 | 0 |
| cate10 | 128 | 3 | 0 |
| cate11 | 467 | 0 | 0 |
| cate12 | 91 | 0 | 0 |
| cate13 | 357 | 9 | 0 |
| cate14 | 44 | 0 | 73 |
| cate15 | 0 | 0 | 102 |
| cate16 | 0 | 0 | 129 |
| cate17 | 57 | 5 | 0 |
| cate20 | 34 | 0 | 0 |
| cate21 | 110 | 0 | 0 |
| cate22 | 256 | 0 | 0 |
| cate25 | 0 | 21 | 0 |
| cate27 | 0 | 3 | 0 |
| cate28 | 0 | 5 | 0 |
| Мэдээ | 616 | 1674 | 0 |

## Redirect хүснэгтийн шалгалт

| Файл | Мөр | Нээгдээгүй хэсэг рүү |
|---|--:|--:|
| batch-01-aimags.csv | 43 | 0 |
| batch-01b-soums.csv | 323 | 0 |
| batch-02-history.csv | 44 | 0 |
| batch-03-protected.csv | 81 | 0 |
| batch-04-places.csv | 453 | 0 |
| batch-05-nature.csv | 689 | 0 |
| batch-06-culture.csv | 237 | 0 |
| batch-07-events-camps-hotels.csv | 495 | 461 |
| batch-08-news.csv | 2290 | 642 |
| batch-09-listing-pages.csv | 368 | 22 |

- Нэг old_url давхардсан: **0**
- new_url `https://www.travelhubmongolia.com`-оор эхлээгүй: **0** 
- «Нээгдээгүй хэсэг» = `/local/*` (Нутгийн Монгол, soft), `/stories/news/*` (мэдээний архив, draft).

## ❓ шийдээгүй (304)

### cate14 TypeID 1: 2-р багцад зөвхөн TypeID 2 орсон (25)

| key | Гарчиг | TIC |
|---|---|---|
| c14_140 | МОНГОЛ ХЭМЭЭХ НЭРНИЙ УЧИР | [/cate14_more.aspx?ItemID=140](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=140) |
| c14_141 | МОГУЛ ГЭДЭГ НЬ МОНГОЛЧУУД | [/cate14_more.aspx?ItemID=141](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=141) |
| c14_57 | МОНГОЛ УГСААТАН, ТҮҮНИЙ БҮРЭЛДЭХҮҮН | [/cate14_more.aspx?ItemID=57](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=57) |
| c14_58 | ХАЛХ | [/cate14_more.aspx?ItemID=58](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=58) |
| c14_60 | БАРГА | [/cate14_more.aspx?ItemID=60](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=60) |
| c14_59 | БАЯД | [/cate14_more.aspx?ItemID=59](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=59) |
| c14_61 | БУРИАД | [/cate14_more.aspx?ItemID=61](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=61) |
| c14_62 | ДАРХАД | [/cate14_more.aspx?ItemID=62](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=62) |
| c14_63 | ДАРЬГАНГА | [/cate14_more.aspx?ItemID=63](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=63) |
| c14_64 | ДӨРВӨД | [/cate14_more.aspx?ItemID=64](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=64) |
| c14_65 | ЗАХЧИН | [/cate14_more.aspx?ItemID=65](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=65) |
| c14_66 | КАЗАХ | [/cate14_more.aspx?ItemID=66](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=66) |
| c14_70 | МАЛЧИН-ТУВА | [/cate14_more.aspx?ItemID=70](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=70) |
| c14_67 | МЯНГАД | [/cate14_more.aspx?ItemID=67](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=67) |
| c14_68 | ӨӨЛД | [/cate14_more.aspx?ItemID=68](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=68) |
| c14_69 | ТОРГУУД | [/cate14_more.aspx?ItemID=69](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=69) |
| c14_72 | ҮЗЭМЧИН | [/cate14_more.aspx?ItemID=72](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=72) |
| c14_71 | УРИАНХАЙ | [/cate14_more.aspx?ItemID=71](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=71) |
| c14_73 | ХАМНИГАН | [/cate14_more.aspx?ItemID=73](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=73) |
| c14_74 | ХОТОГОЙД | [/cate14_more.aspx?ItemID=74](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=74) |
| c14_75 | ХОТОН | [/cate14_more.aspx?ItemID=75](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=75) |
| c14_76 | ЦААТАН-ТУВА | [/cate14_more.aspx?ItemID=76](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=76) |
| c14_121 | МОНГОЛ ҮНДЭСНИЙ ХУВЦАСНЫ ТҮҮХ | [/cate14_more.aspx?ItemID=121](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=121) |
| c14_119 | ХАЛХ ҮНДЭСТНИЙ ХУВЦАС | [/cate14_more.aspx?ItemID=119](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=119) |
| c14_110 | БУРИАД - АЛТАРГАНА НААДАМ | [/cate14_more.aspx?ItemID=110](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=110) |

### cate14 TypeID 3: 2-р багцад зөвхөн TypeID 2 орсон (48)

| key | Гарчиг | TIC |
|---|---|---|
| c14_161 | АТИЛЛА ХААН | [/cate14_more.aspx?ItemID=161](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=161) |
| c14_165 | ЧИНГИС ХААН | [/cate14_more.aspx?ItemID=165](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=165) |
| c14_145 | ӨГЭДЭЙ ХААН | [/cate14_more.aspx?ItemID=145](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=145) |
| c14_144 | ГҮЮГ ХААН | [/cate14_more.aspx?ItemID=144](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=144) |
| c14_146 | МӨНХ ХААН | [/cate14_more.aspx?ItemID=146](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=146) |
| c14_128 | ХУБИЛАЙ СЭЦЭН ХААН | [/cate14_more.aspx?ItemID=128](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=128) |
| c14_160 | БӨРТЭ ҮЖИН ХАТАН | [/cate14_more.aspx?ItemID=160](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=160) |
| c14_102 | СОРХАГТАНИ БЭХИ ХАТАН | [/cate14_more.aspx?ItemID=102](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=102) |
| c14_158 | ХУЙЛДАР СЭЦЭН | [/cate14_more.aspx?ItemID=158](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=158) |
| c14_159 | ШИХИХУТАГ /ТӨРИЙН ЗАРГАЧ/ | [/cate14_more.aspx?ItemID=159](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=159) |
| c14_86 | МАНДУХАЙ СЭЦЭН ХАТАН | [/cate14_more.aspx?ItemID=86](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=86) |
| c14_143 | ЛИГДЭН ХААН | [/cate14_more.aspx?ItemID=143](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=143) |
| c14_99 | ЦОГТ ХУНТАЙЖ | [/cate14_more.aspx?ItemID=99](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=99) |
| c14_88 | ӨНДӨР ГЭГЭЭН ЗАНАБАЗАР | [/cate14_more.aspx?ItemID=88](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=88) |
| c14_95 | ХАЛХЫН ЗАЯ БАНДИДА ЛУВСАНПЭРЭНЛЭЙ | [/cate14_more.aspx?ItemID=95](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=95) |
| c14_80 | ГАЛДАН БОШИГТ | [/cate14_more.aspx?ItemID=80](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=80) |
| c14_162 | ДОГОЛОН ТӨМӨР | [/cate14_more.aspx?ItemID=162](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=162) |
| c14_98 | ХОТОГОЙДЫН ШАДАР ВАН ЧИНГҮНЖАВ | [/cate14_more.aspx?ItemID=98](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=98) |
| c14_94 | ТОГТОХТӨР ВАН | [/cate14_more.aspx?ItemID=94](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=94) |
| c14_81 | ГОВИЙН НОЁН ХУТАГТ ДАНЗАНРАВЖАА | [/cate14_more.aspx?ItemID=81](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=81) |
| c14_134 | ТОРОЙ БАНДИ | [/cate14_more.aspx?ItemID=134](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=134) |
| c14_85 | ЗАВА ДАМДИН | [/cate14_more.aspx?ItemID=85](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=85) |
| c14_84 | ЕГҮЗЭР ХУТАГТ | [/cate14_more.aspx?ItemID=84](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=84) |
| c14_138 | АГРАМБА САНЖЖАВ БУЮУ ӨВГӨН ГЭСЭР ЛАМ | [/cate14_more.aspx?ItemID=138](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=138) |
| c14_79 | БОГД ХААН | [/cate14_more.aspx?ItemID=79](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=79) |
| c14_100 | ЧИН ВАН ХАНДДОРЖ | [/cate14_more.aspx?ItemID=100](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=100) |
| c14_105 | ОНХОДЫН ЖАМЪЯН ГҮН | [/cate14_more.aspx?ItemID=105](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=105) |
| c14_87 | МАНЛАЙБААТАР ДАМДИНСҮРЭН | [/cate14_more.aspx?ItemID=87](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=87) |
| c14_91 | САЙН НОЁН ХАН НАМНАНСҮРЭН | [/cate14_more.aspx?ItemID=91](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=91) |
| c14_96 | ХАТАНБААТАР МАГСАРЖАВ | [/cate14_more.aspx?ItemID=96](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=96) |
| c14_78 | АРД АЮУШ | [/cate14_more.aspx?ItemID=78](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=78) |
| c14_166 | ДИЛОВ ХУТАГТ Б.ЖАМСРАНЖАВ | [/cate14_more.aspx?ItemID=166](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=166) |
| c14_136 | ТОРГУУД ГҮНЖ НИРЖИДМАА | [/cate14_more.aspx?ItemID=136](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=136) |
| c14_153 | ӨНДӨР ГОНГОР | [/cate14_more.aspx?ItemID=153](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=153) |
| c14_83 | ДОГСОМЫН БОДОО | [/cate14_more.aspx?ItemID=83](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=83) |
| c14_93 | СОЛИЙН ДАНЗАН | [/cate14_more.aspx?ItemID=93](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=93) |
| c14_77 | АГДАНБУУГИЙН АМАР | [/cate14_more.aspx?ItemID=77](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=77) |
| c14_82 | ДАМДИНЫ СҮХБААТАР | [/cate14_more.aspx?ItemID=82](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=82) |
| c14_97 | ХОРЛООГИЙН ЧОЙБАЛСАН | [/cate14_more.aspx?ItemID=97](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=97) |
| c14_90 | ПЭЛЖИДИЙН ГЭНДЭН | [/cate14_more.aspx?ItemID=90](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=90) |
| c14_154 | ШАР ДАМДИНСҮРЭН БУЮУ МОНГОЛ СУДЛААЧ А.Д.СИМУКОВ | [/cate14_more.aspx?ItemID=154](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=154) |
| c14_163 | ДАШДОРЖИЙН НАЦАГДОРЖ | [/cate14_more.aspx?ItemID=163](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=163) |
| c14_155 | БЯМБЫН РИНЧЕН | [/cate14_more.aspx?ItemID=155](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=155) |
| c14_156 | ЦЭНДИЙН ДАМДИНСҮРЭН | [/cate14_more.aspx?ItemID=156](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=156) |
| c14_101 | ЮМЖААГИЙН ЦЭДЭНБАЛ | [/cate14_more.aspx?ItemID=101](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=101) |
| c14_164 | ЖҮГДЭРДЭМИДИЙН ГҮРРАГЧАА | [/cate14_more.aspx?ItemID=164](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=164) |
| c14_89 | ПУНСАЛМААГИЙН ОЧИРБАТ | [/cate14_more.aspx?ItemID=89](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=89) |
| c14_92 | САНЖААСҮРЭНГИЙН ЗОРИГ | [/cate14_more.aspx?ItemID=92](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=92) |

### cate15 шашин шүтлэг: багцад ороогүй (102)

| key | Гарчиг | TIC |
|---|---|---|
| c15_2 | БӨӨ МӨРГӨЛ БА БУСАД ШАШНЫ ЯЛГАА | [/cate15_more.aspx?ItemID=2](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=2) |
| c15_1 | БӨӨГИЙН ТАХИЛГА ЁС | [/cate15_more.aspx?ItemID=1](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1) |
| c15_61 | ДАЯН ДЭЭРХИ БӨӨГИЙН ДОМОГ | [/cate15_more.aspx?ItemID=61](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=61) |
| c15_1111 | ХАРХИРАА - БӨӨГИЙН СОЁЛЫН ТӨВ | [/cate15_more.aspx?ItemID=1111](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1111) |
| c15_5 | БУДДЫН ШАШНЫ ҮҮСЭЛ | [/cate15_more.aspx?ItemID=5](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=5) |
| c15_6 | МОНГОЛЫН БУДДЫН ШАШНЫ ТҮҮХ | [/cate15_more.aspx?ItemID=6](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=6) |
| c15_7 | МОНГОЛД НЭВТЭРЧ БАЙСАН БУДДЫН УРСГАЛУУД | [/cate15_more.aspx?ItemID=7](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=7) |
| c15_8 | БУРХАДЫН УТГА БЭЛГЭДЭЛ | [/cate15_more.aspx?ItemID=8](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=8) |
| c15_15 | БУРХАН БАГШ | [/cate15_more.aspx?ItemID=15](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=15) |
| c15_14 | БОГД ЗОНХОВ | [/cate15_more.aspx?ItemID=14](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=14) |
| c15_27 | ЛОВОН БАДАМЖУНАЙ | [/cate15_more.aspx?ItemID=27](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=27) |
| c15_13 | БОГД ГЭГЭЭН | [/cate15_more.aspx?ItemID=13](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=13) |
| c15_70 | ИТГЭЛТ ХАМБА | [/cate15_more.aspx?ItemID=70](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=70) |
| c15_42 | ЧОЙЖИН ЛАМ | [/cate15_more.aspx?ItemID=42](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=42) |
| c15_67 | ГАНЖУУР, ДАНЖУУР ХӨЛГӨН СУДАР | [/cate15_more.aspx?ItemID=67](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=67) |
| c15_68 | ЕСӨН ЭРДЭНИЙН ГАНЖУУР | [/cate15_more.aspx?ItemID=68](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=68) |
| c15_55 | ОЧИР ОГТЛОГЧ СУДАР | [/cate15_more.aspx?ItemID=55](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=55) |
| c15_65 | СУВАРГА БҮТЭЭХ БА ГОРООЛОХ | [/cate15_more.aspx?ItemID=65](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=65) |
| c15_53 | ӨВГӨН СУВАРГА | [/cate15_more.aspx?ItemID=53](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=53) |
| c15_66 | ЦАМ ХАРАЙХ | [/cate15_more.aspx?ItemID=66](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=66) |
| c15_63 | МАЙДАР ЭРГЭХ | [/cate15_more.aspx?ItemID=63](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=63) |
| c15_43 | ЧОЙЖИН БУУХ | [/cate15_more.aspx?ItemID=43](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=43) |
| c15_60 | ШАШНЫ НАЙМАН ТАХИЛ | [/cate15_more.aspx?ItemID=60](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=60) |
| c15_57 | ТӨРИЙН ДОЛООН ЭРДЭНЭ | [/cate15_more.aspx?ItemID=57](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=57) |
| c15_74 | ЭРДЭНЭ ЗУУ | [/cate15_more.aspx?ItemID=74](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=74) |
| c15_62 | ЗАНАБАЗАРЫН УРЛАЛ | [/cate15_more.aspx?ItemID=62](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=62) |
| c15_1107 | ЗУЛ ӨРГӨХ | [/cate15_more.aspx?ItemID=1107](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1107) |
| c15_1108 | МЭНГЭНИЙ ЗАСАЛ ХИЙХ | [/cate15_more.aspx?ItemID=1108](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1108) |
| c15_1110 | СУНАЖ МӨРГӨХ | [/cate15_more.aspx?ItemID=1110](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1110) |
| c15_1109 | ХҮРД ЭРГҮҮЛЭХ | [/cate15_more.aspx?ItemID=1109](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1109) |
| c15_9 | АРВАН ЗУРГААН НАЙДАН | [/cate15_more.aspx?ItemID=9](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=9) |
| c15_11 | АЮУШ БУРХАН | [/cate15_more.aspx?ItemID=11](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=11) |
| c15_12 | БАЛДАНЛХАМ (ЛХАМ) БУРХАН | [/cate15_more.aspx?ItemID=12](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=12) |
| c15_16 | ГОВИЙН ЛХА БУРХАН | [/cate15_more.aspx?ItemID=16](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=16) |
| c15_17 | ГОМБО БУРХАН | [/cate15_more.aspx?ItemID=17](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=17) |
| c15_18 | ГОНГОР БУРХАН | [/cate15_more.aspx?ItemID=18](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=18) |
| c15_19 | ДАМДИНДОРЛИГ БУРХАН | [/cate15_more.aspx?ItemID=19](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=19) |
| c15_20 | ДАМДИНСАМДҮВ БУРХАН | [/cate15_more.aspx?ItemID=20](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=20) |
| c15_21 | ДАМДИНЧОЙЖОО БУРХАН | [/cate15_more.aspx?ItemID=21](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=21) |
| c15_1074 | ДОРЖШҮГДЭН БУРХАН | [/cate15_more.aspx?ItemID=1074](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1074) |
| c15_22 | ДҮЙНХОР БУРХАН | [/cate15_more.aspx?ItemID=22](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=22) |
| c15_69 | ДҮРТЭДДАГВА БУРХАН | [/cate15_more.aspx?ItemID=69](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=69) |
| c15_23 | ДЭМЧОГ БУРХАН | [/cate15_more.aspx?ItemID=23](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=23) |
| c15_24 | ЖАМСРАН БУРХАН | [/cate15_more.aspx?ItemID=24](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=24) |
| c15_25 | ЖАНРАЙСИГ (АРЪЯАБАЛ) БУРХАН | [/cate15_more.aspx?ItemID=25](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=25) |
| c15_26 | ЖИГЖИД (ЯМАНДАГ) БУРХАН | [/cate15_more.aspx?ItemID=26](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=26) |
| c15_28 | МАЙДАР БУРХАН | [/cate15_more.aspx?ItemID=28](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=28) |
| c15_31 | МАНАЛ БУРХАН | [/cate15_more.aspx?ItemID=31](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=31) |
| c15_30 | МАНЗУШИР БУРХАН | [/cate15_more.aspx?ItemID=30](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=30) |
| c15_32 | МАХРАНЗЫН ДӨРВӨН ХААН | [/cate15_more.aspx?ItemID=32](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=32) |
| c15_72 | МЯЛ БОГД | [/cate15_more.aspx?ItemID=72](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=72) |
| c15_33 | НАМСРАЙ БУРХАН | [/cate15_more.aspx?ItemID=33](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=33) |
| c15_34 | НОГООН ДАРЬ ЭХ | [/cate15_more.aspx?ItemID=34](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=34) |
| c15_35 | ОЧИРВААНЬ БУРХАН | [/cate15_more.aspx?ItemID=35](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=35) |
| c15_36 | ОЧИРДАРА БУРХАН | [/cate15_more.aspx?ItemID=36](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=36) |
| c15_37 | ТААЛЛЫН ТАВАН ХААН | [/cate15_more.aspx?ItemID=37](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=37) |
| c15_38 | ХОРИН НЭГЭН ДАРЬ ЭХ | [/cate15_more.aspx?ItemID=38](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=38) |
| c15_39 | ЦАГААН ДАРЬ ЭХ | [/cate15_more.aspx?ItemID=39](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=39) |
| c15_73 | ЦАГААН ӨВГӨН | [/cate15_more.aspx?ItemID=73](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=73) |
| c15_1075 | ЦАГААН ШҮХЭРТ | [/cate15_more.aspx?ItemID=1075](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1075) |
| c15_40 | ЦАМБА БУРХАН | [/cate15_more.aspx?ItemID=40](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=40) |
| c15_41 | ЦОГДОГМАРАВ БУРХАН | [/cate15_more.aspx?ItemID=41](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=41) |
| c15_44 | ШАЛШИ БУРХАН | [/cate15_more.aspx?ItemID=44](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=44) |
| c15_46 | ЯЗГУУРЫН ТАВАН БУРХАН | [/cate15_more.aspx?ItemID=46](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=46) |
| c15_71 | ЯНЖИНЛХАМ БУРХАН | [/cate15_more.aspx?ItemID=71](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=71) |
| c15_1076 | АРВАН ХАР НҮГЭЛ | [/cate15_more.aspx?ItemID=1076](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1076) |
| c15_1077 | АРВАН ЦАГААН БУЯН | [/cate15_more.aspx?ItemID=1077](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1077) |
| c15_1078 | АСАРТ ХААЛГА | [/cate15_more.aspx?ItemID=1078](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1078) |
| c15_1079 | БАЛИН | [/cate15_more.aspx?ItemID=1079](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1079) |
| c15_1080 | БОДЬ ГӨРӨӨС | [/cate15_more.aspx?ItemID=1080](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1080) |
| c15_1081 | БУРХАН БАГШИЙН ЗОХИОНГУЙ | [/cate15_more.aspx?ItemID=1081](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1081) |
| c15_1082 | ГАНЗАЙ | [/cate15_more.aspx?ItemID=1082](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1082) |
| c15_1083 | ГАНЖИР | [/cate15_more.aspx?ItemID=1083](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1083) |
| c15_1084 | ГУРВАН ЭРДЭНЭ | [/cate15_more.aspx?ItemID=1084](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1084) |
| c15_1085 | ГЭГЭЭРЭЛ | [/cate15_more.aspx?ItemID=1085](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1085) |
| c15_1086 | ДАЦАН | [/cate15_more.aspx?ItemID=1086](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1086) |
| c15_1087 | ЗУРХАЙ | [/cate15_more.aspx?ItemID=1087](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1087) |
| c15_1088 | ИХ НУРУУ | [/cate15_more.aspx?ItemID=1088](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1088) |
| c15_1089 | КАРМА БУЮУ ҮЙЛИЙН ҮР | [/cate15_more.aspx?ItemID=1089](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1089) |
| c15_1090 | ЛАМ БА ЛАМЫН ЦОЛ, ҮҮРЭГ | [/cate15_more.aspx?ItemID=1090](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1090) |
| c15_1091 | ЛАМРИМ | [/cate15_more.aspx?ItemID=1091](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1091) |
| c15_1092 | ЛАМЫН ТАХИЛ | [/cate15_more.aspx?ItemID=1092](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1092) |
| c15_1093 | ЛЯНХУА | [/cate15_more.aspx?ItemID=1093](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1093) |
| c15_1094 | МААНИЙН ЗУРГААН ҮСЭГ | [/cate15_more.aspx?ItemID=1094](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1094) |
| c15_1095 | НИРВААН | [/cate15_more.aspx?ItemID=1095](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1095) |
| c15_1096 | ОЧИР | [/cate15_more.aspx?ItemID=1096](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1096) |
| c15_1097 | САНСАРАГИЙН НОМЛОЛ БУЮУ САНСАРЫН ХҮРДЭН | [/cate15_more.aspx?ItemID=1097](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1097) |
| c15_1098 | СҮМ ХИЙД | [/cate15_more.aspx?ItemID=1098](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1098) |
| c15_1099 | ТАМЫН ОРОН | [/cate15_more.aspx?ItemID=1099](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1099) |
| c15_1100 | ТАХИЛ | [/cate15_more.aspx?ItemID=1100](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1100) |
| c15_1101 | ХОНХ | [/cate15_more.aspx?ItemID=1101](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1101) |
| c15_1102 | ХООСОН ЧАНАР | [/cate15_more.aspx?ItemID=1102](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1102) |
| c15_1103 | ХУТАГТЫН ДӨРВӨН ҮНЭН | [/cate15_more.aspx?ItemID=1103](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1103) |
| c15_1104 | ШАМБАЛЫН ОРОН | [/cate15_more.aspx?ItemID=1104](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1104) |
| c15_1105 | ШАШНЫ ХӨГЖИМ | [/cate15_more.aspx?ItemID=1105](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1105) |
| c15_1106 | ЭРХИ | [/cate15_more.aspx?ItemID=1106](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=1106) |
| c15_59 | ЯНПАЙ ХАНА | [/cate15_more.aspx?ItemID=59](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=59) |
| c15_48 | ИСЛАМЫН ШАШИН | [/cate15_more.aspx?ItemID=48](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=48) |
| c15_49 | МОНГОЛ ДАХЬ ИСЛАМЫН ШАШИН | [/cate15_more.aspx?ItemID=49](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=49) |
| c15_50 | ХРИСТОСЫН ШАШНЫ ТУХАЙ ОЙЛГОЛТ | [/cate15_more.aspx?ItemID=50](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=50) |
| c15_51 | ХРИСТОСЫН ШАШИН МОНГОЛД ДЭЛГЭРСЭН ТҮҮХ | [/cate15_more.aspx?ItemID=51](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=51) |
| c15_52 | ҮНЭН АЛДАРТНЫ ШАШИН МОНГОЛД | [/cate15_more.aspx?ItemID=52](https://www.touristinfocenter.mn/cate15_more.aspx?ItemID=52) |

### cate16 зан заншил: багцад ороогүй (129)

| key | Гарчиг | TIC |
|---|---|---|
| c16_143 | ААРУУЛ | [/cate16_more.aspx?ItemID=143](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=143) |
| c16_144 | ААРЦ | [/cate16_more.aspx?ItemID=144](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=144) |
| c16_165 | АДУУНЫ ТАМГА | [/cate16_more.aspx?ItemID=165](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=165) |
| c16_161 | АЗАРГАНЫ ДЭЛИЙГ АВДАГГҮЙ УЧИР | [/cate16_more.aspx?ItemID=161](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=161) |
| c16_145 | АЙРАГ | [/cate16_more.aspx?ItemID=145](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=145) |
| c16_84 | АЛАГ МЭЛХИЙ ӨРӨХ | [/cate16_more.aspx?ItemID=84](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=84) |
| c16_136 | АН АВЫН ТҮҮХЭН УЛАМЖЛАЛ | [/cate16_more.aspx?ItemID=136](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=136) |
| c16_139 | АНЧИН ХҮНИЙ 10 ЦЭЭРЛЭЛ | [/cate16_more.aspx?ItemID=139](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=139) |
| c16_67 | АРВАН ХОЁР ЖИЛИЙН БЭЛГЭДЭЛ | [/cate16_more.aspx?ItemID=67](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=67) |
| c16_68 | АРВАН ХОЁР ЦАГ | [/cate16_more.aspx?ItemID=68](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=68) |
| c16_133 | АРГИЛ ХУУЧИР | [/cate16_more.aspx?ItemID=133](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=133) |
| c16_104 | АРДЫН БОГИНО ДУУ | [/cate16_more.aspx?ItemID=104](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=104) |
| c16_105 | АРДЫН БҮЖИГ | [/cate16_more.aspx?ItemID=105](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=105) |
| c16_106 | АРДЫН ХӨГЖИМ | [/cate16_more.aspx?ItemID=106](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=106) |
| c16_78 | БАЙГАЛЬ ХАМГААЛАХ ХУУЛЬ | [/cate16_more.aspx?ItemID=78](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=78) |
| c16_112 | БИЙ БИЕЛЭГ | [/cate16_more.aspx?ItemID=112](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=112) |
| c16_1 | БОГД ХАН УУЛЫН ТАХИЛГА | [/cate16_more.aspx?ItemID=1](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=1) |
| c16_44 | БУЛШЛАН ОРШУУЛАХ ЁС | [/cate16_more.aspx?ItemID=44](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=44) |
| c16_160 | БУРХАН ӨРШӨӨГ - ГЭЖ ХЭЛДЭГ УЧИР | [/cate16_more.aspx?ItemID=160](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=160) |
| c16_129 | БҮРГЭДЭЭР АН ХИЙХ ЁС ЗАНШИЛ | [/cate16_more.aspx?ItemID=129](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=129) |
| c16_111 | БҮҮВЭЙН ДУУ | [/cate16_more.aspx?ItemID=111](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=111) |
| c16_92 | БӨХИЙН БАРИЛДААН | [/cate16_more.aspx?ItemID=92](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=92) |
| c16_40 | БЭР ГУЙХ | [/cate16_more.aspx?ItemID=40](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=40) |
| c16_39 | БЭР ШИНЖИХ ЁС | [/cate16_more.aspx?ItemID=39](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=39) |
| c16_146 | БЯСЛАГ | [/cate16_more.aspx?ItemID=146](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=146) |
| c16_159 | ГАЛ ГОЛОМТ | [/cate16_more.aspx?ItemID=159](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=159) |
| c16_162 | ГАЛШАРЫН АДУУ | [/cate16_more.aspx?ItemID=162](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=162) |
| c16_158 | ГАЛЫН ТЭНГЭР ТАХИХ ЁСЛОЛ | [/cate16_more.aspx?ItemID=158](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=158) |
| c16_72 | ГҮҮНИЙ ҮРС ГАРГАХ БУЮУ ГҮҮ БАРИХ | [/cate16_more.aspx?ItemID=72](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=72) |
| c16_45 | ГЭЭГДҮҮЛЭХ ЁС | [/cate16_more.aspx?ItemID=45](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=45) |
| c16_117 | ДААЛИН | [/cate16_more.aspx?ItemID=117](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=117) |
| c16_156 | ДАЛНЫ ЯС БА ЦЭЭРЛЭХ ЁСОН | [/cate16_more.aspx?ItemID=156](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=156) |
| c16_5 | ДАРЬГАНГЫН МӨНГӨН УРЛАЛ | [/cate16_more.aspx?ItemID=5](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=5) |
| c16_69 | ДОЛООН БУРХАН ОД | [/cate16_more.aspx?ItemID=69](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=69) |
| c16_163 | ДӨЧИН ЕСӨН ХОНОГ ХУРААХ | [/cate16_more.aspx?ItemID=163](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=163) |
| c16_110 | ЕРӨӨЛ | [/cate16_more.aspx?ItemID=110](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=110) |
| c16_73 | ЖИНД ЯВАХ | [/cate16_more.aspx?ItemID=73](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=73) |
| c16_46 | ЗАНДАНШУУЛАХ ЁС | [/cate16_more.aspx?ItemID=46](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=46) |
| c16_155 | ЗОЧЛОХ ЁС БА ЦЭЭРЛЭХ ЁСОН | [/cate16_more.aspx?ItemID=155](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=155) |
| c16_119 | ЗУЛ ӨРГӨХ ЁСОН | [/cate16_more.aspx?ItemID=119](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=119) |
| c16_47 | ИЛ ТАВИХ | [/cate16_more.aspx?ItemID=47](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=47) |
| c16_107 | ИСГЭРЭХ УРЛАГ | [/cate16_more.aspx?ItemID=107](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=107) |
| c16_7 | КАЗАК ҮНДЭСТНИЙ СОЁЛ | [/cate16_more.aspx?ItemID=7](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=7) |
| c16_142 | ЛУУ ШҮТЭЭНИЙ БЭЛГЭДЭЛ | [/cate16_more.aspx?ItemID=142](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=142) |
| c16_109 | МАГТААЛ | [/cate16_more.aspx?ItemID=109](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=109) |
| c16_166 | МАЛ СЭТЭРЛЭХ | [/cate16_more.aspx?ItemID=166](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=166) |
| c16_74 | МАЛ ХӨНГӨЛӨХ | [/cate16_more.aspx?ItemID=74](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=74) |
| c16_75 | МАЛЫН БЭЛЧЭЭР | [/cate16_more.aspx?ItemID=75](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=75) |
| c16_10 | МОНГОЛ АРДЫН БИЙ БИЕЛЭГ | [/cate16_more.aspx?ItemID=10](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=10) |
| c16_11 | МОНГОЛ АРДЫН УРТЫН ДУУ | [/cate16_more.aspx?ItemID=11](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=11) |
| c16_12 | МОНГОЛ ГЭР | [/cate16_more.aspx?ItemID=12](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=12) |
| c16_93 | МОНГОЛ ГЭР БАРИХ ДАРААЛАЛ | [/cate16_more.aspx?ItemID=93](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=93) |
| c16_138 | МОНГОЛ ГЭРИЙН БАРУУН УРД ТУУРГА | [/cate16_more.aspx?ItemID=138](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=138) |
| c16_94 | МОНГОЛ ГЭРИЙН БҮРДЭЛ ХЭСГҮҮД | [/cate16_more.aspx?ItemID=94](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=94) |
| c16_95 | МОНГОЛ ГЭРИЙН ДОТОРХИ ЗОХИОН БАЙГУУЛАЛТ | [/cate16_more.aspx?ItemID=95](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=95) |
| c16_97 | МОНГОЛ ГЭРИЙН ДЭГ ЖУРАМ | [/cate16_more.aspx?ItemID=97](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=97) |
| c16_96 | МОНГОЛ ГЭРИЙН НАРАН ЦАГИЙН ХУВААРЬ | [/cate16_more.aspx?ItemID=96](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=96) |
| c16_98 | МОНГОЛ ГЭРТ ЗОЧЛОХ | [/cate16_more.aspx?ItemID=98](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=98) |
| c16_114 | МОНГОЛ ДЭЭЛНИЙ СОЁЛ | [/cate16_more.aspx?ItemID=114](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=114) |
| c16_32 | МОНГОЛ ЗУРАГ | [/cate16_more.aspx?ItemID=32](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=32) |
| c16_172 | МОНГОЛ НААДАМ | [/cate16_more.aspx?ItemID=172](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=172) |
| c16_91 | МОНГОЛ СУРЫН ХАРВАА | [/cate16_more.aspx?ItemID=91](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=91) |
| c16_137 | МОНГОЛ ҮНДЭСНИЙ ХУВЦАС | [/cate16_more.aspx?ItemID=137](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=137) |
| c16_140 | МОНГОЛ ХООЛ - БУУЗ | [/cate16_more.aspx?ItemID=140](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=140) |
| c16_100 | МОНГОЛЧУУДЫН МАХАН ХООЛ | [/cate16_more.aspx?ItemID=100](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=100) |
| c16_15 | МОРИН ХУУР | [/cate16_more.aspx?ItemID=15](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=15) |
| c16_85 | МӨСӨН ШАГАЙ | [/cate16_more.aspx?ItemID=85](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=85) |
| c16_164 | НАУРЫЗЫН БАЯР | [/cate16_more.aspx?ItemID=164](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=164) |
| c16_167 | НООС САВАХ | [/cate16_more.aspx?ItemID=167](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=167) |
| c16_168 | НООС ХЯРГАХ | [/cate16_more.aspx?ItemID=168](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=168) |
| c16_81 | НОХОЙ ТЭЖЭЭХ ЁС | [/cate16_more.aspx?ItemID=81](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=81) |
| c16_70 | НҮҮДЛИЙН МАЛ АЖ АХУЙ | [/cate16_more.aspx?ItemID=70](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=70) |
| c16_80 | ОВОО БА ТАХИЛГА | [/cate16_more.aspx?ItemID=80](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=80) |
| c16_76 | ОТОР НҮҮДЭЛ ХИЙХ | [/cate16_more.aspx?ItemID=76](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=76) |
| c16_86 | ОЮУНТҮЛХҮҮР ТОГЛООМ | [/cate16_more.aspx?ItemID=86](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=86) |
| c16_65 | ӨНГӨНИЙ БЭЛГЭДЭЛ | [/cate16_more.aspx?ItemID=65](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=65) |
| c16_147 | ӨРӨМ ЗӨӨХИЙ | [/cate16_more.aspx?ItemID=147](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=147) |
| c16_41 | СҮЙ БЭЛЭГ | [/cate16_more.aspx?ItemID=41](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=41) |
| c16_154 | СҮҮ | [/cate16_more.aspx?ItemID=154](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=154) |
| c16_152 | СҮҮТЭЙ ЦАЙ | [/cate16_more.aspx?ItemID=152](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=152) |
| c16_102 | СЭРЖИМ ӨРГӨХ ЁС | [/cate16_more.aspx?ItemID=102](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=102) |
| c16_173 | ТАВАН НҮДЭН - ХЭЭНИЙ БЭЛГЭДЭЛ | [/cate16_more.aspx?ItemID=173](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=173) |
| c16_71 | ТАВАН ХОШУУ МАЛ, 2017 ОНЫ МАЛ ТООЛЛОГО | [/cate16_more.aspx?ItemID=71](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=71) |
| c16_148 | ТАРАГ | [/cate16_more.aspx?ItemID=148](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=148) |
| c16_169 | ТӨЛ АВАХУУЛАХ | [/cate16_more.aspx?ItemID=169](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=169) |
| c16_89 | ТОГЛООМ НААДГАЙ | [/cate16_more.aspx?ItemID=89](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=89) |
| c16_63 | ТООНЫ БЭЛГЭДЭЛ | [/cate16_more.aspx?ItemID=63](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=63) |
| c16_121 | ТӨРИЙН ДОЛООН ЭРДЭНЭ | [/cate16_more.aspx?ItemID=121](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=121) |
| c16_108 | ТУУЛЬ | [/cate16_more.aspx?ItemID=108](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=108) |
| c16_17 | УЙГАРЖИН МОНГОЛ БИЧИГ | [/cate16_more.aspx?ItemID=17](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=17) |
| c16_171 | УЛ БООВ | [/cate16_more.aspx?ItemID=171](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=171) |
| c16_170 | УНАГА БАРИХ БУЮУ ГҮҮНИЙ ҮРС ГАРГАХ | [/cate16_more.aspx?ItemID=170](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=170) |
| c16_77 | УНАГА ТАМГАЛАХ | [/cate16_more.aspx?ItemID=77](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=77) |
| c16_43 | УРАГ ТӨРЛИЙН НЭРШИЛ | [/cate16_more.aspx?ItemID=43](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=43) |
| c16_87 | ҮЙЧҮҮР ТОГЛООМ | [/cate16_more.aspx?ItemID=87](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=87) |
| c16_18 | ХАДАГ БА ХАДАГНЫ БЭЛГЭДЭЛ | [/cate16_more.aspx?ItemID=18](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=18) |
| c16_131 | ХАС ТЭМДЭГ | [/cate16_more.aspx?ItemID=131](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=131) |
| c16_20 | ХӨӨМЭЙ | [/cate16_more.aspx?ItemID=20](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=20) |
| c16_88 | ХОРОЛ ТОГЛООМ | [/cate16_more.aspx?ItemID=88](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=88) |
| c16_33 | ХӨӨРӨГ | [/cate16_more.aspx?ItemID=33](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=33) |
| c16_90 | ХУРДАН МОРИНЫ УРАЛДААН | [/cate16_more.aspx?ItemID=90](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=90) |
| c16_42 | ХУРИМЛАХ | [/cate16_more.aspx?ItemID=42](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=42) |
| c16_38 | ХҮРГЭН ШИНЖИХ ЁС | [/cate16_more.aspx?ItemID=38](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=38) |
| c16_174 | ХҮҮХДЭД НЭР ӨГӨХ БА ХҮҮХЭД УГААХ ЁС | [/cate16_more.aspx?ItemID=174](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=174) |
| c16_130 | ХЭЛ ХУУР | [/cate16_more.aspx?ItemID=130](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=130) |
| c16_64 | ХЭЭНИЙ БЭЛГЭДЭЛ | [/cate16_more.aspx?ItemID=64](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=64) |
| c16_101 | ЦАГААН ИДЭЭ | [/cate16_more.aspx?ItemID=101](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=101) |
| c16_141 | ЦАГААН САР - УЛ БООВ | [/cate16_more.aspx?ItemID=141](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=141) |
| c16_116 | ЦАГААН САРЫН БАЯР | [/cate16_more.aspx?ItemID=116](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=116) |
| c16_149 | ЦАГААН ТОС | [/cate16_more.aspx?ItemID=149](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=149) |
| c16_153 | ЦАЙНЫ ДЭЭЖ ӨРГӨХ ЁСОН БА ЦЭЭР | [/cate16_more.aspx?ItemID=153](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=153) |
| c16_132 | ЦООР | [/cate16_more.aspx?ItemID=132](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=132) |
| c16_134 | ЦЭЭРЛЭХ ЁСОН: АРХИНЫ ЦЭЭР | [/cate16_more.aspx?ItemID=134](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=134) |
| c16_34 | ЦЭЭРЛЭХ ЁСОН: АХУЙ БАЙДАЛ | [/cate16_more.aspx?ItemID=34](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=34) |
| c16_79 | ЦЭЭРЛЭХ ЁСОН: БАЙГАЛЬ ХАМГААЛАХ УЛАМЖЛАЛ | [/cate16_more.aspx?ItemID=79](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=79) |
| c16_135 | ЦЭЭРЛЭХ ЁСОН: ХООЛ УНДНЫ ЦЭЭР | [/cate16_more.aspx?ItemID=135](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=135) |
| c16_48 | ЧАНДАРЛАХ БОЛОН ХАЙЛАХ ЁС | [/cate16_more.aspx?ItemID=48](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=48) |
| c16_83 | ШАГАЙН ХАРВАА | [/cate16_more.aspx?ItemID=83](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=83) |
| c16_150 | ШАР ТОС | [/cate16_more.aspx?ItemID=150](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=150) |
| c16_122 | ШАШНЫ НАЙМАН ТАХИЛ | [/cate16_more.aspx?ItemID=122](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=122) |
| c16_151 | ШИМИЙН АРХИ | [/cate16_more.aspx?ItemID=151](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=151) |
| c16_175 | ШУВУУЛАХУЙ - ШОНХОРЫН АН | [/cate16_more.aspx?ItemID=175](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=175) |
| c16_28 | ЭМЭГТЭЙЧҮҮДИЙН ГОЁЛ | [/cate16_more.aspx?ItemID=28](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=28) |
| c16_82 | ЭМЭЭЛ | [/cate16_more.aspx?ItemID=82](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=82) |
| c16_31 | ЭР ХҮНИЙ ГОЁЛ | [/cate16_more.aspx?ItemID=31](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=31) |
| c16_99 | ЭСГИЙ ХИЙХ | [/cate16_more.aspx?ItemID=99](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=99) |
| c16_176 | ЭХНЭР ҮС | [/cate16_more.aspx?ItemID=176](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=176) |
| c16_157 | ЯВУУ | [/cate16_more.aspx?ItemID=157](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=157) |
| c16_128 | ЯТГА ХӨГЖИМ | [/cate16_more.aspx?ItemID=128](https://www.touristinfocenter.mn/cate16_more.aspx?ItemID=128) |

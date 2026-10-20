# TIC 1б багц: үлдсэн 20 аймгийн сумд + Улаанбаатарын дүүргүүд

> 2026-10-19. Contentful-д бүгд **Draft** (publish хийгээгүй), preview дээр харагдана. Скрипт: `scripts/tic/` (`fetch-batch01b.js` → `import-batch01b.js`, шалгалт `check-soums.js`). Redirect: [batch-01b-soums.csv](../redirects/batch-01b-soums.csv) (323 мөр). Импортоос өмнөх нөөц: `backups/contentful-2026-10-19-pre-batch01b/`.

- TIC-ийн 323 нийтлэл → **316 soum entry** (тусдаа хуудас 189, аймгийн хуудасны жагсаалтад 127). 1-р багцын аргаар: 150-аас дээш үгтэй нь `/province/<аймаг>/<сум>`, бусад нь «Сумд» хэсэгт задардаг жагсаалт (`#<сум>`).
- Текстийг өөрчлөөгүй. Сумын нийтлэлүүдэд TIC-ийн сурталчилгааны мөр, англи хэсэг байгаагүй.
- TIC дотор давхардсан 5 сум (Дадал 4 хувилбар, Алтанцөгц, Баян-Овоо (Өмнөговь), Нөмрөг, Цагаанчулуут): хамгийн урт хувилбарыг авч (тэнцүү бол inventory-д ХУУЛАХ гэснийг), бүх хуучин хаяг нэг шинэ хаяг руу.
- needsReplacement=true: 205 сум (ихэнх нь гуравдагч сайтын зураг, мөн «Монгол орны лавлах»). Wikimedia-гийн 2 зураг credit-тэй: Халиун (Ochiroo.tse, CC BY-SA 4.0), Яруу (зохиогч Commons-д заагаагүй, CC BY-SA 4.0).
- inventory-ийн «аймаг»/«шинэ_url» сумдад буруу байсан (Сүхбаатар дүүрэг → Сүхбаатар аймаг, `/province/bayan/ulgii-…`, `/province/khan/uul`) тул аймгийг TIC-ийн гарчгаас тодорхойлсон (`_batch01b.js`).
- TIC-ийн гарчиг буруу, текст нь зөв 8 нийтлэлийн нэрийг текстийн дагуу засав (`TITLE_FIXES`): #167 «Өмнөговь - Алтанбулаг» нь Төв аймгийн Алтанбулаг сум; Буяндэлгэр → Баяндэлгэр, Бүрэнхангай → Бүрэгхангай, Баянагт → Баян-Агт, Хутагт-Өндөр → Хутаг-Өндөр, Хашаат (Сэлэнгэ) → Хушаат, Баянөндөр → Баян-Өндөр (Орхон, Баянхонгор).
- Улаанбаатарын хуудсанд хэсгийн гарчиг «Улаанбаатар хотын дүүргүүд» (`app/province/[id]/page.tsx`).

## Сумын тоо: Contentful ба provinceFacts

`lib/provinceFacts.ts`-ийн `soums` (Wikipedia «Districts of Mongolia»)-тай тулгасан. Аймгийн хуудас бүрийн «Сумд» хэсэгт бүх entry-ийн анкер байгааг local build дээр шалгасан (дутуу 0).

| Аймаг | Нийт | Тусдаа хуудас | Жагсаалт | provinceFacts |
|---|--:|--:|--:|--:|
| Баян-Өлгий | 13 | 10 | 3 | 13 |
| Баянхонгор | 18 | 11 | 7 | 20 |
| Булган | 16 | 12 | 4 | 16 |
| Говь-Алтай | 18 | 10 | 8 | 18 |
| Говьсүмбэр | 4 | 3 | 1 | 3 |
| Дархан-Уул | 4 | 2 | 2 | 4 |
| Дорноговь | 13 | 7 | 6 | 14 |
| Дорнод | 14 | 14 | 0 | 14 |
| Дундговь | 15 | 9 | 6 | 15 |
| Завхан | 24 | 15 | 9 | 24 |
| Орхон | 3 | 0 | 3 | 2 |
| Өвөрхангай | 19 | 14 | 5 | 19 |
| Өмнөговь | 15 | 9 | 6 | 15 |
| Сүхбаатар | 13 | 6 | 7 | 13 |
| Сэлэнгэ | 17 | 6 | 11 | 17 |
| Төв | 27 | 10 | 17 | 27 |
| Увс | 18 | 14 | 4 | 19 |
| Улаанбаатар | 9 | 5 | 4 | — |
| Ховд | 17 | 15 | 2 | 17 |
| Хөвсгөл | 21 | 8 | 13 | 23 |
| Хэнтий | 18 | 9 | 9 | 17 |

Зөрүү:

- **Баянхонгор −2**: TIC-д Баянхонгор (аймгийн төв), Баян-Овоо сум алга.
- **Дорноговь −1**: TIC-д Сайншанд (аймгийн төв) алга.
- **Увс −1**: TIC-д Улаангом (аймгийн төв) алга.
- **Хөвсгөл −2**: TIC-д Рашаант, Рэнчинлхүмбэ, Цэцэрлэг алга; харин Мөрөн (аймгийн төв, Wikipedia-гийн 23-т ордоггүй) бий.
- **Баян-Өлгий 13 = 13**, гэхдээ TIC-ийн 13-ын нэг нь Цагааннуур тосгон, Өлгий (аймгийн төв) алга.
- **Хэнтий +1**: TIC-д Бор-Өндөр бий (Wikipedia-гийн 17-д ордоггүй тосгон/суурин).
- **Орхон +1**: TIC-д Эрдэнэт (Баян-Өндөр сумын нутаг дахь хот) тусдаа нийтлэл.
- **Говьсүмбэр +1**: TIC-д Чойр (Сүмбэр сумын төв хот) тусдаа нийтлэл.
- **Улаанбаатар**: 9 дүүрэг бүгд бий (provinceFacts-д тоо байхгүй).

## Сумд аймгаар


### Баян-Өлгий аймаг — 13 (хуудас 10, жагсаалт 3)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Алтай сум | `/province/bayan-ulgii/altai` | 224 | зураг: scontent.fuln6-1.fna.fbcdn.net | #186 |
| Алтанцөгц сум | `/province/bayan-ulgii/altantsugts` | 295 | зураг: scontent.fuln6-1.fna.fbcdn.net | #92, #187 |
| Баяннуур сум | `/province/bayan-ulgii/bayannuur` | 323 | зураг: scontent.fuln1-1.fna.fbcdn.net | #69 |
| Бугат сум | `/province/bayan-ulgii/bugat` | 166 | зураг: scontent.fuln1-2.fna.fbcdn.net | #70 |
| Булган сум | `/province/bayan-ulgii/bulgan` | 409 | зураг: scontent.fuln1-1.fna.fbcdn.net | #67 |
| Буянт сум | жагсаалт (`/province/bayan-ulgii#buyant`) | 139 | зураг: scontent.fuln1-1.fna.fbcdn.net | #68 |
| Дэлүүн сум | `/province/bayan-ulgii/deluun` | 189 | зураг: scontent.fuln1-1.fna.fbcdn.net | #60 |
| Ногооннуур сум | `/province/bayan-ulgii/nogoonnuur` | 256 | зураг: scontent.fuln1-2.fna.fbcdn.net | #61 |
| Сагсай сум | жагсаалт (`/province/bayan-ulgii#sagsai`) | 149 | зураг: montsame.mn | #62 |
| Толбо сум | `/province/bayan-ulgii/tolbo` | 185 | зураг: i.ytimg.com | #63 |
| Улаанхус сум | жагсаалт (`/province/bayan-ulgii#ulaankhus`) | 135 | зураг: scontent.fuln1-1.fna.fbcdn.net | #64 |
| Цагааннуур тосгон | `/province/bayan-ulgii/tsagaannuur` | 177 | зураг: scontent.fuln6-1.fna.fbcdn.net | #66 |
| Цэнгэл сум | `/province/bayan-ulgii/tsengel` | 188 | зураг: i.ytimg.com | #65 |

### Баянхонгор аймаг — 18 (хуудас 11, жагсаалт 7)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Баацагаан сум | жагсаалт (`/province/bayankhongor#baatsagaan`) | 101 | зураг: www.facebook.com; зураг: base64 (эх нь тодорхойгүй) | #146 |
| Баян-Өндөр сум | жагсаалт (`/province/bayankhongor#bayan-undur`) | 99 | — | #150 |
| Баянбулаг сум | `/province/bayankhongor/bayanbulag` | 556 | — | #147 |
| Баянговь сум | жагсаалт (`/province/bayankhongor#bayangov`) | 94 | — | #148 |
| Баянлиг сум | жагсаалт (`/province/bayankhongor#bayanlig`) | 65 | — | #149 |
| Баянцагаан сум | `/province/bayankhongor/bayantsagaan` | 260 | — | #151 |
| Богд сум | `/province/bayankhongor/bogd` | 252 | зураг: scontent.fuln6-1.fna.fbcdn.net | #244 |
| Бөмбөгөр сум | `/province/bayankhongor/bumbugur` | 279 | — | #153 |
| Бууцагаан сум | жагсаалт (`/province/bayankhongor#buutsagaan`) | 132 | — | #154 |
| Галуут сум | `/province/bayankhongor/galuut` | 649 | зураг: lh3.googleusercontent.com | #155 |
| Гурванбулаг сум | `/province/bayankhongor/gurvanbulag` | 306 | — | #156 |
| Жаргалант сум | `/province/bayankhongor/jargalant` | 265 | — | #157 |
| Жинст сум | `/province/bayankhongor/jinst` | 273 | — | #158 |
| Заг сум | `/province/bayankhongor/zag` | 663 | — | #160 |
| Өлзийт сум | жагсаалт (`/province/bayankhongor#ulziit`) | 109 | — | #161 |
| Хүрээмарал сум | жагсаалт (`/province/bayankhongor#khureemaral`) | 39 | — | #159 |
| Шинэжинст сум | `/province/bayankhongor/shinejinst` | 340 | — | #41 |
| Эрдэнэцогт сум | `/province/bayankhongor/erdenetsogt` | 303 | — | #152 |

### Булган аймаг — 16 (хуудас 12, жагсаалт 4)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Баян-Агт сум | `/province/bulgan/bayan-agt` | 233 | зураг: scontent.fuln1-2.fna.fbcdn.net | #171 |
| Баяннуур сум | `/province/bulgan/bayannuur` | 180 | зураг: www.yp.mn | #172 |
| Бугат сум | `/province/bulgan/bugat` | 169 | зураг: scontent.fuln6-1.fna.fbcdn.net | #173 |
| Булган сум | `/province/bulgan/bulgan` | 575 | — | #36 |
| Бүрэгхангай сум | `/province/bulgan/buregkhangai` | 174 | зураг: scontent.fuln1-1.fna.fbcdn.net | #175 |
| Гурванбулаг сум | жагсаалт (`/province/bulgan#gurvanbulag`) | 149 | зураг: www.montsame.mn | #176 |
| Дашинчилэн сум | `/province/bulgan/dashinchilen` | 211 | зураг: scontent.fuln1-2.fna.fbcdn.net | #177 |
| Могод сум | `/province/bulgan/mogod` | 310 | зураг: montsame.mn | #178 |
| Орхон сум | `/province/bulgan/orkhon` | 153 | зураг: base64 (эх нь тодорхойгүй) | #179 |
| Рашаант сум | `/province/bulgan/rashaant` | 330 | зураг: rashaant.bu.gov.mn | #180 |
| Сайхан сум | жагсаалт (`/province/bulgan#saikhan`) | 59 | — | #181 |
| Сэлэнгэ сум | `/province/bulgan/selenge` | 548 | зураг: scontent.fuln1-1.fna.fbcdn.net | #182 |
| Тэшиг сум | жагсаалт (`/province/bulgan#teshig`) | 56 | зураг: scontent.fuln6-1.fna.fbcdn.net | #183 |
| Хангал сум | `/province/bulgan/khangal` | 303 | зураг: scontent.fuln6-1.fna.fbcdn.net | #184 |
| Хишиг-Өндөр сум | `/province/bulgan/khishig-undur` | 243 | зураг: scontent.fuln6-1.fna.fbcdn.net | #185 |
| Хутаг-Өндөр сум | жагсаалт (`/province/bulgan#khutag-undur`) | 89 | зураг: lh3.googleusercontent.com | #174 |

### Говь-Алтай аймаг — 18 (хуудас 10, жагсаалт 8)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Алтай сум | `/province/gov-altai/altai` | 181 | зураг: scontent.fuln2-2.fna.fbcdn.net | #275 |
| Баян-Уул сум | жагсаалт (`/province/gov-altai#bayan-uul`) | 144 | зураг: scontent.fuln1-2.fna.fbcdn.net | #276 |
| Бигэр сум | жагсаалт (`/province/gov-altai#biger`) | 138 | зураг: sector.gov.mn | #277 |
| Бугат сум | `/province/gov-altai/bugat` | 181 | зураг: sector.gov.mn | #278 |
| Дарви сум | `/province/gov-altai/darvi` | 166 | зураг: scontent.fuln2-2.fna.fbcdn.net | #280 |
| Дэлгэр сум | жагсаалт (`/province/gov-altai#delger`) | 144 | зураг: scontent.fuln1-1.fna.fbcdn.net | #279 |
| Есөнбулаг сум | `/province/gov-altai/yesunbulag` | 194 | зураг: scontent.fuln1-2.fna.fbcdn.net | #281 |
| Жаргалан сум | `/province/gov-altai/jargalan` | 183 | зураг: lh3.googleusercontent.com | #282 |
| Тайшир сум | жагсаалт (`/province/gov-altai#taishir`) | 150 | зураг: taishir.altai.gov.mn | #283 |
| Тонхил сум | `/province/gov-altai/tonkhil` | 151 | зураг: gereg.mn | #284 |
| Төгрөг сум | `/province/gov-altai/tugrug` | 186 | зураг: base64 (эх нь тодорхойгүй) | #285 |
| Халиун сум | жагсаалт (`/province/gov-altai#khaliun`) | 121 | — | #286 |
| Хөхморьт сум | `/province/gov-altai/khukhmort` | 244 | зураг: scontent.fuln1-2.fna.fbcdn.net | #287 |
| Цогт сум | жагсаалт (`/province/gov-altai#tsogt`) | 149 | зураг: lh3.googleusercontent.com | #288 |
| Цээл сум | `/province/gov-altai/tseel` | 196 | зураг: scontent.fuln1-1.fna.fbcdn.net | #289 |
| Чандмань сум | жагсаалт (`/province/gov-altai#chandman`) | 85 | зураг: chandmani.altai.gov.mn | #290 |
| Шарга сум | `/province/gov-altai/sharga` | 212 | зураг: base64 (эх нь тодорхойгүй) | #291 |
| Эрдэнэ сум | жагсаалт (`/province/gov-altai#erdene`) | 148 | зураг: base64 (эх нь тодорхойгүй) | #292 |

### Говьсүмбэр аймаг — 4 (хуудас 3, жагсаалт 1)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Баянтал сум | `/province/govsumber/bayantal` | 213 | зураг: lh3.googleusercontent.com | #267 |
| Сүмбэр сум | `/province/govsumber/sumber` | 221 | зураг: shilendans.gov.mn | #268 |
| Чойр сум | `/province/govsumber/choir` | 170 | зураг: i.ytimg.com | #270 |
| Шивээговь сум | жагсаалт (`/province/govsumber#shiveegov`) | 147 | — | #269 |

### Дархан-Уул аймаг — 4 (хуудас 2, жагсаалт 2)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Дархан сум | `/province/darkhan-uul/darkhan` | 234 | зураг: mcud.gov.mn | #271 |
| Орхон сум | `/province/darkhan-uul/orkhon` | 207 | зураг: lh3.googleusercontent.com | #274 |
| Хонгор сум | жагсаалт (`/province/darkhan-uul#khongor`) | 56 | зураг: lh3.googleusercontent.com | #273 |
| Шарын гол сум | жагсаалт (`/province/darkhan-uul#sharyn-gol`) | 133 | зураг: khural.mn | #272 |

### Дорноговь аймаг — 13 (хуудас 7, жагсаалт 6)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Айраг сум | жагсаалт (`/province/dornogov#airag`) | 111 | зураг: dornogovi.gov.mn | #293 |
| Алтанширээ сум | `/province/dornogov/altanshiree` | 188 | зураг: 103.17.109.33 | #294 |
| Даланжаргалан сум | жагсаалт (`/province/dornogov#dalanjargalan`) | 80 | зураг: www.dornogovi.gov.mn | #295 |
| Дэлгэрэх сум | `/province/dornogov/delgerekh` | 233 | зураг: lh3.googleusercontent.com | #296 |
| Замын-Үүд сум | `/province/dornogov/zamyn-uud` | 224 | зураг: niisleltimes.mn | #297 |
| Иххэт сум | жагсаалт (`/province/dornogov#ikhkhet`) | 129 | зураг: encrypted-tbn0.gstatic.com | #298 |
| Мандах сум | `/province/dornogov/mandakh` | 152 | зураг: scontent.fuln2-2.fna.fbcdn.net | #299 |
| Өргөн сум | жагсаалт (`/province/dornogov#urgun`) | 136 | зураг: base64 (эх нь тодорхойгүй) | #300 |
| Сайхандулаан сум | `/province/dornogov/saikhandulaan` | 188 | зураг: www.dornogovi.gov.mn | #301 |
| Улаанбадрах сум | `/province/dornogov/ulaanbadrakh` | 157 | зураг: dornogovi.gov.mn | #302 |
| Хатанбулаг сум | жагсаалт (`/province/dornogov#khatanbulag`) | 111 | зураг: khatanbulag.mn | #303 |
| Хөвсгөл сум | жагсаалт (`/province/dornogov#khuvsgul`) | 143 | зураг: encrypted-tbn0.gstatic.com | #304 |
| Эрдэнэ сум | `/province/dornogov/erdene` | 168 | зураг: base64 (эх нь тодорхойгүй) | #305 |

### Дорнод аймаг — 14 (хуудас 14, жагсаалт 0)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Баян-Уул сум | `/province/dornod/bayan-uul` | 1755 | — | #47 |
| Баяндун сум | `/province/dornod/bayandun` | 636 | зураг: scontent.fuln1-1.fna.fbcdn.net | #48 |
| Баянтүмэн сум | `/province/dornod/bayantumen` | 417 | зураг: scontent.fuln1-2.fna.fbcdn.net | #49 |
| Булган сум | `/province/dornod/bulgan` | 465 | зураг: montsame.mn | #50 |
| Гурванзагал сум | `/province/dornod/gurvanzagal` | 673 | зураг: scontent.fuln1-1.fna.fbcdn.net | #51 |
| Дашбалбар сум | `/province/dornod/dashbalbar` | 569 | зураг: travel.dornod.gov.mn | #52 |
| Матад сум | `/province/dornod/matad` | 436 | зураг: base64 (эх нь тодорхойгүй) | #53 |
| Сэргэлэн сум | `/province/dornod/sergelen` | 339 | зураг: travel.dornod.gov.mn | #56 |
| Халхгол сум | `/province/dornod/khalkhgol` | 1017 | — | #43 |
| Хөлөнбуйр сум | `/province/dornod/khulunbuir` | 716 | зураг: www.montsame.mn | #54 |
| Хэрлэн сум | `/province/dornod/kherlen` | 210 | зураг: travel.dornod.gov.mn | #55 |
| Цагаан-Овоо сум | `/province/dornod/tsagaan-ovoo` | 760 | зураг: travel.dornod.gov.mn | #57 |
| Чойбалсан сум | `/province/dornod/choibalsan` | 575 | зураг: i.ytimg.com | #58 |
| Чулуунхороот сум | `/province/dornod/chuluunkhoroot` | 436 | зураг: scontent.fuln6-1.fna.fbcdn.net | #59 |

### Дундговь аймаг — 15 (хуудас 9, жагсаалт 6)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Адаацаг сум | `/province/dundgov/adaatsag` | 178 | зураг: base64 (эх нь тодорхойгүй) | #306 |
| Баянжаргалан сум | `/province/dundgov/bayanjargalan` | 163 | зураг: base64 (эх нь тодорхойгүй) | #307 |
| Говь-Угтаал сум | `/province/dundgov/gov-ugtaal` | 192 | зураг: www.dundgovi.gov.mn | #308 |
| Гурвансайхан сум | жагсаалт (`/province/dundgov#gurvansaikhan`) | 120 | зураг: www.dundgovi.gov.mn | #309 |
| Дэлгэрхангай сум | `/province/dundgov/delgerkhangai` | 175 | зураг: lh3.googleusercontent.com | #310 |
| Дэлгэрцогт сум | `/province/dundgov/delgertsogt` | 199 | зураг: www.dundgovi.gov.mn | #311 |
| Дэрэн сум | жагсаалт (`/province/dundgov#deren`) | 146 | зураг: www.yp.mn | #312 |
| Луус сум | жагсаалт (`/province/dundgov#luus`) | 113 | зураг: lh3.googleusercontent.com | #313 |
| Өлзийт сум | `/province/dundgov/ulziit` | 197 | зураг: www.yp.mn | #314 |
| Өндөршил сум | `/province/dundgov/undurshil` | 170 | зураг: base64 (эх нь тодорхойгүй) | #315 |
| Сайнцагаан сум | жагсаалт (`/province/dundgov#saintsagaan`) | 133 | зураг: dundgovi.gov.mn | #317 |
| Сайхан-Овоо сум | `/province/dundgov/saikhan-ovoo` | 166 | зураг: base64 (эх нь тодорхойгүй) | #316 |
| Хулд сум | жагсаалт (`/province/dundgov#khuld`) | 87 | зураг: sector.gov.mn | #318 |
| Цагаандэлгэр сум | `/province/dundgov/tsagaandelger` | 166 | зураг: www.dundgovi.gov.mn | #319 |
| Эрдэнэдалай сум | жагсаалт (`/province/dundgov#erdenedalai`) | 105 | зураг: base64 (эх нь тодорхойгүй) | #320 |

### Завхан аймаг — 24 (хуудас 15, жагсаалт 9)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Алдархаан сум | жагсаалт (`/province/zavkhan#aldarkhaan`) | 137 | зураг: montsame.mn | #125 |
| Асгат сум | жагсаалт (`/province/zavkhan#asgat`) | 114 | зураг: scontent.fuln2-2.fna.fbcdn.net | #124 |
| Баянтэс сум | `/province/zavkhan/bayantes` | 836 | зураг: 3.bp.blogspot.com | #123 |
| Баянхайрхан сум | `/province/zavkhan/bayankhairkhan` | 1900 | зураг: scontent.fuln2-2.fna.fbcdn.net | #121 |
| Дөрвөлжин сум | `/province/zavkhan/durvuljin` | 415 | зураг: zavkhan.gov.mn | #122 |
| Завханмандал сум | жагсаалт (`/province/zavkhan#zavkhanmandal`) | 141 | зураг: montsame.mn | #126 |
| Идэр сум | `/province/zavkhan/ider` | 603 | зураг: montsame.mn | #129 |
| Их-Уул сум | жагсаалт (`/province/zavkhan#ikh-uul`) | 92 | зураг: montsame.mn | #130 |
| Нөмрөг сум | `/province/zavkhan/numrug` | 275 | зураг: www.montsame.mn | #132, #133 |
| Отгон сум | `/province/zavkhan/otgon` | 758 | — | #44 |
| Сантмаргац сум | жагсаалт (`/province/zavkhan#santmargats`) | 88 | зураг: www.shilendans.gov.mn | #135 |
| Сонгино сум | жагсаалт (`/province/zavkhan#songino`) | 114 | зураг: montsame.mn | #136 |
| Тосонцэнгэл сум | `/province/zavkhan/tosontsengel` | 159 | — | #228 |
| Түдэвтэй сум | жагсаалт (`/province/zavkhan#tudevtei`) | 95 | зураг: montsame.mn | #137 |
| Тэлмэн сум | `/province/zavkhan/telmen` | 200 | зураг: scontent.fuln2-2.fna.fbcdn.net | #128 |
| Тэс сум | `/province/zavkhan/tes` | 916 | зураг: scontent.fuln2-2.fna.fbcdn.net | #138 |
| Улиастай сум | `/province/zavkhan/uliastai` | 160 | зураг: lh3.googleusercontent.com | #139 |
| Ургамал сум | `/province/zavkhan/urgamal` | 576 | зураг: live.staticflickr.com | #140 |
| Цагаанхайрхан сум | `/province/zavkhan/tsagaankhairkhan` | 189 | — | #141 |
| Цагаанчулуут сум | `/province/zavkhan/tsagaanchuluut` | 159 | зураг: scontent.fuln6-1.fna.fbcdn.net | #142, #143 |
| Цэцэн-Уул сум | `/province/zavkhan/tsetsen-uul` | 206 | зураг: resource4.sodonsolution.org | #144 |
| Шилүүстэй сум | жагсаалт (`/province/zavkhan#shiluustei`) | 141 | зураг: admin.said.mn | #145 |
| Эрдэнэхайрхан сум | жагсаалт (`/province/zavkhan#erdenekhairkhan`) | 114 | зураг: scontent.fuln1-1.fna.fbcdn.net | #134 |
| Яруу сум | `/province/zavkhan/yaruu` | 247 | — | #127 |

### Орхон аймаг — 3 (хуудас 0, жагсаалт 3)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Баян-Өндөр сум | жагсаалт (`/province/orkhon#bayan-undur`) | 132 | зураг: base64 (эх нь тодорхойгүй) | #266 |
| Жаргалант сум | жагсаалт (`/province/orkhon#jargalant`) | 109 | зураг: montsame.mn | #264 |
| Эрдэнэт сум | жагсаалт (`/province/orkhon#erdenet`) | 111 | зураг: www.montsame.mn | #265 |

### Өвөрхангай аймаг — 19 (хуудас 14, жагсаалт 5)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Арвайхээр сум | `/province/uvurkhangai/arvaikheer` | 203 | зураг: www.montsame.mn | #245 |
| Баруунбаян-Улаан сум | `/province/uvurkhangai/baruunbayan-ulaan` | 172 | зураг: base64 (эх нь тодорхойгүй) | #260 |
| Бат-Өлзий сум | жагсаалт (`/province/uvurkhangai#bat-ulzii`) | 141 | зураг: inspection.gov.mn | #261 |
| Баян-Өндөр сум | `/province/uvurkhangai/bayan-undur` | 182 | зураг: media.mass.mn | #263 |
| Баянгол сум | `/province/uvurkhangai/bayangol` | 191 | зураг: i.ytimg.com | #259 |
| Богд сум | `/province/uvurkhangai/bogd` | 165 | зураг: www.montsame.mn | #254 |
| Бүрд сум | `/province/uvurkhangai/burd` | 171 | зураг: base64 (эх нь тодорхойгүй) | #262 |
| Гучин-Ус сум | жагсаалт (`/province/uvurkhangai#guchin-us`) | 125 | зураг: media.mass.mn | #258 |
| Есөнзүйл сум | `/province/uvurkhangai/yesunzuil` | 161 | зураг: lh3.googleusercontent.com | #257 |
| Зүүнбаян-Улаан сум | `/province/uvurkhangai/zuunbayan-ulaan` | 170 | зураг: scontent.fuln1-1.fna.fbcdn.net | #255 |
| Нарийнтээл сум | жагсаалт (`/province/uvurkhangai#nariinteel`) | 142 | зураг: i.ytimg.com | #253 |
| Өлзийт сум | `/province/uvurkhangai/ulziit` | 319 | зураг: scontent.fuln1-2.fna.fbcdn.net | #256 |
| Сант сум | жагсаалт (`/province/uvurkhangai#sant`) | 92 | зураг: lh3.googleusercontent.com | #252 |
| Тарагт сум | жагсаалт (`/province/uvurkhangai#taragt`) | 129 | зураг: scontent.fuln1-1.fna.fbcdn.net | #251 |
| Төгрөг сум | `/province/uvurkhangai/tugrug` | 199 | зураг: montsame.mn | #250 |
| Уянга сум | `/province/uvurkhangai/uyanga` | 154 | зураг: scontent.fuln1-1.fna.fbcdn.net | #249 |
| Хайрхандулаан сум | `/province/uvurkhangai/khairkhandulaan` | 231 | зураг: scontent.fuln1-1.fna.fbcdn.net | #248 |
| Хархорин сум | `/province/uvurkhangai/kharkhorin` | 157 | зураг: cdn.eagle.mn | #246 |
| Хужирт сум | `/province/uvurkhangai/khujirt` | 182 | зураг: news.mn | #247 |

### Өмнөговь аймаг — 15 (хуудас 9, жагсаалт 6)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Баян-Овоо сум | `/province/umnugov/bayan-ovoo` | 424 | — | #37, #164 |
| Баяндалай сум | жагсаалт (`/province/umnugov#bayandalai`) | 147 | — | #101 |
| Булган сум | `/province/umnugov/bulgan` | 218 | — | #104 |
| Гурвантэс сум | `/province/umnugov/gurvantes` | 224 | — | #102 |
| Даланзадгад сум | `/province/umnugov/dalanzadgad` | 254 | — | #100 |
| Мандал-Овоо сум | `/province/umnugov/mandal-ovoo` | 187 | — | #93 |
| Манлай сум | жагсаалт (`/province/umnugov#manlai`) | 76 | — | #95 |
| Ноён сум | жагсаалт (`/province/umnugov#noyon`) | 86 | — | #105 |
| Номгон сум | `/province/umnugov/nomgon` | 387 | — | #165 |
| Сэврэй сум | `/province/umnugov/sevrei` | 235 | — | #103 |
| Ханбогд сум | `/province/umnugov/khanbogd` | 762 | — | #33 |
| Ханхонгор сум | жагсаалт (`/province/umnugov#khankhongor`) | 145 | — | #99 |
| Хүрмэн сум | `/province/umnugov/khurmen` | 212 | — | #166 |
| Цогт-Овоо сум | жагсаалт (`/province/umnugov#tsogt-ovoo`) | 101 | — | #94 |
| Цогтцэций сум | жагсаалт (`/province/umnugov#tsogttsetsii`) | 97 | — | #96 |

### Сүхбаатар аймаг — 13 (хуудас 6, жагсаалт 7)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Асгат сум | жагсаалт (`/province/sukhbaatar#asgat`) | 121 | — | #190 |
| Баруун-Урт сум | `/province/sukhbaatar/baruun-urt` | 227 | — | #191 |
| Баяндэлгэр сум | жагсаалт (`/province/sukhbaatar#bayandelger`) | 130 | — | #192 |
| Дарьганга сум | `/province/sukhbaatar/darganga` | 350 | — | #193 |
| Мөнххаан сум | `/province/sukhbaatar/munkhkhaan` | 349 | — | #39 |
| Наран сум | жагсаалт (`/province/sukhbaatar#naran`) | 75 | — | #194 |
| Онгон сум | жагсаалт (`/province/sukhbaatar#ongon`) | 133 | — | #195 |
| Сүхбаатар сум | `/province/sukhbaatar/sukhbaatar` | 333 | — | #196 |
| Түвшинширээ сум | жагсаалт (`/province/sukhbaatar#tuvshinshiree`) | 142 | — | #197 |
| Түмэнцогт сум | `/province/sukhbaatar/tumentsogt` | 222 | — | #198 |
| Уулбаян сум | жагсаалт (`/province/sukhbaatar#uulbayan`) | 118 | — | #199 |
| Халзан сум | жагсаалт (`/province/sukhbaatar#khalzan`) | 134 | — | #200 |
| Эрдэнэцагаан сум | `/province/sukhbaatar/erdenetsagaan` | 193 | — | #201 |

### Сэлэнгэ аймаг — 17 (хуудас 6, жагсаалт 11)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Алтанбулаг сум | жагсаалт (`/province/selenge#altanbulag`) | 125 | зураг: base64 (эх нь тодорхойгүй) | #321 |
| Баруунбүрэн сум | `/province/selenge/baruunburen` | 217 | зураг: base64 (эх нь тодорхойгүй) | #322 |
| Баянгол сум | жагсаалт (`/province/selenge#bayangol`) | 134 | зураг: base64 (эх нь тодорхойгүй) | #323 |
| Ерөө сум | жагсаалт (`/province/selenge#yeruu`) | 144 | зураг: base64 (эх нь тодорхойгүй) | #324 |
| Жавхлант сум | жагсаалт (`/province/selenge#javkhlant`) | 77 | зураг: base64 (эх нь тодорхойгүй) | #1293 |
| Зүүнбүрэн сум | жагсаалт (`/province/selenge#zuunburen`) | 145 | зураг: lh3.googleusercontent.com | #1294 |
| Мандал сум | `/province/selenge/mandal` | 172 | зураг: www.montsame.mn | #1295 |
| Орхон сум | жагсаалт (`/province/selenge#orkhon`) | 150 | зураг: orkhon.se.gov.mn | #1296 |
| Орхонтуул сум | жагсаалт (`/province/selenge#orkhontuul`) | 134 | зураг: orkhontuul.se.gov.mn | #1297 |
| Сайхан сум | жагсаалт (`/province/selenge#saikhan`) | 126 | зураг: base64 (эх нь тодорхойгүй) | #1299 |
| Сант сум | жагсаалт (`/province/selenge#sant`) | 149 | зураг: sant.se.gov.mn | #1298 |
| Сүхбаатар сум | `/province/selenge/sukhbaatar` | 162 | зураг: base64 (эх нь тодорхойгүй) | #1300 |
| Түшиг сум | жагсаалт (`/province/selenge#tushig`) | 146 | зураг: base64 (эх нь тодорхойгүй) | #1301 |
| Хушаат сум | жагсаалт (`/province/selenge#khushaat`) | 140 | зураг: base64 (эх нь тодорхойгүй) | #1303 |
| Хүдэр сум | `/province/selenge/khuder` | 217 | зураг: base64 (эх нь тодорхойгүй) | #1302 |
| Цагааннуур сум | `/province/selenge/tsagaannuur` | 169 | зураг: base64 (эх нь тодорхойгүй) | #1304 |
| Шаамар сум | `/province/selenge/shaamar` | 166 | зураг: base64 (эх нь тодорхойгүй) | #1305 |

### Төв аймаг — 27 (хуудас 10, жагсаалт 17)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Алтанбулаг сум | жагсаалт (`/province/tuv#altanbulag`) | 79 | — | #167 |
| Аргалант сум | жагсаалт (`/province/tuv#argalant`) | 56 | — | #168 |
| Архуст сум | `/province/tuv/arkhust` | 246 | — | #169 |
| Батсүмбэр сум | жагсаалт (`/province/tuv#batsumber`) | 109 | — | #202 |
| Баян сум | `/province/tuv/bayan` | 171 | — | #203 |
| Баян-Өнжүүл сум | жагсаалт (`/province/tuv#bayan-unjuul`) | 100 | — | #207 |
| Баяндэлгэр сум | жагсаалт (`/province/tuv#bayandelger`) | 55 | — | #170 |
| Баянжаргалан сум | жагсаалт (`/province/tuv#bayanjargalan`) | 148 | — | #204 |
| Баянхангай сум | жагсаалт (`/province/tuv#bayankhangai`) | 105 | — | #205 |
| Баянцагаан сум | `/province/tuv/bayantsagaan` | 164 | — | #206 |
| Баянцогт сум | жагсаалт (`/province/tuv#bayantsogt`) | 130 | — | #208 |
| Баянчандмань сум | жагсаалт (`/province/tuv#bayanchandman`) | 130 | — | #210 |
| Борнуур сум | жагсаалт (`/province/tuv#bornuur`) | 138 | — | #211 |
| Бүрэн сум | жагсаалт (`/province/tuv#buren`) | 124 | — | #212 |
| Дэлгэрхаан сум | `/province/tuv/delgerkhaan` | 182 | — | #213 |
| Жаргалант сум | жагсаалт (`/province/tuv#jargalant`) | 101 | — | #209 |
| Заамар сум | жагсаалт (`/province/tuv#zaamar`) | 68 | — | #214 |
| Зуунмод хот | `/province/tuv/zuunmod` | 232 | — | #34 |
| Лүн сум | жагсаалт (`/province/tuv#lun`) | 128 | — | #215 |
| Мөнгөнморьт сум | жагсаалт (`/province/tuv#mungunmort`) | 97 | — | #216 |
| Өндөрширээт сум | жагсаалт (`/province/tuv#undurshireet`) | 125 | — | #217 |
| Сүмбэр сум | `/province/tuv/sumber` | 161 | — | #218 |
| Сэргэлэн сум | жагсаалт (`/province/tuv#sergelen`) | 148 | — | #219 |
| Угтаалцайдам сум | `/province/tuv/ugtaaltsaidam` | 153 | — | #220 |
| Цээл сум | `/province/tuv/tseel` | 341 | — | #42 |
| Эрдэнэ сум | `/province/tuv/erdene` | 165 | — | #221 |
| Эрдэнэсант сум | `/province/tuv/erdenesant` | 223 | — | #222 |

### Увс аймаг — 18 (хуудас 14, жагсаалт 4)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Баруунтуруун сум | `/province/uvs/baruunturuun` | 255 | зураг: base64 (эх нь тодорхойгүй) | #1342 |
| Бөхмөрөн сум | `/province/uvs/bukhmurun` | 173 | зураг: na.gogo.mn | #1343 |
| Давст сум | жагсаалт (`/province/uvs#davst`) | 136 | зураг: base64 (эх нь тодорхойгүй) | #1344 |
| Завхан сум | `/province/uvs/zavkhan` | 225 | зураг: base64 (эх нь тодорхойгүй) | #1345 |
| Зүүнговь сум | `/province/uvs/zuungov` | 192 | зураг: base64 (эх нь тодорхойгүй) | #1346 |
| Зүүнхангай сум | жагсаалт (`/province/uvs#zuunkhangai`) | 141 | зураг: lh3.googleusercontent.com | #1347 |
| Малчин сум | `/province/uvs/malchin` | 188 | зураг: encrypted-tbn0.gstatic.com | #1348 |
| Наранбулаг сум | `/province/uvs/naranbulag` | 193 | зураг: montsame.mn | #1349 |
| Өлгий сум | `/province/uvs/ulgii` | 215 | зураг: montsame.mn | #1350 |
| Өмнөговь сум | `/province/uvs/umnugov` | 169 | зураг: www.uvs.gov.mn | #1351 |
| Өндөрхангай сум | `/province/uvs/undurkhangai` | 174 | зураг: base64 (эх нь тодорхойгүй) | #1352 |
| Сагил сум | `/province/uvs/sagil` | 215 | зураг: www.yp.mn | #1353 |
| Тариалан сум | `/province/uvs/tarialan` | 222 | зураг: www.uvs.gov.mn | #1354 |
| Түргэн сум | `/province/uvs/turgen` | 190 | зураг: lh3.googleusercontent.com | #1356 |
| Тэс сум | `/province/uvs/tes` | 228 | зураг: www.yp.mn | #1355 |
| Ховд сум | `/province/uvs/khovd` | 182 | зураг: lh3.googleusercontent.com | #1357 |
| Хяргас сум | жагсаалт (`/province/uvs#khyargas`) | 147 | зураг: base64 (эх нь тодорхойгүй) | #1358 |
| Цагаанхайрхан сум | жагсаалт (`/province/uvs#tsagaankhairkhan`) | 147 | зураг: www.uvs.gov.mn | #1359 |

### Улаанбаатар (дүүрэг) — 9 (хуудас 5, жагсаалт 4)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Багануур дүүрэг | `/province/ulaanbaatar/baganuur` | 206 | — | #2 |
| Багахангай дүүрэг | `/province/ulaanbaatar/bagakhangai` | 224 | — | #25 |
| Баянгол дүүрэг | жагсаалт (`/province/ulaanbaatar#bayangol`) | 118 | — | #26 |
| Баянзүрх дүүрэг | жагсаалт (`/province/ulaanbaatar#bayanzurkh`) | 116 | — | #27 |
| Налайх дүүрэг | `/province/ulaanbaatar/nalaikh` | 351 | — | #28 |
| Сонгинохайрхан дүүрэг | `/province/ulaanbaatar/songinokhairkhan` | 619 | — | #29 |
| Сүхбаатар дүүрэг | жагсаалт (`/province/ulaanbaatar#sukhbaatar`) | 140 | — | #30 |
| Хан-Уул дүүрэг | `/province/ulaanbaatar/khan-uul` | 189 | — | #31 |
| Чингэлтэй дүүрэг | жагсаалт (`/province/ulaanbaatar#chingeltei`) | 111 | — | #32 |

### Ховд аймаг — 17 (хуудас 15, жагсаалт 2)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Алтай сум | `/province/khovd/altai` | 173 | зураг: base64 (эх нь тодорхойгүй) | #1325 |
| Булган сум | `/province/khovd/bulgan` | 176 | зураг: montsame.mn | #1326 |
| Буянт сум | `/province/khovd/buyant` | 235 | зураг: base64 (эх нь тодорхойгүй) | #1341 |
| Дарви сум | `/province/khovd/darvi` | 155 | зураг: lh3.googleusercontent.com | #1327 |
| Дөргөн сум | `/province/khovd/durgun` | 197 | зураг: base64 (эх нь тодорхойгүй) | #1328 |
| Дуут сум | `/province/khovd/duut` | 275 | зураг: lh3.googleusercontent.com | #1329 |
| Жаргалант сум | `/province/khovd/jargalant` | 254 | зураг: dnn.mn | #1330 |
| Зэрэг сум | `/province/khovd/zereg` | 244 | зураг: www.yp.mn | #1331 |
| Манхан сум | `/province/khovd/mankhan` | 191 | зураг: base64 (эх нь тодорхойгүй) | #1332 |
| Мөнххайрхан сум | `/province/khovd/munkhkhairkhan` | 173 | зураг: www.yp.mn | #1333 |
| Мөст сум | жагсаалт (`/province/khovd#must`) | 130 | зураг: scontent.fuln1-1.fna.fbcdn.net | #1334 |
| Мянгад сум | `/province/khovd/myangad` | 164 | зураг: www.yp.mn | #1335 |
| Үенч сум | `/province/khovd/uyench` | 161 | зураг: scontent.fuln2-2.fna.fbcdn.net | #1336 |
| Ховд сум | жагсаалт (`/province/khovd#khovd`) | 149 | зураг: base64 (эх нь тодорхойгүй) | #1337 |
| Цэцэг сум | `/province/khovd/tsetseg` | 153 | зураг: lh3.googleusercontent.com | #1339 |
| Чандмань сум | `/province/khovd/chandman` | 178 | зураг: base64 (эх нь тодорхойгүй) | #1338 |
| Эрдэнэбүрэн сум | `/province/khovd/erdeneburen` | 223 | зураг: base64 (эх нь тодорхойгүй) | #1340 |

### Хөвсгөл аймаг — 21 (хуудас 8, жагсаалт 13)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Алаг-Эрдэнэ сум | жагсаалт (`/province/khuvsgul#alag-erdene`) | 123 | — | #223 |
| Арбулаг сум | жагсаалт (`/province/khuvsgul#arbulag`) | 98 | — | #224 |
| Баянзүрх сум | жагсаалт (`/province/khuvsgul#bayanzurkh`) | 102 | — | #225 |
| Бүрэнтогтох сум | `/province/khuvsgul/burentogtokh` | 152 | — | #226 |
| Галт сум | `/province/khuvsgul/galt` | 290 | — | #35 |
| Жаргалант сум | `/province/khuvsgul/jargalant` | 161 | — | #229 |
| Их-Уул сум | жагсаалт (`/province/khuvsgul#ikh-uul`) | 143 | — | #230 |
| Мөрөн сум | жагсаалт (`/province/khuvsgul#murun`) | 132 | — | #231 |
| Тариалан сум | `/province/khuvsgul/tarialan` | 165 | — | #232 |
| Тосонцэнгэл сум | жагсаалт (`/province/khuvsgul#tosontsengel`) | 83 | — | #241 |
| Төмөрбулаг сум | жагсаалт (`/province/khuvsgul#tumurbulag`) | 114 | — | #233 |
| Түнэл сум | жагсаалт (`/province/khuvsgul#tunel`) | 103 | — | #234 |
| Улаан-Уул сум | жагсаалт (`/province/khuvsgul#ulaan-uul`) | 80 | — | #235 |
| Ханх сум | жагсаалт (`/province/khuvsgul#khankh`) | 130 | — | #236 |
| Хатгал сум | `/province/khuvsgul/khatgal` | 253 | — | #237 |
| Цагаан-Уул сум | `/province/khuvsgul/tsagaan-uul` | 209 | — | #239 |
| Цагаан-Үүр сум | `/province/khuvsgul/tsagaan-uur` | 157 | — | #240 |
| Цагааннуур сум | жагсаалт (`/province/khuvsgul#tsagaannuur`) | 77 | — | #238 |
| Чандмань-Өндөр сум | жагсаалт (`/province/khuvsgul#chandman-undur`) | 85 | — | #242 |
| Шинэ-Идэр сум | жагсаалт (`/province/khuvsgul#shine-ider`) | 104 | — | #243 |
| Эрдэнэбулган сум | `/province/khuvsgul/erdenebulgan` | 206 | — | #227 |

### Хэнтий аймаг — 18 (хуудас 9, жагсаалт 9)

| Сум | Хуудас | Үг | needsReplacement | TIC нийтлэл |
|---|---|--:|---|---|
| Батноров сум | жагсаалт (`/province/khentii#batnorov`) | 134 | зураг: scontent.fuln1-2.fna.fbcdn.net | #1307 |
| Батширээт сум | жагсаалт (`/province/khentii#batshireet`) | 104 | зураг: scontent.fuln6-1.fna.fbcdn.net | #1308 |
| Баян-Адарга сум | жагсаалт (`/province/khentii#bayan-adarga`) | 106 | зураг: scontent.fuln1-1.fna.fbcdn.net | #1309 |
| Баян-Овоо сум | `/province/khentii/bayan-ovoo` | 169 | зураг: base64 (эх нь тодорхойгүй) | #1312 |
| Баянмөнх сум | жагсаалт (`/province/khentii#bayanmunkh`) | 136 | зураг: base64 (эх нь тодорхойгүй) | #1311 |
| Баянхутаг сум | жагсаалт (`/province/khentii#bayankhutag`) | 113 | зураг: khentii.mn | #1310 |
| Биндэр сум | жагсаалт (`/province/khentii#binder`) | 136 | зураг: i.ytimg.com | #1313 |
| Бор-Өндөр сум | `/province/khentii/bor-undur` | 203 | зураг: scontent.fuln1-1.fna.fbcdn.net | #1324 |
| Галшар сум | `/province/khentii/galshar` | 165 | зураг: base64 (эх нь тодорхойгүй) | #1317 |
| Дадал сум | `/province/khentii/dadal` | 2011 | — | #110, #111, #112, #1314 |
| Дархан сум | `/province/khentii/darkhan` | 199 | зураг: base64 (эх нь тодорхойгүй) | #1315 |
| Дэлгэрхаан сум | жагсаалт (`/province/khentii#delgerkhaan`) | 112 | зураг: base64 (эх нь тодорхойгүй) | #1316 |
| Жаргалтхаан сум | `/province/khentii/jargaltkhaan` | 213 | зураг: scontent.fuln1-1.fna.fbcdn.net | #1318 |
| Мөрөн сум | жагсаалт (`/province/khentii#murun`) | 111 | зураг: base64 (эх нь тодорхойгүй) | #1320 |
| Норовлин сум | жагсаалт (`/province/khentii#norovlin`) | 150 | зураг: lh3.googleusercontent.com | #1321 |
| Өмнөдэлгэр сум | `/province/khentii/umnudelger` | 194 | зураг: base64 (эх нь тодорхойгүй) | #1322 |
| Хэрлэн сум | `/province/khentii/kherlen` | 183 | зураг: base64 (эх нь тодорхойгүй) | #1319 |
| Цэнхэрмандал сум | `/province/khentii/tsenkhermandal` | 180 | зураг: lh3.googleusercontent.com | #1323 |

## Татаж чадаагүй зураг (105)

Нийтлэлээс хассан (гуравдагч сайтаас шууд холбохгүй дүрмээр), entry нь needsReplacement=true. Эх сайтаар: Facebook CDN 49, Google proxy (lh3.googleusercontent.com) 22, yp.mn 8, dundgovi.gov.mn 5, i.ytimg.com 4, sector.gov.mn 3, facebook.com (зураг биш хуудас) 2, shilendans.gov.mn 2, бусад 10. Дэлгэрэнгүй жагсаалт: `import-batch01b.js`-ийн лог.

## 2026-10-20: нийтлэл

- 316 сум, дүүрэг болон 174 asset-ийг нийтэлсэн (`scripts/tic/publish-batch01b.js`). Нийтлэхийн өмнө Хөвсгөлийн Эрдэнэбулган сум (`tic-c13-227`) Contentful-ээс устсан байсан (Архангайн Эрдэнэбулгантай нэр давхцдаг тул алдаагаар устгагдсан бололтой), `import-batch01b.js --only=c13_227`-оор дахин үүсгэв.
- Production шалгалт (`scripts/tic/verify-batch01b.js`): 20 аймаг + Улаанбаатарын хуудсанд бүх сум (анкертай), 189 тусдаа хуудас 200 / index, follow / өөрийн canonical / sitemap-д, redirect хүснэгтийн 323 new_url 200 (анкер нь HTML-д). Асуудал 0.

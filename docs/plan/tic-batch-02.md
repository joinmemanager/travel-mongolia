# TIC 2-р багц: Монголын түүх (cate14, 44 нийтлэл)

> 2026-10-19. Contentful-д бүгд **Draft** (publish хийгээгүй), preview дээр харагдана. Скрипт: `scripts/tic/` (`fetch-batch02` → `schema-batch02` → `import-batch02`). Redirect: [batch-02-history.csv](../redirects/batch-02-history.csv) (44 мөр). Импортоос өмнөх нөөц: `backups/contentful-2026-10-19-pre-batch02/`.

## Хаана, ямар бүтцээр

- **Төрөл:** шинэ `historyArticle` (Түүхийн нийтлэл): `title`, `slug`, `period`, `order`, `image`, `body`, `seoTitle` (≤60), `seoDescription` (≤160), `sourceUrl`, `needsReplacement`, `reviewedBy`, `lastUpdated`. `story` төрөл тохироогүй: түүний `topic` нь culture/nature…, `/stories` хаб нь орон нутгийн хүмүүсийн зөвшөөрөлтэй (`consentObtained`) түүхэнд зориулагдсан. Content type 14 → 15.
- **Хаяг:** `/about/history/<slug>` (slug нь tic-inventory.csv-ийн санал болгосон slug). Хуудас `app/(sec-about)/about/history/[slug]` дотор тул «Монголын тухай» хэсгийн hero, «Сэдвийн жагсаалт» хэвээр, жагсаалтад «Монголын түүх» мөр идэвхтэй (`activeRow`, `lib/sections.ts`). Нийтлэлийн хуудас өөрийн замчлал (Нүүр › Монголын тухай › Монголын түүх › Нийтлэл), үеийн шошго (`/about/history#<үе>` руу), H1, бие, тухайн үеийн өмнөх/дараах нийтлэл, Article JSON-LD-тэй.
- **Түүхийн хуудас** (`/about/history`): одоо байгаа 7 үеийн хэсэг бүрийн (anchor id-ууд өөрчлөгдөөгүй) доор «Дэлгэрэнгүй нийтлэлүүд» жагсаалт, төгсгөлд нь шинэ **«Сэдэвчилсэн түүх» (`#themes`)** хэсэг (цаг үеэр хуваагдахгүй 12 нийтлэл). Sidebar энэ хэсгийг автоматаар уншина. Хуудас server component болсон, metadata нь `layout.tsx`-ээс `page.tsx` руу шилжсэн (layout нь одоо `[slug]`-ийг ороодог тул).
- `period` = түүхийн хуудасны хэсгийн id: `ancient-land`, `hunnu-empires`, `great-mongol`, `mongol-empire`, `xvii-xix-century`, `xx-century`, `modern-mongolia`, `themes`. Үе, дарааллыг `scripts/tic/_batch02.js`-д гараар хуваарилсан.
- Webhook (`/api/revalidate`), sitemap-д `historyArticle` нэмэгдсэн. Production-д нийтлэл нийтлэгдэх хүртэл жагсаалт хоосон, хуудас өмнөх шигээ харагдана.

## Текст

- TIC-ийн текстийг өөрчлөөгүй. Гарчгийг ТОМ үсгээс энгийн бичлэг рүү шилжүүлсэн (жишээ нь «ЧИНГИС ХААН БА ИХ МОНГОЛ УЛС» → «Чингис хаан ба Их Монгол Улс»), үг, тэмдэгт нь ижил.
- Нийтлэл бүрийн төгсгөлийн TIC-ийн сурталчилгааны мөр («Та аялал, амралтын талаарх илүү их мэдээ мэдээллийг ЭНД дарж аваарай», joinme.mn холбоостой) хасагдсан.
- **13 нийтлэлд** энэ мөрийн дараа англи хувилбар байсан (12 нь «Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky"» номоос). Түүнийг өөрчлөхгүйгээр `body`-ийн **`en` locale**-д хадгалсан, сайт `mn`-ийг харуулдаг тул харагдахгүй. Номын зохиогчийн эрхтэй тул `needsReplacement`.
- `seoTitle` «<Гарчиг> — Монголын түүх | Travel Hub Mongolia» (урт бол брэндгүй), `seoDescription` нийтлэлийн эхний өгүүлбэрүүдээс 120–155 тэмдэгт.
- `needsReplacement = true`: **30** нийтлэл («Монгол орны лавлах»-аас 29, Facebook-ийн хувь хүний бичвэр 1, en хувилбар 13; давхцалтай). 14 нь false.

## Зураг

47 зураг татаж Draft asset болгосон (бүгд touristinfocenter.mn сервер дээрх, алдаа 0). Asset бүрийн description-д «Зураг: touristinfocenter.mn» credit, TIC-ийн эх хаяг бий. Нийтлэлийн эхний зураг нь `image` талбарт. 14 нийтлэл зураггүй.

## Нийтлэлүүд

### Эртний Монгол нутаг (`#ancient-land`, 2)

| # | Нийтлэл | Хаяг | Үг | Зураг | needsReplacement | TIC |
|--:|---|---|--:|--:|---|---|
| 1 | Чулуун зэвсгийн үеийн дурсгал | `/about/history/chuluun-zevsgiin-ueiin-dursgal` | 918 | 0 | — | [#135](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=135) |
| 2 | Монголын палеонтологийн түүх | `/about/history/mongolyn-paleontologiin-tuukh` | 396 | 0 | — | [#125](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=125) |

### Хүннү ба эртний төрт улсууд (`#hunnu-empires`, 6)

| # | Нийтлэл | Хаяг | Үг | Зураг | needsReplacement | TIC |
|--:|---|---|--:|--:|---|---|
| 1 | Хүннү | `/about/history/khunnu` | 1025 (+en 529) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky" | [#28](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=28) |
| 2 | Сяньби буюу Сүмбэ | `/about/history/syanbi-buyuu-sumbe` | 281 (+en 154) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky" | [#29](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=29) |
| 3 | Жужан буюу Нирун | `/about/history/jujan-buyuu-nirun` | 302 (+en 202) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky" | [#30](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=30) |
| 4 | Түрэгийн эзэнт гүрэн | `/about/history/turegiin-ezent-guren` | 661 (+en 693) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky" | [#31](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=31) |
| 5 | Уйгарын хаант улс | `/about/history/uigaryn-khaant-uls` | 404 (+en 649) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky" | [#32](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=32) |
| 6 | Кидан буюу Хятан | `/about/history/kidan-buyuu-khyatan` | 459 (+en 873) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky" | [#33](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=33) |

### Их Монгол Улс (`#great-mongol`, 4)

| # | Нийтлэл | Хаяг | Үг | Зураг | needsReplacement | TIC |
|--:|---|---|--:|--:|---|---|
| 1 | Чингис хаан ба Их Монгол Улс | `/about/history/chingis-khaan-ba-ikh-mongol-uls` | 4049 (+en 3550) | 3 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky' | [#34](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=34) |
| 2 | Чингис хаан ба Бөртэ үжинээс төрсөн охид | `/about/history/chingis-khaan-ba-burte-ujinees-tursun` | 1143 | 0 | — | [#149](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=149) |
| 3 | Монголын нууц товчооны түүх | `/about/history/mongolyn-nuuts-tovchoony-tuukh` | 473 | 0 | Монгол орны лавлах | [#123](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=123) |
| 4 | Өнөөгийн ертөнцийг үндэслэгч эзэн Чингис хаан - ном | `/about/history/unuugiin-ertuntsiig-undeslegch-ezen-chingis-khaan` | 287 | 0 | — | [#132](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=132) |

### Монголын эзэнт гүрэн (`#mongol-empire`, 5)

| # | Нийтлэл | Хаяг | Үг | Зураг | needsReplacement | TIC |
|--:|---|---|--:|--:|---|---|
| 1 | Алтан Ордны улс ба Зүчи | `/about/history/altan-ordny-uls-ba-zuchi` | 846 | 3 | Монгол орны лавлах | [#35](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=35) |
| 2 | Эл хант улс | `/about/history/el-khant-uls` | 724 | 2 | Монгол орны лавлах | [#41](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=41) |
| 3 | Цагаадайн улс | `/about/history/tsagaadain-uls` | 320 | 1 | Монгол орны лавлах | [#36](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=36) |
| 4 | Хубилай хаан ба Юань гүрэн | `/about/history/khubilai-khaan-ba-yuan-guren` | 763 (+en 994) | 2 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky' | [#44](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=44) |
| 5 | Юань гүрний элч Марко Поло | `/about/history/yuan-gurnii-elch-marko-polo` | 431 | 1 | Монгол орны лавлах | [#116](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=116) |

### XVII–XIX зууны Монгол (`#xvii-xix-century`, 6)

| # | Нийтлэл | Хаяг | Үг | Зураг | needsReplacement | TIC |
|--:|---|---|--:|--:|---|---|
| 1 | Бага хаадын үе буюу бутралын үе | `/about/history/baga-khaadyn-ue-buyuu-butralyn-ue` | 785 (+en 1321) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson 'Mongolia Nomad Empire of Eternal Blue sky" | [#45](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=45) |
| 2 | Халх Монгол | `/about/history/khalkh-mongol` | 555 | 1 | Монгол орны лавлах | [#47](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=47) |
| 3 | Дөрвөн Ойрад | `/about/history/durvun-oirad` | 536 | 1 | Монгол орны лавлах | [#48](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=48) |
| 4 | Зүүн гарын хаант улс | `/about/history/zuun-garyn-khaant-uls` | 547 | 1 | Монгол орны лавлах | [#50](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=50) |
| 5 | Монголын Өвөр нутаг Манжид эзлэгдсэн түүх. 1616-1626 он. | `/about/history/mongolyn-uvur-nutag-manjid-ezlegdsen-tuukh` | 1785 | 1 | эх сурвалж: Facebook (хувь хүн) | [#130](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=130) |
| 6 | Монгол орон Манжийн эрхшээлийн үед | `/about/history/mongol-oron-manjiin-erkhsheeliin-ued` | 1068 (+en 1794) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue sky" | [#53](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=53) |

### XX зууны Монгол (`#xx-century`, 5)

| # | Нийтлэл | Хаяг | Үг | Зураг | needsReplacement | TIC |
|--:|---|---|--:|--:|---|---|
| 1 | Богд хаант Монгол Улс | `/about/history/bogd-khaant-mongol-uls` | 658 (+en 1446) | 1 | Монгол орны лавлах; en хувилбар: эх сурвалж тодорхойгүй | [#54](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=54) |
| 2 | Богд хаант Монгол Улсын төрийн бэлгэдэл | `/about/history/bogd-khaant-mongol-ulsyn-turiin-belgedel` | 1159 | 2 | — | [#107](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=107) |
| 3 | Хиагтын 3 улсын хэлэлцээр | `/about/history/khiagtyn-3-ulsyn-kheleltseer` | 250 | 1 | — | [#168](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=168) |
| 4 | Бүгд Найрамдах Монгол Ард Улс | `/about/history/bugd-nairamdakh-mongol-ard-uls` | 1830 (+en 2010) | 3 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky" | [#55](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=55) |
| 5 | Халхголын дайн ба Сталины стратеги | `/about/history/khalkhgolyn-dain-ba-staliny-strategi` | 951 | 0 | — | [#167](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=167) |

### Орчин үеийн Монгол Улс (`#modern-mongolia`, 4)

| # | Нийтлэл | Хаяг | Үг | Зураг | needsReplacement | TIC |
|--:|---|---|--:|--:|---|---|
| 1 | Монгол Улс | `/about/history/mongol-uls` | 1593 (+en 434) | 1 | Монгол орны лавлах; en хувилбар: Resource: Carl Robinson "Mongolia Nomad Empire of Eternal Blue Sky" | [#56](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=56) |
| 2 | Монгол Улсын төрийн бэлгэдэл | `/about/history/mongol-ulsyn-turiin-belgedel` | 976 | 0 | — | [#126](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=126) |
| 3 | Монгол Улсын цол, одон медаль, төрийн шагнал | `/about/history/mongol-ulsyn-tsol-odon-medal-turiin` | 1607 | 0 | Монгол орны лавлах | [#122](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=122) |
| 4 | Монгол Улсын төрийн одон, Ёслол хүндэтгэлийн өргөө | `/about/history/mongol-ulsyn-turiin-odon-eslol-khundetgeliin` | 1121 | 0 | Монгол орны лавлах | [#127](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=127) |

### Сэдэвчилсэн түүх (шинэ хэсэг) (`#themes`, 12)

| # | Нийтлэл | Хаяг | Үг | Зураг | needsReplacement | TIC |
|--:|---|---|--:|--:|---|---|
| 1 | Монголын тусгаар тогтнолын түүхийн товч хураангуй | `/about/history/mongolyn-tusgaar-togtnolyn-tuukhiin-tovch-khuraangui` | 781 | 0 | — | [#113](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=113) |
| 2 | Монгол Улсын хил үүссэн түүх | `/about/history/mongol-ulsyn-khil-uussen-tuukh` | 1673 | 1 | Монгол орны лавлах | [#137](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=137) |
| 3 | Монголын засаг захиргааны түүх | `/about/history/mongolyn-zasag-zakhirgaany-tuukh` | 553 | 0 | — | [#148](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=148) |
| 4 | Монгол хатадын түүхээс | `/about/history/mongol-khatadyn-tuukhees` | 2424 | 0 | — | [#150](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=150) |
| 5 | Монгол бичгийн эртний дурсгалууд | `/about/history/mongol-bichgiin-ertnii-dursgaluud` | 905 | 0 | — | [#120](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=120) |
| 6 | Торгоны замын түүх | `/about/history/torgony-zamyn-tuukh` | 1069 | 1 | Монгол орны лавлах | [#152](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=152) |
| 7 | Цайны замын түүх | `/about/history/tsainy-zamyn-tuukh` | 779 | 1 | Монгол орны лавлах | [#151](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=151) |
| 8 | Монголын мөнгөн тэмдэгтийн түүх | `/about/history/mongolyn-mungun-temdegtiin-tuukh` | 1818 | 3 | Монгол орны лавлах | [#114](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=114) |
| 9 | Монголын Агаарын хүчин үүссэн түүх | `/about/history/mongolyn-agaaryn-khuchin-uussen-tuukh` | 620 | 6 | Монгол орны лавлах | [#104](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=104) |
| 10 | Монголын музей байгуулагдсан түүх | `/about/history/mongolyn-muzei-baiguulagdsan-tuukh` | 1237 | 2 | — | [#103](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=103) |
| 11 | Монгол Улсын "Хосгүй үнэт өв" | `/about/history/mongol-ulsyn-khosgui-unet-uv` | 252 | 0 | — | [#108](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=108) |
| 12 | Хилийн чинад дахь монголчууд | `/about/history/khiliin-chinad-dakh-mongolchuud` | 374 | 1 | Монгол орны лавлах | [#51](https://www.touristinfocenter.mn/cate14_more.aspx?ItemID=51) |


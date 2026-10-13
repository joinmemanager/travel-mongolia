# Тусдаа хуудасгүй картууд

> 2026-10-13, `feat/section-layout`. Хэсгийн хуудсуудын карт бүрийг тусдаа хуудастай бол бүхэлд нь холбоос болгож
> «Дэлгэрэнгүй →» товч нэмсэн. Доорх **239 карт** тохирох хуудасгүй тул товчгүй үлдсэн. Шинэ хуудас үүсгээгүй.
> Эзэмшигч хараад аль нь хуудастай болохыг шийднэ.

Баганууд: **Текст** = картын одоогийн тайлбарын урт (тэмдэгт). Ихэнх нь 60–150 тэмдэгт, өөрөөр хэлбэл
тусдаа хуудас болгоход шинэ агуулга бичих шаардлагатай.

Санал болгох хаягийн дүрэм (зөвхөн санал, одоо байхгүй):
- Сэдвийн нийтлэл (`/about/*`, жагсаалт) → `/stories/<slug>`: Түүх & өв-ийн нийтлэл (Contentful `story`, `app/stories/[slug]`)
- Тодорхой газар → `/destination/<slug>` (Contentful `destination`) эсвэл түүхэн өвийн газар бол `/destination/heritage/place/<slug>`
- Баяр наадам → `/recommendation/<slug>` (Фестивалиуд жагсаалтад ордог)
- Аялал, туршлага → `/local/experiences/<slug>` (Contentful `communityExperience`)

## Холбоос тавьсан картууд (11)

| Хэсэг | Хуудас | Карт | Холбоос |
|---|---|---|---|
| Монголын тухай | Тойм (/about/at-a-glance) | Нийслэл Улаанбаатар | `/province/ulaanbaatar` |
| Монголын тухай | Тойм (/about/at-a-glance) | Байгалийн олон янз байдал | `/destination/landscapes` |
| Монголын тухай | Тойм (/about/at-a-glance) | Анхны дархан цаазат газар | `/destination/strictly-protected` |
| Монголын тухай | Өнөөгийн Монгол (/about/modern) | Нийслэл Улаанбаатар хот | `/province/ulaanbaatar` |
| Соёл, өв | Тойм (/about/culture) | Монгол наадам & Шагайн харваа | `/recommendation/ulsyn-ikh-bayar-naadam` |
| Байгаль | Тойм (/about/nature) | Дөрвөн улирал | `/inspiration/seasons` |
| Байгаль | Тойм (/about/nature) | Хөвсгөл нуур | `/destination/khuvsgul-nuur` |
| Үзэх, хийх зүйлс | Байгальд аялах (/things-to-do/nature) | Хөвсгөл нуур | `/destination/khuvsgul-nuur` |
| Үзэх, хийх зүйлс | Байгальд аялах (/things-to-do/nature) | Горхи Тэрэлжийн Кемпинг | `/destination/terelj` |
| Үзэх, хийх зүйлс | Нүүдэлчин ахуйг мэдрэх (/things-to-do/nomadic) | Орхоны хөндийн малчин айлд зочлох | `/local/herder-families` |
| Арга хэмжээ, баяр наадам | Уламжлалт баяр наадам (/things-to-do/events) | Үндэсний их баяр наадам | `/recommendation/ulsyn-ikh-bayar-naadam` |

Холбоос тавихдаа зөвхөн бодит агуулгатай хуудсыг тооцсон. Contentful-ын `destination` төрлийн
Сүхбаатарын талбай, Дархан-Уул, 13-р зуун цогцолбор, `province` Ховд, бүх `heritagePlace` (3) нь
одоогоор «бла бла» эсвэл «мэдээлэл алга» гэсэн placeholder тексттэй тул тэдгээр рүү холбоогүй.

## Тусдаа хуудасгүй картууд (239)

| # | Хэсэг | Хуудас | Блок | Карт | Санал болгох хаяг | Текст |
|---|---|---|---|---|---|---|
| 1 | Монголын тухай | Тойм (/about/at-a-glance) | Монгол Улсын тухай үндсэн мэдээлэл | Байршил & Хил хязгаар | `/stories/bairshil-khil-khyazgaar` | 88 |
| 2 | Монголын тухай | Тойм (/about/at-a-glance) | Монгол Улсын тухай үндсэн мэдээлэл | Төрийн байгуулал | `/stories/turiin-baiguulal` | 82 |
| 3 | Монголын тухай | Тойм (/about/at-a-glance) | Монгол Улсын тухай үндсэн мэдээлэл | Цагийн бүс & Мөнгөн тэмдэгт | `/stories/tsagiin-bus-mungun-temdegt` | 94 |
| 4 | Монголын тухай | Тойм (/about/at-a-glance) | Хүн ам, нийслэл | Хүн амын нягтрал | `/stories/khun-amyn-nyagtral` | 87 |
| 5 | Монголын тухай | Тойм (/about/at-a-glance) | Хүн ам, нийслэл | Залуусын орон | `/stories/zaluusyn-oron` | 75 |
| 6 | Монголын тухай | Тойм (/about/at-a-glance) | Газар нутаг & Байгалийн бүс | Хамгийн өндөр цэг | `/stories/khamgiin-undur-tseg` | 77 |
| 7 | Монголын тухай | Тойм (/about/at-a-glance) | Газар нутаг & Байгалийн бүс | Цэнгэг нуур, мөрөн | `/stories/tsengeg-nuur-murun` | 91 |
| 8 | Монголын тухай | Тойм (/about/at-a-glance) | Төрийн болон үндэсний бэлгэдэл | Төрийн далбаа & Соёмбо | `/stories/turiin-dalbaa-soyombo` | 85 |
| 9 | Монголын тухай | Тойм (/about/at-a-glance) | Төрийн болон үндэсний бэлгэдэл | Төрийн сүлд | `/stories/turiin-suld` | 84 |
| 10 | Монголын тухай | Тойм (/about/at-a-glance) | Төрийн болон үндэсний бэлгэдэл | Үндэсний бахархалт шувуу | `/stories/undesnii-bakharkhalt-shuvuu` | 81 |
| 11 | Монголын тухай | Тойм (/about/at-a-glance) | Монгол орны онцлог тоо, баримтууд | 250+ Нартай өдөр | `/stories/250-nartai-udur` | 86 |
| 12 | Монголын тухай | Тойм (/about/at-a-glance) | Монгол орны онцлог тоо, баримтууд | Үлэг гүрвэлийн өлгий | `/stories/uleg-gurveliin-ulgii` | 105 |
| 13 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Орчин үеийн Монголын амьдрал | Кофены соёл & Коворкинг | `/stories/kofeny-soyol-kovorking` | 82 |
| 14 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Орчин үеийн Монголын амьдрал | Дижитал эрин үе | `/stories/dijital-erin-ue` | 86 |
| 15 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Орчин үеийн Монголын амьдрал | Амралтын өдрүүдийн аялал | `/stories/amraltyn-udruudiin-ayalal` | 84 |
| 16 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Хот ба хөдөөгийн амьдрал | Малчин өрхийн дэвшил | `/stories/malchin-urkhiin-devshil` | 83 |
| 17 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Хот ба хөдөөгийн амьдрал | Аймгийн төвүүд & Хөгжил | `/stories/aimgiin-tuvuud-khugjil` | 81 |
| 18 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Орчин үеийн урлаг, дизайн | Орчин үеийн Монгол загвар | `/stories/orchin-ueiin-mongol-zagvar` | 78 |
| 19 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Орчин үеийн урлаг, дизайн | Контемпорари уран зураг | `/stories/kontemporari-uran-zurag` | 85 |
| 20 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Орчин үеийн урлаг, дизайн | Кино & Театр | `/stories/kino-teatr` | 80 |
| 21 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Хөгжим & Фестивалиуд | Хүннү Рок & Дэлхийн тавцан | `/stories/khunnu-rok-delkhiin-tavtsan` | 87 |
| 22 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Хөгжим & Фестивалиуд | Playtime Festival | `/stories/playtime-festival` | 98 |
| 23 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Хөгжим & Фестивалиуд | Хип хоп & Электрон урсгал | `/stories/khip-khop-elektron-ursgal` | 83 |
| 24 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Залуусын соёл & Спорт | Цахим спорт (Esports) | `/stories/tsakhim-sport` | 88 |
| 25 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Залуусын соёл & Спорт | Олимп & Их спорт | `/stories/olimp-ikh-sport` | 88 |
| 26 | Монголын тухай | Өнөөгийн Монгол (/about/modern) | Залуусын соёл & Спорт | Стартап & Инноваци | `/stories/startap-innovatsi` | 84 |
| 27 | Соёл, өв | Тойм (/about/culture) | UNESCO өв | Морин хуур ба Уртын дуу | `/stories/morin-khuur-ba-urtyn-duu` | 89 |
| 28 | Соёл, өв | Тойм (/about/culture) | UNESCO өв | Орхоны хөндий & Бурхан Халдун ⚠ Хуудас бий, агуулга нь placeholder («бла бла») тул холбоогүй | `/destination/heritage/place/orkhony-khundii` | 73 |
| 29 | Соёл, өв | Тойм (/about/culture) | Археологийн өв | Буган чулуун хөшөө ⚠ Хуудас бий, агуулга нь placeholder («бла бла») тул холбоогүй | `/destination/heritage/place/bugan-chuluun-khushuu` | 87 |
| 30 | Соёл, өв | Тойм (/about/culture) | Археологийн өв | Хадны сүг зураг | `/stories/khadny-sug-zurag` | 86 |
| 31 | Соёл, өв | Тойм (/about/culture) | Археологийн өв | Хүннүгийн язгууртны бунхан | `/stories/khunnugiin-yazguurtny-bunkhan` | 79 |
| 32 | Соёл, өв | Тойм (/about/culture) | Түүх, соёлын дурсгал | Хархорум хотын туурь | `/stories/kharkhorum-khotyn-tuuri` | 74 |
| 33 | Соёл, өв | Тойм (/about/culture) | Түүх, соёлын дурсгал | Түрэгийн гэрэлт хөшөөнүүд | `/stories/turegiin-gerelt-khushuunuud` | 85 |
| 34 | Соёл, өв | Тойм (/about/culture) | Түүх, соёлын дурсгал | Хүн чулуун дурсгалууд | `/stories/khun-chuluun-dursgaluud` | 68 |
| 35 | Соёл, өв | Тойм (/about/culture) | Монгол хөгжим | Морин хуур & Икэл | `/stories/morin-khuur-ikel` | 75 |
| 36 | Соёл, өв | Тойм (/about/culture) | Монгол хөгжим | Хөөмийн гайхамшиг | `/stories/khuumiin-gaikhamshig` | 79 |
| 37 | Соёл, өв | Тойм (/about/culture) | Монгол хөгжим | Товшуур, Лимбэ, Цуур | `/stories/tovshuur-limbe-tsuur` | 85 |
| 38 | Соёл, өв | Тойм (/about/culture) | Бүжиг, тайзны урлаг | Ойрадын Бий биелгээ | `/stories/oiradyn-bii-bielgee` | 86 |
| 39 | Соёл, өв | Тойм (/about/culture) | Бүжиг, тайзны урлаг | Цам харайх ёслол | `/stories/tsam-kharaikh-yoslol` | 76 |
| 40 | Соёл, өв | Тойм (/about/culture) | Бүжиг, тайзны урлаг | Үндэсний цирк & Уран нугаралт | `/stories/undesnii-tsirk-uran-nugaralt` | 84 |
| 41 | Соёл, өв | Тойм (/about/culture) | Уран зохиол | Монголын нууц товчоо (1240 он) | `/stories/mongolyn-nuuts-tovchoo` | 60 |
| 42 | Соёл, өв | Тойм (/about/culture) | Уран зохиол | Жангар & Гэсэр тууль | `/stories/jangar-geser-tuuli` | 75 |
| 43 | Соёл, өв | Тойм (/about/culture) | Уран зохиол | Үлгэр, оньсого, зүйр цэцэн үг | `/stories/ulger-onisogo-zuir-tsetsen-ug` | 64 |
| 44 | Соёл, өв | Тойм (/about/culture) | Дүрслэх урлаг | Занабазарын цутгуур баримал | `/stories/zanabazaryn-tsutguur-barimal` | 77 |
| 45 | Соёл, өв | Тойм (/about/culture) | Дүрслэх урлаг | Монгол зураг (Mongol Zurag) | `/stories/mongol-zurag` | 88 |
| 46 | Соёл, өв | Тойм (/about/culture) | Дүрслэх урлаг | Танка буюу торгон зээгт наамал | `/stories/tanka-buyuu-torgon-zeegt-naamal` | 64 |
| 47 | Соёл, өв | Тойм (/about/culture) | Гар урлал | Мөнгөн аяга & Хэт хутга | `/stories/mungun-ayaga-khet-khutga` | 78 |
| 48 | Соёл, өв | Тойм (/about/culture) | Гар урлал | Эсгий ширмэл урлал | `/stories/esgii-shirmel-urlal` | 82 |
| 49 | Соёл, өв | Тойм (/about/culture) | Гар урлал | Модон сийлбэр | `/stories/modon-siilber` | 77 |
| 50 | Соёл, өв | Тойм (/about/culture) | Үндэсний хувцас | Монгол дээл & Бүс | `/stories/mongol-deel-bus` | 71 |
| 51 | Соёл, өв | Тойм (/about/culture) | Үндэсний хувцас | 20 гаруй ястны өмсгөл | `/stories/20-garui-yastny-umsgul` | 83 |
| 52 | Соёл, өв | Тойм (/about/culture) | Үндэсний хувцас | Монгол гутал & Оймс | `/stories/mongol-gutal-oims` | 80 |
| 53 | Соёл, өв | Тойм (/about/culture) | Архитектур | Амарбаясгалант хийд | `/stories/amarbayasgalant-khiid` | 84 |
| 54 | Соёл, өв | Тойм (/about/culture) | Архитектур | Эрдэнэ зуу цогцолбор | `/stories/erdene-zuu-tsogtsolbor` | 69 |
| 55 | Соёл, өв | Тойм (/about/culture) | Архитектур | Гандантэгчэнлин & Чойжин лам | `/stories/gandantegchenlin-choijin-lam` | 76 |
| 56 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Төрөх, нэр өгөх ёс | Угаалга ба өлгий барих | `/stories/ugaalga-ba-ulgii-barikh` | 102 |
| 57 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Төрөх, нэр өгөх ёс | Нэр хайрлах дэг | `/stories/ner-khairlakh-deg` | 94 |
| 58 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Төрөх, нэр өгөх ёс | Даахь үргээх ёслол | `/stories/daakhi-urgeekh-yoslol` | 99 |
| 59 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Монгол хуримын ёс | Бэр гуйх & Сүй тавих | `/stories/ber-guikh-sui-tavikh` | 89 |
| 60 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Монгол хуримын ёс | Шинэ гэр барих | `/stories/shine-ger-barikh` | 103 |
| 61 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Монгол хуримын ёс | Гал тахих ёслол | `/stories/gal-takhikh-yoslol` | 101 |
| 62 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Зочлох, дайлах ёс | Цайны дээж барих | `/stories/tsainy-deej-barikh` | 91 |
| 63 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Зочлох, дайлах ёс | Хөөрөг зөрүүлэх | `/stories/khuurug-zuruulekh` | 102 |
| 64 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Зочлох, дайлах ёс | Шүүс зоог тавих | `/stories/shuus-zoog-tavikh` | 106 |
| 65 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Цагаан сар | Битүүний ёслол | `/stories/bituunii-yoslol` | 97 |
| 66 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Цагаан сар | Амар мэндийн их золголт | `/stories/amar-mendiin-ikh-zolgolt` | 102 |
| 67 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Цагаан сар | Ул боов & Таваг засах | `/stories/ul-boov-tavag-zasakh` | 96 |
| 68 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Үндэсний их баяр Наадам | Хүчит 512 бөх | `/stories/khuchit-512-bukh` | 77 |
| 69 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Үндэсний их баяр Наадам | Хурдан морины уралдаан | `/stories/khurdan-moriny-uraldaan` | 76 |
| 70 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Үндэсний их баяр Наадам | Үндэсний сур харваа | `/stories/undesnii-sur-kharvaa` | 81 |
| 71 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Бөө мөргөл | Хэнгэрэг & Цан | `/stories/khengereg-tsan` | 87 |
| 72 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Бөө мөргөл | Оргой ба майхавч | `/stories/orgoi-ba-maikhavch` | 78 |
| 73 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Бөө мөргөл | Хүрэл толь | `/stories/khurel-toli` | 79 |
| 74 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Буддын шашин | Төвөдөөс уламжилсан Гэлүгба | `/stories/tuvuduus-ulamjilsan-gelugba` | 79 |
| 75 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Буддын шашин | Өндөр гэгээн Занабазарын өв | `/stories/undur-gegeen-zanabazaryn-uv` | 82 |
| 76 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Буддын шашин | Сүм хийдийн номын их өргөө | `/stories/sum-khiidiin-nomyn-ikh-urguu` | 84 |
| 77 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Ардын шүтлэг, домог | Овоо тахих зан үйл | `/stories/ovoo-takhikh-zan-uil` | 90 |
| 78 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Ардын шүтлэг, домог | Алтан гадас одны домог | `/stories/altan-gadas-odny-domog` | 87 |
| 79 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Ардын шүтлэг, домог | Хөхөө Намжилын домог | `/stories/khukhuu-namjilyn-domog` | 88 |
| 80 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Уламжлалт баяр, зан үйл | Гүү барих & Үрс гаргах | `/stories/guu-barikh-urs-gargakh` | 89 |
| 81 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Уламжлалт баяр, зан үйл | Бүргэдийн баяр | `/stories/burgediin-bayar` | 89 |
| 82 | Соёл, өв | Ёс заншил, уламжлал (/about/traditions) | Уламжлалт баяр, зан үйл | Түмэн тэмээний баяр | `/stories/tumen-temeenii-bayar` | 86 |
| 83 | Байгаль | Тойм (/about/nature) | Монгол орны газарзүй | Байршил & Хил хязгаар | `/stories/bairshil-khil-khyazgaar` | 69 |
| 84 | Байгаль | Тойм (/about/nature) | Монгол орны газарзүй | Туйлын цэгүүд | `/stories/tuilyn-tseguud` | 88 |
| 85 | Байгаль | Тойм (/about/nature) | Монгол орны газарзүй | Байгалийн бүс бүслүүр | `/stories/baigaliin-bus-busluur` | 85 |
| 86 | Байгаль | Тойм (/about/nature) | Уур амьсгал | Температурын далайц | `/stories/temperaturyn-dalaits` | 76 |
| 87 | Байгаль | Тойм (/about/nature) | Уур амьсгал | Нарлаг өдрүүд | `/stories/narlag-udruud` | 72 |
| 88 | Байгаль | Тойм (/about/nature) | Говь | Хонгорын элс | `/stories/khongoryn-els` | 83 |
| 89 | Байгаль | Тойм (/about/nature) | Говь | Баянзаг & Улаан хавцал | `/stories/bayanzag-ulaan-khavtsal` | 69 |
| 90 | Байгаль | Тойм (/about/nature) | Говь | Говийн баянбүрдүүд | `/stories/goviin-bayanburduud` | 83 |
| 91 | Байгаль | Тойм (/about/nature) | Тал хээр | Дорнодын тал | `/stories/dornodyn-tal` | 77 |
| 92 | Байгаль | Тойм (/about/nature) | Тал хээр | Цагаан зээрийн сүрэг | `/stories/tsagaan-zeeriin-sureg` | 75 |
| 93 | Байгаль | Тойм (/about/nature) | Тал хээр | Шилийн Богд & Ганга нуур | `/stories/shiliin-bogd-ganga-nuur` | 68 |
| 94 | Байгаль | Тойм (/about/nature) | Уулс | Алтай Таван Богд | `/stories/altai-tavan-bogd` | 71 |
| 95 | Байгаль | Тойм (/about/nature) | Уулс | Отгонтэнгэр хайрхан | `/stories/otgontenger-khairkhan` | 66 |
| 96 | Байгаль | Тойм (/about/nature) | Уулс | Бурхан Халдун хайрхан ⚠ Хуудас бий, агуулга нь placeholder («бла бла») тул холбоогүй | `/destination/heritage/place/burkhan-khaldun` | 78 |
| 97 | Байгаль | Тойм (/about/nature) | Ой, тайга | Хөвсгөлийн хөвч тайга | `/stories/khuvsguliin-khuvch-taiga` | 69 |
| 98 | Байгаль | Тойм (/about/nature) | Ой, тайга | Шинэс ба хушин ой | `/stories/shines-ba-khushin-oi` | 82 |
| 99 | Байгаль | Тойм (/about/nature) | Ой, тайга | Тайгын экосистем | `/stories/taigyn-ekosistem` | 74 |
| 100 | Байгаль | Тойм (/about/nature) | Гол, нуур | Сэлэнгэ, Орхон, Хэрлэн | `/stories/selenge-orkhon-kherlen` | 73 |
| 101 | Байгаль | Тойм (/about/nature) | Гол, нуур | Увс нуурын хотгор | `/stories/uvs-nuuryn-khotgor` | 80 |
| 102 | Байгаль | Тойм (/about/nature) | Ургамлын аймаг | Цөлийн ба талын ургамал | `/stories/tsuliin-ba-talyn-urgamal` | 78 |
| 103 | Байгаль | Тойм (/about/nature) | Ургамлын аймаг | Эмийн ургамлууд | `/stories/emiin-urgamluud` | 81 |
| 104 | Байгаль | Тойм (/about/nature) | Ургамлын аймаг | Эндемик ургамал | `/stories/endemik-urgamal` | 83 |
| 105 | Байгаль | Тойм (/about/nature) | Зэрлэг амьтад | Мазаалай баавгай | `/stories/mazaalai-baavgai` | 90 |
| 106 | Байгаль | Тойм (/about/nature) | Зэрлэг амьтад | Цоохор ирвэс & Тахь | `/stories/tsookhor-irves-takhi` | 87 |
| 107 | Байгаль | Тойм (/about/nature) | Зэрлэг амьтад | Хавтгай & Хулан | `/stories/khavtgai-khulan` | 80 |
| 108 | Байгаль | Тойм (/about/nature) | Геологи | Унтарсан галт уулс | `/stories/untarsan-galt-uuls` | 85 |
| 109 | Байгаль | Тойм (/about/nature) | Геологи | Байгалийн халуун рашаанууд | `/stories/baigaliin-khaluun-rashaanuud` | 85 |
| 110 | Байгаль | Тойм (/about/nature) | Геологи | Эрдэс баялгийн бүсүүд | `/stories/erdes-bayalgiin-busuud` | 78 |
| 111 | Байгаль | Тойм (/about/nature) | Палеонтологи, үлэг гүрвэл | Тарбозавр Батаар | `/stories/tarbozavr-bataar` | 72 |
| 112 | Байгаль | Тойм (/about/nature) | Палеонтологи, үлэг гүрвэл | Үлэг гүрвэлийн өндөг | `/stories/uleg-gurveliin-undug` | 98 |
| 113 | Байгаль | Тойм (/about/nature) | Палеонтологи, үлэг гүрвэл | Хэрмэн цав & Нэмэгтийн хөндий | `/stories/khermen-tsav-nemegtiin-khundii` | 78 |
| 114 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Монгол гэр | Бүтэц ба эд анги | `/stories/butets-ba-ed-angi` | 106 |
| 115 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Монгол гэр | Орон зайн бэлгэдэл | `/stories/oron-zain-belgedel` | 112 |
| 116 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Монгол гэр | Эсгий бүрээс | `/stories/esgii-burees` | 100 |
| 117 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Таван хошуу мал | Адуу ба Тэмээ | `/stories/aduu-ba-temee` | 80 |
| 118 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Таван хошуу мал | Үхэр & Сарлаг | `/stories/ukher-sarlag` | 83 |
| 119 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Таван хошуу мал | Хонь ба Ямаа | `/stories/khoni-ba-yamaa` | 92 |
| 120 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Дөрвөн улирлын нүүдэл | Өвөлжөө & Хаваржаа | `/stories/uvuljuu-khavarjaa` | 93 |
| 121 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Дөрвөн улирлын нүүдэл | Зуслан & Намаржаа | `/stories/zuslan-namarjaa` | 94 |
| 122 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Дөрвөн улирлын нүүдэл | Ачаа хөсөг & Нүүдэл | `/stories/achaa-khusug-nuudel` | 88 |
| 123 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Мал маллах ухаан | Цаг агаар шинжих | `/stories/tsag-agaar-shinjikh` | 111 |
| 124 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Мал маллах ухаан | Ургац, бэлчээр сонгох | `/stories/urgats-belcheer-songokh` | 85 |
| 125 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Мал маллах ухаан | Мал төллөлт | `/stories/mal-tullult` | 106 |
| 126 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Ахуйн багаж, хэрэгсэл | Уурга & Хуйцаа | `/stories/uurga-khuitsaa` | 102 |
| 127 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Ахуйн багаж, хэрэгсэл | Монгол эмээл, хазаар | `/stories/mongol-emeel-khazaar` | 85 |
| 128 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Ахуйн багаж, хэрэгсэл | Сур, ширэн тоног | `/stories/sur-shiren-tonog` | 91 |
| 129 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Байгаль хамгаалах уламжлал | Усаа дээдлэх цээр | `/stories/usaa-deedlekh-tseer` | 88 |
| 130 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Байгаль хамгаалах уламжлал | Уул овоо тахих | `/stories/uul-ovoo-takhikh` | 90 |
| 131 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Байгаль хамгаалах уламжлал | Хөрс хамгаалах ёс | `/stories/khurs-khamgaalakh-yos` | 112 |
| 132 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Монгол ардын тоглоом наадам | Шагайн наадгай | `/stories/shagain-naadgai` | 100 |
| 133 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Монгол ардын тоглоом наадам | Оньсон тоглоом | `/stories/onison-togloom` | 89 |
| 134 | Нүүдэлчдийн амьдрал | Тойм (/about/nomadic-life) | Монгол ардын тоглоом наадам | Алаг мэлхий өрөх | `/stories/alag-melkhii-urukh` | 97 |
| 135 | Хоол | Тойм (/about/food) | Монгол хоолны соёл | Улирлын хооллолт | `/stories/ulirlyn-khoollolt` | 99 |
| 136 | Хоол | Тойм (/about/food) | Монгол хоолны соёл | Шүүс зоогийн эрэмбэ | `/stories/shuus-zoogiin-erembe` | 101 |
| 137 | Хоол | Тойм (/about/food) | Монгол хоолны соёл | Эмийн чанарт зоог | `/stories/emiin-chanart-zoog` | 104 |
| 138 | Хоол | Тойм (/about/food) | Махан хоол | Хорхог | `/stories/khorkhog` | 112 |
| 139 | Хоол | Тойм (/about/food) | Махан хоол | Боодлог | `/stories/boodlog` | 100 |
| 140 | Хоол | Тойм (/about/food) | Махан хоол | Чанасан мах & Шөл | `/stories/chanasan-makh-shul` | 100 |
| 141 | Хоол | Тойм (/about/food) | Цагаан идээ | Өрөм & Зөөхий | `/stories/urum-zuukhii` | 80 |
| 142 | Хоол | Тойм (/about/food) | Цагаан идээ | Ааруул & Ээзгий | `/stories/aaruul-eezgii` | 88 |
| 143 | Хоол | Тойм (/about/food) | Цагаан идээ | Бяслаг & Аарц | `/stories/byaslag-aarts` | 96 |
| 144 | Хоол | Тойм (/about/food) | Гурилан хоол | Бууз & Банш | `/stories/buuz-bansh` | 90 |
| 145 | Хоол | Тойм (/about/food) | Гурилан хоол | Хуушуур | `/stories/khuushuur` | 104 |
| 146 | Хоол | Тойм (/about/food) | Гурилан хоол | Цуйван & Гар хийцийн гоймон | `/stories/tsuivan-gar-khiitsiin-goimon` | 97 |
| 147 | Хоол | Тойм (/about/food) | Айраг | Хөхүүрийн соёл | `/stories/khukhuuriin-soyol` | 103 |
| 148 | Хоол | Тойм (/about/food) | Айраг | Шим тэжээл ба эмчилгээ | `/stories/shim-tejeel-ba-emchilgee` | 98 |
| 149 | Хоол | Тойм (/about/food) | Айраг | Булганы сайхан айраг | `/stories/bulgany-saikhan-airag` | 84 |
| 150 | Хоол | Тойм (/about/food) | Монгол цай | Сүүтэй цай & Хийц | `/stories/suutei-tsai-khiits` | 95 |
| 151 | Хоол | Тойм (/about/food) | Монгол цай | Банштай цай | `/stories/banshtai-tsai` | 102 |
| 152 | Хоол | Тойм (/about/food) | Монгол цай | Цайны дээж өргөх | `/stories/tsainy-deej-urgukh` | 94 |
| 153 | Хоол | Тойм (/about/food) | Бүс нутгийн хоол | Казах үндэстний Бешбармак | `/stories/kazakh-undestnii-beshbarmak` | 99 |
| 154 | Хоол | Тойм (/about/food) | Бүс нутгийн хоол | Буриад талх & Өрөм | `/stories/buriad-talkh-urum` | 96 |
| 155 | Хоол | Тойм (/about/food) | Бүс нутгийн хоол | Говийн ингэний хоормог | `/stories/goviin-ingenii-khoormog` | 91 |
| 156 | Хоол | Тойм (/about/food) | Уламжлалт хүнс боловсруулах арга | Борц бэлтгэх технологи | `/stories/borts-beltgekh-tekhnologi` | 105 |
| 157 | Хоол | Тойм (/about/food) | Уламжлалт хүнс боловсруулах арга | Үүц бэлтгэх ёс | `/stories/uuts-beltgekh-yos` | 98 |
| 158 | Хоол | Тойм (/about/food) | Уламжлалт хүнс боловсруулах арга | Шар тос хайлуулах | `/stories/shar-tos-khailuulakh` | 96 |
| 159 | Хүмүүс | Тойм (/about/people) | Монголчууд | Язгуур угсаа | `/stories/yazguur-ugsaa` | 86 |
| 160 | Хүмүүс | Тойм (/about/people) | Монголчууд | Зан чанарын онцлог | `/stories/zan-chanaryn-ontslog` | 79 |
| 161 | Хүмүүс | Тойм (/about/people) | Монголчууд | Ахмадаа дээдлэх ёс | `/stories/akhmadaa-deedlekh-yos` | 78 |
| 162 | Хүмүүс | Тойм (/about/people) | Угсаатны бүлгүүд | Баруун Монголын ястнууд | `/stories/baruun-mongolyn-yastnuud` | 75 |
| 163 | Хүмүүс | Тойм (/about/people) | Угсаатны бүлгүүд | Буриад зоны өв | `/stories/buriad-zony-uv` | 75 |
| 164 | Хүмүүс | Тойм (/about/people) | Угсаатны бүлгүүд | Казак түмний соёл | `/stories/kazak-tumnii-soyol` | 80 |
| 165 | Хүмүүс | Тойм (/about/people) | Монгол хэл ба Монгол бичиг | Босоо монгол бичиг | `/stories/bosoo-mongol-bichig` | 86 |
| 166 | Хүмүүс | Тойм (/about/people) | Монгол хэл ба Монгол бичиг | Уран бичлэг (Каллиграфи) | `/stories/uran-bichleg` | 78 |
| 167 | Хүмүүс | Тойм (/about/people) | Монгол хэл ба Монгол бичиг | Аман зохиолын баялаг | `/stories/aman-zokhiolyn-bayalag` | 82 |
| 168 | Хүмүүс | Тойм (/about/people) | Зочломтгой зан заншил | Цай барих ёсон | `/stories/tsai-barikh-yoson` | 82 |
| 169 | Хүмүүс | Тойм (/about/people) | Зочломтгой зан заншил | Хөөрөг зөрүүлэх | `/stories/khuurug-zuruulekh` | 83 |
| 170 | Хүмүүс | Тойм (/about/people) | Зочломтгой зан заншил | Хүндэтгэлийн зоог | `/stories/khundetgeliin-zoog` | 82 |
| 171 | Хүмүүс | Тойм (/about/people) | Монгол хүний аж төрөхүй | Од эрхэс шинжих ухаан | `/stories/od-erkhes-shinjikh-ukhaan` | 80 |
| 172 | Хүмүүс | Тойм (/about/people) | Монгол хүний аж төрөхүй | Эрүүл амьдралын хэв маяг | `/stories/eruul-amidralyn-khev-mayag` | 82 |
| 173 | Хүмүүс | Тойм (/about/people) | Монгол хүний аж төрөхүй | Үр хүүхдээ хүмүүжүүлэх | `/stories/ur-khuukhdee-khumuujuulekh` | 82 |
| 174 | Үзэх, хийх зүйлс | Байгальд аялах (/things-to-do/nature) |  | Хонгорын элс | `/destination/khongoryn-els` | 60 |
| 175 | Үзэх, хийх зүйлс | Байгальд аялах (/things-to-do/nature) |  | Өмнөговийн уудам тал (Од харах) | `/destination/umnugoviin-uudam-tal` | 78 |
| 176 | Үзэх, хийх зүйлс | Байгальд аялах (/things-to-do/nature) |  | Алтай Таван Богд | `/destination/altai-tavan-bogd` | 68 |
| 177 | Үзэх, хийх зүйлс | Байгальд аялах (/things-to-do/nature) |  | Орхоны хөндийн байгалийн цогцолборт газар ⚠ Хуудас бий, агуулга нь placeholder («бла бла») тул холбоогүй | `/destination/heritage/place/orkhony-khundii` | 76 |
| 178 | Үзэх, хийх зүйлс | Адал явдалт аялал (/things-to-do/adventure) |  | Алтай Таван Богдын авиралт ба мөсөн голын трек | `/local/experiences/altai-tavan-bogdyn-aviralt-ba` | 97 |
| 179 | Үзэх, хийх зүйлс | Адал явдалт аялал (/things-to-do/adventure) |  | Дархадын хотгор, Хөвсгөлийн тайгын морин аялал | `/local/experiences/darkhadyn-khotgor-khuvsguliin-taigyn-morin` | 93 |
| 180 | Үзэх, хийх зүйлс | Адал явдалт аялал (/things-to-do/adventure) |  | Хонгорын элсний тэмээн цуваа аялал | `/local/experiences/khongoryn-elsnii-temeen-tsuvaa-ayalal` | 91 |
| 181 | Үзэх, хийх зүйлс | Адал явдалт аялал (/things-to-do/adventure) |  | Орхон голын хавцлын рафтинг ба каяк | `/local/experiences/orkhon-golyn-khavtslyn-rafting-ba` | 96 |
| 182 | Үзэх, хийх зүйлс | Адал явдалт аялал (/things-to-do/adventure) |  | Өмнөговь, Нэмэгтийн хавцлын 4x4 Off-Road | `/local/experiences/umnugovi-nemegtiin-khavtslyn-4x4-off` | 97 |
| 183 | Үзэх, хийх зүйлс | Адал явдалт аялал (/things-to-do/adventure) |  | Богд хан уулын өвлийн цана, сноуборд | `/local/experiences/bogd-khan-uulyn-uvliin-tsana` | 86 |
| 184 | Үзэх, хийх зүйлс | Адал явдалт аялал (/things-to-do/adventure) |  | Асралт Хайрхан уулын явган трек | `/local/experiences/asralt-khairkhan-uulyn-yavgan-trek` | 83 |
| 185 | Үзэх, хийх зүйлс | Адал явдалт аялал (/things-to-do/adventure) |  | Туул голын хөндийн уулын дугуйн аялал | `/local/experiences/tuul-golyn-khundiin-uulyn-duguin` | 89 |
| 186 | Үзэх, хийх зүйлс | Түүх, соёлын аялал (/things-to-do/culture) |  | Эрдэнэ зуу хийд | `/destination/erdene-zuu-khiid` | 87 |
| 187 | Үзэх, хийх зүйлс | Түүх, соёлын аялал (/things-to-do/culture) |  | Чингис хааны морьт хөшөө цогцолбор | `/destination/chingis-khaany-morit-khushuu-tsogtsolbor` | 83 |
| 188 | Үзэх, хийх зүйлс | Түүх, соёлын аялал (/things-to-do/culture) |  | Орхоны хөндийн соёлын дурсгалт газар ⚠ Хуудас бий, агуулга нь placeholder («бла бла») тул холбоогүй | `/destination/heritage/place/orkhony-khundii` | 95 |
| 189 | Үзэх, хийх зүйлс | Түүх, соёлын аялал (/things-to-do/culture) |  | Чингис хаан үндэсний музей | `/destination/chingis-khaan-undesnii-muzei` | 95 |
| 190 | Үзэх, хийх зүйлс | Түүх, соёлын аялал (/things-to-do/culture) |  | Цагаан суварга ба Цахиуртын хөндий | `/destination/tsagaan-suvarga-ba-tsakhiurtyn-khundii` | 90 |
| 191 | Үзэх, хийх зүйлс | Түүх, соёлын аялал (/things-to-do/culture) |  | Морин хуур, хөөмэйн уламжлалт урлаг | `/destination/morin-khuur-khuumein-ulamjlalt-urlag` | 89 |
| 192 | Үзэх, хийх зүйлс | Хоол, ундааны туршлага (/things-to-do/food) |  | Уламжлалт хорхог, боодог хийх ёслол | `/local/experiences/ulamjlalt-khorkhog-boodog-khiikh-yoslol` | 93 |
| 193 | Үзэх, хийх зүйлс | Хоол, ундааны туршлага (/things-to-do/food) |  | Зуны цагаан идээний амталгаа ба соёл | `/local/experiences/zuny-tsagaan-ideenii-amtalgaa-ba` | 101 |
| 194 | Үзэх, хийх зүйлс | Хоол, ундааны туршлага (/things-to-do/food) |  | Хөхүүрийн шимийн айраг амтлах аялал | `/local/experiences/khukhuuriin-shimiin-airag-amtlakh-ayalal` | 105 |
| 195 | Үзэх, хийх зүйлс | Хоол, ундааны туршлага (/things-to-do/food) |  | Борцтой, шар тостой уламжлалт монгол цай | `/local/experiences/bortstoi-shar-tostoi-ulamjlalt-mongol` | 91 |
| 196 | Үзэх, хийх зүйлс | Хоол, ундааны туршлага (/things-to-do/food) |  | Монгол бууз, хуушуур чимхэх мастеркласс | `/local/experiences/mongol-buuz-khuushuur-chimkhekh-masterklass` | 107 |
| 197 | Үзэх, хийх зүйлс | Хоол, ундааны туршлага (/things-to-do/food) |  | Улаанбаатарын үндэсний хоолны аялал | `/local/experiences/ulaanbaataryn-undesnii-khoolny-ayalal` | 108 |
| 198 | Үзэх, хийх зүйлс | Нүүдэлчин ахуйг мэдрэх (/things-to-do/nomadic) |  | Тэрэлжийн уламжлалт эсгий гэрт байрлах | `/local/experiences/tereljiin-ulamjlalt-esgii-gert-bairlakh` | 94 |
| 199 | Үзэх, хийх зүйлс | Нүүдэлчин ахуйг мэдрэх (/things-to-do/nomadic) |  | Булганы Сайхан сумын айраг исгэх соёл | `/local/experiences/bulgany-saikhan-sumyn-airag-isgekh` | 93 |
| 200 | Үзэх, хийх зүйлс | Нүүдэлчин ахуйг мэдрэх (/things-to-do/nomadic) |  | Хэрлэнгийн хөндийн морь унах аялал | `/local/experiences/kherlengiin-khundiin-mori-unakh-ayalal` | 90 |
| 201 | Үзэх, хийх зүйлс | Нүүдэлчин ахуйг мэдрэх (/things-to-do/nomadic) |  | Уламжлалт өрөм, ааруул боловсруулах | `/local/experiences/ulamjlalt-urum-aaruul-bolovsruulakh` | 97 |
| 202 | Үзэх, хийх зүйлс | Нүүдэлчин ахуйг мэдрэх (/things-to-do/nomadic) |  | Алтайн уулсын улирлын нүүдэл дагах | `/local/experiences/altain-uulsyn-ulirlyn-nuudel-dagakh` | 90 |
| 203 | Үзэх, хийх зүйлс | Амралт, рашаан сувилал (/things-to-do/wellness) |  | Төвхөн хийдийн бясалгал, аглаг бүтээл | `/local/experiences/tuvkhun-khiidiin-byasalgal-aglag-buteel` | 103 |
| 204 | Үзэх, хийх зүйлс | Амралт, рашаан сувилал (/things-to-do/wellness) |  | Цэнхэрийн халуун рашааны спа ретрит | `/local/experiences/tsenkheriin-khaluun-rashaany-spa-retrit` | 98 |
| 205 | Үзэх, хийх зүйлс | Амралт, рашаан сувилал (/things-to-do/wellness) |  | Хамарын хийд ба Дэлхийн энергийн төв | `/local/experiences/khamaryn-khiid-ba-delkhiin-energiin` | 119 |
| 206 | Үзэх, хийх зүйлс | Амралт, рашаан сувилал (/things-to-do/wellness) |  | Тэрэлжийн байгалийн иог & бясалгалын кемп | `/local/experiences/tereljiin-baigaliin-iog-byasalgalyn-kemp` | 95 |
| 207 | Үзэх, хийх зүйлс | Амралт, рашаан сувилал (/things-to-do/wellness) |  | Хөвсгөлийн тайгын бөө мөргөлийн соёлтой танилцах | `/local/experiences/khuvsguliin-taigyn-buu-murguliin-soyoltoi` | 120 |
| 208 | Үзэх, хийх зүйлс | Амралт, рашаан сувилал (/things-to-do/wellness) |  | Уудам говийн сүлжээгүй дижитал детокс амралт | `/local/experiences/uudam-goviin-suljeegui-dijital-detoks` | 114 |
| 209 | Үзэх, хийх зүйлс | Зэрлэг амьтан, шувуу ажиглах (/things-to-do/wildlife) |  | Хустайн нурууны зэрлэг тахь ажиглалт | `/destination/khustain-nuruuny-zerleg-takhi-ajiglalt` | 96 |
| 210 | Үзэх, хийх зүйлс | Зэрлэг амьтан, шувуу ажиглах (/things-to-do/wildlife) |  | Алтайн нурууны цоохор ирвэсийн мөрөөр | `/destination/altain-nuruuny-tsookhor-irvesiin-muruur` | 94 |
| 211 | Үзэх, хийх зүйлс | Зэрлэг амьтан, шувуу ажиглах (/things-to-do/wildlife) |  | Говийн Их Дархан Цаазат Газар (Мазаалай) | `/destination/goviin-ikh-darkhan-tsaazat-gazar` | 103 |
| 212 | Үзэх, хийх зүйлс | Зэрлэг амьтан, шувуу ажиглах (/things-to-do/wildlife) |  | Шаргын говийн монгол бөхөн | `/destination/shargyn-goviin-mongol-bukhun` | 86 |
| 213 | Үзэх, хийх зүйлс | Зэрлэг амьтан, шувуу ажиглах (/things-to-do/wildlife) |  | Өгий нуурын нүүдлийн шувуудын чуулган | `/destination/ugii-nuuryn-nuudliin-shuvuudyn-chuulgan` | 96 |
| 214 | Үзэх, хийх зүйлс | Зэрлэг амьтан, шувуу ажиглах (/things-to-do/wildlife) |  | Ёлын ам, Хонгорын аргаль янгирын сүрэг | `/destination/yolyn-am-khongoryn-argali-yangiryn` | 89 |
| 215 | Арга хэмжээ, баяр наадам | Уламжлалт баяр наадам (/things-to-do/events) |  | Алтайн бүргэдийн баяр | `/recommendation/altain-burgediin-bayar` | 95 |
| 216 | Арга хэмжээ, баяр наадам | Уламжлалт баяр наадам (/things-to-do/events) |  | Түмэн тэмээний баяр | `/recommendation/tumen-temeenii-bayar` | 103 |
| 217 | Арга хэмжээ, баяр наадам | Уламжлалт баяр наадам (/things-to-do/events) |  | Хөх сувд - Хөвсгөлийн мөсний баяр | `/recommendation/khukh-suvd-khuvsguliin-musnii-bayar` | 110 |
| 218 | Арга хэмжээ, баяр наадам | Уламжлалт баяр наадам (/things-to-do/events) |  | Уламжлалт Цагаан сарын баяр | `/recommendation/ulamjlalt-tsagaan-saryn-bayar` | 105 |
| 219 | Арга хэмжээ, баяр наадам | Уламжлалт баяр наадам (/things-to-do/events) |  | Даншиг наадам ба Хүрээ цам | `/recommendation/danshig-naadam-ba-khuree-tsam` | 104 |
| 220 | Үзэх, хийх зүйлс | Аяллын хэв маягаар (/inspiration/styles) |  | Алтайн нурууны мөсөн оргил руу авирах нь | `/local/experiences/altain-nuruuny-musun-orgil-ruu` | 54 |
| 221 | Үзэх, хийх зүйлс | Аяллын хэв маягаар (/inspiration/styles) |  | Нүүдэлчдийн гэр барьж, өв соёлд суралцах хором | `/local/experiences/nuudelchdiin-ger-barij-uv-soyold` | 45 |
| 222 | Үзэх, хийх зүйлс | Аяллын хэв маягаар (/inspiration/styles) |  | Говийн хязгаар дахь 5 одтой Glamping амралт | `/local/experiences/goviin-khyazgaar-dakhi-5-odtoi` | 46 |
| 223 | Үзэх, хийх зүйлс | Аяллын хэв маягаар (/inspiration/styles) |  | Тэнгэрийн заадас ба Хонгорын элсний нар жаргалт | `/local/experiences/tengeriin-zaadas-ba-khongoryn-elsnii` | 49 |
| 224 | Үзэх, хийх зүйлс | Аяллын хэв маягаар (/inspiration/styles) |  | Орхоны хөндийгөөр морин тэргээр аниргүй аялах | `/local/experiences/orkhony-khundiiguur-morin-tergeer-anirgui` | 49 |
| 225 | Үзэх, хийх зүйлс | Аяллын хэв маягаар (/inspiration/styles) |  | Хөвсгөл нуурын эрэг дээрх гэр бүлийн намуун аялал | `/local/experiences/khuvsgul-nuuryn-ereg-deerkh-ger` | 50 |
| 226 | Үзэх, хийх зүйлс | Аяллын хэв маягаар (/inspiration/styles) |  | Эко аялал: Хог хаягдалгүй, ул мөргүй зорчих хэв маяг | `/local/experiences/eko-ayalal-khog-khayagdalgui-ul` | 50 |
| 227 | Үзэх, хийх зүйлс | Аяллын хэв маягаар (/inspiration/styles) |  | Баянзагийн шавар цаваар хийх мотоциклтэй аялал | `/local/experiences/bayanzagiin-shavar-tsavaar-khiikh-mototsikltei` | 48 |
| 228 | Түүхүүд | Нууц үзэсгэлэнт газрууд (/inspiration/hidden) |  | Хэрмэн цавын улаан хавцал | `/destination/khermen-tsavyn-ulaan-khavtsal` | 50 |
| 229 | Түүхүүд | Нууц үзэсгэлэнт газрууд (/inspiration/hidden) |  | Сангийн далай нуурын шувуудын чуулган | `/destination/sangiin-dalai-nuuryn-shuvuudyn-chuulgan` | 51 |
| 230 | Түүхүүд | Нууц үзэсгэлэнт газрууд (/inspiration/hidden) |  | Хамарын хийдийн 108 бясалгалын агуй | `/destination/khamaryn-khiidiin-108-byasalgalyn-agui` | 51 |
| 231 | Түүхүүд | Нууц үзэсгэлэнт газрууд (/inspiration/hidden) |  | Баян-Айрагийн хавцал ба хадан хүрхрээ | `/destination/bayan-airagiin-khavtsal-ba-khadan` | 56 |
| 232 | Түүхүүд | Нууц үзэсгэлэнт газрууд (/inspiration/hidden) |  | Суварга хайрханы нууц сүмбэр | `/destination/suvarga-khairkhany-nuuts-sumber` | 56 |
| 233 | Түүхүүд | Нууц үзэсгэлэнт газрууд (/inspiration/hidden) |  | Нэмэгтийн хөндийн үлэг гүрвэлийн оршуулга | `/destination/nemegtiin-khundiin-uleg-gurveliin-orshuulga` | 54 |
| 234 | Түүхүүд | Шилдэг жагсаалтууд (/inspiration/top-lists) |  | Монголд заавал очиж үзэх 7 байгалийн гайхамшиг | `/stories/mongold-zaaval-ochij-uzekh-7` | 63 |
| 235 | Түүхүүд | Шилдэг жагсаалтууд (/inspiration/top-lists) |  | Улаанбаатараас 2 цагийн дотор очих топ 5 амралтын цэг | `/stories/ulaanbaataraas-2-tsagiin-dotor-ochikh` | 64 |
| 236 | Түүхүүд | Шилдэг жагсаалтууд (/inspiration/top-lists) |  | Монголын хамгийн өндөр үнэлгээтэй 10 эко-лодж & кэмп | `/stories/mongolyn-khamgiin-undur-unelgeetei-10` | 62 |
| 237 | Түүхүүд | Шилдэг жагсаалтууд (/inspiration/top-lists) |  | Гадаад жуулчдын хамгийн их дурласан Монгол 5 хоол | `/stories/gadaad-juulchdyn-khamgiin-ikh-durlasan` | 60 |
| 238 | Түүхүүд | Шилдэг жагсаалтууд (/inspiration/top-lists) |  | Зэрлэг амьтад харах хамгийн өндөр магадлалтай 5 бүс нутаг | `/stories/zerleg-amitad-kharakh-khamgiin-undur` | 59 |
| 239 | Түүхүүд | Шилдэг жагсаалтууд (/inspiration/top-lists) |  | Гэрэл зурагчдын заавал очих ёстой 10 өнцөг | `/stories/gerel-zuragchdyn-zaaval-ochikh-yostoi` | 66 |

## Хэсгийн блокуудын «Дэлгэрэнгүй» товч

`/about/*` хуудсын том блок бүр (гарчиг, тайлбар, зураг) өөрийн «Дэлгэрэнгүй» товчтой байж болно.
?cat= шүүлтүүр рүү заадаг байсан товчнуудаас жинхэнэ хуудастай нь:

| Хуудас | Блок | Өмнө | Одоо |
|---|---|---|---|
| /about/culture | Археологийн өв | `/things-to-do/culture?cat=archaeology` | `/destination/heritage` |
| /about/culture | Түүх, соёлын дурсгал | `/things-to-do/culture?cat=historical-sites` | `/destination/heritage` |
| /about/culture | Гар урлал | `/things-to-do/culture?cat=crafts` | `/local/artisans` |
| /about/traditions | Зочлох, дайлах ёс | `/things-to-do/nomadic?cat=visit-herder` | `/local/herder-families` |
| /about/traditions | Үндэсний их баяр Наадам | `/recommendation/46P2ZsGTkRyowahv3BBgde` (entry ID) | `/recommendation/ulsyn-ikh-bayar-naadam` (slug) |
| /about/nature | Говь | `/things-to-do/nature?cat=gobi` | `/destination/landscapes#gobi` |
| /about/nature | Уулс | `/things-to-do/nature?cat=mountains` | `/destination/landscapes#mountains` |
| /about/nature | Ой, тайга | `/things-to-do/nature?cat=forest` | `/destination/landscapes#forest-taiga` |
| /about/nature | Гол, нуур | `/things-to-do/nature?cat=lakes-rivers` | `/destination/landscapes#lakes` |

Үлдсэн 16 товч `?cat=` шүүлтүүр рүү заасан хэвээр (тусдаа хуудасгүй, ангилал нь бодитоор байгаа):
- Тойм (/about/culture) › Монгол хөгжим → `/things-to-do/culture?cat=music-dance`
- Тойм (/about/culture) › Бүжиг, тайзны урлаг → `/things-to-do/culture?cat=music-dance`
- Тойм (/about/culture) › Дүрслэх урлаг → `/things-to-do/culture?cat=arts`
- Тойм (/about/culture) › Архитектур → `/things-to-do/culture?cat=monasteries`
- Ёс заншил, уламжлал (/about/traditions) › Цагаан сар → `/things-to-do/events?cat=tsagaan-sar`
- Ёс заншил, уламжлал (/about/traditions) › Буддын шашин → `/things-to-do/culture?cat=monasteries`
- Тойм (/about/nomadic-life) › Монгол гэр → `/things-to-do/nomadic?cat=ger-stay`
- Тойм (/about/nomadic-life) › Таван хошуу мал → `/things-to-do/nomadic?cat=herding`
- Тойм (/about/nomadic-life) › Дөрвөн улирлын нүүдэл → `/things-to-do/nomadic?cat=migration`
- Тойм (/about/nomadic-life) › Мал маллах ухаан → `/things-to-do/nomadic?cat=herding`
- Тойм (/about/food) › Махан хоол → `/things-to-do/food?cat=national-dishes`
- Тойм (/about/food) › Цагаан идээ → `/things-to-do/food?cat=dairy-products`
- Тойм (/about/food) › Гурилан хоол → `/things-to-do/food?cat=national-dishes`
- Тойм (/about/food) › Айраг → `/things-to-do/food?cat=airag-fermentation`
- Тойм (/about/food) › Монгол цай → `/things-to-do/food?cat=mongolian-tea`
- Тойм (/about/food) › Бүс нутгийн хоол → `/things-to-do/food?cat=regional-food`

Товчгүй блокууд (21): Монгол Улсын тухай үндсэн мэдээлэл (at-a-glance), Төрийн болон үндэсний бэлгэдэл (at-a-glance), Монгол орны онцлог тоо, баримтууд (at-a-glance), Орчин үеийн Монголын амьдрал (modern), Хот ба хөдөөгийн амьдрал (modern), Орчин үеийн урлаг, дизайн (modern), Залуусын соёл & Спорт (modern), Уран зохиол (culture), Үндэсний хувцас (culture), Төрөх, нэр өгөх ёс (traditions), Монгол хуримын ёс (traditions), Бөө мөргөл (traditions), Ардын шүтлэг, домог (traditions), Ургамлын аймаг (nature), Палеонтологи, үлэг гүрвэл (nature), Ахуйн багаж, хэрэгсэл (nomadic-life), Монгол ардын тоглоом наадам (nomadic-life), Уламжлалт хүнс боловсруулах арга (food), Монголчууд (people), Угсаатны бүлгүүд (people), Монгол хэл ба Монгол бичиг (people).
Эдгээрийн ихэнх нь `docs/plan/ia-plan.md`-ийн 8-р хэсгийн «ирээдүйн нийтлэл»-ийн жагсаалтад бий.

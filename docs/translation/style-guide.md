# Англи орчуулгын хэв маяг, SEO дүрэм

Travel Hub Mongolia-ийн англи хувилбарт (`/en/...`) зориулав. Орчуулагч (хүн эсвэл AI), шалгагч хоёулаа дагана.
Нэр томъёо: [glossary.csv](glossary.csv). Автомат шалгалт: `scripts/translation/check.js` ([HOW-TO.md](HOW-TO.md)).

## 1. Уншигч ба өнгө аяс

- Уншигч: Монголд ирэх гэж буй, Монголын тухай бага мэддэг гадаад аялагч. Англи хэл нь төрөлх хэл биш байж болно.
- Өнгө: тодорхой, найрсаг, баримттай. Сурталчилгааны хэт магтаалгүй ("breathtaking", "must-see" зэргийг цөөн).
- Боломжтой газар хоёрдугаар биеэр: "You can see…", "Plan a full day for…".
- Өгүүлбэр богино (15–20 үг). Нэг догол мөрөнд нэг санаа.
- **Америк англи** бичлэг: center, traveler, color, meter, kilometer.

## 2. Утгыг хадгалах

- Тоо, огноо, зай, нэр, координатыг яг хэвээр. Мэдээлэл нэмэхгүй, хасахгүй.
- Эх текстэд илт алдаа байвал (жишээ нь «120.1 га» дүүргийн хэмжээ) орчуулгад өөрчлөхгүй, тусад нь тэмдэглэж
  эх текстийг засуулна. Орчуулга эхээсээ өөр баримттай болохгүй.
- Монгол эх дэх «гэдэг», «гэж ярьдаг» (домог) → "legend says", "it is said that" — домгийг баримт мэт бичихгүй.

## 3. Нэр, галиг

- Газрын нэрийг **сайтын URL-ын slug-тай ижил** галигаар (glossary.csv-д бүгд бий): Uvurkhangai, Khuvsgul,
  Bayan-Ulgii, Dadal. Диакритик тэмдэггүй (ö, ü биш).
- Аймгийн нэр URL-аас ялгаатай 5 нь: Govi-Altai, Govisumber, Dornogovi, Dundgovi, Umnugovi (slug-д `gov-altai`,
  `umnugov` г.м.). Цөлийн бүс = **the Gobi**.
- Нэрийн утгыг орчуулахгүй: "Tsagaan Lake" (Цагаан нуур), "White Lake" биш. Ойлгомжтой болгох шаардлагатай бол
  эхний удаа хаалтанд: "Songinot Khairkhan (Onion Sacred Mountain)".
- Байгалийн нэрийн дараалал монгол дарааллаар: **Khuvsgul Lake, Onon River, Burkhan Khaldun Mountain,
  Khangai Range**. Олон тоо: "the Onon and Balj rivers".
- Хүний нэр: овог товчлол + нэр: "S. Batmunkh", "D. Zunduidagva". Түүхэн хүн: glossary-ийн хэлбэр
  (Chinggis Khaan — эхний удаа "Chinggis Khaan (Genghis Khan)").
- Засаг захиргаа: `Khentii Province (aimag)` эхний удаа, дараа нь `province`; `Dadal soum` (soum жижиг үсгээр, олон тоо `soums`; "sum" гэж бичихгүй);
  Улаанбаатарын `Khan-Uul District`; `bag`, `khoroo` эхний удаа тайлбартай.

## 4. Монгол нэр томъёо

- Англи хэлэнд тогтсон монгол үгийг хэвээр, налуугүй: ger, ovoo, deel, airag, Naadam, dzud, khoomei.
- Эхний удаа богино тайлбар хаалтанд (glossary-ийн «тэмдэглэл» баганад бий): "ovoo (sacred stone cairn)",
  дараа нь зөвхөн "ovoo".
- **хийморь** → эхний удаа "khiimori (a person's vital energy and good fortune)", дараа нь зөвхөн "khiimori".
  "wind horse" гэж бүү орчуул (хийморь нь хүний сүр сүнс, аз хийморь; хийморийн туг/лундаа биш).
- "yurt" гэж бичихгүй (SEO description-д нэг удаа "ger (yurt)" гэж болно).

## 5. Тоо, нэгж

- Мянгатыг таслалаар: 2,891; 87,229 hectares. Аравтыг цэгээр: 33.1 percent.
- Нэгж: km, m, km², °C, mm. Хасах температур: "−22 °C". Мөнгө: "MNT 3 million".
- Огноо: "May 31, 1959"; зуун: "the 13th century"; хугацаа: "1924–1931".
- «мянган» → тоогоор: "52,400 head of livestock".

## 6. Бүтэц (автомат шалгалт хийнэ)

- Гарчиг, догол мөр, жагсаалтын мөр, хүснэгт, зургийн мөрийн **тоо, дараалал эхтэйгээ ижил**.
- `![image](asset:…)` мөрийг огт өөрчлөхгүй. Холбоосын текстийг орчуулж, URL-ийг хэвээр.
- `**тод**`, `_налуу_`-г хадгална.

## 7. SEO

| Талбар | Дүрэм |
|---|---|
| `title` | Хуудасны нэр: "Dadal soum", "Nalaikh District". Тайлбар нэмэхгүй. |
| `seoTitle` | **≤ 60 тэмдэгт** (шалгагч алдаа гэж үзнэ). Гол түлхүүр үгээр эхэлнэ: "Dadal soum, Khentii: …". Брэндийн нэр бичихгүй (сайт өөрөө нэмнэ). |
| `seoDescription` | **≤ 155 тэмдэгт** (алдаа), 110-аас урт байвал сайн (анхааруулга). 1–2 бүтэн өгүүлбэр, гол түлхүүр үг эхний өгүүлбэрт, зай/юу үзэх гэх мэт тодорхой мэдээлэл. |
| `##` (H2) | **Асуултын хэлбэрээр**, аялагчийн хайдаг асуултаар: "Where is Dadal soum?", "What is there to see in Dadal soum?", "How do I get to Tseel soum?". Эхийн гарчгийн утга, дарааллыг хадгална. Ганц үл хамаарах нь "Frequently asked questions". |
| `###` (H3) | Тайлбар хэлбэр болно ("Places linked to Chinggis Khaan"). FAQ-ийн доорх H3 нь асуулт. |
| Түлхүүр үг | Хуудасны нэрийг эхний догол мөр, нэг H2-т байлгана. Хэт давтахгүй. |

Hreflang, canonical, хэлний sitemap-ийг сайт өөрөө үүсгэнэ (docs/plan/payload-migration.md «Routing»).
Орчуулга бүрэн, шалгагдсан хуудсыг л Payload-д `publishedLocales`-д `en` сонгож нийтэлнэ — дутуу
орчуулгатай хуудас хайлтад гарахгүй.

## 8. Жишээ

| Монгол | Муу | Сайн |
|---|---|---|
| Дадал сум хаана байдаг вэ? | Where is located Dadal soum? | Where is Dadal soum? |
| Хүн ам ба багууд | Population and bags | How many people live in Dadal and what are its bags? |
| Өвөлдөө 35–42 хэм хүйтэн | 35–42 degrees cold in winter | Winters drop to −35 to −42 °C. |
| Хөвсгөл нуур | Lake Hovsgol | Khuvsgul Lake |
| гэр бааз | yurt camp | tourist ger camp |

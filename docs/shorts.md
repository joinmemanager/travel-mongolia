# Богино бичлэг (YouTube Shorts): playlist-ээр удирдах

Сайтын богино бичлэгүүд YouTube-ийн **Travel Hub Mongolia** сувгийн playlist-уудаас автоматаар татагдана. Сайт дээр харагдах бичлэгийг өөрчлөхийн тулд кодыг засах шаардлагагүй. Зөвхөн YouTube дээрх playlist-аа засна.

Бичлэгүүд гарах газар:
- Нүүр хуудасны «Монголыг богино бичлэгээр» хэсэг (сэдвийн табууд)
- «Фото/видео түүх» хэсэг: `/stories/photo-video` (Бүгд) болон `/stories/photo-video/<сэдэв>`

## Сэдэв ба playlist

Доорх нь монгол playlist-ууд. Хэл бүрийн playlist `travel-mongolia/lib/shortsData.ts`-ийн `SHORTS_PLAYLISTS`-д байна («Шинэ хэлний playlist нэмэх» хэсгийг үзнэ үү).

| Сэдэв | Хаяг | Playlist (mn) |
|---|---|---|
| Монголын уламжлалт ёс заншил | `/stories/photo-video/traditions` | `PLIMfWmpU8Ivs` |
| Монголын түүхэн эрхмүүд | `/stories/photo-video/historical-figures` | `PLF1xGAd_uK44` |
| Монголын бурхны шашин | `/stories/photo-video/buddhism` | `PLAt3jou1DKhM` |
| Монголын түүхийн өв соёл | `/stories/photo-video/heritage` | `PLd_YRUvE5-xk` |
| Монголын байгалийн өв соёл | `/stories/photo-video/nature` | `PLNqTP1hahZQA` |
| Монголын домог, аман түүх | `/stories/photo-video/legends` | `PLQQAdddZOPKI` |
| Монголын сүм хийдүүд | `/stories/photo-video/monasteries` | `PLHl9G7wHh6tQ` |

## Бичлэг нэмэх

1. YouTube Studio дээр бичлэгээ **Public** (эсвэл Unlisted) болгож нийтэлнэ.
2. Бичлэгийг тохирох playlist руу нэмнэ.
3. Сайт дээр гарах гарчиг нь YouTube дээрх бичлэгийн гарчиг байна.

Сайт дээр **гарахгүй** бичлэгүүд:
- Private (хувийн) болон устгасан бичлэг
- Хараахан нийтлэгдээгүй (товлосон) бичлэг
- «Embed хийхийг зөвшөөрөх» (Allow embedding) тохиргоог унтраасан бичлэг, учир нь сайт дотор тоглуулах боломжгүй

## Дараалал өөрчлөх

Сайт дээрх дараалал нь playlist дахь дараалалтай яг ижил байна. YouTube дээр playlist-ээ нээгээд бичлэгүүдийг чирж байрлалыг нь өөрчилнө. Нүүр хуудсанд эхний 5 бичлэг харагдана.

## Сайт дээр хэзээ гарах вэ

- **Автоматаар: 24 цагийн дотор.** Сайт YouTube-ээс өдөрт нэг удаа шинэ жагсаалт татдаг.
- **Шууд гаргах бол** гараар шинэчилнэ. Энэ үйлдэлд `CONTENTFUL_REVALIDATE_SECRET` нууц үг хэрэгтэй (Vercel → Settings → Environment Variables):

  ```bash
  curl -X POST "https://www.travelhubmongolia.com/api/revalidate?tag=shorts" \
    -H "x-revalidate-secret: <CONTENTFUL_REVALIDATE_SECRET>"
  ```

  `{"ok":true,...}` гэсэн хариу ирвэл амжилттай. Дараагийн зочлолтоор шинэ бичлэгүүд гарна. `503` ирвэл YouTube API тухайн үед ажиллахгүй байна гэсэн үг. Энэ үед сайт өмнөх жагсаалтаа харуулсаар байх тул хэсэг хугацааны дараа дахин оролдоно.

## Цөөн бичлэгтэй эсвэл хоосон сэдэв

- **Бичлэггүй сэдэв:** нүүр хуудсанд таб нь харагдахгүй. «Фото/видео түүх» хэсэгт сэдэв хэвээр үлдэх ба «Удахгүй нэмэгдэнэ» гэсэн мэдэгдэл гарна.
- **1–5 бичлэг:** нүүр хуудсанд байгаа бичлэгүүд л гарна.
- **6 ба түүнээс дээш:** нүүр хуудсанд эхний 5 бичлэг болон «+N / Бүгдийг үзэх» карт гарна.

## Google-д бүртгүүлэх (index)

Энэ нь автоматаар шийдэгдэнэ:
- Сэдвийн хуудас **5 ба түүнээс дээш** бичлэгтэй бол Google-д бүртгэгдэж sitemap-д орно. Түүнээс цөөн бол бүртгэгдэхгүй (noindex).
- `/stories/photo-video` хуудас нийт **10 ба түүнээс дээш** бичлэгтэй бол бүртгэгдэнэ.

## Алдаа гарвал

YouTube API ажиллахгүй үед (түлхүүр алга, өдрийн квот дууссан, сүлжээний алдаа) сайт эвдрэхгүй. Сүүлд амжилттай татсан жагсаалт харагдсаар байна. Хэрэв ийм жагсаалт огт байхгүй бол сэдэв бүрийн нэг үндсэн бичлэг (`lib/shorts.ts`-ийн `fallback`) харагдана. Алдааны мэдээллийг Vercel-ийн log-оос `Shorts:` гэж хайж харна.

YouTube Data API-ийн түлхүүр нь Vercel-ийн `YOUTUBE_API_KEY` (Production, Preview) хувьсагчид хадгалагддаг. Квотын тооцоо: доорх «Квот» хэсэг.

## Сайтын хэлээр харуулах

Сайт 6 хэлтэй: `mn`, `en`, `zh-CN`, `ru`, `ko`, `ja` (цэсний хэл сонгогч). Хэл нь URL-аар биш, Google Translate-ийн `googtrans` cookie-гоор солигддог. Богино бичлэгийн хэсэг үүнийг дагана:

- **Бичлэг:** сонгосон хэлний playlist-аас. Тухайн хэлний playlist хоосон, бичлэггүй эсвэл алдаатай бол **англи** playlist-аас, тэр нь бас байхгүй бол **монгол** playlist-аас гарна. Сонголтыг сэдэв тус бүрээр хийнэ.
- **Сэдвийн нэр, товч, modal-ын бичвэр** тухайн хэлээр гарна (`lib/shortsI18n.ts`). Google Translate эдгээрийг дахин орчуулахгүй. Монгол бичлэгийн гарчгийг л Google Translate орчуулна.
- Нүүр хуудасны табууд, `/stories/photo-video`, сэдвийн хуудсууд, modal тоглуулагч бүгд дагана. Хэсгийн толгой (H1, «Сэдвийн жагсаалт», цэс)-г өмнөх шигээ Google Translate орчуулна.
- **Хайлт (SEO):** сервер үргэлж монгол хувилбарыг гаргадаг тул Google монгол хуудсыг л харна. VideoObject бүр `inLanguage`-тэй. Индексийн тоонд (сэдэв 5+, «Бүгд» 10+) зөвхөн хуудасны хэлний бичлэг орно, өөр хэлнээс fallback-аар ирсэн бичлэг тоологдохгүй. Хэл бүр өөрийн URL-гүй тул hreflang одоогоор байхгүй. `/en/` шат (ia-plan.md) хэрэгжихэд `getShortsTopics(lang)`, `isTopicIndexable(t, lang)`, `shortsJsonLd(videos, lang)`-ийг хэлний хуудсанд шууд ашиглана.

## Шинэ хэлний playlist нэмэх

Код бичих шаардлагагүй, нэг файлд ID (эсвэл холбоос) буулгана.

1. YouTube дээр тухайн хэлний playlist үүсгэж (сэдэв бүрд нэг), бичлэгүүдээ нэмнэ. Playlist нь **Public** эсвэл **Unlisted** байна.
2. Playlist-ийн холбоосыг хуулна: `https://www.youtube.com/playlist?list=PL…`. Бичлэг тоглож байх үеийн `…watch?v=…&list=PL…` холбоос ч болно.
3. `travel-mongolia/lib/shortsData.ts`-ийн `SHORTS_PLAYLISTS`-оос хэлээ олж (`en`, `zh-CN`, `ru`, `ko`, `ja`), тохирох сэдвийн `''`-ийн дотор буулгана:

   ```ts
   ru: {
     traditions: 'https://www.youtube.com/playlist?list=PLxxxxxxxx',
     'historical-figures': 'PLyyyyyyyy',   // ID-г шууд бичсэн ч болно
     buddhism: '',                          // хоосон: англи, тэгээд монгол бичлэг гарна
     ...
   },
   ```

   ID-г холбоосоос автоматаар салгана (`list=` параметр). Бүх сэдвийг нэг дор бөглөх шаардлагагүй.
4. Шалгах: `node scripts/shorts/test-parse.js` (travel-mongolia хавтаснаас). Бүх хэлэнд 7 сэдэв байгаа эсэх, утга танигдаж байгаа эсэхийг шалгана.
5. Ердийн ажлын дүрмээр branch дээр хийж, preview дээр хэлээ сонгоод шалгуулсны дараа merge хийнэ. Merge-ийн дараа шууд гаргах бол дээрх «Шууд гаргах» `curl`-ийг ажиллуулна.

Анхаарах:
- Англи playlist бусад хэлний fallback болдог тул эхлээд англи playlist-уудаа бөглөх нь зүйтэй.
- Сэдвийн нэр, товчны орчуулга `lib/shortsI18n.ts`-д бий. Шинэ хэл (7 дахь) нэмэх бол `lib/shorts.ts`-ийн `SHORTS_LANGS`, `components/Navbar.tsx`-ийн `LANGUAGES`, `app/layout.tsx`-ийн Google Translate `includedLanguages`, `lib/shortsI18n.ts`-ийн хоёр хүснэгт, `SHORTS_PLAYLISTS`-д нэмнэ (layout.tsx-ийн Google tag-уудад хүрэхгүй).

## Шинэ сэдэв нэмэх (хөгжүүлэгчид)

1. YouTube дээр playlist үүсгэж ID-г нь авна (`youtube.com/playlist?list=<ID>`).
2. `travel-mongolia/lib/shorts.ts`-ийн `SHORTS_CATEGORIES`-д шинэ мөр нэмнэ: `slug` (хаяг, латинаар), `tab` (нүүр хуудасны богино нэр), `title`, `fallback` (нэг үндсэн бичлэгийн `id`, `title`).
3. `lib/shortsData.ts`-ийн `SHORTS_PLAYLISTS`-д хэл бүрт тухайн `slug`-ийн мөр нэмнэ (`mn` заавал, бусад нь `''` байж болно).
4. `lib/shortsI18n.ts`-ийн `NAMES`-д 5 хэлний нэр нэмнэ (англи нэр нь цэсэнд ч гарна).
5. Цэс, «Сэдвийн жагсаалт», хуудас, sitemap автоматаар үүснэ (`lib/navigation.ts`, `app/(sec-photo)/stories/photo-video/[category]`).
6. Шалгах: `node scripts/shorts/test-parse.js` (travel-mongolia хавтаснаас).
7. Ердийн ажлын дүрмээр branch дээр хийж, preview дээр шалгуулсны дараа merge хийнэ.

## Квот (YouTube Data API)

- Өдрийн хязгаар: 10,000 unit.
- Playlist бүр 24 цагт нэг удаа татагдана: `playlistItems.list` + `videos.list`, тус бүр 50 бичлэг тутамд 1 unit. 50-аас цөөн бичлэгтэй playlist ≈ **2 unit/өдөр**.
- Хоосон (`''`) playlist-д хүсэлт явахгүй. Fallback нь ижил playlist-ийн кэшийг ашиглах тул нэмэлт квот авахгүй.
- Одоо (7 монгол playlist): ≈ 14 unit/өдөр. Бүх 6 хэлний 42 playlist бөглөгдвөл: ≈ 84 unit/өдөр (50+ бичлэгтэй playlist бүр 2 unit нэмнэ). Production, Preview тус бүр өөрийн кэштэй тул нийлээд ≈ 170 unit, хязгаарын 2% орчим.
- Гараар шинэчлэх (`?tag=shorts`) бүр шалгалтад 1 unit, дараа нь бүх playlist дахин татагдана.
- Алдаатай playlist кэшлэгдэхгүй тул хуудас дахин үүсэх бүрт (цаг тутам) дахин оролдоно. Буруу ID удаан үлдвэл квот бага зэрэг зарцуулна, log-д `Shorts: <ID> playlist татаж чадсангүй` гарна.

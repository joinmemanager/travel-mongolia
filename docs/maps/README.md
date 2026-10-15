# Газрын зураг, газарзүйн өгөгдлийн эх сурвалж, лиценз

## Аймгийн газрын зураг (`travel-mongolia/lib/aimagMap.ts`)

Аймгийн хуудасны sidebar дахь Монголын 21 аймаг + Улаанбаатарын SVG газрын зураг (`components/province/AimagMap.tsx`).

- **Эх сурвалж:** [Natural Earth](https://www.naturalearthdata.com/) 1:10m Cultural Vectors, «Admin 1 – States, Provinces», хувилбар 5.1.2 (`ne_10m_admin_1_states_provinces.geojson`, [GitHub](https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2/geojson)).
- **Лиценз:** Public domain. «All versions of Natural Earth raster + vector map data found on this website are in the public domain. You may use the maps in any manner, including modifying the content and design, electronic dissemination, and offset printing.» ([Terms of use](https://www.naturalearthdata.com/about/terms-of-use/)). Нэр заах шаардлагагүй, гэхдээ энд тэмдэглэв.
- **Боловсруулалт:** `scripts/maps/build-aimag-map.js` — `adm0_a3 = MNG` мөрүүдийг ISO 3166-2 кодоор Contentful-ийн slug-тай тааруулж, Mercator проекцоор 400×250 px-д буулгаж, Douglas–Peucker (0.35 px) аргаар хялбарчилсан. Файлын хэмжээ ≈16 KB (хязгаар 60 KB).
- Natural Earth-ийн хил нь 1:10 сая масштабынх тул жижиг аймгийн (Орхон, Дархан-Уул, Говьсүмбэр) хил ойролцоо. Албан ёсны хилийн зураг биш, байршил харуулах зориулалттай.

Дахин үүсгэх:

```
curl -L -o <хавтас>/admin1.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_1_states_provinces.geojson
node scripts/maps/build-aimag-map.js <хавтас>/admin1.geojson
```

## Аймгийн дундаж өндөршил (`lib/provinceFacts.ts` → `elevation`)

- **Арга:** `scripts/maps/aimag-elevation.js` — дээрх Natural Earth-ийн хил доторх ≈250 тэгш торон цэгийн өндрийг [Open-Meteo Elevation API](https://open-meteo.com/en/docs/elevation-api)-аас авч, энгийн дунджийг 10 м-ээр бөөрөнхийлсөн.
- **Өндрийн өгөгдөл:** Copernicus DEM GLO-90 (90 м). © DLR e.V. 2010–2014 and © Airbus Defence and Space GmbH 2014–2018, provided under COPERNICUS by the European Union and ESA; all rights reserved. Үнэ төлбөргүй ашиглах лицензтэй ([Copernicus DEM license](https://spacedata.copernicus.eu/documents/20123/121286/CSCDA_ESA_Mission-specific+Annex_31_Oct_22.pdf)).
- **Open-Meteo:** өгөгдөл CC BY 4.0 ([open-meteo.com/en/license](https://open-meteo.com/en/license)). Нэг удаагийн тооцоо, сайт ажиллах үед дууддаггүй.

## Цаг агаар (`app/api/weather/[slug]/route.ts`)

- [Open-Meteo Forecast API](https://open-meteo.com/en/docs), түлхүүргүй, CC BY 4.0. Server талд 1 цаг кэшилнэ (аймаг бүрт цагт ≤1 дуудлага). Open-Meteo-ийн үнэгүй API нь арилжааны бус хэрэглээнд зориулагдсан тул сайт арилжааны чиглэлтэй болбол [API subscription](https://open-meteo.com/en/pricing) шаардлагатай эсэхийг шалгана.

## Аймгийн үзүүлэлт (`lib/provinceFacts.ts`)

Эх сурвалж бүрийг файлын толгойд бичсэн: ҮСХ-ны 2020 оны тооллого (Wikipedia «Provinces of Mongolia»-ээр), Wikipedia «Districts of Mongolia» (сумын тоо), touristinfocenter.mn (Улаанбаатараас зай).

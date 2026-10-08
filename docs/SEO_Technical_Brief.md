# TRAVEL HUB MONGOLIA

> Эх файл: SEO_Technical_Brief.docx (2026-10-08-нд markdown болгож хуулсан).
## SEO хөгжүүлэлтийн техникийн даалгавар
Хөгжүүлэгч, контентын баг, редактор, SEO хариуцагчид зориулсан хэрэгжүүлэх баримт бичиг

Хувилбар 1.0 • 2026

## 1. Баримт бичгийн зорилго
Travel Hub Mongolia-г эхнээс нь хайлтын системд зөв ойлгогдох, олон хэл дээр өргөжих боломжтой, контентын сан нь жил ирэх тусам үнэ цэнээ нэмэгдүүлдэг, хэрэглэгчийг мэдээллээс маршрут болон захиалга руу хөтөлдөг үндэсний аялал жуулчлалын платформ болгон хөгжүүлэхэд энэхүү техникийн даалгаврыг ашиглана.
### Үндсэн зарчим
SEO-г дараа нь нэмэх нэмэлт ажил биш, сайт хөгжүүлэлтийн суурь шаардлага гэж үзнэ.
URL, олон хэл, өгөгдлийн бүтэц, sitemap, structured data, хурд, canonical, redirect зэрэг шийдлийг контент ихээр оруулахаас өмнө батална.
Хуудас бүр хайлтын нэг бодит хэрэгцээнд хариулж, хэрэглэгчийг дараагийн хэрэгтэй алхам руу хөтөлнө.
TouristInfoCenter.mn-ийн хуучин SEO хөрөнгийг Travel Hub руу шилжүүлэхдээ URL тус бүрийн mapping ба 301 redirect ашиглана.
Контентын тооноос илүү чанар, дотоод холбоос, бодит эх сурвалж, шинэчлэлт ба хэрэглэгчийн ашиг тусыг чухалчилна.
## 2. Үүрэг хариуцлагын хуваарилалт
| Үүрэг | Хариуцагч | Гол ажил | Хүлээлгэн өгөх үр дүн |
| --- | --- | --- | --- |
| Техникийн SEO | Хөгжүүлэгч + SEO | URL, canonical, hreflang, sitemap, robots, schema, redirects, speed | Алдаагүй индексжих техникийн суурь |
| Контентын SEO | Редактор + SEO | Keyword intent, title, H1, бүтэц, internal link, зураг | Хайлтын хэрэгцээнд нийцсэн хуудас |
| Өгөгдлийн архитектур | Product/Tech | Destination, place, tour, provider, event, heritage хоорондын холбоо | Нэг мэдээллийг олон хэсэгт зөв ашиглах өгөгдлийн загвар |
| Хяналт | SEO/Analytics | Search Console, GA4, Core Web Vitals, index coverage | Сар бүр хэмжигдэх тайлан |

## 3. URL архитектур
URL-ийн бүтэц эхнээсээ тогтвортой байна. Нэгэнт нийтлэгдсэн URL-ийг шаардлагагүйгээр солихгүй.
Санал болгох бүтэц:

- travelhubmongolia.com/en/destinations/
- travelhubmongolia.com/en/places/
- travelhubmongolia.com/en/things-to-do/
- travelhubmongolia.com/en/itineraries/
- travelhubmongolia.com/en/tours/
- travelhubmongolia.com/en/accommodation/
- travelhubmongolia.com/en/events/
- travelhubmongolia.com/en/culture/
- travelhubmongolia.com/en/nature/
- travelhubmongolia.com/en/travel-guide/

### URL дүрэм
Жижиг үсэг ашиглах.
Үг хооронд hyphen (-) ашиглах.
Огноо, ID, санамсаргүй кодыг үндсэн public URL-д хэрэглэхгүй.
URL богино, ойлгомжтой, агуулгаа тайлбарласан байна.
Query parameter бүхий filter/sort хуудсуудыг индексжүүлэх эсэхийг тусгайлан шийднэ.
Хуучин URL солигдвол 301/308 permanent redirect-ээр шинэ URL рүү шууд чиглүүлнэ.
Redirect chain үүсгэхгүй; хуучин URL → эцсийн шинэ URL гэсэн нэг алхамтай байна.
## 4. Олон хэлний SEO
Хэл бүр тусдаа URL-тай байна. Жишээ: /en/, /mn/, /ko/, /ja/, /zh/, /ru/.
Хэлний хувилбар бүр self-canonical байна.
Ижил агуулгын хэлний хувилбарууд hreflang-аар хоорондоо холбоотой байна.
hreflang reciprocal буюу хоёр талдаа зөв заасан байна.
x-default хувилбарыг шаардлагатай тохиолдолд ашиглана.
Автомат орчуулсан сул контентыг бөөнөөр индексжүүлэхгүй.
Англи контент нь монгол эхийг шууд үгчлэн орчуулах бус, гадаад аялагчийн хайлтын хэрэгцээнд тохируулсан байна.
## 5. CMS-д заавал байх SEO талбарууд
| Талбар | Шаардлага | Тайлбар |
| --- | --- | --- |
| SEO title | Заавал | Хайлтын үр дүнд харагдах гарчиг |
| Meta description | Заавал | Хуудасны товч тайлбар |
| URL slug | Заавал | Редактор хянах боломжтой |
| H1 | Заавал | Нэг үндсэн H1 |
| Canonical URL | Автомат/хянах | Үндсэн URL |
| Index / noindex | Админ | Хайлтад оруулах эсэх |
| Follow / nofollow | Админ | Ховор тохиолдолд ашиглах |
| Primary topic / keyword | Редакц | Контентын зорилго |
| Language | Заавал | hreflang үүсгэхэд ашиглана |
| OG title / description / image | Заавал | Social share |
| Author | Заавал | Зохиогч |
| Reviewer / local expert | Санал болгох | Нотолгоо ба итгэлцэл |
| Published date | Автомат | Анх нийтэлсэн огноо |
| Last updated | Автомат | Сүүлд шинэчилсэн огноо |
| Source / references | Санал болгох | Эх сурвалж |
| Related pages | Заавал | Internal linking |

## 6. Өгөгдлийн үндсэн төрөл ба холбоос
SEO-гийн хүч нь тусдаа нийтлэлүүдээс бус, хоорондоо холбоотой өгөгдлөөс үүснэ.
| Өгөгдлийн төрөл | Жишээ | Заавал холбох |
| --- | --- | --- |
| Destination | Аймаг, бүс, хот | Places, experiences, tours, events, providers |
| Place / Attraction | Үзмэр, байгалийн болон соёлын газар | Destination, map, nearby places, tours |
| Experience | Морь, тэмээ, хоол, нүүдэлчин ахуй гэх мэт | Place, provider, tour |
| Tour / Itinerary | Маршрут, хоног, улирал, үнэ | Destination, place, provider, booking |
| Provider | Бааз, буудал, тур оператор, хөтөч, ресторан | Destination, services, booking |
| Event | Наадам, фестиваль, арга хэмжээ | Destination, date, venue |
| Heritage | Биет/биет бус өв | Destination, related people,  experiences |
| Nature | ТХГН, амьтан, ургамал, экосистем | Destination, place, season |
| Person / Local expert | Хөтөч, малчин, урлаач, үйлдвэрлэгч | Destination, experience, provider |

## 7. Structured Data (Schema) шаардлага
JSON-LD ашиглахыг үндсэн стандарт болгоно. Structured data нь зөвхөн хуудсан дээр бодитоор харагдаж буй мэдээллийг тэмдэглэнэ.
| Schema төрөл | Хэрэглэх хэсэг |
| --- | --- |
| Organization | Байгууллагын үндсэн мэдээлэл |
| WebSite | Сайтын түвшний мэдээлэл |
| BreadcrumbList | Breadcrumb бүхий хуудас |
| Article / BlogPosting | Нийтлэл, тайлбар контент |
| Event | Эвент, фестиваль |
| LocalBusiness | Тохирох үйлчилгээ үзүүлэгч |
| LodgingBusiness / Hotel | Буудал, байр |
| TouristAttraction | Үзмэрийн төрөлд тохирох үед |
| VideoObject | Видео контент |
| Person / ProfilePage | Хөтөч, эксперт, зохиогчийн профайл |

Тэмдэглэл: FAQ rich result нь 2026 онд Google Search-ээс хасагдсан тул FAQ хэсгийг хэрэглэгчийн ашиг тусын төлөө ашиглаж болно, гэхдээ тусгай rich result авах гол SEO тактик гэж тооцохгүй.
## 8. Sitemap, robots.txt ба индексжүүлэлт
sitemap.xml индекс файлтай байна.
Контентын төрөл тус бүрээр sitemap салгаж болно: destinations, places, articles, tours, events, providers, videos.
Sitemap зөвхөн canonical, indexable, 200 status бүхий URL агуулна.
lastmod бодитоор өөрчлөгдсөн үед шинэчлэгдэнэ.
robots.txt дотор sitemap URL заана.
Admin, account, checkout, search results, filter parameter зэрэг хайлтын үнэ цэн багатай хуудсуудыг зохих аргаар индексээс хасна.
Robots.txt-ээр хаасан хуудас дээр noindex найдахгүй; индексжүүлэлтийн дүрмийг зөв хэрэгжүүлнэ.
## 9. Internal linking ба breadcrumb
Бүх indexable хуудас дор хаяж нэг crawlable internal link-ээр хүрэх боломжтой байна.
Destination → Place → Experience → Tour → Provider гэсэн логик холбоосууд автоматаар санал болгодог байна.
Breadcrumb бүх дотоод хуудсанд байна.
Related content блок CMS-ээс удирддаг байна.
Orphan page буюу дотоод линкгүй хуудас сар бүр шалгана.
Anchor text нь 'энд дар' гэхээс илүү холбогдож буй агуулгыг ойлгомжтой нэрлэнэ.
## 10. Зураг ба видео SEO
WebP эсвэл AVIF үндсэн формат; шаардлагатай fallback ашиглана.
Зургийн өргөн/өндөр хэмжээг HTML-д урьдчилан зааж CLS-ээс сэргийлнэ.
Lazy loading-ийг hero/LCP зурагт буруу ашиглахгүй.
Файлын нэр утгатай байна: khongor-sand-dunes-gobi-mongolia.webp.
ALT текст бодит дүрслэлийг товч тайлбарлана; keyword чихэхгүй.
Зураг бүрийн credit, location, photographer, copyright талбар хадгалах боломжтой байна.
Видео хуудсанд transcript/summary, thumbnail, duration, upload date хадгална.
## 11. Хурд ба Core Web Vitals
| Үзүүлэлт | Зорилтот түвшин | Гол арга хэмжээ |
| --- | --- | --- |
| LCP | ≤ 2.5 секунд | Hero зураг, server response, critical CSS, CDN |
| INP | ≤ 200 ms | JS багасгах, event handler оновчлох |
| CLS | ≤ 0.1 | Зураг/iframe хэмжээ тогтоох, late layout shift зогсоох |

Mobile-first байдлаар шалгана.
CDN, browser caching, compression, HTTP/2 эсвэл HTTP/3 боломж ашиглана.
Хүнд third-party script бүрийн хэрэгцээг хянаж зөвшөөрнө.
PageSpeed/Lighthouse лабораторийн хэмжилтээс гадна Search Console дахь бодит хэрэглэгчийн Core Web Vitals тайланг хянана.
## 12. JavaScript, rendering ба crawlability
Үндсэн SEO контент, гарчиг, текст, internal link нь Googlebot JavaScript ажиллуулахгүй байсан ч серверээс HTML хэлбэрээр авах боломжтой байхыг зорих.
React/Next/Vue ашиглавал SSR/SSG/ISR зэрэг хайлтын системд найдвартай rendering архитектур сонгох.
Infinite scroll ашиглавал page URL болон crawlable pagination/links шийдэлтэй байна.
Client-side routing өөрчлөгдөх бүрт unique URL болон browser history зөв ажиллана.
Soft 404, blank shell, loading-only HTML-ээс зайлсхий.
## 13. TouristInfoCenter.mn → Travel Hub Mongolia шилжилт
Энэ хэсгийг тусдаа төслийн ажил гэж үзнэ. Хуучин сайтын SEO хөрөнгийг алдахгүй байх гол хамгаалалт нь URL mapping юм.
TouristInfoCenter-ийн индексжсэн болон органик хандалттай бүх URL жагсаалт гаргах.
URL бүрийг: 1) ижил агуулгын шинэ хуудас, 2) нэгтгэх хуудас, 3) архивлах/410 гэсэн ангилалд оруулах.
Хуучин URL → хамгийн ойр тохирох шинэ URL гэсэн 1:1 mapping хүснэгт үүсгэх.
301/308 server-side redirect хэрэгжүүлэх.
Бүх internal link, canonical, hreflang, sitemap-ыг шинэ URL рүү шинэчлэх.
Хуучин олон URL-ийг шалтгаангүйгээр homepage руу бөөнөөр redirect хийхгүй.
Redirect chain болон loop-ийг crawler-аар шалгах.
Шилжилтийн өмнө/дараа органик clicks, impressions, top pages, backlinks-ийн хяналтын snapshot хадгалах.
Шилжилтийн дараа Search Console дээр 404, soft 404, indexing, canonical, crawl issue-ийг тогтмол хянах.
## 14. Destination page-ийн стандарт SEO загвар
H1: Газрын нэр + Mongolia (хэрэгцээнд тохируулан)
100–150 үгийн товч танилцуулга
Яагаад очих вэ?
Гол 5–10 үзмэр
Юу хийх вэ?
Хэзээ очих вэ?
Хэд хоног төлөвлөх вэ?
Хэрхэн очих вэ?
Хаана байрлах вэ?
Орон нутгийн хүмүүс, хоол, туршлага
Газрын зураг
Санал болгох маршрутууд
Холбогдох tour/experience/provider
Асуулт, хариултын хэсэг
Эх сурвалж / reviewed by / last updated
## 15. Search Console, GA4 ба хэмжилт
| Систем | Юуг хэмжих |
| --- | --- |
| Google Search Console | Indexing, clicks, impressions, CTR, position, CWV, rich results |
| Google Analytics 4 | Users, sessions, engagement, conversions, booking funnel |
| Bing Webmaster Tools | Bing indexing, crawl, search data |
| Tag Manager | Event tracking-ийг кодоос тусгаарлан удирдах |

### GA4-д заавал хэмжих үйлдлүүд
destination_view
place_view
tour_view
search
map_interaction
trip_planner_start
trip_planner_save
provider_click
booking_start
booking_complete
newsletter_signup
language_change
## 16. Нээлтийн өмнөх SEO QA checklist
| № | Шалгах зүйл | Төлөв |
| --- | --- | --- |
| 1 | Production domain HTTPS зөв ажиллаж байна. | □ Хийгдээгүй   □ Хийгдсэн |
| 2 | www / non-www нэг хувилбар руу permanent redirect хийнэ. | □ Хийгдээгүй   □ Хийгдсэн |
| 3 | HTTP → HTTPS permanent redirect. | □ Хийгдээгүй   □ Хийгдсэн |
| 4 | Staging noindex хамгаалалт  production дээр үлдээгүй. | □ Хийгдээгүй   □ Хийгдсэн |
| 5 | robots.txt production-д зөв. | □ Хийгдээгүй   □ Хийгдсэн |
| 6 | XML sitemap production URL-уудаар үүссэн. | □ Хийгдээгүй   □ Хийгдсэн |
| 7 | Search Console property баталгаажсан. | □ Хийгдээгүй   □ Хийгдсэн |
| 8 | Sitemap Search Console-д илгээсэн. | □ Хийгдээгүй   □ Хийгдсэн |
| 9 | Canonical self-referencing зөв. | □ Хийгдээгүй   □ Хийгдсэн |
| 10 | hreflang алдаагүй, reciprocal. | □ Хийгдээгүй   □ Хийгдсэн |
| 11 | 404 хуудас бодит 404 status буцаана. | □ Хийгдээгүй   □ Хийгдсэн |
| 12 | Redirect chain/loop байхгүй. | □ Хийгдээгүй   □ Хийгдсэн |
| 13 | Title/H1 duplicate шалгасан. | □ Хийгдээгүй   □ Хийгдсэн |
| 14 | Meta description үндсэн landing pages дээр бүрэн. | □ Хийгдээгүй   □ Хийгдсэн |
| 15 | Structured data Rich Results/Test-аар шалгасан. | □ Хийгдээгүй   □ Хийгдсэн |
| 16 | Breadcrumb ажиллаж байна. | □ Хийгдээгүй   □ Хийгдсэн |
| 17 | Internal links crawlable байна. | □ Хийгдээгүй   □ Хийгдсэн |
| 18 | Mobile layout эвдрэлгүй. | □ Хийгдээгүй   □ Хийгдсэн |
| 19 | Core Web Vitals үндсэн template-үүд дээр шалгасан. | □ Хийгдээгүй   □ Хийгдсэн |
| 20 | Image alt болон width/height дүрэм хэрэгжсэн. | □ Хийгдээгүй   □ Хийгдсэн |
| 21 | GA4 conversion events ажиллаж байна. | □ Хийгдээгүй   □ Хийгдсэн |
| 22 | TouristInfoCenter migration mapping батлагдсан. | □ Хийгдээгүй   □ Хийгдсэн |

## 17. Хэрэгжүүлэх дараалал
| Түвшин | Ажил |
| --- | --- |
| P0 – Нээлтээс өмнө | URL architecture, language URLs, canonical, hreflang, robots, sitemap, schema base, SSR/HTML rendering, analytics, CWV, 301 mapping |
| P1 – Нээлтийн эхний 1 сар | Destination templates, internal links, image SEO, Search Console error fixes, top 100 keyword/page mapping |
| P2 – 2–3 сар | Places, experiences, tours, providers, events structured expansion; content clusters |
| P3 – Тасралтгүй | Content refresh, broken links, orphan pages, schema errors, CWV, CTR optimization, search demand analysis |

## 18. Хөгжүүлэгчээс ажил хүлээж авах шалгуур
Googlebot-д үндсэн контент HTML хэлбэрээр уншигдана.
Indexable page бүр unique URL, title, H1, canonical-тай.
Хэлний хувилбарууд hreflang-аар зөв холбогдсон.
Sitemap автоматаар шинэчлэгдэж зөвхөн indexable URL агуулна.
Schema JSON-LD синтакс болон агуулгын хувьд хүчинтэй.
Core templates mobile дээр хурд, layout, functionality-ийн хувьд хүлээн зөвшөөрөх түвшинд байна.
404, 301, canonical, robots, sitemap-ийн автомат тест эсвэл QA checklist бий.
CMS редактор SEO талбаруудаа код өөрчлөхгүйгээр удирдах боломжтой.
Migration redirect map import/удирдах боломжтой.
Analytics event-үүд test environment болон production дээр шалгагдсан.
## 19. Эхний 90 хоногийн ажлын төлөвлөгөө
| Хугацаа | Гол зорилго | Гарах үр дүн |
| --- | --- | --- |
| 1–2 долоо хоног | Архитектур батлах | URL, хэл, data model, template list, migration inventory |
| 3–4 долоо хоног | Техникийн суурь | SSR/HTML, metadata, canonical, hreflang, sitemap, robots, schema base |
| 5–6 долоо хоног | CMS ба template | Destination, Place, Article, Tour, Provider, Event templates |
| 7–8 долоо хоног | Migration бэлтгэл | Old→new URL mapping, redirect QA, content merge decisions |
| 9–10 долоо хоног | Analytics/QA | GSC, GA4, events, CWV, structured data, crawl audit |
| 11–12 долоо хоног | Launch + monitoring | Indexing, 404, rankings baseline, top landing pages, fixes |

## 20. Ашигласан үндсэн SEO эх сурвалж
Google Search Central – Site move with URL changes
Google Search Central – Localized versions and hreflang
Google Search Console Help – Sitemap
Google Search Console Help – Page indexing
Google Search Console Help – Core Web Vitals
Google Search Console Help – Rich result reports
Google Search Central – Search documentation updates (2026)
Энэхүү баримт бичиг нь Travel Hub Mongolia-ийн хөгжүүлэлтийн багт өгөх minimum technical SEO specification юм. Дараагийн шатанд үүнийг Jira/ClickUp task хэлбэрт задлан, acceptance criteria болон owner/deadline-тай ажлын хүснэгт болгон хувиргаж болно.
# Жишээ entry-ууд: go-live-ийн өмнө устгах

> Үүсгэдэг скрипт: `scripts/contentful/03-sample-entries.ps1`. Огноо: 2026-10-06.

Шинэ Contentful төрөл бүрт 2 жишээ entry байна. Нэр бүр **"[ЖИШЭЭ]"**-ээр эхэлдэг. Тэд preview дээр загварыг харуулахад зориулагдсан. Сайт production дээр "[ЖИШЭЭ]"-ээр эхэлсэн entry-г харуулдаггүй (`lib/localContent.ts`), гэхдээ go-live-ийн өмнө Contentful-аас устгана.

## Устгах арга

Бүгдийг нэг дор устгах:

```
powershell -ExecutionPolicy Bypass -File scripts\contentful\03-sample-entries.ps1 -Remove
```

Эхлээд юу устгахыг харах бол `-Remove -DryRun` гэж ажиллуулна.

Гараар устгах бол Contentful → Content хэсэгт хайлтад `[ЖИШЭЭ]` гэж бичээд entry бүрийг **Unpublish → Delete** хийнэ. Бусад entry-ийн холбоос хадгалсан entry-г эхэлж устгана. Доорх хүснэгтийн дарааллаар доороос дээш устгавал зөв дараалал болно.

## Жагсаалт (12)

| # | Entry ID | Төрөл | Нэр | Slug | Холбоос |
|---|---|---|---|---|---|
| 1 | `sample-provider-herder` | localProvider | [ЖИШЭЭ] Малчин өрх | `sample-herder-family` | — |
| 2 | `sample-provider-guide` | localProvider | [ЖИШЭЭ] Нутгийн хөтөч | `sample-local-guide` | — |
| 3 | `sample-experience-herding` | communityExperience | [ЖИШЭЭ] Малчин айлд нэг өдөр | `sample-day-with-herders` | host → 1 |
| 4 | `sample-experience-felt` | communityExperience | [ЖИШЭЭ] Эсгий хийх | `sample-felt-making` | host → 1 |
| 5 | `sample-product-aaruul` | localProduct | [ЖИШЭЭ] Ааруул | `sample-aaruul` | producer → 1, туршлага → 3 |
| 6 | `sample-product-felt-slippers` | localProduct | [ЖИШЭЭ] Эсгий шаахай | `sample-felt-slippers` | producer → 1, туршлага → 4 |
| 7 | `sample-guidance-khuvsgul` | visitorGuidance | [ЖИШЭЭ] Хөвсгөл нуурын зөвлөмж | — | газар → Хөвсгөл нуур (destination) |
| 8 | `sample-guidance-orkhon` | visitorGuidance | [ЖИШЭЭ] Орхоны хөндийн зөвлөмж | — | газар → Орхоны хөндий (heritagePlace) |
| 9 | `sample-event-eagle` | event | [ЖИШЭЭ] Бүргэдийн баяр | `sample-eagle-festival` | нутгийн үйлчилгээ → 2 |
| 10 | `sample-event-soum-naadam` | event | [ЖИШЭЭ] Сумын наадам | `sample-soum-naadam` | нутгийн үйлчилгээ → 1 |
| 11 | `sample-story-nomadic` | story | [ЖИШЭЭ] Хаваржааны өглөө | `sample-spring-camp-morning` | туршлага → 3 |
| 12 | `sample-story-food` | story | [ЖИШЭЭ] Ааруул хатаах | `sample-drying-aaruul` | бүтээгдэхүүн → 5 |

Жишээ entry-д зураг хавсаргаагүй. Хуудсууд зураггүй үед `lib/images.ts`-ийн шалгагдсан Монгол зургийг харуулна.

## Preview дээр харах хаягууд

Жишээ entry үүссэний дараа:

- `/local`: hub, бүх хэсэг
- `/local/herder-families`, `/local/guides`, `/local/experiences`, `/local/products`: ангиллын жагсаалт
- `/local/sample-herder-family`: профайл
- `/local/experiences/sample-day-with-herders`: туршлага
- `/things-to-do/festivals`, `/recommendation/sample-eagle-festival`: арга хэмжээ
- `/stories`, `/stories/sample-spring-camp-morning`: нийтлэл

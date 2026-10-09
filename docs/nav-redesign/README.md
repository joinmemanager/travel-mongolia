# Дээд цэсний шинэчлэл (feat/nav-megamenu, 2026-10-09)

Зураг бүрийг headless Edge-ээр авсан: компьютер 1440×900 (нэг нь 1200×800), утас 390×844.
`old-*` нь production (travelhubmongolia.com, Rubik фонт), `new-*` нь энэ branch (Nunito Sans).

| Зураг | Юуг харуулна |
|---|---|
| `old-desktop-closed`, `old-desktop-panel`, `old-mobile-closed` | Хуучин цэс, хуучин фонт (Rubik) |
| `new-desktop-hero` | Нүүр хуудас: цэс hero дээр тунгалаг, цагаан бичигтэй, дээд талд бараан gradient |
| `new-desktop-hero-end` | Hero-гийн төгсгөл (H1, «Мөнх хөх тэнгэрийн орон»), цэс тунгалаг хэвээр |
| `new-desktop-panel-on-hero` | Hero дээр самбар нээхэд цэс цагаан болно |
| `new-desktop-panel-explore`, `new-desktop-panel-stories` | Самбар: дэд цэс бүр нэг багана, багтахгүй бол дараагийн мөрөнд |
| `new-desktop-panel-en` | Англи хэл (googtrans=en): «View all», англи нэрс |
| `new-desktop-scrolled` | Hero-гоос доош гүйлгэсний дараа цагаан цэс |
| `new-desktop-closed`, `new-desktop-page-scrolled` | Бусад хуудас: цагаан, наалдсан цэс; хуудасны дэд цэс түүний доор наалдана |
| `new-1200-closed` | 1200px өргөнд 5 хэсэг + icon-ууд нэг мөрөнд |
| `new-mobile-hero`, `new-mobile-scrolled`, `new-mobile-closed` | Утас: hero дээр, гүйлгэсний дараа, бусад хуудас |
| `new-mobile-menu-open`, `new-mobile-menu-plan` | Утасны бүтэн дэлгэцийн цэс, accordion, «Төлөвлөх & захиалах» |
| `font-comparison.png` | Фонтын харьцуулалт (Ө, Ү, ө, ү). Wix Madefor-д Ө/Ү байхгүй (serif-ээр гарна) |

## Фонт

- Сонгосон: **Nunito Sans** (Google Fonts, `next/font`, variable, `cyrillic-ext` subset-тэй, учир нь Ө/Ү тэнд байдаг).
- Хувилбарууд: **Manrope**, **Onest**, **Golos Text**. Гурвуулаа Ө, Ү-г зөв харуулдаг.
- Тохиргоо нэг газар: `travel-mongolia/lib/fonts.ts` (`--font-site` хувьсагч). Худалдаж авсан фонт руу
  шилжихдээ тэр файлд `next/font/local`-оор ижил `--font-site` variable-тэй фонт үүсгэхэд хангалттай.

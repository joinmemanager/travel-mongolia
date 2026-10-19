// Аймгийн хуудасны мэдээллийн туузны статик өгөгдөл (Contentful-ийн center/population/area
// талбар хоосон үед ашиглана). Утга байхгүй (undefined) мөр хуудсанд харагдахгүй.
//
// Эх сурвалж (2026-10-15-нд шалгав):
//  - area (км²), population: Wikipedia «Provinces of Mongolia» хүснэгт — талбай нь «Mongolia Landuse
//    Annual Report 2007», хүн ам нь ҮСХ-ны «2020 Population and Housing Census, table 2.5».
//  - center: мөн хүснэгтийн «Capital» багана (Хэнтийн төв Өндөрхааныг 2013 онд Чингис хот болгосон).
//  - soums: Wikipedia «Districts of Mongolia» (аймаг бүрийн сумын тоо; Баян-Өлгий 13 сум + 1 тосгон).
//  - distanceFromUb (км): touristinfocenter.mn-ийн аймгийн нийтлэл (TIC, 1-р багцаар Contentful-д
//    орсон текст). Нийтлэлд заагаагүй (Дархан-Уул, Сэлэнгэ, Хөвсгөл) болон эргэлзээтэй (Увс: Ховдтой
//    ижил 1425 км гэж бичсэн) утгыг оруулаагүй.
//  - elevation (м, дундаж өндөршил): scripts/maps/aimag-elevation.js — Natural Earth-ийн аймгийн хил
//    доторх ≈250 тэгш торон цэгийн Copernicus DEM GLO-90 өндрийн (Open-Meteo Elevation API) дундаж,
//    10 м-ээр бөөрөнхийлсөн.
//  - coords: аймгийн төвийн ойролцоо координат (цаг агаарт).

import type { ImageKey } from '@/lib/images';

export interface ProvinceFacts {
  name: string;
  // Түр hero зураг (lib/images.ts-ийн шалгагдсан зураг, бүс нутагт нь тохируулсан). Аймгийн өөрийн
  // зураг Contentful-ийн image талбарт (≥1000 px) орвол түүнийг харуулна. Хэрэгтэй зургууд:
  // docs/province-design/photos-needed.md
  hero?: ImageKey;
  center?: string;
  area?: number;
  population?: number;
  distanceFromUb?: number;
  soums?: number;
  elevation?: number;
  coords?: [number, number];
}

export const POPULATION_YEAR = 2020;

export const PROVINCE_FACTS: Record<string, ProvinceFacts> = {
  arkhangai: { name: 'Архангай', hero: 'gerCamp', center: 'Цэцэрлэг', area: 55314, population: 94994, distanceFromUb: 521, soums: 19, elevation: 1990, coords: [47.475, 101.454] },
  'bayan-ulgii': { name: 'Баян-Өлгий', hero: 'eagleHunter', center: 'Өлгий', area: 45705, population: 108530, distanceFromUb: 1636, soums: 13, elevation: 2500, coords: [48.968, 89.962] },
  bayankhongor: { name: 'Баянхонгор', hero: 'camels', center: 'Баянхонгор', area: 115978, population: 88672, distanceFromUb: 630, soums: 20, elevation: 1810, coords: [46.194, 100.718] },
  bulgan: { name: 'Булган', hero: 'herderBoy', center: 'Булган', area: 48733, population: 62089, distanceFromUb: 318, soums: 16, elevation: 1340, coords: [48.812, 103.535] },
  'darkhan-uul': { name: 'Дархан-Уул', hero: 'gerStars', center: 'Дархан', area: 3275, population: 107018, soums: 4, elevation: 950, coords: [49.486, 105.923] },
  dornod: { name: 'Дорнод', hero: 'herderBoy', center: 'Чойбалсан', area: 123597, population: 82054, distanceFromUb: 655, soums: 14, elevation: 800, coords: [48.067, 114.536] },
  dornogov: { name: 'Дорноговь', hero: 'redCliffs', center: 'Сайншанд', area: 109472, population: 71014, distanceFromUb: 463, soums: 14, elevation: 1040, coords: [44.892, 110.14] },
  dundgov: { name: 'Дундговь', hero: 'camels', center: 'Мандалговь', area: 74690, population: 47104, distanceFromUb: 260, soums: 15, elevation: 1300, coords: [45.763, 106.271] },
  'gov-altai': { name: 'Говь-Алтай', hero: 'herdSnow', center: 'Алтай', area: 141448, population: 57748, distanceFromUb: 1001, soums: 18, elevation: 1710, coords: [46.372, 96.258] },
  govsumber: { name: 'Говьсүмбэр', hero: 'gerStars', center: 'Чойр', area: 5542, population: 17928, distanceFromUb: 223, soums: 3, elevation: 1380, coords: [46.361, 108.361] },
  khentii: { name: 'Хэнтий', hero: 'whiteHorse', center: 'Чингис', area: 80325, population: 77957, distanceFromUb: 330, soums: 17, elevation: 1280, coords: [47.32, 110.656] },
  khovd: { name: 'Ховд', hero: 'herdSnow', center: 'Ховд', area: 76060, population: 89712, distanceFromUb: 1425, soums: 17, elevation: 1820, coords: [48.006, 91.641] },
  khuvsgul: { name: 'Хөвсгөл', hero: 'lakeGers', center: 'Мөрөн', area: 100629, population: 135095, soums: 23, elevation: 1850, coords: [49.638, 100.162] },
  orkhon: { name: 'Орхон', hero: 'gerCamp', center: 'Эрдэнэт', area: 844, population: 107634, distanceFromUb: 381, soums: 2, elevation: 1260, coords: [49.028, 104.044] },
  umnugov: { name: 'Өмнөговь', hero: 'redCliffs', center: 'Даланзадгад', area: 165380, population: 69187, distanceFromUb: 553, soums: 15, elevation: 1340, coords: [43.571, 104.425] },
  uvurkhangai: { name: 'Өвөрхангай', hero: 'whiteHorse', center: 'Арвайхээр', area: 62895, population: 116732, distanceFromUb: 430, soums: 19, elevation: 1700, coords: [46.267, 102.775] },
  selenge: { name: 'Сэлэнгэ', hero: 'gerCamp', center: 'Сүхбаатар', area: 41153, population: 110110, soums: 17, elevation: 1040, coords: [50.231, 106.208] },
  sukhbaatar: { name: 'Сүхбаатар', hero: 'herderBoy', center: 'Баруун-Урт', area: 82287, population: 63182, distanceFromUb: 560, soums: 13, elevation: 1080, coords: [46.681, 113.28] },
  tuv: { name: 'Төв', hero: 'chinggisStatue', center: 'Зуунмод', area: 74042, population: 94250, distanceFromUb: 43, soums: 27, elevation: 1440, coords: [47.707, 106.953] },
  uvs: { name: 'Увс', hero: 'lakeGers', center: 'Улаангом', area: 69585, population: 83223, soums: 19, elevation: 1440, coords: [49.981, 92.067] },
  zavkhan: { name: 'Завхан', hero: 'whiteHorse', center: 'Улиастай', area: 82456, population: 72823, distanceFromUb: 984, soums: 24, elevation: 1960, coords: [47.742, 96.844] },
  ulaanbaatar: { name: 'Улаанбаатар', hero: 'chinggisStatue', area: 4704, population: 1539810, elevation: 1540, coords: [47.918, 106.917] },
};

// Аймгийн нэрийн өөр латин бичлэгүүд → сайтын slug. /province/<өөр бичлэг> хаягаар (жишээ нь Google,
// гадаад сайтын холбоос) орж ирвэл 308-аар зөв хаяг руу шилжүүлнэ (app/province/[id]/page.tsx).
const ALIASES: Record<string, string[]> = {
  arkhangai: ['arkhangay', 'arhangai', 'arkhangai-aimag'],
  'bayan-ulgii': ['bayan-olgii', 'bayan-ulgiy', 'bayanulgii', 'bayan-olgiy', 'bayan-ölgii'],
  bayankhongor: ['bayanhongor', 'bayan-khongor'],
  'darkhan-uul': ['darkhan', 'darkhanuul', 'darhan-uul'],
  dornogov: ['dornogovi', 'dornogobi', 'dornogovi-aimag', 'east-gobi'],
  dundgov: ['dundgovi', 'dundgobi', 'middle-gobi'],
  'gov-altai': ['govi-altai', 'gobi-altai', 'govialtai', 'gov-altay', 'govi-altay'],
  govsumber: ['govisumber', 'gobisumber', 'govi-sumber', 'gov-sumber'],
  khentii: ['hentii', 'khentiy', 'khentei'],
  khovd: ['hovd', 'khovd-aimag'],
  khuvsgul: ['khovsgol', 'hovsgol', 'huvsgul', 'khuvsgul-aimag'],
  orkhon: ['erdenet', 'orhon'],
  umnugov: ['umnugovi', 'omnogovi', 'umnugobi', 'omnogobi', 'south-gobi'],
  uvurkhangai: ['ovorkhangai', 'uvurhangai', 'ovorhangai'],
  sukhbaatar: ['suhbaatar', 'sükhbaatar'],
  tuv: ['tov', 'töv', 'tuv-aimag'],
  zavkhan: ['zavhan', 'dzavkhan'],
  ulaanbaatar: ['ub', 'ulan-bator', 'ulaan-baatar'],
};

export const PROVINCE_ALIASES: Record<string, string> = Object.fromEntries(
  Object.entries(ALIASES).flatMap(([slug, names]) => names.map((n) => [n, slug]))
);

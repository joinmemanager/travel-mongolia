// TIC 3, 5, 6-р сэдэв: мөр сонгох, ангилал, аймаг, гарчиг, slug, давхардлын дүрэм (import-batch03-06.js хуваалцана).
//
//   3-р сэдэв  cate2 Дархан цаазат, cate3 Байгалийн нөөц, cate4 Байгалийн цогцолборт, cate5 Байгалийн дурсгалт → place
//   5-р сэдэв  cate10 Ан амьтан (TypeID 1 хөхтөн, 2 сээр нуруугүй, 3 загас, 4 хоёр нутагтан/мөлхөгч),
//              cate11 Шувууд, cate12 Ургамал → species
//   6-р сэдэв  cate17 Музей (TypeID 1), театр/чуулга (2), соёлын төв/номын сан (3), cate8 Рашаан сувилал → place;
//              cate9 Хотын дурсгалт газар → heritagePlace (+ heritageCategory «Хотын дурсгалт газрууд»)
//
// TIC-ийн «Зочид буудал» (cate21) жагсаалт дэлгэрэнгүй рүү cate4_more.aspx?ItemID=<буудлын id> гэж буруу
// холбодог. cate4-ийн мөрүүдийг cate4.aspx жагсаалтаас авсан тул бүгд цогцолборт газар; импорт нь татсан
// хуудасны гарчиг inventory-ийн гарчигтай таарч байгааг шалгана (буудал орж ирвэл зогсоно).

const PROTECTED_CATEGORIES = ['strictly-protected', 'national-park', 'nature-reserve', 'natural-monument'];
const PLACE_CATEGORIES = [...PROTECTED_CATEGORIES, 'museum', 'theatre', 'culture-center', 'sanatorium'];
const SPECIES_GROUPS = ['mammal', 'bird', 'reptile', 'fish', 'invertebrate', 'plant'];

// Ангилал бүрийн нэр (seoTitle-ийн тодотгол, тайлан)
const CATEGORY_LABEL = {
  'strictly-protected': 'Дархан цаазат газар',
  'national-park': 'Байгалийн цогцолборт газар',
  'nature-reserve': 'Байгалийн нөөц газар',
  'natural-monument': 'Байгалийн дурсгалт газар',
  museum: 'Музей',
  theatre: 'Театр, урлагийн чуулга',
  'culture-center': 'Соёлын төв, номын сан',
  sanatorium: 'Рашаан сувилал',
  'city-monument': 'Хотын дурсгалт газар',
  mammal: 'Монголын хөхтөн амьтан',
  invertebrate: 'Монголын шавж, сээр нуруугүй',
  fish: 'Монголын загас',
  reptile: 'Монголын хоёр нутагтан, мөлхөгч',
  bird: 'Монголын шувуу',
  plant: 'Монголын ургамал',
};

// Сайтын хаяг
const PLACE_PATH = {
  'strictly-protected': '/destination/protected',
  'national-park': '/destination/protected',
  'nature-reserve': '/destination/protected',
  'natural-monument': '/destination/protected',
  museum: '/things-to-do/museums',
  theatre: '/things-to-do/museums',
  'culture-center': '/things-to-do/museums',
  sanatorium: '/things-to-do/wellness',
};
const SPECIES_PATH = { mammal: 'wildlife', invertebrate: 'wildlife', fish: 'wildlife', reptile: 'wildlife', bird: 'birds', plant: 'plants' };
const speciesPath = (group, slug, ownPage) =>
  ownPage ? `/about/nature/${SPECIES_PATH[group]}/${slug}` : `/about/nature/${SPECIES_PATH[group]}#${slug}`;

const TOPIC_OF_CATE = { 2: 3, 3: 3, 4: 3, 5: 3, 10: 5, 11: 5, 12: 5, 17: 6, 8: 6, 9: 6 };

function kindOf(row) {
  const c = row['ангилал'];
  const t = row['TypeID'];
  if (c === '2') return { type: 'place', category: 'strictly-protected' };
  if (c === '3') return { type: 'place', category: 'nature-reserve' };
  if (c === '4') return { type: 'place', category: 'national-park' };
  if (c === '5') return { type: 'place', category: 'natural-monument' };
  if (c === '8') return { type: 'place', category: 'sanatorium' };
  if (c === '17') return { type: 'place', category: { 1: 'museum', 2: 'theatre', 3: 'culture-center' }[t] };
  if (c === '9') return { type: 'heritagePlace', category: 'city-monument' };
  if (c === '10') return { type: 'species', category: { 1: 'mammal', 2: 'invertebrate', 3: 'fish', 4: 'reptile' }[t] };
  if (c === '11') return { type: 'species', category: 'bird' };
  if (c === '12') return { type: 'species', category: 'plant' };
  throw new Error(`${row.key}: ангилал тодорхойгүй`);
}

// ---------------------------------------------------------------- аймаг
const AIMAGS = [
  ['Архангай', 'arkhangai'], ['Баян-Өлгий', 'bayan-ulgii'], ['Баянхонгор', 'bayankhongor'], ['Булган', 'bulgan'],
  ['Говь-Алтай', 'gov-altai'], ['Говьсүмбэр', 'govsumber'], ['Дархан-Уул', 'darkhan-uul'], ['Дорноговь', 'dornogov'],
  ['Дорнод', 'dornod'], ['Дундговь', 'dundgov'], ['Завхан', 'zavkhan'], ['Орхон', 'orkhon'], ['Өвөрхангай', 'uvurkhangai'],
  ['Өмнөговь', 'umnugov'], ['Сүхбаатар', 'sukhbaatar'], ['Сэлэнгэ', 'selenge'], ['Төв', 'tuv'], ['Увс', 'uvs'],
  ['Ховд', 'khovd'], ['Хөвсгөл', 'khuvsgul'], ['Хэнтий', 'khentii'], ['Улаанбаатар', 'ulaanbaatar'],
];
const AIMAG_SLUG = Object.fromEntries(AIMAGS);

// Аймгийг гараар тогтоосон мөрүүд (inventory-ийн «аймаг» текстээс автоматаар тодорхойлсон тул алдаатай,
// эсвэл хоосон). Текстийг уншиж шалгасан. null = аймагт хамааруулахгүй (олон аймаг дамнасан).
const AIMAG_OVERRIDE = {
  // 3-р сэдэв
  c2_66: 'Увс', // Алтан элс (Увс нуурын ай сав)
  c2_49: 'Төв', // Богдхан уул (Төв аймаг, Улаанбаатар хотын өмнө)
  c2_52: 'Говь-Алтай', // Говийн их дархан газар (Говь-Алтай, Баянхонгор, Ховд)
  c2_60: 'Хөвсгөл', // Хорьдол Сарьдагийн нуруу
  c4_3: 'Төв', // Горхи-Тэрэлж
  c4_14: 'Архангай', // Хангайн нуруу
  c4_22: 'Баянхонгор', // Их Богд уул
  c4_21: 'Баян-Өлгий', // Цамбагарав уул
  c5_8: 'Говь-Алтай', // Ээж хайрхан
  c5_21: 'Завхан', // Их, Бага Даян хайрхан (Отгонтэнгэрийн баруун талд)
  c5_19: 'Завхан', // Монгол элс (Завхан голын хөндий)
  // 6-р сэдэв
  c8_24: 'Төв', // Мойлтын тохой (Горхи-Тэрэлж)
  c8_36: 'Төв', // Хайрын билэг II (Цонжинболдог)
  c8_49: 'Төв', // Хайрын билэг-1
};

// ---------------------------------------------------------------- гарчиг, slug
// Олон үгтэй нэрийн доторх нэр төрлийн үгс жижиг үсгээр («Отгонтэнгэр уул», «Хар ус нуур»)
const GENERIC = new Set(
  ('уул нуур нуурын гол голын газар газрын нуруу нурууны хөндий хөндийн агуй агуйнууд ай сав рашаан рашааны сувилал ' +
    'халуун хүйтэн амралт тосгон хот хотын музей театр чуулга хамтлаг тоглолт ордон өргөө хөшөө баримал талбай гүүр ' +
    'хийд сүм дацан хаалга төв номын сан ам амны зураг сүг цэцэрлэг цэцэрлэгт хүрээлэн байшин барилга балгас туурь ' +
    'их бага дунд сургууль дэнж дов овоо үйлдвэр байр хороо хороолол хотхон гудамж элс цэнгэлдэх цогцолбор цогцолборын ' +
    'дуу бүжиг бүжгийн эрдмийн улсын хүүхдийн кинотеатр ресорт оргил дурсгал дурсгалд зориулсан цээж ' +
    'нөөц байгалийн монгол монголын үндэсний ёслол хүндэтгэлийн аймгийн түүх угсаатны зүй дүрслэх урлаг урлагийн ' +
    'нэрэмжит анагаах ухааны үнэт ховор ном мэдээллийн шинжлэх ухаан соёлын соёл амралтын хорлол бөөрний элсэн ' +
    'зэрлэг бүхий ба буюу болон тусгай хамгаалалтанд байх арал ус чулуу орчмын нутаг хайрхан хайрханы элсний ' +
    'дархан цаазат тайга нарс тогоо гэрэлт тайжийн').split(/\s+/)
);
const PROPER_ALWAYS = new Set(['монгол', 'монголын', 'улаанбаатар', 'чингис']);

function cleanTitle(raw) {
  return raw
    .replace(/\s*\((?:ДАРХАН ЦААЗАТ ГАЗАР[^)]*|БАЙГАЛИЙН НӨӨЦ ГАЗАР|ТҮҮХ СОЁЛЫН ДУРСГАЛТ ГАЗАР)\)\s*$/i, '')
    .replace(/\s*-\s*ДАРХАН ЦААЗАТ ГАЗАР\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ТОМ үсгийн гарчгийг энгийн бичлэг рүү: эхний үг, зураасны дараах үг, нэр төрлийн бус үгс том үсгээр
function caseTitle(raw) {
  const lower = raw.toLocaleLowerCase('mn');
  let first = true;
  return lower.replace(/[\p{L}]+/gu, (w, i) => {
    const prev = lower.slice(Math.max(0, i - 2), i);
    const afterDash = /-\s?$/.test(prev) || /-$/.test(prev);
    const cap = first || PROPER_ALWAYS.has(w) || (!GENERIC.has(w) && w.length > 1) || afterDash;
    first = false;
    return cap ? w[0].toLocaleUpperCase('mn') + w.slice(1) : w;
  });
}

const TR = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'j', з: 'z', и: 'i', й: 'i', к: 'k', л: 'l', м: 'm',
  н: 'n', о: 'o', ө: 'u', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ү: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh',
  щ: 'sh', ъ: '', ы: 'y', ь: 'i', э: 'e', ю: 'yu', я: 'ya',
};
function slugify(s, max = 60) {
  const lat = s
    .toLowerCase()
    .replace(/(^|[^а-яёөү])е/g, '$1ye')
    .replace(/(^|[^а-яёөү])ё/g, '$1yo')
    .replace(/ё/g, 'e')
    .replace(/[а-яёөү]/g, (c) => TR[c] ?? '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (lat.length <= max) return lat;
  const cut = lat.slice(0, max);
  return cut.slice(0, cut.lastIndexOf('-') > 20 ? cut.lastIndexOf('-') : max).replace(/-+$/, '');
}

// ---------------------------------------------------------------- давхардал
// TIC доторх давхардал: key → үлдэх мөрийн key. Үлдэх мөрийн entry-д урт текстийг нь авна,
// давхардсан мөрийн хуучин хаяг үлдэх entry рүү redirect болно.
const TIC_DUPLICATES = {
  c2_64: 'c2_68', // Улаан тайгын ДЦГ (108 үг) → Улаан тайга - ДЦГ (139)
  c9_13: 'c2_49', // Богд хан уул (хотын дурсгалт газар, 553) → Богдхан уул (дархан цаазат)
  c9_36: 'c17_57', // Соёлын төв өргөө
  c9_38: 'c17_58', // Спортын төв ордон
  c17_59: 'c9_97', // Төв цэнгэлдэх хүрээлэн
  c17_69: 'c17_70', // Монгол туургатан - театр
  c9_49: 'c17_48', // Улсын цирк
  c9_28: 'c17_49', // Монгол бөхийн өргөө
  c9_55: 'c17_51', // Хүүхдийн ордон
  c9_31: 'c17_61', // Үндэсний номын сан
  c17_73: 'c17_74', // Халх гол - Ялалт музей → Ялалт музей
  c10_9: 'c10_54', // Хүдэр → Баданга хүдэр (Moschus moschiferus)
  c10_61: 'c10_94', // Цөөвөр чоно → Шарнад цөөвөр (Cuon alpinus)
  c10_84: 'c10_13', // Ирвэс → Цоохор ирвэс (Uncia uncia)
};

// Travel Hub-д аль хэдийн байгаа entry (шинээр үүсгэхгүй, TIC текстийг нэмнэ)
const EXISTING = {
  c4_3: { type: 'destination', id: '6tDLtOe6nWOzZDT0sdGMd', path: '/destination/terelj' },
  c4_18: { type: 'destination', id: '5gHuNvalGv5MYMexAUrWEX', path: '/destination/khuvsgul-nuur' },
  c2_63: { type: 'heritagePlace', id: '4Nd4SuwgpInDup4z0QKs4g', path: '/destination/heritage/place/burkhan-khaldun' },
  c4_9: { type: 'heritagePlace', id: '3t2W7uicg4pU7wXuhVuE4M', path: '/destination/heritage/place/orkhony-khundii' },
  c9_20: { type: 'destination', id: '4E7saPDvAwtwwnw0GFpQSg', path: '/destination/sukhbaataryn-talbai' },
};

// Хуудас үүсгэхгүй мөр → redirect хаяг (c8_47 «Шинэ нэмэлт газрууд»: хувийн байгууллагуудын утас, хаягийн жагсаалт)
const SKIP = { c8_47: '/things-to-do/wellness#sanatorium' };

const CATES = ['2', '3', '4', '5', '10', '11', '12', '17', '8', '9'];
const batchRows = (rows, cates = CATES) => rows.filter((r) => cates.includes(r['ангилал']));

module.exports = {
  PROTECTED_CATEGORIES, PLACE_CATEGORIES, SPECIES_GROUPS, CATEGORY_LABEL, PLACE_PATH, SPECIES_PATH, speciesPath,
  TOPIC_OF_CATE, kindOf, AIMAGS, AIMAG_SLUG, AIMAG_OVERRIDE, cleanTitle, caseTitle, slugify, TIC_DUPLICATES, EXISTING,
  CATES, batchRows, SKIP,
};

// Амьтан, ургамлын нэр: өгүүлбэрийн бичлэг («Алаг хайргач»), газар нутгийн нэр том үсгээр («Монгол бөхөн»)
const SPECIES_PROPER = /^(монгол|алтай|сибир|дагуур|дорнод|говь|говийн|хөвсгөл|европ|ази|байгал|зүүнгар|сэлэнг|хангай|хэнтий|амур|увс|ховд|гималай|химала|памир|тянь|кавказ|далай|пржевальск|штуббендорф|эверсманн|модестус|спорадикус|фэб|аполлон|махаон|карин)/;
function speciesCase(raw) {
  const lower = raw.toLocaleLowerCase('mn');
  let first = true;
  return lower.replace(/[\p{L}]+/gu, (w) => {
    const cap = first || SPECIES_PROPER.test(w);
    first = false;
    return cap ? w[0].toLocaleUpperCase('mn') + w.slice(1) : w;
  });
}
module.exports.speciesCase = speciesCase;

// 6-р сэдвийн байгууллага, барилга, хөшөөний нэр: өгүүлбэрийн бичлэг, оноосон нэр (хүн, газар) том үсгээр
const INSTITUTION_PROPER = new RegExp(
  '^(' +
    [
      'монгол', 'улаанбаатар', 'чингис', 'богд', 'сүхбаатар', 'занабазар', 'данзанравжаа', 'чойжин',
      'лхагвасүрэн', 'батмөнх', 'цэдэнбал', 'нансалмаа', 'цэрэндорж', 'нацагдорж', 'чойбалсан', 'жуков', 'щетинкин',
      'шастин', 'коперник', 'ленин', 'ханддорж', 'автай', 'сайн', 'элдэв', 'очир', 'европ', 'герман', 'орос', 'япон',
      'вьетнам', 'турк', 'американ', 'зайсан', 'баянзүрх', 'сонгинохайрхан', 'сонгин', 'чингэлтэй', 'туул',
      'гандантэгчэнлин', 'дамбадаржайлин', 'дулмаалин', 'дашчойлин', 'мамба', 'бакула', 'ренбүчи', 'бэтүб', 'гэсэр',
      'дарь', 'хархорум', 'цайдам', 'архангай', 'дундговь', 'хэнтий', 'баянхонгор', 'дорнод', 'халх', 'ялалт',
      'алунгоо', 'андимэн', 'амгалан', 'маймаа', 'амгаланбаатар', 'хангарьд', 'бадарчн', 'гачуурт', 'гоожин',
      'нүхт', 'төрхурах', 'тасган', 'салхит', 'буянт', 'шарга', 'тэнгис',
      'түмэн', 'жонон', 'алтай', 'торгон', 'аса', 'асем', 'вива', 'сити', 'скай', 'зайсан', 'жамбын', 'юмжаа',
      'юндэн', 'маршал', 'жанжин', 'мандухай', 'хүрэн', 'шар', 'цагаан', 'аварга', 'тосон', 'жанчивлан', 'галт',
      'салбарт', 'гурваннуур', 'задгай', 'зарт', 'могойт', 'мойлт', 'тохой', 'нар', 'онон', 'отгонтэнгэр',
      'өхэг', 'өөш', 'манхан', 'сувд', 'улаан', 'хайрын', 'билэг', 'хасу', 'шивэрт', 'хужирт', 'шаргалжуут',
      'шимт', 'бигэр', 'эмшуис', 'багануур', 'баянзүрх', 'дорноговь', 'ховд',
    ].join('|') +
    ')'
);
function institutionCase(raw) {
  const lower = raw.toLocaleLowerCase('mn');
  let first = true;
  return lower.replace(/[\p{L}]+/gu, (w, i) => {
    const afterDash = /-\s?$/.test(lower.slice(Math.max(0, i - 2), i)) && !/\s-\s?$/.test(lower.slice(Math.max(0, i - 3), i));
    const cap = first || afterDash || INSTITUTION_PROPER.test(w);
    first = false;
    return cap ? w[0].toLocaleUpperCase('mn') + w.slice(1) : w;
  });
}
module.exports.institutionCase = institutionCase;

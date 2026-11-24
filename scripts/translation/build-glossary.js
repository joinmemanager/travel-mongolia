// docs/translation/glossary.csv-ийг үүсгэнэ: гараар сонгосон нэр томъёо (доорх CURATED) + аймаг, сум, дүүргийн
// нэр (локал Contentful экспортоос; англи нэр = сайтын URL-ын slug, ингэснээр нэр, хаяг хоёр таарна).
// Contentful руу хүсэлт илгээхгүй.   node scripts/translation/build-glossary.js
'use strict';
const fs = require('fs');
const path = require('path');
const { loadExport, ROOT } = require('../payload/lib/export');

// [монгол, англи, төрөл, тэмдэглэл]
const CURATED = [
  // --- Засаг захиргаа
  ['аймаг', 'province', 'засаг захиргаа', 'Эхний удаа: "Khentii Province (aimag)", дараа нь "province". Нэрний хамт: "Khentii Province".'],
  ['сум', 'soum', 'засаг захиргаа', 'Жижиг үсгээр: "Dadal soum", олон тоо "soums". "sum", "district/county" гэж бичихгүй.'],
  ['баг', 'bag', 'засаг захиргаа', 'Эхний удаа: "bag (the smallest administrative unit)".'],
  ['дүүрэг', 'district', 'засаг захиргаа', 'Улаанбаатарын: "Khan-Uul District".'],
  ['сумын төв', 'soum center', 'засаг захиргаа', ''],
  ['аймгийн төв', 'provincial center', 'засаг захиргаа', ''],
  ['нийслэл', 'the capital', 'засаг захиргаа', ''],
  ['Монгол Улс', 'Mongolia', 'газар', '"Mongolian State" биш.'],
  ['Улаанбаатар', 'Ulaanbaatar', 'газар', '"Ulan Bator" биш.'],
  ['ОХУ', 'Russia', 'газар', ''],
  ['БНХАУ', 'China', 'газар', ''],
  ['Өвөр Монгол', 'Inner Mongolia', 'газар', ''],
  // --- Нүүдлийн соёл
  ['гэр', 'ger', 'соёл', '"yurt" биш. SEO description-д нэг удаа "ger (yurt)" гэж болно.'],
  ['овоо', 'ovoo', 'соёл', 'Эхний удаа: "ovoo (sacred stone cairn)".'],
  ['наадам', 'Naadam', 'соёл', 'Том үсгээр. "Naadam Festival".'],
  ['эрийн гурван наадам', 'the Three Manly Games', 'соёл', 'wrestling, horse racing, archery'],
  ['бөх', 'wrestling', 'соёл', 'Бөх (хүн) = "wrestler". Монгол бөх = "Mongolian wrestling (bökh)" эхний удаа.'],
  ['морин уралдаан', 'horse racing', 'соёл', ''],
  ['сур харваа', 'archery', 'соёл', ''],
  ['шагай', 'shagai (anklebone games)', 'соёл', ''],
  ['морин хуур', 'morin khuur (horsehead fiddle)', 'соёл', 'Эхний удаа хаалтын тайлбартай.'],
  ['хөөмий', 'khoomei (throat singing)', 'соёл', ''],
  ['уртын дуу', 'urtiin duu (long song)', 'соёл', ''],
  ['дээл', 'deel', 'соёл', 'Эхний удаа: "deel (traditional robe)".'],
  ['айраг', 'airag', 'хоол', 'Эхний удаа: "airag (fermented mare\'s milk)".'],
  ['бууз', 'buuz', 'хоол', 'Эхний удаа: "buuz (steamed dumplings)".'],
  ['хуушуур', 'khuushuur', 'хоол', 'Эхний удаа: "khuushuur (fried meat pastries)".'],
  ['аарц', 'aarts (dried curd drink)', 'хоол', ''],
  ['ааруул', 'aaruul (dried curds)', 'хоол', ''],
  ['боодог', 'boodog', 'хоол', 'Эхний удаа: "boodog (meat cooked with hot stones inside the skin)".'],
  ['хорхог', 'khorkhog', 'хоол', 'Эхний удаа: "khorkhog (meat cooked with hot stones)".'],
  ['Цагаан сар', 'Tsagaan Sar (Lunar New Year)', 'соёл', ''],
  ['малчин', 'herder', 'соёл', '"shepherd" биш.'],
  ['малчин айл', 'herder family', 'соёл', ''],
  ['нүүдэлчин', 'nomad', 'соёл', 'Тэмдэг нэр: "nomadic".'],
  ['таван хошуу мал', 'the five types of livestock', 'соёл', 'horses, camels, cattle (incl. yaks), sheep, goats'],
  ['хийморь', 'khiimori', 'соёл', 'Эхний удаа: "khiimori (a person\'s vital energy and good fortune)", дараа нь зөвхөн "khiimori". "wind horse" гэж орчуулахгүй.'],
  ['хадаг', 'khadag (ceremonial silk scarf)', 'соёл', ''],
  ['тахилга', 'worship ceremony', 'соёл', 'Овооны тахилга = "ovoo worship ceremony".'],
  ['бүргэдчин', 'eagle hunter', 'соёл', ''],
  ['цаатан', 'Tsaatan (Dukha) reindeer herders', 'ард түмэн', ''],
  ['халх', 'Khalkha', 'ард түмэн', ''],
  ['казах', 'Kazakh', 'ард түмэн', ''],
  ['буриад', 'Buryat', 'ард түмэн', ''],
  ['дархад', 'Darkhad', 'ард түмэн', ''],
  ['урианхай', 'Uriankhai', 'ард түмэн', ''],
  ['ойрад', 'Oirat', 'ард түмэн', ''],
  ['дөрвөд', 'Durvud', 'ард түмэн', ''],
  ['ястан', 'ethnic group', 'ард түмэн', '"tribe" биш.'],
  // --- Шашин
  ['сүм', 'temple', 'шашин', ''],
  ['хийд', 'monastery', 'шашин', 'Нэрний хамт: "Amarbayasgalant Monastery".'],
  ['дацан', 'datsan (monastic college)', 'шашин', ''],
  ['лам', 'lama', 'шашин', ''],
  ['бөө', 'shaman', 'шашин', ''],
  ['бөө мөргөл', 'shamanism', 'шашин', ''],
  ['буддын шашин', 'Buddhism', 'шашин', ''],
  ['Хөх тэнгэр', 'the Eternal Blue Sky', 'шашин', ''],
  ['Занабазар', 'Zanabazar', 'түүх', ''],
  ['Өндөр гэгээн', 'Undur Gegeen', 'түүх', ''],
  ['Богд хаан', 'Bogd Khan', 'түүх', ''],
  // --- Түүх
  ['Чингис хаан', 'Chinggis Khaan', 'түүх', 'Эхний удаа: "Chinggis Khaan (Genghis Khan)", дараа нь "Chinggis Khaan".'],
  ['Их Монгол Улс', 'the Great Mongol State', 'түүх', ''],
  ['Монголын эзэнт гүрэн', 'the Mongol Empire', 'түүх', ''],
  ['Хүннү', 'Xiongnu', 'түүх', 'Эхний удаа: "Xiongnu (Hunnu)".'],
  ['Түрэг', 'Turkic', 'түүх', 'Түрэгийн хаант улс = "the Turkic Khaganate".'],
  ['Уйгур', 'Uighur', 'түүх', ''],
  ['Сяньби', 'Xianbei', 'түүх', ''],
  ['Нирун', 'Rouran', 'түүх', ''],
  ['Хятан', 'Khitan', 'түүх', ''],
  ['Манж', 'Manchu (Qing)', 'түүх', 'Манжийн дарлал = "Qing rule".'],
  ['хиргисүүр', 'khirigsuur (burial mound)', 'дурсгал', ''],
  ['буган хөшөө', 'deer stone', 'дурсгал', ''],
  ['хүн чулуу', 'stone figure', 'дурсгал', '"stone man" биш.'],
  ['хадны зураг', 'rock painting', 'дурсгал', ''],
  ['хадны сийлбэр', 'petroglyph', 'дурсгал', ''],
  ['бичээс', 'inscription', 'дурсгал', ''],
  ['дурсгал', 'monument', 'дурсгал', 'Түүх соёлын дурсгалт газар = "historical and cultural site".'],
  ['хэрэм', 'fortress wall', 'дурсгал', ''],
  ['хөшөө', 'statue', 'дурсгал', 'Дурсгалын хөшөө = "memorial".'],
  ['музей', 'museum', 'дурсгал', ''],
  // --- Байгаль
  ['нуур', 'Lake', 'байгаль', 'Нэрний ард: "Khuvsgul Lake" (монгол дарааллаар), "Lake Khuvsgul" биш.'],
  ['гол', 'River', 'байгаль', '"Onon River".'],
  ['уул', 'Mountain', 'байгаль', '"Burkhan Khaldun Mountain".'],
  ['нуруу', 'Range', 'байгаль', '"Khangai Range".'],
  ['хайрхан', 'Khairkhan', 'байгаль', 'Нэрийн нэг хэсэг: "Ikh Bogd Khairkhan". Тайлбарт: "sacred mountain".'],
  ['оргил', 'peak', 'байгаль', ''],
  ['хөндий', 'Valley', 'байгаль', '"Orkhon Valley".'],
  ['тал', 'steppe', 'байгаль', '"plain" биш, хээр тал = "steppe".'],
  ['хээр', 'steppe', 'байгаль', ''],
  ['говь', 'Gobi', 'байгаль', 'Цөлийн бүс = "the Gobi". Аймгийн нэрэнд "govi" (Umnugovi).'],
  ['цөл', 'desert', 'байгаль', ''],
  ['элсэн манхан', 'sand dunes', 'байгаль', 'Хонгорын элс = "Khongor Sand Dunes".'],
  ['тайга', 'taiga', 'байгаль', ''],
  ['ой', 'forest', 'байгаль', ''],
  ['рашаан', 'mineral spring', 'байгаль', 'Халуун рашаан = "hot spring".'],
  ['халуун рашаан', 'hot spring', 'байгаль', ''],
  ['сувилал', 'sanatorium', 'байгаль', 'Рашаан сувилал = "spa sanatorium".'],
  ['булаг', 'spring', 'байгаль', ''],
  ['хүрхрээ', 'waterfall', 'байгаль', ''],
  ['агуй', 'cave', 'байгаль', ''],
  ['галт уул', 'volcano', 'байгаль', ''],
  ['мөнх цас', 'glacier', 'байгаль', ''],
  ['бэлчээр', 'pasture', 'байгаль', ''],
  ['тусгай хамгаалалттай газар', 'protected area', 'хамгаалалт', ''],
  ['дархан цаазат газар', 'strictly protected area', 'хамгаалалт', 'Нэрний хамт: "Khan Khentii Strictly Protected Area".'],
  ['байгалийн цогцолборт газар', 'national park', 'хамгаалалт', 'Нэрний хамт: "Gorkhi-Terelj National Park".'],
  ['байгалийн нөөц газар', 'nature reserve', 'хамгаалалт', ''],
  ['байгалийн дурсгалт газар', 'natural monument', 'хамгаалалт', ''],
  ['Дэлхийн өв', 'UNESCO World Heritage Site', 'хамгаалалт', ''],
  ['тахь', 'Przewalski\'s horse (takhi)', 'амьтан', ''],
  ['хулан', 'Mongolian wild ass (khulan)', 'амьтан', ''],
  ['цагаан зээр', 'Mongolian gazelle', 'амьтан', ''],
  ['хар сүүлт', 'goitered gazelle', 'амьтан', ''],
  ['аргаль', 'argali', 'амьтан', ''],
  ['янгир', 'Siberian ibex', 'амьтан', ''],
  ['ирвэс', 'snow leopard', 'амьтан', ''],
  ['хавтгай', 'wild Bactrian camel', 'амьтан', ''],
  ['мазаалай', 'Gobi bear (mazaalai)', 'амьтан', ''],
  ['бүргэд', 'golden eagle', 'амьтан', ''],
  ['тарвага', 'marmot', 'амьтан', ''],
  ['хандгай', 'moose', 'амьтан', ''],
  ['цаа буга', 'reindeer', 'амьтан', ''],
  ['сарлаг', 'yak', 'амьтан', ''],
  ['тэмээ', 'camel', 'амьтан', 'Хоёр бөхт = "Bactrian camel".'],
  ['тул загас', 'taimen', 'амьтан', ''],
  // --- Нэртэй газрууд
  ['Хөвсгөл нуур', 'Khuvsgul Lake', 'газар', ''],
  ['Тэрэлж', 'Terelj', 'газар', ''],
  ['Горхи-Тэрэлж', 'Gorkhi-Terelj National Park', 'газар', ''],
  ['Орхоны хөндий', 'Orkhon Valley', 'газар', 'UNESCO: "Orkhon Valley Cultural Landscape".'],
  ['Хархорум', 'Kharkhorum', 'газар', 'Эхний удаа: "Kharkhorum (Karakorum)".'],
  ['Эрдэнэ Зуу', 'Erdene Zuu Monastery', 'газар', ''],
  ['Хустай', 'Khustai National Park', 'газар', ''],
  ['Хонгорын элс', 'Khongor Sand Dunes', 'газар', ''],
  ['Ёлын ам', 'Yolyn Am', 'газар', ''],
  ['Баянзаг', 'Bayanzag (Flaming Cliffs)', 'газар', ''],
  ['Тэрхийн цагаан нуур', 'Terkhiin Tsagaan Lake', 'газар', ''],
  ['Хорго', 'Khorgo', 'газар', 'Хорго уул = "Khorgo volcano".'],
  ['Увс нуур', 'Uvs Lake', 'газар', ''],
  ['Хар ус нуур', 'Khar Us Lake', 'газар', ''],
  ['Өгий нуур', 'Ugii Lake', 'газар', ''],
  ['Алтай Таван Богд', 'Altai Tavan Bogd National Park', 'газар', ''],
  ['Бурхан Халдун', 'Burkhan Khaldun Mountain', 'газар', ''],
  ['Отгонтэнгэр', 'Otgontenger Mountain', 'газар', ''],
  ['Хөгнө Хан', 'Khugnu Khan Mountain', 'газар', ''],
  ['Хан Хэнтий', 'Khan Khentii Strictly Protected Area', 'газар', ''],
  ['Говь Гурван Сайхан', 'Gobi Gurvan Saikhan National Park', 'газар', ''],
  ['Говийн их дархан газар', 'Great Gobi Strictly Protected Area', 'газар', ''],
  ['Онон', 'Onon River', 'газар', ''],
  ['Хэрлэн', 'Kherlen River', 'газар', ''],
  ['Туул', 'Tuul River', 'газар', ''],
  ['Орхон гол', 'Orkhon River', 'газар', ''],
  ['Сэлэнгэ мөрөн', 'Selenge River', 'газар', ''],
  ['Завхан гол', 'Zavkhan River', 'газар', ''],
  ['Амарбаясгалант хийд', 'Amarbayasgalant Monastery', 'газар', ''],
  ['Гандантэгчэнлин хийд', 'Gandantegchinlen Monastery', 'газар', 'Товчоор "Gandan Monastery".'],
  ['Хамарын хийд', 'Khamar Monastery', 'газар', ''],
  ['Сүхбаатарын талбай', 'Sukhbaatar Square', 'газар', ''],
  ['Чингис хааны морьт хөшөө', 'Chinggis Khaan Equestrian Statue', 'газар', 'Цонжин Болдог'],
  ['Хангай', 'Khangai', 'газар', 'Хангайн нуруу = "Khangai Range".'],
  ['Алтай', 'Altai', 'газар', 'Монгол Алтайн нуруу = "Mongolian Altai Range".'],
  ['Хэнтийн нуруу', 'Khentii Range', 'газар', ''],
  ['Дорнод тал', 'the Eastern Steppe', 'газар', ''],
  // --- Пилот орчуулгаас нэмсэн (2026-11-13)
  ['Монголын нууц товчоо', 'The Secret History of the Mongols', 'түүх', 'Ишлэлд хашилтгүй, налуугүй: "The Secret History of the Mongols".'],
  ['Алтан товч', 'Altan Tobchi', 'түүх', 'Эхний удаа: "Altan Tobchi (the Golden Summary)".'],
  ['Тэмүжин', 'Temujin', 'түүх', 'Чингис хааны багын нэр.'],
  ['Өүлэн эх', 'Mother Hoelun', 'түүх', ''],
  ['Алунгоо', 'Alan Gua', 'түүх', ''],
  ['Добу мэргэн', 'Dobun Mergen', 'түүх', ''],
  ['Боданчир', 'Bodonchar', 'түүх', ''],
  ['Ван хан', 'Wang Khan', 'түүх', 'Хэрэйдийн Ван хан Тоорил = "Toghrul Wang Khan of the Kereit".'],
  ['Хэрэйд', 'Kereit', 'түүх', ''],
  ['Мэргид', 'Merkit', 'түүх', ''],
  ['БНМАУ', "Mongolian People's Republic", 'түүх', '1924–1992 оны улсын нэр.'],
  ['Улсын Их Хурал', 'State Great Khural', 'засаг захиргаа', 'Монгол Улсын парламент.'],
  ['хошуу', 'banner (khoshuu)', 'түүх', 'Манж, Богд хаант үеийн засаг захиргааны нэгж.'],
  ['хороо', 'khoroo (sub-district)', 'засаг захиргаа', 'Улаанбаатарын дүүргийн дэд нэгж.'],
  ['нэгдэл', 'cooperative', 'түүх', 'Социализмын үеийн малчдын нэгдэл = "herders\' cooperative (negdel)".'],
  ['сангийн аж ахуй', 'state farm', 'түүх', ''],
  ['отор', 'otor (seasonal long-distance grazing)', 'соёл', ''],
  ['зуд', 'dzud', 'байгаль', 'Эхний удаа: "dzud (a harsh winter that kills livestock)".'],
  ['хярс', 'corsac fox', 'амьтан', '"steppe polecat" биш (энэ нь өмхий хүрэн).'],
  ['мануул', "Pallas's cat", 'амьтан', ''],
  ['өмхий хүрэн', 'steppe polecat', 'амьтан', ''],
  ['ятуу', 'Daurian partridge', 'амьтан', ''],
  ['ууль', 'capercaillie', 'амьтан', ''],
  ['сойр', 'black grouse', 'амьтан', ''],
  ['цэн тогоруу', 'white-naped crane', 'амьтан', ''],
  ['буга', 'red deer', 'амьтан', ''],
  ['бор гөрөөс', 'roe deer', 'амьтан', ''],
  ['чандага', 'mountain hare', 'амьтан', ''],
  ['чацаргана', 'sea buckthorn', 'ургамал', ''],
  ['мойл', 'Asian bird cherry', 'ургамал', ''],
  ['хялгана', 'feather grass', 'ургамал', ''],
  ['заг', 'saxaul', 'ургамал', ''],
  // --- Аялал, хэмжээ
  ['жуулчны бааз', 'tourist ger camp', 'аялал', 'Гэргүй бол "tourist camp".'],
  ['зочид буудал', 'hotel', 'аялал', ''],
  ['аялал жуулчлал', 'tourism', 'аялал', ''],
  ['аялагч', 'traveler', 'аялал', 'Америк англи бичлэг.'],
  ['жуулчин', 'visitor', 'аялал', '"tourist" зөвхөн "tourist ger camp" г.м.'],
  ['хүн ам', 'population', 'тоо баримт', ''],
  ['нутаг дэвсгэр', 'area', 'тоо баримт', '"territory" биш, тоотой: "an area of 4,200 km²".'],
  ['далайн түвшнээс дээш', 'above sea level', 'тоо баримт', '"1,200 m above sea level".'],
  ['хавтгай дөрвөлжин километр', 'km²', 'тоо баримт', 'Тоо: "4,200 km²" (мянгатыг таслалаар).'],
  ['төгрөг', 'MNT', 'тоо баримт', '"₮" → "MNT 50,000".'],
];

const ex = loadExport();
const rows = [['mn', 'en', 'төрөл', 'тэмдэглэл']];
const seen = new Set();
const add = (r) => {
  const k = r[0].toLowerCase();
  if (seen.has(k)) return;
  seen.add(k);
  rows.push(r);
};
CURATED.forEach(add);

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const PROVINCE_EN = {
  'gov-altai': 'Govi-Altai',
  govsumber: 'Govisumber',
  dornogov: 'Dornogovi',
  dundgov: 'Dundgovi',
  umnugov: 'Umnugovi',
};
const provinces = ex.entries.filter((e) => e.sys.contentType.sys.id === 'province');
const provById = new Map();
for (const p of provinces) {
  const slug = p.fields.slug.mn;
  const mn = p.fields.title.mn.replace(/ аймаг$/, '');
  const en = PROVINCE_EN[slug] || slug.split('-').map(cap).join('-');
  provById.set(p.sys.id, { mn, en, slug });
  add([mn, slug === 'ulaanbaatar' ? 'Ulaanbaatar' : en, slug === 'ulaanbaatar' ? 'нийслэл' : 'аймаг', slug === 'ulaanbaatar' ? '' : `"${en} Province". URL: /province/${slug}`]);
}

const soums = ex.entries.filter((e) => e.sys.contentType.sys.id === 'soum').sort((a, b) => a.fields.title.mn.localeCompare(b.fields.title.mn, 'mn'));
const dup = {};
for (const s of soums) dup[s.fields.title.mn] = (dup[s.fields.title.mn] || 0) + 1;
for (const s of soums) {
  const title = s.fields.title.mn;
  const district = / дүүрэг$/.test(title);
  const mn = title.replace(/ (сум|дүүрэг)$/, '');
  const p = provById.get(s.fields.province?.mn?.sys?.id);
  const en = s.fields.slug.mn.split('-').map(cap).join(mn.includes('-') ? '-' : ' ');
  const where = p ? `${p.en}` : '';
  const key = dup[title] > 1 ? `${mn} (${p?.mn || ''})` : mn;
  add([key, en, district ? 'дүүрэг' : 'сум', `${district ? `"${en} District"` : `"${en} soum"`}${where ? `, ${where}` : ''}. URL: /province/${p?.slug || '?'}/${s.fields.slug.mn}`]);
}

const csvCell = (v) => (/[",\n]/.test(v) ? `"${String(v).replace(/"/g, '""')}"` : v);
const out = path.join(ROOT, 'docs', 'translation', 'glossary.csv');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, '﻿' + rows.map((r) => r.map(csvCell).join(',')).join('\n') + '\n');
const byType = rows.slice(1).reduce((o, r) => ((o[r[2]] = (o[r[2]] || 0) + 1), o), {});
console.log(`${path.relative(ROOT, out)}: ${rows.length - 1} мөр`, byType);

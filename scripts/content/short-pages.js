// Богино (80 үгээс доош) тул noindex эсвэл sitemap-ээс хасагдсан хуудсуудын төлөвлөгөө → docs/plan/short-pages-plan.csv
// Snapshot-аас уншина, контентод хүрэхгүй.
//   node scripts/content/short-pages.js
const path = require('path');
const lib = require('./_lib');
const { writeCsv } = require('../tic/_csv');

const OUT = path.join(lib.ROOT, 'docs', 'plan', 'short-pages-plan.csv');
const entries = lib.load('entries.json');
const byId = new Map(entries.map((e) => [e.sys.id, e]));
const PROTECTED = ['strictly-protected', 'national-park', 'nature-reserve', 'natural-monument'];
const NOINDEX_PLACE = ['landscape', ...PROTECTED];

const isTicAcc = (e) => lib.fv(e, 'providerType') === 'accommodation' && /touristinfocenter/.test(String(lib.fv(e, 'sourceUrl') || ''));

function kind(e) {
  const ct = e.sys.contentType.sys.id;
  const f = (k) => lib.fv(e, k);
  if (ct === 'heritagePlace') return f('protectedCategory') ? 'Хамгаалалттай газар (өвийн газар)' : 'Өвийн / түүхийн дурсгалт газар';
  if (ct === 'place') return { landscape: 'Байгалийн үзэсгэлэнт газар', museum: 'Музей', theatre: 'Театр', 'culture-center': 'Соёлын төв', sanatorium: 'Рашаан сувилал' }[f('category')] || 'Хамгаалалттай газар';
  if (ct === 'localProvider') return /бааз|camp/i.test(lib.titleOf(e) + ' ' + (f('services') || []).join(' ')) ? 'Жуулчны бааз' : 'Буудал, бааз';
  if (ct === 'story') return 'Мэдээний архив';
  if (ct === 'cultureArticle') return 'Соёлын нийтлэл';
  if (ct === 'species') return 'Амьтан, ургамал';
  if (ct === 'soum') return 'Сум';
  return ct;
}

function thinInfo(e) {
  const ct = e.sys.contentType.sys.id;
  const f = (k) => lib.fv(e, k);
  const field = lib.THIN_FIELD[ct];
  if (!field) return null;
  if (ct === 'species' && f('ownPage') !== true) return null;
  if (ct === 'soum' && f('ownPage') !== true) return null;
  if (ct === 'localProvider' && !isTicAcc(e)) return null;
  if (ct === 'story' && f('topic') !== 'news') return null;
  if (ct === 'place' && !lib.PLACE_BASE[f('category')]) return null;
  const text = lib.plain(f(field));
  const w = lib.words(text);
  if (w >= 80) return null;
  const pageNoindex = ['heritagePlace', 'localProvider', 'story'].includes(ct) || (ct === 'place' && NOINDEX_PLACE.includes(f('category')));
  return { w, text, state: pageNoindex ? 'noindex' : 'index, sitemap-гүй' };
}

// Юу дутуу байгааг текстээс таамаглаж санал болгоно
function suggest(e, text, w) {
  const ct = e.sys.contentType.sys.id;
  const f = (k) => lib.fv(e, k);
  const has = (re) => re.test(text);
  const need = 80 - w;
  const out = [];
  if (ct === 'localProvider') {
    if (!f('contact') && !(f('phones') || []).length) out.push('утас, цахим хаяг');
    if (!(f('services') || []).length && !has(/өрөө|ор|гэр|ресторан|шүршүүр|wifi/i)) out.push('өрөө/гэрийн тоо, үйлчилгээ (хоол, шүршүүр, Wi-Fi)');
    if (!f('priceFrom')) out.push('үнийн түвшин');
    if (!has(/км|зам|төвөөс|хотоос/)) out.push('байршил ба хэрхэн очих (ойрын төвөөс хэдэн км)');
    out.push('ойролцоох үзэх газрууд, ажилладаг улирал');
    if (!(f('photos') || []).length) out.push('өөрийн зураг');
  } else if (ct === 'story') {
    out.push('мэдээний огноо, үйл явдлын нөхцөл');
    if (!has(/аймаг|сум|нуур|уул/)) out.push('холбогдох газар (аймаг, сум) ба түүний хуудасны холбоос');
    out.push('аялагчид ач холбогдол (одоо очиж үзэх боломжтой эсэх)');
  } else if (ct === 'heritagePlace' || ct === 'place') {
    if (!has(/аймгийн|сумын|сумаас|км/)) out.push('байршил: аймаг, сум, төвөөс хэдэн км');
    if (!has(/он|зуун|үе|эрин/) && ct === 'heritagePlace') out.push('түүх: хэзээ, хэн байгуулсан');
    if (!has(/хүрэх|очих|зам|машин/)) out.push('хэрхэн очих (замын нөхцөл)');
    if (!has(/зун|өвөл|хавар|намар|сар/)) out.push('очих тохиромжтой улирал');
    out.push(ct === 'place' && f('category') === 'sanatorium' ? 'рашааны төрөл, эмчилгээний чиглэл, ажиллах хугацаа' : ct === 'place' && /museum|theatre|culture-center/.test(f('category')) ? 'ажиллах цаг, үзмэр/тоглолт, тасалбар' : 'юугаараа онцлог, юу үзэх вэ');
    out.push('ойролцоох газрууд руу холбоос');
    if (!f('image')) out.push('зураг');
  } else if (ct === 'cultureArticle') {
    out.push('утга учир, түүх', 'хаана, хэзээ үзэж болох', 'холбогдох нийтлэл рүү холбоос');
  } else if (ct === 'species') {
    out.push('тархац (аль аймагт), амьдрах орчин', 'хамгааллын статус', 'хаана харж болох');
  }
  return `80 үгт хүрэхэд дор хаяж ${need} үг нэмэх. Нэмэх зүйл: ${out.join("; ")}`;
}

function importance(e, kindLabel) {
  const ct = e.sys.contentType.sys.id;
  const f = (k) => lib.fv(e, k);
  if (ct === 'story') return 'бага';
  if (ct === 'localProvider') return f('contact') || (f('phones') || []).length ? 'дунд' : 'бага';
  if (ct === 'place' && PROTECTED.includes(f('category'))) return 'өндөр';
  if (ct === 'heritagePlace' && f('protectedCategory')) return 'өндөр';
  if (ct === 'heritagePlace' || ct === 'place') return f('image') ? 'өндөр' : 'дунд';
  return 'дунд';
}
const RANK = { өндөр: 0, дунд: 1, бага: 2 };

const rows = [];
for (const e of entries) {
  if (!e.sys.publishedVersion) continue;
  const t = thinInfo(e);
  if (!t) continue;
  const k = kind(e);
  rows.push({ e, ...t, k, imp: importance(e, k), url: lib.SITE + lib.urlOf(e, byId) });
}
rows.sort((a, b) => (a.state === b.state ? 0 : a.state === 'noindex' ? -1 : 1) || RANK[a.imp] - RANK[b.imp] || a.k.localeCompare(b.k, 'mn') || b.w - a.w);
writeCsv(OUT, ['хаяг', 'гарчиг', 'одоогийн_үгийн_тоо', 'ангилал', 'ач_холбогдол', 'одоогийн_төлөв', 'юу_нэмбэл_сайжрах', 'entry_id'],
  rows.map((r) => [r.url, lib.titleOf(r.e), r.w, r.k, r.imp, r.state, suggest(r.e, r.text, r.w), r.e.sys.id]));
const t = {};
for (const r of rows) { const k = `${r.state} | ${r.k}`; t[k] = t[k] || { нийт: 0, өндөр: 0, дунд: 0, бага: 0 }; t[k].нийт++; t[k][r.imp]++; }
console.log(OUT, rows.length);
console.table(t);

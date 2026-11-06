// Сайтын бүх бичвэрийн тооллого, дахин бичих эрэмбэ → docs/plan/rewrite-list.csv
// Snapshot-аас (scripts/content/snapshot.js) уншина, Contentful руу хүсэлт явуулахгүй.
// Дахин ажиллуулахад «төлөв», «тэмдэглэл» баганыг хуучин CSV-ээс хадгална (дахин бичих явц алдагдахгүй).
//   node scripts/content/rewrite-list.js
const fs = require('fs');
const path = require('path');
const lib = require('./_lib');
const { parseCsv, writeCsv, loadInventory } = require('../tic/_csv');

const OUT = path.join(lib.ROOT, 'docs', 'plan', 'rewrite-list.csv');
const entries = lib.load('entries.json');
const byId = new Map(entries.map((e) => [e.sys.id, e]));

// TIC-ийн хуучин хаяг → эх сурвалжийн мөр (tic-inventory.csv)
const invSrc = new Map();
for (const r of loadInventory()) if (r['зохиогч_эх_сурвалж']) invSrc.set(r['хуучин_url'].toLowerCase(), r['зохиогч_эх_сурвалж']);
const srcOf = (e) => {
  const u = String(lib.fv(e, 'sourceUrl') || '').replace(/^https?:\/\/(www\.)?touristinfocenter\.mn/i, '').toLowerCase();
  return u ? invSrc.get(u) || '' : '';
};

function bookOf(e, text) {
  const s = text + '\n' + srcOf(e);
  if (/Монгол орны лавлах|Буянбадрах/i.test(s)) return 'тийм: Монгол орны лавлах (Ч.Буянбадрах)';
  if (/Улаан ном/i.test(s)) return 'тийм: Монгол Улсын Улаан ном (2013)';
  const m = /Эх сурвалж\s*:\s*([^\n]{2,60})/i.exec(s);
  if (m) return `үгүй (эх сурвалж: ${m[1].trim()})`;
  return 'тэмдэглэгээгүй';
}

const CAT = {
  1: 'Аймаг, сум',
  2: 'Алдартай болон хамгаалалттай газар',
  3: 'Түүх, түүхэн хүн, соёл, зан заншил',
  4: 'Номоос хуулсан бусад',
  5: 'Буудал, бааз',
  6: 'Шувуу, ургамал, амьтан',
  7: 'Мэдээний архив',
  8: 'Бусад',
};
const TYPE_MN = {
  province: 'Аймаг', soum: 'Сум', destination: 'Алдартай газар (destination)', heritagePlace: 'Өвийн газар', historyArticle: 'Түүхийн нийтлэл',
  cultureArticle: 'Соёлын нийтлэл', cultureHeritage: 'Соёлын өв (нүүр)', event: 'Арга хэмжээ, наадам', story: 'Нийтлэл', localProvider: 'Нутгийн үйлчилгээ',
  species: 'Амьтан, ургамал', communityExperience: 'Туршлага', localProduct: 'Бүтээгдэхүүн', visitorGuidance: 'Зочдод зөвлөмж', faqItem: 'Асуулт',
};
const PLACE_MN = { 'strictly-protected': 'Дархан цаазат газар', 'national-park': 'Байгалийн цогцолборт газар', 'nature-reserve': 'Байгалийн нөөц газар', 'natural-monument': 'Байгалийн дурсгалт газар', museum: 'Музей', theatre: 'Театр', 'culture-center': 'Соёлын төв', sanatorium: 'Рашаан сувилал', landscape: 'Байгалийн үзэсгэлэнт газар' };
const SPECIES_MN = { mammal: 'Хөхтөн амьтан', invertebrate: 'Сээр нуруугүй', fish: 'Загас', reptile: 'Хоёр нутагтан, мөлхөгч', bird: 'Шувуу', plant: 'Ургамал' };
const CULT_MN = { 'ethnic-groups': 'Угсаатан', people: 'Түүхэн хүн', religion: 'Шашин', traditions: 'Зан заншил' };

function typeLabel(e) {
  const ct = e.sys.contentType.sys.id;
  const f = (k) => lib.fv(e, k);
  if (ct === 'place') return `Газар: ${PLACE_MN[f('category')] || f('category')}`;
  if (ct === 'species') return `${SPECIES_MN[f('group')] || f('group')}`;
  if (ct === 'cultureArticle') return `Соёл: ${CULT_MN[f('section')] || f('section')}`;
  if (ct === 'story') return `Нийтлэл: ${f('topic') || '—'}`;
  if (ct === 'localProvider') return `${TYPE_MN[ct]}: ${f('providerType') || '—'}`;
  if (ct === 'heritagePlace' && f('protectedCategory')) return `Өвийн газар: ${PLACE_MN[f('protectedCategory')] || f('protectedCategory')}`;
  return TYPE_MN[ct] || ct;
}

const isTicAccommodation = (e) => lib.fv(e, 'providerType') === 'accommodation' && /touristinfocenter/.test(String(lib.fv(e, 'sourceUrl') || ''));

function category(e, book) {
  const ct = e.sys.contentType.sys.id;
  if (ct === 'province' || ct === 'soum') return 1;
  if (ct === 'destination' || ct === 'heritagePlace' || ct === 'place') return 2;
  if (ct === 'historyArticle' || ct === 'cultureArticle' || ct === 'cultureHeritage' || ct === 'event') return 3;
  if (book.startsWith('тийм')) return 4;
  if (ct === 'localProvider' && isTicAccommodation(e)) return 5;
  if (ct === 'species') return 6;
  if (ct === 'story' && lib.fv(e, 'topic') === 'news') return 7;
  return 8;
}

// Хуудас index-д ордог эсэх (app/sitemap.ts, isThinContent)
function indexState(e, words) {
  const ct = e.sys.contentType.sys.id;
  const f = (k) => lib.fv(e, k);
  const thinField = lib.THIN_FIELD[ct];
  const thinWords = thinField ? lib.words(lib.plain(f(thinField))) : words;
  if (ct === 'species' && f('ownPage') !== true) return 'тусдаа хуудасгүй';
  if (ct === 'soum' && f('ownPage') !== true) return 'тусдаа хуудасгүй';
  if (ct === 'localProvider' && !isTicAccommodation(e)) return 'noindex (/local профайл)';
  if (ct === 'story' && !['news', 'local', 'respect', 'impact', 'international'].includes(f('topic'))) return f('consentObtained') === true ? 'index' : 'sitemap-гүй';
  if (['heritagePlace', 'place', 'species', 'cultureArticle', 'localProvider', 'story', 'soum'].includes(ct) && thinWords < 80) {
    const pageNoindex = ['heritagePlace', 'localProvider', 'story'].includes(ct) || (ct === 'place' && ['landscape', 'strictly-protected', 'national-park', 'nature-reserve', 'natural-monument'].includes(f('category')));
    return pageNoindex ? 'noindex (богино)' : 'sitemap-гүй (богино)';
  }
  if (['communityExperience', 'localProduct', 'visitorGuidance', 'faqItem', 'cultureHeritage'].includes(ct)) return 'тусдаа хуудасгүй';
  return 'index';
}

function importance(e, cat, words, idx) {
  const ct = e.sys.contentType.sys.id;
  if (ct === 'province' || ct === 'destination') return 'өндөр';
  if (!idx.startsWith('index')) return 'бага';
  if (cat <= 3 && words >= 300) return 'өндөр';
  if (cat <= 3 || words >= 300) return 'дунд';
  return 'бага';
}
const RANK = { өндөр: 0, дунд: 1, бага: 2 };

const old = fs.existsSync(OUT) ? new Map(parseCsv(fs.readFileSync(OUT, 'utf8')).map((r) => [r.entry_id, r])) : new Map();

const rows = [];
for (const e of entries) {
  if (lib.status(e) === 'archived') continue;
  const text = lib.textOf(e);
  const w = lib.words(text);
  if (!w) continue;
  const book = bookOf(e, text);
  const cat = category(e, book);
  const idx = indexState(e, w);
  const imp = importance(e, cat, w, idx);
  const url = lib.urlOf(e, byId);
  const prev = old.get(e.sys.id);
  rows.push({ e, w, book, cat, idx, imp, url, prev });
}
rows.sort((a, b) => a.cat - b.cat || RANK[a.imp] - RANK[b.imp] || (a.e.sys.contentType.sys.id === 'province' ? -1 : 0) - (b.e.sys.contentType.sys.id === 'province' ? -1 : 0) || b.w - a.w);

const head = ['эрэмбэ', 'entry_id', 'гарчиг', 'төрөл', 'ангилал', 'үгийн_тоо', 'номоос_хуулсан', 'ач_холбогдол', 'индекс', 'хаяг', 'contentful', 'төлөв', 'тэмдэглэл'];
writeCsv(OUT, head, rows.map((r, i) => [
  i + 1, r.e.sys.id, lib.titleOf(r.e), typeLabel(r.e), `${r.cat}. ${CAT[r.cat]}`, r.w, r.book, r.imp, r.idx,
  r.url ? lib.SITE + r.url : '', lib.status(r.e), r.prev?.['төлөв'] || 'хүлээгдэж буй', r.prev?.['тэмдэглэл'] || '',
]));

const sum = {};
for (const r of rows) {
  const k = `${r.cat}. ${CAT[r.cat]}`;
  sum[k] = sum[k] || { entry: 0, үг: 0, ном: 0, өндөр: 0, дунд: 0, бага: 0 };
  sum[k].entry++; sum[k].үг += r.w; sum[k][r.imp]++; if (r.book.startsWith('тийм')) sum[k].ном++;
}
console.log(OUT, rows.length);
console.table(sum);

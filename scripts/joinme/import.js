// joinme.mn-ийн 465 байгууллагыг Travel Hub-д оруулна. Бүх entry Draft, энэ скрипт НИЙТЛЭХГҮЙ, УСТГАХГҮЙ.
//   node scripts/joinme/import.js build         # API-гүй: data/services/*.json, тайлангийн CSV, төлөвлөгөө
//   node scripts/joinme/import.js schema        # localProvider-д талбар нэмнэ (дахин ажиллуулахад аюулгүй)
//   node scripts/joinme/import.js run [--dry]   # 280 шинэ Draft + 47 TIC entry-д дутуу талбар нөхнө
//   node scripts/joinme/import.js titles [--dry] # давхардсан нэрэнд сум, газар, аймаг, дугаар нэмнэ (slug хэвээр)
//   node scripts/joinme/import.js clean [--dry]  # decisions.json-д хассан зургийг entry-ээс авна
// Хуваарилалт (эзэмшигч баталсан, 2026-11-02):
//   байр (providerType accommodation): tourist_camp, hotel, resort, guesthouse (Өмнөговийн «Гэр»-ээс бусад)
//   нутгийн: Өмнөговийн «Гэр» → herder-family, camel_tour/horse_tour → tour, crafts → artisan, restaurant/cafe → food
//   практик (Contentful-д оруулахгүй): fuel_station, hospital, pharmacy, government → travel-mongolia/data/services/
//   шалгах (Contentful-д оруулахгүй): other, company → data/joinme/unclassified.csv
// joinme_id давтагддаг (465 мөрөнд 336), тиймээс entry id = joinme-<hash(хуудас, компонент, нэр, утас, байршил)>.
// TIC-тэй нэгтгэх: зөвхөн хоосон талбарыг нөхнө. Зөрүүтэй нь data/joinme/discrepancies.csv-д.
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { cma, callCount, ROOT, LOCALE } = require('../tic/_cma');
const { parseCsv, writeCsv } = require('../tic/_csv');
const { slugify } = require('../tic/_batch03-06');
const { seoTitle } = require('../tic/_seo');

const DATA = path.join(ROOT, 'data', 'joinme');
const SERVICES = path.join(ROOT, 'travel-mongolia', 'data', 'services');
const SNAPSHOT = path.join(ROOT, 'backups', 'contentful-snapshot-2026-11-02');
const RESULT = path.join(ROOT, 'backups', 'tic-cache', 'joinme-result.json');
const CT = 'localProvider';
const MAX_CALLS = 1000;
const DRY = process.argv.includes('--dry');
const L = (v) => ({ [LOCALE]: v });
const rd = (f) => fs.readFileSync(f, 'utf8').replace(/^﻿/, '');

const LABEL = {
  tourist_camp: 'Жуулчны бааз', hotel: 'Зочид буудал', resort: 'Амралтын газар', guesthouse: 'Гэр буудал',
  camel_tour: 'Тэмээн аялал', horse_tour: 'Морин аялал', crafts: 'Гар урлал', restaurant: 'Ресторан', cafe: 'Кофе шоп',
};
const PROVINCE_SLUG = { Завхан: 'zavkhan', Увс: 'uvs' };
const PRACTICAL = new Set(['fuel_station', 'hospital', 'pharmacy', 'government']);

const entryId = (p) => `joinme-${crypto.createHash('sha1').update([p.joinme_page_id, p.joinme_component_id, p.name, (p.phones || []).join(','), p.location].join('|')).digest('hex').slice(0, 16)}`;
const isHerder = (p) => p.type === 'guesthouse' && p.province === 'Өмнөговь' && p.name.trim() === 'Гэр';

function groupOf(p) {
  if (PRACTICAL.has(p.type)) return 'practical';
  if (p.type === 'other' || p.type === 'company') return 'unclassified';
  if (isHerder(p)) return 'herder-family';
  return {
    tourist_camp: 'accommodation', hotel: 'accommodation', resort: 'accommodation', guesthouse: 'accommodation',
    camel_tour: 'tour', horse_tour: 'tour', crafts: 'artisan', restaurant: 'food', cafe: 'food', bakery: 'food',
  }[p.type];
}

// Эзэмшигчийн шийдвэр (data/joinme/decisions.json): ангилалгүйг хуваарилах, тулгалт, хасах зураг
const decisions = () => JSON.parse(rd(path.join(DATA, 'decisions.json')));

function load() {
  const providers = JSON.parse(rd(path.join(DATA, 'providers.json'))).providers;
  const dec = decisions();
  const blocked = new Set(Object.values(dec.blockedImages).flat());
  for (const p of providers) {
    p.id = entryId(p);
    const d = (p.type === 'other' || p.type === 'company') && dec.unclassified[p.name.trim()];
    if (d && d.type) {
      p.type = d.type;
      // Ангилалгүйгээс шилжсэн практик үйлчилгээ зураггүй
      if (PRACTICAL.has(d.type)) p.images = [];
    }
    p.images = (p.images || []).filter((u) => !blocked.has(u));
    p.group = groupOf(p);
  }
  if (new Set(providers.map((p) => p.id)).size !== providers.length) throw new Error('id давхцлаа');
  const both = parseCsv(rd(path.join(DATA, 'match-with-tic.csv'))).filter((m) => m.status === 'both');
  const byKey = new Map();
  for (const p of providers) {
    const k = `${p.joinme_id}|${p.name}`;
    byKey.set(k, [...(byKey.get(k) || []), p]);
  }
  const perTic = {};
  for (const m of both) perTic[m.tic_entry_id] = (perTic[m.tic_entry_id] || 0) + 1;
  const matches = both.map((m) => {
    const found = (byKey.get(`${m.joinme_id}|${m.joinme_name}`) || []).filter((x) => x.type === m.joinme_type);
    if (found.length !== 1) throw new Error(`тулгалтын мөр ${found.length} бичлэгт таарав: ${m.joinme_name}`);
    const p = found[0];
    const method = m.match_method.split(' ')[0];
    const review = perTic[m.tic_entry_id] > 1 ? 'нэг TIC entry-д хэд хэдэн joinme' : method === 'contains' ? 'нэр хэсэгчлэн таарсан (contains)' : '';
    const action = review ? dec.match[`${p.name.trim()}|${p.type}`] : 'merge';
    if (!action) throw new Error(`тулгалтын шийдвэр алга: ${p.name}`);
    return { m, p, review, action };
  });
  return { providers, matches };
}

const tally = (a, k) => a.reduce((o, x) => { const v = k(x); o[v] = (o[v] || 0) + 1; return o; }, {});
const location = (p) => String(p.location || '').trim();
const contactOf = (p) => [p.email && `Имэйл: ${p.email}`, p.website && `Вэбсайт: ${p.website}`].filter(Boolean).join('\n');

function newFields(p, slug) {
  const label = LABEL[p.type] || p.type_mn;
  const where = [p.province, p.soum && `${p.soum} сум`].filter(Boolean).join(', ');
  const fields = {
    name: L(p.name.trim()),
    slug: L(slug),
    providerType: L(p.group),
    province: L(p.province),
    joinmeCategory: L(p.type),
    joinmeId: L(p.id),
    joinmeUrl: L(p.joinme_url),
    sourceUrl: L(p.joinme_url),
    needsVerification: L(true),
    seoTitle: L(seoTitle(p.name.trim(), `${label}, ${p.province}`)),
    seoDescription: L(`${p.name.trim()}: ${label}, ${where}. ${location(p)}`.slice(0, 155)),
  };
  if (p.soum) fields.soum = L(p.soum);
  if (location(p)) fields.locationText = L(location(p));
  if ((p.phones || []).length) fields.phones = L(p.phones);
  if ((p.images || []).length) fields.externalImages = L(p.images);
  if (contactOf(p)) fields.contact = L(contactOf(p));
  return fields;
}

// TIC entry-ийн зөвхөн хоосон талбарыг нөхнө. name, slug, sourceUrl, contact, story, photos-т хүрэхгүй.
function mergeFields(e, p) {
  const empty = (k) => { const v = e.fields[k] && e.fields[k][LOCALE]; return v == null || v === '' || (Array.isArray(v) && !v.length); };
  const add = {};
  const put = (k, v) => { if (empty(k) && v != null && v !== '' && (!Array.isArray(v) || v.length)) add[k] = L(v); };
  put('phones', p.phones);
  put('soum', p.soum);
  put('locationText', location(p));
  put('province', p.province);
  if (empty('photos')) put('externalImages', p.images);
  put('joinmeCategory', p.type);
  put('joinmeId', p.id);
  put('joinmeUrl', p.joinme_url);
  return add;
}

const plain = (n) => { const o = []; const w = (x) => { if (!x || typeof x !== 'object') return; if (typeof x.value === 'string') o.push(x.value); (x.content || []).forEach(w); }; w(n); return o.join(' '); };
const normName = (s) => String(s).toLowerCase().replace(/\(.*?\)/g, ' ').replace(/^[^-–]+ [-–] /, '').replace(/жуулчны|бааз|зочид|буудал|амралтын газар|hotel|camp/g, ' ').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// TIC ба joinme-ийн зөрүү. TIC-ийг дарж бичихгүй тул эзэмшигч энэ жагсаалтаар шийднэ.
function differences(e, p) {
  const out = [];
  const v = (k) => e.fields[k] && e.fields[k][LOCALE];
  const add = (field, tic, joinme) => out.push({ field, tic, joinme });
  if (normName(v('name')) !== normName(p.name)) add('нэр', v('name'), p.name);
  if (v('province') && v('province') !== p.province) add('аймаг', v('province'), p.province);
  const ticText = [v('contact'), plain(v('story'))].filter(Boolean).join(' ');
  const ticPhones = [...new Set((ticText.match(/(?<!\d)\d{8}(?!\d)/g) || []))];
  if (ticPhones.length && (p.phones || []).length && !p.phones.some((x) => ticPhones.includes(x))) add('утас', ticPhones.join(' / '), p.phones.join(' / '));
  const soums = [...String(v('contact') || '').matchAll(/([\p{Lu}][\p{L}-]+)\s+сум/gu)].map((m) => m[1]);
  if (p.soum && soums.length && !String(v('contact')).toLowerCase().includes(p.soum.toLowerCase())) add('сум', soums.join(' / '), p.soum);
  if (location(p) && v('contact')) add('байршил (харьцуулахын тулд)', String(v('contact')).replace(/\s+/g, ' ').slice(0, 200), location(p));
  if (Array.isArray(v('photos')) && v('photos').length && (p.images || []).length) add('зураг (TIC-ийнх хэвээр)', `${v('photos').length} зураг`, p.images[0]);
  return out;
}

function build() {
  const { providers, matches } = load();
  fs.mkdirSync(SERVICES, { recursive: true });
  const practical = providers.filter((p) => p.group === 'practical');
  const counts = {};
  for (const [province, list] of Object.entries(practical.reduce((o, p) => { (o[p.province] = o[p.province] || []).push(p); return o; }, {}))) {
    const slug = PROVINCE_SLUG[province];
    if (!slug) throw new Error(`аймгийн slug алга: ${province}`);
    const items = list.map((p) => ({
      id: p.id, name: p.name.trim(), type: p.type, soum: p.soum || null, location: location(p) || null, phones: p.phones || [], image: (p.images || [])[0] || null,
    })).sort((a, b) => a.type.localeCompare(b.type) || (a.soum || '').localeCompare(b.soum || '', 'mn') || a.name.localeCompare(b.name, 'mn'));
    fs.writeFileSync(path.join(SERVICES, `${slug}.json`), `${JSON.stringify({ province, slug, source: 'joinme.mn', fetchedAt: '2026-10-30', items }, null, 2)}\n`);
    counts[slug] = items.length;
  }
  const un = providers.filter((p) => p.group === 'unclassified');
  writeCsv(path.join(DATA, 'unclassified.csv'), ['name', 'type', 'province', 'soum', 'location', 'phones', 'image'], un.map((p) => [p.name, p.type, p.province, p.soum || '', location(p), (p.phones || []).join(' / '), (p.images || [])[0] || '']));
  writeCsv(path.join(DATA, 'match-review.csv'), ['шийдвэр', 'шалтгаан', 'joinme_name', 'joinme_type', 'joinme_province', 'joinme_soum', 'joinme_location', 'joinme_phones', 'tic_entry_id', 'tic_name', 'tic_slug'],
    matches.filter((x) => x.review).map(({ m, p, review, action }) => [action, review, p.name, p.type, p.province, p.soum || '', location(p), (p.phones || []).join(' / '), m.tic_entry_id, m.tic_name, m.tic_slug]));
  const matched = new Set(matches.filter((x) => x.action !== 'create').map((x) => x.p.id));
  const create = providers.filter((p) => !['practical', 'unclassified'].includes(p.group) && !matched.has(p.id));
  const longest = (a) => a.reduce((n, s) => Math.max(n, String(s).length), 0);
  console.log('бүлэг', tally(providers, (p) => p.group));
  console.log('үүсгэх', create.length, tally(create, (p) => `${p.group}/${p.type}`));
  console.log('тулгалт', matches.length, tally(matches, (x) => x.action));
  console.log('практик JSON', counts, 'шалгах (ангилалгүй)', un.length);
  console.log('хамгийн урт: нэр', longest(providers.map((p) => p.name)), 'зураг', longest(providers.flatMap((p) => p.images || [])), 'утас', longest(providers.flatMap((p) => p.phones || [])));
  return { providers, matches, create };
}

async function schema() {
  const f = (id, name, type, extra = {}) => ({ id, name, type, localized: false, required: false, disabled: false, omitted: false, validations: [], ...extra });
  const NEW = [
    f('phones', 'Утас', 'Array', { items: { type: 'Symbol', validations: [] } }),
    f('soum', 'Сум', 'Symbol'),
    f('locationText', 'Байршил (текст)', 'Text'),
    f('externalImages', 'Зургийн гадаад холбоос', 'Array', { items: { type: 'Symbol', validations: [{ regexp: { pattern: '^https://' } }] } }),
    f('joinmeCategory', 'joinme ангилал (сайтад харагдахгүй)', 'Symbol'),
    f('joinmeId', 'joinme id (сайтад харагдахгүй)', 'Symbol'),
    f('joinmeUrl', 'joinme эх хуудас (сайтад харагдахгүй)', 'Symbol'),
  ];
  const ct = await cma('GET', `/content_types/${CT}`);
  if (ct.sys.publishedVersion && ct.sys.version !== ct.sys.publishedVersion + 1) throw new Error('content type-д нийтлээгүй өөрчлөлт байна — зогсоов');
  const add = NEW.filter((x) => !ct.fields.some((y) => y.id === x.id));
  const fields = [...ct.fields, ...add];
  const pt = fields.find((x) => x.id === 'providerType');
  const inV = pt.validations.find((v) => v.in);
  const addTour = !inV.in.includes('tour');
  if (addTour) inV.in.push('tour');
  if (!add.length && !addTour) { console.log('schema бэлэн', `CMA ${callCount()}`); return; }
  const put = await cma('PUT', `/content_types/${CT}`, { version: ct.sys.version, body: { name: ct.name, description: ct.description, displayField: ct.displayField, fields } });
  await cma('PUT', `/content_types/${CT}/published`, { version: put.sys.version });
  console.log('нэмэв', add.map((x) => x.id).join(', '), addTour ? '+ providerType tour' : '', `CMA ${callCount()}`);
}

async function run() {
  const { providers, matches, create } = build();
  const entries = JSON.parse(fs.readFileSync(path.join(SNAPSHOT, 'entries.json'), 'utf8'));
  const used = new Set(entries.filter((e) => e.sys.contentType.sys.id === CT).map((e) => e.fields.slug && e.fields.slug[LOCALE]));
  const already = new Set();
  if (!DRY) {
    for (let skip = 0; ; skip += 1000) {
      const r = await cma('GET', `/entries?content_type=${CT}&fields.joinmeId[exists]=true&select=sys.id,fields.slug&limit=1000&skip=${skip}`);
      for (const e of r.items) { already.add(e.sys.id); used.add(e.fields.slug && e.fields.slug[LOCALE]); }
      if (skip + 1000 >= r.total) break;
    }
  }
  const result = { created: [], skipped: [], merged: [], errors: [] };
  const guard = () => { if (callCount() >= MAX_CALLS) throw new Error(`${MAX_CALLS} хүсэлтийн хязгаар — зогсоов`); };
  // Дахин ажиллуулахад өмнө үүсгэсэн жагсаалтыг хадгална
  const prior = fs.existsSync(RESULT) ? JSON.parse(fs.readFileSync(RESULT, 'utf8')).created || [] : [];
  const save = () => { if (!DRY) fs.writeFileSync(RESULT, JSON.stringify({ ...result, created: [...prior, ...result.created], calls: callCount() }, null, 1)); };

  for (const p of create) {
    if (already.has(p.id)) { result.skipped.push(p.id); continue; }
    guard();
    const base = slugify(`${p.province} ${p.name}`) || 'joinme';
    let slug = base;
    for (let n = 2; used.has(slug); n++) slug = `${base}-${n}`;
    used.add(slug);
    const fields = newFields(p, slug);
    try {
      if (!DRY) await cma('PUT', `/entries/${p.id}`, { contentType: CT, body: { fields } });
      result.created.push({ id: p.id, slug, group: p.group, type: p.type, province: p.province, name: p.name.trim() });
    } catch (e) {
      result.errors.push({ id: p.id, name: p.name, error: e.message.slice(0, 300) });
      console.log('АЛДАА', p.id, e.message.slice(0, 200));
      if (result.errors.length >= 8) throw new Error('8 алдаа — зогсоов');
    }
    if (result.created.length % 50 === 0) { save(); console.log(`үүсгэв ${result.created.length}/${create.length}, CMA ${callCount()}`); }
  }

  const rows = [];
  const snap = new Map(entries.map((e) => [e.sys.id, e]));
  const notes = decisions().storyNotes;
  for (const { m, p, action } of matches) {
    if (action !== 'merge') continue;
    guard();
    const e = DRY ? snap.get(m.tic_entry_id) : await cma('GET', `/entries/${m.tic_entry_id}`);
    if (!e) { result.errors.push({ id: m.tic_entry_id, error: 'TIC entry олдсонгүй' }); continue; }
    const diffs = differences(e, p);
    for (const d of diffs) rows.push([m.tic_entry_id, p.name, d.field, d.tic, d.joinme]);
    if (!DRY && e.sys.version > e.sys.publishedVersion + 1 && !(e.fields.joinmeId && e.fields.joinmeId[LOCALE])) {
      result.errors.push({ id: e.sys.id, error: 'нийтлээгүй өөр засвартай тул алгасав' });
      continue;
    }
    const add = mergeFields(e, p);
    // Сум зөрүүтэй бол (өөр газар байж магадгүй) сум, байршлыг нөхөхгүй: эзэмшигч жагсаалтаар шийднэ
    if (diffs.some((d) => d.field === 'сум')) { delete add.soum; delete add.locationText; }
    // TIC-ийн текстэд өөр утас байвал хоёр өөр дугаар харуулахгүй
    if (diffs.some((d) => d.field === 'утас')) delete add.phones;
    // Эзэмшигчийн шийдвэрээр тайлбарын төгсгөлд нэг догол мөр нэмнэ, TIC-ийн текст хэвээр
    const note = notes[e.sys.id];
    const story = e.fields.story && e.fields.story[LOCALE];
    if (note && !plain(story).includes(note)) {
      const paragraph = { nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value: note, marks: [], data: {} }] };
      add.story = { ...e.fields.story, [LOCALE]: story ? { ...story, content: [...story.content, paragraph] } : { nodeType: 'document', data: {}, content: [paragraph] } };
    }
    const keys = Object.keys(add);
    if (!DRY && keys.length) {
      try {
        await cma('PUT', `/entries/${e.sys.id}`, { version: e.sys.version, body: { fields: { ...e.fields, ...add } } });
      } catch (err) {
        result.errors.push({ id: e.sys.id, error: err.message.slice(0, 300) });
        continue;
      }
    }
    result.merged.push({ id: e.sys.id, joinme: p.id, name: p.name, added: keys });
  }
  writeCsv(path.join(DATA, 'discrepancies.csv'), ['tic_entry_id', 'joinme_name', 'талбар', 'TIC', 'joinme'], rows);
  save();
  console.log(`${DRY ? '[dry] ' : ''}үүсгэв`, result.created.length, tally(result.created, (x) => x.group), 'алгасав', result.skipped.length);
  console.log('нэгтгэв', result.merged.length, 'нэмсэн талбар', tally(result.merged.flatMap((x) => x.added), (k) => k));
  console.log('зөрүү', rows.length, tally(rows, (r) => r[2]), 'алдаа', result.errors.length, `CMA ${callCount()}`);
  result.errors.forEach((e) => console.log('  ', JSON.stringify(e).slice(0, 240)));
  const slugs = result.created.map((x) => x.slug);
  console.log('жишээ slug', slugs.filter((_, i) => i % 40 === 0).slice(0, 8));
  if (providers.length !== 465) throw new Error(`мөрийн тоо ${providers.length}`);
}

async function joinmeEntries() {
  const items = [];
  for (let skip = 0; ; skip += 1000) {
    const r = await cma('GET', `/entries?content_type=${CT}&fields.joinmeId[exists]=true&limit=1000&skip=${skip}`);
    items.push(...r.items);
    if (skip + 1000 >= r.total) break;
  }
  return items;
}

// Байршлын мөр нь сайтад гарахгүй ангиллууд (lib/localContent.ts CONTACT_VIA_JOINME)
const PRIVATE_GROUPS = ['herder-family', 'tour'];

// Байршлын текстээс газрын нэр. Хувийн ангилалд баг, тоот, зайг оруулахгүй (гэрийн хаяг сайтад гарахгүй).
function placeOf(p) {
  const prefix = new RegExp(`^${p.province}(\\s+аймаг(ийн)?)?[,.]?\\s*`, 'iu');
  let s = location(p).replace(/\s+/g, ' ').replace(prefix, '');
  if (p.soum) s = s.replace(/\S+\s+сум(ын)?[,.]?\s*/iu, '');
  s = s.replace(/Сэврэй[.,]?\s+[Хх]онгорын гол/u, 'Сэврэй Хонгорын гол');
  if (PRIVATE_GROUPS.includes(p.group)) {
    s = s.replace(/(\S+\s+)?баг(?=[\s,.]|$)/giu, '');
    if (/\d/.test(s)) s = '';
  }
  s = s.replace(/^[\s,.]+|[\s,.]+$/g, '');
  if (s === 'төв' || s === 'сумын төв') s = '';
  return s ? s[0].toUpperCase() + s.slice(1) : '';
}

// Давхардсан нэртэй шинэ entry-ийн гарчиг: «Гэр, Булган сум, Өмнөговь», «Тэмээ, Модон овоо, Өмнөговь 2».
// Slug хэвээр, нийтлэгдсэн entry-д хүрэхгүй.
async function titles() {
  const { providers } = load();
  const byId = new Map(providers.map((p) => [p.id, p]));
  const items = (await joinmeEntries()).filter((e) => e.sys.id.startsWith('joinme-') && byId.has(e.sys.id));
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const count = tally(items, (e) => norm(byId.get(e.sys.id).name));
  const dup = items.filter((e) => count[norm(byId.get(e.sys.id).name)] > 1)
    .sort((a, b) => a.fields.slug[LOCALE].localeCompare(b.fields.slug[LOCALE], 'en', { numeric: true }));
  const seen = {};
  const final = [];
  let changed = 0;
  for (const e of dup) {
    const p = byId.get(e.sys.id);
    if (e.sys.publishedVersion) throw new Error(`нийтлэгдсэн entry: ${e.sys.id} — зогсоов`);
    const base = [p.name.trim(), p.soum && `${p.soum} сум`, placeOf(p), p.province].filter(Boolean).join(', ');
    const n = (seen[norm(base)] = (seen[norm(base)] || 0) + 1);
    const title = n > 1 ? `${base} ${n}` : base;
    final.push(title);
    const label = p.group === 'herder-family' ? 'Малчин өрх' : LABEL[p.type] || p.type_mn;
    const description = PRIVATE_GROUPS.includes(p.group) ? `${title}: ${label}.` : e.fields.seoDescription[LOCALE];
    if (e.fields.name[LOCALE] === title && e.fields.seoDescription[LOCALE] === description) continue;
    changed++;
    if (DRY) continue;
    const fields = { ...e.fields, name: L(title), seoTitle: L(seoTitle(title, LABEL[p.type] || p.type_mn)), seoDescription: L(description) };
    await cma('PUT', `/entries/${e.sys.id}`, { version: e.sys.version, body: { fields } });
  }
  console.log(`${DRY ? '[dry] ' : ''}гарчиг`, dup.length, 'өөрчилсөн', changed, 'дугаартай', final.filter((t) => / \d+$/.test(t)).length, 'давтагдсан', final.length - new Set(final).size);
  final.filter((_, i) => i % 9 === 0).forEach((t) => console.log(' ', t));
  console.log(`CMA ${callCount()}`);
}

// Хассан зургийг Contentful-ийн externalImages-ээс авна. Бусад талбар, нийтлэлийн төлөвт хүрэхгүй.
async function clean() {
  const blocked = new Set(Object.values(decisions().blockedImages).flat());
  const items = await joinmeEntries();
  const out = { draft: 0, tic: 0, emptied: 0 };
  for (const e of items) {
    const list = (e.fields.externalImages && e.fields.externalImages[LOCALE]) || [];
    const keep = list.filter((u) => !blocked.has(u));
    if (keep.length === list.length) continue;
    out[e.sys.publishedVersion ? 'tic' : 'draft']++;
    if (!keep.length) out.emptied++;
    if (DRY) continue;
    const fields = { ...e.fields };
    if (keep.length) fields.externalImages = L(keep);
    else delete fields.externalImages;
    await cma('PUT', `/entries/${e.sys.id}`, { version: e.sys.version, body: { fields } });
  }
  console.log(`${DRY ? '[dry] ' : ''}зураг хасав`, out, `нийт entry ${items.length}, CMA ${callCount()}`);
}

(async () => {
  const cmd = process.argv[2];
  if (cmd === 'build') build();
  else if (cmd === 'schema') await schema();
  else if (cmd === 'run') await run();
  else if (cmd === 'titles') await titles();
  else if (cmd === 'clean') await clean();
  else throw new Error('хэрэглээ: build | schema | run [--dry] | titles [--dry] | clean [--dry]');
})().catch((e) => { console.error(e.message); console.error(`CMA ${callCount()}`); process.exit(1); });

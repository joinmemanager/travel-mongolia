// joinme-ийн байрыг нийтэлнэ (эзэмшигчийн заавар, 2026-11-02): анхны 155 draft + нэгтгэсэн 53 TIC entry.
//   node scripts/joinme/publish-accommodation.js        # зөвхөн тоолж, шалгана, юу ч өөрчлөхгүй
//   node scripts/joinme/publish-accommodation.js --go   # нийтэлнэ
// Малчин өрх, тэмээ/морь, гар урлал, хоолыг нийтлэхгүй (/local хэсэгтэй хамт нээнэ). Хожим нэмсэн 10 байр draft-аар үлдэнэ.
// Webhook асаалттай эсвэл TIC entry-д joinme-ээс гадуур өөрчлөлт олдвол зогсоно. Unpublish, устгах код алга.
const fs = require('fs');
const path = require('path');
const { cma, callCount, ROOT, LOCALE } = require('../tic/_cma');

const GO = process.argv.includes('--go');
const RESULT = path.join(ROOT, 'backups', 'tic-cache', 'publish-joinme-2026-11-02.json');
const dec = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'joinme', 'decisions.json'), 'utf8').replace(/^﻿/, ''));
const created = JSON.parse(fs.readFileSync(path.join(ROOT, 'backups', 'tic-cache', 'joinme-result.json'), 'utf8')).created;
const EXPECT_NEW = 155;
const EXPECT_TIC = 53;
// TIC entry-д зөвшөөрөгдсөн өөрчлөлт: joinme-ээс нөхсөн талбарууд ба ticFixes-ийн гарчиг
const ALLOWED = new Set(['phones', 'soum', 'locationText', 'externalImages', 'province', 'joinmeCategory', 'joinmeId', 'joinmeUrl']);

const canon = (v) => (Array.isArray(v) ? v.map(canon) : v && typeof v === 'object' ? Object.keys(v).sort().reduce((o, k) => { o[k] = canon(v[k]); return o; }, {}) : v);
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));

(async () => {
  const webhooks = await cma('GET', '/webhook_definitions', { spaceLevel: true });
  const active = webhooks.items.filter((w) => w.active !== false);
  console.log('webhook', webhooks.items.map((w) => `${w.name}: ${w.active === false ? 'унтраалттай' : 'АСААЛТТАЙ'}`));

  const items = [];
  for (let skip = 0; ; skip += 1000) {
    const r = await cma('GET', `/entries?content_type=localProvider&fields.joinmeId[exists]=true&limit=1000&skip=${skip}`);
    items.push(...r.items);
    if (skip + 1000 >= r.total) break;
  }
  const v = (e, k) => e.fields[k] && e.fields[k][LOCALE];
  const later = new Set([
    ...Object.entries(dec.unclassified).filter(([, d]) => ['hotel', 'tourist_camp'].includes(d.type)).map(([n]) => n),
    ...Object.entries(dec.match).filter(([, a]) => a === 'create').map(([k]) => k.split('|')[0]),
  ]);
  const nameOf = new Map(created.map((x) => [x.id, x.name]));
  const lodging = items.filter((e) => e.sys.id.startsWith('joinme-') && v(e, 'providerType') === 'accommodation');
  const newOnes = lodging.filter((e) => !later.has(nameOf.get(e.sys.id)));
  const heldBack = lodging.filter((e) => later.has(nameOf.get(e.sys.id)));
  const tic = items.filter((e) => !e.sys.id.startsWith('joinme-'));
  const others = items.filter((e) => e.sys.id.startsWith('joinme-') && v(e, 'providerType') !== 'accommodation');

  // TIC entry: одоогийн draft ба нийтлэгдсэн хувилбарын ялгааг шалгана
  const pub = new Map();
  for (let i = 0; i < tic.length; i += 50) {
    const r = await cma('GET', `/public/entries?limit=1000&sys.id[in]=${tic.slice(i, i + 50).map((e) => e.sys.id).join(',')}`);
    r.items.forEach((e) => pub.set(e.sys.id, e));
  }
  const unexpected = [];
  const changedFields = {};
  for (const e of tic) {
    const p = pub.get(e.sys.id);
    if (!p) { unexpected.push(`${e.sys.id}: нийтлэгдсэн хувилбар алга`); continue; }
    for (const k of new Set([...Object.keys(e.fields), ...Object.keys(p.fields)])) {
      if (same(e.fields[k], p.fields[k])) continue;
      changedFields[k] = (changedFields[k] || 0) + 1;
      const fix = dec.ticFixes[e.sys.id] || {};
      const titleFix = fix.name && ['name', 'seoTitle', 'seoDescription'].includes(k);
      const noteFix = k === 'story' && dec.storyNotes[e.sys.id];
      if (!ALLOWED.has(k) && !titleFix && !noteFix) unexpected.push(`${e.sys.id}: ${k}`);
    }
  }
  const slugDiff = tic.filter((e) => pub.get(e.sys.id) && v(e, 'slug') !== v(pub.get(e.sys.id), 'slug')).length;
  const state = (a) => a.reduce((o, e) => { const s = !e.sys.publishedVersion ? 'draft' : e.sys.version > e.sys.publishedVersion + 1 ? 'changed' : 'published'; o[s] = (o[s] || 0) + 1; return o; }, {});

  console.log('нийтлэх шинэ байр', newOnes.length, state(newOnes));
  console.log('нийтлэх TIC', tic.length, state(tic), 'өөрчлөгдсөн талбар', changedFields, 'slug зөрүү', slugDiff);
  console.log('үлдэх байр (хожим нэмсэн)', heldBack.length, heldBack.map((e) => v(e, 'name')));
  console.log('үлдэх бусад', others.length, state(others));
  console.log('хүсэлтийн тооцоо: нийтлэх', newOnes.length + tic.length, '+ энэ шалгалт', callCount());
  unexpected.forEach((x) => console.log('  ТААРАХГҮЙ', x));

  if (newOnes.length !== EXPECT_NEW || tic.length !== EXPECT_TIC) throw new Error(`тоо зөрүүтэй: ${newOnes.length}/${EXPECT_NEW}, ${tic.length}/${EXPECT_TIC}`);
  if (unexpected.length || slugDiff) throw new Error('TIC entry-д хүлээгээгүй өөрчлөлт байна, зогсоов');
  if (!GO) { console.log('[шалгалт] юу ч нийтлээгүй', `CMA ${callCount()}`); return; }
  if (active.length) throw new Error('Webhook асаалттай, зогсоов');

  const result = { published: [], skipped: [], errors: [] };
  const save = () => fs.writeFileSync(RESULT, JSON.stringify({ ...result, calls: callCount() }, null, 1));
  for (const e of [...newOnes, ...tic]) {
    if (e.sys.publishedVersion && e.sys.version === e.sys.publishedVersion + 1) { result.skipped.push(e.sys.id); continue; }
    try {
      await cma('PUT', `/entries/${e.sys.id}/published`, { version: e.sys.version });
      result.published.push(e.sys.id);
    } catch (err) {
      result.errors.push({ id: e.sys.id, error: err.message.slice(0, 300) });
      console.log('АЛДАА', e.sys.id, err.message.slice(0, 200));
      // Эхний entry унавал бүгд унах магадлалтай
      if (result.published.length === 0 || result.errors.length >= 5) { save(); throw new Error('алдаа, зогсоов'); }
    }
    if (result.published.length % 50 === 0) { save(); console.log(`нийтлэв ${result.published.length}, CMA ${callCount()}`); }
  }
  save();
  console.log('нийтлэв', result.published.length, 'алгасав', result.skipped.length, 'алдаа', result.errors.length, `CMA ${callCount()}`);
})().catch((e) => { console.error(e.message); console.error(`CMA ${callCount()}`); process.exit(1); });

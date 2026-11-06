// Ажил A: AI-аар нэмэгдсэн буруу/огноогүй статистик, зохиомол холбоо барих мэдээллийг засна.
//  - province.description2: «Холбоо барих» хэсгийн жагсаалтыг албан сайтаас баталгаажсан мэдээллээр (эсвэл зөвхөн албан сайтын холбоосоор) солино;
//    «Хүн ам:» мөрийг 2020 оны тооллогын тоогоор (lib/provinceFacts.ts), «Малын тоо толгой:» мөрийг ҮСХ-ны 2025 оны тоогоор солино;
//    «Нийт хүн амын NN орчим/гаруй хувь …» гэх огноогүй өгүүлбэрийг хасна.
//  - soum.body (H2/H3-тай, AI-аар бүтэцлэгдсэн сумд): «Хүн ам…», «Мал аж ахуй / Мал сүрэг…» мөрийг ҮСХ-ны 2025 оны тоогоор солино.
//    ҮСХ-д тохирох сум олдохгүй бол TIC-ийн эх текстийн онтой өгүүлбэрийг, тэр нь ч алга бол мөрийг хасна.
// Нийтлэл: нийтлэгдсэн хувилбар дээр зөвхөн энэ засварыг хийж нийтэлнэ; нийтлээгүй draft өөрчлөлт байвал түүнийг (засвартай нь) буцааж draft болгоно.
//   node scripts/content/stat-fix.js --dry           # snapshot дээр, Contentful-д хүрэхгүй → docs/plan/stat-fixes.csv
//   node scripts/content/stat-fix.js --apply [id…]   # засаад нийтэлнэ
const fs = require('fs');
const path = require('path');
const lib = require('./_lib');
const { writeCsv } = require('../tic/_csv');

const ROOT = lib.ROOT;
const DRY = process.argv.includes('--dry');
const APPLY = process.argv.includes('--apply');
const ONLY = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const DAY = '2026-11-06';
const NSO = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'nso', 'aimag-soum-2025.json'), 'utf8'));
const FACTS_SRC = fs.readFileSync(path.join(ROOT, 'travel-mongolia', 'lib', 'provinceFacts.ts'), 'utf8');
const POP2020 = {};
for (const m of FACTS_SRC.matchAll(/^\s*'?([a-z-]+)'?: \{ name: '([^']+)'.*?population: (\d+)/gm)) POP2020[m[1]] = { name: m[2], pop: Number(m[3]) };

// Албан сайтаас 2026-11-06-нд баталгаажуулсан холбоо барих мэдээлэл (web-fetch). Бусад нь зөвхөн холбоос.
const CONTACTS = {
  arkhangai: { site: 'https://arkhangai.gov.mn/holboo-barih/', address: 'Нутгийн удирдлагын ордон, Дэмид жанжны талбай, 2-р баг, Эрдэнэбулган сум, Архангай аймаг (зип 65139)', phone: '976-7033-1111', fax: '7033-3208', email: 'info@arkhangai.gov.mn' },
  ulaanbaatar: { site: 'https://ulaanbaatar.mn', address: 'Хан-Уул дүүрэг, 23-р хороо, Арцатын ам, Наадамчдын зам 1200, Улаанбаатар 17100', phone: '+976 70-13-12-00 (НЗДТГ-ын угтах үйлчилгээ)' },
  bulgan: { site: 'https://bulgan.gov.mn/web', address: 'Жаргалант баг, Анхдагчдын өргөн чөлөө 1-120, Булган сум, Булган аймаг 63082', phone: '+976 7034-7034 (санал хүсэлт), 7034-2441 (зөвлөгөө, мэдээлэл)', email: 'info@bulgan.gov.mn' },
  'gov-altai': { site: 'https://govi-altai.gov.mn/feedback', phone: '7048-3360, 7048-1111', email: 'info@govi-altai.gov.mn' },
  orkhon: { site: 'https://orkhon.gov.mn', phone: '+976 7035-7319', email: 'info@orkhon.gov.mn' },
  uvurkhangai: { site: 'https://uvurkhangai.gov.mn', address: 'Нутгийн удирдлагын ордон, Аюуш баатрын талбай, Гэндэнгийн гудамж, Арвайхээр сум, Өвөрхангай аймаг', phone: '7032-2530, 7032-2073', email: 'uvurkhangai@ov.gov.mn' },
  khuvsgul: { site: 'https://khovsgol.gov.mn', phone: '+976 7038-1111', email: 'huvsgulzdtg@khs.gov.mn' },
  khentii: { site: 'https://khentii.mn', address: 'Сэцэнхааны гудамж 1, 4-р баг, Хэрлэн сум, Хэнтий аймаг', phone: '7056-3111', fax: '7056-2412', email: 'infoazdtg@khentii.gov.mn' },
  khovd: { site: 'https://khovd.gov.mn' }, 'bayan-ulgii': { site: 'https://bayan-olgii.gov.mn' }, bayankhongor: { site: 'https://bayankhongor.gov.mn' },
  govsumber: { site: 'https://govisumber.gov.mn' }, 'darkhan-uul': { site: 'https://darkhan.gov.mn' }, dornogov: { site: 'https://dornogovi.gov.mn' },
  dornod: { site: 'https://dornod.gov.mn' }, dundgov: { site: 'https://dundgovi.gov.mn' }, zavkhan: { site: 'https://zavkhan.gov.mn' },
  umnugov: { site: 'https://umnugovi.gov.mn' }, sukhbaatar: { site: 'https://sukhbaatar.gov.mn' }, selenge: { site: 'https://selenge.gov.mn' },
  tuv: { site: 'https://tov.gov.mn' }, uvs: { site: 'https://uvs.gov.mn' },
};
const VERIFIED_NUMBERS = new Set(Object.values(CONTACTS).flatMap((c) => `${c.phone || ''} ${c.fax || ''}`.match(/\d{2,4}-\d{2}-?\d{2,4}/g) || []));

// ---- rich text туслах
const T = (value, marks = []) => ({ nodeType: 'text', value, marks, data: {} });
const P = (...inl) => ({ nodeType: 'paragraph', data: {}, content: inl.length ? inl : [T('')] });
const LI = (...inl) => ({ nodeType: 'list-item', data: {}, content: [P(...inl)] });
const UL = (items) => ({ nodeType: 'unordered-list', data: {}, content: items });
const A = (uri, text) => ({ nodeType: 'hyperlink', data: { uri }, content: [T(text)] });
const bold = (s) => T(s, [{ type: 'bold' }]);
const host = (u) => u.replace(/^https?:\/\//, '').replace(/\/$/, '');
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const ownText = (li) => lib.plain({ content: (li.content || []).filter((c) => c.nodeType === 'paragraph') }).replace(/\s+/g, ' ').trim();

function contactList(slug) {
  const c = CONTACTS[slug];
  if (!c) return null;
  if (!c.phone && !c.email) return UL([LI(bold('Холбоо барих: '), A(c.site, host(c.site)), T(' (аймгийн албан ёсны цахим хуудас)'))]);
  const items = [];
  if (c.address) items.push(LI(bold('Хаяг: '), T(c.address)));
  if (c.phone) items.push(LI(bold('Утас: '), T(c.phone)));
  if (c.fax) items.push(LI(bold('Факс: '), T(c.fax)));
  if (c.email) items.push(LI(bold('И-мэйл: '), T(c.email)));
  items.push(LI(bold('Албан ёсны цахим хуудас: '), A(c.site, host(c.site)), T(` (мэдээллийг ${DAY}-нд эндээс шалгав)`)));
  return UL(items);
}

function livestockText(l) {
  const parts = [['адуу', 'Адуу'], ['үхэр', 'Үхэр'], ['тэмээ', 'Тэмээ'], ['хонь', 'Хонь'], ['ямаа', 'Ямаа']].map(([k, K]) => `${k} ${fmt(l[K] * 1000)}`).join(', ');
  return `${fmt(l['Бүгд'] * 1000)} толгой (${parts}; 2025 оны тооллогоор, ҮСХ)`;
}

const POP_LABEL = /^(Хүн ам|Хүн амын тоо|Хүн ам, [^:]{0,30})\s*:/;
const LIVE_LABEL = /^(Малын тоо толгой|Мал аж ахуй|Мал сүрэг[^:]{0,20}|Мал сүргийн [^:]{0,20}|Мал аж ахуй, [^:]{0,30})\s*:/;
const SHARE_SENT = /\s*Нийт (хүн амын|оршин суугчдын|иргэдийн) [\d.,]+(-аас дээш)? ?(орчим |гаруй )?хувь[^.]*\.\s*/g;

// ---- аймаг
function fixProvince(e, doc, log) {
  const slug = lib.fv(e, 'slug');
  const out = JSON.parse(JSON.stringify(doc));
  const c = out.content;
  const hi = c.findIndex((n) => /^heading/.test(n.nodeType) && /Холбоо барих/i.test(lib.plain(n)));
  if (hi >= 0 && c[hi + 1]?.nodeType === 'unordered-list') {
    const nl = contactList(slug);
    if (nl) { log('холбоо барих', lib.plain(c[hi + 1]).replace(/\s+/g, ' ').slice(0, 300), lib.plain(nl).replace(/\s+/g, ' ')); c[hi + 1] = nl; }
  }
  const pop = POP2020[slug];
  const nsoA = NSO.aimags[pop?.name] || NSO.aimags[{ ulaanbaatar: 'Улаанбаатар' }[slug]];
  const walk = (node) => {
    for (let i = 0; i < (node.content || []).length; i++) {
      const ch = node.content[i];
      if (ch.nodeType === 'list-item') {
        const t = ownText(ch);
        if (POP_LABEL.test(t) && /\d/.test(t) && pop) {
          const nt = `${fmt(pop.pop)} (2020 оны Хүн ам, орон сууцны улсын тооллого, ҮСХ)`;
          node.content[i] = LI(bold('Хүн ам: '), T(nt)); log('хүн ам', t, 'Хүн ам: ' + nt); continue;
        }
        if (LIVE_LABEL.test(t) && /\d/.test(t)) {
          if (nsoA) { const nt = livestockText(nsoA.livestock); node.content[i] = LI(bold('Малын тоо толгой: '), T(nt)); log('мал', t, 'Малын тоо толгой: ' + nt); }
          else { node.content.splice(i--, 1); log('мал (хассан)', t, ''); }
          continue;
        }
      }
      if (ch.nodeType === 'text' && SHARE_SENT.test(ch.value)) { const b = ch.value; ch.value = ch.value.replace(SHARE_SENT, ' ').replace(/\s+$/, ''); log('хүн амын хувь (хассан)', b, ch.value); }
      SHARE_SENT.lastIndex = 0;
      walk(ch);
    }
  };
  walk(out);
  return out;
}

// ---- сум
const ORDER = ['contentful-2026-10-08', 'contentful-2026-10-15-pre-tic', 'contentful-2026-10-19-pre-batch01b', 'contentful-2026-10-19-pre-batch02', 'contentful-2026-10-20-pre-batch03-06'];
const early = new Map();
for (const d of ORDER) { const j = JSON.parse(fs.readFileSync(path.join(ROOT, 'backups', d, 'entries.json'), 'utf8')); for (const x of (Array.isArray(j) ? j : j.items)) if (!early.has(x.sys.id)) early.set(x.sys.id, x); }
const snap = lib.load('entries.json');
const byId = new Map(snap.map((x) => [x.sys.id, x]));
const soumName = (e) => lib.titleOf(e).replace(/ (сум|дүүрэг|хот|тосгон)$/, '');
function nsoSoum(e) {
  const p = byId.get(lib.fv(e, 'province')?.sys?.id);
  const aName = p ? lib.titleOf(p).replace(/ аймаг$/, '') : '';
  const a = NSO.aimags[aName];
  if (!a) return null;
  // ҮСХ-д өөр бичлэгээр бүртгэгдсэн сумд
  const ALIAS = { 'Дарви|Говь-Алтай': 'Дарив', 'Галшар|Хэнтий': 'Галшир', 'Булган|Булган': 'Булган сум', 'Баянхонгор|Баянхонгор': 'Баянхонгор сум' };
  const n = ALIAS[soumName(e) + '|' + aName] || soumName(e);
  return a.soums[n] || a.soums[n.replace(/-/g, ' ')] || Object.entries(a.soums).find(([k]) => k.replace(/[\s-]/g, '') === n.replace(/[\s-]/g, ''))?.[1] || null;
}
// TIC-ийн эх текстээс онтой хүн амын өгүүлбэр
function ticPopSentence(e) {
  const o = early.get(e.sys.id);
  if (!o) return null;
  const t = lib.textOf(o).replace(/\s+/g, ' ');
  return t.split(/(?<=\.)\s+/).find((s) => /(хүн ам|хүн амьдар|өрх)/i.test(s) && /\d{4} оны|\d{4} онд|оны байдлаар|оны дүнгээр/.test(s)) || null;
}

function fixSoum(e, doc, log) {
  if (!(doc?.content || []).some((c) => /^heading/.test(c.nodeType))) return doc; // зөвхөн AI-аар бүтэцлэгдсэн сумд
  const out = JSON.parse(JSON.stringify(doc));
  const ns = nsoSoum(e);
  const walk = (node) => {
    for (let i = 0; i < (node.content || []).length; i++) {
      const ch = node.content[i];
      if (ch.nodeType === 'list-item') {
        const t = ownText(ch);
        const isPop = (POP_LABEL.test(t) || /^Сумын хэмжээнд [\d.,]+ (орчим|гаруй) (суурин )?хүн ам/.test(t)) && /\d/.test(t);
        const isLive = LIVE_LABEL.test(t) && /\d/.test(t);
        if (isPop || isLive) {
          let rep = null;
          if (ns && isPop) rep = LI(bold('Хүн ам: '), T(`${fmt(ns.population)} хүн (2025 оны байдлаар, ҮСХ)`));
          else if (ns && isLive && ns.livestock['Бүгд'] != null) rep = LI(bold('Малын тоо толгой: '), T(livestockText(ns.livestock)));
          else if (isPop) { const s = ticPopSentence(e); if (s) rep = LI(bold('Хүн ам: '), T(s)); }
          if (rep) { node.content[i] = rep; log(isPop ? 'хүн ам' : 'мал', t, lib.plain(rep)); }
          else { node.content.splice(i--, 1); log((isPop ? 'хүн ам' : 'мал') + ' (хассан)', t, ''); }
          continue;
        }
      }
      walk(ch);
    }
  };
  walk(out);
  return out;
}

const FIELD = { province: 'description2', soum: 'body' };
function transform(e, fields, log) {
  const ct = e.sys.contentType.sys.id;
  const f = FIELD[ct];
  const doc = fields[f]?.[lib.L];
  if (!doc) return null;
  const nd = ct === 'province' ? fixProvince(e, doc, log) : fixSoum(e, doc, log);
  return JSON.stringify(nd) === JSON.stringify(doc) ? null : { field: f, doc: nd };
}

module.exports = { transform, VERIFIED_NUMBERS, CONTACTS };

if (require.main === module) (async () => {
  const targets = snap.filter((e) => FIELD[e.sys.contentType.sys.id] && (!ONLY.length || ONLY.includes(e.sys.id)));
  if (DRY) {
    const rows = [];
    const tally = {};
    for (const e of targets) {
      const log = (kind, before, after) => { rows.push([e.sys.id, lib.titleOf(e), kind, before.slice(0, 400), after.slice(0, 400)]); tally[kind] = (tally[kind] || 0) + 1; };
      transform(e, e.fields, log);
    }
    writeCsv(path.join(ROOT, 'docs', 'plan', 'stat-fixes.csv'), ['entry_id', 'гарчиг', 'төрөл', 'өмнө', 'дараа'], rows);
    console.log('мөр', rows.length, 'entry', new Set(rows.map((r) => r[0])).size, tally);
    return;
  }
  if (!APPLY) throw new Error('--dry эсвэл --apply');
  const { cma, LOCALE } = require('../tic/_cma');
  const BK = path.join(ROOT, 'backups', `stat-fix-${DAY}`);
  fs.mkdirSync(BK, { recursive: true });
  const res = { нийтэлсэн: 0, 'draft сэргээсэн': 0, өөрчлөлтгүй: 0, алдаа: 0 };
  for (const t of targets) {
    try {
      const d = await cma('GET', `/entries/${t.sys.id}`);
      const p = await cma('GET', `/public/entries/${t.sys.id}`);
      if (!p) { console.log(t.sys.id, 'нийтлэгдсэн хувилбар алга'); continue; }
      const fixP = transform(d, p.fields, () => {});
      if (!fixP) { res.өөрчлөлтгүй++; continue; }
      fs.writeFileSync(path.join(BK, `${t.sys.id}.json`), JSON.stringify({ draft: d, published: p }));
      const pendingOther = Object.keys({ ...d.fields, ...p.fields }).some((k) => JSON.stringify(d.fields[k]) !== JSON.stringify(p.fields[k]));
      const pubFields = { ...p.fields, [fixP.field]: { ...p.fields[fixP.field], [LOCALE]: fixP.doc } };
      const s1 = await cma('PUT', `/entries/${t.sys.id}`, { body: { fields: pubFields }, version: d.sys.version });
      const s2 = await cma('PUT', `/entries/${t.sys.id}/published`, { version: s1.sys.version });
      res.нийтэлсэн++;
      if (pendingOther) {
        const fixD = transform(d, d.fields, () => {});
        const dFields = fixD ? { ...d.fields, [fixD.field]: { ...d.fields[fixD.field], [LOCALE]: fixD.doc } } : d.fields;
        await cma('PUT', `/entries/${t.sys.id}`, { body: { fields: dFields }, version: s2.sys.version });
        res['draft сэргээсэн']++;
      }
      console.log(t.sys.id, lib.titleOf(t), 'нийтэлсэн', pendingOther ? '+ draft сэргээсэн' : '');
    } catch (err) { res.алдаа++; console.log(t.sys.id, 'АЛДАА', err.message.slice(0, 300)); if (/хязгаар/.test(err.message)) break; }
  }
  console.log(res);
})().catch((e) => { console.error(e.message); process.exit(1); });

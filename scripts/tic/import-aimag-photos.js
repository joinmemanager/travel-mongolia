// Аймгийн гэрэл зураг (C:\project\aimag-photos, эзэмшигчийн өгсөн) → Contentful asset (Draft) + entry-ийн hero.
// Эх хавтсыг зөвхөн уншина. Ажлын хуулбар: backups/aimag-photos-work/orig (khovd.JPG → khovd.jpg),
// шахсан хувилбар: backups/aimag-photos-work/out (ffmpeg, ≤2400px өргөн, -q:v 4 ≈ 82 чанар).
//   node scripts/tic/import-aimag-photos.js --dry
//   node scripts/tic/import-aimag-photos.js
//
// Дүрэм:
//  - Өргөн ≥1600 → hero; 1000–1599 → тавина, «сайжруулах» жагсаалтад; <1000 → тавихгүй (out/-д байхгүй).
//  - Аймгийн entry: image = шинэ зураг. Хуучин зураг (TIC-ийн ≈250px сүлд) шинэ `emblem` талбарт шилжинэ
//    (hero дээрх тэмдэг хэвээр). AI зураг (lib/images.ts AI_GENERATED_ASSETS) emblem болохгүй, зүгээр салгана.
//  - Asset-ийг устгахгүй. Credit хоосон: description-д «Эх сурвалж тодорхойгүй — хожим шалгах».
//  - AI зургийг салгах: шинэ зураг байвал түүгээр, байхгүй бол entry-ийн TIC текст доторх анхны жинхэнэ зургаар.
//  - Бүх entry өөрчлөлт Draft (publish хийхгүй). Idempotent: asset id = aimag-photo-<файл>.
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, SPACE, LOCALE, callCount } = require('./_cma');
const { checkBudget } = require('./_budget');

const DRY = process.argv.includes('--dry');
const OUT = path.join(ROOT, 'backups', 'aimag-photos-work', 'out');
const L = (v) => ({ [LOCALE]: v });
const link = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } });

const AI = new Set(['c1kNqs1F0kZsJ2GwI75dL', '2DfCKQeyEDZFLyeDch34Ub', '1aRanjwjSe3WPQxHJkAqQN', '6obUtjtdKxPBMU4vzrPu2a']);

const TITLES = {
  arkhangai: 'Архангай аймаг', 'bayan-ulgii': 'Баян-Өлгий аймаг', bayankhongor: 'Баянхонгор аймаг', bulgan: 'Булган аймаг',
  'darkhan-uul': 'Дархан-Уул аймаг', dornod: 'Дорнод аймаг', dundgov: 'Дундговь аймаг', 'gov-altai': 'Говь-Алтай аймаг',
  govsumber: 'Говьсүмбэр аймаг', tuv: 'Төв аймаг', ulaanbaatar: 'Улаанбаатар', umnugov: 'Өмнөговь аймаг',
  uvurkhangai: 'Өвөрхангай аймаг', 'sukhbaatar-square': 'Сүхбаатарын талбай',
};

// Тусгай зураг → entry (province биш)
const SPECIAL = [
  { file: 'sukhbaatar-square', type: 'destination', id: '4E7saPDvAwtwwnw0GFpQSg', field: 'coverImage', path: '/destination/sukhbaataryn-talbai' },
  // Дархан-Уулын destination-ий AI зургийг аймгийн шинэ зургаар
  { file: 'darkhan-uul', type: 'destination', id: '5z3JM5JvdnFX4cUieV9Mrc', field: 'coverImage', path: '/destination/5z3JM5JvdnFX4cUieV9Mrc' },
];
// Шинэ зураг нь <1000px тул тавиагүй: AI зургийг салгаж, TIC текст доторх анхны жинхэнэ зургийг тавина
const AI_TO_TIC = [
  { type: 'destination', id: '6tDLtOe6nWOzZDT0sdGMd', field: 'coverImage', rich: 'description', path: '/destination/terelj', note: 'terelj.jpg 960px' },
  { type: 'heritagePlace', id: '3t2W7uicg4pU7wXuhVuE4M', field: 'image', rich: 'description', path: '/destination/heritage/place/orkhony-khundii', note: 'orkhon-valley.jpg 960px' },
  { type: 'province', id: '4kjZDmnAqA2SQ7vZQi9g9A', field: 'image', rich: 'description2', path: '/province/khovd', note: 'khovd.jpg 960px' },
];

async function ensureEmblemField() {
  const ct = await cma('GET', '/content_types/province');
  if (ct.fields.some((f) => f.id === 'emblem')) return;
  if (DRY) return console.log('[dry] province.emblem талбар нэмнэ');
  const field = { id: 'emblem', name: 'Сүлд (hero дээрх тэмдэг)', type: 'Link', linkType: 'Asset', localized: false, required: false, disabled: false, omitted: false, validations: [{ linkMimetypeGroup: ['image'] }] };
  const { name, description, displayField } = ct;
  const upd = await cma('PUT', '/content_types/province', { version: ct.sys.version, body: { name, description, displayField, fields: [...ct.fields, field] } });
  await cma('PUT', '/content_types/province/published', { version: upd.sys.version });
  console.log('province.emblem талбар нэмэв');
}

async function ensurePhoto(name) {
  const id = `aimag-photo-${name}`;
  const cur = await cma('GET', `/assets/${id}`);
  if (cur?.fields?.file?.[LOCALE]?.url) return { id, created: false };
  if (DRY) return { id, created: true };
  const buf = fs.readFileSync(path.join(OUT, `${name}.jpg`));
  const up = await cma('POST', `https://upload.contentful.com/spaces/${SPACE}/uploads`, { raw: buf });
  const body = {
    fields: {
      title: L(TITLES[name]),
      description: L(`Эх сурвалж тодорхойгүй — хожим шалгах (aimag-photos/${name}.jpg)`),
      file: L({ contentType: 'image/jpeg', fileName: `${name}.jpg`, uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: up.sys.id } } }),
    },
  };
  const a = cur ? await cma('PUT', `/assets/${id}`, { version: cur.sys.version, body }) : await cma('PUT', `/assets/${id}`, { body });
  await cma('PUT', `/assets/${id}/files/${LOCALE}/process`, { version: a.sys.version });
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const x = await cma('GET', `/assets/${id}`);
    if (x.fields?.file?.[LOCALE]?.url) return { id, created: true };
  }
  throw new Error(`${id}: процесс дуусаагүй`);
}

function firstEmbeddedAsset(doc) {
  let found = null;
  const walk = (n) => {
    if (found || !n || typeof n !== 'object') return;
    if (n.nodeType === 'embedded-asset-block' && n.data?.target?.sys?.id && !AI.has(n.data.target.sys.id)) found = n.data.target.sys.id;
    (n.content || []).forEach(walk);
  };
  walk(doc);
  return found;
}

async function setFields(id, patch) {
  const cur = await cma('GET', `/entries/${id}`);
  if (DRY) return cur;
  await cma('PUT', `/entries/${id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...patch } } });
  return cur;
}

(async () => {
  const files = fs.readdirSync(OUT).filter((f) => f.endsWith('.jpg')).map((f) => f.replace(/\.jpg$/, ''));
  await checkBudget(files.length, 'аймгийн зураг');
  await ensureEmblemField();
  const provinces = (await cma('GET', '/entries?content_type=province&limit=100')).items;
  const bySlug = Object.fromEntries(provinces.map((p) => [fv(p, 'slug'), p]));
  const result = { placed: [], detached: [] };

  for (const name of files) {
    const asset = await ensurePhoto(name);
    const p = bySlug[name];
    if (p) {
      const old = fv(p, 'image')?.sys.id;
      const patch = { image: L(link(asset.id)) };
      let oldNote = old || '—';
      if (old && old !== asset.id) {
        if (AI.has(old)) { result.detached.push({ asset: old, entry: `province ${name}`, path: `/province/${name}`, by: asset.id }); oldNote = `${old} (AI, салгав)`; }
        else if (!fv(p, 'emblem')) { patch.emblem = L(link(old)); oldNote = `${old} → emblem`; }
      }
      if (old !== asset.id) await setFields(p.sys.id, patch);
      result.placed.push({ file: `${name}.jpg`, asset: asset.id, entry: p.sys.id, path: `/province/${name}`, old: oldNote });
      console.log(`${DRY ? '[dry] ' : ''}province ${name}: image ← ${asset.id} (хуучин ${oldNote})`);
    }
    for (const s of SPECIAL.filter((x) => x.file === name)) {
      const cur = await cma('GET', `/entries/${s.id}`);
      const old = fv(cur, s.field)?.sys.id;
      if (old !== asset.id) await setFields(s.id, { [s.field]: L(link(asset.id)) });
      if (old && AI.has(old)) result.detached.push({ asset: old, entry: `${s.type} ${s.id}`, path: s.path, by: asset.id });
      result.placed.push({ file: `${name}.jpg`, asset: asset.id, entry: s.id, path: s.path, old: old || '—' });
      console.log(`${DRY ? '[dry] ' : ''}${s.type} ${s.path}: ${s.field} ← ${asset.id} (хуучин ${old})`);
    }
  }

  for (const x of AI_TO_TIC) {
    const cur = await cma('GET', `/entries/${x.id}`);
    const old = fv(cur, x.field)?.sys.id;
    if (!old || !AI.has(old)) { console.log(`${x.path}: AI зураг аль хэдийн салсан`); continue; }
    const tic = firstEmbeddedAsset(fv(cur, x.rich));
    await setFields(x.id, { [x.field]: tic ? L(link(tic)) : undefined });
    result.detached.push({ asset: old, entry: `${x.type} ${x.id}`, path: x.path, by: tic || '(зураггүй)', note: x.note });
    console.log(`${DRY ? '[dry] ' : ''}${x.path}: AI ${old} салгав → ${tic || 'зураггүй'}`);
  }

  fs.writeFileSync(path.join(ROOT, 'backups', 'tic-cache', 'aimag-photos-result.json'), JSON.stringify(result, null, 2), 'utf8');
  console.log(`тавьсан ${result.placed.length}, AI салгасан ${result.detached.length}, CMA ${callCount()}`);
})().catch((e) => { console.error(e.message); process.exit(1); });

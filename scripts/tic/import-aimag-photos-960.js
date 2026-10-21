// Эзэмшигчийн өгсөн 960px өргөнтэй зургууд (өмнө нь «жижиг тул тавиагүй») → Contentful asset (Draft) + entry.
// Шахалт өмнөхтэй ижил: ffmpeg -q:v 4, EXIF хассан → backups/aimag-photos-work/out960/.
//   node scripts/tic/import-aimag-photos-960.js [--dry]
// - Аймаг (9): image = шинэ зураг, хуучин зураг (TIC сүлд) → emblem (emblem хоосон бол). Hero-д 900px+ зөвшөөрнө
//   (app/province/[id]/page.tsx heroSized).
// - terelj, orkhon-valley: destination / heritagePlace-ийн зураг (AI-г салгасны дараа тавьсан TIC зургийн оронд).
// - naadam: Шангри-Ла зургийг салгасан «Үндэсний Их Баяр Наадам», «Аймгийн наадам».
// - darkhan: тусдаа entry алга (Дархан-Уул аймагт 6000px зураг бий) → тавихгүй.
// Asset устгахгүй. Idempotent: asset id = aimag-photo-<файл>, аль хэдийн тавьсан бол алгасна.
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, SPACE, LOCALE } = require('./_cma');

const DRY = process.argv.includes('--dry');
const OUT = path.join(ROOT, 'backups', 'aimag-photos-work', 'out960');
const L = (v) => ({ [LOCALE]: v });
const link = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } });
const AI = new Set(['c1kNqs1F0kZsJ2GwI75dL', '2DfCKQeyEDZFLyeDch34Ub', '1aRanjwjSe3WPQxHJkAqQN', '6obUtjtdKxPBMU4vzrPu2a']);

const PROVINCES = {
  dornogov: 'Дорноговь аймаг', khentii: 'Хэнтий аймаг', khovd: 'Ховд аймаг', khuvsgul: 'Хөвсгөл аймаг', orkhon: 'Орхон аймаг',
  selenge: 'Сэлэнгэ аймаг', sukhbaatar: 'Сүхбаатар аймаг', uvs: 'Увс аймаг', zavkhan: 'Завхан аймаг',
};
const OTHER = [
  { file: 'terelj', title: 'Тэрэлж', targets: [{ id: '6tDLtOe6nWOzZDT0sdGMd', field: 'coverImage', path: '/destination/terelj' }] },
  { file: 'orkhon-valley', title: 'Орхоны хөндий', targets: [{ id: '3t2W7uicg4pU7wXuhVuE4M', field: 'image', path: '/destination/heritage/place/orkhony-khundii' }] },
  {
    file: 'naadam', title: 'Наадмын хурдан морь',
    targets: [
      { id: '7k1ezXLz9V1IM1rJDumXTi', field: 'image', path: 'cultureHeritage «Үндэсний Их Баяр Наадам» (нүүр)' },
      { id: '1ciXvnhrbkitFPRJkd7J28', field: 'image', path: 'recommendation «Аймгийн наадам»' },
    ],
  },
];

async function ensurePhoto(name, title) {
  const id = `aimag-photo-${name}`;
  const cur = await cma('GET', `/assets/${id}`);
  if (cur?.fields?.file?.[LOCALE]?.url) return id;
  if (DRY) return id;
  const buf = fs.readFileSync(path.join(OUT, `${name}.jpg`));
  const up = await cma('POST', `https://upload.contentful.com/spaces/${SPACE}/uploads`, { raw: buf });
  const body = {
    fields: {
      title: L(title),
      description: L(`Эх сурвалж тодорхойгүй — хожим шалгах (aimag-photos/${name}.jpg, 960px — сайжруулах)`),
      file: L({ contentType: 'image/jpeg', fileName: `${name}.jpg`, uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: up.sys.id } } }),
    },
  };
  const a = cur ? await cma('PUT', `/assets/${id}`, { version: cur.sys.version, body }) : await cma('PUT', `/assets/${id}`, { body });
  await cma('PUT', `/assets/${id}/files/${LOCALE}/process`, { version: a.sys.version });
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const x = await cma('GET', `/assets/${id}`);
    if (x.fields?.file?.[LOCALE]?.url) return id;
  }
  throw new Error(`${id}: процесс дуусаагүй`);
}

async function put(e, patch) {
  if (DRY) return;
  await cma('PUT', `/entries/${e.sys.id}`, { version: e.sys.version, body: { fields: { ...e.fields, ...patch } } });
}

(async () => {
  const provinces = (await cma('GET', '/entries?content_type=province&limit=100')).items;
  const bySlug = Object.fromEntries(provinces.map((p) => [fv(p, 'slug'), p]));
  const placed = [];
  for (const [name, title] of Object.entries(PROVINCES)) {
    const p = bySlug[name];
    if (!p) { console.log('аймаг олдсонгүй', name); continue; }
    const asset = await ensurePhoto(name, title);
    const old = fv(p, 'image')?.sys.id;
    if (old === asset) { console.log(`province ${name}: аль хэдийн`); placed.push(name); continue; }
    const patch = { image: L(link(asset)) };
    let note = old || '—';
    if (old && !AI.has(old) && !fv(p, 'emblem')) { patch.emblem = L(link(old)); note = `${old} → emblem`; }
    await put(p, patch);
    placed.push(name);
    console.log(`${DRY ? '[dry] ' : ''}province ${name}: image ← ${asset} (хуучин ${note})`);
  }
  for (const o of OTHER) {
    const asset = await ensurePhoto(o.file, o.title);
    for (const t of o.targets) {
      const e = await cma('GET', `/entries/${t.id}`);
      const old = fv(e, t.field)?.sys.id;
      if (old === asset) { console.log(`${t.path}: аль хэдийн`); continue; }
      await put(e, { [t.field]: L(link(asset)) });
      console.log(`${DRY ? '[dry] ' : ''}${t.path}: ${t.field} ← ${asset} (хуучин ${old || '—'})`);
    }
    placed.push(o.file);
  }
  console.log(`тавьсан файл ${placed.length}`);
})().catch((e) => { console.error(e.message); process.exit(1); });

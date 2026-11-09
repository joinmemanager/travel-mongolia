// Ажил D: «сайжруулах» гэсэн бүх зургийг эрэмбээр нь сайжруулж, эхний N-ийг Contentful-д солино.
// Эрэмбэ: нүүр хуудас → аймгийн hero → сумын hero → алдартай/хамгаалалттай газар → бусад (дотроо ашиглалтын тоогоор).
// Алхам: анхныг backups/images-original/ (эс бөгөөс татаж) → Real-ESRGAN x4plus 4× → lanczos 50% (= 2×)
//        → image-tone.js (хөнгөн CLAHE + ханалт, ≤2400 px, JPEG 85; ил тод PNG бол PNG, контрастгүй) → tmp/images-enhanced/<id>.<ext>
// Contentful: asset id, холбоос хэвээр, зөвхөн file-ийг солиод нийтэлнэ. Нийтлээгүй draft өөрчлөлттэй asset-ийн
//   нийтэлсэн хувилбар дээр файлыг солиод нийтэлж, draft-ыг шинэ файлтай нь буцааж хадгална.
// Явц: docs/plan/images-audit.csv-ийн «D_эрэмбэ», «сайжруулсан», «солисон» багана, 50 зураг тутамд хадгална.
//   node scripts/content/images-enhance-all.js --enhance [--limit=N]       # сайжруулна (GPU), Contentful-д хүрэхгүй
//   node scripts/content/images-enhance-all.js --replace --max=500         # сайжруулсныг эрэмбээр Contentful-д солино
//   (CMA_BUDGET_FILE / CMA_BUDGET_MAX-аар энэ ажлын хязгаарыг тавина)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { parseCsv, writeCsv } = require('../tic/_csv');
const { tone } = require('./image-tone');

const ROOT = path.resolve(__dirname, '..', '..');
const CSV = path.join(ROOT, 'docs', 'plan', 'images-audit.csv');
const ORIG = path.join(ROOT, 'backups', 'images-original');
const OUT = path.join(ROOT, 'tmp', 'images-enhanced');
const WORK = path.join(OUT, '_work');
const ESRGAN = 'C:/project/tools/realesrgan-ncnn-vulkan/realesrgan-ncnn-vulkan.exe';
const FF = (() => { const base = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Packages'); const d = fs.readdirSync(base).find((x) => x.startsWith('Gyan.FFmpeg')); const v = fs.readdirSync(path.join(base, d)).find((x) => x.startsWith('ffmpeg-')); return path.join(base, d, v, 'bin', 'ffmpeg.exe'); })();
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || '').split('=')[1];
const ENHANCE = process.argv.includes('--enhance');
const REPLACE = process.argv.includes('--replace');
const LIMIT = Number(arg('limit') || Infinity);
const MAX = Number(arg('max') || 500);
const sharp = require(path.join(ROOT, 'travel-mongolia', 'node_modules', 'sharp'));
fs.mkdirSync(ORIG, { recursive: true });
fs.mkdirSync(WORK, { recursive: true });

const text = fs.readFileSync(CSV, 'utf8');
let head = text.replace(/^\uFEFF/, '').split(/\r?\n/)[0].split(',');
const rows = parseCsv(text);
for (const h of ['D_эрэмбэ', 'сайжруулсан', 'солисон']) if (!head.includes(h)) head.push(h);
const save = () => writeCsv(CSV, head, rows.map((r) => head.map((h) => r[h] ?? '')));

const PROTECTED_RE = /^(destination|heritagePlace):|place:[^;]*\((image|body)/;
function group(r) {
  const w = r['хаана_ашиглагдсан'] || '';
  if (/нүүр хуудас/.test(r['онцлох_байршил'])) return 0;
  if (/аймгийн hero/.test(r['онцлох_байршил'])) return 1;
  if (/soum:[^;]*\(image\)/.test(w)) return 2;
  if (PROTECTED_RE.test(w) || /(^|; )(destination|heritagePlace|place):/.test(w)) return 3;
  return 4;
}
const todo = rows.filter((r) => r['тэмдэглэгээ'] === 'сайжруулах' && /^image\/(jpeg|png|webp|gif)/.test(r['төрөл']));
todo.sort((a, b) => group(a) - group(b) || Number(b['ашигласан_тоо']) - Number(a['ашигласан_тоо']) || a.asset_id.localeCompare(b.asset_id));
todo.forEach((r, i) => { r['D_эрэмбэ'] = String(i + 1); });
save();

const extOf = (r) => (r['төрөл'] === 'image/png' ? 'png' : r['төрөл'] === 'image/gif' ? 'gif' : r['төрөл'] === 'image/webp' ? 'webp' : 'jpg');

async function enhanceOne(r) {
  const id = r.asset_id;
  const orig = path.join(ORIG, `${id}.${extOf(r)}`);
  if (!fs.existsSync(orig) || !fs.statSync(orig).size) {
    const res = await fetch(r.url, { signal: AbortSignal.timeout(60000) });
    if (!res.ok) throw new Error(`татаж чадсангүй ${res.status}`);
    fs.writeFileSync(orig, Buffer.from(await res.arrayBuffer()));
  }
  // GIF/WebP-ийг PNG болгож ESRGAN-д өгнө (эхний кадр)
  let src = orig;
  if (/gif|webp/.test(extOf(r))) { src = path.join(WORK, `${id}-in.png`); await sharp(orig).png().toFile(src); }
  const meta = await sharp(src).metadata();
  const alpha = meta.hasAlpha;
  const x4 = path.join(WORK, `${id}-x4.png`);
  const x2 = path.join(WORK, `${id}-x2.png`);
  execFileSync(ESRGAN, ['-i', src, '-o', x4, '-n', 'realesrgan-x4plus', '-s', '4', '-f', 'png'], { stdio: 'ignore' });
  execFileSync(FF, ['-loglevel', 'error', '-y', '-i', x4, '-vf', 'scale=iw/2:ih/2:flags=lanczos', x2]);
  let out;
  let stats = {};
  if (alpha) {
    out = path.join(OUT, `${id}.png`);
    await sharp(x2).resize({ width: 2400, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(out);
  } else {
    out = path.join(OUT, `${id}.jpg`);
    stats = await tone(x2, out);
  }
  for (const f of [x4, x2]) fs.rmSync(f, { force: true });
  if (src !== orig) fs.rmSync(src, { force: true });
  return { out, alpha, ...stats };
}

async function replaceOne(r, cma, SPACE, LOCALE) {
  const id = r.asset_id;
  const file = [path.join(OUT, `${id}.jpg`), path.join(OUT, `${id}.png`)].find((f) => fs.existsSync(f));
  if (!file) throw new Error('сайжруулсан файл алга');
  const buf = fs.readFileSync(file);
  const type = file.endsWith('.png') ? 'image/png' : 'image/jpeg';
  const d = await cma('GET', `/assets/${id}`);
  if (!d) throw new Error('asset алга');
  const pending = d.sys.publishedVersion && d.sys.version > d.sys.publishedVersion + 1;
  const p = pending ? await cma('GET', `/public/assets/${id}`) : null;
  const base = pending ? p : d;
  const oldName = (base.fields.file?.[LOCALE]?.fileName || id).replace(/\.[a-z0-9]+$/i, '');
  const up = await cma('POST', `https://upload.contentful.com/spaces/${SPACE}/uploads`, { raw: buf });
  const newFile = { contentType: type, fileName: `${oldName}.${type === 'image/png' ? 'png' : 'jpg'}`, uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: up.sys.id } } };
  const put = await cma('PUT', `/assets/${id}`, { version: d.sys.version, body: { fields: { ...base.fields, file: { ...base.fields.file, [LOCALE]: newFile } } } });
  await cma('PUT', `/assets/${id}/files/${LOCALE}/process`, { version: put.sys.version });
  let cur;
  for (let i = 0; i < 20; i++) {
    await new Promise((res) => setTimeout(res, 1500));
    cur = await cma('GET', `/assets/${id}`);
    if (cur.fields.file?.[LOCALE]?.url) break;
  }
  if (!cur.fields.file?.[LOCALE]?.url) throw new Error('боловсруулалт дуусаагүй');
  const pub = await cma('PUT', `/assets/${id}/published`, { version: cur.sys.version });
  if (pending) {
    // Нийтлээгүй draft-ын бусад талбарыг (alt г.м.) шинэ файлтай нь буцааж draft болгоно
    await cma('PUT', `/assets/${id}`, { version: pub.sys.version, body: { fields: { ...d.fields, file: cur.fields.file } } });
  }
  return { url: 'https:' + cur.fields.file[LOCALE].url, pending };
}

(async () => {
  if (ENHANCE) {
    // Өмнө нь (туршилт эсвэл тасарсан ажил) гарсан файлыг GPU-гаар дахин боловсруулахгүй
    for (const r of todo) if (!r['сайжруулсан'] && [`${r.asset_id}.jpg`, `${r.asset_id}.png`].some((f) => fs.existsSync(path.join(OUT, f)))) r['сайжруулсан'] = 'тийм өмнө';
    let n = 0;
    const t0 = Date.now();
    for (const r of todo) {
      if (r['сайжруулсан'] && r['сайжруулсан'] !== 'алдаа') continue;
      if (n >= LIMIT) break;
      const t = Date.now();
      try {
        const res = await enhanceOne(r);
        r['сайжруулсан'] = `тийм ${((Date.now() - t) / 1000).toFixed(0)}с${res.alpha ? ' png' : ''}`;
      } catch (e) { r['сайжруулсан'] = 'алдаа'; console.log(r.asset_id, 'АЛДАА', e.message.slice(0, 200)); }
      n++;
      if (n % 50 === 0) { save(); console.log(new Date().toISOString(), 'сайжруулсан', n, `${((Date.now() - t0) / n / 1000).toFixed(0)}с/зураг`); }
    }
    save();
    console.log('сайжруулсан', n);
  }
  if (REPLACE) {
    const { cma, SPACE, LOCALE } = require('../tic/_cma');
    let n = 0;
    for (const r of todo.slice(0, MAX)) {
      if (r['солисон'] === 'тийм') continue;
      if (!/^тийм/.test(r['сайжруулсан'] || '')) continue;
      // Asset-ийг хагас дутуу (нийтлээгүй) үлдээхгүйн тулд хязгаарт хүрэхээс өмнө зогсоно: нэг зурагт ≈6, боловсруулалт удвал ≤26 хүсэлт
      const bf = process.env.CMA_BUDGET_FILE;
      if (bf && fs.existsSync(bf) && Number(fs.readFileSync(bf, 'utf8').trim() || 0) + 30 > Number(process.env.CMA_BUDGET_MAX || Infinity)) { console.log('хязгаарт ойртсон тул зогслоо'); break; }
      try {
        const res = await replaceOne(r, cma, SPACE, LOCALE);
        r['солисон'] = 'тийм';
        n++;
        if (res.pending) console.log(r.asset_id, 'нийтэлсэн + draft сэргээсэн');
      } catch (e) {
        r['солисон'] = 'алдаа';
        console.log(r.asset_id, 'АЛДАА', e.message.slice(0, 200));
        if (/хязгаар/.test(e.message)) { r['солисон'] = ''; break; }
      }
      if (n % 50 === 0) save();
    }
    save();
    console.log('солисон', n);
  }
  if (!ENHANCE && !REPLACE) console.log('эрэмбэлсэн', todo.length, 'бүлгээр', [0, 1, 2, 3, 4].map((g) => todo.filter((r) => group(r) === g).length));
})().catch((e) => { save(); console.error(e.message); process.exit(1); });

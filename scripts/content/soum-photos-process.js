// Ажил C, 4–6-р алхам: Commons-оос татсан нэр дэвшигчдийг боловсруулж CSV, gallery.html гаргана.
//  - Чанарын үнэлгээ: өргөн, байт/пиксел (шахалт), Лапласын стандарт хазайлт (тодрол).
//  - 2000px-ээс нарийн БӨГӨӨД (бүдэг эсвэл шахалт ихтэй) → Real-ESRGAN 2× + хөнгөн тодруулга. Бусад → зөвхөн хөнгөн тодруулга
//    (image-tone, mix 0.5, ханалт 1.03; зураг доторх зүйлийг өөрчлөхгүй). Анхны файл хэвээр (<n>-original.jpg).
//  - docs/plan/soum-photos.csv, tmp/soum-photos/gallery.html, docs/plan/soum-photos-missing.csv
//   node scripts/content/soum-photos-process.js [--esrgan-max=N]
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { writeCsv } = require('../tic/_csv');
const { tone } = require('./image-tone');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'tmp', 'soum-photos');
const sharp = require(path.join(ROOT, 'travel-mongolia', 'node_modules', 'sharp'));
const ESRGAN = 'C:/project/tools/realesrgan-ncnn-vulkan/realesrgan-ncnn-vulkan.exe';
const FF = (() => { const base = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Packages'); const d = fs.readdirSync(base).find((x) => x.startsWith('Gyan.FFmpeg')); const v = fs.readdirSync(path.join(base, d)).find((x) => x.startsWith('ffmpeg-')); return path.join(base, d, v, 'bin', 'ffmpeg.exe'); })();
const ESRGAN_MAX = Number((process.argv.find((a) => a.startsWith('--esrgan-max=')) || '=0').split('=')[1]);

const data = JSON.parse(fs.readFileSync(path.join(OUT, 'candidates.json'), 'utf8'));
// Нүдээр шалгаад хассан нэр дэвшигчид (амьтан, цэцэг, хүн гол сэдэв, дэлгүүр, самбар, газрын зураг г.м.); файл нь хэвээр
const REJECTED = new Set(fs.existsSync(path.join(OUT, 'rejected.json')) ? JSON.parse(fs.readFileSync(path.join(OUT, 'rejected.json'), 'utf8')) : []);
const relOf = (f) => path.relative(ROOT, f).replace(/\\/g, '/');

async function quality(file) {
  const buf = fs.readFileSync(file);
  const m = await sharp(buf).metadata();
  const small = await sharp(buf).resize({ width: 1200, withoutEnlargement: true }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const { data: px, info } = small;
  let sum = 0, sum2 = 0, n = 0;
  for (let y = 1; y < info.height - 1; y++) for (let x = 1; x < info.width - 1; x++) {
    const i = y * info.width + x;
    const l = 4 * px[i] - px[i - 1] - px[i + 1] - px[i - info.width] - px[i + info.width];
    sum += l; sum2 += l * l; n++;
  }
  const sharpness = Math.sqrt(sum2 / n - (sum / n) ** 2);
  return { width: m.width, height: m.height, bpp: buf.length / (m.width * m.height), sharpness };
}

(async () => {
  const rows = [];
  const missing = [];
  let esr = 0;
  const gallery = [];
  for (const s of data) {
    const kept = s.candidates.some((c, i) => { const o = path.join(OUT, `${s.provinceSlug}-${s.slug}`, `${i + 1}-original.jpg`); return fs.existsSync(o) && !REJECTED.has(relOf(o)); });
    if (!kept) { missing.push([s.title, s.province, s.id, s.emblem ? 'сүлд' : s.hasImage ? 'зурагтай' : 'зураггүй', s.ownPage ? 'тийм' : 'үгүй']); continue; }
    const dir = path.join(OUT, `${s.provinceSlug}-${s.slug}`);
    const items = [];
    for (const [i, c] of s.candidates.entries()) {
      const orig = path.join(dir, `${i + 1}-original.jpg`);
      if (!fs.existsSync(orig) || REJECTED.has(relOf(orig))) continue;
      const q = await quality(orig);
      const weak = q.width < 2000 && (q.sharpness < 9 || q.bpp < 0.12);
      const enh = path.join(dir, `${i + 1}-enhanced.jpg`);
      let how = 'хөнгөн тодруулга';
      if (!fs.existsSync(enh)) {
        if (weak && esr < ESRGAN_MAX) {
          const x4 = path.join(dir, `_x4.png`), x2 = path.join(dir, `_x2.png`);
          execFileSync(ESRGAN, ['-i', orig, '-o', x4, '-n', 'realesrgan-x4plus', '-s', '4', '-f', 'png'], { stdio: 'ignore' });
          execFileSync(FF, ['-loglevel', 'error', '-y', '-i', x4, '-vf', 'scale=iw/2:ih/2:flags=lanczos', x2]);
          await tone(x2, enh, { mix: 0.5, saturation: 1.03 });
          fs.rmSync(x4, { force: true }); fs.rmSync(x2, { force: true });
          esr++;
          how = 'Real-ESRGAN 2× + хөнгөн тодруулга';
        } else {
          await tone(orig, enh, { mix: 0.5, saturation: 1.03 });
          if (weak) how = 'хөнгөн тодруулга (ESRGAN хүлээгдэж буй)';
        }
      } else if (weak) how = 'Real-ESRGAN 2× + хөнгөн тодруулга';
      const em = await sharp(enh).metadata();
      rows.push([s.title, s.province, s.id, s.emblem ? 'тийм' : 'үгүй', i + 1, c.file.replace(/^File:/, ''), c.page, c.artist, c.license, c.licenseUrl, c.description, `${q.width}×${q.height}`, `${em.width}×${em.height}`, q.sharpness.toFixed(1), q.bpp.toFixed(3), 'тийм', how, path.relative(ROOT, orig), path.relative(ROOT, enh), c.matched]);
      items.push({ i: i + 1, c, orig: path.relative(OUT, orig).replace(/\\/g, '/'), enh: path.relative(OUT, enh).replace(/\\/g, '/'), how });
    }
    gallery.push({ s, items });
  }
  writeCsv(path.join(ROOT, 'docs', 'plan', 'soum-photos.csv'), ['сум', 'аймаг', 'entry_id', 'одоо сүлдтэй', '#', 'файл', 'Commons хаяг', 'зохиогч', 'лиценз', 'лицензийн холбоос', 'тайлбар', 'анхны хэмжээ', 'шинэ хэмжээ', 'тодрол', 'байт/пиксел', 'өөрчилсөн', 'засвар', 'анхны файл', 'сайжруулсан файл', 'тааруулсан нэр'], rows);
  writeCsv(path.join(ROOT, 'docs', 'plan', 'soum-photos-missing.csv'), ['сум', 'аймаг', 'entry_id', 'одоогийн hero', 'тусдаа хуудас'], missing);

  // Одоогийн зураг: сумын image asset (images-audit.csv-ийн url)
  const urlOf = (assetUrlHint) => assetUrlHint;
  const esc = (t) => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const cur = JSON.parse(fs.readFileSync(path.join(ROOT, 'tmp', 'soum-hero-sheets', 'index.json'), 'utf8'));
  const curBy = new Map(cur.map((x) => [x.id, x.url]));
  const html = `<!DOCTYPE html><html lang="mn"><head><meta charset="utf-8"><title>Сумын зургийн нэр дэвшигчид (Wikimedia Commons)</title>
<style>body{font-family:system-ui,sans-serif;margin:24px;background:#f5f5f4;color:#1c1917}section{background:#fff;border-radius:12px;padding:16px;margin:16px 0}
h2{font-size:18px;margin:0 0 6px}.meta{font-size:12px;color:#57534e}.row{display:grid;grid-template-columns:200px 1fr;gap:16px;align-items:start}
.cands{display:grid;gap:12px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:8px}img{width:100%;height:auto;border-radius:8px;display:block}
.cur img{max-height:200px;object-fit:contain;background:#eee}figcaption{font-size:12px;color:#57534e;margin-top:3px}</style></head><body>
<h1>Сумын зургийн нэр дэвшигчид — Wikimedia Commons</h1><p class="meta">Contentful-д юу ч байршуулаагүй. Сум бүрт: зүүн талд одоогийн зураг, баруун талд нэр дэвшигч (анхны | сайжруулсан). Лиценз, зохиогчийг заавал дурдана.</p>
${gallery.map(({ s, items }) => `<section><h2>${esc(s.title)} · ${esc(s.province)}${s.emblem ? ' · одоо сүлдтэй' : ''}</h2><div class="row"><figure class="cur">${curBy.get(s.id) ? `<img src="${esc(curBy.get(s.id))}?w=400" alt="">` : '<div class="meta">зураггүй</div>'}<figcaption>Одоогийн зураг</figcaption></figure><div class="cands">
${items.map((x) => `<div><div class="pair"><figure><img src="${esc(x.orig)}" loading="lazy" alt=""><figcaption>${x.i}. Анхны</figcaption></figure><figure><img src="${esc(x.enh)}" loading="lazy" alt=""><figcaption>${esc(x.how)}</figcaption></figure></div>
<div class="meta"><a href="${esc(x.c.page)}">${esc(x.c.file)}</a> · ${esc(x.c.artist)} · ${esc(x.c.license)} · ${x.c.width}×${x.c.height}<br>${esc(x.c.description)}</div></div>`).join('')}</div></div></section>`).join('\n')}
</body></html>`;
  fs.writeFileSync(path.join(OUT, 'gallery.html'), html);
  console.log('нэр дэвшигч', rows.length, 'сум', gallery.length, 'олдоогүй', missing.length, 'ESRGAN', esr, 'сул (ESRGAN шаардлагатай)', rows.filter((r) => /Real-ESRGAN|хүлээгдэж/.test(r[16])).length);
})().catch((e) => { console.error(e.message); process.exit(1); });

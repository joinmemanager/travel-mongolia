// tmp/images-enhanced/compare.html: анхны (backups/images-original) ба Real-ESRGAN-ий 2× (tmp/images-enhanced) зургийг
// хажуу хажуугаар харуулна. Мөн timings.csv-ээс мегапиксел тутмын хугацааг гаргаж, «сайжруулах» гэсэн бүх зургийг
// хийхэд хэр удахыг docs/plan/images-audit.csv-ээс тооцно.
//   node scripts/content/images-compare.js
const fs = require('fs');
const path = require('path');
const { parseCsv } = require('../tic/_csv');

const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'tmp', 'images-enhanced');
const t = parseCsv(fs.readFileSync(path.join(OUT, 'timings.csv'), 'utf8'));
const audit = parseCsv(fs.readFileSync(path.join(ROOT, 'docs', 'plan', 'images-audit.csv'), 'utf8'));
const mp = (dim) => { const [w, h] = dim.split(/[x×]/).map(Number); return (w * h) / 1e6; };

const perMp = t.reduce((s, r) => s + Number(r['секунд']), 0) / t.reduce((s, r) => s + mp(r['анхны_хэмжээ']), 0);
const flagged = audit.filter((r) => r['тэмдэглэгээ'] === 'сайжруулах');
const totalMp = flagged.reduce((s, r) => s + mp(r['өргөн×өндөр']), 0);
// Жижиг зурагт загвар ачаалах ~2 секунд нэмэгдэнэ
const totalSec = totalMp * perMp + flagged.length * 2;
const est = { зураг: flagged.length, мегапиксел: +totalMp.toFixed(1), сек_МП: +perMp.toFixed(0), цаг: +(totalSec / 3600).toFixed(1), дундаж_сек: +(totalSec / flagged.length).toFixed(0) };

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const cards = t.map((r) => `
<section>
  <h2>${esc(r.asset_id)}</h2>
  <p class="meta">Анхны: ${esc(r['анхны_хэмжээ'])}, ${r['анхны_KB']} KB · Шинэ: ${esc(r['шинэ_хэмжээ'])}, ${r['шинэ_KB']} KB · ${r['секунд']} сек</p>
  <div class="pair">
    <figure><img src="../../backups/images-original/${esc(r['файл'])}" alt="Анхны ${esc(r.asset_id)}"><figcaption>Анхны (Contentful)</figcaption></figure>
    ${fs.existsSync(path.join(OUT, 'toned', r.asset_id + '-esrgan2x.jpg')) ? `<figure><img src="toned/${esc(r.asset_id)}-esrgan2x.jpg" alt="ESRGAN ${esc(r.asset_id)}"><figcaption>Real-ESRGAN 2× (контрастгүй)</figcaption></figure>` : ''}
    <figure><img src="${esc(r['файл'])}" alt="Сайжруулсан ${esc(r.asset_id)}"><figcaption>Real-ESRGAN 2× + хөнгөн CLAHE (slope 2, mix 0.8) + ханалт 1.04, JPEG 85</figcaption></figure>
  </div>
</section>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="mn"><head><meta charset="utf-8"><title>Зургийн сайжруулалт: анхны ба 2×</title>
<style>
body{font-family:system-ui,sans-serif;margin:24px;background:#f5f5f4;color:#1c1917}
h1{font-size:22px} section{background:#fff;border-radius:12px;padding:16px;margin:16px 0}
h2{font-size:16px;margin:0 0 4px} .meta{color:#57534e;font-size:13px;margin:0 0 12px}
.pair{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px} figure{margin:0}
/* Хоёуланг ижил өргөнөөр харуулна: анхны нь сунаж, шинэ нь багасна — нарийвчлалыг харьцуулах */
img{width:100%;height:auto;display:block;border-radius:8px;image-rendering:auto}
figcaption{font-size:12px;color:#57534e;margin-top:4px}
.note{font-size:14px;line-height:1.5}
</style></head><body>
<h1>Зургийн сайжруулалт (Ажил 6): анхны ба Real-ESRGAN 2×</h1>
<p class="note">Загвар: realesrgan-x4plus (realesrgan-ncnn-vulkan v0.2.5.0, GPU: Intel UHD). 4×-ээр гаргаад ffmpeg lanczos-оор 50% багасгаж нийт 2× болгосон.
Хоёр зураг ижил өргөнөөр харагдана: зургийг томруулж (Ctrl +) нарийн хэсгийг харьцуулна уу. Contentful-д юу ч байршуулаагүй.</p>
<p class="note"><b>Тооцоо:</b> дунджаар ${est.сек_МП} сек / мегапиксел. «Сайжруулах» гэсэн ${est.зураг} зураг (${est.мегапиксел} МП) → ойролцоогоор <b>${est.цаг} цаг</b> (зураг тутамд ~${est.дундаж_сек} сек, энэ компьютерийн GPU-гээр).</p>
${cards}
</body></html>`;
fs.writeFileSync(path.join(OUT, 'compare.html'), html);
console.log(path.join(OUT, 'compare.html'), est);

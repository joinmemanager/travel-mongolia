// Ажил D, 2-р алхам: Real-ESRGAN-ий 2× зурагт хөнгөн тохируулгат контраст (CLAHE) + бага зэрэг өнгөний ханалт,
// 2400px-ээс ихгүй өргөнтэй JPEG 85% болгоно. Цагаан/хар тасралтыг (0, 255 пикселийн хувь) хэмжиж буцаана.
//   const { tone } = require('./image-tone'); await tone(in, out, { slope, saturation })
//   node scripts/content/image-tone.js <in> <out> [slope=2] [mix=0.8] [saturation=1.04]
const path = require('path');
const sharp = require(path.join(__dirname, '..', '..', 'travel-mongolia', 'node_modules', 'sharp'));

const MAX_W = 2400;

async function clipStats(buf) {
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  let lo = 0, hi = 0;
  for (let i = 0; i < data.length; i++) { if (data[i] <= 2) lo++; else if (data[i] >= 253) hi++; }
  const n = info.width * info.height;
  return { black: +(100 * lo / n).toFixed(2), white: +(100 * hi / n).toFixed(2) };
}

async function tone(input, output, { slope = 2, mix = 0.8, saturation = 1.04, quality = 85 } = {}) {
  const meta = await sharp(input).metadata();
  const w = Math.min(meta.width, MAX_W);
  const resized = await sharp(input).resize({ width: w, withoutEnlargement: true }).toBuffer();
  // CLAHE-ийн хавтан: зургийн ≈1/8, maxSlope бага (1.4–2) байх тусам зөөлөн; арьс, тэнгэр хиймэл болохгүй
  const tile = Math.max(32, Math.round(w / 8));
  const h = Math.round((meta.height * w) / meta.width);
  // CLAHE-ийн үр дүнг анхныхтай mix харьцаагаар холино (0 = өөрчлөлтгүй, 1 = бүтэн CLAHE): илүү зөөлөн, байгалийн
  const base = await sharp(resized).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const eq = await sharp(resized).removeAlpha().clahe({ width: tile, height: Math.max(32, Math.round(h / 8)), maxSlope: Math.max(2, Math.round(slope)) }).raw().toBuffer();
  const mixed = Buffer.alloc(base.data.length);
  for (let i = 0; i < mixed.length; i++) mixed[i] = Math.round(base.data[i] * (1 - mix) + eq[i] * mix);
  const out = await sharp(mixed, { raw: base.info })
    .modulate({ saturation })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  require('fs').writeFileSync(output, out);
  return { width: w, before: await clipStats(resized), after: await clipStats(out), kb: Math.round(out.length / 1024) };
}

module.exports = { tone, clipStats };

if (require.main === module) {
  const [i, o, slope, mix, sat] = process.argv.slice(2);
  tone(i, o, { slope: slope ? Number(slope) : undefined, mix: mix ? Number(mix) : undefined, saturation: sat ? Number(sat) : undefined }).then((r) => console.log(JSON.stringify(r))).catch((e) => { console.error(e.message); process.exit(1); });
}

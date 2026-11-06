// Сумын hero зургийг нүдээр ангилах: бүх сумын image-ийг 160px-ээр татаж (Contentful CDN, CMA биш),
// дугаартай contact sheet болгоно → tmp/soum-hero-sheets/sheet-N.jpg, index.json (дугаар → сум, asset).
//   node scripts/content/soum-hero-sheets.js <snapshot-хавтас> <ffmpeg.exe>
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const lib = require('./_lib');

const [snapDir, FF] = process.argv.slice(2);
const S = path.join(lib.ROOT, 'backups', snapDir);
const E = JSON.parse(fs.readFileSync(path.join(S, 'entries.json'), 'utf8'));
const A = new Map(JSON.parse(fs.readFileSync(path.join(S, 'assets.json'), 'utf8')).map((a) => [a.sys.id, a]));
const byId = new Map(E.map((e) => [e.sys.id, e]));
const OUT = path.join(lib.ROOT, 'tmp', 'soum-hero-sheets');
const TH = path.join(OUT, 'thumbs');
fs.mkdirSync(TH, { recursive: true });

const list = [];
for (const e of E.filter((x) => x.sys.contentType.sys.id === 'soum')) {
  const aid = e.fields.image?.mn?.sys?.id;
  if (!aid) continue;
  const f = A.get(aid)?.fields?.file?.mn;
  if (!f?.url) continue;
  const p = byId.get(lib.fv(e, 'province')?.sys?.id);
  list.push({ n: list.length + 1, id: e.sys.id, soum: lib.titleOf(e), province: p ? lib.titleOf(p) : '', slug: lib.fv(e, 'slug'), provinceSlug: p ? lib.fv(p, 'slug') : '', ownPage: lib.fv(e, 'ownPage') === true, asset: aid, w: f.details?.image?.width, h: f.details?.image?.height, kb: Math.round((f.details?.size || 0) / 1024), url: 'https:' + f.url });
}
(async () => {
  for (const x of list) {
    const file = path.join(TH, `${String(x.n).padStart(3, '0')}.jpg`);
    if (fs.existsSync(file)) continue;
    for (let i = 1; i <= 4; i++) {
      try { const res = await fetch(`${x.url}?w=160&h=160&fit=pad&bg=rgb:ffffff&fm=jpg`, { signal: AbortSignal.timeout(30000) }); if (!res.ok) throw new Error(String(res.status)); fs.writeFileSync(file, Buffer.from(await res.arrayBuffer())); break; }
      catch (err) { if (i === 4) { console.log('татаж чадсангүй', x.n, x.soum, err.message); fs.copyFileSync(path.join(TH, '001.jpg'), file); } else await new Promise((r) => setTimeout(r, 2000 * i)); }
    }
  }
  // 8×6 = 48 зураг нэг хуудсанд, зураг бүрийн доор дугаар
  const per = 48;
  for (let s = 0; s * per < list.length; s++) {
    const part = list.slice(s * per, (s + 1) * per);
    const args = ['-y', '-loglevel', 'error'];
    for (const x of part) args.push('-i', path.join(TH, `${String(x.n).padStart(3, '0')}.jpg`));
    const filters = part.map((x, i) => `[${i}]scale=160:160,pad=160:184:0:0:white,drawtext=text='${x.n}':x=6:y=164:fontsize=18:fontcolor=red:fontfile='C\\:/Windows/Fonts/arial.ttf'[v${i}]`);
    while (filters.length < per) { const i = filters.length; filters.push(`color=white:s=160x184[v${i}]`); }
    const layout = Array.from({ length: per }, (_, i) => `${(i % 8) * 160}_${Math.floor(i / 8) * 184}`).join('|');
    const fc = filters.join(';') + ';' + Array.from({ length: per }, (_, i) => `[v${i}]`).join('') + `xstack=inputs=${per}:layout=${layout}`;
    execFileSync(FF, [...args, '-filter_complex', fc, '-frames:v', '1', path.join(OUT, `sheet-${s + 1}.jpg`)]);
  }
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(list, null, 1));
  console.log(list.length, 'зураг,', Math.ceil(list.length / per), 'хуудас →', OUT);
})().catch((e) => { console.error(e.message); process.exit(1); });

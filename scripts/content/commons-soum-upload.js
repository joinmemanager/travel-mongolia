// Ажил C2: батлагдсан Commons-ийн сумын зургийг (docs/plan/soum-photos.csv, 128 зураг) Ажил D-ийн аргаар сайжруулж,
// Contentful-д НООРОГ asset болгон байршуулж, сумын entry-д НООРОГоор холбоно. Юу ч нийтлэхгүй.
//   node scripts/content/commons-soum-upload.js --enhance      # GPU: <n>-original.jpg → <n>-d.jpg (Contentful-д хүрэхгүй)
//   node scripts/content/commons-soum-upload.js --upload       # asset үүсгэнэ (draft), зохиогч/лицензийг description-д
//   node scripts/content/commons-soum-upload.js --link [--dry] # сумын entry-д холбоно (draft)
// Сайжруулалт: анхныг ≤1200px болгоод Real-ESRGAN x4plus 4× → lanczos 50% (= 2×) → image-tone (CLAHE + ханалт, ≤2400px, JPEG 85).
// Asset: id = commons-<хавтас>-<n>, title = «<Сум>, <Аймаг>», description = «Зураг: <зохиогч>, <лиценз>, Wikimedia Commons | <файлын хуудас>»
//   (lib/imageCredit.ts үүнийг зургийн доор харуулна; лиценз нь зохиогчийн нэр шаарддаг тул хасахгүй).
// Холбох дүрэм (entry бүрийн одоогийн төлвөөр):
//   - image хоосон / сүлд (SOUM_EMBLEM_ASSETS) / газрын зураг, хөрөг (SOUM_NOT_HERO_ASSETS) → image = Commons-ийн 1-р зураг.
//     Сүлдийг travel-mongolia/lib/soumEmblems.ts-д (сум → сүлдний URL) хадгалж, тэмдэг болгон үлдээнэ.
//   - бодит зурагтай → hero-г солихгүй.
//   - body-ийн төгсгөлд галерей: hero болоогүй Commons зургууд. ownPage=false сумын hero харагддаггүй тул бүгдийг нэмнэ.
// Entry-ийн анхны хувилбар: backups/commons-soum-originals/<id>.json. Явц: soum-photos.csv-ийн «D_файл», «asset_id», «холбосон» багана.
// CMA тоолуур: CMA_BUDGET_FILE / CMA_BUDGET_MAX (Ажил 1-ийнхтэй хуваалцана, 5,700-д зогсоно).
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { parseCsv, writeCsv } = require('../tic/_csv');
const { tone } = require('./image-tone');

const ROOT = path.resolve(__dirname, '..', '..');
const CSV = path.join(ROOT, 'docs', 'plan', 'soum-photos.csv');
const BACKUP = path.join(ROOT, 'backups', 'commons-soum-originals');
const EMBLEM_TS = path.join(ROOT, 'travel-mongolia', 'lib', 'soumEmblems.ts');
const ESRGAN = 'C:/project/tools/realesrgan-ncnn-vulkan/realesrgan-ncnn-vulkan.exe';
const FF = (() => { const base = path.join(process.env.LOCALAPPDATA, 'Microsoft', 'WinGet', 'Packages'); const d = fs.readdirSync(base).find((x) => x.startsWith('Gyan.FFmpeg')); const v = fs.readdirSync(path.join(base, d)).find((x) => x.startsWith('ffmpeg-')); return path.join(base, d, v, 'bin', 'ffmpeg.exe'); })();
const sharp = require(path.join(ROOT, 'travel-mongolia', 'node_modules', 'sharp'));
const has = (k) => process.argv.includes(`--${k}`);
const DRY = has('dry');

const text = fs.readFileSync(CSV, 'utf8');
const head = text.replace(/^\uFEFF/, '').split(/\r?\n/)[0].split(',');
const rows = parseCsv(text);
for (const h of ['D_файл', 'asset_id', 'холбосон']) if (!head.includes(h)) head.push(h);
const abs = (rel) => path.join(ROOT, ...rel.split(/[\\/]/));
const dirOf = (r) => path.basename(path.dirname(abs(r['анхны файл'])));
const dPath = (r) => path.join(path.dirname(abs(r['анхны файл'])), `${r['#']}-d.jpg`);
// --enhance ажиллаж байх үед CSV-г тэр процесс бичдэг тул --upload/--link төлвөө тусдаа JSON-д хадгална.
// --csv: төлвийг (болон бэлэн файлуудыг) CSV-д нэгтгэнэ (сайжруулалт дууссаны дараа).
const STATE = path.join(ROOT, 'tmp', 'soum-photos', 'c2-state.json');
const key = (r) => `${dirOf(r)}-${r['#']}`;
const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : {};
if (!has('enhance')) for (const r of rows) Object.assign(r, state[key(r)] || {});
const writeCsvNow = () => writeCsv(CSV, head, rows.map((r) => head.map((h) => r[h] ?? '')));
const save = () => {
  if (DRY) return;
  if (has('enhance')) return writeCsvNow();
  for (const r of rows) if (r['asset_id'] || r['холбосон']) state[key(r)] = { asset_id: r['asset_id'] || '', 'холбосон': r['холбосон'] || '' };
  fs.writeFileSync(STATE, JSON.stringify(state, null, 1));
};

async function enhance(r) {
  const orig = abs(r['анхны файл']);
  const dir = path.dirname(orig);
  const out = path.join(dir, `${r['#']}-d.jpg`);
  const inp = path.join(dir, `${r['#']}-in.png`);
  const x4 = path.join(dir, `${r['#']}-x4.png`);
  const x2 = path.join(dir, `${r['#']}-x2.png`);
  await sharp(orig).rotate().resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true }).png().toFile(inp);
  execFileSync(ESRGAN, ['-i', inp, '-o', x4, '-n', 'realesrgan-x4plus', '-s', '4', '-f', 'png'], { stdio: 'ignore' });
  execFileSync(FF, ['-loglevel', 'error', '-y', '-i', x4, '-vf', 'scale=iw/2:ih/2:flags=lanczos', x2]);
  await tone(x2, out);
  for (const f of [inp, x4, x2]) fs.rmSync(f, { force: true });
  return out;
}

function soumHeroSets() {
  const src = fs.readFileSync(path.join(ROOT, 'travel-mongolia', 'lib', 'soumHeroImages.ts'), 'utf8');
  const [a, b] = src.split('SOUM_NOT_HERO_ASSETS');
  const ids = (s) => new Set([...(s || '').matchAll(/'(tic-img-\w+)'/g)].map((m) => m[1]));
  return { emblem: ids(a), notHero: ids(b) };
}

(async () => {
  if (has('enhance')) {
    let n = 0;
    for (const r of rows) {
      const out = path.join(path.dirname(abs(r['анхны файл'])), `${r['#']}-d.jpg`);
      if (fs.existsSync(out)) { r['D_файл'] = path.relative(ROOT, out); continue; }
      try { await enhance(r); r['D_файл'] = path.relative(ROOT, out); n++; } catch (e) { r['D_файл'] = 'алдаа'; console.log(dirOf(r), r['#'], 'АЛДАА', e.message.slice(0, 200)); }
      if (n % 10 === 0) save();
    }
    save();
    console.log('сайжруулсан', n, 'нийт бэлэн', rows.filter((r) => /-d\.jpg$/.test(r['D_файл'])).length);
  }

  if (has('csv')) {
    for (const r of rows) if (fs.existsSync(dPath(r))) r['D_файл'] = path.relative(ROOT, dPath(r));
    writeCsvNow();
    console.log('CSV шинэчилсэн');
  }

  if (has('upload') || has('link')) {
    const { cma, SPACE, LOCALE } = require('../tic/_cma');
    const L = LOCALE;
    if (has('upload')) {
      let n = 0;
      for (const r of rows) {
        if (r['asset_id']) continue;
        if (!fs.existsSync(dPath(r))) continue; // сайжруулалт хараахан дуусаагүй
        const id = `commons-${dirOf(r)}-${r['#']}`;
        if (DRY) { console.log('dry', id); continue; }
        try {
          let a = await cma('GET', `/assets/${id}`);
          if (!a) {
            const up = await cma('POST', `https://upload.contentful.com/spaces/${SPACE}/uploads`, { raw: fs.readFileSync(dPath(r)) });
            const credit = `Зураг: ${r['зохиогч']}, ${r['лиценз']}, Wikimedia Commons | ${r['Commons хаяг']}`;
            const fields = {
              title: { [L]: `${r['сум']}, ${r['аймаг']}` },
              description: { [L]: `${credit}\nCommons-ийн тайлбар: ${r['тайлбар']}` },
              file: { [L]: { contentType: 'image/jpeg', fileName: `${id}.jpg`, uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: up.sys.id } } } },
            };
            a = await cma('PUT', `/assets/${id}`, { body: { fields } });
          }
          if (!a.fields.file?.[L]?.url) {
            await cma('PUT', `/assets/${id}/files/${L}/process`, { version: a.sys.version });
            for (let i = 0; i < 15; i++) {
              await new Promise((res) => setTimeout(res, 2000));
              a = await cma('GET', `/assets/${id}`);
              if (a.fields.file?.[L]?.url) break;
            }
          }
          if (!a.fields.file?.[L]?.url) throw new Error('боловсруулалт дуусаагүй');
          r['asset_id'] = id; n++;
        } catch (e) {
          console.log(id, 'АЛДАА', e.message.slice(0, 200));
          if (/хязгаар/.test(e.message)) break;
        }
        save();
      }
      console.log('байршуулсан (draft)', n);
    }

    if (has('link')) {
      const { emblem, notHero } = soumHeroSets();
      fs.mkdirSync(BACKUP, { recursive: true });
      const bySoum = new Map();
      for (const r of rows) (bySoum.get(r.entry_id) || bySoum.set(r.entry_id, []).get(r.entry_id)).push(r);
      const emblems = fs.existsSync(path.join(BACKUP, 'emblems.json')) ? JSON.parse(fs.readFileSync(path.join(BACKUP, 'emblems.json'), 'utf8')) : {};
      const link = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } });
      const block = (id) => ({ nodeType: 'embedded-asset-block', data: { target: link(id) }, content: [] });
      let n = 0;
      for (const [entryId, rs] of bySoum) {
        if (rs.every((r) => r['холбосон'])) continue;
        const ready = rs.filter((r) => r['asset_id']);
        if (ready.length < rs.length) { console.log(entryId, rs[0]['сум'], 'алгасав: бүх asset бэлэн биш'); continue; }
        try {
          const e = await cma('GET', `/entries/${entryId}`);
          if (!e) throw new Error('entry алга');
          const bak = path.join(BACKUP, `${entryId}.json`);
          if (!DRY && !fs.existsSync(bak)) fs.writeFileSync(bak, JSON.stringify(e));
          const cur = e.fields.image?.[L]?.sys?.id;
          const own = e.fields.ownPage?.[L] === true;
          const state = !cur ? 'зураггүй' : emblem.has(cur) ? 'сүлд' : notHero.has(cur) ? 'газрын зураг/хөрөг' : 'бодит зураг';
          const ids = ready.map((r) => r['asset_id']);
          let hero = null;
          if (state !== 'бодит зураг') {
            hero = ids[0];
            if (state === 'сүлд' && !emblems[entryId]) {
              const ea = await cma('GET', `/public/assets/${cur}`) || await cma('GET', `/assets/${cur}`);
              const u = ea?.fields?.file?.[L]?.url;
              if (u) emblems[entryId] = { assetId: cur, url: u.startsWith('//') ? `https:${u}` : u, soum: rs[0]['сум'] };
            }
            e.fields.image = { ...(e.fields.image || {}), [L]: link(hero) };
          }
          const gallery = ids.filter((id) => !(own && id === hero));
          const body = e.fields.body?.[L] || { nodeType: 'document', data: {}, content: [] };
          const present = new Set(JSON.stringify(body).match(/commons-[\w-]+/g) || []);
          const add = gallery.filter((id) => !present.has(id));
          if (add.length) e.fields.body = { ...(e.fields.body || {}), [L]: { ...body, content: [...body.content, ...add.map(block)] } };
          const note = `${state}; ${hero ? `hero=${hero}` : 'hero хэвээр'}; галерей +${add.length}${own ? '' : ' (тусдаа хуудасгүй)'}`;
          if (DRY) { console.log(entryId, rs[0]['сум'], note); continue; }
          await cma('PUT', `/entries/${entryId}`, { body: { fields: e.fields }, version: e.sys.version });
          for (const r of rs) r['холбосон'] = r['asset_id'] === hero ? `hero; ${note}` : `галерей; ${note}`;
          n++;
          console.log(entryId, rs[0]['сум'], note);
        } catch (err) {
          console.log(entryId, 'АЛДАА', err.message.slice(0, 200));
          if (/хязгаар/.test(err.message)) break;
        }
        save();
      }
      if (!DRY) {
        fs.writeFileSync(path.join(BACKUP, 'emblems.json'), JSON.stringify(emblems, null, 1));
        const lines = Object.entries(emblems).sort().map(([k, v]) => `  '${k}': { assetId: '${v.assetId}', url: '${v.url}' }, // ${v.soum}`);
        fs.writeFileSync(EMBLEM_TS, `// Commons зургийг hero болгосон сумдын сүлд (scripts/content/commons-soum-upload.js --link үүсгэнэ).\n// Entry-ийн image нь бодит зураг болсон тул сүлдийг гарчгийн дээрх дугуй тэмдэг болгон эндээс харуулна.\nexport const SOUM_EMBLEMS: Readonly<Record<string, { assetId: string; url: string }>> = {\n${lines.join('\n')}\n};\n`);
      }
      console.log('холбосон сум', n);
    }
  }
})().catch((e) => { save(); console.error('АЛДАА:', e.message); process.exit(1); });

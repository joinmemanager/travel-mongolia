// Аймаг бүрийн сумдыг шалгана: Contentful-ийн soum entry-ийн тоо (тусдаа хуудастай / жагсаалтад) ба
// lib/provinceFacts.ts-ийн «soums» (Wikipedia «Districts of Mongolia») тоо. Сайтын URL өгвөл аймгийн
// хуудас бүрийн «Сумд» хэсэгт entry бүрийн анкер (id="<slug>") байгаа эсэхийг мөн шалгана.
//   node scripts/tic/check-soums.js [http://localhost:3123]
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT } = require('./_cma');

const SITE = process.argv[2];

// provinceFacts.ts-ээс slug → { name, soums }
function provinceFacts() {
  const src = fs.readFileSync(path.join(ROOT, 'travel-mongolia', 'lib', 'provinceFacts.ts'), 'utf8');
  const out = {};
  const re = /^\s*'?([a-z-]+)'?: \{ name: '([^']+)'(.*)$/gm;
  for (let m; (m = re.exec(src)); ) out[m[1]] = { name: m[2], soums: Number(/soums: (\d+)/.exec(m[3])?.[1]) || null };
  return out;
}

(async () => {
  const facts = provinceFacts();
  const provinces = (await cma('GET', '/entries?content_type=province&limit=200')).items;
  const soums = (await cma('GET', '/entries?content_type=soum&limit=1000')).items;
  const rows = [];
  for (const p of provinces.sort((a, b) => fv(a, 'slug').localeCompare(fv(b, 'slug')))) {
    const slug = fv(p, 'slug');
    const mine = soums.filter((s) => fv(s, 'province')?.sys?.id === p.sys.id);
    const own = mine.filter((s) => fv(s, 'ownPage') === true);
    const expected = facts[slug]?.soums ?? null;
    const row = { slug, name: fv(p, 'title'), total: mine.length, ownPage: own.length, list: mine.length - own.length, expected, missingOnPage: [] };
    if (SITE && mine.length) {
      const html = await (await fetch(`${SITE}/province/${slug}`)).text();
      for (const s of mine) if (!html.includes(`id="${fv(s, 'slug')}"`)) row.missingOnPage.push(fv(s, 'title'));
      row.titles = mine.map((s) => fv(s, 'title')).sort((a, b) => a.localeCompare(b, 'mn'));
    }
    rows.push(row);
  }
  for (const r of rows) {
    const diff = r.expected == null ? '' : r.total - r.expected;
    console.log(
      `${r.name.padEnd(18)} нийт ${String(r.total).padStart(3)} (хуудас ${String(r.ownPage).padStart(2)}, жагсаалт ${String(r.list).padStart(2)})  provinceFacts ${r.expected ?? '—'}${diff ? `  зөрүү ${diff > 0 ? '+' : ''}${diff}` : ''}${SITE ? `  хуудсанд дутуу: ${r.missingOnPage.length ? r.missingOnPage.join(', ') : 0}` : ''}`
    );
  }
  fs.writeFileSync(path.join(process.env.CHECK_OUT || '.', 'check-soums.json'), JSON.stringify(rows, null, 2), 'utf8');
})().catch((e) => { console.error(e.message); process.exit(1); });

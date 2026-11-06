// ҮСХ-ны (1212.mn PxWeb) json-stat2 файлуудаас аймаг, сумын 2025 оны хүн ам, малын тоог нэгтгэнэ → data/nso/aimag-soum-2025.json
//   node scripts/content/nso-build.js <pop.json> <livestock.json>
// Эх хүснэгт: DT_NSO_0300_004V5 (оршин суугаа хүн ам, баг/хороо, жил), DT_NSO_1001_021V1 (малын тоо, малын төрөл, баг/хороо, жил).
// Бүсийн код: 1 орон = бүс, 3 орон = аймаг/нийслэл, 5 орон = сум/дүүрэг, 7 орон = баг/хороо.
const fs = require('fs');
const path = require('path');

const [popFile, liveFile] = process.argv.slice(2);
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// json-stat2-ийн утгыг хэмжээсийн кодоор авах функц
function accessor(ds) {
  const ids = ds.id;
  const sizes = ds.size;
  const idx = ids.map((id) => ds.dimension[id].category.index);
  return (coords) => {
    let off = 0;
    for (let i = 0; i < ids.length; i++) {
      const pos = typeof idx[i] === 'object' && !Array.isArray(idx[i]) ? idx[i][coords[ids[i]]] : idx[i].indexOf(coords[ids[i]]);
      off = off * sizes[i] + pos;
    }
    return ds.value[off];
  };
}
const dim = (ds, re) => ds.id.find((d) => re.test(ds.dimension[d].label || d));

const pop = read(popFile);
const live = read(liveFile);
const pRegion = dim(pop, /Бүс/);
const pLoc = dim(pop, /Байршил/);
const pYear = dim(pop, /Он/);
const lRegion = dim(live, /Бүс/);
const lType = dim(live, /төрөл/);
const lYear = dim(live, /Он/);
const getP = accessor(pop);
const getL = accessor(live);
const label = (ds, d, code) => ds.dimension[d].category.label[code];
const firstCode = (ds, d) => Object.keys(ds.dimension[d].category.label)[0];

const yearP = label(pop, pYear, firstCode(pop, pYear));
const yearL = label(live, lYear, firstCode(live, lYear));
const types = Object.keys(live.dimension[lType].category.label);

const out = { source: {
  population: { table: 'DT_NSO_0300_004V5', title: pop.label, year: yearP, url: 'https://data.1212.mn/pxweb/mn/NSO/NSO__Population,%20household__1_Population,%20household/DT_NSO_0300_004V5.px/' },
  livestock: { table: 'DT_NSO_1001_021V1', title: live.label, year: yearL, url: 'https://data.1212.mn/pxweb/mn/NSO/NSO__Industry,%20service__Livestock/DT_NSO_1001_021V1.px/' },
}, aimags: {} };

const byCode = {};
for (const code of Object.keys(pop.dimension[pRegion].category.label)) {
  const name = label(pop, pRegion, code);
  if (code.length !== 3 && code.length !== 5) continue;
  const population = getP({ [pRegion]: code, [pLoc]: firstCode(pop, pLoc), [pYear]: firstCode(pop, pYear) });
  const livestock = {};
  for (const t of types) {
    const v = live.dimension[lRegion].category.label[code] !== undefined ? getL({ [lRegion]: code, [lType]: t, [lYear]: firstCode(live, lYear) }) : null;
    livestock[label(live, lType, t)] = v ?? null;
  }
  if (code.length === 3) { out.aimags[name] = { code, name, population, livestock, soums: {} }; byCode[code] = out.aimags[name]; }
  else if (byCode[code.slice(0, 3)]) byCode[code.slice(0, 3)].soums[name] = { code, population, livestock };
}
const OUT = path.resolve(__dirname, '..', '..', 'data', 'nso', 'aimag-soum-2025.json');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
const a = Object.values(out.aimags);
console.log(OUT, 'аймаг', a.length, 'сум', a.reduce((s, x) => s + Object.keys(x.soums).length, 0), 'он', yearP, yearL);
console.log(a.slice(0, 3).map((x) => `${x.name}: ${x.population}, мал ${x.livestock['Бүгд']}`).join(' | '));
const k = out.aimags['Хэнтий']?.soums['Дадал'];
console.log('Хэнтий/Дадал', JSON.stringify(k));

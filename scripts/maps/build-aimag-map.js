// Монголын 21 аймаг + Улаанбаатарын SVG газрын зургийг (lib/aimagMap.ts) үүсгэнэ.
// Эх сурвалж: Natural Earth 1:10m Admin 1 – States, Provinces v5.1.2 (public domain,
// https://www.naturalearthdata.com/about/terms-of-use/). Лиценз: docs/maps/README.md.
//
//   curl -L -o <хавтас>/admin1.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_1_states_provinces.geojson
//   node scripts/maps/build-aimag-map.js <хавтас>/admin1.geojson
//
// Mercator проекц, 400×250 px, Douglas–Peucker хялбарчлал (TOLERANCE px), координат 0.1 px.
const fs = require('fs');
const path = require('path');
const { geoMercator, geoPath } = require('../../travel-mongolia/node_modules/d3-geo');

const SRC = process.argv[2];
const OUT = path.resolve(__dirname, '..', '..', 'travel-mongolia', 'lib', 'aimagMap.ts');
const WIDTH = 400;
const HEIGHT = 215;
const TOLERANCE = 0.35;

// ISO 3166-2 код → Contentful-ийн slug, монгол нэр
const BY_ISO = {
  'MN-073': ['arkhangai', 'Архангай'],
  'MN-071': ['bayan-ulgii', 'Баян-Өлгий'],
  'MN-069': ['bayankhongor', 'Баянхонгор'],
  'MN-067': ['bulgan', 'Булган'],
  'MN-065': ['gov-altai', 'Говь-Алтай'],
  'MN-064': ['govsumber', 'Говьсүмбэр'],
  'MN-037': ['darkhan-uul', 'Дархан-Уул'],
  'MN-063': ['dornogov', 'Дорноговь'],
  'MN-061': ['dornod', 'Дорнод'],
  'MN-059': ['dundgov', 'Дундговь'],
  'MN-057': ['zavkhan', 'Завхан'],
  'MN-035': ['orkhon', 'Орхон'],
  'MN-055': ['uvurkhangai', 'Өвөрхангай'],
  'MN-053': ['umnugov', 'Өмнөговь'],
  'MN-051': ['sukhbaatar', 'Сүхбаатар'],
  'MN-049': ['selenge', 'Сэлэнгэ'],
  'MN-047': ['tuv', 'Төв'],
  'MN-046': ['uvs', 'Увс'],
  'MN-043': ['khovd', 'Ховд'],
  'MN-041': ['khuvsgul', 'Хөвсгөл'],
  'MN-039': ['khentii', 'Хэнтий'],
  'MN-1': ['ulaanbaatar', 'Улаанбаатар'],
};

function simplify(points, tol) {
  if (points.length < 4) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy);
    let max = 0;
    let idx = -1;
    for (let i = a + 1; i < b; i++) {
      // Хаалттай цагирагийн эхлэл = төгсгөл үед цэг хүртэлх зай
      const d = len
        ? Math.abs(dy * points[i][0] - dx * points[i][1] + bx * ay - by * ax) / len
        : Math.hypot(points[i][0] - ax, points[i][1] - ay);
      if (d > max) { max = d; idx = i; }
    }
    if (max > tol && idx > 0) {
      keep[idx] = 1;
      stack.push([a, idx], [idx, b]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

const r1 = (n) => Math.round(n * 10) / 10;

const geo = JSON.parse(fs.readFileSync(SRC, 'utf8'));
const features = geo.features.filter((f) => f.properties.adm0_a3 === 'MNG');
const fc = { type: 'FeatureCollection', features };
const projection = geoMercator().fitExtent([[4, 4], [WIDTH - 4, HEIGHT - 4]], fc);

const out = [];
for (const f of features) {
  const iso = f.properties.iso_3166_2;
  const info = BY_ISO[iso];
  if (!info) throw new Error(`Танигдаагүй ISO код: ${iso} (${f.properties.name})`);
  const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
  let d = '';
  for (const poly of polys) {
    for (const ring of poly) {
      const pts = simplify(ring.map((c) => projection(c)), TOLERANCE).map(([x, y]) => [r1(x), r1(y)]);
      if (pts.length < 4) continue;
      d += 'M' + pts.slice(0, -1).map(([x, y], i) => (i ? `${x} ${y}` : `${x} ${y}`)).join('L') + 'Z';
    }
  }
  const [cx, cy] = geoPath(projection).centroid(f);
  out.push({ slug: info[0], name: info[1], d, label: [r1(cx), r1(cy)] });
}
out.sort((a, b) => a.slug.localeCompare(b.slug));
if (out.length !== 22) throw new Error(`22 нэгж байх ёстой, ${out.length} олдлоо`);

const body = `// Автоматаар үүсгэсэн: scripts/maps/build-aimag-map.js. Гараар бүү засаарай.
// Эх сурвалж: Natural Earth 1:10m Admin 1 v5.1.2, public domain (docs/maps/README.md).
// Mercator проекц, viewBox 0 0 ${WIDTH} ${HEIGHT}.

export interface AimagShape {
  slug: string;
  name: string;
  d: string;
  label: [number, number];
}

export const AIMAG_MAP_VIEWBOX = '0 0 ${WIDTH} ${HEIGHT}';

export const AIMAG_SHAPES: AimagShape[] = ${JSON.stringify(out)};
`;
fs.writeFileSync(OUT, body, 'utf8');
console.log(`${OUT}: ${(Buffer.byteLength(body) / 1024).toFixed(1)} KB, ${out.length} нэгж`);

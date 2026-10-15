// Аймаг бүрийн дундаж өндөршлийг тооцоолно (lib/provinceFacts.ts-ийн elevation).
// Арга: Natural Earth-ийн аймгийн хил доторх тэгш торон цэгүүд (аймаг бүрт ≈250) →
// Open-Meteo Elevation API (Copernicus DEM GLO-90, 90 м) → энгийн дундаж, 10 м-ээр бөөрөнхийлнө.
//   node scripts/maps/aimag-elevation.js <хавтас>/admin1.geojson <үр_дүн.json>
// Үр дүнг аймаг бүрийн дараа хадгална: тасарвал дахин ажиллуулахад үргэлжилнэ.
const fs = require('fs');
const { geoContains, geoBounds } = require('../../travel-mongolia/node_modules/d3-geo');

const SRC = process.argv[2];
const OUT = process.argv[3];
const TARGET_POINTS = 250;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const geo = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const features = geo.features.filter((f) => f.properties.adm0_a3 === 'MNG');
  const result = OUT && fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
  for (const f of features) {
    if (result[f.properties.iso_3166_2]) continue;
    const [[w, s], [e, n]] = geoBounds(f);
    // Торны алхам: хил доторх цэг TARGET_POINTS орчим болтол багасгана
    let step = Math.sqrt(((e - w) * (n - s)) / TARGET_POINTS);
    let pts = [];
    for (let attempt = 0; attempt < 4; attempt++) {
      pts = [];
      for (let lat = s + step / 2; lat < n; lat += step) {
        for (let lon = w + step / 2; lon < e; lon += step) {
          if (geoContains(f, [lon, lat])) pts.push([lat, lon]);
        }
      }
      if (pts.length >= TARGET_POINTS * 0.8) break;
      step *= Math.sqrt(Math.max(pts.length, 1) / TARGET_POINTS);
    }
    const heights = [];
    for (let i = 0; i < pts.length; i += 100) {
      const chunk = pts.slice(i, i + 100);
      const url = `https://api.open-meteo.com/v1/elevation?latitude=${chunk.map((p) => p[0].toFixed(4)).join(',')}&longitude=${chunk.map((p) => p[1].toFixed(4)).join(',')}`;
      const get = async () => { for (let t = 0; ; t++) { try { return await fetch(url); } catch (e) { if (t > 4) throw e; await sleep(20000); } } };
      let res = await get();
      for (let t = 0; res.status === 429 && t < 6; t++) { await sleep(65000); res = await get(); }
      if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
      heights.push(...(await res.json()).elevation.filter((h) => Number.isFinite(h)));
      await sleep(12000);
    }
    const mean = heights.reduce((a, b) => a + b, 0) / heights.length;
    result[f.properties.iso_3166_2] = { name: f.properties.name, points: heights.length, mean: Math.round(mean / 10) * 10 };
    console.error(f.properties.iso_3166_2, f.properties.name, heights.length, Math.round(mean));
    if (OUT) fs.writeFileSync(OUT, JSON.stringify(result, null, 1));
  }
  console.log(JSON.stringify(result, null, 1));
})().catch((e) => { console.error(e); process.exit(1); });

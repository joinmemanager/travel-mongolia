// Contentful-ийн бүх entry, asset, content type-ийг CMA-аас уншиж backups/contentful-snapshot-<огноо>/-д хадгална.
// Зөвхөн GET. Token хэвлэхгүй.
//   node scripts/content/snapshot.js
const fs = require('fs');
const path = require('path');
const { cma, ROOT, callCount } = require('../tic/_cma');

const day = new Date().toISOString().slice(0, 10);
const OUT = path.join(ROOT, 'backups', `contentful-snapshot-${day}`);

async function all(kind) {
  const items = [];
  let limit = 1000;
  for (let skip = 0; ; ) {
    let r;
    try {
      r = await cma('GET', `/${kind}?limit=${limit}&skip=${skip}&order=sys.createdAt`);
    } catch (e) {
      if (limit > 100 && /size|too large|400/i.test(e.message)) { limit = Math.floor(limit / 2); continue; }
      throw e;
    }
    items.push(...r.items);
    skip += r.items.length;
    if (skip >= r.total || !r.items.length) break;
  }
  return items;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const types = await all('content_types');
  const entries = await all('entries');
  const assets = await all('assets');
  fs.writeFileSync(path.join(OUT, 'content-types.json'), JSON.stringify(types));
  fs.writeFileSync(path.join(OUT, 'entries.json'), JSON.stringify(entries));
  fs.writeFileSync(path.join(OUT, 'assets.json'), JSON.stringify(assets));
  const meta = { at: new Date().toISOString(), calls: callCount(), types: types.length, entries: entries.length, assets: assets.length };
  fs.writeFileSync(path.join(OUT, 'meta.json'), JSON.stringify(meta, null, 1));
  console.log(OUT, meta);
})().catch((e) => { console.error(e.message); process.exit(1); });

// TIC 1б багцыг Contentful-д нийтэлнэ: бүх soum entry (20 аймгийн сум + Улаанбаатарын дүүргүүд; Архангайнх
// 1-р багцаар аль хэдийн нийтлэгдсэн) ба тэдгээрийн asset-ууд (image, body доторх зураг).
//   node scripts/tic/publish-batch01b.js --dry   # юу нийтлэгдэхийг жагсаана
//   node scripts/tic/publish-batch01b.js         # нийтэлнэ (asset → сум)
// Entry бүрийн Publish нь webhook-оор /api/revalidate-ийг дуудна. Холбогдсон province entry нийтлэгдээгүй
// бол алдаа өгнө.
const { cma, fv } = require('./_cma');

const DRY = process.argv.includes('--dry');

function assetIds(fields) {
  const ids = new Set();
  const walk = (n) => {
    if (!n || typeof n !== 'object') return;
    if (n.sys?.type === 'Link' && n.sys.linkType === 'Asset') ids.add(n.sys.id);
    for (const v of Object.values(n)) walk(v);
  };
  walk(fields);
  return ids;
}

const isPublishedClean = (x) => x.sys.publishedVersion && x.sys.version === x.sys.publishedVersion + 1;

async function publish(kind, item) {
  if (isPublishedClean(item)) return 'аль хэдийн';
  if (DRY) return 'dry';
  await cma('PUT', `/${kind}/${item.sys.id}/published`, { version: item.sys.version });
  return 'нийтлэв';
}

(async () => {
  const soums = (await cma('GET', '/entries?content_type=soum&limit=1000')).items;
  const provinces = (await cma('GET', '/entries?content_type=province&limit=200')).items;
  const unpublished = new Set(provinces.filter((p) => !p.sys.publishedVersion).map((p) => p.sys.id));
  const orphan = soums.filter((s) => unpublished.has(fv(s, 'province')?.sys?.id));
  if (orphan.length) throw new Error(`аймаг нь нийтлэгдээгүй сум: ${orphan.map((s) => fv(s, 'slug')).join(', ')}`);
  const assets = new Set();
  for (const e of soums) for (const id of assetIds(e.fields)) assets.add(id);
  console.log(`сум ${soums.length}, asset ${assets.size}${DRY ? ' (dry)' : ''}`);
  const count = {};
  const tally = (k) => (count[k] = (count[k] || 0) + 1);
  for (const id of assets) {
    const a = await cma('GET', `/assets/${id}`);
    if (!a) { tally('asset олдсонгүй'); console.log('  asset олдсонгүй', id); continue; }
    tally(`asset ${await publish('assets', a)}`);
  }
  for (const s of soums) {
    const r = await publish('entries', await cma('GET', `/entries/${s.sys.id}`));
    tally(`сум ${r}`);
  }
  console.log(count);
})().catch((e) => { console.error(e.message); process.exit(1); });

// TIC 1-р багцыг Contentful-д нийтэлнэ: 21 аймаг (province) + Архангайн тусдаа хуудастай сумд
// (soum, ownPage=true) болон тэдгээрийн холбогдсон asset-ууд (image, rich text доторх зураг).
//   node scripts/tic/publish-batch01.js --dry   # юу нийтлэгдэхийг жагсаана
//   node scripts/tic/publish-batch01.js         # нийтэлнэ (asset → аймаг → сум дарааллаар)
// Entry бүрийн Publish нь webhook-оор /api/revalidate-ийг дуудна.
const { cma, fv } = require('./_cma');

const DRY = process.argv.includes('--dry');
const PROVINCE_SLUGS = ['arkhangai', 'bayan-ulgii', 'bayankhongor', 'bulgan', 'darkhan-uul', 'dornod', 'dornogov', 'dundgov', 'gov-altai', 'govsumber', 'khentii', 'khovd', 'khuvsgul', 'orkhon', 'umnugov', 'uvurkhangai', 'selenge', 'sukhbaatar', 'tuv', 'uvs', 'zavkhan'];

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
  const provinces = (await cma('GET', '/entries?content_type=province&limit=200')).items.filter((e) => PROVINCE_SLUGS.includes(fv(e, 'slug')));
  if (provinces.length !== 21) throw new Error(`21 аймаг байх ёстой, ${provinces.length} олдлоо`);
  const provinceIds = new Set(provinces.map((p) => p.sys.id));
  const soums = (await cma('GET', '/entries?content_type=soum&limit=200')).items.filter(
    (s) => fv(s, 'ownPage') === true && provinceIds.has(fv(s, 'province')?.sys?.id)
  );
  const assets = new Set();
  for (const e of [...provinces, ...soums]) for (const id of assetIds(e.fields)) assets.add(id);
  console.log(`аймаг ${provinces.length}, сум ${soums.length}, asset ${assets.size}${DRY ? ' (dry)' : ''}`);

  for (const id of assets) {
    const a = await cma('GET', `/assets/${id}`);
    if (!a) { console.log('  asset олдсонгүй', id); continue; }
    console.log('  asset', id, await publish('assets', a));
  }
  for (const p of provinces) {
    const cur = await cma('GET', `/entries/${p.sys.id}`);
    console.log('  province', fv(cur, 'slug'), await publish('entries', cur));
  }
  for (const s of soums) {
    const cur = await cma('GET', `/entries/${s.sys.id}`);
    console.log('  soum', fv(cur, 'slug'), await publish('entries', cur));
  }
})().catch((e) => { console.error(e.message); process.exit(1); });

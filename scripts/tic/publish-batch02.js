// TIC 2-р багцыг Contentful-д нийтэлнэ: бүх historyArticle (44) ба тэдгээрийн asset-ууд (image, body доторх зураг).
//   node scripts/tic/publish-batch02.js --dry   # юу нийтлэгдэхийг жагсаана
//   node scripts/tic/publish-batch02.js         # нийтэлнэ (asset → нийтлэл)
// Entry бүрийн Publish нь webhook-оор /api/revalidate-ийг дуудна.
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
  const articles = (await cma('GET', '/entries?content_type=historyArticle&limit=200')).items;
  const assets = new Set();
  for (const e of articles) for (const id of assetIds(e.fields)) assets.add(id);
  console.log(`нийтлэл ${articles.length}, asset ${assets.size}${DRY ? ' (dry)' : ''}`);
  const count = {};
  for (const id of assets) {
    const r = await publish('assets', await cma('GET', `/assets/${id}`));
    count[`asset ${r}`] = (count[`asset ${r}`] || 0) + 1;
  }
  for (const e of articles) {
    const r = await publish('entries', await cma('GET', `/entries/${e.sys.id}`));
    count[`нийтлэл ${r}`] = (count[`нийтлэл ${r}`] || 0) + 1;
    if (r !== 'аль хэдийн') console.log('  ', fv(e, 'slug'), r);
  }
  console.log(count);
})().catch((e) => { console.error(e.message); process.exit(1); });

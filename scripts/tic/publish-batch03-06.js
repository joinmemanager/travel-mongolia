// TIC 3, 5, 6-р сэдвийг Contentful-д нийтэлнэ:
//   place, species (бүгд), heritagePlace tic-c9-* (хотын дурсгалт газар), heritageCategory city-monuments,
//   нэгтгэсэн 5 entry (Тэрэлж, Хөвсгөл нуур, Сүхбаатарын талбай, Бурхан Халдун, Орхоны хөндий),
//   тэдгээрийн бүх asset (image, body/description доторх зураг).
//   node scripts/tic/publish-batch03-06.js --dry   # юу нийтлэгдэхийг тоолно
//   node scripts/tic/publish-batch03-06.js         # нийтэлнэ: asset → газар/зүйл → ангилал (холбоос задрахын тулд)
// Entry бүрийн Publish нь webhook-оор /api/revalidate (мөн IndexNow)-ийг дуудна. 4 зэрэг хүсэлт.
const { cma } = require('./_cma');
const { EXISTING } = require('./_batch03-06');

const DRY = process.argv.includes('--dry');
const CONCURRENCY = 4;

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

async function all(path) {
  const out = [];
  for (let skip = 0; ; skip += 500) {
    const res = await cma('GET', `${path}${path.includes('?') ? '&' : '?'}limit=500&skip=${skip}`);
    out.push(...res.items);
    if (skip + 500 >= res.total) break;
  }
  return out;
}

async function pool(items, fn) {
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < items.length) await fn(items[next++]);
  }));
}

const count = {};
const bump = (k) => { count[k] = (count[k] || 0) + 1; };

async function publish(kind, item, label) {
  if (isPublishedClean(item)) return bump(`${label} аль хэдийн`);
  if (DRY) return bump(`${label} нийтлэх`);
  try {
    await cma('PUT', `/${kind}/${item.sys.id}/published`, { version: item.sys.version });
    bump(`${label} нийтлэв`);
  } catch (e) {
    bump(`${label} АЛДАА`);
    console.log('  алдаа', kind, item.sys.id, e.message.slice(0, 200));
  }
}

(async () => {
  const places = await all('/entries?content_type=place');
  const species = await all('/entries?content_type=species');
  const heritage = (await all('/entries?content_type=heritagePlace')).filter((e) => e.sys.id.startsWith('tic-c9-'));
  const merged = await Promise.all(Object.values(EXISTING).map((x) => cma('GET', `/entries/${x.id}`)));
  const category = await cma('GET', '/entries/tic-heritage-city-monuments');
  const entries = [...places, ...species, ...heritage, ...merged];

  const assets = new Set();
  for (const e of [...entries, category]) for (const id of assetIds(e.fields)) assets.add(id);
  console.log(`place ${places.length}, species ${species.length}, heritagePlace ${heritage.length}, нэгтгэсэн ${merged.length}, ангилал 1, asset ${assets.size}${DRY ? ' (dry)' : ''}`);

  await pool([...assets], async (id) => publish('assets', await cma('GET', `/assets/${id}`), 'asset'));
  await pool(entries, async (e) => publish('entries', await cma('GET', `/entries/${e.sys.id}`), e.sys.contentType.sys.id));
  await publish('entries', await cma('GET', '/entries/tic-heritage-city-monuments'), 'heritageCategory');
  console.log(count);
})().catch((e) => { console.error(e.message); process.exit(1); });

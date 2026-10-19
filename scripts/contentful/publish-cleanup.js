// Placeholder цэвэрлэгээг (scripts/contentful/placeholders.js --apply) нийтэлнэ:
// Улаанбаатар (province) болон 3 өвийн газар (heritagePlace). Мөн цэвэрлэгээнээс үлдсэн
// загварын утгуудыг Draft-д хоосолно:
//  - Улаанбаатарын highlights «Алтай Таван Богд, Потанины мөсөн гол» (Улаанбаатарт хамаарахгүй)
//  - asset-ийн description «бла бла бла»
//   node scripts/contentful/publish-cleanup.js --dry
//   node scripts/contentful/publish-cleanup.js
const { cma, fv, LOCALE } = require('../tic/_cma');

const DRY = process.argv.includes('--dry');
const ENTRIES = ['0VbEWiwTyIIqS5SXEmK1e', '3t2W7uicg4pU7wXuhVuE4M', '5HTDX995PID2jrXG8wPHkZ', '4Nd4SuwgpInDup4z0QKs4g'];
const WRONG_HIGHLIGHTS = { '0VbEWiwTyIIqS5SXEmK1e': 'Алтай Таван Богд, Потанины мөсөн гол' };
const PLACEHOLDER_DESC = /^\s*(бла\s*)+\s*$/i;

const isPublishedClean = (x) => x.sys.publishedVersion && x.sys.version === x.sys.publishedVersion + 1;

async function publish(kind, id) {
  const cur = await cma('GET', `/${kind}/${id}`);
  if (isPublishedClean(cur)) return 'аль хэдийн';
  if (DRY) return 'dry';
  await cma('PUT', `/${kind}/${id}/published`, { version: cur.sys.version });
  return 'нийтлэв';
}

(async () => {
  const assetIds = new Set();
  for (const id of ENTRIES) {
    let e = await cma('GET', `/entries/${id}`);
    if (WRONG_HIGHLIGHTS[id] && fv(e, 'highlights') === WRONG_HIGHLIGHTS[id]) {
      console.log(`${id}: highlights хоосолно`);
      if (!DRY) {
        const fields = { ...e.fields };
        delete fields.highlights;
        e = await cma('PUT', `/entries/${id}`, { version: e.sys.version, body: { fields } });
      }
    }
    const img = fv(e, 'image')?.sys?.id;
    if (img) assetIds.add(img);
  }
  for (const id of assetIds) {
    const a = await cma('GET', `/assets/${id}`);
    if (PLACEHOLDER_DESC.test(a.fields.description?.[LOCALE] || '')) {
      console.log(`asset ${id}: description «${a.fields.description[LOCALE]}» хоосолно`);
      if (!DRY) {
        const fields = { ...a.fields };
        delete fields.description;
        await cma('PUT', `/assets/${id}`, { version: a.sys.version, body: { fields } });
      }
    }
    console.log('  asset', id, await publish('assets', id));
  }
  for (const id of ENTRIES) {
    const e = await cma('GET', `/entries/${id}`);
    console.log('  entry', id, fv(e, 'title') || fv(e, 'name'), await publish('entries', id));
  }
})().catch((e) => { console.error(e.message); process.exit(1); });

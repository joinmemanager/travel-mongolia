// Монголын бус (Шангри-Ла, Хятад) зургийг entry-үүдээс салгана. Asset устгахгүй. Draft-д бичнэ
// (нийтлэхийг publish-today.js хийнэ). Idempotent: холбоос үлдээгүй бол юу ч хийхгүй.
//   node scripts/tic/detach-non-mongolian.js [--dry]
const { cma, fv } = require('./_cma');

const ASSETS = ['59VlPhvyHRGOKuI6RIW5oz'];
const DRY = process.argv.includes('--dry');

const linksTo = (v, id) => JSON.stringify(v).includes(`"id":"${id}"`);

(async () => {
  for (const asset of ASSETS) {
    const r = await cma('GET', `/entries?links_to_asset=${asset}&limit=100`);
    for (const e of r.items) {
      const fields = Object.keys(e.fields).filter((k) => linksTo(e.fields[k], asset));
      for (const k of fields) {
        const v = fv(e, k);
        if (v?.sys?.type === 'Link') delete e.fields[k];
        else if (Array.isArray(v)) e.fields[k].mn = v.filter((x) => x?.sys?.id !== asset);
        else console.log('  rich text доторх холбоос — гараар шалгах', e.sys.id, k);
      }
      console.log(`${DRY ? '[dry] ' : ''}${e.sys.id} ${e.sys.contentType.sys.id} «${fv(e, 'title') || fv(e, 'name')}» ← ${fields.join(', ')}`);
      if (!DRY) await cma('PUT', `/entries/${e.sys.id}`, { body: { fields: e.fields }, version: e.sys.version });
    }
    if (!r.items.length) console.log(asset, 'холбоос алга');
  }
})().catch((e) => { console.error(e.message); process.exit(1); });

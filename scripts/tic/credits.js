// TIC-ээс оруулсан asset-уудын description-ий эхэнд зургийн зохиогчийн мөр нэмнэ (дахин ажиллуулахад аюулгүй).
// Сайт энэ мөрийг зургийн доор жижиг тайлбараар харуулна (travel-mongolia/lib/imageCredit.ts):
//   Зураг: <зохиогч> / Wikimedia Commons, <лиценз> | <эх хуудасны URL>
//   Зураг: <эх сайт>
// Wikimedia-гийн зургийн зохиогч, лицензийг Commons API-ийн extmetadata-аас авна.
//   node scripts/tic/credits.js --dry   # өөрчлөхгүй, зөвхөн жагсаана
//   node scripts/tic/credits.js         # Draft-аар хадгална (нийтлэгдсэн asset-ийг дараа publish хийнэ)
const { cma, LOCALE } = require('./_cma');
const { commonsCredit, hostCredit } = require('./_assets');

const DRY = process.argv.includes('--dry');
const CREDIT_RE = /^(Зураг|Фото|Credit)\s*:/i;

(async () => {
  const assets = [];
  for (let skip = 0; ; skip += 200) {
    const res = await cma('GET', `/assets?limit=200&skip=${skip}`);
    assets.push(...res.items);
    if (skip + 200 >= res.total) break;
  }
  for (const a of assets.filter((x) => x.sys.id.startsWith('tic-img-'))) {
    const desc = a.fields.description?.[LOCALE] || '';
    const lines = desc.split('\n');
    if (lines.some((l) => CREDIT_RE.test(l.trim()))) continue;
    const src = /Эх зураг: (\S+)/.exec(desc)?.[1] || '';
    const credit = /wikimedia\.org/.test(src) ? await commonsCredit(src) : hostCredit(src);
    if (!credit) { console.log('  credit олдсонгүй:', a.sys.id, src); continue; }
    console.log(`${DRY ? '[dry] ' : ''}${a.sys.id}  ${credit}`);
    if (DRY) continue;
    const fields = { ...a.fields, description: { ...(a.fields.description || {}), [LOCALE]: `${credit}\n${desc}` } };
    await cma('PUT', `/assets/${a.sys.id}`, { version: a.sys.version, body: { fields } });
  }
})().catch((e) => { console.error(e.message); process.exit(1); });

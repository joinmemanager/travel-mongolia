// TIC-ээс оруулсан asset-уудын description-ий эхэнд зургийн зохиогчийн мөр нэмнэ (дахин ажиллуулахад аюулгүй).
// Сайт энэ мөрийг зургийн доор жижиг тайлбараар харуулна (travel-mongolia/lib/imageCredit.ts):
//   Зураг: <зохиогч> / Wikimedia Commons, <лиценз> | <эх хуудасны URL>
//   Зураг: <эх сайт>
// Wikimedia-гийн зургийн зохиогч, лицензийг Commons API-ийн extmetadata-аас авна.
//   node scripts/tic/credits.js --dry   # өөрчлөхгүй, зөвхөн жагсаана
//   node scripts/tic/credits.js         # Draft-аар хадгална (нийтлэгдсэн asset-ийг дараа publish хийнэ)
const { cma, LOCALE } = require('./_cma');

const DRY = process.argv.includes('--dry');
const CREDIT_RE = /^(Зураг|Фото|Credit)\s*:/i;

async function commonsCredit(fileUrl) {
  // .../commons/a/ab/<нэр> эсвэл .../commons/thumb/a/ab/<нэр>/1200px-<нэр>
  const m = /upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/.exec(fileUrl);
  if (!m) return null;
  const name = decodeURIComponent(m[1]);
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&titles=${encodeURIComponent('File:' + name)}`;
  const res = await fetch(api, { headers: { 'User-Agent': 'TravelHubMongolia/1.0 (contact@joinme.mn)' } });
  const page = Object.values((await res.json()).query.pages)[0];
  const info = page.imageinfo?.[0];
  if (!info) return null;
  const meta = info.extmetadata || {};
  const pick = (k) => (meta[k]?.value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const author = pick('Attribution') || pick('Artist') || 'тодорхойгүй';
  const license = pick('LicenseShortName');
  return `Зураг: ${author} / Wikimedia Commons${license ? `, ${license}` : ''} | ${info.descriptionurl}`;
}

function hostCredit(src) {
  if (/touristinfocenter\.mn/i.test(src) || /^base64/.test(src)) return 'Зураг: touristinfocenter.mn';
  try {
    const host = new URL(src).hostname.replace(/^www\./, '');
    return `Зураг: ${/twimg\.com$/.test(host) ? 'X (Twitter)' : host}`;
  } catch {
    return null;
  }
}

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

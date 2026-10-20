// TIC нийтлэлийн зургийг татаж Contentful asset (Draft) болгоно. import-batch01/02 хуваалцана.
// Зургийг гуравдагч сайтаас шууд холбохгүй: татаж оруулна. Asset ID нь эх хаягаас тогтмол
// (tic-img-<sha1>) тул дахин ажиллуулахад давхардахгүй.
const crypto = require('crypto');
const { cma, SPACE, LOCALE } = require('./_cma');

const TIC = 'https://www.touristinfocenter.mn';
const sha = (s) => crypto.createHash('sha1').update(s).digest('hex').slice(0, 16);

function sniff(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return ['image/jpeg', 'jpg'];
  if (buf.slice(0, 4).toString('hex') === '89504e47') return ['image/png', 'png'];
  if (buf.slice(0, 3).toString() === 'GIF') return ['image/gif', 'gif'];
  if (buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') return ['image/webp', 'webp'];
  return null;
}

function imageOrigin(src) {
  if (src.startsWith('data:')) return 'base64';
  if (/^[a-z]:\\/i.test(src) || src.startsWith('file:')) return 'broken';
  if (/^https?:\/\//i.test(src) && !/touristinfocenter\.mn/i.test(src)) return 'third-party';
  return 'tic';
}

function imageUrl(src) {
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('//')) return 'https:' + src;
  // TIC-ийн зам кирилл, зайтай байж болно
  // Аль хэдийн %XX-ээр кодлогдсон замыг давхар кодлохгүй (%20 → %2520 болж 400 буцаадаг)
  let p = src.startsWith('/') ? src : '/' + src;
  try { p = decodeURI(p); } catch { /* буруу %-тэй бол хэвээр */ }
  return TIC + encodeURI(p);
}

async function download(src) {
  if (src.startsWith('data:')) {
    const m = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(src);
    if (!m) throw new Error('data URI буруу');
    return m[2] ? Buffer.from(m[3], 'base64') : Buffer.from(decodeURIComponent(m[3]));
  }
  const get = (url) =>
    fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (TravelHubMongolia content migration; contact@joinme.mn)' },
      redirect: 'follow',
      // Гуравдагч сайт хариу өгөхгүй гацахаас сэргийлнэ
      signal: AbortSignal.timeout(30000),
    });
  let res = await get(imageUrl(src));
  // Wikimedia-ийн thumb (эхээсээ том хэмжээ) 400 буцаавал эх файлыг авна
  const thumb = /^(https:\/\/upload\.wikimedia\.org\/wikipedia\/[^/]+)\/thumb\/(.+)\/[^/]+$/.exec(src);
  if (!res.ok && thumb) res = await get(`${thumb[1]}/${thumb[2]}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Зургийг Contentful-д Draft asset болгон оруулна. description: эхний мөр нь «Зураг: …» credit
// (сайт зургийн доор харуулна, travel-mongolia/lib/imageCredit.ts), дараа нь эх сурвалжийн тэмдэглэл.
async function ensureAsset(src, title, sourceNote, credit) {
  const id = `tic-img-${sha(src)}`;
  const existing = await cma('GET', `/assets/${id}`);
  if (existing && existing.fields?.file?.[LOCALE]?.url) return id;
  const buf = await download(src);
  const type = sniff(buf);
  if (!type) throw new Error('зургийн формат танигдсангүй');
  const upload = await cma('POST', `https://upload.contentful.com/spaces/${SPACE}/uploads`, { raw: buf });
  const body = {
    fields: {
      title: { [LOCALE]: title.slice(0, 250) },
      description: { [LOCALE]: credit ? `${credit}\n${sourceNote}` : sourceNote },
      file: {
        [LOCALE]: { contentType: type[0], fileName: `${id}.${type[1]}`, uploadFrom: { sys: { type: 'Link', linkType: 'Upload', id: upload.sys.id } } },
      },
    },
  };
  const asset = existing
    ? await cma('PUT', `/assets/${id}`, { version: existing.sys.version, body })
    : await cma('PUT', `/assets/${id}`, { body });
  await cma('PUT', `/assets/${id}/files/${LOCALE}/process`, { version: asset.sys.version });
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const a = await cma('GET', `/assets/${id}`);
    if (a.fields?.file?.[LOCALE]?.url) return id;
  }
  throw new Error('asset процесс дуусаагүй');
}

// Wikimedia Commons-ийн зургийн credit: «Зураг: <зохиогч> / Wikimedia Commons, <лиценз> | <файлын хуудас>».
// Зохиогч, лицензийг Commons API-ийн extmetadata-аас авна. Commons-ийн файл биш бол null.
async function commonsCredit(fileUrl) {
  // .../commons/a/ab/<нэр> эсвэл .../commons/thumb/a/ab/<нэр>/1200px-<нэр>
  const m = /upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/]+)/.exec(fileUrl);
  if (!m) return null;
  const name = decodeURIComponent(m[1]);
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata|url&titles=${encodeURIComponent('File:' + name)}`;
  const res = await fetch(api, { headers: { 'User-Agent': 'TravelHubMongolia/1.0 (contact@joinme.mn)' }, signal: AbortSignal.timeout(30000) });
  const page = Object.values((await res.json()).query.pages)[0];
  const info = page.imageinfo?.[0];
  if (!info) return null;
  const meta = info.extmetadata || {};
  const pick = (k) => (meta[k]?.value || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const author = pick('Attribution') || pick('Artist') || 'тодорхойгүй';
  const license = pick('LicenseShortName');
  return `Зураг: ${author} / Wikimedia Commons${license ? `, ${license}` : ''} | ${info.descriptionurl}`;
}

// Wikimedia-гаас бусад зургийн credit: эх сайтын нэр
function hostCredit(src) {
  if (/touristinfocenter\.mn/i.test(src) || /^base64/.test(src)) return 'Зураг: touristinfocenter.mn';
  try {
    const host = new URL(src).hostname.replace(/^www\./, '');
    return `Зураг: ${/twimg\.com$/.test(host) ? 'X (Twitter)' : host}`;
  } catch {
    return null;
  }
}

module.exports = { TIC, sha, sniff, imageOrigin, imageUrl, download, ensureAsset, commonsCredit, hostCredit };

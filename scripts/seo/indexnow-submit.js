// Production sitemap-ийн бүх URL-ыг IndexNow руу нэг удаа илгээнэ (Bing болон IndexNow-д нэгдсэн хайлтын системүүд).
// Шинэ/шинэчлэгдсэн хуудсыг Contentful-ийн webhook (/api/revalidate) өөрөө илгээдэг тул энэ нь анхны илгээлт,
// эсвэл олон статик хуудас өөрчлөгдсөний дараа ашиглана.
//   node scripts/seo/indexnow-submit.js --dry   # URL-уудыг тоолно
//   node scripts/seo/indexnow-submit.js
// Түлхүүр: travel-mongolia/lib/indexNow.ts (INDEXNOW_KEY), файл: travel-mongolia/public/<key>.txt
const SITE = 'https://www.travelhubmongolia.com';
const KEY = 'dcea2c855862a6fe6bba7a250c8920c3';
const DRY = process.argv.includes('--dry');

(async () => {
  const keyRes = await fetch(`${SITE}/${KEY}.txt`);
  const keyText = (await keyRes.text()).trim();
  if (keyRes.status !== 200 || keyText !== KEY) throw new Error(`түлхүүр файл production дээр алга (${keyRes.status})`);

  const xml = await (await fetch(`${SITE}/sitemap.xml`)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  console.log(`sitemap URL: ${urls.length}`);
  if (DRY) return;
  for (let i = 0; i < urls.length; i += 10000) {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList: urls.slice(i, i + 10000) }),
    });
    console.log(`IndexNow ${i + 1}–${Math.min(i + 10000, urls.length)}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
  }
})().catch((e) => { console.error(e.message); process.exit(1); });

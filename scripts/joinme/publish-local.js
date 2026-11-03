// /local хэсгийг нээхэд joinme-ийн байр биш 126 draft-ыг (малчин өрх 36, тэмээ/морь 38, гар урлал 11, ресторан 41) нийтэлнэ.
//   node scripts/joinme/publish-local.js        # зөвхөн тоолж, шалгана, юу ч өөрчлөхгүй
//   node scripts/joinme/publish-local.js --go   # нийтэлнэ
// Тоо зөрвөл зогсоно. Байрыг (Тосон Краван мини хаус г.м.) query нь огт авахгүй. Unpublish, устгах код алга.
const { cma, callCount, sleep, LOCALE } = require('../tic/_cma');

const GO = process.argv.includes('--go');
const EXPECT = { 'herder-family': 36, tour: 38, artisan: 11, food: 41 };

(async () => {
  const items = [];
  for (let skip = 0; ; skip += 1000) {
    const r = await cma('GET', `/entries?content_type=localProvider&fields.joinmeId[exists]=true&fields.providerType[ne]=accommodation&limit=1000&skip=${skip}`);
    items.push(...r.items);
    if (skip + 1000 >= r.total) break;
  }
  const v = (e, k) => e.fields[k]?.[LOCALE];
  const counts = {};
  for (const e of items) counts[v(e, 'providerType')] = (counts[v(e, 'providerType')] || 0) + 1;
  console.log('тоо', counts, 'нийт', items.length);
  const drafts = items.filter((e) => !e.sys.publishedVersion);
  console.log('draft', drafts.length, 'нийтлэгдсэн', items.length - drafts.length);
  if (JSON.stringify(Object.keys(EXPECT).sort().map((k) => counts[k])) !== JSON.stringify(Object.keys(EXPECT).sort().map((k) => EXPECT[k]))) throw new Error('тоо зөрүүтэй, зогсоов');
  if (items.some((e) => /Тосон/.test(v(e, 'name')))) throw new Error('Тосон нэртэй entry жагсаалтад орсон, зогсоов');
  if (!GO) { console.log('[шалгалт] юу ч нийтлээгүй', `CMA ${callCount()}`); return; }

  let done = 0;
  const errors = [];
  for (const e of drafts) {
    try {
      await cma('PUT', `/entries/${e.sys.id}/published`, { version: e.sys.version });
      done++;
    } catch (err) {
      errors.push(`${e.sys.id}: ${err.message.slice(0, 200)}`);
      if (done === 0 || errors.length >= 5) break;
    }
    // Webhook асаалттай: entry бүр /api/revalidate дуудна, хооронд нь завсар авна
    await sleep(300);
    if (done % 25 === 0) console.log(`нийтлэв ${done}`);
  }
  console.log('нийтлэв', done, 'алдаа', errors.length, `CMA ${callCount()}`);
  errors.forEach((x) => console.log('  ', x));
  if (errors.length) process.exit(1);
})().catch((e) => { console.error(e.message); console.error(`CMA ${callCount()}`); process.exit(1); });

// Contentful Free: 10,000 record (entry + asset). Импорт бүрийн өмнө нийт тоог шалгана:
// одоогийн тоо + төлөвлөсөн шинэ record > 9,000 бол зогсооно (эзэмшигчийн дүрэм).
const { cma } = require('./_cma');

const LIMIT = 9000;

async function recordCount() {
  const e = await cma('GET', '/entries?limit=1');
  const a = await cma('GET', '/assets?limit=1');
  return { entries: e.total, assets: a.total, total: e.total + a.total };
}

async function checkBudget(planned, label) {
  const c = await recordCount();
  const after = c.total + planned;
  console.log(`record: ${c.total} (entry ${c.entries}, asset ${c.assets}) + ${label} ≈${planned} → ${after} / ${LIMIT}`);
  if (after > LIMIT) throw new Error(`${label}: record ${after} > ${LIMIT} болно — зогсоов`);
  return c;
}

module.exports = { recordCount, checkBudget, LIMIT };

// Contentful-ийн бүх entry-ээс загвараас үлдсэн placeholder утгыг хайна, --apply бол хоосолно.
//   node scripts/contentful/placeholders.js          # зөвхөн жагсаалт
//   node scripts/contentful/placeholders.js --apply  # хоосолно (Draft; publish хийхгүй)
// Нийтлэгдсэн entry-д өөрчлөлт нь Draft хэлбэрээр үлдэнэ: production-д Publish хийсний дараа л харагдана.
const { cma, LOCALE } = require('../tic/_cma');

const APPLY = process.argv.includes('--apply');

// Талбарын бүх утгаараа placeholder (тэр чигээрээ таарах)
const EXACT = new Set(['Мэдээлэл', '100,000', 'төв', 'Үзэсгэлэнтэй', 'test', 'Test', 'asdf', 'TBD', 'TODO']);
// Текстийн аль нэг хэсэгт байвал placeholder
const PATTERNS = [/бла\s+бла/i, /lorem ipsum/i, /\bxxx+\b/i];

function plain(node) {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (node.nodeType === 'text') return node.value || '';
  return (node.content || []).map(plain).join(' ');
}

function isPlaceholder(v) {
  if (typeof v === 'string') return EXACT.has(v.trim()) || PATTERNS.some((re) => re.test(v));
  if (v && typeof v === 'object' && v.nodeType === 'document') {
    const t = plain(v).trim();
    return EXACT.has(t) || PATTERNS.some((re) => re.test(t));
  }
  return false;
}

(async () => {
  const all = [];
  for (let skip = 0; ; skip += 200) {
    const res = await cma('GET', `/entries?limit=200&skip=${skip}`);
    all.push(...res.items);
    if (skip + 200 >= res.total) break;
  }
  const found = [];
  for (const e of all) {
    const hits = [];
    for (const [field, byLocale] of Object.entries(e.fields || {})) {
      for (const [loc, v] of Object.entries(byLocale || {})) {
        if (isPlaceholder(v)) hits.push({ field, loc, value: (typeof v === 'string' ? v : plain(v)).slice(0, 90) });
      }
    }
    if (!hits.length) continue;
    const title = e.fields.title?.[LOCALE] || e.fields.name?.[LOCALE] || e.fields.slug?.[LOCALE] || e.sys.id;
    found.push({ e, title, hits });
  }
  for (const { e, title, hits } of found) {
    const state = e.sys.publishedVersion ? (e.sys.version === e.sys.publishedVersion + 1 ? 'published' : 'published+draft') : 'draft';
    console.log(`${e.sys.contentType.sys.id} «${title}» (${e.sys.id}, ${state})`);
    for (const h of hits) console.log(`   ${h.field}[${h.loc}] = «${h.value}»`);
  }
  console.log(`entry ${all.length}, placeholder-тэй ${found.length}`);
  if (!APPLY) return;

  // Хоосолно: талбарын тухайн locale-ийн утгыг устгана (required талбарыг алгасна)
  const types = {};
  for (const { e, hits } of found) {
    const ct = e.sys.contentType.sys.id;
    types[ct] = types[ct] || (await cma('GET', `/content_types/${ct}`));
    const required = new Set(types[ct].fields.filter((f) => f.required).map((f) => f.id));
    const cur = await cma('GET', `/entries/${e.sys.id}`);
    const fields = JSON.parse(JSON.stringify(cur.fields));
    const cleared = [];
    for (const h of hits) {
      if (required.has(h.field)) { console.log(`   алгасав (required): ${e.sys.id}.${h.field}`); continue; }
      delete fields[h.field][h.loc];
      if (!Object.keys(fields[h.field]).length) delete fields[h.field];
      cleared.push(`${h.field}[${h.loc}]`);
    }
    if (!cleared.length) continue;
    await cma('PUT', `/entries/${e.sys.id}`, { version: cur.sys.version, body: { fields } });
    console.log(`хоосолсон: ${e.sys.id} ${cleared.join(', ')}`);
  }
})().catch((err) => { console.error(err.message); process.exit(1); });

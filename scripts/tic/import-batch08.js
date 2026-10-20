// TIC 8-р багц: мэдээ (News.aspx) → Contentful `story`, topic «news», consentObtained=false. Бүгд Draft.
// Хаяг: /stories/news/<slug> (шинэ route, PAGE_STATUS draft — эзэмшигч шалгаж live болгоно).
//
//   node scripts/tic/import-batch08.js backups/tic-cache/batch04-08 --dry
//   node scripts/tic/import-batch08.js backups/tic-cache/batch04-08         # + docs/redirects/batch-08-news.csv
//
// Аль мөрийг: inventory-ийн ХУУЛАХ + ШАЛГАХ (689). АЛГАСАХ (1,601: хуучирсан үйл явдлын/богино мэдээ, гадаад сэдэв,
// гарчигт он) оруулахгүй — inventory-ийн шийдвэр (tic-migration.md). Мөн алгасна:
//  - «Монголтой холбоо тодорхойгүй» мөрөөс текстэд Монгол (Монгол, аймаг, нийслэл…) огт дурдагдаагүй нь (гадаад/сэдвээс гадуур)
//  - орос хэл дээрх нийтлэл, хоосон нийтлэл
// TIC доторх давхардал (ижил гарчиг): урт текстийг нь үлдээж, бусдын хаягийг түүн рүү redirect.
// Анхны нийтэлсэн огноо (inventory `огноо`) → publishedDate. Эх сурвалж (сонин, сайт) байвал needsReplacement.
const fs = require('fs');
const path = require('path');
const { cma, fv, ROOT, LOCALE, callCount } = require('./_cma');
const { loadInventory, writeCsv, parseCsv } = require('./_csv');
const { checkBudget } = require('./_budget');
const B = require('./_batch03-06');
const { parseHtml, convert, plainText, wordCount, extractArticle } = require('./_html');
const { seoTitle, seoDescription } = require('./_seo');
const { TIC, imageOrigin, imageUrl, ensureAsset, commonsCredit, hostCredit } = require('./_assets');

const CACHE = process.argv[2];
const DRY = process.argv.includes('--dry');
const NO_IMAGES = process.argv.includes('--no-images');
const ONLY = (process.argv.find((a) => a.startsWith('--only=')) || '').split('=')[1]?.split(',');
if (!CACHE) { console.error('кэш хавтас өгнө үү'); process.exit(1); }

const SITE = 'https://www.travelhubmongolia.com';
const BASE = '/stories/news';
const REPORT_JSON = path.join(ROOT, 'backups', 'tic-cache', `batch08-result${ONLY ? '-only' : ''}.json`);
const L = (v) => ({ [LOCALE]: v });
const link = (type, id) => ({ sys: { type: 'Link', linkType: type, id } });

const ticKey = (url) => { const m = /touristinfocenter\.mn(\/[^#]*)/i.exec(url); return m ? m[1].toLowerCase() : null; };
const inlineText = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(inlineText).join(''));
const isPromo = (b) => b.nodeType === 'paragraph' && /(илүү их мэдээ мэдээллийг|сонирхож байвал)[^.]*энд дар/i.test(inlineText(b));
function unwrapAdLinks(node) {
  if (!node.content) return node;
  const out = [];
  for (const c of node.content) {
    if (c.nodeType === 'hyperlink' && /joinme\.mn/i.test(c.data?.uri || '')) out.push(...c.content);
    else out.push(unwrapAdLinks(c));
  }
  const merged = [];
  for (const c of out) {
    const p = merged[merged.length - 1];
    if (p && p.nodeType === 'text' && c.nodeType === 'text' && JSON.stringify(p.marks) === JSON.stringify(c.marks)) p.value += c.value;
    else merged.push(c);
  }
  return { ...node, content: merged };
}
const norm = (s) => s.toUpperCase().replace(/[^А-ЯЁӨҮA-Z0-9]/g, '');

// Гарчиг: өгүүлбэрийн бичлэг; аймаг, Монгол, Улаанбаатар, Чингис зэрэг оноосон нэр, латин үг том үсгээр
const AIMAG_STEMS = B.AIMAGS.map(([n]) => n.toLocaleLowerCase('mn').split('-')[0].replace(/ь$/, '')).filter((s) => !['төв', 'дархан', 'баян', 'говь'].includes(s));
function caseTitle(raw) {
  const lower = raw.replace(/\s+/g, ' ').trim().toLocaleLowerCase('mn');
  let first = true;
  return lower.replace(/[\p{L}]+/gu, (w, i) => {
    const before = lower.slice(Math.max(0, i - 2), i);
    const cap = first || /^[a-z]/.test(w) || /[("«“]\s?$/.test(before) || AIMAG_STEMS.some((s) => w.startsWith(s)) ||
      /^(монгол|чингис|тэрэлж|хөвсгөл|хархорин|хархорум|орхон|туул|хэрлэн|онон|алтай|хангай|богд|занабазар|сүхбаатар)/.test(w);
    first = false;
    return cap ? w[0].toLocaleUpperCase('mn') + w.slice(1) : w;
  });
}

const MONGOLIA_RE = new RegExp(`монгол|улаанбаатар|нийслэл|аймаг|сумын|${AIMAG_STEMS.join('|')}`, 'i');
const isRussian = (t) => (t.match(/[ыэъщ]/g) || []).length < 2 && (t.match(/[а-я]/gi) || []).length > 200 && !/[өү]/i.test(t);

(async () => {
  const rows = loadInventory().filter((r) => r['ангилал'] === 'news' && r['шийдвэр'] !== 'АЛГАСАХ');
  const usedSlugs = new Set();
  for (let skip = 0; ; skip += 1000) {
    const r = await cma('GET', `/entries?content_type=story&limit=1000&skip=${skip}&select=sys.id,fields.slug`);
    for (const e of r.items) if (!e.sys.id.startsWith('tic-n-') && fv(e, 'slug')) usedSlugs.add(fv(e, 'slug'));
    if (skip + 1000 >= r.total) break;
  }
  usedSlugs.add('news'); // /stories/news-тэй давхцахгүй

  const items = [];
  const skipped = [];
  for (const r of rows) {
    const file = path.join(CACHE, `${r.key}.html`);
    if (!fs.existsSync(file)) { skipped.push({ key: r.key, title: r['гарчиг'], reason: 'кэшд алга (татаж чадаагүй)' }); continue; }
    const art = extractArticle(fs.readFileSync(file, 'utf8'));
    if (!art) { skipped.push({ key: r.key, title: r['гарчиг'], reason: 'нийтлэлийн бие олдсонгүй' }); continue; }
    const blocks = convert(parseHtml(art.body), { baseUrl: TIC + '/', rewriteLink: (h) => h });
    let bs = blocks.filter((b) => !isPromo(b)).map(unwrapAdLinks);
    while (bs.length && bs[bs.length - 1].nodeType === 'hr') bs.pop();
    while (bs.length && bs[0].nodeType === 'hr') bs.shift();
    const text = plainText(bs);
    const words = wordCount(text);
    const it = { row: r, key: r.key, art, blocks: bs, text, words, promoRemoved: blocks.length - bs.length, oldUrl: TIC + r['хуучин_url'] };
    if (!words) { skipped.push({ key: r.key, title: r['гарчиг'], reason: 'хоосон нийтлэл' }); continue; }
    if (/орос хэл/.test(r['шалтгаан']) || isRussian(text)) { skipped.push({ key: r.key, title: r['гарчиг'], reason: 'орос хэл дээрх нийтлэл' }); continue; }
    if (/холбоо тодорхойгүй/.test(r['шалтгаан']) && !MONGOLIA_RE.test(`${art.title} ${text}`)) {
      skipped.push({ key: r.key, title: r['гарчиг'], reason: 'гадаад / Монголтой холбоогүй сэдэв' });
      continue;
    }
    items.push(it);
  }

  // TIC доторх давхардал: ижил гарчиг → хамгийн урт нь
  const groups = new Map();
  for (const it of items) {
    const k = norm(it.art.title);
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(it);
  }
  const primaries = [];
  for (const g of groups.values()) {
    g.sort((a, b) => b.words - a.words || (a.row['шийдвэр'] === 'ХУУЛАХ' ? -1 : 1));
    const [main, ...dups] = g;
    main.dups = dups;
    dups.forEach((d) => (d.mergedInto = main.key));
    primaries.push(main);
  }

  for (const it of primaries) {
    it.title = caseTitle(it.art.title);
    let slug = B.slugify(it.title) || it.key.replace('_', '-');
    const base = slug;
    for (let n = 2; usedSlugs.has(slug); n++) slug = `${base}-${n}`;
    usedSlugs.add(slug);
    it.slug = slug;
    it.newPath = `${BASE}/${slug}`;
    it.id = `tic-${it.key.replace('_', '-')}`;
    const d = /^(\d{4})\/(\d{2})\/(\d{2})/.exec(it.row['огноо']);
    it.publishedDate = d ? `${d[1]}-${d[2]}-${d[3]}` : undefined;
  }

  const rewriteMap = new Map();
  for (const it of primaries) for (const x of [it, ...it.dups]) rewriteMap.set(ticKey(x.oldUrl), it.newPath);
  for (const f of fs.readdirSync(path.join(ROOT, 'docs', 'redirects'))) {
    if (!f.endsWith('.csv') || f.startsWith('batch-08')) continue;
    for (const r of parseCsv(fs.readFileSync(path.join(ROOT, 'docs', 'redirects', f), 'utf8'))) {
      const k = ticKey(r.old_url);
      if (k && !rewriteMap.has(k)) rewriteMap.set(k, r.new_url.replace(SITE, ''));
    }
  }
  const rewrite = (node) => {
    if (node.nodeType === 'hyperlink') {
      const k = ticKey(node.data.uri || '');
      if (k && rewriteMap.has(k)) node.data.uri = SITE + rewriteMap.get(k);
    }
    (node.content || []).forEach(rewrite);
  };

  for (const it of primaries) {
    it.blocks.forEach(rewrite);
    it.images = it.blocks.filter((b) => b.nodeType === '__image').map((b) => ({ src: b.src, origin: imageOrigin(b.src) }));
    const srcLines = (it.text.match(/(?:Эх сурвалж|Эх үүсвэр|Сурвалж|Source)\s*:[^\n]*/gi) || []);
    const srcLine = srcLines.join(' ') + ' ' + it.row['зохиогч_эх_сурвалж'];
    it.flags = [];
    if (/лавлах/i.test(srcLine)) it.flags.push('Монгол орны лавлах');
    if (/улаан ном/i.test(srcLine)) it.flags.push('Улаан ном');
    if (/сонин|medee|ikon|news|mongolia\.gogo|gogo|montsame|unuudur|zindaa|eagle|\.mn\b/i.test(srcLine)) it.flags.push('сонин/мэдээний сайт');
    if (/facebook/i.test(srcLine)) it.flags.push('Facebook');
    if (!it.flags.length && srcLines.length) it.flags.push('эх сурвалж заасан');
    for (const im of it.images) if (im.origin === 'third-party') it.flags.push(`зураг: ${(() => { try { return new URL(imageUrl(im.src)).hostname; } catch { return 'гуравдагч'; } })()}`);
    it.needsReplacement = it.flags.length > 0;
    it.source = [`touristinfocenter.mn мэдээ: ${it.oldUrl}`, ...srcLines.map((s) => s.trim()), it.row['зохиогч_эх_сурвалж'] && `Зохиогч/эх сурвалж (TIC): ${it.row['зохиогч_эх_сурвалж']}`].filter(Boolean).join('\n');
  }

  const plannedImages = NO_IMAGES ? 0 : primaries.reduce((s, it) => s + it.images.filter((i) => i.origin !== 'broken').length, 0);
  if (!ONLY) await checkBudget(primaries.length + plannedImages, '8-р багц (entry + зураг)');

  const usedDesc = new Set();
  for (const it of primaries) {
    it.seoTitle = seoTitle(it.title, 'Мэдээний архив');
    it.seoDescription = seoDescription(it.text, { name: it.title, stem: it.title.split(/[ ,.-]/)[0], fallback: `Touristinfocenter.mn-ийн мэдээний архиваас${it.publishedDate ? ` (${it.publishedDate.slice(0, 4)})` : ''} — Travel Hub Mongolia.` }, usedDesc);
  }

  const imageErrors = [];
  const result = { entries: [], skipped, imageErrors };

  async function resolveImages(it) {
    const out = [], assets = [];
    let n = 0;
    for (const b of it.blocks) {
      if (b.nodeType !== '__image') { out.push(b); continue; }
      n++;
      if (NO_IMAGES) continue;
      const origin = imageOrigin(b.src);
      if (origin === 'broken') { imageErrors.push({ key: it.key, src: b.src.slice(0, 120), error: 'эвдэрсэн зам' }); continue; }
      const shown = b.src.startsWith('data:') ? 'base64 (TIC нийтлэлд шигтгэсэн)' : imageUrl(b.src);
      try {
        const credit = origin === 'third-party' && /wikimedia\.org/.test(b.src) ? (await commonsCredit(b.src)) || hostCredit(b.src)
          : origin === 'third-party' ? hostCredit(imageUrl(b.src)) : 'Зураг: touristinfocenter.mn';
        const id = DRY ? 'dry-run' : await ensureAsset(b.src, `${it.title} — зураг ${n}`.slice(0, 250), `TIC: ${it.oldUrl} · Эх зураг: ${shown}${origin === 'tic' ? '' : ' · needsReplacement'}`, credit);
        assets.push(id);
        out.push({ nodeType: 'embedded-asset-block', data: { target: link('Asset', id) }, content: [] });
      } catch (e) {
        imageErrors.push({ key: it.key, src: shown.slice(0, 160), error: e.message });
      }
    }
    return { content: out, assets: [...new Set(assets)].filter((x) => x !== 'dry-run') };
  }

  async function handle(it) {
    const { content, assets } = await resolveImages(it);
    const fields = {
      title: L(it.title.slice(0, 250)), slug: L(it.slug), topic: L('news'), body: L({ nodeType: 'document', data: {}, content }),
      source: L(it.source), language: L('mn'), consentObtained: L(false), seoTitle: L(it.seoTitle), seoDescription: L(it.seoDescription),
      sourceUrl: L([it, ...it.dups].map((x) => x.oldUrl).join(' ')), needsReplacement: L(it.needsReplacement),
    };
    if (assets.length) fields.media = L(assets.map((a) => link('Asset', a)));
    if (it.publishedDate) fields.publishedDate = L(it.publishedDate);
    if (!DRY) {
      const cur = await cma('GET', `/entries/${it.id}`);
      if (cur && fv(cur, 'slug')) fields.slug = cur.fields.slug; // байгаа slug-ийг өөрчлөхгүй
      if (cur) await cma('PUT', `/entries/${it.id}`, { version: cur.sys.version, body: { fields: { ...cur.fields, ...fields } } });
      else await cma('PUT', `/entries/${it.id}`, { contentType: 'story', body: { fields } });
    }
    result.entries.push({
      id: it.id, key: it.key, title: it.title, slug: it.slug, path: it.newPath, publishedDate: it.publishedDate, words: it.words, images: it.images.length,
      needsReplacement: it.needsReplacement, flags: it.flags, members: [it.key, ...it.dups.map((d) => d.key)], decision: it.row['шийдвэр'],
      seoTitle: it.seoTitle, seoDescription: it.seoDescription,
    });
    console.log(`${DRY ? '[dry] ' : ''}${it.newPath} ← ${[it, ...it.dups].map((x) => x.key).join('+')} «${it.title}» ${it.publishedDate || '—'} (${it.words} үг, зураг ${it.images.length}${it.needsReplacement ? ', NR' : ''}) [${it.seoTitle.length}/${it.seoDescription.length}]`);
  }

  const todo = primaries.filter((it) => !ONLY || ONLY.includes(it.key));
  let next = 0;
  await Promise.all(Array.from({ length: DRY ? 1 : 4 }, async () => { while (next < todo.length) await handle(todo[next++]); }));
  const order = new Map(primaries.map((it, i) => [it.key, i]));
  result.entries.sort((a, b) => order.get(a.key) - order.get(b.key));

  if (!ONLY) {
    const byKey = new Map(primaries.map((p) => [p.key, p]));
    const redirects = [];
    for (const it of items) {
      const target = it.mergedInto ? byKey.get(it.mergedInto) : it;
      redirects.push([it.oldUrl, SITE + target.newPath, target.title, `Мэдээ${it.mergedInto ? ' (TIC давхардал)' : ''} (хэсэг нээгдээгүй: /stories/news draft)`, '']);
    }
    // Алгассан мэдээ (inventory АЛГАСАХ + энд алгассан): «Түүхүүд» (live) руу
    const skippedRows = loadInventory().filter((r) => r['ангилал'] === 'news' && r['шийдвэр'] === 'АЛГАСАХ');
    for (const r of skippedRows) redirects.push([TIC + r['хуучин_url'], `${SITE}/stories`, r['гарчиг'], `Мэдээ — алгассан (${r['шалтгаан'].replace(/\s*\(.*$/, '').split(';')[0].trim()})`, '']);
    for (const s of skipped) redirects.push([TIC + rows.find((r) => r.key === s.key)['хуучин_url'], `${SITE}/stories`, s.title, `Мэдээ — алгассан (${s.reason})`, '']);
    if (!DRY) writeCsv(path.join(ROOT, 'docs', 'redirects', 'batch-08-news.csv'), ['old_url', 'new_url', 'title', 'ангилал', 'аймаг'], redirects);
    result.redirectRows = redirects.length;
  }
  fs.writeFileSync(REPORT_JSON, JSON.stringify(result, null, 2), 'utf8');
  const c = (f) => result.entries.filter(f).length;
  const reasons = {};
  for (const s of skipped) reasons[s.reason] = (reasons[s.reason] || 0) + 1;
  console.log(`мэдээ: ${result.entries.length} (давхардал нэгтгэсэн ${items.length - primaries.length}), алгассан ${skipped.length} ${JSON.stringify(reasons)}, NR ${c((e) => e.needsReplacement)}, зургийн алдаа ${imageErrors.length}, CMA ${callCount()}`);
  for (const e of imageErrors.slice(0, 30)) console.log('  зураг алгасав:', e.key, e.error, e.src);
})().catch((e) => { console.error(e); process.exit(1); });

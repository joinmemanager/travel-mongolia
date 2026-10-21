// TIC бүрэн хамрах шалгалт (6-р алхам): tic-inventory.csv-ийн мөр бүрийг ангилна
//   ✅ шилжсэн (шинэ хаягтай)   ↪️ зөвхөн redirect (жагсаалт/ангиллын хуудас)   ⛔ алгассан (шалтгаантай)   ❓ шийдээгүй
// Эх: docs/redirects/batch-*.csv (old_url → new_url, ангилал). Мөн docs/redirects/batch-09-listing-pages.csv-ийг
// (TIC-ийн жагсаалт, ангиллын хуудсууд → Travel Hub-ийн тохирох хэсэг) үүсгэж, бүх CSV-ийг шалгана:
// нэг old_url давхардахгүй, new_url бүр https://www.travelhubmongolia.com-оор эхэлнэ, нээгдээгүй хэсэг рүү заасныг тоолно.
//   node scripts/tic/coverage.js   → docs/plan/tic-coverage.md
const fs = require('fs');
const path = require('path');
const { ROOT } = require('./_cma');
const { loadInventory, parseCsv, writeCsv } = require('./_csv');

const SITE = 'https://www.travelhubmongolia.com';
const TIC = 'https://www.touristinfocenter.mn';
const DIR = path.join(ROOT, 'docs', 'redirects');
const key = (u) => u.replace(/^https?:\/\/(www\.)?touristinfocenter\.mn/i, '').toLowerCase();

// TIC-ийн жагсаалт, ангиллын хуудсууд (Home.aspx-ийн цэс, tic-migration.md «Redirect» хүснэгт)
const LISTING = [
  ['/', '/', 'Нүүр'], ['/Home.aspx', '/', 'Нүүр'],
  ['/cate1.aspx', '/destination/landscapes', 'Байгаль, түүхийн дурсгалт газар'],
  ['/cate2.aspx', '/destination/strictly-protected', 'Дархан цаазат газар'],
  ['/cate3.aspx', '/destination/nature-reserves', 'Байгалийн нөөц газар'],
  ['/cate4.aspx', '/destination/national-parks', 'Байгалийн цогцолбор газар'],
  ['/cate5.aspx', '/destination/natural-monuments', 'Байгалийн дурсгалт газар'],
  ['/cate8.aspx', '/things-to-do/wellness', 'Рашаан сувилал'],
  ['/cate9.aspx', '/destination/heritage/city-monuments', 'Хотын дурсгалт газар'],
  ['/cate10.aspx', '/about/nature/wildlife', 'Монгол орны ан амьтан'],
  ['/cate10.aspx?TypeID=1', '/about/nature/wildlife', 'Ан амьтан: хөхтөн'],
  ['/cate10.aspx?TypeID=2', '/about/nature/wildlife', 'Ан амьтан: сээр нуруугүй'],
  ['/cate10.aspx?TypeID=3', '/about/nature/wildlife', 'Ан амьтан: загас'],
  ['/cate10.aspx?TypeID=4', '/about/nature/wildlife', 'Ан амьтан: хоёр нутагтан, мөлхөгч'],
  ['/cate11.aspx', '/about/nature/birds', 'Монгол орны шувууд'],
  ['/cate12.aspx', '/about/nature/plants', 'Монгол орны ургамал'],
  ['/cate13.aspx', '/destination/region#provinces', 'МУ-ын аймаг, сум, дүүрэг'],
  ['/cate14.aspx', '/about/history', 'Монголын түүх'],
  ['/cate14.aspx?TypeID=1', '/about/history', 'Монголын түүх: угсаатнууд'],
  ['/cate14.aspx?TypeID=2', '/about/history', 'Монголын түүх: түүхэн үе'],
  ['/cate14.aspx?TypeID=3', '/about/history', 'Монголын түүх: түүхэн хүмүүс'],
  ['/cate15.aspx', '/about/culture', 'Монголчуудын шашин шүтлэг'],
  ['/cate16.aspx', '/about/traditions', 'Монгол зан заншил, соёлын өв'],
  ['/cate17.aspx', '/things-to-do/museums', 'Музей, театр, соёлын төв'],
  ['/cate17.aspx?TypeID=1', '/things-to-do/museums', 'Музей'],
  ['/cate17.aspx?TypeID=2', '/things-to-do/museums', 'Театр, чуулга'],
  ['/cate17.aspx?TypeID=3', '/things-to-do/museums', 'Соёлын төв, номын сан'],
  ['/cate20.aspx', '/things-to-do/festivals', 'Эвент'],
  ['/cate21.aspx', '/plan/accommodation', 'Зочид буудал'],
  ['/cate22.aspx', '/plan/accommodation', 'Жуулчны бааз'],
  ['/cate25.aspx', '/local/guides', 'Аяллын хөтчийн лавлах'],
  ['/cate27.aspx', '/', 'Гайхамшигт дэлхий (гадаад)'],
  ['/cate28.aspx', '/', 'Улс орнууд (гадаад)'],
  ['/News.aspx', '/stories', 'Мэдээ мэдээлэл'],
  ['/Tours.aspx', '/', 'Аяллууд (joinme.mn, гадаад аялал)'],
];
// 2026-10-21: TIC сайт ажилласаар байгаа тул зөвхөн агуулга нь бүрэн шилжсэн ангиллын жагсаалтыг redirect хийнэ.
// Доорх жагсаалтууд TIC дээрээ үлдэнэ (docs/redirects/not-redirected.csv). Агуулга нь шилжмэгц эндээс хасна.
const LISTING_HELD = {
  '/': 'TIC-ийн нүүр (TIC ажилласаар)', '/Home.aspx': 'TIC-ийн нүүр (TIC ажилласаар)',
  // cate14/15/16 (10-р багц), cate21/22 (/plan/accommodation) нь feat/tic-batch-10-д шилжсэн тул эндээс хассан
  '/cate25.aspx': 'хөтчийн лавлах хуулаагүй', '/cate27.aspx': 'гадаад (хуулаагүй)', '/cate28.aspx': 'гадаад (хуулаагүй)',
  '/News.aspx': 'мэдээний ихэнх нь хуулаагүй', '/Tours.aspx': 'гадаад аялал (хуулаагүй)',
};
// Алгассан нийтлэлийн (cate25, 27, 28) шалтгаан — redirect хийхгүй
const SKIPPED_CATE = { 25: ['', 'хувийн мэдээлэл (хөтчийн утас, имэйл, нас)'], 27: ['', 'гадаад сэдэв'], 28: ['', 'гадаад сэдэв'] };
// Нээгдээгүй (soft/draft) хэсэг (lib/navigation.ts)
const UNPUBLISHED = [/^\/local(\/|$|#)/];
const abs = (p) => (p.startsWith('http') ? p : SITE + p);
const NOT_REDIRECTED = path.join(DIR, 'not-redirected.csv');
const NR_HEAD = ['old_url', 'title', 'шалтгаан', 'эх файл'];

(async () => {
  const inv = loadInventory();
  // batch-09: зөвхөн агуулга нь бүрэн шилжсэн ангиллын жагсаалтын хуудас
  const b09 = LISTING.filter(([o]) => !LISTING_HELD[o]).map(([o, n, t]) => [TIC + o, abs(n), t, 'Жагсаалт / ангиллын хуудас', '']);
  writeCsv(path.join(DIR, 'batch-09-listing-pages.csv'), ['old_url', 'new_url', 'title', 'ангилал', 'аймаг'], b09);
  // Redirect хийхгүй (TIC-д үлдэх) мөрүүд: үлдсэн жагсаалт + cate25/27/28 нийтлэл (clean-redirects.js-ийн мэдээтэй нэг файлд)
  // Агуулга нь шилжиж redirect хүснэгтэд орсон мөрийг not-redirected-ээс хасна
  const redirected = new Set(b09.map((r) => key(r[0])));
  for (const f of fs.readdirSync(DIR).filter((x) => /^batch-.*\.csv$/.test(x))) for (const r of parseCsv(fs.readFileSync(path.join(DIR, f), 'utf8'))) redirected.add(key(r.old_url));
  const nr = (fs.existsSync(NOT_REDIRECTED) ? parseCsv(fs.readFileSync(NOT_REDIRECTED, 'utf8')) : []).filter((r) => !redirected.has(key(r.old_url)));
  const nrSeen = new Set(nr.map((r) => key(r.old_url)));
  const nrAdd = [
    ...LISTING.filter(([o]) => LISTING_HELD[o]).map(([o, , t]) => ({ old_url: TIC + o, title: t, 'шалтгаан': `Жагсаалтын хуудас — ${LISTING_HELD[o]}`, 'эх файл': 'batch-09-listing-pages.csv' })),
    ...inv.filter((x) => SKIPPED_CATE[x['ангилал']]).map((r) => ({ old_url: TIC + r['хуучин_url'], title: r['гарчиг'], 'шалтгаан': `Алгассан нийтлэл (${SKIPPED_CATE[r['ангилал']][1]})`, 'эх файл': 'batch-09-listing-pages.csv' })),
  ].filter((r) => !nrSeen.has(key(r.old_url)));
  const nrAll = [...nr, ...nrAdd];
  writeCsv(NOT_REDIRECTED, NR_HEAD, nrAll.map((r) => NR_HEAD.map((h) => r[h] ?? '')));

  // Бүх CSV (+ pending/: хуулсан ч хуудас нь нийтлэгдээгүй, redirect дараа нэмэгдэнэ)
  const files = fs.readdirSync(DIR).filter((f) => /^batch-.*\.csv$/.test(f)).sort();
  const pendingDir = path.join(DIR, 'pending');
  const pendingFiles = fs.existsSync(pendingDir) ? fs.readdirSync(pendingDir).filter((f) => f.endsWith('.csv')).sort() : [];
  const map = new Map();
  const checks = { dupOld: [], badNew: [], unpublished: {}, rows: {} };
  for (const f of files) {
    const rows = parseCsv(fs.readFileSync(path.join(DIR, f), 'utf8'));
    checks.rows[f] = rows.length;
    checks.unpublished[f] = 0;
    for (const r of rows) {
      const k = key(r.old_url);
      if (map.has(k)) checks.dupOld.push(`${r.old_url} (${map.get(k).file} ↔ ${f})`);
      else map.set(k, { ...r, file: f });
      if (!(r.new_url.startsWith(SITE) || r.new_url === '/')) checks.badNew.push(`${f}: ${r.new_url}`);
      const p = r.new_url.replace(SITE, '');
      if (UNPUBLISHED.some((re) => re.test(p))) checks.unpublished[f]++;
    }
  }

  // pending (хуулсан, хуудас нь нийтлэгдээгүй) ба not-redirected (TIC-д үлдэнэ) нь ангилалд л орно
  const pendingRows = {};
  for (const f of pendingFiles) {
    const rows = parseCsv(fs.readFileSync(path.join(pendingDir, f), 'utf8'));
    pendingRows[f] = rows.length;
    for (const r of rows) {
      const k = key(r.old_url);
      if (map.has(k)) checks.dupOld.push(`${r.old_url} (${map.get(k).file} ↔ pending/${f})`);
      else map.set(k, { ...r, file: `pending/${f}` });
    }
  }
  for (const r of nrAll) {
    const k = key(r.old_url);
    if (map.has(k)) checks.dupOld.push(`${r.old_url} (${map.get(k).file} ↔ not-redirected.csv)`);
    else map.set(k, { old_url: r.old_url, new_url: '', title: r.title, 'ангилал': r['шалтгаан'], file: 'not-redirected.csv' });
  }

  // Ангилал
  const cls = { ok: [], redirect: [], skip: [], unknown: [] };
  const byNew = new Map();
  for (const r of inv) {
    const m = map.get(key(r['хуучин_url']));
    if (m) { if (!byNew.has(m.new_url)) byNew.set(m.new_url, []); byNew.get(m.new_url).push(r); }
  }
  for (const r of inv) {
    const m = map.get(key(r['хуучин_url']));
    const base = { key: r.key, title: r['гарчиг'], old: r['хуучин_url'], cate: r['ангилал'] };
    if (!m || /Түр redirect/.test(m['ангилал'] || '')) { cls.unknown.push({ ...base, why: unknownReason(r) }); continue; }
    if (SKIPPED_CATE[r['ангилал']]) { cls.skip.push({ ...base, why: SKIPPED_CATE[r['ангилал']][1], to: m.new_url }); continue; }
    const a = m['ангилал'] || '';
    if (/алгассан/i.test(a)) { cls.skip.push({ ...base, why: (/\(([^)]*)\)/.exec(a) || [])[1] || 'алгассан', to: m.new_url }); continue; }
    if (r.key === 'c8_47') { cls.skip.push({ ...base, why: 'нийтлэл биш (байгууллагуудын утас, хаягийн жагсаалт)', to: m.new_url }); continue; }
    if (/өмнөх багцад бий/.test(a)) { cls.skip.push({ ...base, why: 'давхардал (өмнөх багцад бий, redirect)', to: m.new_url }); continue; }
    // Ижил шинэ хаяг руу олон мөр: хамгийн урт нь ✅, бусад нь ⛔ давхардал (TIC доторх)
    const g = byNew.get(m.new_url) || [r];
    if (g.length > 1 && !m.new_url.includes('#')) {
      const main = [...g].sort((x, y) => Number(y['үгийн_тоо']) - Number(x['үгийн_тоо']) || x.key.localeCompare(y.key))[0];
      if (main.key !== r.key) { cls.skip.push({ ...base, why: `давхардал (TIC дотор, ${main.key}-д нэгтгэсэн)`, to: m.new_url }); continue; }
    }
    cls.ok.push({ ...base, to: m.new_url });
  }
  function unknownReason(r) {
    if (r['ангилал'] === '14') return 'cate14 TypeID ' + (r['TypeID'] || '—') + ': 2-р багцад зөвхөн TypeID 2 орсон';
    if (r['ангилал'] === '15') return 'cate15 шашин шүтлэг: багцад ороогүй';
    if (r['ангилал'] === '16') return 'cate16 зан заншил: багцад ороогүй';
    return 'redirect хүснэгтэд алга';
  }

  const reasons = {};
  for (const s of cls.skip) { const k = s.why.replace(/\(TIC дотор, .*\)/, '(TIC дотор)'); reasons[k] = (reasons[k] || 0) + 1; }
  const byCate = (list) => { const o = {}; for (const x of list) o[x.cate] = (o[x.cate] || 0) + 1; return o; };
  const unkGroups = {};
  for (const u of cls.unknown) (unkGroups[u.why] = unkGroups[u.why] || []).push(u);

  const md = [
    '# TIC бүрэн хамрах шалгалт',
    '',
    `> ${new Date().toISOString().slice(0, 10)}. \`node scripts/tic/coverage.js\`. Эх: [tic-inventory.csv](tic-inventory.csv) (${inv.length} нийтлэл) + docs/redirects/batch-*.csv.`,
    '> «✅ шилжсэн» = Travel Hub-д хуулсан (шинэ хаягтай). 2026-10-21-ээс зөвхөн хуулсан хуудсыг redirect хийнэ; ⛔ алгассан хуудас TIC дээрээ үлдэнэ ([not-redirected.csv](../redirects/not-redirected.csv)).',
    '',
    '## Тоо',
    '',
    '| Ангилал | Тоо |',
    '|---|--:|',
    `| ✅ шилжсэн (шинэ хаягтай) | ${cls.ok.length} |`,
    `| ↪️ зөвхөн redirect (агуулга нь бүрэн шилжсэн ангиллын жагсаалт; inventory-д ороогүй) | ${b09.length} |`,
    `| ⛔ алгассан | ${cls.skip.length} |`,
    `| ❓ шийдээгүй | ${cls.unknown.length} |`,
    `| **Inventory нийт** (✅ + ⛔ + ❓) | **${cls.ok.length + cls.skip.length + cls.unknown.length}** / ${inv.length} |`,
    '',
    '### ⛔ шалтгаан',
    '',
    '| Шалтгаан | Тоо |',
    '|---|--:|',
    ...Object.entries(reasons).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${v} |`),
    '',
    'Алгассан хуудас redirect хийгдэхгүй — TIC сайт дээрээ үлдэнэ (TIC ажилласаар). Давхардал нь нэгтгэсэн хуудас руу redirect-тэй.',
    '',
    '### Ангиллаар (✅ / ⛔ / ❓)',
    '',
    '| TIC ангилал | ✅ | ⛔ | ❓ |',
    '|---|--:|--:|--:|',
    ...(() => { const a = byCate(cls.ok), b = byCate(cls.skip), c = byCate(cls.unknown); return [...new Set([...Object.keys(a), ...Object.keys(b), ...Object.keys(c)])].sort((x, y) => (Number(x) || 99) - (Number(y) || 99)).map((k) => `| ${k === 'news' ? 'Мэдээ' : 'cate' + k} | ${a[k] || 0} | ${b[k] || 0} | ${c[k] || 0} |`); })(),
    '',
    '## Redirect хүснэгтийн шалгалт',
    '',
    '| Файл | Мөр | Нээгдээгүй хэсэг рүү |',
    '|---|--:|--:|',
    ...files.map((f) => `| ${f} | ${checks.rows[f]} | ${checks.unpublished[f]} |`),
    ...pendingFiles.map((f) => `| pending/${f} (хуудас нийтлэгдээгүй, redirect хийгдээгүй) | ${pendingRows[f]} | — |`),
    `| not-redirected.csv (TIC-д үлдэнэ, redirect хийхгүй) | ${nrAll.length} | — |`,
    '',
    `- Нэг old_url давхардсан: **${checks.dupOld.length}**${checks.dupOld.length ? '\n' + checks.dupOld.slice(0, 30).map((x) => `  - ${x}`).join('\n') : ''}`,
    `- new_url \`${SITE}\`-оор эхлээгүй: **${checks.badNew.length}** `,
    '- «Нээгдээгүй хэсэг» = `/local/*` (Нутгийн Монгол, soft).',
    '',
    `## ❓ шийдээгүй (${cls.unknown.length})`,
    '',
    ...Object.entries(unkGroups).flatMap(([why, list]) => [
      `### ${why} (${list.length})`,
      '',
      '| key | Гарчиг | TIC |',
      '|---|---|---|',
      ...list.map((u) => `| ${u.key} | ${u.title.replace(/\|/g, '/')} | [${u.old}](${TIC}${u.old}) |`),
      '',
    ]),
  ];
  fs.writeFileSync(path.join(ROOT, 'docs', 'plan', 'tic-coverage.md'), md.join('\n'), 'utf8');
  console.log(`✅ ${cls.ok.length}  ↪️ ${b09.length}  ⛔ ${cls.skip.length}  ❓ ${cls.unknown.length}  (inventory ${inv.length})`);
  console.log('⛔', reasons);
  console.log('❓', Object.fromEntries(Object.entries(unkGroups).map(([k, v]) => [k, v.length])));
  console.log('CSV:', checks.rows, 'pending', pendingRows, 'not-redirected', nrAll.length, 'dupOld', checks.dupOld.length, 'badNew', checks.badNew.length, 'unpublished', checks.unpublished);
})().catch((e) => { console.error(e); process.exit(1); });

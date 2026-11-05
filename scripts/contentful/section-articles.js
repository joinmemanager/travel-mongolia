// «Нутгийн Монгол», «Хүндэтгэлтэй аялал», «Үр өгөөж & түншлэл»-ийн батлагдсан нийтлэлүүдийг docs/content/-ийн 3 md файлаас
// Contentful `story` төрөлд оруулна (topic = local / respect / impact, lib/sectionArticles.ts). Устгах, slug солих код алга.
//   node scripts/contentful/section-articles.js --dry [--out файл]   # хөрвүүлгийг шалгана, Contentful руу бичихгүй
//   node scripts/contentful/section-articles.js --links              # эх сурвалжийн холбоосуудыг шалгана
//   node scripts/contentful/section-articles.js --write              # topic-ийг идэвхжүүлж, draft үүсгэнэ/шинэчилнэ
//   node scripts/contentful/section-articles.js --publish            # draft-уудыг нийтэлнэ
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const DOCS = path.join(ROOT, 'docs', 'content');
const has = (flag) => process.argv.includes(flag);

// Дотоод ажлын тэмдэглэл (сайтад гарахгүй) ба алдааны засвар. Мөр бүр эхэд заавал олдох ёстой, үгүй бол зогсоно.
const REMOVE = {
  respect: [
    'Энэ амлалтыг хожим захиалгын үед жуулчид харуулж болно. Travel Hub 2.0 төлөвлөгөөнд ч ийм санал байгаа.',
    'Ёс заншлын зарим дүрэм нутаг, айл бүрт өөр байдаг. Нийтлэхээс өмнө танай багийн ахмад гишүүн эсвэл соёл судлаач нэг харвал сайн.',
    'Аюулгүй байдлын мэдээлэл хурдан өөрчлөгддөг. Сайтад тавихдаа «Сүүлд шалгасан» огноо харуулж, жилд нэгээс доргүй шинэчлэх хэрэгтэй.',
    '### Travel Hub юу хийж чадах вэ',
    'Буудал, бааз, аяллын хуудас бүрт «Хүртээмж» гэсэн товч мэдээлэл нэмж болно: тэргэнцрээр нэвтрэх боломж, шат, цахилгаан шат, ариун цэврийн байдал. Энэ мэдээллийг үйлчилгээ үзүүлэгчээс асууж цуглуулах хэрэгтэй. Хөгжлийн бэрхшээлтэй иргэдийн байгууллагатай хамтран ажиллавал илүү найдвартай болно.',
    'Энэ дэд хэсгийн эх сурвалж цөөн байна. ADB-ийн тайлангийн бүтэн PDF-ийг уншиж тоо баримт нэмэх, Монголын хөгжлийн бэрхшээлтэй иргэдийн байгууллагаас зөвлөгөө авах хэрэгтэй.',
  ],
  local: [],
  impact: [],
};

const EDITS = {
  local: [
    ['зан заншилын', 'зан заншлын'],
    ['Сайн хөтөч аяллыг зүгээр зараагаас мартагдашгүй', 'Сайн хөтөч аяллыг энгийн зорчлогоос мартагдашгүй'],
    ['хөтөчийг', 'хөтчийг'],
    ['хөтөчийн', 'хөтчийн'],
    ['Монгол өрхийн таван бутны нэг', 'Монгол өрхийн тавны нэг'],
    ['7 сая орчимоор', '7 сая орчмоор'],
    ['хамгаалагдахад ч туслалцаж болно', 'хамгаалагдахад ч тусалж болно'],
    ['бодит бус соёлын', 'биет бус соёлын'],
    ['эргэтэйчүүд', 'эрэгтэйчүүд'],
    ['бүрээсийг оёж, исгэлэн хийдэг', 'бүрээсийг оёж, эсгий хийдэг'],
    ['Хонины ноос бэлдэх, исгэлэн хийх', 'Хонины ноос бэлдэх, эсгий хийх'],
    ['Исгэлэн хийх, гэр барихад', 'Эсгий хийх, гэр барихад'],
    ['малчдын мэдлэг, ёс заншилыг', 'малчдын мэдлэг, ёс заншлыг'],
    ['Айлаас араат чихэр, баслаг, өрөм зэрэг', 'Айлаас ааруул, бяслаг, өрөм зэрэг'],
    ['бэлчээр сэргэхд хцүү болдог', 'бэлчээр сэргэхэд хэцүү болдог'],
  ],
  respect: [
    ['### Санал: «Монголд хүндэтгэлтэй аялах амлалт»', '### Монголд хүндэтгэлтэй аялах амлалт'],
    ['зөвшөөрөлгүйгээр зурагдахгүй', 'зөвшөөрөлгүйгээр зураг авахгүй'],
    ['ургамал сэргэхд олон жил', 'ургамал сэргэхэд олон жил'],
    ['дөнгөж 10% орчим нь замасан', 'дөнгөж 10% орчим нь засмал'],
    ['хиагуурын утас', 'хиймэл дагуулын утас'],
    ['хардвар дамжих', 'халдвар дамжих'],
    ['эмчд яаралтай', 'эмчид яаралтай'],
    ['харааслагчид ихсдэг', 'халаасны хулгайчид ихэсдэг'],
    ['шөнө ганцаараа бурахаас зайлсхийг зөвлөдөг', 'шөнө ганцаараа явахаас зайлсхийхийг зөвлөдөг'],
    ['ариун цэврийн өргөн', 'ариун цэврийн өрөөний өргөн'],
    ['Ахмад болон арааг өвчтэй', 'Ахмад болон архаг өвчтэй'],
    ['Шороон зам олон цаг гөвидөг.', 'Шороон замаар олон цаг сэгсрүүлж явдаг.'],
  ],
  impact: [
    ['joinme-ийн 465 үйлчилгээ үүний суурь', 'joinme-ийн үйлчилгээний мэдээлэл үүний суурь'],
    ['Нутагт үр өгөөж хүргэх гурав суваг:', 'Нутагт үр өгөөж хүргэх дөрвөн суваг:'],
    ['орон нутгийн хөтөчийг', 'орон нутгийн хөтчийг'],
    ['амьжигааны', 'амьжиргааны'],
    ['\\~16,296', '~16,296'],
    ['2021](https://mdpi.com/2071-1050/13/7/4001), CC BY):', '2021](https://mdpi.com/2071-1050/13/7/4001)):'],
    ['чанар хүрдэхүүн бол', 'чанар хангасан бол'],
    ['гэсэн гуравыг биелүүлэх', 'гэсэн гурвыг биелүүлэх'],
  ],
};

// Дэд хэсэг → slug (нэг удаа тогтоосон, өөрчлөхгүй). Хаана харагдахыг lib/sectionArticles.ts ARTICLE_PLACES заана.
const PLACES = {
  local: {
    file: 'Нутгийн Монгол — Нийтлэлийн эх.md', date: '2026-10-29',
    'Нутгийн туршлага': 'respectful-herder-stay',
    'Нутгийн хөтөч': 'local-guide-value',
    'Малчин өрх': 'herder-households-today',
    'Гар урлаач': 'ger-to-felt-crafts',
    'Нутгийн хоол': 'airag-and-dairy',
    'Нутгийн бүтээгдэхүүн': 'choosing-local-products',
  },
  respect: {
    file: 'Хүндэтгэлтэй аялал — Судалгаа ба нийтлэл.md', date: '2026-10-30',
    'Хариуцлагатай аяллын гарын авлага': 'responsible-travel',
    'Соёл, ёс заншил': 'herder-visit-etiquette',
    'Байгальд ээлтэй аялал': 'protecting-the-steppe',
    'Аюулгүй байдал': 'safe-travel-tips',
    'Хүртээмжтэй аялал': 'accessible-travel-tips',
  },
  impact: {
    file: 'Үр өгөөж & Түншлэл — Судалгаа ба нийтлэл.md', date: '2026-10-30',
    'Орон нутгийн үр өгөөж': 'tourism-income-local',
    'Түншлэлийн төслүүд': 'project-lessons',
    'Аймаг / DMO': 'destination-management',
    'Аяллын бизнес': 'tourism-business-value',
    'Хандивлагч / хөрөнгө оруулагч': 'who-funds-tourism',
  },
};
// Эх файлын зөвлөмжийн дагуу зөвхөн аюулгүй байдлын нийтлэлд шалгасан огноо харагдана
const LAST_CHECKED = { 'safe-travel-tips': 'Сүүлд шалгасан: 2026 оны 10-р сарын 30.' };

// ---------------------------------------------------------------- markdown → Contentful Rich Text
const text = (value, marks = []) => ({ nodeType: 'text', value, marks: marks.map((type) => ({ type })), data: {} });
const node = (nodeType, content, data = {}) => ({ nodeType, data, content });
const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

function inline(s) {
  const out = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  for (const m of s.matchAll(re)) {
    if (m.index > last) out.push(text(s.slice(last, m.index)));
    if (m[1]) out.push(text(m[1], ['bold']));
    else if (m[2]) out.push(text(m[2], ['italic']));
    else out.push(node('hyperlink', [text(m[3])], { uri: m[4] }));
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(text(s.slice(last)));
  // Rich Text: догол мөр холбоосоор эхэлж, дуусахдаа хоосон text шаардана
  if (out[0]?.nodeType === 'hyperlink') out.unshift(text(''));
  if (out[out.length - 1]?.nodeType === 'hyperlink') out.push(text(''));
  return out.length ? out : [text('')];
}
const para = (s) => node('paragraph', inline(s));
const heading = (s) => node('heading-2', [text(s)]);
const cells = (r) => r.trim().replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*/);
const isSeparator = (r) => /^\|[\s:|-]+\|?\s*$/.test(r);

const table = (rows) => node('table', rows.map((row, n) =>
  node('table-row', row.map((c) => node(n === 0 ? 'table-header-cell' : 'table-cell', [para(c)])))));

function toNodes(lines) {
  const content = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trimEnd();
    if (!line.trim()) { i++; continue; }
    if (line.startsWith('### ')) { content.push(heading(line.slice(4))); i++; continue; }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      content.push(table(rows.filter((r) => !isSeparator(r)).map(cells)));
      continue;
    }
    const list = line.match(/^(- |\d+\. )/);
    if (list) {
      const ordered = list[1] !== '- ';
      const re = ordered ? /^\d+\. / : /^- /;
      const items = [];
      while (i < lines.length && re.test(lines[i])) items.push(node('list-item', [para(lines[i++].replace(re, '').trimEnd())]));
      content.push(node(ordered ? 'ordered-list' : 'unordered-list', items));
      continue;
    }
    content.push(para(line));
    i++;
  }
  return content;
}

const plain = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(plain).join(''));

function seoDescription(content) {
  const first = plain(content.find((n) => n.nodeType === 'paragraph')).replace(/\s+/g, ' ').replace(/\s*\(\s*\)/g, '').trim();
  if (first.length <= 155) return first;
  return `${first.slice(0, 155).replace(/[\s,.;:]+\S*$/, '')}…`;
}

function readDoc(section) {
  let raw = fs.readFileSync(path.join(DOCS, PLACES[section].file), 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  for (const line of REMOVE[section]) {
    if (!raw.includes(line)) throw new Error(`Хасах мөр олдсонгүй: ${line}`);
    raw = raw.replace(line, '');
  }
  for (const [from, to] of EDITS[section]) {
    if (!raw.includes(from)) throw new Error(`Засах текст олдсонгүй: ${from}`);
    raw = raw.split(from).join(to);
  }
  return raw.split('\n');
}

// `## N. Нэр` бүлгүүд. Толгойн огноо/зохиогчийн мөр, тайлбар нь эхний бүлгээс өмнө тул орохгүй.
function chapters(lines) {
  const out = [];
  let cur = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      const m = line.match(/^## (\d)\. (.+)$/);
      cur = m ? { n: Number(m[1]), name: m[2].trim(), lines: [] } : null;
      if (cur) out.push(cur);
    } else if (cur) cur.lines.push(line);
  }
  return out;
}

const sourcesList = (lines) => [
  heading('Эх сурвалж'),
  node('unordered-list', lines.map((l) => node('list-item', [para(l)]))),
];

function parseLocal(lines) {
  return chapters(lines).map((c) => {
    const sub = c.lines.find((l) => l.startsWith('*Дэд хэсэг:'));
    if (!sub) throw new Error(`Дэд хэсэг алга: ${c.name}`);
    const place = sub.replace(/^\*Дэд хэсэг:\s*|\*$/g, '').trim();
    const src = c.lines.find((l) => l.startsWith('**Эх сурвалж:**'));
    const links = [...src.matchAll(LINK)].map((m) => m[0]);
    const body = c.lines.filter((l) => l !== sub && l !== src);
    return { place, title: c.name, nodes: toNodes(body), sources: sourcesList(links), urls: [...src.matchAll(LINK)].map((m) => [m[1], m[2]]) };
  });
}

// `### Нийтлэл: Гарчиг`, дараа нь нийтлэлийн бие
function articleOf(c) {
  const i = c.lines.findIndex((l) => l.startsWith('### Нийтлэл:'));
  if (i < 0) throw new Error(`Нийтлэл алга: ${c.name}`);
  return { title: c.lines[i].replace('### Нийтлэл:', '').trim(), rest: c.lines.slice(i + 1) };
}

function parseRespect(lines) {
  return chapters(lines).map((c) => {
    const { title, rest } = articleOf(c);
    const s = rest.indexOf('### Эх сурвалж');
    const rows = rest.slice(s + 1).filter((l) => l.startsWith('|') && !isSeparator(l)).map(cells);
    if (rows[0][3] !== 'Лиценз') throw new Error(`Лиценз багана хүлээсэн: ${c.name}`);
    return {
      place: c.name,
      title,
      nodes: toNodes(rest.slice(0, s)),
      // «Лиценз» баганыг сайтад гаргахгүй
      sources: [heading('Эх сурвалж'), table(rows.map((r) => r.slice(0, 3)))],
      urls: rows.slice(1).flatMap((r) => [...r[0].matchAll(LINK)].map((m) => [m[1], m[2]])),
    };
  });
}

function parseImpact(lines) {
  const at = lines.indexOf('## Эх сурвалж');
  const master = lines.slice(at + 1).filter((l) => l.startsWith('|') && !isSeparator(l)).map(cells);
  if (master[0][3] !== 'Хэрэглэх нөхцөл') throw new Error('Эх сурвалжийн хүснэгт өөрчлөгдсөн');
  const rows = master.slice(1).map((r) => {
    const m = [...r[0].matchAll(LINK)][0];
    return { cell: r[0], label: m[1], url: m[2], year: r[1], parts: r[2].split(/,\s*/).map(Number) };
  });
  return chapters(lines.slice(0, at)).map((c) => {
    const { title, rest } = articleOf(c);
    const inlineUrls = rest.flatMap((l) => [...l.matchAll(LINK)].map((m) => m[2]));
    for (const u of inlineUrls) if (!rows.some((r) => r.url === u)) throw new Error(`Хүснэгтэд байхгүй холбоос: ${u}`);
    // Хүснэгтийн «Ашигласан хэсэг» + нийтлэл дотор иш татсан холбоос. «Ашигласан хэсэг», «Хэрэглэх нөхцөл» сайтад гарахгүй.
    const own = rows.filter((r) => r.parts.includes(c.n) || inlineUrls.includes(r.url));
    return {
      place: c.name,
      title,
      nodes: toNodes(rest),
      sources: [heading('Эх сурвалж'), table([['Эх сурвалж', 'Он'], ...own.map((r) => [r.cell, r.year])])],
      urls: own.map((r) => [r.label, r.url]),
    };
  });
}

function buildAll() {
  const parsers = { local: parseLocal, respect: parseRespect, impact: parseImpact };
  const all = [];
  for (const section of Object.keys(PLACES)) {
    const articles = parsers[section](readDoc(section));
    const names = Object.keys(PLACES[section]).filter((k) => !['file', 'date'].includes(k));
    if (articles.length !== names.length) throw new Error(`${section}: ${names.length} нийтлэл хүлээсэн, ${articles.length} олдов`);
    for (const a of articles) {
      const slug = PLACES[section][a.place];
      if (!slug) throw new Error(`${section}: дэд хэсэг таарсангүй: ${a.place}`);
      const checked = LAST_CHECKED[slug] ? [para(LAST_CHECKED[slug])] : [];
      all.push({
        id: `article-${slug}`,
        section,
        slug,
        place: a.place,
        title: a.title,
        date: PLACES[section].date,
        body: node('document', [...a.nodes, ...checked, ...a.sources]),
        seoDescription: seoDescription(a.nodes),
        source: a.urls.map(([label, url]) => `${label.replace(/\*/g, '')}: ${url}`).join('\n'),
        urls: a.urls,
      });
    }
  }
  return all;
}

const FORBIDDEN = /Дэд хэсэг:|@joinme|Нийтлэл:|Санал:|Лиценз|Хэрэглэх нөхцөл|Ашигласан хэсэг|CC BY|Open Government|11-р сарын 1|Нийтлэхээс өмнө|Сайтад тавихдаа|Travel Hub 2\.0|\\~/;

function dump(body, out = [], depth = 0) {
  for (const n of body.content || []) {
    if (n.nodeType === 'table-row') out.push(`| ${n.content.map(plain).join(' | ')} |`);
    else if (['paragraph', 'heading-2', 'list-item'].includes(n.nodeType)) out.push(`${n.nodeType === 'heading-2' ? '### ' : n.nodeType === 'list-item' ? '- ' : ''}${plain(n)}`);
    else dump(n, out, depth + 1);
  }
  return out;
}

async function checkLinks(all) {
  const urls = [...new Set(all.flatMap((a) => a.urls.map((u) => u[1])))];
  console.log('шалгах холбоос', urls.length);
  for (const url of urls) {
    let status;
    try {
      const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36' }, signal: AbortSignal.timeout(25000) });
      status = res.status;
      res.body?.cancel().catch(() => {});
    } catch (e) { status = `АЛДАА ${e.cause?.code || e.name}`; }
    console.log(String(status).padEnd(8), url);
  }
}

(async () => {
  const all = buildAll();
  for (const a of all) {
    const flat = JSON.stringify(dump(a.body));
    const bad = flat.match(FORBIDDEN);
    if (bad) throw new Error(`${a.slug}: дотоод тэмдэглэл үлдсэн: ${bad[0]}`);
    console.log(`${a.section.padEnd(8)}${a.place} → ${a.slug} | ${a.title} | эх сурвалж ${a.urls.length}`);
  }
  const outAt = process.argv.indexOf('--out');
  if (outAt > 0) fs.writeFileSync(process.argv[outAt + 1], all.map((a) => [`# ${a.title} [${a.slug}]`, `SEO: ${a.seoDescription}`, '', ...dump(a.body)].join('\n')).join('\n\n'));
  if (has('--links')) return checkLinks(all);
  if (!has('--write') && !has('--publish')) return;

  const { cma, LOCALE, callCount } = require('../tic/_cma');
  const v = (x) => ({ [LOCALE]: x });

  if (has('--write')) {
    // Төрөл: topic-д утга нэмнэ, бусдыг хөндөхгүй
    let ct = await cma('GET', '/content_types/story');
    const need = ['local', 'respect', 'impact'];
    const fields = ct.fields.map((x) => {
      if (x.id !== 'topic') return x;
      return { ...x, validations: x.validations.map((val) => (val.in ? { ...val, in: [...val.in, ...need.filter((t) => !val.in.includes(t))] } : val)) };
    });
    if (JSON.stringify(fields) !== JSON.stringify(ct.fields)) {
      ct = await cma('PUT', '/content_types/story', { version: ct.sys.version, body: { name: ct.name, description: ct.description, displayField: ct.displayField, fields } });
      await cma('PUT', '/content_types/story/published', { version: ct.sys.version });
      console.log('topic-д нэмэв', need.join(', '));
    }
    for (const a of all) {
      const fieldsOut = {
        title: v(a.title), slug: v(a.slug), topic: v(a.section), body: v(a.body), source: v(a.source), language: v('mn'),
        updatedDate: v(a.date), seoTitle: v(a.title), seoDescription: v(a.seoDescription),
      };
      const cur = await cma('GET', `/entries/${a.id}`);
      if (cur && JSON.stringify(cur.fields.body) === JSON.stringify(fieldsOut.body) && cur.fields.seoDescription?.[LOCALE] === a.seoDescription) { console.log('өөрчлөлтгүй', a.id); continue; }
      const saved = await cma('PUT', `/entries/${a.id}`, cur ? { version: cur.sys.version, body: { fields: { ...cur.fields, ...fieldsOut } } } : { contentType: 'story', body: { fields: fieldsOut } });
      console.log(cur ? 'шинэчлэв' : 'үүсгэв', saved.sys.id, 'ver', saved.sys.version);
    }
  }

  if (has('--publish')) {
    for (const a of all) {
      const cur = await cma('GET', `/entries/${a.id}`);
      if (!cur) throw new Error(`Entry алга: ${a.id}`);
      if (cur.sys.publishedVersion && cur.sys.version === cur.sys.publishedVersion + 1) { console.log('нийтлэгдсэн', a.id); continue; }
      await cma('PUT', `/entries/${a.id}/published`, { version: cur.sys.version });
      console.log('нийтлэв', a.id);
    }
  }
  console.log('CMA хүсэлт:', callCount());
})().catch((e) => { console.error(e.message); process.exit(1); });

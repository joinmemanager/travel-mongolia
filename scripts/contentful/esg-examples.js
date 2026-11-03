// «Олон улсын жишиг ба тайлан» (/impact/examples): docs/content/esg-international-examples.md-ийн 6 нийтлэлийг
// Contentful `story` төрөлд (topic = international) DRAFT-аар оруулна. Дахин ажиллуулахад аюулгүй: байгаа entry-ийг
// хөндөхгүй. Юу ч нийтлэхгүй, устгахгүй. Зөвхөн content type-ийн шинэ талбарыг идэвхжүүлнэ.
//   node scripts/contentful/esg-examples.js --dry    # хөрвүүлгийг шалгана, Contentful руу бичихгүй
//   node scripts/contentful/esg-examples.js
const fs = require('fs');
const path = require('path');
const { cma, ROOT, LOCALE, callCount } = require('../tic/_cma');

const DRY = process.argv.includes('--dry');
const MD = path.join(ROOT, 'docs', 'content', 'esg-international-examples.md');
const TOPIC = 'international';

// Эх тайлангийн холбоо: md файлын төгсгөлийн хүснэгтээс (Словенийнхийг slovenia.info-оос олсон). № нь md-ийн бүлгийн дугаар.
const REPORTS = {
  1: { slug: 'gstc-criteria', publisher: 'GSTC', year: 2019, sourceType: 'standard', originalUrl: 'https://www.gstc.org/gstc-criteria/gstc-destination-criteria/', seoTitle: 'GSTC-ийн дестинацийн шалгуур', seoDescription: 'Тогтвортой аялал жуулчлалын дэлхийн суурь стандарт GSTC Destination Criteria v2.0-ийн монгол хураангуй: 4 бүлэг, 38 шалгуур, Монголд хэрэгжүүлэх санаа.' },
  2: { slug: 'oecd-recovery', publisher: 'OECD', year: 2021, sourceType: 'policy', originalUrl: 'https://doi.org/10.1787/b062f603-en', seoTitle: 'OECD: аялал жуулчлалын цогц үр өгөөж', seoDescription: 'OECD-ийн 2021 оны бодлогын баримтын монгол хураангуй: амжилтыг аялагчдын тоогоор бус цогц үр өгөөжөөр хэмжих таван чиглэл, улс орнуудын жишээ.' },
  3: { slug: 'eu-tourism', publisher: 'European Parliament', year: 2019, sourceType: 'research', originalUrl: 'https://www.europarl.europa.eu/RegData/etudes/STUD/2019/629200/IPOL_STU(2019)629200_EN.pdf', seoTitle: 'Европын аялал жуулчлалын судалгаа', seoDescription: 'Европын парламентын 2019 оны судалгааны монгол хураангуй: хэт ачааллаас тогтвортой удирдлага руу шилжих зөвлөмж, Барселоны жишээ.' },
  4: { slug: 'slovenia-green', publisher: 'Slovenian Tourist Board', year: 2017, sourceType: 'statistics', originalUrl: 'https://www.slovenia.info/uploads/dokumenti/raziskave/2017_06_sto_tvs_2016_a4_ang_web_3.pdf', seoTitle: 'Словени: ногоон брэндийн туршлага', seoDescription: 'Tourism in Numbers 2016 тайлангийн монгол хураангуй: Словени «ногоон»-ыг улсын брэнд болгосон туршлага, Slovenia Green гэрчилгээжүүлэлт.' },
  5: { slug: 'booking-holdings', publisher: 'Booking Holdings', year: 2025, sourceType: 'company-report', originalUrl: 'https://www.bookingholdings.com/wp-content/uploads/2025/04/Booking-Holdings_2024_Sustainability_Report.pdf', seoTitle: 'Booking Holdings-ийн тогтвортой байдал', seoDescription: 'Booking Holdings-ийн 2024 оны тогтвортой байдлын тайлангийн монгол хураангуй: стратегийн гурван тулгуур, аялагчдын судалгаа, сургамж.' },
  6: { slug: 'marriott-serve-360', publisher: 'Marriott International', year: 2024, sourceType: 'company-report', originalUrl: 'https://serve360.marriott.com/wp-content/uploads/2024/07/2024ESGProgress.pdf', seoTitle: 'Marriott Serve 360: ESG зорилт', seoDescription: 'Marriott-ийн 2024 Serve 360 тайлангийн монгол хураангуй: зочид буудлын ESG зорилтыг тоогоор илэрхийлэх нь, хүрсэн үр дүн, хоцролтоо тайлагнах сургамж.' },
};

const SOURCE_TYPES = ['standard', 'policy', 'research', 'statistics', 'company-report'];
const f = (id, name, type, extra = {}) => ({ id, name, type, localized: false, required: false, disabled: false, omitted: false, validations: [], ...extra });
const NEW_FIELDS = [
  f('originalUrl', 'Эх тайлангийн холбоос', 'Symbol', { validations: [{ regexp: { pattern: '^https?://' } }] }),
  f('publisher', 'Хэвлэгч', 'Symbol'),
  f('year', 'Он', 'Integer'),
  f('sourceType', 'Эх тайлангийн төрөл', 'Symbol', { validations: [{ in: SOURCE_TYPES }] }),
];

// ---------------------------------------------------------------- markdown → Contentful Rich Text
const text = (value, marks = []) => ({ nodeType: 'text', value, marks: marks.map((type) => ({ type })), data: {} });
const node = (nodeType, content, data = {}) => ({ nodeType, data, content });

// **тод**, *налуу*, [холбоос](url), [холбоос](<url>)
function inline(s, linkTo) {
  const out = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(<?([^\s>]+?)>?\)(?=[\s.;,]|$)/g;
  let last = 0;
  for (const m of s.matchAll(re)) {
    if (m.index > last) out.push(text(s.slice(last, m.index)));
    if (m[1]) out.push(text(m[1], ['bold']));
    else if (m[2]) out.push(text(m[2], ['italic']));
    else {
      // Эх сурвалжийн мөрийн холбоос үргэлж шалгасан эх тайлан руу заана
      const uri = linkTo || m[4];
      const label = linkTo ? new URL(linkTo).hostname.replace(/^www\./, '') : m[3];
      out.push(node('hyperlink', [text(label)], { uri }));
    }
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(text(s.slice(last)));
  // Rich Text: догол мөр холбоосоор эхэлж, дуусахдаа хоосон text шаардана
  if (out[0]?.nodeType === 'hyperlink') out.unshift(text(''));
  if (out[out.length - 1]?.nodeType === 'hyperlink') out.push(text(''));
  return out.length ? out : [text('')];
}
const para = (s, linkTo) => node('paragraph', inline(s, linkTo));

function toRichText(lines, originalUrl) {
  const content = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trimEnd();
    if (!line.trim()) { i++; continue; }
    if (line.startsWith('### ')) { content.push(node('heading-2', inline(line.slice(4)))); i++; continue; }
    if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) rows.push(lines[i++]);
      const cells = (r) => r.trim().replace(/^\|\s*|\s*\|$/g, '').split(/\s*\|\s*/);
      const body = rows.filter((r) => !/^\|[\s:|-]+\|?\s*$/.test(r));
      content.push(node('table', body.map((r, n) => node('table-row', cells(r).map((c) => node(n === 0 ? 'table-header-cell' : 'table-cell', [para(c)]))))));
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
    content.push(para(line, line.startsWith('Эх сурвалж:') ? originalUrl : undefined));
    i++;
  }
  return node('document', content);
}

// `## N. Гарчиг` бүрээс дараагийн `## ` хүртэл
function parseArticles() {
  const lines = fs.readFileSync(MD, 'utf8').split(/\r?\n/);
  const out = [];
  let cur = null;
  for (const line of lines) {
    if (line.startsWith('## ')) {
      const m = line.match(/^## (\d)\. (.+)$/);
      cur = m ? { n: Number(m[1]), title: m[2].trim(), lines: [] } : null;
      if (cur) out.push(cur);
    } else if (cur) cur.lines.push(line);
  }
  return out;
}

(async () => {
  const articles = parseArticles();
  if (articles.length !== 6) throw new Error(`6 нийтлэл хүлээсэн, ${articles.length} олдов`);
  const entries = articles.map((a) => {
    const r = REPORTS[a.n];
    const body = toRichText(a.lines, r.originalUrl);
    const source = a.lines.find((l) => l.startsWith('Эх сурвалж:')).replace(/^Эх сурвалж:\s*/, '').replace(/\[[^\]]+\]\([^\s]+\)/g, r.originalUrl).replace(/\*/g, '');
    return { id: `esg-${r.slug}`, a, r, body, source };
  });
  for (const e of entries) {
    const kinds = {};
    const walk = (n) => { kinds[n.nodeType] = (kinds[n.nodeType] || 0) + 1; (n.content || []).forEach(walk); };
    walk(e.body);
    console.log(e.id, '|', e.a.title);
    console.log('   ', JSON.stringify(kinds), 'эх сурвалж:', e.source.slice(0, 120));
  }
  if (DRY) return;

  // 1) Content type: зөвхөн нэмнэ (байгаа талбар, entry хөндөхгүй)
  let ct = await cma('GET', '/content_types/story');
  const fields = ct.fields.map((x) => {
    if (x.id !== 'topic') return x;
    const list = x.validations.find((v) => v.in);
    return list.in.includes(TOPIC) ? x : { ...x, validations: x.validations.map((v) => (v.in ? { ...v, in: [...v.in, TOPIC] } : v)) };
  });
  const add = NEW_FIELDS.filter((x) => !fields.some((y) => y.id === x.id));
  const topicChanged = JSON.stringify(fields) !== JSON.stringify(ct.fields);
  if (add.length || topicChanged) {
    ct = await cma('PUT', '/content_types/story', { version: ct.sys.version, body: { name: ct.name, description: ct.description, displayField: ct.displayField, fields: [...fields, ...add] } });
    console.log('төрөл шинэчлэв: нэмсэн талбар', add.map((x) => x.id).join(', ') || '-', 'topic:', topicChanged);
    ct = await cma('PUT', '/content_types/story/published', { version: ct.sys.version });
    console.log('төрлийн шинэ талбарыг идэвхжүүлэв');
  }

  // 2) Entry-үүд: зөвхөн draft, байгаа бол алгасна
  for (const e of entries) {
    if (await cma('GET', `/entries/${e.id}`)) { console.log('байгаа, алгасав', e.id); continue; }
    const v = (x) => ({ [LOCALE]: x });
    const saved = await cma('PUT', `/entries/${e.id}`, {
      contentType: 'story',
      body: { fields: {
        title: v(e.a.title), slug: v(e.r.slug), topic: v(TOPIC), body: v(e.body), source: v(e.source), language: v('mn'),
        originalUrl: v(e.r.originalUrl), publisher: v(e.r.publisher), year: v(e.r.year), sourceType: v(e.r.sourceType),
        seoTitle: v(e.r.seoTitle), seoDescription: v(e.r.seoDescription),
      } },
    });
    console.log('үүсгэв', saved.sys.id, 'ver', saved.sys.version, 'нийтлэгдсэн:', !!saved.sys.publishedVersion);
  }
  console.log('CMA хүсэлт:', callCount());
})().catch((e) => { console.error(e.message); process.exit(1); });

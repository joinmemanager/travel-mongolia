// Redirect CSV-үүдийг production дээр шалгаад кодерт өгөх Excel үүсгэнэ (docs/redirects/excel/).
// CSV-ийг өөрчлөхгүй. 404 өгсөн мөр Excel-д орохгүй, 404-review.csv-д гарна.
//   node scripts/tic/redirect-excel.js
// Энэ машинд Python, Excel байхгүй тул .xlsx-ийг (OOXML) шууд бичнэ, нэмэлт сан хэрэггүй.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { parseCsv } = require('./_csv');

const ROOT = path.resolve(__dirname, '..', '..');
const DIR = path.join(ROOT, 'docs', 'redirects');
const OUT = path.join(DIR, 'excel');
const read = (f) => parseCsv(fs.readFileSync(path.join(DIR, f), 'utf8'));
// 9-р багцаас хойшлуулсан 7 мөр: cate14 ×4, cate15, cate21, cate22
const DEFERRED = /\/cate(14|15|21|22)\.aspx/;
const BATCHES = {
  'batch-07': read('batch-07-events-camps-hotels.csv'),
  'batch-10': read('batch-10-people-culture.csv'),
  'batch-09-deferred': read('batch-09-listing-pages.csv').filter((r) => DEFERRED.test(r.old_url)),
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function step(url) {
  for (let i = 1; i <= 4; i++) {
    try {
      const res = await fetch(url, { redirect: 'manual', headers: { 'User-Agent': 'TravelHubMongolia-redirect-check/1.0' }, signal: AbortSignal.timeout(45000) });
      const html = await res.text();
      if ((res.status >= 500 || res.status === 429) && i < 4) { await sleep(2000 * i); continue; }
      return { status: res.status, location: res.headers.get('location'), html };
    } catch (e) {
      if (i === 4) return { status: 0, html: '', error: e.message };
      await sleep(2000 * i);
    }
  }
}

// Эцсийн хаяг хүртэл дагана. notFound() заримдаа 200-аар ирдэг тул агуулгыг нь ч шалгана.
async function check(url) {
  let cur = url;
  for (let hop = 0; hop < 8; hop++) {
    const r = await step(cur);
    if (r.status >= 300 && r.status < 400 && r.location) { cur = new URL(r.location, cur).href; continue; }
    const soft404 = r.status === 200 && /NEXT_HTTP_ERROR_FALLBACK;404|<title>[^<]*(404|олдсонгүй)/i.test(r.html);
    return {
      finalUrl: cur, status: soft404 ? 404 : r.status, soft404, hops: hop,
      noindex: /<meta name="robots" content="[^"]*noindex/.test(r.html),
      title: (r.html.match(/<title>([^<]*)/) || [])[1] || '',
    };
  }
  return { finalUrl: cur, status: 0, soft404: false, hops: 8, noindex: false, title: '' };
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const colName = (i) => String.fromCharCode(65 + i);

// Нүд: тоо, текст эсвэл { f: томъёо, v: хадгалсан утга }. Загвар: 0 энгийн, 1 толгой, 2 тод
function cellXml(ref, v, style) {
  const s = style ? ` s="${style}"` : '';
  if (v && typeof v === 'object') return `<c r="${ref}"${s}><f>${esc(v.f)}</f><v>${v.v}</v></c>`;
  if (typeof v === 'number') return `<c r="${ref}"${s}><v>${v}</v></c>`;
  return `<c r="${ref}"${s} t="inlineStr"><is><t>${esc(v)}</t></is></c>`;
}

function sheetXml(rows, { autoFilter, boldLast, colWidths }) {
  const widths = colWidths || rows[0].map((_, c) => Math.min(255, Math.max(...rows.map((r) => {
    const v = r[c];
    return String(v && typeof v === 'object' ? v.v : v ?? '').length;
  })) + 3));
  const last = `${colName(rows[0].length - 1)}${rows.length}`;
  const data = rows.map((r, i) => {
    const style = i === 0 ? 1 : boldLast && i === rows.length - 1 ? 2 : 0;
    return `<row r="${i + 1}">${r.map((v, c) => cellXml(`${colName(c)}${i + 1}`, v, style)).join('')}</row>`;
  }).join('');
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
    + '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    + `<dimension ref="A1:${last}"/>`
    + '<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/></sheetView></sheetViews>'
    + '<sheetFormatPr defaultRowHeight="15"/>'
    + `<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join('')}</cols>`
    + `<sheetData>${data}</sheetData>`
    + (autoFilter ? `<autoFilter ref="A1:${last}"/>` : '')
    + '</worksheet>';
}

const STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n'
  + '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
  + '<fonts count="3">'
  + '<font><sz val="10"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
  + '<font><b/><sz val="10"/><color rgb="FFFFFFFF"/><name val="Arial"/><family val="2"/></font>'
  + '<font><b/><sz val="10"/><color rgb="FF000000"/><name val="Arial"/><family val="2"/></font>'
  + '</fonts>'
  + '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
  + '<fill><patternFill patternType="solid"><fgColor rgb="FF15803D"/><bgColor indexed="64"/></patternFill></fill></fills>'
  + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
  + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
  + '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
  + '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>'
  + '<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>'
  + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
  + '</styleSheet>';

const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
function crc32(buf) { let c = 0xffffffff; for (const b of buf) c = crcTable[(c ^ b) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }

function zip(files) {
  const parts = [], central = [];
  let offset = 0;
  for (const [name, content] of Object.entries(files)) {
    const raw = Buffer.from(content, 'utf8'), data = zlib.deflateRawSync(raw), nameBuf = Buffer.from(name), crc = crc32(raw);
    const common = Buffer.alloc(26);
    common.writeUInt16LE(20, 0); common.writeUInt16LE(0x0800, 2); common.writeUInt16LE(8, 4);
    common.writeUInt16LE(0, 6); common.writeUInt16LE(0x21, 8); // 1980-01-01: файл дахин үүсгэхэд өөрчлөгдөхгүй
    common.writeUInt32LE(crc, 10); common.writeUInt32LE(data.length, 14); common.writeUInt32LE(raw.length, 18);
    common.writeUInt16LE(nameBuf.length, 22); common.writeUInt16LE(0, 24);
    const local = Buffer.concat([Buffer.from([0x50, 0x4b, 3, 4]), common, nameBuf, data]);
    const tail = Buffer.alloc(14); tail.writeUInt32LE(offset, 10);
    central.push(Buffer.concat([Buffer.from([0x50, 0x4b, 1, 2, 20, 0]), common, tail, nameBuf]));
    parts.push(local);
    offset += local.length;
  }
  const dir = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(central.length, 8); end.writeUInt16LE(central.length, 10);
  end.writeUInt32LE(dir.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...parts, dir, end]);
}

// «Кодерт анхааруулах» хуудас: cate14-ийн дүрмүүдийн дараалал. Хаягийг мөрүүдээс авна (CSV-тэй зөрөхгүй).
function coderNotes(rows) {
  const target = (old) => {
    const row = rows.find((r) => r[0] === `https://www.touristinfocenter.mn${old}`);
    if (!row) throw new Error(`мөр олдсонгүй: ${old}`);
    return row[1];
  };
  const pathOf = (u) => new URL(u).pathname;
  const type3 = target('/cate14.aspx?TypeID=3');
  const general = target('/cate14.aspx');
  return [
    ['Дараалал', 'Хуучин хаяг (TIC)', 'Query-ийн нөхцөл', 'Шинэ хаяг (Travel Hub)', 'Тайлбар'],
    [1, '/cate14.aspx', 'TypeID=1', target('/cate14.aspx?TypeID=1'), 'Угсаатны үүсэл'],
    [2, '/cate14.aspx', 'TypeID=2', target('/cate14.aspx?TypeID=2'), 'Улсын түүх'],
    [3, '/cate14.aspx', 'TypeID=3', type3, 'Түүхэн хүмүүс'],
    [4, '/cate14.aspx', 'Query-гүй (ерөнхий дүрэм)', general, 'Хамгийн сүүлд ажиллана'],
    [],
    ['Шаардлага: TypeID-тэй дүрмүүд query-г шалгаж, ерөнхий cate14.aspx-ийн дүрмээс ӨМНӨ ажиллах ёстой.'],
    [`Зөв жишээ: /cate14.aspx?TypeID=3 → 3-р дүрэм → ${pathOf(type3)}`],
    [`Буруу жишээ: ерөнхий дүрэм эхэлж ажиллавал /cate14.aspx?TypeID=3 → ${pathOf(general)} (буруу хуудас).`],
    ['Шалтгаан: TIC-ийн одоогийн redirect query тоохгүй байж болно (жишээ: cate10.aspx?TypeID=2 нь cate10.aspx-тэй ижил хаяг руу очдог).'],
    [`cate15.aspx нэг дүрэмтэй: TypeID=1, 2, 3 бүгд ${pathOf(target('/cate15.aspx'))} руу очно, query шалгах шаардлагагүй.`],
  ];
}

function workbook(rows, counts, notes) {
  const main = [['Хуучин хаяг (TIC)', 'Шинэ хаяг (Travel Hub)', 'Ангилал', 'Шалгалт'], ...rows];
  const total = counts.reduce((n, [, c]) => n + c, 0);
  const summary = [['Ангилал', 'Тоо'], ...counts, ['Нийт', { f: `SUM(B2:B${counts.length + 1})`, v: total }]];
  const names = ['Redirect', 'Ангиллаар тоо', ...(notes ? ['Кодерт анхааруулах'] : [])];
  const sheetTypes = names.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('');
  const sheetRels = names.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('');
  return zip({
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' + sheetTypes + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sheetRels + `<Relationship Id="rId${names.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
      + `<sheets>${names.map((n, i) => `<sheet name="${n}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>`
      + `<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">Redirect!$A$1:$D$${main.length}</definedName></definedNames>`
      + '<calcPr calcId="0" fullCalcOnLoad="1"/></workbook>',
    'xl/styles.xml': STYLES,
    'xl/worksheets/sheet1.xml': sheetXml(main, { autoFilter: true }),
    'xl/worksheets/sheet2.xml': sheetXml(summary, { boldLast: true }),
    ...(notes ? { 'xl/worksheets/sheet3.xml': sheetXml(notes, { colWidths: [11, 20, 28, 62, 26] }) } : {}),
  });
}

(async () => {
  const unique = [...new Set(Object.values(BATCHES).flat().map((r) => r.new_url))];
  const results = {};
  let next = 0;
  await Promise.all(Array.from({ length: 5 }, async () => {
    while (next < unique.length) {
      const u = unique[next++];
      results[u] = await check(u);
      await sleep(100);
    }
  }));

  fs.mkdirSync(OUT, { recursive: true });
  const review = [];
  const stats = {};
  for (const [batch, rows] of Object.entries(BATCHES)) {
    const keep = [];
    const tally = {};
    for (const r of rows) {
      const c = results[r.new_url];
      const stat = c.status !== 200 ? c.status : c.hops ? 'redirect' : 200;
      if (c.status !== 200) { review.push([batch, r.old_url, r.new_url, c.finalUrl, c.status, c.soft404 ? 'soft-404' : '', r.title, r.ангилал]); continue; }
      // Шинэ хаяг: redirect-ийн гинж байвал кодер шууд эцсийн хаяг руу заана
      keep.push([r.old_url, c.finalUrl, r.ангилал, stat]);
      tally[r.ангилал] = (tally[r.ангилал] || 0) + 1;
    }
    const counts = Object.entries(tally).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'mn'));
    fs.writeFileSync(path.join(OUT, `${batch}.xlsx`), workbook(keep, counts, batch === 'batch-09-deferred' ? coderNotes(keep) : null));
    stats[batch] = { csv: rows.length, excel: keep.length, redirect: keep.filter((x) => x[3] === 'redirect').length, bad: rows.length - keep.length, noindex: rows.filter((r) => results[r.new_url].noindex).length, counts };
  }
  const cell = (v) => (/[",\n\r]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
  const head = ['batch', 'Хуучин хаяг (TIC)', 'Шинэ хаяг (Travel Hub)', 'Эцсийн хаяг', 'Шалгалт', 'Тэмдэглэл', 'Гарчиг', 'Ангилал'];
  fs.writeFileSync(path.join(OUT, '404-review.csv'), `﻿${[head, ...review].map((r) => r.map(cell).join(',')).join('\r\n')}\r\n`);
  console.log(JSON.stringify(stats, null, 1));
  console.log('шалгалтад тэнцээгүй:', review.length, 'давтагдашгүй хаяг:', unique.length);
  // Хаяг ба гарчгийн таарц (CSV-ийн гарчгийн эхний үг хуудасны <title>-д байх ёстой)
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const mismatch = Object.values(BATCHES).flat().filter((r) => !norm(results[r.new_url].title).includes(norm(r.title).split(' ')[0]));
  console.log('гарчиг зөрсөн:', mismatch.length);
  for (const r of mismatch.slice(0, 25)) console.log(' ', r.title, '=>', results[r.new_url].title, r.new_url);
  fs.writeFileSync(process.env.REDIRECT_RESULTS || path.join(require('os').tmpdir(), 'redirect-results.json'), JSON.stringify(results, null, 1));
})();

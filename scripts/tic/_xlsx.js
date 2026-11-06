// .xlsx (OOXML) бичигч, нэмэлт сангүй. Энэ машинд Python, Excel байхгүй.
//   xlsx([{ name, rows, autoFilter, boldLast, colWidths }]) → Buffer
// Нүд: тоо, текст эсвэл { f: томъёо, v: хадгалсан утга }. Загвар: 0 энгийн, 1 толгой (ногоон), 2 тод
const zlib = require('zlib');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const colName = (i) => String.fromCharCode(65 + i);

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

// Эхний хуудас autoFilter-тэй бол Excel-ийн шүүлтүүрийн нэрийг (_FilterDatabase) бүртгэнэ
function xlsx(sheets) {
  const first = sheets[0];
  const sheetRef = /^[A-Za-z0-9_]+$/.test(first.name) ? first.name : `'${first.name.replace(/'/g, "''")}'`;
  const lastCol = colName(first.rows[0].length - 1);
  const sheetTypes = sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('');
  const sheetRels = sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('');
  return zip({
    '[Content_Types].xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' + sheetTypes + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
    '_rels/.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/_rels/workbook.xml.rels': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sheetRels + `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    'xl/workbook.xml': '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
      + `<sheets>${sheets.map((s, i) => `<sheet name="${esc(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets>`
      + (first.autoFilter ? `<definedNames><definedName name="_xlnm._FilterDatabase" localSheetId="0" hidden="1">${esc(sheetRef)}!$A$1:$${lastCol}$${first.rows.length}</definedName></definedNames>` : '')
      + '<calcPr calcId="0" fullCalcOnLoad="1"/></workbook>',
    'xl/styles.xml': STYLES,
    ...Object.fromEntries(sheets.map((s, i) => [`xl/worksheets/sheet${i + 1}.xml`, sheetXml(s.rows, s)])),
  });
}

module.exports = { xlsx };

// Contentful rich text ⇄ Markdown (орчуулгын багц файлд). Зураг, хүснэгт, холбоос, жагсаалтыг хадгална.
// Markdown-ийн дүрэм (AI-д өгөх prompt-д ч мөн):
//   ## Гарчиг            → heading-2 (# … ###### = heading-1…6)
//   - мөр / 1. мөр       → жагсаалт (дэд жагсаалт 2 зай доголтой)
//   **тод**, _налуу_, <u>доогуур зураас</u>, `код`
//   [текст](https://…)   → холбоос (URL-ийг өөрчлөхгүй)
//   ![image](asset:ID)   → зураг (мөрийг огт өөрчлөхгүй)
//   | a | b |            → хүснэгт (эхний мөрийн дараа |---| бол толгой мөр)
//   ---                  → хэвтээ зураас;  > текст → ишлэл;  <br> → мөр шилжилт
'use strict';

const MARK = { bold: ['**', '**'], italic: ['_', '_'], underline: ['<u>', '</u>'], code: ['`', '`'] };

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/([*_`[\]|])/g, '\\$1').replace(/\n/g, '<br>');

// Догол мөрийн эхэнд markdown-ийн блок тэмдэг (1. , - , #, >, ---) байвал escape хийнэ (жагсаалт болж хувирахгүй)
const escBlockStart = (s) => s.replace(/^(\s*)(\d+)\. /, '$1$2\\. ').replace(/^(\s*)([-#>])/, '$1\\$2');

function inlineMd(nodes) {
  return (nodes || [])
    .map((n) => {
      if (n.nodeType === 'text') {
        if (!n.value) return '';
        let s = esc(n.value);
        // Хоосон зайг тэмдэглэгээний гадна гаргана (**үг ** биш)
        const lead = s.match(/^\s*/)[0];
        const trail = s.match(/\s*$/)[0];
        let core = s.trim();
        if (!core) return s;
        for (const m of ['code', 'underline', 'italic', 'bold']) if ((n.marks || []).some((x) => x.type === m)) core = MARK[m][0] + core + MARK[m][1];
        return lead + core + trail;
      }
      if (n.nodeType === 'hyperlink') {
        const uri = n.data?.uri || '';
        return `[${inlineMd(n.content)}](${/[()s]/.test(uri) ? `<${uri}>` : uri})`;
      }
      return inlineMd(n.content);
    })
    .join('');
}

function listMd(node, depth) {
  const out = [];
  let i = 1;
  for (const li of node.content || []) {
    const bullet = node.nodeType === 'ordered-list' ? `${i++}. ` : '- ';
    const paras = (li.content || []).filter((c) => !/-list$/.test(c.nodeType));
    out.push('  '.repeat(depth) + bullet + paras.map((p) => inlineMd(p.content)).join('<br><br>'));
    for (const sub of (li.content || []).filter((c) => /-list$/.test(c.nodeType))) out.push(...listMd(sub, depth + 1));
  }
  return out;
}

function blockMd(node) {
  const t = node.nodeType;
  const h = t.match(/^heading-(\d)$/);
  if (h) return '#'.repeat(Number(h[1])) + ' ' + inlineMd(node.content);
  if (t === 'paragraph') return escBlockStart(inlineMd(node.content));
  if (t === 'unordered-list' || t === 'ordered-list') return listMd(node, 0).join('\n');
  if (t === 'hr') return '---';
  if (t === 'blockquote') return (node.content || []).map((p) => '> ' + inlineMd(p.content)).join('\n');
  if (t === 'embedded-asset-block') return `![image](asset:${node.data?.target?.sys?.id})`;
  if (t === 'table') {
    const rows = node.content || [];
    const lines = rows.map((r) => '| ' + (r.content || []).map((c) => (c.content || []).map((p) => inlineMd(p.content)).join('<br>')).join(' | ') + ' |');
    const header = rows[0]?.content?.every((c) => c.nodeType === 'table-header-cell');
    if (header) lines.splice(1, 0, '|' + rows[0].content.map(() => '---').join('|') + '|');
    return lines.join('\n');
  }
  return `<!-- unsupported:${t} -->`;
}

function cfToMd(doc) {
  if (!doc?.content) return '';
  return doc.content
    .map(blockMd)
    .filter((s) => s.trim() !== '')
    .join('\n\n');
}

// ----------------------------------------------------------------- Markdown → Contentful

const text = (value, marks = []) => ({ nodeType: 'text', value, marks: marks.map((type) => ({ type })), data: {} });

function parseInline(s, marks = []) {
  const out = [];
  let buf = '';
  const flush = () => {
    if (buf) out.push(text(buf, marks));
    buf = '';
  };
  let i = 0;
  while (i < s.length) {
    const rest = s.slice(i);
    if (rest[0] === '\\' && i + 1 < s.length) {
      buf += s[i + 1];
      i += 2;
      continue;
    }
    if (rest.startsWith('<br>')) {
      buf += '\n';
      i += 4;
      continue;
    }
    const pair = (open, close, mark) => {
      if (!rest.startsWith(open)) return false;
      const end = findClose(s, i + open.length, close);
      if (end < 0) return false;
      flush();
      out.push(...parseInline(s.slice(i + open.length, end), [...marks, mark]));
      i = end + close.length;
      return true;
    };
    if (pair('**', '**', 'bold') || pair('<u>', '</u>', 'underline') || pair('`', '`', 'code')) continue;
    if (pair('_', '_', 'italic')) continue;
    if (rest[0] === '[') {
      const close = findClose(s, i + 1, ']');
      if (close > 0 && s[close + 1] === '(') {
        const angled = s[close + 2] === '<';
        const end = angled ? s.indexOf('>)', close + 3) + 1 : s.indexOf(')', close + 2);
        if (end > 0) {
          flush();
          const content = parseInline(s.slice(i + 1, close), marks);
          out.push({ nodeType: 'hyperlink', data: { uri: angled ? s.slice(close + 3, end - 1) : s.slice(close + 2, end) }, content: content.length ? content : [text('')] });
          i = end + 1;
          continue;
        }
      }
    }
    buf += rest[0];
    i++;
  }
  flush();
  return out;
}

// Escape-ийг алгасаж хаах тэмдгийг олно
function findClose(s, from, close) {
  for (let j = from; j < s.length; j++) {
    if (s[j] === '\\') {
      j++;
      continue;
    }
    if (s.startsWith(close, j)) return j;
  }
  return -1;
}

const para = (s) => {
  const content = parseInline(s);
  return { nodeType: 'paragraph', data: {}, content: content.length ? content : [text('')] };
};

function splitCells(line) {
  const cells = [];
  let cur = '';
  const body = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  for (let i = 0; i < body.length; i++) {
    if (body[i] === '\\' && body[i + 1] === '|') {
      cur += '\\|';
      i++;
    } else if (body[i] === '|') {
      cells.push(cur.trim());
      cur = '';
    } else cur += body[i];
  }
  cells.push(cur.trim());
  return cells;
}

function parseList(lines) {
  // lines: [{ depth, ordered, text }]
  const build = (start, depth) => {
    const ordered = lines[start].ordered;
    const list = { nodeType: ordered ? 'ordered-list' : 'unordered-list', data: {}, content: [] };
    let i = start;
    while (i < lines.length && lines[i].depth >= depth) {
      if (lines[i].depth > depth) {
        const [sub, next] = build(i, lines[i].depth);
        const last = list.content[list.content.length - 1];
        if (last) last.content.push(sub);
        else list.content.push({ nodeType: 'list-item', data: {}, content: [sub] });
        i = next;
        continue;
      }
      list.content.push({ nodeType: 'list-item', data: {}, content: lines[i].text.split('<br><br>').map(para) });
      i++;
    }
    return [list, i];
  };
  return build(0, lines[0].depth)[0];
}

function mdToCf(md) {
  const lines = String(md || '').replace(/\r\n/g, '\n').split('\n');
  const content = [];
  let i = 0;
  const LIST = /^(\s*)(-|\d+\.)\s+(.*)$/;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    let m;
    if ((m = line.match(/^(#{1,6})\s+(.*)$/))) {
      const c = parseInline(m[2].trim());
      content.push({ nodeType: `heading-${m[1].length}`, data: {}, content: c.length ? c : [text('')] });
      i++;
    } else if (/^\s*---\s*$/.test(line)) {
      content.push({ nodeType: 'hr', data: {}, content: [] });
      i++;
    } else if ((m = line.match(/^\s*!\[[^\]]*\]\(asset:([^)\s]+)\)\s*$/))) {
      content.push({ nodeType: 'embedded-asset-block', data: { target: { sys: { id: m[1], type: 'Link', linkType: 'Asset' } } }, content: [] });
      i++;
    } else if (LIST.test(line)) {
      const items = [];
      while (i < lines.length && (m = lines[i].match(LIST))) {
        items.push({ depth: Math.floor(m[1].length / 2), ordered: m[2] !== '-', text: m[3] });
        i++;
      }
      content.push(parseList(items));
    } else if (/^\s*\|/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
      const header = rows.length > 1 && /^\s*\|?\s*:?-{3,}/.test(rows[1]);
      const body = rows.filter((_, k) => !(header && k === 1));
      content.push({
        nodeType: 'table',
        data: {},
        content: body.map((r, k) => ({
          nodeType: 'table-row',
          data: {},
          content: splitCells(r).map((cell) => ({
            nodeType: header && k === 0 ? 'table-header-cell' : 'table-cell',
            data: {},
            content: cell.split('<br>').map(para),
          })),
        })),
      });
    } else if (/^>\s?/.test(line)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
      content.push({ nodeType: 'blockquote', data: {}, content: q.map(para) });
    } else {
      const p = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|\s*---\s*$|\s*!\[|\s*\||>)/.test(lines[i]) && !LIST.test(lines[i])) p.push(lines[i++].trim());
      content.push(para(p.join(' ')));
    }
  }
  return { nodeType: 'document', data: {}, content };
}

// Бүтцийн хураангуй (орчуулга эхтэйгээ таарч байгааг шалгахад): блокийн төрлүүдийн дараалал, зураг, холбоос
function structureOf(doc) {
  const blocks = [];
  const assets = [];
  const links = [];
  let listItems = 0;
  let cells = 0;
  const walk = (n) => {
    if (n.nodeType === 'embedded-asset-block') assets.push(n.data?.target?.sys?.id);
    if (n.nodeType === 'hyperlink') links.push(n.data?.uri);
    if (n.nodeType === 'list-item') listItems++;
    if (/^table-(header-)?cell$/.test(n.nodeType)) cells++;
    (n.content || []).forEach(walk);
  };
  for (const b of doc?.content || []) {
    const empty = b.nodeType === 'paragraph' && !(b.content || []).some((c) => (c.value || '').trim() || c.nodeType === 'hyperlink');
    if (!empty) blocks.push(b.nodeType);
    walk(b);
  }
  return { blocks, assets, links, listItems, cells };
}

function plainText(doc) {
  const walk = (n) => (n.nodeType === 'text' ? n.value || '' : (n.content || []).map(walk).join(' '));
  return doc ? walk(doc) : '';
}

module.exports = { cfToMd, mdToCf, structureOf, plainText };

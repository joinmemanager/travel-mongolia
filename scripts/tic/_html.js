// TIC-ийн нийтлэлийн HTML → Contentful Rich Text.
// Текстийг өөрчлөхгүй: зөвхөн HTML-ийн хоосон зай (мөр шилжилт, давхар зай) нэг зай болно,
// <br> мөр шилжилт хэвээр үлдэнэ. Зураг нь { nodeType: '__image', src, alt } түр зангилаа болж,
// импортын скрипт түүнийг Contentful asset-аар солино.

const VOID = new Set(['br', 'img', 'hr', 'meta', 'link', 'input', 'wbr', 'col', 'source']);
const SKIP = new Set(['script', 'style', 'noscript', 'iframe', 'object']);
const BLOCK = new Set(['p', 'div', 'section', 'article', 'blockquote', 'center', 'table', 'tbody', 'thead', 'tr', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'pre', 'figure', 'figcaption']);

const ENTITIES = {
  nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", laquo: '«', raquo: '»',
  ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  bdquo: '„', deg: '°', times: '×', sup2: '²', sup3: '³', middot: '·', bull: '•', copy: '©',
  reg: '®', plusmn: '±', frac12: '½', minus: '−', shy: '',
};

function decode(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z0-9]+);/gi, (m, e) => {
    if (e[0] === '#') {
      const code = e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : m;
    }
    const v = ENTITIES[e.toLowerCase()];
    return v === undefined ? m : v;
  });
}

function parseAttrs(src) {
  const attrs = {};
  for (const m of src.matchAll(/([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g)) {
    attrs[m[1].toLowerCase()] = decode(m[3] ?? m[4] ?? m[5] ?? '');
  }
  return attrs;
}

// Хүлцэнгүй HTML parser: таараагүй хаалтын tag-ийг алгасна, хаагаагүйг нь stack-аас хаана.
function parseHtml(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(\/?)>|([^<]+|<)/g;
  let m;
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1];
    if (m[0].startsWith('<!--')) continue;
    if (m[5] !== undefined) {
      top.children.push({ text: decode(m[5]) });
      continue;
    }
    const tag = m[2].toLowerCase();
    if (m[1]) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break; }
      }
      continue;
    }
    const node = { tag, attrs: parseAttrs(m[3]), children: [] };
    top.children.push(node);
    if (SKIP.has(tag)) {
      // script/style-ийн агуулгыг хаалтын tag хүртэл алгасна
      const close = html.toLowerCase().indexOf(`</${tag}`, re.lastIndex);
      re.lastIndex = close < 0 ? html.length : close;
      continue;
    }
    if (!VOID.has(tag) && !m[4]) stack.push(node);
  }
  return root;
}

const BR = ' ';
const t = (value, marks = []) => ({ nodeType: 'text', value, marks: marks.map((type) => ({ type })), data: {} });

// Inline элементүүдийг нэг paragraph болгон цуглуулж, блок бүрт хаана
function convert(root, { baseUrl, rewriteLink } = {}) {
  const absolute = (href) => {
    if (!href) return '';
    if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
    if (href.startsWith('//')) return 'https:' + href;
    try { return new URL(href, baseUrl).toString(); } catch { return ''; }
  };

  function walkBlocks(children) {
    const blocks = [];
    let inline = [];

    const flush = (type = 'paragraph') => {
      const content = buildInline(inline);
      inline = [];
      if (!content) return;
      blocks.push({ nodeType: type, data: {}, content });
    };

    const walk = (node, marks, link) => {
      if (node.text !== undefined) {
        inline.push({ value: node.text, marks, link });
        return;
      }
      const tag = node.tag;
      if (SKIP.has(tag)) return;
      if (tag === 'br') { inline.push({ value: BR, marks, link }); return; }
      if (tag === 'img') {
        flush();
        if (node.attrs.src) blocks.push({ nodeType: '__image', src: node.attrs.src, alt: node.attrs.alt || '', content: [], data: {} });
        return;
      }
      if (tag === 'hr') { flush(); blocks.push({ nodeType: 'hr', data: {}, content: [] }); return; }
      if (tag === 'ul' || tag === 'ol') {
        flush();
        const items = [];
        const lifted = [];
        for (const li of node.children) {
          if (li.text !== undefined && !li.text.trim()) continue;
          const inner = walkBlocks(li.tag === 'li' ? li.children : [li]);
          const content = inner.filter((b) => b.nodeType === 'paragraph' || b.nodeType.endsWith('-list'));
          lifted.push(...inner.filter((b) => b.nodeType === '__image'));
          if (content.length) items.push({ nodeType: 'list-item', data: {}, content });
        }
        if (items.length) blocks.push({ nodeType: tag === 'ol' ? 'ordered-list' : 'unordered-list', data: {}, content: items });
        blocks.push(...lifted);
        return;
      }
      const heading = /^h([1-6])$/.exec(tag);
      if (heading) {
        flush();
        for (const c of node.children) walk(c, marks, link);
        flush(`heading-${heading[1]}`);
        return;
      }
      let m = marks;
      if (tag === 'strong' || tag === 'b') m = [...marks, 'bold'];
      else if (tag === 'em' || tag === 'i') m = [...marks, 'italic'];
      else if (tag === 'u') m = [...marks, 'underline'];
      let l = link;
      if (tag === 'a') {
        const href = absolute(node.attrs.href);
        l = href ? (rewriteLink ? rewriteLink(href) : href) : link;
      }
      const isBlock = BLOCK.has(tag);
      if (isBlock) flush();
      for (const c of node.children) walk(c, m, l);
      if (isBlock) flush();
    };

    for (const c of children) walk(c, [], undefined);
    flush();
    return blocks;
  }

  return walkBlocks(root.children);
}

// Inline хэсгүүд → text/hyperlink зангилаа. Хоосон зайг нэгтгэж, захын зайг тайрна.
function buildInline(parts) {
  let items = parts
    .map((p) => ({ ...p, value: p.value.replace(/[\s ]+/g, ' ') }))
    .filter((p) => p.value.length);
  // Дараалсан зай, мөр шилжилтийн эргэн тойрны зайг цэвэрлэнэ
  let prevSpace = true;
  for (const p of items) {
    let v = p.value;
    if (prevSpace) v = v.replace(/^ +/, '');
    v = v.replace(new RegExp(` *${BR} *`, 'g'), BR);
    if (v.length) prevSpace = v.endsWith(' ') || v.endsWith(BR);
    p.value = v;
  }
  items = items.filter((p) => p.value.length);
  // Төгсгөлийн зай, мөр шилжилт
  while (items.length) {
    const last = items[items.length - 1];
    last.value = last.value.replace(new RegExp(`[ ${BR}]+$`), '');
    if (last.value.length) break;
    items.pop();
  }
  while (items.length) {
    items[0].value = items[0].value.replace(new RegExp(`^[ ${BR}]+`), '');
    if (items[0].value.length) break;
    items.shift();
  }
  if (!items.some((p) => p.value.replace(new RegExp(BR, 'g'), '').trim())) return null;

  const out = [];
  const sameMarks = (a, b) => a.join() === b.join();
  for (const p of items) {
    const value = p.value.replace(new RegExp(BR, 'g'), '\n');
    const marks = [...new Set(p.marks)].sort();
    const target = p.link
      ? (() => {
          const last = out[out.length - 1];
          if (last && last.nodeType === 'hyperlink' && last.data.uri === p.link) return last.content;
          const h = { nodeType: 'hyperlink', data: { uri: p.link }, content: [] };
          out.push(h);
          return h.content;
        })()
      : out;
    const prev = target[target.length - 1];
    if (prev && prev.nodeType === 'text' && sameMarks(prev.marks.map((x) => x.type), marks)) prev.value += value;
    else target.push(t(value, marks));
  }
  // Rich text-ийн дүрэм: paragraph нь text-ээр эхэлж, төгсөх ёстой (hyperlink-ийн хажууд хоосон text)
  if (out[0]?.nodeType === 'hyperlink') out.unshift(t(''));
  if (out[out.length - 1]?.nodeType === 'hyperlink') out.push(t(''));
  return out;
}

// Rich text → энгийн текст (догол мөр бүр шинэ мөрөнд)
function plainText(blocks) {
  const inl = (n) => (n.nodeType === 'text' ? n.value : (n.content || []).map(inl).join(''));
  const lines = [];
  const walk = (b) => {
    if (b.nodeType === 'paragraph' || b.nodeType.startsWith('heading')) lines.push(inl(b));
    else if (b.content) b.content.forEach(walk);
  };
  blocks.forEach(walk);
  return lines.join('\n');
}

function wordCount(text) {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

// TIC нийтлэлийн хуудаснаас гарчиг, body HTML-ийг салгана
function extractArticle(html) {
  const name = /id="MainContent_lName">([\s\S]*?)<\/span>/.exec(html);
  const startTag = 'id="MainContent_lDescription">';
  const start = html.indexOf(startTag);
  if (start < 0) return null;
  const from = start + startTag.length;
  let end = html.indexOf('<div class="container mb-5">', from);
  if (end < 0) end = html.length;
  return { title: decode(name ? name[1] : '').trim(), body: html.slice(from, end) };
}

module.exports = { parseHtml, convert, plainText, wordCount, extractArticle, decode };

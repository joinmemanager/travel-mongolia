// Contentful rich text ⇄ Payload Lexical JSON хөрвүүлэгч (хоёр чиглэл).
// - Импорт (scripts/payload/import.ts): Contentful → Lexical.
// - Сайт (lib/cms/payloadSource.ts): Lexical → Contentful, ингэснээр одоогийн рендерерүүд (components/RichText.tsx,
//   lib/richTextParts.ts, lib/seo.ts г.м.) өөрчлөгдөхгүй.
// - Тулгалт (scripts/payload/verify.ts): Contentful → Lexical → Contentful үр дүн эхтэйгээ ижил байх ёстой.
// Экспортод байгаа node-ууд: paragraph, heading-1…6, (un)ordered-list, list-item, hyperlink, embedded-asset-block,
// table/-row/-cell/-header-cell, hr, blockquote, text (marks). Embedded entry байхгүй (2026-11-12) — гарвал
// алдаа биш, `cfRaw` блок болгож хадгална (мэдээлэл алдагдахгүй).

type CfNode = { nodeType: string; data?: any; content?: CfNode[]; value?: string; marks?: { type: string }[] };
type LexNode = Record<string, any>;

const MARK_BITS: Record<string, number> = {
  bold: 1,
  italic: 2,
  strikethrough: 4,
  underline: 8,
  code: 16,
  subscript: 32,
  superscript: 64,
};
const MARK_ORDER = Object.keys(MARK_BITS);

const block = (type: string, children: LexNode[], extra: LexNode = {}): LexNode => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
});

export interface ToLexicalCtx {
  // Contentful asset id → Payload media id (олдохгүй бол undefined: node-ийг cfRaw болгож хадгална)
  mediaId: (assetId: string) => number | string | undefined;
}

export interface ToCfCtx {
  // Payload media (id эсвэл populate хийсэн doc) → Contentful asset id (sys.id)
  assetId: (value: any) => string | undefined;
}

// ----------------------------------------------------------------- Contentful → Lexical

function inlineToLex(node: CfNode, ctx: ToLexicalCtx): LexNode[] {
  if (node.nodeType === 'text') {
    const format = (node.marks || []).reduce((n, m) => n | (MARK_BITS[m.type] || 0), 0);
    return [{ type: 'text', text: node.value ?? '', format, detail: 0, mode: 'normal', style: '', version: 1 }];
  }
  if (node.nodeType === 'hyperlink') {
    return [
      block('link', (node.content || []).flatMap((c) => inlineToLex(c, ctx)), {
        version: 3,
        fields: { linkType: 'custom', url: node.data?.uri ?? '', newTab: false },
      }),
    ];
  }
  // inline entry, entry-hyperlink, asset-hyperlink г.м.: эхийг хадгална
  return [{ type: 'cfRaw', version: 1, node }];
}

// Олон paragraph-тай контейнер (list-item, blockquote, table-cell) → inline хүүхдүүд, paragraph хооронд linebreak
function paragraphsToInline(content: CfNode[], ctx: ToLexicalCtx): LexNode[] {
  const out: LexNode[] = [];
  content.forEach((p, i) => {
    if (i > 0) out.push({ type: 'linebreak', version: 1 });
    if (p.nodeType === 'paragraph') out.push(...(p.content || []).flatMap((c) => inlineToLex(c, ctx)));
    else out.push({ type: 'cfRaw', version: 1, node: p });
  });
  return out;
}

function listToLex(node: CfNode, ctx: ToLexicalCtx): LexNode {
  const ordered = node.nodeType === 'ordered-list';
  const items: LexNode[] = [];
  let value = 1;
  for (const li of node.content || []) {
    const paras = (li.content || []).filter((c) => !/-list$/.test(c.nodeType));
    const nested = (li.content || []).filter((c) => /-list$/.test(c.nodeType));
    items.push(block('listitem', paragraphsToInline(paras, ctx), { value: value++ }));
    // Lexical-ийн дүрэм: дэд жагсаалт нь өмнөх listitem-ийн дараах, зөвхөн list агуулсан listitem
    for (const n of nested) items.push(block('listitem', [listToLex(n, ctx)], { value: value++, cfNested: true }));
  }
  return block('list', items, { listType: ordered ? 'number' : 'bullet', start: 1, tag: ordered ? 'ol' : 'ul' });
}

function blockToLex(node: CfNode, ctx: ToLexicalCtx): LexNode {
  const t = node.nodeType;
  if (t === 'paragraph') return block('paragraph', (node.content || []).flatMap((c) => inlineToLex(c, ctx)), { textFormat: 0, textStyle: '' });
  const h = t.match(/^heading-(\d)$/);
  if (h) return block('heading', (node.content || []).flatMap((c) => inlineToLex(c, ctx)), { tag: `h${h[1]}` });
  if (t === 'unordered-list' || t === 'ordered-list') return listToLex(node, ctx);
  if (t === 'blockquote') return block('quote', paragraphsToInline(node.content || [], ctx));
  if (t === 'hr') return { type: 'horizontalrule', version: 1 };
  if (t === 'embedded-asset-block') {
    const id = node.data?.target?.sys?.id;
    const value = id ? ctx.mediaId(id) : undefined;
    if (value === undefined) return { type: 'cfRaw', version: 1, node };
    return { type: 'upload', version: 3, format: '', id: `cf-${id}`, fields: null, relationTo: 'media', value };
  }
  if (t === 'table') {
    return block(
      'table',
      (node.content || []).map((row) =>
        block(
          'tablerow',
          (row.content || []).map((cell) =>
            block(
              'tablecell',
              (cell.content || []).map((c) => blockToLex(c, ctx)),
              {
                headerState: cell.nodeType === 'table-header-cell' ? 1 : 0,
                colSpan: cell.data?.colspan || 1,
                rowSpan: cell.data?.rowspan || 1,
                backgroundColor: null,
              }
            )
          ),
          { height: 0 }
        )
      )
    );
  }
  return { type: 'cfRaw', version: 1, node };
}

export function cfToLexical(doc: CfNode | null | undefined, ctx: ToLexicalCtx): LexNode | null {
  if (!doc || doc.nodeType !== 'document') return null;
  return { root: block('root', (doc.content || []).map((n) => blockToLex(n, ctx))) };
}

// ----------------------------------------------------------------- Lexical → Contentful

const cfText = (value: string, format = 0): CfNode => ({
  nodeType: 'text',
  value,
  marks: MARK_ORDER.filter((m) => format & MARK_BITS[m]).map((type) => ({ type })),
  data: {},
});

function inlineToCf(node: LexNode, ctx: ToCfCtx): CfNode[] {
  switch (node.type) {
    case 'text':
      return [cfText(node.text ?? '', node.format || 0)];
    case 'link':
    case 'autolink': {
      const content = (node.children || []).flatMap((c: LexNode) => inlineToCf(c, ctx));
      return [{ nodeType: 'hyperlink', data: { uri: node.fields?.url ?? node.url ?? '' }, content }];
    }
    case 'linebreak':
      return [cfText('\n')];
    case 'cfRaw':
      return [node.node];
    default:
      // Payload-ийн бусад inline node (tab г.м.) — текстээр нь
      return node.text ? [cfText(node.text, node.format || 0)] : [];
  }
}

// Contentful-ийн paragraph хоосон бол [text ''] агуулдаг
const para = (content: CfNode[]): CfNode => ({
  nodeType: 'paragraph',
  data: {},
  content: content.length ? content : [cfText('')],
});

// linebreak-аар paragraph-уудыг сэргээнэ (paragraphsToInline-ийн эсрэг)
function inlineToParagraphs(children: LexNode[], ctx: ToCfCtx): CfNode[] {
  const out: CfNode[] = [];
  let cur: CfNode[] = [];
  const flush = () => {
    out.push(para(cur));
    cur = [];
  };
  for (const c of children || []) {
    if (c.type === 'linebreak') flush();
    else if (c.type === 'cfRaw' && c.node && !/^(text|hyperlink|entry-hyperlink|asset-hyperlink|embedded-entry-inline)$/.test(c.node.nodeType)) {
      if (cur.length) flush();
      out.push(c.node);
    } else cur.push(...inlineToCf(c, ctx));
  }
  if (cur.length || !out.length) flush();
  return out;
}

function listToCf(node: LexNode, ctx: ToCfCtx): CfNode {
  const items: CfNode[] = [];
  for (const li of node.children || []) {
    const kids = li.children || [];
    if (kids.length === 1 && kids[0].type === 'list' && items.length) {
      items[items.length - 1].content!.push(listToCf(kids[0], ctx));
      continue;
    }
    items.push({ nodeType: 'list-item', data: {}, content: inlineToParagraphs(kids, ctx) });
  }
  return { nodeType: node.listType === 'number' ? 'ordered-list' : 'unordered-list', data: {}, content: items };
}

function blockToCf(node: LexNode, ctx: ToCfCtx): CfNode | null {
  switch (node.type) {
    case 'paragraph':
      return para((node.children || []).flatMap((c: LexNode) => inlineToCf(c, ctx)));
    case 'heading': {
      const level = String(node.tag || 'h2').replace('h', '');
      const content = (node.children || []).flatMap((c: LexNode) => inlineToCf(c, ctx));
      return { nodeType: `heading-${level}`, data: {}, content: content.length ? content : [cfText('')] };
    }
    case 'list':
      return listToCf(node, ctx);
    case 'quote':
      return { nodeType: 'blockquote', data: {}, content: inlineToParagraphs(node.children || [], ctx) };
    case 'horizontalrule':
      return { nodeType: 'hr', data: {}, content: [] };
    case 'upload': {
      const id = ctx.assetId(node.value);
      if (!id) return null;
      return { nodeType: 'embedded-asset-block', data: { target: { sys: { id, type: 'Link', linkType: 'Asset' } } }, content: [] };
    }
    case 'table':
      return {
        nodeType: 'table',
        data: {},
        content: (node.children || []).map((row: LexNode) => ({
          nodeType: 'table-row',
          data: {},
          content: (row.children || []).map((cell: LexNode) => ({
            nodeType: cell.headerState ? 'table-header-cell' : 'table-cell',
            data: {},
            content: (cell.children || []).map((c: LexNode) => blockToCf(c, ctx)).filter(Boolean) as CfNode[],
          })),
        })),
      };
    case 'cfRaw':
      return node.node;
    default:
      return null;
  }
}

export function lexicalToCf(value: any, ctx: ToCfCtx): CfNode | null {
  const root = value?.root;
  if (!root) return null;
  return {
    nodeType: 'document',
    data: {},
    content: (root.children || []).map((n: LexNode) => blockToCf(n, ctx)).filter(Boolean) as CfNode[],
  };
}

// Тулгалтад: Contentful-ийн document-ийг харьцуулах хэлбэрт оруулна (mark-ын дараалал, хоосон data, table-ийн data)
export function normalizeCf(node: any): any {
  if (!node || typeof node !== 'object') return node;
  if (node.nodeType === 'text') {
    return { nodeType: 'text', value: node.value ?? '', marks: (node.marks || []).map((m: any) => m.type).sort() };
  }
  const out: any = { nodeType: node.nodeType };
  if (node.nodeType === 'hyperlink') out.uri = node.data?.uri ?? '';
  if (node.nodeType === 'embedded-asset-block' || node.nodeType === 'embedded-entry-block') out.target = node.data?.target?.sys?.id;
  out.content = (node.content || []).map(normalizeCf);
  return out;
}

// Энгийн текст (тулгалтын hash, орчуулгын урт шалгалтад)
export function lexicalPlainText(value: any): string {
  const walk = (n: any): string =>
    n?.type === 'text' ? n.text || '' : n?.type === 'linebreak' ? '\n' : (n?.children || []).map(walk).join(n?.type === 'root' ? '\n' : '');
  return value?.root ? walk(value.root) : '';
}

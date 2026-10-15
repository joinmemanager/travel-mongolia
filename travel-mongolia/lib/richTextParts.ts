// Contentful Rich Text-ийг аймгийн хуудсанд зориулж хуваана:
//  - images: текст доторх зургууд (embedded-asset-block) → «Зургийн цомог»
//  - intro: эхний N догол мөр (тэдгээрийн өмнөх гарчиг, жагсаалтыг оруулаад)
//  - more: үлдсэн хэсэг («Дэлгэрэнгүй унших»-аар нээгдэнэ, HTML-д бүтнээрээ байна)

export interface RichImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

const doc = (content: any[]) => ({ nodeType: 'document', data: {}, content });

function assetImage(node: any): RichImage | null {
  const f = node?.data?.target?.fields;
  const url: string | undefined = f?.file?.url;
  if (!url || !String(f.file.contentType || 'image/').startsWith('image/')) return null;
  const dims = f.file.details?.image;
  return { src: url.startsWith('//') ? `https:${url}` : url, alt: f.title || '', width: dims?.width, height: dims?.height };
}

export function splitRichText(document: any, introParagraphs = 3): { intro: any; more: any | null; images: RichImage[] } {
  if (!document || typeof document !== 'object' || !Array.isArray(document.content)) {
    return { intro: document, more: null, images: [] };
  }
  const images: RichImage[] = [];
  const blocks: any[] = [];
  for (const b of document.content) {
    if (b.nodeType === 'embedded-asset-block') {
      const img = assetImage(b);
      if (img && !images.some((i) => i.src === img.src)) images.push(img);
      continue;
    }
    blocks.push(b);
  }
  // Зураг хассаны дараа эхэнд/төгсгөлд үлдсэн зураасыг (hr) авна
  while (blocks[0]?.nodeType === 'hr') blocks.shift();
  while (blocks[blocks.length - 1]?.nodeType === 'hr') blocks.pop();

  let seen = 0;
  let cut = blocks.length;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].nodeType === 'paragraph' && ++seen === introParagraphs) {
      cut = i + 1;
      break;
    }
  }
  const rest = blocks.slice(cut);
  return { intro: doc(blocks.slice(0, cut)), more: rest.length ? doc(rest) : null, images };
}

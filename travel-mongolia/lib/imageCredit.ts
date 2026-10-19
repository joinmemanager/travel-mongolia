// Contentful asset-ийн зохиогчийн мэдээлэл (credit).
// Asset-ийн description-д «Зураг: <текст>» (эсвэл «Фото:», «Credit:») гэж эхэлсэн мөр байвал
// түүнийг зургийн доор жижиг тайлбараар харуулна. « | <URL>» төгсгөлтэй бол тайлбар нь
// тэр хуудас руу (жишээ нь Wikimedia Commons-ийн файл, лиценз) холбогдоно.
//   Зураг: Torbenbrinker / Wikimedia Commons, CC BY-SA 3.0 | https://commons.wikimedia.org/wiki/File:…
// TIC-ийн asset-уудад scripts/tic/credits.js бөглөдөг.

export interface ImageCredit {
  text: string;
  href?: string;
}

const LINE_RE = /^(?:Зураг|Фото|Credit)\s*:\s*(.+?)(?:\s+\|\s+(https?:\/\/\S+))?\s*$/i;

export function parseCredit(description: unknown): ImageCredit | undefined {
  if (typeof description !== 'string') return undefined;
  for (const line of description.split('\n')) {
    const m = LINE_RE.exec(line.trim());
    if (m) return { text: `Зураг: ${m[1]}`, href: m[2] };
  }
  return undefined;
}

// Задалсан asset (fields.description) эсвэл түүний fields
export function creditOf(asset: any): ImageCredit | undefined {
  return parseCredit(asset?.fields?.description ?? asset?.description);
}

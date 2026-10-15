// Импортлох entry-ийн seoTitle, seoDescription-ийг автоматаар үүсгэнэ.
// seoTitle: ≤60 тэмдэгт, «<Нэр> — <товч тодотгол> | Travel Hub Mongolia», урт бол брэндийг хасна.
// seoDescription: 120–155 тэмдэгт, нийтлэлийн эхний өгүүлбэрүүдээс товчилно, давтагдашгүй.

const BRAND = 'Travel Hub Mongolia';
const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 155;

// Үгийн хил дээр тайрч, … нэмнэ (нийт урт ≤ max)
function cut(text, max) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const sp = slice.lastIndexOf(' ');
  return (sp > max * 0.6 ? slice.slice(0, sp) : slice).replace(/[\s,;:–—-]+$/, '') + '…';
}

function seoTitle(name, qualifier) {
  const full = `${name} — ${qualifier} | ${BRAND}`;
  if (full.length <= TITLE_MAX) return full;
  const short = `${name} — ${qualifier}`;
  if (short.length <= TITLE_MAX) return short;
  return cut(short, TITLE_MAX);
}

// Өгүүлбэрт хуваах: цэг/асуулт/анхаарлын тэмдгийн дараа зай, дараа нь том үсэг/тоо/хашилт
function sentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?…])\s+(?=[А-ЯЁӨҮA-Z0-9«"“])/u)
    .map((s) => s.trim())
    .filter(Boolean);
}

const norm = (s) => s.toLowerCase().replace(/ү/g, 'у').replace(/ө/g, 'о');

/**
 * @param text   нийтлэлийн энгийн текст
 * @param opts.name     хуудасны нэр (жишээ нь «Хотонт сум»)
 * @param opts.stem     нэрийн үндэс (текстэд байхгүй бол нэрийг угтвар болгоно)
 * @param opts.fallback текст хэт богино үед нэмэх төгсгөл
 * @param used   өмнө үүсгэсэн тайлбарууд (давхардлаас сэргийлнэ)
 */
function seoDescription(text, { name, stem, fallback }, used) {
  const ss = sentences(text);
  const mentions = (s) => norm(s).includes(norm(stem || name));
  let prefix = '';
  // Эхний 2 өгүүлбэрт нэр дурдагдаагүй бол «Нэр: » угтвартай болгоно
  if (!mentions(ss.slice(0, 2).join(' '))) prefix = `${name}: `;

  const build = (pre) => {
    const max = DESC_MAX - pre.length;
    let desc = '';
    for (const s of ss) {
      const cand = desc ? `${desc} ${s}` : s;
      if (cand.length <= max) {
        desc = cand;
        if (desc.length + pre.length >= DESC_MIN) break;
        continue;
      }
      if (desc.length + pre.length < DESC_MIN) desc = cut(cand, max);
      break;
    }
    let out = pre + desc;
    if (out.length < DESC_MIN && fallback) out = cut(`${out.replace(/[.…]?$/, '.')} ${fallback}`, DESC_MAX);
    return out;
  };

  let desc = build(prefix);
  if (used.has(desc) && !prefix) desc = build(`${name}: `);
  let n = 2;
  while (used.has(desc)) desc = cut(`${desc} (${n++})`, DESC_MAX);
  used.add(desc);
  return desc;
}

module.exports = { seoTitle, seoDescription, BRAND, TITLE_MAX, DESC_MIN, DESC_MAX };

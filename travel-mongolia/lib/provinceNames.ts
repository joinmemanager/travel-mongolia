// Монголын 21 аймаг + нийслэл. Текстэн доторх аймгийн нэрийг танихад ашиглана
// (жишээ нь heritagePlace-ийн region: "Өвөрхангай, Архангай · 2004 он").
export const PROVINCE_NAMES = [
  'Архангай', 'Баян-Өлгий', 'Баянхонгор', 'Булган', 'Говь-Алтай', 'Говьсүмбэр', 'Дархан-Уул',
  'Дорноговь', 'Дорнод', 'Дундговь', 'Завхан', 'Орхон', 'Өвөрхангай', 'Өмнөговь', 'Сүхбаатар',
  'Сэлэнгэ', 'Төв', 'Увс', 'Ховд', 'Хөвсгөл', 'Хэнтий', 'Улаанбаатар',
];

const LETTER = 'а-яёөүa-z';

// Текстэд дурдагдсан аймгууд. Нэрийн дараа үсэг залгавал (жишээ нь "Орхоны") тооцохгүй.
export function provincesIn(text?: string): string[] {
  if (!text) return [];
  const t = text.toLowerCase();
  return PROVINCE_NAMES.filter((name) => {
    const re = new RegExp(`(^|[^${LETTER}])${name.toLowerCase()}(?![${LETTER}])`, 'u');
    return re.test(t);
  });
}

export function sharesProvince(a?: string, b?: string): boolean {
  const pa = provincesIn(a);
  if (pa.length === 0) return false;
  const pb = provincesIn(b);
  return pb.some((p) => pa.includes(p));
}

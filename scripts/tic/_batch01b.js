// 1б багц: Архангайгаас бусад 20 аймгийн сумд + Улаанбаатарын дүүргүүдийн мөрүүдийг tic-inventory.csv-ээс сонгоно.
//
// inventory-ийн «аймаг», «шинэ_url» багана сумдад найдваргүй (Сүхбаатар дүүрэг → «Сүхбаатар» аймаг,
// Баян-Өлгий/Говь-Алтайн slug «/province/bayan/ulgii-…», Хан-Уул «/province/khan/uul»), тиймээс
// аймгийг TIC-ийн гарчгийн угтвараас («ХЭНТИЙ - ДАДАЛ СУМ»), дүүргийг «… ДҮҮРЭГ»-ээс тодорхойлно.

// Гарчгийн угтвар (том үсэг, зай/зураасгүй) → [аймгийн нэр, сайтын slug]
const AIMAGS = {
  АРХАНГАЙ: ['Архангай', 'arkhangai'], // 1-р багцад орсон, batch01bRows хасна
  БАЯНӨЛГИЙ: ['Баян-Өлгий', 'bayan-ulgii'],
  БАЯНХОНГОР: ['Баянхонгор', 'bayankhongor'],
  БУЛГАН: ['Булган', 'bulgan'],
  ГОВЬАЛТАЙ: ['Говь-Алтай', 'gov-altai'],
  ГОВЬСҮМБЭР: ['Говьсүмбэр', 'govsumber'],
  ДАРХАНУУЛ: ['Дархан-Уул', 'darkhan-uul'],
  ДОРНОГОВЬ: ['Дорноговь', 'dornogov'],
  ДОРНОД: ['Дорнод', 'dornod'],
  ДУНДГОВЬ: ['Дундговь', 'dundgov'],
  ЗАВХАН: ['Завхан', 'zavkhan'],
  ОРХОН: ['Орхон', 'orkhon'],
  ӨВӨРХАНГАЙ: ['Өвөрхангай', 'uvurkhangai'],
  ӨМНӨГОВЬ: ['Өмнөговь', 'umnugov'],
  СҮХБААТАР: ['Сүхбаатар', 'sukhbaatar'],
  СЭЛЭНГЭ: ['Сэлэнгэ', 'selenge'],
  ТӨВ: ['Төв', 'tuv'],
  УВС: ['Увс', 'uvs'],
  ХОВД: ['Ховд', 'khovd'],
  ХӨВСГӨЛ: ['Хөвсгөл', 'khuvsgul'],
  ХЭНТИЙ: ['Хэнтий', 'khentii'],
};
const UB = ['Улаанбаатар', 'ulaanbaatar'];

const key = (s) => s.toUpperCase().replace(/[\s-]+/g, '');
const lowerFirstUpper = (w) => (w ? w[0].toUpperCase() + w.slice(1) : w);
// Зураасаар холбосон хэсэг бүр том үсгээр («Баян-Өлгий»), зайтай нэрийн дараагийн үг жижгээр («Шарын гол»)
const titleCase = (s) => s.toLowerCase().split('-').map(lowerFirstUpper).join('-');

/**
 * TIC-ийн гарчгаас аймаг, сумын нэрийг гаргана.
 *   «ХЭНТИЙ - ДАДАЛ СУМ»               → Хэнтий, «Дадал сум», base «Дадал»
 *   «ӨВӨРХАНГАЙ - БАРУУНБАЯН - УЛААН»   → Өвөрхангай, «Баруунбаян-Улаан сум»
 *   «ТӨВ - ЗУУНМОД ХОТ»                 → Төв, «Зуунмод хот»
 *   «БАГАНУУР ДҮҮРЭГ»                   → Улаанбаатар, «Багануур дүүрэг»
 */
function parseTitle(title) {
  const t = title.trim();
  const district = /^(.+?)\s+ДҮҮРЭГ$/i.exec(t);
  if (district && !t.includes(' - ')) {
    const base = titleCase(district[1].replace(/\s*-\s*/g, '-'));
    return { aimag: UB[0], provinceSlug: UB[1], base, name: `${base} дүүрэг`, unit: 'дүүрэг' };
  }
  const i = t.indexOf(' - ');
  if (i < 0) return null;
  const a = AIMAGS[key(t.slice(0, i))];
  if (!a) return null;
  let rest = t.slice(i + 3).replace(/\s*-\s*/g, '-').trim();
  let unit = 'сум';
  const m = /^(.+?)\s+(СУМ|ХОТ|ТОСГОН)$/i.exec(rest);
  if (m) {
    rest = m[1];
    unit = m[2].toLowerCase();
  }
  const base = titleCase(rest);
  return { aimag: a[0], provinceSlug: a[1], base, name: `${base} ${unit}`, unit };
}

// TIC-ийн гарчиг буруу (нийтлэлийн текстэд зөв бичигдсэн) мөрүүд: гарчгийн оронд энэ нэрийг авна
const TITLE_FIXES = {
  c13_167: 'ТӨВ - АЛТАНБУЛАГ СУМ', // гарчиг «ӨМНӨГОВЬ - …», текст: «Алтанбулаг нь Төв аймгийн сум юм»
  c13_170: 'ТӨВ - БАЯНДЭЛГЭР СУМ', // гарчиг «БУЯНДЭЛГЭР»
  c13_175: 'БУЛГАН - БҮРЭГХАНГАЙ СУМ', // гарчиг «БҮРЭНХАНГАЙ»
  c13_171: 'БУЛГАН - БАЯН-АГТ СУМ', // гарчиг «БАЯНАГТ»
  c13_174: 'БУЛГАН - ХУТАГ-ӨНДӨР СУМ', // гарчиг «ХУТАГТ-ӨНДӨР»
  c13_1303: 'СЭЛЭНГЭ - ХУШААТ', // гарчиг «ХАШААТ»
  c13_266: 'ОРХОН - БАЯН-ӨНДӨР', // гарчиг «БАЯНӨНДӨР»
  c13_150: 'БАЯНХОНГОР - БАЯН-ӨНДӨР СУМ', // гарчиг «БАЯНӨНДӨР»
};

function batch01bRows(rows) {
  return rows
    .filter((r) => r['ангилал'] === '13' && r['contentful_төрөл'].replace('*', '') === 'soum')
    .map((r) => ({ row: r, parsed: parseTitle(TITLE_FIXES[r.key] || r['гарчиг']) }))
    .filter((x) => {
      if (!x.parsed) throw new Error(`${x.row.key}: гарчгаас аймаг танигдсангүй — ${x.row['гарчиг']}`);
      return x.parsed.provinceSlug !== 'arkhangai';
    });
}

module.exports = { batch01bRows, parseTitle, AIMAGS, UB };

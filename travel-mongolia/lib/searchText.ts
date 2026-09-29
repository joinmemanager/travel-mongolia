// Монгол текстэд зориулсан энгийн хайлтын туслах функцууд

// Том/жижиг үсэг, ү/у, ө/о, ь/и зэрэг ялгааг арилгаж харьцуулахад бэлдэнэ
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/ү/g, 'у')
    .replace(/ө/g, 'о')
    .replace(/[ьъй]/g, 'и')
    .replace(/[^a-z0-9а-я]+/g, ' ')
    .trim();
}

export function tokenizeQuery(query: string): string[] {
  return normalizeSearchText(query).split(' ').filter(Boolean);
}

// Урт үгийн төгсгөлийн нөхцөлийг ("говийн", "хөвсгөлийн") тооцохгүйн тулд
// үгийн эхний хэсгээр нь таарч байгаа эсэхийг шалгана
function tokenMatches(token: string, haystack: string): boolean {
  if (token.length < 5) return haystack.includes(token);
  const stemLength = Math.max(4, Math.ceil(token.length * 0.6));
  return haystack.includes(token.slice(0, stemLength));
}

// Хайлтын бүх үг текстэд таарч байвал оноо буцаана (таарахгүй бол 0).
// Гарчигт таарвал илүү өндөр оноо авна.
export function scoreMatch(
  tokens: string[],
  title: string,
  rest: string[]
): number {
  if (tokens.length === 0) return 0;
  const normTitle = normalizeSearchText(title);
  const normAll = normalizeSearchText([title, ...rest].join(' '));

  let score = 0;
  for (const token of tokens) {
    if (!tokenMatches(token, normAll)) return 0;
    score += tokenMatches(token, normTitle) ? 3 : 1;
  }
  if (normTitle.startsWith(tokens[0])) score += 2;
  return score;
}

import type { ShortsCategory, ShortsLang } from './shorts';

// Богино бичлэгийн хэсгийн сэдвийн нэр, UI бичвэр сайтын 6 хэлээр (components/shorts/Shorts.tsx).
// Эдгээр элемент translate="no" тул Google Translate дахин орчуулахгүй. Монгол нэр нь lib/shorts.ts-д.

type OtherLang = Exclude<ShortsLang, 'mn'>;

// [табын богино нэр, бүтэн нэр]. Англи табын нэр цэсэнд ч гарна (lib/navigation.ts).
const NAMES: Record<string, Record<OtherLang, [string, string]>> = {
  traditions: {
    en: ['Traditions', 'Mongolian Traditions and Customs'],
    'zh-CN': ['传统习俗', '蒙古传统习俗'],
    ru: ['Традиции', 'Традиции и обычаи Монголии'],
    ko: ['전통 풍습', '몽골의 전통 풍습'],
    ja: ['伝統と風習', 'モンゴルの伝統と風習'],
  },
  'historical-figures': {
    en: ['Historical Figures', 'Historical Figures of Mongolia'],
    'zh-CN': ['历史人物', '蒙古历史人物'],
    ru: ['Исторические личности', 'Исторические личности Монголии'],
    ko: ['역사 인물', '몽골의 역사 인물'],
    ja: ['歴史上の人物', 'モンゴルの歴史上の人物'],
  },
  buddhism: {
    en: ['Buddhism', 'Buddhism in Mongolia'],
    'zh-CN': ['佛教', '蒙古佛教'],
    ru: ['Буддизм', 'Буддизм в Монголии'],
    ko: ['불교', '몽골의 불교'],
    ja: ['仏教', 'モンゴルの仏教'],
  },
  heritage: {
    en: ['Historical Heritage', 'Historical Heritage of Mongolia'],
    'zh-CN': ['历史文化遗产', '蒙古历史文化遗产'],
    ru: ['Историческое наследие', 'Историческое наследие Монголии'],
    ko: ['역사 문화유산', '몽골의 역사 문화유산'],
    ja: ['歴史遺産', 'モンゴルの歴史遺産'],
  },
  nature: {
    en: ['Natural Heritage', 'Natural Heritage of Mongolia'],
    'zh-CN': ['自然遗产', '蒙古自然遗产'],
    ru: ['Природное наследие', 'Природное наследие Монголии'],
    ko: ['자연유산', '몽골의 자연유산'],
    ja: ['自然遺産', 'モンゴルの自然遺産'],
  },
  legends: {
    en: ['Legends & Oral History', 'Legends and Oral History of Mongolia'],
    'zh-CN': ['传说与口述历史', '蒙古传说与口述历史'],
    ru: ['Легенды и предания', 'Легенды и предания Монголии'],
    ko: ['전설과 구전', '몽골의 전설과 구전 역사'],
    ja: ['伝説と口承', 'モンゴルの伝説と口承'],
  },
  monasteries: {
    en: ['Monasteries', 'Monasteries of Mongolia'],
    'zh-CN': ['寺院', '蒙古寺院'],
    ru: ['Монастыри', 'Монастыри Монголии'],
    ko: ['사원', '몽골의 사원'],
    ja: ['寺院', 'モンゴルの寺院'],
  },
};

// Сэдвийн нэр тухайн хэлээр. Орчуулга байхгүй бол англи, тэгээд монгол нэр.
export function shortsName(c: ShortsCategory, lang: ShortsLang): { tab: string; title: string } {
  const names = NAMES[c.slug];
  const pair = lang === 'mn' ? undefined : names?.[lang] || names?.en;
  return pair ? { tab: pair[0], title: pair[1] } : { tab: c.tab, title: c.title };
}

export interface ShortsText {
  tablist: string;
  play: (title: string) => string;
  more: (n: number) => string;
  viewAll: string;
  allOf: (title: string) => string;
  dialog: (title: string) => string;
  close: string;
  prev: string;
  next: string;
  youtube: string;
  newWindow: string;
  soonTitle: string;
  soonText: string;
  count: (n: number) => string;
  allTopics: string;
}

const TEXT: Record<ShortsLang, ShortsText> = {
  mn: {
    tablist: 'Богино бичлэгийн сэдэв',
    play: (t) => `${t} — бичлэг тоглуулах`,
    more: (n) => `+${n} бичлэг`,
    viewAll: 'Бүгдийг үзэх',
    allOf: (t) => `${t}-ийн бүх богино бичлэг`,
    dialog: (t) => `Богино бичлэг: ${t}`,
    close: 'Хаах',
    prev: 'Өмнөх бичлэг',
    next: 'Дараагийн бичлэг',
    youtube: 'YouTube-д үзэх',
    newWindow: ' (шинэ цонхонд нээгдэнэ)',
    soonTitle: 'Удахгүй нэмэгдэнэ',
    soonText: 'Энэ сэдвийн богино бичлэгүүд бэлтгэгдэж байна.',
    count: (n) => `${n} бичлэг`,
    allTopics: 'Бүх сэдэв',
  },
  en: {
    tablist: 'Short video topics',
    play: (t) => `${t} — play video`,
    more: (n) => `+${n} videos`,
    viewAll: 'View all',
    allOf: (t) => `All short videos: ${t}`,
    dialog: (t) => `Short video: ${t}`,
    close: 'Close',
    prev: 'Previous video',
    next: 'Next video',
    youtube: 'Watch on YouTube',
    newWindow: ' (opens in a new window)',
    soonTitle: 'Coming soon',
    soonText: 'Short videos on this topic are being prepared.',
    count: (n) => (n === 1 ? '1 video' : `${n} videos`),
    allTopics: 'All topics',
  },
  'zh-CN': {
    tablist: '短视频主题',
    play: (t) => `播放视频：${t}`,
    more: (n) => `+${n} 个视频`,
    viewAll: '查看全部',
    allOf: (t) => `${t}的全部短视频`,
    dialog: (t) => `短视频：${t}`,
    close: '关闭',
    prev: '上一个视频',
    next: '下一个视频',
    youtube: '在 YouTube 上观看',
    newWindow: '（在新窗口中打开）',
    soonTitle: '即将推出',
    soonText: '该主题的短视频正在准备中。',
    count: (n) => `${n} 个视频`,
    allTopics: '全部主题',
  },
  ru: {
    tablist: 'Темы коротких видео',
    play: (t) => `${t} — смотреть видео`,
    more: (n) => `+${n} видео`,
    viewAll: 'Смотреть все',
    allOf: (t) => `Все короткие видео: ${t}`,
    dialog: (t) => `Короткое видео: ${t}`,
    close: 'Закрыть',
    prev: 'Предыдущее видео',
    next: 'Следующее видео',
    youtube: 'Смотреть на YouTube',
    newWindow: ' (откроется в новом окне)',
    soonTitle: 'Скоро',
    soonText: 'Короткие видео по этой теме готовятся.',
    count: (n) => `${n} видео`,
    allTopics: 'Все темы',
  },
  ko: {
    tablist: '쇼츠 주제',
    play: (t) => `동영상 재생: ${t}`,
    more: (n) => `+${n}개 영상`,
    viewAll: '모두 보기',
    allOf: (t) => `${t} 쇼츠 전체`,
    dialog: (t) => `쇼츠: ${t}`,
    close: '닫기',
    prev: '이전 영상',
    next: '다음 영상',
    youtube: 'YouTube에서 보기',
    newWindow: ' (새 창에서 열림)',
    soonTitle: '곧 추가됩니다',
    soonText: '이 주제의 쇼츠를 준비 중입니다.',
    count: (n) => `영상 ${n}개`,
    allTopics: '전체 주제',
  },
  ja: {
    tablist: 'ショート動画のテーマ',
    play: (t) => `動画を再生：${t}`,
    more: (n) => `+${n}本`,
    viewAll: 'すべて見る',
    allOf: (t) => `${t}のショート動画一覧`,
    dialog: (t) => `ショート動画：${t}`,
    close: '閉じる',
    prev: '前の動画',
    next: '次の動画',
    youtube: 'YouTubeで見る',
    newWindow: '（新しいウィンドウで開きます）',
    soonTitle: '近日公開',
    soonText: 'このテーマのショート動画は準備中です。',
    count: (n) => `${n}本の動画`,
    allTopics: 'すべてのテーマ',
  },
};

export const shortsText = (lang: ShortsLang): ShortsText => TEXT[lang];

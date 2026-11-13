// Хуудасны загварын (template) бичвэрүүд хэл бүрээр. Агуулга (гарчиг, бичвэр) Payload-аас хэлээрээ ирдэг;
// энд зөвхөн кодонд бичигдсэн товч, гарчиг, breadcrumb. Шинэ route-д [lang] хувилбар нэмэхдээ хэрэгтэй
// түлхүүрүүдээ энд нэмнэ. Орчуулаагүй түлхүүр англиар, англи нь ч алга бол монголоор гарна.
const STRINGS = {
  home: { mn: 'Нүүр', en: 'Home', 'zh-CN': '首页', ru: 'Главная', ko: '홈', ja: 'ホーム' },
  provinces: { mn: 'Аймгууд', en: 'Provinces', 'zh-CN': '省份', ru: 'Аймаки', ko: '아이막', ja: 'アイマグ' },
  overview: { mn: 'Танилцуулга', en: 'Overview', 'zh-CN': '概况', ru: 'Обзор', ko: '개요', ja: '概要' },
  destinations: { mn: 'Зорих газрууд', en: 'Destinations', 'zh-CN': '目的地', ru: 'Направления', ko: '여행지', ja: '目的地' },
  soumCenter: { mn: 'Сумын төв', en: 'Soum center', 'zh-CN': '苏木中心', ru: 'Центр сомона', ko: '솜 중심지', ja: 'ソム中心地' },
  population: { mn: 'Хүн ам', en: 'Population', 'zh-CN': '人口', ru: 'Население', ko: '인구', ja: '人口' },
  area: { mn: 'Газар нутаг', en: 'Area', 'zh-CN': '面积', ru: 'Площадь', ko: '면적', ja: '面積' },
  backTo: { mn: '{x} руу буцах', en: 'Back to {x}', 'zh-CN': '返回{x}', ru: 'Назад: {x}', ko: '{x}(으)로 돌아가기', ja: '{x}に戻る' },
  emblemOf: { mn: '{x}ын сүлд', en: 'Emblem of {x}', 'zh-CN': '{x}徽章', ru: 'Герб: {x}', ko: '{x} 문장', ja: '{x}の紋章' },
  notFound: { mn: 'Мэдээлэл олдсонгүй', en: 'Page not found', 'zh-CN': '未找到页面', ru: 'Страница не найдена', ko: '페이지를 찾을 수 없음', ja: 'ページが見つかりません' },
} as const;

export type UiKey = keyof typeof STRINGS;

export function ui(locale: string) {
  return (key: UiKey, vars: Record<string, string> = {}) => {
    const row = STRINGS[key] as Record<string, string>;
    const s = row[locale] ?? row.en ?? row.mn;
    return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
  };
}

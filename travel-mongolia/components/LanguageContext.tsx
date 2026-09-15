'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'mn' | 'en' | 'ru' | 'zh' | 'ja' | 'ko';

export const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'mn', label: 'Монгол', flag: '🇲🇳' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
];

export const DICTIONARY = {
  mn: {
    places: 'Газрууд',
    tourTypes: 'Аяллын төрлүүд',
    planning: 'Төлөвлөгөө',
    search: 'Хайх',
    heroTag: 'DISCOVER THE LAND OF BLUE SKY',
    heroTitle: 'Монголд тавтай морил',
    heroDesc:
      'Нүүдэлчдийн өлгий нутаг, онгон дагшин байгаль, хязгааргүй уудам тал нутгаар хамтдаа аялцгаая.',
    featuredPlaces: 'Онцлох газрууд',
    viewAll: 'Дэлгэрэнгүй үзэх',
    mapTitle: 'Монгол улсын аймгууд',
    weather: 'Цаг агаар',
    aiAdvisor: 'Аяллын зөвлөхөөс асуух',
    back: 'Буцах',
  },
  en: {
    places: 'Destinations',
    tourTypes: 'Tour Types',
    planning: 'Planning',
    search: 'Search',
    heroTag: 'DISCOVER THE LAND OF BLUE SKY',
    heroTitle: 'Welcome to Mongolia',
    heroDesc:
      'Explore the untouched landscapes, nomadic culture, and boundless steppes.',
    featuredPlaces: 'Featured Places',
    viewAll: 'Explore all',
    mapTitle: 'Provinces of Mongolia',
    weather: 'Weather',
    aiAdvisor: 'Ask AI Advisor',
    back: 'Back',
  },
  ru: {
    places: 'Места',
    tourTypes: 'Виды туров',
    planning: 'Планирование',
    search: 'Поиск',
    heroTag: 'ОТКРОЙТЕ ДЛЯ СЕБЯ СТРАНУ СИНЕГО НЕБА',
    heroTitle: 'Добро пожаловать в Монголию',
    heroDesc:
      'Откройте для себя родину кочевников, нетронутую природу и бескрайние степи.',
    featuredPlaces: 'Популярные места',
    viewAll: 'Смотреть все',
    mapTitle: 'Аймаки Монголии',
    weather: 'Погода',
    aiAdvisor: 'Спросить у AI гида',
    back: 'Назад',
  },
  zh: {
    places: '目的地',
    tourTypes: '旅游类型',
    planning: '行程规划',
    search: '搜索',
    heroTag: '探索蓝天之国',
    heroTitle: '欢迎来到蒙古国',
    heroDesc: '领略游牧民族的故乡、原始未触的自然风光与一望无际的草原。',
    featuredPlaces: '精选景点',
    viewAll: '查看更多',
    mapTitle: '蒙古国省份',
    weather: '当地天气',
    aiAdvisor: '咨询 AI 旅游顾问',
    back: '返回',
  },
  ja: {
    places: '目的地',
    tourTypes: 'ツアータイプ',
    planning: 'プランニング',
    search: '検索',
    heroTag: '青い空の国を旅する',
    heroTitle: 'モンゴルへようこそ',
    heroDesc: '遊牧民の故郷、大自然と果てしなく広がる大草原の旅へ。',
    featuredPlaces: 'おすすめスポット',
    viewAll: '詳しく見る',
    mapTitle: 'モンゴルの県',
    weather: '現在の天気',
    aiAdvisor: 'AIトラベルガイドに聞く',
    back: '戻る',
  },
  ko: {
    places: '여행지',
    tourTypes: '투어 종류',
    planning: '여행 계획',
    search: '검색',
    heroTag: '푸른 하늘의 나라를 만나보세요',
    heroTitle: '몽골에 오신 것을 환영합니다',
    heroDesc:
      '유목민의 고향, 순수한 대자연, 끝없이 펼쳐진 초원을 경험해보세요.',
    featuredPlaces: '추천 명소',
    viewAll: '더 알아보기',
    mapTitle: '몽골의 아이막(주)',
    weather: '현재 날씨',
    aiAdvisor: 'AI 여행 어드바이저',
    back: '뒤로가기',
  },
};

interface LanguageContextProps {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: typeof DICTIONARY['mn'];
}

const LanguageContext = createContext<LanguageContextProps>({
  locale: 'mn',
  setLocale: () => {},
  t: DICTIONARY.mn,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Language>('mn');

  useEffect(() => {
    const saved = localStorage.getItem('app_locale') as Language;
    if (saved && DICTIONARY[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (lang: Language) => {
    setLocaleState(lang);
    localStorage.setItem('app_locale', lang);
  };

  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t: DICTIONARY[locale] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);

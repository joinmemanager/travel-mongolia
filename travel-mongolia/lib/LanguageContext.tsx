'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'mn' | 'en' | 'zh' | 'ru' | 'ko' | 'ja';

export interface LangOption {
  code: Language;
  label: string;
  name: string;
}

export const LANGUAGES: LangOption[] = [
  { code: 'mn', label: 'MN', name: 'Монгол' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh', label: 'ZH', name: '中文' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'ko', label: 'KO', name: '한국어' },
  { code: 'ja', label: 'JA', name: '日本語' },
];

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  mn: {
    nav_about: 'Монголын тухай',
    nav_destinations: 'Зорих газрууд',
    nav_things_to_do: 'Үзэх, хийх зүйлс',
    nav_inspiration: 'Аялах сэдэл',
    nav_plan: 'Аяллаа төлөвлөх',
    nav_search: 'Хайх',
    cat_nature: '01. БАЙГАЛЬД АЯЛАХ',
    cat_adventure: '02. АДАЛ ЯВДАЛ',
    cat_nomadic: '03. НҮҮДЭЛЧИН АХУЙ',
    cat_culture: '04. ТҮҮХ, СОЁЛ, ӨВ',
    cat_wildlife: '05. ЗЭРЛЭГ АМЬТАН',
    cat_food: '06. ХООЛ, УНДАА',
    cat_events: '07. БАЯР НААДАМ',
    cat_wellness: '08. АМРАЛТ, БЯСАЛГАЛ',
  },
  en: {
    nav_about: 'About Mongolia',
    nav_destinations: 'Destinations',
    nav_things_to_do: 'Things to Do',
    nav_inspiration: 'Inspiration',
    nav_plan: 'Plan Your Trip',
    nav_search: 'Search',
    cat_nature: '01. NATURE & OUTDOORS',
    cat_adventure: '02. ADVENTURE & ACTIVE',
    cat_nomadic: '03. NOMADIC LIFE',
    cat_culture: '04. HISTORY & CULTURE',
    cat_wildlife: '05. WILDLIFE & BIRDS',
    cat_food: '06. FOOD & DRINK',
    cat_events: '07. FESTIVALS & EVENTS',
    cat_wellness: '08. WELLNESS & RETREAT',
  },
  zh: {
    nav_about: '关于蒙古',
    nav_destinations: '目的地',
    nav_things_to_do: '游玩与体验',
    nav_inspiration: '旅行灵感',
    nav_plan: '行程规划',
    nav_search: '搜索',
    cat_nature: '01. 自然风光',
    cat_adventure: '02. 探险与户外',
    cat_nomadic: '03. 游牧体验',
    cat_culture: '04. 历史文化遗产',
    cat_wildlife: '05. 野生动植物',
    cat_food: '06. 美食与饮品',
    cat_events: '07. 节日庆典',
    cat_wellness: '08. 疗愈与静修',
  },
  ru: {
    nav_about: 'О Монголии',
    nav_destinations: 'Направления',
    nav_things_to_do: 'Чем заняться',
    nav_inspiration: 'Вдохновение',
    nav_plan: 'Планирование',
    nav_search: 'Поиск',
    cat_nature: '01. ПРИРОДА И ОТДЫХ',
    cat_adventure: '02. ПРИКЛЮЧЕНИЯ',
    cat_nomadic: '03. КОЧЕВОЙ БЫТ',
    cat_culture: '04. ИСТОРИЯ И КУЛЬТУРА',
    cat_wildlife: '05. ДИКАЯ ПРИРОДА',
    cat_food: '06. ЕДА И НАПИТКИ',
    cat_events: '07. ФЕСТИВАЛИ',
    cat_wellness: '08. ОЗДОРОВЛЕНИЕ',
  },
  ko: {
    nav_about: '몽골 소개',
    nav_destinations: '여행지',
    nav_things_to_do: '즐길 거리',
    nav_inspiration: '여행 영감',
    nav_plan: '여행 계획',
    nav_search: '검색',
    cat_nature: '01. 자연과 아웃도어',
    cat_adventure: '02. 어드벤처 & 액티비티',
    cat_nomadic: '03. 유목민 생활 체험',
    cat_culture: '04. 역사와 문화유산',
    cat_wildlife: '05. 야생동물 관찰',
    cat_food: '06. 음식 및 전통 음료',
    cat_events: '07. 축제 및 이벤트',
    cat_wellness: '08. 웰니스 & 힐링',
  },
  ja: {
    nav_about: 'モンゴルについて',
    nav_destinations: '行き先',
    nav_things_to_do: '体験・見どころ',
    nav_inspiration: '旅のインスピレーション',
    nav_plan: '旅行プラン',
    nav_search: '検索',
    cat_nature: '01. 自然・アウトドア',
    cat_adventure: '02. アドベンチャー',
    cat_nomadic: '03. 遊牧民の暮らし',
    cat_culture: '04. 歴史・文化遺産',
    cat_wildlife: '05. 野生動物ウォッチング',
    cat_food: '06. グルメ・伝統食',
    cat_events: '07. 祭り・イベント',
    cat_wellness: '08. ウェルネス・癒し',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Language>('mn');

  useEffect(() => {
    const saved = localStorage.getItem('site_lang') as Language;
    if (saved && ['mn', 'en', 'zh', 'ru', 'ko', 'ja'].includes(saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('site_lang', newLang);
  };

  const t = (key: string) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
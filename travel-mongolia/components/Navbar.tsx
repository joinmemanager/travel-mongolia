'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

import type { NavSection } from '@/lib/navigation';

import NavItemLink from './NavItemLink';
import { readSiteLang } from './useSiteLang';

// 6 хэлний тохиргоо (Google Translate кодуудтай таарсан)
const LANGUAGES = [
  { code: 'mn', label: 'MN', name: 'Монгол' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh-CN', label: 'ZH', name: '中文' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'ko', label: 'KO', name: '한국어' },
  { code: 'ja', label: 'JA', name: '日本語' },
];

// Цэсний бүтэц lib/navigation.ts-д байна. Layout нь production/preview-ийн дагуу
// шүүгээд дамжуулна. Бүх холбоос серверийн HTML-д <a href> хэлбэрээр гарна
// (хаалттай dropdown нь зөвхөн CSS-ээр нуугдана), ингэснээр Google цэсийг уншина.
export default function Navbar({ sections }: { sections: NavSection[] }) {
  const [selectedLang, setSelectedLang] = useState('mn');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Хөтөч ачааллахад өмнө нь сонгогдсон хэлийг cookie-нээс унших
  useEffect(() => {
    setSelectedLang(readSiteLang());
  }, []);

  // Хэл солих үед сайтын бүх текстийг нэгэн зэрэг орчуулах
  const clearGoogTransCookie = () => {
    const hostname = window.location.hostname;
    const bareHost = hostname.replace(/^www\./, '');
    const domains = [hostname, `.${hostname}`, bareHost, `.${bareHost}`];
    domains.forEach((domain) => {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    });
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    setIsLangOpen(false);

    clearGoogTransCookie();

    if (langCode === 'mn') {
      document.cookie = 'googtrans=/mn/mn; path=/;';
    } else {
      document.cookie = `googtrans=/mn/${langCode}; path=/;`;
    }
    window.location.reload();
  };

  // Скролл хийхэд навигацийн арын дэвсгэр сүүдэртэй болох
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Цэснээс хулгана холдоход бага зэрэг хүлээж байгаад хаах (UX сайжруулалт)
  const handleMouseEnter = (menu: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menu);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const closeMenu = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(null);
    setIsMobileOpen(false);
  };

  const currentLang =
    LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  // Англи хэл сонгосон үед цэсний англи нэрийг харуулж, Google Translate-ийг түүнд хүргэхгүй
  const isEnglish = selectedLang === 'en';
  const labelOf = (x: { mn: string; en: string }) => (isEnglish ? x.en : x.mn);
  const labelProps: { translate?: 'no'; className?: string } = isEnglish
    ? { translate: 'no', className: 'notranslate' }
    : {};

  return (
    <>
      <header
        className={`relative w-full z-50 transition-all duration-300 ${
          isScrolled || activeMenu
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100'
            : 'bg-white border-b border-gray-100'
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex gap-4 justify-between items-center px-6 mx-auto max-w-7xl h-20 sm:px-10 min-[1200px]:px-6">
          {/* 1. LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex gap-1 items-center shrink-0"
          >
            {/* notranslate: Google Translate <font>-оор ороож цэгийг дараагийн мөр рүү унагаахаас сэргийлнэ */}
            <span
              translate="no"
              className="notranslate whitespace-nowrap text-2xl font-black tracking-tight text-gray-900 sm:text-3xl"
            >
              Mongolia<span className="text-[#15803d]">.</span>
            </span>
          </Link>

          {/* 2. ҮНДСЭН ЦЭС. 6 хэсэг нэг мөрөнд багтахаар (Rubik фонтоор хэмжиж тооцсон):
              1200–1239px: 13px, 1240–1279px: 14px, 1280px-ээс дээш: 15px */}
          <nav
            aria-label="Үндсэн цэс"
            className="hidden gap-2.5 items-center h-full min-[1200px]:flex"
          >
            {sections.map((section) => {
              const isActive = activeMenu === section.id;
              return (
                <div
                  key={section.id}
                  className="flex items-center h-full"
                  onMouseEnter={() => handleMouseEnter(section.id)}
                >
                  <button
                    type="button"
                    aria-expanded={isActive}
                    aria-controls={`nav-panel-${section.id}`}
                    onClick={() => setActiveMenu(isActive ? null : section.id)}
                    className={`whitespace-nowrap text-[13px] min-[1240px]:text-sm xl:text-[15px] font-semibold transition-colors flex items-center gap-1 py-2 cursor-pointer ${
                      isActive
                        ? 'text-[#15803d]'
                        : 'text-gray-700 hover:text-black'
                    }`}
                  >
                    <span {...labelProps}>{labelOf(section)}</span>
                    <svg
                      className={`w-3 h-3 transition-transform duration-200 ${
                        isActive ? 'rotate-180 text-[#15803d]' : 'text-gray-400'
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              );
            })}
          </nav>

          {/* 3. БАРУУН ТАЛ: ХАЙЛТ & ОЛОН ХЭЛ СОНГОГЧ */}
          <div className="flex gap-4 items-center shrink-0">
            {/* ХАЙХ ТОВЧ. Desktop дээр цэсэнд зай гаргахын тулд зөвхөн icon */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Хайх"
              className="flex gap-2 items-center py-2 px-3 text-sm font-semibold text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <svg
                className="w-4 h-4 text-[#15803d]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden sm:inline min-[1200px]:hidden">Хайх</span>
            </button>

            {/* ХЭЛ СОНГОГЧ ТОХИРГОО */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex gap-2 items-center py-1.5 px-3 text-xs font-bold text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                <span className="font-black text-[#15803d]">
                  {currentLang.label}
                </span>
                <span className="min-[1200px]:hidden">{currentLang.name}</span>
                <span className="text-[10px] text-gray-500">▼</span>
              </button>

              {isLangOpen && (
                <div
                  onMouseLeave={() => setIsLangOpen(false)}
                  className="absolute right-0 z-50 py-2 mt-2 w-36 bg-white rounded-2xl border border-gray-100 shadow-xl"
                >
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleLanguageChange(item.code)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-neutral-50 transition-colors ${
                        selectedLang === item.code
                          ? 'text-[#15803d] font-bold bg-green-50/60'
                          : 'text-neutral-700'
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Нарийн дэлгэц (< 1200px) дээр үндсэн цэсийг нээх товч */}
            <button
              type="button"
              onClick={() => {
                if (isMobileOpen) closeMenu();
                setIsMobileOpen(!isMobileOpen);
              }}
              aria-label={isMobileOpen ? 'Цэс хаах' : 'Цэс нээх'}
              aria-expanded={isMobileOpen}
              className="flex justify-center items-center w-10 h-10 text-gray-800 hover:bg-gray-100 rounded-full transition-colors cursor-pointer min-[1200px]:hidden"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isMobileOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Нарийн дэлгэцийн үндсэн цэсийн жагсаалт. Сонгосон цэсийн дэлгэрэнгүй нь доорх mega menu-д гарна */}
        {isMobileOpen && (
          <nav
            aria-label="Үндсэн цэс"
            className="flex overflow-x-auto gap-2 px-6 pb-4 mx-auto max-w-7xl sm:px-10 min-[1200px]:hidden"
          >
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() =>
                  setActiveMenu(activeMenu === section.id ? null : section.id)
                }
                className={`shrink-0 py-2 px-4 text-sm font-semibold rounded-full border transition-colors cursor-pointer ${
                  activeMenu === section.id
                    ? 'text-white bg-[#15803d] border-[#15803d]'
                    : 'text-gray-700 bg-white border-gray-200 hover:border-gray-400'
                }`}
              >
                <span {...labelProps}>{labelOf(section)}</span>
              </button>
            ))}
          </nav>
        )}

        {/* 4. ДООШОО ДЭЛГЭГДДЭГ MEGA MENU. Хаалттай үед ч HTML-д байна, зөвхөн CSS-ээр нуугдана */}
        <div
          className={`bg-white border-t border-gray-100 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2 ${
            activeMenu ? '' : 'hidden'
          }`}
          onMouseEnter={() => {
            if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
          }}
          onMouseLeave={handleMouseLeave}
        >
          <div className="py-10 px-6 mx-auto max-w-7xl sm:px-10 lg:px-16">
            {sections.map((section) => (
              <div
                key={section.id}
                id={`nav-panel-${section.id}`}
                className={activeMenu === section.id ? '' : 'hidden'}
              >
                <div className="flex gap-3 items-baseline pb-4 mb-6 border-b border-gray-100">
                  <span
                    {...labelProps}
                    className={`text-sm font-black tracking-wider text-gray-900 uppercase ${labelProps.className || ''}`}
                  >
                    {labelOf(section)}
                  </span>
                  {!isEnglish && (
                    <span className="text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                      {section.en}
                    </span>
                  )}
                </div>
                <ul className="grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                  {section.items.map((item) => (
                    <li key={`${item.href}-${item.mn}`}>
                      <NavItemLink
                        item={item}
                        english={isEnglish}
                        onClick={closeMenu}
                        className="group block"
                        comingSoonClassName="inline-block mt-1.5 py-0.5 px-2 text-[10px] font-bold text-amber-800 bg-amber-100 rounded-full"
                      >
                        <span
                          {...labelProps}
                          className={`block text-xs font-black tracking-wider text-[#15803d] uppercase group-hover:underline ${labelProps.className || ''}`}
                        >
                          {labelOf(item)}
                        </span>
                        {!isEnglish && (
                          <span className="block mt-0.5 text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                            {item.en}
                          </span>
                        )}
                      </NavItemLink>
                      {item.children && item.children.length > 0 && (
                        <ul className="mt-3 space-y-2 text-sm font-normal text-neutral-700">
                          {item.children.map((child) => (
                            <li key={`${child.href}-${child.mn}`}>
                              <NavItemLink
                                item={child}
                                english={isEnglish}
                                onClick={closeMenu}
                                className="block hover:text-[#15803d] transition-colors"
                                comingSoonClassName="ml-2 py-0.5 px-1.5 text-[10px] font-bold text-amber-800 bg-amber-100 rounded-full"
                              >
                                <span {...labelProps}>{labelOf(child)}</span>
                              </NavItemLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 5. ХАЙЛТЫН ЦОНХ (MODAL) - ШҮҮГДДЭГ СИСТЕМТЭЙ */}
      {isSearchOpen && (
        <div
          className="flex fixed inset-0 z-50 justify-center items-start px-4 pt-20 bg-black/60 backdrop-blur-sm sm:pt-28"
          onClick={() => setIsSearchOpen(false)}
        >
          <div
            className="flex flex-col p-6 w-full max-w-2xl max-h-[80vh] bg-white rounded-3xl border border-neutral-100 shadow-2xl duration-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Толгой хэсэг */}
            <div className="flex justify-between items-center pb-3 mb-4 border-b border-neutral-100">
              <span className="font-mono text-xs font-bold tracking-widest text-neutral-400 uppercase">
                Сайт дотроос хайх
              </span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="flex justify-center items-center w-8 h-8 text-xs text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Хайлтын Оруулах Талбар */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Юу хайж байна? (Жишээ: Хөвсгөл, Виз, Төлөвлөгч, Бааз, Машин...)"
                className="py-3.5 px-5 w-full text-sm font-medium text-neutral-900 placeholder:text-neutral-400 bg-neutral-50 focus:bg-white rounded-2xl border border-neutral-200 focus:border-[#15803d] outline-none transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-4 text-xs font-bold text-neutral-400 hover:text-neutral-700 -translate-y-1/2 cursor-pointer"
                >
                  Цэвэрлэх
                </button>
              )}
            </div>

            {/* ИЛЭРЦҮҮДИЙГ ХАРУУЛАХ ХЭСЭГ */}
            <div className="overflow-y-auto flex-1 pr-1 space-y-2">
              {searchQuery.trim() === '' ? (
                /* 1. Юу ч бичээгүй үед гарч ирэх бэлэн товчнууд */
                <div className="py-4">
                  <span className="block mb-2 font-mono text-xs font-bold text-neutral-400">
                    Түгээмэл хайлтууд:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Хөвсгөл',
                      'Виз',
                      'Говь',
                      'Машин түрээс',
                      'Төлөвлөгч',
                      'Жуулчны бааз',
                      'Тэрэлж',
                    ].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSearchQuery(item)}
                        className="py-1.5 px-3 text-xs font-medium text-neutral-700 hover:text-white bg-neutral-100 hover:bg-[#15803d] rounded-xl transition-colors cursor-pointer"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* 2. Үг бичих үед сайт дээрх бүх хуудсуудаас шүүж гаргах хэсэг */
                (() => {
                  const q = searchQuery.toLowerCase().trim();
                  const results = [
                    {
                      id: 'visa',
                      title: 'Визний шаардлага & E-Visa',
                      category: 'Аяллаа төлөвлөх',
                      desc: '60 гаруй орны визгүй зорчих журам, цахим виз мэдүүлэг.',
                      href: '/plan/before-you-travel#visa',
                      keys: ['виз', 'visa', 'evisa', 'паспорт'],
                    },
                    {
                      id: 'weather',
                      title: 'Цаг агаарын төлөв & Саруудын температур',
                      category: 'Аяллаа төлөвлөх',
                      desc: 'Улирлын онцлог, сар бүрийн дундаж градус.',
                      href: '/plan/before-you-travel#weather',
                      keys: [
                        'цаг агаар',
                        'температур',
                        'зун',
                        'өвөл',
                        'хавар',
                        'намар',
                      ],
                    },
                    {
                      id: 'packing',
                      title: 'Юу авчрах вэ? (Хээрийн чеклист)',
                      category: 'Аяллаа төлөвлөх',
                      desc: 'Хувцаслалт, эмийн сан, шаардлагатай техникийн жагсаалт.',
                      href: '/plan/before-you-travel#packing',
                      keys: ['чеклист', 'юу авах', 'ачаа', 'гутал', 'куртка'],
                    },
                    {
                      id: 'flights',
                      title: 'Олон улсын нислэг & Чингис Хаан буудал',
                      category: 'Аяллаа төлөвлөх',
                      desc: 'Шууд нислэгүүд, нисэх буудлаас хот орох тээвэр.',
                      href: '/plan/getting-to-mongolia#flights',
                      keys: [
                        'нислэг',
                        'тийз',
                        'онгоц',
                        'буудал',
                        'ubn',
                        'миат',
                      ],
                    },
                    {
                      id: 'getting-around',
                      title: 'Монгол дотор аялах (Тээвэр, Зай, Хугацаа)',
                      category: 'Аяллаа төлөвлөх',
                      desc: '4x4 автомашин, дотоод нислэг, галт тэрэг, зайн тооцоо.',
                      href: '/plan/getting-around',
                      keys: [
                        'машин',
                        'жолооч',
                        'автобус',
                        'галт тэрэг',
                        'дотоодын нислэг',
                        'түрээс',
                        'зай',
                      ],
                    },
                    {
                      id: 'accommodation',
                      title: 'Байрлах газар (Зочид буудал, Бааз, Гэр кэмп)',
                      category: 'Аяллаа төлөвлөх',
                      desc: 'Буудлууд, жуулчны баазуудын лавлах, шууд холбогдох холбоосууд.',
                      href: '/plan/accommodation',
                      keys: ['буудал', 'бааз', 'гэр кэмп', 'хостел', 'байрлах'],
                    },
                    {
                      id: 'services',
                      title: 'Аяллын үйлчилгээ (Компани, Хөтөч, Жолооч)',
                      category: 'Аяллаа төлөвлөх',
                      desc: 'Албан ёсны тур операторууд, хөтөч, орон нутгийн үйлчилгээ.',
                      href: '/plan/services',
                      keys: ['компани', 'хөтөч', 'жолооч', 'тур', 'оператор'],
                    },
                    {
                      id: 'safety',
                      title: 'Аюулгүй байдал & Emergency лавлах',
                      category: 'Аяллаа төлөвлөх',
                      desc: 'Шуурхай дуудлагын утас, дүрэм журам, соёлын ёс зүй.',
                      href: '/plan/safety-info',
                      keys: [
                        'аюулгүй',
                        'утас',
                        'түргэн',
                        'цагдаа',
                        'дүрэм',
                        'ёс зүй',
                        'faq',
                      ],
                    },
                    {
                      id: 'planner',
                      title: 'Аяллын интерактив төлөвлөгч хэрэгсэл',
                      category: 'Интерактив систем',
                      desc: 'Газраа сонгож өдрөөр хуваарилан газрын зураг дээр төлөвлөх систем.',
                      href: '/planner',
                      keys: ['төлөвлөгч', 'маршрут', 'өдрөөр', 'planner'],
                    },
                    {
                      id: 'khuvsgul',
                      title: 'Хөвсгөл нуур (Далай ээж)',
                      category: 'Зорих газар',
                      desc: 'Хамгийн гүн цэнгэг нуур, Хатгал, тайгын байгаль.',
                      href: '/destination/landscapes?section=mountains-lakes-rivers',
                      keys: ['хөвсгөл', 'нуурын эрэг', 'хатгал', 'хөх сувд'],
                    },
                    {
                      id: 'terelj',
                      title: 'Горхи-Тэрэлжийн БЦГ',
                      category: 'Зорих газар',
                      desc: 'УБ-аас 60 км, хад цохио, амралтын баазууд.',
                      href: '/destination/protected#national-parks',
                      keys: ['тэрэлж', 'мэлхий хад', 'ариябал'],
                    },
                    {
                      id: 'gobi',
                      title: 'Хонгорын элс & Говийн бүс',
                      category: 'Зорих газар',
                      desc: 'Үлэг гүрвэлийн өлгий Баянзаг, дуут манхан, Ёлын ам.',
                      href: '/destination/landscapes?section=gobi-dunes',
                      keys: ['говь', 'хонгорын элс', 'баянзаг', 'ёлын ам'],
                    },
                  ].filter(
                    (item) =>
                      item.title.toLowerCase().includes(q) ||
                      item.desc.toLowerCase().includes(q) ||
                      item.category.toLowerCase().includes(q) ||
                      item.keys.some((k) => k.includes(q))
                  );

                  if (results.length === 0) {
                    return (
                      <div className="py-12 text-xs text-center text-neutral-400">
                        <span className="block mb-2 text-2xl">🔍</span>"
                        {searchQuery}" гэсэн түлхүүр үгээр илэрц олдсонгүй. Өөр
                        үгээр хайж үзнэ үү.
                      </div>
                    );
                  }

                  return results.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="group block p-3.5 bg-neutral-50 hover:bg-emerald-50/60 rounded-2xl border border-neutral-100 hover:border-emerald-200 transition-all"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-neutral-900 group-hover:text-[#15803d] transition-colors">
                          {item.title}
                        </span>
                        <span className="py-0.5 px-2 font-mono text-[10px] font-bold text-neutral-600 group-hover:text-[#15803d] bg-neutral-200/60 group-hover:bg-emerald-100 rounded transition-colors">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 group-hover:text-neutral-700 line-clamp-1">
                        {item.desc}
                      </p>
                    </Link>
                  ));
                })()
              )}
            </div>

            {/* Доод хөл хэсэг */}
            <div className="flex justify-between items-center pt-3 mt-3 font-mono text-[11px] text-neutral-400 border-t border-neutral-100">
              <span>Хайх үгээ бичихэд шууд шүүгдэнэ</span>
              <span>Дарж хуудас руу үсрэнэ</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// 6 хэлний тохиргоо (Google Translate кодуудтай таарсан)
const LANGUAGES = [
  { code: 'mn', label: 'MN', name: 'Монгол' },
  { code: 'en', label: 'EN', name: 'English' },
  { code: 'zh-CN', label: 'ZH', name: '中文' },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'ko', label: 'KO', name: '한국어' },
  { code: 'ja', label: 'JA', name: '日本語' },
];

export default function Navbar() {
  const [selectedLang, setSelectedLang] = useState('mn');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Хөтөч ачааллахад өмнө нь сонгогдсон хэлийг cookie-нээс унших
  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/mn\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      setSelectedLang(match[1]);
    }
  }, []);

  // Хэл солих үед сайтын бүх текстийг нэгэн зэрэг орчуулах
  const handleLanguageChange = (langCode: string) => {
    setSelectedLang(langCode);
    setIsLangOpen(false);

    if (langCode === 'mn') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname;
      window.location.reload();
    } else {
      document.cookie = `/mn/${langCode}; path=/;`;
      document.cookie = `googtrans=/mn/${langCode}; path=/;`;
      document.cookie = `googtrans=/mn/${langCode}; path=/; domain=${window.location.hostname}`;
      window.location.reload();
    }
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
  };

  const currentLang = LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

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
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
          
          {/* 1. LOGO */}
          <Link href="/" onClick={closeMenu} className="flex items-center gap-1 group">
            <span className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              mongolia<span className="text-[#15803d]">.</span>
            </span>
          </Link>

          {/* 2. 5 ҮНДСЭН ТОЛГОЙ ЦЭС */}
          <nav className="hidden xl:flex items-center gap-7 h-full">
            
            {/* 01. МОНГОЛЫН ТУХАЙ */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('about')}
            >
              <button
                onClick={() => setActiveMenu(activeMenu === 'about' ? null : 'about')}
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'about' ? 'text-[#15803d]' : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Монголын тухай</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'about' ? 'rotate-180 text-[#15803d]' : 'text-gray-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* 02. ЗОРИХ ГАЗРУУД */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('destinations')}
            >
              <button
                onClick={() => setActiveMenu(activeMenu === 'destinations' ? null : 'destinations')}
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'destinations' ? 'text-[#15803d]' : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Зорих газрууд</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'destinations' ? 'rotate-180 text-[#15803d]' : 'text-gray-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* 03. ҮЗЭХ, ХИЙХ ЗҮЙЛС */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('things-to-do')}
            >
              <button
                onClick={() => setActiveMenu(activeMenu === 'things-to-do' ? null : 'things-to-do')}
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'things-to-do' ? 'text-[#15803d]' : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Үзэх, хийх зүйлс</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'things-to-do' ? 'rotate-180 text-[#15803d]' : 'text-gray-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* 04. АЯЛАХ СЭДЭЛ */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('inspiration')}
            >
              <button
                onClick={() => setActiveMenu(activeMenu === 'inspiration' ? null : 'inspiration')}
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'inspiration' ? 'text-[#15803d]' : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Аялах сэдэл</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'inspiration' ? 'rotate-180 text-[#15803d]' : 'text-gray-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* 05. АЯЛЛАА ТӨЛӨВЛӨХ */}
            <div
              className="h-full flex items-center"
              onMouseEnter={() => handleMouseEnter('plan')}
            >
              <button
                onClick={() => setActiveMenu(activeMenu === 'plan' ? null : 'plan')}
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'plan' ? 'text-[#15803d]' : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Аяллаа төлөвлөх</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'plan' ? 'rotate-180 text-[#15803d]' : 'text-gray-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

          </nav>

          {/* 3. БАРУУН ТАЛ: ХАЙЛТ & ОЛОН ХЭЛ СОНГОГЧ */}
          <div className="flex items-center gap-4">
            {/* ХАЙХ ТОВЧ */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-black transition-colors px-3 py-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#15803d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Хайх</span>
            </button>

            {/* ХЭЛ СОНГОГЧ ТОХИРГОО */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 cursor-pointer"
              >
                <span className="text-[#15803d] font-black">{currentLang.label}</span>
                <span>{currentLang.name}</span>
                <span className="text-[10px] text-gray-500">▼</span>
              </button>

              {isLangOpen && (
                <div
                  onMouseLeave={() => setIsLangOpen(false)}
                  className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50"
                >
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleLanguageChange(item.code)}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left hover:bg-neutral-50 transition-colors ${
                        selectedLang === item.code ? 'text-[#15803d] font-bold bg-green-50/60' : 'text-neutral-700'
                      }`}
                    >
                      <span>{item.name}</span>
                      <span className="text-[10px] uppercase font-bold text-neutral-400">{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* 4. ДООШОО ДЭЛГЭГДДЭГ MEGA MENU ХЭСЭГ */}
        {activeMenu && (
          <div
            className="border-t border-gray-100 bg-white shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2"
            onMouseEnter={() => {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
              
              {/* --- 01. МОНГОЛЫН ТУХАЙ --- */}
              {activeMenu === 'about' && (
                <div className="grid grid-cols-3 gap-10">
                  <div className="space-y-4 border-r border-gray-100 pr-6">
                    <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider block hover:text-emerald-950 transition-colors cursor-pointer">
                      Ерөнхий & Түүх
                    </span>
                    <ul className="space-y-2.5 text-sm text-gray-700">
                      <li><Link href="/about/at-a-glance" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Монгол орныг товчхон (Газар нутаг, бэлгэдэл)</Link></li>
                      <li><Link href="/about/history" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Монголын түүх (Хүннү, Их Монгол Улс, 20-р зуун)</Link></li>
                      <li><Link href="/about/people" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Монгол хүн, хэл, үндэстний онцлог</Link></li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4 border-r border-gray-100 pr-6">
                    <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider block hover:text-emerald-950 transition-colors cursor-pointer">
                      Ахуй, Ёс заншил & Соёл
                    </span>
                    <ul className="space-y-2.5 text-sm text-gray-700">
                      <li><Link href="/about/nomadic-life" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Нүүдэлчин ахуй (Гэр, 5 хошуу мал, нүүдэл)</Link></li>
                      <li><Link href="/about/traditions" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Ёс заншил, уламжлал, шүтлэг</Link></li>
                      <li><Link href="/about/culture" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Соёл ба өв (Хөгжим, бүжиг, урлаг)</Link></li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider block hover:text-emerald-950 transition-colors cursor-pointer">
                      Байгаль & Өнөөгийн дүр төрх
                    </span>
                    <ul className="space-y-2.5 text-sm text-gray-700">
                      <li><Link href="/about/food" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Монгол хоол, ундаа</Link></li>
                      <li><Link href="/about/nature" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Байгаль, газарзүй, амьтан</Link></li>
                      <li><Link href="/about/modern" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Өнөөгийн Монгол (Хотын амьдрал, залуусын соёл)</Link></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* --- 02. ЗОРИХ ГАЗРУУД --- */}
              {activeMenu === 'destinations' && (
                <div className="grid grid-cols-5 gap-8">
                  {/* Багана 1: Бүс нутгаар */}
                  <div className="space-y-6 border-r border-gray-100 pr-6">
                    <div>
                      <Link
                        href="/destination/region"
                        onClick={closeMenu}
                        className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-3 block hover:text-emerald-950 transition-colors"
                      >
                        Аяллын бүсээр
                      </Link>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><Link href="/destination/region?region=central" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Төв Монгол</Link></li>
                        <li><Link href="/destination/region?region=khangai" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хангайн бүс</Link></li>
                        <li><Link href="/destination/region?region=khuvsgul-north" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хөвсгөл ба Хойд Монгол</Link></li>
                        <li><Link href="/destination/region?region=altai-west" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Алтай ба Баруун Монгол</Link></li>
                        <li><Link href="/destination/region?region=gobi" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Говийн бүс</Link></li>
                        <li><Link href="/destination/region?region=eastern" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Зүүн Монгол</Link></li>
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-2 hover:text-emerald-950 transition-colors cursor-pointer">
                        Аймаг, хотоор
                      </h4>
                      <Link 
                        href="/destination/region" 
                        onClick={closeMenu} 
                        className="text-sm font-semibold text-gray-900 hover:text-[#15803d] flex items-center justify-between transition-colors"
                      >
                        <span>21 аймаг + Улаанбаатар</span>
                        <span>→</span>
                      </Link>
                    </div>
                  </div>

                  {/* Багана 2: Тусгай хамгаалалттай газраар */}
                  <div className="space-y-4">
                    <Link href="/destination/protected" onClick={closeMenu}>
                      <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider block hover:text-emerald-950 transition-colors cursor-pointer">
                        ТУСГАЙ ХАМГААЛАЛТТАЙ ГАЗРААР
                      </span>
                    </Link>
                    <ul className="space-y-2.5 text-sm text-gray-700">
                      <li><Link href="/destination/protected#strictly-protected" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Дархан цаазат газар</Link></li>
                      <li><Link href="/destination/protected#national-parks" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Байгалийн цогцолборт газар</Link></li>
                      <li><Link href="/destination/protected#nature-reserves" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Байгалийн нөөц газар</Link></li>
                      <li><Link href="/destination/protected#natural-monuments" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Байгалийн дурсгалт газар</Link></li>
                    </ul>
                  </div>

                  {/* Багана 3: Байгалийн тогтоц */}
                  <div className="space-y-4 border-r border-gray-100 pr-6">
                    <Link
                      href="/destination/landscapes"
                      onClick={closeMenu}
                      className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-3 block hover:text-emerald-950 transition-colors"
                    >
                      Байгалийн тогтоц, ландшафтаар
                    </Link>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li><Link href="/destination/landscapes?section=mountains-lakes-rivers" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Уул, нуур, гол мөрөн</Link></li>
                      <li><Link href="/destination/landscapes?section=gobi-dunes" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Говь, элсэн манхан</Link></li>
                      <li><Link href="/destination/landscapes?section=canyons-valleys" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хавцал, хөндий, ой, тайга</Link></li>
                      <li><Link href="/destination/landscapes?section=glaciers-caves" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Мөсөн гол, агуй, геологийн тогтоц</Link></li>
                    </ul>
                  </div>

                  {/* Багана 4: Маршрутаар & Газрын зураг */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <Link
                        href="/destination/routes"
                        onClick={closeMenu}
                        className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-3 block hover:text-emerald-950 transition-colors"
                      >
                        Аяллын маршрут, замаар
                      </Link>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><Link href="/destination/routes#gobi-circuit" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Говийн тойрог</Link></li>
                        <li><Link href="/destination/routes#orkhon-valley" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Орхоны хөндийн маршрут</Link></li>
                        <li><Link href="/destination/routes#khuvsgul-route" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хөвсгөлийн маршрут</Link></li>
                        <li><Link href="/destination/routes#altai-route" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Алтайн маршрут</Link></li>
                        <li><Link href="/destination/routes#eastern-route" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Зүүн Монголын маршрут</Link></li>
                        <li><Link href="/destination/routes#ub-daytrips" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Улаанбаатараас гарах богино замууд</Link></li>
                      </ul>
                    </div>

                    <div className="mt-6 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                      <span className="text-xs font-bold text-[#15803d] uppercase tracking-wider block">
                        Газрын зургаас хайх (C07)
                      </span>
                      <p className="text-xs text-gray-500 mt-1 mb-3">
                        Бүх газар, ТХГН, өв газруудыг интерактив газрын зураг дээр шүүж харах.
                      </p>
                      <Link
                        href="/destination/map"
                        onClick={closeMenu}
                        className="inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition-all"
                      >
                        Газрын зураг нээх →
                      </Link>
                    </div>
                  </div>

                  {/* Багана 5: Түүх, соёлын газруудаар */}
                  <div className="space-y-6">
                    <div>
                      <Link
                        href="/destination/heritage"
                        onClick={closeMenu}
                        className="text-xs font-bold text-[#15803d] uppercase tracking-wider mb-3 block hover:text-emerald-950 transition-colors"
                      >
                        Түүх, соёлын газруудаар
                      </Link>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><Link href="/destination/heritage#unesco-sites" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">UNESCO Дэлхийн өв</Link></li>
                        <li><Link href="/destination/heritage#archaeology" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Археологийн дурсгал</Link></li>
                        <li><Link href="/destination/heritage#monasteries" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хийд ба сүмүүд</Link></li>
                        <li><Link href="/destination/heritage#ancient-cities" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Түүхэн хот, суурингийн туурь</Link></li>
                        <li><Link href="/destination/heritage#petroglyphs" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хадны зураг, бичээс</Link></li>
                        <li><Link href="/destination/heritage#monuments" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хөшөө дурсгал, хүн чулуу</Link></li>
                        <li><Link href="/destination/heritage#nomadic-zones" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Нүүдэлчдийн соёлын бүс</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 03. ҮЗЭХ, ХИЙХ ЗҮЙЛС (8 БИЕ ДААСАН САЛАНГИД СЭДЭВ - 2 ЭГНЭЭГЭЭР) --- */}
              {activeMenu === 'things-to-do' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 w-full">
                  {/* 01. БАЙГАЛЬД АЯЛАХ */}
                  <div className="space-y-3">
                    <Link href="/things-to-do/nature" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        01. БАЙГАЛЬД АЯЛАХ
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Nature & Outdoors</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/things-to-do/nature?cat=scenic" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Байгалийн үзэсгэлэнт газрууд</Link></li>
                      <li><Link href="/things-to-do/nature?cat=mountains" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Уул, хөндий</Link></li>
                      <li><Link href="/things-to-do/nature?cat=lakes" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Нуур, гол</Link></li>
                      <li><Link href="/things-to-do/nature?cat=gobi" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Говь, элсэн манхан</Link></li>
                      <li><Link href="/things-to-do/nature?cat=forest" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Ой, тайга</Link></li>
                      <li><Link href="/things-to-do/nature?cat=protected" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Тусгай хамгаалалттай газар</Link></li>
                      <li><Link href="/things-to-do/nature?cat=camping" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Кемпинг</Link></li>
                      <li><Link href="/things-to-do/nature?cat=photo" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Байгалийн гэрэл зураг</Link></li>
                      <li><Link href="/things-to-do/nature?cat=stargazing" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Од харах / Stargazing</Link></li>
                    </ul>
                  </div>

                  {/* 02. АДАЛ ЯВДАЛ, ИДЭВХТЭЙ АЯЛАЛ */}
                  <div className="space-y-3">
                    <Link href="/things-to-do/adventure" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        02. АДАЛ ЯВДАЛ, ИДЭВХТЭЙ АЯЛАЛ
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Adventure & Active</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/things-to-do/adventure?cat=hiking" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Явган аялал / Hiking</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=trekking" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Trekking</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=climbing" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Ууланд авиралт</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=horse" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Морин аялал</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=camel" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Тэмээн аялал</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=biking" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Дугуйн аялал</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=kayaking" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Kayaking / Rafting</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=offroad" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">4×4 / Off-road</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=winter" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Цана, snowboard</Link></li>
                      <li><Link href="/things-to-do/adventure?cat=other" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Бусад адал явдалт үйл ажиллагаа</Link></li>
                    </ul>
                  </div>

                  {/* 03. НҮҮДЭЛЧИН АХУЙГ МЭДРЭХ */}
                  <div className="space-y-3">
                    <Link href="/things-to-do/nomadic" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        03. НҮҮДЭЛЧИН АХУЙГ МЭДРЭХ
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Nomadic & Local Experiences</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/things-to-do/nomadic?cat=visit-herder" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Малчин айлд зочлох</Link></li>
                      <li><Link href="/things-to-do/nomadic?cat=ger-stay" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Гэрт байрлах</Link></li>
                      <li><Link href="/things-to-do/nomadic?cat=herding" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Мал маллагаанд оролцох</Link></li>
                      <li><Link href="/things-to-do/nomadic?cat=riding" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Морь унах</Link></li>
                      <li><Link href="/things-to-do/nomadic?cat=milking" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Сааль саах</Link></li>
                      <li><Link href="/things-to-do/nomadic?cat=dairy" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Цагаан идээ боловсруулах</Link></li>
                      <li><Link href="/things-to-do/nomadic?cat=airag" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Айраг исгэх</Link></li>
                      <li><Link href="/things-to-do/nomadic?cat=migration" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Нүүдэл дагах</Link></li>
                      <li><Link href="/things-to-do/nomadic?cat=local" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Орон нутгийн иргэдтэй хийх туршлага</Link></li>
                    </ul>
                  </div>

                  {/* 04. ТҮҮХ, СОЁЛ, ӨВ */}
                  <div className="space-y-3">
                    <Link href="/things-to-do/culture" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        04. ТҮҮХ, СОЁЛ, ӨВ
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">History, Culture & Heritage</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/things-to-do/culture?cat=historical" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Түүхэн дурсгалт газар</Link></li>
                      <li><Link href="/things-to-do/culture?cat=archaeology" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Археологийн газар</Link></li>
                      <li><Link href="/things-to-do/culture?cat=monasteries" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хийд, сүм</Link></li>
                      <li><Link href="/things-to-do/culture?cat=museums" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Музей</Link></li>
                      <li><Link href="/things-to-do/culture?cat=unesco" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">UNESCO өв</Link></li>
                      <li><Link href="/things-to-do/culture?cat=arts" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Монгол урлаг</Link></li>
                      <li><Link href="/things-to-do/culture?cat=dance" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хөгжим, бүжиг</Link></li>
                      <li><Link href="/things-to-do/culture?cat=crafts" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Гар урлал</Link></li>
                      <li><Link href="/things-to-do/culture?cat=costume" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Үндэсний хувцас</Link></li>
                      <li><Link href="/things-to-do/culture?cat=workshops" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Соёлын туршлага, сургалт</Link></li>
                    </ul>
                  </div>

                  {/* 05. ЗЭРЛЭГ АМЬТАН, ШУВУУ АЖИГЛАХ */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/things-to-do/wildlife" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        05. ЗЭРЛЭГ АМЬТАН, ШУВУУ АЖИГЛАХ
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Wildlife & Birdwatching</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/things-to-do/wildlife?cat=snow-leopard" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Цоохор ирвэс</Link></li>
                      <li><Link href="/things-to-do/wildlife?cat=argali" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Аргаль, янгир</Link></li>
                      <li><Link href="/things-to-do/wildlife?cat=takhi" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Тахь, хулан</Link></li>
                      <li><Link href="/things-to-do/wildlife?cat=havtgai" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хавтгай</Link></li>
                      <li><Link href="/things-to-do/wildlife?cat=mazaalai" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Мазаалай</Link></li>
                      <li><Link href="/things-to-do/wildlife?cat=saiga" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Бөхөн</Link></li>
                      <li><Link href="/things-to-do/wildlife?cat=birds" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Шувуу ажиглах</Link></li>
                      <li><Link href="/things-to-do/wildlife?cat=photo" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Зэрлэг амьтны гэрэл зураг</Link></li>
                    </ul>
                  </div>

                  {/* 06. ХООЛ, УНДААНЫ ТУРШЛАГА */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/things-to-do/food" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        06. ХООЛ, УНДААНЫ ТУРШЛАГА
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Food & Drink</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/things-to-do/food?cat=dishes" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Монгол үндэсний хоол</Link></li>
                      <li><Link href="/things-to-do/food?cat=dairy" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Цагаан идээ</Link></li>
                      <li><Link href="/things-to-do/food?cat=airag" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Айраг</Link></li>
                      <li><Link href="/things-to-do/food?cat=tea" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Монгол цай</Link></li>
                      <li><Link href="/things-to-do/food?cat=local" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Орон нутгийн хоол</Link></li>
                      <li><Link href="/things-to-do/food?cat=cooking" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хоол хийх туршлага</Link></li>
                      <li><Link href="/things-to-do/food?cat=tours" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Амталгаа, хоолны аялал</Link></li>
                    </ul>
                  </div>

                  {/* 07. БАЯР НААДАМ, АРГА ХЭМЖЭЭ */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/things-to-do/events" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        07. БАЯР НААДАМ, АРГА ХЭМЖЭЭ
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Festivals & Events</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/things-to-do/events?cat=naadam" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Үндэсний их баяр наадам</Link></li>
                      <li><Link href="/things-to-do/events?cat=tsagaan-sar" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Цагаан сар</Link></li>
                      <li><Link href="/things-to-do/events?cat=eagle" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Бүргэдийн баяр</Link></li>
                      <li><Link href="/things-to-do/events?cat=camel" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Тэмээний баяр</Link></li>
                      <li><Link href="/things-to-do/events?cat=ice" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Мөсний баяр</Link></li>
                      <li><Link href="/things-to-do/events?cat=local" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Орон нутгийн наадам</Link></li>
                      <li><Link href="/things-to-do/events?cat=festivals" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Соёл, урлагийн фестиваль</Link></li>
                      <li><Link href="/things-to-do/events?cat=sports" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Спортын арга хэмжээ</Link></li>
                      <li><Link href="/things-to-do/events?cat=calendar" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Арга хэмжээний календарь</Link></li>
                    </ul>
                  </div>

                  {/* 08. АМРАЛТ, БЯСАЛГАЛ, СҮНСЛЭГ ТУРШЛАГА */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/things-to-do/wellness" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        08. АМРАЛТ, БЯСАЛГАЛ
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Wellness & Retreats</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/things-to-do/wellness?cat=meditation" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Бясалгал & Иог</Link></li>
                      <li><Link href="/things-to-do/wellness?cat=springs" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Рашаан, сувиллын амралт</Link></li>
                      <li><Link href="/things-to-do/wellness?cat=retreat" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Wellness retreat</Link></li>
                      <li><Link href="/things-to-do/wellness?cat=buddhist" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Буддын шашны туршлага</Link></li>
                      <li><Link href="/things-to-do/wellness?cat=shaman" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Бөө мөргөлийн соёлтой танилцах</Link></li>
                      <li><Link href="/things-to-do/wellness?cat=sacred" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Ариун, тахилгат газрууд</Link></li>
                      <li><Link href="/things-to-do/wellness?cat=detox" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Digital detox</Link></li>
                      <li><Link href="/things-to-do/wellness?cat=nature-rest" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Байгальд төвлөрсөн амралт</Link></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* --- 04. АЯЛАХ СЭДЭЛ (7 БИЕ ДААСАН САЛАНГИД СЭДЭВ - 2 ЭГНЭЭГЭЭР) --- */}
              {(activeMenu === 'travel-themes' || activeMenu === 'inspiration' || activeMenu === 'stories') && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-10 w-full">
                  {/* 01. MONGOLIA MAGAZINE */}
                  <div className="space-y-3">
                    <Link href="/inspiration/magazine" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        01. MONGOLIA MAGAZINE
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Editorial & Stories</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/inspiration/magazine#featured" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Онцлох нийтлэл</Link></li>
                      <li><Link href="/inspiration/magazine#latest" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Шинэ нийтлэл</Link></li>
                      <li><Link href="/inspiration/magazine#editors-pick" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Редакторын сонголт</Link></li>
                      <li><Link href="/inspiration/magazine#popular" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хамгийн их уншсан</Link></li>
                    </ul>
                  </div>

                  {/* 02. УЛИРЛААР */}
                  <div className="space-y-3">
                    <Link href="/inspiration/seasons" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        02. УЛИРЛААР
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Explore by Season</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/inspiration/seasons?season=spring" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хавар</Link></li>
                      <li><Link href="/inspiration/seasons?season=summer" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Зун</Link></li>
                      <li><Link href="/inspiration/seasons?season=autumn" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Намар</Link></li>
                      <li><Link href="/inspiration/seasons?season=winter" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Өвөл</Link></li>
                    </ul>
                  </div>

                  {/* 03. АЯЛЛЫН ХЭВ МАЯГААР */}
                  <div className="space-y-3">
                    <Link href="/inspiration/styles" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        03. АЯЛЛЫН ХЭВ МАЯГААР
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Travel Styles</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/inspiration/styles?style=adventure" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Adventure</Link></li>
                      <li><Link href="/inspiration/styles?style=culture" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Culture</Link></li>
                      <li><Link href="/inspiration/styles?style=family" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Family</Link></li>
                      <li><Link href="/inspiration/styles?style=luxury" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Luxury</Link></li>
                      <li><Link href="/inspiration/styles?style=slow-travel" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Slow Travel</Link></li>
                      <li><Link href="/inspiration/styles?style=photography" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Photography</Link></li>
                      <li><Link href="/inspiration/styles?style=sustainable" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Sustainable Travel</Link></li>
                    </ul>
                  </div>

                  {/* 04. HIDDEN MONGOLIA */}
                  <div className="space-y-3">
                    <Link href="/inspiration/hidden" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        04. HIDDEN MONGOLIA
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Uncharted Places</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/inspiration/hidden" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Олны танил биш газрууд</Link></li>
                      <li><Link href="/inspiration/hidden#stories" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Нууцлаг түүхүүд</Link></li>
                    </ul>
                  </div>

                  {/* 05. LOCAL STORIES */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/inspiration/stories" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        05. LOCAL STORIES
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">People & Life</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/inspiration/stories" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Орон нутгийн хүмүүс</Link></li>
                      <li><Link href="/inspiration/stories#daily-life" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Нүүдэлчдийн амьдрал</Link></li>
                      <li><Link href="/inspiration/stories#tales" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Ам дамжсан хууч түүх</Link></li>
                    </ul>
                  </div>

                  {/* 06. TOP LISTS */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/inspiration/top-lists" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        06. TOP LISTS
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Rankings & Highlights</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/inspiration/top-lists?list=top5" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Top 5 жагсаалт</Link></li>
                      <li><Link href="/inspiration/top-lists?list=top10" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Top 10 жагсаалт</Link></li>
                      <li><Link href="/inspiration/top-lists?list=best-of-mongolia" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Best of Mongolia</Link></li>
                    </ul>
                  </div>

                  {/* 07. САНАЛ БОЛГОХ МАРШРУТУУД */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/inspiration/itineraries" onClick={closeMenu}>
                      <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                        07. САНАЛ БОЛГОХ МАРШРУТУУД
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Recommended Itineraries</span>
                    </Link>
                    <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                      <li><Link href="/inspiration/itineraries?days=3-days" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">3 өдрийн аялал</Link></li>
                      <li><Link href="/inspiration/itineraries?days=5-days" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">5 өдрийн аялал</Link></li>
                      <li><Link href="/inspiration/itineraries?days=7-days" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">7 өдрийн аялал</Link></li>
                      <li><Link href="/inspiration/itineraries?days=10-days" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">10 өдрийн аялал</Link></li>
                      <li><Link href="/inspiration/itineraries?days=14-days" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">14 өдрийн аялал</Link></li>
                      <li><Link href="/inspiration/itineraries?days=themed" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Сэдэвчилсэн маршрут</Link></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* --- 05. АЯЛЛАА ТӨЛӨВЛӨХ (6 БИЕ ДААСАН САЛАНГИД СЭДЭВ + КАРТ) --- */}
              {activeMenu === 'plan' && (
                <div className="flex flex-col xl:flex-row gap-12 items-start justify-between w-full">
                  {/* Зүүн тал: 6 бие даасан багана (3 багана x 2 эгнээгээр өргөн уужим) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 flex-1 w-full">
                    {/* 01. МОНГОЛД ИРЭХЭЭС ӨМНӨ */}
                    <div className="space-y-3">
                      <Link href="/plan/before-you-travel" onClick={closeMenu}>
                        <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                          01. МОНГОЛД ИРЭХЭЭС ӨМНӨ
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Before You Travel</span>
                      </Link>
                      <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                        <li><Link href="/plan/before-you-travel#visa" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Виз</Link></li>
                        <li><Link href="/plan/before-you-travel#when-to-visit" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хэзээ аялах вэ?</Link></li>
                        <li><Link href="/plan/before-you-travel#weather" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Цаг агаар</Link></li>
                        <li><Link href="/plan/before-you-travel#packing" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Юу авчрах вэ?</Link></li>
                        <li><Link href="/plan/before-you-travel#money" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Мөнгө, төлбөр</Link></li>
                        <li><Link href="/plan/before-you-travel#sim-internet" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">SIM / Internet</Link></li>
                        <li><Link href="/plan/before-you-travel#insurance" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Аяллын даатгал</Link></li>
                      </ul>
                    </div>

                    {/* 02. МОНГОЛД ИРЭХ */}
                    <div className="space-y-3">
                      <Link href="/plan/getting-to-mongolia" onClick={closeMenu}>
                        <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                          02. МОНГОЛД ИРЭХ
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Getting to Mongolia</span>
                      </Link>
                      <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                        <li><Link href="/plan/getting-to-mongolia#flights" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Олон улсын нислэг</Link></li>
                        <li><Link href="/plan/getting-to-mongolia#airport" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Нисэх буудал</Link></li>
                        <li><Link href="/plan/getting-to-mongolia#railway" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Төмөр зам</Link></li>
                        <li><Link href="/plan/getting-to-mongolia#borders" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хилээр нэвтрэх</Link></li>
                      </ul>
                    </div>

                    {/* 03. МОНГОЛ ДОТОР АЯЛАХ */}
                    <div className="space-y-3">
                      <Link href="/plan/getting-around" onClick={closeMenu}>
                        <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                          03. МОНГОЛ ДОТОР АЯЛАХ
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Getting Around Mongolia</span>
                      </Link>
                      <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                        <li><Link href="/plan/getting-around#car" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Автомашин</Link></li>
                        <li><Link href="/plan/getting-around#bus" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Автобус</Link></li>
                        <li><Link href="/plan/getting-around#flights" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Орон нутгийн нислэг</Link></li>
                        <li><Link href="/plan/getting-around#train" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Галт тэрэг</Link></li>
                        <li><Link href="/plan/getting-around#rental" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Машин түрээс</Link></li>
                        <li><Link href="/plan/getting-around#distance" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Зай, маршрут, хугацаа</Link></li>
                      </ul>
                    </div>

                    {/* 04. БАЙРЛАХ ГАЗАР */}
                    <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                      <Link href="/plan/accommodation" onClick={closeMenu}>
                        <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                          04. БАЙРЛАХ ГАЗАР
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Accommodation</span>
                      </Link>
                      <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                        <li><Link href="/plan/accommodation#hotels" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Зочид буудал</Link></li>
                        <li><Link href="/plan/accommodation#resorts" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Жуулчны бааз</Link></li>
                        <li><Link href="/plan/accommodation#ger-camp" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Ger camp</Link></li>
                        <li><Link href="/plan/accommodation#hostels" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Guesthouse / Hostel</Link></li>
                        <li><Link href="/plan/accommodation#nomad" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Малчин айлын байр</Link></li>
                      </ul>
                    </div>

                    {/* 05. АЯЛЛЫН ҮЙЛЧИЛГЭЭ */}
                    <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                      <Link href="/plan/services" onClick={closeMenu}>
                        <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                          05. АЯЛЛЫН ҮЙЛЧИЛГЭЭ
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Travel Services</span>
                      </Link>
                      <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                        <li><Link href="/plan/services#companies" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Аяллын компани</Link></li>
                        <li><Link href="/plan/services#guides" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Хөтөч</Link></li>
                        <li><Link href="/plan/services#drivers" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Жолооч</Link></li>
                        <li><Link href="/plan/services#local" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Орон нутгийн үйлчилгээ</Link></li>
                      </ul>
                    </div>

                    {/* 06. АЮУЛГҮЙ БАЙДАЛ, ХЭРЭГТЭЙ МЭДЭЭЛЭЛ */}
                    <div className="space-y-3 pt-4 border-t border-neutral-100 lg:border-t-0">
                      <Link href="/plan/safety-info" onClick={closeMenu}>
                        <h4 className="text-xs font-black text-[#15803d] uppercase tracking-wider hover:text-emerald-950 transition-colors">
                          06. АЮУЛГҮЙ БАЙДАЛ, МЭДЭЭЛЭЛ
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium block uppercase tracking-wider">Safety & Useful Info</span>
                      </Link>
                      <ul className="space-y-2 text-sm text-neutral-700 font-normal">
                        <li><Link href="/plan/safety-info#safety" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Safety</Link></li>
                        <li><Link href="/plan/safety-info#laws" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Орон нутгийн хууль, дүрэм</Link></li>
                        <li><Link href="/plan/safety-info#etiquette" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Аялагчийн ёс зүй</Link></li>
                        <li><Link href="/plan/safety-info#health" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Эрүүл мэндийн мэдээлэл</Link></li>
                        <li><Link href="/plan/safety-info#emergency" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">Emergency</Link></li>
                        <li><Link href="/plan/safety-info#faq" onClick={closeMenu} className="hover:text-[#15803d] block transition-colors">FAQ</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* 07. АЯЛЛЫН ИНТЕРАКТИВ ТӨЛӨВЛӨГЧ КАРТ */}
                  <div className="w-full xl:w-[320px] shrink-0 bg-[#f8f7f4] border border-neutral-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#15803d] uppercase">
                          07. ХЭРЭГСЭЛ
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="text-[10px] font-mono text-neutral-400 uppercase">C08 TOOL</span>
                      </div>
                      <h4 className="text-lg font-black text-neutral-900 mb-2 leading-snug">
                        Аяллын интерактив төлөвлөгч
                      </h4>
                      <p className="text-xs text-neutral-600 leading-relaxed font-normal mb-6">
                        Газраа сонгож, өдрөөр хуваарилан, газрын зураг дээр маршрут болон зайгаа автоматаар тооцоолон төлөвлөөрэй.
                      </p>

                      <div className="space-y-2 py-4 border-y border-neutral-200/60 mb-6 text-xs text-neutral-600 font-medium">
                        <div className="flex items-center gap-2">✓ Газар хайх & хадгалах</div>
                        <div className="flex items-center gap-2">✓ Зай, хугацааны автомат тооцоо</div>
                        <div className="flex items-center gap-2">✓ Маршрут экспортлох & хуваалцах</div>
                      </div>
                    </div>

                    <Link
                      href="/planner"
                      onClick={closeMenu}
                      className="w-full py-3 px-5 rounded-2xl bg-[#15803d] hover:bg-emerald-950 text-white text-xs font-black text-center transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Төлөвлөгч нээх</span>
                      <span>→</span>
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </header>

      {/* 5. ХАЙЛТЫН ЦОНХ (MODAL) - ШҮҮГДДЭГ СИСТЕМТЭЙ */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-28 px-4"
          onClick={() => setIsSearchOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-neutral-100 flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Толгой хэсэг */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                Сайт дотроос хайх
              </span>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center cursor-pointer text-xs"
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
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl px-5 py-3.5 text-neutral-900 placeholder-neutral-400 outline-none focus:border-[#15803d] focus:bg-white text-sm font-medium transition-all"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 font-bold cursor-pointer"
                >
                  Цэвэрлэх
                </button>
              )}
            </div>

            {/* ИЛЭРЦҮҮДИЙГ ХАРУУЛАХ ХЭСЭГ */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-2">
              {searchQuery.trim() === '' ? (
                /* 1. Юу ч бичээгүй үед гарч ирэх бэлэн товчнууд */
                <div className="py-4">
                  <span className="text-xs font-bold text-neutral-400 block mb-2 font-mono">Түгээмэл хайлтууд:</span>
                  <div className="flex flex-wrap gap-2">
                    {['Хөвсгөл', 'Виз', 'Говь', 'Машин түрээс', 'Төлөвлөгч', 'Жуулчны бааз', 'Тэрэлж'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setSearchQuery(item)}
                        className="text-xs bg-neutral-100 hover:bg-[#15803d] hover:text-white px-3 py-1.5 rounded-xl text-neutral-700 transition-colors font-medium cursor-pointer"
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
                    { id: 'visa', title: 'Визний шаардлага & E-Visa', category: 'Аяллаа төлөвлөх', desc: '60 гаруй орны визгүй зорчих журам, цахим виз мэдүүлэг.', href: '/plan/before-you-travel#visa', keys: ['виз', 'visa', 'evisa', 'паспорт'] },
                    { id: 'weather', title: 'Цаг агаарын төлөв & Саруудын температур', category: 'Аяллаа төлөвлөх', desc: 'Улирлын онцлог, сар бүрийн дундаж градус.', href: '/plan/before-you-travel#weather', keys: ['цаг агаар', 'температур', 'зун', 'өвөл', 'хавар', 'намар'] },
                    { id: 'packing', title: 'Юу авчрах вэ? (Хээрийн чеклист)', category: 'Аяллаа төлөвлөх', desc: 'Хувцаслалт, эмийн сан, шаардлагатай техникийн жагсаалт.', href: '/plan/before-you-travel#packing', keys: ['чеклист', 'юу авах', 'ачаа', 'гутал', 'куртка'] },
                    { id: 'flights', title: 'Олон улсын нислэг & Чингис Хаан буудал', category: 'Аяллаа төлөвлөх', desc: 'Шууд нислэгүүд, нисэх буудлаас хот орох тээвэр.', href: '/plan/getting-to-mongolia#flights', keys: ['нислэг', 'тийз', 'онгоц', 'буудал', 'ubn', 'миат'] },
                    { id: 'getting-around', title: 'Монгол дотор аялах (Тээвэр, Зай, Хугацаа)', category: 'Аяллаа төлөвлөх', desc: '4x4 автомашин, дотоод нислэг, галт тэрэг, зайн тооцоо.', href: '/plan/getting-around', keys: ['машин', 'жолооч', 'автобус', 'галт тэрэг', 'дотоодын нислэг', 'түрээс', 'зай'] },
                    { id: 'accommodation', title: 'Байрлах газар (Зочид буудал, Бааз, Гэр кэмп)', category: 'Аяллаа төлөвлөх', desc: 'Буудлууд, жуулчны баазуудын лавлах, шууд холбогдох холбоосууд.', href: '/plan/accommodation', keys: ['буудал', 'бааз', 'гэр кэмп', 'хостел', 'байрлах'] },
                    { id: 'services', title: 'Аяллын үйлчилгээ (Компани, Хөтөч, Жолооч)', category: 'Аяллаа төлөвлөх', desc: 'Албан ёсны тур операторууд, хөтөч, орон нутгийн үйлчилгээ.', href: '/plan/services', keys: ['компани', 'хөтөч', 'жолооч', 'тур', 'оператор'] },
                    { id: 'safety', title: 'Аюулгүй байдал & Emergency лавлах', category: 'Аяллаа төлөвлөх', desc: 'Шуурхай дуудлагын утас, дүрэм журам, соёлын ёс зүй.', href: '/plan/safety-info', keys: ['аюулгүй', 'утас', 'түргэн', 'цагдаа', 'дүрэм', 'ёс зүй', 'faq'] },
                    { id: 'planner', title: 'Аяллын интерактив төлөвлөгч хэрэгсэл', category: 'Интерактив систем', desc: 'Газраа сонгож өдрөөр хуваарилан газрын зураг дээр төлөвлөх систем.', href: '/planner', keys: ['төлөвлөгч', 'маршрут', 'өдрөөр', 'planner'] },
                    { id: 'khuvsgul', title: 'Хөвсгөл нуур (Далай ээж)', category: 'Зорих газар', desc: 'Хамгийн гүн цэнгэг нуур, Хатгал, тайгын байгаль.', href: '/destination/landscapes?section=mountains-lakes-rivers', keys: ['хөвсгөл', 'нуурын эрэг', 'хатгал', 'хөх сувд'] },
                    { id: 'terelj', title: 'Горхи-Тэрэлжийн БЦГ', category: 'Зорих газар', desc: 'УБ-аас 60 км, хад цохио, амралтын баазууд.', href: '/destination/protected#national-parks', keys: ['тэрэлж', 'мэлхий хад', 'ариябал'] },
                    { id: 'gobi', title: 'Хонгорын элс & Говийн бүс', category: 'Зорих газар', desc: 'Үлэг гүрвэлийн өлгий Баянзаг, дуут манхан, Ёлын ам.', href: '/destination/landscapes?section=gobi-dunes', keys: ['говь', 'хонгорын элс', 'баянзаг', 'ёлын ам'] },
                  ].filter(item => 
                    item.title.toLowerCase().includes(q) ||
                    item.desc.toLowerCase().includes(q) ||
                    item.category.toLowerCase().includes(q) ||
                    item.keys.some(k => k.includes(q))
                  );

                  if (results.length === 0) {
                    return (
                      <div className="py-12 text-center text-neutral-400 text-xs">
                        <span className="text-2xl block mb-2">🔍</span>
                        "{searchQuery}" гэсэн түлхүүр үгээр илэрц олдсонгүй. Өөр үгээр хайж үзнэ үү.
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
                      className="block p-3.5 rounded-2xl bg-neutral-50 hover:bg-emerald-50/60 border border-neutral-100 hover:border-emerald-200 transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-neutral-900 group-hover:text-[#15803d] transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-neutral-200/60 group-hover:bg-emerald-100 group-hover:text-[#15803d] px-2 py-0.5 rounded text-neutral-600 transition-colors">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-1 group-hover:text-neutral-700">
                        {item.desc}
                      </p>
                    </Link>
                  ));
                })()
              )}
            </div>

            {/* Доод хөл хэсэг */}
            <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
              <span>Хайх үгээ бичихэд шууд шүүгдэнэ</span>
              <span>Дарж хуудас руу үсрэнэ</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
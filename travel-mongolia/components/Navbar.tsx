'use client';

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';

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
  };

  const currentLang =
    LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

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
        <div className="flex justify-between items-center px-6 mx-auto max-w-7xl h-20 sm:px-10">
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

          {/* 2. 5 ҮНДСЭН ТОЛГОЙ ЦЭС */}
          <nav className="hidden gap-5 items-center h-full xl:flex">
            {/* 01. МОНГОЛЫН ТУХАЙ */}
            <div
              className="flex items-center h-full"
              onMouseEnter={() => handleMouseEnter('about')}
            >
              <button
                onClick={() =>
                  setActiveMenu(activeMenu === 'about' ? null : 'about')
                }
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'about'
                    ? 'text-[#15803d]'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Монголын тухай</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'about'
                      ? 'rotate-180 text-[#15803d]'
                      : 'text-gray-400'
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

            {/* 02. ЗОРИХ ГАЗРУУД */}
            <div
              className="flex items-center h-full"
              onMouseEnter={() => handleMouseEnter('destinations')}
            >
              <button
                onClick={() =>
                  setActiveMenu(
                    activeMenu === 'destinations' ? null : 'destinations'
                  )
                }
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'destinations'
                    ? 'text-[#15803d]'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Зорих газрууд</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'destinations'
                      ? 'rotate-180 text-[#15803d]'
                      : 'text-gray-400'
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

            {/* 03. ҮЗЭХ, ХИЙХ ЗҮЙЛС */}
            <div
              className="flex items-center h-full"
              onMouseEnter={() => handleMouseEnter('things-to-do')}
            >
              <button
                onClick={() =>
                  setActiveMenu(
                    activeMenu === 'things-to-do' ? null : 'things-to-do'
                  )
                }
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'things-to-do'
                    ? 'text-[#15803d]'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Үзэх, хийх зүйлс</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'things-to-do'
                      ? 'rotate-180 text-[#15803d]'
                      : 'text-gray-400'
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

            {/* 04. АЯЛАХ СЭДЭЛ */}
            <div
              className="flex items-center h-full"
              onMouseEnter={() => handleMouseEnter('inspiration')}
            >
              <button
                onClick={() =>
                  setActiveMenu(
                    activeMenu === 'inspiration' ? null : 'inspiration'
                  )
                }
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'inspiration'
                    ? 'text-[#15803d]'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Аялах сэдэл</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'inspiration'
                      ? 'rotate-180 text-[#15803d]'
                      : 'text-gray-400'
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

            {/* 05. АЯЛЛАА ТӨЛӨВЛӨХ */}
            <div
              className="flex items-center h-full"
              onMouseEnter={() => handleMouseEnter('plan')}
            >
              <button
                onClick={() =>
                  setActiveMenu(activeMenu === 'plan' ? null : 'plan')
                }
                className={`text-sm font-semibold tracking-wide transition-colors flex items-center gap-1.5 py-2 cursor-pointer ${
                  activeMenu === 'plan'
                    ? 'text-[#15803d]'
                    : 'text-gray-700 hover:text-black'
                }`}
              >
                <span>Аяллаа төлөвлөх</span>
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    activeMenu === 'plan'
                      ? 'rotate-180 text-[#15803d]'
                      : 'text-gray-400'
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
          </nav>

          {/* 3. БАРУУН ТАЛ: ХАЙЛТ & ОЛОН ХЭЛ СОНГОГЧ */}
          <div className="flex gap-4 items-center">
            {/* ХАЙХ ТОВЧ */}
            <button
              onClick={() => setIsSearchOpen(true)}
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
              <span className="hidden sm:inline">Хайх</span>
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
                <span>{currentLang.name}</span>
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
          </div>
        </div>

        {/* 4. ДООШОО ДЭЛГЭГДДЭГ MEGA MENU ХЭСЭГ */}
        {activeMenu && (
          <div
            className="bg-white border-t border-gray-100 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2"
            onMouseEnter={() => {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeave}
          >
            <div className="py-10 px-6 mx-auto max-w-7xl sm:px-10 lg:px-16">
              {/* --- 01. МОНГОЛЫН ТУХАЙ ДЭЛГЭГДДЭГ ЦЭС --- */}
              {activeMenu === 'about' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {/* 1-Р БАГАНА */}
                  <div className="space-y-8 pr-6 border-r border-gray-100">
                    {/* 01. Монгол орныг товчхон */}
                    <div className="space-y-3">
                      <Link href="/about/at-a-glance" onClick={closeMenu} className="block group">
  <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors group-hover:underline">
    01. МОНГОЛ ОРНЫГ ТОВЧХОН
  </h4>
  <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
    Mongolia at a Glance
  </span>
</Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/at-a-glance#overview" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Монгол Улсын тухай үндсэн мэдээлэл</Link></li>
                        <li><Link href="/about/at-a-glance#population" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Хүн ам, нийслэл</Link></li>
                        <li><Link href="/about/at-a-glance#geography" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Газар нутаг</Link></li>
                        <li><Link href="/about/at-a-glance#symbols" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Төрийн болон үндэсний бэлгэдэл</Link></li>
                        <li><Link href="/about/at-a-glance#facts" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Монгол орны онцлог тоо, баримтууд</Link></li>
                      </ul>
                    </div>

                    {/* 02. Монголын түүх */}
                    <div className="space-y-3">
                      <Link href="/about/history" onClick={closeMenu} className="block group">
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] group-hover:underline uppercase">
                          02. МОНГОЛЫН ТҮҮХ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          History of Mongolia
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/history#topic-ancient" onClick={closeMenu} className="block hover:text-[#15803d]">Эртний Монгол нутаг</Link></li>
                        <li><Link href="/about/history#topic-hunnu" onClick={closeMenu} className="block hover:text-[#15803d]">Хүннү ба эртний улсууд</Link></li>
                        <li><Link href="/about/history#topic-great-mongol" onClick={closeMenu} className="block hover:text-[#15803d]">Их Монгол Улс</Link></li>
                        <li><Link href="/about/history#topic-empire" onClick={closeMenu} className="block hover:text-[#15803d]">Монголын эзэнт гүрэн</Link></li>
                        <li><Link href="/about/history#topic-17-19th-century" onClick={closeMenu} className="block hover:text-[#15803d]">XVII–XIX зуун</Link></li>
                        <li><Link href="/about/history#topic-20th-century" onClick={closeMenu} className="block hover:text-[#15803d]">XX зууны Монгол</Link></li>
                        <li><Link href="/about/history#topic-modern" onClick={closeMenu} className="block hover:text-[#15803d]">Орчин үеийн Монгол Улс</Link></li>
                      </ul>
                    </div>

                    {/* 03. Монгол хүн, хэл */}
                    <div className="space-y-3">
                      <Link href="/about/people" onClick={closeMenu} className="block group">
  <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors group-hover:underline">
    03. МОНГОЛ ХҮН, ХЭЛ, ҮНДЭСТНИЙ ОНЦЛОГ
  </h4>
  <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
    People, Language & Identity
  </span>
</Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/identity#topic-mongolians" onClick={closeMenu} className="block hover:text-[#15803d]">Монголчууд</Link></li>
                        <li><Link href="/about/identity#topic-ethnic-groups" onClick={closeMenu} className="block hover:text-[#15803d]">Угсаатны бүлгүүд</Link></li>
                        <li><Link href="/about/identity#topic-language" onClick={closeMenu} className="block hover:text-[#15803d]">Монгол хэл</Link></li>
                        <li><Link href="/about/identity#topic-script" onClick={closeMenu} className="block hover:text-[#15803d]">Монгол бичиг</Link></li>
                        <li><Link href="/about/identity#topic-names" onClick={closeMenu} className="block hover:text-[#15803d]">Нэр, овог</Link></li>
                        <li><Link href="/about/identity#topic-hospitality" onClick={closeMenu} className="block hover:text-[#15803d]">Зочломтгой зан</Link></li>
                        <li><Link href="/about/identity#topic-lifestyle" onClick={closeMenu} className="block hover:text-[#15803d]">Монгол хүний амьдралын хэв маяг</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* 2-Р БАГАНА */}
                  <div className="space-y-8 pr-6 border-r border-gray-100">
                    {/* 04. Нүүдэлчин ахуй */}
                    <div className="space-y-3">
                      <Link href="/about/nomadic-life" onClick={closeMenu} className="block group">
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] group-hover:underline uppercase">
                          04. НҮҮДЭЛЧИН АХУЙ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Nomadic Life
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/nomadic-life#topic-culture" onClick={closeMenu} className="block hover:text-[#15803d]">Нүүдлийн соёл</Link></li>
                        <li><Link href="/about/nomadic-life#topic-livestock" onClick={closeMenu} className="block hover:text-[#15803d]">Таван хошуу мал</Link></li>
                        <li><Link href="/about/nomadic-life#topic-migration" onClick={closeMenu} className="block hover:text-[#15803d]">Улирлын нүүдэл</Link></li>
                        <li><Link href="/about/nomadic-life#topic-ger" onClick={closeMenu} className="block hover:text-[#15803d]">Монгол гэр</Link></li>
                        <li><Link href="/about/nomadic-life#topic-horse" onClick={closeMenu} className="block hover:text-[#15803d]">Морь, адууны соёл</Link></li>
                        <li><Link href="/about/nomadic-life#topic-herder-household" onClick={closeMenu} className="block hover:text-[#15803d]">Малчин өрхийн амьдрал</Link></li>
                        <li><Link href="/about/nomadic-life#topic-nature-harmony" onClick={closeMenu} className="block hover:text-[#15803d]">Байгальтай зохицон амьдрах ухаан</Link></li>
                      </ul>
                    </div>

                    {/* 05. Ёс заншил */}
                    <div className="space-y-3">
                      <Link href="/about/traditions" onClick={closeMenu} className="block group">
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] group-hover:underline uppercase">
                          05. ЁС ЗАНШИЛ, УЛАМЖЛАЛ, ШҮТЛЭГ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Traditions, Customs & Beliefs
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/traditions#topic-birth-naming" onClick={closeMenu} className="block hover:text-[#15803d]">Төрөх, нэр өгөх ёс</Link></li>
                        <li><Link href="/about/traditions#topic-wedding" onClick={closeMenu} className="block hover:text-[#15803d]">Хуримын ёс</Link></li>
                        <li><Link href="/about/traditions#topic-hospitality" onClick={closeMenu} className="block hover:text-[#15803d]">Зочлох, дайлах ёс</Link></li>
                        <li><Link href="/about/traditions#topic-tsagaan-sar" onClick={closeMenu} className="block hover:text-[#15803d]">Цагаан сар</Link></li>
                        <li><Link href="/about/traditions#topic-naadam" onClick={closeMenu} className="block hover:text-[#15803d]">Наадам</Link></li>
                        <li><Link href="/about/traditions#topic-shamanism" onClick={closeMenu} className="block hover:text-[#15803d]">Бөө мөргөл</Link></li>
                        <li><Link href="/about/traditions#topic-buddhism" onClick={closeMenu} className="block hover:text-[#15803d]">Буддын шашин</Link></li>
                        <li><Link href="/about/traditions#topic-folklore" onClick={closeMenu} className="block hover:text-[#15803d]">Ардын шүтлэг, домог</Link></li>
                        <li><Link href="/about/traditions#topic-festivals" onClick={closeMenu} className="block hover:text-[#15803d]">Уламжлалт баяр, зан үйл</Link></li>
                      </ul>
                    </div>

                    {/* 06. Соёл ба өв */}
                    <div className="space-y-3">
                      <Link href="/about/culture" onClick={closeMenu} className="block group">
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] group-hover:underline uppercase">
                          06. СОЁЛ БА ӨВ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Culture & Heritage
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/culture#topic-unesco" onClick={closeMenu} className="block hover:text-[#15803d]">UNESCO өв</Link></li>
                        <li><Link href="/about/culture#topic-archaeology" onClick={closeMenu} className="block hover:text-[#15803d]">Археологийн өв</Link></li>
                        <li><Link href="/about/culture#topic-monuments" onClick={closeMenu} className="block hover:text-[#15803d]">Түүх, соёлын дурсгал</Link></li>
                        <li><Link href="/about/culture#topic-music" onClick={closeMenu} className="block hover:text-[#15803d]">Монгол хөгжим</Link></li>
                        <li><Link href="/about/culture#topic-performing-arts" onClick={closeMenu} className="block hover:text-[#15803d]">Бүжиг, тайзны урлаг</Link></li>
                        <li><Link href="/about/culture#topic-literature" onClick={closeMenu} className="block hover:text-[#15803d]">Уран зохиол</Link></li>
                        <li><Link href="/about/culture#topic-fine-arts" onClick={closeMenu} className="block hover:text-[#15803d]">Дүрслэх урлаг</Link></li>
                        <li><Link href="/about/culture#topic-crafts" onClick={closeMenu} className="block hover:text-[#15803d]">Гар урлал</Link></li>
                        <li><Link href="/about/culture#topic-costumes" onClick={closeMenu} className="block hover:text-[#15803d]">Үндэсний хувцас</Link></li>
                        <li><Link href="/about/culture#topic-architecture" onClick={closeMenu} className="block hover:text-[#15803d]">Архитектур</Link></li>
                      </ul>
                    </div>
                  </div>

                  {/* 3-Р БАГАНА */}
                  <div className="space-y-8">
                    {/* 07. Монгол хоол, ундаа */}
                    <div className="space-y-3">
                      <Link href="/about/food" onClick={closeMenu} className="block group">
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] group-hover:underline uppercase">
                          07. МОНГОЛ ХООЛ, УНДАА
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Mongolian Food & Drink
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/food#topic-culture" onClick={closeMenu} className="block hover:text-[#15803d]">Монгол хоолны соёл</Link></li>
                        <li><Link href="/about/food#topic-meat" onClick={closeMenu} className="block hover:text-[#15803d]">Махан хоол</Link></li>
                        <li><Link href="/about/food#topic-dairy" onClick={closeMenu} className="block hover:text-[#15803d]">Цагаан идээ</Link></li>
                        <li><Link href="/about/food#topic-pastry" onClick={closeMenu} className="block hover:text-[#15803d]">Гурилан хоол</Link></li>
                        <li><Link href="/about/food#topic-airag" onClick={closeMenu} className="block hover:text-[#15803d]">Айраг</Link></li>
                        <li><Link href="/about/food#topic-tea" onClick={closeMenu} className="block hover:text-[#15803d]">Монгол цай</Link></li>
                        <li><Link href="/about/food#topic-regional" onClick={closeMenu} className="block hover:text-[#15803d]">Бүс нутгийн хоол</Link></li>
                        <li><Link href="/about/food#topic-processing" onClick={closeMenu} className="block hover:text-[#15803d]">Уламжлалт хүнс боловсруулах арга</Link></li>
                      </ul>
                    </div>

                    {/* 08. Байгаль, газарзүй */}
                    <div className="space-y-3">
                      <Link href="/about/nature" onClick={closeMenu} className="block group">
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] group-hover:underline uppercase">
                          08. БАЙГАЛЬ, ГАЗАРЗҮЙ, АМЬТАН
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Nature, Geography & Wildlife
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/nature#topic-geography" onClick={closeMenu} className="block hover:text-[#15803d]">Монгол орны газарзүй</Link></li>
                        <li><Link href="/about/nature#topic-climate" onClick={closeMenu} className="block hover:text-[#15803d]">Уур амьсгал</Link></li>
                        <li><Link href="/about/nature#topic-gobi" onClick={closeMenu} className="block hover:text-[#15803d]">Говь</Link></li>
                        <li><Link href="/about/nature#topic-steppe" onClick={closeMenu} className="block hover:text-[#15803d]">Тал хээр</Link></li>
                        <li><Link href="/about/nature#topic-mountains" onClick={closeMenu} className="block hover:text-[#15803d]">Уулс</Link></li>
                        <li><Link href="/about/nature#topic-taiga" onClick={closeMenu} className="block hover:text-[#15803d]">Ой, тайга</Link></li>
                        <li><Link href="/about/nature#topic-rivers-lakes" onClick={closeMenu} className="block hover:text-[#15803d]">Гол, нуур</Link></li>
                        <li><Link href="/about/nature#topic-flora" onClick={closeMenu} className="block hover:text-[#15803d]">Ургамлын аймаг</Link></li>
                        <li><Link href="/about/nature#topic-wildlife" onClick={closeMenu} className="block hover:text-[#15803d]">Зэрлэг амьтад</Link></li>
                        <li><Link href="/about/nature#topic-geology" onClick={closeMenu} className="block hover:text-[#15803d]">Геологи</Link></li>
                        <li><Link href="/about/nature#topic-paleontology" onClick={closeMenu} className="block hover:text-[#15803d]">Палеонтологи, үлэг гүрвэл</Link></li>
                      </ul>
                    </div>

                    {/* 09. Өнөөгийн Монгол */}
                    <div className="space-y-3">
                      <Link href="/about/modern" onClick={closeMenu} className="block group">
  <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors group-hover:underline">
    09. ӨНӨӨГИЙН МОНГОЛ
  </h4>
  <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
    Mongolia Today
  </span>
</Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/about/today#topic-lifestyle" onClick={closeMenu} className="block hover:text-[#15803d]">Орчин үеийн Монголын амьдрал</Link></li>
                        <li><Link href="/about/today#topic-urban-rural" onClick={closeMenu} className="block hover:text-[#15803d]">Хот ба хөдөөгийн амьдрал</Link></li>
                        <li><Link href="/about/today#topic-creative-arts" onClick={closeMenu} className="block hover:text-[#15803d]">Орчин үеийн урлаг, бүтээлч салбар</Link></li>
                        <li><Link href="/about/today#topic-sports" onClick={closeMenu} className="block hover:text-[#15803d]">Спорт</Link></li>
                        <li><Link href="/about/today#topic-music" onClick={closeMenu} className="block hover:text-[#15803d]">Хөгжим</Link></li>
                        <li><Link href="/about/today#topic-youth-culture" onClick={closeMenu} className="block hover:text-[#15803d]">Залуусын соёл</Link></li>
                        <li><Link href="/about/today#topic-modern-heritage" onClick={closeMenu} className="block hover:text-[#15803d]">Уламжлал ба орчин үе</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* --- 02. ЗОРИХ ГАЗРУУД --- */}
              {activeMenu === 'destinations' && (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-5">
                  {/* БАГАНА 1 */}
                  <div className="space-y-6 pr-6 border-r border-gray-100">
                    <div className="space-y-3">
                      <Link href="/destination/regions" onClick={closeMenu}>
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          01. АЯЛЛЫН БҮСЭЭР
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Travel Regions
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/destination/region/central" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Төв Монгол</Link></li>
                        <li><Link href="/destination/region/khangai" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Хангайн бүс</Link></li>
                        <li><Link href="/destination/region/khovsgol-north" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Хөвсгөл ба Хойд Монгол</Link></li>
                        <li><Link href="/destination/region/altai-west" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Алтай ба Баруун Монгол</Link></li>
                        <li><Link href="/destination/region/gobi" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Говийн бүс</Link></li>
                        <li><Link href="/destination/region/east" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Зүүн Монгол</Link></li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-100 space-y-3">
                      <Link href="/destination/province" onClick={closeMenu}>
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          02. АЙМАГ, ХОТООР
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Provinces & City
                        </span>
                      </Link>
                      <Link
                        href="/destination/province"
                        onClick={closeMenu}
                        className="block text-sm font-bold text-gray-900 hover:text-[#15803d] transition-colors"
                      >
                        21 аймаг + Улаанбаатар →
                      </Link>
                    </div>
                  </div>

                  {/* БАГАНА 2 */}
                  <div className="space-y-3">
                    <Link href="/destination/strictly-protected" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        03. ТУСГАЙ ХАМГААЛАЛТТАЙ ГАЗРААР
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Protected Areas
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li><Link href="/destination/strictly-protected?type=spa" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Дархан цаазат газар</Link></li>
                      <li><Link href="/destination/strictly-protected?type=np" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Байгалийн цогцолборт газар</Link></li>
                      <li><Link href="/destination/strictly-protected?type=nr" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Байгалийн нөөц газар</Link></li>
                      <li><Link href="/destination/strictly-protected?type=nm" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Байгалийн дурсгалт газар</Link></li>
                    </ul>
                  </div>

                  {/* БАГАНА 3 */}
                  <div className="space-y-3 pr-6 border-r border-gray-100">
                    <Link href="/destination/landscapes" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        04. БАЙГАЛИЙН ТОГТОЦ, ЛАНДШАФТААР
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Natural Landscapes
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li><Link href="/destination/landscapes?type=mountains-rivers" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Уул, нуур, гол мөрөн</Link></li>
                      <li><Link href="/destination/landscapes?type=gobi-dunes" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Говь, элсэн манхан</Link></li>
                      <li><Link href="/destination/landscapes?type=valleys-forests" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Хавцал, хөндий, ой, тайга</Link></li>
                      <li><Link href="/destination/landscapes?type=glaciers-caves" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Мөсөн гол, агуй, геологийн тогтоц</Link></li>
                    </ul>
                  </div>

                  {/* БАГАНА 4 */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Link href="/destination/routes" onClick={closeMenu}>
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          05. АЯЛЛЫН МАРШРУТ, ЗАМААР
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Travel Routes & Itineraries
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li><Link href="/destination/routes?route=gobi" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Говийн тойрог</Link></li>
                        <li><Link href="/destination/routes?route=orkhon" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Орхоны хөндийн маршрут</Link></li>
                        <li><Link href="/destination/routes?route=khovsgol" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Хөвсгөлийн маршрут</Link></li>
                        <li><Link href="/destination/routes?route=altai" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Алтайн маршрут</Link></li>
                        <li><Link href="/destination/routes?route=east" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Зүүн Монголын маршрут</Link></li>
                        <li><Link href="/destination/routes?route=ub-short" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Улаанбаатараас гарах богино замууд</Link></li>
                      </ul>
                    </div>

                    {/* Газрын зураг баннер */}
                    <div className="p-4 bg-neutral-50 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-gray-900">
                        ГАЗРЫН ЗУРГААС ХАЙХ (C07)
                      </h5>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        Бүх газар, ТХГН, өв газруудыг интерактив газрын зураг дээр шүүж харах.
                      </p>
                      <Link
                        href="/destination/map"
                        onClick={closeMenu}
                        className="inline-flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-white bg-black rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        Газрын зураг нээх →
                      </Link>
                    </div>
                  </div>

                  {/* БАГАНА 5 */}
                  <div className="space-y-3">
                    <Link href="/destination/heritage" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        06. ТҮҮХ, СОЁЛЫН ГАЗРУУДААР
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Historical & Cultural Sites
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li><Link href="/destination/heritage?type=unesco" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">UNESCO Дэлхийн өв</Link></li>
                      <li><Link href="/destination/heritage?type=archaeology" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Археологийн дурсгал</Link></li>
                      <li><Link href="/destination/heritage?type=monasteries" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Хийд ба сүмүүд</Link></li>
                      <li><Link href="/destination/heritage?type=ancient-cities" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Түүхэн хот, суурингийн туурь</Link></li>
                      <li><Link href="/destination/heritage?type=petroglyphs" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Хадны зураг, бичээс</Link></li>
                      <li><Link href="/destination/heritage?type=monuments" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Хөшөө дурсгал, хүн чулуу</Link></li>
                      <li><Link href="/destination/heritage?type=nomadic-culture" onClick={closeMenu} className="block hover:text-[#15803d] transition-colors">Нүүдэлчдийн соёлын бүс</Link></li>
                    </ul>
                  </div>
                </div>
              )}

              {/* --- 03. ҮЗЭХ, ХИЙХ ЗҮЙЛС (8 БИЕ ДААСАН САЛАНГИД СЭДЭВ - 2 ЭГНЭЭГЭЭР) --- */}
              {activeMenu === 'things-to-do' && (
                <div className="grid grid-cols-1 gap-x-12 gap-y-10 w-full md:grid-cols-2 lg:grid-cols-4">
                  {/* 01. БАЙГАЛЬД АЯЛАХ */}
                  <div className="space-y-3">
                    <Link href="/things-to-do/nature" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        01. БАЙГАЛЬД АЯЛАХ
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Nature & Outdoors
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=scenic"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Байгалийн үзэсгэлэнт газрууд
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=mountains"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Уул, хөндий
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=lakes"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Нуур, гол
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=gobi"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Говь, элсэн манхан
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=forest"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Ой, тайга
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=protected"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Тусгай хамгаалалттай газар
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=camping"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Кемпинг
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=photo"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Байгалийн гэрэл зураг
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nature?cat=stargazing"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Од харах / Stargazing
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 02. АДАЛ ЯВДАЛ, ИДЭВХТЭЙ АЯЛАЛ */}
                  <div className="space-y-3">
                    <Link href="/things-to-do/adventure" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        02. АДАЛ ЯВДАЛ, ИДЭВХТЭЙ АЯЛАЛ
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Adventure & Active
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=hiking"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Явган аялал / Hiking
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=trekking"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Trekking
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=climbing"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Ууланд авиралт
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=horse"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Морин аялал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=camel"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Тэмээн аялал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=biking"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Дугуйн аялал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=kayaking"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Kayaking / Rafting
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=offroad"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          4×4 / Off-road
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=winter"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Цана, snowboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/adventure?cat=other"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Бусад адал явдалт үйл ажиллагаа
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 03. НҮҮДЭЛЧИН АХУЙГ МЭДРЭХ */}
                  <div className="space-y-3">
                    <Link href="/things-to-do/nomadic" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        03. НҮҮДЭЛЧИН АХУЙГ МЭДРЭХ
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Nomadic & Local Experiences
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=visit-herder"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Малчин айлд зочлох
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=ger-stay"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Гэрт байрлах
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=herding"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Мал маллагаанд оролцох
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=riding"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Морь унах
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=milking"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Сааль саах
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=dairy"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Цагаан идээ боловсруулах
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=airag"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Айраг исгэх
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=migration"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Нүүдэл дагах
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/nomadic?cat=local"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Орон нутгийн иргэдтэй хийх туршлага
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 04. ТҮҮХ, СОЁЛ, ӨВ */}
                  <div className="space-y-3">
                    <Link href="/things-to-do/culture" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        04. ТҮҮХ, СОЁЛ, ӨВ
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        History, Culture & Heritage
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=historical"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Түүхэн дурсгалт газар
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=archaeology"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Археологийн газар
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=monasteries"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Хийд, сүм
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=museums"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Музей
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=unesco"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          UNESCO өв
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=arts"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Монгол урлаг
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=dance"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Хөгжим, бүжиг
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=crafts"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Гар урлал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=costume"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Үндэсний хувцас
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/culture?cat=workshops"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Соёлын туршлага, сургалт
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 05. ЗЭРЛЭГ АМЬТАН, ШУВУУ АЖИГЛАХ */}
                  <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/things-to-do/wildlife" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        05. ЗЭРЛЭГ АМЬТАН, ШУВУУ АЖИГЛАХ
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Wildlife & Birdwatching
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/things-to-do/wildlife?cat=snow-leopard"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Цоохор ирвэс
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wildlife?cat=argali"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Аргаль, янгир
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wildlife?cat=takhi"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Тахь, хулан
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wildlife?cat=havtgai"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Хавтгай
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wildlife?cat=mazaalai"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Мазаалай
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wildlife?cat=saiga"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Бөхөн
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wildlife?cat=birds"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Шувуу ажиглах
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wildlife?cat=photo"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Зэрлэг амьтны гэрэл зураг
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 06. ХООЛ, УНДААНЫ ТУРШЛАГА */}
                  <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/things-to-do/food" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        06. ХООЛ, УНДААНЫ ТУРШЛАГА
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Food & Drink
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/things-to-do/food?cat=dishes"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Монгол үндэсний хоол
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/food?cat=dairy"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Цагаан идээ
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/food?cat=airag"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Айраг
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/food?cat=tea"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Монгол цай
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/food?cat=local"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Орон нутгийн хоол
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/food?cat=cooking"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Хоол хийх туршлага
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/food?cat=tours"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Амталгаа, хоолны аялал
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 07. БАЯР НААДАМ, АРГА ХЭМЖЭЭ */}
                  <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/things-to-do/events" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        07. БАЯР НААДАМ, АРГА ХЭМЖЭЭ
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Festivals & Events
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/things-to-do/events?cat=naadam"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Үндэсний их баяр наадам
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/events?cat=tsagaan-sar"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Цагаан сар
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/events?cat=eagle"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Бүргэдийн баяр
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/events?cat=camel"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Тэмээний баяр
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/events?cat=ice"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Мөсний баяр
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/events?cat=local"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Орон нутгийн наадам
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/events?cat=festivals"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Соёл, урлагийн фестиваль
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/events?cat=sports"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Спортын арга хэмжээ
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/events?cat=calendar"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Арга хэмжээний календарь
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 08. АМРАЛТ, БЯСАЛГАЛ, СҮНСЛЭГ ТУРШЛАГА */}
                  <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/things-to-do/wellness" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        08. АМРАЛТ, БЯСАЛГАЛ
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Wellness & Retreats
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/things-to-do/wellness?cat=meditation"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Бясалгал & Иог
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wellness?cat=springs"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Рашаан, сувиллын амралт
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wellness?cat=retreat"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Wellness retreat
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wellness?cat=buddhist"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Буддын шашны туршлага
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wellness?cat=shaman"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Бөө мөргөлийн соёлтой танилцах
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wellness?cat=sacred"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Ариун, тахилгат газрууд
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wellness?cat=detox"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Digital detox
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/things-to-do/wellness?cat=nature-rest"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Байгальд төвлөрсөн амралт
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* --- 04. АЯЛАХ СЭДЭЛ (7 БИЕ ДААСАН САЛАНГИД СЭДЭВ - 2 ЭГНЭЭГЭЭР) --- */}
              {(activeMenu === 'travel-themes' ||
                activeMenu === 'inspiration' ||
                activeMenu === 'stories') && (
                <div className="grid grid-cols-1 gap-x-12 gap-y-10 w-full md:grid-cols-2 lg:grid-cols-4">
                  {/* 01. MONGOLIA MAGAZINE */}
                  <div className="space-y-3">
                    <Link href="/inspiration/magazine" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        01. MONGOLIA MAGAZINE
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Editorial & Stories
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/inspiration/magazine#featured"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Онцлох нийтлэл
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/magazine#latest"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Шинэ нийтлэл
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/magazine#editors-pick"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Редакторын сонголт
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/magazine#popular"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Хамгийн их уншсан
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 02. УЛИРЛААР */}
                  <div className="space-y-3">
                    <Link href="/inspiration/seasons" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        02. УЛИРЛААР
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Explore by Season
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/inspiration/seasons?season=spring"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Хавар
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/seasons?season=summer"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Зун
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/seasons?season=autumn"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Намар
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/seasons?season=winter"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Өвөл
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 03. АЯЛЛЫН ХЭВ МАЯГААР */}
                  <div className="space-y-3">
                    <Link href="/inspiration/styles" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        03. АЯЛЛЫН ХЭВ МАЯГААР
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Travel Styles
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/inspiration/styles?style=adventure"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Adventure
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/styles?style=culture"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Culture
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/styles?style=family"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Family
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/styles?style=luxury"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Luxury
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/styles?style=slow-travel"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Slow Travel
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/styles?style=photography"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Photography
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/styles?style=sustainable"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Sustainable Travel
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 04. HIDDEN MONGOLIA */}
                  <div className="space-y-3">
                    <Link href="/inspiration/hidden" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        04. HIDDEN MONGOLIA
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Uncharted Places
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/inspiration/hidden"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Олны танил биш газрууд
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/hidden#stories"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Нууцлаг түүхүүд
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 05. LOCAL STORIES */}
                  <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/inspiration/stories" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        05. LOCAL STORIES
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        People & Life
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/inspiration/stories"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Орон нутгийн хүмүүс
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/stories#daily-life"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Нүүдэлчдийн амьдрал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/stories#tales"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Ам дамжсан хууч түүх
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 06. TOP LISTS */}
                  <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/inspiration/top-lists" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        06. TOP LISTS
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Rankings & Highlights
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/inspiration/top-lists?list=top5"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Top 5 жагсаалт
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/top-lists?list=top10"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Top 10 жагсаалт
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/top-lists?list=best-of-mongolia"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Best of Mongolia
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {/* 07. САНАЛ БОЛГОХ МАРШРУТУУД */}
                  <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                    <Link href="/inspiration/itineraries" onClick={closeMenu}>
                      <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                        07. САНАЛ БОЛГОХ МАРШРУТУУД
                      </h4>
                      <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                        Recommended Itineraries
                      </span>
                    </Link>
                    <ul className="space-y-2 text-sm font-normal text-neutral-700">
                      <li>
                        <Link
                          href="/inspiration/itineraries?days=3-days"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          3 өдрийн аялал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/itineraries?days=5-days"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          5 өдрийн аялал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/itineraries?days=7-days"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          7 өдрийн аялал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/itineraries?days=10-days"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          10 өдрийн аялал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/itineraries?days=14-days"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          14 өдрийн аялал
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/inspiration/itineraries?days=themed"
                          onClick={closeMenu}
                          className="block hover:text-[#15803d] transition-colors"
                        >
                          Сэдэвчилсэн маршрут
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* --- 05. АЯЛЛАА ТӨЛӨВЛӨХ (6 БИЕ ДААСАН САЛАНГИД СЭДЭВ + КАРТ) --- */}
              {activeMenu === 'plan' && (
                <div className="flex flex-col gap-12 justify-between items-start w-full xl:flex-row">
                  {/* Зүүн тал: 6 бие даасан багана (3 багана x 2 эгнээгээр өргөн уужим) */}
                  <div className="grid flex-1 grid-cols-1 gap-x-12 gap-y-10 w-full md:grid-cols-2 lg:grid-cols-3">
                    {/* 01. МОНГОЛД ИРЭХЭЭС ӨМНӨ */}
                    <div className="space-y-3">
                      <Link href="/plan/before-you-travel" onClick={closeMenu}>
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          01. МОНГОЛД ИРЭХЭЭС ӨМНӨ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Before You Travel
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li>
                          <Link
                            href="/plan/before-you-travel#visa"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Виз
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/before-you-travel#when-to-visit"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Хэзээ аялах вэ?
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/before-you-travel#weather"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Цаг агаар
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/before-you-travel#packing"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Юу авчрах вэ?
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/before-you-travel#money"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Мөнгө, төлбөр
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/before-you-travel#sim-internet"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            SIM / Internet
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/before-you-travel#insurance"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Аяллын даатгал
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* 02. МОНГОЛД ИРЭХ */}
                    <div className="space-y-3">
                      <Link
                        href="/plan/getting-to-mongolia"
                        onClick={closeMenu}
                      >
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          02. МОНГОЛД ИРЭХ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Getting to Mongolia
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li>
                          <Link
                            href="/plan/getting-to-mongolia#flights"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Олон улсын нислэг
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/getting-to-mongolia#airport"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Нисэх буудал
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/getting-to-mongolia#railway"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Төмөр зам
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/getting-to-mongolia#borders"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Хилээр нэвтрэх
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* 03. МОНГОЛ ДОТОР АЯЛАХ */}
                    <div className="space-y-3">
                      <Link href="/plan/getting-around" onClick={closeMenu}>
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          03. МОНГОЛ ДОТОР АЯЛАХ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Getting Around Mongolia
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li>
                          <Link
                            href="/plan/getting-around#car"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Автомашин
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/getting-around#bus"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Автобус
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/getting-around#flights"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Орон нутгийн нислэг
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/getting-around#train"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Галт тэрэг
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/getting-around#rental"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Машин түрээс
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/getting-around#distance"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Зай, маршрут, хугацаа
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* 04. БАЙРЛАХ ГАЗАР */}
                    <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                      <Link href="/plan/accommodation" onClick={closeMenu}>
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          04. БАЙРЛАХ ГАЗАР
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Accommodation
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li>
                          <Link
                            href="/plan/accommodation#hotels"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Зочид буудал
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/accommodation#resorts"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Жуулчны бааз
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/accommodation#ger-camp"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Ger camp
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/accommodation#hostels"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Guesthouse / Hostel
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/accommodation#nomad"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Малчин айлын байр
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* 05. АЯЛЛЫН ҮЙЛЧИЛГЭЭ */}
                    <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                      <Link href="/plan/services" onClick={closeMenu}>
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          05. АЯЛЛЫН ҮЙЛЧИЛГЭЭ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Travel Services
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li>
                          <Link
                            href="/plan/services#companies"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Аяллын компани
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/services#guides"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Хөтөч
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/services#drivers"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Жолооч
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/services#local"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Орон нутгийн үйлчилгээ
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* 06. АЮУЛГҮЙ БАЙДАЛ, ХЭРЭГТЭЙ МЭДЭЭЛЭЛ */}
                    <div className="pt-4 space-y-3 border-t border-neutral-100 lg:border-t-0">
                      <Link href="/plan/safety-info" onClick={closeMenu}>
                        <h4 className="text-xs font-black tracking-wider text-[#15803d] uppercase transition-colors hover:text-emerald-950">
                          06. АЮУЛГҮЙ БАЙДАЛ, МЭДЭЭЛЭЛ
                        </h4>
                        <span className="block text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                          Safety & Useful Info
                        </span>
                      </Link>
                      <ul className="space-y-2 text-sm font-normal text-neutral-700">
                        <li>
                          <Link
                            href="/plan/safety-info#safety"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Safety
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/safety-info#laws"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Орон нутгийн хууль, дүрэм
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/safety-info#etiquette"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Аялагчийн ёс зүй
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/safety-info#health"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Эрүүл мэндийн мэдээлэл
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/safety-info#emergency"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            Emergency
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/plan/safety-info#faq"
                            onClick={closeMenu}
                            className="block hover:text-[#15803d] transition-colors"
                          >
                            FAQ
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* 07. АЯЛЛЫН ИНТЕРАКТИВ ТӨЛӨВЛӨГЧ КАРТ */}
                  <div className="flex flex-col shrink-0 justify-between p-6 w-full bg-[#f8f7f4] rounded-3xl border border-neutral-200 shadow-sm xl:w-[320px]">
                    <div>
                      <div className="flex gap-2 items-center mb-2">
                        <span className="font-mono text-[10px] font-bold tracking-widest text-[#15803d] uppercase">
                          07. ХЭРЭГСЭЛ
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="font-mono text-[10px] text-neutral-400 uppercase">
                          C08 TOOL
                        </span>
                      </div>
                      <h4 className="mb-2 text-lg font-black leading-snug text-neutral-900">
                        Аяллын интерактив төлөвлөгч
                      </h4>
                      <p className="mb-6 text-xs font-normal leading-relaxed text-neutral-600">
                        Газраа сонгож, өдрөөр хуваарилан, газрын зураг дээр
                        маршрут болон зайгаа автоматаар тооцоолон төлөвлөөрэй.
                      </p>

                      <div className="py-4 mb-6 space-y-2 text-xs font-medium text-neutral-600 border-y border-neutral-200/60">
                        <div className="flex gap-2 items-center">
                          ✓ Газар хайх & хадгалах
                        </div>
                        <div className="flex gap-2 items-center">
                          ✓ Зай, хугацааны автомат тооцоо
                        </div>
                        <div className="flex gap-2 items-center">
                          ✓ Маршрут экспортлох & хуваалцах
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/planner"
                      onClick={closeMenu}
                      className="flex gap-2 justify-center items-center py-3 px-5 w-full text-xs font-black text-center text-white bg-[#15803d] rounded-2xl shadow-sm transition-all hover:bg-emerald-950"
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

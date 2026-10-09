'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  PLAN_SECTION_ID,
  liveHref,
  type NavItem,
  type NavSection,
} from '@/lib/navigation';
import { navText, type NavStringKey } from '@/lib/navStrings';

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

// Цэс hero бичлэг дээр тунгалаг давхарлагддаг хуудсууд. Hero элемент нь data-nav-overlay
// атрибуттай; түүнийг өнгөрөх хүртэл цэс тунгалаг, дараа нь цагаан болно.
const OVERLAY_PATHS = ['/'];

const GREEN = 'text-[#15803d]';

// "Бүгдийг үзэх →": дэд цэсний өөрийн хуудас руу. planned зүйлд холбоос өгөхгүй.
function ViewAllLink({
  item,
  label,
  onClick,
  className,
}: {
  item: NavItem;
  label: React.ReactNode;
  onClick: () => void;
  className: string;
}) {
  if (item.status === 'planned') return null;
  const content = (
    <>
      {label}
      <span aria-hidden="true"> →</span>
    </>
  );
  if (!item.href.startsWith('/')) {
    return (
      <a
        href={item.href}
        onClick={onClick}
        className={className}
        {...(item.external ? { target: '_blank', rel: 'noopener' } : {})}
      >
        {content}
      </a>
    );
  }
  return (
    <Link href={item.href} onClick={onClick} className={className}>
      {content}
    </Link>
  );
}

function Chevron({ open, className = '' }: { open: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// Цэсний бүтэц lib/navigation.ts-д байна. Layout нь production/preview-ийн дагуу шүүгээд
// дамжуулна. Бүх холбоос (компьютерийн самбар, утасны цэс) серверийн HTML-д <a href>
// хэлбэрээр гарна, хаалттай үед зөвхөн CSS-ээр нуугдана, ингэснээр Google цэсийг уншина.
export default function Navbar({ sections }: { sections: NavSection[] }) {
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState('mn');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [mobileItem, setMobileItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  // Гараар (Enter/Space) нээсэн бол самбарын эхний холбоос руу focus шилжүүлнэ
  const focusPanelRef = useRef(false);

  const overlayPage = OVERLAY_PATHS.includes(pathname);
  // Компьютерийн дээд цэс: "Төлөвлөх & захиалах"-аас бусад хэсэг (тэр нь газрын зургийн icon)
  const desktopSections = sections.filter((s) => s.id !== PLAN_SECTION_ID);
  const planSection = sections.find((s) => s.id === PLAN_SECTION_ID);
  const planHref = liveHref(
    planSection?.items.find((i) => i.status !== 'planned' && i.href.startsWith('/'))?.href
  );

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

  // Hero-г өнгөрсөн эсэх: hero-гийн доод ирмэг цэсний доод ирмэгээс дээш гарвал цэс цагаан болно
  useEffect(() => {
    if (!overlayPage) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const hero = document.querySelector('[data-nav-overlay]');
      const navBottom = headerRef.current?.offsetHeight ?? 80;
      setPastHero(!hero || hero.getBoundingClientRect().bottom <= navBottom);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [overlayPage, pathname]);

  const closeMenu = useCallback(() => {
    setActiveMenu(null);
    setIsMobileOpen(false);
  }, []);

  // Хуудас солигдоход бүх цэсийг хаана
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // Самбар нээгдсэний дараа гараар нээсэн бол эхний холбоос руу focus
  useEffect(() => {
    if (!activeMenu || !focusPanelRef.current) return;
    focusPanelRef.current = false;
    panelRef.current
      ?.querySelector<HTMLElement>(`#nav-panel-${activeMenu} a, #nav-panel-${activeMenu} button`)
      ?.focus();
  }, [activeMenu]);

  // Esc дарах эсвэл цэсний гадна дарахад хаана. Esc-ийн дараа focus нээсэн товч руугаа буцна.
  useEffect(() => {
    if (!activeMenu && !isMobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (activeMenu) triggerRefs.current[activeMenu]?.focus();
      else burgerRef.current?.focus();
      closeMenu();
    };
    const onPointer = (e: MouseEvent) => {
      if (headerRef.current?.contains(e.target as Node)) return;
      closeMenu();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [activeMenu, isMobileOpen, closeMenu]);

  // Утасны бүтэн дэлгэцийн цэс нээлттэй үед ар талын хуудас гүйлгэгдэхгүй
  useEffect(() => {
    if (!isMobileOpen) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [isMobileOpen]);

  // Tab-аар цэсээс бүр гарвал (focus header-ээс гадна шилжвэл) самбарыг хаана
  const handleBlur = (e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (activeMenu && next && !headerRef.current?.contains(next)) setActiveMenu(null);
  };

  const toggleSection = (id: string, e: React.MouseEvent) => {
    if (activeMenu === id) {
      setActiveMenu(null);
      return;
    }
    // detail === 0: гарын Enter/Space-ээр дарсан
    focusPanelRef.current = e.detail === 0;
    setActiveMenu(id);
  };

  const closePanel = () => {
    if (activeMenu) triggerRefs.current[activeMenu]?.focus();
    setActiveMenu(null);
  };

  const currentLang =
    LANGUAGES.find((l) => l.code === selectedLang) || LANGUAGES[0];

  // Англи хэл сонгосон үед цэсний англи нэрийг харуулж, Google Translate-ийг түүнд хүргэхгүй
  const isEnglish = selectedLang === 'en';
  const labelOf = (x: { mn: string; en: string }) => (isEnglish ? x.en : x.mn);
  const text = (key: NavStringKey) => navText(selectedLang, key);
  const labelProps: { translate?: 'no'; className?: string } = isEnglish
    ? { translate: 'no', className: 'notranslate' }
    : {};
  const label = (x: { mn: string; en: string }, className = '') => (
    <span
      {...labelProps}
      className={`${className} ${labelProps.className || ''}`.trim() || undefined}
    >
      {labelOf(x)}
    </span>
  );
  const textLabel = (key: NavStringKey) => <span {...labelProps}>{text(key)}</span>;

  // Hero дээр (самбар, утасны цэс хаалттай үед) тунгалаг дэвсгэр, цагаан бичиг
  const onHero = overlayPage && !pastHero && !activeMenu && !isMobileOpen;
  const iconBtn = `flex justify-center items-center w-10 h-10 rounded-full outline-none transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-current ${
    onHero ? 'text-white hover:bg-white/15' : 'text-gray-800 hover:bg-gray-100'
  }`;

  return (
    <>
      <header
        ref={headerRef}
        onBlur={handleBlur}
        className={`top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300 ${
          overlayPage ? 'fixed inset-x-0' : 'sticky'
        } ${
          onHero
            ? 'bg-transparent border-b border-transparent'
            : 'bg-white border-b border-gray-100 shadow-sm'
        }`}
      >
        <div className="flex gap-4 justify-between items-center px-4 mx-auto max-w-7xl h-(--nav-h) sm:px-10 min-[1200px]:px-6">
          {/* 1. LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex gap-1 items-center shrink-0"
          >
            {/* notranslate: Google Translate <font>-оор ороож цэгийг дараагийн мөр рүү унагаахаас сэргийлнэ */}
            <span
              translate="no"
              className={`notranslate whitespace-nowrap text-2xl font-black tracking-tight transition-colors duration-300 sm:text-3xl ${
                onHero ? 'text-white' : 'text-gray-900'
              }`}
            >
              Mongolia<span className={onHero ? 'text-white' : GREEN}>.</span>
            </span>
          </Link>

          {/* 2. ҮНДСЭН ЦЭС. Нэр дээр ДАРАХАД доор бүтэн өргөнтэй самбар нээгдэнэ */}
          <nav
            aria-label={text('mainNav')}
            className="hidden gap-7 items-center h-full min-[1200px]:flex"
          >
            {desktopSections.map((section) => {
              const isActive = activeMenu === section.id;
              return (
                <button
                  key={section.id}
                  ref={(el) => {
                    triggerRefs.current[section.id] = el;
                  }}
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={`nav-panel-${section.id}`}
                  onClick={(e) => toggleSection(section.id, e)}
                  className={`relative flex gap-1.5 items-center h-full whitespace-nowrap text-[15px] font-semibold rounded-md outline-none transition-colors duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#15803d] after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-t after:bg-[#15803d] after:transition-opacity ${
                    isActive ? 'after:opacity-100' : 'after:opacity-0'
                  } ${
                    onHero
                      ? 'text-white hover:text-white/80'
                      : isActive
                        ? GREEN
                        : 'text-gray-800 hover:text-black'
                  }`}
                >
                  {label(section)}
                  <Chevron open={isActive} className={onHero ? 'text-white/80' : isActive ? GREEN : 'text-gray-400'} />
                </button>
              );
            })}
          </nav>

          {/* 3. БАРУУН ТАЛ: ХАЙЛТ, ТӨЛӨВЛӨХ & ЗАХИАЛАХ, ХЭЛ, УТАСНЫ ЦЭС */}
          <div className="flex gap-1 items-center shrink-0 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              aria-label={text('search')}
              title={text('search')}
              className={iconBtn}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Төлөвлөх & захиалах: дээд цэсний оронд газрын зургийн icon */}
            {planHref && (
              <Link
                href={planHref}
                onClick={closeMenu}
                aria-label={text('planBook')}
                title={text('planBook')}
                className={iconBtn}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0113 0c0 5.4-6.5 11-6.5 11z" />
                  <circle cx="12" cy="10" r="2.5" strokeWidth={2} />
                </svg>
              </Link>
            )}

            {/* ХЭЛ СОНГОГЧ */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                aria-expanded={isLangOpen}
                aria-label={text('language')}
                className={`flex gap-1.5 items-center py-1.5 px-3 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                  onHero
                    ? 'text-white bg-white/15 hover:bg-white/25'
                    : 'text-gray-800 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className={`font-black ${onHero ? 'text-white' : GREEN}`}>
                  {currentLang.label}
                </span>
                <Chevron open={isLangOpen} className={onHero ? 'text-white/80' : 'text-gray-500'} />
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

            {/* ☰ Нарийн дэлгэц (< 1200px) дээр бүтэн дэлгэцийн цэс */}
            <button
              ref={burgerRef}
              type="button"
              onClick={() => (isMobileOpen ? closeMenu() : setIsMobileOpen(true))}
              aria-label={isMobileOpen ? text('closeMenu') : text('openMenu')}
              aria-expanded={isMobileOpen}
              aria-controls="nav-mobile"
              className={`${iconBtn} min-[1200px]:hidden`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* 4. КОМПЬЮТЕРИЙН САМБАР. Дэд цэс бүр нэг багана, багтахгүй бол дараагийн мөрөнд.
            Хаалттай үед ч HTML-д байна, зөвхөн CSS-ээр нуугдана (SEO). */}
        <div
          ref={panelRef}
          className={`overflow-y-auto absolute inset-x-0 top-full max-h-[calc(100svh-var(--nav-h))] bg-[#f3f3f3] border-t border-gray-200 shadow-xl max-[1199px]:hidden ${
            activeMenu ? '' : 'hidden'
          }`}
        >
          <div className="relative py-12 px-6 mx-auto max-w-7xl sm:px-10">
            <button
              type="button"
              onClick={closePanel}
              aria-label={text('closePanel')}
              title={text('closePanel')}
              className="flex absolute top-4 right-4 justify-center items-center w-10 h-10 text-gray-700 hover:text-black hover:bg-black/5 rounded-full transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {desktopSections.map((section) => (
              <div
                key={section.id}
                id={`nav-panel-${section.id}`}
                role="region"
                aria-label={labelOf(section)}
                className={activeMenu === section.id ? '' : 'hidden'}
              >
                <ul className="flex flex-wrap gap-x-8 gap-y-12 pr-10">
                  {section.items.map((item) => (
                    <li
                      key={`${item.href}-${item.mn}`}
                      className="flex flex-col flex-1 min-w-[9.5rem] max-w-[18rem]"
                    >
                      <NavItemLink
                        item={item}
                        english={isEnglish}
                        onClick={closeMenu}
                        className="block text-[24px] font-bold leading-tight text-gray-900 hover:text-[#15803d] transition-colors xl:text-[26px]"
                        badgeClassName="inline-block ml-2 py-0.5 px-2 align-middle text-[10px] font-bold rounded-full"
                      >
                        {label(item)}
                      </NavItemLink>
                      {item.children && item.children.length > 0 && (
                        <ul className="mt-4 space-y-2.5">
                          {item.children.map((child) => (
                            <li key={`${child.href}-${child.mn}`}>
                              <NavItemLink
                                item={child}
                                english={isEnglish}
                                onClick={closeMenu}
                                className="group flex gap-2 items-baseline text-base leading-snug text-gray-600 hover:text-gray-900 transition-colors"
                                badgeClassName="ml-1 py-0.5 px-1.5 text-[10px] font-bold rounded-full"
                              >
                                <span aria-hidden="true" className={`font-bold ${GREEN}`}>›</span>
                                {label(child, 'group-hover:underline')}
                              </NavItemLink>
                            </li>
                          ))}
                        </ul>
                      )}
                      <ViewAllLink
                        item={item}
                        label={textLabel('viewAll')}
                        onClick={closeMenu}
                        className={`inline-block mt-5 text-base font-bold ${GREEN} hover:underline`}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 5. УТАСНЫ БҮТЭН ДЭЛГЭЦИЙН ЦЭС. Хэсэг, дэд цэс бүр дарахад доош задарна (accordion).
            "Төлөвлөх & захиалах" энд бүтнээрээ. Хаалттай үед ч HTML-д байна (SEO). */}
        <nav
          id="nav-mobile"
          aria-label={text('mainNav')}
          className={`overflow-y-auto fixed inset-x-0 bottom-0 top-(--nav-h) bg-white border-t border-gray-100 overscroll-contain min-[1200px]:hidden ${
            isMobileOpen ? '' : 'hidden'
          }`}
        >
          <ul className="px-4 pt-2 pb-16 mx-auto max-w-3xl sm:px-10">
            {sections.map((section) => {
              const sectionOpen = mobileSection === section.id;
              return (
                <li key={section.id} className="border-b border-gray-200">
                  <button
                    type="button"
                    aria-expanded={sectionOpen}
                    aria-controls={`nav-m-${section.id}`}
                    onClick={() => setMobileSection(sectionOpen ? null : section.id)}
                    className={`flex justify-between items-center py-4 w-full text-left text-xl font-bold cursor-pointer ${
                      sectionOpen ? GREEN : 'text-gray-900'
                    }`}
                  >
                    {label(section)}
                    <Chevron open={sectionOpen} className="w-4 h-4" />
                  </button>
                  <ul id={`nav-m-${section.id}`} className={`pb-3 ${sectionOpen ? '' : 'hidden'}`}>
                    {section.items.map((item) => {
                      const key = `${section.id}:${item.href}:${item.mn}`;
                      const hasChildren = !!item.children?.length;
                      const itemOpen = mobileItem === key;
                      const id = `nav-m-${section.id}-${section.items.indexOf(item)}`;
                      return (
                        <li key={key}>
                          {hasChildren ? (
                            <button
                              type="button"
                              aria-expanded={itemOpen}
                              aria-controls={id}
                              onClick={() => setMobileItem(itemOpen ? null : key)}
                              className="flex justify-between items-center py-2.5 pl-3 w-full text-left text-[17px] font-semibold text-gray-800 cursor-pointer"
                            >
                              {label(item)}
                              <Chevron open={itemOpen} className="text-gray-400" />
                            </button>
                          ) : (
                            <NavItemLink
                              item={item}
                              english={isEnglish}
                              onClick={closeMenu}
                              className="block py-2.5 pl-3 text-[17px] font-semibold text-gray-800"
                              badgeClassName="ml-2 py-0.5 px-1.5 text-[10px] font-bold rounded-full"
                            >
                              {label(item)}
                            </NavItemLink>
                          )}
                          {hasChildren && (
                            <ul
                              id={id}
                              className={`py-3 pr-3 pl-6 mb-1 space-y-2 bg-[#f3f3f3] rounded-xl ${itemOpen ? '' : 'hidden'}`}
                            >
                              {item.children!.map((child) => (
                                <li key={`${child.href}-${child.mn}`}>
                                  <NavItemLink
                                    item={child}
                                    english={isEnglish}
                                    onClick={closeMenu}
                                    className="flex gap-2 items-baseline py-1 text-base text-gray-600"
                                    badgeClassName="ml-1 py-0.5 px-1.5 text-[10px] font-bold rounded-full"
                                  >
                                    <span aria-hidden="true" className={`font-bold ${GREEN}`}>›</span>
                                    {label(child)}
                                  </NavItemLink>
                                </li>
                              ))}
                              <li>
                                <ViewAllLink
                                  item={item}
                                  label={textLabel('viewAll')}
                                  onClick={closeMenu}
                                  className={`inline-block pt-1 text-base font-bold ${GREEN}`}
                                />
                              </li>
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Самбар нээлттэй үед ард талыг бүдэгрүүлнэ, дарахад хаагдана (header-ээс гадна дарсан тул) */}
      {activeMenu && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/25 max-[1199px]:hidden"
        />
      )}

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

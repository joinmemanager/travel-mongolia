'use client';

import { useLanguage } from './LanguageContext';

export default function HeroText() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 px-6 mx-auto max-w-4xl text-white">
      <span className="block mb-4 text-[11px] font-semibold tracking-[0.25em] text-gold uppercase sm:text-xs">
        {t.heroTag}
      </span>
      <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.05] text-white drop-shadow-xl sm:text-7xl">
        {t.heroTitle}
      </h1>
      <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-white/95 drop-shadow sm:text-xl">
        {t.heroDesc}
      </p>
    </div>
  );
}

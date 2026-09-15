'use client';

import { useLanguage } from './LanguageContext';

export default function HeroText() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 px-6 max-w-4xl mx-auto text-white">
      <span className="text-xs sm:text-sm uppercase tracking-[0.3em] font-bold text-white/90 drop-shadow mb-4 block">
        {t.heroTag}
      </span>
      <h1 className="text-4xl sm:text-7xl font-black tracking-tight mb-6 drop-shadow-xl text-white">
        {t.heroTitle}
      </h1>
      <p className="text-base sm:text-xl text-white/95 font-light max-w-2xl mx-auto drop-shadow leading-relaxed">
        {t.heroDesc}
      </p>
    </div>
  );
}
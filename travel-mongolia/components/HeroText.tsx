'use client';

import { useLanguage } from './LanguageContext';

export default function HeroText() {
  const { t } = useLanguage();

  return (
    <div className="relative z-10 px-6 mx-auto max-w-4xl text-white">
      <span className="block mb-4 text-xs font-bold tracking-[0.3em] text-white/90 uppercase drop-shadow sm:text-sm">
        {t.heroTag}
      </span>
      <h1 className="mb-6 text-4xl font-black tracking-tight text-white drop-shadow-xl sm:text-7xl">
        {t.heroTitle}
      </h1>
      <p className="mx-auto max-w-2xl text-base font-light leading-relaxed text-white/95 drop-shadow sm:text-xl">
        {t.heroDesc}
      </p>
    </div>
  );
}

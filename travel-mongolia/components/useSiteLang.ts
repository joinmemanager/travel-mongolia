'use client';

import { useEffect, useState } from 'react';

import { splitLocalePath } from '@/lib/i18n/locales';

// Сайтын хэл: орчуулсан хуудсанд (/en/…, /zh/… — lib/i18n/locales.ts) URL-ийн хэл, бусад үед Google Translate-ийн
// googtrans cookie-нээс сонгосон хэл (анхдагч: 'mn'). Монгол хуудсанд (угтваргүй URL) өмнөх шигээ зөвхөн cookie.
export function readSiteLang(): string {
  const fromUrl = splitLocalePath(window.location.pathname).code;
  if (fromUrl !== 'mn') return fromUrl;
  const match = document.cookie.match(/googtrans=\/mn\/([a-zA-Z-]+)/);
  return match?.[1] || 'mn';
}

export function useSiteLang(): string {
  const [lang, setLang] = useState('mn');
  useEffect(() => {
    setLang(readSiteLang());
  }, []);
  return lang;
}

'use client';

import { useEffect, useState } from 'react';

// Google Translate-ийн googtrans cookie-нээс сонгосон хэлийг уншина (анхдагч: 'mn')
export function readSiteLang(): string {
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

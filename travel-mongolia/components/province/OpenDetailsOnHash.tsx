'use client';

import { useEffect } from 'react';

// /province/<аймаг>#<сум> хаягаар орж ирэхэд тухайн сумын хаалттай <details>-ийг нээж, тэнд гүйлгэнэ
// (богино сумын хуучин хаяг /province/<аймаг>/<сум> энд redirect хийдэг).
export default function OpenDetailsOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement && !el.open) {
        el.open = true;
        el.scrollIntoView({ block: 'start' });
      }
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);
  return null;
}

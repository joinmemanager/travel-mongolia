import React, { useId } from 'react';

import { DARK_GREEN_BG, GOLD_STROKE } from './tokens';

// г. Хээтэй тууз: footer-ийн яг дээр, бараан ногоон дэвсгэр дээр алтан хээ (давтагдах
// алхан хээ маягийн геометр шугам). Footer-ийн өөрийн өнгөнд хүрэхгүй, хуудасны
// хамгийн сүүлийн элемент болж footer-ийн дээр наалдана.
export default function PatternBand() {
  const id = useId().replace(/:/g, '');
  return (
    <div aria-hidden="true" className={`py-2.5 ${DARK_GREEN_BG}`}>
      <svg className="block w-full h-4">
        <defs>
          <pattern id={`band-${id}`} width="32" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M0 13 H6 V3 H22 V13 H16 V8 H11 V13 H32"
              fill="none"
              stroke={GOLD_STROKE}
              strokeWidth="1.5"
              strokeLinejoin="miter"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#band-${id})`} />
      </svg>
    </div>
  );
}

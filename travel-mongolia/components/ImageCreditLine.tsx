import React from 'react';

import type { ImageCredit } from '@/lib/imageCredit';

// Зургийн доорх жижиг зохиогчийн тайлбар («Зураг: Нэр / Wikimedia Commons, CC BY-SA 4.0»)
export default function ImageCreditLine({
  credit,
  className = 'mt-2 text-xs text-neutral-500',
}: {
  credit?: ImageCredit;
  className?: string;
}) {
  if (!credit) return null;
  return (
    <span className={`block ${className}`}>
      {credit.href ? (
        <a href={credit.href} target="_blank" rel="noreferrer" className="underline decoration-dotted underline-offset-2 hover:decoration-solid">
          {credit.text}
        </a>
      ) : (
        credit.text
      )}
    </span>
  );
}

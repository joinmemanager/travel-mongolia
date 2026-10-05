import React, { useId } from 'react';

// "Монгол сэтгүүл"-ийн чамин хэсэг: өлзий хээ маягийн, өөрсдөө зурсан энгийн геометрийн
// SVG гоёл. Хоёр газар л хэрэглэнэ (docs/plan/design-brief.md):
//   OrnamentRule - хэсгийн гарчгийн доорх нимгэн зураас
//   OrnamentBand - footer-ийн дээд талын тууз

// Өлзий хээ маягийн жижиг хээ: эргүүлсэн дөрвөлжин, дотроо огтлолцсон шугам
function Knot({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M12 2 L22 12 L12 22 L2 12 Z" />
        <path d="M12 6.5 L17.5 12 L12 17.5 L6.5 12 Z" />
        <path d="M7 7 L17 17 M17 7 L7 17" />
      </g>
    </svg>
  );
}

export function OrnamentRule({
  align = 'left',
  className = '',
}: {
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`flex gap-3 items-center text-gold ${
        align === 'center' ? 'justify-center mx-auto' : ''
      } ${className}`}
    >
      {align === 'center' && <span className="w-12 h-px bg-gold/60" />}
      <Knot className="w-4 h-4" />
      <span className="w-12 h-px bg-gold/60" />
    </div>
  );
}

// Давтагдах алхан хээ (дөрвөлжин тахир шугам) бүхий нарийн тууз
export function OrnamentBand({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg aria-hidden="true" className={`block w-full h-3.5 text-gold ${className}`}>
      <defs>
        <pattern id={`band-${id}`} width="28" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M0 11 H5 V3 H19 V11 H14 V7 H10 V11 H28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinejoin="miter"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#band-${id})`} opacity="0.7" />
    </svg>
  );
}

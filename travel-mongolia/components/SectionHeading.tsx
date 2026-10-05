import React from 'react';

import { OrnamentRule } from './Ornament';

// "Монгол сэтгүүл" хэсгийн гарчиг: жижиг eyebrow шошго, serif гарчиг, доор нь хээтэй зураас
export default function SectionHeading({
  eyebrow,
  title,
  as: Tag = 'h2',
  tone = 'light',
  align = 'left',
  className = '',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  as?: 'h2' | 'h3';
  tone?: 'light' | 'dark';
  align?: 'left' | 'center';
  className?: string;
}) {
  const dark = tone === 'dark';
  return (
    <div className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <p
          className={`mb-3 text-[11px] font-semibold tracking-[0.25em] uppercase ${
            dark ? 'text-gold' : 'text-gold-ink'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        className={`font-serif text-3xl font-bold leading-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-ink'
        }`}
      >
        {title}
      </Tag>
      <OrnamentRule align={align} className="mt-4" />
    </div>
  );
}

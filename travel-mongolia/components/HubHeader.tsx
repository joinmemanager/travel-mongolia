import React from 'react';

import Breadcrumbs, { type Crumb } from './Breadcrumbs';

// Hub хуудсуудын толгой хэсэг (/plan/*, GuidePage-ийн загвартай ижил): замчлал, шошго, H1
export default function HubHeader({
  crumbs,
  kicker,
  kickerEn,
  title,
  intro,
  children,
}: {
  crumbs?: Crumb[];
  kicker: string;
  kickerEn: string;
  title: string;
  intro: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="border-b border-neutral-200 bg-white pt-12 pb-12 px-6 sm:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {crumbs && crumbs.length > 0 && <Breadcrumbs items={crumbs} />}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-[#15803d] uppercase">
            {kicker}
          </span>
          <span className="text-neutral-300">•</span>
          <span className="text-[11px] font-mono text-neutral-500 uppercase">{kickerEn}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 mb-4">
          {title}
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 max-w-2xl font-normal leading-relaxed">
          {intro}
        </p>
        {children}
      </div>
    </header>
  );
}

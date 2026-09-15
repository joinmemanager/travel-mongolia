import React from 'react';
import ExperienceShowcase from '@/components/ExperienceShowcase';

interface Props {
  searchParams: Promise<{ section?: string }>;
}

export default async function FestivalsPage({ searchParams }: Props) {
  const { section } = await searchParams;
  return (
    <main className="min-h-screen bg-white">
      <ExperienceShowcase groupKey="festivals" subSlug={section} />
    </main>
  );
}
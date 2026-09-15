import React from 'react';
import RegionDirectory from '@/components/RegionDirectory';

interface Props {
  searchParams: Promise<{ region?: string }>;
}

export default async function RegionPage({ searchParams }: Props) {
  const { region } = await searchParams;
  return (
    <main className="min-h-screen bg-white">
      <RegionDirectory initialSubSlug={region} />
    </main>
  );
}
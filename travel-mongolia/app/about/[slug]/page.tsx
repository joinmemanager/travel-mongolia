export const dynamic = 'force-dynamic';

import React from 'react';
import AboutShowcase from '../../components/AboutShowcase';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function AboutPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-white">
  <AboutShowcase defaultSlug={slug} />
</main>
  );
}
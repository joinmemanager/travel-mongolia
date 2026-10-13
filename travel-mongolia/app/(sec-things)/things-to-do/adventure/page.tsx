'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { ADVENTURE_CATEGORIES, ADVENTURE_SPOTS } from '@/lib/adventureData';

export default function AdventurePage() {
  return (
    <CategoryListing
      embedded
      intro="Монголын онгон дагшин уулсаар трек хийх, уудам тал нутгаар морьтой аялах, говийн элсэн манхнаар 4x4 туулах хязгааргүй адал явдлууд."
      categories={ADVENTURE_CATEGORIES}
      spots={ADVENTURE_SPOTS}
      countLabel="адал явдал олдлоо"
      badge={(spot) => [spot.season, spot.difficulty]}
    />
  );
}

'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { ADVENTURE_CATEGORIES, ADVENTURE_SPOTS } from '@/lib/adventureData';

export default function AdventurePage() {
  return (
    <CategoryListing
      hero={{
        src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80',
        alt: 'Adventure Background',
      }}
      kicker="02. ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Адал явдал, идэвхтэй аялал"
      intro="Монголын онгон дагшин уулсаар трек хийх, уудам тал нутгаар морьтой аялах, говийн элсэн манхнаар 4x4 туулах хязгааргүй адал явдлууд."
      categories={ADVENTURE_CATEGORIES}
      spots={ADVENTURE_SPOTS}
      countLabel="адал явдал олдлоо"
      badge={(spot) => [spot.season, spot.difficulty]}
    />
  );
}

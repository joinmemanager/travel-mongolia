'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { NOMADIC_CATEGORIES, NOMADIC_SPOTS } from '@/lib/nomadicData';

export default function NomadicPage() {
  return (
    <CategoryListing
      hero={{
        src: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1800&q=80',
        alt: 'Nomadic Background',
      }}
      kicker="03. ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Нүүдэлчин ахуйг мэдрэх"
      intro="Мянга мянган жилийн турш өөрчлөгдөөгүй нүүдэлчин ахуй соёл, малчин түмний халуун зочломтгой зан, эсгий гэрийн амьдралыг биеэр мэдрэх аяллууд."
      categories={NOMADIC_CATEGORIES}
      spots={NOMADIC_SPOTS}
      countLabel="туршлага олдлоо"
      badge={(spot) => [spot.season]}
    />
  );
}

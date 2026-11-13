'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { NOMADIC_CATEGORIES, NOMADIC_SPOTS } from '@/lib/nomadicData';

export default function NomadicPage() {
  return (
    <CategoryListing
      embedded
      intro="Мянга мянган жилийн турш өөрчлөгдөөгүй нүүдэлчин ахуй соёл, малчин түмний халуун зочломтгой зан, эсгий гэрийн амьдралыг биеэр мэдрэх аяллууд."
      categories={NOMADIC_CATEGORIES}
      spots={NOMADIC_SPOTS}
      countLabel="туршлага олдлоо"
      badge={(spot) => [spot.season]}
    />
  );
}

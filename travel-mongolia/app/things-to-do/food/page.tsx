'use client';

import CategoryListing from '@/components/templates/CategoryListing';
import { FOOD_CATEGORIES, FOOD_SPOTS } from '@/lib/foodData';

export default function FoodPage() {
  return (
    <CategoryListing
      hero={{
        src: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&q=80',
        alt: 'Food Background',
      }}
      kicker="06. ҮЗЭХ, ХИЙХ ЗҮЙЛС"
      title="Хоол, ундааны туршлага"
      intro="Нүүдэлчдийн шим тэжээлт мах, сүүн идээ, уламжлалт хорхог, шимийн айраг болон нутаг нутгийн давтагдашгүй амтыг мэдрэх аяллууд."
      categories={FOOD_CATEGORIES}
      spots={FOOD_SPOTS}
      countLabel="амталгаа, хоолны туршлага олдлоо"
      badge={(spot) => [spot.specialty]}
    />
  );
}
